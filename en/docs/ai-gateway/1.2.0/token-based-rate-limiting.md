---
title: "Token based rate limiting"
description: "Cap LLM consumption through the AI Gateway by the tokens a model processed, so one application cannot exhaust a shared model quota."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/token-based-rate-limiting/
md_url: https://wso2.com/api-platform/docs/ai-gateway/token-based-rate-limiting.md
tags:
  - ai-gateway
  - rate-limiting
  - token-based-rate-limiting
  - traffic
  - quota
  - throttling
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Token based rate limiting

A single application can exhaust a shared model quota in minutes, and the request count tells you nothing about how much of that quota it used. One request can carry a sentence or a whole document, so a cap of 1,000 requests an hour holds two very different workloads to the same number.

Token based rate limiting counts the tokens the model processed rather than the calls the client made. It tracks LLM consumption closely enough to protect a shared quota, and it caps the client that consumes the most instead of the client that calls the most.

## Where token limits apply

You attach a token based rate limit policy in the `operationPolicies` block of an `LlmProxy`, to cap one application, or of an `LlmProvider`, to cap every proxy that consumes it.

Token based limits read usage from the model's response, so they take effect in the response phase. The request that crosses the threshold still reaches the model, and the gateway rejects the next one.

## Rate limiting policies

This policy is documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../policy-hub/overview.md).

| Policy | What it does |
|--------|--------------|
| [Token-Based Rate Limit](https://wso2.com/api-platform/policy-hub/policies/token-based-ratelimit) | Caps usage by token count rather than request count |

To cap spend in currency rather than in tokens, see [Cost control and budgets](cost-control-and-budgets.md). For MCP traffic, which is limited per tool, resource, prompt, or JSON-RPC method, see [MCP governance](mcp-governance.md).

## Request based limiting

If you also need a ceiling on the number of calls a client can make, the gateway carries two request based policies. Both apply before the call goes upstream, and both work on any API rather than only on LLM traffic.

| Policy | What it does |
|--------|--------------|
| [Rate Limit - Basic](https://wso2.com/api-platform/policy-hub/policies/basic-ratelimit) | Caps requests per time window |
| [Rate Limit - Advanced](https://wso2.com/api-platform/policy-hub/policies/advanced-ratelimit) | Multi-dimensional quotas with GCRA or fixed-window algorithms, Redis backend support, and weighted limiting |

Use either alongside a token based limit when a client should be held to both a call ceiling and a consumption ceiling.

## Related topics

- [Enforce token-based rate limiting on an LLM proxy](../../guides/ai-and-mcp/enforce-token-based-rate-limiting-on-an-llm-proxy.md) — caps token consumption on a proxy within a rolling window, so one application cannot exhaust the budget.
- [Authenticate clients](authenticate-clients.md) — issue a key per application, so a limit applies to a caller you can identify.
- [Cost control and budgets](cost-control-and-budgets.md) — enforce a monetary ceiling instead of a usage ceiling.
