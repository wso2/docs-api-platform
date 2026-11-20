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

Traffic logging writes one structured JSON line for every API request the gateway handles. Each line
records who called which API, the status code, latencies and, if you choose, headers and bodies.

Traffic logs help you do the following.

* Find out why a request failed.
* Audit who called which API, and when.
* Track latency and error rates.
* Send request records to your log platform.

## How it works

```text
Client ──► Gateway ──► Backend
              │
              └── after the response is sent, one JSON line per request
                      ──► stdout (default), a file or an HTTP endpoint
```

* Lines are written after the response is sent, so traffic logging does not slow down API calls.
* Every request is logged, including requests that a policy rejects.
* Lines go to the gateway's standard output by default. You can also write them to a file or send them
  to an HTTP endpoint. See [Log Outputs](log-outputs.md).

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
    "destination": "backend.example.com/current"
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

## What's next

* To choose what each line includes, mask headers, exclude fields, skip paths, or add custom properties, see [Configure Traffic Logging](configuration.md).
* To write lines to a file or send them to an HTTP endpoint, and to monitor delivery, see [Log Outputs](log-outputs.md).
* To write each line in your own JSON layout, see [Custom Log Format](custom-log-format.md).
* To see the values you can read from each request, see [Variable Reference](variable-reference.md).
* For the router's own access log line for every request, see [Router Access Logs](../access-logs.md).

{% endraw %}
