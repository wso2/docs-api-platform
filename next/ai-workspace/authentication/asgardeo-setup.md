---
title: "Set up Asgardeo as your identity provider"
description: "Configure Asgardeo as the identity provider for a production AI Workspace deployment, from application registration to Platform API configuration."
canonical_url: ""
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/authentication/asgardeo-setup.md
tags:
  - cloud
  - ai-workspace
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-09
content_type: "how-to"
---

# Set up Asgardeo as your identity provider

This guide walks you through configuring Asgardeo as the identity provider for a production AI Workspace deployment. For background on how identity provider authentication works, see [Authentication in AI Workspace](overview.md).

## Prerequisites

- An Asgardeo account at [console.asgardeo.io](https://console.asgardeo.io)
- AI Workspace and Platform API accessible at known hostnames
- The [`register_asgardeo_scopes.sh`](https://github.com/wso2/api-platform/blob/main/portals/ai-workspace/production/scripts/register_asgardeo_scopes.sh) helper script, downloaded from the WSO2 API Platform GitHub repository

## Step 1: Set up your organization

1. Log in to [console.asgardeo.io](https://console.asgardeo.io).
2. Create or select your root organization, for example `default`.
3. If you need multiple tenants, create sub-organizations at `https://console.asgardeo.io/t/<root-org>/app/organizations`.

## Step 2: Register the AI Workspace application

AI Workspace runs a backend-for-frontend (BFF) that acts as a confidential OIDC client: it holds the client secret and completes the authorization-code and PKCE exchange on the back channel. Register it as a confidential web application, not a single-page application. A single-page application is a public client, and the token endpoint rejects the BFF's exchange with "The authenticated client is not authorized to use the requested grant type."

1. In the root organization, go to **Applications > New Application**.
2. Choose **Standard-Based Application > OpenID Connect** (Traditional Web Application) and name it `AI Workspace`.
3. Add the authorized redirect URL, which is the BFF callback rather than `/signin`: `https://<your-domain>/api/auth/callback`.
4. Enable **Share with all organizations** so users in sub-organizations can log in.
5. Under the **Protocol** tab, set:
      - **Allowed grant types**: Authorization Code and Refresh Token
      - **PKCE**: enabled
      - **Access Token Type**: JWT
6. Under the **Login Flow** tab, configure authentication as needed, for example SSO authentication.
7. Under the **User Attributes** tab, add these attributes to the token: `username`, `given_name`, `family_name`, `roles`, `email`, and `scope`. You create the `scope` attribute in the next step.

Note the client ID and client secret from the **Protocol** tab. The BFF needs both, and the client ID is also used as the audience in the Platform API configuration.

## Step 3: Add a custom scope attribute

1. Create a custom attribute at `https://console.asgardeo.io/t/<root-org>/app/attributes` named `scope`, used to carry OAuth2 scopes granted to the user.
2. Add OIDC scope mappings at `https://console.asgardeo.io/t/<root-org>/app/oidc-scopes` and map the `scope` OIDC claim to the custom `scope` attribute.

## Step 4: Register a system application for scope registration

AI Workspace and the Platform API communicate using `ap:*` scopes. Register these scopes in Asgardeo before assigning them to users, using a dedicated system application.

1. Create a new OIDC application, for example named `AI Platform System`.
2. Under **API Authorization**, add **API Resource Management API** and **Application Management API**.
3. Note the client ID and client secret.
4. Download the scope registration script and run it:

```bash
curl -sLO https://raw.githubusercontent.com/wso2/api-platform/main/portals/ai-workspace/production/scripts/register_asgardeo_scopes.sh
chmod +x register_asgardeo_scopes.sh

ASGARDEO_TENANT=<your-tenant> \
ASGARDEO_CLIENT_ID=<system-app-client-id> \
ASGARDEO_CLIENT_SECRET=<system-app-client-secret> \
ASGARDEO_RESOURCE_IDENTIFIER=https://<platform-api-host> \
./register_asgardeo_scopes.sh
```

This registers an API resource in Asgardeo that represents the Platform API, with all `ap:*` scopes registered under it. For local testing, the default `ASGARDEO_RESOURCE_IDENTIFIER=https://localhost:9243` works without changes.

## Step 5: Link scopes to the AI Workspace application

1. Open the AI Workspace application you registered in step 2.
2. Under **API Authorization**, add the API resource you created in step 4.
3. Create an application role, for example `ap_admin`.
4. Assign all `ap:*` scopes to that role.

## Step 6: Add sub-organization users

For each sub-organization that needs access:

1. Register users under the sub-organization.
2. Assign the shared `ap_admin` role to each user.

## Step 7: Configure the Platform API

Update `config-platform-api.toml`:

```toml
[auth.jwt]
enabled = false

[auth.idp]
enabled  = true
name     = "asgardeo"
jwks_url = "https://api.asgardeo.io/t/<your-tenant>/oauth2/jwks"
issuer   = ["https://api.asgardeo.io/t/<your-tenant>/oauth2/token"]
audience = ["<ai-workspace-client-id>"]

[auth.idp.claim_mappings]
organization_claim_name = "org_id"
org_name_claim_name     = "org_name"
org_handle_claim_name   = "org_handle"

[auth.file_based]
enabled = false
```

Asgardeo uses `org_id` as the claim for the organization UUID, while the Platform API defaults to `organization`. The claim name override above is required to bridge the two.

## Step 8: Configure AI Workspace

Update `config.toml`:

```toml
domain                = "<your-domain>"
auth_mode              = "oidc"
oidc_authority         = "https://api.asgardeo.io/t/<your-tenant>/oauth2/token"
oidc_client_id         = "<ai-workspace-client-id>"
oidc_org_id_claim      = "org_id"
oidc_org_name_claim    = "org_name"
oidc_org_handle_claim  = "org_handle"
platform_api_base_url  = "https://<platform-api-host>/api/v1"
controlplane_host      = "<platform-api-host>"
default_org_region     = "us"
```

The client secret and redirect URLs are BFF settings rather than `config.toml` keys, since the secret must never reach the browser. Set them as environment variables on the AI Workspace container instead:

```bash
OIDC_CLIENT_SECRET=<ai-workspace-client-secret>
OIDC_REDIRECT_URL=https://<your-domain>/api/auth/callback        # the BFF callback from step 2
OIDC_POST_LOGOUT_REDIRECT_URL=https://<your-domain>/login
```

`OIDC_REDIRECT_URL` must exactly match the authorized redirect URL you registered in step 2.

Once configured, opening AI Workspace redirects you to the Asgardeo-hosted login page instead of the file-based login form:

![AI Workspace login page redirecting to the Asgardeo-hosted login page](../../../assets/img/ai-gateway/ai-workspace/authentication/oidc-login-redirect.png)

## Claim flow summary

The Asgardeo token carries these claims through to the Platform API:

| Claim | Purpose | Configured as |
|-------|---------|----------------|
| `sub` | User identity | N/A |
| `org_id` | Organization UUID | `organization_claim_name` in the Platform API, `oidc_org_id_claim` in AI Workspace |
| `org_name` | Organization display name | `org_name_claim_name` in the Platform API, `oidc_org_name_claim` in AI Workspace |
| `org_handle` | Organization slug | `org_handle_claim_name` in the Platform API, `oidc_org_handle_claim` in AI Workspace |
| `scope` | Space-separated `ap:*` scopes | Validated by the Platform API |

Keep these claim names consistent across three places: the Asgardeo token mapper output, the `oidc_org_*_claim` settings in `config.toml`, and the `*_claim_name` settings in the Platform API's `[auth.idp.claim_mappings]`.