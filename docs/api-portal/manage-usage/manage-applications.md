---
title: "Manage Applications"
description: "Optionally group your API keys and OAuth2 keys into an application in the API Portal and AI Hub to track their usage and analytics."
---

:::info
Applications are optional. You do not need an application to invoke an API.
:::

An application groups your API keys and OAuth2 keys so that you can track their usage and see analytics for them. Create an application, then associate existing keys with it.

## Open Applications

1. Sign in to the API Portal for your organization.
2. In the left navigation menu, click **Applications**.

The **Applications** page lists your applications. Each card shows the application name and description.

## Create an application

1. Click **Create application**. The same action is available when you have no applications yet.
2. Enter the application details.

    | Field | Description |
    |---|---|
    | **Application name** | Required. The name of the application. |
    | **Description** | Optional. What this application is for. |

3. Click **Create**. **Create** stays unavailable until you enter a name. Click **Cancel** to leave without creating the application. 

The application is added to the list. Open it to edit the name or the description.


    ![Create application dialog with the name Reading List App, a description, and the Cancel and Create buttons](/img/cloud/devportal/create-application.png)


## Associate an existing key

Get the key before associating it with an application. See [OAuth2 Keys](../manage-keys/oauth2-keys.md) and [API Keys](../manage-keys/api-keys.md).

Associating a key with an application is used only for tracking and analytics. It does not affect the key's validity.

### API keys

1. Open the application.
2. Under **API keys**, click **Associate existing key**.
3. Select the **API**, then select the **Key**. The key list remains unavailable until you select an API.
4. Click **Associate** to associate the key with the application. Click **Cancel** to close the dialog without associating a key.

### OAuth2 keys

1. Open the application.
2. Under **OAuth2 keys**, click **Associate existing key**.
3. Select the **Key**. Only keys that belong to you are listed.
4. Click **Associate** to associate the key with the application. This button remains unavailable until you select a key. Click **Cancel** to close the dialog without associating a key.

The following rules apply to OAuth2 keys:

- A key belongs to at most one application. Associating it with another application moves it there.

- An application holds at most one key of each key type: one production key and one sandbox key. If the application already has a key of the same type, the association is refused with a `409 Conflict` error. Remove the association of the existing key first.

- Associating a key with the application that it already belongs to succeeds, and leaves the association unchanged.

## Delete an application

1. On the application card, click the delete icon.
2. Click **Delete** to confirm. Click **Cancel** to keep the application.

Deleting an application cannot be undone. The keys that were associated with it stay usable, and become unassociated.

## Next Steps

- [Manage Subscriptions](./manage-subscriptions.md) - Subscribe to an API under a subscription plan
- [Which Credentials You Need](../consume-an-api/overview.md) - Generate a key, then use it to call an API
