---
title: "Quick Start Guide"
pagination_label: "API Portal and AI Hub Quick Start"
description: "Sign in to the API Portal and AI Hub, find an API, generate an OAuth2 key and an access token, and invoke the API."
---

In this guide, you sign in to the API Portal and AI Hub, find an API, generate an access token, and invoke the API.

## Prerequisites

- A portal in your organization. See [Manage Portals](../api-control-plane/administer/managing-portals.md).
- An API that has the **JWT Auth** policy attached and is published to the portal. See [OAuth2 Authentication](../api-control-plane/develop-api-proxy/security/oauth2-authentication.md) and [Publish an API](../api-control-plane/publish-api-proxy/publish-an-api.md).

## Step 1: Sign In to the Portal

1. Open the portal. If you don't have the portal URL, get it from the API publisher. See [Open the Portal](./overview.md#open-the-portal).

2. Click **Log In**, and sign in with your username and password. If you don't have an account in the portal and the portal allows self sign-up, click **Sign up** to create one.

## Step 2: Find the API

1. In the portal, click **APIs** in the sidebar. Find the API in the list, or search for it.

2. Click the API to open it. The page shows the endpoints and resources of the API.

3. Click **Documentation** to view the API definition.

For more, see [Browse APIs](./discover/browse-apis.md) and [API Documentation](./discover/documentation.md).

## Step 3: Generate an OAuth2 Key

1. Go to **Keys** › **OAuth2 Keys**, and click **Register OAuth2 client**.

2. In the dialog box that opens, enter the following details, and leave the other fields as they are.

    | Field | Value |
    |:------|:------|
    | **Key manager** | **ThunderID**, the default key manager. |
    | **Application name** | A name for the key, such as `quickstart-app`. |
    | **Grant types** | **Client credentials**. |

3. Click **Register client**.

4. Copy the consumer secret, and store it securely.

:::warning
The consumer secret is shown only once and is not stored. You need it to get an access token. If you lose it, delete the key and generate a new one.
:::

## Step 4: Get an Access Token

1. On the **OAuth2 Keys** page, find your key, and click **Get token** on its row. The **Get an access token** dialog opens.

2. Enter the **Consumer secret**. Optionally, enter **Scopes** and **Resource indicators**.

3. Click **Get token**, and copy the access token.

## Step 5: Invoke the API

1. Open the API, and under **Endpoints**, copy the **Production** endpoint.

2. Send a request to the endpoint with the access token as a bearer token.

    ```bash
    curl -X GET "<endpoint>/<resource-path>" \
      -H "Authorization: Bearer <access-token>"
    ```

:::note
This request works when the access token is the only credential the API requires. If the API has other policies attached, such as API key authentication or subscription validation, send the credentials that those policies expect as well. See [Which Credentials You Need](./consume-an-api/overview.md).
:::

## Next Steps

- [Consume an OAuth2-Secured API](./consume-an-api/oauth2.md) - Learn more about generating keys and access tokens
- [OAuth2 Keys](./manage-keys/oauth2-keys.md) - Get a token with curl, and edit or delete keys
- [API Workflows](./discover/api-workflows.md) - Find workflows that AI agents follow to use your APIs
- [AI Agents](./discover/ai-agent-discovery.md) - Let AI agents discover and call the API
