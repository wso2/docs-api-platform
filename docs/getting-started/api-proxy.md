---
title: "Quick Start Guide"
pagination_label: "API Control Plane Quick Start"
description: "Create a REST API from a backend URL, deploy it to a gateway, test it, and publish it to a portal."
---

In the API Control Plane, you can expose an existing HTTP backend through a gateway by creating a REST API proxy. When you start from scratch, you provide a backend URL, and the console generates the initial API details for you. You can then review the API definition, deploy the API to a gateway, test it, and publish it to the API Portal.

This guide uses the sample Reading List API backend.

## Prerequisites

1. Sign in to the [API Platform Console](https://console.bijira.dev).
2. Create an organization:

    1. Enter a **Display name**.
    2. Enter a **Handle**.
    3. Click **Create**.

    If you already have an organization, open it and continue.

3. Use the **Default project**, or create a project:

    1. On the organization home page, click **New project**.
    2. Enter a **Display name**, an **Identifier**, and a **Description**.
    3. Click **Create**.

    The project home page opens. Continue from there to create the API.


## Create the REST API

1. On the project home page, click **Create API**.
2. Select **REST API**, then click **Continue**.
3. Select **Start from scratch**.
4. Under **Backend endpoint**, enter your backend URL in Endpoint URL. To use the sample Reading List API, click **Try with Sample URL**.

    The sample URL is:

    ```text
    https://apis.bijira.dev/samples/reading-list-api-service/v1.0/books
    ```

5. Click **Continue**.
6. On **Configure and create**, review **Basic information** and **Backend endpoint**. The console fills **Name** and derives **Identifier** and **Context** from that name.


    For this sample, set **Name** to `Reading List API`. The identifier becomes `reading-list-api`, and the context includes your project identifier, for example `/default/reading-list-api/v1.0.0`.

    | Field | Value |
    | --- | --- |
    | **Name** | `Reading List API` |
    | **Identifier** | `reading-list-api` |
    | **Version** | `1.0.0` |
    | **Context** | `/default/reading-list-api/v1.0.0` |
    | **Description** | `A starting point. Edit the operations, or ask AI to refine them.` |
    | **Target URL** | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0/books` |

7. Click **Create**.

The REST API is added to the project. Its overview lists the generated operations, such as `GET /`, `POST /`, `PATCH /`, and `DELETE /`, and the backend endpoint.

To view or edit the API definition, open the API and in the left navigation menu click **Develop**, then **Definition**. You can view the OpenAPI definition as **YAML** or **JSON**, or click **Edit** to change the operations.

## Deploy the API

Deploying places a build of the API on a gateway so requests can reach the backend through that gateway.

1. Create a gateway. See [Manage Gateways](../administer/managing-gateways.md).
2. Go to the **Deploy** section and deploy the API to a gateway. For more information, see [Deploy an API](../deploy-api-proxy/overview.md).

## Test the API

After deploying the API, test its operations to verify that requests can be sent through the gateway.

1. In the left navigation menu, click **Test**.
2. Use the API Console or cURL to send a request through the gateway and inspect the response.

For more information, see [API Console](../test-api-proxy/api-console.md) and [cURL](../test-api-proxy/curl.md).

## Publish the API

Publishing makes the API available in the API Portal, where consumers can discover it and read its documentation.

1. Create a portal first if the organization does not have one. See [Manage Portals](../administer/managing-portals.md).
2. Publish the API. See [Publish an API](../publish-api-proxy/publish-an-api.md).

## Next Steps

- [Security](../develop-api-proxy/security/overview.md) - Control who can invoke the API
- [Attach and Manage Policies](../develop-api-proxy/policy/attach-and-manage-policies.md) - Add capabilities such as rate limiting or header changes to the API
- [Which Credentials You Need](../api-portal/consume-an-api/overview.md) - Generate keys in the API Portal and AI Hub and invoke the API
