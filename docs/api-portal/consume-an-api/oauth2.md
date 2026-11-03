---
title: "Consume an OAuth2-Secured API"
description: "Get an OAuth2 key on a key manager in the API Portal and AI Hub, get an access token, and invoke an OAuth2-secured API."
---

OAuth2-secured APIs expect a bearer token issued by a key manager. You get the token with an **OAuth2 key**, the portal's record of an OAuth2 client on a key manager, which holds its client ID and the details needed to request tokens with it.

OAuth2 keys are listed under **Keys** › **OAuth2 Keys**. An OAuth2 key belongs to the user who creates it, not to an application. Associating a key with an application is a separate, optional step.

:::warning[The portal does not store the client secret]
The key manager displays the client secret only once, when the key is created, so copy it and store it securely. You supply the client secret each time you request an access token. It is used for that one request and is not stored. If the client secret is lost, delete the key and create a new one.
:::

## Prerequisites

- An API that is secured with OAuth2 authentication in the API Control Plane, and published to the portal. See [OAuth2 Authentication](../../develop-api-proxy/security/oauth2-authentication.md).
- A key manager that your organization has connected. Your administrator sets up key managers. See [Manage Key Managers](../admin-settings/key-manager-integration.md). The configuration of the key manager determines which of the two ways to get a key are available to you.
- A subscription to the API, if the API has subscription plans. Subscriptions are made to the API, independently of any application. See [Manage Subscriptions](./manage-subscriptions.md).

:::info
An application is not a prerequisite. You can create a key and invoke an API without one.
:::

## Two Ways to Get a Key

| Option | What Happens | Available When |
|:-------|:-------------|:---------------|
| **Generate key** | The portal registers a new OAuth2 client on the key manager, and returns its client ID and secret. | The key manager is configured to let the portal create applications. |
| **Add existing key** | You create the OAuth2 application in the console of the key manager, and add its client ID to the portal. | The key manager is configured for imported client IDs. |

The buttons on the **OAuth2 Keys** page reflect what your administrator configured. If only one option is available, only that button appears.

### Generate a Key

1. Sign in to the API Portal and AI Hub, and go to **Keys** › **OAuth2 Keys**.

2. Click **Generate key**.

3. In the **Generate OAuth2 key** dialog, enter the following details.

    | Field | Description |
    |:------|:------------|
    | **Key manager** | Required. The key manager that registers the application. |
    | **Application name** | Required. The name of the application, which end users see on the consent screen. |
    | **Callback URLs** | Where the key manager sends the user after login. Enter absolute URIs, without a fragment. Required only for the authorization code grant. |
    | **Grant types** | Required. The OAuth2 grants that the application can use: **Authorization code**, **Refresh token**, or **Client credentials**. |
    | **Response types** | The response types of the authorization endpoint: **code**, **token**, or **id_token**. They must match the selected grant types. |
    | **Client authentication method** | How the application authenticates at the token endpoint. |

4. Click **Generate key**.

5. Copy the client secret from the confirmation dialog. It is shown only once, and cannot be retrieved afterward.

### Add an Existing Key

1. Go to **Keys** › **OAuth2 Keys**, and click **Add existing key**.

2. Select the **Key manager**, enter a **Name** for the key, and enter the **Client ID** of the OAuth2 application that you created in the key manager.

3. Click **Add key**.

The portal does not register anything on the key manager for an existing key. It only records the client ID, so that it can request tokens with it. Keep the client secret from where you created the application.

## Get an Access Token

1. On the **OAuth2 Keys** page, find your key, and in its **Actions** menu, click **Get an access token**.

2. Enter the **Client secret**.

3. Add **Scopes** and **Resource indicators**, if the API needs them.

4. Click **Get token**, and copy the token from the dialog.

The token is shown only once and is not stored, in the same way as the client secret.

### Get a Token with curl

You can also request a token directly from the key manager. Use this option in scripts, such as in continuous integration (CI), because it does not involve the portal.

```bash
curl -X POST "https://keymanager.example.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -u "<CLIENT_ID>:<CLIENT_SECRET>"
```

The response contains the access token.

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

To request scopes, add `-d "scope=<SCOPES>"`. If the key manager requires a resource indicator, add `-d "resource=<RESOURCE>"`.

## Invoke the API

Send the access token as a bearer token.

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

If the API has subscription plans, also send your subscription token, so that the gateway applies the rate limit of your plan.

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Subscription-Key: <YOUR_SUBSCRIPTION_TOKEN>"
```

:::note
Both header names come from the API's specification. Check its `securitySchemes` section for the authorization scheme, and its subscription key parameter for the second header, instead of assuming the names above.
:::

## Production and Sandbox Keys

Each key is either a production key or a sandbox key, based on the key manager that it is created on. The list shows a **Sandbox** badge on sandbox keys. Sandbox tokens are for testing, and do not work with production endpoints. To hold both, create one key on a production key manager and another on a sandbox key manager.

## Associate a Key with an Application

Associating a key with an application organizes your credentials. It is not required to invoke an API.

- **From the key:** In the **Actions** menu of the key, click **Associate with an application**, and select the application.
- **From the application:** Open the application, and in the **OAuth2 keys** section, click **Associate existing OAuth2 key**.

A key belongs to at most one application. Associating it again moves it to the other application. Removing the association leaves the key usable and unassociated. Deleting the application has the same effect.

## Edit or Delete a Key

- **Edit:** In the **Actions** menu of the key, change the details that the key manager holds, such as the name or callback URLs, and click **Save changes**. For a key that the portal registered, the portal also sends the change to the key manager.
- **Delete:** In the **Actions** menu of the key, click **Delete key**, and confirm. For a key that the portal registered, this also deletes the OAuth2 application on the key manager. For an existing key that you added, only the record in the portal is deleted, and the application stays in the key manager.

:::note
Deleting a key does not invalidate the tokens that were issued with it. They stay valid until they expire. To revoke a live token, use the revocation endpoint of the key manager.
:::

## Next Steps

- [Which Credentials You Need](./overview.md) - Find out which credentials an API expects, and how to tell
- [Manage Applications](./manage-applications.md) - Group your keys and subscriptions
- [Manage Subscriptions](./manage-subscriptions.md) - Subscribe before you invoke an API with subscription plans
- [Consume an API-Key-Secured API](./api-key.md) - Invoke an API secured with an API key
- [Manage Key Managers](../admin-settings/key-manager-integration.md) - Set up key managers as an administrator
