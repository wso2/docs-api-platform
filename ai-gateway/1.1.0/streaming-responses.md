---
title: "Real-Time AI Streaming"
description: "Stream responses through API Platform AI Gateway chunk by chunk across LLM providers, LLM proxies, and MCP proxies, and understand how policies, analytics, and token usage behave."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/streaming-responses/
md_url: https://wso2.com/api-platform/docs/ai-gateway/streaming-responses.md
tags:
  - ai-gateway
  - llm
  - mcp
  - streaming
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-04
content_type: "concept"
---

# Real-time AI streaming

The AI Gateway forwards a streamed response to the client chunk by chunk, as each chunk arrives from the upstream service. The gateway doesn't hold the response until the upstream finishes generating it, so the first token reaches your application at about the same time it leaves the provider. Chat interfaces and agent loops keep their token-by-token behavior when they run through the gateway.

Streaming applies across the gateway's artifact types:

- **LLM providers** — a request sent straight to a provider endpoint, such as `/openai/latest/chat/completions`, streams when the upstream streams.
- **App LLM proxies** — a proxy inherits the streaming behavior of the provider it consumes.
- **MCP proxies** — request bodies stream, and responses are handled differently. See [MCP proxies](#mcp-proxies).

This page is for AI developers building on the gateway, and for platform administrators deciding which policies to attach.

## How the gateway detects a streaming response

Streaming needs no configuration on the `LlmProvider` or `Mcp` resource. The gateway decides per response, based on what the upstream sends:

- The response carries `Content-Type: text/event-stream`, which is how OpenAI-compatible providers return Server-Sent Events (SSE).
- The response carries `Transfer-Encoding: chunked`.

When either holds, the gateway switches the response body to full-duplex streaming and relays each chunk downstream as it arrives. The gateway applies the same two checks to request bodies, so a chunked or SSE request body also streams upstream.

To stream an LLM response, set `"stream": true` in the request body, exactly as you would when calling the provider directly. The following example calls an OpenAI provider deployed at `/openai/latest`:

```bash
curl -N -X POST "https://localhost:8443/openai/latest/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": "Write a haiku about API gateways."
      }
    ]
  }' -k
```

The same request works against an App LLM proxy. Replace `/openai/latest` with the proxy context, such as `/assistant`.

The `-N` flag turns off curl's own output buffering, so you see the SSE events as they arrive rather than all at once at the end.

## How policies behave on a streamed response

Whether a response streams depends on the policies attached to the route. A policy that reads the response body either supports chunk-by-chunk processing or requires the complete body.

**Every response-body policy on the chain must support streaming.** The gateway evaluates this per route, and it's all or nothing:

- If every response-body policy supports streaming, the gateway streams the response to the client.
- If one policy requires the complete body, the gateway buffers the entire response, runs the chain, and then sends the response in one piece. The result is still correct, but the client waits for the last token before it sees the first.

The chain spans both levels. For a request through an App LLM proxy, it covers the enterprise-wide policies the platform administrator attached to the `LlmProvider` and the application-specific policies the developer attached to the proxy. A buffered-only policy at either level buffers the response.

Policies that don't read the response body — authentication, request-side rate limiting, header policies, prompt management — never affect streaming.

### Gating policies

A streaming-capable policy can still hold bytes back when it has to. A guardrail that enforces a minimum, such as a minimum sentence count, can't rule on content it hasn't seen. Such a policy accumulates chunks silently until it has enough content to decide, releases what it has accumulated, and then processes each later chunk as it arrives. The client sees a pause at the start of the response rather than a wait for the whole response.

### MCP proxies

Response bodies on MCP proxies stay buffered, even when the MCP server replies with a chunked or SSE body. The gateway runs the response chain against the complete body and then sends it. Request bodies on MCP proxies stream under the same rules as any other route.

## Analytics on a streamed response

Analytics doesn't cost you the streaming behavior. As the gateway forwards each chunk to the client, it also keeps its own copy. At the end of the stream, it parses the accumulated SSE events and emits one analytics event for the request. The client receives every chunk at the time it arrives; the copy is only used after the stream closes.

## Token usage on a streamed response

Token counts drive analytics, cost tracking, and token-based rate limiting on LLM traffic. On a streamed response, the gateway reads them from the `usage` block that the provider sends in the stream, which arrives in the final events rather than in every chunk.

Providers differ in when they send that block:

- **OpenAI-compatible providers** omit `usage` unless the client asks for it. Add `stream_options` to the request:

    ```json
    {
      "model": "gpt-4o-mini",
      "stream": true,
      "stream_options": { "include_usage": true },
      "messages": [{ "role": "user", "content": "Write a haiku about API gateways." }]
    }
    ```

- **Anthropic** reports token counts in its `message_start` and `message_delta` events, so no extra request field is needed.

If a streamed response carries no `usage` block, the gateway has no token counts to record for that request. Analytics, cost calculation, and token-based rate limiting skip it. Set `stream_options` on OpenAI-compatible requests whenever you rely on any of those, including when the budget controls on the `LlmProvider` use token-based rate limiting.

## Related documentation

- [LLM Proxy Quick Start Guide](llm-proxy/quick-start-guide.md) — deploy a provider and a proxy, then send your first request
- [MCP Proxy Quick Start Guide](mcp-proxy/quick-start-guide.md) — deploy an MCP proxy
- [Sentence Count Guardrail](llm-proxy/guardrails/sentence-count.md) — a guardrail that gates a stream until it can evaluate the content