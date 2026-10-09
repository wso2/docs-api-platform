---
title: "What is an MCP registry?"
description: "Understand how the API Platform MCP registry catalogs published MCP proxies and surfaces them through the MCP Hub and MCP Registry API."
canonical_url: https://wso2.com/api-platform/docs/cloud/mcp-servers/mcp-registry/
md_url: https://wso2.com/api-platform/docs/cloud/mcp-servers/mcp-registry.md
tags:
  - cloud
  - ai-workspace
  - mcp-registry
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "concept"
---

# What is an MCP Registry?

An [MCP registry](https://modelcontextprotocol.io/registry/about) is a discovery catalog for MCP servers. It lets AI clients, IDE plugins, and other tooling find available MCP servers by name and version.

A registry stores metadata about each server: its name, version, description, capabilities, and the endpoint URL. Consumers query the registry to discover what servers are available and how to connect to them.

## The API Platform MCP Registry

API Platform includes a built-in MCP registry scoped to each organization. When you publish an MCP proxy from the **AI Workspace**, it is registered in your organization's registry.

The MCP registry is surfaced in two ways:


 - **MCP Registry API**: A REST API for discovery, intended for AI clients, IDE plugins, and automation tooling. It is built on the [MCP Registry API specification](https://modelcontextprotocol.io/registry/about).
 - **MCP Hub**: A visual catalog for browsing and discovering MCP servers registered in your organization. The MCP Hub is powered by the MCP registry.



## Related Topics

- [Publish MCP Proxies from the AI Workspace](./publish-mcp-proxies.md)
- [Browse the MCP Hub](./browse-mcp-hub.md)
- [Use the MCP Registry API](./mcp-registry-api.md)