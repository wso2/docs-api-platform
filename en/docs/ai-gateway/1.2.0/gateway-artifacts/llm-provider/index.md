---
title: "LLM provider"
description: "Connect the AI Gateway to an LLM backend: what an LLM Provider holds, who configures it, and a guide for every provider template it ships."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider.md
tags:
  - ai-gateway
  - llm-provider
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "concept"
---

# LLM provider

An LLM Provider represents a connection to an AI backend service such as OpenAI, Azure OpenAI, or other LLM APIs. Platform administrators configure LLM Providers to define:

- The LLM Provider Template
- The upstream LLM service URL
- Authentication credentials (API keys, tokens)
- Access control rules for which endpoints are exposed
- Budget control policies, such as token-based rate limiting
- Organization-wide policies such as guardrails

Once configured, the LLM Provider allows traffic to flow through the gateway to the AI backend.

## Who configures this

Platform administrators own LLM providers. An administrator holds the upstream credentials, decides which endpoints the provider exposes, and sets the organization-wide policies that every LLM proxy consuming the provider inherits.

## In this section

Every template the gateway ships has a provider page under Supported Providers. Three of them — OpenAI, Anthropic and AWS Bedrock — carry a fixed upstream URL, the authentication the provider expects, and a definition you can deploy as it stands. For the other four, the endpoint and the credential belong to your own account or resource, so those pages name what to obtain and link the provider that defines it. A further page covers a service with no shipped template at all. [Provider templates](../../reference/llm-templates.md) is the reference for what each template extracts.

This section contains the following pages:

| Page | What it covers |
|------|----------------|
| [Create and configure an LLM provider](create-and-configure-an-llm-provider.md) | Create an LLM provider on the AI Gateway: choose a template, set the upstream URL and credentials, deploy it with the management API, and test the connection. |
| [OpenAI](supported-providers/openai.md) | Connect the AI Gateway to OpenAI: the upstream URL, API key authentication, the endpoints the provider exposes, and a request that tests the connection. |
| [Azure OpenAI](supported-providers/azure-openai.md) | Connect the AI Gateway to Azure OpenAI: the values your Azure resource supplies, what the azure-openai template extracts, and OpenAI-format compatibility. |
| [Anthropic](supported-providers/anthropic.md) | Connect the AI Gateway to the Anthropic Messages API: the upstream URL, x-api-key authentication, and the endpoint the provider exposes. |
| [Gemini](supported-providers/gemini.md) | Connect the AI Gateway to the Gemini API: the values Google supplies, what the gemini template extracts, and OpenAI-format compatibility. |
| [MistralAI](supported-providers/mistralai.md) | Connect the AI Gateway to the Mistral AI API: the values Mistral AI supplies, what the mistralai template extracts, and OpenAI-format compatibility. |
| [AWS Bedrock](supported-providers/aws-bedrock.md) | Connect API Platform AI Gateway to AWS Bedrock using a bearer API key or AWS Signature Version 4 authentication, then invoke a model through the gateway. |
| [Azure AI Foundry](supported-providers/azure-ai-foundry.md) | Connect the AI Gateway to Azure AI Foundry: the values your Foundry resource supplies, and what the azureai-foundry template extracts from responses. |
| [Custom provider](supported-providers/custom-provider.md) | Connect the AI Gateway to an LLM service with no shipped template: define an LlmProviderTemplate of your own, deploy it, and create a provider that uses it. |

## Related guides

- [Set up a governed multi-model LLM proxy](../../../../guides/ai-and-mcp/set-up-a-governed-multi-model-llm-proxy-with-cost-controls-and-failover.md) — adds Azure OpenAI as an LLM provider, then distributes requests across models behind a single proxy.
