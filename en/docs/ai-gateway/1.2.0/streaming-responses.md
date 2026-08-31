---
title: "Stream responses"
description: "Stream responses chunk by chunk through LLM providers, LLM proxies, and MCP proxies, and how policies, analytics, and token usage behave."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/streaming-responses/
md_url: https://wso2.com/api-platform/docs/ai-gateway/streaming-responses.md
tags:
  - ai-gateway
  - llm
  - mcp
  - streaming
  - sse
  - chunked
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "concept"
---

# Stream responses

The AI Gateway forwards a streamed response to the client chunk by chunk, as each chunk arrives from the upstream service. The gateway doesn't hold the response until the upstream finishes generating it, so the first token reaches your application at about the same time it leaves the provider. Chat interfaces and agent loops keep their token-by-token behavior when they run through the gateway.

Streaming applies across the gateway's artifact types:

- **LLM providers** — a request sent straight to a provider endpoint, such as `/openai/latest/chat/completions`, streams when the upstream streams.
- **LLM proxies** — a proxy inherits the streaming behavior of the provider it consumes.
- **MCP proxies** — request bodies stream, and responses are handled differently. See [MCP proxies](#mcp-proxies).

This page is for AI developers building on the gateway, and for platform administrators deciding which policies to attach.

## Stream a response

Response streaming needs no configuration on the `LlmProvider` or `LlmProxy`. The gateway streams a response whenever the upstream service streams it, so you ask for a stream the same way you would when calling the provider directly: set `"stream": true` in the request body. On an `McpProxy`, request bodies stream, but response bodies stay buffered. See [MCP proxies](#mcp-proxies).

The following example calls an LLM proxy deployed at `/assistant`:

```bash
curl -N -X POST "https://localhost:8443/assistant/chat/completions" \
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

The same request works against the provider endpoint directly. Replace `/assistant` with the provider context, such as `/openai/latest`.

The `-N` flag turns off curl's own output buffering, so you see the Server-Sent Events (SSE) as they arrive rather than all at once at the end.

## How policies behave on a streamed response

Whether a response streams depends on the policies attached to the route. A policy that reads the response body either supports chunk-by-chunk processing or requires the complete body.

**Every response-body policy on the chain must support streaming.** The gateway evaluates this per route, and it's all or nothing:

- If every response-body policy supports streaming, the gateway streams the response to the client.
- If one policy requires the complete body, the gateway buffers the entire response, runs the chain, and then sends the response in one piece. The result is still correct, but the client waits for the last token before it sees the first.

The chain spans both levels. For a request through an LLM proxy, it covers the organization-wide policies the platform administrator attached to the `LlmProvider` and the per-application policies the developer attached to the `LlmProxy`. A buffered-only policy at either level buffers the response.

Policies that don't read the response body — authentication, request-side rate limiting, header policies, prompt management — never affect streaming.

### Gating policies

A streaming-capable policy can still hold bytes back when it has to. A guardrail that enforces a minimum, such as a minimum sentence count, can't rule on content it hasn't seen. Such a policy accumulates chunks silently until it has enough content to decide, releases what it has accumulated, and then processes each later chunk as it arrives. The client sees a pause at the start of the response rather than a wait for the whole response.

### MCP proxies

Response bodies on MCP proxies stay buffered, even when the MCP server replies with a streamed body. The gateway runs the response chain against the complete body and then sends it. Request bodies on MCP proxies stream under the same rules as any other route.

## Analytics on a streamed response

Analytics doesn't cost you the streaming behavior. The client receives every chunk at the time it arrives, and the gateway emits one analytics event for the request once the stream closes. The gateway emits that event for every stream it closes, including a stream that carries no `usage` block. In that case, the event records the request without token counts. See [Token usage on a streamed response](#token-usage-on-a-streamed-response).

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

If a streamed response carries no `usage` block, the gateway has no token counts to record for that request. The analytics event still reports the request, with its token metrics empty, and cost calculation and token-based rate limiting have nothing to work with. Set `stream_options` on OpenAI-compatible requests whenever you rely on any of those, including when the budget controls on the `LlmProvider` use token-based rate limiting.

## Related documentation

- [Quick Start Guide](quick-start-guide.md) — deploy a provider and a proxy, then send your first request
- [MCP proxy](gateway-artifacts/mcp-proxy.md) — deploy an MCP proxy
- [Sentence Count Guardrail](https://wso2.com/api-platform/policy-hub/policies/sentence-count-guardrail) — a guardrail that gates a stream until it can evaluate the content
- [Timeouts and resilience](timeouts-and-resilience.md) — a streamed response holds the route open, so the route timeout matters more than it does for a single reply
- [Log requests and responses](logging-and-tracing/log-requests-and-responses.md) — what a streamed exchange looks like when the traffic content is recorded
