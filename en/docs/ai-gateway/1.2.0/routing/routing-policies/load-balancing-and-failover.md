---
title: "Load balancing and failover"
description: "Spread AI traffic across a pool of models with the round robin and weighted round robin policies, and move off a model that starts returning errors."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/routing/routing-policies/load-balancing-and-failover/
md_url: https://wso2.com/api-platform/docs/ai-gateway/routing/routing-policies/load-balancing-and-failover.md
tags:
  - ai-gateway
  - load-balancing
  - failover
  - fallback
  - routing
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Load balancing and failover

One model endpoint is one quota and one point of failure. Spreading requests across several keeps throughput up when a model is saturated, and keeps traffic moving when a model starts returning errors.

## How the gateway distributes traffic

Two policies distribute traffic across a pool of models:

- **Round robin** sends requests to each model in the pool in turn, so allocation evens out over time and no single model carries the whole load.
- **Weighted round robin** distributes in proportion to a weight you set per model, which suits a pool whose models differ in capacity, cost, or performance.

The failover behavior comes with the round robin policies. When a model returns a `5xx` or `429`, the policy suspends it for a configurable duration and sends traffic to the rest of the pool, rather than retrying an endpoint that is already failing.

To let the caller, or an earlier policy, name the provider explicitly through a request header, see [LLM header routing](llm-header-routing.md). That policy selects a provider rather than distributing across a pool, so it carries no failover behavior.

Attach these policies on an `LlmProxy`, which is where a pool of providers is assembled. They run in the request phase, selecting the upstream before the call goes out.

## Load balancing policies

These policies are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../../../policy-hub/overview.md).

| Policy | What it does |
|--------|--------------|
| [Model Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-round-robin) | Distributes requests evenly across a pool of AI model endpoints |
| [Model Weighted Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-weighted-round-robin) | Distributes requests across model endpoints according to configured weights |

## Related topics

- [Multi model routing](../multi-model-routing.md) — the use-case page: why you distribute across models, with the round robin and weighted round robin configuration in full.
- [Multi-provider routing](../multi-provider-routing.md) — the worked configuration: several providers behind one OpenAI-compatible proxy, the transformer each provider needs, and how suspension behaves in practice.
- [Set up a governed multi-model LLM proxy](../../../../guides/ai-and-mcp/set-up-a-governed-multi-model-llm-proxy-with-cost-controls-and-failover.md) — distributes traffic across models behind one proxy, with per-team token budgets, PII masking, and semantic caching.
- [Timeouts and resilience](../../timeouts-and-resilience.md) — decide how long the gateway waits before it treats an upstream as failed.
