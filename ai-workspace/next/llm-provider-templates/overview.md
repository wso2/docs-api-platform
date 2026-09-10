---
title: "LLM provider templates overview"
description: "Learn how LLM provider templates capture endpoint, authentication, OpenAPI, and token mapping configuration as reusable blueprints for creating LLM providers in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/llm-provider-templates/overview/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/llm-provider-templates/overview.md
tags:
  - cloud
  - ai-workspace
  - llm-provider-templates
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-10
content_type: "overview"
---

# LLM provider templates overview

An LLM provider template is a reusable blueprint that holds everything needed to connect to an upstream LLM service:

- The upstream **endpoint URL**
- The **inbound authentication** settings (auth type, header or parameter name, and value prefix)
- The provider's **OpenAPI specification**
- The **token and model mappings** used for usage tracking

Once a template holds this configuration, you can create any number of [LLM providers](../llm-providers/overview.md) from it without entering the same details again.

## Template types

| Type | Description |
|------|-------------|
| **Built-in** | Shipped with the product for well-known services: OpenAI, Azure OpenAI, Azure AI Foundry, AWS Bedrock, Anthropic, Mistral, and Gemini. These are read-only; you can only enable or disable them. |
| **Custom** | Created by you, either from scratch or as a new version of a built-in template. You can edit and delete these freely. |

## View templates

1. Navigate to **AI Workspace** in your API Platform dashboard.
2. Go to **Settings** > **LLM Provider Templates**.

Custom and built-in templates appear in separate sections, and each template card shows its most recent version. Disabled templates appear dimmed.

![LLM provider templates listing showing custom and built-in template sections](../../../assets/img/ai-gateway/standalone-ai-workspace/llm-provider-template/template-listing.png)

## Next step

[Configure an LLM provider template](configure-template.md): create a custom template, configure it, and deploy it to a gateway.