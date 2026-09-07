---
title: "Write an AI policy for the AI Gateway"
description: "Build a custom AI policy using the gateway SDK, including support for buffered and streaming (SSE) LLM request and response bodies."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/policies/writing-an-ai-policy/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/policies/writing-an-ai-policy.md
tags:
  - cloud
  - ai-workspace
  - custom-policy
  - sdk
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Write an AI policy for the AI Gateway

An AI policy inspects, controls, and modifies the traffic going to and from a large language model (LLM) provider such as OpenAI or Anthropic.

AI policies use the same `Policy` interface as standard gateway policies. For full API details, see the [policy SDK reference](https://pkg.go.dev/github.com/wso2/api-platform/sdk/core/policy/v1alpha2).

The key difference is how you handle LLM request and response bodies, especially:

- JSON responses
- Streaming responses (SSE)

## How it works

Every request and response that flows through the gateway passes through a **policy chain**. Each policy declares which phases it participates in, and the kernel calls the appropriate hook for each phase:

```text
Incoming Request
       │
       ▼
  Request Headers  ──► OnRequestHeaders()
       │
       ▼
  Request Body     ──► OnRequestBody()  (or OnRequestBodyChunk() for streaming)
       │
       ▼
   Upstream LLM
       │
       ▼
  Response Headers ──► OnResponseHeaders()
       │
       ▼
  Response Body    ──► OnResponseBody() (or OnResponseBodyChunk() for streaming)
       │
       ▼
  Downstream Client
```

!!! note
    A **policy chain** is an ordered sequence of policies that the gateway runs on every request and response for a given LLM provider or App LLM proxy. Policies run in the order the runtime configuration lists them, and each policy sees the modifications the ones before it made.

## Key idea

LLM responses come in two formats:

| Mode | Format |
|------|--------|
| Non-streaming | Single JSON object |
| Streaming | SSE events (`data: {...}`) |

Your policy must handle **both formats**.

## Which interfaces to implement

Choose based on what your policy needs to do:

| Goal | Interface | Mode setting |
|------|-----------|-------------|
| Inspect prompt / model | `RequestPolicy` | `RequestBodyMode: BodyModeBuffer` |
| Inspect headers (auth, routing) | `RequestHeaderPolicy` | `RequestHeaderMode: HeaderModeProcess` |
| Inspect or modify buffered (in-memory) response | `ResponsePolicy` | `ResponseBodyMode: BodyModeBuffer` |
| Inspect or modify streaming response | `StreamingResponsePolicy` (embeds `ResponsePolicy`) | `ResponseBodyMode: BodyModeStream` |

## How to write an AI policy

### Step 1: Create the policy

Each policy lives in its own Go module. Create a "policies" directory inside your gateway:

```text
/policies/my-ai-policy/
 ├── go.mod
 ├── my_ai_policy.go
 └── policy-definition.yaml
```

### Step 2: Implement the mode

`Mode()` declares which phases this policy participates in and how bodies are handled. The kernel reads this once at startup — there is no per-request overhead.

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
```

!!! tip
    If your policy doesn't need to inspect a phase, set that phase to `HeaderModeSkip` or `BodyModeSkip`.

### Step 3: Implement request inspection

`OnRequestBody` is called once the request body is fully buffered. Use it to inspect the model name, messages, or parameters before the request reaches the LLM provider.

```go
func (p *MyAIPolicy) OnRequestBody(
    ctx context.Context,
    reqCtx *policy.RequestContext,
    params map[string]interface{},
) policy.RequestAction {
    // Inspect model + messages
    return nil
}
```

### Step 4: Implement response handling

For most AI policies, implement both:

- **`ResponsePolicy`**: handles buffered responses, where the entire response is available at once. That's either a non-streaming JSON response or concatenated SSE events.
- **`StreamingResponsePolicy`**: handles streaming responses, either JSON or SSE events.

!!! tip
    The gateway automatically chooses which handler to call. The gateway calls `OnResponseBodyChunk` only when the entire policy chain is streaming-compatible. If any policy in the chain doesn't support streaming, the gateway falls back to `OnResponseBody`, so implement both even when streaming is your primary target.

```go
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

#### Gate-then-stream pattern

A common pattern for AI guardrails is to accumulate chunks until you have a complete SSE event to inspect, then switch to pass-through:

```go
// Buffer until we can parse a complete SSE event, then stream freely
func (p *MyAIPolicy) NeedsMoreResponseData(accumulated []byte) bool {
    return !bytes.Contains(accumulated, []byte("\n\n"))
}
```

### Step 5: Factory function

Initialize your policy and validate parameters:

```go
func GetPolicy(
    metadata policy.PolicyMetadata,
    params map[string]interface{},
) (policy.Policy, error) {

    threshold, ok := params["blockThreshold"].(float64)
    if !ok {
        return nil, fmt.Errorf("invalid blockThreshold")
    }

    return &MyAIPolicy{blockThreshold: threshold}, nil
}
```

### Step 6: Define parameters

Create a `policy-definition.yaml` in your policy directory:

```yaml
name: my-ai-policy
displayName: my ai policy
version: v1.0.0

parameters:
  type: object
  properties:
    blockThreshold:
      type: number
      default: 0.8
```

### Step 7: Share data between phases

Use the `Metadata` map to pass data between request and response phases — for example, the model name read from the request, used later to apply model-specific logic in the response phase:

```go
// In request phase
reqCtx.Metadata["model"] = model

// In response phase
model := respCtx.Metadata["model"]
```

### Step 8: Register and build

Add your policy to the gateway folder's `build.yaml` under `policies:` using `filePath` for local development:

```yaml
policies:
  - name: my-ai-policy
    filePath: ./policies/my-ai-policy
```

For published policies (production), use the module reference instead:

```yaml
policies:
  - name: my-ai-policy
    gomodule: github.com/abc/policy-repo/policies/my-ai-policy@v1
```

## Best practices

- **Always handle both streaming and non-streaming.** The gateway falls back to buffered mode when any policy in the chain doesn't support streaming.
- **Use the `Metadata` map to share state.** Pass data between the request and response phases through it.
- **Implement streaming and the buffered fallback.** Your policy then works whether the chain runs in streaming or buffered mode.
- **Parse SSE incrementally.** When gating on streaming responses, buffer only until you have a complete SSE event, terminated by `\n\n`, rather than the entire response. This keeps latency low.

## Next steps

- [Build the gateway with AI policies](build-gateway-with-ai-policies.md): build a gateway image that includes your custom AI policy
- [Apply AI policies to proxies](apply-ai-policies-to-proxies.md): sync your custom AI policy to the organization and apply it to LLM providers, App LLM proxies, and MCP proxies
- [Write a custom policy for the self-hosted gateway](../../../cloud/api-platform-gateway/writing-a-custom-policy.md): the general-purpose policy SDK that the AI Gateway's policy engine builds on