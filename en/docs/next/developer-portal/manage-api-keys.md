---
title: "Manage API keys"
description: "Generate, rotate, revoke, and associate API keys for a subscribed API in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/manage-api-keys/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/manage-api-keys.md
tags:
  - cloud
  - devportal
  - api-keys
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Manage API Keys

API keys are bound to a specific API. You generate a key directly for an API, and that key authenticates your requests to it — no application is required.

## Prerequisites

The API must have API key authentication enabled — check the API's documentation or the security section of its specification to confirm. If the API requires a subscription, [subscribe to it](manage-subscriptions/subscribe-to-an-api.md) first.

## Generate an API Key

1. Sign in to the Developer Portal.
2. Click **APIs** from the sidebar and open the API you want to invoke.
3. In the API's submenu, click **API Keys**.
4. Click **Generate API key**.
5. In the **Generate API key** dialog, enter a **Name** for the key (e.g. `my-prod-key`) and optionally set an **Expires at** date.
6. Click **Generate** and wait for the key to be created.
7. **Copy the API key immediately.** The key won't be visible in the UI after you close this dialog.
8. Click **Done**.

Once you have a key, see [Consume an API Secured with API Key](consuming-services/consume-an-api-secured-with-api-key.md) for how to use it.

## Rotate an API Key

If a key is compromised, or you want to rotate it as a security practice:

1. Navigate to the API's **API Keys** page.
2. Click **Regenerate** next to the key.
3. Confirm the regeneration. The old key is immediately invalidated.
4. Copy the new key from the dialog.

!!! warning
    Update all services using the old key before or immediately after regenerating. The old key stops working as soon as regeneration is complete.

## Revoke an API Key

To permanently invalidate a key:

1. Navigate to the API's **API Keys** page.
2. Click **Revoke** next to the key.
3. Confirm the revocation.

Revoked keys can't be recovered. Generate a new key if you need access again.

## Associate an API Key with an Application

API keys are always generated for an API directly — never for an application. Associating a key with an application afterward is optional and exists purely for **usage analytics attribution**: it groups a key's request metrics under an application in reporting. It has no effect on the key's validity or authorization, and a key works identically whether or not it's associated with an application.

1. Sign in to the Developer Portal and open **Applications** in the sidebar.
2. Select the application you want to attribute usage to.
3. Go to the application's **API Keys** tab.
4. Click **Associate existing key**.
5. In the dialog, select the **API** the key belongs to, then select the specific **Key** from that API's existing keys.
6. Click **Associate**.

The key now appears in the application's **API Keys** list, alongside the API it belongs to and its status.

To remove the association later, click **Remove** next to the key in the same list — this only detaches the key from the application; the key itself remains active and usable.

!!! note
    An application can have keys associated from multiple different APIs, and a single API key can be reassociated to a different application at any time by repeating this flow.

## Key Lifecycle Events

When you generate, regenerate, or revoke an API key, the portal publishes a real-time webhook event to the organization's configured webhook subscriber(s). If the organization has a subscriber wired up to its API Gateway, the change is enforced immediately — there's no propagation delay. See [Webhook Integration](admin-settings/webhook-integration.md).

## Related

- [Subscribe to an API](manage-subscriptions/subscribe-to-an-api.md) — subscribe if the API requires a subscription
- [Consume an API Secured with API Key](consuming-services/consume-an-api-secured-with-api-key.md) — use the key to invoke the API
- [Consume an API Secured with OAuth2](consuming-services/consume-an-api-secured-with-oauth2.md) — alternative for OAuth2-secured APIs
- [Create an Application](manage-applications/create-an-application.md) — set up an application to associate keys with
