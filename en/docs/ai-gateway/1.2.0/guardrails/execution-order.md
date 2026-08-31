---
title: "Guardrail execution order"
description: "How guardrails execute in the dual-hop model: the LLM Proxy chain runs before the LLM Provider chain on request, and in reverse on response."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/guardrails/execution-order/
md_url: https://wso2.com/api-platform/docs/ai-gateway/guardrails/execution-order.md
tags:
  - ai-gateway
  - guardrails
  - llm-proxy
  - llm-provider
  - execution-order
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "concept"
---

# Guardrail execution order

The AI Gateway routes every request through two policy chains in sequence: the **LLM Proxy chain** and the **LLM Provider chain**. Each chain runs the same four execution phases, but the order in which the two chains execute differs between the request and response paths.

This document covers the dual-hop execution model. For foundational concepts — within-chain policy ordering, streaming mode, and short-circuit behavior — see [Policy execution order](../../../api-gateway/1.2.0/policies/policy-execution-order.md). The same rules apply to each chain individually.

## The two chains

- **LLM Proxy chain**: Guardrails attached to the LLM Proxy. These run on every request before it reaches any LLM provider, making them the right place for organization-wide content policies.
- **LLM Provider chain**: Policies attached to a specific LLM Provider. These run after the Proxy chain and include provider-level transformations, upstream authentication, and any provider-scoped guardrails.

## Request path

On the request path, the LLM Proxy chain runs first, followed by the LLM Provider chain.

**Headers phase:**

```
Client
  │
  ▼  OnRequestHeaders (forward order: Policy 1 → ... → Policy N)
[LLM Proxy chain]
  │  (internal hop to LLM Provider)
  ▼  OnRequestHeaders (forward order: Policy 1 → ... → Policy M)
[LLM Provider chain]
  │
  ▼
 LLM
```

**Body phase:**

After the headers phase completes for both chains, the request body is processed in the same order.

```
Client
  │
  ▼  OnRequestBody / OnRequestBodyChunk (forward order)
[LLM Proxy chain]
  │
  ▼  OnRequestBody (forward order)
[LLM Provider chain]
  │
  ▼
 LLM
```

## Response path

On the response path, the order is reversed at the chain level. The LLM Provider chain processes the response first, then the LLM Proxy chain.

```
 LLM
  │
  ▼  OnResponseHeaders / OnResponseBody (reverse order: Policy M → ... → Policy 1)
[LLM Provider chain]
  │  (internal hop back to LLM Proxy)
  ▼  OnResponseHeaders / OnResponseBody (reverse order: Policy N → ... → Policy 1)
[LLM Proxy chain]
  │
  ▼
Client
```

The following diagram shows how requests pass through the LLM Proxy chain and LLM Provider chain in sequence, and how responses return through both chains in reverse order:

![Diagram of dual-hop guardrail execution: a request traverses the LLM Proxy chain then the LLM Provider chain, and the response returns in reverse order](../../../assets/img/api-gateway/gateway-policy-execution-order-llm-provider-proxy.png)
<!-- image source: https://docs.google.com/drawings/d/1Hvnv_89Hd0T5JQr1tg0DLIQTHWDn2szgj13NDhjyccM/edit?usp=sharing -->

This mirrors the request wrapping at the chain level: the LLM Proxy wraps the LLM Provider on the way in, so on the way back the inner chain (Provider) unwinds first, then the outer chain (Proxy).

## Summary

| Path | Chain execution order | Within-chain policy order |
|------|-----------------------|--------------------------|
| Request headers | LLM Proxy → LLM Provider → LLM | Forward (Policy 1 first) |
| Request body | LLM Proxy → LLM Provider → LLM | Forward (Policy 1 first) |
| Response | LLM → LLM Provider → LLM Proxy → Client | Reverse (last policy first) |

## Streaming mode

When an LLM returns a streaming response (such as SSE from a chat completion endpoint), body chunks flow through both chains independently — the LLM Proxy chain processes each chunk first, then the LLM Provider chain, following the same request-path order.

The following diagram shows how streaming body chunks flow through the policy chain at each hop:

![Diagram of streaming policy chain execution order, with request body chunks flowing forward through the chain and response chunks flowing in reverse](../../../assets/img/api-gateway/gateway-policy-execution-order-streaming.png)
<!-- image source: https://docs.google.com/drawings/d/1HyceTR0htslHoBm3xintrMkZo0jqKfHhnhAcctGgUDs/edit?usp=sharing -->

## Related topics

- [Guardrails overview](index.md)
- [Policy execution order](../../../api-gateway/1.2.0/policies/policy-execution-order.md) — within-chain ordering, streaming, and short-circuit rules that apply to each chain individually
