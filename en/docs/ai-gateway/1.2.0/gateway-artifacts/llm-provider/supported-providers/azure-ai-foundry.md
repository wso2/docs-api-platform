---
title: "Azure AI Foundry"
description: "Connect the AI Gateway to Azure AI Foundry: the values your Foundry resource supplies, and what the azureai-foundry template extracts from responses."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/azure-ai-foundry/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/azure-ai-foundry.md
tags:
  - ai-gateway
  - llm-provider
  - azure-ai-foundry
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-18
content_type: "how-to"
---

# Azure AI Foundry

Connect the AI Gateway to a model deployed on Azure AI Foundry. You end up with an LLM Provider that holds your Azure credentials, exposes your deployment through the gateway, and can be consumed by any LLM proxy.

A Foundry endpoint belongs to one Azure resource and deployment, so the provider takes its URL, auth header and credential from that resource rather than from a fixed vendor URL. Microsoft publishes this platform under the Microsoft Foundry name, so the material you find on Microsoft Learn is titled differently from the Azure AI Foundry label used here.

This page is for platform administrators, who hold the upstream credentials.

## What you need from Azure AI Foundry

Collect these three values from Azure before you deploy the provider:

| Value | Where it comes from |
|-------|---------------------|
| Endpoint URL | Your Foundry resource. Each resource has its own endpoint, so no single URL applies to every deployment. For how Foundry constructs one, see [Endpoints for Microsoft Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/endpoints). |
| Auth header and scheme | The header a request carries the credential in. See the [Microsoft Foundry REST API](https://learn.microsoft.com/en-us/rest/api/microsoft-foundry/) reference. |
| Key or credential | Your Foundry resource, from the Azure portal. That same reference states the format the header expects. |

## Template details

The gateway ships an `azureai-foundry` template that tells it where to find token counts and model names in Foundry traffic. Name it in the provider's `template` field.

The template ID is `azureai-foundry`, with no hyphen between `azure` and `ai`. A provider that names `azure-ai-foundry` instead fails validation, because the gateway matches the ID exactly.

The template extracts the following:

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

The gateway reads the token counts and the model name from the response payload, and the remaining-token count from the `x-ratelimit-remaining-tokens` response header. The `resourceMappings` block overrides the token paths for the `/responses` resource, which reports usage as `input_tokens` and `output_tokens`.

## Configure the provider

Deploy the provider through the management API, following the procedure in [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md). An Azure AI Foundry provider takes this shape:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: azureai-foundry-provider
spec:
  displayName: Azure AI Foundry Provider
  version: v1.0
  template: azureai-foundry
  context: /providers/azureai-foundry
  upstream:
    url: <foundry-endpoint>
    auth:
      type: api-key
      header: <foundry-auth-header>
      value: <foundry-credential>
  accessControl:
    mode: deny_all
    exceptions:
      - path: <deployment-path>
        methods: [POST]
```

Replace the four placeholders with the values you collected:

- *`<foundry-endpoint>`* — the endpoint URL of your Foundry resource.
- *`<foundry-auth-header>`* — the header name the Microsoft Foundry REST API reference specifies.
- *`<foundry-credential>`* — the key from your resource, formatted as that same reference specifies.
- *`<deployment-path>`* — the request path your deployment answers on.

The `context` value sets the URL prefix the provider answers on, so this provider serves its exposed paths under `/providers/azureai-foundry`. The `accessControl` block denies every upstream path except those listed as exceptions.

## Related pages

- [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md) — the full deployment procedure this page's definition plugs into.
- [Provider templates](../../../reference/llm-templates.md) — every template the gateway ships, and the metadata each one extracts.
- [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/) — Microsoft's documentation for the platform, including the models it exposes.
