---
title: "Manage API keys"
description: "Generate, rotate, revoke, and associate API keys for a subscribed API in the API Portal & MCP Hub."
canonical_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/manage-api-keys/
md_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/manage-api-keys.md
tags:
  - cloud
  - api-portal
  - api-keys
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Manage API keys

API keys are bound to a specific API. You generate a key directly for an API, and that key authenticates your requests to it—no application is required.

## Prerequisites

The API must have API key authentication enabled—check the API's documentation or the security section of its specification to confirm. If the API requires a subscription, [subscribe to it](manage-subscriptions.md) first.

## Generate an API key

1. Sign in to the API Portal & MCP Hub.
2. Click **APIs** from the sidebar and open the API you want to invoke.
3. In the API's submenu, click **API Keys**.
4. Click **Generate API key**.
5. In the **Generate API key** dialog, enter a **Name** for the key (e.g. `my-prod-key`) and optionally set an **Expires at** date.
6. Click **Generate** and wait for the key to be created.
7. **Copy the API key immediately.** The key won't be visible in the UI after you close this dialog.
8. Click **Done**.

Once you have a key, see [Consume an API Secured with an API Key](api-key.md) for how to use it.

## Rotate an API key

If a key is compromised, or you want to rotate it as a security practice:

1. Navigate to the API's **API Keys** page.
2. Click **Regenerate** next to the key.
3. Adjust the **Name** or **Expires at** in the dialog if needed, then confirm. The old key is immediately invalidated.
4. Copy the new key from the dialog.

!!! warning
    Update all services using the old key before or immediately after regenerating. The old key stops working as soon as regeneration is complete.

## Revoke an API key

To permanently invalidate a key:

1. Navigate to the API's **API Keys** page.
2. Click **Revoke** next to the key.
3. Confirm the revocation.

Revoked keys can't be recovered. Generate a new key if you need access again.

## What the API keys page shows

The page lists every key for the API, with its name, status, expiry (or **Never**), and the application it's attributed to. Above the table, a dropdown filters the list by application.

Each row carries three actions: **Associate app** (or **Change app** when one is already set), **Regenerate**, and **Revoke**.

## Associate an API key with an application

API keys are always generated for an API directly—never for an application. Associating a key with an application afterward is optional. It exists purely for **usage analytics attribution**. In reporting, it groups that key's request metrics under the application. It has no effect on the key's validity or authorization, and a key works identically whether it is associated with an application.

You can do this from either side. From the key's own row, click **Associate app** or **Change app**. Or, from the application:

1. Sign in to the API Portal and open **Applications** in the sidebar.
2. Select the application you want to attribute usage to.
3. Go to the application's **API Keys** tab.
4. Click **Associate existing key**.
5. In the dialog, select the **API** the key belongs to, then select the specific **Key** from that API's existing keys.
6. Click **Associate**.

The key now appears in the application's **API Keys** list, alongside the API it belongs to and its status.

To remove the association later, click **Remove** next to the key in the same list—this only detaches the key from the application; the key itself remains active and usable.

!!! note
    An application can have keys associated from multiple different APIs, and a single API key can be reassociated to a different application at any time by repeating this flow.

## Key lifecycle events

When you generate, regenerate, or revoke an API key, the portal publishes a webhook event to every subscriber configured for it. Enforcement happens once that subscriber receives and accepts the event. Delivery is attempted exactly once, so a timeout or a non-2xx response leaves the change unenforced, and any queueing or processing on the subscriber's side adds delay.

Changing a key's application association publishes `apikey.application_updated`. That's an analytics notification—it doesn't affect whether the key works.

The key itself travels encrypted on `apikey.generated` and `apikey.regenerated`. For the payload of each event, see the [Webhook Event Catalog](../references/webhook-event-catalog.md); to register a subscriber, see [Webhook Integration](../admin-settings/webhook-integration.md).

## Related

- [Manage Subscriptions](manage-subscriptions.md)—subscribe if the API requires a subscription
- [Consume an API Secured with an API Key](api-key.md)—use the key to invoke the API
- [Consume an API Secured with OAuth2](oauth2.md)—alternative for OAuth2-secured APIs
- [Manage Applications](manage-applications.md)—set up an application to associate keys with
- [Webhook Event Catalog](../references/webhook-event-catalog.md)—the `apikey.*` events this lifecycle publishes