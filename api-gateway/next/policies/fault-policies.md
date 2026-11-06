---
title: "Fault policies"
description: "Run policies only when a request fails, to log, notify on, or reshape errors from policy rejections, upstream failures, and backend errors."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/policies/fault-policies/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/policies/fault-policies.md
tags:
  - api-gateway
  - policies
  - fault-policies
  - error-handling
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-05
content_type: "concept"
---

# Fault policies

**Fault policies** are an ordered list of policies that the gateway runs **only when a request fails**. Use them to act on a failure: log it, notify an external system, or change the error the client receives. Fault policies never run on a successful response, but declaring them turns on response body processing for the API's routes, which successful requests also go through (see [Limitations](#limitations)).

A fault policy runs after the failure has happened. For example, when an authentication policy rejects a request with `401` or a guardrail blocks a response with `422`, the gateway runs the API's fault policies before it sends that error to the client. A successful response never runs a fault policy.

## How fault policies work

Fault policies are declared separately from an API's ordinary `policies`, so they never run in the normal request and response phases. When a request fails, the gateway runs the fault policies once, in order, over the error response:

```
Client ──► [Policy 1] ──► [Policy 2] ✗ rejects (401)
                                │
                                ▼
                   [Fault policy 1] ──► [Fault policy 2]
                                │
Client ◄────────────────────────┘ error response
```

Each fault policy can read the failure (its status, the policy that caused it, a fault code and type, the request that produced it) and either leave the error unchanged or change its status, headers, or body. Every fault policy in the list runs, except an entry whose `executionCondition` is false, and each one sees the changes made by the fault policies before it.

The gateway guarantees the following:

- A fault policy never runs on a successful response.
- The fault policies run at most once per request. A failure inside a fault policy does not trigger the fault policies again.
- A failing fault policy never makes the response worse. If a fault policy fails, the client still receives the original error, and the failure is logged.

### Which failures trigger fault policies

A response is treated as a failure when its status is `400` or above, or when the policy that produced it declares it as a fault.

| Failure | Runs fault policies |
|---|---|
| A policy rejects the request, for example an authentication failure (`401`), an authorization failure (`403`), a guardrail intervention (`422`), or a rate limit (`429`) | Always |
| A guardrail rejects the **response** | Always |
| The gateway fails to run a policy chain (`500`) or a request body exceeds the size limit (`413`) | Always |
| The backend is unreachable or times out (`503`, `504`) | Only when [`handle_upstream_faults`](#handle-upstream-and-backend-errors) is enabled |
| The backend returns an error status (`4xx` or `5xx`) | Only when [`handle_upstream_faults`](#handle-upstream-and-backend-errors) is enabled |
| A guardrail ends a streamed response | The fault policies run, but the client has already received the response, so they cannot change it |
| No API matches the request (`404` from the gateway) | Never |
| A successful response | Never |

## Before you begin

A policy can be used as a fault policy only if it supports the fault path. The gateway checks this when it builds the API's policy chain, not when the API is deployed. If a policy in the fault policy list does not support the fault path, the gateway skips it and writes this line to the gateway runtime log:

```
[chain-build] skipping fault-policies policy that does not implement OnFault
```

The [Log Message](https://wso2.com/api-platform/policy-hub/policies/log-message) policy supports the fault path from **v1.1.0**. The gateway image ships with an earlier version. The default `build.yaml` lists `log-message` as `@v1`, which resolves to the latest v1 release, so rebuilding the gateway image picks up v1.1.0 or later. For more information, see [Add or Update Policies in a Gateway](add-or-update-policies.md).

The [Error Response Formatter](https://wso2.com/api-platform/policy-hub/policies/error-response-formatter) policy is a fault policy that renders the error the client receives in a shape you choose. It is not included in the gateway image. To use it, add it to the `policies` list in your gateway's `build.yaml` and rebuild the gateway image:

```yaml
  - name: error-response-formatter
    gomodule: github.com/wso2/gateway-controllers/policies/error-response-formatter@v1
```

For how to use it, see [Format the error response](#format-the-error-response).

You can also [write your own fault policy](#write-a-custom-fault-policy).

## Attach fault policies to an API

Add a `faultPolicies` list to the API. Each entry takes the same fields as an entry in `policies`: `name`, `version`, `params`, and an optional `executionCondition`.

The following API rejects requests that fail the regex guardrail, and logs each failure with its payload and headers:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: RestApi
metadata:
  name: orders-api-v1.0
spec:
  displayName: Orders API
  version: v1.0
  context: /orders/$version
  upstream:
    main:
      url: http://orders-backend:8080
  policies:
    - name: regex-guardrail
      version: v1
      params:
        request:
          enabled: true
          regex: "^[A-Za-z0-9 ]+$"
          jsonPath: "$.description"
  faultPolicies:
    - name: log-message
      version: v1
      params:
        fault:
          payload: true
          headers: true
          excludeHeaders: ["Set-Cookie"]
  operations:
    - method: POST
      path: /submit
```

The guardrail checks the `description` field of the request body. A `POST /orders/v1.0/submit` request with `{"description": "Two blue pens"}` passes. A request with `{"description": "Two blue pens!"}` is rejected: it still returns `422` to the client, and the gateway also logs the failure. A successful request is not logged.

Each fault policy takes its own parameters. For example, the Log Message policy takes a `fault` block when it is attached as a fault policy, instead of the `request` and `response` blocks it takes as an ordinary policy. With `headers: true`, Log Message logs the headers of the error response. Exclude any header that carries a secret, such as `Set-Cookie`, with `excludeHeaders`.

!!! warning
    With `payload: true`, Log Message logs the error body. For a guardrail rejection, the body can include the content the guardrail blocked, such as secrets or personal data. Enable `payload` only where your logs are approved to hold that content.

### Attach fault policies to an operation

An operation can declare its own fault policies in addition to the API's fault policies:

```yaml
spec:
  faultPolicies:
    - name: log-message           # failures of every operation
      version: v1
      params:
        fault:
          headers: true
  operations:
    - method: POST
      path: /payments
      faultPolicies:
        - name: log-message       # failures of POST /payments, in addition
          version: v1
          params:
            fault:
              payload: true
```

Both levels run. An operation's fault policies do not replace the API's fault policies. When a request to an operation fails, the operation's fault policies run first, followed by the API's fault policies. An operation with no fault policies of its own runs only the API's fault policies.

### Order of execution

Fault policies run in the order they are declared, and each one sees what the fault policies before it did. You can list the same policy more than once, for example with a different `executionCondition` on each entry.

### Supported API types

| API type | API-level field | Operation-level field |
|---|---|---|
| REST API (`RestApi`) | `faultPolicies` | `operations[].faultPolicies` |
| MCP proxy (`Mcp`) | `faultPolicies` | Not supported |
| LLM provider (`LlmProvider`) | `globalFaultPolicies` | `operationFaultPolicies` |
| LLM proxy (`LlmProxy`) | `globalFaultPolicies` | `operationFaultPolicies` |

The field name follows the API type's ordinary policy field. LLM providers and proxies use `globalPolicies` and `operationPolicies`, so their fault policy fields are `globalFaultPolicies` and `operationFaultPolicies`. An `operationFaultPolicies` entry selects the operations it applies to with `paths`, and takes its `params` under each path, in the same way as an `operationPolicies` entry:

```yaml
spec:
  globalFaultPolicies:
    - name: log-message
      version: v1
      params:
        fault:
          headers: true
  operationFaultPolicies:
    - name: log-message
      version: v1
      paths:
        - path: /chat/completions
          methods: [POST]
          params:
            fault:
              payload: true
```

## Run a fault policy for specific failures

Use `executionCondition` to run a fault policy only for some failures. A condition on a fault policy can read the failure through the `fault.*` variables, in addition to the `request.*` and `response.*` variables available to every policy.

| Variable | Type | Description |
|---|---|---|
| `fault.Status` | int | The status of the error response. |
| `fault.Source` | string | Who produced the failure: `gateway` (a policy rejection or a gateway error), `router` (the gateway could not reach the backend), `backend` (the backend returned the error), or `unknown`. |
| `fault.Code` | string | The fault code, for example `"900902"`. See [Fault codes and types](#fault-codes-and-types). |
| `fault.Type` | string | The failure class, for example `"authentication"` or `"guardrail"`. |
| `fault.Direction` | string | `"Request"` or `"Response"`: which side of the exchange was rejected. |
| `fault.Message` | string | The client-facing error message. |
| `fault.Policy` | string | The policy that caused the failure. Empty when no policy caused it. |
| `fault.PolicyVersion` | string | The version of that policy. |
| `fault.PolicyPhase` | string | The phase that policy was in: `request_headers`, `request_body`, `response_headers`, or `response_body`. |
| `fault.OriginalStatus` | int | The status before a policy changed it, or `0` if no policy changed it. |
| `fault.RouteKey` | string | The matched route. |
| `fault.ResponseCommitted` | bool | `true` when the client has already received the response, for example when a stream was ended. |

The following fault policies log infrastructure failures with their payload, and log only the headers of guardrail rejections of a response:

```yaml
faultPolicies:
  - name: log-message
    version: v1
    executionCondition: 'fault.Type == "upstream" || fault.Type == "internal"'
    params:
      fault:
        payload: true
  - name: log-message
    version: v1
    executionCondition: 'fault.Type == "guardrail" && fault.Direction == "Response"'
    params:
      fault:
        headers: true
```

!!! note
    `fault.Status`, `fault.Source`, and `fault.RouteKey` are always set. `fault.Code`, `fault.Type`, `fault.Direction`, and `fault.Message` are set only when the failure was described: by the policy that caused it, or by the gateway for a router failure such as an unreachable backend (see [Handle upstream and backend errors](#handle-upstream-and-backend-errors)). They are empty for an error the backend returned, and for a rejection by a policy that does not describe its failures. A condition such as `fault.Code == "900902"` evaluates to `false` for those failures, and the fault policy does not run. To run a fault policy for every failure of a kind, write the condition on `fault.Status` or `fault.Source` instead.

## Format the error response

The [Error Response Formatter](https://wso2.com/api-platform/policy-hub/policies/error-response-formatter) policy renders a failure in a shape your clients expect, and can set the status and headers that go with it. Use it to return the errors of an API in one format, whichever policy produced them. With [`handle_upstream_faults`](#handle-upstream-and-backend-errors) enabled, it formats backend errors too. It runs only as a fault policy.

Choose a built-in shape with `preset`:

| Preset | Shape | Content type |
|---|---|---|
| `canonical` | `{"code", "type", "message"}` | `application/json` |
| `openai` | `{"error": {"message", "type", "code"}}` | `application/json` |
| `jsonrpc` | A JSON-RPC 2.0 error object | `application/json` |
| `soap11` | A SOAP 1.1 fault | `text/xml` |
| `soap12` | A SOAP 1.2 fault | `application/soap+xml` |

The following fault policy returns every failure of the API in the canonical shape, with the fault code in an `x-error-code` header:

```yaml
faultPolicies:
  - name: error-response-formatter
    version: v1
    params:
      preset: canonical
      headersToSet:
        - name: x-error-code
          value: ${Code}
```

To define your own shape, use `template` for a JSON body or `stringTemplate` for XML or text, with placeholders such as `${Code}`, `${Type}`, `${Message}`, `${Status}`, and `${RequestID}`:

```yaml
faultPolicies:
  - name: error-response-formatter
    version: v1
    params:
      template:
        error:
          code: ${Code}
          message: ${Message}
        requestId: ${RequestID}
        status: ${Status}
```

!!! note
    Placeholders use the `${Field}` syntax, not `{{Field}}`. The gateway resolves `{{ ... }}` expressions in an API definition when the API is deployed, so a `{{Field}}` placeholder would not reach the policy.

The formatter leaves the status unchanged unless you set `statusCode`. It formats every failure it runs on, including one that no policy described, such as a backend error or a rejection by a policy version without fault details. Such a failure has no code, and the formatter replaces its body with a generic message (`An unexpected error occurred.`). To keep the original body of those failures, add `executionCondition: 'fault.Code != ""'` to the formatter entry. If its configuration is invalid, for example because a template uses an unknown placeholder, the gateway logs an error and sends the error response unformatted. For all parameters, see the [Error Response Formatter](https://wso2.com/api-platform/policy-hub/policies/error-response-formatter) page in the Policy Hub.

Fault policies run in order, so to log the error as the client receives it, list the formatter before Log Message.

## Handle upstream and backend errors

By default, only failures that the gateway produces run the fault policies. Errors from the backend, and failures to reach it, are handled as ordinary responses and run the API's response policies, as in earlier gateway versions.

To run the fault policies for these errors, enable `handle_upstream_faults` in the gateway configuration (`config.toml`):

```toml
[policy_engine.fault_policies]
handle_upstream_faults = true
```

When you deploy with Helm, set `gateway.config.policy_engine.fault_policies.handle_upstream_faults` to `true` in your values file.

When this setting is enabled:

- A backend that is unreachable or times out, and a backend that returns a status of `400` or above, run the fault policies.
- These errors no longer run the API's response policies. For example, a response transformer, a response guardrail, or the CORS policy no longer runs over a backend `503`. If such a response still needs a header, set it from a fault policy.
- Backend errors are not filtered. A backend that returns `404` for a missing record runs the fault policies too. To skip the backend's own errors, add a condition such as `fault.Source != "backend"` to the fault policy.

```yaml
faultPolicies:
  - name: log-message
    version: v1
    executionCondition: 'fault.Source != "backend"'   # skip the backend's own errors
    params:
      fault:
        payload: true
```

!!! warning
    Enabling `handle_upstream_faults` changes which policies run over a backend error, for every API on the gateway. Check the response policies of your APIs before you enable it.

When the gateway cannot reach the backend, it describes the failure for fault policies and analytics:

| Failure | `fault.Code` | `fault.Type` |
|---|---|---|
| No healthy upstream | `303001` | `upstream` |
| Could not connect to the backend, or the connection was reset | `101503` | `upstream` |
| The backend timed out | `101504` | `upstream` |

The gateway does not describe an error that the backend returned, so `fault.Code` and `fault.Type` are empty for it.

## Fault codes and types

A policy that rejects a request describes the failure with a **code** and a **type**. The code is a six-digit string that identifies exactly what failed. Where WSO2 API Manager already has a code for the same condition, the gateway reuses it, for example `900902` for missing credentials. The type is the class of the failure:

| Type | Used when |
|---|---|
| `authentication` | The caller could not be identified, for example because a credential is missing, malformed, or expired. |
| `authorization` | The caller was identified but is not permitted, for example because of a missing scope or subscription. |
| `throttling` | A rate limit or quota was reached. |
| `guardrail` | A guardrail rejected the request or the response. Guardrail codes are in the `906000`–`906399` range. |
| `validation` | The request did not have the required shape, for example a body that could not be parsed. |
| `mediation` | A transformation or rewrite step failed. |
| `configuration` | The policy's own parameters cannot be used. |
| `upstream` | The gateway could not reach the backend, or the backend timed out. |
| `routing` | No API matched the request. |
| `internal` | The gateway itself failed, for example a policy chain could not run. |
| `requestSize` | The request body exceeded the configured size limit. |

A policy that describes its failures lists the codes and types it reports in the **Fault reporting** section of its Policy Hub page.

## Write a custom fault policy

To make your own policy usable as a fault policy, implement the `OnFault` method of the SDK's `FaultPolicy` interface. `OnFault` receives the error response, the request that produced it, and a description of the failure, and returns `nil` to leave the error unchanged or a `FaultResponse` to change its status, headers, or body. Your own policies can also describe their rejections with a fault code and type, so that fault policies and analytics can tell what failed.

For a step-by-step guide, see [Write a Fault Policy](custom-policies/writing-a-custom-policy.md#write-a-fault-policy) and [Describe Failures from Your Policy](custom-policies/writing-a-custom-policy.md#describe-failures-from-your-policy).

!!! warning
    Fault policies run when something is already going wrong. Keep them fast, and give any outbound call (for example, a notification webhook) a short timeout, because the client waits for the fault policies to finish. Do not send the rejected payload to an external system: for a guardrail rejection, the payload is the content the guardrail blocked.

## Fault details in analytics

When analytics is enabled, the gateway adds the failure to the request's analytics event. The existing `error` fields keep their meaning, and these fields are added to the `error` object:

| Field | Description |
|---|---|
| `wso2ErrorCode` | The fault code. Absent when nothing described the failure. |
| `type` | The failure type. |
| `direction` | `Request` or `Response`. |
| `summary` | The client-facing message. |
| `policy`, `policyPhase` | The policy that caused the failure and its phase. Absent when no policy caused it. |
| `source` | `gateway`, `router`, `backend`, or `unknown`. |
| `originalStatus` | The status before a policy changed it. |
| `guardrail` | The guardrail's `name`, `action`, and `reason`, for a guardrail rejection. |

The failure's internal description and a guardrail's assessments are never recorded in analytics, because for a guardrail they contain the content it blocked.

## Limitations

- A request that matches no API does not run fault policies, because no API, and therefore no fault policy list, applies to it.
- A fault policy cannot change a streamed response that the client has already started receiving. It can still log or report the failure.
- Declaring fault policies enables response body processing for the API's routes, because fault policies run in that phase. Successful requests on those routes go through that processing too, although no fault policy runs for them.

## Related topics

- [API Platform Policies Overview](overview.md)
- [Policy execution order](policy-execution-order.md)
- [Add or Update Policies in a Gateway](add-or-update-policies.md)
- [Write a Custom Policy](custom-policies/writing-a-custom-policy.md)