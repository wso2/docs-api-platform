---
title: "Call an OAuth2-Secured API"
---

An API secured with OAuth2 expects a bearer token issued by a key manager. You get the token with an **OAuth2 key**, which is the portal's record of an OAuth2 client on a key manager.

OAuth2 keys are listed under **Keys** › **OAuth2 Keys**, and they belong to you, not to an application. You can associate a key with an application, but you do not have to.

:::warning
The portal never stores your consumer secret. The key manager returns it once, when you create the key, so copy it then. You enter it each time you get a token. If you lose it, delete the key and create a new one.
:::

## Prerequisites

- A key manager that your organization has registered. For more information, see [Manage Key Managers](./manage-key-managers.md).
- A subscription to the API, if the API has subscription plans. For more information, see [Manage Subscriptions](./manage-subscriptions.md).

## Get an OAuth2 Key

Depending on how the key manager is registered, you can get a key in one of the following ways. The **OAuth2 Keys** page shows only the options that are available to you.

| Option | What Happens |
|:-------|:-------------|
| **Generate key** | The portal registers a new OAuth2 client on the key manager, and returns its consumer key and secret. |
| **Add existing key** | You create the OAuth2 application in the console of the key manager, and add its consumer key to the portal. |

To generate a key, follow these steps:

1. Sign in to the [API Portal and AI Hub](https://devportal.bijira.dev), and go to **Keys** › **OAuth2 Keys**.

2. Click **Generate key**.

3. Select the **Key manager**, enter a **Name** for the key, and fill in the details that the key manager asks for, such as the grant types, and the callback URLs if you select the authorization code grant.

4. Click **Add key**.

5. Copy the consumer secret from the dialog. It is shown only once.

To add an existing key, follow these steps:

1. Sign in to the [API Portal and AI Hub](https://devportal.bijira.dev), and go to **Keys** › **OAuth2 Keys**.

2. Click **Add existing key**.

3. Select the **Key manager**, enter a **Name** for the key, and enter the **Consumer key** of the OAuth2 application that you created in the key manager.

4. Click **Add key**.

The portal does not register anything on the key manager for an existing key. It only records the consumer key, so that it can request tokens with it.

Each key is a production key or a sandbox key, based on the key manager that you create it with. Sandbox keys show a **Sandbox** badge, and their tokens do not work with production endpoints.

## Get an Access Token

1. On the **OAuth2 Keys** page, find your key, and in its **Actions** menu, click **Get an access token**.

2. Enter the **Consumer secret**.

3. Add **Scopes** and **Resource indicators**, if the API needs them.

4. Click **Get token**, and copy the token. The token is shown only once.

You can also get a token directly from the key manager, for example in a script:

```bash
curl -X POST "<TOKEN_ENDPOINT>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -u "<CONSUMER_KEY>:<CONSUMER_SECRET>"
```

To request scopes, add `-d "scope=<SCOPES>"`. If the key manager requires a resource indicator, add `-d "resource=<RESOURCE>"`.

## Invoke the API

Send the access token as a bearer token:

```bash
curl -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" -X GET "https://my-sample-api.bijiraapis.dev/greet"
```

If the API has subscription plans, also send your subscription token, so that the gateway applies the rate limit of your plan:

```bash
curl -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" -H "Subscription-Key: <YOUR_SUBSCRIPTION_TOKEN>" -X GET "https://my-sample-api.bijiraapis.dev/greet"
```

:::note
The header names depend on the API. Check the security schemes in the API's specification for the correct header names.
:::

## Manage OAuth2 Keys

- **Associate a key with an application:** In the **Actions** menu of the key, click **Associate with an application**, and select the application. You can also open the application, and in the **OAuth2 keys** section, click **Associate existing OAuth2 key**. A key can belong to only one application.
- **Edit a key:** In the **Actions** menu of the key, change its details, such as its name or callback URLs. For a key that the portal registered, the portal also updates the key manager.
- **Delete a key:** In the **Actions** menu of the key, click **Delete key**, and confirm. For a key that the portal registered, this also deletes the OAuth2 application on the key manager. For an existing key that you added, the application stays in the key manager.

Deleting a key does not revoke the tokens that were issued with it. They stay valid until they expire.
