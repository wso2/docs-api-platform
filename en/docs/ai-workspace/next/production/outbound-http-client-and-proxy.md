---
title: "Outbound HTTP Client and Proxy Configuration"
description: "Configure connection pooling, timeouts, TLS, and forward-proxy settings for the Platform API's and AI Workspace's outbound HTTP clients."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/outbound-http-client-and-proxy/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/outbound-http-client-and-proxy.md
tags:
  - ai-workspace
  - production
  - configuration
  - proxy
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-11
content_type: "reference"
---

# Outbound HTTP Client and Proxy Configuration

The Platform API and the AI Workspace backend for frontend (BFF) each build one shared outbound HTTP client at startup:

| Client | Used by | What it calls |
|--------|---------|----------------|
| `platform_api.http_client` | Platform API | Model Context Protocol (MCP) reachability probes, and OpenAPI-spec-by-URL fetches for LLM provider templates — both destinations an organization admin supplies |
| `ai_workspace.http_client` | AI Workspace BFF | The Platform API, on the single fixed URL configured under `[ai_workspace.control_plane]` |

Both mirror the same underlying shape as every other outbound client in the platform, but their defaults diverge in a few places because of what each one calls — a tenant-supplied destination for the Platform API, versus one fixed, trusted destination for the BFF. The sections below call out every place the two differ.

TLS *trust* for the BFF's one call to the Platform API — `tls_skip_verify` and `ca_file` under `[ai_workspace.control_plane]` — is a separate, narrower setting from anything on this page. See [Secure traffic with TLS](tls.md#step-3-make-the-bff-verify-the-platform-api) for that.

## Connection pooling

```toml
[platform_api.http_client.pooling]
max_idle_conns          = 100
max_idle_conns_per_host = 10
max_conns_per_host      = 100
idle_conn_timeout       = "90s"
keep_alive              = "30s"
disable_keep_alives     = true
enable_http2            = false
```

| Setting | Platform API default | AI Workspace default | Description |
|---------|------------------------|--------------------------|--------------|
| `max_idle_conns` | `100` | `100` | Maximum idle (keep-alive) connections across all hosts. |
| `max_idle_conns_per_host` | `10` | `20` | Maximum idle connections kept open per destination host. |
| `max_conns_per_host` | `100` | `0` (no cap) | Maximum total connections per destination host. |
| `idle_conn_timeout` | `90s` | `90s` | How long an idle connection stays in the pool before it's closed. |
| `keep_alive` | `30s` | `30s` | TCP keep-alive probe interval. |
| `disable_keep_alives` | `true` | `false` | Whether each connection closes after one request instead of being reused. |
| `enable_http2` | `false` | `true` | Whether this client opts in to HTTP/2. |

Two of these are worth pausing on. The Platform API disables keep-alives by default: a one-off outbound probe or fetch (an MCP reachability check, an OpenAPI spec fetch) gains nothing from connection reuse, and reusing a connection whose response was malformed — which some MCP or spec backends do — could corrupt a later, unrelated request. The AI Workspace client enables HTTP/2 by default, the opposite of every other outbound client in the platform: it already set a custom TLS configuration before these settings existed, which otherwise makes Go's `Transport` conservatively disable HTTP/2, so this default simply preserves that transport's prior behavior.

## Timeouts

```toml
[platform_api.http_client.timeouts]
overall          = "60s"
dial             = "10s"
tls_handshake    = "10s"
response_header  = "10s"
expect_continue  = "1s"
max_response_bytes = -1
```

| Setting | Platform API default | AI Workspace default | Description |
|---------|------------------------|--------------------------|--------------|
| `overall` | `60s` | `30s` | Safety-net budget for the entire outbound call. |
| `dial` | `10s` | `10s` | TCP connection establishment timeout. |
| `tls_handshake` | `10s` | `10s` | Time allowed to complete the TLS handshake. |
| `response_header` | `10s` | `10s` | Time allowed to receive the response headers. |
| `expect_continue` | `1s` | `1s` | Time to wait for a `100 Continue` response. |
| `max_response_bytes` | `-1` (no cap) | `-1` (no cap) | Response body size cap; negative disables it. |

Both clients leave `max_response_bytes` uncapped, but for different reasons. The Platform API applies its own, separately configured caps at each call site instead — `openapi_spec_max_fetch_bytes` for spec fetches, a fixed bound for MCP responses — so a client-level cap here would silently shadow whichever of those is smaller. The AI Workspace client backs a reverse proxy that streams Server-Sent Events (SSE) and other long-running LLM output between the BFF and the Platform API, where truncating a legitimate long stream would be worse than not bounding it.

`overall` on the AI Workspace client has no observable effect at its one call site today — the BFF extracts only the underlying transport and applies its own separate 60-second timeout on top. The setting exists for shape parity with every other outbound client and for future use.

## TLS for outbound calls

```toml
[platform_api.http_client.tls]
min_version       = "TLS1_2"
max_version       = "TLS1_3"
cipher_suites     = ""
curve_preferences = ""
root_ca_file      = ""
client_cert_file  = ""
client_key_file   = ""
```

| Setting | Default | Description |
|---------|---------|--------------|
| `min_version` / `max_version` | `TLS1_2` / `TLS1_3` (Platform API); empty/empty (AI Workspace) | Bounds the negotiated TLS version. The AI Workspace client leaves both empty, which uses Go's own default (currently a TLS 1.2 floor with no configured ceiling) — set them explicitly to bound it. |
| `cipher_suites` | Empty | Comma-separated Go `crypto/tls` cipher suite names; only affects TLS 1.2 and below. |
| `curve_preferences` | Empty | See [Post-quantum cryptography for outbound calls](#post-quantum-cryptography-for-outbound-calls) below. |
| `root_ca_file` | Empty | PEM certificate authority (CA) bundle trusted for the destination's certificate. Empty uses the system root pool. |
| `client_cert_file` / `client_key_file` | Empty | Client certificate and key for mutual TLS (mTLS) to the destination. Both or neither. |

The Platform API client also takes `insecure_skip_verify` (default `false`) directly, since — unlike the gateway's outbound clients, which reuse an existing control-plane trust setting — the Platform API has no equivalent setting to source it from. Enable it only in a local or development environment.

### Post-quantum cryptography for outbound calls

Both clients' `curve_preferences` default to empty — Go's own defaults, no post-quantum key exchange. Prepend the hybrid group once the destination is confirmed to support it:

```toml
[platform_api.http_client.tls]
curve_preferences = "X25519MLKEM768,X25519,P-256"
```

A peer that doesn't offer the hybrid group falls back to a later, classical entry in the same list.

## Forward proxy

```toml
[platform_api.http_client.proxy]
mode     = "none"
url      = ""
username = ""
password = ""
no_proxy = []
egress   = ""
```

| Setting | Platform API default | AI Workspace default |
|---------|------------------------|--------------------------|
| `mode` | `none` | `environment` |

`mode` selects how the client routes outbound calls:

| Mode | Behavior |
|------|----------|
| `none` | No proxy. Every call connects directly to its destination. |
| `environment` | Follows the standard `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables. |
| `url` | Routes through the proxy at `url`, authenticating with `username`/`password` if set, and bypassing it for any destination matching an entry in `no_proxy` (an exact hostname, a `.suffix` domain match, or a CIDR block). |

The AI Workspace client is the one exception to `none` being the default: it defaults to `environment` to preserve the transport's behavior from before this setting existed, when it always read those environment variables directly.

`[*.http_client.proxy.tls]` configures a separate TLS handshake to the proxy itself, used only when `mode = "url"` and the proxy address is `https://`. It's fully decoupled from the origin TLS settings above.

`egress` (`"delegated"` or `"manual_connect"`) applies only to the Platform API client; it isn't meaningful on the AI Workspace client.

## Related

- [TLS Ciphers and Post-Quantum Cryptography](tls-ciphers-and-post-quantum-cryptography.md): cipher suites and PQC for each HTTPS listener
- [Secure traffic with TLS](tls.md): the BFF's trust settings for its one call to the Platform API
- [Harden the deployment](harden.md): bounding connections and restricting what each container can reach
