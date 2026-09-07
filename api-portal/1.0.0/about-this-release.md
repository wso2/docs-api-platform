---
title: "About this release"
description: "What's included in API Portal & MCP Hub 1.0.0: the API and MCP catalog, API workflows, MCP registry, applications, authentication, theming, and the admin UI."
canonical_url: https://wso2.com/api-platform/docs/api-portal/about-this-release/
md_url: https://wso2.com/api-platform/docs/api-portal/about-this-release.md
tags:
  - cloud
  - api-portal
  - release-notes
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-04
content_type: "release-notes"
---

# About this release

The API Portal & MCP Hub is a web application that serves a catalog of APIs, Model Context Protocol (MCP) servers, and API workflows. Publishers register artifacts in it, and developers browse them, subscribe to plans, generate credentials, and call the APIs. It is a standalone product: it runs as its own distribution, keeps its own database, authenticates against your identity provider, and reaches gateways through signed webhook events rather than a fixed control-plane binding.

**API Portal & MCP Hub 1.0.0** is the first **API Portal & MCP Hub release**. Every capability listed below is available for the first time, so there is no predecessor to upgrade from.

For more information on the API Portal & MCP Hub, see the [overview](overview.md).

## Downloads

Download the standalone distribution from the WSO2 API Platform release page:

```bash
curl -sLO https://github.com/wso2/api-platform/releases/download/api-portal%2Fv1.0.0/wso2apip-api-portal-1.0.0.zip && \
unzip wso2apip-api-portal-1.0.0.zip
```

To install and run it, follow the [Getting started](getting-started.md) guide.

## New features

??? note "API and MCP server catalog"

    A single catalog serves APIs and MCP servers side by side, so the portal doubles as an MCP Hub with MCP servers as first-class entries rather than a secondary artifact type.

    - **Unified browsing and search**: Find APIs and MCP servers by name, description, label, or view.
    - **Views**: Group artifacts into separate catalog surfaces, each with its own theme and audience.
    - **Labels**: Tag and filter artifacts across views.
    - **Per-artifact documentation**: Publish specifications, guides, and custom content next to each entry.

    **[Learn more](discover-apis/browse-apis.md)**

??? note "API workflows"

    Multi-step, guided API workflows are a first-class catalog artifact alongside APIs and MCP servers, so a sequence of calls that achieves one outcome can be published as a single discoverable unit.

    - **Guided consumption**: Present an ordered sequence of API calls with the context a consumer needs at each step.
    - **Catalog parity**: Workflows carry the same views, labels, and documentation as APIs.
    - **Selective serving**: Include or exclude workflows per instance through `[api_portal.artifacts] enabled_types`.

    **[Learn more](api-workflows.md)**

??? note "MCP Server Registry API"

    A programmatic registry lets agents and tooling enumerate the MCP servers a portal publishes, without scraping the catalog UI.

    - **Machine-readable discovery**: Query published MCP servers and their connection details over HTTP.
    - **Agent-oriented**: Intended for MCP clients and agent frameworks that resolve servers at runtime.

    **[Learn more](mcp-registry.md)**

??? note "AI agent discovery"

    The portal publishes `llms.txt` entry points at its root and per view, pairing with the MCP registry so an AI agent can discover what a portal offers programmatically.

    - **`llms.txt` entry points**: Machine-readable indexes of the APIs, MCP servers, and workflows a view serves.
    - **Administrator-authored guidance**: Supply instructions that shape how large language models (LLMs) interpret the catalog.

    **[Learn more](ai-agent-discovery.md)**

??? note "Applications, subscriptions, and API keys"

    Consumers self-serve the credentials they need, from creating an application through calling a secured API in the browser.

    - **Applications**: Create and manage applications that hold credentials.
    - **Subscriptions**: Subscribe applications to artifacts under a chosen subscription plan.
    - **API keys and subscription tokens**: Generate, view, and revoke both credential types.
    - **Try It console**: Call an API from the catalog page, through a same-origin proxy that avoids per-backend cross-origin resource sharing (CORS) configuration.

    **[Learn more](consume-an-api/overview.md)**

??? note "Local and OIDC authentication"

    The portal authenticates users in one of two modes, selected by `[api_portal.auth] mode`, so an evaluation needs no identity provider while production delegates login to one.

    - **Platform API-backed local authentication**: The built-in login form validates credentials against the Platform API control plane and receives a signed JSON Web Token (JWT).
    - **OpenID Connect (OIDC) authentication**: Delegate login to any OIDC-compliant identity provider, with the portal acting as a confidential client.
    - **Configurable claim mappings**: Name the claims that carry organization, role, and group information, including dot-separated paths into nested claims.
    - **Role or scope authorization**: Expand a token's roles through a grant table, or read `dp:*` scopes the identity provider mints directly.

    **[Learn more](setting-up/authentication/overview.md)**

??? note "Theming"

    Portal appearance is operator-controlled, from global styling down to individual API landing pages.

    - **Global theming**: Set colors, styling, and logos for the portal.
    - **Per-view layouts**: Upload page layouts that apply to a single view.
    - **Per-API styling**: Apply custom styling to an individual API's landing page.

    **[Learn more](admin-settings/theming.md)**

??? note "Design mode"

    A file-based preview renders the whole portal from sample files on disk, opening no database connection and making no Platform API calls.

    - **No infrastructure**: Preview APIs, MCP servers, applications, and theming without standing up the full stack.
    - **Content and theme authoring**: Iterate on layouts and catalog content directly from disk.

    **[Learn more](admin-settings/design-mode.md)**

??? note "Webhook-based event integration"

    The portal emits signed events for credential and plan changes rather than holding gateway-specific logic. Most deployments subscribe the Platform API control plane, which propagates each change to the gateways the API is deployed to.

    - **Signed delivery**: Events for API key, application, and subscription plan changes carry a signature the subscriber verifies, and credential fields arrive encrypted.
    - **Control plane integration**: Register the Platform API as a subscriber and it persists each credential and pushes it out to every gateway serving the API. A gateway or a handler of your own can subscribe directly instead.
    - **Per-organization subscribers**: Register receivers through the Settings UI or the Management API rather than static configuration, so your own handler can subscribe alongside the control plane.

    **[Learn more](admin-settings/webhook-integration.md)**

??? note "Admin UI and Management API"

    A dedicated administrative interface, backed by a documented REST API, manages everything an operator configures at runtime.

    - **Organization and catalog administration**: Manage the organization, views, labels, the API and MCP server catalog, and API workflows.
    - **Consumption policy**: Manage subscription plans, key managers, and webhook subscribers.
    - **Management API**: Drive the same operations programmatically, guarded per operation by `dp:*` scopes.

    **[Learn more](admin-settings/organization-settings.md)**

## Improvements

None. This is the first release, so there is no earlier behavior to improve on.

## Compatible product versions

The API Portal & MCP Hub shares a control plane with AI Workspace. The following product version was tested with this release:

| Product | Compatible version |
|---------|--------------------|
| WSO2 AI Workspace | 1.0.0 |

The distribution bundles the Platform API control plane so the local-auth quickstart works out of the box, and the two are versioned and shipped together—no separate compatibility check is needed. A production deployment that authenticates against an identity provider doesn't need it: the portal's only outbound call to a Platform API is the local-auth login. Full prerequisites are listed in the [Getting started](getting-started.md) guide.

## Key changes

None. There is no earlier release to migrate a deployment from.

## Deprecations

None.

## Fixed issues

None recorded against a released version, since this is the first release.

## Known issues

- [API Portal & MCP Hub](https://github.com/wso2/api-platform/issues?q=is%3Aissue+is%3Aopen+label%3AArea%2FDeveloperPortal)