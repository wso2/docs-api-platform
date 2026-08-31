---
title: "Azure OpenAI"
description: "Connect the AI Gateway to Azure OpenAI: the values your Azure resource supplies, what the azure-openai template extracts, and OpenAI-format compatibility."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/azure-openai/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/azure-openai.md
tags:
  - ai-gateway
  - llm-provider
  - azure-openai
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-18
content_type: "how-to"
---

# Azure OpenAI

Connect the AI Gateway to an Azure OpenAI deployment. You end up with an LLM Provider that holds your Azure credentials, exposes your deployment through the gateway, and can be consumed by any LLM proxy.

An Azure OpenAI endpoint belongs to one Azure resource and deployment, so the provider takes its URL, auth header and key from that resource rather than from a fixed vendor URL. Microsoft's documentation presents this service under the Microsoft Foundry name.

This page is for platform administrators, who hold the upstream credentials.

## What you need from Azure OpenAI

Collect these three values from Azure before you deploy the provider:

| Value | Where it comes from |
|-------|---------------------|
| Endpoint URL | Your Azure OpenAI resource. Each resource has its own endpoint, so no single URL applies to every deployment. Copy it from the resource in the Azure portal. |
| API key and auth header | The keys on that same resource. For the header name and the scheme that carries the key, see the [Azure OpenAI REST API reference](https://learn.microsoft.com/en-us/azure/foundry/openai/reference). |
| Deployment name and API version | The deployment you route to. The transformer requires the API version, as described in [OpenAI-format compatibility](#openai-format-compatibility). For the values Azure accepts, see [Azure OpenAI API versions](https://learn.microsoft.com/en-us/azure/foundry/openai/api-version-lifecycle). |

## Template details

The gateway ships an `azure-openai` template that tells it where to find token counts and model names in Azure OpenAI traffic. Name it in the provider's `template` field.

The template extracts the following:

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

The gateway reads the token counts and the model name from the response payload, and the remaining-token count from the `x-ratelimit-remaining-tokens` response header. The `resourceMappings` block overrides the token paths for the `/responses` resource, which reports usage as `input_tokens` and `output_tokens`.

## Configure the provider

Deploy the provider through the management API, following the procedure in [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md). An Azure OpenAI provider takes this shape:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: azure-openai-provider
spec:
  displayName: Azure OpenAI Provider
  version: v1.0
  template: azure-openai
  context: /providers/azure-openai
  upstream:
    url: <azure-openai-endpoint>
    auth:
      type: api-key
      header: <azure-auth-header>
      value: <azure-api-key>
  accessControl:
    mode: deny_all
    exceptions:
      - path: <deployment-path>
        methods: [POST]
```

Replace the four placeholders with the values you collected:

- *`<azure-openai-endpoint>`* — the endpoint URL of your Azure OpenAI resource.
- *`<azure-auth-header>`* — the header name Azure's REST API reference specifies for key authentication.
- *`<azure-api-key>`* — a key from your resource, formatted as that same reference specifies.
- *`<deployment-path>`* — the request path your deployment answers on.

The `context` value sets the URL prefix the provider answers on, so this provider serves its exposed paths under `/providers/azure-openai`. The `accessControl` block denies every upstream path except those listed as exceptions.

## OpenAI-format compatibility

Azure OpenAI accepts the OpenAI wire format, but on a path built from your deployment and API version. When an LLM proxy routes OpenAI-format requests to this provider, apply the [`openai-to-azure-openai-transformer`](https://wso2.com/api-platform/policy-hub/policies/openai-to-azure-openai-transformer) policy, which rewrites the request path to match.

The transformer takes three parameters. `apiVersion` is required. `model` is optional and falls back to the model in the request body. `pathSuffix` is optional and defaults to `/chat/completions`.

For the request, response and streaming behavior the transformer covers, see the Azure OpenAI entry in the [provider capability matrix](../../../routing/multi-provider-routing.md#provider-capability-matrix).

## Related pages

- [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md) — the full deployment procedure this page's definition plugs into.
- [Provider templates](../../../reference/llm-templates.md) — every template the gateway ships, and the metadata each one extracts.
- [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/) — Microsoft's documentation for Azure OpenAI and the rest of the platform.
