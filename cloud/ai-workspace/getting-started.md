---
title: "Get started with AI Workspace"
description: "Create an AI Gateway, configure an LLM provider, and deploy it through the AI Workspace control plane."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/getting-started/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/getting-started.md
tags:
  - cloud
  - ai-workspace
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "quickstart"
---

# Getting Started

The AI Workspace enables you to manage AI gateways and LLM providers. Follow these steps to get started.

## Step 1: Create an AI Gateway

An AI gateway is the runtime that processes and routes requests between your applications and LLM providers. You need at least one gateway before configuring providers or proxies.

1. Navigate to **AI Gateways** in the left navigation menu.
2. Click **+ Add AI Gateway**.
3. Fill in the **Name**, **URL**, and **Associated Environment**.
4. Click **Add Gateway**.
5. Copy the **Gateway Registration Token** and follow the setup instructions to start the gateway runtime.
6. Once connected, the gateway status changes from **Inactive** to **Active**.

For detailed instructions, see [AI Gateways](ai-gateways/setting-up.md).

## Step 2: Configure an LLM Provider

An LLM provider connects the AI Workspace to an AI service platform like OpenAI, Anthropic, or Azure OpenAI.

1. Navigate to **LLM** > **Service Provider**.
2. Click **+ Add New Provider** and select your provider type.
3. Fill in the **Name**, **Version**, and **API Key**.
4. Click **Add Provider**.
5. Click **Deploy to Gateway** and deploy to your active gateway.

For detailed instructions, see [Configure LLM Provider](llm-providers/configure-provider.md).

## What's Next

- [Manage your provider](llm-providers/manage-provider.md) — Configure connection, access control, security, rate limiting, guardrails, and models

!!! note
	You can optionally create an LLM proxy if a specific Gen AI application or agent needs its own guardrails, authentication, exposed resources, routing, or other app-specific controls on top of providers.

- [Configure App LLM Proxy](llm-proxies/configure-proxy.md) — Create a specialized endpoint only when you need app-specific or agent-specific controls on top of a provider
- [Manage your App LLM Proxy](llm-proxies/manage-proxy.md) — Configure provider settings, resources, security, and guardrails
