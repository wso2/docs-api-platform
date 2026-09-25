---
title: "Configure an MCP proxy"
description: "Create an MCP proxy from an upstream MCP server URL and deploy it to a gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/mcp-proxies/configure-proxy/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/mcp-proxies/configure-proxy.md
tags:
  - cloud
  - ai-workspace
  - mcp-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Configure an MCP proxy

A Model Context Protocol (MCP) proxy exposes a managed endpoint that your applications use to reach an MCP server. Once deployed, the proxy handles authentication and other access controls.

This guide walks you through creating a proxy and deploying it to a gateway.

## Prerequisites

!!! info "Before you begin"
    - Access to AI Workspace with the **Admin** or **Developer** role.

## Create a new proxy

1. Navigate to **MCP** > **MCP Proxies** in the left navigation menu.

2. Click **+ Create MCP Proxy**.

3. Provide the **MCP Server URL**. AI Workspace connects to that URL and fetches the server information.

    !!! warning "Protected servers"
        If the MCP server is protected with static credentials, provide them under **Advanced Configurations**. AI Workspace uses those credentials when it fetches the server information.

4. Click **Next** to proceed to the next step.

5. Fill in the required proxy details:

    1. **Name** (required): Enter a unique name for the proxy (for example, `mcp-tools-proxy`, `context-server-proxy`). The Proxy ID is auto-generated from the name (lowercase, hyphen-separated).

    2. **Version** (required): The version is pre-filled (for example, `v1.0`). You can edit this if needed.

    3. **Description** (optional): Add a brief description to identify the proxy's purpose.

    4. **Context** (optional): Enter the context path (default: `/`). This is the base path for proxy endpoints (normalized with "/" prefix).

    5. **Target** (required): The MCP server URL the gateway calls. AI Workspace fills this in from the URL you provided in the previous step.

6. Click **Create** to create and save the proxy.

## Deploy proxy to gateway

After creating your proxy, you must deploy it to a gateway before it can be used.

!!! warning "Required step"
    The proxy isn't functional until you deploy it to at least one gateway.

1. Click the **Deploy to Gateway** button in the top-right corner of the proxy details page.

2. The **Deploy to Gateway** page opens, showing all available gateways. Use the search bar to find a specific gateway.

3. Each gateway card displays:
    - **Gateway name** and **status** (Active or Not Active)
    - **Current Deployment** identifier (if previously deployed)

4. Click **Deploy** next to the gateway you want to deploy to.

5. Once deployed, expand the gateway card to view deployment details:

    | Field | Description |
    |-------|-------------|
    | **Deployment Status** | Either Active or Inactive |
    | **Deployment ID** | Unique identifier for the deployment |
    | **Deployed** | The time since deployment |
    | **Stop** | Button to stop an active deployment |

6. The **API Deployment History** panel on the right shows the deployment timeline:
    - Deployment identifier and timestamp
    - Status tags (**Latest**, **Deployed**)

**To stop a deployment:**

Click the **Stop** button next to an active deployment to undeploy the proxy from that gateway.

Click **Back to MCP Proxy** to return to the proxy details page.

!!! info "Deployment status"
    Monitor deployment progress on this page. Changes take effect within seconds of successful deployment.

## Get started

Once the proxy is deployed, the overview page shows the MCP proxy URL.

### Connect with an MCP client

Select a gateway from the **Gateways** dropdown to see the base URL for calling this proxy through that gateway.

The URL follows the format:

```text
https://{gateway-host}/{proxy-context}/mcp
```

## Next steps

- [Apply policies to an MCP proxy](apply-policies.md): govern MCP traffic with access control, authorization, and rewrite policies.