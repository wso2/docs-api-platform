---
title: "Configure key managers in the API Portal & MCP Hub"
description: "Register the OAuth2 key managers applications can obtain access tokens from, using the API Portal Settings page."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/key-manager-integration/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/key-manager-integration.md
tags:
  - cloud
  - api-portal
  - key-manager
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Key managers

A **key manager** is the OAuth2 authorization server used to issue access tokens for OAuth2-secured APIs. The API Portal & MCP Hub never creates or stores OAuth applications—developers create their OAuth application directly in the key manager, then link its client ID to an application in the portal. The portal only proxies `client_credentials` token requests to the key manager's token endpoint; it never sees or stores a client secret.

## Adding a key manager

1. Navigate to **Settings** and select the **Key Managers** tab under **ORGANIZATION**.
2. Click **+ Add key manager**.
3. Fill in the fields:

| Field | Description |
|---|---|
| **Name** | Required. The name shown to developers on the Manage Keys card, for example `Production` |
| **Token endpoint** | Required. The OAuth2 token endpoint the portal proxies `client_credentials` requests to |
| **Enabled** | Whether the key manager is available for developers to select. Disable instead of deleting to take it out of use temporarily |

The portal generates the key manager's internal identifier itself. A key manager created through the [Management API](../rest-api/key-managers.md) can supply one as `id`; one created here gets a UUID.

4. Click **Add key manager**.

## Editing or deleting a key manager

Click a key manager's name (or the pencil icon) to edit it. Click the trash icon to delete it—applications relying on it will no longer be able to obtain tokens through the portal; this can't be undone.

## How developers use key managers

1. The developer creates an OAuth application directly in the key manager's own console (outside the portal) and obtains a client ID.
2. In the portal, the developer opens their application's **Manage Keys** view, picks a key manager, and pastes the client ID. The portal stores only the client ID—never a secret.
3. To get an access token, the developer clicks **Generate access token**, enters the client secret when prompted, and the portal proxies a `client_credentials` request to the key manager's token endpoint. The secret is never stored.

When an application is deleted, the portal removes the stored client ID mappings—it doesn't contact the key manager, since the OAuth application itself is owned and managed there independently.