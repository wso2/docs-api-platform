---
title: "Set up Microsoft Entra ID as your identity provider"
description: "Configure Microsoft Entra ID for a production AI Workspace deployment: application registration, app roles, and the config.toml settings both services read."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/authentication/entra-id-setup/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/authentication/entra-id-setup.md
tags:
  - cloud
  - ai-workspace
  - authentication
  - oidc
  - entra-id
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-03
content_type: "how-to"
---

# Set up Microsoft Entra ID as your identity provider

This guide walks you through registering a Microsoft Entra ID application and configuring AI Workspace and the Platform API to authenticate against it.

For background on identity provider (IdP) authentication, see [Authentication in AI Workspace](overview.md). For the configuration common to all identity providers, see [Connect an identity provider to AI Workspace](connect-an-identity-provider.md).

## Prerequisites

Before you begin, make sure you have:

- A Microsoft Entra ID tenant.
- Permission to register applications and grant admin consent.
- AI Workspace and the Platform API accessible over HTTPS.
- Access to the `configs/config.toml` file both services read.

This guide uses the following placeholders:

| Placeholder | Description |
|-------------|-------------|
| `<TENANT_ID>` | The **Directory (tenant) ID** from the application's **Overview** page |
| `<CLIENT_ID>` | The **Application (client) ID** from the application's **Overview** page |
| `<AIW_HOST>` | The AI Workspace host as the browser reaches it, including the port when it isn't `443`—for example, `localhost:9643` |

## Configure Microsoft Entra ID

### Step 1: Register the application

Register the application with the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `AI Workspace` |
| **Supported account types** | Accounts in this organizational directory only |
| **Redirect URI platform** | Web |
| **Redirect URI** | `https://<AIW_HOST>/api/auth/callback` |
| **Additional redirect URI** | `https://<AIW_HOST>/login` |

Choose **Web** as the platform, not **Single-page application**, and register both redirect URIs on that platform. The first receives the sign-in callback. The second is where Entra ID returns the browser after sign-out. Entra ID validates the `post_logout_redirect_uri` against the registered redirect URIs, so the `/login` destination you set as `post_logout_redirect_url` in [Step 10](#step-10-configure-oidc-authentication) has to appear here.

To register the application, follow these steps:

1. In the Azure portal, go to **Microsoft Entra ID > App registrations > New registration**.
2. Enter the settings from the preceding table.
3. Select **Register**.
4. Open the application's **Overview** page and record the **Application (client) ID** and the **Directory (tenant) ID**.

### Step 2: Expose an API

Go to **App registrations > AI Workspace > Expose an API**.

#### 2.1 Configure the application ID URI

1. Next to **Application ID URI**, select **Add**.
2. Keep the default value `api://<CLIENT_ID>`.
3. Select **Save**.

#### 2.2 Add an API scope

Add a scope with the following settings:

| Setting | Value |
|---------|-------|
| **Scope name** | `access` |
| **Who can consent** | Admins and users |
| **Admin consent display name** | Access AI Workspace |
| **State** | Enabled |

To add the scope, follow these steps:

1. Select **Add a scope**.
2. Enter the settings from the preceding table.
3. Select **Add scope**.

#### 2.3 Add API permissions

1. Go to **API permissions > Add a permission > My APIs**.
2. Choose the **AI Workspace** application.
3. Under **Delegated permissions**, select the `access` scope.
4. Confirm with **Add permissions**.

#### 2.4 Grant admin consent

On the **API permissions** page, select **Grant admin consent** and confirm the permission shows as **Granted**.

### Step 3: Create a client secret

1. Go to **Certificates & secrets > New client secret**.
2. Enter a description and select an expiration period.
3. Select **Add**.
4. Copy the **Value** of the client secret.

    !!! warning
        Copy the **Value**, not the **Secret ID**. Entra ID shows the secret value only when the secret is created.

Store the secret securely. You configure it in AI Workspace in [Step 10](#step-10-configure-oidc-authentication).

### Step 4: Configure version 2.0 access tokens

1. Go to **App registrations > AI Workspace > Manifest**.
2. Find the `api` section and set `requestedAccessTokenVersion` to `2`:

    ```json
    "api": {
        "requestedAccessTokenVersion": 2
    }
    ```

3. Save the manifest.

### Step 5: Create application roles

Each app role takes the following settings, shown here for `ap_admin`:

| Setting | Value |
|---------|-------|
| **Display name** | `ap_admin` |
| **Allowed member types** | Users/Groups |
| **Value** | `ap_admin` |
| **Do you want to enable this app role?** | Enabled |

**Value** must match the corresponding role name in `role-to-scope-mapping.yaml`.

To create a role, follow these steps:

1. Go to **App registrations > AI Workspace > App roles**.
2. Select **Create app role**.
3. Enter the settings from the preceding table.
4. Repeat for each role you need.

The default roles are:

| Role | Grants |
|------|--------|
| `ap_admin` | Full access to every resource and operation |
| `ap_operator` | Gateway and deployment operations |
| `ap_publisher` | Creating and publishing APIs and proxies |
| `ap_subscriber` | Applications and subscriptions |
| `ap_viewer` | Read-only access |

### Step 6: Assign roles to users or groups

1. Go to **Microsoft Entra ID > Enterprise applications** and select the **AI Workspace** application.
2. Open **Users and groups > Add user/group**.
3. Choose the user or group, then choose the application role to assign.
4. Select **Assign**.

### Step 7: Add optional claims

1. Go to **App registrations > AI Workspace > Token configuration**.
2. Select **Add optional claim**.
3. Select **Access** as the token type.
4. Add the `email` claim. Entra ID includes `preferred_username` in a v2.0 access token from the `profile` scope, which the application requests already. The `email` claim depends on the `email` scope and is absent for a user who has no email address recorded.

Don't add `tid` or `oid` here. Entra ID includes both in a v2.0 access token without any optional-claim configuration.

### Step 8: Get the OpenID Connect (OIDC) endpoints

Go to **App registrations > AI Workspace > Overview > Endpoints** and use the version 2.0 endpoints:

| Endpoint | URL |
|----------|-----|
| OIDC metadata | `https://login.microsoftonline.com/<TENANT_ID>/v2.0/.well-known/openid-configuration` |
| Issuer | `https://login.microsoftonline.com/<TENANT_ID>/v2.0` |
| JSON Web Key Set (JWKS) | `https://login.microsoftonline.com/<TENANT_ID>/discovery/v2.0/keys` |

These values go into the Platform API configuration in the next step.

## Configure the Platform API

### Step 9: Configure Platform API authentication

AI Workspace and the Platform API read the same `configs/config.toml` file. Update the `[platform_api.auth]` tables:

```toml
# Delegate authentication to the external identity provider.
[platform_api.auth]
mode = "idp"

# JWKS-based validation against Microsoft Entra ID.
[platform_api.auth.idp]
name     = "entra"
jwks_url = "https://login.microsoftonline.com/<TENANT_ID>/discovery/v2.0/keys"
issuer   = ["https://login.microsoftonline.com/<TENANT_ID>/v2.0"]
audience = ["<CLIENT_ID>"]

# Use application roles for authorization.
[platform_api.auth.authorization]
enabled               = true
mode                  = "role"
role_to_scope_mapping = "/etc/platform-api/role-to-scope-mapping.yaml"

# Microsoft Entra ID claim mappings.
[platform_api.auth.claim_mappings]
organization = "tid"
org_handle   = "tid"
org_name     = "tid"
user_id      = "sub"
username     = "preferred_username"
email        = "email"
roles        = "roles"
```

All three organization keys map to `tid`, the directory (tenant) ID. `tid` is the only tenant-level identifier a version 2.0 access token carries by default, so every user in the tenant resolves to the same organization. For a readable organization name or slug, add a custom claim that carries the same value for every user in the tenant, then map `org_name` and `org_handle` to it.

## Configure AI Workspace

### Step 10: Configure OIDC authentication

In the same `configs/config.toml` file, update the `[ai_workspace.auth]` tables:



```toml
[ai_workspace.auth]
mode = "oidc"

[ai_workspace.auth.oidc]
authority                = "https://login.microsoftonline.com/<TENANT_ID>/v2.0"
client_id                = "<CLIENT_ID>"
client_secret            = '{{ file "/secrets/ai-workspace/oidc_client_secret" }}'
redirect_url             = "https://<AIW_HOST>/api/auth/callback"
post_logout_redirect_url = "https://<AIW_HOST>/login"

# Microsoft Entra ID scope configuration.
scope = "openid profile email offline_access api://<CLIENT_ID>/access"

# Use application roles for authorization.
[ai_workspace.auth.authorization]
mode                  = "role"
role_to_scope_mapping = "/etc/ai-workspace/role-to-scope-mapping.yaml"

# Microsoft Entra ID claim mappings.
[ai_workspace.auth.claim_mappings]
organization = "tid"
org_name     = "tid"
org_handle   = "tid"
username     = "preferred_username"
email        = "email"
roles        = "roles"
```



#### Supply the client secret

Never write the client secret as a literal in `config.toml`. For production deployments, read it from a mounted secret file:



```toml
client_secret = '{{ file "/secrets/ai-workspace/oidc_client_secret" }}'
```



For local development, read it from an environment variable instead:



```toml
client_secret = '{{ env "APIP_AIW_AUTH_OIDC_CLIENT_SECRET" }}'
```



For more information, see [Sensitive values in `config.toml`](../configuration.md#sensitive-values-in-configtoml).

## Restart and verify

### Step 11: Restart the services

Restart AI Workspace and the Platform API so they load the updated configuration. For Docker Compose:

```bash
docker compose up --force-recreate
```

### Step 12: Sign in to AI Workspace

1. Open AI Workspace in your browser. You're redirected to the Microsoft sign-in page.
2. Sign in as a user who has an application role assigned. After authentication, you land back in AI Workspace.

### Step 13: Verify the access token

!!! warning "Never paste a production token into a web decoder"
    An access token is a bearer credential.

Decode the access token and check its claims. A correctly configured token contains values similar to these:

```json
{
  "aud": "<CLIENT_ID>",
  "iss": "https://login.microsoftonline.com/<TENANT_ID>/v2.0",
  "ver": "2.0",
  "tid": "<TENANT_ID>",
  "preferred_username": "user1@example.onmicrosoft.com",
  "roles": [
    "ap_admin"
  ],
  "scp": "access"
}
```

Check the following fields:

| Field | Expected value |
|-------|----------------|
| `aud` | `<CLIENT_ID>` |
| `iss` | `https://login.microsoftonline.com/<TENANT_ID>/v2.0` |
| `ver` | `2.0` |
| `tid` | `<TENANT_ID>` |
| `roles` | The assigned application role |
| `scp` | `access` |