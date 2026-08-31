---
title: "How the AI Gateway works"
description: "How the AI Gateway handles AI traffic: LLM proxies, LLM providers, MCP proxies, where policies attach, provider templates, and streaming responses."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/how-it-works/
md_url: https://wso2.com/api-platform/docs/ai-gateway/how-it-works.md
tags:
  - ai-gateway
  - llm
  - mcp
  - architecture
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-12
content_type: "concept"
---

# How it works

This page describes the artifacts a request passes through in the AI Gateway, where you attach policies, and how the gateway handles streaming responses.

## Architecture

The following diagram shows the artifacts a request passes through:

```
        AI apps              MCP clients
           │                      │
           ▼                      ▼
┌────────────────────────────────────────────┐
│ AI Gateway                                 │
│                                            │
│  ┌───────────────┐      ┌───────────────┐  │
│  │   LLM Proxy   │      │   MCP Proxy   │  │
│  └───────┬───────┘      └───────┬───────┘  │
│          │                      │          │
│          ▼                      │          │
│  ┌───────────────┐              │          │
│  │  LLM Provider │              │          │
│  └───────┬───────┘              │          │
└──────────┼──────────────────────┼──────────┘
           ▼                      ▼
     LLM services            MCP servers
```

Client traffic reaches the gateway on the router ports: 8443 for HTTPS and 8080 for HTTP. An AI application calls an LLM Proxy at its own URL context, such as `/assistant`. An MCP client calls an MCP Proxy at its context, such as `/everything`.

An LLM Proxy names the provider it consumes in its `provider.id` field, so a request that arrives at the proxy leaves through that LLM Provider. The provider holds the template, the upstream service URL, the credentials for that service, and the `accessControl` rules that decide which upstream endpoints it exposes. An MCP Proxy routes to its MCP server directly, without a provider.

You attach policies at three points: on an LLM Proxy, on an LLM Provider, and on an MCP Proxy. A request through an LLM Proxy runs the proxy's policy chain first, then the provider's chain. For the phase-by-phase order, and how the two chains reverse on the response path, see [Guardrail execution order](guardrails/execution-order.md).

## How a request flows

1. Administrators verify the Gateway-Controller admin health endpoint and configure LLM Providers and MCP Proxies via the Gateway-Controller API
2. Developers create LLM Proxies to build AI applications on top of available providers
3. The gateway routes traffic, applies policies, and manages authentication

## LLM provider templates

An LLM Provider Template defines the characteristics and behaviors specific to an AI service provider, such as OpenAI, Azure OpenAI, or other LLM platforms. It describes how the gateway should interpret and extract usage and operational metadata, including prompt, completion, total, and remaining token information, as well as request and response model metadata.

The gateway ships with these provider templates, loaded at startup:

| Template ID | Provider |
|-------------|----------|
| `openai` | OpenAI |
| `azure-openai` | Azure OpenAI |
| `anthropic` | Anthropic |
| `gemini` | Gemini |
| `mistralai` | MistralAI |
| `awsbedrock` | AWS Bedrock |
| `azureai-foundry` | Azure AI Foundry |

For the extraction configuration each template applies, see [LLM provider templates](./reference/llm-templates.md).

## Streaming

When an upstream service streams its response, the gateway relays it to the client chunk by chunk instead of buffering the whole response. This holds for LLM providers and LLM proxies, and needs no configuration. On MCP proxies, request bodies stream, but response bodies stay buffered. See [Real-time AI streaming](./streaming-responses.md).
