---
title: "Gemini"
description: "Connect the AI Gateway to the Gemini API: the values Google supplies, what the gemini template extracts, and OpenAI-format compatibility."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/gemini/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/gemini.md
tags:
  - ai-gateway
  - llm-provider
  - gemini
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-18
content_type: "how-to"
---

# Gemini

Connect the AI Gateway to Google's Gemini API. You end up with an LLM Provider that holds your Gemini credentials, exposes the API through the gateway, and can be consumed by any LLM proxy.

Google defines the endpoint URL and the header that carries your API key, so the provider takes those values from Google's documentation rather than from a fixed configuration here.

This page is for platform administrators, who hold the upstream credentials.

## What you need from Gemini

Collect these three values from Google before you deploy the provider:

| Value | Where it comes from |
|-------|---------------------|
| Endpoint URL | The base URL Google publishes for the Gemini API. See the [Gemini API reference](https://ai.google.dev/api). |
| Auth header and scheme | The header Google expects a request to carry the key in. The [Generating content](https://ai.google.dev/api/generate-content) reference shows it on a complete request. |
| API key | The key you create for the Gemini API. See [Using Gemini API keys](https://ai.google.dev/gemini-api/docs/api-key). |

## Template details

The gateway ships a `gemini` template that tells it where to find token counts and model names in Gemini traffic. Name it in the provider's `template` field.

The template extracts the following:

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

Gemini reports usage in its own response shape, so this template reads `$.usageMetadata.promptTokenCount` and `$.usageMetadata.candidatesTokenCount` where every other template reads `$.usage.prompt_tokens` and `$.usage.completion_tokens`. Two more paths differ for the same reason: the request model comes from the request path, matched after `models/`, rather than from the payload, and the response model comes from `$.modelVersion`. The remaining-token count comes from the `x-ratelimit-remaining-tokens` response header, as it does for every template.

## Configure the provider

Deploy the provider through the management API, following the procedure in [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md). A Gemini provider takes this shape:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: gemini-provider
spec:
  displayName: Gemini Provider
  version: v1.0
  template: gemini
  context: /providers/gemini
  upstream:
    url: <gemini-endpoint>
    auth:
      type: api-key
      header: <gemini-auth-header>
      value: <gemini-api-key>
  accessControl:
    mode: deny_all
    exceptions:
      - path: <generate-content-path>
        methods: [POST]
```

Replace the four placeholders with the values you collected:

- *`<gemini-endpoint>`* — the base URL from Google's Gemini API reference.
- *`<gemini-auth-header>`* — the header name that reference specifies for API key authentication.
- *`<gemini-api-key>`* — your Gemini API key, formatted as that same reference specifies.
- *`<generate-content-path>`* — the request path you expose through the gateway.

The `context` value sets the URL prefix the provider answers on, so this provider serves its exposed paths under `/providers/gemini`. The `accessControl` block denies every upstream path except those listed as exceptions.

## OpenAI-format compatibility

Gemini uses its own request and response format. When an LLM proxy routes OpenAI-format requests to this provider, apply the [`openai-to-gemini-transformer`](https://wso2.com/api-platform/policy-hub/policies/openai-to-gemini-transformer) policy, which converts between the two.

The transformer takes two parameters. `model` is required. `apiVersion` is optional and defaults to `v1beta`. This parameter configures the transformer only, and does not supply any part of the endpoint URL.

For the request, response and streaming behavior the transformer covers, see the Gemini entry in the [provider capability matrix](../../../routing/multi-provider-routing.md#provider-capability-matrix).

Google documents [OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai) for the Gemini API as well.

## Related pages

- [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md) — the full deployment procedure this page's definition plugs into.
- [Provider templates](../../../reference/llm-templates.md) — every template the gateway ships, and the metadata each one extracts.
- [Gemini API documentation](https://ai.google.dev/gemini-api/docs) — Google's documentation for the API, including the models it exposes.
