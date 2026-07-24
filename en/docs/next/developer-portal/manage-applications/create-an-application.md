---
title: "Create an application"
description: "Create an application in the Developer Portal to hold the OAuth2 client IDs used for OAuth2-secured APIs."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/manage-applications/create-an-application/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/manage-applications/create-an-application.md
tags:
  - cloud
  - devportal
  - applications
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Create an Application

An application is a logical representation of a physical application — a mobile app, web app, device, or CLI tool. In the Developer Portal, applications are used to link OAuth2 client IDs, created directly in a key manager, for invoking OAuth2-secured APIs.

!!! note
    Applications are **not** required for subscriptions or API key generation. Subscriptions are made directly to an API, and API keys are bound to an API — not to an application. Applications are only needed for OAuth2-secured APIs. You can optionally associate an existing API key with an application afterward for usage analytics — see [Associate an API Key with an Application](../manage-api-keys.md#associate-an-api-key-with-an-application).

A developer can have multiple applications with independent OAuth2 client IDs — for example, a `MyApp-Production` application and a `MyApp-Staging` application linked to different OAuth applications in the key manager.

## Create a New Application

1. Sign in to the Developer Portal.
2. In the sidebar, click **Applications**.
3. Click **Create application**.
4. Enter an **Application name** (e.g. `MyApp-Production`) and optionally a **Description**.
5. Click **Create**.

The application is created and you're taken to the application detail page.

## Add an Application Description

1. Select your application.
2. Click **+ Add description** in the application header.
3. Enter a description that explains what the application does and who owns it.
4. Click the checkmark (✔) to save.

## Application Details

From the application detail page you can:

| Action | Where |
|---|---|
| Link an OAuth2 client ID | **Manage Keys** → paste client ID → **Add** |
| Generate an access token for testing | **Manage Keys** → **Generate Token** tab |
| Associate an existing API key for analytics | **API Keys** tab → **Associate existing key** |
| Edit the application name or description | Application overview page → pencil icon next to name/description |
| Delete the application | **Applications** list → trash icon on the application's card |

## Delete an Application

1. Go to **Applications** in the sidebar.
2. Click the trash icon on the application's card.
3. Confirm deletion.

!!! warning
    Deleting an application removes all stored client ID mappings. It does not contact the key manager — OAuth applications there must be deleted independently if no longer needed. Existing access tokens stop working once they expire. This action is irreversible.

## Related

- [Consume an API Secured with OAuth2](../consuming-services/consume-an-api-secured-with-oauth2.md) — generate OAuth2 credentials for your application
- [Subscribe to an API](../manage-subscriptions/subscribe-to-an-api.md) — subscriptions are made directly to an API, not through an application
- [Manage API Keys](../manage-api-keys.md) — generate an API key and optionally associate it with an application
