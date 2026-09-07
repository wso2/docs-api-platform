---
title: "Connect an identity provider to AI Workspace"
description: "Configure AI Workspace and the Platform API to delegate login to any OIDC-compliant identity provider: client registration, claim mappings, scope or role authorization, and the config.toml tables both services read."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/authentication/connect-an-identity-provider/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/setting-up/authentication/connect-an-identity-provider.md
tags:
  - cloud
  - ai-workspace
  - authentication
  - oidc
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Connect an identity provider to AI Workspace

AI Workspace delegates user login to any identity provider (IdP) that speaks OpenID Connect (OIDC). This guide is written for the administrator who deploys AI Workspace, and it covers the configuration every IdP needs. For an example of these steps applied to one specific IdP, see [Set up Asgardeo as your identity provider](asgardeo-setup.md).

## How OIDC login works here

AI Workspace is served by a Backend-for-Frontend (BFF), and the BFF is the OIDC client — not the browser. It runs the whole authorization code exchange server-side, keeps the resulting tokens in a server-side session, and gives the browser only an `HttpOnly` cookie. Register AI Workspace as a **confidential** client, not a public or single-page application client.

Two services need configuring, and they must agree:

- **AI Workspace** sends users to the IdP and reads identity claims out of the returned token.
- **Platform API** verifies every token against the IdP's JWKS endpoint and authorizes each request from the token's privileges.

Both read the same `configs/config.toml` — AI Workspace from the `[ai_workspace.*]` tables, the Platform API from the `[platform_api.*]` tables.

## What your identity provider must support

Check your IdP against these requirements before you start:

| Requirement | Details |
|-------------|---------|
| OIDC discovery | Serves `/.well-known/openid-configuration` at its authority URL. AI Workspace discovers every endpoint from there, so you configure the authority and nothing else. |
| JWT access tokens | Access tokens are signed JWTs. The Platform API reads claims out of the token directly, so opaque tokens don't work. |
| JWKS endpoint | Publishes the signing keys the Platform API verifies token signatures against. |
| Confidential client | Issues a client secret. |
| Authorization code and refresh token grants | Both enabled on the application. |
| Custom claims | Emits organization identity in the token. Claim names are configurable, the claims themselves are required. |

## Step 1: Register AI Workspace as a confidential client

In your IdP, create a confidential OIDC application with these settings. Replace `<your-domain>` with the address users reach AI Workspace at, including the port when it isn't 443 — `localhost:9643` for the Docker Compose quickstart.

1. Set the authorized redirect URL to `https://<your-domain>/api/auth/callback`. This is the BFF's own server-side callback route, not a page in the app.
2. Set the post-logout redirect URL to `https://<your-domain>/login`.
3. Enable the **Authorization Code** and **Refresh Token** grants.
4. Record the client ID and client secret.

## Step 2: Emit the claims AI Workspace expects

Both services read user and organization identity out of the access token by claim name. The defaults are listed here; you can either configure your IdP to emit these names, or keep your IdP's names and map them in Step 4.

| Default claim | Carries |
|---------------|---------|
| `sub` | The user's unique ID |
| `username` | The username shown in the workspace |
| `email` | The user's email address |
| `organization` | Organization ID |
| `org_name` | Organization display name |
| `org_handle` | Organization URL slug |
| `scope` | Space-separated scope string |
| `roles` | The user's roles |

The organization claims matter beyond display: AI Workspace creates an organization on a user's first login from them, and assigns it the region set in `[ai_workspace] default_org_region`.

## Step 3: Choose how privileges reach the token

The Platform API authorizes each request in one of two modes, set in `[platform_api.auth.authorization]`. Pick the one that matches what your IdP can put in a token.

**Scope mode** (`mode = "scope"`, the default) reads the `scope` claim and checks it against the scope each endpoint requires. Your IdP has to issue tokens carrying the platform's `ap:*` scopes, which usually means registering those scopes in the IdP and granting them to the application.

**Role mode** (`mode = "role"`) reads the `roles` claim and expands each role into scopes through a YAML mapping file. Your IdP only has to emit role names, which most products do out of the box. Set `role_to_scope_mapping` to the path of that file — the packs mount an editable copy at `/etc/platform-api/role-to-scope-mapping.yaml`. It ships these roles:

| Role | Grants |
|------|--------|
| `ap_admin` | Full access to every resource and operation |
| `ap_operator` | Gateway and deployment operations |
| `ap_publisher` | Creating and publishing APIs and proxies |
| `ap_subscriber` | Applications and subscriptions |
| `ap_viewer` | Read-only access |

Edit that file to change what a role grants, or to add your own. It's mounted configuration rather than part of the image, and the Platform API reads it at startup, so a change needs a restart.

Role mode is the lighter integration of the two. Map your IdP's groups onto these role names, and you never register a scope in the IdP at all.

## Step 4: Configure the Platform API

Set the Platform API to verify tokens against your IdP. `mode` selects exactly one authentication mode, so setting it to `"idp"` also stops the file-based login endpoint from being used.

```toml
[platform_api.auth]
mode = "idp"

[platform_api.auth.idp]
name     = "my-idp"                                    # friendly name, used in logs
jwks_url = "https://idp.example.com/oauth2/jwks"
issuer   = ["https://idp.example.com/oauth2/token"]    # accepted "iss" values
audience = ["<ai-workspace-client-id>"]                # accepted "aud" values; empty skips the check

[platform_api.auth.authorization]
enabled = true
mode    = "role"                                                    # or "scope"
role_to_scope_mapping = "/etc/platform-api/role-to-scope-mapping.yaml"
```

`issuer` takes a list, so a provider that mints tokens under more than one issuer URL is accommodated by naming each. Set `audience` to your client ID rather than leaving it empty, so a token minted for a different application is rejected.

If your IdP's claim names differ from the defaults in Step 2, override them:

```toml
[platform_api.auth.claim_mappings]
organization = "org_id"
org_name     = "org_name"
org_handle   = "org_handle"
user_id      = "sub"
username     = "username"
email        = "email"
scope        = "scope"
roles        = "roles"
```

Each value is either a flat top-level claim name or a dot-separated path into a nested claim. That path syntax is what accommodates providers that nest their claims — Keycloak puts roles under `realm_access.roles`, for example.

## Step 5: Configure AI Workspace

In the same file, point AI Workspace at the IdP:



```toml
[ai_workspace]
domain             = "<your-domain>"
default_org_region = "us"

[ai_workspace.auth]
mode = "oidc"

[ai_workspace.auth.oidc]
authority                = "https://idp.example.com/oauth2/token"
client_id                = "<ai-workspace-client-id>"
client_secret            = '{{ env "APIP_AIW_AUTH_OIDC_CLIENT_SECRET" }}'
redirect_url             = "https://<your-domain>/api/auth/callback"
post_logout_redirect_url = "https://<your-domain>/login"

# Must match [platform_api.auth.authorization] — see below.
[ai_workspace.auth.authorization]
mode                  = "role"                                       # or "scope"
role_to_scope_mapping = "/etc/ai-workspace/role-to-scope-mapping.yaml"

# A sibling of [ai_workspace.auth.oidc], not nested in it — applies to both auth modes.
[ai_workspace.auth.claim_mappings]
organization = "org_id"        # claim carrying the org ID
org_name     = "org_name"      # org display name
org_handle   = "org_handle"    # org URL slug
username     = "username"
email        = "email"
scope        = "scope"         # space-separated scope string
roles        = "roles"
```



Four things to get right:

- **`[ai_workspace.auth.authorization]`** needs the same `mode` as `[platform_api.auth.authorization]`. In role mode, mount the same mapping file into the `ai-workspace` container. The UI gates every action on the scopes `/api/session` reports, and AI Workspace derives those scopes from the token. In role mode it expands the `roles` claim through the mapping file. Omit this table, and the UI blocks operations the Platform API would authorize.
- **`authority`** is the issuer URL. Endpoints are discovered from it, so it must be the URL whose `/.well-known/openid-configuration` describes your IdP.
- **`redirect_url`** must match the URL registered in Step 1 exactly, character for character.
- **`[ai_workspace.auth.claim_mappings]`** must give every key it shares with `[platform_api.auth.claim_mappings]` the same value. Both services read the same token, so a mismatch means one of them reads the wrong claim. AI Workspace uses `username` and `email` to render the signed-in user, so they matter here as much as the organization claims. The table has no `user_id` key — only the Platform API maps that claim.

Every `[ai_workspace.auth.oidc]` key except `scope` defaults to empty. In OIDC mode the server refuses to start until each one is set, so a misconfiguration fails at startup rather than at a user's first login.

Leave `scope` unset to request the full `ap:*` scope set the Platform API authorizes against, which is the recommended starting point. If you trim it, keep `offline_access`, or token refresh stops working.

### Supply the client secret

Never write the client secret as a literal in `config.toml`. The token above reads it from an environment variable instead:

```bash
APIP_AIW_AUTH_OIDC_CLIENT_SECRET=<ai-workspace-client-secret>
```

In the Docker Compose distribution, set it in the git-ignored `api-platform.env`, which is the file Compose loads into both containers. In production, prefer a mounted secret file. Swap the token for `'{{ file "/secrets/ai-workspace/oidc_client_secret" }}'`, then mount the secret at that path. Both forms fail closed: a missing variable or unreadable file aborts startup rather than falling back to an empty credential. See [Sensitive values in `config.toml`](../configuration.md#sensitive-values-in-configtoml).

## Step 6: Restart and verify

Restart both services so they reload the configuration:

```bash
docker compose up --force-recreate
```

Open AI Workspace. Instead of the username and password form, you're redirected to your IdP's hosted login page, and land back in the workspace after signing in.

If sign-in fails, the mismatch is usually in one of these:

- The `redirect_url` in `config.toml` differs from the one registered in the IdP.
- The IdP issues opaque access tokens rather than JWTs.
- `issuer` doesn't match the token's `iss` claim, or `audience` doesn't match its `aud` claim.
- The token carries organization claims under names the `claim_mappings` tables don't name.

Set `[ai_workspace.logging] level = "debug"` and `[platform_api.logging] level = "debug"` to see which claim or check fails.

## Claim names for common identity providers

The roles claim is the one that most often differs. These paths are known to work:

| Identity provider | `claim_mappings` roles value |
|-------------------|------------------------------|
| Asgardeo | `roles` |
| Microsoft Entra ID | `roles` |
| Keycloak | `realm_access.roles`, or `resource_access.<client>.roles` |

## Next steps

- [Set up Asgardeo as your identity provider](asgardeo-setup.md): an example of these steps applied to Asgardeo, including scope registration
- [Set up Microsoft Entra ID as your identity provider](entra-id-setup.md): these steps applied to Entra ID, where authorization runs on app roles rather than scope-based authorization, and an API access scope such as `api://<CLIENT_ID>/access` is still required to acquire a token
- [Authentication in AI Workspace](overview.md): how identity provider authentication compares with file-based authentication
- [AI Workspace configuration](../configuration.md): how interpolation tokens deliver values into `config.toml`