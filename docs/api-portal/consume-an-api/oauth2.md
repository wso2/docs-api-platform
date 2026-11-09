---
title: "Consume an OAuth2-Secured API"
description: "Generate an OAuth2 key and an access token in the API Portal and AI Hub, and invoke an OAuth2-secured API."
---

An OAuth2-secured API expects an access token issued by a key manager. ThunderID is the default key manager, so you can generate a key and a token in the API Portal and AI Hub without any other setup.

## Prerequisites

- The API has the **JWT Auth** policy attached in the API Control Plane, and is published to the portal. See [OAuth2 Authentication](../../api-control-plane/develop-api-proxy/security/oauth2-authentication.md).
- An account in the portal. See [Sign In to the Portal](../quickstart-guide.md#step-1-sign-in-to-the-portal).

## Step 1: Generate an OAuth2 Key

1. Sign in to the API Portal and AI Hub, and go to **Keys** › **OAuth2 Keys**.

2. Click **Register OAuth2 Client**.

3. Enter the following details.

    | Field | Description |
    |:------|:------------|
    | **Key manager** | Required. Select **ThunderID**. |
    | **Application name** | Required. A name for the key. |
    | **Grant types** | Required. Select **Client credentials**. |

4. Click **Generate key**.

5. Copy the client secret, and store it securely.

:::warning
The client secret is shown only once. The portal does not store it, and you need it each time you get an access token. If you lose it, delete the key and generate a new one.
:::

## Step 2: Get an Access Token

1. On the **OAuth2 Keys** page, find your key, and in its **Actions** menu, click **Get an access token**.

2. Enter the **Client secret**.

3. Click **Get token**, and copy the access token.

The token is shown only once, and is valid until it expires. When it expires, get a new one in the same way.

## Step 3: Invoke the API

1. In the portal, open the API, and under **Endpoints**, copy the **Production** endpoint.

2. Send the access token as a bearer token.

    ```bash
    curl -X GET "<endpoint>/<resource-path>" \
      -H "Authorization: Bearer <access-token>"
    ```

:::note
If the API has other policies attached, such as subscription validation or API key authentication, send the credentials that those policies expect as well. See [Which Credentials You Need](./overview.md).
:::

## Next Steps

- [OAuth2 Keys](../manage-keys/oauth2-keys.md) - Get a token with curl, use a custom key manager, and edit or delete keys
- [Which Credentials You Need](./overview.md) - Find out which credentials an API expects
- [Consume an API-Key-Secured API](./api-key.md) - Invoke an API secured with an API key
