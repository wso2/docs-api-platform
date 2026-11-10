---
title: "Publish an API"
description: "Publish an API proxy to one or more portals so that consumers can discover, subscribe to, and use it."
---

When your API proxy is ready for consumers, publish it to a portal. Consumers can then discover the API in the portal, read its documentation, subscribe to it, and invoke it.

You publish an API to each portal separately, so you can publish the same API to more than one portal and prepare a different listing for each.

## Prerequisites

- An API proxy that is deployed to a gateway. See [Manage Gateways](../administer/managing-gateways.md).
- At least one portal in your organization. See [Manage Portals](../administer/managing-portals.md).

## Publish an API to a Portal

1. Sign in to the [API Control Plane](https://console.bijira.dev/).

2. In the header, select the project from the **Projects** list and the API from the **APIs** list.

3. In the left navigation menu, click **Publish**.

    The page lists the portals in your organization, along with the publishing status of the API in each portal, for example, **Not published**. The top of the page shows the number of portals that the API is published to.

    ![Publish page listing a portal with the publishing status of the API, the Publish button with its options menu, and the View in Portal option](/img/cloud/publish-api-proxy/publish-portals.png)

    To find a portal, type its name in **Search portals**.

4. On the portal that you want to publish the API to, click **Publish**.

The API is published to the portal with its current details, and its status changes to **Published**. To see the API as consumers see it, click **View in Portal** on the portal. This option is available only after the API is published.

To review how the API appears in the portal before you publish it, see [Configure and Publish an API](#configure-and-publish-an-api).

## Configure and Publish an API

1. On the **Publish** page, on the portal that you want to publish the API to, click the arrow next to **Publish**, and select **Configure & Publish**.

    The publish page of the API opens. Its title shows the API name and the portal you are publishing to, for example, **Publish Reading List API**, followed by the name of the portal. Use the tabs on the page to prepare how the API appears in the portal. See [Customize the Portal Listing](./customize-portal-listing.md).

    ![Publish page of an API showing the API Details, Specification, Subscription Plans, Documentation, and Landing Page tabs, the Draft and Published views, and the Save Draft and Publish buttons](/img/cloud/publish-api-proxy/publish-api-details.png)

2. Review the details in each tab, and update them as needed.

3. Click **Publish**.

The API is published to the portal, and the page switches to the **Published** view, which shows the listing that consumers see. To remove the API from the portal, click **Unpublish**. See [Deprecate or Unpublish an API](./deprecate-or-unpublish.md).

## Save Your Changes as a Draft

You don't have to publish your changes right away. To keep working on the listing later, click **Save Draft**. Your changes are saved, but consumers don't see them until you click **Publish**.

The page shows when the listing was last edited, for example, **Edited 7 minutes ago**. To switch between the listing you are editing and the listing that consumers currently see in the portal, use the **Draft** and **Published** views at the top of the page.

## Update a Published API

To change a published API, edit the listing in the **Draft** view, and click **Republish**. Consumers see the changes only after you republish them. The **Published** view shows the listing that consumers currently see, and you cannot edit it. To make changes, switch to the **Draft** view.

## Next Steps

- [Customize the Portal Listing](./customize-portal-listing.md) - Set the details, specification, documentation, and landing page that consumers see
- [Subscription Plans](./subscription-plans-and-billing.md) - Choose the plans that consumers can subscribe with
- [Deprecate or Unpublish an API](./deprecate-or-unpublish.md) - Retire a published API
