---
title: "Ports and TLS Configuration"
description: "Reference for every gateway listener port, how to enable TLS on each, the cipher suites and protocol versions each component accepts, and post-quantum key exchange defaults."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/2026.10.0/setup/ports-and-tls-configuration/
md_url: https://wso2.com/api-platform/docs/api-gateway/2026.10.0/setup/ports-and-tls-configuration.md
tags:
  - api-gateway
  - configuration
  - tls
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-11
content_type: "reference"
---

# Ports and TLS Configuration

This page lists every port the API Platform Gateway listens on, explains how to turn on Transport Layer Security (TLS) for each one, and covers the cipher suites and post-quantum key exchange settings for the Gateway Controller, router, and Policy Engine.

## Listener ports

### Router ports

| Purpose | Default port | Protocol | Config key |
|---------|---------------|----------|------------|
| Incoming HTTP traffic | `8080` | Plaintext | `router.listener_port` |
| Incoming HTTPS traffic | `8443` | TLS | `router.https_port`, `router.https_enabled` |

### Gateway Controller ports

| Purpose | Default port | Protocol | Config key |
|---------|---------------|----------|------------|
| REST management API | `9090` | Plaintext | `controller.server.api_port` |
| REST management API, TLS | `9093` | TLS, off by default | `controller.server.tls.port`, `.enabled` |
| Admin server (`/health`, `/config_dump`) | `9092` | Plaintext | `controller.admin_server.port` |
| Configuration for the Policy Engine (gRPC) | `18001` | Plaintext by default, switches to mTLS in place | `controller.policy_server.port`, `.tls.enabled` |
| Prometheus metrics | `9091` | Plaintext, disabled by default | `controller.metrics.port`, `.enabled` |
| Configuration for the router (gRPC) | `18000` | Plaintext by default, switches to mTLS in place | `controller.server.xds_port`, `controller.server.xds_tls.enabled` |

!!! note "Admin and metrics ports"
    `controller.admin_server` is enabled by default because it serves `/health`, which Kubernetes liveness and readiness probes use. The `/config_dump` route stays off unless you enable it separately. `controller.metrics` is disabled by default.

### Policy Engine ports

| Purpose | Default port | Protocol | Config key |
|---------|---------------|----------|------------|
| Admin server (`/health`, `/config_dump`) | `9002` | Plaintext | `policy_engine.admin.port` |
| Admin server, TLS | `9004` | TLS, off by default | `policy_engine.admin.tls.port`, `.enabled` |
| Prometheus metrics | `9003` | Plaintext, disabled by default | `policy_engine.metrics.port`, `.enabled` |

!!! note "Admin port"
    The Policy Engine's admin server is enabled by default, for the same `/health` probe reason as the Gateway Controller's. Its metrics endpoint is disabled by default.

## Enabling TLS on a listener

There are two ways TLS is added to a plaintext port.

### Adding a second TLS listener

The Gateway Controller's REST API (`controller.server.tls`) and the Policy Engine's admin server (`policy_engine.admin.tls`) work this way: the plaintext port keeps working, and enabling TLS opens an additional port serving the same routes. No certificate is provisioned by default for either, so both stay off until you set `enabled = true` and point `cert_path`/`key_path` at a certificate and key.

### Switching a port to mutual TLS in place

The Gateway Controller's configuration ports for the router (`controller.server.xds_tls`) and the Policy Engine (`controller.policy_server.tls`) work this way, with no second port. Because these connections carry route configuration, secrets, and policy chains, there's no server-only TLS mode: enabling TLS requires a certificate, a key, and a client CA bundle (`client_ca_file`). The connecting component (the router or the Policy Engine) needs a matching client certificate whose identity appears in `allowed_client_identities`, or the connection is refused.

### The router's listener and its Policy Engine connection

The router's HTTPS listener (`router.https_enabled`, on by default) and its connection to the Policy Engine (`router.policy_engine.tls`, off by default) are configured the same way as any other listener: an `enabled` flag plus certificate paths. For provisioning the router's HTTPS certificate, including the one-time setup script and production certificate options (cert-manager or an existing Kubernetes secret), see [Gateway Configuration and Environment Interpolation](configuration.md#one-time-setup-with-the-setup-script) and [Security Hardening](../deployment/production-deployment/security-hardening.md#tls-configuration).

## Cipher suites

### Cipher suite names

The router and the other gateway components use different cipher suite naming schemes:

| Component | TLS sections | Cipher suite names |
|-------|---------|---------------------|
| Router | `router.downstream_tls`, `router.upstream.tls` | OpenSSL-style, for example `ECDHE-ECDSA-AES128-GCM-SHA256` |
| Gateway Controller and Policy Engine | `controller.server.tls`, `controller.server.xds_tls`, `controller.policy_server.tls`, `policy_engine.admin.tls`, `policy_engine.xds.tls`, both outbound `http_client.tls` sections | IANA names, for example `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256` |

### Protocol version bounds

Every TLS section takes `minimum_protocol_version` and `maximum_protocol_version`, each one of `TLS1_0`, `TLS1_1`, `TLS1_2`, or `TLS1_3`. The default range is `TLS1_2` to `TLS1_3` everywhere. A `ciphers` (or `cipher_suites`) field is a comma-separated list restricting which suites that listener or client negotiates. This list **only affects TLS 1.2 and below**; TLS 1.3 cipher suites aren't configurable.

### Default cipher list

`router.downstream_tls.ciphers` and `router.upstream.tls.ciphers` default to the same 12-suite list:

```text
ECDHE-ECDSA-AES128-GCM-SHA256,ECDHE-RSA-AES128-GCM-SHA256,ECDHE-ECDSA-AES128-SHA,
ECDHE-RSA-AES128-SHA,AES128-GCM-SHA256,AES128-SHA,ECDHE-ECDSA-AES256-GCM-SHA384,
ECDHE-RSA-AES256-GCM-SHA384,ECDHE-ECDSA-AES256-SHA,ECDHE-RSA-AES256-SHA,
AES256-GCM-SHA384,AES256-SHA
```

The Gateway Controller and Policy Engine leave `ciphers`/`cipher_suites` empty by default, which applies a secure built-in default set.

!!! note "Unknown router cipher names"
    An unsupported name in a router `ciphers` list isn't reported when you save `config.toml`. The router rejects the configuration when it's applied.

## Post-quantum cryptography

### What changes with post-quantum cryptography

Post-quantum cryptography (PQC) protects today's TLS key exchange against a future attacker with a quantum computer. Every TLS section on this page has an `ecdh_curves` (listeners) or `curve_preferences` (outbound clients) field: a comma-separated list of TLS 1.3 key-exchange groups, most preferred first. Alongside the classical curves `X25519`, `P-256`, `P-384`, and `P-521`, the gateway supports the hybrid group `X25519MLKEM768`, which combines X25519 with ML-KEM-768, the key-encapsulation mechanism standardized in FIPS 203. A peer that doesn't support the hybrid group falls back to a later, classical entry in the same list, so adding it doesn't break older clients.

### Defaults by listener

| Listener or client | `ecdh_curves` / `curve_preferences` default | PQC on by default |
|---------------------|----------------------------------------------|---------------------|
| `controller.server.tls` (REST API, TLS listener) | `X25519MLKEM768,X25519,P-256` | Yes |
| `controller.server.xds_tls` | `X25519MLKEM768,X25519,P-256` | Yes |
| `controller.policy_server.tls` | `X25519MLKEM768,X25519,P-256` | Yes |
| `policy_engine.admin.tls` | `X25519MLKEM768,X25519,P-256` | Yes |
| `policy_engine.xds.tls` (client to the Gateway Controller) | `X25519MLKEM768,X25519,P-256` | Yes |
| `controller.http_client.tls` | Empty (`X25519MLKEM768` first, then classical curves) | Yes |
| `policy_engine.http_client.tls` | Empty (`X25519MLKEM768` first, then classical curves) | Yes |
| `router.downstream_tls` | `X25519,P-256` | No |
| `router.upstream.tls` | `X25519,P-256` | No |

### Enabling it on the router

The router's listeners (`router.downstream_tls`, `router.upstream.tls`) default to classical curves only. To enable the hybrid group, set it explicitly:

```toml
[router.downstream_tls]
ecdh_curves = "X25519MLKEM768,X25519,P-256"

[router.upstream.tls]
ecdh_curves = "X25519MLKEM768,X25519,P-256"
```

If the router doesn't support a configured group, it rejects the configuration and keeps running with its previous configuration, and later configuration changes don't apply until you correct the value. Confirm that the router image you deploy supports `X25519MLKEM768` before enabling it in production, and roll the change out the same way as any other configuration change.

### Post-quantum cryptography for outbound clients

The outbound HTTP clients (`controller.http_client.tls.curve_preferences`, `policy_engine.http_client.tls.curve_preferences`) default to empty, which offers `X25519MLKEM768` first and falls back to classical curves for destinations that don't support it. Set the list only to change the order or restrict the groups offered. See [Outbound HTTP Client and Proxy Configuration](outbound-http-client-and-proxy.md).

## Kubernetes with Helm

Most settings on this page are controlled through Helm values under `gateway.config.router.*`, `gateway.config.controller.*`, and `gateway.config.policy_engine.*`, the same pattern [Configuring Timeouts](../resiliency/timeouts.md#kubernetes-with-helm) uses. For example:

```yaml
gateway:
  config:
    router:
      listener_port: 8080
      https_enabled: true
      https_port: 8443
      downstream_tls:
        ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256,ECDHE-RSA-AES128-GCM-SHA256"
    controller:
      server:
        api_port: 9090
        tls:
          enabled: true
          port: 9093
          ecdh_curves: "X25519MLKEM768,X25519,P-256"
```

The chart renders these values into the gateway's `config.toml`. Provisioning the certificate the chart references (through cert-manager or an existing Kubernetes secret) is covered in [Security Hardening](../deployment/production-deployment/security-hardening.md#tls-configuration).

!!! note "Router key-exchange groups with Helm"
    The Helm chart doesn't expose `ecdh_curves` for `router.downstream_tls` or `router.upstream.tls`, so a gateway deployed with the chart uses the router's default classical curves (`X25519,P-256`).

---

[← Health Checks](health-checks.md) &nbsp;|&nbsp; [Outbound HTTP Client and Proxy Configuration →](outbound-http-client-and-proxy.md)
