---
title: "API Portal and AI Hub"
pagination_label: "API Portal and AI Hub"
description: "Discover, subscribe to, and consume the APIs, MCP servers, and API workflows published from API Platform Cloud."
slug: /api-portal
---

The API Portal and AI Hub is where consumers find and use the APIs, MCP servers, and API workflows that your organization publishes from the [API Control Plane](../api-control-plane/overview.md). It is built for both application developers and AI agents. Developers browse the catalog, read the documentation, subscribe to what they need, and get the credentials to invoke it. AI agents discover the same APIs through machine-readable endpoints.

## Open the Portal

You can open a portal from the API Platform Console in either of the following ways.

- In the left navigation menu, click **Portals**, and then click **Open Portal** on the portal. See [Manage Portals](../administer/managing-portals.md).
- On the **Publish** page of an API, click **View in Portal** on the portal that the API is published to. See [Publish an API](../publish-api-proxy/publish-an-api.md).

Share the portal URL with your consumers so that they can open it directly.

## Sign In or Sign Up

To sign in, click **Log In** in the portal, and enter your username and password.

Anyone can create an account in a portal by clicking **Sign up** on the sign-in page. An administrator can also add users to the portal.

## What You Can Do

| Area | Description |
|:-----|:------------|
| **APIs** | [Browse and search the APIs](./discover-apis/browse-apis.md) in the portal, and [read their documentation](./discover-apis/documentation.md). |
| **MCP Servers** | [Explore the MCP servers](./mcp-servers/browse-mcp-servers.md) that you can connect your AI agents to. |
| **API Workflows** | Find pre-configured workflows that AI agents follow to use your APIs correctly. |
| **AI agents** | Let [AI agents discover the portal](./ai-agent-discovery.md), or a single API, with a ready-made prompt that you can run in an AI agent such as Claude. APIs that agents can discover are marked **AI Ready**. |
| **Applications** | [Create applications](./consume-an-api/manage-applications.md) that hold the API keys and subscriptions you use to call APIs. |
| **Subscriptions** | [Subscribe your applications](./consume-an-api/manage-subscriptions.md) to APIs and MCP servers, and view your subscriptions. |
| **Keys** | Generate and manage the [API keys](./consume-an-api/manage-api-keys.md) and [OAuth2 keys](./consume-an-api/oauth2.md) that you use to call APIs. |

## Consume an API

To use an API from the API Portal and AI Hub, follow these steps.

1. Find the API in the catalog, and review its documentation.

2. Create an application.

3. Subscribe the application to the API.

4. Get the credentials that the API expects, and invoke the API. See [Which Credentials You Need](./consume-an-api/overview.md).

## Get Started

To create a portal, publish an API to it, and find the API in the portal, follow the [Quick Start Guide](./quickstart-guide.md). To create and manage the portals of your organization, see [Manage Portals](../administer/managing-portals.md).
