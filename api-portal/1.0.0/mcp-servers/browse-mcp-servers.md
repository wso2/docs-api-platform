---
title: "Browse MCP servers in the API Portal & MCP Hub"
description: "Browse and search the MCP catalog, read a server's tools, resources, and prompts, and invoke them from the MCP Playground."
canonical_url: https://wso2.com/api-platform/docs/api-portal/mcp-servers/browse-mcp-servers/
md_url: https://wso2.com/api-platform/docs/api-portal/mcp-servers/browse-mcp-servers.md
tags:
  - cloud
  - api-portal
  - mcp
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Browse MCP servers

MCP servers have their own catalog, separate from the API listing but laid out the same way.

## Browse the catalog

Click **MCP Servers** in the sidebar. Each published server gets a card showing:

- Its icon (or initials), title, and version
- An **MCP** badge, and an **AI Ready** badge—every MCP server in the catalog is agent-discoverable
- A **Deprecated** badge, when the server has been deprecated
- The description and any tags
- The number of subscription plans and a **Subscribe** button, when the server has plans
- A **Subscribed** ribbon, when you already hold a subscription

Click a card to open the server.

## Search

Type a term into the search bar and press <kbd>Enter</kbd>. Search works exactly as it does for APIs—one free-text term matched against the server's metadata and tags, and on PostgreSQL against its attached documents too. See [Browse APIs](../discover-apis/browse-apis.md#what-a-search-term-matches) for the details and the per-database differences.

Like the API listing, a catalog covers one [view](../admin-settings/manage-views.md), and a server appears only if one of its labels is mapped to that view.

## Read a server

The server page opens with a header carrying the title, version, **MCP** badge, description, and tags, then splits into a main column and a sidebar.

### Main column

The main column stacks the server's identity and everything it exposes:

| Section | Contents |
|---|---|
| **MCP Server URL** | The server's production URL, with a copy button |
| **Tools** | Every tool the server exposes, each expandable to show its description and input schema as JSON |
| **Resources** | Every resource, with its description, URI, and MIME type |
| **Prompts** | Every prompt, with its description and argument schema |

Each section shows a count in its header and is omitted when the server declares nothing of that kind. The tool, resource, and prompt entries come from the server's definition, so this page is the authoritative list of what an agent can call.

### Sidebar

The sidebar holds an **MCP Server Configuration** snippet—a ready-made JSON block naming the server, its URL, and a bearer token placeholder—with a copy button. Subscription plans appear below it when the server has any. See [Connect to an MCP Server](connect-to-an-mcp-server.md) for what to do with both.

### Header buttons

- **Subscribe**: jumps to the plans in the sidebar. Shown when the server has plans and you aren't subscribed yet
- **Documentation**: opens the documentation page.

## Try tools in the Playground

Click **Documentation** on a server to open its documentation page. The left pane lists a **SPECIFICATION** group containing **MCP Playground**, plus a group for each type of document the publisher attached.

The playground connects to the server's URL and lets you list and invoke its tools interactively. It expects a bearer token, so have one ready—see [Connect to an MCP Server](connect-to-an-mcp-server.md).

Attached documents render in the same pane, exactly as they do for an API. See [API Documentation](../discover-apis/browse-apis.md#read-the-specification-and-try-it) for how that pane works.

## What agents see

Every MCP server in the catalog is exposed through the portal's machine-readable endpoints:

| Endpoint | Returns |
|---|---|
| `/api-portal/{orgName}/views/{viewName}/mcps.md` | Every agent-visible MCP server as one Markdown document |
| `/api-portal/{orgName}/views/{viewName}/mcp/{apiHandle}.md` | One server in Markdown: metadata, plans, attached documents, and its full tool, resource, and prompt list |
| `/api-portal/{orgName}/views/{viewName}/mcp/{apiHandle}/docs/specification.json` | The raw tool, resource, and prompt schema |

Servers also appear in the portal's `llms.txt` index, under an **MCPs** section. See [AI Agent Discovery](../ai-agent-discovery.md).

For programmatic discovery in the Model Context Protocol registry format, use the [MCP Registry API](../mcp-registry.md) instead.

## Related

- [Connect to an MCP Server](connect-to-an-mcp-server.md): credentials and client configuration
- [MCP Servers](overview.md): what an MCP server is and how it reaches the catalog
- [Browse APIs](../discover-apis/browse-apis.md): how catalog search matches terms
- [AI Agent Discovery](../ai-agent-discovery.md): the full set of agent-facing endpoints