---
title: "Get started with AI Workspace"
description: "Run AI Workspace locally with Docker Compose, create an AI Gateway, configure an LLM provider, and deploy it through the AI Workspace control plane."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/getting-started/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/getting-started.md
tags:
  - cloud
  - ai-workspace
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-08
content_type: "quickstart"
---

# Getting Started

The AI Workspace enables you to manage AI gateways and LLM providers. This guide gets AI Workspace running locally with Docker Compose in under five minutes, then walks you through creating your first AI gateway and LLM provider.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin (`docker compose version`)
- Ports **5380** and **9243** available on your machine
- `curl` and `unzip` installed

## Step 1: Download AI Workspace

Run this command in your terminal to download and unzip AI Workspace:

```bash
curl -sLO https://github.com/wso2/api-platform/releases/download/ai-workspace/v1.0.0-alpha/wso2apip-ai-workspace-1.0.0-alpha.zip && \
unzip wso2apip-ai-workspace-1.0.0-alpha.zip
```

## Step 2: Start the Stack

```bash
cd wso2apip-ai-workspace-1.0.0-alpha
docker compose up -d
```

## Step 3: Open AI Workspace

Navigate to **https://localhost:5380** and sign in with the default credentials:

![AI Workspace file-based login window with Username and Password fields](../../assets/img/ai-gateway/ai-workspace/authentication/filebased-login.png)

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `admin` |

!!! tip "Browser trust warning?"
    Both services use a self-signed TLS certificate by default. Click **Advanced > Proceed** to continue, then return to the workspace.

!!! note "About this login"
    These default credentials come from file-based authentication, which stores the user list directly in the Platform API configuration file. It's the quickest way to try AI Workspace, but before you move to a production or shared environment, connect a real identity provider to manage user login. See [Authentication in AI Workspace](authentication/overview.md).

## Step 4: Create an AI Gateway

An AI gateway is the runtime that processes and routes requests between your applications and LLM providers. You need at least one gateway before configuring providers or proxies.

1. Navigate to **AI Gateways** in the left navigation menu.
2. Click **+ Add AI Gateway**.
3. Fill in the **Name**, **URL**, and then click **Add Gateway**.
4. Copy the **Gateway Registration Token** and follow the setup instructions to start the gateway runtime.
5. Once connected, the gateway status changes from **Inactive** to **Active**.

For detailed instructions, see [AI Gateways](ai-gateways/setting-up.md).

## Step 5: Configure an LLM Provider

An LLM provider connects AI Workspace to an AI service platform such as OpenAI, Anthropic, or Azure OpenAI.

1. Navigate to **LLM** > **Service Provider**.
2. Click **+ Add New Provider** and select your provider type.
3. Fill in the **Name**, **Version**, and **API Key**, then click **Add Provider**.
4. Configure how applications authenticate when they access this provider through the gateway.
5. Click **Deploy to Gateway** and select your active gateway.

For detailed instructions, see [Configure LLM Provider](llm-providers/configure-provider.md).

## What's Next

- [Manage your provider](llm-providers/manage-provider.md): configure connection, access control, security, rate limiting, guardrails, and models

!!! note
	You can optionally create an LLM proxy if a specific Gen AI application or agent needs its own guardrails, authentication, exposed resources, routing, or other app-specific controls on top of providers.

- [Configure App LLM Proxy](llm-proxies/configure-proxy.md): create a specialized endpoint only when you need app-specific or agent-specific controls on top of a provider
- [Manage your App LLM Proxy](llm-proxies/manage-proxy.md): configure provider settings, resources, security, and guardrails
