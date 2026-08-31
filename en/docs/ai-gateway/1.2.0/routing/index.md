---
title: "Routing"
description: "Route AI Gateway traffic across LLM providers and models, with the policies that select a provider, distribute across a pool, and suspend a failing model."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/routing/
md_url: https://wso2.com/api-platform/docs/ai-gateway/routing.md
tags:
  - ai-gateway
  - routing
  - load-balancing
  - failover
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Routing

Routing decides which upstream serves a request after the gateway has accepted it. One LLM proxy exposes a single OpenAI-compatible endpoint, and a routing policy chooses the provider, the model, or both. The calling application changes neither its endpoint nor its request format.

Routing matters for three reasons:

- A single model is a single quota.
- A single provider is a single point of failure.
- Models differ enough in cost and capability that sending every request to one of them is rarely the right default.

## In this section

The pages in this section cover the two routing dimensions and the policy-level reference for each mechanism:

| Page | What it covers |
|---|---|
| [Multi-provider routing](multi-provider-routing.md) | One OpenAI-compatible proxy in front of several providers, with the transformer each provider needs |
| [Multi model routing](multi-model-routing.md) | Distributing traffic across models, and what happens when one starts failing |
| [Load balancing and failover](routing-policies/load-balancing-and-failover.md) | The policy reference for the round robin and weighted round robin policies |
| [LLM header routing](routing-policies/llm-header-routing.md) | The policy reference for selecting a provider from a request header |

## Combine provider and model routing

The two dimensions are related rather than exclusive. Each entry in a `model-round-robin` or `model-weighted-round-robin` pool accepts an optional `provider`, and a model that omits it uses the primary provider. One pool can therefore mix models from several providers, which makes multi model routing a way to route across providers as well.

Read [Multi-provider routing](multi-provider-routing.md) when the endpoint shape is the problem — an application speaks OpenAI and the upstream does not. Read [Multi model routing](multi-model-routing.md) when the distribution is the problem — one model cannot absorb the traffic, or must not be the only one that can.

## Related topics

- [Timeouts and resilience](../timeouts-and-resilience.md) — how long the gateway waits before it treats an upstream as failed.
- [Transform requests and responses](../transform-requests-and-responses.md) — the transformer policies that convert between provider request shapes.
- [LLM proxy](../gateway-artifacts/llm-proxy.md) — the artifact these policies attach to.
