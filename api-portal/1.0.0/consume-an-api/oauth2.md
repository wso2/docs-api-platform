---
title: "Consume an API secured with OAuth2"
description: "Link a key manager client ID to your application, generate an access token from the portal or with curl, and call an OAuth2-secured API."
canonical_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/oauth2/
md_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/oauth2.md
tags:
  - cloud
  - api-portal
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Consume an API secured with OAuth2

OAuth2-secured APIs expect a bearer token issued by a key manager. The OAuth application that issues it lives in the key manager, not in the portal—the portal stores only its client ID and proxies token requests on your behalf. It asks for the consumer secret each time you generate a token through the UI, uses it for that one request, and doesn't retain it.

## Prerequisites

Three things have to exist before you can generate a token:

1. **An OAuth application in a key manager.** Ask your admin which key managers your organization has connected and how to create an OAuth application in the one you need. For the admin side, see [Key Manager Integration](../admin-settings/key-manager-integration.md).
2. **An application in the portal.** This is the container that holds the client ID. See [Manage Applications](manage-applications.md).
3. **A subscription, if the API has plans.** Subscriptions are made directly to the API, independently of your application. See [Manage Subscriptions](manage-subscriptions.md).

## Link a client ID

1. Sign in to the API Portal & MCP Hub.
2. Click **Applications** in the sidebar, then open your application.
3. In the **Manage Keys** section, choose the **Production** or **Sandbox** tab.

    !!! info
        The two environments hold separate credentials. Sandbox tokens are for testing and don't work against production endpoints.

4. Find the card for the key manager you want to use, paste the **client ID** of the OAuth application you created there, and click **Add**.

The card now shows three tabs: **Credentials**, **Generate Token**, and **cURL**. The **Credentials** tab holds the consumer key (client ID) with a copy button. No secret appears there, because the portal never received one.

## Generate an access token

You have two routes, and they produce the same token.

### From the portal

1. On the key manager's card, open the **Generate Token** tab.
2. Add scopes under **Request Permissions (Scopes)** if the API needs them. Type each scope and press <kbd>Enter</kbd>. The field starts pre-filled with the scopes your subscriptions grant.
3. Click **Generate access token**.
4. Enter your consumer secret when prompted. The portal uses it once to make the token request and doesn't keep it.
5. Copy the token from the dialog.

    !!! warning
        The token is shown once and can't be retrieved afterward. Copy it before closing the dialog. The dialog's **Regenerate** button issues a fresh one if you lose it.

The dialog also shows **Response Permissions (Scopes)**—the scopes the key manager actually granted, which can be narrower than what you asked for.

### With curl

Open the **cURL** tab for a ready-made command with your token endpoint and client ID already filled in, then copy it. It uses the client credentials grant:

```bash
curl -X POST "https://keymanager.example.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -u "<CONSUMER_KEY>:<CONSUMER_SECRET>"
```

The response carries the token:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

This route goes straight to the key manager and doesn't involve the portal, which makes it the one to script in continuous integration (CI).

## Invoke the API

Send the token as a bearer token:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

If the API has subscription plans, add the subscription token too. It's what tells the gateway which plan's rate limit applies to you:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Subscription-Key: <YOUR_SUBSCRIPTION_TOKEN>"
```

!!! note
    Both header names come from the API's specification. Check its `securitySchemes` section for the authorization scheme, and its subscription-key parameter for the second header, rather than assuming the names above.

## Revoke a client ID

On the **Credentials** tab, click **Revoke keys**. This removes every credential the portal holds for that key manager and key type.

Two things it doesn't do: it doesn't deregister or delete the OAuth application in the key manager, and it doesn't invalidate tokens already issued—those stay valid until they expire. To kill the OAuth application itself or revoke a live token, use the key manager's own console or revocation endpoint.

## Related

- [Consume an API](overview.md): which credentials an API expects, and how to tell
- [Manage Applications](manage-applications.md): the container for client IDs
- [Manage Subscriptions](manage-subscriptions.md): subscribe before generating credentials
- [Consume an API Secured with an API Key](api-key.md): the alternative for API-key-secured APIs
- [Key Manager Integration](../admin-settings/key-manager-integration.md): admin guide for key manager setup