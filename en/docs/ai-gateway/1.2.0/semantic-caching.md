---
title: "Semantic caching"
description: "Serve a cached LLM response when a semantically equivalent prompt has already been answered, cutting both latency and upstream token spend."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/semantic-caching/
md_url: https://wso2.com/api-platform/docs/ai-gateway/semantic-caching.md
tags:
  - ai-gateway
  - caching
  - cost
  - cache
  - redis
  - embeddings
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Semantic caching

People ask the same question in different words. A conventional cache misses every one of those, because it matches on the exact string and the strings differ. A semantic cache compares meaning instead, so a prompt that means what an earlier prompt meant is answered from the cache.

A cache hit skips the upstream call entirely. That removes the latency of the model round trip and the tokens it would have charged for.

## Where the cache sits in the request path

The `Semantic Cache` policy converts the prompt into a vector, searches a vector store for a previously answered prompt above a similarity threshold, and returns that stored response when it finds one. A miss goes upstream as normal, and the response is stored for next time.

Attach it on an `LlmProxy` to cache one application's traffic, or on an `LlmProvider` to cache every proxy that consumes it. The policy needs an embedding provider to produce the vectors and a vector store to hold them; the Policy Hub page lists the backends it supports and the threshold and expiry settings that decide how readily it treats two prompts as equivalent.

Set that threshold deliberately. Too loose and the gateway answers one question with another question's answer.

## Caching policies

This policy is documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../policy-hub/overview.md).

| Policy | What it does |
|--------|--------------|
| [Semantic Cache](https://wso2.com/api-platform/policy-hub/policies/semantic-cache) | Caches LLM responses using vector similarity, returning cached results for semantically equivalent prompts |

## Related topics

- [Set up a governed multi-model LLM proxy](../../guides/ai-and-mcp/set-up-a-governed-multi-model-llm-proxy-with-cost-controls-and-failover.md) — distributes traffic across models behind one proxy, with per-team token budgets, PII masking, and semantic caching.
- [Cost control and budgets](cost-control-and-budgets.md) — put a monetary ceiling on the calls that do reach a model.
- [Prompt management](prompt-management.md) — compress a prompt to reduce the tokens a cache miss costs.
