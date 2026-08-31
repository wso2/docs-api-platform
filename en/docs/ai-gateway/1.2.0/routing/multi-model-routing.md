---
title: "Multi model routing"
description: "Distribute LLM proxy traffic across a pool of models with round robin or weighted round robin, and move off a model that starts returning errors."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/routing/multi-model-routing/
md_url: https://wso2.com/api-platform/docs/ai-gateway/routing/multi-model-routing.md
tags:
  - ai-gateway
  - routing
  - load-balancing
  - failover
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Multi model routing

One model is one quota and one point of failure. When every request goes to the same model, a saturated quota stops your traffic, and an upstream incident stops it too. Distributing requests across a pool of models raises the ceiling on both.

Two policies do the distribution. `model-round-robin` cycles through the pool in turn. `model-weighted-round-robin` splits traffic in proportion to a weight you set per model, which suits a pool whose models differ in capacity, cost, or performance.

A model entry can name a `provider`, so a pool is not confined to one provider. Multi model routing and [multi-provider routing](multi-provider-routing.md) overlap rather than divide: this page distributes across models, that page puts several providers behind one OpenAI-compatible endpoint, and one pool can do both at once.

## Round robin

Use `model-round-robin` to cycle deterministically through a list of models. A model entry can include a `provider` to route that model to an additional provider. When `provider` is omitted, the model uses the primary provider.

```yaml
operationPolicies:
  - name: model-round-robin
    version: v1
    paths:
      - path: /chat/completions
        methods: [POST]
        params:
          models:
            - model: gpt-4o
            - model: claude-sonnet-4-5-20250929
              provider: anthropic-provider
          suspendDuration: 30
```

The policy rewrites the model at the location defined by the provider template. It can rewrite a model in the request payload, a header, a query parameter, or a path parameter.

See [Model Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-round-robin) for its complete configuration.

## Weighted round robin

Use `model-weighted-round-robin` to distribute requests in a deterministic weighted cycle. Each entry requires an integer `weight` of at least `1`.

```yaml
operationPolicies:
  - name: model-weighted-round-robin
    version: v1
    paths:
      - path: /chat/completions
        methods: [POST]
        params:
          models:
            - model: gpt-4o
              weight: 2
            - model: claude-sonnet-4-5-20250929
              provider: anthropic-provider
              weight: 1
          suspendDuration: 30
```

This example produces the repeating sequence `gpt-4o`, `gpt-4o`, `claude-sonnet-4-5-20250929` while both targets are available. It provides proportional deterministic distribution, not random or performance-based load balancing.

See [Model Weighted Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-weighted-round-robin) for its complete configuration.

## What happens when a model fails

The failover behavior comes with the round robin policies. When a model returns a `5xx` or `429`, the policy suspends it for a configurable duration and sends traffic to the rest of the pool, rather than retrying an endpoint that is already failing.

Suspension does not retry the request that failed. The caller sees the error from the model that returned it, and the next request goes to a different target. Set `suspendDuration` to `0` to disable suspension.

For how long the gateway waits before it treats an upstream as failed, see [Timeouts and resilience](../timeouts-and-resilience.md).

## Related topics

- [Load balancing and failover](routing-policies/load-balancing-and-failover.md) — the policy reference for the two round robin policies.
- [LLM header routing](routing-policies/llm-header-routing.md) — select a provider from a request header instead of distributing across a pool.
- [Multi-provider routing](multi-provider-routing.md) — the worked configuration for several providers behind one proxy, including the transformer each provider needs.
- [Set up a governed multi-model LLM proxy](../../../guides/ai-and-mcp/set-up-a-governed-multi-model-llm-proxy-with-cost-controls-and-failover.md) — distributes traffic across models behind one proxy, with per-team token budgets, PII masking, and semantic caching.
