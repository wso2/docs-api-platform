---
title: "Log requests and responses"
description: "Record the payload and headers of traffic passing through the AI Gateway, as a log line per request or through a policy on chosen operations."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/logging-and-tracing/log-requests-and-responses/
md_url: https://wso2.com/api-platform/docs/ai-gateway/logging-and-tracing/log-requests-and-responses.md
tags:
  - ai-gateway
  - logging
  - observability
  - traffic-logging
  - audit
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Log requests and responses

When a model returns something unexpected, the question is usually what was actually sent to it. Logging the content of the traffic answers that: the prompt as it reached the provider, the completion that came back, and the headers on both.

This is a different concern from [Gateway logs](gateway-logs.md), which are what the gateway process writes about itself. Those tell you that the gateway handled a request; these tell you what was in it.

## Log request and response content in two ways

The gateway offers a gateway-wide route and a per-operation route. They are independent, so you can use either or both.

**Traffic logging** emits a structured log line for every request the gateway handles. You turn it on in the gateway's `config.toml` and choose whether to capture request and response headers, bodies, or neither, with field-exclusion controls for the values you don't want recorded. Because it is configuration rather than a policy, it applies across the gateway instead of being attached to individual resources. For the settings, see [Traffic logging](../../../api-gateway/1.2.0/observability/traffic-logging.md) in the API Platform Gateway documentation, and for how `config.toml` is delivered and interpolated, see [Configuration and interpolation](../setup-and-deployment/configuration.md).

**The Log Message policy** records the payload and headers of the operations you attach it to. Use it when you want the content of one proxy, or one operation, rather than everything the gateway handles.

## Where the policy attaches

You add the policy to the `operationPolicies` block of an `LlmProxy`, to cover one application's traffic, or of an `LlmProvider`, to cover every proxy that consumes it. It runs in the request phase, the response phase, or both, so you can record one direction rather than the whole exchange.

## Handle logged content carefully

Prompts and completions carry whatever your users typed, so a log of them is as sensitive as the conversation itself. Capture bodies only while you need them, and mask identifying data before it is recorded by attaching a masking policy ahead of the logging policy — see the [PII Masking policy](../guardrails/guardrails-catalogue.md).

## Traffic logging policies

This policy is documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../../policy-hub/overview.md).

| Policy | What it does |
|--------|--------------|
| [Log Message](https://wso2.com/api-platform/policy-hub/policies/log-message) | Logs request/response payload and headers |

## Related topics

- [Gateway logs](gateway-logs.md) — collect the logs the gateway writes about itself.
- [Gateway tracing](tracing.md) — follow one request across hops when you need timing and causality rather than content.
- [Analytics](../analytics/index.md) — aggregate traffic over time instead of recording individual exchanges.
