---
title: "Logging and tracing"
description: "Collect the AI Gateway's own runtime logs, record the content of the traffic it carries, and follow a single request across the hops it makes."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/logging-and-tracing/
md_url: https://wso2.com/api-platform/docs/ai-gateway/logging-and-tracing.md
tags:
  - ai-gateway
  - logging
  - tracing
  - observability
  - opentelemetry
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Logging and tracing

Three different questions arise when gateway traffic behaves unexpectedly, and each one needs a different record. Was the gateway itself healthy? What did the request and the response actually contain? Where in the chain of hops did the latency or the error appear?

The pages in this section answer one question each:

| Page | What it covers |
|---|---|
| [Gateway logs](gateway-logs.md) | Configure centralized log collection for API Platform AI Gateway using Fluent Bit, OpenSearch, and alternative logging stacks. |
| [Log requests and responses](log-requests-and-responses.md) | Record the payload and headers of traffic passing through the AI Gateway, as a log line per request or through a policy on chosen operations. |
| [Tracing](tracing.md) | Configure distributed tracing for API Platform AI Gateway using OpenTelemetry and Jaeger, with support for cloud-native tracing backends. |

Gateway logs are the runtime's own output, so they tell you how the gateway is behaving. Request and response logging captures the traffic content, so it tells you what a caller sent and what a model returned. Tracing follows one request across every hop it makes, so it tells you where time went.

## How logging and tracing differ from analytics

These three records serve investigation: you reach for them when you have a specific request or a specific incident in mind. [Analytics](../analytics/index.md) serves the aggregate question instead — token consumption, cost, and traffic patterns over a period, across callers. Configure both. Neither substitutes for the other.

## Related topics

- [Analytics](../analytics/index.md) — aggregate traffic, token, and cost reporting for the traffic the gateway handles.
- [Timeouts and resilience](../timeouts-and-resilience.md) — the timeouts whose effects show up first in traces.
- [Token based rate limiting](../token-based-rate-limiting.md) — the token counts these logs record, enforced as a limit.
