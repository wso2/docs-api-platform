---
title: "Create and configure an LLM provider"
description: "Create an LLM provider: choose a template, set the upstream URL and credentials, deploy it with the management API, and test the connection."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/create-and-configure-an-llm-provider/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/create-and-configure-an-llm-provider.md
tags:
  - ai-gateway
  - llm-provider
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Create and configure an LLM provider

An LLM Provider represents a connection to an AI backend service such as OpenAI, Azure OpenAI, or other LLM APIs. This page takes you through deploying one: you end up with a provider on the gateway that routes traffic to an upstream LLM service, on a URL context you choose, using credentials only the gateway holds.

This page is for platform administrators, who hold the upstream credentials.

## Prerequisites

- A running AI Gateway, with `ADMIN_USERNAME` and `ADMIN_PASSWORD` exported in the shell you run these commands from. See [Install the gateway](../../setup-and-deployment/install-the-gateway.md).
- An API key or other credential for the upstream LLM service you're connecting.

## Choose a template

Every provider names a template in its `template` field. The template tells the gateway how to read that vendor's API: which paths carry chat traffic, and where to find the model name and token counts in a request and response. The gateway loads its templates at startup, so you select one by ID rather than defining it.

For the template IDs the gateway ships with, and the metadata each one extracts, see [Provider templates](../../reference/llm-templates.md). The example below uses the `openai` template.

## Configure the provider

The definition below deploys an OpenAI provider through the management API. Replace *`<openai-api-key>`* with your OpenAI API key, keeping the `Bearer ` prefix.

=== "Linux / macOS"

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

=== "Windows (PowerShell)"

    Save the provider definition to `openai-provider.yaml`:

    ```powershell
    @'
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
    '@ | Set-Content -Path openai-provider.yaml -Encoding utf8
    ```

    Then post it:

    ```powershell
    curl.exe -X POST http://localhost:9090/api/management/v1/llm-providers `
      -H "Content-Type: application/yaml" `
      -u "${env:ADMIN_USERNAME}:${env:ADMIN_PASSWORD}" `
      --data-binary "@openai-provider.yaml"
    ```

Four values change from one provider to the next:

- **`template`** — the template ID for the vendor you're connecting, as described in [Choose a template](#choose-a-template).
- **`context`** — the URL prefix the provider answers on. This provider serves its exposed paths under `/openai/latest`.
- **`upstream.url`** — the base URL of the vendor's API. The gateway appends the request path to it.
- **`upstream.auth`** — the credential and the header that carries it. Vendors differ here: some read a bearer token from `Authorization`, others a raw key from their own header.

The `accessControl` block restricts which upstream paths the provider exposes. This provider denies everything except the three paths listed as exceptions.

## Test the provider

Send a chat completion request to the provider's context on the gateway:

=== "Linux / macOS"

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

=== "Windows (PowerShell)"

    ```powershell
    curl.exe -X POST https://localhost:8443/openai/latest/chat/completions `
      -H "Content-Type: application/json" `
      -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Hi"}]}' -k
    ```

The `-k` flag tells `curl` to skip Transport Layer Security (TLS) certificate verification. The router presents the self-signed listener certificate that `setup.sh` or `setup.ps1` generates, and no certificate authority trusts it. Outside local testing, give the router a certificate from a trusted certificate authority and remove `-k`.

## Provider-specific details

The upstream URL, the authentication each vendor expects, and the paths worth exposing differ per provider. Each page below carries a definition you can deploy as it stands:

| Page | What it covers |
|------|----------------|
| [OpenAI](supported-providers/openai.md) | Connect the AI Gateway to OpenAI: the upstream URL, API key authentication, the endpoints the provider exposes, and a request that tests the connection. |
| [Anthropic](supported-providers/anthropic.md) | Connect the AI Gateway to the Anthropic Messages API: the upstream URL, x-api-key authentication, and the endpoint the provider exposes. |
| [AWS Bedrock](supported-providers/aws-bedrock.md) | Connect API Platform AI Gateway to AWS Bedrock using a bearer API key or AWS Signature Version 4 authentication, then invoke a model through the gateway. |

## Next steps

- Expose this provider to applications: [Create and configure an LLM proxy](../llm-proxy.md)
- Put one proxy in front of several providers: [Multi-provider routing](../../routing/multi-provider-routing.md)
- See how the gateway reads token and model metadata: [Provider templates](../../reference/llm-templates.md)
