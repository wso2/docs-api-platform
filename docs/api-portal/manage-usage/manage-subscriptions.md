---
title: "Manage Subscriptions"
description: "Subscribe to an API under a subscription plan in the API Portal and AI Hub, and view, regenerate, suspend, or cancel the subscription."
---

:::info
Subscribe to an API only when it has subscription plans. Otherwise, you can invoke the API without subscribing.
:::

A subscription gives you access to an API under a subscription plan. When you subscribe, the portal issues a subscription token, which you send with every call to the API in the `Subscription-Key` header.

## Subscription Plans

The API publisher's organization defines subscription plans, and enables them on each API. The plans of an API are listed under **Subscription plans** on the page of the API.

- **Limits:** A plan sets usage limits for your calls, such as 50 requests per minute. A plan without limits allows unlimited requests.

- **Requests over the limit:** Depending on the plan, requests that exceed the limit are rejected, or allowed.

- **Expiry:** A plan can have an expiry date, after which it no longer accepts subscriptions.

## Subscribe to an API

1. Sign in to the API Portal and AI Hub.

2. In the sidebar, click **APIs**, and open the API.

3. Under **Subscription plans**, click **Subscribe** on the plan that you want.

4. Copy the subscription token, and click **Done**.

The plan is marked as subscribed.

## Use the Subscription Token

Send the subscription token in the `Subscription-Key` header when you invoke the API.

```bash
curl -X GET "<endpoint>/<resource-path>" \
  -H "Subscription-Key: <subscription-token>"
```

If the API also requires other credentials, such as an API key or an OAuth2 access token, send them as well. See [Which Credentials You Need](../consume-an-api/overview.md).

:::tip
When a new minor version of an API is published, the major version-based invocation URL automatically routes to the latest minor version within the subscribed API's major version. Existing client applications continue to work without disruption.
:::

## View and Manage a Subscription

The **Subscriptions** page in the sidebar lists the APIs and MCP servers that you are subscribed to.

To manage a subscription, open the API, and click **View subscription** on the plan that you are subscribed to. The dialog shows the status of the subscription and the subscription token. From the dialog, you can do the following.

- **Regenerate** the subscription token. The old token stops working, so update the applications that use it.
- **Suspend** the subscription to stop calls to the API without cancelling the subscription.
- **Unsubscribe** from the API. The subscription token stops working. You can subscribe again at any time to get a new token.

## Next Steps

- [Which Credentials You Need](../consume-an-api/overview.md) - Find out which other credentials an API requires, and how to get them
