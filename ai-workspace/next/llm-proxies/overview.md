---
title: "App LLM proxies overview"
description: "Add an application-facing endpoint on top of an LLM provider for app- or agent-specific authentication, guardrails, and access controls."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/llm-proxies/overview/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/llm-proxies/overview.md
tags:
  - cloud
  - ai-workspace
  - llm-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-07
content_type: "overview"
---

# App LLM proxies overview

## Why a proxy on top of a provider?

An **LLM Provider** connects the gateway to an upstream LLM service and can be called directly. An **App LLM Proxy** adds an optional, application-facing endpoint on top when you need controls that are specific to a GenAI application or agent.

The main benefit is specialization and isolation. You can call a single provider directly, or back multiple App LLM proxies with it. For example, use one proxy for a customer-facing chatbot with strict guardrails, a second for an internal agent with relaxed settings, and a third for a workflow-specific GenAI assistant. You configure each proxy independently.

## What you can do with an App LLM proxy

**Expose a controlled API endpoint.** The proxy gives you a stable URL your GenAI application or agent calls. You control which resources (API paths) are exposed, and can enable or disable them without touching the upstream provider.

**Add app-specific controls only when needed.** If provider-level controls are sufficient, call the provider directly. Use an App LLM proxy only when a specific application or agent needs its own authentication, guardrails, exposed resources, or traffic controls.

**Enforce authentication.** Require applications or agents to present an API key before the gateway forwards their requests to the LLM. The workspace generates keys per proxy, and a key generated this way expires 90 days later.

**Apply guardrails.** Attach content safety, personally identifiable information (PII) masking, or semantic caching policies globally across all endpoints, or target them at specific resources only.

**Create specialized endpoints for apps and agents.** Create separate proxies for different GenAI applications, agents, teams, or environments such as dev, staging, and production. Each proxy has its own guardrails, access keys, and exposed resources. Provider-level rate limits stay shared across every proxy that uses the same provider backend.

**Switch between compatible providers without client changes.** Applications and agents call the proxy URL rather than the provider directly. You can swap the underlying LLM provider, for example from OpenAI to Azure OpenAI, and clients need no changes as long as the new provider preserves the client-facing contract. That contract covers the authentication clients send and the resources the proxy exposes.

## Next steps

- [Configure an App LLM proxy](configure-proxy.md): create and deploy your first specialized proxy
- [Manage an App LLM proxy](manage-proxy.md): update configuration, guardrails, and resources after deployment