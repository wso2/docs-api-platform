---
title: "TLS Ciphers and Post-Quantum Cryptography"
description: "Configure the cipher suites and post-quantum key exchange settings on the AI Workspace and Platform API HTTPS listeners."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/tls-ciphers-and-post-quantum-cryptography/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/tls-ciphers-and-post-quantum-cryptography.md
tags:
  - ai-workspace
  - production
  - security
  - tls
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-11
content_type: "reference"
---

# TLS Ciphers and Post-Quantum Cryptography

This page covers the cipher suites and post-quantum key exchange settings on the AI Workspace and Platform API HTTPS listeners. For port numbers, see [Change the ports AI Workspace uses](../setting-up/ports.md); for certificate provisioning and where TLS terminates, see [Secure traffic with TLS](tls.md).

`ai_workspace.server.https` and `platform_api.server.https` accept the same settings.

## Cipher suites

```toml
[ai_workspace.server.https]
minimum_protocol_version = "TLS1_2"
maximum_protocol_version = "TLS1_3"
ciphers = ""
```

| Setting | Default | Description |
|---------|---------|--------------|
| `minimum_protocol_version` / `maximum_protocol_version` | `TLS1_2` / `TLS1_3` | Bounds the negotiated TLS version, one of `TLS1_0`, `TLS1_1`, `TLS1_2`, or `TLS1_3`. |
| `ciphers` | Empty | Comma-separated IANA cipher suite names, for example `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`. Empty applies a secure built-in default set. |

`ciphers` only restricts TLS 1.2 and below. TLS 1.3 cipher suites aren't configurable.

## Post-quantum cryptography

Post-quantum cryptography (PQC) protects today's TLS key exchange against a future attacker with a quantum computer. Both listeners' `ecdh_curves` field takes a comma-separated list of TLS 1.3 key-exchange groups, most preferred first. Alongside the classical curves `X25519` and `P-256`, both support the hybrid group `X25519MLKEM768`, which combines X25519 with ML-KEM-768, the key-encapsulation mechanism standardized in FIPS 203. A client that doesn't offer the hybrid group falls back to a later, classical entry in the same list, so enabling it doesn't break older clients.

The two listeners ship with different defaults:

| Listener | `ecdh_curves` default | PQC on by default |
|----------|--------------------------|---------------------|
| `platform_api.server.https` | `X25519MLKEM768,X25519,P-256` | Yes |
| `ai_workspace.server.https` | `X25519,P-256` | No |

To negotiate the hybrid group on the AI Workspace listener too, set it explicitly:

```toml
[ai_workspace.server.https]
ecdh_curves = "X25519MLKEM768,X25519,P-256"
```

For the outbound calls each service makes to the other, see [Outbound HTTP Client and Proxy Configuration](outbound-http-client-and-proxy.md#post-quantum-cryptography-for-outbound-calls).

## Related

- [Secure traffic with TLS](tls.md): certificate provisioning and where TLS terminates
- [Change the ports AI Workspace uses](../setting-up/ports.md): port numbers for both listeners
- [Outbound HTTP Client and Proxy Configuration](outbound-http-client-and-proxy.md): PQC for the outbound calls each service makes to the other