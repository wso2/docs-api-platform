---
title: "Get started with Event Gateway"
description: "Create an Event Gateway in the API Platform Console, deploy a WebSub API proxy, and test it end to end."
canonical_url: https://wso2.com/api-platform/docs/cloud/event-gateway/getting-started/
md_url: https://wso2.com/api-platform/docs/cloud/event-gateway/getting-started.md
tags:
  - cloud
  - event-gateway
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "quickstart"
---

# Getting Started with Event Gateway

This guide walks you through setting up an API Platform Event Gateway in your environment. Follow these quick steps to get your gateway running and connected to API Platform's control plane.

!!! note
    This feature is currently available in the **US region** only.

## Overview

The Event Gateway enables you to run the API Platform Event Gateway in your own infrastructure while maintaining centralized management through API Platform's control plane. This guide covers the fastest way to get started.


## Prerequisites

Before you begin, ensure you have:

- **cURL** installed
- **unzip** installed
- **Docker** installed and running (for Quick Start)
- **Docker Compose** installed

## Create an Event Gateway in API Platform Console

1. Sign in to [API Platform Console](https://console.bijira.dev).
2. Go to **Organization Level** in API Platform.
3. From the left navigation, select **Admin** → **Gateways**.

4. Select the **API Platform** tab.
5. Click **+ Add Self-Hosted Gateway**.
6. Select **Event Gateway** as the Type.
7. Provide the following details:

    - **Name**: A unique name for your gateway
    - **Description**: Optional description
    - **URL**: The URL where your gateway will be accessible (e.g., `https://localhost:8443`)
    - **Associated Environment**: Select the environment for this gateway

8. Click **Add** and you will be navigated to the Gateway View Page.

## Setup Gateway

1. Next, download, set up, and start the gateway on your machine by following the steps in the **Quick Start** section or the detailed instructions below (Steps 1–4).

    !!! note
        Be sure to copy the commands from the Quick Start section, since the keys are auto-generated for you.

### Step 1: Download the Gateway

Run this command in your terminal to download the gateway:

```bash
curl -sLO https://github.com/wso2/api-platform/releases/download/event-gateway/v0.8.0/wso2apip-event-gateway-0.8.0.zip && \
unzip wso2apip-event-gateway-0.8.0.zip
```

### Step 2: Configure the Gateway

Run this command to create the gateway configuration with your environment variables:

```bash
cat > wso2apip-event-gateway-0.8.0/configs/keys.env << 'ENVFILE'
GATEWAY_CONTROLPLANE_HOST=connect.bijira.dev
GATEWAY_REGISTRATION_TOKEN=<your-gateway-token>
ENVFILE
```

Once you copy the above command from the screen, the `<your-gateway-token>` placeholder will be populated and the `wso2apip-event-gateway-0.8.0/configs/keys.env` file will be created with these environment variables.

### Step 3: Start the Gateway

Navigate to the gateway directory and start it using Docker Compose:

```bash
cd wso2apip-event-gateway-0.8.0
docker compose --env-file configs/keys.env up
```

### Step 4: Verify the Gateway

Check that the gateway is running and connected:

```bash
# Check container status
docker compose ps

# Check gateway health
curl http://localhost:9002/health
```

The gateway should show as **Active** in the API Platform Console under **Gateways**.

## Add API and Invoke

!!! note
    This feature is currently available only for **WEBSUB** API proxies.

### Step 1: Create an API Proxy.

In this guide, you will create a WEBSUB API proxy to route through the Event Gateway.

1. Navigate to **projects**.

2. To create a new project for your APIs, click **+ Create Project** and follow the setup steps. Otherwise, select **Default** to continue with the default project.

3. Select the WEBSUB API type.

4. Provide the required details for the WEBSUB API proxy and click **Next**.

5. Select the **Gateway Type** as the **Self-Hosted Gateway**.

6. Click **Create** to create the API Proxy. Wait for the setup to complete and you will be navigated to the API Overview Page.

### Step 2: Deploy the API Proxy (Optional)

!!! note
    This step is **optional** at this stage, as the API is deployed to the gateway by default. However, if you make any changes to the API, you must redeploy it.

    To redeploy, navigate to the **Deploy page** of the API Proxy and click **Deploy**.

1. Navigate to the **Deploy** page of the API Proxy.

2. Click **Deploy**.

## Test the API Proxy

1. Navigate to the **Test** page of the API Proxy.

2. Use the available test client for the relevant resource to test the API Proxy.

## Next Steps

Your Event Gateway is now running! Here's what to do next:

## Alternative Deployment Options

For production environments or specific infrastructure requirements, see the detailed configuration guide:

- [Setting Up](setting-up.md): Configure on Virtual Machine, Docker, or Kubernetes with tabs for each infrastructure option

## Troubleshooting

If the gateway doesn't connect:

1. **Verify the token**: Ensure the gateway token is correctly set in `keys.env`
2. **Check network connectivity**: The gateway needs outbound HTTPS access to `*.bijira.dev`
3. **View logs**: Run `docker compose logs -f` to see gateway logs
4. **Check firewall**: Ensure port 8443 is accessible

For more troubleshooting help, see [Troubleshooting](troubleshooting.md).