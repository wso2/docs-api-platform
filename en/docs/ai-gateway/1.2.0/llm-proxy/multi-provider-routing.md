---
title: "Multi-Provider Routing for LLM Proxies"
description: "Route OpenAI-compatible LLM proxy requests to multiple providers using header-based selection and provider-specific transformers."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/llm-proxy/multi-provider-routing/
md_url: https://wso2.com/api-platform/docs/ai-gateway/llm-proxy/multi-provider-routing.md
tags:
  - ai-gateway
  - llm
  - routing
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "guide"
---

# Multi-Provider Routing for LLM Proxies

## Overview

Multi-provider routing lets one large language model (LLM) proxy expose a single OpenAI-compatible endpoint while routing each request to a selected LLM provider. Applications continue to use the same endpoint and OpenAI-compatible request and response format, even when the upstream provider changes.

For example, an application can send all requests to `/openai-multi/chat/completions` and select OpenAI or Anthropic with the `x-provider` request header.

This is useful when you want to:

- Switch providers without changing application code or endpoint URLs
- Compare provider responses using the same OpenAI-compatible request
- Keep vendor credentials in the gateway instead of distributing them to applications
- Apply proxy-level authentication, rate limits, and guardrails consistently across providers
- Introduce provider fallback or selection logic through a routing policy

## How It Works

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
            | openai-to-anthropic transforms the request
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

## Before You Begin

Make sure that:

- The AI Gateway is running and the management API is available at `http://localhost:9090/api/management/v1`.
- You are using an AI Gateway version that supports multi-provider routing and includes the required router and transformer policies.
- You have credentials for each external LLM provider.
- `curl` and `jq` are installed if you want to follow the command-line examples.

This guide configures OpenAI as the primary provider and Anthropic as an additional provider. The same configuration model can be extended to Azure OpenAI, Mistral, Gemini, AWS Bedrock, and other providers supported by your AI Gateway version.

## Understand the Authentication Layers

Multi-provider routing can involve three different kinds of credentials:

| Credential | Used by | Purpose |
|------------|---------|---------|
| Vendor credential | LLM provider to external vendor | Authenticates the gateway to OpenAI, Anthropic, or another external service |
| Provider loopback key | LLM proxy to LLM provider | Authenticates the proxy when it routes internally to a protected provider |
| Proxy consumer key | Application to LLM proxy | Authenticates the application invoking the public proxy endpoint |

Do not use a vendor API key as a loopback or consumer key. Do not commit any of these credentials to source control.

## Step 1: Deploy the LLM Providers

Each provider must exist before a proxy can reference it.

### Deploy the OpenAI provider

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

### Deploy the Anthropic provider

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

## Step 2: Create Provider Loopback Keys

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

## Step 3: Deploy the Multi-Provider LLM Proxy

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
        type: openai-to-anthropic
        version: v1
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
      version: v1
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

## Step 4: Create a Proxy Consumer Key

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

## Step 5: Invoke Different Providers

All requests use the same URL and OpenAI Chat Completions payload.

### Invoke the default provider

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

### Invoke Anthropic

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

## Add More Providers

Add each selectable provider under `additionalProviders`, then add a corresponding mapping under the LLM Header Router policy (`llm-header-router`).

### Supported provider transformers

Use a transformer when an additional provider does not accept and return the OpenAI wire format.

| Target provider | Transformer type | Purpose |
|-----------------|------------------|---------|
| Anthropic | `openai-to-anthropic` | Converts OpenAI-compatible requests to the Anthropic Messages format and converts responses back to the OpenAI format. |
| Azure OpenAI | `openai-to-azure-openai` | Adapts OpenAI-compatible requests for Azure OpenAI deployments and API versions. |
| Mistral | `openai-to-mistral` | Adapts OpenAI-compatible requests and responses for Mistral. |
| Gemini | `openai-to-gemini` | Converts OpenAI-compatible requests and responses for Google Gemini. |
| AWS Bedrock | `openai-to-bedrock-transformer` | Converts OpenAI-compatible requests and supported AWS Bedrock responses. |

A transformer is not required when the selected provider already exposes an OpenAI-compatible API.

### Azure OpenAI

```yaml
- id: azure-openai-provider
  auth:
    type: api-key
    header: X-API-Key
    value: <azure-provider-loopback-key>
  transformer:
    type: openai-to-azure-openai
    version: v1
    params:
      model: gpt-4o
      apiVersion: "2024-02-15-preview"
```

### Mistral

```yaml
- id: mistral-provider
  auth:
    type: api-key
    header: X-API-Key
    value: <mistral-provider-loopback-key>
  transformer:
    type: openai-to-mistral
    version: v1
    params:
      model: mistral-large-latest
```

### Gemini

```yaml
- id: gemini-provider
  auth:
    type: api-key
    header: X-API-Key
    value: <gemini-provider-loopback-key>
  transformer:
    type: openai-to-gemini
    version: v1
    params:
      model: gemini-2.5-flash
      apiVersion: v1beta
```

### AWS Bedrock

```yaml
- id: aws-bedrock-provider
  auth:
    type: api-key
    header: X-API-Key
    value: <aws-bedrock-provider-loopback-key>
  transformer:
    type: openai-to-bedrock-transformer
    version: v1
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

## Use Provider Aliases

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
      type: openai-to-anthropic
      version: v1
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

## Configuration Reference

### `additionalProviders`

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | ID of an already deployed `LlmProvider` |
| `as` | No | Logical upstream name used by routing policies; defaults to `id` |
| `auth` | No | API key authentication used by the proxy when calling the provider's internal route |
| `transformer` | No | Request and response transformer applied only when this provider is selected |

### `transformer`

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | Installed transformer policy name, such as `openai-to-anthropic` |
| `version` | Yes | Major policy version, such as `v1` |
| `params` | No | Transformer-specific parameters, such as `model` or `apiVersion` |

### LLM Header Router parameters

Use `llm-header-router` as the policy name in the configuration.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `headerName` | No | `x-provider` | Request header used for selection |
| `defaultProvider` | No | Primary provider | Effective provider name selected when no mapping matches. When omitted, the proxy's primary provider is used. |
| `mappings` | Yes | None | Header value to effective provider name mappings; the first match wins |

## Validation and Troubleshooting

### The additional provider is not found

Deploy every provider before deploying the proxy. Each `additionalProviders[].id` must match the `metadata.name` of an existing `LlmProvider`.

### The proxy reports a duplicate upstream name

Every effective provider name must be unique. The effective name is `as` when it is configured; otherwise, it is `id`. It must not collide with the primary provider ID.

### The transformer is rejected during deployment

Make sure that:

- `transformer.type` names a transformer supported by your AI Gateway version.
- `transformer.version` uses a major-only version such as `v1`.
- All parameters required by that transformer are present.

The gateway resolves the major version to an installed full policy version and rejects invalid transformer configuration during deployment.

### The request always reaches the default provider

Check that:

- The routing policy is attached to the same path and method being invoked.
- The request uses the header configured by `headerName`.
- The header value matches a `mappings[].headerValue`.
- The mapping's `provider` matches the additional provider's `as` value when an alias is configured; otherwise, it matches `id`.

An unknown header value intentionally falls back to `defaultProvider`.

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

- [Model Round Robin](load-balancing/model-round-robin.md)
- [Model Weighted Round Robin](load-balancing/model-weighted-round-robin.md)

AWS Bedrock usage can also be evaluated by the [LLM Cost policy](../../../next/ai-workspace/policies/overview.md#llm-cost).
