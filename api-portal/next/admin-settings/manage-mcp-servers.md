---
title: "Manage MCP servers in the API Portal & MCP Hub"
description: "Add, edit, publish, deprecate, and delete the MCP servers exposed in the API Portal & MCP Hub."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/manage-mcp-servers/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/manage-mcp-servers.md
tags:
  - cloud
  - api-portal
  - mcp
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Manage MCP servers

The **MCP Servers** tab in the API Portal's Settings page manages the Model Context Protocol (MCP) servers the portal exposes. From it you can add, edit, publish, deprecate, and delete a server, singly or in bulk.

MCP servers sit in the same catalog as your REST, WebSocket, GraphQL, and WebSub APIs.

## Adding an MCP server

1. Navigate to **Settings** and select the **MCP Servers** tab under **CONTENT**.
2. Click **+ Add MCP Server**. This opens the same four-step wizard used for [Manage APIs](manage-apis.md), with **API type** preset to **MCP**.
3. Complete the **Details**, **Spec**, and **Documentation** steps as described in [Manage APIs](manage-apis.md#adding-an-api).

One step differs from a regular API. At **Spec**, an MCP server's contract isn't an OpenAPI document—it's a flat, type-tagged list of the tools, resources, and prompts the server exposes:

```yaml
- type: TOOL
  name: search_flights
  description: Find available flights for a given origin, destination, and travel date.
  inputSchema:
    type: object
    properties:
      from: { type: string }
      to: { type: string }
```

`TOOL`, `RESOURCE`, and `PROMPT` entries can be mixed in one file. What you upload here becomes the server's Tools, Resources, and Prompts sections once the server is published. It reaches AI agents only while the server is also agent-visible.

Once the server is created, an additional **Content** step lets you upload a ZIP for its landing-page content, exactly as with a regular API.

## Editing, publishing, and deleting

MCP servers share the same row-level actions as APIs:

- Click the **⋮** menu and select **Edit** to reopen the wizard with the server's current details.
- Select **Publish** or **Deprecate** to control its catalog visibility.
- Select **Delete** to remove a single server, or use the checkboxes to select multiple servers and **Delete selected** from the bulk action bar. This removes the server along with its spec and documentation and can't be undone.

## What developers see

Once published, a server appears in the **MCP Servers** catalog with its tools, resources, and prompts listed, an MCP Playground for trying them, and a client configuration snippet. See [MCP Servers](../mcp-servers/overview.md).

Servers can also be published without the wizard, through the portal's [MCP Registry API](../mcp-registry.md).

## Artifact types

If you only want to expose MCP servers (hiding every other API type entirely), or the reverse, see [Artifact types](../setting-up/artifact-types.md).