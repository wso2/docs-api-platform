---
title: "Configure key managers in the Developer Portal"
description: "Register the OAuth2 key managers applications can obtain access tokens from, using the Developer Portal Settings page."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/key-manager-integration/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/key-manager-integration.md
tags:
  - cloud
  - devportal
  - key-manager
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Key Managers

A **key manager** is the OAuth2 authorization server used to issue access tokens for OAuth2-secured APIs. The Developer Portal never creates or stores OAuth applications — developers create their OAuth application directly in the key manager, then link its client ID to an application in the portal. The portal only proxies `client_credentials` token requests to the key manager's token endpoint; it never sees or stores a client secret.

## Adding a Key Manager

1. Navigate to **Settings** and select the **Key Managers** tab under **ORGANIZATION**.
2. Click **+ Add key manager**.
3. Fill in the fields:

| Field | Description |
|---|---|
| **Display name** | Name shown to developers (for example, "Asgardeo") |
| **Handle** | Lowercase identifier used internally |
| **Token endpoint** | The OAuth2 token endpoint the portal proxies `client_credentials` requests to |
| **Enabled** | Whether the key manager is available for developers to select. Disable instead of deleting to temporarily take it out of use |

4. Click **Add key manager**.

## Editing or Deleting a Key Manager

Click a key manager's display name (or the pencil icon) to edit it. Click the trash icon to delete it — applications relying on it will no longer be able to obtain tokens through the portal; this can't be undone.

## How Developers Use Key Managers

1. The developer creates an OAuth application directly in the key manager's own console (outside the portal) and obtains a client ID.
2. In the portal, the developer opens their application's **Manage Keys** view, picks a key manager, and pastes the client ID. The portal stores only the client ID — never a secret.
3. To get an access token, the developer clicks **Generate access token**, enters the client secret when prompted, and the portal proxies a `client_credentials` request to the key manager's token endpoint. The secret is never stored.

When an application is deleted, the portal removes the stored client ID mappings — it doesn't contact the key manager, since the OAuth application itself is owned and managed there independently.
