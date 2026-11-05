---
title: "Which Credentials You Need"
description: "Learn which credentials an API in the API Portal and AI Hub expects, how to tell from its specification, and where to get each one."
---

To call an API that is published in the API Portal and AI Hub, you need the endpoint URL of the API and the right credentials in the right headers. An API requires an OAuth2 access token, an API key, or both. A subscription token is needed only when the API has a subscription rate limiting policy. When an API requires more than one credential, send all of them.

| Credential | What It Proves | Where It Comes From | Header |
|:-----------|:---------------|:--------------------|:-------|
| **Subscription token** | You are subscribed to the API under a plan, so the gateway knows which rate limit to apply. Needed only when the API has a subscription rate limiting policy. | Subscribing to a plan of the API in the portal. | `Subscription-Key` |
| **API key** | You are an authorized caller of the API. | The **API Keys** section on the **Overview** page of the API in the API Control Plane. | The header configured in the **API Key Auth** policy of the API. |
| **OAuth2 access token** | You hold valid client credentials on a key manager. | A key manager, through an OAuth2 key under **Keys** › **OAuth2 Keys**. | `Authorization: Bearer <token>` |

## Find Out What an API Expects

The API's specification defines which credentials the API requires.

1. Open the API, and click **Documentation**, then **API Definition**.

2. In `securitySchemes`, check what the API defines. A scheme of type `oauth2` means an access token. A scheme of type `apiKey` names its header in the `name` field.

3. In the `security` entries, check what the API requires. A root-level `security` block applies to every operation, and an operation can override it with its own. A scheme that is defined but not referenced in `security` is not required.

4. Check whether the API has subscription plans. If it does, you need a subscription token to call it.

The page of the API also shows a **Subscription plans** panel when the API has subscription plans.

## Get Each Credential

| Credential | How to Get It |
|:-----------|:--------------|
| **Subscription token** | On the page of the API, under **Subscription plans**, click **Subscribe** on a plan, and copy the token. To view the token later, click **View subscription** on the plan. See [Manage Subscriptions](../manage-usage/manage-subscriptions.md). |
| **API key** | Get a key from the API publisher, who creates keys in the **API Keys** section on the **Overview** page of the API in the API Control Plane. See [API Keys](../manage-keys/api-keys.md) and [API Key Authentication](../../api-control-plane/develop-api-proxy/security/api-key-authentication.md). |
| **OAuth2 access token** | Generate an OAuth2 key under **Keys** › **OAuth2 Keys**, and get a token with it. ThunderID is the default key manager. See [Consume an OAuth2-Secured API](./oauth2.md). |

## Next Steps

- [Consume an OAuth2-Secured API](./oauth2.md) - Get an access token and invoke an OAuth2-secured API
- [Consume an API-Key-Secured API](./api-key.md) - Invoke an API with an API key
