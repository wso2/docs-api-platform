---
title: "MCP proxy"
description: "Route Model Context Protocol traffic through the AI Gateway with an MCP proxy, then deploy one and connect an MCP client to it."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/mcp-proxy/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/mcp-proxy.md
tags:
  - ai-gateway
  - mcp
  - mcp-proxy
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# MCP proxy

An MCP Proxy routes Model Context Protocol traffic to MCP servers. MCP is a protocol that enables AI assistants to interact with external tools and data sources. With MCP Proxies, you can:

- Expose MCP servers through a centralized gateway
- Apply authentication and access control to MCP traffic
- Manage multiple MCP servers from a single control plane

This page takes you through deploying a proxy and routing your first MCP traffic through it.

## Prerequisites

- A running AI Gateway, with `ADMIN_USERNAME` and `ADMIN_PASSWORD` exported in the shell you run these commands from. See [Install the gateway](../setup-and-deployment/install-the-gateway.md).
- The sample MCP server below joins the gateway's Compose network as `ai-gateway_gateway-network`, so start the gateway with `docker compose -p ai-gateway up`. If you started it under a different project name, use that project's network name in the `docker run` command.

The `curl` commands on this page pipe their YAML payload in through a shell heredoc (`--data-binary @- <<'EOF'`), which PowerShell doesn't support. On Windows, either run them from Git Bash or WSL, or save the YAML between the `EOF` markers to a file and post that file explicitly — note the `.exe`, since `curl` is an alias for `Invoke-WebRequest` in Windows PowerShell:

```powershell
curl.exe -X POST http://localhost:9090/api/management/v1/mcp-proxies `
  -H "Content-Type: application/yaml" `
  -u "${env:ADMIN_USERNAME}:${env:ADMIN_PASSWORD}" `
  --data-binary "@mcp-proxy.yaml"
```

## Deploy an MCP proxy configuration

Start the sample MCP server

```bash
docker run -p 3001:3001 --name everything --network ai-gateway_gateway-network rakhitharr/mcp-everything:v3
```

Run the following command to deploy the MCP proxy.

```bash
curl -X POST http://localhost:9090/api/management/v1/mcp-proxies \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: Mcp
metadata:
  name: everything-mcp-v1.0
  annotations:
    "gateway.api-platform.wso2.com/project-id": "default"
spec:
  displayName: Everything
  version: v1.0
  context: /everything
  specVersion: "2025-06-18"
  upstream:
    url: http://everything:3001
  tools: []
  resources: []
  prompts: []
EOF
```
To test MCP traffic routing through the gateway, add the following URL to your MCP client and connect to the server.

```
http://localhost:8080/everything/mcp
```

## View the MCP proxy in AI Workspace

The gateway syncs the artifacts you deploy on it up to [AI Workspace](../../../ai-workspace/1.0.0/overview.md), the control plane for AI traffic across your organization. The `everything-mcp-v1.0` proxy you deployed above appears there without being re-declared, in the `default` project named in its `project-id` annotation. See [Manage Gateway-deployed AI artifacts in AI Workspace](../../../ai-workspace/1.0.0/sync-gateway-created-artifacts.md).

## Policies

The policies that authenticate callers, authorize individual tools, restrict and rename the tool list, and rate limit MCP calls are covered in [MCP governance](../mcp-governance.md).

## Next steps

- Stop the sample MCP backend when you're done with it: `docker stop everything` and `docker rm everything`.
- Govern this proxy alongside every other AI artifact you run: [AI Workspace overview](../../../ai-workspace/1.0.0/overview.md)

## Related guides

- [Build an AI agent that uses aggregated MCP tools from multiple APIs](../../../guides/ai-and-mcp/build-ai-agent-with-multiple-mcp-servers.md) — connects an agent to three independently governed MCP servers through the gateway.
- [Convert a REST API into an MCP tool for Claude Desktop](../../../guides/ai-and-mcp/convert-rest-api-to-mcp-server.md) — exposes a REST API as a governed MCP server and enforces OAuth2 at the gateway.
- [Find and connect to an enterprise MCP server from the MCP Hub](../../../guides/ai-and-mcp/find-and-connect-to-an-enterprise-mcp-server-from-the-mcp-hub.md) — discovers MCP servers in the MCP Hub and connects a client to one.
