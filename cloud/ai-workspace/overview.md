---
title: "AI Workspace overview"
description: "Centrally manage AI Gateway runtimes, LLM providers, App LLM proxies, MCP proxies, and AI policies from the AI Workspace control plane."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/overview/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/overview.md
tags:
  - cloud
  - ai-workspace
  - overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "overview"
---

# AI Workspace Overview

The AI Workspace is the control plane for AI Gateway runtimes. It gives platform teams a centralized interface to register gateways, configure providers and application-facing proxies, apply policies, and manage deployments without working directly with the Gateway-Controller API.

## What AI Workspace Manages

### AI Gateways

Register and manage AI Gateway runtimes that process AI traffic.

- Create gateway entries and associate them with environments
- Generate registration tokens to connect runtimes to the control plane
- Track gateway connectivity and deployment status

Learn more in [AI Gateways](ai-gateways/setting-up.md).

### LLM Providers

Define reusable connections to upstream AI services such as OpenAI, Anthropic, Azure OpenAI, Gemini, and Mistral.

- Store provider credentials and connection details
- Control which upstream resources are exposed
- Apply provider-level security, rate limits, and guardrails

Learn more in [LLM Providers](llm-providers/overview.md).

### App LLM Proxies

Create optional, application-facing endpoints for Gen AI applications and agents when they need controls that differ from the underlying provider.

- Publish specialized proxy endpoints for distinct Gen AI apps, copilots, or agents
- Isolate consumers with separate API keys and policies
- Apply proxy-level resources, security settings, and guardrails

Learn more in [App LLM Proxies](llm-proxies/overview.md).

### GenAI Applications

Represent the actual AI applications/Agents in your project and map existing API keys to them for application-level visibility.

- Group multiple API keys under one named application
- Track usage, tokens, and cost per application
- Improve governance and accountability for shared GenAI workloads

Learn more in [GenAI Applications](genai-applications.md).

### MCP Proxies

Expose and govern Model Context Protocol servers through connected gateways.

- Connect remote MCP servers through managed proxy endpoints
- Apply MCP-specific authentication, authorization, rewrite, and access-control policies
- Control how MCP capabilities are exposed to clients

Learn more in [MCP Proxies](mcp-proxies/overview.md).

### Policies and Guardrails

Configure AI-specific governance controls for providers and proxies.

- Apply content safety and PII protection guardrails
- Configure token- and cost-based rate limiting
- Use prompt management, semantic cache, and model-routing policies

Learn more in [Policies](policies/overview.md).

## How It Works

1. Create an AI Gateway entry in AI Workspace.
2. Start the gateway runtime and register it with the generated token.
3. Configure LLM providers or MCP proxies in the control plane.
4. Deploy those configurations to one or more connected gateways.
5. Manage runtime behavior through policies, guardrails, and gateway deployments.

## Relationship to AI Gateway

AI Workspace is the control plane. The [AI Gateway](../ai-gateway/overview.md) is the runtime plane that handles the actual traffic.

- Use AI Gateway docs when you want to work directly with the runtime, Gateway-Controller API, or standalone deployment model.
- Use AI Workspace docs when you want centralized lifecycle management for connected gateways and their AI assets.

## Getting Started

To start using the control plane, follow the [Getting Started](getting-started.md) guide.