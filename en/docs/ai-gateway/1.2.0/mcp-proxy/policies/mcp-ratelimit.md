---
title: "MCP Rate Limit"
description: "Apply rate limits to MCP traffic per tool, resource, prompt, or JSON-RPC method, with per-capability counters and wildcard rules."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/mcp-proxy/policies/mcp-ratelimit/
md_url: https://wso2.com/api-platform/docs/ai-gateway/mcp-proxy/policies/mcp-ratelimit.md
tags:
  - ai-gateway
  - mcp
  - policies
  - rate-limiting
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-31
content_type: "reference"
---

# MCP Rate Limit

## Overview

The MCP Rate Limit policy applies rate limits to Model Context Protocol (MCP) traffic per capability. Instead of throttling an MCP Proxy as a single endpoint, the policy inspects the JSON-RPC request envelope and enforces independent limits per tool, resource, prompt, or raw JSON-RPC method.

Each configuration entry targets a capability by name, or by `"*"` for all capabilities of that type, and declares one or more limits. You can configure several entries in the same policy and mix exact-name rules with wildcards. Every matched capability gets its own counter, even under a wildcard rule, so one noisy tool can't exhaust the quota of another.

The policy delegates enforcement to the [Advanced Rate Limit](https://github.com/wso2/gateway-controllers/blob/main/docs/advanced-ratelimit/v1.0/docs/advanced-ratelimit.md) engine, so it inherits the same algorithms (GCRA and fixed window), in-memory and Redis backends, key extraction options, and rate-limit response headers. When the gateway throttles a request, the policy returns a JSON-RPC 2.0 error envelope with code `-32000`, so MCP clients can parse the failure.

## Features

- **Per-capability rate limiting**: Throttle individual MCP tools, resources, prompts, or JSON-RPC methods independently.
- **Per-capability counters**: Each matched tool, resource, or prompt keeps its own counter, including matches under a `"*"` wildcard rule.
- **Exact and wildcard matching**: Target a single capability by name, or apply a blanket rule with `"*"`. When both match, the gateway enforces every matching entry and the strictest limit wins.
- **Multiple concurrent limits**: Each entry can enforce several limit windows at once, such as 10 per minute and 1000 per hour.
- **Flexible key extraction**: Build the rate-limit key from headers, metadata, client IP, API name or version, route name, a Common Expression Language (CEL) expression, or a constant, either globally or per entry.
- **MCP-aware error responses**: Throttled requests receive a JSON-RPC 2.0 error envelope by default, which you can override. The policy preserves the `mcp-session-id` header.
- **Server-sent events (SSE) support**: The policy handles both plain JSON and `text/event-stream`-wrapped MCP request envelopes.
- **Dual backends**: Use in-memory storage for single-instance deployments, or Redis for distributed rate limiting across gateway replicas.

## Configuration

The MCP Rate Limit policy uses a two-level configuration model: user parameters set per MCP Proxy in the API definition, and system parameters set by the administrator and shared with the Advanced Rate Limit engine.

### User Parameters (API Definition)

These parameters are configured per MCP Proxy by the API developer:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tools` | `Entry` array | Conditional | - | Rate-limit rules for MCP tools. Each entry targets a tool by name, or `"*"`. 1 to 50 entries. |
| `resources` | `Entry` array | Conditional | - | Rate-limit rules for MCP resources. Each entry targets a resource URI, or `"*"`. 1 to 50 entries. |
| `prompts` | `Entry` array | Conditional | - | Rate-limit rules for MCP prompts. Each entry targets a prompt by name, or `"*"`. 1 to 50 entries. |
| `methods` | `Entry` array | Conditional | - | Rate-limit rules for raw JSON-RPC methods, such as `tools/list` and `tools/call`. Each entry targets a method, or `"*"`. 1 to 50 entries. |
| `keyExtraction` | `KeyExtraction` array | No | `[{type: "routename"}]` | Global key extraction applied to entries that don't define their own. The gateway always appends the matched capability identifier. 0 to 5 components. |
| `onRateLimitExceeded` | `onRateLimitExceeded` object | No | - | Customizes the response returned when a request exceeds its rate limits. Defaults to a JSON-RPC error envelope. |

> **Note**: Specify at least one of `tools`, `resources`, `prompts`, or `methods`.

#### Entry Configuration

Each entry in a `tools`, `resources`, `prompts`, or `methods` array defines a rate-limit rule for a capability:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | No | `"*"` | The capability to rate-limit: a tool name, resource URI, prompt name, or JSON-RPC method, or `"*"` for all capabilities of that type. Exact names take precedence over wildcards, and the gateway enforces every matching entry. |
| `limits` | `Limit` array | Yes | - | One or more limit windows enforced on this entry (1 to 10). The strictest limit wins. |
| `keyExtraction` | `KeyExtraction` array | No | - | Per-entry key extraction, which overrides the global `keyExtraction`. If you set neither, the policy defaults to `[{type: "routename"}]`. |

> The gateway always appends the matched capability identifier — the tool name, resource URI, prompt name, or method — to the rate-limit key, so each distinct capability gets its own counter even when the rule `name` is `"*"`.

#### Limit Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `limit` | integer | Yes | Maximum number of requests allowed in the configured duration (1 to 1,000,000,000). |
| `duration` | string | Yes | Limit window as a Go duration string. Supports the units `ns`, `us`, `µs`, `ms`, `s`, `m`, and `h`, including composite and fractional values such as `"500ms"`, `"1.5s"`, `"1m30s"`, and `"24h"`. |

#### KeyExtraction Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Component type: `"header"`, `"metadata"`, `"ip"`, `"apiname"`, `"apiversion"`, `"routename"`, `"cel"`, or `"constant"`. |
| `key` | string | Conditional | Header name or metadata key. Required for the `header`, `metadata`, and `constant` types (1 to 256 characters). |
| `expression` | string | Conditional | CEL expression that returns a string. Required for the `cel` type (1 to 1024 characters). |

The key extraction types behave as follows:

- `header`: Extract the value from an HTTP header. Requires `key`.
- `metadata`: Extract the value from `SharedContext.Metadata`. Requires `key`.
- `ip`: Extract the client IP from the `X-Forwarded-For` or `X-Real-IP` header.
- `apiname`: Use the API name from the context.
- `apiversion`: Use the API version from the context.
- `routename`: Use the route name from the metadata. This is the default.
- `cel`: Evaluate a CEL expression that returns a string. Requires `expression`.
- `constant`: Use a fixed string value. Requires `key`.

#### onRateLimitExceeded Configuration

This object customizes the response the gateway returns when a request exceeds its rate limits. If you omit it, the policy emits a JSON-RPC 2.0 error object with code `-32000`.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `statusCode` | integer | No | `429` | HTTP status code returned for rate-limited requests (400 to 599). |
| `body` | string | No | JSON-RPC `-32000` error envelope | Response body returned for rate-limited requests (up to 8192 characters). When you set it, the gateway returns it verbatim instead of the JSON-RPC envelope. |
| `bodyFormat` | string | No | `"json"` | Response body format: `"json"` or `"plain"`. |

### System Parameters (config.toml)

The administrator sets these parameters, and they're shared with the Advanced Rate Limit engine, so they apply to every rate-limiting policy built on it.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `algorithm` | string | No | `"fixed-window"` | Rate-limiting algorithm: `"gcra"` for smoother burst handling, or `"fixed-window"` for interval counting. |
| `backend` | string | No | `"memory"` | Storage backend: `"memory"` for single-instance limits, or `"redis"` for distributed limits. |
| `redis` | `Redis` object | No | - | Redis configuration, used when `backend` is `redis`. |
| `memory` | `Memory` object | No | - | In-memory storage configuration, used when `backend` is `memory`. |
| `headers` | `Headers` object | No | - | Controls which rate-limit headers the gateway adds to responses. |

For the full `redis`, `memory`, and `headers` sub-fields and a sample `config.toml`, see the [Advanced Rate Limit policy documentation](https://github.com/wso2/gateway-controllers/blob/main/docs/advanced-ratelimit/v1.0/docs/advanced-ratelimit.md).

Add the policy module under `policies:` in `gateway/build.yaml`:

```yaml
- name: mcp-ratelimit
  gomodule: github.com/wso2/gateway-controllers/policies/mcp-ratelimit@v1
```

## MCP Proxy Definition Examples

### Example 1: Rate limit a specific tool

Limit calls to a single expensive tool and leave every other capability untouched:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: mcp-server-api-v1.0
spec:
  displayName: mcp-server-api
  version: v1.0
  context: /mcpserver
  upstream:
    url: https://mcp-backend:8080
  policies:
    - name: mcp-ratelimit
      version: v1
      params:
        tools:
          - name: generate-report
            limits:
              - limit: 5
                duration: "1m"
  tools:
    ...
```

### Example 2: Wildcard rule for all tools

Apply a blanket limit to every tool. Each tool still gets its own counter, so the limit applies per tool rather than across the set:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: mcp-server-api-v1.0
spec:
  displayName: mcp-server-api
  version: v1.0
  context: /mcpserver
  upstream:
    url: https://mcp-backend:8080
  policies:
    - name: mcp-ratelimit
      version: v1
      params:
        tools:
          - name: "*"
            limits:
              - limit: 100
                duration: "1h"
  tools:
    ...
```

### Example 3: Multiple time windows

Enforce several limit windows on the same tool at once. The strictest limit wins:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: mcp-server-api-v1.0
spec:
  displayName: mcp-server-api
  version: v1.0
  context: /mcpserver
  upstream:
    url: https://mcp-backend:8080
  policies:
    - name: mcp-ratelimit
      version: v1
      params:
        tools:
          - name: search
            limits:
              - limit: 10
                duration: "1m"
              - limit: 500
                duration: "24h"
  tools:
    ...
```

### Example 4: Rate limit resources and prompts

Apply different limits to resources and prompts in a single policy:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: mcp-server-api-v1.0
spec:
  displayName: mcp-server-api
  version: v1.0
  context: /mcpserver
  upstream:
    url: https://mcp-backend:8080
  policies:
    - name: mcp-ratelimit
      version: v1
      params:
        resources:
          - name: "file:///reports/quarterly.pdf"
            limits:
              - limit: 20
                duration: "1h"
          - name: "*"
            limits:
              - limit: 200
                duration: "1h"
        prompts:
          - name: summarize
            limits:
              - limit: 30
                duration: "1m"
  resources:
    ...
  prompts:
    ...
```

### Example 5: Rate limit JSON-RPC methods

Throttle raw JSON-RPC methods directly, which is useful for limiting discovery calls such as `tools/list`:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: mcp-server-api-v1.0
spec:
  displayName: mcp-server-api
  version: v1.0
  context: /mcpserver
  upstream:
    url: https://mcp-backend:8080
  policies:
    - name: mcp-ratelimit
      version: v1
      params:
        methods:
          - name: tools/list
            limits:
              - limit: 10
                duration: "1m"
          - name: tools/call
            limits:
              - limit: 100
                duration: "1m"
  tools:
    ...
```

### Example 6: Custom rate-limited response

Override the default JSON-RPC error envelope with a custom body:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: mcp-server-api-v1.0
spec:
  displayName: mcp-server-api
  version: v1.0
  context: /mcpserver
  upstream:
    url: https://mcp-backend:8080
  policies:
    - name: mcp-ratelimit
      version: v1
      params:
        tools:
          - name: "*"
            limits:
              - limit: 100
                duration: "1m"
        onRateLimitExceeded:
          statusCode: 429
          body: '{"jsonrpc":"2.0","id":null,"error":{"code":-32000,"message":"Too many tool calls. Please slow down."}}'
          bodyFormat: json
  tools:
    ...
```

### Example 7: Per-user rate limiting

Throttle each user independently by extracting the identity from a header. The gateway combines the user ID with the matched capability, so each user gets a separate bucket per tool:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: mcp-server-api-v1.0
spec:
  displayName: mcp-server-api
  version: v1.0
  context: /mcpserver
  upstream:
    url: https://mcp-backend:8080
  policies:
    - name: mcp-ratelimit
      version: v1
      params:
        keyExtraction:
          - type: header
            key: X-User-ID
        tools:
          - name: "*"
            limits:
              - limit: 50
                duration: "1h"
  tools:
    ...
```

## How It Works

1. The policy buffers the MCP request body and parses the JSON-RPC envelope, handling both plain JSON and `text/event-stream` payloads.
2. The policy identifies the JSON-RPC `method` and, where applicable, the capability name: `params.name` for `tools/call` and `prompts/get`, and `params.uri` for `resources/read`. It also publishes the `mcp.method`, `mcp.type`, and `mcp.name` metadata for downstream policies.
3. The policy finds every configured entry that matches, taking exact-name matches first and then `"*"` wildcards, and enforces all of them.
4. For each match, the policy resolves and caches an Advanced Rate Limit delegate keyed by the entry and capability. The key extraction is the per-entry configuration, the global configuration, or `[routename]`, plus a trailing constant that carries the capability identifier. This gives each capability its own bucket.
5. If any delegate reports that the limit is exceeded, the gateway rejects the request with the configured response, which is a JSON-RPC `-32000` error envelope by default. Otherwise, the request proceeds upstream.
6. On the response, the policy forwards to each invoked delegate so it can write its rate-limit headers: `RateLimit-*`, `X-RateLimit-*`, and `Retry-After`.

## Notes

**Relationship with the Advanced Rate Limit policy**

This policy is a thin, MCP-aware front end over the [Advanced Rate Limit](https://github.com/wso2/gateway-controllers/blob/main/docs/advanced-ratelimit/v1.0/docs/advanced-ratelimit.md) engine. The `algorithm`, `backend`, Redis and memory storage, key extraction semantics, and response headers all behave identically, so refer to that policy's documentation for the full system parameter reference and header descriptions.

**Per-capability counters**

The gateway always appends the matched capability identifier to the rate-limit key. A `"*"` rule therefore doesn't create one shared bucket for all tools. Instead, each distinct tool, resource, prompt, or method gets its own counter under the rule.

**Matching precedence**

When a request matches both an exact-name entry and a wildcard entry, the gateway enforces both. Because the strictest applicable limit blocks the request, you can layer a tight per-tool limit on top of a looser catch-all wildcard.

## Use Cases

1. **Expensive tool protection**: Cap calls to tools that trigger costly downstream work, such as report generation or model inference.
2. **Discovery call throttling**: Limit `tools/list` and other discovery methods so a misbehaving client can't poll the server continuously.
3. **Per-user fairness**: Extract a user identity from a header or JWT claim so one caller can't consume a shared quota.
4. **Tiered limits**: Layer a tight limit on a sensitive tool over a looser wildcard limit that covers everything else.
5. **Burst smoothing**: Combine a short window with a long window, such as 10 per minute and 500 per day, to allow bursts while capping total consumption.

## Related Policies

- [MCP Authentication](./mcp-authentication.md) — Establishes the caller identity you can use for per-user rate-limit keys.
- [MCP Authorization](./mcp-authorization.md) — Applies claim-based and scope-based access control before rate limits are counted.
- [MCP Access Control List](./mcp-acl-list.md) — Denies capabilities outright, while this policy rate-limits the rest.
