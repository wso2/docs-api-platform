---
title: "Configure an MCP proxy"
description: "Create an MCP proxy from an upstream MCP server URL and deploy it to a gateway."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/mcp-proxies/configure-proxy/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/mcp-proxies/configure-proxy.md
tags:
  - cloud
  - ai-workspace
  - mcp-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Configure an MCP Proxy

An MCP Proxy exposes a managed endpoint that your applications use to reach an MCP Server. Once deployed, the proxy handles authentication and various other access controls.

This guide walks you through creating a proxy and deploying it to a gateway.

## Prerequisites

!!! info "Before You Begin"
    - Access to AI Workspace with **Admin** or **Developer** role

---

## Create a New Proxy

1. Navigate to **MCP** > **MCP Proxies** in the left navigation menu.

2. Click **+ Create MCP Proxy** button.

3. Provide the **MCP Server URL**. Workspace will fetch the server information by connecting with this URL.

    !!! warning "Protected Servers"
        If the MCP Server is protected with a set of static credentials, you can provide them under the **Advanced Configurations** section.
        Workspace will use these credentials when fetching the server information.

4. Click **Next** to proceed to the next step.

5. Fill in the required proxy details:

    1. **Name** (Required): Enter a unique name for the proxy (e.g., `mcp-tools-proxy`, `context-server-proxy`). The Proxy ID is auto-generated from the name (lowercase, hyphen-separated).

    2. **Version** (Required): The version is pre-filled (e.g., `v1.0`). You can edit this if needed.

    3. **Description** (Optional): Add a brief description to identify the proxy's purpose.

    4. **Context** (Optional): Enter the context path (default: `/`). This is the base path for proxy endpoints (normalized with "/" prefix).

    5. **Target** (Required): The MCP Server URL the gateway should call. This will be auto populated based on the URL you provided in the previous step.

6. Click **Create** to create and save the proxy.

---

## Deploy Proxy to Gateway

After creating your proxy, you must deploy it to a gateway before it can be used.

!!! warning "Required Step"
    Your proxy will not be functional until it is deployed to at least one gateway.

1. Click the **Deploy to Gateway** button in the top-right corner of the proxy details page.

2. The **Deploy to Gateway** page opens, showing all available gateways. Use the search bar to find a specific gateway.

3. Each gateway card displays:
    - **Gateway name** and **status** (Active or Not Active)
    - **Current Deployment** identifier (if previously deployed)

4. Click **Deploy** next to the gateway you want to deploy to.

5. Once deployed, expand the gateway card to view deployment details:

    | Field | Description |
    |-------|-------------|
    | **Deployment Status** | Active or Inactive |
    | **Deployment ID** | Unique identifier for the deployment |
    | **Deployed** | Time since deployment |
    | **Stop** | Button to stop an active deployment |

6. The **API Deployment History** panel on the right shows the deployment timeline:
    - Deployment identifier and timestamp
    - Status tags (**Latest**, **Deployed**)

**To stop a deployment:**

Click the **Stop** button next to an active deployment to undeploy the proxy from that gateway.

Click **Back to MCP Proxy** to return to the proxy details page.

!!! info "Deployment Status"
    Monitor deployment progress on this page. Changes take effect within seconds of successful deployment.

---

## Get Started

Once the proxy is deployed, you will see the MCP Proxy URL in the overview page.

### Connect with an MCP Client

Select a gateway from the **Gateways** dropdown to see the base URL for calling this proxy through that gateway.

The URL follows the format:

```
https://{gateway-host}/{proxy-context}/mcp
```

---

## Next Steps

- [Apply Policies](apply-policies.md) - Apply policies for MCP Proxies.