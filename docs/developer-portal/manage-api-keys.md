---
title: "Manage API Keys"
description: "Generate, regenerate, and revoke API keys for an API in the API Portal and AI Hub, and associate them with applications."
---

An API key is bound to a specific API. You generate a key directly for an API, and the key authenticates your requests to that API. You do not need an application.

## Prerequisites

- The API has API key authentication enabled. Check the API's documentation or the security section of its specification.
- A subscription to the API, if the API requires one. For more information, see [Manage Subscriptions](./manage-subscriptions.md).

## Generate an API Key

1. Sign in to the [API Portal and AI Hub](https://devportal.bijira.dev).

2. In the sidebar, click **APIs**, and open the API that you want to invoke.

3. In the submenu of the API, click **API Keys**.

4. Click **Generate API key**.

5. In the **Generate API key** dialog, enter a **Name** for the key, such as `my-prod-key`. Optionally, set an **Expires at** date.

6. Click **Generate**.

7. Copy the API key. You cannot view it again after you close the dialog.

8. Click **Done**.

The **API Keys** page lists the keys of the API, with their name, status, expiry date, and the application that each key is associated with.

## Regenerate an API Key

Regenerate a key if it is compromised, or to rotate it regularly.

1. On the **API Keys** page of the API, click **Regenerate** next to the key.

2. Optionally, change the **Name** or **Expires at** date, and confirm.

3. Copy the new key from the dialog.

:::warning
The old key stops working as soon as you regenerate it. Update all the services that use the old key.
:::

## Revoke an API Key

1. On the **API Keys** page of the API, click **Revoke** next to the key.

2. Confirm the revocation.

You cannot recover a revoked key. To get access again, generate a new key.

## Associate an API Key with an Application

You can associate an API key with an application to group its usage under the application in analytics. The association does not change how the key works.

- **From the key:** On the **API Keys** page of the API, click **Associate app**, or **Change app** if the key already has one, and select the application.
- **From the application:** Open the application, go to the **API Keys** tab, and click **Associate existing key**. Select the **API** that the key belongs to and the **Key**, and click **Associate**.

To remove the association, click **Remove** next to the key in the **API Keys** tab of the application. The key stays active.

## Next Steps

- [Call an API-Key-Secured API](./call-api-key-secured-api.md) - Invoke an API with an API key
