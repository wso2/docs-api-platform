---
title: "API Platform AI Gateway Overview"
description: "Manage and secure AI traffic with API Platform AI Gateway: LLM providers, LLM proxies, MCP proxies, and guardrails for LLM APIs and MCP servers."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/overview/
md_url: https://wso2.com/api-platform/docs/ai-gateway/overview.md
tags:
  - ai-gateway
  - llm
  - mcp
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-08
content_type: "concept"
---

# API Platform AI Gateway

A gateway for managing and securing AI traffic, including Large Language Model (LLM) APIs and Model Context Protocol (MCP) servers.

## Quick Start

- [LLM Quick Start Guide](llm-proxy/quick-start-guide.md) - Set up the gateway, verify the controller admin health endpoint, and route traffic to LLM providers like OpenAI
- [MCP Quick Start Guide](mcp-proxy/quick-start-guide.md) - Set up the gateway, verify the controller admin health endpoint, and route traffic to MCP servers

## Key Concepts

### LLM Provider

An LLM Provider represents a managed connection to an upstream AI service, such as OpenAI, Azure OpenAI, or any other LLM API. Platform administrators configure LLM Providers to define enterprise-wide connectivity, governance, and runtime controls, including:

- The upstream LLM service endpoint
- Authentication credentials (API keys, OAuth tokens, etc.)
- Access control rules for exposed models and endpoints
- Budget and cost control policies, such as token-based rate limiting
- Enterprise-wide guardrails and runtime policies

Once an LLM Provider is configured and deployed to the AI Gateway, it exposes a managed endpoint that applications can use to securely access the upstream LLM service.

### App LLM Proxy

An App LLM Proxy provides an application-specific entry point to an LLM Provider. While the LLM Provider enforces enterprise-wide governance, App LLM Proxies allow application teams to configure application-specific behavior, such as guardrails, prompt decorators, prompt templates, model parameters, and other runtime policies.

Every App LLM Proxy is associated with an LLM Provider and inherits its administrator-defined access controls, budget limits, and enterprise-wide policies. Each proxy exposes its own URL path (for example, /assistant) and can apply additional application-specific policies without overriding enterprise-wide policies enforced by the platform administrator.

This enables:

- Multiple AI applications to securely share a single LLM Provider
- Application-specific guardrails, prompt management, and runtime policies
- Enterprise-wide governance with application-level customization
- Clear separation of responsibilities between platform administrators and application developers

### LLM Provider Template

An LLM Provider Template defines the characteristics and behaviors specific to an AI service provider, such as OpenAI, Azure OpenAI, or other LLM platforms. It describes how the gateway should interpret and extract usage and operational metadata, including prompt, completion, total, and remaining token information, as well as request and response model metadata.

Following templates are shipped out-of-the-box

- OpenAI
- Azure OpenAI
- Anthropic
- AWS Bedrock
- Azure AI Foundry
- Gemini

### MCP Proxy

An MCP Proxy routes Model Context Protocol traffic to MCP servers. MCP is a protocol that enables AI assistants to interact with external tools and data sources. With MCP Proxies, you can:

- Expose MCP servers through a centralized gateway
- Apply authentication and access control to MCP traffic
- Manage multiple MCP servers from a single control plane

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

1. Administrators verify the Gateway-Controller admin health endpoint and configure LLM Providers and MCP Proxies via the Gateway-Controller API
2. Developers create LLM Proxies to build AI applications on top of available providers
3. The gateway routes traffic, applies policies, and manages authentication

## AI Guardrails

AI Guardrails allow you to enforce safety, content, and compliance policies on AI traffic flowing through the AI Gateway. They can be applied at the LLM Provider level (organization-wide), at the LLM Proxy level (per-application), or on MCP Proxies.

The complete and up-to-date guardrail catalogue — with configuration references and examples — is maintained in the gateway-controllers repository: [https://github.com/wso2/gateway-controllers/blob/main/docs/README.md](https://github.com/wso2/gateway-controllers/blob/main/docs/README.md)

You can extend the AI Gateway with custom guardrail policies by building a custom gateway image using the `ap` CLI. See [Customizing the Gateway by Adding and Removing Policies](../../tools/cli/customizing-gateway-policies.md).

## Documentation

| Section | Description |
|---------|-------------|
| [LLM](llm-proxy/quick-start-guide.md) | LLM provider configuration, guardrails, prompt management, and semantic caching |
| [MCP](mcp-proxy/quick-start-guide.md) | MCP proxy setup and policies |
| [Observability](observability/logging.md) | Logging and tracing configuration |
| [Analytics](analytics/moesif-analytics.md) | Analytics integrations (Moesif) |
| [Policies and Guardrails](https://github.com/wso2/gateway-controllers/blob/main/docs/README.md) | Gateway policies and guardrails for AI traffic control |
| [REST APIs](ai-gateway-rest-api/authentication.md) | REST API authentication and usage |