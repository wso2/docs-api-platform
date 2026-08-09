---
title: "LLM Proxy Quick Start Guide"
description: "Run API Platform AI Gateway with Docker Compose, configure an LLM provider, and route your first LLM request through a managed proxy."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/llm-proxy/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/ai-gateway/llm-proxy/quick-start-guide.md
tags:
  - ai-gateway
  - llm
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-05
content_type: "quickstart"
---

## Quick Start

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

### Using Docker Compose (Recommended)


### Prerequisites

A Docker-compatible container runtime such as:

- Docker Desktop (Windows / macOS)
- Podman Desktop or Podman (Windows / macOS / Linux)
- Rancher Desktop (Windows / macOS)
- Colima (macOS)
- Docker Engine + Compose plugin (Linux)

These examples use `docker compose`. If you use another Compose-compatible runtime, use the equivalent commands.

Verify the commands for your runtime are available. For Docker:

```bash
docker --version
docker compose version
```

<!-- Replace ${version} with the actual release version of the API Platform Gateway. -->
```bash
# Download distribution.
wget https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0-rc2/wso2apip-ai-gateway-1.2.0-rc2.zip

# Unzip the downloaded distribution.
unzip wso2apip-ai-gateway-1.2.0-rc2.zip

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

## Deploy an OpenAI LLM provider configuration

The API Platform Gateway currently includes first-class support for the OpenAI LLM provider. As a platform administrator, replace `<openai-apikey>` with your openai API key and run the following command to deploy a sample OpenAI LLM provider.

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

The API Platform Gateway provides first-class support for configuring and deploying LLM proxies. As an AI developer, run the following command to deploy a sample LLM proxy that consumes the OpenAI LLM provider previously deployed by the platform administrator.

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

## View the LLM provider and proxy in AI Workspace

The gateway syncs the artifacts you deploy on it up to [AI Workspace](../../../ai-workspace/1.0.0/overview.md), the control plane for AI traffic across your organization. The OpenAI provider and the `openai-assistant` proxy you deployed above appear there without being re-declared. See [Manage Gateway-deployed AI artifacts in AI Workspace](../../../ai-workspace/1.0.0/sync-gateway-created-artifacts.md).

## Stopping the Gateway

When stopping the gateway, you have two options:

### Option 1: Stop runtime, keep data (persisted proxies and configuration)

```bash
docker compose down
```

This stops the containers but preserves the `controller-data` volume. When you restart with `docker compose up`, all your API configurations will be restored.

### Option 2: Complete shutdown with data cleanup (fresh start)

```bash
docker compose down -v
```
This stops containers and removes the `controller-data` volume. Next startup will be a clean slate with no persisted templates or provider configuration.
