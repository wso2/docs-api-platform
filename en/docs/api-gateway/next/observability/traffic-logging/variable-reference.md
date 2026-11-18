---
title: "Traffic Log Variables"
description: "Look up the request, API, caller, error, latency and metadata values you can read in API Platform Gateway traffic log properties and templates."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/variable-reference/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/variable-reference.md
tags:
  - api-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "reference"
---

# Traffic Log Variables

Traffic log variables give you values from each request, such as the API name, the caller or the latency.

You can use them in `$ctx:` values in two places.

* [Custom properties](configuration.md#custom-properties), which add fields to the default log line.
* A [custom log format](custom-log-format.md) template, which writes each line in your own layout.

The text after `$ctx:` is an expression that reads these variables. For ready-made expressions, see [Expression examples](#expression-examples).

## Request and response

These variables describe the request and the response sent to the client. Use them to log what was called and how it ended.

| Variable | Type | Description |
|---|---|---|
| `request.timestamp` | string | When the gateway received the request, in UTC. For example, `2026-11-10T09:12:33.482Z`. |
| `request.id` | string | The request's correlation ID. |
| `request.method` | string | HTTP method. |
| `request.path` | string | Request path. |
| `request.pathTemplate` | string | The API resource path that matched the request, for example `/orders/{id}`. |
| `request.header` | map | Request headers, with lower-case names. Read one with `request.header['<name>']`. Requires `collector.request_headers`. |
| `request.body` | string | Request body, cut to `max_payload_size`. Requires `collector.request_body`. |
| `response.status` | number | HTTP status code sent to the client. |
| `response.header` | map | Response headers, with lower-case names. Read one with `response.header['<name>']`. Requires `collector.response_headers`. |
| `response.body` | string | Response body, cut to `max_payload_size`. Requires `collector.response_body`. |

Header values in `masked_headers` are written as `****`.

## API and backend

These variables describe the API that handled the request and the backend it called. Use them to tell APIs and backends apart in your logs.

| Variable | Type | Description |
|---|---|---|
| `api.id` | string | API ID. |
| `api.name` | string | API name. |
| `api.version` | string | API version. |
| `api.context` | string | API context. |
| `api.kind` | string | API kind. |
| `project.id` | string | Project ID. |
| `target.statusCode` | number | Status code returned by the backend. |
| `target.destination` | string | Backend URL the request was sent to. |

## Client and application

These variables describe the caller. Use them to log where a request came from and which application sent it.

| Variable | Type | Description |
|---|---|---|
| `client.ip` | string | Client IP address. |
| `client.userAgent` | string | Client user agent. |
| `application.id` | string | ID of the application identified for the request. |
| `application.name` | string | Application name. |
| `application.owner` | string | Application owner. |
| `application.keyType` | string | Application key type. |

!!! note
    Application variables have a value when an auth policy that identifies the application, such as `api-key-auth`, ran for the request.

## Authentication

These variables describe the authenticated caller and the token. Use them to log who made the request.

They are filled by whichever authentication policy ran for the request, such as JWT, API key or MCP authentication, or a custom authentication policy.

| Variable | Type | Description |
|---|---|---|
| `auth.authenticated` | true/false | Whether the request was authenticated. |
| `auth.authorized` | true/false | Whether the request was authorized. |
| `auth.subject` | string | Authenticated subject. |
| `auth.type` | string | Authentication type. |
| `auth.issuer` | string | Token issuer. |
| `auth.credential_id` | string | Credential ID. |
| `auth.token_id` | string | Token ID. |
| `auth.audience` | list | Token audiences. |
| `auth.scopes` | list | Granted scopes. |
| `auth.property` | map | Token claims. Read one with `auth.property['<claim>']`. |

!!! note
    Claims are logged as they appear in the token. To log only the claims you need, read them one by one, for example `auth.property['tenant']`. To leave out a specific claim, use `exclude_fields`.

## Errors

These variables have a value only when the request failed. Use them to log why a request failed and what rejected it.

| Variable | Type | Description |
|---|---|---|
| `error.category` | string | Error category, for example `AUTH`. |
| `error.errorCode` | number | Error code. |
| `error.errorMessage` | string | Error classification, for example `AUTHENTICATION_FAILURE`. |
| `error.wso2ErrorCode` | number | WSO2 fault code. |
| `error.type` | string | Type of failure, for example `authentication` or `guardrail`. |
| `error.direction` | string | Whether the request or the response was rejected. |
| `error.summary` | string | Message sent to the client. |
| `error.policy` | string | Policy that caused the error. |
| `error.policyPhase` | string | Phase in which that policy ran. |
| `error.source` | string | What produced the response, for example `gateway` or `backend`. |
| `error.originalStatus` | number | Backend status code before a policy changed it. |
| `error.jsonRpcCode` | number | JSON-RPC error code, for MCP requests. |
| `error.guardrail.name` | string | Guardrail that intervened. |
| `error.guardrail.action` | string | Action the guardrail took. |
| `error.guardrail.reason` | string | Reason the guardrail gave. |

## Latencies

These variables describe how long the request took. Use them to find slow APIs and backends.

Latencies are in microseconds.

| Variable | Type | Description |
|---|---|---|
| `latencies.duration` | number | Total time to handle the request. |
| `latencies.backendLatency` | number | Time spent waiting for the backend. |
| `latencies.requestMediationLatency` | number | Time spent processing the request in the gateway. |
| `latencies.responseMediationLatency` | number | Time spent processing the response in the gateway. |

To write a latency in another unit, use `convertUnit(<latency>, '<unit>')`. The unit is one of `'ns'`, `'us'`, `'ms'` or `'s'`.

```json
{"durationMs": "$ctx:convertUnit(latencies.duration, 'ms')"}
```

## Metadata

This variable holds values that policies, including custom and Python policies, share for the request. Use it to log values that no other variable covers.

| Variable | Type | Description |
|---|---|---|
| `metadata` | map | Values that policies share for the request. Read one with `metadata['<key>']`. |

A custom policy adds a value to `metadata` by writing it to the shared `Metadata` map. See [Share data between phases](../../policies/custom-policies/writing-a-custom-policy.md#step-7-share-data-between-phases).

!!! note
    `metadata` values are logged as the policies set them, and they have no masking configuration. Reference only keys whose values are safe to log.

## Expression examples

The following expressions cover common needs.

| To write | Use |
|---|---|
| One header | `"$ctx:request.header['x-request-id']"` |
| One claim | `"$ctx:auth.property['tenant']"` |
| All claims, as an object | `"$ctx:auth.property"` |
| A default value when there is none | `"$ctx:auth.authenticated ? auth.subject : 'anonymous'"` |
| Text combined with a value | `"$ctx:'v' + api.version"` |
