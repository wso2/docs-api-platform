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
last_updated: 2026-08-12
content_type: "concept"
---

# API Platform AI Gateway

A gateway for managing and securing AI traffic, including Large Language Model (LLM) APIs and Model Context Protocol (MCP) servers.

## Why use the AI Gateway

Run the AI Gateway when AI traffic needs the controls you already apply to your APIs. With it, you can:

- Apply guardrails that validate, filter, or transform content before it reaches a model or a client. See [Guardrails](guardrails/index.md).
- Serve one OpenAI-compatible endpoint that routes requests to multiple LLM providers. See [Multi-provider routing](routing/multi-provider-routing.md).
- Expose MCP servers through a central gateway, and apply authentication and access control to MCP traffic. See [MCP proxy](gateway-artifacts/mcp-proxy.md).
- Collect logs, traces, and analytics for the traffic the gateway handles. See [Gateway logs](logging-and-tracing/gateway-logs.md).
- Run the gateway on its own, or register it with AI Workspace to govern the gateways across your organization. See [Connect to AI Workspace](setup-and-deployment/production-deployment/control-plane-connection.md).

## Who it is for

Two roles share the gateway. A platform administrator configures LLM providers, the credentials they use, and the policies that apply organization-wide. An AI developer creates LLM proxies on top of those providers, and adds the policies a single application needs.

## Where to go next

- To install the gateway and route a first request through it, see [Quick Start Guide](quick-start-guide.md).
- To learn which artifacts a request passes through, see [How it works](how-it-works.md).
