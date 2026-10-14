---
title: "Set up WSO2 Identity Server for multiple organizations"
description: "Configure WSO2 Identity Server 7.x as the identity provider for an API Portal in multi-organization mode, and onboard an organization."
canonical_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/setting-up/authentication/wso2-is-as-idp/
md_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/setting-up/authentication/wso2-is-as-idp.md
tags:
  - api-portal
  - authentication
  - multi-organization
  - wso2-identity-server
  - tutorials
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-13
content_type: "tutorial"
---

# Set up WSO2 Identity Server for multiple organizations

This tutorial configures a self-hosted WSO2 Identity Server (IS) 7.1 or later as the identity provider (IdP) for an API Portal & MCP Hub in [multi-organization mode](multi-organization.md), and then onboards one organization. Every step uses the Identity Server **Console** (`https://<is-host>:9443/console`) and the portal's own UI. Screen and field names are as in WSO2 Identity Server 7.3.

The setup works like this:

1. One application, **API Portal**, is registered in the Identity Server root organization and shared with every organization. Each organization gets its own copy, shown as a shared app in that organization.
2. A portal organization maps to one Identity Server organization through the `org_id` claim in the tokens Identity Server issues for it. The portal stores that value as the organization's IdP reference ID, and creates the organization itself the first time one of its users signs in.
3. Two roles, `dp_admin` and `dp_subscriber`, are created once on the root application and appear in every organization automatically. Assigning a user one of them gives that user the portal's administrator or subscriber tier.
4. Onboarding an organization is then a matter of creating the Identity Server organization, adding its users, and assigning them roles. Its first sign-in to the portal provisions it.

## Prerequisites

- WSO2 Identity Server 7.1 or later, and a **Console** login for the root organization's administrator.
- The API Portal & MCP Hub's browser-facing URL. This tutorial uses `https://localhost:9543`, and the redirect URLs below must match yours exactly.

## Step 1: Create the API Portal application

In the root organization's **Console**:

1. Go to **Applications** > **New Application** > **Traditional Web Application**.
2. Enter these values:
    - **Name:** `API Portal`
    - **Protocol:** **OpenID Connect**
    - **Authorized redirect URLs:** `https://localhost:9543/api-portal/default/callback`, the portal's `auth.idp.callback_url`
3. Select **Allow sharing with organizations**.
4. Click **Create**.

### Configure the protocol

On the application's **Protocol** tab:

1. Under **Allowed grant types**, select **Code** and **Refresh Token**.
2. Under **Authorized redirect URLs**, also add the portal's `auth.idp.logout_redirect_uri`, for example `https://localhost:9543/api-portal/logout`.
3. Under **Allowed origins**, add the portal's origin, `https://localhost:9543`.
4. Under **Access Token**, set **Token type** to **JWT**, and under **Access Token Attributes**, select `roles`. Also select `groups` if you map groups.
5. Click **Update**.

The **Client ID** and **Client secret** at the top of this tab go into the portal's `auth.idp.client_id` and `auth.idp.client_secret` in [step 3](#step-3-configure-the-api-portal).

### Release the user attributes

Without these attributes, users sign in without a name and role-based authorization fails, because no `roles` claim reaches the portal.

On the **User Attributes** tab, select these scopes, and click **Update**:

- **Email**
- **Profile**: expand it and select at least **First Name**, **Last Name**, and **Username**
- **Roles**

The organization claims `org_id`, `org_name`, and `org_handle` need no attribute. Identity Server adds them to every token it issues for an organization, including the root organization.

### Share the application

On the **Shared Access** tab:

1. Under **Sharing Policy**, select **Share the application with all organizations**, and click **Save**. This covers organizations you create later too.
2. Turn on **Enable enhanced organization login**. Without it, a sign-in to an organization succeeds but carries no `roles`, so the portal grants nothing.

## Step 2: Create the portal roles

The role names must match `[api_portal.auth.authorization.portal_roles]` in the portal's configuration, which [step 3](#step-3-configure-the-api-portal) sets to `dp_admin` and `dp_subscriber`.

On the application's **Roles** tab:

1. Leave **Role Audience** set to **Application**.
2. Click **+ New Role** and create `dp_admin`. Repeat for `dp_subscriber`.
3. Confirm both roles are listed under **Assigned Roles**, and click **Update**.

Because the application is shared, both roles appear in every organization on their own. Under **User Management** > **Roles**, they're marked as shared roles with the audience **application | API Portal**.

To give a root organization user a role—for example, the Identity Server administrator while you test—go to **User Management** > **Roles**, open the role, and on its **Users** tab click **Assign User**.

## Step 3: Configure the API Portal

Set `[api_portal.auth.idp]` to the application's credentials from step 1, and the portal roles to the names from step 2. This example runs the portal in Docker on the same host as Identity Server:

{% raw %}

```toml
[api_portal.multi_organization]
enabled = true

[api_portal.auth]
mode = "idp"
# The root organization's handle: root users, including the IS administrator,
# belong to the configured organization. See "Map the root organization" below.
idp_org_id = "carbon.super"

[api_portal.auth.claim_mappings]
organization = "org_handle"   # organizations are identified by their IS handle
org_name     = "org_name"
org_handle   = "org_handle"   # the IS handle also becomes the portal URL handle
roles        = "roles"

[api_portal.auth.idp]
client_id     = "<api-portal-client-id>"
client_secret = '{{ env "APIP_AP_AUTH_IDP_CLIENT_SECRET" }}'
audience      = "<api-portal-client-id>"   # recommended
issuer        = "https://localhost:9443/oauth2/token"
scope         = "openid profile email roles"
authorization_url   = "https://localhost:9443/oauth2/authorize"
token_url           = "https://host.docker.internal:9443/oauth2/token"
jwks_url            = "https://host.docker.internal:9443/oauth2/jwks"
logout_url          = "https://localhost:9443/oidc/logout"
callback_url        = "https://localhost:9543/api-portal/default/callback"
logout_redirect_uri = "https://localhost:9543/api-portal/logout"

[api_portal.auth.authorization]
enabled               = true
mode                  = "role"
role_to_scope_mapping = "./resources/role-to-scope-mapping.yaml"
page_role_validation  = true

[api_portal.auth.authorization.portal_roles]
admin      = "dp_admin"
subscriber = "dp_subscriber"
```

{% endraw %}

Get these values right:

- **`scope` includes `roles`.** Identity Server 7.3 releases the `roles` claim only when the `roles` scope is requested. Without it, users sign in with no role, and an administrator doesn't see **Settings**.
- **`issuer` is copied exactly.** Open the root organization's discovery document, `https://localhost:9443/oauth2/token/.well-known/openid-configuration`, and copy its `issuer` value. The portal compares it character for character, so a different host name or a trailing slash rejects every bearer token.
- **The browser and the container use different hosts.** `authorization_url` and `logout_url` are browser redirects, so they use a host name the browser resolves. `token_url` and `jwks_url` are called by the portal container, which reaches Identity Server through `host.docker.internal`. If you run the portal outside Docker, use one host name for all four.

The organization keying in this example uses the Identity Server organization handle. It keeps the portal's `org` login hint working: a login from `/api-portal/acme/...` sends `org=acme`, which Identity Server routes straight to that organization's login page. To key on the organization's UUID instead, set `organization = "org_id"` and `idp_org_id` to the root organization's `org_id`. With `org_id` keying, users choose their organization on the Identity Server login page.

### Trust the Identity Server certificate

The portal verifies Identity Server's TLS certificate on every call to `token_url` and `jwks_url`, and it provisions organizations only over verified TLS. Don't turn verification off with `NODE_TLS_REJECT_UNAUTHORIZED=0`: it disables provisioning as well.

Instead, add Identity Server's certificate with `NODE_EXTRA_CA_CERTS`, mounted into the container. The certificate must meet two conditions, or Node.js ignores it:

- It's a CA certificate, with the basic constraint `CA:TRUE`. Identity Server's default certificate isn't.
- Its subject alternative names cover the host name in `token_url` and `jwks_url`, such as `host.docker.internal`. Identity Server's default certificate covers only `localhost`.

Give Identity Server a certificate that meets both conditions, for example through a dedicated TLS keystore (`[keystore.tls]` in Identity Server's `deployment.toml`), and add the same certificate to Identity Server's own `client-truststore.p12`.

### Map the root organization

Users of the root organization, including the Identity Server administrator, sign in with organization claims too: on WSO2 Identity Server 7.x, the root organization's `org_handle` is `carbon.super`, its `org_name` is `Super`, and its `org_id` is `10084a8d-113f-4211-a0d5-efe36b082211`. Set `auth.idp_org_id` to the value your organization claim carries for it—`carbon.super` with handle keying—so the portal's configured organization is the root organization.

If you leave `idp_org_id` unset, the configured organization's IdP reference ID defaults to its handle, which no token carries. The first root user's sign-in then provisions a separate organization named `Super`, and root users land there instead of in the configured organization.

Confirm the value on your Identity Server by decoding a root user's token, for example with `jq -R 'split(".")[1] | @base64d | fromjson | .org_handle'`. The portal applies `idp_org_id` to the configured organization at startup, so an existing deployment picks up a change on restart, and root users signed in before the change must sign in again.

!!! important "Retire a provisioned Super organization first"
    If a `Super` organization was already provisioned, retire it before that restart. Otherwise, two organizations carry the root organization's ID, and root sign-ins are refused as ambiguous. The portal can't delete organizations, so give the provisioned one an IdP reference ID that no token carries. It keeps its data, and nobody can sign in to it:

    ```sql
    UPDATE organizations SET idp_ref_id = 'retired-super'
     WHERE handle IN ('super', 'carbon.super')
       AND idp_ref_id IN ('carbon.super', '10084a8d-113f-4211-a0d5-efe36b082211');
    ```

Restart the portal after you change the configuration:

```bash
docker compose up -d --force-recreate
```

## Step 4: Onboard an organization

The example organization is `acme`.

### Create the organization

In the root organization's **Console**, go to **Organizations** > **New Organization**, and enter these values:

- **Organization Name:** `acme`
- **Organization Handle:** `acme`. Set it explicitly: it becomes the organization's portal URL (`/api-portal/acme/...`), and you can't change it after you create the organization.

Click **Create**.

### Add the organization's users

1. On the **Organizations** page, click the switch icon on the organization's row. The header then shows **Super / acme**, and **API Portal** is listed on the organization's **Applications** page as a shared app.
2. Go to **User Management** > **Users** > **Add User**, and create the organization's administrator, for example `acmeadmin`, and any subscriber users.
3. Go to **User Management** > **Roles**, open `dp_admin`, and on its **Users** tab click **Assign User** to assign the administrator. Assign subscriber users to `dp_subscriber` the same way.

### Sign in for the first time

The organization's administrator opens the configured organization's page, `https://localhost:9543/api-portal/default/views/default`, selects **Login**, and chooses the `acme` organization on the Identity Server login page. The portal creates the organization, with its handle and name from Identity Server, and the administrator lands in it at `/api-portal/acme/views/default`. The organization's public pages are open from then on, and a login started from them goes straight to `acme`'s login page.

### Set up the organization in the portal

Signed in as the organization's administrator, set up the organization under **Settings**, as you would for any organization:

- [Key manager integration](../../admin-settings/key-manager-integration.md): an M2M application created in the `acme` organization gives its applications tokens from `https://<is-host>:9443/o/<organization-id>/oauth2/token`. If you recreate the Identity Server organization, its ID changes, so update the token endpoint to match.
- [Subscription plans](../../admin-settings/subscription-plans.md): the organization starts with the default plans.
- [Webhooks](../../admin-settings/webhook-integration.md): subscribers registered here receive only `acme`'s events.

The organization's APIs and MCP servers are published through the [Management API](../../rest-api/overview.md), with a token issued for one of its administrators—see [Publish a provisioned organization's catalog](multi-organization.md#publish-a-provisioned-organizations-catalog).

## Troubleshooting

These symptoms are the common ones with Identity Server:

| Symptom | Cause |
|---|---|
| Users sign in with no name, or get no access | The application's user attributes or access token attributes are missing `roles` or the profile attributes, or `scope` doesn't include `roles` |
| An organization administrator signs in but doesn't see **Settings** | **Enable enhanced organization login** is off, `scope` doesn't include `roles`, or the user isn't assigned `dp_admin` in their own organization |
| The Identity Server administrator lands in an organization named `Super` | `auth.idp_org_id` doesn't match the root organization's claim—see [Map the root organization](#map-the-root-organization) |
| `Org claim matches more than one organization's idp_ref_id` | Two portal organizations share an Identity Server organization's ID, typically a leftover `Super` organization |
| A new organization's first sign-in gets `403`, and the portal logs `Refused to provision an organization from an org claim` | The portal doesn't verify Identity Server's certificate—see [Trust the Identity Server certificate](#trust-the-identity-server-certificate) |
| A bearer token is rejected with `no applicable key found in the JSON Web Key Set` | The token came from an organization's own token endpoint, `.../o/<orgId>/oauth2/token`, which Identity Server 7.3 signs with that organization's key. Get bearer tokens through the root application's login instead |

## Related topics

- [Serve multiple organizations from one API Portal](multi-organization.md): how the mode resolves and provisions organizations
- [Connect an identity provider to the API Portal](connect-an-identity-provider.md): the configuration every IdP needs
- [Set up Asgardeo as your identity provider](asgardeo-as-idp.md): the cloud identity provider with the same organization model
