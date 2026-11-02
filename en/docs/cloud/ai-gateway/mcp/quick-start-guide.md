---
title: "AI Gateway MCP quick start guide"
description: "Create an AI Gateway and connect an MCP proxy through the AI Workspace UI, then reach it from an MCP client."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-gateway/mcp/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/cloud/ai-gateway/mcp/quick-start-guide.md
tags:
  - cloud
  - ai-gateway
  - mcp
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-03
content_type: "quickstart"
---

# Quick start guide for MCP in AI Gateway

The AI Gateway routes, secures, and observes Model Context Protocol (MCP) traffic to upstream MCP servers. On Cloud, you manage it through [AI Workspace](https://ai-workspace.bijira.dev). You register a gateway runtime, connect an MCP proxy to an upstream server, and deploy the configuration.

This guide is for developers setting up their first MCP Proxy on Cloud. You'll create a gateway, point a Proxy at an existing remote MCP server, and connect an MCP client to interact.

## Before you start

Before going through this quick start guide, make sure you meet the following prerequisites:

- Access to [AI Workspace](https://ai-workspace.bijira.dev/) with the **Admin** or **Developer** role.
- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin. You can check the installed version with the `docker compose version` command.
- `curl` and `unzip` commands available in the command line.
- Port `8443` available on your machine. For more information, see [Default Ports in AI Gateway](../../../ai-gateway/1.2.0/reference/default-ports.md).
- An MCP client to connect with once the proxy is live. This guide doesn't require you to run your own MCP server but uses a sample MCP server instead that's accessible.

## Create an AI Gateway

An AI Gateway entry in AI Workspace represents one gateway runtime. Registering it here gets you a token; you still start the runtime yourself with Docker.

### Step 1: Sign in to AI Workspace

Open [AI Workspace](https://ai-workspace.bijira.dev/) and sign in. Then create an Organization and a Project in your Organization.

### Step 2: Add a gateway

1. Click **AI Gateways** in the left navigation menu.
2. Click **Add Gateway**.
3. Fill in the gateway details:

    | Field | Value |
    |---|---|
    | **Gateway Version** | Keep the latest version, for example `AI-Gateway v1.2` |
    | **Environment** | Select an environment, for example `Development` |
    | **Name** | A unique name for the gateway |
    | **Description** | An optional description of the gateway |
    | **URL** | The gateway URL. The gateway runtime is accessible at this endpoint, for example `https://localhost:8443` |

4. Click **Add AI Gateway**.

The gateway detail screen opens.

### Step 3: Start the gateway runtime

Select the __Quick Start__ tab in the detail page of the newly added gateway's **Get Started** pane. Then follow the instructions on the screen. The terminal commands contain the necessary configuration credentials like the gateway registration token and Moesif key. You don't have to manually generate anything.

1. Download and unzip the gateway distribution:

    ```bash
    curl -sLO https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip && \
    unzip wso2apip-ai-gateway-1.2.0.zip
    ```

2. Run the one-time setup script:

    ```bash
    cd wso2apip-ai-gateway-1.2.0 && ./scripts/setup.sh
    ```

3. Add the control plane settings to the environment file. The setup script in the previous step creates `api-platform.env` with the other settings the gateway needs, so this command appends to it with `cat >>`. Don't create the file with only these three settings, or the gateway can't connect to AI Workspace.

    Copy this command from the **Quick Start** tab on the gateway's detail page. The copied command already contains your Moesif key (`MOESIF_KEY`) and gateway registration token (`APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN`), so you don't need to replace the placeholders shown here:

    ```bash
    cat >> api-platform.env << 'ENVFILE'
    MOESIF_KEY=<your-moesif-key>
    APIP_GW_CONTROLLER_CONTROLPLANE_HOST=connect.bijira.dev
    APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=<your-gateway-token>
    ENVFILE
    ```

4. Start the runtime:

    ```bash
    docker compose --env-file api-platform.env up
    ```

### Step 4: Verify the gateway is active

Return to the gateway's detail page in AI Workspace and refresh it. Once the runtime connects, the status changes from **Inactive** to **Active**. The __AI Gateways__ page listing the available gateways also shows the gateway as __Active__.

## Configure an MCP proxy

An MCP proxy connects the gateway to an upstream MCP server, giving your applications one managed endpoint to reach it through. This guide points the proxy at the **Everything MCP Server** — a public reference server that exercises the whole protocol: tools, prompts, resources, and sampling. You don't need to run anything yourself.

### Step 1: Create a proxy

1. Select **MCP Proxies** in the left navigation menu.
2. Click **Create MCP Proxy**.
3. Provide the **MCP Server URL**. AI Workspace connects to this URL to fetch the server's tools, resources, and prompts. You can use the sample MCP server. If your own MCP server needs static credentials, provide them in **Advanced Configurations**. The sample MCP server requires no credentials.
4. Click **Next**.
5. Fill in the proxy details:

    | Field | Value |
    |---|---|
    | **Name** | A unique name for the proxy, for example `everything-mcp` |
    | **Version** | A version number, for example `v1.0` |
    | **Description** | An optional description of the proxy |
    | **Context** | The base context path. Use the default, or set one, for example `/everything-mcp-server` |
    | **Target** | Pre-filled from the URL you provide in step 3 |

6. Click **Create**.

### Step 2: Deploy the proxy to your gateway

1. Click **Deploy to Gateway**.
2. Click **Deploy** next to the [gateway you created](#create-an-ai-gateway).
3. Wait for the status to change to **Deployed**.

Click __MCP Proxies__ in the navigation menu and click on your MCP Proxy. It opens the Proxy's detail page in the __Overview__ tab.

## Connect an MCP client

### Step 1: Get the proxy URL

On the Proxy's overview page, select your gateway from the **Gateways** dropdown. This shows the base URL for reaching the Proxy through that gateway, in the following format:

```
https://{gateway-host}/{proxy-context}/mcp
```

### Step 2: Connect and try a tool

Add that URL to your MCP client and connect. The Everything MCP Server exposes several tools, including `echo`, which returns whatever message you send it. Try out a few tools to confirm that the connection works end to end, from your client, through the proxy, to the upstream server.

## Next steps

- [Apply Policies to an MCP Proxy](../../ai-workspace/mcp-proxies/apply-policies.md): secure the Proxy you just deployed with authentication, authorization, and access-control policies
- [MCP Authentication](policies/mcp-authentication.md): protect MCP traffic against unauthenticated callers
- [MCP Proxies Overview](../../ai-workspace/mcp-proxies/overview.md): what else a Proxy offers
- [AI Workspace Overview](../../ai-workspace/overview.md): everything else the control plane manages
