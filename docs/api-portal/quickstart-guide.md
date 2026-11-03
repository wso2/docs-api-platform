---
title: "Quick Start Guide"
pagination_label: "API Portal Quick Start"
description: "Sign in to the API Portal and AI Hub, find an API, subscribe to it under a plan, and invoke the API."
---

In this guide, you sign in to the API Portal and AI Hub, find an API, subscribe to it under a plan, and invoke it.

## Prerequisites

- A portal in your organization. See [Manage Portals](../administer/managing-portals.md).
- The API is published to the portal with at least one subscription plan. See [Publish an API](../publish-api-proxy/publish-an-api.md) and [Subscription Plans](../publish-api-proxy/subscription-plans-and-billing.md).

## Step 1: Sign In to the Portal

1. Open the portal. To find its URL, see [Open the Portal](./overview.md#open-the-portal).

2. Click **Log In**, and sign in with your username and password. If you don't have an account in the portal, click **Sign up** to create one.

## Step 2: Find the API

1. In the portal, click **APIs** in the sidebar. Find the API in the list, or search for it.

2. Click the API to open it. The page shows the endpoints, resources, and subscription plans of the API.

3. Click **Documentation** to view the API definition.

For more, see [Browse APIs](./discover-apis/browse-apis.md) and [API Documentation](./discover-apis/documentation.md).

## Step 3: Subscribe to the API

1. On the page of the API, under **Subscription plans**, click **Subscribe** on the plan that you want.

2. Copy the subscription token, and click **Done**.

The plan is marked as subscribed. To view the subscription token again, regenerate it, suspend the subscription, or unsubscribe, click **View subscription** on the plan. For more, see [Manage Subscriptions](./consume-an-api/manage-subscriptions.md).

## Step 4: Invoke the API

1. On the page of the API, under **Endpoints**, copy the **Production** endpoint.

2. Send a request to the endpoint with the subscription token in the `Subscription-Key` header.

    ```bash
    curl -X GET "<endpoint>/<resource-path>" \
      -H "Subscription-Key: <subscription-token>"
    ```

:::note
This request works when the subscription token is the only credential the API requires. If the API has other policies attached, such as API key or OAuth2 authentication, send the credentials that those policies expect as well. See [Which Credentials You Need](./consume-an-api/overview.md).
:::

## Next Steps

- [Which Credentials You Need](./consume-an-api/overview.md) - Find out which other credentials an API can require, such as an API key or an OAuth2 access token
- [Consume an OAuth2-Secured API](./consume-an-api/oauth2.md) - Get an access token and invoke an OAuth2-secured API
- [Discover AI Agents](./ai-agent-discovery.md) - Let AI agents discover and call the API
