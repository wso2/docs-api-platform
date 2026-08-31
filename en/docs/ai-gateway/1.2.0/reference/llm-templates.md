---
title: "LLM Provider Templates"
description: "Reference for LLM Provider Templates in API Platform AI Gateway, covering built-in templates for OpenAI, Anthropic, Gemini, and more."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/reference/llm-templates/
md_url: https://wso2.com/api-platform/docs/ai-gateway/reference/llm-templates.md
tags:
  - ai-gateway
  - llm
  - reference
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "reference"
---

# LLM Provider Templates

## Overview

LLM Provider Templates define the characteristics and behaviors specific to an AI service provider, such as OpenAI, Azure OpenAI, Anthropic, or other LLM platforms. These templates describe how the gateway should interpret and extract usage and operational metadata from LLM provider responses, including:

- **Token Usage Metrics**: Prompt tokens, completion tokens, total tokens, and remaining tokens
- **Model Information**: Request and response model identifiers
- **Rate Limiting Data**: Remaining token allowances from response

This page is the reference for that extraction mechanism: which templates ship, what each one reads out of a provider response, and how to define a template of your own. It does not carry the settings that connect the gateway to a provider. Every template below has a page under Supported Providers that covers the upstream URL, the authentication, and a provider definition you can deploy. Each template's section links its own.

## Out-of-the-Box Supported Templates

The API Platform Gateway ships with the following pre-configured LLM provider templates that platform administrators can use immediately without any additional configuration:

| Template ID | Display Name | Provider |
|-------------|--------------|----------|
| `openai` | OpenAI | OpenAI Provider |
| `azure-openai` | Azure OpenAI | Microsoft Azure OpenAI Provider |
| `anthropic` | Anthropic | Anthropic Claude Provider |
| `gemini` | Gemini | Google Gemini Provider |
| `mistralai` | MistralAI | Mistral AI Provider |
| `awsbedrock` | AWS Bedrock | AWS Bedrock Provider |
| `azureai-foundry` | Azure AI Foundry | Microsoft Azure AI Foundry Provider |

These templates are automatically loaded when the gateway starts and are immediately available for use when creating LLM providers.

## Template Structure

Each LLM provider template follows a standard YAML structure:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: <template-id>
spec:
  displayName: <Display Name>
  groupId: <template-family-id>
  managedBy: <template-owner>
  version: <template-version>
  # Provider characteristics
  promptTokens:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  completionTokens:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  totalTokens:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  remainingTokens:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  requestModel:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  responseModel:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
```

### Metadata Extraction Patterns

Templates support four types of extraction locations:

- **`payload`**: Extract from JSON response body using JSONPath expressions (e.g., `$.usage.prompt_tokens`)
- **`header`**: Extract from HTTP response headers using header name (e.g., `x-ratelimit-remaining-tokens`)
- **`queryParam`**: Extract from a URL query parameter
- **`pathParam`**: Extract from URL path using regular expressions (e.g., `(?<=models/)[a-zA-Z0-9.\-]+`)

## Template Details

### OpenAI

The OpenAI template extracts metadata from OpenAI API responses. To connect the gateway to OpenAI, see [OpenAI](../gateway-artifacts/llm-provider/supported-providers/openai.md).

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: openai
spec:
  displayName: OpenAI
  groupId: wso2-openai
  managedBy: wso2
  version: v1.0
  promptTokens:
    location: payload
    identifier: $.usage.prompt_tokens
  completionTokens:
    location: payload
    identifier: $.usage.completion_tokens
  totalTokens:
    location: payload
    identifier: $.usage.total_tokens
  remainingTokens:
    location: header
    identifier: x-ratelimit-remaining-tokens
  requestModel:
    location: payload
    identifier: $.model
  responseModel:
    location: payload
    identifier: $.model
  resourceMappings:
    resources:
      - resource: /responses
        promptTokens:
          location: payload
          identifier: $.usage.input_tokens
        completionTokens:
          location: payload
          identifier: $.usage.output_tokens
```

### Azure OpenAI

The Azure OpenAI template is compatible with Microsoft's Azure OpenAI Service API. To connect the gateway to Azure OpenAI, see [Azure OpenAI](../gateway-artifacts/llm-provider/supported-providers/azure-openai.md).

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: azure-openai
spec:
  displayName: Azure OpenAI
  groupId: wso2-azure-openai
  managedBy: wso2
  version: v1.0
  promptTokens:
    location: payload
    identifier: $.usage.prompt_tokens
  completionTokens:
    location: payload
    identifier: $.usage.completion_tokens
  totalTokens:
    location: payload
    identifier: $.usage.total_tokens
  remainingTokens:
    location: header
    identifier: x-ratelimit-remaining-tokens
  requestModel:
    location: payload
    identifier: $.model
  responseModel:
    location: payload
    identifier: $.model
  resourceMappings:
    resources:
      - resource: /responses
        promptTokens:
          location: payload
          identifier: $.usage.input_tokens
        completionTokens:
          location: payload
          identifier: $.usage.output_tokens
```

### Anthropic

The Anthropic template extracts metadata from Anthropic Claude API responses. To connect the gateway to Anthropic, see [Anthropic](../gateway-artifacts/llm-provider/supported-providers/anthropic.md).

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: anthropic
spec:
  displayName: Anthropic
  groupId: wso2-anthropic
  managedBy: wso2
  version: v1.0
  promptTokens:
    location: payload
    identifier: $.usage.input_tokens
  completionTokens:
    location: payload
    identifier: $.usage.output_tokens
  remainingTokens:
    location: header
    identifier: anthropic-ratelimit-tokens-remaining
  requestModel:
    location: payload
    identifier: $.model
  responseModel:
    location: payload
    identifier: $.model
```

### Gemini

The Gemini template is designed for Google's Gemini API. To connect the gateway to Gemini, see [Gemini](../gateway-artifacts/llm-provider/supported-providers/gemini.md).

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: gemini
spec:
  displayName: Gemini
  groupId: wso2-gemini
  managedBy: wso2
  version: v1.0
  promptTokens:
    location: payload
    identifier: $.usageMetadata.promptTokenCount
  completionTokens:
    location: payload
    identifier: $.usageMetadata.candidatesTokenCount
  totalTokens:
    location: payload
    identifier: $.usageMetadata.totalTokenCount
  remainingTokens:
    location: header
    identifier: x-ratelimit-remaining-tokens
  requestModel:
    location: pathParam
    identifier: (?<=models/)[a-zA-Z0-9.\-]+
  responseModel:
    location: payload
    identifier: $.modelVersion
```

### MistralAI

The MistralAI template supports Mistral AI's API. To connect the gateway to Mistral AI, see [MistralAI](../gateway-artifacts/llm-provider/supported-providers/mistralai.md).

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: mistralai
spec:
  displayName: MistralAI
  groupId: wso2-mistralai
  managedBy: wso2
  version: v1.0
  promptTokens:
    location: payload
    identifier: $.usage.prompt_tokens
  completionTokens:
    location: payload
    identifier: $.usage.completion_tokens
  totalTokens:
    location: payload
    identifier: $.usage.total_tokens
  remainingTokens:
    location: header
    identifier: x-ratelimit-remaining-tokens
  requestModel:
    location: payload
    identifier: $.model
  responseModel:
    location: payload
    identifier: $.model
```

### AWS Bedrock

The AWS Bedrock template is designed for the AWS Bedrock unified API. To connect the gateway to Bedrock with either bearer or AWS Signature Version 4 (SigV4) authentication, see [AWS Bedrock](../gateway-artifacts/llm-provider/supported-providers/aws-bedrock.md).

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: awsbedrock
spec:
  displayName: AWS Bedrock
  groupId: wso2-awsbedrock
  managedBy: wso2
  version: v1.0
  promptTokens:
    location: payload
    identifier: $.usage.inputTokens
  completionTokens:
    location: payload
    identifier: $.usage.outputTokens
  totalTokens:
    location: payload
    identifier: $.usage.totalTokens
  requestModel:
    location: pathParam
    identifier: model/(.+)$
  responseModel:
    location: pathParam
    identifier: model/(.+)$
```

### Azure AI Foundry

The Azure AI Foundry template supports Microsoft's Azure AI Foundry platform. To connect the gateway to Azure AI Foundry, see [Azure AI Foundry](../gateway-artifacts/llm-provider/supported-providers/azure-ai-foundry.md).

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: azureai-foundry
spec:
  displayName: Azure AI Foundry
  groupId: wso2-azureai-foundry
  managedBy: wso2
  version: v1.0
  promptTokens:
    location: payload
    identifier: $.usage.prompt_tokens
  completionTokens:
    location: payload
    identifier: $.usage.completion_tokens
  totalTokens:
    location: payload
    identifier: $.usage.total_tokens
  remainingTokens:
    location: header
    identifier: x-ratelimit-remaining-tokens
  requestModel:
    location: payload
    identifier: $.model
  responseModel:
    location: payload
    identifier: $.model
  resourceMappings:
    resources:
      - resource: /responses
        promptTokens:
          location: payload
          identifier: $.usage.input_tokens
        completionTokens:
          location: payload
          identifier: $.usage.output_tokens
```

## Creating an LLM Provider with a Template

To create an LLM provider using any of the out-of-the-box templates:

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-providers \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: <unique-id>
spec:
  displayName: <display-name>
  version: v1.0
  template: <template-id>
  context: /<provider-context>
  upstream:
    url: https://api.openai.com/v1
    auth:
      type: api-key
      header: <auth-header>
      value: <key>
  accessControl:
    mode: deny_all
    exceptions:
      - path: /chat/completions
        methods: [POST]
      - path: /models
        methods: [GET]
      - path: /models/{modelId}
        methods: [GET]
EOF
```

Replace the placeholders:
- `<unique-id>`: Unique identifier for your provider (e.g., `my-openai-provider`)
- `<display-name>`: Human-readable name (e.g., `My OpenAI Provider`)
- `<template-id>`: One of the supported template IDs (`openai`, `azure-openai`, `anthropic`, `gemini`, `mistralai`, `awsbedrock`, `azureai-foundry`)
- `<provider-context>`: Base path for the provider routes (e.g., `openai/latest`)
- `<auth-header>`: Authentication header name (e.g., `Authorization` for most providers)
- `<key>`: Your API key with appropriate prefix (e.g., `Bearer sk-...` for OpenAI)

The gateway automatically uses the template's metadata extraction patterns to:
- Extract token usage information from responses
- Track model usage for analytics
- Enable token-based rate limiting policies
- Provide consistent monitoring across different LLM providers

## Managing Templates

### Listing Available Templates

To list all available LLM provider templates:

```bash
curl -X GET http://localhost:9090/api/management/v1/llm-provider-templates \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD"
```

### Retrieving a Specific Template

To retrieve details of a specific template:

```bash
curl -X GET http://localhost:9090/api/management/v1/llm-provider-templates/openai \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD"
```

### Creating Custom Templates

Platform administrators can create custom templates for LLM providers not covered by the out-of-the-box templates. For the end-to-end procedure, from defining the template to deploying a provider that uses it, see [Custom provider](../gateway-artifacts/llm-provider/supported-providers/custom-provider.md).

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-provider-templates \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: custom-provider
spec:
  displayName: Custom Provider
  groupId: custom-provider
  managedBy: customer
  version: v1.0
  totalTokens:
    location: payload
    identifier: $.tokens.total
EOF
```

### Updating Templates

To update an existing custom template:

```bash
curl -X PUT http://localhost:9090/api/management/v1/llm-provider-templates/custom-provider \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: custom-provider
spec:
  displayName: Custom Provider Updated
  groupId: custom-provider
  managedBy: customer
  version: v1.0
  promptTokens:
    location: payload
    identifier: $.usage.input_tokens
  # ... other fields
EOF
```

### Deleting Custom Templates

To delete a custom template:

```bash
curl -X DELETE http://localhost:9090/api/management/v1/llm-provider-templates/custom-provider \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD"
```

**Note**: Out-of-the-box templates cannot be deleted or modified. Only custom templates created by platform administrators can be updated or deleted.

## Template Field Reference

Use this table to configure an `LlmProviderTemplate` resource.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `apiVersion` | string | Yes | API version, must be `gateway.api-platform.wso2.com/v1` |
| `kind` | string | Yes | Resource kind, must be `LlmProviderTemplate` |
| `metadata.name` | string | Yes | Unique identifier for the template (used as template ID) |
| `spec.displayName` | string | Yes | Human-readable name for the template |
| `spec.groupId` | string | No | Stable family identifier shared by versions of the same template; defaults to `metadata.name` |
| `spec.managedBy` | string | No | Template owner; built-in templates use `wso2`, while custom templates default to `customer` |
| `spec.version` | string | No | Template content version; defaults to `v1.0` |
| `spec.promptTokens` | object | No | Configuration for extracting prompt/input token count |
| `spec.completionTokens` | object | No | Configuration for extracting completion/output token count |
| `spec.totalTokens` | object | No | Configuration for extracting total token count |
| `spec.remainingTokens` | object | No | Configuration for extracting remaining token allowance |
| `spec.requestModel` | object | No | Configuration for extracting request model identifier |
| `spec.responseModel` | object | No | Configuration for extracting response model identifier |
| `spec.resourceMappings` | object | No | Resource-specific extraction overrides, such as token paths for `/responses` |

### Extraction Configuration Object

Each extraction configuration object has the following structure:

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `location` | string | `payload`, `header`, `queryParam`, `pathParam` | Where to extract the value from |
| `identifier` | string | - | JSONPath (for payload), header or query parameter name, or regex pattern (for pathParam) |
