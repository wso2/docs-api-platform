---
title: "Consume an API secured with an API key"
description: "Send a generated API key in the header an API's specification declares, and combine it with a subscription token when the API requires one."
canonical_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/api-key/
md_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/api-key.md
tags:
  - cloud
  - api-portal
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Consume an API secured with an API key

An API key is bound to one API or Model Context Protocol (MCP) server. You generate it from that artifact's own **API Keys** page, and it authenticates your requests to that artifact only. No key manager is involved, and an application is optional—you can associate a key with one for usage analytics, which changes nothing about how the key works.

## Prerequisites

- The API declares API key security. Look for a `securitySchemes` entry of type `apiKey` in the API's specification.
- You have a key. See [Manage API Keys](manage-api-keys.md) for the generate, rotate, and revoke lifecycle.

    !!! note
        The portal generates keys for REST, WebSocket, and WebSub APIs whose specification declares API key security. GraphQL, SOAP, and MCP artifacts get no **API Keys** button even when their specification declares an `apiKey` scheme—for those, obtain the key from whoever operates the API and send it the same way.

- If the API has subscription plans, [subscribe to one](manage-subscriptions.md). The subscription is a separate credential from the key, and you send both.

## Invoke the API

Send the key in the header the API's specification names. The portal's API Keys page describes a key as usable "as a bearer token or `apikey` header", and `apikey` is the default the portal assumes:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "apikey: <YOUR_API_KEY>"
```

Replace `<YOUR_API_KEY>` with the key you copied when generating it, and the URL with the API's production or sandbox endpoint from its overview page.

!!! important
    The header name comes from the API, not from the portal. Read the `name` field of the `apiKey` scheme in the API's specification and use exactly that. Some APIs expect `apikey`, some `api-key`, some a name of their own.

### When the API also requires a subscription

Send the subscription token alongside the key:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "apikey: <YOUR_API_KEY>" \
  -H "Subscription-Key: <YOUR_SUBSCRIPTION_TOKEN>"
```

The two answer different questions: the key says who you are, and the subscription token says which plan's rate limit applies to you. The subscription header name also comes from the specification—`Subscription-Key` is the common case.

## Check it before writing code

Open the API's [documentation page](../discover-apis/browse-apis.md#read-the-specification-and-try-it) and use the **Try It** console on a REST API, or **Tryout** on a GraphQL API, which has a dedicated **API Key** tab with fields for the header name and value. A call that succeeds there confirms both the header names and the key itself.

## Related

- [Consume an API](overview.md): which credentials an API expects, and how to tell
- [Manage API Keys](manage-api-keys.md): generate, rotate, revoke, and associate keys with an application
- [Manage Subscriptions](manage-subscriptions.md): get a subscription token
- [Consume an API Secured with OAuth2](oauth2.md): the alternative for OAuth2-secured APIs