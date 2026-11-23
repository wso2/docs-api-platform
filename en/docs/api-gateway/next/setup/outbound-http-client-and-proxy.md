---
title: "Outbound HTTP Client and Proxy Configuration"
description: "Configure connection pooling, timeouts, TLS, and forward-proxy settings for the gateway's shared outbound HTTP clients."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/setup/outbound-http-client-and-proxy/
md_url: https://wso2.com/api-platform/docs/api-gateway/setup/outbound-http-client-and-proxy.md
tags:
  - api-gateway
  - configuration
  - proxy
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-11
content_type: "reference"
---

# Outbound HTTP Client and Proxy Configuration

The gateway builds two shared outbound HTTP clients at startup, one per process:

| Client | Used by | What it calls |
|--------|---------|----------------|
| `controller.http_client` | Gateway Controller | The control plane, the platform API, and on-prem APIM, for artifact and deployment sync |
| `policy_engine.http_client` | Policy Engine | Injected into every policy instance, for a policy's own outbound call (a guardrail or moderation backend, an external validation service, an LLM provider) |

Both mirror the same underlying shape, so every setting on this page applies to either one by substituting `controller.http_client` or `policy_engine.http_client` as the table prefix. A policy should use the injected client instead of building its own `*http.Client` for an outbound call.

## Connection pooling

```toml
[controller.http_client.pooling]
max_idle_conns          = 100
max_idle_conns_per_host  = 10
max_conns_per_host       = 100
idle_conn_timeout        = "90s"
keep_alive               = "30s"
disable_keep_alives      = false
enable_http2             = false
```

| Setting | Default | Description |
|---------|---------|--------------|
| `max_idle_conns` | `100` | Maximum idle (keep-alive) connections across all hosts. |
| `max_idle_conns_per_host` | `10` | Maximum idle connections kept open per destination host. |
| `max_conns_per_host` | `100` | Maximum total connections (idle plus active) per destination host. |
| `idle_conn_timeout` | `90s` | How long an idle connection stays in the pool before it's closed. |
| `keep_alive` | `30s` | TCP keep-alive probe interval for open connections. |
| `disable_keep_alives` | `false` | When `true`, closes each connection after one request instead of reusing it. |
| `enable_http2` | `false` | Opts in to HTTP/2 for this client. |

!!! note "HTTP/2 is off by default"
    This client always sets a custom TLS configuration, which makes Go's `Transport` conservatively disable HTTP/2 unless you re-enable it here. Only opt in after reviewing the HTTP/2 connection-coalescing behavior it introduces — a single connection can end up serving requests for more than one hostname that resolves to the same address, which matters if you rely on per-hostname network segmentation.

Every key in this table is optional, and omitting the whole `[*.http_client.pooling]` section keeps these same defaults.

## Timeouts

```toml
[controller.http_client.timeouts]
overall          = "60s"
dial             = "10s"
tls_handshake    = "10s"
response_header  = "10s"
expect_continue  = "1s"
max_response_bytes = 0
```

| Setting | Controller default | Policy-engine default | Description |
|---------|---------------------|--------------------------|--------------|
| `overall` | `60s` | `30s` | Safety-net budget for the entire outbound call. |
| `dial` | `10s` | `10s` | TCP connection establishment timeout. |
| `tls_handshake` | `10s` | `10s` | Time allowed to complete the TLS handshake. |
| `response_header` | `10s` | `10s` | Time allowed to receive the response headers. |
| `expect_continue` | `1s` | `1s` | Time to wait for a `100 Continue` response. |
| `max_response_bytes` | `0` | `0` | Response body size cap. `0` uses the package default (10 MiB); a negative value disables the cap entirely. |

`overall` is a safety-net budget, not the primary timeout mechanism: each call site enforces its own, tighter deadline through a request context (for example, 5 seconds for well-known discovery, 30 seconds for manifest and platform-API calls). Raise or lower `overall` only to change that backstop, not to tune a specific call's real budget.

The controller and policy-engine ship with different `overall` defaults — 60 seconds and 30 seconds, respectively — reflecting the slower control-plane and platform-API operations the controller's client handles.

## TLS for outbound calls

```toml
[controller.http_client.tls]
min_version       = "TLS1_2"
max_version       = "TLS1_3"
curve_preferences = ""
cipher_suites     = ""
root_ca_file      = ""
client_cert_file  = ""
client_key_file   = ""
```

| Setting | Default | Description |
|---------|---------|--------------|
| `min_version` / `max_version` | `TLS1_2` / `TLS1_3` | Bounds the negotiated TLS version. |
| `cipher_suites` | Empty | Comma-separated Go `crypto/tls` cipher suite names; only affects TLS 1.2 and below. Empty uses Go's own secure default set. |
| `curve_preferences` | Empty | Comma-separated TLS 1.3 key-exchange groups, most preferred first — see [Post-quantum cryptography](ports-and-tls-configuration.md#post-quantum-cryptography) to add the hybrid group `X25519MLKEM768`. |
| `root_ca_file` | Empty | PEM certificate authority (CA) bundle trusted for the destination's certificate. Empty uses the system root pool. |
| `client_cert_file` / `client_key_file` | Empty | Client certificate and key for mutual TLS (mTLS) to the destination. Both or neither. |

The gateway controller's client has one exception: `insecure_skip_verify` isn't a separate field here. It's sourced from `controller.controlplane.insecure_skip_verify`, since that single setting already governs the same trust decision for every one of this client's current callers.

## Forward proxy

```toml
[controller.http_client.proxy]
mode     = "none"
url      = ""
username = ""
password = ""
no_proxy = []
egress   = ""

[controller.http_client.proxy.tls]
root_ca_file      = ""
client_cert_file  = ""
client_key_file   = ""
insecure_skip_verify = false
```

`mode` selects how the client routes outbound calls through a forward proxy:

| Mode | Behavior |
|------|----------|
| `none` (default) | No proxy. Every call connects directly to its destination. |
| `environment` | Follows the standard `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables. |
| `url` | Routes through the proxy at `url`, authenticating with `username`/`password` if set, and bypassing it for any destination matching an entry in `no_proxy`. |

An `no_proxy` entry is an exact hostname, a `.suffix` domain match, or a CIDR block, matched case-insensitively.

`proxy.tls` configures a separate TLS handshake to the proxy itself, when the proxy address is `https://` — it's fully decoupled from the origin TLS settings above, since the client may need a different certificate or CA to reach the proxy than it needs to reach the eventual destination. `insecure_skip_verify` here (as with any TLS trust decision) removes certificate verification for that hop; only use it in a development environment.

`egress` states how the gateway handles origin-destination risk when a forward proxy is configured:

| Value | Behavior |
|-------|----------|
| `delegated` | Trusts the proxy's own egress controls to enforce which destinations are reachable. |
| `manual_connect` | Validates the destination locally before ever issuing a `CONNECT` request to the proxy. |

## Kubernetes with Helm

These settings follow the same `gateway.config.controller.http_client.*` and `gateway.config.policy_engine.http_client.*` Helm values pattern as every other `config.toml` key described in [Configuring Timeouts](../resiliency/timeouts.md#kubernetes-with-helm) — for example:

```yaml
gateway:
  config:
    controller:
      http_client:
        timeouts:
          overall: "60s"
        proxy:
          mode: "url"
          url: "http://proxy.internal:3128"
          no_proxy: [".internal.example.com", "10.0.0.0/8"]
```

---

[← Ports and TLS Configuration](./ports-and-tls-configuration.md) &nbsp;|&nbsp; [Configuring Timeouts →](../resiliency/timeouts.md)
