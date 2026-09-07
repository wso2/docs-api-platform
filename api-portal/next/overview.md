---
title: "API Portal & MCP Hub overview"
description: "The API Portal & MCP Hub is a portal where API publishers expose APIs and MCP servers, and developers discover, subscribe, and consume them."
canonical_url: https://wso2.com/api-platform/docs/api-portal/overview/
md_url: https://wso2.com/api-platform/docs/api-portal/overview.md
tags:
  - cloud
  - api-portal
  - overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "overview"
---

# API Portal & MCP Hub overview

The API Portal & MCP Hub is a web application that serves a catalog of APIs, MCP servers, and API workflows. It keeps its own database and exposes a Management REST API for everything the UI does. Publishers register artifacts in the portal, and developers browse them, subscribe under a plan, and generate credentials.

The portal issues those credentials without enforcing them: it publishes signed events, and the gateway checks each call—so developers need no access to the gateway or the infrastructure behind it.

New to the portal's building blocks? See [Concepts](concepts.md) for a glossary of the organization, views, labels, APIs, MCP servers, API workflows, subscription plans, applications, subscriptions, and API keys.

## What the API Portal & MCP Hub manages

### API and MCP catalog

Browse and search REST, GraphQL, SOAP, WebSocket, and WebSub APIs, as well as MCP servers, with full documentation and a try-out console.

- Full-text search by name, type, version, and description
- Per-API documentation, landing page content, icons, and banners
- Machine-readable discovery (`llms.txt`, per-API Markdown, OpenAPI/AsyncAPI specs) built for AI agent consumption

Learn more in [Discover APIs](discover-apis/browse-apis.md), [MCP Servers](mcp-servers/overview.md), and [AI Agent Discovery](ai-agent-discovery.md).

### MCP servers

Publish Model Context Protocol servers alongside your APIs, each with its tools, resources, and prompts listed, an MCP Playground for invoking them, and a ready-made client configuration snippet. Servers arrive either through the admin UI or through the portal's implementation of the MCP registry specification.

Learn more in [MCP Servers](mcp-servers/overview.md) and the [MCP Registry API](mcp-registry.md).

### Developer applications

Logical containers for OAuth2 credentials. A developer can create multiple applications—for example, one per client or environment—each linked to independent OAuth2 client IDs.

Learn more in [Manage Applications](consume-an-api/manage-applications.md).

### Subscriptions and plans

Developers subscribe directly to an API or MCP server under a named plan (for example, Gold or Bronze) that enforces rate limits and quotas. No application is required to subscribe.

Learn more in [Manage Subscriptions](consume-an-api/manage-subscriptions.md) and, for admins, [Subscription Plans](admin-settings/subscription-plans.md).

### API keys and OAuth2 credentials

Generate, rotate, and revoke API keys bound to a specific API or MCP server. For OAuth2-secured APIs, link a client ID created in a key manager to an application and generate access tokens through the portal.

Learn more in [Manage API Keys](consume-an-api/manage-api-keys.md), [Consume an API Secured with OAuth2](consume-an-api/oauth2.md), and, for admins, [Key Manager Integration](admin-settings/key-manager-integration.md).

### API workflows

Multi-step API call sequences authored in [Arazzo format](https://spec.openapis.org/arazzo/latest.html) and published for both human developers and AI agents to discover and follow.

Learn more in [API Workflows](api-workflows.md).

### Theming

Give a view its own colors, page shell, header, footer, and page markup by uploading a theme. A theme is a partial copy of the default template tree, so a re-color is one file and everything you omit falls back to the default.

Learn more in [Theming](admin-settings/theming.md), and [Apply a Theme](admin-settings/theming.md) for the upload panel.

### Admin settings

The **Settings** page is where admins configure everything above from one place: organization details, views, labels, subscription plans, key managers, the API and MCP catalog, webhooks, LLM instructions, and API workflows.

| Section | Configure |
|---|---|
| [Organization Settings](admin-settings/organization-settings.md) | Display name, business owner contact, IDP reference ID |
| [Manage Views](admin-settings/manage-views.md) | Filtered, branded subsets of the catalog for different audiences |
| [Manage Labels](admin-settings/manage-labels.md) | Tags that control which views an API or MCP server appears in |
| [Subscription Plans](admin-settings/subscription-plans.md) | Rate/quota tiers applications can subscribe to |
| [Key Manager Integration](admin-settings/key-manager-integration.md) | OAuth2 authorization servers used to issue access tokens |
| [Manage APIs](admin-settings/manage-apis.md) | Add, edit, publish, deprecate, and delete APIs |
| [Manage MCP Servers](admin-settings/manage-mcp-servers.md) | Add, edit, publish, deprecate, and delete MCP servers |
| [Webhook Integration](admin-settings/webhook-integration.md) | Endpoints notified when API keys or subscriptions change |
| [LLM Instructions](admin-settings/llm-instructions.md) | Portal-level context published to `llms.txt` for AI agents |
| [Managing API Workflows](admin-settings/manage-api-workflows.md) | Author, publish, and control visibility of API workflows |
| [Apply a Theme](admin-settings/theming.md) | Upload, download, and reset a view's custom theme |

## Gateway-agnostic, unified developer experience

The portal holds no gateway-specific logic. Instead, it emits signed webhook events: whenever a developer generates an API key, subscribes, or revokes a key, the portal fires a signed HTTP POST to every registered subscriber.

A subscriber is any endpoint you register. Most deployments point it at the Platform API control plane, which verifies the signature, decrypts the credential, persists it, and propagates it to every gateway the API is deployed to. A gateway that consumes the events itself can subscribe directly instead, as can a handler of your own.

This means you can:

- Serve every gateway type your control plane supports, through one integration
- Replace or swap a gateway without changing how developers interact with the portal
- Run the portal standalone, with no live gateway required
- Provision systems beyond a gateway, by registering a handler that acts on the same events

## Views

Within your [organization](admin-settings/organization-settings.md) you can define multiple [views](admin-settings/manage-views.md) for different audiences—for example, one for internal teams and one for external partners.

## Setting up

Beyond the Docker Compose quick start, a production deployment typically needs:

| Topic | Covers |
|---|---|
| [Authentication](setting-up/authentication/overview.md) | Local and OIDC authentication modes, with an Asgardeo identity-provider walkthrough |
| [Artifact types](setting-up/artifact-types.md) | Choose which artifact types—APIs, MCP servers, and API workflows—the portal serves |
| [Design Mode](admin-settings/design-mode.md) | Develop and preview themes/layouts offline, without a database or IDP |

## References

| Topic | Covers |
|---|---|
| [Management API](rest-api/overview.md) | Full reference for every API Portal REST API resource |
| [Get a Bearer Token via curl](references/get-a-bearer-token-via-curl.md) | Scripted/CI access to the REST API under IDP mode |
| [Configurations](references/configurations.md) | Full `config.toml` field reference and environment interpolation |

## Getting started

To start using the API Portal & MCP Hub, follow the [Getting Started](getting-started.md) guide.

For a summary of what this release includes, see [About this release](about-this-release.md).