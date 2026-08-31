---
title: "Transform requests and responses"
description: "Change a request or response as it passes through the AI Gateway: add or strip headers, and answer a call at the gateway without going upstream."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/transform-requests-and-responses/
md_url: https://wso2.com/api-platform/docs/ai-gateway/transform-requests-and-responses.md
tags:
  - ai-gateway
  - transformation
  - headers
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Transform requests and responses

Sometimes the call a client sends is not quite the call the upstream should receive. A provider expects a header the client doesn't set, an internal header shouldn't leak to a third-party model, or a request should be answered at the gateway instead of going upstream at all.

These policies apply to any API the gateway fronts, not only to LLM and MCP traffic.

## Where transformation policies run

You attach them in the `operationPolicies` block of an `LlmProxy`, an `LlmProvider`, or an `Mcp` resource. Each policy declares the phase it runs in: a header set on the request reaches the upstream, while one set on the response reaches the client.

Position in the chain decides what a policy sees. A header removed before a logging policy runs never appears in the log; removed after, it does. For how the gateway sequences a chain, see [Guardrail execution order](guardrails/execution-order.md).

## Transformation policies

These policies are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../policy-hub/overview.md).

| Policy | What it does |
|--------|--------------|
| [Set Headers](https://wso2.com/api-platform/policy-hub/policies/set-headers) | Adds or overwrites headers on requests or responses |
| [Remove Headers](https://wso2.com/api-platform/policy-hub/policies/remove-headers) | Strips specified headers from requests or responses |
| [Respond](https://wso2.com/api-platform/policy-hub/policies/respond) | Returns an immediate response without forwarding to the upstream backend |

The Policy Hub's Transformation category covers further options that apply to any API: rewriting a request's path, query parameters, or method; overriding the `Host` header sent upstream; routing to a named upstream at runtime; converting payloads between JSON and XML; and calling an external HTTP service during the request or response phase. See the [Policy Hub overview](../../policy-hub/overview.md) for the full category.

To translate an OpenAI-shaped request into another provider's API shape, which is a transformation with its own dedicated policies, see [Multi-provider routing](routing/multi-provider-routing.md).

## Related topics

- [Prompt management](prompt-management.md) — reshape the prompt itself rather than the envelope around it.
- [Analytics header filter](analytics/analytics-header-filter.md) — control which headers reach an analytics backend, rather than which reach the upstream.
- [Multi-provider routing](routing/multi-provider-routing.md) — the provider-shape transformers and how they pair with routing.
