---
title: "Traffic Logging"
description: "Learn how the API Platform Gateway writes a structured JSON log line for every API request, and turn on traffic logging with a minimal configuration."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/overview/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/overview.md
tags:
  - api-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "concept"
---

{% raw %}
# Traffic Logging

## Overview

Traffic Logging writes a single structured JSON line for every request handled by the gateway. It records who
called what, the status code, latencies, request/response headers, and (optionally) bodies.

To write each line in your own JSON layout instead, see [Custom log format](custom-log-format.md).

The router also writes its own access log line for every request, with HTTP and connection details. See [Router Access Logs](../access-logs.md).

Each line is written to the **sinks** you name in `traffic_logging.outputs`:

| Sink | Where the line goes | Use it when |
|---|---|---|
| `stdout` | The policy-engine container log, and therefore the node's `/var/log/pods` files | A node-level collector (Fluent Bit, Fluentd, CloudWatch agent) is already scraping container logs, and the lines carry no payloads you need to keep off the node. **This is the default.** |
| `file` | A rotating file on a writable volume | You want payloads out of the container log and away from every node-level collector, and you have (or can mount) a per-pod volume. |
| `http` | Batched `POST`s to a log receiver you name | You want the lines to leave the pod directly, with no disk, no co-located collector, and no sidecar or DaemonSet. |

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

Because emission happens on Envoy's access-log path, it fires for every request Envoy terminates,
including requests denied by an auth policy before they reach any downstream logic.

Two properties hold for every sink:

* **Nothing in the sink path is on the request/response path.** Traffic-log lines are produced from
  Envoy's access-log stream, which Envoy emits *after* the response has been sent to the client. A slow
  or unreachable log receiver cannot add latency to an API call or fail one.
* **Sink construction fails closed; delivery fails open.** A file that cannot be opened or an endpoint
  that cannot be built fails gateway startup. No sink silently degrades to `stdout`, because that would
  put payloads back into the container log the operator chose `file`/`http` to keep them out of. At
  runtime, by contrast, a delivery failure drops the line and counts it (see
  [Monitoring the sinks](log-outputs.md#monitoring-the-sinks)); it never blocks request processing and never falls
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
every request to every API, with headers redacted per `masked_headers`.

To collect these lines in one place with the other gateway logs, see [Centralized Logging](../logging.md).

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

The same line is written to every configured sink, so with `outputs = ["file", "http"]` one request
produces one line in the file **and** one line in the batch sent to the receiver.

## What's next

* To choose what each line includes, mask headers, exclude fields, skip paths, or add custom properties, see [Configure Traffic Logging](configuration.md).
* To write lines to a file or send them to an HTTP endpoint, and to monitor delivery, see [Log Outputs](log-outputs.md).
* To write each line in your own JSON layout, see [Custom Log Format](custom-log-format.md).
* To see the values you can read from each request, see [Variable Reference](variable-reference.md).

{% endraw %}
