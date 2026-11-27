---
title: "TLS and post-quantum cryptography"
description: "Set the TLS versions, cipher suites, and key-exchange groups the API Portal uses, and turn on post-quantum key exchange."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/setting-up/tls-and-post-quantum-cryptography/
md_url: https://wso2.com/api-platform/docs/api-portal/next/setting-up/tls-and-post-quantum-cryptography.md
tags:
  - api-portal
  - configuration
  - tls
  - security
  - post-quantum-cryptography
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-23
content_type: "how-to"
---

# TLS and post-quantum cryptography

This page is for operators who run the API Portal & MCP Hub. It covers the Transport Layer Security (TLS) protocol versions, cipher suites, and key-exchange groups the portal uses, and how to turn on post-quantum key exchange.

## Where the settings apply

The portal has two TLS sections in `config.toml`, and both take the same keys:

| Section | Applies to |
|---------|------------|
| `[api_portal.server.https]` | The portal's HTTPS listener, which browsers and Management API clients connect to. It applies only when `enabled = true`. |
| `[api_portal.http_client.tls]` | Connections the portal opens to other services: the Platform API sign-in in local authentication mode, token refresh requests to the identity provider, key managers, billing providers, the try-it proxy, and webhook delivery. |

If a proxy, load balancer, or ingress terminates TLS in front of the portal, that component's settings decide what browsers negotiate. The listener settings then govern only the connection from that component to the portal, and only when it forwards traffic over HTTPS. If it forwards cleartext, the listener settings don't apply.

!!! note "Sign-in code exchange and signing keys"
    Two connections to the identity provider don't use `[api_portal.http_client.tls]`: exchanging the sign-in authorization code for tokens, and fetching the provider's signing keys from `jwks_url`. They offer the hybrid post-quantum group `X25519MLKEM768` first and fall back to classical curves. You can't change their settings in `config.toml`.

## TLS settings

Each section takes the following keys:

| Key | Default | Description |
|-----|---------|-------------|
| `minimum_protocol_version` / `maximum_protocol_version` | `TLS1_2` / `TLS1_3` | Bounds the negotiated TLS version. Each takes `TLS1_0`, `TLS1_1`, `TLS1_2`, or `TLS1_3`. |
| `ciphers` | Empty | Comma-separated cipher suite names in OpenSSL-style naming, for example `ECDHE-RSA-AES128-GCM-SHA256`. Restricts the suites negotiated for TLS 1.2 and below; TLS 1.3 suites aren't configurable. Empty applies a secure built-in default set. |
| `ecdh_curves` | `X25519,P-256` | Comma-separated key-exchange groups, most preferred first. Supported values are `X25519`, `P-256`, `P-384`, `P-521`, and `X25519MLKEM768`. |

The portal checks these values when it starts. It doesn't start if any of the following is true:

- A protocol version, cipher suite, or key-exchange group name isn't recognized.
- The minimum protocol version is higher than the maximum.
- `ecdh_curves` is empty.

!!! note "Cipher suite names differ between components"
    The API Portal takes OpenSSL-style cipher suite names. The Platform API takes Internet Assigned Numbers Authority (IANA) names, such as `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`, so a cipher list doesn't carry over between the two.

## Post-quantum key exchange

Post-quantum cryptography (PQC) protects the TLS key exchange against an attacker who records traffic today and decrypts it later with a quantum computer. The portal supports the hybrid group `X25519MLKEM768`. It combines X25519 with ML-KEM-768, the key-encapsulation mechanism standardized in Federal Information Processing Standard (FIPS) 203.

Post-quantum key exchange is off by default. Both sections default to the classical curves `X25519,P-256`.

The hybrid group works only over TLS 1.3, so keep `maximum_protocol_version` at `TLS1_3` in any section where you enable it.

### Enable it on the listener

To offer the hybrid group to browsers and API clients, follow these steps:

1. In `configs/config.toml`, add `ecdh_curves` to the `[api_portal.server.https]` table the file already contains. Keep that table's other keys as they are:

    ```toml
    [api_portal.server.https]
    # Keep the existing enabled, cert_file, and key_file keys.
    ecdh_curves = "X25519MLKEM768,X25519,P-256"
    ```

2. Restart the portal. It reads `config.toml` only at startup.

3. [Verify the negotiated group](#verify-the-negotiated-group).

Keep classical groups after `X25519MLKEM768` in the list. A client that doesn't support the hybrid group negotiates the next group in the list instead. If the list holds only `X25519MLKEM768`, those clients can't connect at all.

### Enable it for outbound connections

To offer the hybrid group on the connections the portal opens to other services, add this table to `configs/config.toml` and restart the portal:

```toml
[api_portal.http_client.tls]
ecdh_curves = "X25519MLKEM768,X25519,P-256"
```

Keys you leave out of the table keep their defaults. The portal offers the hybrid group first, but each destination decides which group to use. A destination that supports `X25519MLKEM768` can still select a classical group if its own policy prefers one. A destination that doesn't support the hybrid group falls back to `X25519` or `P-256`.

### Verify the negotiated group

To check which group the listener negotiates, connect with an `openssl` client that supports `X25519MLKEM768`, such as OpenSSL 3.5 or later:

```bash
openssl s_client -connect localhost:9543 -groups X25519MLKEM768:X25519 </dev/null 2>/dev/null | grep -i "group\|temp key"
```

With post-quantum key exchange enabled on the listener, the output includes this line:

```text
Negotiated TLS1.3 group: X25519MLKEM768
```

With the default classical curves, the output instead shows `Peer Temp Key: X25519, 253 bits`.

## Kubernetes and OpenShift with Helm

The API Portal Helm chart writes the `[api_portal.server.https]` table itself and has no values for its TLS keys. A portal deployed with the chart therefore uses the default protocol versions, ciphers, and classical curves on the listener. Don't redefine `[api_portal.server.https]` through `configToml`: the table would then appear twice in `config.toml`, and the portal doesn't start.

Set the outbound keys through `configToml`, which appends raw TOML to the portal's `config.toml`:

```yaml
api-portal-ui:
  configToml: |
    [api_portal.http_client.tls]
    ecdh_curves = "X25519MLKEM768,X25519,P-256"
```

## Related

- [Security Hardening](../deployment/security-hardening.md#tls-configuration): supplying the listener's certificate, or terminating TLS in front of the portal
- [Configurations](../references/configurations.md): every `config.toml` key, including the outbound HTTP client's connection settings
- [Change the ports the API Portal uses](ports.md)
