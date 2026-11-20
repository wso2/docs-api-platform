---
title: "Get Started with WSO2 API Platform"
description: "Find the quick start guide for your goal: manage APIs, run a standalone gateway, govern AI services, publish a portal, analyze traffic, or monetize APIs."
canonical_url: https://wso2.com/api-platform/docs/get-started/
md_url: https://wso2.com/api-platform/docs/get-started.md
tags:
  - getting-started
  - api-management
  - ai-gateway
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-11
content_type: "quickstart"
---

# Get Started

Not sure where to begin? This page helps you find the right quick start guide based on what you are trying to do.

## What do you want to do?

### I want to manage and govern APIs
You want the full platform experience: a web console to create, deploy, test, and govern APIs visually.

**If you want WSO2 to host it:**

| Guide | What you will do |
| :--- | :--- |
| [Publish your first API proxy](cloud/introduction/quick-start-guide.md) | Create a REST API proxy, deploy it, and invoke it from the cloud console. Takes about 10 minutes. |
| [Publish your first MCP server](cloud/introduction/quick-start-guide-mcp.md) | Turn an existing API into an MCP server and call its tools from the cloud console. |

**If you want WSO2 to host the console and you run the gateway (hybrid):**

| Guide | What you will do |
| :--- | :--- |
| [Set up a hybrid gateway](cloud/api-platform-gateway/getting-started.md) | Connect a self-hosted gateway to the cloud control plane so that API traffic stays in your infrastructure. |
| [Publish your first LLM proxy](cloud/ai-gateway/llm/quick-start-guide.md) | Run an AI Gateway, connect it to AI Workspace in the cloud, and route traffic to an LLM provider (such as OpenAI). |
| [Publish your first MCP proxy](cloud/ai-gateway/mcp/quick-start-guide.md) | Run an AI Gateway, connect it to AI Workspace in the cloud, and route traffic to an MCP server. |

**If you want to run it yourself (API Manager):**

| Guide | What you will do |
| :--- | :--- |
| [Install API Manager](https://apim.docs.wso2.com/en/latest/install-and-setup/install-and-setup-overview/) | Download and set up API Manager on Docker or Kubernetes. |
| [Publish your first API proxy](https://apim.docs.wso2.com/en/latest/get-started/api-manager-quick-start-guide/) | Create and deploy an API through the self-managed Publisher UI. |

### I want to run a standalone gateway (no UI, YAML and CLI only)
You want a lightweight gateway that you can download and run immediately. No control plane or web console is required. You configure everything through YAML files and the CLI.

**For API traffic:**

| Guide | What you will do |
| :--- | :--- |
| [API Gateway: Quick start guide](api-gateway/1.2.0/quick-start-guide.md) | Configure your first API proxy using YAML and start routing traffic. |

**For AI traffic (LLMs and MCP):**

| Guide | What you will do |
| :--- | :--- |
| [AI Gateway: Quick start guide](ai-gateway/1.2.0/quick-start-guide.md) | Configure an LLM provider and route your first LLM request through the gateway. |
| [MCP proxy](ai-gateway/1.2.0/gateway-artifacts/mcp-proxy.md) | Expose an MCP server through the gateway and connect to it from an MCP client. |

### I want to govern AI services at the organizational level
You already have gateways running and now want centralized management of LLM providers, MCP servers, guardrails, and cost controls across your organization.

| Guide | What you will do |
| :--- | :--- |
| [AI Workspace in the cloud: Quick start guide](cloud/ai-workspace/quickstart.md) | Connect an AI Gateway to AI Workspace, configure an LLM provider and an MCP proxy, and call both through the gateway. |
| [Self-hosted AI Workspace: Quick start guide](ai-workspace/1.0.0/getting-started.md) | Run AI Workspace locally with Docker Compose, connect an AI Gateway, and send a prompt through an LLM provider. |

### I want to publish APIs and MCP servers in a developer portal
You want a catalog where developers discover, subscribe to, and try your APIs and MCP servers.

| Guide | What you will do |
| :--- | :--- |
| [API Portal and MCP Hub: Quick start guide](api-portal/1.0.0/quickstart-guide.md) | Run the self-hosted API Portal and MCP Hub, then publish an API and an MCP server to its catalog. |
| [Use the Developer Portal as a consumer](guides/developer-portal/api-discovery-and-tryout.md) | Discover an API in the cloud Developer Portal, try it, subscribe to a plan, and invoke it. |

### I want to analyze API traffic
You want dashboards and alerts for the traffic that flows through your gateways.

| Guide | What you will do |
| :--- | :--- |
| [Get started with Moesif](analytics/overview.md#get-started-with-moesif) | Find the Moesif setup for your deployment and see your first API calls in the analytics dashboards. |

### I want to monetize my APIs
You want to track API usage, set up paid subscription plans, and implement usage-based billing.

| Guide | What you will do |
| :--- | :--- |
| [Monetize a REST API with Stripe](guides/monetization/api-monetization.md) | Connect Stripe, add a paid subscription plan to an API, subscribe to it from the Developer Portal, and check the billed usage. |

## After your first quick start guide
Once you have completed a quick start guide, here is where to go next:

| I want to... | Go here |
| :--- | :--- |
| Explore the full feature docs for my product | [Cloud](cloud/introduction/what-is-bijira.md) · [API Manager](api-manager/overview.md) · [API Gateway](api-gateway/1.2.0/overview.md) · [AI Gateway](ai-gateway/1.2.0/overview.md) · [API Portal](api-portal/1.0.0/overview.md) · [AI Workspace](ai-workspace/1.0.0/overview.md) |
| Follow end-to-end scenarios spanning multiple components | [Guides](guides/overview.md) |
| Try runnable code samples | [Samples](cloud/samples/samples-overview.md) |
| Understand platform concepts (organizations, projects, data planes) | [Concepts](cloud/bijira-concepts/organization.md) |
| Browse reusable policies and guardrails | [Policy Hub](policy-hub/overview.md) |
| Not sure which product is right for me | [Platform overview](index.md) |