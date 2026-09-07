---
title: "Artifact types"
description: "Choose which artifact types—APIs, Model Context Protocol (MCP) servers, and API workflows—the API Portal & MCP Hub serves, via the api_portal.artifacts table in config.toml."
canonical_url: https://wso2.com/api-platform/docs/api-portal/setting-up/artifact-types/
md_url: https://wso2.com/api-platform/docs/api-portal/setting-up/artifact-types.md
tags:
  - cloud
  - api-portal
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "concept"
---

# Artifact types

The API Portal & MCP Hub can serve three artifact types—**APIs**, **Model Context Protocol (MCP) servers**, and **API workflows**. Which of them a portal serves is set by the operator in `configs/config.toml`, under the `[api_portal.artifacts]` table:

```toml
[api_portal.artifacts]
enabled_types = ["apis", "mcp-servers", "api-workflows"]
```

`enabled_types` is an allowlist. Its valid entries are:

| Entry | Serves |
|-------|--------|
| `apis` | REST, WebSocket, GraphQL, WebSub, and SOAP APIs |
| `mcp-servers` | MCP servers |
| `api-workflows` | API workflows |

Any combination is valid. Omit the `[api_portal.artifacts]` section entirely to serve all three—that is the default.

## How it behaves

- **A type you leave out disappears completely.** It gets no navigation entry and no landing-page section, and its routes return `404` rather than rendering an empty page.
- **The order you list types in is the order they appear.** Listing `mcp-servers` first shows MCP servers first in the navigation and in the landing-page heading.
- **Configuration errors fail fast.** An unrecognised entry (for example, a typo) aborts startup with a fatal error, so a mistake can't silently drop a type. An empty list starts the portal but leaves it with nothing to browse, and logs a warning.

## Examples

An API-only portal:

```toml
[api_portal.artifacts]
enabled_types = ["apis"]
```

An MCP-only hub:

```toml
[api_portal.artifacts]
enabled_types = ["mcp-servers"]
```

APIs and MCP servers, without workflows:

```toml
[api_portal.artifacts]
enabled_types = ["apis", "mcp-servers"]
```

## Checking the current setting

In the portal's organization settings, the **Configuration** tab shows an **Artifact types served** field. It is read-only—the value comes from `[api_portal.artifacts]` in `config.toml` and can only be changed there.