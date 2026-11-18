---
title: "Traffic Log Outputs"
description: "Write API Platform Gateway traffic log lines to a rotating file or send them to an HTTP log receiver, then monitor delivery and troubleshoot problems."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/log-outputs/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/log-outputs.md
tags:
  - api-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "how-to"
---

{% raw %}
# Traffic Log Outputs

Each traffic log line is written to the outputs (sinks) you name in `traffic_logging.outputs`.

* `stdout` is the default and needs no other settings. See the [Quick start](overview.md#quick-start-stdout).
* To collect `stdout` lines in one place with the other gateway logs, see [Centralized Logging](../logging.md).
* `file` and `http` are described on this page.
* To compare the outputs, see the [Overview](overview.md#overview).

## The `file` sink

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

If the file already exists and is group- or world-readable (left behind by an earlier run, restored
from a backup, or pre-created on a volume), startup **fails** with the `chmod` command to run. A
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

`type` selects the scheme, and each scheme's fields live in its own sub-table. This is the same
discriminator-plus-named-section shape `[analytics]` uses for `enabled_publishers` /
`[analytics.publishers.<name>]`. **Only the sub-table matching `type` is read**; the others are ignored
entirely, so leaving a populated `[.basic]` behind while switching to `bearer` cannot send the wrong
credential.

| `type` | Sub-table | Required fields | Header sent |
|---|---|---|---|
| `"none"` | None | None | *(none: the default, and what an omitted `type` resolves to)* |
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

    For receivers whose scheme is not `Bearer` (Splunk HEC expects `Authorization: Splunk <token>`,
    which `bearer` cannot express), or that authenticate on a non-`Authorization` header entirely.

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
| `{{ env "VAR_NAME" }}` | An environment variable. Inject it from a Kubernetes `Secret` via `envFrom`/`env`. |
| `{{ file "/path/to/secret" }}` | A file's contents. Mount a `Secret` as a volume. Reads are restricted to `/etc/gateway-runtime` and `/secrets/gateway-runtime` by default (override with `APIP_CONFIG_FILE_SOURCE_ALLOWLIST`). |

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

`cert_file` and `key_file` are **both or neither**. Setting one without the other is a startup error
rather than a silently unauthenticated connection. All referenced material is read and parsed at
startup, so a wrong path, an unusable CA bundle, or a mismatched key pair fails immediately instead of
at the first delivery.

```toml
[traffic_logging.http]
endpoint = "https://collector.observability.svc:8443/ingest"

# mTLS only: the client certificate is the credential.
[traffic_logging.http.auth]
type = "none"

[traffic_logging.http.tls]
ca_file   = "/secrets/gateway-runtime/collector-ca.crt"
cert_file = "/secrets/gateway-runtime/traffic-log-client.crt"
key_file  = "/secrets/gateway-runtime/traffic-log-client.key"
```

To combine mTLS with a bearer token (common where the mesh authenticates the workload and the log
store authorizes the tenant), keep the `tls` block above and add:

```toml
[traffic_logging.http.auth]
type = "bearer"

[traffic_logging.http.auth.bearer]
token = '{{ file "/secrets/gateway-runtime/traffic-log-token" }}'
```

The whole `tls` block is ignored when the endpoint is plaintext `http://`, since there is no handshake
to configure.

## Monitoring the sinks

The policy-engine exposes per-sink Prometheus metrics on its metrics port (`[policy_engine.metrics]`,
port `9003` by default). Every series is labeled `sink` with the value `stdout`, `file`, or `http`.

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
| `send_failed` | `http` | Retries exhausted. The receiver is failing or unreachable. |
| `backpressure` | `http` | Retries abandoned to resume draining, per `retry_abort_queue_ratio`. The receiver is *slow*, not broken. |
| `write_failed` | `stdout`, `file` | A local write returned an error. |
| `rotate_failed` | `file` | Rotation failed, so the line that triggered it was not written. |

Counters for each configured sink are **materialized at zero** on startup, so a healthy gateway reports
`dropped_total 0` rather than an absent series. An absent series would leave a dashboard reading "No data" and
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
| `dropped_total{reason="send_failed"}` climbing | Retries exhausted. The receiver is failing or unreachable. | Check `write_errors_total{sink="http"}` for the status code, then the endpoint, auth material, and TLS trust. |
| Lines lost after a restart, `file` sink | Buffering only applies to `http`; `file` and `stdout` write straight to their descriptor. | Nothing to tune. Check `dropped_total` instead. |

`traffic_logging.shutdown_timeout` (default `"5s"`) bounds the flush of buffering sinks on `SIGTERM`.
Only `http` buffers; `stdout` and `file` have nothing to flush.

{% endraw %}
