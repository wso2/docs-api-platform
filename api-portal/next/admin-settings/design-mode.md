---
title: "Design Mode"
description: "Develop and preview API Portal layouts and themes offline, without a running database or identity provider."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/design-mode/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/design-mode.md
tags:
  - cloud
  - api-portal
  - theming
  - design-mode
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-05
content_type: "how-to"
---

# Design mode

Design mode lets you develop and preview API page layouts and org-level themes without a running database or an identity provider. The portal starts with sample data loaded from disk and serves all pages anonymously—login, API key generation, and subscription management are disabled.

!!! danger "Local development only"
    Design mode disables login, serves every page anonymously, and runs on plain HTTP with no TLS. Never expose an instance running in design mode to untrusted users or to a network you don't control.

## When to use design mode

Use design mode when you want to:

- Iterate on a [theme](theming.md)—styles, layout, partials, or page templates—and see each change on reload
- Work on a page design without standing up a database, an identity provider, or a gateway
- Demo the portal against a fixed set of sample APIs, MCP servers, and applications

## Enable design mode

The section is commented out in `configs/config-template.toml`. Copy the whole block into your active `configs/config.toml` and uncomment it:

```toml
[api_portal.design_mode]
enabled = true
path_to_layout = "./src/defaultContent/"      # Handlebars templates and static assets
api_samples_path = "./samples/apis/"          # directory of sample API definitions
mcp_samples_path = "./samples/mcps/"          # directory of sample MCP server definitions
subscription_plans_path = "./samples/subscription-plans.yaml"
applications_path = "./samples/applications.yaml"
```

The sample paths are relative to the app's working directory, where the bundled `samples/` already lives—leave them as they are unless you're pointing at your own sample set.

Then restart the API Portal:

```bash
docker compose restart api-portal
```

Visit `http://localhost:9543/api-portal/views/default`.

!!! note
    The portal always starts on plain HTTP in design mode—no TLS certificate setup required.

## Configuration options

All six keys live under `[api_portal.design_mode]`:

| Option (TOML) | Default | Description |
|---|---|---|
| `enabled` | `false` | Set to `true` to activate design mode |
| `api_samples_path` | `./samples/apis/` | Directory of sample REST/GraphQL/SOAP/WS API definitions |
| `mcp_samples_path` | `./samples/mcps/` | Directory of sample MCP server definitions |
| `subscription_plans_path` | `./samples/subscription-plans.yaml` | YAML file with org-level subscription plan details |
| `applications_path` | `./samples/applications.yaml` | YAML file with sample applications shown on the Applications page |
| `path_to_layout` | `./src/defaultContent/` | Layout directory used to render pages |

!!! note
    There's no `APIP_AP_*` environment variable that maps onto these keys. To drive one from the environment, write an interpolation token into `config.toml`—`path_to_layout = '{{ env "MY_THEME_DIR" "./src/defaultContent/" }}'`. See [Configurations](../references/configurations.md).

## Working on a theme

Design mode exists mainly to iterate on a theme without a running stack. Point `path_to_layout` at your theme directory, edit files, and reload the browser—no server restart needed.

```toml
[api_portal.design_mode]
enabled = true
path_to_layout = "./my-theme/"
```

To preview the example theme from [Theming](theming.md#example-a-teal-and-coral-theme), use `./samples/layouts/green-theme/`.

For what a theme contains, which files you can override, how the color tokens work, and how to package one for upload, see [Theming](theming.md). Design mode and the production theme upload use the same directory structure, so a theme built here deploys without conversion.

## Sample APIs and MCP servers

APIs and MCP servers live in separate directories. The directory name becomes the handle used in the URL.

```
samples/
├── apis/                          # REST, GraphQL, SOAP, WS APIs  →  /views/default/apis
│   ├── ping-api-v1.0/
│   │   ├── api.yaml
│   │   ├── definition.yml
│   │   └── docs/
│   └── …
└── mcps/                          # MCP servers  →  /views/default/mcps
    ├── travel-assistant-mcp-v1/
    │   ├── api.yaml
    │   ├── definition.yaml
    │   └── docs/
    └── …
```

### `api.yaml` format (REST API)

```yaml
apiVersion: api-portal.api-platform.wso2.com/v1
kind: RestApi

metadata:
  name: my-api-v1.0          # used as the URL handle: /views/default/api/my-api-v1.0

spec:
  type: REST                  # REST | WS | GRAPHQL | SOAP | WEBSUB
  displayName: My API
  version: v1.0
  description: A short description shown on the API card.
  status: PUBLISHED

  tags:
    - payments

  subscriptionPlans:       # leave empty [] if no subscription plans
    - Gold
    - Silver

  endpoints:
    sandboxUrl: http://localhost:8080/my-api
    productionUrl: https://api.example.com/my-api
```

### `api.yaml` format (MCP server)

```yaml
apiVersion: api-portal.api-platform.wso2.com/v1
kind: MCP

metadata:
  name: my-mcp-v1.0

spec:
  type: MCP
  displayName: My MCP Server
  version: 1.0.0
  description: MCP server exposing tools for AI agents.
  status: PUBLISHED

  tags:
    - mcp

  subscriptionPlans:
    - Gold

  endpoints:
    productionUrl: https://mcp.example.com
```

The `definition.yaml` alongside `api.yaml` defines the tools, resources, and prompts the server exposes, as a flat list of type-tagged entries:

```yaml
- type: TOOL
  name: search_flights
  description: Search for available flights between two cities.
  inputSchema:
    type: object
    properties:
      origin: { type: string }
      destination: { type: string }
```

### Live reload

The portal re-reads API definitions from disk on every page request. Edit `api.yaml` or any doc file, then reload the browser—no server restart needed.

## Sample applications

The Applications page is available in design mode and shows entries from `applications_path`. The format follows the same Kubernetes-style manifest used across all sample files:

```yaml
apiVersion: api-portal.api-platform.wso2.com/v1
kind: ApplicationList
items:

  - metadata:
      name: my-app

    spec:
      displayName: My App
      description: A short description shown on the application card.
```

`metadata.name` becomes the application ID. Creating new applications, viewing individual application details, and managing keys aren't available in design mode.

## What is disabled in design mode

Design mode turns off everything that needs a database or an identity provider:

| Feature | Status |
|---|---|
| Login / IDP authentication | Disabled—all pages are served anonymously |
| API subscriptions | Disabled |
| Creating / deleting applications | Disabled—Applications page is read-only |
| Individual application details | Disabled |
| API key generation | Disabled |
| Database | Not required—no connection is attempted |
| TLS / HTTPS | Not used—server always starts on plain HTTP |

## Turning design mode off

Set `enabled = false` (or remove the section entirely) in `configs/config.toml`:

```toml
[api_portal.design_mode]
enabled = false
```

Then restart:

```bash
docker compose restart api-portal
```

The portal returns to production mode, requiring a database and (if configured) an IDP.

## Related

- [Theming](theming.md): what a theme contains, the color tokens, and how to package one
- [Apply a Theme](../admin-settings/theming.md): upload a finished theme to a view
- [Configurations](../references/configurations.md): the full `config.toml` reference