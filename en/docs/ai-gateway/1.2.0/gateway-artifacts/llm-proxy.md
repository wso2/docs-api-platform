---
title: "LLM proxy"
description: "Expose an LLM provider through an LLM proxy and deploy one: its own URL context, per-application policies, and the provider rules it inherits."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-proxy/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-proxy.md
tags:
  - ai-gateway
  - llm-proxy
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# LLM proxy

An LLM Proxy allows developers to create custom API endpoints that consume an LLM Provider, while inheriting administrator-enforced access control, budgeting and organization-wide policies defined at the provider level. Each proxy gets its own URL context (e.g., `/assistant`) and can have its own policies applied. This enables:

- Multiple AI applications to share a single LLM Provider
- A single OpenAI-compatible endpoint to route requests to multiple LLM providers. See [Multi-provider routing](../routing/multi-provider-routing.md).
- Per-application policies such as prompt management and guardrails
- Separation between platform administration and application development

This page is for AI developers, who own LLM proxies. It takes you through deploying one and routing a request through it.

## Who configures this

AI developers own LLM proxies. A developer creates the proxy, names the LLM provider it consumes, and attaches the policies one application needs. The access control, budgeting, and organization-wide policies set on the provider still apply.

## Prerequisites

- A running AI Gateway, with `ADMIN_USERNAME` and `ADMIN_PASSWORD` exported in the shell you run these commands from. See [Install the gateway](../setup-and-deployment/install-the-gateway.md).
- A deployed LLM provider on that gateway. A proxy names the provider it consumes in `provider.id`, and the gateway rejects a proxy that names one it can't find. See [Create and configure an LLM provider](llm-provider/create-and-configure-an-llm-provider.md).

## Configure the proxy

The definition below deploys a proxy that consumes the `openai-provider` provider. Set `provider.id` to the `metadata.name` of a provider already deployed on your gateway — a value that doesn't match a deployed provider is the most common reason this request fails.

=== "Linux / macOS"

    ```bash
    curl -X POST http://localhost:9090/api/management/v1/llm-proxies \
      -H "Content-Type: application/yaml" \
      -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
      --data-binary @- <<'EOF'
    apiVersion: gateway.api-platform.wso2.com/v1
    kind: LlmProxy
    metadata:
      name: openai-assistant
    spec:
      displayName: OpenAI Assistant
      version: v1.0
      context: /assistant
      provider:
        id: openai-provider
      policies: []
    EOF
    ```

=== "Windows (PowerShell)"

    Save the proxy definition to `openai-assistant.yaml`:

    ```powershell
    @'
    apiVersion: gateway.api-platform.wso2.com/v1
    kind: LlmProxy
    metadata:
      name: openai-assistant
    spec:
      displayName: OpenAI Assistant
      version: v1.0
      context: /assistant
      provider:
        id: openai-provider
      policies: []
    '@ | Set-Content -Path openai-assistant.yaml -Encoding utf8
    ```

    Then post it:

    ```powershell
    curl.exe -X POST http://localhost:9090/api/management/v1/llm-proxies `
      -H "Content-Type: application/yaml" `
      -u "${env:ADMIN_USERNAME}:${env:ADMIN_PASSWORD}" `
      --data-binary "@openai-assistant.yaml"
    ```

Three values shape the proxy:

- **`context`** — the URL prefix clients call, independent of the provider's own context. This proxy answers under `/assistant`.
- **`provider.id`** — the provider this proxy consumes, named by its `metadata.name`.
- **`policies`** — the policies that apply to this proxy alone. An empty list deploys the proxy with none of its own; the provider's policies still apply.

## Test the proxy

Send a chat completion request to the proxy's context on the gateway:

=== "Linux / macOS"

    ```bash
    curl -X POST "https://localhost:8443/assistant/chat/completions" \
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
    curl.exe -X POST https://localhost:8443/assistant/chat/completions `
      -H "Content-Type: application/json" `
      -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Hi"}]}' -k
    ```

The `-k` flag tells `curl` to skip Transport Layer Security (TLS) certificate verification. The router presents the self-signed listener certificate that `setup.sh` or `setup.ps1` generates, and no certificate authority trusts it. Outside local testing, give the router a certificate from a trusted certificate authority and remove `-k`.

## Policies

The routing policies that select a provider for a proxy, and the failover behavior that comes with them, are covered in [Load balancing and failover](../routing/routing-policies/load-balancing-and-failover.md).

## Next steps

- Protect the proxy, which is the client-facing endpoint: [Authenticate clients](../authenticate-clients.md)
- Send requests on one proxy to more than one provider: [Multi-provider routing](../routing/multi-provider-routing.md)
- Return responses chunk by chunk: [Stream responses](../streaming-responses.md)

## Related guides

- [Set up a governed multi-model LLM proxy](../../../guides/ai-and-mcp/set-up-a-governed-multi-model-llm-proxy-with-cost-controls-and-failover.md) — distributes traffic across models behind one proxy, with per-team token budgets, PII masking, and semantic caching.
- [Enforce a consistent AI persona with the prompt decorator policy](../../../guides/ai-and-mcp/using-prompt-decorator-policy.md) — prepends a persona system message to every request on an LLM proxy, without changing client code.
- [Configure Claude Code with AI Gateway](../../../guides/ai-and-mcp/ai-coding-assistants/claude-code-configuration-with-ai-gateway.md) — routes Claude Code through an Anthropic provider and an LLM proxy.
- [Configure Gemini CLI with AI Gateway](../../../guides/ai-and-mcp/ai-coding-assistants/gemini-cli-configuration-with-ai-gateway.md) — routes Google Gemini CLI through a Gemini provider and an LLM proxy.
- [Configure OpenAI Codex CLI with AI Gateway](../../../guides/ai-and-mcp/ai-coding-assistants/codex-configuration-with-ai-gateway.md) — routes OpenAI Codex CLI through an OpenAI provider and an LLM proxy.
