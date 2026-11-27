---
title: "Get Started with Choreo API Management"
description: "Find the quick start guide for your goal: run API Manager, run a standalone API or AI gateway, govern AI services, or publish APIs and MCP servers in a portal on your own infrastructure."
tags:
  - getting-started
  - api-management
  - ai-gateway
author: Choreo API Management Documentation Team
last_updated: 2026-06-11
content_type: "quickstart"
---

# Get Started

Not sure where to begin? This page helps you find the right quick start guide for running API Management on your own infrastructure.

!!! tip "Prefer not to manage the infrastructure?"
    Run API Management in the cloud or in a hybrid setup. See [Get Started with API Management Cloud](/api-management/cloud/get-started/).

## What do you want to do?

### I want to manage and govern APIs with a web console
You want API Manager: a web console to design, publish, secure, and govern APIs, running on your infrastructure.

| Guide | What you will do |
| :--- | :--- |
| [Install API Manager](https://apim.docs.choreolabs.com/en/latest/install-and-setup/install-and-setup-overview/) | Download and set up API Manager on Docker or Kubernetes. |
| [Publish your first API proxy](https://apim.docs.choreolabs.com/en/latest/get-started/api-manager-quick-start-guide/) | Create and deploy an API through the Publisher UI. |

### I want to run a standalone gateway (no UI, YAML and CLI only)
You want a lightweight gateway that you can download and run immediately. No control plane or web console is required. You configure everything through YAML files and the CLI.

**For API traffic:**

| Guide | What you will do |
| :--- | :--- |
| [API Gateway: Quick start guide](api-gateway/1.2.0/quick-start-guide.md) | Run the gateway with Docker Compose, deploy your first API proxy using YAML, and invoke it. |

**For AI traffic (LLMs and MCP):**

| Guide | What you will do |
| :--- | :--- |
| [AI Gateway: Quick start guide](ai-gateway/1.2.0/quick-start-guide.md) | Configure an LLM provider and route your first LLM request through the gateway. |
| [MCP proxy](ai-gateway/1.2.0/gateway-artifacts/mcp-proxy.md) | Expose an MCP server through the gateway and connect to it from an MCP client. |

### I want to govern AI services across my organization
You already have AI gateways running and now want centralized management of LLM providers, MCP servers, guardrails, and cost controls.

| Guide | What you will do |
| :--- | :--- |
| [AI & Agent Control Plane: Quick start guide](ai-workspace/1.0.0/getting-started.md) | Run the AI & Agent Control Plane with Docker Compose, connect an AI Gateway, and send a prompt through an LLM provider. |

### I want to publish APIs and MCP servers in a developer portal
You want a catalog where developers discover, subscribe to, and try your APIs and MCP servers.

| Guide | What you will do |
| :--- | :--- |
| [API Portal & AI Hub: Quick start guide](api-portal/1.0.0/quickstart-guide.md) | Run the API Portal & AI Hub with Docker, then publish an API and an MCP server to its catalog. |

## After your first quick start guide
Once you have completed a quick start guide, here is where to go next:

| I want to... | Go here |
| :--- | :--- |
| Explore the full feature docs for my product | [API Manager](api-manager/overview.md) · [API Gateway](api-gateway/1.2.0/overview.md) · [AI Gateway](ai-gateway/1.2.0/overview.md) · [API Portal & AI Hub](api-portal/1.0.0/overview.md) · [AI & Agent Control Plane](ai-workspace/1.0.0/overview.md) |
| Browse reusable policies and guardrails | [Policy Hub](policy-hub/overview.md) |
| Manage gateways and design APIs from my terminal or editor | [CLI](tools/cli/quick-start-guide.md) · [API Designer for VS Code](tools/vscode-api-design/getting-started.md) |
| Not sure which product is right for me | [Overview](index.md) |
