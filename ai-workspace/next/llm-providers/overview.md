---
title: "LLM providers overview"
description: "Connect AI service platforms such as OpenAI, Anthropic, Azure OpenAI, Gemini, and Mistral AI as reusable LLM providers in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/llm-providers/overview/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/llm-providers/overview.md
tags:
  - cloud
  - ai-workspace
  - llm-providers
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "overview"
---

# LLM providers overview

An LLM provider is an integration with an AI service platform that offers language models. By configuring providers in AI Workspace, you can:

- **Centralize credential management**: Store API keys and authentication details securely
- **Connect multiple providers**: Integrate with leading LLM services
- **Monitor provider status**: Track availability and health of connected services
- **Reuse configuration**: Use one provider across multiple proxies without duplicating credentials

## Supported providers

AI Workspace supports the following LLM providers:

| Provider | Description | Learn more |
|----------|-------------|-----------|
| <img src="https://raw.githubusercontent.com/nomadxd/openapi-connectors/main/openapi/openai/icon.png" width="32" alt=""> **OpenAI** | Access GPT-4, GPT-3.5, and other OpenAI models | [OpenAI documentation](https://developers.openai.com/api/docs) |
| <img src="https://raw.githubusercontent.com/nomadxd/openapi-connectors/main/openapi/anthropic.claude/icon.png" width="32" alt=""> **Anthropic** | Integrate Anthropic Claude models | [Anthropic documentation](https://docs.anthropic.com/) |
| <img src="https://raw.githubusercontent.com/nomadxd/openapi-connectors/main/openapi/azure.openai/icon.png" width="32" alt=""> **Azure OpenAI** | Use OpenAI models hosted on Microsoft Azure | [Azure OpenAI documentation](https://azure.microsoft.com/products/ai-services/openai-service) |
| <img src="https://raw.githubusercontent.com/wso2/api-platform/main/llm-provider-specs/azureai-foundry/icon.png" width="32" alt=""> **Azure AI Foundry** | Access models through Azure AI Foundry platform | [Azure AI Foundry documentation](https://azure.microsoft.com/products/ai-studio) |
| <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" width="32" alt=""> **Gemini** | Integrate Google's Gemini language models | [Gemini documentation](https://ai.google.dev/gemini-api) |
| <img src="https://raw.githubusercontent.com/nomadxd/openapi-connectors/main/openapi/mistral/icon.png" width="32" alt=""> **Mistral AI** | Access Mistral's open and commercial models | [Mistral AI documentation](https://mistral.ai/) |
| <img src="https://raw.githubusercontent.com/wso2/api-platform/main/llm-provider-specs/awsbedrock/icon.png" width="32" alt=""> **AWS Bedrock** | Access Anthropic, Meta, Mistral, and Amazon models through Amazon Bedrock | [AWS Bedrock documentation](https://aws.amazon.com/bedrock/) |

## Connect a custom provider

If the LLM service you use isn't in the list above, a user with template-management access can define a reusable **LLM Provider Template** under **Settings > LLM Provider Templates**. A template captures the endpoint and authentication shape for a custom provider. It then appears in the provider type selector alongside the built-in providers whenever you add a provider.

## Next step

[Configure an LLM provider](configure-provider.md): set up your first provider.