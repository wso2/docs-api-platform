---
title: "Start from scratch"
description: "Create a REST API in API Platform Cloud from a backend URL, then deploy, test, and publish it."
---

# Create a REST API from scratch

In API Platform Cloud, you can expose an existing HTTP backend through a gateway by creating a REST API proxy. When you start from scratch, you provide a backend URL, and the console generates the initial API details for you. You can then review the API definition, customize its operations, and deploy it to a gateway.

This walks you through creating a REST API using a sample backend, deploying it to a gateway, testing it, and publishing it to a developer portal.

## Prerequisites

Before you begin, make sure you have access to API Platform Cloud.

1. Open the API Platform Cloud Console and sign in using Google or GitHub.
2. Open your organization and select the **Default project**, or create a new project.

## Create the REST API

1. On the project home page, click **Create API**.
2. Select **REST API**, then choose **Start from scratch**.
3. Under **Backend endpoint**, enter your backend URL in the **Endpoint URL** field. Alternatively, click **Try with Sample URL** to use the sample Reading List API backend.

   The sample URL is:

   ```text
   https://apis.bijira.dev/samples/reading-list-api-service/v1.0/books
   ```

4. Click **Continue**.
5. On the **Configure and create** page, review the **Basic information** and **Backend endpoint** sections. The console automatically populates fields such as Identifier and Context. Review the generated values and update them if needed.

   The following table shows example values for the Reading List API.

   | Field | Example value |
   | --- | --- |
   | **Name** | `Reading List API` |
   | **Identifier** | `reading-list-api` |
   | **Version** | `1.0.0` |
   | **Context** | `/sample-project/reading-list-api/v1.0.0` |
   | **Description** | `A starting point. Edit the operations, or ask AI to refine them.` |
   | **Target URL** | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0/books` |

6. Click **Create**.

The REST API is now added to your project. You can review its generated definition and customize the available operations before deploying it.

To view or edit the API definition, open the API and navigate to **Develop** > **Definition**. You can view the OpenAPI definition in YAML or JSON format, or click **Edit** to modify the API operations.

## Deploy the API to a gateway

Deploy the API to a gateway to make it accessible through the gateway's endpoint.

1. Open the API you created.
2. In the left navigation menu, click **Deploy**. Alternatively, click **Deploy to Gateway** on the API overview page.
3. In the **Build Area**, click **Deploy**. You can also use **Build and Deploy** if you need to build the API before deploying it.

4. In the **Deploy to development** dialog, configure the deployment:

   1. **Select the gateway:** Choose the gateway to which you want to deploy the API. **Default** represents your organization's default gateway.
   2. **Confirm the endpoint URL:** Verify that the backend endpoint is correct.
   3. **Confirm the build:** Review the build details and click **Deploy**.

After the deployment succeeds, the gateway status changes to **Active**. The API overview page lists the gateway under **Deployed gateways** and displays the corresponding **Invoke URL**.


**Note:** If the API is already deployed to a gateway, that gateway remains selected in the deployment configuration. Undeploy the API before clearing that gateway selection.

## Test the API

After deploying the API, test its operations to verify that requests can be sent through the gateway.

1. Open the API and click **Test** in the left navigation menu.
2. Select the gateway where the API is deployed. The endpoint associated with the selected gateway appears next to the gateway selector.
3. Choose one of the following testing options:

   - **Console view:** Expand an operation, such as `GET /books` for the Reading List API. Choose **Through proxy** to send the request through the gateway, or **Direct** to send it directly to the backend. Click **Execute** to run the request. For more information, see [API Console](../../test-api-proxy/api-console.md).

   - **cURL view:** Select the HTTP method and path, configure any required query parameters, headers, or request body, and copy the generated cURL command to run the request from your terminal. For more information, see [cURL](../../test-api-proxy/curl.md).

Review the response to verify that the API behaves as expected.

## Publish the API

Publishing makes the API available to developers through a developer portal, where they can discover the API and access its documentation.

See [Publish an API](../../publish-api-proxy/publish-an-api.md).

## Next Steps

- [Secure API Access](../../develop-api-proxy/security/secure-api-access/overview.md) - Control who can invoke the API
- [Attach and Manage Policies](../../develop-api-proxy/policy/attach-and-manage-policies.md) - Add capabilities such as rate limiting or header changes to the API
- [Documents](../../develop-api-proxy/documents.md) - Add documents that help consumers use the API
