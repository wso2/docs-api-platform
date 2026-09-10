---
title: "Configure organization settings in the API Portal & MCP Hub"
description: "Edit the current organization's display name, business owner contact, and identity provider reference from the API Portal Settings page."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/organization-settings/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/organization-settings.md
tags:
  - cloud
  - api-portal
  - organization
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Organization settings

The **Organization** tab in the API Portal's Settings page manages the details of the organization you're signed in to.

## Editing organization details

1. Log in to the API Portal & MCP Hub as an admin and navigate to **Settings**.
2. Under the **ORGANIZATION** group, select the **Organization** tab.
3. Update any of the following fields:

| Field | Description |
|---|---|
| **Name** | The display name shown throughout the portal UI |
| **Handle** | The URL-safe identifier used in every portal URL (`/api-portal/<orgHandle>/views/<viewName>`). Read-only—it can't be changed after the organization is created |
| **Artifact types served** | Read-only. Shows which artifact types the portal serves—APIs, Model Context Protocol (MCP) servers, and API workflows. Set by the operator in the `[api_portal.artifacts]` config, not from this pane; pages for a type that isn't served return 404. See [Artifact types](../setting-up/artifact-types.md) |
| **Business owner** | Contact name for the organization owner |
| **Business owner contact** | The owner's phone number or other contact string |
| **Business owner email** | The owner's email address |
| **IDP reference ID** | The organization claim value your identity provider (IDP) asserts at single sign-on (SSO) login, which incoming tokens are resolved against. Effectively read-only—the portal sets it to the organization handle when the organization is created, and saving a different value fails, because it's what every token is matched against. To have an IDP's organization claim resolve here, align it with the handle instead: see [Connect an identity provider](../setting-up/authentication/connect-an-identity-provider.md#step-5-make-the-organization-claim-resolve-to-your-organization) |
| **Control plane reference ID** | Reference ID included in outbound webhook event payloads (`org.ref_id`). Not used for authentication |

4. Click **Save changes**.

!!! note
    This page only manages the organization you're currently in—it doesn't create or delete organizations. Organization creation happens once, automatically, when the portal is provisioned.