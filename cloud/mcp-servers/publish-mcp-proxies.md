---
title: "Publish MCP proxies to the MCP Hub"
description: "Publish a deployed MCP proxy from AI Workspace to make it discoverable through the MCP Hub and MCP Registry API."
canonical_url: https://wso2.com/api-platform/docs/cloud/mcp-servers/publish-mcp-proxies/
md_url: https://wso2.com/api-platform/docs/cloud/mcp-servers/publish-mcp-proxies.md
tags:
  - cloud
  - ai-workspace
  - mcp-registry
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Publish MCP Proxies

Once you have [configured and deployed an MCP proxy](../ai-workspace/mcp-proxies/configure-proxy.md) in the AI Workspace, you can publish it to the MCP Hub. Publishing registers the proxy in your organization's MCP registry, making it discoverable through the MCP Hub and the MCP Registry API.

## Publish to MCP Hub

1. In the AI Workspace, open the MCP proxy you want to publish.
2. Click **Publish to MCP Hub**.

    ![MCP Everything Server proxy overview with Deploy to Gateway and Publish to MCP Hub buttons in the top right](../../assets/img/ai-gateway/ai-workspace/mcp-proxies/publish.png)

The proxy is registered in your organization's MCP registry and becomes immediately discoverable through the [MCP Hub](./browse-mcp-hub.md) and the [MCP Registry API](./mcp-registry-api.md).

## Related Topics

- [What is an MCP Registry?](./mcp-registry.md)
- [Browse the MCP Hub](./browse-mcp-hub.md)
- [Use the MCP Registry API](./mcp-registry-api.md)