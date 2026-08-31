---
title: "Multi-provider routing"
description: "Route OpenAI-compatible LLM proxy requests to multiple providers using header-based selection and provider-specific transformers."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/routing/multi-provider-routing/
md_url: https://wso2.com/api-platform/docs/ai-gateway/routing/multi-provider-routing.md
tags:
  - ai-gateway
  - llm
  - routing
  - troubleshooting
  - fallback
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Multi-provider routing

## Overview

Multi-provider routing lets one large language model (LLM) proxy expose a single OpenAI-compatible endpoint while routing each request to a selected LLM provider. Applications continue to use the same endpoint and OpenAI-compatible request format when the upstream provider changes. Non-streaming responses are normalized where supported; streaming compatibility varies by provider.

For example, an application can send all requests to `/openai-multi/chat/completions` and select OpenAI or Anthropic with the `x-provider` request header. The proxy can also distribute requests automatically across provider and model pairs by using round-robin or weighted round-robin routing.

This is useful when you want to:

- Switch providers without changing application code or endpoint URLs
- Compare provider responses using the same OpenAI-compatible request
- Keep vendor credentials in the gateway instead of distributing them to applications
- Apply proxy-level authentication, rate limits, and guardrails consistently across providers
- Introduce provider selection and model suspension through a routing policy

## Choose a Routing Strategy

Choose one provider-selection strategy for each operation unless you have explicitly designed and tested the precedence between multiple routing policies.

| Capability | Header router | Model round robin | Model weighted round robin |
|------------|---------------|-------------------|----------------------------|
| Explicit client or provider choice | Yes | No | No |
| Selects a provider | Yes | Optional per model entry | Optional per model entry |
| Selects and rewrites a model | No | Yes | Yes |
| Uses the primary provider when no provider is selected | Yes | Yes | Yes |
| Suspends a provider/model pair after `429` or `5xx` | No | Yes | Yes |
| Weighted traffic distribution | No | No | Yes |
| Latency-, cost-, or semantic-based routing | No | No | No |
| Retries the failed request on another target | No | No | No |

### Header-based routing

Use `llm-header-router` when the application or an earlier policy must explicitly choose a provider. The router reads a request header, matches its value against an ordered mapping, and publishes the selected provider name.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `mappings` | Yes | None | Ordered list of header values and effective provider names. At least one mapping is required. |
| `headerName` | No | `x-provider` | Header used for provider selection. Header-name lookup is case-insensitive. |
| `defaultProvider` | No | Unset | Provider selected when the header is missing, empty, or unmatched. If unset, the primary provider is used. |

The router has the following selection behavior:

- Uses only the first value when the header appears more than once
- Trims leading and trailing whitespace from the value
- Matches configured values case-insensitively
- Rejects duplicate mapping values case-insensitively
- Preserves a non-empty provider selection made by an earlier policy
- Leaves the routing header on the upstream request

The header router publishes provider-selection metadata but does not by itself override the named upstream. An additional provider therefore needs a matching inline transformer, or another policy that explicitly sets its upstream.

### Model round robin

Use `model-round-robin` to cycle deterministically through a list of models. A model entry can include a `provider` to route that model to an additional provider. When `provider` is omitted, the model uses the primary provider.

```yaml
operationPolicies:
  - name: model-round-robin
    version: v1
    paths:
      - path: /chat/completions
        methods: [POST]
        params:
          models:
            - model: gpt-4o
            - model: claude-sonnet-4-5-20250929
              provider: anthropic-provider
          suspendDuration: 30
```

The policy rewrites the model at the location defined by the provider template. It can rewrite a model in the request payload, a header, a query parameter, or a path parameter.

See [Model Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-round-robin) for its complete configuration.

### Model weighted round robin

Use `model-weighted-round-robin` to distribute requests in a deterministic weighted cycle. Each entry requires an integer `weight` of at least `1`.

```yaml
operationPolicies:
  - name: model-weighted-round-robin
    version: v1
    paths:
      - path: /chat/completions
        methods: [POST]
        params:
          models:
            - model: gpt-4o
              weight: 2
            - model: claude-sonnet-4-5-20250929
              provider: anthropic-provider
              weight: 1
          suspendDuration: 30
```

This example produces the repeating sequence `gpt-4o`, `gpt-4o`, `claude-sonnet-4-5-20250929` while both targets are available. It provides proportional deterministic distribution, not random or performance-based load balancing.

See [Model Weighted Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-weighted-round-robin) for its complete configuration.

## Configure Providers

### How provider selection works

A multi-provider LLM proxy has:

- One primary provider in `spec.provider`
- One or more selectable providers in `spec.additionalProviders`
- An LLM Header Router policy (`llm-header-router`) that selects a provider from a request header
- An inline transformer for each additional provider that does not use the OpenAI wire format

The request flow is:

```text
OpenAI-compatible client request
      |
      | x-provider: anthropic
      v
  Multi-provider LLM proxy
      |
      | LLM Header Router selects anthropic-provider
      | openai-to-anthropic-transformer transforms the request
      | provider loopback authentication is added
      v
    Anthropic LLM provider
      |
      | vendor authentication is added
      v
    Anthropic API
      |
      | response is transformed to OpenAI format
      v
OpenAI-compatible client response
```

The router writes the selected provider name to request metadata. The gateway conditionally applies only the authentication and transformer associated with that provider. When the selection header is missing, empty, or does not match a configured mapping, the router uses `defaultProvider` when configured; otherwise, the proxy's primary provider is used.

The effective provider name connects routing, transformation, authentication, and upstream selection:

- The primary provider is identified by `spec.provider.id`.
- An additional provider uses `additionalProviders[].as` when an alias is configured; otherwise, it uses `additionalProviders[].id`.
- Router mappings and model-routing entries must use the effective provider name.
- When no provider is selected, the proxy uses its primary provider.
- Authentication and transformation for an additional provider execute only when that provider is selected.
- The controller injects the effective provider name into an inline transformer's `providerId`; do not configure it manually.

### Before you begin

Make sure that:

- The AI Gateway is running and the management API is available at `http://localhost:9090/api/management/v1`.
- You are using an AI Gateway version that supports multi-provider routing and includes the required router and transformer policies.
- You have credentials for each external LLM provider.
- `curl` and `jq` are installed if you want to follow the command-line examples.

This guide configures OpenAI as the primary provider and Anthropic as an additional provider. The same configuration model can be extended to Azure OpenAI, Mistral, Gemini, AWS Bedrock, and other providers supported by your AI Gateway version.

### Understand the authentication layers

Multi-provider routing can involve three different kinds of credentials:

| Credential | Used by | Purpose |
|------------|---------|---------|
| Vendor credential | LLM provider to external vendor | Authenticates the gateway to OpenAI, Anthropic, or another external service |
| Provider loopback key | LLM proxy to LLM provider | Authenticates the proxy when it routes internally to a protected provider |
| Proxy consumer key | Application to LLM proxy | Authenticates the application invoking the public proxy endpoint |

Do not use a vendor API key as a loopback or consumer key. Do not commit any of these credentials to source control.

### Step 1: Deploy the LLM providers

Each provider must exist before a proxy can reference it.

#### Deploy the OpenAI provider

Replace `<openai-api-key>` with an OpenAI API key.

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-providers \
  -u admin:admin \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: openai-provider
spec:
  displayName: OpenAI Provider
  version: v1.0
  template: openai
  context: /providers/openai
  upstream:
    url: https://api.openai.com/v1
    auth:
      type: api-key
      header: Authorization
      value: Bearer <openai-api-key>
  accessControl:
    mode: deny_all
    exceptions:
      - path: /chat/completions
        methods: [POST]
  operationPolicies:
    - name: api-key-auth
      version: v1
      paths:
        - path: /chat/completions
          methods: [POST]
          params:
            key: X-API-Key
            in: header
EOF
```

#### Deploy the Anthropic provider

Replace `<anthropic-api-key>` with an Anthropic API key.

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-providers \
  -u admin:admin \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: anthropic-provider
spec:
  displayName: Anthropic Provider
  version: v1.0
  template: anthropic
  context: /providers/anthropic
  upstream:
    url: https://api.anthropic.com
    auth:
      type: api-key
      header: x-api-key
      value: <anthropic-api-key>
  accessControl:
    mode: deny_all
    exceptions:
      - path: /v1/messages
        methods: [POST]
  operationPolicies:
    - name: api-key-auth
      version: v1
      paths:
        - path: /v1/messages
          methods: [POST]
          params:
            key: X-API-Key
            in: header
EOF
```

The vendor credentials under `spec.upstream.auth` are added only when the provider calls its external service.

### Step 2: Create provider loopback keys

Because both providers in this example use the `api-key-auth` policy, create an API key for each provider. The proxy uses these keys when routing to the providers through the gateway's internal loopback route.

```bash
OPENAI_LOOPBACK_KEY=$(curl -s -X POST \
  http://localhost:9090/api/management/v1/llm-providers/openai-provider/api-keys \
  -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{"name":"openai-proxy-loopback"}' \
  | jq -r '.apiKey.apiKey')

ANTHROPIC_LOOPBACK_KEY=$(curl -s -X POST \
  http://localhost:9090/api/management/v1/llm-providers/anthropic-provider/api-keys \
  -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{"name":"anthropic-proxy-loopback"}' \
  | jq -r '.apiKey.apiKey')
```

Verify that both commands returned a value:

```bash
test -n "$OPENAI_LOOPBACK_KEY" && test "$OPENAI_LOOPBACK_KEY" != "null"
test -n "$ANTHROPIC_LOOPBACK_KEY" && test "$ANTHROPIC_LOOPBACK_KEY" != "null"
```

API key values are returned only when they are created or regenerated. Store them securely.

### Step 3: Deploy the multi-provider LLM proxy

The following proxy exposes one `/chat/completions` operation. OpenAI is the primary and default provider. Anthropic is an additional selectable provider with an inline request and response transformer.

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-proxies \
  -u admin:admin \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<EOF
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProxy
metadata:
  name: openai-multi
spec:
  displayName: OpenAI Multi-Provider Proxy
  version: v1.0
  context: /openai-multi

  provider:
    id: openai-provider
    auth:
      type: api-key
      header: X-API-Key
      value: ${OPENAI_LOOPBACK_KEY}

  additionalProviders:
    - id: anthropic-provider
      auth:
        type: api-key
        header: X-API-Key
        value: ${ANTHROPIC_LOOPBACK_KEY}
      transformer:
        type: openai-to-anthropic-transformer
        version: v0
        params:
          model: claude-sonnet-4-5-20250929

  operationPolicies:
    - name: api-key-auth
      version: v1
      paths:
        - path: /chat/completions
          methods: [POST]
          params:
            key: X-API-Key
            in: header

    - name: llm-header-router
      version: v0
      paths:
        - path: /chat/completions
          methods: [POST]
          params:
            headerName: x-provider
            defaultProvider: openai-provider
            mappings:
              - headerValue: openai
                provider: openai-provider
              - headerValue: anthropic
                provider: anthropic-provider
EOF
```

The controller automatically passes the additional provider's effective upstream name to its transformer. Do not add a `providerId` under `transformer.params`; it is injected from `additionalProviders[].id` or `additionalProviders[].as`.

### Step 4: Create a proxy consumer key

The proxy uses `api-key-auth` to protect its public endpoint. Create a key for the application that will invoke it:

```bash
PROXY_CONSUMER_KEY=$(curl -s -X POST \
  http://localhost:9090/api/management/v1/llm-proxies/openai-multi/api-keys \
  -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{"name":"openai-multi-client"}' \
  | jq -r '.apiKey.apiKey')
```

Verify that a key was returned:

```bash
test -n "$PROXY_CONSUMER_KEY" && test "$PROXY_CONSUMER_KEY" != "null"
```

### Step 5: Invoke different providers

All requests use the same URL and OpenAI Chat Completions payload.

#### Invoke the default provider

If `x-provider` is omitted, the router uses `defaultProvider`, which is `openai-provider` in this example.

```bash
curl -k -X POST https://localhost:8443/openai-multi/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${PROXY_CONSUMER_KEY}" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": "Explain multi-provider routing in one sentence."
      }
    ]
  }'
```

#### Invoke Anthropic

Set `x-provider` to the configured `headerValue`:

```bash
curl -k -X POST https://localhost:8443/openai-multi/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${PROXY_CONSUMER_KEY}" \
  -H "x-provider: anthropic" \
  -d '{
    "model": "client-model-name",
    "messages": [
      {
        "role": "user",
        "content": "Explain multi-provider routing in one sentence."
      }
    ]
  }'
```

The Anthropic transformer replaces the request's `model` value with the model configured under `transformer.params.model`. It also translates the request to the Anthropic Messages format and translates the response back to the OpenAI response shape.

Header names and mapped header values are matched case-insensitively. Leading and trailing whitespace in the header value is ignored. If the header is missing, empty, or does not match a mapping, the router selects `defaultProvider`.

### Add more providers

Add each selectable provider under `additionalProviders`, then add a corresponding mapping under the LLM Header Router policy (`llm-header-router`).

#### Supported provider transformers

Use a transformer when an additional provider does not accept and return the OpenAI wire format.

| Target provider | Transformer type used in this guide | Purpose |
|-----------------|-------------------------------------|---------|
| Anthropic | `openai-to-anthropic-transformer` | Converts OpenAI-compatible requests to Anthropic Messages and converts non-streaming responses back to OpenAI format. |
| Azure OpenAI | `openai-to-azure-openai-transformer` | Adapts the request path for an Azure OpenAI deployment and API version. |
| Mistral | `openai-to-mistral-transformer` | Normalizes OpenAI-compatible requests and responses for Mistral. |
| Gemini | `openai-to-gemini-transformer` | Converts OpenAI-compatible requests and non-streaming responses for Gemini. |
| AWS Bedrock | `openai-to-bedrock-transformer` | Converts OpenAI-compatible requests and Bedrock Converse responses, including streaming responses. |

A transformer is not required when the selected provider already exposes an OpenAI-compatible API.

!!! note "Transformer names and versions"
    Transformer names and major versions can differ between AI Gateway releases. Inspect the policy catalog installed with your gateway and use the name and version exposed there. The examples on this page use the policy names supported by this documentation baseline.

#### Azure OpenAI

```yaml
- id: azure-openai-provider
  auth:
    type: api-key
    header: X-API-Key
    value: <azure-provider-loopback-key>
  transformer:
    type: openai-to-azure-openai-transformer
    version: v0
    params:
      model: gpt-4o
      apiVersion: "2024-02-15-preview"
```

#### Mistral

```yaml
- id: mistral-provider
  auth:
    type: api-key
    header: X-API-Key
    value: <mistral-provider-loopback-key>
  transformer:
    type: openai-to-mistral-transformer
    version: v0
    params:
      model: mistral-large-latest
```

#### Gemini

```yaml
- id: gemini-provider
  auth:
    type: api-key
    header: X-API-Key
    value: <gemini-provider-loopback-key>
  transformer:
    type: openai-to-gemini-transformer
    version: v0
    params:
      model: gemini-2.5-flash
      apiVersion: v1beta
```

#### AWS Bedrock

```yaml
- id: aws-bedrock-provider
  auth:
    type: api-key
    header: X-API-Key
    value: <aws-bedrock-provider-loopback-key>
  transformer:
    type: openai-to-bedrock-transformer
    version: v0
    params:
      model: anthropic.claude-3-5-sonnet-20240620-v1:0
```

For example, the matching router entries are:

```yaml
mappings:
  - headerValue: azure-openai
    provider: azure-openai-provider
  - headerValue: mistral
    provider: mistral-provider
  - headerValue: gemini
    provider: gemini-provider
  - headerValue: aws-bedrock
    provider: aws-bedrock-provider
```

### Use provider aliases

Use `as` when the logical upstream name used by routing policies should differ from the deployed provider ID:

```yaml
additionalProviders:
  - id: anthropic-provider
    as: anthropic-upstream
    auth:
      type: api-key
      header: X-API-Key
      value: <anthropic-provider-loopback-key>
    transformer:
      type: openai-to-anthropic-transformer
      version: v0
      params:
        model: claude-sonnet-4-5-20250929
```

When an alias is present, router mappings must select the alias, not the provider ID:

```yaml
mappings:
  - headerValue: anthropic
    provider: anthropic-upstream
```

The alias must:

- Contain only letters, numbers, hyphens, or underscores
- Be between 1 and 100 characters
- Be unique within the proxy
- Not match the primary provider ID or another additional provider's effective name

### Configuration reference

#### `additionalProviders`

This table defines the additional LLM providers that the proxy can route requests to.

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | ID of an already deployed `LlmProvider` |
| `as` | No | Logical upstream name used by routing policies; defaults to `id` |
| `auth` | No | API key authentication used by the proxy when calling the provider's internal route |
| `transformer` | No | Request and response transformer applied only when this provider is selected |

#### `transformer`

This table defines the transformer configuration for an additional provider.

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Installed transformer policy name, such as `openai-to-anthropic-transformer` |
| `version` | Yes | Major policy version, such as `v0` for the installed provider transformers |
| `params` | No | Transformer-specific parameters, such as `model` or `apiVersion` |

#### LLM Header Router parameters

Use `llm-header-router` as the policy name in the configuration.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `headerName` | No | `x-provider` | Request header used for selection |
| `defaultProvider` | No | Unset | Effective provider name selected when no mapping matches. When omitted, selection remains unset and the proxy's primary provider is used. |
| `mappings` | Yes | None | Header value to effective provider name mappings; the first match wins |

## Provider Capability Matrix

Expand a provider to see its complete transformation behavior. `Converted` means that the transformer explicitly maps a field to the provider-native format. `Pass-through` means that it retains the OpenAI field, subject to support by the selected model and API version.

??? info "Anthropic"
    **Transformer:** [`openai-to-anthropic-transformer`](https://wso2.com/api-platform/policy-hub/policies/openai-to-anthropic-transformer) in the Policy Hub.

    **Scope:** The Anthropic transformer targets OpenAI Chat Completions request and response shapes. It does not translate the OpenAI Responses API, embeddings, image generation, audio, assistants, batches, or fine-tuning APIs.

    **Configuration:** `model` is required. `anthropicVersion` is optional and defaults to `2023-06-01`.

    **Capability summary**

    | Capability | Anthropic support |
    |------------|-------------------|
    | Request handling | Full conversion |
    | Image input | Base64 and remote URL |
    | Function tools | Converted |
    | Non-streaming OpenAI response | Yes |
    | Streaming response | Native Anthropic SSE passthrough |

    **Request conversion**

    | OpenAI input | Anthropic behavior |
    |--------------|--------------------|
    | Request path | Rewritten to `/v1/messages` |
    | `model` | Replaced by the required policy model |
    | Text messages | Converted to Anthropic message content |
    | `system` and `developer` roles | Combined into top-level system text; developer messages are treated as system messages |
    | `assistant.tool_calls` and `tool` results | Converted to tool-use and tool-result blocks |
    | Image data URI | Converted to an Anthropic base64 image source |
    | Remote image URL | Converted to an Anthropic URL image source |
    | `max_completion_tokens` and `max_tokens` | Mapped to `max_tokens`; defaults to `4096` when neither field is supplied |
    | `temperature`, `top_p`, and `stop` | Converted |
    | `stream` | Passed to Anthropic |
    | `tools` and `tool_choice` | Converted |
    | `n`, `seed`, `frequency_penalty`, `presence_penalty`, `response_format`, `logprobs`, `top_logprobs`, `logit_bias`, `service_tier`, `store`, `metadata`, and `user` | Omitted |

    The transformer constructs a new Anthropic request body. Any field that is not explicitly converted is omitted.

    **Response conversion**

    - Generates one OpenAI `chat.completion` choice containing converted text, tool calls, and finish reason.
    - Converts token usage, including available cache-read and cache-creation counts in prompt token details.
    - Converts Anthropic errors to an OpenAI-style error envelope while retaining the upstream HTTP status.

    **Streaming**

    Streaming is supported. The transformer selects the Anthropic streaming endpoint and passes native Anthropic server-sent events (SSE) through unchanged. It does not convert the event payloads to OpenAI Chat Completions chunks, so streaming clients must handle Anthropic event payloads.

    **Tools and multimodal input**

    | OpenAI function field | Anthropic field |
    |-----------------------|-----------------|
    | `function.name` | `tools[].name` |
    | `function.description` | `tools[].description` |
    | `function.parameters` | `tools[].input_schema` |
    | Missing parameter schema | Empty object schema |

    | OpenAI `tool_choice` | Anthropic behavior |
    |----------------------|--------------------|
    | `auto` | `{ "type": "auto" }` |
    | `required` | `{ "type": "any" }` |
    | `none` | Drops `tools` |
    | Named function | `{ "type": "tool", "name": "<function-name>" }` |
    | Unknown or malformed value | Defaults to automatic selection |

    Only tools with `type: function` are translated. Assistant tool calls and tool-result messages are supported across multiple turns. The transformer decodes the JSON string in `function.arguments`; invalid JSON becomes an empty object. Consecutive tool results are grouped into a provider-compatible user turn. Provider-native tools, hosted tools, computer-use tools, web-search tools, Model Context Protocol (MCP) declarations, OpenAI custom tools, `parallel_tool_calls`, strict structured-output flags, and provider-specific tool caching are not explicitly translated.

    Image support in the transformer does not guarantee image support in every Anthropic model. The gateway does not negotiate model capabilities before routing.

??? info "Azure OpenAI"
    **Transformer:** [`openai-to-azure-openai-transformer`](https://wso2.com/api-platform/policy-hub/policies/openai-to-azure-openai-transformer) in the Policy Hub.

    **Scope:** The Azure OpenAI transformer targets the OpenAI Chat Completions request and response shape exposed by Azure OpenAI. It does not add support for the OpenAI Responses API, embeddings, image generation, audio, assistants, batches, or fine-tuning APIs through this route.

    **Configuration:** `apiVersion` is required. `model` is optional and falls back to the request body model. `pathSuffix` is optional and defaults to `/chat/completions`.

    **Capability summary**

    | Capability | Azure OpenAI support |
    |------------|----------------------|
    | Request handling | Pass-through |
    | Image input | Pass-through |
    | Function tools | Pass-through |
    | Non-streaming OpenAI response | Native |
    | Streaming response | OpenAI-compatible SSE passthrough, subject to deployment and API version |

    **Request conversion**

    | OpenAI input | Azure OpenAI behavior |
    |--------------|-----------------------|
    | Request path | Rewritten to the Azure deployment path with `api-version` |
    | `model` | Passed through and used as the deployment fallback when the policy does not override it |
    | Messages, images, tools, tool history, and generation parameters | Passed through |
    | `stream` | Passed through |

    Azure OpenAI requires a deployment ID from the transformer configuration or the request model. If neither is available, the transformer returns HTTP `400`.

    **Response conversion**

    - Passes through the native OpenAI-compatible completion envelope, choices, text, tool calls, finish reason, usage, and errors.

    **Streaming**

    Azure OpenAI SSE is passed through. OpenAI SSE compatibility is **Yes, subject to the selected deployment and API version**.

    **Tools and multimodal input**

    `tools`, `tool_choice`, tool-call history, tool results, and image content are passed through unchanged. Their acceptance depends on the selected deployment, model, and API version. No fallback behavior is added for an unsupported or malformed `tool_choice`.

??? info "AWS Bedrock"
    **Transformer:** [`openai-to-bedrock-transformer`](https://wso2.com/api-platform/policy-hub/policies/openai-to-bedrock-transformer) in the Policy Hub.

    **Scope:** The AWS Bedrock transformer targets OpenAI Chat Completions requests and responses and the Bedrock Converse APIs. It does not translate the OpenAI Responses API, embeddings, image generation, audio, assistants, batches, or fine-tuning APIs.

    **Capability summary**

    | Capability | AWS Bedrock support |
    |------------|----------------------|
    | Request handling | Full conversion |
    | Image input | Base64 only |
    | Function tools | Converted |
    | Non-streaming OpenAI response | Yes |
    | Streaming response | Converted to OpenAI SSE |

    **Request conversion**

    | OpenAI input | AWS Bedrock behavior |
    |--------------|----------------------|
    | Request path | Selects Converse or Converse Stream according to `stream` |
    | `model` | Uses the policy model when configured; otherwise uses the body model in the path and omits it from the body |
    | Text messages | Converted to Converse message content |
    | `system` and `developer` roles | Converted to system blocks; developer messages are treated as system messages |
    | `assistant.tool_calls` and `tool` results | Converted to tool-use and tool-result blocks |
    | Image data URI | Converted to Bedrock image bytes |
    | Remote image URL | Omitted because Converse requires image bytes |
    | `max_completion_tokens` and `max_tokens` | Mapped to `max_tokens` |
    | `temperature`, `top_p`, and `stop` | Converted |
    | `tools` and `tool_choice` | Converted |
    | `n`, `seed`, `frequency_penalty`, `presence_penalty`, `response_format`, `logprobs`, `top_logprobs`, `logit_bias`, `service_tier`, `store`, `metadata`, and `user` | Omitted |

    The transformer constructs a new Bedrock request body. Any field that is not explicitly converted is omitted. A missing model in both the policy and request returns HTTP `400`.

    **Response conversion**

    - Generates one OpenAI `chat.completion` choice containing converted text, tool calls, and finish reason.
    - Converts usage, including cache-read and cache-write details used for cost calculation.
    - Converts Bedrock errors to an OpenAI-style error envelope while retaining the upstream HTTP status.

    **Streaming**

    The transformer selects Converse Stream and decodes Amazon binary event-stream frames into OpenAI `chat.completion.chunk` SSE. It converts text and tool-call deltas, maps stream errors, emits usage, and terminates the stream with `data: [DONE]`. OpenAI SSE compatibility is **Yes**.

    **Tools and multimodal input**

    | OpenAI function field | AWS Bedrock field |
    |-----------------------|-------------------|
    | `function.name` | `toolConfig.tools[].toolSpec.name` |
    | `function.description` | `toolConfig.tools[].toolSpec.description` |
    | `function.parameters` | `toolConfig.tools[].toolSpec.inputSchema.json` |
    | Missing parameter schema | Empty object schema |

    | OpenAI `tool_choice` | AWS Bedrock behavior |
    |----------------------|----------------------|
    | `auto` | `{ "auto": {} }` |
    | `required` | `{ "any": {} }` |
    | `none` | Drops `toolConfig` |
    | Named function | `{ "tool": { "name": "<function-name>" } }` |
    | Unknown or malformed value | Omits `toolChoice` |

    Only tools with `type: function` are translated. Multi-turn tool calls and results are converted, and streaming tool-call starts and argument deltas are converted to OpenAI chunk deltas. Invalid JSON in historical assistant tool arguments becomes an empty object. Non-function tools, `parallel_tool_calls`, strict structured-output flags, and provider-specific tool caching are not explicitly translated.

    Bedrock accepts base64 image data URIs through this transformer. It does not fetch remote image URLs, and the selected Bedrock model must support the supplied image format and tool features.

??? info "Gemini"
    **Transformer:** [`openai-to-gemini-transformer`](https://wso2.com/api-platform/policy-hub/policies/openai-to-gemini-transformer) in the Policy Hub.

    **Scope:** The Gemini transformer targets OpenAI Chat Completions requests and responses and Gemini `generateContent`. It does not translate the OpenAI Responses API, embeddings, image generation, audio, assistants, batches, or fine-tuning APIs.

    **Configuration:** `model` is required. `apiVersion` is optional and defaults to `v1beta`.

    **Capability summary**

    | Capability | Gemini support |
    |------------|----------------|
    | Request handling | Full conversion |
    | Image input | Base64 and remote URL |
    | Function tools | Converted |
    | Non-streaming OpenAI response | Yes |
    | Streaming response | Native Gemini SSE passthrough |

    **Request conversion**

    | OpenAI input | Gemini behavior |
    |--------------|-----------------|
    | Request path | Uses `generateContent` or `streamGenerateContent` with the required policy model |
    | `model` | Replaced by the policy model and used in the path |
    | Text messages | Converted to Gemini contents and parts |
    | `system` and `developer` roles | Converted to `systemInstruction`; developer messages are treated as system messages |
    | `assistant.tool_calls` and `tool` results | Converted to function-call and function-response parts |
    | Image data URI | Converted to `inlineData` |
    | Remote image URL | Converted to `fileData` |
    | `max_completion_tokens` and `max_tokens` | Mapped to `maxOutputTokens` |
    | `temperature`, `top_p`, `stop`, `seed`, `frequency_penalty`, and `presence_penalty` | Converted |
    | `n` | Mapped to `candidateCount` |
    | `tools` and `tool_choice` | Converted |
    | `response_format`, `logprobs`, `top_logprobs`, `logit_bias`, `service_tier`, `store`, `metadata`, and `user` | Omitted |

    The transformer constructs a new Gemini request body. Any field that is not explicitly converted is omitted.

    **Response conversion**

    - Generates an OpenAI `chat.completion` choice for every Gemini candidate and preserves candidate indices.
    - Converts text, tool calls, and finish reasons, while excluding parts marked `thought: true` from visible assistant text.
    - Converts usage, including cached tokens and thought tokens exposed as reasoning tokens.
    - Converts Gemini errors to an OpenAI-style error envelope while retaining the upstream HTTP status.

    **Streaming**

    Streaming is supported. The transformer selects `streamGenerateContent` and passes native Gemini SSE events through unchanged. It does not convert the event payloads to OpenAI Chat Completions chunks, so streaming clients must handle Gemini event payloads.

    **Tools and multimodal input**

    | OpenAI function field | Gemini field |
    |-----------------------|--------------|
    | `function.name` | `tools[].functionDeclarations[].name` |
    | `function.description` | `tools[].functionDeclarations[].description` |
    | `function.parameters` | `tools[].functionDeclarations[].parameters` |
    | Missing parameter schema | Omitted |

    | OpenAI `tool_choice` | Gemini behavior |
    |----------------------|-----------------|
    | `auto` | Mode `AUTO` |
    | `required` | Mode `ANY` |
    | `none` | Drops tools and sets mode `NONE` |
    | Named function | Mode `ANY` with `allowedFunctionNames` restricted to that function |
    | Unknown or malformed value | Defaults to mode `AUTO` |

    Only tools with `type: function` are translated. Multi-turn function calls and responses are converted. Invalid JSON in historical assistant tool arguments becomes an empty object. Non-function tools, `parallel_tool_calls`, strict structured-output flags, and provider-specific tool caching are not explicitly translated.

    Gemini image and tool support still depends on the selected model. The gateway does not check those model capabilities before routing.

??? info "Mistral"
    **Transformer:** [`openai-to-mistral-transformer`](https://wso2.com/api-platform/policy-hub/policies/openai-to-mistral-transformer) in the Policy Hub.

    **Scope:** The Mistral transformer targets OpenAI Chat Completions request and response shapes supported by Mistral's OpenAI-compatible API. It does not add support for the OpenAI Responses API, embeddings, image generation, audio, assistants, batches, or fine-tuning APIs through this route.

    **Capability summary**

    | Capability | Mistral support |
    |------------|-----------------|
    | Request handling | OpenAI-compatible normalization |
    | Image input | Pass-through |
    | Function tools | Pass-through |
    | Non-streaming OpenAI response | Native and normalized |
    | Streaming response | OpenAI-compatible SSE passthrough, subject to model and API behavior |

    **Request conversion**

    | OpenAI input | Mistral behavior |
    |--------------|------------------|
    | Request path | Rewritten to `/v1/chat/completions` |
    | `model` | Replaced by the required policy model |
    | Messages, system and developer roles, images, tool history, `max_completion_tokens`, `max_tokens`, `temperature`, `top_p`, `stop`, `stream`, `seed`, `frequency_penalty`, `presence_penalty`, `tools`, `tool_choice`, and `response_format` | Passed through |
    | `n`, `logprobs`, `top_logprobs`, `logit_bias`, `service_tier`, `store`, `metadata`, and `user` | Removed |

    **Response conversion**

    - Normalizes the native OpenAI-compatible completion response and model value.
    - Passes through upstream choices, text, tool calls, finish reasons, and usage.
    - Converts Mistral errors to an OpenAI-style error envelope while retaining the upstream HTTP status.

    **Streaming**

    OpenAI-compatible SSE is passed through. OpenAI SSE compatibility is **Yes, subject to model and API behavior**.

    **Tools and multimodal input**

    `tools`, `tool_choice`, tool-call history, tool results, and image content are passed through unchanged. Their acceptance depends on the selected Mistral model and API behavior. No fallback behavior is added for an unsupported or malformed `tool_choice`.

## Failure Behavior

### Routing failures and suspension

The round-robin policies track failures per provider/model pair. The same model name configured for two providers is therefore suspended independently.

- A `429` response or any `5xx` response suspends the selected pair.
- `suspendDuration` defaults to 30 seconds.
- Setting `suspendDuration` to `0` disables failure suspension.
- Suspended entries are skipped on later requests until their suspension expires.
- If every entry is suspended, the policy returns HTTP `503` with `All models are currently unavailable`.
- Rotation counters and suspension state are held by the policy instance in memory and are not coordinated across gateway replicas.

!!! important "Suspension is not a retry"
    The request that receives a `429` or `5xx` response is returned to the client. The policy does not replay that request on another provider. Suspension affects only later requests.

### Transformation failures

- Empty or invalid JSON request bodies return HTTP `400` in transformers that perform full request conversion.
- Missing required transformer parameters cause policy validation or initialization to fail.
- Azure OpenAI returns HTTP `400` when neither the policy nor the request supplies a deployment ID.
- AWS Bedrock returns HTTP `400` when neither the policy nor the request supplies a model ID.
- A non-JSON successful provider response is generally passed through instead of being replaced with a gateway-generated `500` response.
- Converted provider errors retain the upstream HTTP status and use an OpenAI-style error envelope where supported by the transformer.

## Limitations

- **Chat Completions only:** Cross-provider translation targets the OpenAI `/chat/completions` model.
- No universal OpenAI streaming conversion: Only AWS Bedrock converts provider-specific streaming events into OpenAI Chat Completions chunk objects. Anthropic and Gemini return valid SSE streams. Their provider-native event payloads are passed through unchanged.
- **No automatic capability negotiation:** The gateway does not query the selected model for support for vision, tools, schemas, or individual generation parameters.
- **No automatic routing validation:** Router mappings must match the primary provider ID or an additional provider's effective name.
- **No request retry or immediate failover:** Suspension removes an unhealthy target from later rotations but does not retry the failing request.
- **Instance-local state:** Round-robin counters and suspension maps are maintained in memory by each policy instance.
- **Field loss during full conversion:** Anthropic, AWS Bedrock, and Gemini omit request fields that their transformers do not explicitly map.
- **Provider restrictions still apply:** Successful conversion does not guarantee that a model accepts images, tools, tool choice, penalties, candidate counts, or other mapped values.
- **No primary inline transformer:** The inline `transformer` field is available on `additionalProviders`, not on the primary `provider` object. A transformer for another layout must be attached as an operation policy.
- **One routing strategy is recommended:** Combining routing policies can produce precedence-dependent behavior and should be tested explicitly.
- **Header selection needs an upstream override:** A header-routed additional provider without a transformer does not automatically change the named upstream.

## Troubleshooting

### The additional provider is not found

Deploy every provider before deploying the proxy. Each `additionalProviders[].id` must match the `metadata.name` of an existing `LlmProvider`.

### The proxy reports a duplicate upstream name

Every effective provider name must be unique. The effective name is `as` when it is configured; otherwise, it is `id`. It must not collide with the primary provider ID.

### The transformer is rejected during deployment

Make sure that:

- `transformer.type` names a transformer supported by your AI Gateway version.
- `transformer.version` uses the installed policy's major-only version, such as `v0` for the installed provider transformers.
- All parameters required by that transformer are present.

The gateway resolves the major version to an installed full policy version and rejects invalid transformer configuration during deployment.

### The request always reaches the default provider

Check that:

- The routing policy is attached to the same path and method being invoked.
- The request uses the header configured by `headerName`.
- The header value matches a `mappings[].headerValue`.
- The mapping's `provider` matches the additional provider's `as` value when an alias is configured; otherwise, it matches `id`.

An unknown header value intentionally falls back to `defaultProvider`.

If the mapping selects an additional provider that has no transformer, confirm that another operation policy explicitly sets the named upstream. The header router alone publishes selection metadata.

### The model router does not move to another provider after a failure

Model suspension does not retry the current request. Confirm the behavior with a later request after the first target returns `429` or `5xx`. Also confirm that `suspendDuration` is greater than `0` and that each model entry uses the correct effective provider name.

### Streaming is not in OpenAI chunk format

Anthropic and Gemini support streaming through provider-native SSE passthrough. If the client expects OpenAI Chat Completions chunks, adapt the provider-native event payloads in the client or choose a route that returns OpenAI-compatible chunks.

### An image or tool request is rejected by the provider

Transformation support and model support are separate. Check the capability matrix, then verify that the exact selected model supports images, function tools, the requested `tool_choice`, and the supplied JSON Schema.

### The provider returns `401 Unauthorized`

Confirm which authentication layer rejected the request:

- A rejection at the proxy usually means the proxy consumer key is missing or invalid.
- A rejection on the provider's loopback route usually means `provider.auth` or `additionalProviders[].auth` contains an invalid provider API key.
- A rejection from the external vendor usually means `LlmProvider.spec.upstream.auth` contains an invalid vendor credential or uses the wrong header format.

### The configured transformer is not supported

The AI Gateway distribution includes the router and transformer policies supported by that version. Use a supported `transformer.type` and major version, or upgrade the AI Gateway to a version that includes the required transformer.

## Security Recommendations

- Store vendor credentials and loopback keys in a secret manager or Kubernetes `Secret` instead of committing plain-text values.
- Protect the proxy with an authentication policy so applications cannot invoke it anonymously.
- Expose only required provider operations through `accessControl`.
- Apply rate limiting and guardrails at the provider or proxy level according to your governance requirements.
- Use explicit router mappings. Do not accept a client-provided value as an unrestricted upstream name.

## Complete Example

For a larger configuration containing OpenAI, Anthropic, Azure OpenAI, Mistral, Gemini, and AWS Bedrock, see [`gateway/examples/openai-multi-provider-proxy.yaml`](https://github.com/wso2/api-platform/blob/main/gateway/examples/openai-multi-provider-proxy.yaml).

For automatic traffic distribution across models and providers, see:

- [Model Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-round-robin)
- [Model Weighted Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-weighted-round-robin)

AWS Bedrock usage can also be evaluated by the [LLM Cost policy](../../../ai-workspace/1.0.0/policies/overview.md#llm-cost).

## Related topics

- [Multi model routing](multi-model-routing.md) — the use-case page for distributing traffic across a pool of models, with the round robin and weighted round robin configuration.
- [LLM header routing](routing-policies/llm-header-routing.md) — the policy reference for `llm-header-router`, including its parameters and selection behavior.
- [Load balancing and failover](routing-policies/load-balancing-and-failover.md) — the policy reference for the two round robin policies and the suspension they apply.
