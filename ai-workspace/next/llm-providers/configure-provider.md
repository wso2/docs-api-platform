---
title: "Configure an LLM provider"
description: "Add an LLM provider in AI Workspace, configure authentication and guardrails, and deploy it to an AI Gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/llm-providers/configure-provider/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/llm-providers/configure-provider.md
tags:
  - cloud
  - ai-workspace
  - llm-providers
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Configure an LLM provider

An LLM provider connects an AI service platform such as OpenAI or Anthropic to AI Workspace. Once you configure a provider, deploy it and call it directly through the managed gateway.

!!! note
    App LLM proxies are optional. Use one when you want app-specific or agent-specific guardrails, authentication, or resource exposure on top of the same provider.

## Prerequisites

- A user whose token carries the scopes these steps need:

    - `ap:llm_provider:manage` to add and edit providers.
    - `ap:llm_provider:deployment:manage` to deploy a provider.
    - `ap:gateway:read` to choose the target gateway.
    - `ap:secret:create` because AI Workspace stores the upstream API key as an encrypted [secret](../secrets-management.md) on your behalf.

    Of the roles the [role-to-scope mapping](../setting-up/authentication/overview.md) ships, `ap_admin` grants all four.

- At least one [AI Gateway created and set up](../ai-gateways/setting-up.md).
- API credentials for your LLM provider, such as an API key or an access token.

## Add a new provider

1. Navigate to **AI Workspace** in your API Platform dashboard.
2. Select **LLM Providers** from the menu.
3. Click **+ Add New Provider** and choose your provider type, for example **OpenAI** or **Anthropic**. Any [custom LLM provider templates](../llm-provider-templates/overview.md) you have created also appear in the picker.

   ![Add LLM Service Provider panel showing selectable tiles for OpenAI, Mistral, Gemini, Azure OpenAI, Azure AI Foundry, AWS Bedrock, and Anthropic](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider/select-llm-provider-type.png)

4. If the selected template has more than one version, select a version and click **Continue**. A single version is selected automatically.

## Configure provider details

After selecting your provider type, fill in the provider configuration form:

   ![Add LLM Service Provider form with OpenAI selected, showing Name, Version, Description, Context, API Key, and Guardrails fields](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider/llm-provider-details.png)

### Basic information

1. **Name** (required): Enter a unique name for the provider (for example, `openai-production`, `anthropic-dev`).

2. **Version** (required): The version is pre-filled (for example, `v1.0`). You can edit this if needed.

3. **Description** (optional): Add a description to identify the provider's purpose.

4. **Context** (optional): Enter the context path (default: `/`). This is the base context for the provider.

### Authentication

The authentication fields vary depending on the provider you selected:

=== "OpenAI"
    **API Key** (required): Enter your OpenAI API key (starts with `sk-proj-` or `sk-`).
    
    !!! info
        OpenAI's endpoint URL is pre-configured automatically.

=== "Anthropic"
    **API Key** (required): Enter your Anthropic API key (starts with `sk-ant-`).
    
    !!! info
        Anthropic's endpoint URL is pre-configured automatically.

=== "Gemini"
    **API Key** (required): Enter your Google AI API key.
    
    !!! info
        Gemini's endpoint URL is pre-configured automatically.

=== "Mistral AI"
    **API Key** (required): Enter your Mistral AI API key.
    
    !!! info
        Mistral AI's endpoint URL is pre-configured automatically.

=== "Azure OpenAI"
    1. **Upstream URL** (required): Enter your Azure OpenAI resource endpoint (for example, `https://your-resource.openai.azure.com/`).
    2. **API Key** (required): Enter your Azure OpenAI API key.

=== "Azure AI Foundry"
    1. **Upstream URL** (required): Enter your Azure AI Foundry endpoint URL.
    2. **API Key** (required): Enter your Azure AI Foundry API key.

=== "AWS Bedrock"
    1. **Upstream URL** (required): Enter the Bedrock runtime endpoint for your region, in the form `https://bedrock-runtime.<region>.amazonaws.com` (for example, `https://bedrock-runtime.us-east-1.amazonaws.com`).
    2. **API Key** (required): Enter your Amazon Bedrock API key. Paste the raw key. AI Workspace adds the `Bearer` prefix followed by a space, and sends the credential as `Authorization: Bearer <key>`.

    !!! info
        Bedrock's endpoint isn't pre-configured, because the runtime host is region-specific. Use the region your model access lives in. If you use a short-term Bedrock API key, it's scoped to the region that issued it and doesn't work against another region's endpoint. A long-term key, which is backed by service-specific Identity and Access Management (IAM) credentials, isn't tied to a single region.

!!! info "How the API key is stored"
    AI Workspace stores the upstream API key as an encrypted secret and keeps only a `{{ secret "handle" }}` reference in the provider configuration. The plaintext key never lands in the provider configuration or in an API response. See [Secrets management](../secrets-management.md).

!!! note "Custom provider templates"
    If you're adding a provider from a custom [LLM provider template](overview.md#connect-a-custom-provider) (**Settings > LLM Provider Templates**), the **Authentication Type** can also be set to **other** (no credentials stored — use a policy to handle upstream auth) or **none** (no upstream authentication sent), in addition to **api-key**.

### Add guardrails (optional)

Attach policies and guardrails that apply to every request this provider serves:

1. In the **Guardrails** section of the form, click **+ Add Guardrail**.

2. A sidebar opens showing the available guardrails and policies.

3. Click a guardrail to select it and configure its settings.

4. Click **Add** to attach it to the provider.

!!! tip "Advanced settings"
    Each guardrail includes advanced configuration options for fine-tuning its behavior. After selecting a guardrail, configure these settings before you attach it to the provider.

!!! info
    Learn more about available guardrails in the [Policies overview](../policies/overview.md). For the full list of policies and their specifications, visit the [Policy Hub](https://wso2.com/api-platform/policy-hub/).

## Save provider

1. After configuring all settings and adding guardrails (if needed), click **Add Provider**.

2. A confirmation message reports that the provider was created.

3. The provider appears in the providers list.

## Deploy provider to gateway

After creating your provider, you must deploy it to a gateway before it can be used.

!!! warning "Required step"
    The provider isn't functional until you deploy it to at least one gateway.

1. Click the **Deploy to Gateway** button in the top right corner.

2. Click **Deploy** on one or more gateways from the available list.

3. Wait for the deployment to complete. The status changes to **Deployed**.

## Get started

Once the provider is deployed, the provider details page shows the Invoke URL on the left and a **Get Started** panel on the right.

### Invoke URL

Select a gateway from the **Gateways** dropdown to see the base URL for accessing this provider through that gateway.

### API keys

Generate an API key to authenticate requests to the deployed gateway.

1. Click **Generate API Key** in the Get Started panel.
2. Copy and save your API key immediately.

!!! danger "Important"
    An API key is displayed only once. Store it in a secure location immediately, because you can't retrieve it again.

### Deployed gateways

The **Deployed Gateways** section lists all gateways this provider is deployed to, along with the host address and deployment status.

## Next steps

- [Configure an App LLM proxy](../llm-proxies/configure-proxy.md): configure and deploy a specialized proxy endpoint for a GenAI application or agent that uses your provider
- [Manage an LLM provider](manage-provider.md): configure access control, security, rate limiting, and more