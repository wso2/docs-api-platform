---
title: "Consume an API"
---

## Consume an API Secured with OAuth2

### Prerequisites

Before proceeding, ensure you have [Created an Application](./manage-applications.md) and [Subscribed to an API](./manage-subscriptions.md) to consume.

### Generate keys

API Platform uses OAuth 2.0 bearer token-based authentication for API access. An API access token is a string passed as an HTTP header in API requests to authenticate access.

Once you create an application, you can generate credentials for it. API Platform provides a consumer key and consumer secret when you generate credentials for the first time. The consumer key acts as the unique identifier for the application and is used for authentication.

To generate an access token for **testing purposes**, follow these steps:

1. Navigate to the [API Portal and AI Hub](https://devportal.bijira.dev) and sign in.

2. Click on **Applications** in the portal sidebar.

3. Click on the application for which you want to generate keys and tokens.

4. In the Application detail banner, click **Manage Keys**. This opens the **Manage Keys** page.

5. On the **Manage Keys** page, select either the **Production** or **Sandbox** tab based on your requirement.

    :::info
    Sandbox keys can only be used in the sandbox environment.
    :::

6. Click **Generate** and wait for the keys to be generated. This will generate the consumer key and consumer secret with default configurations. Once the keys are generated, close the dialog.

7. Click **Generate** to generate an access token. You can add scopes through the Request Permission section in the Access Token dialog.

    ![Access Token dialog showing Request Permissions scopes field and generated token with Regenerate button](/img/cloud/devportal/ScopeSection.png)

    :::info
    Currently, API Platform does not support configuring allowed scopes at the application level.
    :::

8. Copy the displayed access token.

You can use the **View** and **Modify** buttons to inspect and customize the default key generation settings.

Alternatively, click **Instructions** to view details about the token endpoint. You can either copy the generated cURL command to obtain a test token using a cURL client, or use the consumer key and consumer secret to generate an API access token by invoking the token endpoint. You can also revoke the access token by invoking the revoke endpoint.

### Consume an API

Use this generated access token to authenticate API requests by including it in the `Bearer` header when invoking the API.

Example:

```bash
curl -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" -X GET "https://my-sample-api.bijiraapis.dev/greet"
```

:::note
The name of the Authorization header may vary depending on the API provider’s configuration. Always refer to the API’s Swagger (OpenAPI) definition for the correct header format.
:::

## Consume an API Secured with API Key

### Prerequisites

Before proceeding, ensure you have [Created an Application](./manage-applications.md) and [Subscribed to an API](./manage-subscriptions.md) to consume.

### Creating an API Key

To consume an API secured with an API key, ensure that the desired API has API Key authentication enabled. Then create an application in the API Portal and AI Hub and subscribe it to the API under a defined usage policy. The API key will then be associated with that specific application.

---

#### Steps to Create an API Key

1. Ensure the desired API has API Key authentication enabled.

2. Navigate to the [API Portal and AI Hub](https://devportal.bijira.dev) and sign in.

3. Click on **Applications** in the portal sidebar.

4. Click on the application to open it.

5. Subscribe to the API that has API Key authentication enabled via your application. For more information, see [Subscribe to an API](./manage-subscriptions.md).

6. In the Application detail banner, click **Manage Keys**. This opens the **Manage Keys** page.

7. On the **Manage Keys** page, select either the **Production** or **Sandbox** tab based on your requirement.

    :::info
    Sandbox keys can only be used in the sandbox environment.
    :::

8. In the **API Keys** section, locate the API Key enabled API that you subscribed to and click **Generate Key** beside it.

    ![Manage Keys page showing OAuth2 Keys and API Keys sections with Generate Key buttons](/img/cloud/devportal/api-keys-section.png)

9. In the **Generate API Key** dialog that opens, enter an API Key name.

10. Click **Generate** and wait for the API key to be generated.

11. Copy the generated API key from the dialog and click **Done** to close the dialog. The API key will not be visible in the UI again after closing the dialog.

You can use the **Regenerate** button to generate a new API key, or the **Revoke** button to revoke an existing API key.

### Consume an API

Use this API Key to authenticate API requests by including it in the `api-key` header when invoking the API.

Example:
```bash
curl -H "api-key: <YOUR_API_KEY>" -X GET "https://my-sample-api.bijiraapis.dev/greet"
```
