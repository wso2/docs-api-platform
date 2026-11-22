---
title: "Start from scratch"
pagination_label: "REST: Start from Scratch"
description: "Create a REST API in the API Control Plane from a backend URL, then deploy, test, and publish it."
---

# Create a REST API from scratch

In the API Control Plane, you can expose an existing HTTP backend through a gateway by creating a REST API proxy. When you start from scratch, you provide a backend URL, and the console generates the initial API details for you. You can then review the API definition, customize its operations, and deploy it to a gateway.

This walks you through creating a REST API using a sample backend, deploying it to a gateway, testing it, and publishing it to a portal.

## Prerequisites

Before you begin, make sure you have access to the console.

1. Open the API Control Plane and sign in using Google or GitHub.
2. Open your organization and select the **Default Project**, or create a new project.

## Create the REST API

1. On the project home page, click **Create API**.
2. Select **REST API**, then choose **Start from scratch**.

    **Start from scratch** creates a blank API with one wildcard path, `/*`, for the `GET`, `POST`, `PATCH`, and `DELETE` methods. You can change these resources after you create the API.

3. Under **Backend endpoint**, enter your backend URL in the **Endpoint URL** field. To use the sample Reading List API backend, click **Try with Sample URL**. **Endpoint URL** is required.

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
   | **Endpoint** | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0/books` |

6. Click **Create**.

The console adds the REST API to your project, with the wildcard resources.

To add your own resources, such as `GET /books/{id}`, or to remove the wildcard resources, see [Definition](../../develop-api-proxy/definition.md).

## Deploy the API

Deploying places a build of the API on a gateway so requests can reach the backend through that gateway.

1. Choose a gateway. Your organization has a Choreo Managed Gateway named **Default**, in the development environment. To deploy to another gateway, create it first. See [Manage Gateways](../../administer/managing-gateways.md).
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
