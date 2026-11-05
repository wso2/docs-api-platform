---
title: "API Portal and AI Hub"
pagination_label: "API Portal and AI Hub"
description: "Discover, subscribe to, and consume the APIs, MCP servers, and API workflows published from API Management Cloud."
slug: /api-portal
---

The API Portal and AI Hub is where consumers find and use the APIs, MCP servers, and API workflows that your organization publishes from the [API Control Plane](../api-control-plane/overview.md). It is built for both application developers and AI agents. Developers browse the catalog, read the documentation and get the credentials to invoke it. AI agents discover the same APIs through machine-readable endpoints.

## Open the Portal

If you are an API consumer, get the portal URL from the API publisher of your organization.

If you have access to the API Management Console, you can open a portal from it in either of the following ways.

- In the left navigation menu, click **Portals**, and then click **Open Portal** on the portal. See [Manage Portals](../api-control-plane/administer/managing-portals.md).
- On the **Publish** page of an API, click **View in Portal** on the portal that the API is published to. See [Publish an API](../api-control-plane/publish-api-proxy/publish-an-api.md).

API publishers can share the portal URL with consumers so that they can open it directly.

## Sign In or Sign Up

To sign in, click **Log In** in the portal, and enter your username and password.

Anyone can create an account in a portal by clicking **Sign up** on the sign-in page. An administrator can also add users to the portal.

## What You Can Do

| Area | Description |
|:-----|:------------|
| **APIs** | [Browse and search the APIs](./discover/browse-apis.md) in the portal, and [read their documentation](./discover/documentation.md). |
| **MCP Servers** | [Explore the MCP servers](./discover/browse-mcp-servers.md) that you can connect your AI agents to. |
| **API Workflows** | Find [pre-configured workflows](./discover/api-workflows.md) that AI agents follow to use your APIs correctly. |
| **AI agents** | Let [AI agents discover the portal](./discover/ai-agent-discovery.md), or a single API, with a ready-made prompt that you can run in an AI agent such as Claude. APIs that agents can discover are marked **AI Ready**. |
| **Keys** | Generate and manage the [OAuth2 keys](./manage-keys/oauth2-keys.md) and [API keys](./manage-keys/api-keys.md) that you use to call APIs. |
| **Applications** | Optionally [group your keys into applications](./manage-usage/manage-applications.md) to track their usage and analytics. |
| **Subscriptions** | [Subscribe to APIs](./manage-usage/manage-subscriptions.md) that have a subscription rate limiting policy, and view your subscriptions. |

## Consume an API

To use an API from the API Portal and AI Hub, follow these steps.

1. Find the API in the catalog, and review its documentation.

2. Get the credentials that the API expects, such as an OAuth2 access token or an API key. See [Which Credentials You Need](./consume-an-api/overview.md).

3. Invoke the API.

## Get Started

To create a portal, publish an API to it, and find the API in the portal, follow the [Quick Start Guide](./quickstart-guide.md). To create and manage the portals of your organization, see [Manage Portals](../api-control-plane/administer/managing-portals.md).
