---
title: "Cost control and budgets"
description: "Put a monetary ceiling on LLM usage through the AI Gateway: price each call as it passes and reject traffic once a budget is spent."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/cost-control-and-budgets/
md_url: https://wso2.com/api-platform/docs/ai-gateway/cost-control-and-budgets.md
tags:
  - ai-gateway
  - cost
  - budget
  - spend
  - cost-tracking
  - quota
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Cost control and budgets

A token count is not a bill. Models differ in price, prompt tokens and completion tokens are charged differently, and a team that stays inside its token quota can still spend more than you planned. Budgeting at the gateway puts the ceiling in currency, where the finance question actually lives.

## How the two cost policies work together

Two policies work as a pair. `LLM Cost` prices each call and stores the figure; `LLM Cost-Based Rate Limit` reads that figure and rejects traffic once the quota is spent. Attach both, in that order.

Attach them on an `LlmProvider` for a budget that covers every proxy consuming it, or on an `LlmProxy` for one application's budget. A call's cost is known only after the model reports its token usage, so enforcement happens in the response phase: the call that exhausts the budget completes, and the next one is rejected.

## Cost and budget policies

These policies are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../policy-hub/overview.md).

| Policy | What it does |
|--------|--------------|
| [LLM Cost](https://wso2.com/api-platform/policy-hub/policies/llm-cost) | Calculates the monetary cost of each LLM call and stores it for downstream policies |
| [LLM Cost-Based Rate Limit](https://wso2.com/api-platform/policy-hub/policies/llm-cost-based-ratelimit) | Enforces monetary budget quotas on LLM usage |

To cap by token count or request count instead, see [Token based rate limiting](token-based-rate-limiting.md).

## Related topics

- [Set up a governed multi-model LLM proxy](../../guides/ai-and-mcp/set-up-a-governed-multi-model-llm-proxy-with-cost-controls-and-failover.md) — distributes traffic across models behind one proxy, with per-team token budgets, PII masking, and semantic caching.
- [Semantic caching](semantic-caching.md) — cut spend by not making the upstream call at all.
- [Token based rate limiting](token-based-rate-limiting.md) — cap consumption by tokens or requests rather than by spend.
