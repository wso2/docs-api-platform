---
title: "Configure Gateway Timeouts"
description: "Configure gateway-level and API-level timeouts (connect, route, idle, and HTTP connection manager) in the API Platform AI Gateway to protect against slow or unreachable backends and slow clients."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/resiliency/timeouts/
md_url: https://wso2.com/api-platform/docs/ai-gateway/resiliency/timeouts.md
tags:
  - ai-gateway
  - configuration
  - networking
  - resiliency
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-30
content_type: "how-to"
---

# Configuring Timeouts

This guide explains how to configure **timeouts** for the API Platform Gateway so that requests to slow or unreachable backends, and slow downstream clients, fail within a predictable time instead of hanging indefinitely.

Timeouts are configured at **two levels**:

| Level | Where it is configured | Scope | Typical use |
|-------|------------------------|-------|-------------|
| **Gateway level** | Inside the gateway `config.toml` | Global defaults applied to **all** traffic on the gateway | Operator-wide baselines (connect timeout, default route timeout, downstream/HCM timeouts) |
| **API level** | The API definition — the `resilience` block and `upstreamDefinitions[].timeout.connect` | A single API, its routes, and its upstream clusters | Per-API/per-route overrides for backends that are faster or slower than the global default |

The gateway level establishes the **defaults**. The API level **overrides** those defaults for a specific API. When an API does not specify a value, the gateway-level default applies.

## Gateway-level timeouts (config.toml)

These timeouts are global defaults that apply to every request handled by the gateway, regardless of which API serves it. You can use `gateway/configs/config-template.toml` as a reference when creating your own `config.toml`.

There are two groups:

- **Upstream timeouts** (`[router.upstream.timeouts]`) — govern the connection to, and the response from, the **backend**.
- **HTTP Connection Manager (HCM) timeouts** (`[router.http_listener.timeouts]`) — govern the **downstream** connection between the client and the gateway.

### Upstream timeouts

```toml
[router.upstream.timeouts]
route_timeout_ms      = 60000   # Default per-route request→response timeout
route_idle_timeout_ms = 300000  # Default per-route stream idle timeout
connect_timeout_ms    = 5000    # TCP connection establishment timeout
```

| Setting | Default | Maps to (Envoy) | Description |
|---------|---------|-----------------|---------|
| `connect_timeout_ms` | `5000` | Cluster `connect_timeout` | How long the gateway waits to **establish a TCP connection** to an upstream endpoint before failing the request. |
| `route_timeout_ms` | `60000` | `RouteAction.timeout` | Default maximum time for the **entire request→upstream-response** on a route. This is the default that an API's `resilience.timeout` overrides. |
| `route_idle_timeout_ms` | `300000` | `RouteAction.idle_timeout` | Default **per-route stream idle** timeout. This is the default that an API's `resilience.idleTimeout` overrides. |

!!! note
    All three values must be **positive** (greater than `0`). To disable a *route* timeout for a specific API, set its `resilience` value to `0s` (see [API-level timeouts](#api-level-timeouts)).

### HTTP Connection Manager (downstream) timeouts

These govern the connection between the **client and the gateway**. A value of `"0s"` disables the corresponding timeout.

```toml
# HTTP Connection Manager (downstream) timeouts
[router.http_listener.timeouts]
request_timeout         = "0s"   # Max duration for the entire downstream request
request_headers_timeout = "0s"   # Max duration to receive the complete request headers
stream_idle_timeout     = "5m"   # Idle timeout for a single HTTP stream/request
idle_timeout            = "1h"   # Idle timeout for the downstream connection
```

| Setting | Default | Maps to (Envoy) | Description |
|---------|---------|-----------------|---------|
| `request_timeout` | `0s` (disabled) | HCM `request_timeout` | Max time for the gateway to receive the **entire** downstream request. |
| `request_headers_timeout` | `0s` (disabled) | HCM `request_headers_timeout` | Max time to receive the **complete request headers**. |
| `stream_idle_timeout` | `5m` | HCM `stream_idle_timeout` | Idle timeout for a single HTTP **stream/request**. |
| `idle_timeout` | `1h` | HCM `common_http_protocol_options.idle_timeout` | Idle timeout for the downstream **connection**. |

Durations use Go duration syntax with a single unit (for example `"30s"`, `"500ms"`, `"5m"`, `"1h"`). If a value is left unset, the Envoy default for that field applies.

!!! warning
    `idle_timeout` can also be disabled by setting it to zero explicitly. Disabling it has a high likelihood of yielding connection leaks (for example, due to lost TCP FIN packets).

### Setting gateway-level timeouts in different deployments

#### Standalone / local

Configure the timeouts directly in `gateway/configs/config.toml` using the structure shown above.

#### Kubernetes with Helm

When deploying the gateway via the Helm chart, the same settings are controlled through Helm values under `gateway.config.router.*`. Example `values.yaml` snippet:

```yaml
gateway:
  config:
    router:
      upstream:
        timeouts:
          connect_timeout_ms: 5000
          route_timeout_ms: 60000
          route_idle_timeout_ms: 300000
      http_listener:
        timeouts:
          request_timeout: "0s"
          request_headers_timeout: "0s"
          stream_idle_timeout: "5m"
          idle_timeout: "1h"
```

The chart renders these values into the generated `config.toml` used by the gateway controller.

## API-level timeouts

Two of the timeout layers are naturally per-API and can be tuned directly in the API definition, each through its own field:

| Surface | Field(s) | Maps to (Envoy) | Overrides gateway default |
|---------|----------|-----------------|--------------------------|
| Connect timeout per upstream (`upstreamDefinitions[].timeout.connect`) | `connect` | Cluster `connect_timeout` | `connect_timeout_ms` |
| `resilience` block | `timeout`, `idleTimeout` | `RouteAction.timeout` / `idle_timeout` | `route_timeout_ms` / `route_idle_timeout_ms` |

The HCM (downstream) timeouts have no per-API equivalent and remain gateway-level only.

### Connect timeout per upstream (`upstreamDefinitions[].timeout.connect`)

When an API routes through a named **upstream definition**, that definition can set its own `connect` timeout, which overrides the gateway-level `connect_timeout_ms` for the cluster built from it. Because the setting lives on the upstream definition, different upstreams used by the same API can have different connect timeouts.

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: openai-provider
spec:
  displayName: OpenAI Provider
  version: v1.0
  template: openai
  context: /openai
  upstreamDefinitions:
    - name: openai-backend
      timeout:
        connect: 6000ms        # overrides connect_timeout_ms for this cluster
      upstreams:
        - url: https://api.openai.com/v1
  upstream:
    ref: openai-backend        # this provider routes through the openai-backend cluster
  accessControl:
    mode: deny_all
    exceptions:
      - path: /chat/completions
        methods: [POST]
```

The same shape applies to the `Mcp` kind — declare `upstreamDefinitions` at the spec level and point `upstream.ref` at the definition by name.

- `connect` is a duration string (for example `6000ms`, `5s`).
- It governs only **TCP connection establishment** (plus the TLS handshake for HTTPS upstreams) — not the response wait, which is the route timeout below.
- An API that uses a direct `upstream.url` (instead of an `upstreamDefinitions` ref) uses the gateway-level `connect_timeout_ms`.

!!! note
    `upstreamDefinitions` — and therefore the per-upstream `connect` timeout — are supported only for the **`LlmProvider`** and **`Mcp`** kinds. **`LlmProxy`** does not connect to a backend directly (it loops back to its backing provider), so it has no upstream definition of its own. To bound connection establishment for a proxied call, configure the connect timeout on the backing `LlmProvider` to match your requirements.

### Route timeouts (via `resilience` block)

The `resilience` block lets an individual API override the gateway-level **route** timeouts for its own traffic. It maps to Envoy's `RouteAction` timeouts.

!!! note
    For all three kinds — **`LlmProvider`**, **`LlmProxy`**, and **`Mcp`** — the `resilience` block is supported at the **API level only**. There is no operation-level override; a single API-level block applies to every route generated for the API.

It supports two fields:

| Field | Maps to (Envoy) | Overrides gateway default |
|-------|-----------------|--------------------------|
| `timeout` | `RouteAction.timeout` | `route_timeout_ms` |
| `idleTimeout` | `RouteAction.idle_timeout` | `route_idle_timeout_ms` |

!!! note "Duration format"
    `timeout` and `idleTimeout` take single-unit duration strings (for example `30s`, `500ms`, `1.5m`). Use `0s` to disable a timeout, or omit the field to fall back to the gateway-level default. Compound (`1h30m`), negative (`-30s`), and unitless (`0`, `30`) values are rejected.


### Sample LLM Provider, LLM Proxy, and MCP:

For `LlmProvider` and `LlmProxy`, the `resilience` block is supported at the **API level only**. LLM routes are generated by the gateway from the access-control configuration and policy attachments (rather than authored as explicit operations), so there is no operation-level override. A single API-level block applies to **all** routes generated for the LLM API.

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: openai-provider
spec:
  displayName: OpenAI Provider
  version: v1.0
  template: openai
  context: /openai
  upstream:
    url: https://api.openai.com/v1
  accessControl:
    mode: deny_all
    exceptions:
      - path: /chat/completions
        methods: [POST]
  # Applies to every route generated for this provider.
  resilience:
    timeout: 60s
    idleTimeout: 30s
```

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProxy
metadata:
  name: openai-proxy
spec:
  displayName: OpenAI Proxy
  version: v1.0
  context: /openai-proxy
  provider:
    id: openai-provider
  resilience:
    timeout: 75s
```

!!! note "LLM Proxy double hop"
    A request to a proxy traverses two routes — `client → proxy route → (loopback) → provider route → backend`. The **proxy's** `resilience.timeout` bounds the whole proxied call, while the backing **provider's** `resilience.timeout` bounds the provider→backend call. For a meaningful end-to-end budget, keep the proxy timeout greater than or equal to the provider timeout; the shorter of the two effectively wins.

For `Mcp`, the `resilience` block applies to the traffic-forwarding routes generated for the proxy. Because MCP transports are long-lived streams, MCP treats the **route timeout** differently from the other kinds (see the note below).

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: everything-mcp
spec:
  displayName: Everything MCP
  version: v1.0
  context: /everything
  upstream:
    url: https://mcp.example.com
  # Applies to the traffic-forwarding routes generated for this MCP proxy.
  resilience:
    idleTimeout: 30m
```

!!! note "MCP route timeout defaults to disabled"
    MCP transports (SSE / streamable HTTP) are long-lived streams, so a finite route timeout would sever an otherwise healthy stream. For `Mcp`, the route `timeout` therefore defaults to **disabled (`0s`)** when the `resilience` block does not set it — unlike the other kinds, which fall back to the gateway-level `route_timeout_ms`. Liveness on a stalled stream is instead bounded by `idleTimeout`. You can still set `timeout` explicitly if you need a hard cap, but be aware it will cut long-lived streams. The per-upstream `connect` timeout still applies to MCP as usual.

## Practical guidance

### Connect timeout (`connect_timeout_ms`)

- **Decrease** when backends are highly available and you want to fail fast on unhealthy or misconfigured targets, freeing resources quickly.
- **Increase** when backends sit behind slower networks/load balancers, or may experience cold starts or scaling events that briefly delay connection establishment.
- Avoid setting it too low — it may cause **false-positive timeouts** during short periods of backend slowness or network jitter.
- Set the **gateway default** for the common case, and override **per upstream** via `upstreamDefinitions[].timeout.connect` (see [Connect timeout per upstream](#connect-timeout-per-upstream-upstreamdefinitionstimeoutconnect)) when a specific backend needs a different connection budget.

### Route timeout (`route_timeout_ms` / `resilience.timeout`)

- Set the **gateway default** to a sane upper bound for typical backends, and use **API level** `resilience.timeout` for endpoints that are known to be faster (tighter budget) or legitimately slower (e.g. report generation, LLM completions).
- For streaming/long-lived responses (e.g. SSE from LLM backends), be mindful of `idleTimeout`: a long total `timeout` with a short `idleTimeout` can still cut a slow token stream. Leave `idleTimeout` generous (or unset) for streaming providers.

### HCM/downstream timeouts

- `request_headers_timeout` is a useful protection against slow-header (Slowloris-style) clients; enable it with a small value (for example `"5s"`) if your clients are expected to send headers promptly.
- `request_timeout` is disabled by default; enable it only if you want a hard cap on how long the gateway will spend receiving an entire downstream request.

## Example scenarios

### A slow-to-connect backend

A backend may take a few seconds to accept new connections during peak load. Give connections more time than the default while still failing in a bounded time when the backend is unreachable:

```toml
[router.upstream.timeouts]
connect_timeout_ms = 6000
```

The gateway gives each upstream connection attempt up to 6 seconds; if the backend is down, requests fail after ~6 seconds (`503`) instead of hanging.

### Disabling the route timeout for a long-running API

```yaml
spec:
  resilience:
    timeout: 0s   # no route (response) timeout for this API
```

Disabling the route timeout removes only the per-route **response deadline** — it does not make the request truly unbounded. The request is still subject to every other applicable timeout: the upstream `connect_timeout_ms`, the route `idleTimeout`, and the downstream HCM `stream_idle_timeout` / `idle_timeout`, any of which can still terminate a stalled stream or connection. In other words, behaviour is bounded by all applicable gateway- and API-level timeouts. Use with care.