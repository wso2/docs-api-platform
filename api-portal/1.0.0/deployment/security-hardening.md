---
title: "Security Hardening"
description: "Harden a production API Portal & MCP Hub deployment on any platform: secrets, TLS, identity-provider login, scopes, and try-it proxy and upload limits."
canonical_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/security-hardening/
md_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/security-hardening.md
tags:
  - cloud
  - api-portal
  - deployment
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Security Hardening

Everything on this page applies to a single-instance production deployment as much as to a replicated one. The parts specific to running more than one pod are called out where they arise.

This page explains what each setting protects and why, independent of where you run the portal. For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md), [Deploy on Kubernetes](deploy-on-kubernetes.md), and [Deploy on OpenShift](openshift.md).

## Secrets

Nothing generates secrets at startup. They are provisioned once, before first boot, and delivered to every instance. On Kubernetes and OpenShift, the chart's `generate-secrets.sh` writes them into a Secret that the release references. On VMs, `scripts/setup.sh` writes them as files under `resources/` that the compose file mounts. The deployment guides walk through both.

The values themselves are the same on every platform:

| Secret key / env var | Required | Purpose |
|---|---|---|
| `APIP_AP_SECURITY_ENCRYPTION_KEY` | Always | Encrypts stored credentials at rest |
| `APIP_AP_SECURITY_SESSION_SECRET` | Always | Signs session cookies |
| `APIP_AP_DATABASE_PASSWORD` | External database | Database login |
| `APIP_AP_AUTH_IDP_CLIENT_SECRET` | `idp` mode | OIDC client secret |
| `jwt_public.pem` | Local auth only | Mounted as a **file**, not an env var — the Platform API's RS256 public key. Not needed in production, where login goes to your identity provider. |

!!! warning "Two secrets must be byte-identical on every instance"
    A mismatched `APIP_AP_SECURITY_SESSION_SECRET` means each instance rejects cookies signed by the others, so users are logged out at random as the load balancer moves them around. A mismatched `APIP_AP_SECURITY_ENCRYPTION_KEY` means credentials written by one instance can't be decrypted by another — intermittent failures that read as data corruption.

    On Kubernetes and OpenShift, referencing one Secret from the release guarantees it. On VMs it is on you: generate once, then copy `resources/keys/` to every host. Both provisioning scripts leave existing material untouched when re-run, so upgrades don't rotate secrets out from under running instances.

Rotating the encryption key requires re-encrypting stored credentials. Treat it as a planned migration, not a routine rotation.

## TLS configuration

The portal image does **not** generate a certificate for itself. Supply a real one, or terminate TLS in front of it. On Kubernetes and OpenShift, the chart takes the certificate from cert-manager or from a Secret you provide; on VMs, the setup script's self-signed pair must be replaced with a real one. See the TLS step in [Deploy on VMs](deploy-on-vms.md#configure-tls), [Deploy on Kubernetes](deploy-on-kubernetes.md#configure-tls), or [Deploy on OpenShift](openshift.md#section-2).

Terminating TLS in front of the portal is a legitimate production choice, but the hop from the terminator to the portal is then cleartext. Encrypt that hop too wherever it crosses a host or network boundary.

## Authentication

Local authentication posts credentials to a Platform API, which validates them against a file-based user list. It exists for development and demos, and it is the portal's only outbound call to a Platform API — production deployments delegate login to an OIDC identity provider and make no such call at all, so accounts, password policy, and revocation live in your identity system. The OIDC settings are the same on every platform: the issuer, the authorization, token, user-info, and JWKS endpoints, the client ID, the callback and logout URLs, and the scope. The client secret is kept out of the configuration file: in the Secret on Kubernetes and OpenShift, and in a mounted file on VMs. See the authentication step in [Deploy on VMs](deploy-on-vms.md#configure-authentication), [Deploy on Kubernetes](deploy-on-kubernetes.md#configure-authentication), or [Deploy on OpenShift](openshift.md#configure-authentication).

Both the callback and logout redirect URLs must sit under the portal's `/api-portal` mount and match what you registered in the identity provider.

The OIDC endpoints have no defaults on purpose, and the portal refuses to start in `idp` mode without `issuer`, `authorizationUrl`, `tokenUrl`, `clientId`, and `callbackUrl`. See [Connect an identity provider](../setting-up/authentication/connect-an-identity-provider.md).

## Authorization

Authorization is separate from authentication and applies in both modes. Keep it on, in the default `role` mode. The deployment guides show the setting on each platform.

`enabled: false` makes any authenticated caller satisfy every Management API operation's scope list. It is a development opt-out and logs a startup warning.

In the default `role` mode the portal expands the token's roles claim through a grant table and ignores the token's own scope claim, so a caller can't widen a role's grant by requesting extra scopes. Mount your grant table rather than baking it into an image, so changing what a role may do is a restart rather than a rebuild. See [Authentication](../setting-up/authentication/overview.md).

## Try-it proxy

The try-it console calls an API's registered endpoint server-side, through a same-origin proxy, so every gateway doesn't need CORS headers naming the portal. Two of its defaults are development-oriented and should be tightened in production:

| Setting (`config.toml` / Helm value) | Production value | Notes |
|---|---|---|
| `allow_http_endpoints` / `allowHttpEndpoints` | `false` | Default `true`. Production should allow only `https://`. |
| `allow_private_endpoints` / `allowPrivateEndpoints` | `false` | The default. Leave it `false` unless the gateway is genuinely private. |
| `tls_skip_verify` / `tlsSkipVerify` | `false` | Development only. |
| `timeout_ms` / `timeoutMs` | `15000` | |
| `max_request_bytes` / `maxRequestBytes` | `1048576` | |
| `max_response_bytes` / `maxResponseBytes` | `5242880` | |

The deployment guides show the full block on each platform.

`allow_private_endpoints` is deny-by-default because the registered-endpoint allowlist can't protect against an endpoint registered to point at an internal service. Set it `true` only when the gateway legitimately sits on a private address — a cluster IP or in-cluster service name — and only after confirming which services the portal can reach.

Two protections hold regardless of these settings: the proxy only calls URLs contained by an endpoint registered for that API, so a caller can't choose an arbitrary host; and link-local and cloud-metadata addresses such as `169.254.169.254` are refused at connection time.

## Upload ceilings

Uploads and archive extraction — theme ZIPs, API specifications, documents, landing-page content — are bounded by built-in defaults:

| Setting (`config.toml` / Helm value) | Default | Notes |
|---|---|---|
| `max_bytes` / `maxBytes` | `10485760` | 10 MiB per upload, or per entry inside an archive |
| `max_total_bytes` / `maxTotalBytes` | `52428800` | 50 MiB total extracted size per archive |
| `max_zip_entries` / `maxZipEntries` | `500` | |
| `max_depth` / `maxDepth` | `10` | |

`max_total_bytes`, `max_zip_entries`, and `max_depth` are what guard archive extraction against a decompression bomb. Raise them only deliberately, and only as far as a legitimate artifact needs.

## Related

- [Deploy on VMs](deploy-on-vms.md), [Deploy on Kubernetes](deploy-on-kubernetes.md), and [Deploy on OpenShift](openshift.md): the configuration for each platform
- [Database Configuration](database-configuration.md): TLS to the database and the password Secret
- [Control Plane Connection](control-plane-connection.md): securing the portal-to-Platform-API hop
- [Configurations](../references/configurations.md): every key referenced here