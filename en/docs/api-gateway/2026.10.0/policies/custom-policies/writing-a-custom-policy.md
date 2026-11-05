---
title: "Write a Custom Gateway Policy"
description: "Write a custom API Platform Gateway policy with the Go SDK: request and response hooks, and fault hooks that run when a request fails."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/2026.10.0/policies/custom-policies/writing-a-custom-policy/
md_url: https://wso2.com/api-platform/docs/api-gateway/2026.10.0/policies/custom-policies/writing-a-custom-policy.md
tags:
  - api-gateway
  - policies
  - custom-policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-05
content_type: "how-to"
---

# Writing a Custom Policy

This guide shows how to write a custom policy in API Platform Gateway.

For full API details, see the [API Platform Gateway's Custom Policy SDK Documentation](https://pkg.go.dev/github.com/wso2/api-platform/sdk/core/policy/v1alpha2).

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

## Write a Fault Policy

A **fault policy** runs only when a request fails, over the error response the client is about to receive. Use one to notify an external system, record a failure, or change the error. Users attach fault policies under the API's `faultPolicies` list instead of `policies`. For how fault policies are attached and when they run, see [Fault policies](../fault-policies.md).

Fault policy support requires `github.com/wso2/api-platform/sdk/core` v0.4.2 or later.

### Step 1: Implement OnFault

A policy becomes usable as a fault policy by implementing the `FaultPolicy` interface, which has one method, `OnFault`. The gateway checks for it when it builds the API's policy chain. If a policy without `OnFault` is attached as a fault policy, the gateway skips it and logs `skipping fault-policies policy that does not implement OnFault`.

```go
package myfaultpolicy

import (
    "context"
    "log/slog"

    policy "github.com/wso2/api-platform/sdk/core/policy/v1alpha2"
)

type MyFaultPolicy struct{}

// A policy that runs only as a fault policy takes part in no request or
// response phase, so it adds no work to successful requests.
func (p *MyFaultPolicy) Mode() policy.ProcessingMode {
    return policy.ProcessingMode{
        RequestHeaderMode:  policy.HeaderModeSkip,
        RequestBodyMode:    policy.BodyModeSkip,
        ResponseHeaderMode: policy.HeaderModeSkip,
        ResponseBodyMode:   policy.BodyModeSkip,
    }
}

func (p *MyFaultPolicy) OnFault(
    ctx context.Context,
    faultCtx *policy.FaultContext,
    params map[string]interface{},
) *policy.FaultResponse {
    code := ""
    if faultCtx.Fault != nil {
        code = faultCtx.Fault.Code
    }
    slog.Info("request failed",
        "status", faultCtx.ResponseStatus,
        "code", code,
        "policy", faultCtx.Policy,
        "source", faultCtx.Source)

    return nil // leave the error unchanged
}
```

A policy can implement `OnFault` alongside its ordinary phase methods. Each attachment is either in the normal flow (`policies`) or the fault flow (`faultPolicies`), so take separate parameters for each, and validate in `GetPolicy` that the parameters match where the policy is attached.

`OnFault` must not fail the request. The client is already receiving an error, so if `OnFault` panics or returns something the gateway cannot use, the client receives the original error and the failure is logged.

### Step 2: Read the Failure

`FaultContext` carries the error response, the request that produced it, and a description of the failure:

| Field | Description |
|---|---|
| `ResponseStatus`, `ResponseHeaders`, `ResponseBody` | The error response the client is about to receive. |
| `RequestHeaders`, `RequestBody`, `RequestPath`, `RequestMethod` | The request that failed. |
| `Fault` | The failure's `Code`, `Type`, `Direction`, `Message`, and `Description`. `nil` when nothing described the failure, for example an error returned by the backend. |
| `Policy`, `PolicyVersion`, `PolicyPhase` | The policy that caused the failure and the phase it was in. Empty when no policy caused it. |
| `Source` | Who produced the failure: `gateway`, `router`, `backend`, or `unknown`. |
| `OriginalStatus` | The status before a policy changed it, or `0` if no policy changed it. |
| `ResponseCommitted` | `true` when the client has already received the response, for example when a stream was ended. Changes to the response are then discarded. |
| `RouteKey` | The matched route. |
| `Upstream` | The backend the request was routed to. `Upstream.Response` is `nil` when the request never reached the backend. |

`Fault.Description` is an internal reason that never reaches the client. For a guardrail rejection it can contain the content the guardrail blocked, so do not send it to an external system.

### Step 3: Change the Error Response

Return `nil` to leave the error unchanged. To change it, return a `FaultResponse` and set only the fields you want to change:

| Field | Effect |
|---|---|
| `StatusCode` | Overrides the status. `nil` keeps it. |
| `Body` | Replaces the body. `nil` keeps it, and `[]byte{}` clears it. |
| `HeadersToSet`, `HeadersToAppend`, `HeadersToRemove` | Change headers on top of the headers the error already has. |
| `Fault` | Re-describes the failure for the fault policies after this one and for analytics. |
| `AnalyticsMetadata`, `DynamicMetadata`, `AnalyticsHeaderFilter` | The same as in the response phases. |

The following example adds a header to the error and keeps everything else:

```go
return &policy.FaultResponse{
    HeadersToSet: map[string]string{"x-support-ref": "contact-support"},
}
```

The following example replaces the error:

```go
status := 503
return &policy.FaultResponse{
    StatusCode:   &status,
    HeadersToSet: map[string]string{"content-type": "application/json"},
    Body:         []byte(`{"error":"service unavailable"}`),
}
```

Returning a `FaultResponse` does not stop the other fault policies. Every fault policy in the list runs, in order, and each one sees the changes made before it. If two fault policies set a body, the later one wins.

!!! tip
    Fault policies run when something is already going wrong, and the client waits for them to finish. Keep `OnFault` fast, and give any outbound call, such as a notification webhook, a short timeout.

### Python Fault Policies

A Python policy supports the fault path by implementing `FaultPolicy` from `apip_sdk_core`:

```python
from apip_sdk_core import ExecutionContext, FaultContext, FaultPolicy, FaultResponse, ProcessingMode

class MyFaultPolicy(FaultPolicy):
    def mode(self) -> ProcessingMode:
        return ProcessingMode()  # takes part in no request or response phase

    def on_fault(
        self, execution_ctx: ExecutionContext, ctx: FaultContext, params
    ) -> FaultResponse | None:
        print("request failed", ctx.response_status, ctx.policy, ctx.source)
        return None  # leave the error unchanged
```

`FaultContext` and `FaultResponse` have the same fields as in Go, in snake case, for example `ctx.response_status`, `ctx.fault`, and `FaultResponse(status_code=503, headers_to_set={...})`.

## Describe Failures from Your Policy

When your policy rejects a request, describe the failure so that fault policies, conditions, and analytics can tell what went wrong. Set `IsFault` and `Fault` on the response your policy already returns:

```go
return policy.ImmediateResponse{
    StatusCode: 403,
    Headers:    map[string]string{"content-type": "application/json"},
    Body:       []byte(`{"error":"forbidden"}`),
    IsFault:    true,
    Fault: &policy.FaultDetails{
        Code:        "965001",
        Type:        policy.FaultTypeAuthorization,
        Direction:   policy.DirectionRequest,
        Message:     "The caller is not allowed to access this resource",
        Description: "tenant acme is not in the allow list",
    },
}
```

| Field | Description |
|---|---|
| `IsFault` | Marks the response as a failure. A response with a status of `400` or above is a failure even without it. Set it for a failure that uses a lower status. |
| `Fault.Code` | A six-digit code. Use a code in the `965000`–`969999` range for your own policies; WSO2 never allocates codes in that range. |
| `Fault.Type` | The failure class, from the `policy.FaultType*` constants, for example `policy.FaultTypeAuthentication`, `policy.FaultTypeValidation`, or `policy.FaultTypeGuardrail`. |
| `Fault.Direction` | `policy.DirectionRequest` or `policy.DirectionResponse`: which side of the exchange was rejected. |
| `Fault.Message` | A client-safe summary. |
| `Fault.Description` | The internal reason. It is passed to fault policies but never sent to the client or recorded in analytics. |

`Fault` is metadata. Setting it does not change the status, headers, or body your policy returns, so keep writing the body your policy already returns. Fault policies can use it to change the error: for example, the [Error Response Formatter](../fault-policies.md#format-the-error-response) renders the fault's code, type, and message in the shape the API is configured with.

`DownstreamResponseModifications` has the same `IsFault` and `Fault` fields, for a policy that rejects a response.

To end a stream as a failure, set `IsFault: true` on `TerminateResponseChunk`. A streamed response has usually already been sent with status `200`, so a terminated stream is not a failure unless the policy says it is:

```go
return &policy.TerminateResponseChunk{
    Body:    []byte("data: {\"error\": \"content violation\"}\n\n"),
    IsFault: true,
    Fault: &policy.FaultDetails{
        Code:      "965002",
        Type:      policy.FaultTypeGuardrail,
        Direction: policy.DirectionResponse,
        Message:   "Content violation",
    },
}
```

## What's Next?

- [Building the Gateway with Custom Policies](building-gateway-with-custom-policies.md): Build a gateway image that includes your custom policy
- [Fault policies](../fault-policies.md): Attach fault policies to an API and run them for specific failures
