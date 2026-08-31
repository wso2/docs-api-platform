---
title: "OpenAI"
description: "Connect the AI Gateway to OpenAI: the upstream URL, API key authentication, the endpoints the provider exposes, and a request that tests the connection."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/openai/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/openai.md
tags:
  - ai-gateway
  - llm-provider
  - openai
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# OpenAI

Connect the AI Gateway to the OpenAI API. You end up with an LLM Provider that holds your OpenAI credentials, exposes a chosen set of OpenAI endpoints through the gateway, and can be consumed by any LLM proxy.

This page is for platform administrators, who hold the upstream credentials.

## Connection details

The `openai` template and these connection settings apply to every OpenAI provider you create:

| Setting | Value |
|---------|-------|
| Template ID | `openai` |
| Upstream URL | `https://api.openai.com/v1` |
| Auth type | `api-key` |
| Auth header | `Authorization` |

OpenAI expects the key in the `Authorization` header with a `Bearer ` prefix, so the prefix is part of the value you configure rather than something the gateway adds.

## Configure the provider

Replace *`<openai-api-key>`* with your OpenAI API key, keeping the `Bearer ` prefix, and deploy the provider:

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-providers \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: openai-provider
spec:
  displayName: OpenAI Provider
  version: v1.0
  template: openai
  context: /openai/latest
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
      - path: /models
        methods: [GET]
      - path: /models/{modelId}
        methods: [GET]
EOF
```

The `accessControl` block restricts which upstream paths the provider exposes. This provider denies everything except the three paths listed as exceptions.

The `context` value sets the URL prefix the provider answers on, so this provider serves its exposed paths under `/openai/latest`.

## Test the provider

Send a chat completion request to the provider's context on the gateway:

```bash
curl -X POST https://localhost:8443/openai/latest/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": "Hi"
      }
    ]
  }' -k
```

The `-k` flag tells `curl` to skip Transport Layer Security (TLS) certificate verification, which a local gateway needs because it presents a self-signed listener certificate. Outside local testing, give the router a certificate from a trusted certificate authority and remove `-k`.

## Supported models

OpenAI publishes its model list in the [OpenAI models reference](https://platform.openai.com/docs/models). Any model OpenAI exposes on the endpoint above works through the gateway; set it in the `model` field of your request.

## Related pages

- [Provider templates](../../../reference/llm-templates.md) — the token and model metadata the `openai` template extracts.
- [Multi-provider routing](../../../routing/multi-provider-routing.md) — put an LLM proxy in front of this provider and route to others alongside it.
- [Quick start guide](../../../quick-start-guide.md) — deploy this provider and a proxy that consumes it, end to end.
