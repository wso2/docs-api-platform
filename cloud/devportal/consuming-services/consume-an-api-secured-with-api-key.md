---
title: "Consume an API secured with an API key"
description: "Generate an API key for a subscribed API and use it to authenticate requests in the api-key header."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/consuming-services/consume-an-api-secured-with-api-key/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/consuming-services/consume-an-api-secured-with-api-key.md
tags:
  - cloud
  - devportal
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Consume an API Secured with API Key

## Prerequisites

Before proceeding, ensure you have [Created an Application](../manage-applications/create-an-application.md) and [Subscribed to an API](../manage-subscriptions/subscribe-to-an-api.md) to consume.


## Creating an API Key

To consume an API secured with an API key, ensure that the desired API has API Key authentication enabled. Then create an application in the API Platform Developer Portal and subscribe it to the API under a defined usage policy. The API key will then be associated with that specific application.

---

### Steps to Create an API Key

1. Ensure the desired API has API Key authentication enabled.

2. Navigate to the [API Platform Developer Portal](https://devportal.bijira.dev) and sign in.

3. Click on **Applications** in the Developer Portal sidebar.

4. Click on the application to open it.

5. Subscribe to the API that has API Key authentication enabled via your application. For more information, see [Subscribe to an API](../manage-subscriptions/subscribe-to-an-api.md).

6. In the Application detail banner, click **Manage Keys**. This opens the **Manage Keys** page.

7. On the **Manage Keys** page, select either the **Production** or **Sandbox** tab based on your requirement.

    !!!info
        Sandbox keys can only be used in the sandbox environment.

8. In the **API Keys** section, locate the API Key enabled API that you subscribed to and click **Generate Key** beside it.

    ![Manage Keys page showing OAuth2 Keys and API Keys sections with Generate Key buttons](../../../assets/img/devportal/api-keys-section.png)

9. In the **Generate API Key** dialog that opens, enter an API Key name.

10. Click **Generate** and wait for the API key to be generated.

11. Copy the generated API key from the dialog and click **Done** to close the dialog. The API key will not be visible in the UI again after closing the dialog.

You can use the **Regenerate** button to generate a new API key, or the **Revoke** button to revoke an existing API key.

## Consume an API

Use this API Key to authenticate API requests by including it in the `api-key` header when invoking the API.

Example:
```bash
curl -H "api-key: <YOUR_API_KEY>" -X GET "https://my-sample-api.bijiraapis.dev/greet"
```