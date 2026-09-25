---
title: "Write an AI policy for the Self-Hosted Gateway"
description: "Implement a custom AI policy that handles both streaming (SSE) and non-streaming LLM request and response bodies."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/writing-an-ai-policy/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/writing-an-ai-policy.md
tags:
  - cloud
  - ai-workspace
  - custom-policy
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Writing an AI Policy for the Self-Hosted Gateway

AI policies allow you to inspect, control, and modify traffic going to and from Large Language Models (LLMs), such as OpenAI, Anthropic, or other providers.

AI policies use the same `Policy` interface as standard gateway policies. For full API details, see the [SDK Documentation](https://pkg.go.dev/github.com/wso2/api-platform/sdk/core/policy/v1alpha2).

The key difference is how you handle LLM request and response bodies, especially:

- JSON responses
- Streaming responses (SSE)

## Key Idea

LLM responses come in two formats:

| Mode | Format |
|------|--------|
| Non-streaming | Single JSON object |
| Streaming | SSE events (`data: {...}`) |

Your policy must be implemented to handle **both formats**.

## Which Interfaces to Implement

Choose based on what your policy needs to do:

| Goal | Interface | Mode Setting |
|------|-----------|-------------|
| Inspect prompt / model | `RequestPolicy` | `RequestBodyMode: BodyModeBuffer` |
| Inspect headers (auth, routing) | `RequestHeaderPolicy` | `RequestHeaderMode: HeaderModeProcess` |
| Inspect or modify buffered (in-memory) response | `ResponsePolicy` | `ResponseBodyMode: BodyModeBuffer` |
| Inspect or modify streaming response | `StreamingResponsePolicy` (embeds `ResponsePolicy`) | `ResponseBodyMode: BodyModeStream` |

## Recommended Pattern

For most AI policies, implement both:

- **`ResponsePolicy`** - Handles buffered responses where the entire response is available at once. This could be a non-streaming JSON response or concatenated SSE events.
- **`StreamingResponsePolicy`** - Handles streaming responses, which could be JSON or SSE events.

!!! tip
    The gateway automatically chooses which handler to call. `OnResponseBodyChunk` is invoked only if the entire policy chain is streaming-compatible. If any policy in the chain does not support streaming, `OnResponseBody` is used as a fallback.

## Minimal AI Policy Example

```go
package myaipolicy

import (
    "context"

    policy "github.com/wso2/api-platform/sdk/core/policy/v1alpha2"
)

type MyAIPolicy struct{}

func (p *MyAIPolicy) Mode() policy.ProcessingMode {
    return policy.ProcessingMode{
        RequestBodyMode:  policy.BodyModeBuffer,
        ResponseBodyMode: policy.BodyModeStream,
    }
}

// Request Inspection
func (p *MyAIPolicy) OnRequestBody(
    ctx context.Context,
    reqCtx *policy.RequestContext,
    params map[string]interface{},
) policy.RequestAction {
    // Inspect model + messages
    return nil
}

// Streaming Response Handling
func (p *MyAIPolicy) OnResponseBodyChunk(
    ctx context.Context,
    respCtx *policy.ResponseStreamContext,
    chunk *policy.StreamBody,
    params map[string]interface{},
) policy.StreamingResponseAction {
    // Accumulate + process
    return policy.ForwardResponseChunk{}
}

// Gating response chunks before processing response
func (p *MyAIPolicy) NeedsMoreResponseData(_ []byte) bool {
    return false
}

// Buffered Fallback
func (p *MyAIPolicy) OnResponseBody(
    ctx context.Context,
    respCtx *policy.ResponseContext,
    params map[string]interface{},
) policy.ResponseAction {
    // Same logic as streaming, applied to the full body
    return nil
}
```

## Best Practices

- **Always handle both streaming and non-streaming** - The gateway may fall back to buffered mode if any policy in the chain does not support streaming.
- **Use Metadata to share state** - Pass data between request and response phases using the `Metadata` map.
- **Implement streaming + fallback for compatibility** - Ensure your policy works correctly regardless of whether the chain runs in streaming or buffered mode.

## Learn More

- [Writing a Custom Policy for the Self-Hosted Gateway](../../api-platform-gateway/writing-a-custom-policy.md)