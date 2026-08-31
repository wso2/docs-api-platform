---
title: "Extend your gateway with AI Workspace"
description: "What connecting AI Gateway to AI Workspace adds: one console, central deployment, artifact sync, shared policies, and traffic insights."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/ai-workspace/extend-your-gateway-with-ai-workspace/
md_url: https://wso2.com/api-platform/docs/ai-gateway/ai-workspace/extend-your-gateway-with-ai-workspace.md
tags:
  - ai-gateway
  - ai-workspace
  - control-plane
  - governance
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Extend your gateway with AI Workspace

!!! note "Requires AI Workspace"
    Everything on this page needs a running AI Workspace deployment. The gateway serves traffic without one.

The gateway serves traffic on its own. Connecting it to [AI Workspace](../../../ai-workspace/1.0.0/overview.md), the control plane for AI traffic across your organization, adds central management across every gateway you run.

## What connecting the gateway adds

- **One console across gateways.** AI Workspace manages [LLM providers](../../../ai-workspace/1.0.0/llm-providers/overview.md), App LLM proxies, MCP proxies, and the credentials behind them for every gateway you connect.
- **Central configuration.** Configure an artifact in the console, then [deploy it to one gateway or several](../../../ai-workspace/1.0.0/llm-proxies/configure-proxy.md).
- **Artifacts in both directions.** Artifacts you create through the gateway management API [sync upward automatically](../../../ai-workspace/1.0.0/sync-gateway-created-artifacts.md) and appear in the console as copies the gateway owns.
- **Policies in one place.** Attach [guardrails, rate limits, and traffic controls](../../../ai-workspace/1.0.0/policies/overview.md) to providers and proxies from the console.
- **Traffic insights.** Review [token usage, latency, cost, and guardrail events](../../../ai-workspace/1.0.0/insights.md) across your applications and consumers.

Connecting a gateway doesn't make it depend on the control plane. If AI Workspace is unreachable, the gateway carries on and the sync catches up once the connection is restored.

## Try it locally

You don't need a hosted deployment to decide whether this suits you. [Get started with AI Workspace](../../../ai-workspace/1.0.0/getting-started.md) runs the control plane on your own machine, then walks you through creating a gateway and configuring a provider.

## Connect your gateway

Four pages document the connection, each one suited to a different runtime and starting point. For the one that matches yours, see [Connect the gateway to AI Workspace](connect-the-gateway.md).
