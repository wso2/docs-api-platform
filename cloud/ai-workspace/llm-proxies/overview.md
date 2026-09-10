---
title: "App LLM proxies overview"
description: "Add an application-facing endpoint on top of an LLM provider for app- or agent-specific authentication, guardrails, and access controls."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/llm-proxies/overview/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/llm-proxies/overview.md
tags:
  - cloud
  - ai-workspace
  - llm-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "overview"
---

# App LLM Proxies Overview

## Why a Proxy on Top of a Provider?

An **LLM Provider** connects the gateway to an upstream LLM service and can be called directly. An **App LLM Proxy** adds an optional, application-facing endpoint on top when you need controls that are specific to a Gen AI application or agent.

The main benefit is specialization and isolation. A single provider can be used directly, or it can back multiple App LLM Proxies: one for a customer-facing chatbot with strict guardrails, another for an internal agent with relaxed settings, and another for a workflow-specific Gen AI assistant. Each proxy is independently configured, and swapping the underlying provider doesn't require any changes to the applications or agents calling the proxy.

## What You Can Do with an App LLM Proxy

**Expose a controlled API endpoint**
The proxy gives you a stable URL your Gen AI application or agent calls. You control which resources (API paths) are exposed, and can enable or disable them without touching the upstream provider.

**Add app-specific controls only when needed**
If provider-level controls are sufficient, you can call the provider directly. Use an App LLM Proxy only when a specific application or agent needs its own authentication, guardrails, exposed resources, or traffic controls.

**Enforce authentication**
Require applications or agents to present an API key before their requests are forwarded to the LLM. Keys are generated per proxy and expire after 90 days.

**Apply guardrails**
Attach content safety, PII masking, or semantic caching policies globally across all endpoints, or target them at specific resources only.

**Create specialized endpoints for apps and agents**
Create separate proxies for different Gen AI applications, agents, teams, or environments (dev, staging, production) — each with independent rate limits, guardrails, access keys, and exposed resources — all sharing the same provider backend.

**Switch providers without client changes**
Because applications and agents call the proxy URL rather than the provider directly, you can swap the underlying LLM Provider (e.g., from OpenAI to Azure OpenAI) without any changes on the client side.

## Next Steps

- [Configure App LLM Proxy](configure-proxy.md) — Step-by-step guide to create and deploy your first specialized proxy
- [Manage App LLM Proxy](manage-proxy.md) — Update configuration, guardrails, and resources after deployment