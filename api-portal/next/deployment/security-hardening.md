---
title: "Security Hardening"
description: "Harden an API Portal & MCP Hub production deployment: shared secrets, TLS certificates, identity-provider authentication, scope authorization, and the try-it proxy and upload ceilings."
canonical_url: https://wso2.com/api-platform/docs/api-portal/deployment/security-hardening/
md_url: https://wso2.com/api-platform/docs/api-portal/deployment/security-hardening.md
tags:
  - cloud
  - api-portal
  - deployment
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Security Hardening

Everything on this page applies to a single-instance production deployment as much as to a replicated one. The parts specific to running more than one pod are called out where they arise.

## Secrets

Nothing generates secrets at startup. They are provisioned once, before first boot, and delivered to every instance:

=== "Kubernetes"

    The chart never creates or embeds secret values. Provision them with the bundled `generate-secrets.sh`, then point the release at the Secret it wrote:

    ```yaml
    api-portal-ui:
      secrets:
        existingSecret: my-release-api-portal-ui-secrets
    ```

    Rendering **fails** if `existingSecret` is unset, so there is no path to starting a release without them.

=== "Virtual machine"

    `scripts/setup.sh` writes them as files under `resources/`, which the compose file mounts into the container. They are read through `{{ file }}` tokens rather than environment variables deliberately, so they never appear in `docker inspect` or a process environment dump:

    | File | Purpose |
    |---|---|
    | `resources/keys/api-portal-encryption.key` | At-rest encryption key |
    | `resources/keys/api-portal-session-secret` | Session-signing secret |
    | `resources/certificates/cert.pem` + `key.pem` | TLS pair |

    Run the script on one VM and copy `resources/keys/` and `resources/certificates/` to the others. Running it separately per VM generates different values on each — see the warning below.

The values themselves are the same on either substrate:

| Secret key / env var | Required | Purpose |
|---|---|---|
| `APIP_AP_SECURITY_ENCRYPTION_KEY` | Always | Encrypts stored credentials at rest |
| `APIP_AP_SECURITY_SESSION_SECRET` | Always | Signs session cookies |
| `APIP_AP_DATABASE_PASSWORD` | External database | Database login |
| `APIP_AP_AUTH_IDP_CLIENT_SECRET` | `idp` mode | OIDC client secret |
| `jwt_public.pem` | Local auth only | Mounted as a **file**, not an env var — the Platform API's RS256 public key. Not needed in production, where login goes to your identity provider. |

On Kubernetes the optional keys are wired only when the matching flag is true — `secrets.hasIdpClientSecret`, `secrets.hasPublicKey` — and `generate-secrets.sh` sets these in the values file it writes.

!!! warning "Two secrets must be byte-identical on every instance"
    A mismatched `APIP_AP_SECURITY_SESSION_SECRET` means each instance rejects cookies signed by the others, so users are logged out at random as the load balancer moves them around. A mismatched `APIP_AP_SECURITY_ENCRYPTION_KEY` means credentials written by one instance can't be decrypted by another — intermittent failures that read as data corruption.

    On Kubernetes, referencing one Secret from the release guarantees it. On VMs it is on you: generate once, then copy `resources/keys/` to every host. Both provisioning scripts leave existing material untouched when re-run, so upgrades don't rotate secrets out from under running instances.

Rotating the encryption key requires re-encrypting stored credentials. Treat it as a planned migration, not a routine rotation.

## TLS configuration

The portal image does **not** generate a certificate for itself. Supply a real one, or terminate TLS in front of it.

=== "Kubernetes"

    ```yaml
    api-portal-ui:
      tls:
        certificateProvider: cert-manager   # cert-manager | secret | none
        mountPath: /app/certs
    ```

    | Provider | Use when |
    |---|---|
    | `cert-manager` | cert-manager runs in the cluster. Set `tls.certManager.issuerRef`, `commonName`, and `dnsNames` to your real hostname — the shipped defaults point at `devportal.localhost` and are development values. |
    | `secret` | You hold a certificate already. Set `tls.secret.name` and, if your keys differ, `certKey` / `keyKey`. |
    | `none` | A TLS-terminating proxy or ingress fronts the portal. The listener then serves plain HTTP. |

    `selfSigned` is deliberately **not** supported — the image has no in-container certificate generation, so the chart rejects it at render time rather than starting a pod that can't serve HTTPS.

=== "Virtual machine"

    `setup.sh` writes a **self-signed** pair to `resources/certificates/`, which the compose file mounts at `/etc/api-portal/tls`. That is fine for evaluation and wrong for production — browsers warn, and any client verifying the chain refuses.

    Replace both files with a certificate for your real hostname, keeping the same filenames, then recreate the container:

    ```
    resources/certificates/cert.pem
    resources/certificates/key.pem
    ```

    If a reverse proxy on the VM terminates TLS instead, set `APIP_AP_SERVER_HTTPS_ENABLED=false` in `api-platform.env` and bind the portal to loopback only.

Terminating TLS in front of the portal is a legitimate production choice, but the hop from the terminator to the portal is then cleartext. Encrypt that hop too wherever it crosses a host or network boundary.

## Authentication

Local authentication posts credentials to a Platform API, which validates them against a file-based user list. It exists for development and demos, and it is the portal's only outbound call to a Platform API — production deployments delegate login to an OIDC identity provider and make no such call at all, so accounts, password policy, and revocation live in your identity system:

=== "Kubernetes"

    ```yaml
    api-portal-ui:
      config:
        auth:
          idp:
            issuer: https://idp.example.com/oauth2/token
            authorizationUrl: https://idp.example.com/oauth2/authorize
            tokenUrl: https://idp.example.com/oauth2/token
            userInfoUrl: https://idp.example.com/oauth2/userinfo
            jwksUrl: https://idp.example.com/oauth2/jwks
            clientId: <portal-client-id>
            callbackUrl: https://portal.example.com/api-portal/<org-handle>/callback
            logoutUrl: https://idp.example.com/oidc/logout
            scope: "openid profile email"
    ```

    The chart renders `auth.mode=idp` once `idp.clientId` is set; the client secret comes from the Secret.

=== "Virtual machine"

    In `configs/config.toml`:

    ```toml
    [api_portal.auth]
    mode = "idp"

    [api_portal.auth.idp]
    issuer             = "https://idp.example.com/oauth2/token"
    authorization_url  = "https://idp.example.com/oauth2/authorize"
    token_url          = "https://idp.example.com/oauth2/token"
    user_info_url      = "https://idp.example.com/oauth2/userinfo"
    jwks_url           = "https://idp.example.com/oauth2/jwks"
    client_id          = "<portal-client-id>"
    callback_url       = "https://portal.example.com/api-portal/<org-handle>/callback"
    logout_url         = "https://idp.example.com/oidc/logout"
    scope              = "openid profile email"
    ```

    Keep the client secret out of this file — reference it from a mounted file instead, and put the file on every VM:

    

    ```toml
    client_secret = '{{ file "/secrets/api-portal/oidc_client_secret" }}'
    ```

    

Both the callback and logout redirect URLs must sit under the portal's `/api-portal` mount and match what you registered in the identity provider.

The OIDC endpoints have no defaults on purpose, and the portal refuses to start in `idp` mode without `issuer`, `authorizationUrl`, `tokenUrl`, `clientId`, and `callbackUrl`. See [Connect an identity provider](../setting-up/authentication/connect-an-identity-provider.md).

## Authorization

Authorization is separate from authentication and applies in both modes. Keep it on:

```yaml
api-portal-ui:
  config:
    auth:
      authorization:
        enabled: true
        mode: role
```

`enabled: false` makes any authenticated caller satisfy every Management API operation's scope list. It is a development opt-out and logs a startup warning.

In the default `role` mode the portal expands the token's roles claim through a grant table and ignores the token's own scope claim, so a caller can't widen a role's grant by requesting extra scopes. Mount your grant table rather than baking it into an image, so changing what a role may do is a restart rather than a rebuild. See [Authentication](../setting-up/authentication/overview.md).

## Try-it proxy

The try-it console calls an API's registered endpoint server-side, through a same-origin proxy, so every gateway doesn't need CORS headers naming the portal. Two of its defaults are development-oriented and should be tightened in production:

```toml
[api_portal.tryout]
allow_http_endpoints = false    # default true — production should allow only https://
allow_private_endpoints = false # default; leave false unless the gateway is genuinely private
tls_skip_verify = false         # development only
timeout_ms = 15000
max_request_bytes = 1048576
max_response_bytes = 5242880
```

`allow_private_endpoints` is deny-by-default because the registered-endpoint allowlist can't protect against an endpoint registered to point at an internal service. Set it `true` only when the gateway legitimately sits on a private address — a cluster IP or in-cluster service name — and only after confirming which services the portal can reach.

Two protections hold regardless of these settings: the proxy only calls URLs contained by an endpoint registered for that API, so a caller can't choose an arbitrary host; and link-local and cloud-metadata addresses such as `169.254.169.254` are refused at connection time.

## Upload ceilings

Uploads and archive extraction — theme ZIPs, API specifications, documents, landing-page content — are bounded by built-in defaults:

```toml
[api_portal.uploads]
max_bytes = 10485760       # 10 MiB per upload, or per entry inside an archive
max_total_bytes = 52428800 # 50 MiB total extracted size per archive
max_zip_entries = 500
max_depth = 10
```

`max_total_bytes`, `max_zip_entries`, and `max_depth` are what guard archive extraction against a decompression bomb. Raise them only deliberately, and only as far as a legitimate artifact needs.

## Related

- [Database Configuration](database-configuration.md): TLS to the database and the password Secret
- [Control Plane Connection](control-plane-connection.md): securing the portal-to-Platform-API hop
- [Configurations](../references/configurations.md): every key referenced here