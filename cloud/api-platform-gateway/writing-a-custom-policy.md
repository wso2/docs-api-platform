---
title: "Write a custom policy for the Self-Hosted Gateway"
description: "Build a custom policy for the API Platform Self-Hosted Gateway using the Go-based policy SDK, including streaming support."
canonical_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/writing-a-custom-policy/
md_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/writing-a-custom-policy.md
tags:
  - cloud
  - api-gateway
  - self-hosted
  - custom-policy
  - sdk
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Writing a Custom Policy for the Self-Hosted Gateway

This guide shows how to build a custom policy using the gateway SDK.

For full API details, see the [API Platform Gateway's Custom Policy SDK Documentation](https://pkg.go.dev/github.com/wso2/api-platform/sdk/core/policy/v1alpha2).

## What is a Policy?

Policies allow you to enforce security, rate limiting, transformation, and other governance requirements on your APIs.


## How It Works

Every request and response that flows through the gateway passes through a **policy chain**. Each policy in the chain declares which phases it participates in, and the kernel calls the appropriate hook for each phase:


!!! note
    A **policy chain** is an ordered sequence of policies that the gateway runs on every request and response for a given API or API operation. Policies execute in the order they are listed in the API definition YAML — each policy sees the modifications made by the ones before it.

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
     Upstream
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

A policy only participates in the phases it implements. For example, a policy that only inspects request headers does not implement the response interfaces.

## How to Write a Policy

### Step 1: Create the Policy

Each policy lives in its own Go module. Create a "policies" directory inside your gateway:

```text
/policies/my-policy/
 ├── go.mod
 ├── my_policy.go
 └── policy-definition.yaml
```

### Step 2: Implement the Base Policy Interface

```go
package mypolicy

import (
    "context"

    policy "github.com/wso2/api-platform/sdk/core/policy/v1alpha2"
)

type MyPolicy struct {
    // your config fields
}

// Mode declares which phases this policy participates in and how bodies
// are handled. The kernel reads this once at startup — there is no
// per-request overhead.
func (p *MyPolicy) Mode() policy.ProcessingMode {
    return policy.ProcessingMode{
        RequestHeaderMode:  policy.HeaderModeProcess,
        RequestBodyMode:    policy.BodyModeSkip,
        ResponseHeaderMode: policy.HeaderModeSkip,
        ResponseBodyMode:   policy.BodyModeSkip,
    }
}
```

#### How to Choose Modes

| Setting | When to Use |
|---------|-------------|
| `policy.HeaderModeProcess`, `policy.BodyModeBuffer`, or `policy.BodyModeStream` | When your policy needs to inspect or modify that part of the request/response |
| `policy.HeaderModeSkip` or `policy.BodyModeSkip` | When your policy does not need to run in that phase |

!!! tip
    If you do not want your policy to process a specific phase, explicitly set it to `Skip`.

### Step 3: Implement Phase Interfaces

Implement only the interfaces for phases you declared in `Mode()` in step 2.

#### Request Flow

**Request Header Phase**

Called before the request body is read. Ideal for authentication, routing decisions, and adding/removing headers.

```go
func (p *MyPolicy) OnRequestHeaders(
    ctx context.Context,
    reqCtx *policy.RequestHeaderContext,
    params map[string]interface{},
) policy.RequestHeaderAction {
    token := reqCtx.Headers.Get("Authorization")
    if len(token) == 0 {
        return &policy.ImmediateResponse{
            StatusCode: 401,
            Body: []byte(`{"error":"missing authorization"}`),
        }
    }
    return policy.UpstreamRequestHeaderModifications{} // pass through
}
```

**Request Body Phase**

`OnRequestBody` is called only when the request body is fully buffered.

```go
func (p *MyPolicy) OnRequestBody(
    ctx context.Context,
    reqCtx *policy.RequestContext,
    params map[string]interface{},
) policy.RequestAction {
    // Inspect or modify the request body
    return &policy.UpstreamRequestModifications{
        Body: modifiedBody,
    }
}
```

!!! note
    Even if your policy is designed for streaming, you must still implement `OnRequestBody`. This acts as a fallback when the policy chain does not run in streaming mode.

#### Response Flow

**Response Header Phase**

Called after the upstream responds but before the response body is read.

```go
func (p *MyPolicy) OnResponseHeaders(
    ctx context.Context,
    respCtx *policy.ResponseHeaderContext,
    params map[string]interface{},
) policy.ResponseHeaderAction {
    return &policy.DownstreamResponseHeaderModifications{
        HeadersToSet: map[string]string{
            "X-Policy-Applied": "true",
        },
    }
}
```

**Response Body Phase**

`OnResponseBody` is called only when the response body is fully buffered.

```go
func (p *MyPolicy) OnResponseBody(
    ctx context.Context,
    respCtx *policy.ResponseContext,
    params map[string]interface{},
) policy.ResponseAction {
    if isInvalidContent(respCtx.ResponseBody.Content) {
        return &policy.ImmediateResponse{
            StatusCode: 403,
            Body: []byte(`{"error":"policy violation"}`),
        }
    }
    return policy.DownstreamResponseModifications{}
}
```

!!! note
    Even if your policy is designed for streaming, you must still implement `OnResponseBody`. This acts as a fallback when the policy chain does not run in streaming mode.

### Step 4: Enable Streaming

Use streaming when processing SSE (Server-Sent Events) responses or large chunked transfers where you cannot or should not buffer the full body. Set `ResponseBodyMode: policy.BodyModeStream` (and/or `RequestBodyMode: policy.BodyModeStream`) in your `Mode()`, then implement the streaming interfaces.

#### Streaming Request

Implement `StreamingRequestPolicy` to process request chunks:

```go
func (p *MyPolicy) Mode() policy.ProcessingMode {
    return policy.ProcessingMode{
        RequestHeaderMode:  policy.HeaderModeProcess,
        RequestBodyMode:   policy.BodyModeStream,
    }
}

func (p *MyPolicy) NeedsMoreRequestData(accumulated []byte) bool {
    return false // forward every chunk immediately
}

func (p *MyPolicy) OnRequestBodyChunk(
    ctx context.Context,
    reqCtx *policy.RequestStreamContext,
    chunk *policy.StreamBody,
    params map[string]interface{},
) policy.StreamingRequestAction {

    return &policy.ForwardRequestChunk{
        Body: chunk.Chunk, // nil = pass through
    }
}

// Fallback for non-streaming chains
func (p *MyPolicy) OnRequestBody(
    ctx context.Context,
    reqCtx *policy.RequestContext,
    params map[string]interface{},
) policy.RequestAction {
    return nil
}
```

#### Streaming Response

Implement `StreamingResponsePolicy` to process responses chunk by chunk:

```go
func (p *MyPolicy) Mode() policy.ProcessingMode {
    return policy.ProcessingMode{
        RequestHeaderMode:  policy.HeaderModeProcess,
        ResponseBodyMode:   policy.BodyModeStream,
    }
}

// NeedsMoreResponseData controls when to start forwarding chunks.
// Return true to keep buffering; false to start forwarding immediately.
// The kernel calls this before each chunk is sent downstream.
func (p *MyPolicy) NeedsMoreResponseData(accumulated []byte) bool {
    // Buffer until we have at least 512 bytes to inspect
    return len(accumulated) < 512
}

// OnResponseBodyChunk is called for each chunk of the response body.
func (p *MyPolicy) OnResponseBodyChunk(
    ctx context.Context,
    respCtx *policy.ResponseStreamContext,
    chunk *policy.StreamBody,
    params map[string]interface{},
) policy.StreamingResponseAction {

    // Inspect the chunk content
    if containsViolation(chunk.Chunk) {
        // Terminate the stream with a final error frame
        return &policy.TerminateResponseChunk{
            Body: []byte("data: {\"error\": \"content violation\"}\n\n"),
        }
    }

    // Forward the chunk as-is
    return &policy.ForwardResponseChunk{
        Body: chunk.Chunk, // nil = pass through unchanged
    }
}

// Fallback for non-streaming chains: required by StreamingResponsePolicy
func (p *MyPolicy) OnResponseBody(
    ctx context.Context,
    respCtx *policy.ResponseContext,
    params map[string]interface{},
) policy.ResponseAction {
    return nil
}
```

#### Gate-then-Stream Pattern

A common pattern for guardrail policies is to accumulate chunks until you have enough data to make a decision, then switch to pass-through:

```go
// Buffer until we can check for a violation, then stream freely
func (p *MyPolicy) NeedsMoreResponseData(accumulated []byte) bool {
    // Keep buffering until we have a complete first SSE event
    return !bytes.Contains(accumulated, []byte("\n\n"))
}
```

### Step 5: Factory Function

Initialize your policy and validate parameters:

```go
func GetPolicy(
    metadata policy.PolicyMetadata,
    params map[string]interface{},
) (policy.Policy, error) {

    maxSize, ok := params["maxBodySize"].(float64)
    if !ok {
        return nil, fmt.Errorf("invalid maxBodySize")
    }

    return &MyPolicy{maxBodySize: int(maxSize)}, nil
}
```

### Step 6: Define Parameters

Create a `policy-definition.yaml` in your policy directory:

```yaml
name: my-policy
displayName: my policy
version: v1.0.0

parameters:
  type: object
  properties:
    maxBodySize:
      type: integer
      default: 1048576
```

### Step 7: Share Data Between Phases

Use the `Metadata` map to pass data between request and response phases:

```go
// In request phase
reqCtx.Metadata["clientID"] = clientID

// In response phase
clientID := respCtx.Metadata["clientID"]
```

### Step 8: Register and Build

Add your policy to gateway folder's `build.yaml` under `policies:` using `filePath` for local development:

```yaml
policies:
  - name: my-policy
    filePath: ./policies/my-policy
```

For published policies (production), use the module reference instead:

```yaml
policies:
  - name: my-policy
    gomodule: github.com/abc/policy-repo/policies/my-policy@v1
```

## What's Next?

- [Building the Gateway with Custom Policies](build-gateway-with-custom-policies.md): Build a gateway image that includes your custom policy
- [Apply Custom Policies to APIs](apply-custom-policies-to-apis.md): Sync your custom policy to the organization and apply it to APIs
- [Writing an AI Policy](../ai-workspace/policies/writing-an-ai-policy.md): Learn how to write policies for LLM traffic