---
title: "API Platform Gateway Quick Start Guide"
description: "Run API Platform Gateway with Docker Compose, deploy your first REST API configuration, and invoke it through the gateway in minutes."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/api-gateway/quick-start-guide.md
tags:
  - api-gateway
  - quickstart
  - docker
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-05
content_type: "quickstart"
---

# Quick Start Guide

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

<!-- Replace `${version}` with the API Platform Gateway release version you want to run. -->

```bash
# Download distribution.
wget https://github.com/wso2/api-platform/releases/download/gateway/v1.2.0/wso2apip-api-gateway-1.2.0.zip

# Unzip the downloaded distribution.
unzip wso2apip-api-gateway-1.2.0.zip

cd wso2apip-api-gateway-1.2.0/

# Run the one-time setup. This provisions the AES-256 at-rest encryption key,
# the router HTTPS listener certificate, api-platform.env, and the gateway-controller
# admin credentials. It prints the admin password once — copy it.
./scripts/setup.sh

# Export the admin credentials so the management-API calls below can authenticate.
# The username defaults to "admin"; use the password setup.sh just printed.
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD='<the password scripts/setup.sh printed>'

# Start the complete stack
docker compose up

# Verify gateway controller admin endpoint is running
curl http://localhost:9094/api/admin/v1/health

# Deploy an API configuration
curl -X POST http://localhost:9090/api/management/v1/rest-apis \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: RestApi
metadata:
  name: reading-list-api-v1.0
spec:
  displayName: Reading-List-API
  version: v1.0
  context: /reading-list/$version
  upstream:
    main:
      url: https://apis.bijira.dev/samples/reading-list-api-service/v1.0
  policies:
    - name: set-headers
      version: v1
      params:
        request:
          headers:
            - name: x-wso2-apip-gateway-version
              value: v1.0.0
        response:
          headers:
            - name: x-environment
              value: development
  operations:
    - method: GET
      path: /books
    - method: POST
      path: /books
    - method: GET
      path: /books/{id}
    - method: PUT
      path: /books/{id}
    - method: DELETE
      path: /books/{id}
EOF


# Test routing through the gateway
curl -i http://localhost:8080/reading-list/v1.0/books
curl -ik https://localhost:8443/reading-list/v1.0/books
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

    The `curl` command that deploys the API pipes its YAML payload in through a shell heredoc (`--data-binary @- <<'EOF'`), which PowerShell does not support. Either run it from Git Bash or WSL, or save the YAML between the `EOF` markers to a file and post that file explicitly — note the `.exe`, since `curl` is an alias for `Invoke-WebRequest` in Windows PowerShell:

    ```powershell
    curl.exe -X POST http://localhost:9090/api/management/v1/rest-apis `
      -u "${env:ADMIN_USERNAME}:${env:ADMIN_PASSWORD}" `
      -H "Content-Type: application/yaml" `
      --data-binary "@reading-list-api.yaml"
    ```

!!! tip "Customizing configuration"
    The setup script (`setup.sh`, or `setup.ps1` on Windows) writes `api-platform.env`, which is loaded into the containers via Docker Compose `env_file`. To change the storage backend, connect to a control plane, or tune other settings, edit that file (or the `config.toml` interpolation tokens directly). See [Gateway Configuration and Environment Interpolation](./setup/configuration.md).

### Stopping the Gateway

When stopping the gateway, you have two options:

**Option 1: Stop runtime, keep data (persisted APIs and configuration)**
```bash
docker compose down
```
This stops the containers but preserves the `controller-data` volume. When you restart with `docker compose up`, all your API configurations will be restored.

**Option 2: Complete shutdown with data cleanup (fresh start)**
```bash
docker compose down -v
```
This stops containers and removes the `controller-data` volume. Next startup will be a clean slate with no persisted APIs or configuration.