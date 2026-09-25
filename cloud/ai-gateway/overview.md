---
title: "AI Gateway overview"
description: "Route, secure, and observe LLM and MCP traffic through the AI Gateway, deployable standalone or managed by the AI Workspace control plane."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-gateway/overview/
md_url: https://wso2.com/api-platform/docs/cloud/ai-gateway/overview.md
tags:
  - cloud
  - ai-gateway
  - overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "overview"
---

# AI Gateway Overview

The AI Gateway is the standalone runtime plane for routing, securing, and observing AI traffic. It handles Large Language Model (LLM) APIs and Model Context Protocol (MCP) servers, and can run independently or connect to the AI Workspace control plane for centralized management.

## Quick Start

- [LLM Quick Start Guide](llm/quick-start-guide.md) - Set up the gateway, verify the controller admin health endpoint, and route traffic to LLM providers like OpenAI
- [MCP Quick Start Guide](mcp/quick-start-guide.md) - Set up the gateway, verify the controller admin health endpoint, and route traffic to MCP servers

## Key Concepts

### LLM Provider Template

An LLM Provider Template defines the characteristics and behaviors specific to an AI service provider, such as OpenAI, Azure OpenAI, or other LLM platforms. It describes how the gateway should interpret and extract usage and operational metadata, including prompt, completion, total, and remaining token information, as well as request and response model metadata.

Following templates are shipped out-of-the-box

- OpenAI
- Azure OpenAI
- Anthropic
- AWS Bedrock
- Azure AI Foundry
- Gemini

### LLM Provider

An LLM Provider represents a connection from the gateway runtime to an AI backend service such as OpenAI, Azure OpenAI, or other LLM APIs. Administrators configure LLM Providers to define:

- The LLM Provider Template
- The upstream LLM service URL
- Authentication credentials (API keys, tokens)
- Access control rules for which endpoints are exposed
- Budget control policies, such as token-based rate limiting
- Organization-wide policies such as guardrails

Once configured, the LLM Provider allows traffic to flow through the gateway to the AI backend.

### LLM Proxy

An LLM Proxy allows developers to create custom API endpoints that consume an LLM Provider, while inheriting administrator-enforced access control, budgeting and organization-wide policies defined at the provider level. Each proxy gets its own URL context (e.g., `/assistant`) and can have its own policies applied. This enables:

- Multiple AI applications to share a single LLM Provider
- Per-application policies such as prompt management and guardrails
- Separation between platform administration and application development

### MCP Proxy

An MCP Proxy routes Model Context Protocol traffic to MCP servers. MCP is a protocol that enables AI assistants to interact with external tools and data sources. With MCP Proxies, you can:

- Expose MCP servers through a centralized gateway
- Apply authentication and access control to MCP traffic
- Manage multiple MCP servers from a single control plane

## Control Plane Integration

The AI Gateway can be managed in two ways:

- Directly through the Gateway-Controller API for standalone deployments
- Through the [AI Workspace](../ai-workspace/overview.md), which acts as the control plane for connected gateway runtimes

Use AI Workspace when you want a UI-driven control plane for gateway registration, provider and proxy management, policy configuration, and deployment workflows.

## Default Ports

| Port | Service | Description |
|------|---------|-------------|
| 8080 | Router | HTTP traffic |
| 8443 | Router | HTTPS traffic |
| 9090 | Gateway-Controller | REST API |
| 9094 | Gateway-Controller Admin | Health and admin endpoints |

## Architecture

```
                           ┌─────────────────┐
                           │ LLM Providers   │
                           │ (OpenAI, etc.)  │
                           └────────▲────────┘
                                    │
┌──────────┐    ┌──────────────┐    │
│ AI Apps  │───▶│  AI Gateway  │────┤
└──────────┘    └──────────────┘    │
                                    │
                           ┌────────▼────────┐
                           │  MCP Servers    │
                           └─────────────────┘
```

**How it works:**

1. Administrators verify the Gateway-Controller admin health endpoint and configure the gateway either through the Gateway-Controller API or through AI Workspace
2. Developers create LLM Proxies to build AI applications on top of available providers
3. The gateway routes traffic, applies policies, and manages authentication

## Documentation

| Section | Description |
|---------|-------------|
| [llm/](llm/index.md) | LLM provider configuration, guardrails, prompt management, and semantic caching |
| [mcp/](mcp/index.md) | MCP proxy setup and policies |
| [observability/](observability/index.md) | Logging and tracing configuration |
| [analytics/](analytics/index.md) | Analytics integrations (Moesif) |
| [Gateway-Controller API](gateway-controller-api.md) | Standalone gateway REST API usage for providers and proxies |
| [AI Workspace](../ai-workspace/overview.md) | Control plane for managing connected AI Gateway runtimes |