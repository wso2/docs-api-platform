---
title: "Start with a contract"
description: "Create a REST API in the API Control Plane by importing an OpenAPI contract, then deploy, test, and publish it."
---

In the API Control Plane, you can expose an existing HTTP backend through a gateway by creating a REST API proxy. When you start with a contract, you provide a contract URL, and the console generates the initial API details for you. You can then review the API definition, customize its operations, and deploy it to a gateway.

This walks you through creating a REST API using a sample contract, deploying it to a gateway, testing it, and publishing it to a portal.
## Prerequisites

1. Open the API Control Plane and sign in using Google or GitHub.
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

## Deploy the API

Deploying places a build of the API on a gateway so requests can reach the backend through that gateway.

1. Create a gateway. See [Manage Gateways](../../administer/managing-gateways.md).
2. Go to the **Deploy** section and deploy the API to a gateway. For more information, see [Deploy an API](../../deploy-api-proxy/overview.md).

## Test the API

After deploying the API, test its operations to verify that requests can be sent through the gateway.

1. In the left navigation menu, click **Test**.
2. Use the API Console or cURL to send a request through the gateway and inspect the response.

For more information, see [API Console](../../test-api-proxy/api-console.md) and [cURL](../../test-api-proxy/curl.md).

## Publish the API

Publishing makes the API available to developers through a portal, where they can discover the API and access its documentation.

1. Create a portal first if the organization does not have one. See [Manage Portals](../../administer/managing-portals.md).
2. Publish the API. See [Publish an API](../../publish-api-proxy/publish-an-api.md).

## Next Steps

- [Security](../../develop-api-proxy/security/overview.md) - Control who can invoke the API
- [Attach and Manage Policies](../../develop-api-proxy/policy/attach-and-manage-policies.md) - Add capabilities such as rate limiting or header changes to the API
- [Documents](../../develop-api-proxy/documents.md) - Add documents that help consumers use the API
