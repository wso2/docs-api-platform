---
title: "MCP servers in the API Portal & MCP Hub"
description: "What an MCP server is in the API Portal & MCP Hub, the two routes servers take into the catalog, and how they differ from APIs."
canonical_url: https://wso2.com/api-platform/docs/api-portal/mcp-servers/overview/
md_url: https://wso2.com/api-platform/docs/api-portal/mcp-servers/overview.md
tags:
  - cloud
  - api-portal
  - mcp
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "concept"
---

# MCP servers

A Model Context Protocol (MCP) server exposes capabilities an AI agent can call directly: **tools** it can invoke, **resources** it can read, and **prompts** it can reuse.

The API Portal & MCP Hub publishes MCP servers next to your APIs. They share the same catalog, subscription, and credential machinery—this is the "MCP Hub" half of the product.

## How MCP servers differ from APIs

An MCP server is stored as another artifact in the same catalog, so most of what you know about APIs carries over. The differences that matter:

| | API | MCP server |
|---|---|---|
| Contract | OpenAPI, AsyncAPI, GraphQL SDL, or WSDL | A definition listing tools, resources, and prompts |
| Catalog page | **APIs** in the sidebar | **MCP Servers** in the sidebar |
| Detail page sections | Endpoints, Resources or Channels, Scopes | MCP Server URL, Tools, Resources, Prompts |
| Interactive console | Try It, or a type-specific tryout client | MCP Playground |
| Consumed by | Application code you write | An MCP client, configured with the server's URL |
| Agent visibility | Publisher sets it per API | Always agent-visible; the catalog marks every server **AI Ready** |

Everything else works the same way. MCP servers carry tags, labels, icons, subscription plans, and attached documents, appear in the portal's [machine-readable endpoints](../ai-agent-discovery.md), and are subscribed to directly rather than through an application.

!!! note
    A portal only serves MCP servers when its operator lists `mcp-servers` in `enabled_types`. Leave it out and the sidebar entry, the catalog, and every MCP route disappear. See [Artifact types](../setting-up/artifact-types.md).

## How servers reach the hub

Two routes put an MCP server in the catalog, and which one was used affects what you see.

### Registered by an admin

An admin adds the server through **Settings** → **MCP Servers**, using the same wizard as an API with the type preset to MCP. They supply the details, upload the definition listing the tools, resources, and prompts, and attach documentation. See [Manage MCP Servers](../admin-settings/manage-mcp-servers.md).

The same thing happens when a server is created on a gateway and pushed to the portal—the artifact carries a reference back to that gateway proxy.

### Published through the MCP registry

A client posts the server to the portal's registry API, an implementation of the Model Context Protocol registry specification. The portal stores the result as a catalog artifact exactly like any other MCP server, mapped to the `default` label so it shows up in views that include it.

Registry-published servers are identified by a reverse-DNS name such as `example.com/travel-assistant` rather than by a gateway reference, and they get one entry per version. Their generated Markdown documentation also omits the authentication walkthrough that other artifacts carry, because the registry payload doesn't describe a security scheme.

See [MCP Registry API](../mcp-registry.md).

## Where to go next

- [Browse MCP Servers](browse-mcp-servers.md): browse the catalog, read a server's tools, and try them in the playground
- [Connect to an MCP Server](connect-to-an-mcp-server.md): subscribe, get credentials, and point an MCP client at the server
- [MCP Registry API](../mcp-registry.md): the discovery and publishing endpoints

## Related

- [Manage MCP Servers](../admin-settings/manage-mcp-servers.md): the admin side of adding and publishing servers
- [AI Agent Discovery](../ai-agent-discovery.md): the machine-readable endpoints that expose MCP servers to agents
- [Artifact types](../setting-up/artifact-types.md): whether this deployment serves MCP servers
- [Concepts](../concepts.md): how MCP servers fit alongside APIs, plans, subscriptions, and keys