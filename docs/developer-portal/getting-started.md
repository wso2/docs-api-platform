---
title: "Quick Start Guide"
description: "Create a Developer Portal from the API Control Plane, publish an API to it, and find the API in the portal."
---

In this guide, you create a Developer Portal for your organization, publish an API to it, and then find the API in the portal the way consumers do.

## Prerequisites

- Access to the [API Platform Console](https://console.bijira.dev/).
- An API proxy that is deployed to a gateway. To create and deploy one, follow the [API Control Plane Quick Start Guide](../getting-started/api-proxy.md).

## Step 1: Create a Portal

You create portals from the API Control Plane.

1. Sign in to the [API Platform Console](https://console.bijira.dev/).
2. In the left navigation menu, click **Portals**.
3. Click **Add Portal**, enter a **Name** for the portal, select an **Environment**, and click **Add Portal**.

While the portal is being created, its card shows **Creating portal**. When the portal is ready, **Open Portal** is available on the card.

For more on creating, editing, and deleting portals, see [Manage Portals](../portals.md).

## Step 2: Publish an API to the Portal

1. In the header, select the project from the **Projects** list and the API from the **APIs** list.
2. In the left navigation menu, click **Publish**.
3. On the portal that you created, click **Go to Publish**.
4. Review the details of the API, and click **Publish**.

The status of the API in the portal changes to **Published**.

For details on each step, and on preparing how the API appears in the portal, see [Publish an API](../publish-api-proxy/publish-an-api.md) and [Customize the Portal Listing](../publish-api-proxy/customize-portal-listing.md).

## Step 3: Discover the API in the Portal

1. On the **Publish** page, click **View in Portal** on the portal. The portal opens in a new browser tab.

    You can also open the portal from the **Portals** page by clicking **Open Portal** on the portal card.

2. In the portal, click **APIs** in the sidebar. The API you published appears in the list.
3. Select the API to view its overview and documentation.

To find APIs by name, type, version, or description, see [Search APIs](./discover-apis/searching.md). To learn what the documentation of an API shows, see [API Documentation](./discover-apis/documentation.md).

## Next Steps

- [Manage Applications](./manage-applications.md) - Create an application to hold your credentials
- [Manage Subscriptions](./manage-subscriptions.md) - Subscribe an application to a published API under a plan
- [Consume an API](./consume-an-api.md) - Invoke an API secured with OAuth2 or an API key
- [Customize the Portal Theme](./theming-developer-portal.md) - Customize the portal's look and feel
