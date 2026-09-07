---
title: "AI Workspace overview"
description: "Centrally manage AI gateways, LLM providers, proxies, policies, and secrets from a single control plane."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/overview/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/overview.md
tags:
  - cloud
  - ai-workspace
  - overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-01
content_type: "overview"
---

# AI Workspace overview

AI Workspace is the control plane for managing how your applications access AI services. It's intended for platform teams and developers who govern large language model (LLM) traffic across an organization.

From one console, you can do the following:

- Connect AI Gateway runtimes.
- Configure LLM providers and proxies.
- Apply AI policies.
- Manage credentials.
- Deploy these configurations to your gateways.

Instead of configuring each gateway or application separately, AI Workspace gives you a central place to manage and govern AI traffic across your organization.

## How AI Workspace works

AI Workspace manages your AI configuration, and the AI Gateway processes requests. The following diagram shows how the two relate:

```text
                         AI Workspace
                         Control plane
                              │
                              │ Deploy configuration
                              ▼
Applications ────────► AI Gateway ────────► AI services
                         Data plane
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                 LLM       App LLM     MCP
                Provider     Proxy     Proxy
```

A typical workflow has these steps:

1. Connect an AI Gateway to AI Workspace.
2. Configure AI artifacts, such as LLM providers, App LLM proxies, and Model Context Protocol (MCP) proxies.
3. Apply policies such as guardrails and rate limits.
4. Deploy the configuration to one or more gateways.
5. Send application traffic through the deployed gateway.

Changes you make in AI Workspace don't affect live traffic until you deploy them to a gateway.

## What you can manage

### AI Gateways

Connect and manage the AI Gateway runtimes that process your AI traffic. In AI Workspace, you can do the following:

- Register gateways with AI Workspace.
- Deploy artifacts to one or more gateways.
- Monitor gateway status.
- View where artifacts are deployed.

To register your first gateway, see [Set up an AI Gateway](ai-gateways/setting-up.md).

### LLM providers

Configure connections to upstream AI services such as OpenAI, Anthropic, Azure OpenAI, Gemini, Mistral AI, and AWS Bedrock.

An LLM provider holds the information required to connect to an upstream AI service, including its endpoint and authentication configuration.

To configure a connection, see [LLM providers](llm-providers/overview.md). To connect a service that has no built-in template, see [LLM provider templates](llm-provider-templates/overview.md).

### App LLM proxies

Create application-facing endpoints when an application or agent needs configuration or policies that differ from the underlying LLM provider.

To decide whether you need one, see [App LLM proxies](llm-proxies/overview.md).

### MCP proxies

Create managed endpoints for upstream MCP servers. MCP standardizes how applications share context and tools with LLMs.

To put a gateway in front of an MCP server, see [MCP proxies](mcp-proxies/overview.md).

### AI policies

Apply policies to LLM providers, App LLM proxies, and MCP proxies to control how the gateway handles AI traffic. Policies fall into three groups:

- Guardrails for content safety, personally identifiable information (PII) protection, validation, and prompt injection detection.
- Rate limits for requests, tokens, and monetary usage.
- Traffic and prompt controls for routing, prompt templates, semantic caching, and provider transformations.

To see what you can attach and where it takes effect, see [Policies](policies/overview.md).

### Secrets

Store credentials securely and reference them from your AI artifacts, so credential values never appear in application or gateway configuration.

To store and reference a credential, see [Secrets management](secrets-management.md).

## Control plane and data plane

AI Workspace and AI Gateway work together as the control plane and the data plane. The following table compares their roles:

| | AI Workspace | AI Gateway |
|---|---|---|
| **Role** | Control plane | Data plane |
| **Purpose** | Manage AI configurations and policies | Process AI traffic |
| **Handles** | Artifacts, policies, secrets, and deployments | Requests and responses |
| **When it acts** | When you configure or deploy | When an application sends a request |

The workspace tracks which artifacts are deployed to which gateways. For example, you can deploy a single LLM provider to multiple gateways, and each gateway can serve multiple providers and proxies.

To configure and operate the gateway runtime directly, see the [AI Gateway documentation](../../ai-gateway/next/overview.md).

## Configure AI Workspace

Before you create AI artifacts, you can configure how AI Workspace runs. The following table lists the available configuration topics:

| Topic | Description |
|---|---|
| [Configuration and interpolation](setting-up/configuration.md) | Configure services using `config.toml`, environment variables, and mounted files |
| [Ports](setting-up/ports.md) | Configure the ports that AI Workspace uses |
| [Database](setting-up/database.md) | Configure PostgreSQL or SQL Server for artifact storage |
| [Authentication](setting-up/authentication/overview.md) | Configure local authentication or an OpenID Connect (OIDC) identity provider |

## Create and deploy artifacts

AI Workspace supports several ways to create and manage artifacts. The following table lists the available methods:

| Method | Description |
|---|---|
| AI Workspace | Create and manage artifacts from the AI Workspace console |
| AI Gateway | Create artifacts through the gateway management API or configuration files |
| Continuous integration and continuous delivery (CI/CD) | Manage artifacts as files in source control and deploy them using the `ap` CLI |

To set up a Git-based workflow, see [AI Workspace CI/CD](ci-cd/overview.md). To bring artifacts that a gateway created back into the workspace, see [Sync gateway-created artifacts](sync-gateway-created-artifacts.md).

## Monitor AI traffic

AI Gateway publishes traffic and usage information that shows how your applications use AI services. The published information covers the following:

- Request and token usage
- Latency
- Cost
- Guardrail events

To view this information and understand AI usage across applications and consumers, see [Insights](insights.md).

## Where to start

If you haven't used AI Workspace before, follow [Get started with AI Workspace](getting-started.md). It walks you through running AI Workspace locally, connecting your first AI Gateway, and configuring an LLM provider.

Otherwise, choose the path that matches what you want to do:

- Connect a gateway: [Set up an AI Gateway](ai-gateways/setting-up.md)
- Connect an AI service: [LLM providers](llm-providers/overview.md)
- Create an application-specific endpoint: [App LLM proxies](llm-proxies/overview.md)
- Connect an MCP server: [MCP proxies](mcp-proxies/overview.md)
- Control AI traffic: [Policies](policies/overview.md)
- Manage credentials: [Secrets management](secrets-management.md)
- Call AI services from an application: [Invoke providers and proxies via SDKs](using-sdks.md)