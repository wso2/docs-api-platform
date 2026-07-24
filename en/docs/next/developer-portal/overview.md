---
title: "Developer Portal overview"
description: "The Developer Portal is a self-hosted portal where API publishers expose APIs and MCP servers, and developers discover, subscribe, and consume them."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/overview/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/overview.md
tags:
  - cloud
  - devportal
  - overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "overview"
---

# Developer Portal Overview

The Developer Portal is a self-hosted web application that acts as the front door between your APIs and the developers who consume them. API publishers register APIs and MCP servers in the portal, and developers discover, subscribe, and generate credentials — all without needing direct access to the underlying gateway or infrastructure.

New to the portal's building blocks? See [Concepts](concepts.md) for a glossary of organizations, views, APIs, subscription plans, applications, subscriptions, and API keys.

## What the Developer Portal Manages

### API and MCP Catalog

Browse and search REST, AsyncAPI, GraphQL, and SOAP APIs, as well as MCP servers, with full documentation and a try-out console.

- Full-text search by name, type, version, and description
- Per-API documentation, landing page content, icons, and banners
- Machine-readable discovery (`llms.txt`, per-API Markdown, OpenAPI/AsyncAPI specs) built for AI agent consumption

Learn more in [Discover APIs](discover-apis/api-search.md) and [AI Agent Discovery](discover-apis/ai-agent-discovery.md).

### Developer Applications

Logical containers for OAuth2 credentials. A developer can create multiple applications — for example, one per client or environment — each linked to independent OAuth2 client IDs.

Learn more in [Manage Applications](manage-applications/create-an-application.md).

### Subscriptions and Plans

Developers subscribe directly to an API under a named plan (for example, Gold or Free) that enforces rate limits and quotas. No application is required to subscribe.

Learn more in [Manage Subscriptions](manage-subscriptions/subscribe-to-an-api.md) and, for admins, [Subscription Plans](admin-settings/subscription-plans.md).

### API Keys and OAuth2 Credentials

Generate, rotate, and revoke API keys bound to a specific API. For OAuth2-secured APIs, link a client ID created in a key manager to an application and generate access tokens through the portal.

Learn more in [Manage API Keys](manage-api-keys.md), [Consume an API Secured with OAuth2](consuming-services/consume-an-api-secured-with-oauth2.md), and, for admins, [Key Manager Integration](admin-settings/key-manager-integration.md).

### API Workflows

Multi-step API call sequences authored in [Arazzo format](https://spec.openapis.org/arazzo/latest.html) and published for both human developers and AI agents to discover and follow.

Learn more in [API Workflows](api-workflows/consuming-api-workflows.md).

### Theming

Upload a custom theme (styles, layout, partials, and images) for a view, or reset it back to the built-in default.

Learn more in [Theming](admin-settings/theming.md).

### Admin Settings

The **Settings** page is where admins configure everything above from one place: organization details, views, labels, subscription plans, key managers, the API and MCP catalog, webhooks, LLM instructions, and API workflows.

| Section | Configure |
|---|---|
| [Organization Settings](admin-settings/organization-settings.md) | Display name, business owner contact, IDP reference ID |
| [Manage Views](admin-settings/manage-views.md) | Filtered, branded subsets of the catalog for different audiences |
| [Manage Labels](admin-settings/manage-labels.md) | Tags that control which views an API appears in |
| [Subscription Plans](admin-settings/subscription-plans.md) | Rate/quota tiers applications can subscribe to |
| [Key Manager Integration](admin-settings/key-manager-integration.md) | OAuth2 authorization servers used to issue access tokens |
| [Manage APIs](admin-settings/manage-apis.md) | Add, edit, publish, deprecate, and delete APIs |
| [Manage MCP Servers](admin-settings/manage-mcp-servers.md) | Add, edit, publish, deprecate, and delete MCP servers |
| [Webhook Integration](admin-settings/webhook-integration.md) | Endpoints notified when API keys or subscriptions change |
| [LLM Instructions](admin-settings/llm-instructions.md) | Portal-level context published to `llms.txt` for AI agents |
| [Managing API Workflows](admin-settings/managing-api-workflows.md) | Author, publish, and control visibility of API workflows |
| [Theming](admin-settings/theming.md) | Upload, download, and reset a view's custom theme |

## Gateway-Agnostic, Unified Developer Experience

The portal doesn't embed gateway-specific logic. Instead, it communicates with gateways through a generic webhook event outbox: whenever a developer generates an API key, subscribes, or revokes a key, the portal fires a signed event to every registered gateway subscriber, and each gateway adapter enforces access in its own way.

This means you can:

- Connect multiple gateways of different types to the same portal simultaneously
- Replace or swap a gateway without changing how developers interact with the portal
- Run the portal in a fully standalone mode (no live gateway required) and replay events later

## Views

Within your [organization](admin-settings/organization-settings.md) you can define multiple [views](admin-settings/manage-views.md) for different audiences — for example, one for internal teams and one for external partners.

## Setting Up

Beyond the Docker Compose quick start, a production deployment typically needs:

| Topic | Covers |
|---|---|
| [Integrate Third-Party Identity Providers](setting-up/integrate-identity-providers.md) | OIDC configuration reference, Asgardeo and Keycloak walkthroughs |
| [Devportal Mode](developer-portal-mode.md) | Run in **API Portal**, **MCP Hub**, or **API & MCP Portal** mode |
| [Design Mode](setting-up/design-mode.md) | Develop and preview themes/layouts offline, without a database or IDP |

## References

| Topic | Covers |
|---|---|
| [Management API](rest-api/overview.md) | Full reference for every Developer Portal REST API resource |
| [Get a Bearer Token via curl](references/get-a-bearer-token-via-curl.md) | Scripted/CI access to the REST API under IDP mode |
| [Configurations](references/configurations.md) | Full `config.toml` field reference and environment interpolation |

## Getting Started

To start using the Developer Portal, follow the [Getting Started](getting-started.md) guide.
