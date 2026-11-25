---
title: "Start with a contract"
pagination_label: "REST: Start with a Contract"
description: "Create a REST API in the API Control Plane by importing an OpenAPI contract, then deploy, test, and publish it."
---

In the API Control Plane, you can expose an existing HTTP backend through a gateway by creating a REST API proxy. When you start with a contract, you provide a contract URL, and the console generates the initial API details for you. You can then review the API definition, customize its operations, and deploy it to a gateway.

This walks you through creating a REST API using a sample contract, deploying it to a gateway, testing it, and publishing it to a portal.
## Prerequisites

1. Open the API Control Plane and sign in using Google or GitHub.
2. Open your organization, then select the **Default Project** or create a new project.

## Create the API

1. On the project home page, click **Create API**.
2. Select **REST API**, then choose **Start with a contract**.
3. Import the contract from a URL or from a file, as described in the next two sections.

### Import the contract from a URL

1. Select **URL**.
2. Enter the contract URL in the **URL for API Contract** field. To use the sample Reading List API contract, click **Try with Sample URL**.

    ```text
    https://raw.githubusercontent.com/wso2/bijira-samples/refs/heads/main/reading-list-api/openapi.yaml
    ```

3. Wait for the contract to finish loading. The **API resources** list shows the imported operations. To see the contract itself, turn on **Source**.
4. Click **Continue**, and go to [Configure and create the API](#configure-and-create-the-api).

### Upload a contract file

1. Select **Upload**.
2. Drag the contract file into the upload area, or click the area to browse for the file. The supported file types are `.json`, `.yaml`, and `.yml`.
3. Click **Continue**, and go to [Configure and create the API](#configure-and-create-the-api).

### Configure and create the API

1. On the **Configure and create** page, review the values that the console fills in from the contract. For the sample contract in the **Default Project**, the values are as follows:

    | Field | Example value |
    | --- | --- |
    | **Name** | `Reading List API` |
    | **Identifier** | `reading-list-api` |
    | **Version** | `1.0` |
    | **Context** | `/default/reading-list-api/v1.0` |
    | **Description** | `This is a sample proxy that manages a list of reading items.` |
    | **Endpoint** | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0` |

2. Update the values if needed. Make sure **Endpoint** points to the backend service that the gateway calls.
3. Click **Create**.

To view or change the imported operations, see [Definition](../../develop-api-proxy/definition.md).

## Deploy the API

Deploying places a build of the API on a gateway so requests can reach the backend through that gateway.

1. Choose a gateway. Your organization has a cloud gateway named **Default**, in the development environment. To deploy to another gateway, create it first. See [Manage Gateways](../../administer/managing-gateways.md).
2. Go to the **Deploy** section and deploy the API to the gateway. For more information, see [Deploy an API](../../deploy-api-proxy/overview.md).

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
