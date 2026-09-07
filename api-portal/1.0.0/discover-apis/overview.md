---
title: "APIs in the API Portal & MCP Hub"
description: "What an API is in the API Portal & MCP Hub, the API types it publishes, the two routes APIs take into the catalog, and how they differ from MCP servers."
canonical_url: https://wso2.com/api-platform/docs/api-portal/discover-apis/overview/
md_url: https://wso2.com/api-platform/docs/api-portal/discover-apis/overview.md
tags:
  - cloud
  - api-portal
  - apis
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "concept"
---

# APIs

An **API** is an entry in the portal catalog that a developer can discover, subscribe to, and call from their own application code. Each one carries a contract, a landing page, documentation, and the subscription plans it offers.

APIs sit in the same catalog as MCP servers and share its subscription and credential machinery. What differs is the contract they publish and how a consumer reaches them.

## API types

The portal publishes five API types, each with its own contract format:

| Type | Contract |
|---|---|
| REST | OpenAPI, as `.json`, `.yaml`, or `.yml` |
| WebSocket | AsyncAPI, as `.json`, `.yaml`, or `.yml` |
| WebSub | AsyncAPI, as `.json`, `.yaml`, or `.yml` |
| GraphQL | A GraphQL schema, as `.graphql` or `.gql` |
| SOAP | WSDL, as `.wsdl` or `.xml` |

The type is fixed when the API is created and determines what its detail page shows and which interactive console it offers.

## How APIs differ from MCP servers

An MCP server is another artifact in the same catalog, so most of what you know about APIs carries over. The differences that matter:

| | API | MCP server |
|---|---|---|
| Contract | OpenAPI, AsyncAPI, GraphQL SDL, or WSDL | A definition listing tools, resources, and prompts |
| Catalog page | **APIs** in the sidebar | **MCP Servers** in the sidebar |
| Detail page sections | Endpoints, Resources or Channels, Scopes | MCP Server URL, Tools, Resources, Prompts |
| Interactive console | Try It, or a type-specific tryout client | MCP Playground |
| Consumed by | Application code you write | An MCP client, configured with the server's URL |
| Subscribed | Through an application that holds the credentials | Directly, without an application |
| Agent visibility | The publisher sets it per API | Always agent-visible; the catalog marks every server **AI Ready** |

Everything else works the same way. APIs carry tags, labels, icons, subscription plans, and attached documents, and appear in the portal's [machine-readable endpoints](../ai-agent-discovery.md) when the publisher marks them agent-visible.

!!! note
    A portal only serves APIs when its operator lists `apis` in `enabled_types`. Leave it out and the sidebar entry, the catalog, and every API route disappear. See [Artifact types](../setting-up/artifact-types.md).

## How APIs reach the catalog

Two routes put an API in the catalog.

### Registered by an admin

An admin adds the API through **Settings** → **APIs**, choosing the type, supplying the details and endpoints, uploading the contract, and attaching documentation. See [Manage APIs](../admin-settings/manage-apis.md).

### Created through the Management API

The same artifact can be created programmatically, which is the route automation and CI/CD use. It is also the **only** way to add a SOAP API: the admin wizard's type selector offers no SOAP option, so those are posted with `type: SOAP` and a WSDL definition. See [APIs](../rest-api/apis.md) in the Management API reference.

## Where to go next

- [Browse APIs](browse-apis.md): search the catalog, open an API, and read its specification
- [Which Credentials You Need](../consume-an-api/overview.md): work out what an API expects before you call it

## Related

- [Manage APIs](../admin-settings/manage-apis.md): the admin side of adding and publishing APIs
- [MCP Servers](../mcp-servers/overview.md): the other half of the catalog
- [AI Agent Discovery](../ai-agent-discovery.md): the machine-readable endpoints that expose APIs to agents
- [Artifact types](../setting-up/artifact-types.md): whether this deployment serves APIs
- [Concepts](../concepts.md): how APIs fit alongside MCP servers, plans, subscriptions, and keys