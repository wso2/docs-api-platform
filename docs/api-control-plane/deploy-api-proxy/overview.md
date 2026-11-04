---
title: "Deploy an API"
pagination_label: "Deploy an API"
description: "Deploy an API proxy to a WSO2-managed gateway or a self-hosted gateway so requests can reach the backend through that gateway."
---

Deploying an API proxy places a build on a gateway. After the deployment succeeds, requests can reach the backend through that gateway's invoke URL.

## Prerequisites

- An API proxy that you have already created. See [Create an API](../create-api-proxy/overview.md).
- A gateway in the environment you are deploying to. Create a [self-hosted gateway](../administer/managing-gateways.md#create-a-self-hosted-gateway) or a [managed gateway](../administer/managing-gateways.md#create-a-managed-gateway) first.


## Deploy to a self-hosted gateway

A self-hosted gateway runs on your own infrastructure and connects to the API Control Plane. Create one before you deploy if the environment does not already have one. See [Create a self-hosted gateway](../administer/managing-gateways.md#create-a-self-hosted-gateway).

1. Open the API.
2. In the left navigation menu, click **Deploy**. You can also click **Deploy to Gateway** on the API overview page.
3. For a REST API, in the **Build Area**, click **Deploy**. You can also click **Build and Deploy** if the API still needs a build.
4. In the **Deploy to development** dialog, configure the deployment:

    1. **Select the gateway.** Choose the self-hosted gateway you created.
    2. **Confirm the endpoint URL.** Verify that the backend endpoint is correct.
    3. **Confirm the build.** Review the build details and click **Deploy**.

After the deployment succeeds, the gateway status changes to **Active**. The API overview page lists the gateway under **Deployed gateways** and displays the **Invoke URL**.

## Deploy to a managed gateway

A managed gateway is a gateway that WSO2 hosts and operates. Create one before you deploy if the environment does not already have one. See [Create a managed gateway](../administer/managing-gateways.md#create-a-managed-gateway).

1. Open the API.
2. In the left navigation menu, click **Deploy**. You can also click **Deploy to Gateway** on the API overview page.
3. For a REST API, in the **Build Area**, click **Deploy**. You can also click **Build and Deploy** if the API still needs a build.
4. In the **Deploy to development** dialog, configure the deployment:

    1. **Select the gateway.** Choose the managed gateway you created.
    2. **Confirm the endpoint URL.** Verify that the backend endpoint is correct.
    3. **Confirm the build.** Review the build details and click **Deploy**.

After the deployment succeeds, the gateway status changes to **Active**. The API overview page lists the gateway under **Deployed gateways** and displays the **Invoke URL**.

:::note
If the API is already deployed to a gateway, that gateway remains selected in the deployment configuration. Undeploy the API before clearing that gateway selection.
:::

## Next Steps

- [Test the API](../test-api-proxy/api-console.md) - Invoke the deployed API from the API Console, the GraphQL Console, or cURL
