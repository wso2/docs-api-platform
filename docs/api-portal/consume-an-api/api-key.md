---
title: "Consume an API-Key-Secured API"
description: "Get an API key for an API, and invoke the API with the key from the API Portal and AI Hub."
---

An API key is bound to one API, and it authenticates your requests to that API only. No key manager is involved, and an application is optional. You can associate a key with an application for usage analytics, but this does not change how the key works.

## Prerequisites

- An API that is secured with API key authentication in the API Control Plane, and published to the portal. See [API Key Authentication](../../develop-api-proxy/security/api-key-authentication.md).
- An API key for the API. See [Get an API Key](#get-an-api-key).
- A subscription to the API, if the API has subscription plans. The subscription token is a separate credential from the API key, and you send both. See [Manage Subscriptions](./manage-subscriptions.md).

## Get an API Key

API keys are created in the API Platform Console. If you don't have access to the API in the console, request a key from the API publisher.

1. Sign in to the [API Platform Console](https://console.bijira.dev).

2. In the header, select the project from the **Projects** list and the API from the **APIs** list.

3. On the **Overview** page of the API, in the **API Keys** section, click **Add**.

4. Enter a **Key name** and select how long the key is valid in **Expires in**, and click **Create key**.

5. Copy the API key, and click **I have copied the key**.

    :::warning
    The key is shown only once. It is stored hashed and pushed to the deployed gateways, so you cannot view it again after you close the dialog.
    :::

For more, see [API Key Authentication](../../develop-api-proxy/security/api-key-authentication.md).

## Invoke the API

1. In the API Portal and AI Hub, open the API, and under **Endpoints**, copy the **Production** endpoint.

2. Send the API key in the header that the **API Key Auth** policy of the API expects.

    ```bash
    curl -X GET "https://api.example.com/orders/v1/orders" \
      -H "<api-key-header>: <YOUR_API_KEY>"
    ```

    Replace `<api-key-header>` with the header name, `<YOUR_API_KEY>` with the key that you copied, and the URL with the endpoint of the API.

:::info
The header name comes from the API, not from the portal. Use the header name that is configured in the **API Key Auth** policy of the API, or named in the `apiKey` security scheme of the API's specification.
:::

### When the API Also Requires a Subscription

Send the subscription token in the `Subscription-Key` header along with the API key.

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "<api-key-header>: <YOUR_API_KEY>" \
  -H "Subscription-Key: <YOUR_SUBSCRIPTION_TOKEN>"
```

The two credentials answer different questions. The API key identifies you as an authorized caller, and the subscription token tells the gateway which rate limit of a plan applies to you.

## Next Steps

- [Which Credentials You Need](./overview.md) - Find out which credentials an API expects, and how to tell
- [Manage API Keys](./manage-api-keys.md) - View your API keys, and associate them with an application
- [Manage Subscriptions](./manage-subscriptions.md) - Get a subscription token
- [Consume an OAuth2-Secured API](./oauth2.md) - Invoke an API secured with OAuth2
