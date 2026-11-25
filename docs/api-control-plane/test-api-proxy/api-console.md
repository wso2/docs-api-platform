---
title: "API Console"
pagination_label: "Test with the API Console"
description: "Test a deployed REST API from the Console view in the API Control Plane."
---

The API Console lets you test the REST operations of an API proxy after you deploy it to a gateway.

Follow these steps to test a REST operation from the Console view.

1. Sign in to the [API Control Plane Console](https://console.cloud.choreolabs.com/api-management/).
2. Select the project and API proxy you want to test.
3. In the left navigation menu, click **Test**. **Console view** is selected.
4. Under **Gateway**, select the gateway. The [invoke URL](../../glossary.md#invoke-url) of that gateway appears beside the gateway.
5. Select how the console sends the request:

    - **Through proxy** relays the request through the API Control Plane. This is the default.
    - **Direct** sends the request from your browser to the gateway. Your computer must be able to reach the gateway, and the gateway must allow requests from the console, for example with a [CORS](../../glossary.md#cors) policy.

    If the console can't reach a gateway through the proxy, such as a self-hosted gateway on a private network, select **Direct**.

6. In the endpoint list, select the operation you want to test. To find an operation, type in **Search endpoints**, or select a method such as **GET**.
7. Optional: On the **Params** and **Headers** tabs, set the values for the request.
8. Click **Send**, and check for a `200 OK` status in the **Response** panel. Use the **Body**, **Headers**, and **Request** tabs to inspect the response and the request that the console sent.

    ![Test page with the gateway, the Through proxy and Direct options, the endpoint list, the Send button, and the Response panel](/img/cloud/test-api-proxy/api-console.png)

To download the OpenAPI definition of the API, click **Download OpenAPI**.