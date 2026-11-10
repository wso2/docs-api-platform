---
title: "Use the MCP Registry API"
description: "Query the public MCP Registry API to list MCP servers, server versions, and connection details for your organization."
canonical_url: https://wso2.com/api-platform/docs/cloud/mcp-servers/mcp-registry-api/
md_url: https://wso2.com/api-platform/docs/cloud/mcp-servers/mcp-registry-api.md
tags:
  - cloud
  - ai-workspace
  - mcp-registry
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "reference"
---

# Use the MCP Registry API

The MCP Registry API gives AI clients, IDE plugins, and automation tooling programmatic access to your organization's MCP server catalog. Use it to discover available servers, retrieve connection details, and query specific versions.

The discovery endpoints are **public** and require no authentication.

## Base URL

```
https://mcphub.bijira.dev/<org_handle>/registry/v0.1
```

Replace `<org_handle>` with your organization's handle.

## Endpoints

### List all MCP servers

Returns all registered MCP servers for the organization.

```
GET /v0.1/servers
```

**Query parameters**

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Filter servers by name (substring match). |
| `version` | string | Return only servers matching this version. Use `latest` for the latest version of each server. |
| `limit` | integer | Maximum number of results to return (default: 30, max: 100). |
| `cursor` | string | Pagination cursor from a previous response's `metadata.nextCursor`. |
| `updated_since` | string (RFC3339) | Return only servers updated after this timestamp. |

**Example — list all MCP servers for an organization**

```bash
curl https://mcphub.bijira.dev/<org_handle>/registry/v0.1/servers
```

---

### List versions of a server

Returns all registered versions of a specific server, newest first.

```
GET /v0.1/servers/{serverName}/versions
```

The `serverName` path parameter must be URL-encoded (e.g., `myorg%2Fweather-tools`).

---

### Get a specific server version

Returns full metadata for one version of a server, including its capabilities, URLs, and schema.

```
GET /v0.1/servers/{serverName}/versions/{version}
```

Use the special version value `latest` to resolve the most recently published version.

## Response Shape

The response from `GET /v0.1/servers` and the version endpoints follows this structure:

```json
{
  "servers": [
    {
      "name": "weather-tools",
      "version": "1.0.0",
      "description": "Provides weather forecast and historical data tools.",
      "publishedAt": "2026-04-01T10:00:00Z",
      "updatedAt": "2026-04-01T10:00:00Z",
      "versionDetail": {
        "remotes": [
          {
            "type": "streamable-http",
            "url": "https://mcphub.bijira.dev/t/<org_handle>/weather-tools/1.0.0"
          }
        ]
      }
    }
  ],
  "metadata": {
    "count": 1
  }
}
```

`versionDetail.remotes` contains the MCP server URL.

## Pagination

Results are returned in pages of up to 30 (default) or up to 100 (maximum, using the `limit` parameter). `metadata.nextCursor` is only present in the response when there are more results beyond the current page. If all servers fit within the page size, `nextCursor` will not appear in the response.

```bash
curl "https://mcphub.bijira.dev/<org_handle>/registry/v0.1/servers?cursor=<nextCursor>"
```

Continue until `metadata.nextCursor` is absent or empty, which indicates the last page.

## Related Topics

- [What is an MCP Registry?](./mcp-registry.md)
- [Publish MCP Proxies from the AI Workspace](./publish-mcp-proxies.md)
- [Browse the MCP Hub](./browse-mcp-hub.md)