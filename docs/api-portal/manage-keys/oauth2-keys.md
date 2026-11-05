---
title: "OAuth2 Keys"
description: "Generate, add, edit, and delete OAuth2 keys in the API Portal and AI Hub, get access tokens with curl, and work with production and sandbox keys."
---

An **OAuth2 key** is the portal's record of an OAuth2 client on a key manager. It holds the client ID and the details needed to request access tokens. OAuth2 keys are listed under **Keys** › **OAuth2 Keys**.

An OAuth2 key belongs to the user who creates it, not to an application. To generate a key and invoke an API, see [Consume an OAuth2-Secured API](../consume-an-api/oauth2.md).

## Ways to Get a Key

The buttons on the **OAuth2 Keys** page depend on how the key managers of your organization are configured.

| Option | What Happens | Available When |
|:-------|:-------------|:---------------|
| **Generate key** | The portal registers a new OAuth2 client on the key manager, and returns its client ID and secret. | The key manager lets the portal create applications, as ThunderID does by default. |
| **Add existing key** | You create the OAuth2 application in the key manager, and add its client ID to the portal. | The key manager is configured for imported client IDs. See [Configure a Custom Key Manager](../administer/key-managers/custom-key-manager.md). |

### Key Details

When you generate a key, you can set the following details.

| Field | Description |
|:------|:------------|
| **Key manager** | Required. The key manager that registers the application. |
| **Application name** | Required. The name of the application, which end users see on the consent screen. |
| **Callback URLs** | Where the key manager sends the user after login. Enter absolute URIs, without a fragment. Required only for the authorization code grant. |
| **Grant types** | Required. The OAuth2 grants that the application can use: **Authorization code**, **Refresh token**, or **Client credentials**. |
| **Response types** | The response types of the authorization endpoint: **code**, **token**, or **id_token**. They must match the selected grant types. |
| **Client authentication method** | How the application authenticates at the token endpoint. |

### Add an Existing Key

1. Go to **Keys** › **OAuth2 Keys**, and click **Add existing key**.

2. Select the **Key manager**, enter a **Name** for the key, and enter the **Client ID** of the OAuth2 application that you created in the key manager.

3. Click **Add key**.

The portal does not register anything on the key manager for an existing key. It only records the client ID, so that it can request tokens with it. Keep the client secret from where you created the application.

## Get a Token with curl

You can request a token directly from the token endpoint of the key manager. Use this option in scripts, such as in continuous integration (CI), because it does not involve the portal.

```bash
curl -X POST "<token-endpoint>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -u "<client-id>:<client-secret>"
```

The response contains the access token.

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

To request scopes, add `-d "scope=<scopes>"`. If the key manager requires a resource indicator, add `-d "resource=<resource>"`.

## Production and Sandbox Keys

Each key is either a production key or a sandbox key, based on the key manager that it is created on. The list shows a **Sandbox** badge on sandbox keys. Sandbox tokens are for testing, and do not work with production endpoints.

## Associate a Key with an Application

This step is optional. Associate a key with an application to track its usage in analytics. It is not required to invoke an API.

- **From the key:** In the **Actions** menu of the key, click **Associate with an application**, and select the application.

- **From the application:** Open the application, and in the **OAuth2 keys** section, click **Associate existing OAuth2 key**.

A key belongs to at most one application. Associating it again moves it to the other application. Removing the association, or deleting the application, leaves the key usable and unassociated. See [Manage Applications](../manage-usage/manage-applications.md).

## Edit or Delete a Key

- **Edit:** In the **Actions** menu of the key, change the details that the key manager holds, such as the name or callback URLs, and click **Save changes**. For a key that the portal registered, the portal also sends the change to the key manager.

- **Delete:** In the **Actions** menu of the key, click **Delete key**, and confirm. For a key that the portal registered, this also deletes the OAuth2 application on the key manager. For an existing key that you added, only the record in the portal is deleted.

:::note
Deleting a key does not invalidate the tokens that were issued with it. They stay valid until they expire. To revoke a live token, use the revocation endpoint of the key manager.
:::

## Next Steps

- [Consume an OAuth2-Secured API](../consume-an-api/oauth2.md) - Generate a key and a token, and invoke the API
- [Key Managers](../administer/key-managers/overview.md) - Learn how key managers issue tokens
