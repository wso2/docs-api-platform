---
title: "Outbound HTTP Client and Proxy Configuration"
description: "Configure connection pooling, timeouts, TLS, and forward-proxy settings for the gateway's outbound HTTP clients."
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

The gateway has two outbound HTTP clients, one for the Gateway Controller and one for the Policy Engine:

| Client | Used by | What it calls |
|--------|---------|----------------|
| `controller.http_client` | Gateway Controller | The control plane, the Platform API, and on-premises APIM, for artifact and deployment sync |
| `policy_engine.http_client` | Policy Engine | Outbound calls a policy makes, such as to a guardrail or moderation service, an external validation service, or an LLM provider |

Both clients take the same settings. Every setting on this page applies to either one: use `controller.http_client` or `policy_engine.http_client` as the table prefix.

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
| `enable_http2` | `false` | Uses HTTP/2 for this client. |

!!! note "HTTP/2 is off by default"
    With HTTP/2, a single connection can serve requests for more than one hostname that resolves to the same address. Review this before enabling it if you rely on per-hostname network segmentation.

Every key in this table is optional, and omitting the whole `[*.http_client.pooling]` section keeps these defaults.

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

| Setting | Controller default | Policy Engine default | Description |
|---------|---------------------|--------------------------|--------------|
| `overall` | `60s` | `30s` | Upper bound for an entire outbound call. |
| `dial` | `10s` | `10s` | TCP connection establishment timeout. |
| `tls_handshake` | `10s` | `10s` | Time allowed to complete the TLS handshake. |
| `response_header` | `10s` | `10s` | Time allowed to receive the response headers. |
| `expect_continue` | `1s` | `1s` | Time to wait for a `100 Continue` response. |
| `max_response_bytes` | `0` | `0` | Response body size cap. `0` applies the default cap of 10 MiB; a negative value disables the cap. |

`overall` is an upper bound. Individual operations can have shorter timeouts of their own, so lowering `overall` shortens every call, but raising it doesn't lengthen an operation that already times out sooner.

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
| `cipher_suites` | Empty | Comma-separated IANA cipher suite names; only affects TLS 1.2 and below. Empty applies a secure built-in default set. |
| `curve_preferences` | Empty | Comma-separated TLS 1.3 key-exchange groups, most preferred first. Empty offers the hybrid post-quantum group `X25519MLKEM768` first, followed by classical curves. See [Post-quantum cryptography](ports-and-tls-configuration.md#post-quantum-cryptography). |
| `root_ca_file` | Empty | PEM certificate authority (CA) bundle trusted for the destination's certificate. Empty uses the system root pool. |
| `client_cert_file` / `client_key_file` | Empty | Client certificate and key for mutual TLS (mTLS) to the destination. Set both or neither. |

The Gateway Controller's client has no `insecure_skip_verify` field. It follows `controller.controlplane.insecure_skip_verify` instead.

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

A `no_proxy` entry is an exact hostname, a `.suffix` domain match, or a CIDR block, matched case-insensitively.

`proxy.tls` configures the TLS connection to the proxy itself, when the proxy address is `https://`. It's independent of the destination TLS settings above, so you can trust a different CA or present a different certificate to the proxy. `insecure_skip_verify` disables certificate verification for the proxy connection; use it only in a development environment.

`egress` states how the gateway handles destination checks when a forward proxy is configured:

| Value | Behavior |
|-------|----------|
| `delegated` | Trusts the proxy's own egress controls to enforce which destinations are reachable. |
| `manual_connect` | Validates the destination before sending a `CONNECT` request to the proxy. |

## Kubernetes with Helm

The Helm chart has no structured values for these settings. Set them through `gateway.config_toml`, which adds raw TOML to the gateway's `config.toml`. For example:

```yaml
gateway:
  config_toml: |
    [controller.http_client.timeouts]
    overall = "60s"

    [controller.http_client.proxy]
    mode = "url"
    url = "http://proxy.internal:3128"
    no_proxy = [".internal.example.com", "10.0.0.0/8"]
```

`gateway.config_toml` is stored in a ConfigMap. Don't put a proxy password in it as a literal value; use an [interpolation token](configuration.md#interpolation-tokens) such as `{{ env "PROXY_PASSWORD" }}` and supply the variable to the gateway deployment.

---

[← Ports and TLS Configuration](./ports-and-tls-configuration.md) &nbsp;|&nbsp; [Configuring Timeouts →](../resiliency/timeouts.md)
