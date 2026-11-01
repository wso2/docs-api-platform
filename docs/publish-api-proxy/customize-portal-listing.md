---
title: "Customize the Portal Listing"
description: "Set the details, specification, subscription plans, documentation, and landing page that consumers see when you publish an API to a portal."
---

When you publish an API to a portal, you prepare a listing for it, the information that consumers see in that portal. You prepare the listing in the tabs of the API's publish page for that portal. Each portal has its own listing, so you can present the same API differently in different portals.

To open the page, in the left navigation menu, click **Publish**, and then click **Go to Publish** on the portal. See [Publish an API](./publish-an-api.md).

![Publish page of an API showing the API Details, Specification, Subscription Plans, Documentation, and Landing Page tabs](/img/cloud/publish-api-proxy/publish-api-details.png)

| Tab | Use it to |
|:----|:----------|
| **API Details** | Set the name, version, description, and endpoints of the API in the portal. |
| **Specification** | Review and edit the API specification that consumers see and use to try out the API. |
| **Subscription Plans** | Choose the plans that consumers can subscribe with. See [Subscription Plans](./subscription-plans-and-billing.md). |
| **Documentation** | Choose the documents that consumers see along with the API. |
| **Landing Page** | Design the page that consumers see when they open the API in the portal. |

After you update the tabs, click **Save Draft** to keep your changes, or click **Publish** to make them visible to consumers.

## API Details

The **API Details** tab holds the basic information about the API in the portal.

- **Name** (required): The name of the API, for example, `New API`.
- **Version** (required): The version of the API, for example, `1.0.0`.
- **Description**: A description of what the API does. Consumers, and AI agents that discover APIs through the portal, use the description to decide whether the API fits their needs. See [Make an API AI-Ready](./make-an-api-ai-ready.md).
- **Production URL**: The URL that consumers use to invoke the API in production. Select a URL from the list, or click the edit icon to enter one.
- **Sandbox URL**: The URL that consumers use to invoke the API in a sandbox, for testing. Click the edit icon to enter one.
- **Make this API discoverable by AI agents**: Lets AI agents in the portal discover the API and invoke it on behalf of users. See [Control Agent Visibility](./make-an-api-ai-ready.md#control-agent-visibility).

## Specification

The **Specification** tab shows the API definition, such as the OpenAPI specification of a REST API, that the portal displays to consumers. Consumers use it to understand the operations of the API and to try them out.

You can review and edit the specification in this tab, for example, to improve the summaries and descriptions of operations, or to add examples, so that consumers and AI agents understand the API better.

## Documentation

The **Documentation** tab lists the documents that consumers see along with the API in the portal, such as getting started guides and usage instructions.

You create and edit the documents in **Develop** › **Documents**. See [Documents](../develop-api-proxy/documents.md).

## Landing Page

The **Landing Page** tab sets the page that consumers see when they open the API in the portal. Use it to introduce the API, highlight its key capabilities, and guide consumers to get started.
