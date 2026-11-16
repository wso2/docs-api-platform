---
title: "Manage subscriptions in the API Portal & MCP Hub"
description: "Subscribe to an API under a plan, use the subscription token it issues, and switch, suspend, or cancel the subscription later."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/consume-an-api/manage-subscriptions/
md_url: https://wso2.com/api-platform/docs/api-portal/next/consume-an-api/manage-subscriptions.md
tags:
  - cloud
  - api-portal
  - subscriptions
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-16
content_type: "how-to"
---

# Manage subscriptions

A subscription grants you access to one API or MCP server under a chosen plan, which sets your rate limits and quota. It also issues a **subscription token**—a credential you send with every call so the gateway knows which plan to enforce.

Subscriptions belong to you, not to an application. You don't need to create an application first, and the same subscription works from anywhere you call the API.

## Subscribe to an API

1. Sign in to the API Portal & MCP Hub.
2. Click **APIs** (or **MCP Servers**) in the sidebar.
3. Click **Subscribe** on the API's card, or open the API and click **Subscribe** in its header.
4. In **Choose a plan**, select the plan you want, and then click **Subscribe**.

The subscription is created at once. The **You're subscribed** dialog then shows your subscription token. Click **Done** to close it.

!!! warning
    Copy the token before closing the dialog. You can retrieve it again later from **Subscriptions** in the sidebar.

You hold at most one subscription per API. Once you're subscribed, the API's header shows **Switch plan** and **View subscription** instead of **Subscribe**, and your plan's card on the API page carries the subscribed ribbon.

## Use the subscription token

Send the token in the header the API's specification names, commonly `Subscription-Key`:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "Subscription-Key: <YOUR_SUBSCRIPTION_TOKEN>"
```

For an MCP server that offers plans, the client configuration on its page already includes the `Subscription-Key` header; replace the placeholder with your token.

The subscription token is not a substitute for authentication. Most APIs also expect an API key or an OAuth2 access token, and you send both headers together. See [Consume an API](overview.md) for which credentials an API expects and how to tell.

## View and manage a subscription

Every subscription you hold is listed under **Subscriptions** in the sidebar, in a table showing each API or MCP server, its type, your plan, the subscription type, the date you subscribed, and the status. Click the **Manage subscription** button on a row to open the manage dialog. The same dialog opens from **View subscription** in the API's header.

From the dialog you can:

- **Reveal or copy the subscription token.** The token is masked until you click the eye icon.
- **Regenerate** the token. The old token stops working immediately, so update anything using it. You're asked to confirm first.
- **Suspend** the subscription. It goes inactive and the button becomes **Resume**. Use this to stop traffic without giving up the subscription or its token.
- **Unsubscribe**, after a confirmation.

## Switch to a different plan

To move to a different plan on an API you're already subscribed to:

1. Open the API's page.
2. Click **Switch plan** in the header.
3. In the dialog, your plan is marked **Current plan**. Select the plan to move to, and then click **Switch plan**.

Your subscription token stays the same, so nothing you've already configured breaks. What changes is the limits the new plan sets, from the next request.

!!! note
    A paid plan can only be changed by unsubscribing first.

## Cancel a subscription

1. Go to **Subscriptions** in the sidebar.
2. Click **Manage subscription** on the row you want to cancel.
3. Click **Unsubscribe**, then confirm.

Cancelling invalidates the subscription token. Anything calling the API with it stops working. You can subscribe again at any time, and you'll get a new token.

## APIs without plans

Not every API has subscription plans. When an API doesn't, its overview page shows no **Subscription plans** panel and no **Subscribe** button, and there's nothing to subscribe to—call it with whatever authentication its specification requires.

To try an API before wiring it into your code, use the **Try It** console on the [documentation page](../discover-apis/browse-apis.md#read-the-specification-and-try-it) rather than looking for a subscription.

## Subscription plans

Plans set how much of an API you can consume. The API publisher decides which plans an API offers, and the API's page shows each plan's name and description. A plan can limit:

| Limit | What counts |
|---|---|
| Requests | Each call to the API |
| Tool calls | Each MCP `tools/call` request, on MCP servers |
| Tokens | The LLM tokens in each response, on AI APIs |

Each limit is a count per time window, for example 1,000 requests per hour, and a plan can combine several. When you reach a limit, the gateway either rejects further calls with `429 Too Many Requests` until the window resets, or lets them through and counts them as overage, depending on the plan. For how admins define plans, see [Subscription Plans](../admin-settings/subscription-plans.md).

## Related

- [Consume an API](overview.md): which credentials an API expects, and how they combine
- [API Overview](../discover-apis/browse-apis.md#open-an-api): where the subscription plans panel lives
- [Manage API Keys](manage-api-keys.md): generate an API key for a subscribed API
- [Subscription Plans](../admin-settings/subscription-plans.md): admin guide for defining plans
- [Webhook Event Catalog](../references/webhook-event-catalog.md): the `subscription.*` events subscribing, switching, and unsubscribing publish
