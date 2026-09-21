# Gateway-Controller API

The Gateway-Controller API is the standalone management API exposed by AI Gateway on port `9090`. Administrators use it to create and manage LLM providers, LLM proxies, MCP proxies, and related runtime configuration when operating the gateway without AI Workspace.

## What You Can Manage

- LLM provider definitions and provider templates
- Application-facing LLM proxies
- MCP proxies and MCP traffic policies
- Runtime configuration used by standalone AI Gateway deployments

## Where To Start

- Use the [LLM Quick Start Guide](llm/quick-start-guide.md) to deploy the gateway and create LLM providers and proxies with the API
- Use the [MCP Quick Start Guide](mcp/quick-start-guide.md) to deploy the gateway and create MCP proxies with the API
- Use [LLM Provider Templates](llm/llm-templates.md) for provider template API examples

## Default Endpoint

The Gateway-Controller API is exposed on:

```text
http://localhost:9090
```

The admin health endpoint is exposed separately on port `9094`.
