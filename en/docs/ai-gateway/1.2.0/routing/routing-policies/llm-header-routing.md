---
title: "LLM header routing"
description: "Select an LLM provider from a request header with the llm-header-router policy, using an ordered mapping and an optional default provider."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/routing/routing-policies/llm-header-routing/
md_url: https://wso2.com/api-platform/docs/ai-gateway/routing/routing-policies/llm-header-routing.md
tags:
  - ai-gateway
  - routing
  - llm
  - header-routing
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# LLM header routing

Use `llm-header-router` when the application, or an earlier policy in the chain, must name the provider explicitly rather than leave the choice to the gateway. The router reads a request header, matches its value against an ordered mapping, and publishes the selected provider name.

Unlike the round robin policies, the header router selects a single provider rather than distributing across a pool, so it carries no suspension or failover behavior.

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `mappings` | Yes | None | Ordered list of header values and effective provider names. At least one mapping is required. |
| `headerName` | No | `x-provider` | Header used for provider selection. Header-name lookup is case-insensitive. |
| `defaultProvider` | No | Unset | Provider selected when the header is missing, empty, or unmatched. If unset, the primary provider is used. |

The router has the following selection behavior:

- Uses only the first value when the header appears more than once
- Trims leading and trailing whitespace from the value
- Matches configured values case-insensitively
- Rejects duplicate mapping values case-insensitively
- Preserves a non-empty provider selection made by an earlier policy
- Leaves the routing header on the upstream request

The header router publishes provider-selection metadata but does not by itself override the named upstream. An additional provider therefore needs a matching inline transformer, or another policy that explicitly sets its upstream.

## Policy reference

This policy is documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. See [LLM Header Router](https://wso2.com/api-platform/policy-hub/policies/llm-header-router) for its complete configuration.

## Related topics

- [Multi-provider routing](../multi-provider-routing.md) — the worked configuration this policy appears in, including the transformer each additional provider needs.
- [Load balancing and failover](load-balancing-and-failover.md) — the round robin policies, for distributing across a pool instead of naming one provider.
- [Multi model routing](../multi-model-routing.md) — the use-case page for distributing traffic across models.
