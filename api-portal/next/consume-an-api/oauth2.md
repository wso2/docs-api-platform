---
title: "Consume an API secured with OAuth2"
description: "Create or import an OAuth2 key, generate an access token, and call an OAuth2-secured API."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/consume-an-api/oauth2/
md_url: https://wso2.com/api-platform/docs/api-portal/next/consume-an-api/oauth2.md
tags:
  - cloud
  - api-portal
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-01
content_type: "how-to"
---

# Consume an API secured with OAuth2

OAuth2-secured APIs expect a bearer token issued by a key manager. You get one from an **OAuth2 key** — the portal's record of an OAuth2 client on a key manager, holding its consumer key and the detail needed to request tokens with it.

Keys live under **Keys → OAuth2 Keys** and belong to you, not to an application. Associating a key with an application is a separate, optional step.

!!! warning "The portal never stores your consumer secret"
    The key manager returns it once, when the key is created. Copy it then. You supply it each time you generate a token, it is used for that one request, and it is kept nowhere. If you lose it, delete the key and create another.

## Prerequisites

1. **A key manager your organization has connected.** Your administrator sets these up — see [Key Manager Integration](../admin-settings/key-manager-integration.md). Which of the two routes below you can use depends on how they configured it.
2. **A subscription, if the API has plans.** Subscriptions are made to the API, independently of any application. See [Manage Subscriptions](manage-subscriptions.md).

An application is **not** a prerequisite. You can create a key and call an API without one.

## Two ways to get a key

| Route | What happens | Available when |
|---|---|---|
| **Generate key** | The portal registers a new OAuth2 client on the key manager for you and returns its consumer key and secret. | The key manager is configured to let the portal create applications. |
| **Add existing key** | You create the OAuth2 application in the key manager's own console and paste its consumer key into the portal. | The key manager is configured for imported client IDs. |

The buttons you see on the OAuth2 Keys page reflect what your administrator configured — if only one route is available, only that button appears.

### Generate a key

1. Sign in and go to **Keys → OAuth2 Keys**.
2. Click **Generate key**.
3. Choose the **Key manager**, give the key a **Name**, and fill in whatever that key manager asks for — typically the grant types, and callback URLs if you selected the authorization code grant.
4. Click **Add key**.
5. **Copy the consumer secret from the confirmation dialog.** It is shown once and cannot be retrieved afterwards.

### Add an existing key

1. Go to **Keys → OAuth2 Keys** and click **Add existing key**.
2. Choose the **Key manager**, give the key a **Name**, and paste the **Consumer key** of the OAuth2 application you created in that key manager.
3. Click **Add key**.

Nothing is registered on the key manager here — the portal only records the consumer key so it can request tokens with it. Keep the secret from wherever you created the application.

## Generate an access token

1. On the OAuth2 Keys list, find your key and choose **Get an access token** from its **Actions** menu.
2. Enter the **Consumer secret**.
3. Add **Scopes** and **Resource indicators** if the API needs them.
4. Click **Get token** and copy the token from the dialog.

The token is shown once and is not persisted — closing the dialog is the end of it, exactly as with the consumer secret.

### With curl

You can also go straight to the key manager, which is the route to script in CI because it does not involve the portal:

```bash
curl -X POST "https://keymanager.example.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -u "<CONSUMER_KEY>:<CONSUMER_SECRET>"
```

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Add `-d "scope=..."` for scopes, and `-d "resource=..."` if the key manager requires a resource indicator.

## Invoke the API

Send the token as a bearer token:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

If the API has subscription plans, add the subscription token too — it tells the gateway which plan's rate limit applies:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Subscription-Key: <YOUR_SUBSCRIPTION_TOKEN>"
```

!!! note
    Both header names come from the API's specification. Check its `securitySchemes` section for the authorization scheme, and its subscription-key parameter for the second header, rather than assuming the names above.

## Production and sandbox keys

Each key is either production or sandbox, inherited from the key manager it was created on — the list shows a **Sandbox** badge on the ones that are. Sandbox tokens are for testing and do not work against production endpoints. To hold both, create a key on a production key manager and another on a sandbox one.

## Associate a key with an application

Associating a key with an application is for organizing credentials; it is not required to call an API.

- **From the key:** choose **Associate with an application** from the key's **Actions** menu and pick the application.
- **From the application:** open the application, find the **OAuth2 keys** section and click **Associate existing OAuth2 key**.

A key belongs to at most one application. Associating it again moves it. Removing the association leaves the key usable and unassociated; deleting the application does the same.

## Edit or delete a key

**Edit** — choose the key's **Actions → Save changes** entry to change what the key manager holds, such as its name or callback URLs. For a key the portal registered, the change is sent on to the key manager.

**Delete** — choose **Delete key** and confirm. For a key the portal registered, this also deletes the OAuth2 application on the key manager. For an imported key, only the portal's record goes; the application stays in the key manager, where you created it.

!!! note
    Deleting a key does not invalidate tokens already issued with it. Those remain valid until they expire. To cut off a live token, use the key manager's own revocation endpoint.

## Related

- [Consume an API](overview.md): which credentials an API expects, and how to tell
- [Manage Applications](manage-applications.md): grouping keys and subscriptions
- [Manage Subscriptions](manage-subscriptions.md): subscribe before calling an API with plans
- [Consume an API Secured with an API Key](api-key.md): the alternative for API-key-secured APIs
- [Key Manager Integration](../admin-settings/key-manager-integration.md): admin guide for key manager setup