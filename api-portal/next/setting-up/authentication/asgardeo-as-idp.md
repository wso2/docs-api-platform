---
title: "Set up Asgardeo as your identity provider"
description: "Configure WSO2 Asgardeo as the OIDC identity provider for a production API Portal deployment, from application registration to config.toml."
canonical_url: https://wso2.com/api-platform/docs/api-portal/setting-up/authentication/asgardeo-as-idp/
md_url: https://wso2.com/api-platform/docs/api-portal/setting-up/authentication/asgardeo-as-idp.md
tags:
  - cloud
  - api-portal
  - tutorials
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-04
content_type: "tutorial"
---

# Set up Asgardeo as your identity provider

This tutorial walks you through configuring WSO2 Asgardeo as the identity provider for a production API Portal deployment. It's one worked example of the general procedure in [Connect an identity provider to the API Portal](connect-an-identity-provider.md)—read that first if you're integrating a different provider. For how identity provider authentication compares with local authentication, see [Authentication in the API Portal & MCP Hub](overview.md).

The API Portal & MCP Hub uses Asgardeo's sub-organization model: each API Portal organization maps to one Asgardeo sub-organization. A single Asgardeo application, shared across every portal organization, handles login, and each session is scoped to one sub-organization:

1. A portal organization's handle is the Asgardeo sub-org handle.
2. When a user selects **Login**, the portal redirects to Asgardeo with `org=<handle>`, scoping the authorization to that sub-organization.
3. Asgardeo issues a JWT whose organization claim identifies the sub-organization. On every authenticated request, the portal verifies this claim matches the organization being accessed.
4. Each session is bound to one sub-organization—reaching a different portal organization's protected pages means logging out and back in on that organization.

## Prerequisites

- An Asgardeo account at [console.asgardeo.io](https://console.asgardeo.io)
- The API Portal & MCP Hub accessible at a known hostname

## Step 1: Set up your organization

1. Log in to [console.asgardeo.io](https://console.asgardeo.io).
2. Create or select your root organization.
3. If you need multiple tenants, create sub-organizations at `https://console.asgardeo.io/t/<root-org>/app/organizations`.

## Step 2: Register the API Portal application

The API Portal & MCP Hub is a server-side application that can hold a client secret, so register it as a confidential client. A single-page application is a public client and cannot complete the confidential authorization-code exchange the portal relies on.

1. In the root organization, go to **Applications > New Application**.
2. Choose **Traditional Web Application** and name it `API Portal & MCP Hub`.
3. Under **Authorized redirect URLs**, add both, replacing `<org-handle>` with the sub-organization handle you settle on in step 5:
      - `https://<your-domain>/api-portal/<org-handle>/callback`—the login callback
      - `https://<your-domain>/api-portal/<org-handle>`—the post-logout redirect (Asgardeo validates `post_logout_redirect_uri` against this same list)

    This single shared URI pair is the only one you register. It matches the `callback_url` and `logout_redirect_uri` you set in step 4—after the callback, the portal uses the session's stored return path to route the user to the correct organization, so no per-organization redirect URLs are needed.
4. Enable **Share with all organizations** so users in sub-organizations can log in.
5. Under the **Protocol** tab, set **Access Token Type** to **JWT**.
6. Under the **Login Flow** tab, remove the Username/Password authenticator and add **SSO Authentication** (organization SSO), which routes each user to their sub-organization's login experience.
7. Under the **User Attributes** tab, add these attributes to the token: `given_name`, `family_name`, `email`, and `roles`.

Note the client ID and client secret from the **Protocol** tab. The portal needs both, and the client ID is also used as the audience in the portal configuration.

## Step 3: Create the two roles

The portal recognizes two personas: whoever administers it, and whoever consumes APIs through it. In the portal's default `mode = "role"`, a token's role names are expanded into `dp:*` scopes through the portal's own grant table, so Asgardeo only has to emit role names—it never mints a `dp:*` scope. Use the names the shipped grant table already defines:

| Asgardeo role | Grants in the portal |
|---------------|----------------------|
| `dp_admin` | Every action on the organization: content and theme, the API and MCP server catalog, views, labels, subscription plans, key managers, webhook subscribers, and every application and subscription |
| `dp_subscriber` | The consumer persona: own applications, subscriptions, and keys, plus read access to the catalog |

1. Open the **API Portal & MCP Hub** application you registered in step 2.
2. Under the **Roles** tab, create an application role named `dp_admin` and another named `dp_subscriber`.
3. Assign `dp_admin` **only to administrators**, and `dp_subscriber` to regular users in each sub-organization that needs access.

Step 4 points both `[api_portal.auth.authorization.portal_roles]` entries at these same names, so one pair of Asgardeo roles drives both page access and Management API authorization. (The shipped `config.toml` ships `ap_admin`/`ap_subscriber` there, the role names the Platform API mints for local auth — this tutorial replaces them with the Asgardeo roles you just created.) To change what either role grants, edit the portal's `role-to-scope-mapping.yaml`—see [Choose how privileges reach the token](connect-an-identity-provider.md#step-3-choose-how-privileges-reach-the-token).

!!! note
    Browser login sessions still pass through the per-operation scope check in role mode, which is the gap role mode exists to close: the session's own roles claim is what the portal expands to authorize each Management API request.

## Step 4: Configure the API Portal & MCP Hub

Update the `[api_portal.auth]` tables in `configs/config.toml`:



```toml
[api_portal.auth]
mode = "idp"

[api_portal.auth.idp]
name              = "Asgardeo"
issuer            = "https://api.asgardeo.io/t/<your-tenant>/oauth2/token"
authorization_url = "https://api.asgardeo.io/t/<your-tenant>/oauth2/authorize"
token_url         = "https://api.asgardeo.io/t/<your-tenant>/oauth2/token"
user_info_url     = "https://api.asgardeo.io/t/<your-tenant>/oauth2/userinfo"
jwks_url          = "https://api.asgardeo.io/t/<your-tenant>/oauth2/jwks"
client_id         = "<api-portal-app-client-id>"
client_secret     = '{{ env "APIP_AP_AUTH_IDP_CLIENT_SECRET" }}'
audience          = "<api-portal-app-client-id>"   # Asgardeo sets the client ID as the aud claim
callback_url      = "https://<your-domain>/api-portal/<org-handle>/callback"
logout_url        = "https://api.asgardeo.io/t/<your-tenant>/oidc/logout"
logout_redirect_uri = "https://<your-domain>/api-portal/<org-handle>"
scope             = "openid profile email roles"

# Which token claim carries each field. Asgardeo B2B puts the sub-org handle in org_name.
[api_portal.auth.claim_mappings]
organization = "org_name"
roles        = "roles"
groups       = "groups"

# Expands the roles claim into dp:* scopes, and gates pages on the same two role
# names. This section is mode-independent — it is NOT under [api_portal.auth.idp].
[api_portal.auth.authorization]
enabled               = true
mode                  = "role"
role_to_scope_mapping = "/etc/api-portal/role-to-scope-mapping.yaml"
page_role_validation  = true

[api_portal.auth.authorization.portal_roles]
admin      = "dp_admin"
subscriber = "dp_subscriber"
```



`mode = "idp"` selects the identity provider backend and stops the local login form from being used. `callback_url` must exactly match one of the authorized redirect URLs you registered in step 2. A single `callback_url` is shared across all portal organizations—after the callback, the portal uses the session's stored return path to redirect the user to the correct organization, so you register only this one URL with Asgardeo.

Replace `<org-handle>` in `callback_url` and `logout_redirect_uri` with the `[api_portal.organization] handle` from step 5, and keep it identical to the redirect URLs registered in step 2.

Never write the client secret as a literal in `config.toml`—the `{{ env }}` placeholder above reads it from an environment variable instead, so it never has to be committed to source control:

```bash
export APIP_AP_AUTH_IDP_CLIENT_SECRET=<api-portal-app-client-secret>
```

In a production deployment, prefer supplying it from a mounted secret file instead, by swapping the token for `'{{ file "/secrets/api-portal/oidc_client_secret" }}'` and mounting the secret at that path—resolution fails closed, so a missing or unreadable file aborts startup rather than falling back to an empty credential.

## Step 5: Align the portal handle with the sub-organization

Asgardeo puts the sub-organization's handle in the `org_name` claim, and the portal resolves that claim against the organization it serves. The two names have to agree, so set `[api_portal.organization] handle` to the Asgardeo sub-org's **handle**—the URL slug shown in the Asgardeo console:

```toml
[api_portal.organization]
handle       = "acme"      # the Asgardeo sub-org handle
display_name = "Acme"
```

Set this before the portal first starts. The handle is what the portal writes into the organization's **IDP reference ID** when it seeds the organization row, and that field is fixed afterward—the Management API rejects a request that changes it. Changing the handle later means seeding a new organization.

The handle is also the URL slug in `/api-portal/{handle}/views/{viewName}`, so it appears in every portal URL, and the portal normalizes it to lowercase.

!!! note "Match the claim value to the handle exactly"
    Configure Asgardeo to emit `org_name` with the same value as the handle, character for character. The portal matches the claim against the organization's stored **IDP reference ID**, which is seeded from the handle and compared verbatim — so a claim of `Acme` does not match a handle of `acme`.

With the two aligned, the login flow closes:

1. A user selects **Login**, and the portal appends `org=<handle>` to the Asgardeo authorization URL.
2. Asgardeo scopes the login session to that sub-organization, and issues a token whose `org_name` claim identifies it.
3. On every authenticated request, the portal resolves that claim against the organization it serves. A token minted for a different sub-organization resolves elsewhere and is refused with `403`.

Two consequences worth knowing:

- Public pages (the API catalog and documentation) stay accessible without authentication.
- Protected pages (applications, subscriptions, API keys) need a token whose `org_name` matches, so a user reaching a different portal organization has to log out and log in again there.

!!! note "If the handle can't match"
    When the sub-org handle isn't a name you want in your portal URLs, the alternative is to have Asgardeo emit a separate claim carrying the portal handle as a constant, and map `organization` to that claim instead. Doing so drops the sub-organization distinction from the check—every sub-org's token then carries the same value—so choose it only for a tenant with a single sub-organization. See [when your IdP has no organization concept](connect-an-identity-provider.md#when-your-idp-has-no-organization-concept).

## Step 6: Restart and verify

Restart the portal so it reloads the configuration:

```bash
docker compose up -d --force-recreate
```

Open the portal and select **Login**. Instead of the built-in username and password form, you're redirected to the Asgardeo-hosted login page, and land back on the page you started from after signing in. Signing in as a `dp_admin` user also reveals the **Settings** area.

## Claim flow summary

The Asgardeo token carries these claims through to the API Portal & MCP Hub:

| Claim | Purpose | Configured as |
|-------|---------|----------------|
| `sub` | User identity | Read under a fixed name, not configurable |
| `org_name` | Sub-organization handle, resolved against the portal's `[api_portal.organization] handle` | `organization` in `[api_portal.auth.claim_mappings]` |
| `roles` | Role list. Expanded into Management API scopes through `role_to_scope_mapping`, and matched against `[api_portal.auth.authorization.portal_roles]` for page access | `roles` in `[api_portal.auth.claim_mappings]` |

Keep the claim names consistent between the Asgardeo token attributes and the `[api_portal.auth.claim_mappings]` table.

!!! important "Two retired keys abort startup"
    Earlier versions configured roles under `[api_portal.auth.idp.roles]`, with a third `super_admin` tier. That section is retired, along with `auth.role_validation`, and leaving either in `config.toml` fails startup rather than silently applying a default. Use `[api_portal.auth.authorization.portal_roles]` and `auth.authorization.page_role_validation` instead—see [Authorization](../../references/configurations.md#authorization).

## Alternative: let Asgardeo mint the `dp:*` scopes

`mode = "role"` above needs no scope registration in Asgardeo, which is why this tutorial uses it. If you'd rather have Asgardeo issue the portal's `dp:*` scopes directly and set `mode = "scope"`, register them in your tenant first. A helper script does the registration through Asgardeo's own management APIs.

1. Create a new OIDC application in Asgardeo, for example named `API Portal System`.
2. Under **API Authorization**, add the **API Resource Management API** and the **Application Management API**.
3. Note its client ID and client secret.
4. Download the script and run it:

    ```bash
    curl -sLO https://raw.githubusercontent.com/wso2/api-platform/main/portals/api-portal/production/scripts/register_asgardeo_scopes.sh
    chmod +x register_asgardeo_scopes.sh

    ASGARDEO_TENANT=<your-tenant> \
    ASGARDEO_CLIENT_ID=<system-app-client-id> \
    ASGARDEO_CLIENT_SECRET=<system-app-client-secret> \
    ASGARDEO_RESOURCE_IDENTIFIER=https://<your-domain> \
    ./register_asgardeo_scopes.sh
    ```

5. Open the **API Portal & MCP Hub** application, and under **API Authorization** add the API resource the script created.
6. Assign the `dp:*` scopes to your roles, giving administrators the full set and subscribers only what everyday consumer operations need—`dp:application:manage`, `dp:subscription:manage`, `dp:api_key:manage`, and the `dp:*:read` scopes for browsing the catalog.
7. Set `mode = "scope"` in `[api_portal.auth.authorization]`.

The script registers an API resource representing the portal, with all `dp:*` scopes under it. For local testing, its default `ASGARDEO_RESOURCE_IDENTIFIER=https://localhost:9543` works unchanged. The system application is only needed to run the script, and can be deleted afterward.

In scope mode, browser sessions are preauthorized. For a user signed in through Asgardeo, the portal skips the per-operation scope check. Page role gating is the authorization that applies to them instead. The `dp:*` scopes then govern machine clients that call `/api-portal/api/v0.9` with a Bearer token.

## Related topics

- [Connect an identity provider to the API Portal](connect-an-identity-provider.md): the general procedure this tutorial is one example of
- [Authentication in the API Portal & MCP Hub](overview.md): how identity provider authentication compares with local authentication
- [Get a bearer token via curl](../../references/get-a-bearer-token-via-curl.md): calling the Management API with a token from your IdP
- [Configurations](../../references/configurations.md): every `config.toml` key