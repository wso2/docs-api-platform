---
title: "Consume an API: which credentials you need"
description: "Work out which of the three credentials an API expects—a subscription token, an API key, or an OAuth2 access token—and how to get each one."
canonical_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/overview/
md_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/overview.md
tags:
  - cloud
  - api-portal
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "concept"
---

# Consume an API

Calling an API published in the API Portal & MCP Hub takes two things: the endpoint URL, and the right credentials in the right headers. This page covers the credentials—which ones exist, how to tell which an API expects, and where to get each.

Three distinct credentials are involved. The portal issues the subscription token and the API key; OAuth2 access tokens are issued by a key manager, which the portal only proxies requests to. They aren't alternatives to each other—an API can require one, two, or all three at once.

| Credential | What it proves | Where it comes from | Header |
|---|---|---|---|
| Subscription token | You're subscribed to this API under a plan, so the gateway knows which rate limit to apply | Subscribing to a plan on the API's overview page | The header named in the API's specification, commonly `Subscription-Key` |
| API key | You're an authorized caller of this specific API | The **API Keys** page for that API | `apikey`, or the header named in the specification |
| OAuth2 access token | Your application holds valid client credentials | Issued by a key manager; requested through your application's **Manage Keys** page | `Authorization: Bearer <token>` |

## Work out what an API expects

Read the API's own specification—it's authoritative, and the portal derives its UI from it.

1. Open the API and click **Documentation**, then **API Definition**.
2. Read `securitySchemes` for what the API *defines*: a scheme of type `oauth2` means an access token, and one of type `apiKey` names its exact header in the `name` field.
3. Read the `security` entries for what it *requires*. A root-level `security` block applies to every operation; an operation can override it with its own. A scheme that's defined but never referenced isn't required.
4. Check for a subscription-key parameter. When the specification declares one, the portal shows a subscription token after you subscribe, along with the header to send it in.

Two shortcuts on the API's [overview page](../discover-apis/browse-apis.md#open-an-api) tell you the same thing faster:

- An **API Keys** button appears for REST, WebSocket, and WebSub APIs whose specification declares API key security. The portal offers no key generation in the UI for GraphQL, SOAP, or MCP artifacts, even when their specification declares an `apiKey` scheme. For those, use the Management API: [API Keys](../rest-api/api-keys.md) for GraphQL and SOAP APIs, and [MCP Server Keys](../rest-api/mcp-server-keys.md) for MCP servers.
- A **Subscription plans** panel appears only for APIs with plans, which is what a subscription token comes from.

The per-API Markdown document at `/api-portal/{orgName}/views/{viewName}/api/{apiHandle}.md` spells out the authentication steps in prose, generated from the same specification. It states those steps directly, so you don't cross-reference the specification yourself.

## Get each credential

### Subscription token

[Subscribe to the API](manage-subscriptions.md) under a plan. The portal shows the token once, in a dialog, right after the subscription is created.

You can come back to it later: on the API's overview page, click **View subscription** on the plan you hold, then reveal or copy the token. The same dialog lets you regenerate the token—which invalidates the old one immediately—suspend the subscription, or unsubscribe.

### API key

Generate one from the **API Keys** page for that API, reachable from the **API Keys** button on the overview page or the sidebar submenu. See [Manage API Keys](manage-api-keys.md) for the generate, rotate, and revoke lifecycle, and [Consume an API Secured with an API Key](api-key.md) for using it in a request.

### OAuth2 access token

This one needs the most setup, because the OAuth application lives in a key manager rather than in the portal. In outline: create the OAuth application in your key manager, [create an application](manage-applications.md) in the portal, link the client ID to it, then generate a token. See [Consume an API Secured with OAuth2](oauth2.md) for the full sequence.

## Try before you wire it up

For REST APIs, the **Try It** console on the [documentation page](../discover-apis/browse-apis.md#read-the-specification-and-try-it) sends real requests from your browser. Paste the same credentials you'd use from code—it's the fastest way to confirm you have the right header names before writing a client.

## Related

- [Consume an API Secured with OAuth2](oauth2.md)
- [Consume an API Secured with an API Key](api-key.md)
- [Manage Subscriptions](manage-subscriptions.md): where the subscription token comes from
- [Manage API Keys](manage-api-keys.md): generate, rotate, and revoke keys
- [Manage Applications](manage-applications.md): the container for OAuth2 client IDs