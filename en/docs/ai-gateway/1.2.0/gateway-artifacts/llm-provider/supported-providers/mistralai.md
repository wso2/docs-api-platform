---
title: "MistralAI"
description: "Connect the AI Gateway to the Mistral AI API: the values Mistral AI supplies, what the mistralai template extracts, and OpenAI-format compatibility."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/mistralai/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/mistralai.md
tags:
  - ai-gateway
  - llm-provider
  - mistralai
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-18
content_type: "how-to"
---

# MistralAI

Connect the AI Gateway to the Mistral AI API. You end up with an LLM Provider that holds your Mistral AI credentials, exposes the API through the gateway, and can be consumed by any LLM proxy.

Mistral AI defines the endpoint URL and the header that carries your API key, so the provider takes those values from Mistral AI's documentation rather than from a fixed configuration here.

This page is for platform administrators, who hold the upstream credentials.

## What you need from Mistral AI

Collect these three values from Mistral AI before you deploy the provider:

| Value | Where it comes from |
|-------|---------------------|
| Endpoint URL | The base URL Mistral AI publishes for its API. See the [Mistral AI API reference](https://docs.mistral.ai/api). |
| Auth header and scheme | The header Mistral AI expects a request to carry the key in. [Send your first API request](https://docs.mistral.ai/getting-started/quickstarts/developer/first-api-request) shows it on a complete request. |
| API key | The key you create for your Mistral AI account. See [Activate Studio and generate an API key](https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key). |

## Template details

The gateway ships a `mistralai` template that tells it where to find token counts and model names in Mistral AI traffic. Name it in the provider's `template` field.

The template ID is `mistralai`, one word. A provider that names `mistral` instead fails validation, because the gateway matches the ID exactly.

The template extracts the following:

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

The gateway reads the token counts and the model name from the request and response payloads, and the remaining-token count from the `x-ratelimit-remaining-tokens` response header. These are the paths the `openai` template uses for the same six values, because Mistral AI reports usage in the OpenAI response shape. Unlike the `openai` template, this one carries no `resourceMappings` block, so those paths apply to every resource the provider exposes.

## Configure the provider

Deploy the provider through the management API, following the procedure in [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md). A Mistral AI provider takes this shape:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: mistralai-provider
spec:
  displayName: MistralAI Provider
  version: v1.0
  template: mistralai
  context: /providers/mistralai
  upstream:
    url: <mistral-endpoint>
    auth:
      type: api-key
      header: <mistral-auth-header>
      value: <mistral-api-key>
  accessControl:
    mode: deny_all
    exceptions:
      - path: <chat-completions-path>
        methods: [POST]
```

Replace the four placeholders with the values you collected:

- *`<mistral-endpoint>`* — the base URL from the Mistral AI API reference.
- *`<mistral-auth-header>`* — the header name that reference specifies for API key authentication.
- *`<mistral-api-key>`* — your Mistral AI API key, formatted as that same reference specifies.
- *`<chat-completions-path>`* — the request path you expose through the gateway.

The `context` value sets the URL prefix the provider answers on, so this provider serves its exposed paths under `/providers/mistralai`. The `accessControl` block denies every upstream path except those listed as exceptions.

## OpenAI-format compatibility

Mistral AI exposes an OpenAI-compatible API, and a transformer is not required when the selected provider already speaks the OpenAI format. An LLM proxy can route OpenAI-format requests to this provider directly.

To normalize those requests and responses anyway, apply the [`openai-to-mistral-transformer`](https://wso2.com/api-platform/policy-hub/policies/openai-to-mistral-transformer) policy. Its `model` parameter is required, and it replaces the model named in the request body.

For the request, response and streaming behavior the transformer covers, including the fields it removes, see the Mistral entry in the [provider capability matrix](../../../routing/multi-provider-routing.md#provider-capability-matrix).

## Related pages

- [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md) — the full deployment procedure this page's definition plugs into.
- [Provider templates](../../../reference/llm-templates.md) — every template the gateway ships, and the metadata each one extracts.
- [Mistral AI documentation](https://docs.mistral.ai/) — Mistral AI's documentation hub, including the models it exposes.
