---
title: "API Keys"
description: "View, regenerate, and revoke your API keys in the API Portal and AI Hub, and associate them with applications for usage analytics."
---

An API key is bound to a specific API, and it authenticates your requests to that API. You send the key in the header that the **API Key Auth** policy of the API expects.

API keys for an API are created in the API Management Console. On the **Overview** page of the API, in the **API Keys** section, click **Add**. See [API Key Authentication](../../api-control-plane/develop-api-proxy/security/api-key-authentication.md).

## View Your API Keys

1. Sign in to the API Portal and AI Hub.

2. In the sidebar, click **Keys**, then click **API Keys**.

The page lists the API keys that you have generated across all APIs.

## Regenerate an API Key

Regenerate a key if it is compromised, or to rotate it regularly.

1. On the **API Keys** page, click **Regenerate** next to the key, and confirm.

2. Copy the new key. You cannot view it again after you close the dialog.

:::warning
The old key stops working as soon as you regenerate it. Update all the services that use the old key.
:::

## Revoke an API Key

On the **API Keys** page, click **Revoke** next to the key, and confirm.

You cannot recover a revoked key.

## Associate an API Key with an Application

This step is optional. Associate an API key with an application to track its usage in analytics. The association has no effect on the validity of the key, and you do not need it to invoke the API.

1. In the sidebar, click **Applications**, and open the application.

2. Under **API keys**, click **Associate existing key**.

3. Select the **API**, and then select the **Key**.

4. Click **Associate**.

For more on applications, see [Manage Applications](../manage-usage/manage-applications.md).

## Next Steps

- [Which Credentials You Need](../consume-an-api/overview.md) - Find out which credentials an API requires, and how to send them
