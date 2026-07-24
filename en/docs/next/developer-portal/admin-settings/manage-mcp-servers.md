---
title: "Manage MCP servers in the Developer Portal"
description: "Add, edit, publish, deprecate, and delete the MCP servers exposed in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/manage-mcp-servers/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/manage-mcp-servers.md
tags:
  - cloud
  - devportal
  - mcp
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Manage MCP Servers

The **MCP Servers** tab in the Developer Portal's Settings page is where you add, edit, publish, deprecate, and delete the Model Context Protocol (MCP) servers exposed in the portal, alongside your REST/Async/GraphQL/SOAP APIs.

## Adding an MCP Server

1. Navigate to **Settings** and select the **MCP Servers** tab under **CONTENT**.
2. Click **+ Add MCP Server**. This opens the same four-step wizard used for [Manage APIs](manage-apis.md), with **API type** preset to **MCP**.
3. Complete the **Details**, **Spec**, and **Documentation** steps as described in [Manage APIs](manage-apis.md#adding-an-api).

Once the server is created, an additional **Content** step lets you upload a ZIP for its landing-page content, exactly as with a regular API.

## Editing, Publishing, and Deleting

MCP servers share the same row-level actions as APIs:

- Click the **⋮** menu and select **Edit** to reopen the wizard with the server's current details.
- Select **Publish** or **Deprecate** to control its catalog visibility.
- Select **Delete** to remove a single server, or use the checkboxes to select multiple servers and **Delete selected** from the bulk action bar. This removes the server along with its spec and documentation and can't be undone.

## Devportal Mode

If you only want to expose MCP servers (hiding REST/Async/GraphQL/SOAP APIs entirely), or the reverse, see [Devportal Mode](../developer-portal-mode.md).
