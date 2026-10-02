---
title: "WSO2 API Platform glossary"
description: "Definitions of WSO2 API Platform terms, including AI Gateway, AI Workspace, LLM Proxy, MCP Proxy, guardrails, policies, and data planes."
canonical_url: https://wso2.com/api-platform/docs/glossary/
md_url: https://wso2.com/api-platform/docs/glossary.md
tags:
  - glossary
  - terminology
  - api-management
  - ai-gateway
  - ai-workspace
  - mcp
  - policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-30
content_type: "reference"
---

# Glossary

This glossary defines terms specific to WSO2 API Platform.

## A

### AI Gateway

The AI Gateway routes, secures, and observes AI traffic. It handles requests to Large Language Model (LLM) providers and to Model Context Protocol (MCP) servers. It runs on its own or connects to [AI Workspace](#ai-workspace) for central management.

For more information, see the [AI Gateway overview](ai-gateway/1.2.0/overview.md).

### AI Workspace

AI Workspace serves as the [control plane](#control-plane) for AI Gateway runtimes. From one console, you register gateways, configure [LLM Providers](#llm-provider) and proxies, and apply AI policies. You then deploy that configuration to one or more gateways. You can use AI Workspace in Cloud or run it as a self-hosted control plane.

For more information, see the [AI Workspace overview](ai-workspace/1.0.0/overview.md).

### API Control Plane

In the API Control Plane, you design, publish, version, and govern APIs through a web UI or configuration files. The API Control Plane enforces policies across all connected gateways. API Platform Cloud and WSO2 API Manager both include it.

For more information, see [Platform components](index.md#platform-components).

### API Gateway

The API Gateway handles API traffic, including REST, WebSocket, and GraphQL APIs, on a Go-based runtime. It applies authentication, rate limiting, transformations, and custom policies. It runs in [standalone mode](#standalone-mode) or connects to a control plane.

For more information, see the [API Gateway overview](api-gateway/1.2.0/overview.md).

### API Platform Cloud

API Platform Cloud delivers WSO2 API Platform as a WSO2-managed software as a service (SaaS) offering. WSO2 runs the control plane. Your gateways run on WSO2-managed infrastructure or, in a [hybrid deployment](#hybrid-deployment), in your own infrastructure.

For more information, see the [API Platform Cloud overview](cloud/introduction/what-is-bijira.md) and the [deployment options comparison](index.md#how-do-the-three-options-compare).

### API Platform Console

The API Platform Console provides the web UI for API Platform Cloud. You use it to create projects, API Proxies, and MCP Servers, and to manage your organization.

For more information, see the [API Proxy quick start guide](cloud/introduction/quick-start-guide.md), [Design and publish MCP servers](cloud/mcp-servers/design-mcp-servers.md), and [Organizations](cloud/bijira-concepts/organization.md).

### API Portal

In the API Portal and MCP Hub, consumers discover APIs and MCP servers. Developers subscribe under a plan and generate credentials in the portal. You can use the portal in Cloud or run it as a self-hosted portal. The Cloud documentation also calls it the API Platform Developer Portal.

For more information, see the [API Portal overview](api-portal/1.0.0/overview.md).

### API Proxy

In API Platform Cloud, an API Proxy fronts a backend API. It secures, protects, and manages access to that API. An API Proxy can front an API in your organization or a third-party API.

For more information, see the [Create API Proxy overview](cloud/create-api-proxy/overview.md).

### API workflow

An API workflow defines a multi-step sequence of API calls that solves one use case end to end. Admins author workflows in the [Arazzo format](https://spec.openapis.org/arazzo/latest.html) or in Markdown. Both developers and AI agents can discover and follow a published workflow.

For more information, see [API workflows](api-portal/1.0.0/api-workflows.md).

### App LLM Proxy

In AI Workspace, an App LLM Proxy adds an optional, application-facing endpoint on top of an [LLM Provider](#llm-provider). Use one when a GenAI application or agent needs its own authentication, guardrails, exposed resources, or traffic controls. If provider-level controls meet the application's needs, the application can call the provider directly.

For more information, see the [App LLM proxies overview](ai-workspace/1.0.0/llm-proxies/overview.md).

### Application

An application represents a client that consumes APIs, such as a mobile app, web app, or device. Developers create applications in the developer portal:

- **Cloud Developer Portal:** an application subscribes to APIs under a plan. One application can have several API subscriptions.
- **Self-hosted API Portal:** an application holds the OAuth2 client IDs for OAuth2-secured APIs. Subscriptions and API keys don't require an application.

For more information, see [Create an application](cloud/devportal/manage-applications/create-an-application.md) and [Manage applications](api-portal/1.0.0/consume-an-api/manage-applications.md).

## C

### Control plane

In the control plane, you design and manage APIs and AI configuration. The control plane doesn't process API traffic. Instead, the gateways in the [data plane](#data-plane) run on its configuration. The API Control Plane and AI Workspace both act as control planes.

For more information, see [Data planes](cloud/bijira-concepts/data-planes.md).

## D

### Data plane

Your gateways run in the data plane and process API traffic there, based on configuration from the control plane. A data plane takes one of the following forms:

- WSO2 managed, in the cloud
- Self-hosted, in a hybrid or self-managed deployment
- A federated third-party gateway

API Platform Cloud also distinguishes cloud data planes from private data planes. Cloud data planes use shared, multi-tenant infrastructure. Private data planes use dedicated infrastructure for a single organization.

For more information, see [Data planes](cloud/bijira-concepts/data-planes.md).

### Developer Portal

In a developer portal, consumers discover and subscribe to APIs. The term refers to different components:

- **API Platform Cloud:** the Cloud documentation uses Developer Portal for its version of the [API Portal](#api-portal).
- **WSO2 API Manager:** API Manager includes its own Developer Portal in its self-hosted control plane.

For more information, see [API Portal](#api-portal) and the [API Manager overview](api-manager/overview.md).

## G

### Gateway federation

Gateway federation brings APIs from external gateways under one API Platform control plane. You can discover those APIs, apply governance, and publish them to the Developer Portal.

For more information, see the [gateway federation overview](cloud/federation/overview.md).

### GenAI Application

A GenAI Application represents a real AI application in AI Workspace. You attach API keys to it. You can then track usage, tokens, and cost for the whole application, not only for individual keys.

For more information, see [GenAI Applications](ai-workspace/1.0.0/genai-applications.md).

### Guardrail

A guardrail, a type of [policy](#policy), inspects the content of AI requests and responses. Guardrails validate, filter, or transform that content before it reaches a model or returns to the client. Examples include PII Masking, Azure Content Safety, and Semantic Prompt Guard.

For more information, see the [guardrails overview](ai-gateway/1.2.0/guardrails/index.md).

## H

### Hybrid deployment

A hybrid deployment uses the WSO2-managed Cloud control plane with gateways that you host. Your API traffic stays in the infrastructure you manage.

For more information, see [Self-Hosted Gateway](#self-hosted-gateway).

## L

### LLM Provider

An LLM Provider connects the AI Gateway to an upstream AI service, such as OpenAI. Administrators configure it with the following details:

- An [LLM Provider Template](#llm-provider-template)
- The upstream service URL
- Credentials
- Access control rules for which endpoints the provider exposes
- Budget control policies, such as token-based rate limiting
- Organization-wide policies, such as guardrails

For more information, see [LLM provider](ai-gateway/1.2.0/gateway-artifacts/llm-provider/index.md) and the [LLM providers overview](ai-workspace/1.0.0/llm-providers/overview.md).

### LLM Provider Template

An LLM Provider Template serves as a reusable blueprint for connecting to an upstream LLM service. It holds the following configuration:

- The upstream endpoint URL
- The inbound authentication settings
- The provider's OpenAPI specification
- The token and model mappings that the gateway uses to track usage

The AI Gateway ships with built-in templates. You can create custom templates on the gateway or in AI Workspace.

For more information, see the [LLM provider templates overview](ai-workspace/1.0.0/llm-provider-templates/overview.md).

### LLM Proxy

Developers create an LLM Proxy to expose a custom endpoint that consumes an [LLM Provider](#llm-provider). Each LLM Proxy has its own URL context and its own policies. Several applications can share one LLM Provider through separate LLM Proxies.

The following `LlmProxy` definition consumes a provider named `openai-provider` and serves requests under `/assistant`:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProxy
metadata:
  name: openai-assistant
spec:
  displayName: OpenAI Assistant
  version: v1.0
  context: /assistant
  provider:
    id: openai-provider
  policies: []
```

For more information, see [LLM proxy](ai-gateway/1.2.0/gateway-artifacts/llm-proxy.md).

## M

### MCP Hub

The MCP Hub gives developers a visual catalog for browsing MCP servers. The MCP registry powers it.

For more information, see [Browse the MCP Hub](cloud/mcp-servers/browse-mcp-hub.md).

### MCP Proxy

An MCP Proxy routes MCP traffic from the gateway to an upstream MCP server. MCP clients connect to the proxy instead of the server. You apply policies to the proxy for authentication, authorization, and access control.

For more information, see [MCP proxy](ai-gateway/1.2.0/gateway-artifacts/mcp-proxy.md).

### MCP registry

The MCP registry catalogs MCP servers so that clients can discover them. Each organization has its own registry. When you publish an MCP Proxy from AI Workspace, API Platform registers it in the registry. AI clients query the registry through the MCP Registry API.

For more information, see the [MCP registry overview](cloud/mcp-servers/mcp-registry.md).

### MCP Server

In API Platform Cloud, an MCP Server exposes an API as MCP tools for AI agents. You create one from an HTTP backend or from an API Proxy.

For more information, see [Design and publish MCP servers](cloud/mcp-servers/design-mcp-servers.md).

### Model Context Protocol (MCP)

Model Context Protocol, a JSON-RPC-based protocol, standardizes how applications interact with LLMs. It lets applications share context with LLMs and expose tools for AI-driven workflows.

For more information, see the [MCP proxies overview](ai-workspace/1.0.0/mcp-proxies/overview.md).

## O

### Organization

An organization groups users and their resources in a top-level container. In API Platform Cloud, every user belongs to an organization. Users and resources in one organization can't access another organization unless someone invites them.

For more information, see [Organizations](cloud/bijira-concepts/organization.md).

## P

### Policy

Policies plug into the gateway's request and response pipeline as self-contained units of behavior. Policies handle concerns such as authentication, rate limiting, and transformations. You can chain several policies on one API.

For more information, see the [Policy Hub overview](policy-hub/overview.md).

### Policy Hub

The Policy Hub collects the curated gateway policies and guardrails for WSO2 API Platform. Each policy has open source code and its own version track.

For more information, see the [Policy Hub overview](policy-hub/overview.md).

### Project

A project groups API Proxies and MCP Servers in API Platform Cloud. The components in a project typically deliver one business capability together. Each project runs in its own Kubernetes namespace, separate from other projects.

For more information, see [Projects](cloud/bijira-concepts/project.md).

## S

### Self-Hosted Gateway

A Self-Hosted Gateway runs the API Platform API Gateway in your own infrastructure. The API Platform Cloud control plane still manages it centrally.

For more information, see [Getting started with the Self-Hosted Gateway](cloud/api-platform-gateway/getting-started.md).

### Semantic cache

A semantic cache answers a prompt from stored responses when an earlier prompt had the same meaning. A cache hit skips the upstream LLM call, which saves latency and token cost. The Semantic Cache policy provides this behavior.

For more information, see [Semantic caching](ai-gateway/1.2.0/semantic-caching.md).

### Standalone mode

Standalone mode runs the API Gateway or AI Gateway without a control plane. You configure the gateway through YAML files, the CLI, or REST APIs. You can connect a standalone gateway to a control plane later.

For more information, see [the difference between standalone mode and platform mode](index.md#what-is-the-difference-between-standalone-mode-and-platform-mode).

### Subscription plan

A subscription plan defines a named usage tier that controls how much of an API a consumer can use. Plans can define rate limits and, in Cloud, pricing. Consumers choose a plan when they subscribe:

- **Cloud Developer Portal:** an application subscribes to an API under a plan.
- **Self-hosted API Portal:** a developer subscribes directly to an API or MCP server under a plan.

For more information, see [Assign subscription plans to APIs](cloud/develop-api-proxy/subscription-plans.md).

## Related resources

- [Platform overview](index.md): components, deployment options, and key concepts.
- [Get Started](get-started.md): quick start guides organized by goal.
- [API Portal concepts](api-portal/1.0.0/concepts.md): views, labels, subscriptions, and API keys in the self-hosted portal.
- [Policy Hub](policy-hub/overview.md): the curated collection of policies and guardrails.
