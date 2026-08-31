---
title: "Anthropic"
description: "Connect the AI Gateway to the Anthropic Messages API: the upstream URL, x-api-key authentication, and the endpoint the provider exposes."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/anthropic/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/anthropic.md
tags:
  - ai-gateway
  - llm-provider
  - anthropic
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Anthropic

Connect the AI Gateway to the Anthropic API. You end up with an LLM Provider that holds your Anthropic credentials, exposes the Messages endpoint through the gateway, and can be consumed by any LLM proxy.

This page is for platform administrators, who hold the upstream credentials.

## Connection details

The `anthropic` template and these connection settings apply to every Anthropic provider you create:

| Setting | Value |
|---------|-------|
| Template ID | `anthropic` |
| Upstream URL | `https://api.anthropic.com` |
| Auth type | `api-key` |
| Auth header | `x-api-key` |

Anthropic reads the key from a dedicated `x-api-key` header, so the value is the key on its own with no prefix.

## Configure the provider

Replace *`<anthropic-api-key>`* with your Anthropic API key and deploy the provider:

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-providers \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
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
EOF
```

The `accessControl` block restricts which upstream paths the provider exposes. This provider denies everything except `POST /v1/messages`.

The `context` value sets the URL prefix the provider answers on, so this provider serves the Messages endpoint under `/providers/anthropic`.

## Test the provider

Anthropic providers are exercised through an LLM proxy rather than called directly, because the proxy translates between the OpenAI request format your application sends and the Anthropic Messages format the upstream expects.

To build that proxy and send it a request, see [Multi-provider routing](../../../routing/multi-provider-routing.md), which deploys this provider alongside an OpenAI one and selects between them with a request header.

## Supported models

Anthropic publishes its model list in the [Anthropic models reference](https://docs.anthropic.com/en/docs/about-claude/models). Any model Anthropic exposes on the endpoint above works through the gateway; set it in the `model` field of your request.

## Provider-specific notes

Two settings differ from a provider that follows the OpenAI wire format. Both are properties of the Anthropic API, not gateway options:

- **The auth header is `x-api-key`, not `Authorization`.** Sending the key in `Authorization` fails at the upstream.
- **The upstream URL carries no version segment.** Anthropic puts the version in the request path, so `https://api.anthropic.com` combines with the `/v1/messages` path from `accessControl`. Adding `/v1` to the URL produces a doubled `/v1/v1/messages` path.

When an LLM proxy routes to this provider, the proxy applies a transformer and may add its own authentication between the two. Those settings belong to the proxy, not to the provider shown here.

## Related pages

- [Provider templates](../../../reference/llm-templates.md) — the token and model metadata the `anthropic` template extracts.
- [Multi-provider routing](../../../routing/multi-provider-routing.md) — the proxy that consumes this provider.
- [OpenAI](openai.md) — the same setup for a provider that uses `Authorization` and the OpenAI wire format.
