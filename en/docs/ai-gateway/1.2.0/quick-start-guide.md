---
title: "AI Gateway Quick Start Guide"
description: "Run the AI Gateway with Docker Compose, deploy an LLM provider and proxy, route your first LLM request, and govern it from AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/ai-gateway/quick-start-guide.md
tags:
  - ai-gateway
  - llm
  - mcp
  - quickstart
  - docker
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "quickstart"
---

# Quick Start Guide

This guide takes you from a downloaded distribution to a large language model (LLM) request routed through the API Platform AI Gateway. It then shows you how to govern that gateway from [AI Workspace](../../ai-workspace/1.0.0/overview.md), the control plane for AI traffic.

## Prerequisites

Use one of these Docker-compatible container runtimes:

- [Docker Desktop](https://docs.docker.com/desktop/) (Windows / macOS)
- [Podman Desktop](https://podman-desktop.io/) or [Podman](https://podman.io/docs/installation) (Windows / macOS / Linux)
- [Rancher Desktop](https://rancherdesktop.io/) (Windows / macOS)
- [Colima](https://github.com/abiosoft/colima) (macOS)
- [Docker Engine](https://docs.docker.com/engine/install/) and [Compose plugin](https://docs.docker.com/compose/install/linux/) (Linux)

These examples use `docker compose`. If you use another Compose-compatible runtime, use the equivalent commands.

Verify the commands for your runtime are available. For Docker:

```bash
docker --version
docker compose version
```

To call an LLM through the gateway, you also need an API key from the specific LLM service.

The **Windows (PowerShell)** examples on this page require PowerShell 7.3 or later.

## Start the gateway

The commands below use version `1.2.0`. Substitute the API Platform AI Gateway release version you want to run in the download URL, the archive name, and the directory name.

=== "Linux / macOS"

    ```bash
    # Download distribution.
    curl -fL -o wso2apip-ai-gateway-1.2.0.zip https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip

    # Unzip the downloaded distribution.
    unzip wso2apip-ai-gateway-1.2.0.zip

    cd wso2apip-ai-gateway-1.2.0/

    # Run the one-time setup. This provisions the Advanced Encryption Standard (AES)-256 at-rest
    # encryption key, the router HTTPS listener certificate, api-platform.env, and the
    # gateway-controller admin credentials. It prints the admin password once — copy it.
    ./scripts/setup.sh

    # Export the admin credentials so the management-API calls below can authenticate.
    # The username defaults to "admin"; use the password setup.sh just printed.
    export ADMIN_USERNAME=admin
    export ADMIN_PASSWORD='<the password scripts/setup.sh printed>'

    # Start the complete stack
    docker compose up

    # Verify gateway controller admin endpoint is running
    curl http://localhost:9094/api/admin/v1/health
    ```

=== "Windows (PowerShell)"

    ```powershell
    # Download distribution.
    Invoke-WebRequest -Uri https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip -OutFile wso2apip-ai-gateway-1.2.0.zip

    # Unzip the downloaded distribution.
    Expand-Archive -Path wso2apip-ai-gateway-1.2.0.zip -DestinationPath .

    Set-Location wso2apip-ai-gateway-1.2.0

    # Run the one-time setup. This provisions the Advanced Encryption Standard (AES)-256 at-rest
    # encryption key, the router HTTPS listener certificate, api-platform.env, and the
    # gateway-controller admin credentials. It prints the admin password once — copy it.
    pwsh -ExecutionPolicy Bypass -File .\scripts\setup.ps1

    # Set the admin credentials so the management-API calls below can authenticate.
    # The username defaults to "admin"; use the password setup.ps1 just printed.
    $env:ADMIN_USERNAME='admin'
    $env:ADMIN_PASSWORD='<the password setup.ps1 printed>'

    # Start the complete stack
    docker compose up

    # Verify gateway controller admin endpoint is running
    curl.exe http://localhost:9094/api/admin/v1/health
    ```

    Note the `.exe`, since `curl` is an alias for `Invoke-WebRequest` in Windows PowerShell. PowerShell 7 removes that alias, and `curl.exe` works in both versions.

    The two management API requests below—the LLM provider `POST` and the LLM proxy `POST`—pipe their YAML payload in through a shell heredoc (`--data-binary @- <<'EOF'`). PowerShell doesn't support heredocs. Either run those two requests from Git Bash or WSL, or use the **Windows (PowerShell)** tab on each one, which saves the YAML to a file and posts that file explicitly.

!!! tip "Port 8080, 8443, 9090, or 9094 already taken?"
    If the start command fails with a port binding error, identify what is already listening on the default ports:

    On macOS or Linux, run:

    ```bash
    lsof -nP -iTCP:8080 -sTCP:LISTEN
    lsof -nP -iTCP:8443 -sTCP:LISTEN
    lsof -nP -iTCP:9090 -sTCP:LISTEN
    lsof -nP -iTCP:9094 -sTCP:LISTEN
    ```

    On Windows PowerShell, run:

    ```powershell
    Get-NetTCPConnection -State Listen -LocalPort 8080,8443,9090,9094 | Select-Object LocalAddress, LocalPort, OwningProcess
    ```

    Stop the conflicting service if you don't need it. If you need to keep it running, change the host-side value of the relevant `ports:` mapping in `docker-compose.yaml`. Then use the remapped host port in the verification and test commands on this page.

!!! tip "Customizing configuration"
    The setup script (`setup.sh`, or `setup.ps1` on Windows) writes `api-platform.env`, which is loaded into the containers via Docker Compose `env_file`. To change the storage backend, connect to a control plane, or tune other settings, edit that file (or the `config.toml` interpolation tokens directly). See [Gateway Configuration and Environment Interpolation](./setup-and-deployment/configuration.md).

## Deploy an LLM provider configuration

As a platform administrator, deploy an LLM provider for the vendor whose API key you hold. Select a provider below; each tab carries the complete definition for that provider.

=== "OpenAI"

    Replace *`<openai-api-key>`* with your OpenAI API key, keeping the `Bearer ` prefix.

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

=== "Anthropic"

    Replace *`<anthropic-api-key>`* with your Anthropic API key. Anthropic reads the key from an `x-api-key` header, so the value carries no prefix.

    === "Linux / macOS"

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

    === "Windows (PowerShell)"

        Save the provider definition to `anthropic-provider.yaml`:

        ```powershell
        @'
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
        '@ | Set-Content -Path anthropic-provider.yaml -Encoding utf8
        ```

        Then post it:

        ```powershell
        curl.exe -X POST http://localhost:9090/api/management/v1/llm-providers `
          -H "Content-Type: application/yaml" `
          -u "${env:ADMIN_USERNAME}:${env:ADMIN_PASSWORD}" `
          --data-binary "@anthropic-provider.yaml"
        ```

=== "AWS Bedrock"

    Replace *`<aws-region>`* with the AWS Region hosting your model, and *`<bedrock-api-key>`* with an AWS Bedrock API key. For SigV4 authentication and the IAM permissions Bedrock needs, see [AWS Bedrock](./gateway-artifacts/llm-provider/supported-providers/aws-bedrock.md).

    === "Linux / macOS"

        Store the Bedrock API key as a gateway secret:

        ```bash
        export AWS_REGION="<aws-region>"
        export AWS_BEARER_TOKEN_BEDROCK="<bedrock-api-key>"

        curl --fail-with-body -X POST \
          http://localhost:9090/api/management/v1/secrets \
          -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
          -H "Content-Type: application/yaml" \
          --data-binary @- <<EOF
        apiVersion: gateway.api-platform.wso2.com/v1
        kind: Secret
        metadata:
          name: bedrock-api-key
        spec:
          displayName: AWS Bedrock API Key
          value: "${AWS_BEARER_TOKEN_BEDROCK}"
        EOF
        ```

        Then deploy the provider:

    {% raw %}

        ```bash
        curl --fail-with-body -X POST \
          http://localhost:9090/api/management/v1/llm-providers \
          -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
          -H "Content-Type: application/yaml" \
          --data-binary @- <<EOF
        apiVersion: gateway.api-platform.wso2.com/v1
        kind: LlmProvider
        metadata:
          name: bedrock-provider
        spec:
          displayName: AWS Bedrock Provider
          version: v1.0
          template: awsbedrock
          context: /bedrock
          upstream:
            url: https://bedrock-runtime.${AWS_REGION}.amazonaws.com
            auth:
              type: api-key
              header: Authorization
              value: 'Bearer {{ secret "bedrock-api-key" }}'
          accessControl:
            mode: deny_all
            exceptions:
              - path: /model/{modelId}/converse
                methods: [POST]
              - path: /model/{modelId}/converse-stream
                methods: [POST]
        EOF
        ```

    {% endraw %}

    === "Windows (PowerShell)"

        Store the Bedrock API key as a gateway secret:

        ```powershell
        $env:AWS_REGION = "<aws-region>"
        $env:AWS_BEARER_TOKEN_BEDROCK = "<bedrock-api-key>"

        @"
        apiVersion: gateway.api-platform.wso2.com/v1
        kind: Secret
        metadata:
          name: bedrock-api-key
        spec:
          displayName: AWS Bedrock API Key
          value: "${AWS_BEARER_TOKEN_BEDROCK}"
        "@ | Set-Content -Path bedrock-secret.yaml -Encoding utf8

        curl.exe -X POST http://localhost:9090/api/management/v1/secrets `
          -H "Content-Type: application/yaml" `
          -u "${env:ADMIN_USERNAME}:${env:ADMIN_PASSWORD}" `
          --data-binary "@bedrock-secret.yaml"
        ```

        Then deploy the provider:

    {% raw %}

        ```powershell
        @"
        apiVersion: gateway.api-platform.wso2.com/v1
        kind: LlmProvider
        metadata:
          name: bedrock-provider
        spec:
          displayName: AWS Bedrock Provider
          version: v1.0
          template: awsbedrock
          context: /bedrock
          upstream:
            url: https://bedrock-runtime.${AWS_REGION}.amazonaws.com
            auth:
              type: api-key
              header: Authorization
              value: 'Bearer {{ secret "bedrock-api-key" }}'
          accessControl:
            mode: deny_all
            exceptions:
              - path: /model/{modelId}/converse
                methods: [POST]
              - path: /model/{modelId}/converse-stream
                methods: [POST]
        "@ | Set-Content -Path bedrock-provider.yaml -Encoding utf8

        curl.exe -X POST http://localhost:9090/api/management/v1/llm-providers `
          -H "Content-Type: application/yaml" `
          -u "${env:ADMIN_USERNAME}:${env:ADMIN_PASSWORD}" `
          --data-binary "@bedrock-provider.yaml"
        ```

    {% endraw %}

The remaining steps on this page use the OpenAI provider, because the LLM proxy they build sends requests in the OpenAI format. To consume an Anthropic or AWS Bedrock provider through a proxy, see [Multi-provider routing](routing/multi-provider-routing.md), which adds the transformer that converts between the two formats.

To test LLM provider traffic routing through the gateway, invoke the following request.

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

!!! note "Why these commands pass `-k`"
    The `-k` flag tells `curl` to skip Transport Layer Security (TLS) certificate verification. The router presents the self-signed listener certificate that `setup.sh` or `setup.ps1` generates, and no certificate authority trusts it. Outside local testing, give the router a certificate from a trusted certificate authority and remove `-k`.

## Deploy an LLM proxy configuration to consume an LLM provider

The API Platform Gateway supports configuring and deploying LLM proxies. As an AI developer, run the following command to deploy a sample LLM proxy that consumes the OpenAI LLM provider the platform administrator deployed above.

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

To test LLM proxy traffic routing through the gateway and consume the LLM provider, invoke the following request.

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

## Govern this gateway from AI Workspace

The gateway you just started serves traffic on its own. [AI Workspace](../../ai-workspace/1.0.0/overview.md) is the control plane for AI traffic across your organization. One console manages LLM providers, App LLM proxies, MCP proxies, policies such as guardrails and token-based rate limits, and the credentials behind them. Register this gateway with AI Workspace to govern every AI gateway you run from one place, across every environment.

Both directions work, and you can use them together:

- **Top-down.** Configure an artifact in AI Workspace, apply policies to it, then deploy it to one or more gateways.
- **Bottom-up.** Keep deploying through the management API, as this guide does. The gateway syncs every artifact you create to AI Workspace automatically, where each one appears as a copy the gateway owns. The OpenAI provider and the `openai-assistant` proxy from this guide appear there without being re-declared. To see what a synced artifact looks like, and what stays editable, see [Manage Gateway-deployed AI artifacts in AI Workspace](../../ai-workspace/1.0.0/sync-gateway-created-artifacts.md).

The gateway keeps serving traffic either way. If AI Workspace is unreachable, the gateway carries on and the sync catches up once the connection is restored.

To weigh up the two products before you connect them, see [Extend your gateway with AI Workspace](./ai-workspace/extend-your-gateway-with-ai-workspace.md). For the connection path that suits your runtime, see [Connect the gateway to AI Workspace](./ai-workspace/connect-the-gateway.md).

## Stopping the gateway

When stopping the gateway, you have two options:

**Option 1: Stop runtime, keep data (persisted proxies and configuration)**

```bash
docker compose down
```

This stops the containers but preserves the `controller-data` volume. When you restart with `docker compose up`, all your configurations are restored.

**Option 2: Complete shutdown with data cleanup (fresh start)**

```bash
docker compose down -v
```

This stops the containers and removes the `controller-data` volume. The next startup is a clean slate with no persisted templates or provider configuration.

## Next steps

- Route to more than one provider, with failover: [Multi-provider routing](routing/multi-provider-routing.md)
- Add guardrails to a proxy, such as [PII masking](https://wso2.com/api-platform/policy-hub/policies/pii-masking-regex) or a [JSON schema guardrail](https://wso2.com/api-platform/policy-hub/policies/json-schema-guardrail)
- Expose an MCP server through the gateway: [MCP proxy](gateway-artifacts/mcp-proxy.md)
- Govern AI traffic across all your gateways from the control plane: [AI Workspace overview](../../ai-workspace/1.0.0/overview.md)
- Take this gateway to production on Kubernetes: [Production deployment overview](./setup-and-deployment/production-deployment/index.md)
- Register a production gateway with the control plane: [Connect to AI Workspace](./setup-and-deployment/production-deployment/control-plane-connection.md)
