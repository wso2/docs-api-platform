---
title: "Connect an identity provider to the API Portal"
description: "Configure the API Portal & MCP Hub to delegate login to any OIDC identity provider: client registration, claim mappings, role or scope authorization, and the config.toml tables involved."
canonical_url: https://wso2.com/api-platform/docs/api-portal/setting-up/authentication/connect-an-identity-provider/
md_url: https://wso2.com/api-platform/docs/api-portal/setting-up/authentication/connect-an-identity-provider.md
tags:
  - cloud
  - api-portal
  - authentication
  - oidc
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-04
content_type: "how-to"
---

# Connect an identity provider to the API Portal

The API Portal & MCP Hub delegates user login to any identity provider (IdP) that speaks OpenID Connect (OIDC). This guide is written for the administrator who deploys the portal, and it covers the configuration every IdP needs. For a worked example of these steps against one specific IdP, see [Set up Asgardeo as your identity provider](asgardeo-as-idp.md).

For how identity provider authentication compares with local authentication, see [Authentication in the API Portal & MCP Hub](overview.md).

## How OIDC login works here

The portal itself is the OIDC client, not the browser. It runs the authorization code exchange server-side with PKCE and a state parameter, keeps the resulting tokens in a server-side session, and gives the browser only a session cookie. Register the portal as a **confidential** client, not a public or single-page application client.

Two points shape the rest of this guide:

- **There is no OIDC discovery.** The portal never reads `/.well-known/openid-configuration`, so you configure each endpoint URL explicitly in `[api_portal.auth.idp]`.
- **Two token types are read.** Identity claims (organization, roles, groups, name, email) come from the **ID token**. The `scope` claim, used only in `mode = "scope"`, comes from the **access token**.

Clicking **Login** in `mode = "idp"` redirects straight to the IdP's authorization endpoint—the built-in username and password form is never shown, and `POST` to the local login route returns `404`.

## What your identity provider must support

Check your IdP against these requirements before you start:

| Requirement | Details |
|-------------|---------|
| OIDC endpoints | Exposes authorization, token, userinfo, JWKS, and end-session endpoints. You supply each URL individually. |
| Confidential client | Issues a client secret, and accepts PKCE on the authorization code exchange. |
| Authorization code and refresh token grants | Both enabled on the application. The portal refreshes an expired access token before failing a Management API request. |
| JSON Web Token (JWT) access tokens | Access tokens are signed JWTs. The portal verifies a Bearer token's signature against the JWKS endpoint, so opaque tokens don't work for machine clients calling `/api-portal/api/v0.9`. |
| Custom claims | Emits the organization identifier and the user's roles in the ID token. Claim names are configurable; the claims themselves are required. |

## Step 1: Register the portal as a confidential client

In your IdP, create a confidential OIDC application. Replace `<your-domain>` with the address users reach the portal at, including the port when it isn't 443, and `<org-handle>` with the value of `[api_portal.organization] handle`—`default` in the packaged configuration.

1. Set the authorized redirect URL to `https://<your-domain>/api-portal/<org-handle>/callback`.
2. Set the post-logout redirect URL to `https://<your-domain>/api-portal/<org-handle>`. Most IdPs validate `post_logout_redirect_uri` against the same list as the login callback, so add both URLs there.
3. Enable the **Authorization Code** and **Refresh Token** grants.
4. Set the access token type to **JWT**.
5. Configure the IdP to emit `given_name`, `family_name`, `email`, `roles`, and the claim carrying the organization identifier **in the ID token**. The portal reads user and organization identity from the ID token, not the access token, so a claim released only on the access token or the userinfo endpoint won't be seen.
6. Record the client ID and client secret.

One redirect URL covers the whole portal. After the callback, the portal routes the user from the return path stored in their session, so there are no per-view or per-page redirect URLs to register.

## Step 2: Map the claims the portal reads

The portal reads three claims out of the ID token by name, and `[api_portal.auth.claim_mappings]` says which name carries each one. Either configure your IdP to emit the default names, or keep your IdP's names and set the mappings to match.

| Mapping key | Default claim | Carries |
|-------------|---------------|---------|
| `organization` | `org_name` | The organization identifier, resolved against the organization this instance serves on every request. Required—a token without it is rejected with `403`. See [step 5](#step-5-make-the-organization-claim-resolve-to-your-organization). |
| `roles` | `roles` | The user's role names. Required when `authorization.mode = "role"`; startup fails if the mapping is empty. |
| `groups` | `groups` | The user's group names. Carried into the session for use in page and content rules. |

Each value is either a flat top-level claim name or a dot-separated path into a nested claim. That path syntax accommodates providers that nest their claims—Keycloak puts roles under `realm_access.roles`, for example.

A roles or groups claim may arrive as a JSON array or as a space- or comma-separated string. The portal accepts both.

The portal also reads these fixed claims, whose names aren't configurable: `sub` for the user identity, `given_name` (falling back to `nickname`) and `family_name` for the display name, `email` for the address shown in the profile menu, and `picture` for the avatar.

## Step 3: Choose how privileges reach the token

The portal's Management API (`/api-portal/api/v0.9`) guards each operation with a `dp:*` scope. `[api_portal.auth.authorization] mode` decides where a request's effective scopes come from. Pick the one that matches what your IdP can put in a token.

**Role mode** (`mode = "role"`, the default) expands the token's roles claim through a YAML grant table and ignores the token's own scope claim entirely. Your IdP only has to emit role names, which most products do out of the box, and a caller can't widen a role's grant by requesting extra scopes. Set `role_to_scope_mapping` to the path of the table; the image ships an editable copy, which `docker-compose.yaml` mounts at `/etc/api-portal/role-to-scope-mapping.yaml`. It defines two roles:

| Role | Grants |
|------|--------|
| `dp_admin` | Every action on the organization: content and theme, the API and MCP server catalog, views, labels, subscription plans, key managers, webhook subscribers, and every application and subscription |
| `dp_subscriber` | The consumer persona: own applications, subscriptions, and keys, plus read access to the catalog |

The table also aliases `ap_admin` and `ap_subscriber` onto those same grants, because those are the role names the Platform API mints. Map your IdP's groups onto any of the four names, or add an entry of your own for a narrower grant. The portal validates every scope in the table against its OpenAPI specification at startup, so an undeclared `dp:*` scope fails startup rather than surfacing later as a role that logs in and is denied every request.

When a token carries several roles, the effective scopes are the union of every matching entry—most permissive wins. A role name the table doesn't list contributes nothing, so the failure mode of a mistyped or unmapped role is a denied request, never an unintended grant.

**Scope mode** (`mode = "scope"`) reads the access token's own `scope` claim. Use it when the IdP mints `dp:*` scopes directly, which means registering all of them in the IdP and granting them to the application. Browser sessions are preauthorized in this mode—the per-operation check is skipped, and page role gating is the authorization that applies to them.

Role mode is the lighter integration of the two. Editing the mapping file needs a restart, since the portal reads it at startup.

### Page access tiers

Page access is separate from Management API scopes. `[api_portal.auth.authorization.portal_roles]` names the role that grants each of the portal's two page tiers, and `page_role_validation` switches the gate on:

```toml
[api_portal.auth.authorization]
page_role_validation = true

[api_portal.auth.authorization.portal_roles]
admin      = "ap_admin"
subscriber = "ap_subscriber"
```

Point these at your IdP's role names, or at names in the grant table so one set of roles drives both page access and Management API authorization.

## Step 4: Configure the portal

Set the `[api_portal.auth]` tables in `configs/config.toml`. `mode` selects exactly one authentication backend, so `"idp"` also stops the local login form from being used:



```toml
[api_portal.auth]
mode = "idp"

[api_portal.auth.idp]
name                = "my-idp"                                          # friendly name, used in logs
issuer              = "https://idp.example.com"                         # exact "iss" claim value, not an endpoint
authorization_url   = "https://idp.example.com/oauth2/authorize"
token_url           = "https://idp.example.com/oauth2/token"
user_info_url       = "https://idp.example.com/oauth2/userinfo"
jwks_url            = "https://idp.example.com/oauth2/jwks"
client_id           = "<portal-client-id>"
client_secret       = '{{ env "APIP_AP_AUTH_IDP_CLIENT_SECRET" }}'
audience            = "<portal-client-id>"                              # expected "aud" claim
callback_url        = "https://<your-domain>/api-portal/<org-handle>/callback"
logout_url          = "https://idp.example.com/oidc/logout"
logout_redirect_uri = "https://<your-domain>/api-portal/<org-handle>"
scope               = "openid profile email roles"

# Which token claim carries each field. A sibling of [api_portal.auth.idp], not
# nested in it — dot notation reaches a nested claim, e.g. "realm_access.roles".
[api_portal.auth.claim_mappings]
organization = "org_name"
roles        = "roles"
groups       = "groups"

# Applies in both auth modes, which is why it is NOT under [api_portal.auth.idp].
[api_portal.auth.authorization]
enabled               = true
mode                  = "role"
role_to_scope_mapping = "/etc/api-portal/role-to-scope-mapping.yaml"
page_role_validation  = true

[api_portal.auth.authorization.portal_roles]
admin      = "ap_admin"
subscriber = "ap_subscriber"
```



Four things to get right:

- **`callback_url`** must match the URL registered in step 1 exactly, character for character.
- **`issuer`** is the IdP's issuer identifier—the exact string it puts in the token's `iss` claim—and is compared verbatim. It's a distinct value from `token_url`, though some providers do use their token endpoint URL as the issuer: Asgardeo and WSO2 Identity Server both issue `iss` as `.../oauth2/token`. Decode a token from your IdP and copy `iss` out of it rather than assuming either form.
- **`audience`** must match the token's `aud` claim. Set it to your client ID rather than leaving it empty, so a token minted for a different application is rejected.
- **`scope`** must request whatever the IdP needs to emit the organization and roles claims. Keep `openid`, and add the scope your IdP attaches role information to.

!!! important "Two retired keys abort startup"
    Earlier versions configured roles under `[api_portal.auth.idp.roles]`, with a third `super_admin` tier. That section is retired, along with `auth.role_validation`, and leaving either in `config.toml` fails startup rather than silently applying a default. Use `[api_portal.auth.authorization.portal_roles]` and `auth.authorization.page_role_validation` instead—see [Authorization](../../references/configurations.md#authorization).

### Supply the client secret

Never write the client secret as a literal in `config.toml`. The `{{ env }}` token above reads it from an environment variable instead, so it never has to be committed to source control:

```bash
export APIP_AP_AUTH_IDP_CLIENT_SECRET=<portal-client-secret>
```

In production, prefer a mounted secret file. Swap the token for `'{{ file "/secrets/api-portal/oidc_client_secret" }}'`, then mount the secret at that path. Both forms fail closed: a missing variable or unreadable file aborts startup rather than falling back to an empty credential. See [Interpolation tokens](../../references/configurations.md#interpolation-tokens).

## Step 5: Make the organization claim resolve to your organization

A portal instance serves exactly one organization, and the database schema is multi-organization—so a token your IdP correctly signed for a *different* organization would pass every signature, expiry, and audience check. The portal closes that gap by resolving the mapped organization claim and confirming it names the organization the instance is pinned to. It does this at login and on every authenticated request, and a mismatch is a flat `403`, whether the asserted organization is unknown or merely someone else's. A token carrying no organization claim at all is rejected the same way.

The claim's value has to resolve to your organization, which means it must equal either of these:

| Value | Matching |
|-------|----------|
| The organization handle, from `[api_portal.organization] handle` | Case-insensitive |
| The organization display name, from **Settings > Organization** | Exact |

The handle is also the organization's **IDP reference ID**, which the portal writes when it first seeds the organization row. That field is fixed from then on: the Management API rejects a request that changes it, so **IDP reference ID** in [Organization settings](../../admin-settings/organization-settings.md) reflects the handle rather than offering a second value to match against.

So point the claim at the handle. Which way round you do that depends on what your IdP has to assert.

### When your IdP asserts an organization identifier

Providers with a business-to-business organization model—Asgardeo sub-organizations, an Entra ID tenant—already put an organization identifier in the token. Set `[api_portal.organization] handle` to that identifier, and map the claim carrying it:

```toml
[api_portal.organization]
handle = "acme"          # the identifier the IdP asserts

[api_portal.auth.claim_mappings]
organization = "org_name"
```

This is the option to prefer when it's available to you. The claim keeps carrying a real organization identity, so a token minted for a different organization still resolves elsewhere and is still refused. It also keeps the authorization request correct: the portal appends `org=<handle>` to it, and a provider with a sub-organization model reads that parameter to scope the login session to the matching sub-organization.

The handle is the URL slug in `/api-portal/{handle}/views/{viewName}`, so it becomes part of every portal URL. Choose it with that in mind—and note that the portal normalizes it to lowercase, though claim matching tolerates any case.

### When your IdP has no organization concept

A single Keycloak realm, an Auth0 tenant, or an Okta org has one user population and nothing organization-shaped to assert. Add a custom claim to the token whose value is the portal's organization handle, and map that claim:

```toml
[api_portal.organization]
handle = "default"

[api_portal.auth.claim_mappings]
organization = "org_id"    # your custom claim, emitted with the constant value "default"
```

Configure the claim in the IdP as a constant—Keycloak calls this a hardcoded claim mapper, Auth0 an action that adds a custom claim. A fixed value is the accurate thing to assert here: the IdP serves one user population, the portal serves one organization, and the claim says which organization a token is for.

!!! important "A constant claim asserts nothing about isolation"
    Every token the IdP issues then carries the value the portal expects, so the organization check passes for every user the IdP will authenticate. That's the intended outcome for a single-population IdP. It is not what you want from a provider serving several organizations through one shared application—there, set the handle to the asserted identifier instead, as described above, and let the check do its job.

## Step 6: Restart and verify

Restart the portal so it reloads the configuration:

```bash
docker compose up -d --force-recreate
```

Open the portal and select **Login**. Instead of the username and password form, you're redirected to your IdP's hosted login page, and land back on the page you started from after signing in.

If sign-in fails, the mismatch is usually one of these:

- `callback_url` differs from the redirect URL registered in the IdP.
- `issuer` doesn't match the token's `iss` claim, or `audience` doesn't match its `aud` claim.
- The ID token doesn't carry the claim names configured in `[api_portal.auth.claim_mappings]`, so the organization or roles claim is never found.
- The organization claim's value is neither the organization handle nor its display name, so it resolves to no organization the instance serves.
- The IdP issues opaque access tokens rather than JWTs, which fails Bearer-token requests to `/api-portal/api/v0.9` while browser login still works.

Set `[api_portal.logging] level = "debug"` to see which claim or check fails.

## Optional settings

These `[api_portal.auth.idp]` keys tune the login experience. Leave them at their defaults unless you need the behavior:

| Key | Default | Effect |
|-----|---------|--------|
| `silent_sso` | `true` | Attempts a `prompt=none` authorization on the first page load, so a user with a live IdP session arrives already signed in. Set to `false` to require an explicit **Login**. |
| `org_callback` | `false` | Sends a user with no stored return path to the organization's landing page after login, rather than the portal root. |
| `sign_up_url` | empty | The IdP's self-registration page. The portal's **Sign up** route redirects here; without it the route has nowhere to send the user. |
| `token_refresh_timeout_ms` | `10000` | How long the portal waits on the IdP's token endpoint when refreshing an expired access token. |
| `certificate` | empty | An X.509 certificate used to verify Bearer-token signatures instead of fetching the JWKS endpoint. Set it only for an IdP whose JWKS endpoint the portal can't reach; browser login always uses `jwks_url`. |

## Claim names for common identity providers

The roles claim is the one that most often differs. These paths are known to work:

| Identity provider | `claim_mappings` roles value |
|-------------------|------------------------------|
| Asgardeo | `roles` |
| Microsoft Entra ID | `roles` |
| Keycloak | `realm_access.roles`, or `resource_access.<client>.roles` |

## Related topics

- [Set up Asgardeo as your identity provider](asgardeo-as-idp.md): these steps apply to Asgardeo, including `dp:*` scope registration
- [Authentication in the API Portal & MCP Hub](overview.md): how identity provider authentication compares with local authentication
- [Configurations](../../references/configurations.md): every `config.toml` key, and how interpolation tokens deliver values into it
- [Organization settings](../../admin-settings/organization-settings.md): the organization's display name and references, as administrators see them