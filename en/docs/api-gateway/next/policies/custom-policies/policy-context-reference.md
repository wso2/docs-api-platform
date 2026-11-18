---
title: "Policy Context Reference"
description: "Look up the request, response, API, authentication and shared values a custom API Platform Gateway policy can read, in Go and in Python."
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

When the gateway runs your policy, it passes a **context** with details about the current request. This page lists what your policy can read from it, in Go and in Python.

* To write a policy, see [Writing a Custom Policy](writing-a-custom-policy.md).
* To read a failure in a fault policy, see [Read the failure](writing-a-custom-policy.md#step-2-read-the-failure).

## Context in each phase

Each hook receives the context for its phase.

| Phase | Go hook | Python hook | Context |
|---|---|---|---|
| Request headers | `OnRequestHeaders` | `on_request_headers` | `RequestHeaderContext` |
| Request body | `OnRequestBody` | `on_request_body` | `RequestContext` |
| Request body, streamed | `OnRequestBodyChunk` | `on_request_body_chunk` | `RequestStreamContext` |
| Response headers | `OnResponseHeaders` | `on_response_headers` | `ResponseHeaderContext` |
| Response body | `OnResponseBody` | `on_response_body` | `ResponseContext` |
| Response body, streamed | `OnResponseBodyChunk` | `on_response_body_chunk` | `ResponseStreamContext` |
| Fault | `OnFault` | `on_fault` | `FaultContext` |

Every context also carries the [shared context](#shared-context). It holds values that stay with the request through every phase.

## Read a value

Fields have the same names in both languages, in PascalCase in Go and in snake_case in Python.

* In Go, shared context fields are on the context itself, for example `reqCtx.APIName`.
* In Python, shared context fields are under `ctx.shared`, for example `ctx.shared.api_name`.

The following policy reads the API name, the request method, a header and the authenticated caller.

=== "Go"

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

=== "Python"

    ```python
    def on_request_headers(
        self,
        execution_ctx: ExecutionContext,
        ctx: RequestHeaderContext,
        params: dict[str, Any],
    ) -> RequestHeaderAction:
        api_name = ctx.shared.api_name           # shared context
        method = ctx.method                      # request
        tenant = ctx.headers.get("x-tenant-id")  # empty list when the header is missing

        subject = "anonymous"
        auth = ctx.shared.auth_context
        if auth is not None and auth.authenticated:
            subject = auth.subject

        logger.info("request received api=%s method=%s tenant=%s subject=%s", api_name, method, tenant, subject)
        return UpstreamRequestHeaderModifications()
    ```

!!! note
    Some fields can be empty, `nil` in Go and `None` in Python. Check `AuthContext`, `Body`, `Downstream` and `Upstream` before you read from them.

## Shared context

These fields are available in every phase.

| Go | Python | Description |
|---|---|---|
| `RequestID` | `request_id` | Unique ID of the request. |
| `ProjectID` | `project_id` | ID of the project the API belongs to. |
| `APIId` | `api_id` | API ID. |
| `APIName` | `api_name` | API name, for example `PetStore`. |
| `APIVersion` | `api_version` | API version, for example `v1.0.0`. |
| `APIKind` | `api_kind` | API kind. One of `RestApi`, `GraphQLApi`, `WebSocketApi`, `WebSubApi`, `LlmProvider`, `LlmProxy`, `Mcp` or `Agent`. |
| `APIContext` | `api_context` | API base path, for example `/petstore`. |
| `OperationPath` | `operation_path` | The API resource that matched the request, for example `/pets/{id}`. |
| `AuthContext` | `auth_context` | The authenticated caller. See [Auth context](#auth-context). |
| `Metadata` | `metadata` | Values that policies share for the request. See [Metadata](#metadata). |
| `ResolvedOperation` | `resolved_operation` | The operation the request resolved to, for API kinds where many operations share one path, such as `Agent`. Empty for other API kinds. |
| `ResolutionAttributes` | `resolution_attributes` | Details read from the request body while resolving that operation, for example `a2a.context.id`. Empty for other API kinds. The values come from the request body, so treat them as untrusted. In Go, read them with `Get`, `Lookup`, `Len` and `Iterate`. |

## Auth context

Authentication policies, such as JWT, API key and basic authentication, fill the auth context when they run.

* It is `nil` in Go and `None` in Python until an authentication policy runs.
* When more than one authentication policy runs, `Previous` holds the auth context from the earlier one.

| Go | Python | Description |
|---|---|---|
| `Authenticated` | `authenticated` | `true` when the request was authenticated. |
| `Authorized` | `authorized` | `true` when the request passed an authorization check, such as MCP authorization. Authentication-only policies leave it `false`. |
| `AuthType` | `auth_type` | How the caller authenticated, for example `jwt`, `apikey`, `basic`, `opaque` or `mtls`. |
| `Subject` | `subject` | The caller's identity, such as the JWT `sub` claim, the basic authentication username or the API key owner. |
| `Issuer` | `issuer` | The JWT `iss` claim. Empty for basic and API key authentication. |
| `Audience` | `audience` | The JWT `aud` claim values. Empty for basic and API key authentication. |
| `Scopes` | `scopes` | Granted scopes. Each key is a scope name and each value is `true`. |
| `CredentialID` | `credential_id` | ID of the credential used, such as an OAuth2 client ID or an API key's application ID. |
| `Properties` | `properties` | Other claims, such as custom JWT claims, as strings. A claim with several values is written as one string. |
| `TypedProperties` | `typed_properties` | Other claims in their original types, such as lists and objects. |
| `TokenId` | Not available | The token's unique ID, for example the JWT `jti` claim. |
| `Previous` | `previous` | The auth context from an earlier authentication policy. |

## Metadata

`Metadata` holds values that policies share for one request. A value written in one phase can be read in a later phase, and by policies later in the chain.

* Read and write it in Go with `reqCtx.Metadata["<key>"]`, and in Python with `ctx.shared.metadata["<key>"]`.
* Other policies, including built-in ones, use the same `Metadata`. Start your keys with a prefix unique to your policy, such as `my-policy.`.
* In Python, the gateway keeps every key your policy adds or changes. To clear a value, set it to `None`.

=== "Go"

    ```go
    // In the request phase
    reqCtx.Metadata["my-policy.client-id"] = clientID

    // In the response phase
    clientID, _ := respCtx.Metadata["my-policy.client-id"].(string)
    ```

=== "Python"

    ```python
    # In the request phase
    ctx.shared.metadata["my-policy.client-id"] = client_id

    # In the response phase
    client_id = ctx.shared.metadata.get("my-policy.client-id")
    ```

## Request

These fields are available in the request phases, in `RequestHeaderContext`, `RequestContext` and `RequestStreamContext`.

| Go | Python | Description |
|---|---|---|
| `Headers` | `headers` | Request headers, including changes made by earlier policies. See [Headers](#headers). |
| `Path` | `path` | Request path, for example `/petstore/v1.0.0/pets/123`. |
| `Method` | `method` | HTTP method, for example `GET`. |
| `Authority` | `authority` | The host the client called. |
| `Scheme` | `scheme` | `http` or `https`. |
| `Vhost` | `vhost` | The virtual host that matched the request. |
| `Body` | `body` | Request body. Only in `RequestContext`. See [Body](#body). |
| `Downstream` | `downstream` | The request as the client sent it. See [Client](#client). |
| `Upstream` | `upstream` | The backend the request is routed to. See [Backend](#backend). |

In the streamed request phase, the body arrives in chunks as a separate argument, not in the context.

## Response

These fields are available in the response phases, in `ResponseHeaderContext`, `ResponseContext` and `ResponseStreamContext`.

| Go | Python | Description |
|---|---|---|
| `ResponseHeaders` | `response_headers` | Response headers, including changes made by earlier policies. See [Headers](#headers). |
| `ResponseStatus` | `response_status` | Response status code. |
| `ResponseBody` | `response_body` | Response body. Only in `ResponseContext`. See [Body](#body). |
| `RequestHeaders` | `request_headers` | Request headers. |
| `RequestBody` | `request_body` | Request body, when it was buffered. |
| `RequestPath` | `request_path` | Request path. |
| `RequestMethod` | `request_method` | HTTP method. |
| `Downstream` | `downstream` | The request as the client sent it. See [Client](#client). |
| `Upstream` | `upstream` | The backend, and the response as the backend sent it. See [Backend](#backend). |

In the streamed response phase, the body arrives in chunks as a separate argument, not in the context.

## Headers

Headers are read-only. To change them, return an action from your policy, as shown in [Implement Phase Interfaces](writing-a-custom-policy.md#step-3-implement-phase-interfaces). Header names are case-insensitive.

| Go | Python | Returns |
|---|---|---|
| `Get(name)` | `get(name)` | All values of the header. `nil` in Go and an empty list in Python when the header is missing. |
| `Has(name)` | `has(name)` | `true` when the header exists. |
| `GetAll()` | `get_all()` | A copy of all headers. |
| `Iterate(fn)` | `iterate()` | Each header name with its values. |

## Body

| Go | Python | Description |
|---|---|---|
| `Content` | `content` | The body bytes. |
| `Present` | `present` | `true` when the body is available. `false` when the body was not sent or not buffered. |
| `EndOfStream` | `end_of_stream` | `true` when this is the complete body. |

## Client

`Downstream` describes the client and its request before any policy changed it.

| Go | Python | Description |
|---|---|---|
| `Downstream.Request.Headers` | `downstream.request.headers` | Request headers as the client sent them. |
| `Downstream.Request.Path` | `downstream.request.path` | Request path as the client sent it. |
| `Downstream.Request.Method` | `downstream.request.method` | HTTP method as the client sent it. |
| `Downstream.Request.Authority` | `downstream.request.authority` | Host as the client sent it. |
| `Downstream.Request.Scheme` | `downstream.request.scheme` | `http` or `https`. |
| `Downstream.TLS` | Not available | TLS details of the client connection. See the following table. |

`Downstream.TLS` describes the client's TLS connection and certificate. It is available in Go.

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

| Go | Python | Description |
|---|---|---|
| `Upstream.Name` | `upstream.name` | Name of the backend. |
| `Upstream.URL` | `upstream.url` | Backend URL. To address the backend, for example when you sign a request, use this URL, not `Authority` or `Scheme`. |
| `Upstream.BasePath` | `upstream.base_path` | Backend base path. |
| `Upstream.Response.StatusCode` | `upstream.response.status_code` | Response phases only. Status code the backend sent, before any policy changed it. |
| `Upstream.Response.Headers` | `upstream.response.headers` | Response phases only. Headers the backend sent, before any policy changed them. |

!!! note
    In Go, `RequestContext` also has `UpstreamInfo`. It is deprecated. Use `Upstream` instead.

## Execution context (Python)

Python hooks also receive an `ExecutionContext` as their first argument. Go hooks receive a standard `context.Context` instead.

| Field | Description |
|---|---|
| `request_id` | Unique ID of the request. |
| `phase` | The phase that is running. |
| `route_name` | The route that matched the request. |
| `policy_name`, `policy_version` | Your policy's name and version. |
| `trace_id`, `span_id` | Tracing IDs, when tracing is on. |
| `deadline` | The time by which the hook should finish, when one is set. |
| `is_cancelled()` | `true` when the gateway cancelled this execution. Check it before slow work. |

## Values in traffic logs

[Traffic logging](../../observability/traffic-logging/overview.md) can add some of these values to each log line. For the full list of traffic log variables, see [Variable Reference](../../observability/traffic-logging/variable-reference.md).

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
