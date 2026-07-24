---
title: "Integrate third-party identity providers"
description: "Configure OIDC authentication for the Developer Portal against Asgardeo, Keycloak, or any OIDC-compliant identity provider."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/setting-up/integrate-identity-providers/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/setting-up/integrate-identity-providers.md
tags:
  - cloud
  - devportal
  - authentication
  - idp
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Integrate Third-Party Identity Providers

The Developer Portal supports two authentication modes, controlled by `auth.mode` in `config.toml`.

| Mode | When to use | Configured by |
|---|---|---|
| **Local (Platform API JWT)** | Development — no external IDP required | `auth.mode = "local"` |
| **OIDC (External IDP)** | Production — delegates identity to Asgardeo, Keycloak, or any OIDC-compliant IDP | `auth.mode = "idp"` |

## Login Flow

**IDP mode** (`auth.mode = "idp"`): clicking Login on any portal page redirects the user directly to the IDP's authorization endpoint — no intermediate login page is shown. After the user authenticates at the IDP, they're returned to the page they originally requested.

**Local auth mode** (`auth.mode = "local"`): clicking Login shows a username/password form. Credentials are validated against the Platform API — see [Getting Started](../getting-started.md).

## OIDC Mode Configuration

### `idp` Fields

| Field (TOML) | Env var | Required | Description |
|---|---|---|---|
| `name` | `APIP_DP_IDP_NAME` | No | Friendly name used in logs (default: `oauth2`) |
| `issuer` | `APIP_DP_IDP_ISSUER` | Yes | IDP token issuer URL — used for issuer claim verification |
| `authorization_url` | `APIP_DP_IDP_AUTHORIZATIONURL` | Yes | OAuth2 authorization endpoint |
| `token_url` | `APIP_DP_IDP_TOKENURL` | Yes | OAuth2 token endpoint |
| `user_info_url` | `APIP_DP_IDP_USERINFOURL` | No | OIDC userinfo endpoint |
| `client_id` | `APIP_DP_IDP_CLIENTID` | Yes | OAuth2 client ID |
| `client_secret` | `APIP_DP_IDP_CLIENTSECRET` | No* | Client secret for confidential clients (Traditional Web App, Keycloak). Leave empty for PKCE-only public clients. |
| `audience` | `APIP_DP_IDP_AUDIENCE` | No | JWT `aud` claim to verify — typically the `client_id`. Leave empty to skip the audience check. |
| `callback_url` | `APIP_DP_IDP_CALLBACKURL` | Yes | OAuth2 redirect URI — must be registered in the IDP. Pattern: `https://<domain>/<orgName>/callback` |
| `scope` | `APIP_DP_IDP_SCOPE` | No | Space-separated OIDC scopes to request (default: `openid profile email`) |
| `logout_url` | `APIP_DP_IDP_LOGOUTURL` | No | IDP logout endpoint — used for end-session redirect |
| `logout_redirect_uri` | `APIP_DP_IDP_LOGOUTREDIRECTURI` | No | Post-logout redirect back to the portal |
| `jwks_url` | `APIP_DP_IDP_JWKSURL` | No* | JWKS endpoint for token signature verification. Either `jwks_url` or `certificate` is required. |
| `certificate` | `APIP_DP_IDP_CERTIFICATE` | No* | X.509 certificate (PEM) as an alternative to JWKS |
| `token_refresh_timeout_ms` | `APIP_DP_IDP_TOKENREFRESHTIMEOUTMS` | No | Token refresh timeout in ms (default: `10000`) |

### Claim Mapping and Roles (`[idp.claims]` / `[idp.roles]`)

These tell the portal how to read user identity and roles from the IDP token.

| Field (TOML) | Env var | Default | Description |
|---|---|---|---|
| `idp.claims.org_id` | `APIP_DP_IDP_CLAIMS_ORGID` | `org_name` | JWT claim the portal reads and verifies against the organization's configured identifier. Supports dot-notation (e.g. `org.id`). |
| `idp.claims.role` | `APIP_DP_IDP_CLAIMS_ROLE` | `roles` | JWT claim for the user's roles. Supports dot-notation (e.g. `realm_access.roles` for Keycloak). |
| `idp.claims.groups` | `APIP_DP_IDP_CLAIMS_GROUPS` | `groups` | JWT claim for groups |
| `idp.roles.admin` | `APIP_DP_IDP_ROLES_ADMIN` | `admin` | Role value that grants portal admin access |
| `idp.roles.super_admin` | `APIP_DP_IDP_ROLES_SUPERADMIN` | `superAdmin` | Role value that grants portal super-admin access |
| `idp.roles.subscriber` | `APIP_DP_IDP_ROLES_SUBSCRIBER` | `Internal/subscriber` | Role value for standard subscribers |
| `idp.fidp` | — | `{}` | Map of `?fidp=<key>` query param values to IDP identifiers for federated login hints |

## Local Auth Mode

When `auth.mode` is `"local"`, the portal uses a built-in login form and authenticates against the Platform API.

Requirements:

- `auth.local.platform_api_url` must be set (e.g. `https://platform-api:9243`)
- `auth.local.public_key_path` must point to the Platform API's RS256 public key PEM (SPKI) — the counterpart to its `auth.jwt.private_key`. Bearer-token requests fail closed without it.
- Users and passwords are managed in the Platform API's config

This mode is intended for development and local testing only.

---

## Asgardeo Setup

This walkthrough configures WSO2 Asgardeo as the identity provider for a production deployment.

**Key design decisions:**

- Public pages (API catalog, docs) are always accessible without authentication.
- Protected pages (applications, subscriptions, API keys) require a valid, verified token.

### Prerequisites

- An Asgardeo account at [console.asgardeo.io](https://console.asgardeo.io)
- Developer Portal accessible at a known hostname
- `production/scripts/register_asgardeo_scopes.sh` from the `api-platform` repository

### 1. Asgardeo Organization

1. Log in to [console.asgardeo.io](https://console.asgardeo.io).
2. Create or select your organization.

### 2. Developer Portal Application

1. Go to **Applications** → **New Application**.
2. Choose **Traditional Web Application** (confidential client — the devportal is server-side and can hold a secret).
3. Under **Authorized redirect URLs**, add both:
    - `https://<your-domain>/<orgName>/callback` — login callback
    - `https://<your-domain>/<orgName>` — post-logout redirect (Asgardeo validates `post_logout_redirect_uri` against this same list)
4. Under the **Protocol** tab, set **Access Token Type** to **JWT**.
5. Under the **User Attributes** tab, add these attributes to the token: `given_name`, `family_name`, `email`, `roles`.

Note the **Client ID** and **Client Secret** from the Protocol tab.

!!! note
    When `client_id` is configured, clicking Login on a devportal page redirects the user directly to Asgardeo — no intermediate login page is shown.

### 3. Register `dp:*` Scopes

!!! note
    The `dp:*` scopes are enforced per-operation by the devportal for machine API clients that call `/api/v0.9/*` directly with a Bearer token. Browser sessions (IDP login) are preauthorized — the portal trusts session-level authentication and skips per-operation scope checks for session users.

Create a system OIDC application (e.g. `DevPortal System`) and under **API Authorization** add **API Resource Management API** and **Application Management API** (both Management APIs).

Note its **Client ID** and **Client Secret**, then run:

```bash
ASGARDEO_TENANT=<your-tenant> \
ASGARDEO_CLIENT_ID=<system-app-client-id> \
ASGARDEO_CLIENT_SECRET=<system-app-client-secret> \
ASGARDEO_RESOURCE_IDENTIFIER=https://<your-domain> \
./production/scripts/register_asgardeo_scopes.sh
```

For local development, the default `ASGARDEO_RESOURCE_IDENTIFIER=https://localhost:3000` works without changes.

!!! note
    The system application is only needed to run this script. Once the `dp:*` API resource is registered in Asgardeo, the system app can be deleted.

### 4. Link Scopes to the Application

1. Open the **Developer Portal** application in Asgardeo.
2. Under **API Authorization**, add the API resource created in step 3.
3. Create a role (e.g. `dp_admin`) and assign all `dp:*` scopes to it.
4. Assign the role to your users.

### 5. Developer Portal Configuration

```toml
[idp]
name = "Asgardeo"
issuer = "https://api.asgardeo.io/t/<your-tenant>/oauth2/token"
authorization_url = "https://api.asgardeo.io/t/<your-tenant>/oauth2/authorize"
token_url = "https://api.asgardeo.io/t/<your-tenant>/oauth2/token"
user_info_url = "https://api.asgardeo.io/t/<your-tenant>/oauth2/userinfo"
client_id = "<devportal-app-client-id>"
client_secret = "<devportal-app-client-secret>"   # env: APIP_DP_IDP_CLIENTSECRET
audience = "<devportal-app-client-id>"            # Asgardeo sets client_id as the aud claim
callback_url = "https://<your-domain>/default/callback"
logout_url = "https://api.asgardeo.io/t/<your-tenant>/oidc/logout"
logout_redirect_uri = "https://<your-domain>/default"
jwks_url = "https://api.asgardeo.io/t/<your-tenant>/oauth2/jwks"
scope = "openid profile email"   # dp:* not needed — browser sessions are preauthorized
```

!!! warning
    Set `client_secret` via the `APIP_DP_IDP_CLIENTSECRET` environment variable rather than in the config file.

### Claim Flow Summary

```
Asgardeo token
  ├── sub      → user identity
  ├── org_name → organization identifier (→ orgIDClaim → verified against config)
  └── roles    → role list               (→ roleClaim → isAdmin check)
```

### Relationship to Other Components

If you're also running AI Workspace and Platform API with Asgardeo, the setups are independent but use the same Asgardeo tenant:

| Component | App Type | Callback URL | Scopes |
|---|---|---|---|
| **AI Workspace** | Standard-Based SPA (public client, no secret) | `https://<domain>/signin` | `ap:*` (Platform API) |
| **Developer Portal** | Traditional Web Application (confidential client) | `https://<domain>/<orgName>/callback` | `dp:*` (Developer Portal) |
| **Platform API** | — (validates tokens via JWKS; same `ap:*` scopes as AI Workspace) | — | — |

Each application is registered separately in Asgardeo with its own client ID and scopes.

---

## Keycloak Example

```toml
[idp]
name = "Keycloak"
issuer = "https://keycloak.example.com/realms/myrealm"
authorization_url = "https://keycloak.example.com/realms/myrealm/protocol/openid-connect/auth"
token_url = "https://keycloak.example.com/realms/myrealm/protocol/openid-connect/token"
user_info_url = "https://keycloak.example.com/realms/myrealm/protocol/openid-connect/userinfo"
client_id = "devportal"
client_secret = "<client-secret>"        # env: APIP_DP_IDP_CLIENTSECRET
audience = "devportal"
callback_url = "https://<your-domain>/default/callback"
logout_url = "https://keycloak.example.com/realms/myrealm/protocol/openid-connect/logout"
logout_redirect_uri = "https://<your-domain>/default"
jwks_url = "https://keycloak.example.com/realms/myrealm/protocol/openid-connect/certs"
scope = "openid profile email"

[idp.claims]
org_id = "organization"          # custom claim — add via Keycloak protocol mapper
role = "realm_access.roles"      # Keycloak nests realm roles here
```

**Keycloak setup steps:**

1. Create a Confidential client named `devportal`.
2. Set redirect URI to `https://<your-domain>/<orgName>/callback`.
3. Enable PKCE (set **PKCE Code Challenge Method** to `S256`).
4. Copy the client secret.
5. Add a custom protocol mapper for your organization identifier claim (`idp.claims.org_id`).
6. Realm roles are exposed at `realm_access.roles` — configure `idp.claims.role` accordingly.

## Generic OIDC

Any OIDC-compliant IDP works. Set:

- `authorization_url`, `token_url`, `user_info_url` from the IDP's `.well-known/openid-configuration`
- `jwks_url` from `jwks_uri` in the discovery document
- `issuer` from `issuer` in the discovery document
- `client_id` (and `client_secret` for confidential clients)
- `callback_url` registered with the IDP

## Related

- [Get a Bearer Token via curl](../references/get-a-bearer-token-via-curl.md) — test the devportal REST API from the terminal once IDP is set up
- [Configurations](../references/configurations.md) — full config.toml reference
