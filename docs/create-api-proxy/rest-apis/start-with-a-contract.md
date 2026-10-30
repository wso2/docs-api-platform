---
title: "Start with a contract"
description: "Create a REST API in API Platform Cloud by importing an OpenAPI contract, then deploy, test, and publish it."
---

In API Platform Cloud, you can expose an existing HTTP backend through a gateway by creating a REST API proxy. When you start from scratch, you provide a backend URL, and the console generates the initial API details for you. You can then review the API definition, customize its operations, and deploy it to a gateway.

This walks you through creating a REST API using a sample contract, deploying it to a gateway, testing it, and publishing it to a developer portal.
## Prerequisites

1. Open the API Platform Cloud Console and sign in using Google or GitHub.
2. Open your organization, then select the **Default project** or create a new project.

## Create the API

1. On the project home page, click **Create API**.
2. Select **REST API**, then choose **Start with a contract**.
3. Import the API contract using one of the following methods:

   - **URL:** Select URL and enter the contract URL in the **URL for API Contract** field. Alternatively, click **Try with Sample URL** to use the Petstore sample contract.

     ```text
     https://petstore3.swagger.io/api/v3/openapi.json
     ```

     Wait for the contract to finish loading. The **API resources** list displays the imported operations. You can search by path or description and filter the results by HTTP method.


   - **Upload:** Select Upload then drag and drop the contract file into the designated area or click to browse for a file. Supported file types are `.json`, `.yaml`, and `.yml`.

4. Click **Continue**.
5. On the **Configure and create** page, review the values populated from the imported contract. For the Petstore sample, the fields are populated as follows:

   | Field | Example value |
   | --- | --- |
   | **Name** | `Swagger Petstore - OpenAPI 3.0` |
   | **Identifier** | `swagger-petstore-openapi-3-0` |
   | **Version** | `1.0.28` |
   | **Context** | `/sample-project/swagger-petstore-openapi-3-0/v1.0.28` |
   | **Description** | Taken from the contract's `info.description` field |
   | **Target URL** | `https://petstore3.swagger.io/api/v3` |

   Review the generated values and update them if needed. Make sure the **Target URL** points to the backend service that the gateway should call. For the Petstore sample, use `https://petstore3.swagger.io/api/v3`.

8. Click **Create**.

## Deploy the API to a gateway

1. Open the API you created.
2. In the left navigation menu, click **Deploy**. Alternatively, click **Deploy to Gateway** on the API overview page.
3. In the **Build Area**, click **Deploy**. You can also select **Build and Deploy** if you need to build the API before deployment.
4. In the **Deploy to development** dialog, configure the deployment:

   1. **Select the gateway:** Choose the gateway to deploy the API to. **Default** represents your organization's default gateway.
   2. **Confirm the Endpoint URL:** Verify that the backend URL is correct. For the Petstore sample, use `https://petstore3.swagger.io/api/v3`.
   3. **Confirm the build:** Review the build details and click **Deploy**.

After the deployment succeeds, the gateway status changes to **Active**. The API overview page lists the gateway under **Deployed gateways** and displays its **Invoke URL**.

**Note:** If the API is already deployed to a gateway, that gateway remains selected in the deployment configuration. Undeploy the API before clearing that gateway selection.

## Test the API

1. In the left navigation menu, click **Test**.
2. Select the gateway where the API is deployed. The endpoint associated with the selected gateway appears next to the gateway selector.
3. Choose one of the following testing options:

   - **Console view:** Expand an operation from the imported contract. Choose **Through proxy** to send the request through the gateway, or **Direct** to send it directly to the backend. Click **Execute** to run the request. For more information, see [API Console](../../test-api-proxy/api-console.md).

   - **cURL view:** Select the HTTP method and path, configure any required query parameters, headers, or request body, and copy the generated cURL command to run it from your terminal. For more information, see [cURL](../../test-api-proxy/curl.md).

## Publish the API

Publishing makes the API available to developers through a developer portal, where they can discover the API and access its documentation.

See [Publish an API](../../publish-api-proxy/publish-an-api.md).

## Next Steps

- [Secure API Access](../../develop-api-proxy/security/secure-api-access/overview.md) - Control who can invoke the API
- [Attach and Manage Policies](../../develop-api-proxy/policy/attach-and-manage-policies.md) - Add capabilities such as rate limiting or header changes to the API
- [Documents](../../develop-api-proxy/documents.md) - Add documents that help consumers use the API
