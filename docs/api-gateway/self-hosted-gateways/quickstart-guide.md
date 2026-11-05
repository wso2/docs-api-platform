---
title: "Quick Start Guide"
pagination_label: "Self-Hosted Gateway Quick Start"
description: "Set up a Self-Hosted Gateway in your own infrastructure and connect it to the API Management Cloud control plane."
---

This guide walks you through setting up a Self-Hosted Gateway in your environment. Follow these quick steps to get your gateway running and connected to the control plane.

:::note
This feature is currently available in the **US region** only.

:::

## Overview

The Self-Hosted Gateway enables you to run the API Gateway in your own infrastructure while maintaining centralized management through the control plane. This guide covers the fastest way to get started.

## Prerequisites

Before you begin, ensure you have:

- **cURL** installed
- **unzip** installed
- **Docker** installed and running (for Quick Start)
- **Docker Compose** installed

## Step 1: Add a Self-Hosted Gateway

Your organization does not have a default gateway, so you add the gateway in the API Control Plane first.

1. Sign in to the [API Control Plane](https://console.bijira.dev).

2. Go to the organization level. In the header, select your organization from the **Organizations** list.

3. In the left navigation menu, click **Gateways**.

4. Click **Add Gateway**.

5. Under **Hosting**, select **Self-hosted**. To see how the hosting options differ, click **Compare options**.

6. Under **Gateway Type**, select **API Gateway**.

7. Enter the following details.

    | Field | Description |
    |:------|:------------|
    | **Name** | Required. A name for the gateway, such as `self-hosted-gateway-1`. The gateway handle is derived from the name, and you cannot change it later. |
    | **Description** | Optional. A description of the gateway. |
    | **Environment** | Required. The environment that the gateway belongs to, such as `development`. |
    | **Gateway Version** | Required. The version of the gateway. The latest version is selected by default. |
    | **URL** | Required. The endpoint that the gateway answers on, such as `https://localhost:8443`. Change it to match your infrastructure. |

8. Click **Add Gateway**.

The console shows a registration token and the commands to set up the gateway on your infrastructure. The gateway stays inactive until it connects to the control plane.

:::note
A self-hosted gateway is never the default gateway of an environment. Select the gateway explicitly when you deploy an API proxy to it.
:::

## Step 2: Set Up and Start the Gateway

1. On the page of the gateway, select how you want to run the gateway, such as **Quick Start**, and follow the steps that the console shows.

    :::note
    Copy the commands from the console, because they include the registration token of your gateway.
    :::

2. When the gateway connects to the control plane, it shows as **Active** on the **Gateways** page, under **Self-hosted gateways**.

## Step 3: Create an API Proxy

:::note
This feature is currently available only for **REST API** proxies that are created from **scratch**, by **importing from OpenAPI**, or by specifying an **endpoint**.

This feature is not currently available for **REST API** proxies created by importing an API contract from **GitHub**, or for **WebSocket**, **GraphQL**, **MCP**, or **Egress** APIs.

:::

In this guide, you will specify a URL to an OpenAPI definition of a sample API to create an API proxy.

1. Navigate to **projects**.

2. To create a new project for your APIs, click **+ Create Project** and follow the setup steps. Otherwise, select **Default** to continue with the default project.

3. Select **Import API Contract**.

4. Select **URL** option and provide the following URL to import the API contract:

    ```text
    https://raw.githubusercontent.com/wso2/bijira-samples/refs/heads/main/reading-list-api/openapi.yaml   
    ```

5. Click **Next** and edit pre-defined values as needed. You can keep the default values for this sample.

6. Select the **Gateway Type** as the **Self-Hosted Gateway**.

7. Click **Create** to create the API Proxy. Wait for the setup to complete and you will be navigated to the API Overview Page.

## Step 4: Deploy the API Proxy

1. Navigate to the **Deploy** page of the API Proxy, and select the self-hosted gateway that you added.

2. Click **Deploy**.

If you change the API proxy later, deploy it again.

## Step 5: Test the API Proxy

1. Navigate to the **Test --> cURL** page of the API Proxy.

2. Use the **cURL** for relevant resource to test the API Proxy.

## Next Steps

- [Add and Manage Policies](./manage-policies.md) - Apply policies to the APIs on your gateway
- [Observability](../observability/overview.md) - Collect the logs and traces of your gateway

## Troubleshooting

If the gateway doesn't connect:

1. **Verify the token**: Ensure the gateway token is correctly set in `keys.env`
2. **Check network connectivity**: The gateway needs outbound HTTPS access to `*.bijira.dev`
3. **View logs**: Run `docker compose logs -f` to see gateway logs
4. **Check firewall**: Ensure port 8443 is accessible

For more troubleshooting help, see Troubleshooting.
