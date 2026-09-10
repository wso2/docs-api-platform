---
title: "Control Plane Connection"
description: "How a standalone API Portal & MCP Hub deployment reaches gateways: registering a webhook subscriber against an existing Platform API, and the local-auth connection it does not need in production."
canonical_url: https://wso2.com/api-platform/docs/api-portal/deployment/control-plane-connection/
md_url: https://wso2.com/api-platform/docs/api-portal/deployment/control-plane-connection.md
tags:
  - cloud
  - api-portal
  - deployment
  - platform-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Control Plane Connection

The API Portal & MCP Hub is a standalone product. It has no runtime dependency on a control plane: it stores its own catalog, authenticates against your identity provider, and reaches gateways by emitting signed events to an endpoint you register.

There are exactly two places a Platform API can enter the picture, and in a production deployment only the second one usually applies:

| Use | Direction | Needed in production? |
|---|---|---|
| Local authentication | Portal → Platform API | **No.** Production delegates login to an identity provider. |
| Webhook subscriber | Portal → subscriber | Only if you want credentials propagated to gateways. |

## Credential propagation

The portal doesn't hold gateway-specific logic and has no fixed binding to a control plane. When a credential or plan changes, it emits a signed event to every subscriber registered for that organization. Whoever receives it decides what to do with it.

If you already run a Platform API fronting your gateways, that is the natural subscriber: it verifies the signature, decrypts the credential, persists it, and pushes it out to every gateway serving the API. That Platform API belongs to your existing estate — you point the portal at it, rather than deploying one alongside the portal.

A gateway that consumes the events itself can subscribe directly instead, as can a handler of your own. And if nothing subscribes, the portal still works: credentials are created and shown to developers, they just aren't propagated anywhere.

!!! warning "No subscriber means silent non-propagation"
    With no subscriber registered, credentials never reach a gateway and nothing reports an error — from the portal's point of view there was simply no one to notify. If developers report that a freshly generated key is rejected at the gateway, check the subscriber registration first.

### Register the subscriber

Registration is runtime state, held per organization in the portal's database — not chart configuration. Do it once after the first deployment, through **Settings → Webhooks** or the Management API. It survives upgrades, and it's per organization rather than per pod, so the replica count doesn't change anything.

Two things have to agree:

- **`targetUrl`** must be the receiver's webhook endpoint, reachable from the portal's network. For a Platform API, that is `/api/internal/v0.9/webhook/events` on its host.
- **`secret`** must equal the receiver's configured webhook secret — `APIP_CP_WEBHOOK_SECRET` on a Platform API. It does double duty, signing each delivery and deriving the key that encrypts credential fields, so a mismatch fails both signature verification and decryption.

On a Platform API, the webhook receiver ships **disabled**. Enable it and give it the same secret, or deliveries are rejected at the far end while the portal records them as sent. See [Webhook integration](../admin-settings/webhook-integration.md).

### Reaching a subscriber outside the cluster

An existing Platform API is usually not in the portal's namespace, so `targetUrl` is whatever address is routable from the portal's pods — an in-cluster Service name if it happens to be co-located, otherwise its external hostname. Make sure any egress NetworkPolicy allows it; a blocked delivery retries and eventually lands in `FAILED` rather than failing loudly at registration time.

### In a replicated deployment

Every portal pod runs its own webhook dispatcher and delivery worker, all claiming from the same queue. The claim locks are what keep two pods from dispatching the same event — see [Overview](overview.md#what-makes-a-replica-interchangeable).

A delivery whose pod dies mid-flight is not lost: one left `IN_FLIGHT` for more than five minutes is marked `FAILED` and re-enters the queue on the next cycle. That recovery sweep is scoped to the organization, so pods serving other organizations never reset each other's genuinely in-flight work.

## Local authentication (development only)

This is the portal's one and only outbound call to a Platform API, and production deployments don't make it. The built-in login form posts credentials to the Platform API's portal login endpoint and verifies the returned RS256 token against that component's public key:

=== "Kubernetes"

    ```yaml
    api-portal-ui:
      config:
        platformApi:
          baseUrl: ""        # "" derives the in-cluster URL
          insecure: false
        auth:
          publicKeyPath: /etc/devportal/keys/jwt_public.pem
      secrets:
        hasPublicKey: true
    ```

    `baseUrl` must use the in-cluster Service name and **container** port, because the portal connects over the cluster network rather than through a published port or ingress. Pointing it at an externally published address makes every login fail while the Platform API itself looks healthy.

    `generate-secrets.sh` copies the public key out of the Platform API's own Secret, so the two stay on the same keypair. Set `hasPublicKey: false` when you have no local-auth path at all.

=== "Virtual machine"

    ```toml
    [api_portal.auth.local]
    platform_api_url = "https://platform-api:9243"
    public_key_path  = "/etc/api-portal/keys/jwt_public.pem"
    tls_skip_verify  = false
    ```

    When the Platform API runs in the same Compose stack, use its service name and container port — the portal reaches it over the Compose network, not through a published host port. `setup.sh` writes the keypair to `resources/keys/`, and the compose file mounts the public half into the portal.

Leave `platform_api_url` empty and local authentication is disabled outright.

Two details matter if you do run it. Skipping TLS verification on that hop (`insecure` / `tls_skip_verify`) exists for local development against a self-signed certificate and belongs nowhere near production. And the public key is what makes the portal verify the token rather than trust the transport — if it's missing, bearer-token requests fail closed rather than being accepted unverified. In `idp` mode tokens are verified against your identity provider's JWKS endpoint instead, and the key goes unused.

## Related

- [Webhook integration](../admin-settings/webhook-integration.md): registering and verifying subscribers
- [Authentication](../setting-up/authentication/overview.md): why production uses an identity provider
- [Security Hardening](security-hardening.md): the identity-provider configuration that replaces local auth