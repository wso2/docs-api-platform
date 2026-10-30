---
title: "Manage Applications"
description: "Create an application in the Developer Portal and associate an existing key with it."
---

An application holds the API keys and subscriptions you use to call APIs. Create one in the Developer Portal, then associate an existing key so its usage is counted for that application.

## Open Applications

1. Sign in to the API Platform Cloud API Portal associated to your organization.
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

    ![Create application dialog with the name Reading List App, a description, and the Cancel and Create buttons](/img/cloud/devportal/create-application.png)

The application is added to the list. Open it to edit the name or the description.

## Associate an existing key

Generate the key before associating it with an application. See [Consume an API](./consume-an-api.md) for instructions.

Associating a key with an application enables usage analytics for that application. It does not affect the key's validity.

### API keys

1. Open the application.
2. Under **API keys**, click **Associate existing key**.
3. Select the **API**, then select the **Key**. The key list remains unavailable until you select an API.
4. Click **Associate** to associate the key with the application. Click **Cancel** to close the dialog without associating a key.

### OAuth2 keys

1. Open the application.
2. Under **OAuth2 keys**, click **Associate existing key**.
3. Select the **Key**. Only keys that belong to you are listed. If the key is already associated with another application, it is moved to the current application. A key can be associated with only one application at a time.
4. Click **Associate** to associate the key with the application. This button remains unavailable until you select a key. Click **Cancel** to close the dialog without associating a key.

## Delete an application

1. On the application card, click the delete icon.
2. In **Delete application**, confirm that you want to delete the named application. Its API keys and subscriptions will be revoked.
3. Click **Delete**. Click **Cancel** to keep the application.

:::warning
Deleting an application cannot be undone.
:::

## Next Steps

- [Manage Subscriptions](./manage-subscriptions.md) - Subscribe the application to an API
- [Consume an API](./consume-an-api.md) - Generate a key, then use it to call an API
