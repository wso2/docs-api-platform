---
title: "Configure Traffic Logging"
description: "Emit a structured JSON log line for every request through the API Platform AI Gateway — to stdout, a rotating file, or an HTTP log receiver — with no external SaaS and no policy dependency."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/observability/traffic-logging/
md_url: https://wso2.com/api-platform/docs/ai-gateway/observability/traffic-logging.md
tags:
  - ai-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-24
content_type: "how-to"
---

{% raw %}
# Traffic Logging

!!! info "Note"
    The `file` and `http` sinks are available from **update level 1.2.0.2** onwards(released on 23rd August 2026). On an earlier
    1.2.0 update level, `stdout` is the only sink, and `traffic_logging.outputs`,
    `[traffic_logging.file]`, and `[traffic_logging.http]` do not apply.

## Overview

Traffic Logging writes a single structured JSON line for every request handled by the gateway — who
called what, the status code, latencies, request/response headers, and (optionally) bodies.

Each line is written to the **sinks** you name in `traffic_logging.outputs`:

| Sink | Where the line goes | Use it when |
|---|---|---|
| `stdout` | The policy-engine container log, and therefore the node's `/var/log/pods` files | A node-level collector (Fluent Bit, Fluentd, CloudWatch agent) is already scraping container logs, and the lines carry no payloads you need to keep off the node. **This is the default.** |
| `file` | A rotating file on a writable volume | You want payloads out of the container log and away from every node-level collector, and you have (or can mount) a per-pod volume. |
| `http` | Batched `POST`s to a log receiver you name | You want the lines to leave the pod directly — no disk, no co-located collector, no sidecar or DaemonSet. |

Sinks are **additive**: `outputs = ["file", "http"]` writes every line to both. Order is irrelevant,
duplicates are rejected, and an unknown name is a startup error.

!!! note
    Traffic Logging and Moesif Analytics are independent consumers of the same underlying data-capture
    pipeline. You can enable either, both, or neither.

## How it works

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

Because emission happens on Envoy's access-log path, it fires for every request Envoy terminates —
including requests denied by an auth policy before they reach any downstream logic.

Two properties hold for every sink:

* **Nothing in the sink path is on the request/response path.** Traffic-log lines are produced from
  Envoy's access-log stream, which Envoy emits *after* the response has been sent to the client. A slow
  or unreachable log receiver cannot add latency to an LLM Proxy or MCP Proxy call or fail one.
* **Sink construction fails closed; delivery fails open.** A file that cannot be opened or an endpoint
  that cannot be built fails gateway startup. No sink silently degrades to `stdout`, because that would
  put payloads back into the container log the operator chose `file`/`http` to keep them out of. At
  runtime, by contrast, a delivery failure drops the line and counts it (see
  [Monitoring the sinks](#monitoring-the-sinks)); it never blocks request processing and never falls
  back to another sink.

## Quick start (stdout)

At minimum, enable `[traffic_logging]` and turn on whichever `[collector]` capture flags you want
reflected in the log line. Each `traffic_logging.*_headers` / `*_body` toggle only **selects among**
what `[collector]` already captured. Enabling it while the matching `[collector]` flag is off has no
effect.

```toml
[collector]
request_headers = true
response_headers = true

[traffic_logging]
enabled = true
request_headers = true
response_headers = true
```

`outputs` defaults to `["stdout"]`, so this produces a JSON line on the policy-engine's stdout for
every request to every LLM Proxy and MCP Proxy, with headers redacted per `masked_headers`.

## Configuration reference

### `[collector]`

Shared capture pipeline. Configured once; every enabled consumer (Analytics, Traffic Logging) reads
from it.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `request_body` | boolean | `false` | Capture the full request body into the collected event. |
| `response_body` | boolean | `false` | Capture the full response body into the collected event. |
| `request_headers` | boolean | `false` | Capture all request headers into the collected event. |
| `response_headers` | boolean | `false` | Capture all response headers into the collected event. |
| `ignore_path_prefixes` | array of strings | `[]` | Path prefixes for which no analytics event and no traffic-log line is produced at all — as if capture were disabled for that one request. See [Ignoring paths](#ignoring-paths). |

!!! note
    Bodies can be large. Capture is off by default for both request and response bodies. Enable only
    what you need, and use `traffic_logging.max_payload_size` to cap what reaches each log line.

### `[traffic_logging]`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `false` | Emit a JSON line for every request to every LLM Proxy and MCP Proxy. |
| `outputs` | array of strings | `["stdout"]` | Sinks each line is written to. Any combination of `"stdout"`, `"file"`, `"http"`. Additive; order is irrelevant; duplicates and unknown names are startup errors. |
| `shutdown_timeout` | duration | `"5s"` | Bounds the flush of buffering sinks on `SIGTERM`. Only `http` buffers. |
| `masked_headers` | array of strings | `["authorization", "x-api-key", "x-jwt-assertion"]` | Header names (case-insensitive) whose values are redacted as `****` in the logged `requestHeaders`/`responseHeaders`. |
| `max_payload_size` | int | `0` | Maximum bytes of request/response payload written per log line. `0` = no limit. Applied output-side only — the collector still captures the full body. |
| `request_headers` | boolean | `false` | Include captured request headers in the log line. No-op if `collector.request_headers` is `false`. |
| `request_body` | boolean | `false` | Include the captured request body. No-op if `collector.request_body` is `false`. |
| `response_headers` | boolean | `false` | Include captured response headers in the log line. No-op if `collector.response_headers` is `false`. |
| `response_body` | boolean | `false` | Include the captured response body. No-op if `collector.response_body` is `false`. |
| `exclude_fields` | array of strings | `[]` | Drop named fields from the emitted line. See [Field exclusion](#field-exclusion). |

Sub-tables: `[traffic_logging.file]` (see [The `file` sink](#the-file-sink)),
`[traffic_logging.http]` with `.auth`, `.auth.<type>` and `.tls`
(see [The `http` sink](#the-http-sink)), and `[traffic_logging.properties]`
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
    The ALS transport's TCP port is fixed at `18090` and is not configurable — this guarantees the
    controller and the policy-engine can never disagree on it. `buffer_flush_interval`,
    `buffer_size_bytes`, and `grpc_request_timeout` are additional Envoy-sender-only keys under
    `[collector.server]`; see `config-template.toml` for their defaults.

## The `file` sink

!!! info "Requires update level 1.2.0.2"
    This sink is available from **update level 1.2.0.2** onwards.

Appends each line to a rotating file. Use it to keep payloads off the container log and therefore out
of `kubectl logs` and out of any DaemonSet shipping container logs onward.

```toml
[collector]
request_body = true
response_body = true
request_headers = true
response_headers = true

[traffic_logging]
enabled = true
outputs = ["file"]
request_headers = true
request_body = true
response_headers = true
response_body = true
max_payload_size = 4096

[traffic_logging.file]
path = "/var/log/wso2/traffic/traffic.log"
max_size_mb = 100
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `path` | string | `""` | **Required** when this sink is selected. Absolute path of the live log file. |
| `max_size_mb` | int | `100` | Size at which the live file is rotated. `0` disables rotation and logs a warning. |

### Permissions

The parent directory is created `0700` and the file opened `0600` **at startup**, so a permissions
problem surfaces at boot rather than at the first request once payloads are already flowing.

If the file already exists and is group- or world-readable — left behind by an earlier run, restored
from a backup, or pre-created on a volume — startup **fails** with the `chmod` command to run. A
permissive *directory* only warns, since a `0600` file is unreadable regardless of its directory's mode.

### Rotation

At `max_size_mb` the live file is renamed to `<path>.1` (clobbering any previous backup) and reopened,
so the worst case on disk is **2 × `max_size_mb`**. The size counter is seeded from the existing file at
open, so the ceiling still binds after a restart that appends to an existing log.

This is the "create" mode logrotate uses, so tailers that track inodes (Fluent Bit, Filebeat, Promtail)
follow it correctly.

!!! warning "Single writer only"
    `path` must be a **per-pod** volume. An `emptyDir`, or a PVC bound to exactly one replica. A shared
    RWX volume, `hostPath`, or NFS mount written by more than one gateway pod is **not supported and
    will silently lose records**.

    Give each replica its own volume and let your collector (or the `http` sink) do
    the merging.

### Kubernetes

The Helm chart provisions and mounts the volume **automatically** whenever `traffic_logging.outputs`
contains `"file"`. You do not need to enable it separately:

```yaml
gateway:
  config:
    traffic_logging:
      enabled: true
      outputs: ["file"]
      file:
        path: /var/log/wso2/traffic/traffic.log
        max_size_mb: 100
```

renders both the mount and a per-pod `emptyDir`:

```yaml
volumeMounts:
  - name: traffic-log
    mountPath: /var/log/wso2
volumes:
  - name: traffic-log
    emptyDir:
      sizeLimit: 512Mi
```

Tune it under `gateway.gatewayRuntime.trafficLogVolume`:

| Value | Default | Description |
|---|---|---|
| `enabled` | auto | Auto-derived from whether `outputs` contains `"file"`. Set it explicitly only to override. For example `false` when you mount your own volume. |
| `mountPath` | `/var/log/wso2` | Mount point. `traffic_logging.file.path` must sit under this path, or templating fails with an explanatory error rather than producing a pod that cannot start. |
| `sizeLimit` | `512Mi` | Keep this comfortably above **2 × `max_size_mb`** so rotation bounds the file, not the kubelet. The kubelet's limit **evicts the pod**. |
| `medium` | (unset) | Set to `"Memory"` for a tmpfs: off disk entirely, but it counts against the container's memory limit. |

!!! tip
    An `emptyDir` lives outside the `/var/log/pods` glob node-level collectors read, which is the point:
    bodies written there are invisible to both `kubectl logs` and any DaemonSet shipping container logs
    onward. To ship them anyway, mount the same volume into a sidecar collector.

## The `http` sink

!!! info "Requires update level 1.2.0.2"
    This sink is available from **update level 1.2.0.2** onwards.

Batches lines and `POST`s them to an endpoint you name. Nothing is written to disk and no co-located
collector is required.

The body is newline-delimited JSON (`application/x-ndjson`): one traffic-log line per line. The sink adds no envelope, no per-record metadata, and no receiver-specific framing.

Receivers that take that payload as-is include Splunk HEC's `/services/collector/raw` endpoint and the HTTP input of a log collector such as Fluent Bit or Vector can consume the sink straight.

```toml
[traffic_logging]
enabled = true
outputs = ["http"]

[traffic_logging.http]
endpoint = "https://logs.example.com/ingest"
content_type = "application/x-ndjson"

[traffic_logging.http.auth]
type = "bearer"

[traffic_logging.http.auth.bearer]
token = '{{ env "APIP_GW_TRAFFIC_LOG_TOKEN" }}'
```

### Endpoint and transport

| Parameter | Type | Default | Description |
|---|---|---|---|
| `endpoint` | string | `""` | **Required** when this sink is selected. Absolute URL each batch is `POST`ed to. Redirects are never followed. |
| `content_type` | string | `"application/x-ndjson"` | `Content-Type` sent with each batch. |
| `allow_insecure_transport` | boolean | `false` | Permits a plaintext `http://` endpoint. These lines can carry request and response bodies, so plaintext is a real disclosure, not a hygiene warning. Intended only for a collector on the pod network. An `http://` endpoint without this set is a **startup error**. |

Any scheme other than `https` (or `http` with the flag above) is rejected at startup.

### Batching and queueing

A batch is closed by whichever bound is reached first, then handed to a single sender goroutine that
drains a bounded queue.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `batch_max_events` | int | `100` | Maximum lines per batch. Must be positive. |
| `batch_max_bytes` | int | `1048576` | Maximum encoded bytes per batch. Must be positive. |
| `flush_interval` | duration | `"5s"` | Maximum time a partial batch waits before being sent. Must be positive. |
| `queue_capacity` | int | `10000` | Bounded queue between the ingest path and the sender. Must be positive. An unbounded queue in front of a bounded sender is just deferred unbounded memory growth, and these events can carry bodies. At a 10 KiB/line worst case, 10000 lines is roughly 100 MiB. |
| `on_queue_full` | string | `"drop_new"` | What to drop once the queue is full. `drop_new` keeps the older window (suits audit); `drop_oldest` keeps recency (suits dashboards). Either way the line is counted as `dropped_total{reason="queue_full"}`. |

### Timeouts and retries

| Parameter | Type | Default | Description |
|---|---|---|---|
| `request_timeout` | duration | `"10s"` | Bounds a single `POST` attempt. Must be positive. |
| `max_retries` | int | `3` | Retry attempts *after* the initial one. `0` means one attempt per batch. |
| `retry_backoff` | duration | `"1s"` | Base for exponential backoff, plus jitter so replicas recovering from a shared outage do not synchronize. Must be positive when `max_retries > 0`. |
| `retry_abort_queue_ratio` | float | `0.5` | Fraction of `queue_capacity` at which a retrying batch abandons its remaining attempts. Must be between `0` and `1`. See below. |

Only transport errors, `5xx` and `429` are retried. A `4xx` other than `429` means the receiver rejected
the batch's *shape*, so retrying would only amplify a permanent failure. When a `429` carries a
`Retry-After` header, that delay **replaces** the computed backoff rather than adding to it, and is
clamped so a hostile or misconfigured value cannot stall the sender indefinitely.

#### Retry versus draining (`retry_abort_queue_ratio`)

While a batch is retrying, nothing else in the queue is being drained. Against a receiver that accepts
connections but never answers, the default retry budget holds the sender for a considerable time, and
longer still if the receiver returns `429` with a large `Retry-After`. At even a modest event rate that
is long enough to fill the whole queue, so retrying to save one batch of ~100 events can cost thousands
of newer ones.

`retry_abort_queue_ratio` bounds that trade-off: before each further wait, the sender checks the queue
depth, and at or above the threshold it abandons the batch and gets back to draining. The abandoned
lines are counted as `dropped_total{reason="backpressure"}`. This is deliberately distinct from `send_failed`,
so you can tell *"the receiver is slow"* from *"the receiver is broken"*.

The value is used exactly as written and is never remapped to a default:

| Value | Behavior |
|---|---|
| `0` | Always abandon retries. One delivery attempt per batch, whatever the queue looks like (the same effect as `max_retries = 0`). |
| `0.1` | Abort once the queue is 10% full. Favors draining over saving any individual batch. |
| `0.5` | **Default.** Retry freely while the queue is shallow; stop once it starts filling. |
| `1` | Never abort early. A receiver that accepts but never answers holds the sender for the full retry budget. |

### Authentication

`type` selects the scheme, and each scheme's fields live in its own sub-table — the same
discriminator-plus-named-section shape `[analytics]` uses for `enabled_publishers` /
`[analytics.publishers.<name>]`. **Only the sub-table matching `type` is read**; the others are ignored
entirely, so leaving a populated `[.basic]` behind while switching to `bearer` cannot send the wrong
credential.

| `type` | Sub-table | Required fields | Header sent |
|---|---|---|---|
| `"none"` | — | — | *(none: the default, and what an omitted `type` resolves to)* |
| `"bearer"` | `[traffic_logging.http.auth.bearer]` | `token` | `Authorization: Bearer <token>` |
| `"basic"` | `[traffic_logging.http.auth.basic]` | `username`, `password` | `Authorization: Basic <base64(user:pass)>` |
| `"header"` | `[traffic_logging.http.auth.header]` | `name`, `value` | `<name>: <value>` |

Exactly one header is added to the `POST`. There is no way to combine two schemes. A receiver needing
more than one header should sit behind a collector that adds the rest. A missing required field for the
selected type is a **startup error**, not a silently unauthenticated `POST` carrying request bodies. The
`type` value is matched case-insensitively and trimmed.

=== "Bearer"

    For a receiver that reads a bearer token,

    ```toml
    [traffic_logging.http]
    endpoint = "https://logs.example.com/ingest"

    [traffic_logging.http.auth]
    type = "bearer"

    [traffic_logging.http.auth.bearer]
    token = '{{ env "APIP_GW_TRAFFIC_LOG_TOKEN" }}'
    ```

=== "Basic"

    For a collector whose HTTP input takes basic auth,

    ```toml
    [traffic_logging.http]
    endpoint = "https://vector.observability.svc:8080/gateway-traffic"

    [traffic_logging.http.auth]
    type = "basic"

    [traffic_logging.http.auth.basic]
    username = "gateway"
    password = '{{ file "/secrets/gateway-runtime/traffic-log-password" }}'
    ```

=== "Header"

    For receivers whose scheme is not `Bearer` — Splunk HEC expects `Authorization: Splunk <token>`,
    which `bearer` cannot express — or that authenticate on a non-`Authorization` header entirely.

    ```toml
    # Splunk HEC
    [traffic_logging.http]
    endpoint = "https://splunk.example.com:8088/services/collector/raw?sourcetype=wso2:gateway:traffic"

    [traffic_logging.http.auth]
    type = "header"

    [traffic_logging.http.auth.header]
    name  = "Authorization"
    value = 'Splunk {{ file "/secrets/gateway-runtime/hec-token" }}'
    ```

    ```toml
    # A vendor endpoint authenticating on an API-key header
    [traffic_logging.http.auth.header]
    name  = "X-API-Key"
    value = '{{ file "/secrets/gateway-runtime/traffic-log-api-key" }}'
    ```

=== "None"

    Correct for an unauthenticated in-cluster collector, and for **mTLS-only** receivers where the client
    certificate is the credential.

    ```toml
    [traffic_logging.http]
    endpoint = "https://fluent-bit.observability.svc:9880/gateway-traffic"

    [traffic_logging.http.auth]
    type = "none"
    ```

### Never inline a credential

Supply every secret through a config-interpolation token, which the policy engine resolves at load time
and never logs:

| Token | Resolves from |
|---|---|
| `{{ env "VAR_NAME" }}` | An environment variable — inject it from a Kubernetes `Secret` via `envFrom`/`env`. |
| `{{ file "/path/to/secret" }}` | A file's contents — mount a `Secret` as a volume. Reads are restricted to `/etc/gateway-runtime` and `/secrets/gateway-runtime` by default (override with `APIP_CONFIG_FILE_SOURCE_ALLOWLIST`). |

!!! warning "The Helm chart enforces this"
    `config.toml` is rendered into a **ConfigMap**, not a Secret: it is readable by anything with
    configmap read access in the namespace, stored unencrypted in etcd by default, and echoed by
    `helm get values`. The chart therefore **fails templating** if `auth.bearer.token`,
    `auth.basic.password`, or `auth.header.value` holds a literal value, and names the offending field.

    `auth.header.value` accepts a literal *prefix* before the token (so `Splunk {{ file "..." }}` works),
    but the credential itself must come from a token.

    For local development only, set
    `gateway.config.traffic_logging.http.auth.allow_plaintext_credentials: true` to opt out.

### TLS and mTLS

`[traffic_logging.http.tls]` is the **transport** layer and is independent of
`[traffic_logging.http.auth]`: the client certificate proves *who is connecting*, the auth block proves
*who is making the request*. Use either alone, or both together. mTLS does not suppress the auth
header, and `type = "none"` with a client certificate is a perfectly normal mTLS-only setup.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `ca_file` | string | `""` | PEM bundle used to verify the receiver's certificate. Empty means the system trust store. Correct for a public SaaS receiver, usually wrong for an internal collector fronted by a private CA. |
| `cert_file` | string | `""` | Client certificate (PEM) for mTLS. |
| `key_file` | string | `""` | Client private key (PEM) for mTLS. |
| `insecure_skip_verify` | boolean | `false` | Disables verification of the receiver's certificate. When on, startup logs a warning naming the endpoint, because it exposes every logged request/response body to anyone able to intercept the connection. |

`cert_file` and `key_file` are **both or neither** — setting one without the other is a startup error
rather than a silently unauthenticated connection. All referenced material is read and parsed at
startup, so a wrong path, an unusable CA bundle, or a mismatched key pair fails immediately instead of
at the first delivery.

```toml
[traffic_logging.http]
endpoint = "https://collector.observability.svc:8443/ingest"

# mTLS only — the client certificate is the credential.
[traffic_logging.http.auth]
type = "none"

[traffic_logging.http.tls]
ca_file   = "/secrets/gateway-runtime/collector-ca.crt"
cert_file = "/secrets/gateway-runtime/traffic-log-client.crt"
key_file  = "/secrets/gateway-runtime/traffic-log-client.key"
```

To combine mTLS with a bearer token — common where the mesh authenticates the workload and the log
store authorizes the tenant — keep the `tls` block above and add:

```toml
[traffic_logging.http.auth]
type = "bearer"

[traffic_logging.http.auth.bearer]
token = '{{ file "/secrets/gateway-runtime/traffic-log-token" }}'
```

The whole `tls` block is ignored when the endpoint is plaintext `http://`, since there is no handshake
to configure.

## Redaction and payload control

* **`masked_headers`** redacts matching header values (case-insensitive) to `****` in the logged
  `requestHeaders`/`responseHeaders` maps, in **every** sink. This is applied output-side by Traffic
  Logging only — other consumers of the collector (such as Moesif) are unaffected and receive unmasked
  headers.
* **`max_payload_size`** truncates the request/response body written to each line. Set to `0` (default)
  for no limit. Applied output-side only — the collector still captures the full body.
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
    `exclude_fields` only trims what the `request_*`/`response_*` toggles already include — it is not a
    standalone switch. Setting only `exclude_fields`, with every toggle left at its `false` default,
    still logs no headers or bodies at all.

## Ignoring paths

`collector.ignore_path_prefixes` suppresses the analytics event — and therefore the traffic-log line —
for matching paths, such as health checks or metrics scrapes:

```toml
[collector]
ignore_path_prefixes = ["/health", "/metrics"]
```

This is enforced by Envoy itself via an access-log filter, so the policy-engine never even receives the
request for a matching path.

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

Available variables:

| Namespace | Variables |
|---|---|
| Request | `request.path`, `request.method`, `request.id`, `request.header['<name>']` (masked per `masked_headers`) |
| Response | `response.status`, `response.header['<name>']` (masked per `masked_headers`) |
| API | `api.id`, `api.name`, `api.version`, `api.context`, `api.kind`, `project.id` — `api.kind` resolves to `LlmProxy` for an LLM Proxy or `Mcp` for an MCP Proxy |
| Target | `target.statusCode`, `target.destination` |
| Application | `application.id`, `application.name`, `application.owner`, `application.keyType` — populated only when an auth policy that stamps application identity (currently `api-key-auth`) ran |
| Auth | `auth.subject`, `auth.type`, `auth.issuer`, `auth.credential_id`, `auth.token_id`, `auth.audience` (list), `auth.scopes` (list), `auth.property['<claim>']` (map), `auth.authenticated`, `auth.authorized` |
| Generic metadata | `metadata['<key>']` — any key any policy (including third-party/Python policies) has written into shared request metadata |

!!! note
    Unlike headers, `metadata['<key>']` has **no masking configuration**. Shared request metadata is a
    generic, schema-less bag that any policy can write to, so any value referenced from `properties` is
    emitted verbatim. Avoid referencing metadata keys that may contain sensitive values.

A `$ctx:` expression that references a variable this surface doesn't expose (for example, a typo) fails
to compile when the gateway starts, is logged once, and that property is permanently omitted from every
line. It does not cause requests to fail.

## Example log line

```json
{
  "timestamp": "2026-08-24T09:12:33.482Z",
  "correlationId": "5f6b6e2a-2f38-4b7a-9c2f-6b6a2f384b7a",
  "status": 200,
  "api": {
    "id": "01998f3e-...",
    "name": "OpenAI-Proxy",
    "version": "1.0.0",
    "context": "/assistant",
    "kind": "LlmProxy"
  },
  "operation": {
    "method": "POST",
    "path": "/chat/completions"
  },
  "target": {
    "statusCode": 200,
    "destination": "https://api.openai.com/v1/chat/completions"
  },
  "application": {
    "id": "app-123",
    "name": "AI Assistant App",
    "owner": "jdoe",
    "keyType": "PRODUCTION"
  },
  "client": {
    "ip": "203.0.113.10",
    "userAgent": "curl/8.4.0"
  },
  "latencies": {
    "durationUs": 812342,
    "requestMediationLatencyUs": 412,
    "responseMediationLatencyUs": 298,
    "backendLatencyUs": 811102
  },
  "requestHeaders": {
    "authorization": "****",
    "user-agent": "curl/8.4.0"
  },
  "responseHeaders": {
    "content-type": "application/json"
  },
  "properties": {
    "env": "prod",
    "apiName": "OpenAI-Proxy",
    "subject": "jdoe@example.com"
  }
}
```

Fields whose values are entirely empty (for example `application` on an unauthenticated request) are
omitted from the line rather than emitted as `{}`.

The same line is written to every configured sink, so with `outputs = ["file", "http"]` one request
produces one line in the file **and** one line in the batch sent to the receiver.

## Monitoring the sinks

The policy-engine exposes per-sink Prometheus metrics on its metrics port (`[policy_engine.metrics]`,
port `9003` by default). Every series is labeled `sink` — `stdout`, `file`, or `http`.

| Metric | Type | Labels | Description |
|---|---|---|---|
| `policy_engine_traffic_log_written_total` | counter | `sink` | Lines successfully written. |
| `policy_engine_traffic_log_dropped_total` | counter | `sink`, `reason` | Lines **lost**. This is the series to alert on. |
| `policy_engine_traffic_log_write_errors_total` | counter | `sink`, `code` | Delivery errors, by HTTP status (`http`) or error class (`write`, `rotate`, `transport`). |
| `policy_engine_traffic_log_queue_depth` | gauge | `sink` | Lines currently queued for delivery (`http` only). |
| `policy_engine_traffic_log_queue_capacity` | gauge | `sink` | Configured queue capacity (`http` only), so an alert can compare depth as a **ratio** rather than a meaningless absolute threshold. |
| `policy_engine_traffic_log_flush_duration_seconds` | histogram | `sink` | Duration of a batch delivery attempt (`http` only). |

`dropped_total` reasons:

| Reason | Sink | Meaning |
|---|---|---|
| `queue_full` | `http` | The bounded queue had no room; dropped per `on_queue_full`. |
| `send_failed` | `http` | Retries exhausted — the receiver is failing or unreachable. |
| `backpressure` | `http` | Retries abandoned to resume draining, per `retry_abort_queue_ratio`. The receiver is *slow*, not broken. |
| `write_failed` | `stdout`, `file` | A local write returned an error. |
| `rotate_failed` | `file` | Rotation failed, so the line that triggered it was not written. |

Counters for each configured sink are **materialized at zero** on startup, so a healthy gateway reports
`dropped_total 0` rather than an absent series — which would leave a dashboard reading "No data" and
make "nothing was dropped" indistinguishable from "the metrics path is broken".

Useful queries:

```promql
# Are we losing traffic-log lines at all?
sum by (sink, reason) (rate(policy_engine_traffic_log_dropped_total[5m])) > 0

# Queue pressure as a fraction of capacity (alert above ~0.5)
sum by (sink) (policy_engine_traffic_log_queue_depth)
  / sum by (sink) (policy_engine_traffic_log_queue_capacity)

# Delivery success ratio
sum(rate(policy_engine_traffic_log_written_total[5m]))
  / (sum(rate(policy_engine_traffic_log_written_total[5m]))
     + sum(rate(policy_engine_traffic_log_dropped_total[5m])))
```

!!! tip
    When aggregating across sinks, always use `sum by (sink)` rather than a bare `sum()`. With two sinks
    configured, one request produces one write **per sink**, so a bare `sum()` of
    `written_total` reads as double the request rate.

## Kubernetes / Helm

The chart renders the whole feature from `.Values.gateway.config` — `[collector]`,
`[traffic_logging]` including `outputs`, `shutdown_timeout`, `properties`, and the `file`, `http`,
`http.auth` and `http.tls` sub-tables.

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
      masked_headers: ["authorization", "cookie", "set-cookie", "x-api-key"]
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
environment variables for `{{ env }}` tokens) — the chart renders the *reference*, never the value.

!!! note
    Numeric and duration keys are rendered whenever the key is **present**, including an explicit `0`,
    so a mistaken `queue_capacity: 0` reaches validation and is rejected at startup instead of being
    silently replaced by the default.

## Failure semantics and troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Pod fails to start: `path is required when the "file" sink is selected` | `outputs` contains `"file"` but `file.path` is unset. | Set an absolute `file.path`. |
| Pod fails to start: `has permissions 0644, which allow group/other access` | The log file already existed with a permissive mode. | `chmod 600 <path>` (or remove the file) and restart. |
| Pod fails to start: `endpoint uses plaintext http:// but allow_insecure_transport is false` | Plaintext endpoint. | Use `https://`, or set `allow_insecure_transport = true` for a trusted local collector. |
| Templating fails: `holds a literal value, which would be written in plaintext into the gateway ConfigMap` | A credential was inlined in Helm values. | Use `{{ env }}` / `{{ file }}`, as described in [Never inline a credential](#never-inline-a-credential). |
| Templating fails: `is not under ... trafficLogVolume.mountPath` | `file.path` sits outside the mounted volume. | Move the path under `mountPath`, change `mountPath`, or set `trafficLogVolume.enabled: false` if you mount your own volume. |
| No lines at all, but requests are succeeding | `traffic_logging.enabled` is `false`, or the path matches `collector.ignore_path_prefixes`. | Check both. |
| Lines appear but headers/bodies are missing | The matching `[collector]` capture flag is off, or `exclude_fields` drops them. | Enable the `[collector]` flag; the `traffic_logging` toggle alone is a no-op. |
| `dropped_total{reason="queue_full"}` climbing | The receiver cannot keep up with the event rate. | Raise `queue_capacity`, raise `batch_max_events`, or scale the receiver. |
| `dropped_total{reason="backpressure"}` climbing | The receiver accepts but responds slowly, and retries were abandoned to keep draining. | Fix receiver latency; or raise `retry_abort_queue_ratio` to favor delivery over drain (at the cost of newer events). |
| `dropped_total{reason="send_failed"}` climbing | Retries exhausted — the receiver is failing or unreachable. | Check `write_errors_total{sink="http"}` for the status code, then the endpoint, auth material, and TLS trust. |
| Lines lost after a restart, `file` sink | Buffering only applies to `http`; `file` and `stdout` write straight to their descriptor. | Nothing to tune — check `dropped_total` instead. |

`traffic_logging.shutdown_timeout` (default `"5s"`) bounds the flush of buffering sinks on `SIGTERM`.
Only `http` buffers; `stdout` and `file` have nothing to flush.

{% endraw %}
