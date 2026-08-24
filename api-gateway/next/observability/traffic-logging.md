---
title: "Configure Traffic Logging"
description: "Emit a structured JSON log line for every API request from the API Platform Gateway, with no external SaaS and no policy dependency."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/traffic-logging/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/traffic-logging.md
tags:
  - api-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-10
content_type: "how-to"
---

# Traffic Logging

## Overview

Traffic Logging writes a single structured JSON line to **stdout** for every request handled by the
gateway — who called what, the status code, latencies, request/response headers, and (optionally)
bodies. It is designed to be picked up by any log-scraping pipeline (Fluent Bit, Loki, ELK, CloudWatch,
and so on); see [Centralized Logging](logging.md) for a reference log stack that can collect it.

!!! note
    Traffic Logging and Moesif Analytics are independent consumers of the same underlying data-capture
    pipeline. You can enable either, both, or neither.

## How it works

Request/response header and body capture is a **shared** concern, handled by a capture pipeline called
the **collector**. The collector itself has no on/off switch of its own — it activates automatically
whenever a consumer that needs it is enabled (`analytics.enabled` or `traffic_logging.enabled`).
Traffic Logging is one such consumer: it reads whatever the collector captured and serializes it to
stdout.

Because emission happens on Envoy's access-log path, it fires for every request Envoy terminates —
including requests denied by an auth policy before they reach any downstream logic.

## Enabling Traffic Logging

At minimum, enable `[traffic_logging]` and turn on whichever `[collector]` capture flags you want
reflected in the log line. Each `traffic_logging.*_headers` / `*_body` toggle only **selects among**
what `[collector]` already captured — enabling it while the matching `[collector]` flag is off has no effect.

```toml
[collector]
request_headers = true
response_headers = true

[traffic_logging]
enabled = true
request_headers = true
response_headers = true
```

With this configuration, every request to every API produces a JSON line on stdout containing request
and response headers (redacted per `masked_headers`, see below).

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
    Bodies can be large. Capture is off by default for both request and response bodies — enable only
    what you need, and use `traffic_logging.max_payload_size` (below) to cap what's written to the log
    line.

### `[traffic_logging]`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `false` | Emit a stdout JSON line for every request to every API. |
| `masked_headers` | array of strings | `["authorization", "x-api-key", "x-jwt-assertion"]` | Header names (case-insensitive) whose values are redacted as `****` in the logged `requestHeaders`/`responseHeaders`. |
| `max_payload_size` | int | `0` | Maximum bytes of request/response payload written per log line. `0` = no limit. Applied output-side only — the collector still captures the full body. |
| `request_headers` | boolean | `false` | Include captured request headers in the log line. No-op if `collector.request_headers` is `false`. |
| `request_body` | boolean | `false` | Include the captured request body. No-op if `collector.request_body` is `false`. |
| `response_headers` | boolean | `false` | Include captured response headers in the log line. No-op if `collector.response_headers` is `false`. |
| `response_body` | boolean | `false` | Include the captured response body. No-op if `collector.response_body` is `false`. |
| `exclude_fields` | array of strings | `[]` | Drop named fields from the emitted line. See [Field exclusion](#field-exclusion). |

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

## Redaction and payload control

* **`masked_headers`** redacts matching header values (case-insensitive) to `****` in the logged
  `requestHeaders`/`responseHeaders` maps. This is applied output-side by Traffic Logging only — other
  consumers of the collector (such as Moesif) are unaffected and receive unmasked headers.
* **`max_payload_size`** truncates the request/response body written to the log line. Set to `0`
  (default) for no limit.
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

## Ignoring paths

`collector.ignore_path_prefixes` suppresses the analytics event — and therefore the traffic-log
line — for matching paths, such as health checks or metrics scrapes:

```toml
[collector]
ignore_path_prefixes = ["/health", "/metrics"]
```

This is enforced by Envoy itself via an access-log filter, so the policy-engine never even receives
the request for a matching path.

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
| API | `api.id`, `api.name`, `api.version`, `api.context`, `api.kind`, `project.id` |
| Target | `target.statusCode`, `target.destination` |
| Application | `application.id`, `application.name`, `application.owner`, `application.keyType` — populated only when an auth policy that stamps application identity (currently `api-key-auth`) ran |
| Auth | `auth.subject`, `auth.type`, `auth.issuer`, `auth.credential_id`, `auth.token_id`, `auth.audience` (list), `auth.scopes` (list), `auth.property['<claim>']` (map), `auth.authenticated`, `auth.authorized` |
| Generic metadata | `metadata['<key>']` — any key any policy (including third-party/Python policies) has written into shared request metadata |

`auth.*` is populated generically for **any** authenticated request, regardless of which auth policy
(`jwt-auth`, `opaque-token-auth`, `api-key-auth`, and so on) ran. For an unauthenticated or denied
request, every `auth.*` scalar variable resolves to its zero value rather than erroring, so
`auth.subject != "" ? auth.subject : "anonymous"` is a safe pattern for a property that should always
resolve to something.

!!! note
    Indexing into a map or list variable (`auth.property['<claim>']`, `metadata['<key>']`,
    `auth.audience[0]`) still raises an error if the key or index is absent, and that property is
    silently omitted from the line. Guard map/list access with the `in` operator, as shown in the
    `tenant` and `appId` examples above.

!!! note
    Unlike headers, `metadata['<key>']` has **no masking configuration**. Shared request metadata is a
    generic, schema-less bag that any policy can write to, so any value referenced from
    `properties` is emitted verbatim. Avoid referencing metadata keys that may contain sensitive
    values.

A `$ctx:` expression that references a variable this surface doesn't expose (for example, a typo)
fails to compile when the gateway starts, is logged once, and that property is permanently omitted
from every line — it does not cause requests to fail.

## Example log line

```json
{
  "timestamp": "2026-07-10T09:12:33.482Z",
  "correlationId": "5f6b6e2a-2f38-4b7a-9c2f-6b6a2f384b7a",
  "status": 200,
  "api": {
    "id": "01998f3e-...",
    "name": "Weather-API",
    "version": "1.0.0",
    "context": "/weather",
    "kind": "REST"
  },
  "operation": {
    "method": "GET",
    "path": "/current"
  },
  "target": {
    "statusCode": 200,
    "destination": "https://backend.example.com/current"
  },
  "application": {
    "id": "app-123",
    "name": "Mobile App",
    "owner": "jdoe",
    "keyType": "PRODUCTION"
  },
  "client": {
    "ip": "203.0.113.10",
    "userAgent": "curl/8.4.0"
  },
  "latencies": {
    "durationUs": 18342,
    "requestMediationLatencyUs": 412,
    "responseMediationLatencyUs": 298,
    "backendLatencyUs": 17102
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
    "apiName": "Weather-API",
    "subject": "jdoe@example.com"
  }
}
```

Fields whose values are entirely empty (for example `application` on an unauthenticated request) are
omitted from the line rather than emitted as `{}`.

## Kubernetes / Helm

The Helm chart renders `[collector]` (all capture flags, `ignore_path_prefixes`),
`[collector.server].mode`, and the `[traffic_logging]` flow-selection booleans and `exclude_fields`
from `.Values.gateway.config`.

!!! note
    `[traffic_logging.properties]` is not yet rendered by the Helm chart. If you need CEL-derived
    custom properties in a Helm-deployed gateway, supply a custom `config.toml` override instead of
    Helm values.