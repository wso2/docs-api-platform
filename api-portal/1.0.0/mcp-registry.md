---
title: "MCP Registry API"
description: "Discover and publish MCP servers through the API Portal & MCP Hub's implementation of the Model Context Protocol registry specification."
canonical_url: https://wso2.com/api-platform/docs/api-portal/mcp-registry/
md_url: https://wso2.com/api-platform/docs/api-portal/mcp-registry.md
tags:
  - cloud
  - api-portal
  - mcp
  - rest-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "reference"
---

# MCP registry API

The portal implements the [Model Context Protocol registry specification](https://modelcontextprotocol.io/), so MCP-aware tooling can discover the servers it publishes and push new ones without going through the portal UI or the Management API.

A server published through the registry becomes an ordinary catalog artifact: it appears under **MCP Servers**, can be subscribed to, and shows up in the portal's agent-facing endpoints. See [MCP Servers](overview.md).

## Base path

Every endpoint is scoped to an organization handle, and two mount paths serve the same router:

```text
/api-portal/registry/{orgHandle}/v0.1/...
/api-portal/{orgHandle}/registry/v0.1/...
```

Requests naming an organization this instance doesn't serve get a JSON `404`. Responses are JSON throughout, including errors, which take the shape `{"error": "..."}`.

Cross-origin `GET` requests are allowed from any origin, so a browser-based MCP client can read the discovery endpoints directly.

## Discovery endpoints

These three need no authentication.

### List servers

```text
GET /api-portal/registry/{orgHandle}/v0.1/servers
```

Four query parameters control paging and filtering:

| Query parameter | Effect |
|---|---|
| `limit` | Page size. Defaults to 30, capped at 100 |
| `cursor` | Opaque cursor from a previous response's `metadata.nextCursor` |
| `search` | Case-insensitive substring match against the server's name |
| `include_deleted` | Set to `true` to include servers whose status is `deleted`. Defaults to `false` |

Servers come back newest-published first, with servers that have no publish timestamp last. The response wraps the page in a `metadata` object:

```json
{
  "servers": [ { "server": { }, "_meta": { } } ],
  "metadata": {
    "count": 30,
    "nextCursor": "eyJvZmZzZXQiOjMwfQ"
  }
}
```

`nextCursor` is present only when more results exist. Pass it back as `cursor` to fetch the next page. A cursor the portal can't decode returns `400`.

### List a server's versions

```text
GET /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/versions
```

Returns every version of one server, newest first. `include_deleted` works as above. URL-encode the slash in `{serverName}`—`example.com/travel-assistant` becomes `example.com%2Ftravel-assistant`.

### Get one version

```text
GET /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/versions/{version}
```

Returns a single version, including its tools, resources, and prompts. Deleted versions return `404` unless you pass `include_deleted=true`.

## Response shape

Every endpoint returns the same object per server:

```json
{
  "server": {
    "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
    "name": "example.com/travel-assistant",
    "title": "Travel Assistant MCP",
    "version": "1.0.0",
    "description": "MCP server for travel planning tools.",
    "remotes": [
      { "type": "streamable-http", "url": "https://your-mcp-host.example.com" }
    ]
  },
  "_meta": {
    "io.modelcontextprotocol.registry/official": {
      "status": "active",
      "publishedAt": "2026-07-31T09:12:04.000Z",
      "updatedAt": "2026-07-31T09:12:04.000Z",
      "isLatest": true
    },
    "io.api-platform/mcp-capabilities": {
      "tools": [],
      "resources": [],
      "prompts": []
    }
  }
}
```

Notes on the fields:

- `remotes` falls back to a single `streamable-http` entry built from the server's production URL when the stored payload declares none.
- `status` is one of `active`, `deprecated`, or `deleted`, mapping to the portal's published, deprecated, and deleted states.
- `io.api-platform/mcp-capabilities` is a WSO2 extension and is present only on responses that load the server's schema—the list endpoint omits it, so fetch a specific version when you need the tool list.

## Publishing endpoints

These require a bearer token or an authenticated local-auth session, and the same `dp:mcp_server:*` scopes as the equivalent Management API operations. `dp:mcp_server:manage` satisfies any of them.

| Endpoint | Scope |
|---|---|
| `POST /api-portal/registry/{orgHandle}/v0.1/publish` | `dp:mcp_server:create` to create, `dp:mcp_server:update` to update |
| `PUT /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/versions/{version}` | `dp:mcp_server:update` |
| `DELETE /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/versions/{version}` | `dp:mcp_server:delete` |
| `PATCH /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/versions/{version}/status` | `dp:mcp_server:update` |
| `PATCH /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/status` | `dp:mcp_server:update` |

### Publish a server

```text
POST /api-portal/registry/{orgHandle}/v0.1/publish
```

`publish` is an upsert, keyed on the server name and version. It returns `201` when it creates a server and `200` when it updates one—and it checks the scope for the operation it's actually about to perform, so a token holding only `dp:mcp_server:create` gets `403` when the target version already exists.

```json
{
  "name": "example.com/travel-assistant",
  "title": "Travel Assistant MCP",
  "version": "1.0.0",
  "description": "MCP server for travel planning tools.",
  "remotes": [
    { "type": "streamable-http", "url": "https://your-mcp-host.example.com" }
  ],
  "_meta": {
    "io.api-platform/mcp-capabilities": {
      "tools": [
        {
          "name": "search_flights",
          "description": "Find available flights for a given origin, destination, and travel date.",
          "inputSchema": { "type": "object", "properties": {} }
        }
      ],
      "resources": [],
      "prompts": []
    },
    "io.api-platform/proxy-info": { "id": "travel-assistant" }
  }
}
```

The payload is validated before anything is written. A `400` comes back when:

- `name` is missing, isn't a string, is shorter than 3 or longer than 200 characters, or doesn't match the reverse-DNS `namespace/server` pattern
- `description` is missing or isn't a string
- `version` is missing, is the reserved value `latest`, or looks like a range rather than a specific version—anything starting with `^`, `~`, `>`, `<`, or `>=`, or containing `*` or an `x` placeholder

Both `_meta` entries are optional. Omitting `io.api-platform/mcp-capabilities` on an update leaves the stored tool schema untouched; omitting it on a create stores an empty one. `io.api-platform/proxy-info.id` is an additional identifier the portal matches on, alongside the name.

Newly published servers are mapped to the `default` label, so they appear in every view that includes it.

### Update a version

```text
PUT /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/versions/{version}
```

Takes the same body as `publish`, and the `version` field in the body has to match the one in the path—a mismatch returns `400`.

### Delete a version

```text
DELETE /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/versions/{version}
```

A soft delete. The version's status becomes `deleted` and it drops out of the discovery endpoints unless you ask for `include_deleted=true`. The row itself stays.

### Change status

```text
PATCH /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/versions/{version}/status
PATCH /api-portal/registry/{orgHandle}/v0.1/servers/{serverName}/status
```

Both take `{"status": "active" | "deprecated" | "deleted"}`. The first changes one version; the second changes every version of the server at once. Any other value returns `400`, and so does setting a version to the status it already has.

## Registry vs. the management API

The portal exposes MCP servers through two different APIs, and they aren't interchangeable:

| | MCP Registry API | [Management API](rest-api/mcp-servers.md) |
|---|---|---|
| Path | `/api-portal/registry/{orgHandle}/v0.1` | `/api-portal/api/v0.9` |
| Shape | Model Context Protocol registry specification | The portal's own resource model |
| Discovery auth | None | Bearer token |
| Identified by | Reverse-DNS name plus version | Portal handle |
| Also manages | Nothing else | Content, documents, and [keys](rest-api/mcp-server-keys.md) |

Use the registry when you want MCP-standard tooling to interoperate with the hub. Use the Management API when you're automating the portal itself.

## Related

- [MCP Servers](overview.md): how registry-published servers behave in the catalog
- [Browse MCP Servers](mcp-servers/browse-mcp-servers.md): the same servers, in the portal UI
- [MCP Servers (Management API)](rest-api/mcp-servers.md): the portal's own CRUD API
- [Authentication](rest-api/authentication.md): how to get a bearer token for the write endpoints