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

The Platform API and the AI Workspace backend for frontend (BFF) each have an outbound HTTP client with its own settings:

| Client | Used by | What it calls |
|--------|---------|----------------|
| `platform_api.http_client` | Platform API | Model Context Protocol (MCP) reachability checks, and OpenAPI specs fetched by URL for LLM provider templates. Both destinations are supplied by an organization admin. |
| `ai_workspace.http_client` | AI Workspace BFF | The Platform API, at the URL configured under `[ai_workspace.control_plane]` |

Both clients take the same settings, but some defaults differ. The tables below list both defaults wherever they differ.

TLS *trust* for the BFF's calls to the Platform API (`tls_skip_verify` and `ca_file` under `[ai_workspace.control_plane]`) is configured separately. See [Secure traffic with TLS](tls.md#step-3-make-the-bff-verify-the-platform-api).

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
| `enable_http2` | `false` | `true` | Whether this client uses HTTP/2. |

The Platform API disables keep-alives by default because its outbound calls are one-off checks and fetches that don't benefit from reusing a connection.

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
| `overall` | `60s` | `30s` | Upper bound for an entire outbound call. |
| `dial` | `10s` | `10s` | TCP connection establishment timeout. |
| `tls_handshake` | `10s` | `10s` | Time allowed to complete the TLS handshake. |
| `response_header` | `10s` | `10s` | Time allowed to receive the response headers. |
| `expect_continue` | `1s` | `1s` | Time to wait for a `100 Continue` response. |
| `max_response_bytes` | `-1` (no cap) | `-1` (no cap) | Response body size cap; a negative value disables it. |

Both clients leave `max_response_bytes` uncapped by default. The Platform API limits OpenAPI spec fetches separately through `openapi_spec_max_fetch_bytes`. The AI Workspace client carries streamed LLM responses, which a size cap would cut off.

Calls from the AI Workspace BFF to the Platform API time out after 60 seconds regardless of `overall`.

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
| `min_version` / `max_version` | `TLS1_2` / `TLS1_3` (Platform API); empty (AI Workspace) | Bounds the negotiated TLS version. On the AI Workspace client, empty means a TLS 1.2 minimum and no maximum. |
| `cipher_suites` | Empty | Comma-separated IANA cipher suite names; only affects TLS 1.2 and below. |
| `curve_preferences` | Empty | See [Post-quantum cryptography for outbound calls](#post-quantum-cryptography-for-outbound-calls) below. |
| `root_ca_file` | Empty | PEM certificate authority (CA) bundle trusted for the destination's certificate. Empty uses the system root pool. |
| `client_cert_file` / `client_key_file` | Empty | Client certificate and key for mutual TLS (mTLS) to the destination. Set both or neither. |

The Platform API client also takes `insecure_skip_verify` (default `false`). Enable it only in a local or development environment.

### Post-quantum cryptography for outbound calls

`curve_preferences` is a comma-separated list of TLS 1.3 key-exchange groups, most preferred first. When it's empty, both clients offer the hybrid post-quantum group `X25519MLKEM768` first, followed by the classical curves, so post-quantum key exchange is used with any destination that supports it. A destination that doesn't support the hybrid group falls back to a classical curve.

Set the list only to change that order or to restrict the groups offered. For example, to offer classical curves only:

```toml
[platform_api.http_client.tls]
curve_preferences = "X25519,P-256"
```

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

`[*.http_client.proxy.tls]` configures the TLS connection to the proxy itself, used only when `mode = "url"` and the proxy address is `https://`. It's independent of the destination TLS settings above.

`egress` (`"delegated"` or `"manual_connect"`) applies only to the Platform API client.

## Related

- [TLS Ciphers and Post-Quantum Cryptography](tls-ciphers-and-post-quantum-cryptography.md): cipher suites and PQC for each HTTPS listener
- [Secure traffic with TLS](tls.md): the BFF's trust settings for its calls to the Platform API
- [Harden the deployment](harden.md): bounding connections and restricting what each container can reach
