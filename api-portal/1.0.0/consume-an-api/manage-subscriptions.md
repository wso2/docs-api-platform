---
title: "Manage subscriptions in the API Portal & MCP Hub"
description: "Subscribe to an API under a plan, use the subscription token it issues, and switch, suspend, or cancel the subscription later."
canonical_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/manage-subscriptions/
md_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/manage-subscriptions.md
tags:
  - cloud
  - api-portal
  - subscriptions
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-18
content_type: "how-to"
---

# Manage subscriptions

A subscription grants you access to one API or MCP server under a chosen plan, which sets your rate limits and quota. It also issues a **subscription token**—a credential you send with every call so the gateway knows which plan to enforce.

Subscriptions belong to you, not to an application. You don't need to create an application first, and the same subscription works from anywhere you call the API.

## Subscribe to an API

1. Sign in to the API Portal & MCP Hub.
2. Click **APIs** in the sidebar and open the API you want.
3. Click **Subscribe** in the header, or scroll to the **Subscription plans** panel.
4. Select **Subscribe** for the plan you want.

The subscription is created the moment you click—there's no confirmation step. A dialog then shows your subscription token.

!!! warning
    Copy the token before closing the dialog. You can retrieve it again later from **Subscriptions** in the sidebar, but nothing on screen tells you that at the time.

You hold at most one subscription per API. Once you have one, the other plan cards relabel their buttons to **Switch plan**—see [Switch to a different plan](#switch-to-a-different-plan).

## Use the subscription token

Send the token in the header the API's specification names, commonly `Subscription-Key`:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "Subscription-Key: <YOUR_SUBSCRIPTION_TOKEN>"
```

The subscription token is not a substitute for authentication. Most APIs also expect an API key or an OAuth2 access token, and you send both headers together. See [Consume an API](overview.md) for which credentials an API expects and how to tell.

## View and manage a subscription

Every subscription you hold is listed under **Subscriptions** in the sidebar, in a table showing the API, version, plan, and status. Click the **Manage subscription** button on a row to open the manage dialog. The same dialog opens from **View subscription** on the plan card on the API's overview page.

From the dialog you can:

- **Reveal or copy the subscription token.** The token is masked until you click the eye icon.
- **Regenerate** the token. The old token stops working immediately, so update anything using it. You're asked to confirm first.
- **Suspend** the subscription. It goes inactive and the button becomes **Resume**. Use this to stop traffic without giving up the subscription or its token.
- **Unsubscribe**, after a confirmation.

## Switch to a different plan

To move to a different plan on an API you're already subscribed to:

1. Open the API's overview page.
2. Click **Switch plan** on the plan card you want.
3. Confirm in the dialog.

Your subscription token stays the same, so nothing you've already configured breaks. What changes is the rate limits and quota the new plan sets.

## Cancel a subscription

1. Go to **Subscriptions** in the sidebar.
2. Click **Manage subscription** on the row you want to cancel.
3. Click **Unsubscribe**, then confirm.

Cancelling invalidates the subscription token. Anything calling the API with it stops working. You can subscribe again at any time, and you'll get a new token.

## APIs without plans

Not every API has subscription plans. When an API doesn't, its overview page shows no **Subscription plans** panel and no **Subscribe** button, and there's nothing to subscribe to—call it with whatever authentication its specification requires.

To try an API before wiring it into your code, use the **Try It** console on the [documentation page](../discover-apis/browse-apis.md#read-the-specification-and-try-it) rather than looking for a subscription.

## Subscription plans

Plans set how much of an API you can consume. The API publisher decides which plans an API offers, and each plan's rate limit appears on its card. For how admins define them, see [Subscription Plans](../admin-settings/subscription-plans.md).

## Subscription lifecycle events

When you subscribe, switch plans, suspend or resume, regenerate the token, or unsubscribe, the portal publishes a webhook event to every subscriber configured for it. Delivery is attempted exactly once, so a timeout or a non-2xx response leaves the subscriber unaware of the change, and any queueing or processing on its side adds delay.

The subscription token travels encrypted on `subscription.created` and `subscription.token_regenerated`. For the payload of each event, see the [Webhook Event Catalog](../references/webhook-event-catalog.md); to register a subscriber, see [Webhook Integration](../admin-settings/webhook-integration.md).

## Related

- [Consume an API](overview.md): which credentials an API expects, and how they combine
- [API Overview](../discover-apis/browse-apis.md#open-an-api): where the subscription plans panel lives
- [Manage API Keys](manage-api-keys.md): generate an API key for a subscribed API
- [Subscription Plans](../admin-settings/subscription-plans.md): admin guide for defining plans
- [Webhook Event Catalog](../references/webhook-event-catalog.md): the `subscription.*` events subscribing, switching, and unsubscribing publish