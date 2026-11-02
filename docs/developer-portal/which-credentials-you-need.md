---
title: "Which Credentials You Need"
description: "Learn which credentials an API in the API Portal and AI Hub expects, how to tell from its specification, and where to get each one."
---

To call an API that is published in the API Portal and AI Hub, you need the endpoint URL of the API and the right credentials in the right headers. An API can require one, two, or all three of the following credentials. They are not alternatives to each other.

| Credential | What It Proves | Where It Comes From | Header |
|:-----------|:---------------|:--------------------|:-------|
| **Subscription token** | You are subscribed to the API under a plan, so the gateway knows which rate limit to apply. | Subscribing to a plan of the API. | The header named in the API's specification, commonly `Subscription-Key`. |
| **API key** | You are an authorized caller of the API. | The **API Keys** page of the API. | `apikey`, or the header named in the API's specification. |
| **OAuth2 access token** | You hold valid client credentials on a key manager. | A key manager, through an OAuth2 key under **Keys** › **OAuth2 Keys**. | `Authorization: Bearer <token>` |

## Find Out What an API Expects

The API's specification defines which credentials the API requires.

1. Open the API, and click **Documentation**, then **API Definition**.

2. In `securitySchemes`, check what the API defines. A scheme of type `oauth2` means an access token. A scheme of type `apiKey` names its header in the `name` field.

3. In the `security` entries, check what the API requires. A root-level `security` block applies to every operation, and an operation can override it with its own. A scheme that is defined but not referenced in `security` is not required.

4. Check whether the specification declares a subscription key parameter. If it does, the portal shows a subscription token after you subscribe, along with the header to send it in.

The overview page of the API also shows this:

- An **API Keys** button appears for REST, WebSocket, and WebSub APIs whose specification declares API key security.
- A **Subscription plans** panel appears only for APIs that have subscription plans.

## Get Each Credential

| Credential | How to Get It |
|:-----------|:--------------|
| **Subscription token** | Subscribe to the API under a plan. See [Manage Subscriptions](./manage-subscriptions.md). |
| **API key** | Generate a key on the **API Keys** page of the API. See [Manage API Keys](./manage-api-keys.md) and [Call an API-Key-Secured API](./call-api-key-secured-api.md). |
| **OAuth2 access token** | Create or add an OAuth2 key, and get a token with it. See [Call an OAuth2-Secured API](./call-oauth2-secured-api.md). |

## Next Steps

- [Call an OAuth2-Secured API](./call-oauth2-secured-api.md) - Get an access token and invoke an OAuth2-secured API
- [Call an API-Key-Secured API](./call-api-key-secured-api.md) - Invoke an API with an API key
