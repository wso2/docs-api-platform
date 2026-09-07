---
title: "Authentication in the API Portal & MCP Hub"
description: "Understand the two ways users sign in to the API Portal & MCP Hub: local authentication against the Platform API for development, and an OIDC identity provider for production."
canonical_url: https://wso2.com/api-platform/docs/api-portal/setting-up/authentication/overview/
md_url: https://wso2.com/api-platform/docs/api-portal/setting-up/authentication/overview.md
tags:
  - cloud
  - api-portal
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "concept"
---

# Authentication in the API Portal & MCP Hub

The API Portal & MCP Hub reads its settings from a single `config.toml` file, under the `[api_portal.*]` tables. Authentication is controlled by `mode` in the `[api_portal.auth]` table, which selects between two backends. A running instance uses one mode at a time.

| Mode | `[api_portal.auth] mode` | Best for |
|------|-------------------------------|----------|
| Local | `local` | Development and local testing, no identity provider required |
| Identity provider | `idp` | Production, where a dedicated OIDC identity provider manages user login |

The block matching your chosen mode is used; the other is ignored.

## Login flow

The two modes present users with different login experiences:

- **Local mode** (`mode = "local"`): clicking **Login** on any portal page shows a built-in username and password form. Credentials are validated against the Platform API.

- **Identity provider mode** (`mode = "idp"`): clicking **Login** redirects the user directly to the identity provider's authorization endpoint—no intermediate login page is shown. After authenticating, the user is returned to the page they originally requested.

Public pages (the API catalog and documentation) are always accessible without authentication in either mode. Only protected pages—applications, subscriptions, and API keys—require login.

## Local authentication

Local authentication delegates credential validation to the Platform API control plane. It requires no external identity provider, which makes it the default for local development and quick trials.

When `[api_portal.auth] mode = "local"`, the portal renders a username and password form and validates the credentials against the Platform API. Users, bcrypt-hashed passwords, and roles are defined in the Platform API's own configuration, under `[[platform_api.auth.file.users]]`:

```toml
[[platform_api.auth.file.users]]
username      = "admin"
password_hash = "..."
roles         = ["ap_admin"]
```

Those role names are what the portal authorizes against. The Platform API mints them into the `roles` claim of the token it issues, and because `authorization.mode = "role"` is the default, the portal expands that claim through its grant table—which aliases `ap_admin` and `ap_subscriber` onto its own `dp_admin` and `dp_subscriber` grants for exactly this reason. The shipped setup therefore works unchanged. See [Choose how privileges reach the token](connect-an-identity-provider.md#step-3-choose-how-privileges-reach-the-token) for what each role grants.

```toml
[api_portal.auth]
mode = "local"

[api_portal.auth.local]
# The upstream Platform API used to validate credentials.
platform_api_url = "https://platform-api:9243"
# Path to the Platform API's RS256 public key PEM — the matching half of its
# [platform_api.auth.jwt] private key. Bearer-token requests fail closed without it.
public_key_path  = "/etc/api-portal/keys/jwt_public.pem"
tls_skip_verify  = false
```

Leave `platform_api_url` empty to disable local authentication entirely.

Local authentication is intended for development and local testing only. Move to an identity provider before deploying to a shared or production environment.

## Identity provider authentication

For production, configure the portal to delegate login to an identity provider (IdP) over OpenID Connect (OIDC). The API Portal & MCP Hub works with any OIDC-compliant IdP—such as Asgardeo, Keycloak, Auth0, or Okta—that meets these requirements:

| Requirement | Details |
|-------------|---------|
| OIDC endpoints | The IdP exposes authorization, token, userinfo, and end-session endpoints. You configure each URL individually; the portal doesn't read `/.well-known/openid-configuration` |
| JSON Web Token (JWT) access tokens | Access tokens are JWTs, not opaque tokens |
| Signature verification | The IdP exposes a JSON Web Key Set (JWKS) endpoint, so the portal can verify the signature on a Bearer token |
| Confidential client | The portal is registered as a confidential client with a client secret (a server-side Traditional Web Application), not a public single-page application |
| Claims | Tokens carry the organization identifier and the user's roles as claims (claim names are configurable) |

When `mode = "idp"`, the portal reads the `[api_portal.auth.idp]` block for the OIDC endpoints and client credentials, and the `[api_portal.auth.claim_mappings]` block for the claim names that carry organization and role information.

[Connect an identity provider to the API Portal](connect-an-identity-provider.md) covers the configuration every IdP needs. For a worked example against one specific provider, see [Set up Asgardeo as your identity provider](asgardeo-as-idp.md).

## Authorization is configured separately

Authentication decides who a caller is. Authorization decides what they may do. The two are configured in different places.

`[api_portal.auth.authorization]` applies in **both** modes. The portal verifies a token the same way whether it came from an IdP's JWKS endpoint or the Platform API's public key.

That section holds the role-to-scope mapping, the switch for Management API scope enforcement, per-page role gating, and the role names granting the admin and subscriber tiers. See [Authorization](../../references/configurations.md#authorization).

!!! important
    Two keys that used to live here are retired, and leaving either in `config.toml` aborts startup: `auth.role_validation` is now `auth.authorization.page_role_validation`, and `auth.idp.roles` is now `auth.authorization.portal_roles`.

## Choosing a mode

Use local authentication when you're trying out the API Portal & MCP Hub, running a demo, or don't yet have an identity provider available. Move to an identity provider before you deploy to a shared or production environment, need to serve multiple organizations, or want single sign-on with an existing identity system.