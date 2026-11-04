---
title: "Customize the Portal Listing"
description: "Set the details, specification, subscription plans, documentation, and landing page that consumers see when you publish an API to a portal."
---

When you publish an API to a portal, you prepare a listing for it, the information that consumers see in that portal. You prepare the listing in the tabs of the API's publish page for that portal. Each portal has its own listing, so you can present the same API differently in different portals.

To open the page, in the left navigation menu, click **Publish**, and then click **Go to Publish** on the portal. See [Publish an API](./publish-an-api.md).

| Tab | Use it to |
|:----|:----------|
| **API Details** | Set the name, version, description, and endpoints of the API in the portal. |
| **Specification** | Review and edit the API specification that consumers see and use to try out the API. |
| **Subscription Plans** | Choose the plans that consumers can subscribe with. |
| **Documentation** | Choose the documents that consumers see along with the API. |
| **Landing Page** | Replace the default page of the API in the portal with your own content. |

After you update the tabs, click **Save Draft** to keep your changes, or click **Publish** to make them visible to consumers.

## API Details

The **API Details** tab holds the basic information about the API in the portal.

- **Name** (required): The name of the API, for example, `Reading List API`.
- **Version** (required): The version of the API, for example, `1.0.0`.
- **Description**: A description of what the API does. Consumers, and AI agents that discover APIs through the portal, use the description to decide whether the API fits their needs. See [Make an API AI-Ready](./make-an-api-ai-ready.md).
- **Production URL**: The URL that consumers use to invoke the API in production. Select a URL from the list, or click the edit icon to enter one.
- **Sandbox URL**: The URL that consumers use to invoke the API in a sandbox, for testing. Click the edit icon to enter one.
- **Make this API discoverable by AI agents**: Lets AI agents in the portal discover the API and invoke it on behalf of users. See [Control Agent Visibility](./make-an-api-ai-ready.md#control-agent-visibility).

## Specification

The **Specification** tab shows the API definition, such as the OpenAPI specification of a REST API, that the portal displays to consumers. Consumers use it to understand the operations of the API and to try them out.

You can edit the specification in YAML or JSON, for example, to improve the summaries and descriptions of operations, or to add examples, so that consumers and AI agents understand the API better.

## Subscription Plans

In the **Subscription Plans** tab, select the plans of your organization that consumers can subscribe to the API with in this portal.

To create the plans, see [Manage Subscription Plans](../administer/creating-subscription-plans.md). For more on plans, see [Subscription Plans](./subscription-plans-and-billing.md).

## Documentation

In the **Documentation** tab, select the documents that consumers see along with the API in this portal.

You create and edit the documents in **Develop** › **Documents**. See [Documents](../develop-api-proxy/documents.md).

## Landing Page

The **Landing Page** tab sets the page that consumers see when they open the API in the portal. If you don't add a landing page, the portal shows its default page with the endpoints and resources of the API.

To add a landing page, click **Create from API details**. This creates a landing page from the description, endpoints, and resources of the API, which you can then edit in Markdown.

:::note
The landing page is copied from the API details when you create it, and it does not change when the API details change. If you update the API details, update the landing page as well. When you publish, the landing page replaces the default section of the portal.
:::
