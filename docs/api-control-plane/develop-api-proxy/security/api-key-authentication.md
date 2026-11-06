---
title: "API Key Authentication"
description: "Secure an API proxy with the API Key Auth policy, generate an API key for it, and invoke the API with the key."
---

With API key authentication, clients send an API key with each request to invoke an API proxy. An API key is bound to one API and it authenticates requests to that API only. You generate the key from the **API Keys** section of the API itself.

No key manager is involved, and an application is optional. You can associate a key with an application for usage analytics, but this does not change how the key works.

## Prerequisites

- An API proxy. To create one, follow the [Quick Start Guide](../../quickstart-guide.md).

## Step 1: Attach the API Key Auth Policy

1. Sign in to the [API Control Plane](https://console.bijira.dev).

2. In the header, select the project from the **Projects** list and the API from the **APIs** list.

3. In the left navigation menu, click **Develop**, then click **Policies**.

4. In the **Available policies** pane, find the **API Key Auth** policy, and drag it to the **Global policies** section.

5. Configure where requests carry the API key, such as a header and its name, and click **Add**.

6. Click **Save**.

7. Deploy the API to a gateway, so that the policy takes effect.

For more on attaching policies, including to a single resource, see [Attach and Manage Policies](../policy/attach-and-manage-policies.md).

## Step 2: Generate an API Key

You can generate an API key for an API proxy that is deployed to a gateway. The key is pushed to the gateways that the API proxy is deployed to.

1. In the left navigation menu, click **Overview**.

2. In the **API Keys** section, click **Add**.

3. In the dialog box that opens, enter the following details, and click **Create key**.

    | Field | Description |
    |:------|:------------|
    | **Key name** | A name that identifies the key in the list. You cannot change it later. |
    | **Expires in** | How long the key is valid, as a number and a unit, such as 90 days. |

    ![Add API key dialog with the Key name field, the Expires in field set to 90 days, and the Cancel and Create key buttons](/img/cloud/develop-api-proxy/security/add-api-key.png)

4. Copy the key, and store it somewhere safe.

    :::warning
    The key is shown only once. It is stored hashed, so you cannot view it again after you close the dialog.
    :::

5. Click **I have copied the key**.

The key appears in the **API Keys** section, with its name, the last characters of the key, and who created it. To delete a key, click the delete icon next to it.

## Step 3: Invoke the API with the API Key

1. On the **Overview** page of the API, in the **Invoke URL** section, select a gateway, and copy the invoke URL.

2. Send a request to the invoke URL, and include the API key where the **API Key Auth** policy expects it. For example, if the policy reads the key from a header,

    ```bash
    curl -H "<header-name>: <api-key>" "<invoke-url>/<resource-path>"
    ```
