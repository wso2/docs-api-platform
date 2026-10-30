---
title: "Quick Start Guide"
description: "Create a REST API from a backend URL, deploy it to a gateway, test it, and publish it to a Developer Portal."
---

In API Platform Cloud, you can expose an existing HTTP backend through a gateway by creating a REST API proxy. When you start from scratch, you provide a backend URL, and the console generates the initial API details for you. You can then review the API definition, deploy the API to a gateway, test it, and publish it to a Developer Portal.

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
4. Under **Backend endpoint**, enter your backend URL in **Endpoint URL**. To use the sample Reading List API, click **Try with Sample URL**.

    The sample URL is:

    ```text
    https://apis.bijira.dev/samples/reading-list-api-service/v1.0/books
    ```

5. Click **Continue**.
6. On **Configure and create**, review **Basic information** and **Backend endpoint**. The console fills **Name** with `Untitled API` and derives **Identifier** and **Context** from that name.


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

The REST API is added to the project. Its overview lists the generated operations, such as `GET /*`, `POST /*`, `PATCH /*`, and `DELETE /*`, and the backend endpoint.

To view or edit the API definition, open the API and in the left navigation menu click **Develop**, then **Definition**. You can view the OpenAPI definition as **YAML** or **JSON**, or click **Edit** to change the operations.

## Deploy the API to a gateway

Deploy the API so requests can be sent through a gateway.

1. Open the API you created.
2. In the left navigation menu, click **Deploy**. You can also click **Deploy to Gateway** on the API overview.
3. In **Build Area**, click **Build and deploy**.

    The page lists the gateways in the environment, such as **development**.

4. In **Deploy to development**, confirm the deployment:

    1. Under **Gateways**, keep the gateway marked **Default** selected. All selected gateways receive the same build.
    2. Confirm the **Endpoint URL**.
    3. Click **Deploy**.


When the deployment finishes, that gateway is no longer marked **Not deployed**. The API overview lists it under the deployed gateways and shows the invoke URL.

## Test the API

After the API is deployed, test an operation to confirm that requests go through the gateway.

1. Open the API and click **Test** in the left navigation menu.
2. Select the gateway where the API is deployed. The endpoint for that gateway appears next to the gateway selector.
3. Choose one of the following:

    - **Console view:** Expand an operation, such as `GET /books` for the Reading List API. Choose **Through proxy** to send the request through the gateway, or **Direct** to send it to the backend. Click **Execute**. See [API Console](../test-api-proxy/api-console.md).
    - **cURL view:** Select the HTTP method and path, set any query parameters, headers, or request body, and copy the cURL command to run from a terminal. See [cURL](../test-api-proxy/curl.md).

Review the response to confirm that the API behaves as expected.

## Publish the API

Publishing makes the API available in a Developer Portal, where consumers can discover it and read its documentation.

See [Publish an API](../publish-api-proxy/publish-an-api.md).

## Next Steps

- [Secure API Access](../develop-api-proxy/security/secure-api-access/overview.md) - Control who can invoke the API
- [Attach and Manage Policies](../develop-api-proxy/policy/attach-and-manage-policies.md) - Add capabilities such as rate limiting or header changes to the API
- [Consume an API](../developer-portal/consume-an-api.md) - Generate keys in the Developer Portal and invoke the API
