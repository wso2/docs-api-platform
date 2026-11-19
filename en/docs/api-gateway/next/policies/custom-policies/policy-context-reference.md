---
title: "Policy Context Reference"
description: "Look up the request, response, API, authentication and shared values a custom API Platform Gateway policy can read in Go."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/policies/custom-policies/policy-context-reference/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/policies/custom-policies/policy-context-reference.md
tags:
  - api-gateway
  - policies
  - custom-policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "reference"
---

# Policy Context Reference

When the gateway runs your policy, it passes a **context** with details about the current request. This page lists what your policy can read from it.

* To write a policy, see [Writing a Custom Policy](writing-a-custom-policy.md).
* To read a failure in a fault policy, see [Read the failure](writing-a-custom-policy.md#step-2-read-the-failure).

## Context in each phase

Each hook receives the context for its phase.

| Phase | Hook | Context |
|---|---|---|
| Request headers | `OnRequestHeaders` | `RequestHeaderContext` |
| Request body | `OnRequestBody` | `RequestContext` |
| Request body, streamed | `OnRequestBodyChunk` | `RequestStreamContext` |
| Response headers | `OnResponseHeaders` | `ResponseHeaderContext` |
| Response body | `OnResponseBody` | `ResponseContext` |
| Response body, streamed | `OnResponseBodyChunk` | `ResponseStreamContext` |
| Fault | `OnFault` | `FaultContext` |

Every context also carries the [shared context](#shared-context). It holds values that stay with the request through every phase.

## Read a value

Shared context fields are on the context itself, for example `reqCtx.APIName`.

The following policy reads the API name, the request method, a header and the authenticated caller.

```go
func (p *MyPolicy) OnRequestHeaders(
    ctx context.Context,
    reqCtx *policy.RequestHeaderContext,
    params map[string]interface{},
) policy.RequestHeaderAction {
    apiName := reqCtx.APIName                   // shared context
    method := reqCtx.Method                     // request
    tenant := reqCtx.Headers.Get("x-tenant-id") // nil when the header is missing

    subject := "anonymous"
    if auth := reqCtx.AuthContext; auth != nil && auth.Authenticated {
        subject = auth.Subject
    }

    slog.Info("request received", "api", apiName, "method", method, "tenant", tenant, "subject", subject)
    return policy.UpstreamRequestHeaderModifications{}
}
```

!!! note
    Some fields can be `nil`. Check `AuthContext`, `Body`, `Downstream` and `Upstream` before you read from them.

## Shared context

These fields are available in every phase.

| Field | Description |
|---|---|
| `RequestID` | Unique ID of the request. |
| `ProjectID` | ID of the project the API belongs to. |
| `APIId` | API ID. |
| `APIName` | API name, for example `PetStore`. |
| `APIVersion` | API version, for example `v1.0.0`. |
| `APIKind` | API kind. One of `RestApi`, `GraphQLApi`, `WebSocketApi`, `WebSubApi`, `LlmProvider`, `LlmProxy`, `Mcp` or `Agent`. |
| `APIContext` | API base path, for example `/petstore`. |
| `OperationPath` | The API resource that matched the request, for example `/pets/{id}`. |
| `AuthContext` | The authenticated caller. See [Auth context](#auth-context). |
| `Metadata` | Values that policies share for the request. See [Metadata](#metadata). |
| `ResolvedOperation` | The operation the request resolved to, for API kinds where many operations share one path, such as `Agent`. Empty for other API kinds. |
| `ResolutionAttributes` | Details read from the request body while resolving that operation, for example `a2a.context.id`. Empty for other API kinds. The values come from the request body, so treat them as untrusted. Read them with `Get`, `Lookup`, `Len` and `Iterate`. |

## Auth context

Authentication policies, such as JWT, API key and basic authentication, fill the auth context when they run.

* It is `nil` until an authentication policy runs.
* When more than one authentication policy runs, `Previous` holds the auth context from the earlier one.

| Field | Description |
|---|---|
| `Authenticated` | `true` when the request was authenticated. |
| `Authorized` | `true` when the request passed an authorization check, such as MCP authorization. Authentication-only policies leave it `false`. |
| `AuthType` | How the caller authenticated, for example `jwt`, `apikey`, `basic`, `opaque` or `mtls`. |
| `Subject` | The caller's identity, such as the JWT `sub` claim or the basic authentication username. |
| `Issuer` | The JWT `iss` claim. Empty for basic and API key authentication. |
| `Audience` | The JWT `aud` claim values. Empty for basic and API key authentication. |
| `Scopes` | Granted scopes. Each key is a scope name and each value is `true`. |
| `CredentialID` | ID of the credential used, such as an OAuth2 client ID. |
| `Properties` | Other claims, such as custom JWT claims, as strings. A claim with several values is written as one string. |
| `TypedProperties` | Other claims in their original types, such as lists and objects. |
| `TokenId` | The token's unique ID, for example the JWT `jti` claim. |
| `Previous` | The auth context from an earlier authentication policy. |

## Metadata

`Metadata` holds values that policies share for one request. A value written in one phase can be read in a later phase, and by policies later in the chain.

* Read and write it with `reqCtx.Metadata["<key>"]`.
* Other policies, including built-in ones, use the same `Metadata`. Start your keys with a prefix unique to your policy, such as `my-policy.`.

```go
// In the request phase
reqCtx.Metadata["my-policy.client-id"] = clientID

// In the response phase
clientID, _ := respCtx.Metadata["my-policy.client-id"].(string)
```

## Request

These fields are available in the request phases, in `RequestHeaderContext`, `RequestContext` and `RequestStreamContext`.

| Field | Description |
|---|---|
| `Headers` | Request headers, including changes made by earlier policies. See [Headers](#headers). |
| `Path` | Request path, for example `/petstore/v1.0.0/pets/123`. |
| `Method` | HTTP method, for example `GET`. |
| `Authority` | The host the client called. |
| `Scheme` | `http` or `https`. |
| `Vhost` | The virtual host that matched the request. |
| `Body` | Request body. Only in `RequestContext`. See [Body](#body). |
| `Downstream` | The request as the client sent it. See [Client](#client). |
| `Upstream` | The backend the request is routed to. See [Backend](#backend). |

In the streamed request phase, the body arrives in chunks as a separate argument, not in the context.

## Response

These fields are available in the response phases, in `ResponseHeaderContext`, `ResponseContext` and `ResponseStreamContext`.

| Field | Description |
|---|---|
| `ResponseHeaders` | Response headers, including changes made by earlier policies. See [Headers](#headers). |
| `ResponseStatus` | Response status code. |
| `ResponseBody` | Response body. Only in `ResponseContext`. See [Body](#body). |
| `RequestHeaders` | Request headers. |
| `RequestBody` | Request body, when it was buffered. |
| `RequestPath` | Request path. |
| `RequestMethod` | HTTP method. |
| `Downstream` | The request as the client sent it. See [Client](#client). |
| `Upstream` | The backend, and the response as the backend sent it. See [Backend](#backend). |

In the streamed response phase, the body arrives in chunks as a separate argument, not in the context.

## Headers

Headers are read-only. To change them, return an action from your policy, as shown in [Implement Phase Interfaces](writing-a-custom-policy.md#step-3-implement-phase-interfaces). Header names are case-insensitive.

| Method | Returns |
|---|---|
| `Get(name)` | All values of the header. `nil` when the header is missing. |
| `Has(name)` | `true` when the header exists. |
| `GetAll()` | A copy of all headers. |
| `Iterate(fn)` | Each header name with its values. |

## Body

| Field | Description |
|---|---|
| `Content` | The body bytes. |
| `Present` | `true` when the body is available. `false` when the body was not sent or not buffered. |
| `EndOfStream` | `true` when this is the complete body. |

## Client

`Downstream` describes the client and its request before any policy changed it.

| Field | Description |
|---|---|
| `Downstream.Request.Headers` | Request headers as the client sent them. |
| `Downstream.Request.Path` | Request path as the client sent it. |
| `Downstream.Request.Method` | HTTP method as the client sent it. |
| `Downstream.Request.Authority` | Host as the client sent it. |
| `Downstream.Request.Scheme` | `http` or `https`. |
| `Downstream.TLS` | TLS details of the client connection. See the following table. |

`Downstream.TLS` describes the client's TLS connection and certificate.

| Field | Description |
|---|---|
| `MTLS` | `true` when the client presented a certificate. |
| `PeerCertValid` | `true` when the client certificate is valid for the trusted client CAs. |
| `SubjectDN` | Subject distinguished name of the client certificate. |
| `SHA256Thumbprint` | SHA-256 thumbprint of the client certificate. |
| `FirstURISAN` | First URI subject alternative name of the client certificate. |
| `FirstDNSSAN` | First DNS subject alternative name of the client certificate. |
| `PeerCertificatePEM` | The client certificate, PEM-encoded. |
| `TLSVersion` | The TLS version of the connection. |
| `RequestedServerName` | The server name (SNI) the client requested. |

!!! note
    If your policy uses these values to allow access, deny the request when `Downstream.TLS` or `PeerCertValid` is `nil`.

## Backend

`Upstream` describes the backend the request is routed to.

| Field | Description |
|---|---|
| `Upstream.Name` | Name of the backend. |
| `Upstream.URL` | Backend URL. To address the backend, for example when you sign a request, use this URL, not `Authority` or `Scheme`. |
| `Upstream.BasePath` | Backend base path. |
| `Upstream.Response.StatusCode` | Response phases only. Status code the backend sent, before any policy changed it. |
| `Upstream.Response.Headers` | Response phases only. Headers the backend sent, before any policy changed them. |

!!! note
    `RequestContext` also has `UpstreamInfo`. It is deprecated. Use `Upstream` instead.

## Add values to traffic logs

Your policy can add values to [traffic log](../../observability/traffic-logging/overview.md) lines by setting `AuthContext` or `Metadata`. For the full list of traffic log variables, see [Variable Reference](../../observability/traffic-logging/variable-reference.md).

| Context field | Traffic log variable |
|---|---|
| `AuthContext.Subject` | `auth.subject` |
| `AuthContext.AuthType` | `auth.type` |
| `AuthContext.Issuer` | `auth.issuer` |
| `AuthContext.CredentialID` | `auth.credential_id` |
| `AuthContext.TokenId` | `auth.token_id` |
| `AuthContext.Audience` | `auth.audience` |
| `AuthContext.Scopes` | `auth.scopes` |
| `AuthContext.Properties["<key>"]` | `auth.property['<key>']` |
| `AuthContext.Authorized` | `auth.authorized` |
| `Metadata["<key>"]` | `metadata['<key>']` |

* Auth values come from the first auth context in the chain that has `Authenticated` set to `true` and a `Subject`.
* `Metadata` values are logged as your policy sets them. Keep values that are not safe to log out of `Metadata`.
