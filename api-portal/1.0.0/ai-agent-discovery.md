---
title: "AI agent API discovery"
description: "Expose published APIs, MCP servers, and workflows through llms.txt and machine-readable Markdown endpoints so AI agents can discover and invoke them."
canonical_url: https://wso2.com/api-platform/docs/api-portal/ai-agent-discovery/
md_url: https://wso2.com/api-platform/docs/api-portal/ai-agent-discovery.md
tags:
  - cloud
  - api-portal
  - ai-discovery
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "concept"
---

# AI agent API discovery

The API Portal & MCP Hub has built-in support for AI agent discoverability. Every published API, MCP server, and API workflow is exposed through a set of machine-readable endpoints that AI agents, large language model (LLM)-powered assistants, and agentic frameworks can use to discover, understand, and invoke them without human assistance.

This page explains what those endpoints return and how agents navigate the portal.

Every endpoint below is scoped to an organization handle (`{orgName}`) and a [view](admin-settings/manage-views.md) (`{viewName}`, which is `default` unless an admin has created more views). Responses are plain text or JSON, so agents can fetch them without authentication, JavaScript rendering, or a browser. Only discovery is unauthenticated—invoking an API or MCP server still requires its credentials, a subscription where one applies, and the scopes it declares.

## `llms.txt`: The entry point for agents

The portal generates an `llms.txt` file on every request—a Markdown index designed as the entry point for AI agents. It gives a structured overview of everything the portal exposes for AI consumption.

**Endpoint:**

```text
GET /api-portal/{orgName}/views/{viewName}/llms.txt
```

The file opens with the portal's name and description, both configured through [LLM Instructions](admin-settings/llm-instructions.md). It then lists every agent-visible artifact, grouped into the following sections, with each entry linking to that artifact's own Markdown document:

| Section | Contains |
|---|---|
| API Workflows | Published, agent-visible workflows, each linking to `/api-workflows/{handle}.md` |
| APIs | REST APIs, each linking to `/api/{apiHandle}.md` |
| MCPs | MCP servers, each linking to `/mcp/{apiHandle}.md` |
| GraphQL APIs | GraphQL APIs, each linking to `/api/{apiHandle}.md` |
| Async / WebSocket APIs | WebSocket APIs, each linking to `/api/{apiHandle}.md` |
| WebSub APIs | WebSub APIs, each linking to `/api/{apiHandle}.md` |

A section is omitted when it holds no agent-visible artifacts. An agent that starts at `llms.txt` therefore learns the full scope of the catalog without crawling the portal, which makes it the standard starting point for LLM-native API consumption.

!!! tip
    Portal admins set the name and description that head `llms.txt` under [LLM Instructions](admin-settings/llm-instructions.md). The same page carries the toggle that turns AI discoverability on or off for the whole portal.

## Machine-readable endpoints

Beyond `llms.txt`, the portal serves its catalog, documentation, and specifications as Markdown and raw specification files.

### API and MCP server catalogs

| Endpoint | Description |
|---|---|
| `/api-portal/{orgName}/views/{viewName}/apis.md` | Every agent-visible API, grouped by type, as a single Markdown document |
| `/api-portal/{orgName}/views/{viewName}/mcps.md` | Every agent-visible MCP server as a single Markdown document |

### Per-API and per-MCP-server documentation

| Endpoint | Description |
|---|---|
| `/api-portal/{orgName}/views/{viewName}/api/{apiHandle}.md` | Full documentation for one API, in Markdown |
| `/api-portal/{orgName}/views/{viewName}/mcp/{apiHandle}.md` | Full documentation for one MCP server, in Markdown |
| `/api-portal/{orgName}/views/{viewName}/api/{apiHandle}/docs/{docType}/{docName}.md` | One attached document, as the raw Markdown the publisher uploaded |
| `/api-portal/{orgName}/views/{viewName}/mcp/{apiHandle}/docs/{docType}/{docName}.md` | The same, for an MCP server |

A per-API Markdown document is self-contained. It carries:

- The name, version, description, type, production and sandbox endpoints, tags, and labels
- A subscription plan table listing each plan's rate limits
- Step-by-step authentication instructions for the API's security scheme: OAuth2, API key, or a statement that the API needs no credentials
- Links to every attached document, pointing at the raw Markdown endpoints above
- The full API specification, inlined in a fenced code block, with the live endpoint URLs substituted in

An agent that fetches this one document usually has everything it needs to make a call.

### API specifications

The specification format follows the API type, so each API serves exactly one extension. Requesting any other extension returns `404`.

| API type | Endpoint | Format |
|---|---|---|
| REST | `/api-portal/{orgName}/views/{viewName}/api/{apiHandle}/docs/specification.json` | OpenAPI (JSON) |
| WebSocket, WebSub | `/api-portal/{orgName}/views/{viewName}/api/{apiHandle}/docs/specification.json` | AsyncAPI (JSON) |
| GraphQL | `/api-portal/{orgName}/views/{viewName}/api/{apiHandle}/docs/specification.graphql` | GraphQL schema (SDL) |
| SOAP | `/api-portal/{orgName}/views/{viewName}/api/{apiHandle}/docs/specification.xml` | WSDL (XML) |
| MCP server | `/api-portal/{orgName}/views/{viewName}/mcp/{apiHandle}/docs/specification.json` | Tool, resource, and prompt schema (JSON) |

For REST, WebSocket, and WebSub APIs, the portal substitutes the API's live production and sandbox URLs into the specification it serves, so an agent doesn't have to resolve placeholder server entries.

### API workflows

| Endpoint | Description |
|---|---|
| `/api-portal/{orgName}/views/{viewName}/api-workflows.md` | Every published, agent-visible workflow as a single Markdown document |
| `/api-portal/{orgName}/views/{viewName}/api-workflows/{handle}.md` | One workflow rendered as Markdown, including its steps and links to the APIs it calls |
| `/api-portal/{orgName}/views/{viewName}/api-workflows/{handle}/arazzo.json` | The raw [Arazzo](https://spec.openapis.org/arazzo/latest.html) specification for one workflow |
| `/api-portal/{orgName}/views/{viewName}/api-workflows/{handle}/prompt` | A JSON object holding the workflow's agent prompt, description, raw content, and source APIs |

The `arazzo.json` endpoint returns `404` for a non-Arazzo workflow.

## How agents navigate the portal

A typical agent discovery flow looks like this:

1. **Start at `llms.txt`.** The agent fetches the portal's `llms.txt` for an overview of the available APIs, MCP servers, and workflows.
2. **Browse a catalog.** If the index isn't detailed enough, the agent fetches `apis.md` or `mcps.md` to read every description at once.
3. **Retrieve per-artifact documentation.** Once the agent identifies a relevant API, it fetches `/api/{apiHandle}.md` for the endpoints, authentication steps, plans, and inlined specification.
4. **Read an attached document.** For prose the specification can't express—a getting-started guide, an authentication walkthrough, known limitations—the agent follows the document links in that Markdown file.
5. **Fetch the specification separately.** When the agent needs the specification as a parseable file rather than as inlined text, it retrieves the `specification.*` endpoint for the API's type.
6. **Follow a workflow.** If a published workflow matches the task, the agent retrieves the Arazzo specification and agent prompt, then follows a vetted, step-by-step call sequence instead of reasoning from scratch.

The **Try with AI** button on an [API's overview page](discover-apis/browse-apis.md#open-an-api) hands this flow to an agent directly. It produces a prompt that points the agent at that API's `.md` URL and asks it to summarize the API before doing anything else.

## Visibility controls

Three separate controls decide what agents see:

- **Per-artifact agent visibility.** All published APIs, MCP servers, and workflows are agent-visible by default. Setting an artifact to hidden removes it from `llms.txt`, the catalogs, and every Markdown and specification endpoint, while leaving it visible to human users in the portal. For APIs, see [Make an API AI-Ready](../../cloud/develop-api-proxy/make-api-ai-ready.md). For workflows, see [Managing API Workflows](admin-settings/manage-api-workflows.md).
- **Portal-wide AI discoverability.** Turning off **Portal is AI-discoverable** under [LLM Instructions](admin-settings/llm-instructions.md) makes every endpoint on this page return `404`, including `llms.txt` itself.
- **Served artifact types.** A deployment that doesn't serve a given artifact type returns `404` for that type's catalog, Markdown, and specification endpoints. See [Artifact types](setting-up/artifact-types.md).

## Related

- [LLM Instructions](admin-settings/llm-instructions.md): set the portal name and description at the top of `llms.txt`, and toggle AI discoverability
- [Managing API Workflows](admin-settings/manage-api-workflows.md): publish workflows that guide agents through common multi-step use cases
- [API Workflows](api-workflows.md): how agents discover and follow published workflows
- [Make an API AI-Ready](../../cloud/develop-api-proxy/make-api-ai-ready.md): publisher guidance on descriptions, specifications, and visibility settings
- [MCP Servers](mcp-servers/overview.md): how MCP servers are published, discovered, and connected to
- [MCP Registry API](mcp-registry.md): discover the same servers in the Model Context Protocol registry format