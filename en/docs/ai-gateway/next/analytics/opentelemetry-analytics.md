---
title: "OpenTelemetry Analytics"
description: "Export API Platform AI Gateway analytics events as OTLP log records to an OpenTelemetry Collector or any OTLP-compatible backend, including LLM token usage and cost."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/analytics/opentelemetry-analytics/
md_url: https://wso2.com/api-platform/docs/ai-gateway/analytics/opentelemetry-analytics.md
tags:
  - ai-gateway
  - analytics
  - opentelemetry
  - otlp
  - observability
  - spend
  - cost-tracking
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-12
content_type: "how-to"
---

{% raw %}
# OpenTelemetry Analytics

## Overview

The OpenTelemetry publisher exports every analytics event as an **OTLP log record** over OTLP/HTTP, so
API analytics land in whatever observability stack you already run, whether that is an OpenTelemetry
Collector or a vendor's OTLP intake, instead of a single fixed SaaS.

It is one of the publishers named in `analytics.enabled_publishers`, alongside `moesif`. Publishers are
**additive and independent**: `enabled_publishers = ["moesif", "otel"]` delivers every event to both,
and neither can fail the other.

The logs signal is used rather than metrics or traces because it is the only one that carries a whole
transaction with its attributes intact. Metrics aggregate the transaction away, and traces impose a
sampling model that would silently discard billing-relevant events.

!!! note
    Analytics is a **consumer** of a shared data-capture pipeline called the **collector**. The collector
    has no `enabled` flag of its own. It activates automatically whenever `analytics.enabled` (or
    `traffic_logging.enabled`) is `true`. See [Log requests and responses](../logging-and-tracing/log-requests-and-responses.md) for
    the other consumer of the same pipeline.

## How it works

```text
Envoy access log ──ALS──► collector ──► analytics event ──┬──► moesif publisher
                                                          └──► otel publisher
                                                                 │
                                                    bounded queue │ batched, gzip-optional
                                                                 ▼
                                                       POST /v1/logs (OTLP/HTTP, JSON)
                                                                 │
                                              OpenTelemetry Collector or vendor OTLP intake
```

Two properties hold, the same as for Traffic Logging:

* **Nothing in the export path is on the request/response path.** Events are produced from Envoy's
  access-log stream, which Envoy emits *after* the response reached the client. A slow or unreachable
  OTLP endpoint cannot add latency to an API call or fail one.
* **Construction fails closed; delivery fails open.** A bad endpoint, an unusable CA bundle or a
  mismatched key pair is a **startup error**. Once running, a delivery failure drops records and
  increments a counter. It never blocks traffic.

Every record is emitted under the InstrumentationScope **`wso2.analytics`** with
`event.name = wso2.api.transaction`, so a collector can route API analytics away from application logs
with a single scope match.

## Quick start

Point the gateway at a collector on the pod network:

```toml
[collector]
request_headers = true
response_headers = true

[analytics]
enabled = true
enabled_publishers = ["otel"]

[analytics.publishers.otel]
endpoint = "http://otel-collector:4318/v1/logs"
allow_insecure_transport = true   # required for a plaintext http:// endpoint
service_name = "gateway-runtime"
```

A matching minimal collector pipeline:

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318

exporters:
  debug:
    verbosity: detailed

service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [debug]
```

!!! warning
    A collector without a **`logs`** pipeline accepts the connection and silently discards every record.
    If exports succeed but nothing appears downstream, check this first, since it is by far the most common
    cause.

## Configuration reference

### `[collector]`

Header and body capture is shared with Traffic Logging and is **off by default**. Enable only what you
need downstream.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `request_body` | boolean | `false` | Capture the request body and attach it to exported records. |
| `response_body` | boolean | `false` | Capture the response body and attach it to exported records. |
| `request_headers` | boolean | `false` | Capture request headers. |
| `response_headers` | boolean | `false` | Capture response headers. |
| `ignore_path_prefixes` | array of strings | `[]` | Path prefixes (e.g. `/health`) for which no analytics event is produced at all. |

!!! note
    Masking is a per-consumer concern. The collector hands every publisher the same raw captured data,
    so `traffic_logging.masked_headers` does **not** apply here. Use the
    [Analytics Header Filter](analytics-header-filter.md) policy to control which headers leave the
    gateway with analytics.

### `[analytics]`

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `enabled` | boolean | Yes | `false` | Enables analytics globally, and activates the collector. |
| `enabled_publishers` | array of strings | No | `["moesif"]` | Publishers to activate. Add `"otel"` to turn this publisher on. An unknown name is a **startup error**, not a silent no-op. |

!!! warning "`enabled_publishers` is the real on-switch"
    Writing an `[analytics.publishers.otel]` block without adding `"otel"` to `enabled_publishers`
    produces a valid config that publishes nothing.

### `[analytics.publishers.otel]`

#### Endpoint and transport

| Parameter | Type | Default | Description |
|---|---|---|---|
| `endpoint` | string | n/a | **Required.** Full OTLP/HTTP logs URL, **including the `/v1/logs` path**. Redirects are never followed. |
| `allow_insecure_transport` | boolean | `false` | Permits a plaintext `http://` endpoint. Analytics records carry API keys, consumer identity and (when capture is on) bodies, so plaintext is a real disclosure. Intended for a collector on the pod network. An `http://` endpoint without this set is a **startup error**. |
| `service_name` | string | `"gateway-runtime"` | **Required.** Populates the OTLP resource's `service.name`. |
| `service_version` | string | `""` | Populates `service.version`. Useful for correlating a rollout with an analytics change. |
| `compression` | string | `"none"` | `"none"` or `"gzip"`. These records are verbose JSON; gzip trades CPU on the export worker for a large egress reduction, and every OTLP/HTTP receiver is required to support it. Worth enabling when the endpoint is across a network you pay for. |

Any scheme other than `https` (or `http` with the flag above) is rejected at startup. Credentials
embedded in the URL (`https://user:pass@host/...`) are also rejected. Use `headers` instead.

#### Batching and queueing

A batch closes on whichever bound is reached first, then a single export worker drains a bounded queue.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `batch_size` | int | `100` | Records per batch. Must be positive. |
| `flush_interval` | duration | `"5s"` | Maximum time a partial batch waits before export. Must be positive. |
| `queue_capacity` | int | `10000` | Bounded queue between the ingest path and the export worker. Must be positive and **>= `batch_size`**, because a queue smaller than a batch could never fill one, which would make every export interval-driven regardless of load. |
| `on_queue_full` | string | `"drop_new"` | What to discard once the queue is full. `drop_new` preserves the earliest view of an incident; `drop_oldest` keeps the most recent traffic. Either way the record counts as `dropped_total{reason="queue_full"}`. |

#### Timeouts and retries

| Parameter | Type | Default | Description |
|---|---|---|---|
| `timeout` | duration | `"10s"` | Bounds a single export attempt. Must be positive. |
| `max_retries` | int | `3` | Retry attempts *after* the initial one. `0` means one attempt per batch. |
| `retry_backoff` | duration | `"1s"` | Base for exponential backoff, plus full jitter so replicas recovering from a shared outage do not resynchronize into a thundering herd. Must be positive when `max_retries > 0`. |
| `retry_abort_queue_ratio` | float | `0.5` | Fraction of `queue_capacity` at which a retrying batch abandons its remaining attempts. Between `0` and `1`. See below. |

Only transport errors, `5xx` and `429` are retried. Any other `4xx` means the endpoint rejected the
payload's *shape*, which retrying can only amplify. A `429` carrying `Retry-After` uses that delay
**instead of** the computed backoff, not in addition to it.

#### Retry versus draining (`retry_abort_queue_ratio`)

One worker exports, so nothing drains the queue while a batch retries. Against an endpoint that accepts
connections but never answers, retrying to save one batch of 100 records can cost thousands of newer
ones. Before each further wait the worker checks queue depth and, at or above this threshold, abandons
the batch and returns to draining. Abandoned records count as `dropped_total{reason="backpressure"}`,
deliberately distinct from `send_failed`, so you can tell *"the endpoint is slow"* from *"the endpoint is
broken"*.

| Value | Behavior |
|---|---|
| `0` | Always abandon retries. One attempt per batch, whatever the queue looks like. |
| `0.1` | Abort once the queue is 10% full. Favors draining over saving any individual batch. |
| `0.5` | **Default.** Retry freely while the queue is shallow; stop once it starts filling. |
| `1` | Never abort early. An endpoint that accepts but never answers holds the worker for the full retry budget. |

#### `[analytics.publishers.otel.headers]`

Sent on every export request. This is how a vendor OTLP intake authenticates.

```toml
[analytics.publishers.otel.headers]
Authorization = 'Bearer {{ env "APIP_GW_OTEL_INTAKE_TOKEN" }}'
```

Header values are treated as secrets and are never written to logs.

#### `[analytics.publishers.otel.resource_attributes]`

Added to the OTLP resource alongside `service.name` / `service.version`. Use for the dimensions your
backend groups by.

```toml
[analytics.publishers.otel.resource_attributes]
"deployment.environment.name" = "prod"
"k8s.cluster.name" = "eu-west-1"
```

### Credential handling

Supply every secret through a config-interpolation token, which the policy engine resolves at load time
and never logs:

| Token | Resolves from |
|---|---|
| `{{ env "VAR_NAME" }}` | An environment variable. Inject it from a Kubernetes `Secret` via `env`/`envFrom`. |
| `{{ file "/path/to/secret" }}` | A file's contents. Mount a `Secret` as a volume. Reads are restricted to `/etc/gateway-runtime` and `/secrets/gateway-runtime` by default (override with `APIP_CONFIG_FILE_SOURCE_ALLOWLIST`). |

!!! warning "The Helm chart enforces this"
    `config.toml` renders into a **ConfigMap**, not a Secret: it is readable by anything with configmap
    read access in the namespace, stored unencrypted in etcd by default, and echoed by `helm get values`.
    The chart therefore **fails templating** if any entry under
    `analytics.publishers.otel.headers` holds a literal value, and names the offending header.

    A literal *prefix* before the token is fine (`Bearer {{ env "..." }}`), but the credential itself
    must come from a token.

    For local development only, set
    `gateway.config.analytics.publishers.otel.allow_plaintext_credentials: true` to opt out.

### TLS and mTLS

`[analytics.publishers.otel.tls]` is the **transport** layer and is independent of `headers`: the client
certificate proves *who is connecting*, the header proves *who is making the request*. Use either alone,
or both.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `ca_file` | string | `""` | PEM bundle used to verify the endpoint's certificate. Empty means the system trust store, which is correct for a vendor intake and usually wrong for an in-cluster collector fronted by a private CA. |
| `cert_file` | string | `""` | Client certificate (PEM) for mTLS. |
| `key_file` | string | `""` | Client private key (PEM) for mTLS. |
| `insecure_skip_verify` | boolean | `false` | Disables verification of the endpoint's certificate. When on, startup logs a warning naming the endpoint, because analytics records carry request metadata and, with capture enabled, bodies. |

`cert_file` and `key_file` are **both or neither**. Setting one without the other is a startup error
rather than a silently unauthenticated connection. The private key must not be group- or
world-readable. All referenced material is read and parsed at startup, so a wrong path or a mismatched
key pair fails immediately instead of at the first export.

```toml
[analytics.publishers.otel]
endpoint = "https://otlp.vendor.example.com/v1/logs"
service_name = "gateway-runtime"
compression = "gzip"

[analytics.publishers.otel.headers]
Authorization = 'Bearer {{ file "/secrets/gateway-runtime/otel-token" }}'

[analytics.publishers.otel.tls]
ca_file   = "/secrets/gateway-runtime/otel-ca.crt"
cert_file = "/secrets/gateway-runtime/otel-client.crt"
key_file  = "/secrets/gateway-runtime/otel-client.key"
```

The whole `tls` block is ignored when the endpoint is plaintext `http://`, since there is no handshake
to configure.

## What gets exported

Each record follows stable OpenTelemetry semantic conventions where they exist, and the `wso2.*`
namespace where OpenTelemetry defines nothing, chiefly API-product concepts and cost.

| Area | Attributes | When present |
|---|---|---|
| Transaction | `event.name`, `http.request.method`, `http.route`, `url.path`, `http.response.status_code`, `http.request.body.size`, `http.response.body.size` | Every record |
| Client | `client.address`, `user_agent.original` | Every record |
| API | `wso2.api.id`, `wso2.api.name`, `wso2.api.version`, `wso2.api.context`, `wso2.api.type`, `wso2.api.subtype`, `wso2.project.id` | Every record |
| Upstream | `server.address`, `server.port`, `wso2.upstream.destination`, `wso2.upstream.response.status_code`, `wso2.upstream.response.detail` | Every record |
| Latency | `wso2.latency.backend_ms`, `wso2.latency.response_ms`, `wso2.latency.request_mediation_ms`, `wso2.latency.response_mediation_ms` | Every record |
| Correlation | `wso2.correlation.id`, `wso2.response.content_type` | Every record |
| Errors | `error.type`, `wso2.error.code`, `wso2.error.message` | Failed requests only |
| Consumer | `user.id`, `user.name`, `wso2.application.id`, `wso2.application.name`, `wso2.application.owner`, `wso2.application.key_type`, `wso2.subscription.id`, `wso2.subscription.customer.id`, `wso2.subscription.plan`, `wso2.subscription.status` | Secured APIs, where the analytics system policy populates consumer identity |
| Captured headers | `http.request.header.<name>`, `http.response.header.<name>` | When `[collector]` header capture is enabled, one attribute per header |
| Payloads | `wso2.request.body`, `wso2.response.body` | When `[collector]` body capture is enabled |

!!! note
    `url.path` is the literal client-requested path and `http.route` is the route template. Query strings
    are stripped from **both**, because an API key or token in a query parameter is an ordinary pattern
    in this product and these records leave the gateway. Header capture is **not** filtered the same way,
    so use the [Analytics Header Filter](analytics-header-filter.md) policy to keep credential-bearing
    headers out of the export.

    An attribute whose value is empty is omitted from the record entirely rather than sent as an empty
    string, so the exact attribute set varies per request.

### AI traffic

LLM traffic carries everything the Moesif publisher puts in `aiMetadata` and `aiTokenUsage`, mapped
onto the GenAI semantic conventions:

| Moesif field | OTLP attribute | Notes |
|---|---|---|
| `aiMetadata.model` | `gen_ai.request.model`, `gen_ai.response.model` | Split into the requested and the answering model, which can differ. |
| `aiMetadata.vendorName` | `gen_ai.provider.name` | Normalized to the GenAI enum (`openai`, `anthropic`, `aws.bedrock`, `azure.ai.openai`, `azure.ai.inference`, `gcp.gemini`, `mistral_ai`). Omitted for a provider template outside that set. |
| `aiMetadata.vendorName` | `wso2.gen_ai.provider.template_name` | The raw template name, always present, so a custom template is still identifiable. |
| `aiMetadata.vendorVersion` | `wso2.gen_ai.provider.api_version` | |
| `aiMetadata.llmCost` | `wso2.gen_ai.cost.total` | |
| `aiTokenUsage.promptTokens` | `gen_ai.usage.input_tokens` | |
| `aiTokenUsage.completionTokens` | `gen_ai.usage.output_tokens` | `0` for operations with no completion, such as embeddings. |
| `aiTokenUsage.totalTokens` | `wso2.gen_ai.usage.total_tokens` | |

Also emitted: `gen_ai.operation.name` (`chat`, `embeddings`, and similar, derived from the route) and
`wso2.gen_ai.egress`.

### MCP traffic

MCP traffic carries every field the Moesif publisher puts in `mcpAnalytics`:

| Moesif field | OTLP attribute |
|---|---|
| `mcpAnalytics.jsonRpcMethod` | `mcp.method.name` |
| `mcpAnalytics.jsonRpcId` | `jsonrpc.request.id` |
| `mcpAnalytics.sessionId` | `mcp.session.id` |
| `mcpAnalytics.serverInfo.protocolVersion` | `mcp.protocol.version` |
| `mcpAnalytics.serverInfo.name` | `wso2.mcp.server.name` |
| `mcpAnalytics.serverInfo.version` | `wso2.mcp.server.version` |
| `mcpAnalytics.clientInfo.name` | `wso2.mcp.client.name` |
| `mcpAnalytics.clientInfo.version` | `wso2.mcp.client.version` |
| `mcpAnalytics.clientInfo.requestedProtocolVersion` | `wso2.mcp.client.requested_protocol_version` |
| `mcpAnalytics.isError` | `error.type` (set to `mcp_error`) |
| `mcpAnalytics.errorCode` | `rpc.response.status_code` (the JSON-RPC code, e.g. `-32602`) |

The invoked capability is named by kind rather than lumped into one field: `gen_ai.tool.name` for a
tool call, `gen_ai.prompt.name` for a prompt, and `mcp.resource.uri` for a resource read.

## Monitoring

The policy-engine exposes Prometheus metrics on its metrics port (`[policy_engine.metrics]`, port `9003`
by default). Every series is labeled `publisher`, so `moesif` and `otel` are separable.

| Metric | Type | Labels | Description |
|---|---|---|---|
| `policy_engine_analytics_published_total` | counter | `publisher` | Records successfully delivered. |
| `policy_engine_analytics_dropped_total` | counter | `publisher`, `reason` | Records **lost**. This is the series to alert on. |
| `policy_engine_analytics_export_errors_total` | counter | `publisher`, `code` | Export errors, by HTTP status or a short error class. |
| `policy_engine_analytics_queue_depth` | gauge | `publisher` | Records currently queued for export. |
| `policy_engine_analytics_queue_capacity` | gauge | `publisher` | Configured capacity, so an alert can compare depth as a **ratio** rather than a meaningless absolute threshold. |
| `policy_engine_analytics_export_duration_seconds` | histogram | `publisher` | Duration of a batch delivery **including retries and backoff**, since that total is what holds the worker and therefore what lets the queue fill behind it. |

`dropped_total` reasons:

| Reason | Meaning |
|---|---|
| `queue_full` | The bounded queue had no room; dropped per `on_queue_full`. |
| `send_failed` | Retries exhausted. The endpoint is failing or unreachable. |
| `backpressure` | Retries abandoned to resume draining, per `retry_abort_queue_ratio`. The endpoint is *slow*, not broken. |
| `rejected` | The endpoint returned a non-retryable `4xx`. The payload's shape was refused. |
| `serialize_failed` | The record could not be encoded. |

Counters are **materialized at zero** on startup, so a healthy gateway reports `dropped_total 0` rather
than an absent series, which would leave a dashboard reading "No data" and make "nothing was dropped"
indistinguishable from "the metrics path is broken".

```promql
# Are we losing analytics records at all?
sum by (publisher, reason) (rate(policy_engine_analytics_dropped_total[5m])) > 0

# Queue pressure as a fraction of capacity (alert above ~0.5)
sum by (publisher) (policy_engine_analytics_queue_depth)
  / sum by (publisher) (policy_engine_analytics_queue_capacity)

# Delivery success ratio, OTel only
sum(rate(policy_engine_analytics_published_total{publisher="otel"}[5m]))
  / (sum(rate(policy_engine_analytics_published_total{publisher="otel"}[5m]))
     + sum(rate(policy_engine_analytics_dropped_total{publisher="otel"}[5m])))
```

!!! tip
    Always use `sum by (publisher)` rather than a bare `sum()`. With two publishers enabled, one request
    produces one delivery **per publisher**, so a bare `sum()` of `published_total` reads as double the
    request rate.

## Kubernetes / Helm

The chart renders the whole publisher from `.Values.gateway.config.analytics`, including the `headers`,
`resource_attributes` and `tls` sub-tables.

```yaml
gateway:
  config:
    collector:
      request_headers: true
      response_headers: true
      ignore_path_prefixes: ["/health", "/metrics"]

    analytics:
      enabled: true
      enabled_publishers: ["otel"]
      publishers:
        otel:
          endpoint: "https://otlp.vendor.example.com/v1/logs"
          service_name: "gateway-runtime"
          service_version: "1.2.0"
          compression: "gzip"
          queue_capacity: 10000
          on_queue_full: "drop_new"
          retry_abort_queue_ratio: 0.5
          headers:
            Authorization: '{{ env "APIP_GW_OTEL_INTAKE_TOKEN" }}'
          resource_attributes:
            deployment.environment.name: "prod"
          tls:
            ca_file: /secrets/gateway-runtime/otel-ca.crt

  gatewayRuntime:
    deployment:
      extraEnv:
        - name: APIP_GW_OTEL_INTAKE_TOKEN
          valueFrom:
            secretKeyRef:
              name: otel-intake
              key: token
```

Mount the referenced secrets yourself. The chart renders the *reference*, never the value.

!!! note
    Numeric and duration keys are rendered whenever the key is **present**, including an explicit `0`,
    so a mistaken `queue_capacity: 0` reaches validation and is rejected at startup instead of being
    silently replaced by the default.

## Failure semantics and troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Pod fails to start: `endpoint uses plaintext http:// but ... allow_insecure_transport is false` | Plaintext endpoint without the opt-in. | Use `https://`, or set `allow_insecure_transport = true` for a trusted local collector. |
| Pod fails to start: `endpoint must not contain credentials in the URL` | Credentials in the URL userinfo. | Move them to `[analytics.publishers.otel.headers]`. |
| Pod fails to start: `queue_capacity ... must be >= batch_size` | Queue smaller than a batch. | Raise `queue_capacity` or lower `batch_size`. |
| Pod fails to start: unknown publisher name | A typo in `enabled_publishers`. | Correct the name. Unknown names fail closed rather than being ignored. |
| Templating fails: `holds a literal value, which would be written in plaintext into the gateway ConfigMap` | A header credential was inlined in Helm values. | Use `{{ env }}` / `{{ file }}`, per [Credential handling](#credential-handling). |
| Exports succeed, nothing arrives downstream | The collector has no `logs` pipeline. | Add one. See [Quick start](#quick-start). |
| No records at all, but requests are succeeding | `analytics.enabled` is `false`, `"otel"` is missing from `enabled_publishers`, or the path matches `collector.ignore_path_prefixes`. | Check all three. |
| Records arrive but headers/bodies are missing | The matching `[collector]` capture flag is off. | Enable it. The publisher config alone is a no-op for capture. |
| `dropped_total{reason="queue_full"}` climbing | The endpoint cannot keep up with the event rate. | Raise `queue_capacity` or `batch_size`, enable `compression`, or scale the endpoint. |
| `dropped_total{reason="backpressure"}` climbing | The endpoint accepts but answers slowly, and retries were abandoned to keep draining. | Fix endpoint latency, or raise `retry_abort_queue_ratio` to favor delivery over drain. |
| `dropped_total{reason="send_failed"}` climbing | Retries exhausted. The endpoint is failing or unreachable. | Check `export_errors_total{publisher="otel"}` for the status code, then the endpoint, headers and TLS trust. |
| `dropped_total{reason="rejected"}` climbing | The endpoint returned a non-retryable `4xx`. | Usually auth (`401`/`403`) or a payload limit (`413`). Check the `code` label. |

{% endraw %}
