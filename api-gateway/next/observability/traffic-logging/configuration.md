---
title: "Configure Traffic Logging"
description: "Choose what API Platform Gateway traffic log lines include, mask headers, exclude fields, skip paths, add custom properties, and set it all through Helm."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/configuration/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/configuration.md
tags:
  - api-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "reference"
---

# Configure Traffic Logging

This page lists the traffic logging settings. To turn on traffic logging with the minimum settings, see the [Quick start](overview.md#quick-start-stdout). To choose where the lines go, see [Log Outputs](log-outputs.md).

## Configuration reference

### `[collector]`

Shared capture pipeline. Configured once; every enabled consumer (Analytics, Traffic Logging) reads
from it.

Request/response header and body capture is a **shared** concern, handled by a capture pipeline called
the **collector**. The collector has no on/off switch of its own. It activates automatically whenever
a consumer that needs it is enabled (`analytics.enabled` or `traffic_logging.enabled`). Traffic Logging
is one such consumer: it reads whatever the collector captured, serializes it to JSON, and hands the
line to each configured sink.

```text
Envoy access log ──ALS──► collector ──► traffic-log serializer ──┬──► stdout   container log (kubectl logs, node collectors)
                                                                 ├──► file     rotating file on a per-pod volume
                                                                 └──► http     bounded queue ──► batched POST to a receiver
```

Because emission happens on Envoy's access-log path, it fires for every request Envoy terminates,
including requests denied by an auth policy before they reach any downstream logic.

!!! note
    Traffic Logging and Moesif Analytics are independent consumers of the same underlying data-capture
    pipeline. You can enable either, both, or neither.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `request_body` | boolean | `false` | Capture the full request body into the collected event. |
| `response_body` | boolean | `false` | Capture the full response body into the collected event. |
| `request_headers` | boolean | `false` | Capture all request headers into the collected event. |
| `response_headers` | boolean | `false` | Capture all response headers into the collected event. |
| `ignore_path_prefixes` | array of strings | `[]` | Path prefixes for which no analytics event and no traffic-log line is produced at all, as if capture were disabled for that one request. See [Ignoring paths](#ignoring-paths). |

!!! note
    Bodies can be large. Capture is off by default for both request and response bodies. Enable only
    what you need, and use `traffic_logging.max_payload_size` to cap what reaches each log line.

### `[traffic_logging]`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `false` | Emit a JSON line for every request to every API. |
| `outputs` | array of strings | `["stdout"]` | Sinks each line is written to. Any combination of `"stdout"`, `"file"`, `"http"`. Additive; order is irrelevant; duplicates and unknown names are startup errors. |
| `shutdown_timeout` | duration | `"5s"` | Bounds the flush of buffering sinks on `SIGTERM`. Only `http` buffers. |
| `masked_headers` | array of strings | `["authorization", "x-api-key", "x-jwt-assertion"]` | Header names (case-insensitive) whose values are redacted as `****` in the logged `requestHeaders`/`responseHeaders`. |
| `max_payload_size` | int | `0` | Maximum bytes of request/response payload written per log line. `0` = no limit. Applied output-side only. The collector still captures the full body. |
| `request_headers` | boolean | `false` | Include captured request headers in the log line. No-op if `collector.request_headers` is `false`. |
| `request_body` | boolean | `false` | Include the captured request body. No-op if `collector.request_body` is `false`. |
| `response_headers` | boolean | `false` | Include captured response headers in the log line. No-op if `collector.response_headers` is `false`. |
| `response_body` | boolean | `false` | Include the captured response body. No-op if `collector.response_body` is `false`. |
| `exclude_fields` | array of strings | `[]` | Drop named fields from the emitted line. See [Field exclusion](#field-exclusion). |

Sub-tables: `[traffic_logging.file]` (see [The `file` sink](log-outputs.md#the-file-sink)),
`[traffic_logging.http]` with `.auth`, `.auth.<type>` and `.tls`
(see [The `http` sink](log-outputs.md#the-http-sink)), and `[traffic_logging.properties]`
(see [Custom properties](#custom-properties)).

### `[collector.server]` (ALS transport tuning)

Advanced settings for the Envoy → policy-engine access-log transport shared by the collector. Defaults
are sensible for most deployments.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `mode` | string | `"uds"` | Transport mode: `"uds"` (Unix domain socket) or `"tcp"`. |
| `als_plain_text` | boolean | `true` | Use plaintext gRPC (skip TLS). |
| `public_key_path` / `private_key_path` | string | `""` | TLS keypair for the ALS connection, when `als_plain_text = false`. |
| `max_message_size` | int | `1000000000` | Maximum size of a single gRPC message the ALS server accepts from Envoy. |
| `max_header_limit` | int | `8192` | Maximum size of headers processed by the ALS server. |
| `shutdown_timeout` | duration | `"600s"` | Maximum time allowed for graceful ALS server shutdown. |

!!! note
    The ALS transport's TCP port is fixed at `18090` and is not configurable. This guarantees the
    controller and the policy-engine can never disagree on it. `buffer_flush_interval`,
    `buffer_size_bytes`, and `grpc_request_timeout` are additional Envoy-sender-only keys under
    `[collector.server]`; see `config-template.toml` for their defaults.

## Redaction and payload control

* **`masked_headers`** redacts matching header values (case-insensitive) to `****` in the logged
  `requestHeaders`/`responseHeaders` maps, in **every** sink. This is applied output-side by Traffic
  Logging only. Other consumers of the collector (such as Moesif) are unaffected and receive unmasked
  headers.
* **`max_payload_size`** truncates the request/response body written to each line. Set to `0` (default)
  for no limit. Applied output-side only. The collector still captures the full body.
* **`exclude_fields`** drops named fields from the emitted line entirely, on top of the toggles above.

### Field exclusion

`exclude_fields` accepts top-level keys (e.g. `"latencies"`, `"requestHeaders"`) or dotted paths of
arbitrary depth into nested JSON objects, for example:

```toml
[traffic_logging]
exclude_fields = ["requestBody", "responseBody", "requestHeaders.authorization"]
```

* Sub-keys immediately under `requestHeaders`/`responseHeaders` match case-insensitively (HTTP header
  names); every other path segment matches case-sensitively.
* A path can reach into a nested object produced by a `properties` expression that resolves to a map,
  for example `properties.claims.internal_debug`.
* A path that reaches past a string value (one dot too many into a single header, or into `requestBody`)
  is a no-op for that entry rather than an error.

!!! note
    `exclude_fields` only trims what the `request_*`/`response_*` toggles already include. It is not a
    standalone switch. Setting only `exclude_fields`, with every toggle left at its `false` default,
    still logs no headers or bodies at all.

## Ignoring paths

`collector.ignore_path_prefixes` suppresses the analytics event, and therefore the traffic-log line,
for matching paths, such as health checks or metrics scrapes:

```toml
[collector]
ignore_path_prefixes = ["/health", "/metrics"]
```

This is enforced by Envoy itself via an access-log filter, so the policy-engine never receives the
access-log event for a matching path.

## Custom properties

`[traffic_logging.properties]` adds extra key → value pairs under a top-level `properties` object in
the log line. A value prefixed `$ctx:` is evaluated as a CEL expression against the collected request
context; any other value is emitted as a literal string.

```toml
[traffic_logging.properties]
env = "prod"
apiName = "$ctx:api.name"
status = "$ctx:response.status"
subject = "$ctx:auth.subject != '' ? auth.subject : 'anonymous'"
tenant = "$ctx:'tenant' in auth.property ? auth.property['tenant'] : ''"
appId = "$ctx:'applicationId' in metadata ? metadata['applicationId'] : ''"
```

For the full list of variables, see [Variable Reference](variable-reference.md).

For example, these properties read the caller, a token claim, a value shared by a policy, and the request duration:

```toml
[traffic_logging.properties]
env = "prod"
user = "$ctx:auth.subject"
tenant = "$ctx:auth.property['tenant']"
tier = "$ctx:metadata['customer_tier']"
durationMs = "$ctx:convertUnit(latencies.duration, 'ms')"
```

Each line then ends with a `properties` object such as:

```json
"properties": {
  "durationMs": 18.342,
  "env": "prod",
  "tenant": "acme",
  "tier": "gold",
  "user": "alice"
}
```

The rest of the line is the same as the [default log line](overview.md#example-log-line).

!!! note
    Unlike headers, `metadata['<key>']` has **no masking configuration**. Shared request metadata is a
    generic, schema-less bag that any policy can write to, so any value referenced from `properties` is
    emitted verbatim. Avoid referencing metadata keys that may contain sensitive values.

A `$ctx:` expression that references a variable this surface doesn't expose (for example, a typo) fails
to compile when the gateway starts, is logged once, and that property is permanently omitted from every
line. It does not cause requests to fail.

## Kubernetes / Helm

The chart renders the whole feature from `.Values.gateway.config`. This covers `[collector]`,
`[traffic_logging]` (with `outputs`, `shutdown_timeout`, `properties`, and the `file`, `http`,
`http.auth` and `http.tls` sub-tables).

```yaml
gateway:
  config:
    collector:
      request_body: true
      response_body: true
      request_headers: true
      response_headers: true
      ignore_path_prefixes: ["/health", "/metrics"]

    traffic_logging:
      enabled: true
      outputs: ["file", "http"]
      request_headers: true
      request_body: true
      response_headers: true
      response_body: true
      masked_headers: ["authorization", "cookie", "set-cookie", "x-api-key", "x-jwt-assertion"]
      max_payload_size: 4096
      shutdown_timeout: "5s"
      properties:
        env: "prod"
        apiName: "$ctx:api.name"
      file:
        path: /var/log/wso2/traffic/traffic.log
        max_size_mb: 100
      http:
        endpoint: https://splunk.example.com:8088/services/collector/raw
        queue_capacity: 10000
        retry_abort_queue_ratio: 0.5
        auth:
          type: header
          header:
            name: Authorization
            value: 'Splunk {{ file "/secrets/gateway-runtime/hec-token" }}'
        tls:
          ca_file: /secrets/gateway-runtime/collector-ca.crt
```

Mount the referenced secrets yourself (as a `Secret` volume under `/secrets/gateway-runtime`, or as
environment variables for `{{ env }}` tokens). The chart renders the *reference*, never the value.

!!! note
    Numeric and duration keys are rendered whenever the key is **present**, including an explicit `0`,
    so a mistaken `queue_capacity: 0` reaches validation and is rejected at startup instead of being
    silently replaced by the default.

