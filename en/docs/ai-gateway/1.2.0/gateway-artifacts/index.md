---
title: "Gateway artifacts"
description: "The three resources you deploy on the AI Gateway: what an LLM provider holds, what an LLM proxy adds on top of it, and how an MCP proxy differs."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts.md
tags:
  - ai-gateway
  - llm-provider
  - llm-proxy
  - mcp-proxy
  - artifacts
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Gateway artifacts

You deploy three kinds of resource on the AI Gateway, and a request passes through one or two of them on its way upstream.

An `LlmProvider` holds the connection to one AI backend service. An `LlmProxy` exposes that connection at a URL of your own and names the provider it consumes in `provider.id`; the gateway rejects a proxy whose `provider.id` doesn't match a deployed provider. An `Mcp` proxy routes Model Context Protocol traffic to an MCP server directly, so it names no provider at all.

## How LLM providers and LLM proxies differ

The split matters because the two LLM artifacts hold different things, and are usually deployed by different people:

| | `LlmProvider` | `LlmProxy` |
|---|---|---|
| Count | One per upstream service | Many on top of one provider |
| Holds | The provider template, the upstream URL, the credentials, and `accessControl` | A URL context, a `provider.id`, and its own policies |
| Deployed by | Platform administrators, who hold the upstream credentials | AI developers, who build one endpoint per application |

Deploy a provider once for each backend service you connect. Deploy a proxy for each application that needs its own URL, its own policies, or both. Several proxies consuming one provider is the ordinary case rather than the exception.

## Policy inheritance from provider to proxy

A request through an `LlmProxy` runs the proxy's policy chain first, then the provider's. Some settings are therefore available on both artifacts, and some belong to only one:

| Setting | Where you can set it |
|---|---|
| Upstream credentials | Provider only |
| `accessControl`, which decides the endpoints the provider exposes | Provider only |
| Guardrails | Either, and both chains run |
| Token limits and cost limits | Either, and both chains run |
| Client authentication | Either, and both chains run |

A limit set on the provider applies to every proxy that consumes it, so it caps the total. A limit set on one proxy caps only that proxy's traffic. Set both when one application must be held to a share of a budget the provider caps overall.

For the phase-by-phase order, and how the two chains reverse on the response path, see [Guardrail execution order](../guardrails/execution-order.md).

## In this section

| Page | What it covers |
|------|----------------|
| [LLM provider](llm-provider/index.md) | Connect the AI Gateway to an LLM backend: what an LLM Provider holds, who configures it, and a guide for every provider template it ships. |
| [LLM proxy](llm-proxy.md) | Expose an LLM provider through an LLM proxy and deploy one: its own URL context, per-application policies, and the provider rules it inherits. |
| [MCP proxy](mcp-proxy.md) | Route Model Context Protocol traffic through the AI Gateway with an MCP proxy, then deploy one and connect an MCP client to it. |

## Related topics

- [How it works](../how-it-works.md) — where these artifacts sit in the request path.
- [Routing](../routing/index.md) — put one proxy in front of several providers or models.
- [MCP governance](../mcp-governance.md) — the policies that attach to an `Mcp` proxy.
