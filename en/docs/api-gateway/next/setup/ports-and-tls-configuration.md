---
title: "Ports and TLS Configuration"
description: "Reference for every gateway listener port, how to enable TLS on each, the cipher suites and protocol versions each stack accepts, and post-quantum key exchange defaults."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/setup/ports-and-tls-configuration/
md_url: https://wso2.com/api-platform/docs/api-gateway/setup/ports-and-tls-configuration.md
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

This page lists every port the API Platform Gateway listens on, explains how to turn on Transport Layer Security (TLS) for each one, and covers the cipher suites and post-quantum key exchange settings available across the gateway-controller, router (Envoy), and policy-engine processes.

You can use `gateway/configs/config-template.toml` as a reference when creating your own `config.toml` — every setting on this page has a matching, annotated entry there.

## Listener ports

### Router ports

| Purpose | Default port | Protocol | Config key |
|---------|---------------|----------|------------|
| Incoming HTTP traffic (Envoy) | `8080` | Plaintext | `router.listener_port` |
| Incoming HTTPS traffic (Envoy) | `8443` | TLS | `router.https_port`, `router.https_enabled` |

### Gateway Controller ports

| Purpose | Default port | Protocol | Config key |
|---------|---------------|----------|------------|
| REST management API | `9090` | Plaintext | `controller.server.api_port` |
| REST management API, TLS | `9093` | TLS, off by default | `controller.server.tls.port`, `.enabled` |
| Admin/debug server (`/health`, `/config_dump`, pprof) | `9092` | Plaintext | `controller.admin_server.port` |
| Policy xDS gRPC (serves the policy-engine) | `18001` | Plaintext by default, switches to mTLS in place | `controller.policy_server.port`, `.tls.enabled` |
| Prometheus metrics | `9091` | Plaintext, disabled by default | `controller.metrics.port`, `.enabled` |
| xDS gRPC (serves the router) | `18000` | Plaintext by default, switches to mTLS in place | `controller.server.xds_port`, `controller.server.xds_tls.enabled` |

!!! note "Admin and metrics ports are enabled by default"
    `controller.admin_server` is enabled by default because it also serves `/health`, which Kubernetes liveness and readiness probes use — the sensitive `/config_dump` route stays off unless you enable it separately. `controller.metrics`, by contrast, is disabled by default.

### Policy Engine ports

| Purpose | Default port | Protocol | Config key |
|---------|---------------|----------|------------|
| Admin/debug server (`/health`, `/config_dump`) | `9002` | Plaintext | `policy_engine.admin.port` |
| Admin/debug server, TLS | `9004` | TLS, off by default | `policy_engine.admin.tls.port`, `.enabled` |
| Prometheus metrics | `9003` | Plaintext, enabled by default | `policy_engine.metrics.port`, `.enabled` |

!!! note "Metrics default the opposite way from the controller"
    The policy-engine's admin server is enabled by default, for the same `/health`-probe reason as the controller's. Its metrics endpoint is also enabled by default — the reverse of `controller.metrics`, which stays off.

## Enabling TLS on a listener

The gateway uses two different patterns for adding TLS to a plaintext port.

### Adding a second TLS listener

The gateway-controller's REST API (`controller.server.tls`) and the policy-engine's admin server (`policy_engine.admin.tls`) both work this way: the original plaintext port keeps working, and enabling TLS opens an additional port serving the same routes. No certificate is provisioned by default for either, so both stay off until you set `enabled = true` and point `cert_path`/`key_path` at a certificate and key.

### Switching a port to mutual TLS in place

The controller's xDS gRPC server (`controller.server.xds_tls`) and policy xDS gRPC server (`controller.policy_server.tls`) both work this way — there's no second port. Because these connections distribute route configuration, secrets, and policy chains, neither offers a server-only TLS mode: enabling TLS requires a certificate, key, and a client CA bundle (`client_ca_file`) together, and the peer (the router's Envoy process, or the policy-engine) needs a matching client certificate whose identity appears in `allowed_client_identities`, or the connection fails to complete its handshake.

### The router's listener and its policy-engine connection

The router's own HTTPS listener (`router.https_enabled`, on by default) and its connection to the policy-engine (`router.policy_engine.tls`, off by default) are configured the same way as any other listener: a boolean `enabled` flag plus certificate paths. For provisioning the router's HTTPS certificate — including the one-time setup script and production certificate options (cert-manager or an existing Kubernetes secret) — see [Gateway Configuration and Environment Interpolation](configuration.md#one-time-setup-with-the-setup-script) and [Security Hardening](../deployment/production-deployment/security-hardening.md#tls-configuration).

## Cipher suites

### Two cipher-suite vocabularies

Two unrelated TLS stacks are in play, and they use two different cipher suite naming schemes:

| Stack | Used by | Cipher suite names |
|-------|---------|---------------------|
| Envoy / BoringSSL | `router.downstream_tls`, `router.upstream.tls` | OpenSSL-style, e.g. `ECDHE-ECDSA-AES128-GCM-SHA256` |
| Go `crypto/tls` | `controller.server.tls`, `controller.server.xds_tls`, `controller.policy_server.tls`, `policy_engine.admin.tls`, `policy_engine.xds.tls`, both outbound `http_client.tls` blocks | Go constant names, e.g. `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256` |

### Protocol version bounds

Every TLS section takes `minimum_protocol_version` and `maximum_protocol_version`, each one of `TLS1_0`, `TLS1_1`, `TLS1_2`, or `TLS1_3`; the default range is `TLS1_2` to `TLS1_3` everywhere. A `ciphers` (or `cipher_suites`) field is a comma-separated list restricting which suites that listener or client negotiates. In both stacks, this list **only affects TLS 1.2 and below** — a TLS 1.3 connection's suite set is fixed by the stack itself and isn't configurable.

### Default cipher list

`router.downstream_tls.ciphers` and `router.upstream.tls.ciphers` default to the same 12-suite list:

```text
ECDHE-ECDSA-AES128-GCM-SHA256,ECDHE-RSA-AES128-GCM-SHA256,ECDHE-ECDSA-AES128-SHA,
ECDHE-RSA-AES128-SHA,AES128-GCM-SHA256,AES128-SHA,ECDHE-ECDSA-AES256-GCM-SHA384,
ECDHE-RSA-AES256-GCM-SHA384,ECDHE-ECDSA-AES256-SHA,ECDHE-RSA-AES256-SHA,
AES256-GCM-SHA384,AES256-SHA
```

Every Go `crypto/tls` listener and client leaves `ciphers`/`cipher_suites` empty by default, which applies Go's own secure default set and order.

!!! note "Unknown cipher names"
    Gateway-controller doesn't validate the Envoy-side `ciphers` list against a known-suite table — Envoy and BoringSSL are the source of truth, and an unsupported name is rejected when Envoy applies the resulting configuration, not when you save `config.toml`.

## Post-quantum cryptography

### What changes with post-quantum cryptography

Post-quantum cryptography (PQC) protects today's TLS key exchange against a future attacker with a quantum computer, without waiting for one to exist. Every TLS section on this page has an `ecdh_curves` (listeners) or `curve_preferences` (outbound clients) field: a comma-separated list of TLS 1.3 key-exchange groups, most preferred first. Alongside the classical curves `X25519`, `P-256`, `P-384`, and `P-521`, the gateway supports the hybrid group `X25519MLKEM768` — X25519 combined with ML-KEM-768, the key-encapsulation mechanism FIPS 203 standardizes. A peer that doesn't yet support the hybrid group falls back to a later, classical entry in the same list, so adding it never breaks an older client.

### Defaults by listener

Defaults differ by listener, and the difference is deliberate:

| Listener or client | `ecdh_curves` / `curve_preferences` default | PQC on by default |
|---------------------|----------------------------------------------|---------------------|
| `controller.server.tls` (REST API, TLS listener) | `X25519MLKEM768,X25519,P-256` | Yes |
| `controller.server.xds_tls` | `X25519MLKEM768,X25519,P-256` | Yes |
| `controller.policy_server.tls` | `X25519MLKEM768,X25519,P-256` | Yes |
| `policy_engine.admin.tls` | `X25519MLKEM768,X25519,P-256` | Yes |
| `policy_engine.xds.tls` (client to the controller) | `X25519MLKEM768,X25519,P-256` | Yes |
| `router.downstream_tls` | `X25519,P-256` | No (built-in default) |
| `router.upstream.tls` | `X25519,P-256` | No (built-in default) |
| `controller.http_client.tls` | Empty (Go's own defaults) | No |
| `policy_engine.http_client.tls` | Empty (Go's own defaults) | No |

Every Go-native TLS listener and client ships with the hybrid group on by default, because there's no risk in doing so: gateway-controller, the router's connection to the policy-engine's admin server, and the outbound clients are each this process's own `crypto/tls` stack, negotiating directly.

### Enabling it on the router's Envoy listeners

The two Envoy-driven listeners (`router.downstream_tls`, `router.upstream.tls`) are different. Their built-in default — the value gateway-controller falls back to when `config.toml` omits the setting — is classical curves only. That's because Envoy's configuration is pushed as xDS to a separate, already-running process: if that Envoy build doesn't recognize a curve name, it rejects (NACKs) the update and keeps serving its last-known-good configuration, silently freezing that instance out of any further config changes until you fix it. The gateway's own shipped `config-template.toml` demonstrates enabling the hybrid group for both router sections anyway, as a deliberate, documented choice:

```toml
[router.downstream_tls]
ecdh_curves = "X25519MLKEM768,X25519,P-256"

[router.upstream.tls]
ecdh_curves = "X25519MLKEM768,X25519,P-256"
```

Confirm the Envoy/BoringSSL build in your deployed image supports `X25519MLKEM768` before copying this into a running production gateway, and roll it out the same way you would any other Envoy configuration change.

### Post-quantum cryptography for outbound clients

The outbound HTTP clients (`controller.http_client.tls.curve_preferences`, `policy_engine.http_client.tls.curve_preferences`) default to empty — Go's own defaults, no PQC — since they dial a range of external destinations whose TLS support isn't controlled by this deployment. See [Outbound HTTP Client and Proxy Configuration](outbound-http-client-and-proxy.md) to opt in once the destinations you call are confirmed to support the hybrid group.

## Kubernetes with Helm

Every setting on this page is controlled through Helm values under `gateway.config.router.*`, `gateway.config.controller.*`, and `gateway.config.policy_engine.*`, the same pattern [Configuring Timeouts](../resiliency/timeouts.md#kubernetes-with-helm) uses. For example:

```yaml
gateway:
  config:
    router:
      listener_port: 8080
      https_enabled: true
      https_port: 8443
      downstream_tls:
        ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256,ECDHE-RSA-AES128-GCM-SHA256"
        ecdh_curves: "X25519MLKEM768,X25519,P-256"
    controller:
      server:
        api_port: 9090
        tls:
          enabled: true
          port: 9093
```

The chart renders these values into the generated `config.toml` the gateway controller loads. Provisioning the certificate the chart references (through cert-manager or an existing Kubernetes secret) is covered in [Security Hardening](../deployment/production-deployment/security-hardening.md#tls-configuration).

---

[← Health Checks](health-checks.md) &nbsp;|&nbsp; [Outbound HTTP Client and Proxy Configuration →](outbound-http-client-and-proxy.md)
