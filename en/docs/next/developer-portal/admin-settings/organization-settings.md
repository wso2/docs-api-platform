---
title: "Configure organization settings in the Developer Portal"
description: "Edit the current organization's display name, business owner contact, and identity provider reference from the Developer Portal Settings page."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/organization-settings/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/organization-settings.md
tags:
  - cloud
  - devportal
  - organization
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Organization Settings

The **Organization** tab in the Developer Portal's Settings page manages the details of the organization you're currently signed in to.

## Editing Organization Details

1. Log in to the Developer Portal as an admin and navigate to **Settings**.
2. Under the **ORGANIZATION** group, select the **Organization** tab.
3. Update any of the following fields:

| Field | Description |
|---|---|
| **Name** | The display name shown throughout the portal UI |
| **Handle** | The URL-safe identifier used in every portal URL (`/<orgHandle>/views/<viewName>`). Read-only — it can't be changed after the organization is created |
| **Business owner** | Contact name for the organization owner |
| **Business owner contact** | The owner's phone number or other contact string |
| **Business owner email** | The owner's email address |
| **IDP reference ID** | The org claim value your identity provider asserts at SSO login. The portal matches an authenticated user's org claim against this value to resolve which organization they belong to |
| **Control plane reference ID** | Reference ID included in outbound webhook event payloads (`org.ref_id`). Not used for authentication |

4. Click **Save changes**.

!!! note
    This page only manages the organization you're currently in — it doesn't create or delete organizations. Organization creation happens once, automatically, when the portal is provisioned.
