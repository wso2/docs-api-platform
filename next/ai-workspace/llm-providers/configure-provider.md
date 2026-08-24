---
title: "Configure an LLM provider"
description: "Add an LLM provider in AI Workspace, configure authentication and guardrails, and deploy it to an AI Gateway."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/llm-providers/configure-provider/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/llm-providers/configure-provider.md
tags:
  - cloud
  - ai-workspace
  - llm-providers
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Configure LLM Provider

LLM Providers allow you to connect AI service platforms like OpenAI, Anthropic, and others to the AI Workspace. Once configured, providers can be deployed and used directly through the managed gateway.

!!! note
    App LLM Proxies are optional. Use them when you want app- or agent-specific guardrails, authentication, resource exposure, or other controls on top of the same provider.

## Prerequisites

- Access to API Platform Console with **Admin** role
- At least one [AI Gateway created and set up](../ai-gateways/setting-up.md)
- API credentials for your LLM provider (API key, access tokens, etc.)

## Add a New Provider

1. Navigate to **AI Workspace** in your API Platform dashboard.
2. Select **Service Providers** from the menu.
3. Click **+ Add New Provider** and choose your provider type (e.g., **OpenAI**, **Anthropic**). Any [custom LLM provider templates](../llm-provider-templates/overview.md) you have created also appear in the picker.

   ![Add LLM Service Provider panel showing selectable tiles for OpenAI, Mistral, Gemini, Azure OpenAI, Azure AI Foundry, AWS Bedrock, and Anthropic](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider/select-llm-provider-type.png)

4. If the selected template has more than one version, select a version and click **Continue**. A single version is selected automatically.

## Configure Provider Details

After selecting your provider type, fill in the provider configuration form:

   ![Add LLM Service Provider form with OpenAI selected, showing Name, Version, Description, Context, API Key, and Guardrails fields](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider/llm-provider-details.png)

### Basic Information

1. **Name*** (Required): Enter a unique name for the provider (e.g., `openai-production`, `anthropic-dev`).

2. **Version*** (Required): The version is pre-filled (e.g., `v1.0`). You can edit this if needed.

3. **Description** (Optional): Add a description to identify the provider's purpose.

4. **Context** (Optional): Enter the context path (default: `/`). This is the base context for the provider.

### Authentication

The authentication fields vary depending on the provider you selected:

=== "OpenAI"
    **API Key*** (Required): Enter your OpenAI API key (starts with `sk-proj-` or `sk-`).
    
    !!! info
        OpenAI's endpoint URL is pre-configured automatically.

=== "Anthropic"
    **API Key*** (Required): Enter your Anthropic API key (starts with `sk-ant-`).
    
    !!! info
        Anthropic's endpoint URL is pre-configured automatically.

=== "Gemini"
    **API Key*** (Required): Enter your Google AI API key.
    
    !!! info
        Gemini's endpoint URL is pre-configured automatically.

=== "Mistral AI"
    **API Key*** (Required): Enter your Mistral AI API key.
    
    !!! info
        Mistral AI's endpoint URL is pre-configured automatically.

=== "Azure OpenAI"
    1. **Upstream URL*** (Required): Enter your Azure OpenAI resource endpoint (e.g., `https://your-resource.openai.azure.com/`).
    2. **API Key*** (Required): Enter your Azure OpenAI API key.

=== "Azure AI Foundry"
    1. **Upstream URL*** (Required): Enter your Azure AI Foundry endpoint URL.
    2. **API Key*** (Required): Enter your Azure AI Foundry API key.

### Add Guardrails (Optional)

You can attach policies and guardrails to your provider that apply to all requests:

1. In the **Guardrails** section of the form, click **+ Add Guardrail**.

2. A sidebar will open showing available guardrails and policies.

3. Click on a guardrail to select it and configure its settings.

4. Click **Add** to attach it to the provider.

!!! tip "Advanced Settings"
    Each guardrail includes advanced configuration options that allow you to fine-tune its behavior. After selecting a guardrail, you can configure these settings before attaching it to the provider.

!!! info
    Learn more about available guardrails in the [Guardrails Overview](../policies/guardrails/overview.md). For the full list of policies and their specifications, visit the [Policy Hub](https://wso2.com/api-platform/policy-hub/).

## Save Provider

1. After configuring all settings and adding guardrails (if needed), click **Add Provider**.

2. You'll see a confirmation message indicating the provider was created successfully.

3. The provider will appear in the providers list.

## Deploy Provider to Gateway

After creating your provider, you must deploy it to a gateway before it can be used.

!!! warning "Required Step"
    Your provider will not be functional until it is deployed to at least one gateway.

1. Click the **Deploy to Gateway** button in the top right corner.

2. Click **Deploy** on one or more gateways from the available list.

3. Wait for the deployment to complete. The status will change to **Deployed**.

## Get Started

Once the provider is deployed, the provider details page shows the Invoke URL on the left and a **Get Started** panel on the right.

### Invoke URL

Select a gateway from the **Gateways** dropdown to see the base URL for accessing this provider through that gateway.

### API Keys

Generate an API key to authenticate requests to the deployed gateway.

1. Click **Generate API Key** in the Get Started panel.
2. Copy and save your API key immediately.

!!! danger "Important"
    API keys are only displayed once. Store it in a secure location immediately — you will not be able to retrieve it again.

### Deployed Gateways

The **Deployed Gateways** section lists all gateways this provider is deployed to, along with the host address and deployment status.

---

## Next Steps

- [Configure App LLM Proxy](../llm-proxies/configure-proxy.md) - Configure and deploy a specialized proxy endpoint for a Gen AI application or agent using your provider
- [Manage Provider](manage-provider.md) - Configure access control, security, rate limiting, and more