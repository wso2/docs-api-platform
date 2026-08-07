---
title: "AI Gateway Quick Start Guide"
description: "Run API Platform AI Gateway with Docker Compose, deploy an LLM provider and an LLM proxy, route your first LLM request, and govern the gateway from AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/ai-gateway/quick-start-guide.md
tags:
  - ai-gateway
  - llm
  - mcp
  - quickstart
  - docker
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-04
content_type: "quickstart"
---

# Quick Start Guide

This guide takes you from a downloaded distribution to an LLM request routed through the API Platform AI Gateway, then shows you how to govern that gateway from [AI Workspace](../../next/ai-workspace/overview.md), the control plane for AI traffic. It's written for platform administrators and AI developers.

!!! info "Watch the video walkthrough"
    [Check out this quick start on YouTube](https://youtu.be/p5xBXZWt5GU?rel=0) or watch below.

<iframe 
  width="100%" 
  src="https://www.youtube.com/embed/p5xBXZWt5GU?rel=0" 
  title="YouTube video player" 
  style="border: 0; display: block; aspect-ratio: 16 / 9;" 
  loading="lazy" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" 
  allowfullscreen>
</iframe>

## Prerequisites

A Docker-compatible container runtime such as:

- Docker Desktop (Windows / macOS)
- Rancher Desktop (Windows / macOS)
- Colima (macOS)
- Docker Engine + Compose plugin (Linux)

Ensure `docker` and `docker compose` commands are available.

```bash
docker --version
docker compose version
```

To call an LLM through the gateway, you also need an OpenAI API key.

## Start the gateway

The commands below use version `1.2.0`. Substitute the API Platform AI Gateway release version you want to run in the download URL, the archive name, and the directory name.

```bash
# Download distribution.
wget https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip

# Unzip the downloaded distribution.
unzip wso2apip-ai-gateway-1.2.0.zip

cd wso2apip-ai-gateway-1.2.0/

# Run the one-time setup. This provisions the AES-256 at-rest encryption key, the router HTTPS
# listener certificate, api-platform.env, and the gateway-controller admin credentials. It prints
# the admin password once — copy it.
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

!!! note "Running on Windows"
    The commands above assume a Linux/macOS shell. On Windows, run the one-time setup with the PowerShell script instead — it takes the same flags and provisions the same files:

    ```powershell
    powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
    ```

    Then set the admin credentials with `$env:ADMIN_USERNAME='admin'` and `$env:ADMIN_PASSWORD='<the password setup.ps1 printed>'` in place of the `export` lines.

    The remaining `curl` commands on this page pipe their YAML payload in through a shell heredoc (`--data-binary @- <<'EOF'`), which PowerShell does not support. Either run them from Git Bash or WSL, or save the YAML between `EOF` markers to a file and post that file explicitly — note the `.exe`, since `curl` is an alias for `Invoke-WebRequest` in Windows PowerShell:

    ```powershell
    curl.exe -X POST http://localhost:9090/api/management/v1/llm-providers `
      -H "Content-Type: application/yaml" `
      -u "${env:ADMIN_USERNAME}:${env:ADMIN_PASSWORD}" `
      --data-binary "@openai-provider.yaml"
    ```

!!! tip "Customizing configuration"
    The setup script (`setup.sh`, or `setup.ps1` on Windows) writes `api-platform.env`, which is loaded into the containers via Docker Compose `env_file`. To change the storage backend, connect to a control plane, or tune other settings, edit that file (or the `config.toml` interpolation tokens directly). See [Gateway Configuration and Environment Interpolation](./setup/configuration.md).

## Deploy an OpenAI LLM provider configuration

The API Platform Gateway includes first-class support for the OpenAI LLM provider. As a platform administrator, replace `<openai-apikey>` with your OpenAI API key and run the following command to deploy a sample OpenAI LLM provider.

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
      value: <openai-apikey>
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

To test LLM provider traffic routing through the gateway, invoke the following request.

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

## Deploy an LLM proxy configuration to consume an LLM provider

The API Platform Gateway provides first-class support for configuring and deploying LLM proxies. As an AI developer, run the following command to deploy a sample LLM proxy that consumes the OpenAI LLM provider the platform administrator deployed above.

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

To test LLM proxy traffic routing through the gateway and consume the LLM provider, invoke the following request.

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

## Govern this gateway from AI Workspace

The gateway you just started serves traffic on its own, and it doesn't have to run alone. [AI Workspace](../../next/ai-workspace/overview.md) is the control plane for AI traffic across your organization: one console for LLM providers, App LLM proxies, MCP proxies, policies such as guardrails and token-based rate limits, and the credentials behind them. Register this gateway with AI Workspace to govern every AI gateway you run from a single place, across every environment.

Both directions work, and you can use them together:

- **Top-down.** Configure an artifact in AI Workspace, apply policies to it, then deploy it to one or more gateways.
- **Bottom-up.** Keep deploying through the management API, the way this guide does. Every artifact you create on the gateway syncs up to AI Workspace automatically and appears there as a copy the gateway owns, so the OpenAI provider and the `openai-assistant` proxy you deployed above show up without being re-declared. To see what a synced artifact looks like, and what stays editable, see [Manage Gateway-deployed AI artifacts in AI Workspace](../../next/ai-workspace/sync-gateway-created-artifacts.md).

The gateway keeps serving traffic either way. If AI Workspace is unreachable, the gateway carries on and the sync catches up once the connection is restored.

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

- Route to more than one provider, with failover: [Multi-provider routing](./llm-proxy/multi-provider-routing.md)
- Add guardrails to a proxy, such as [PII masking](./llm-proxy/guardrails/pii-masking-regex.md) or a [JSON schema guardrail](./llm-proxy/guardrails/json-schema.md)
- Expose an MCP server through the gateway: [MCP proxy quick start guide](./mcp-proxy/quick-start-guide.md)
- Govern AI traffic across all your gateways from the control plane: [AI Workspace overview](../../next/ai-workspace/overview.md)
