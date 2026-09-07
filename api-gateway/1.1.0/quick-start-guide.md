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
last_updated: 2026-08-11
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

## Set up the Gateway

### Step 1: Download the Gateway

Run this command in your terminal to download the API Platform Gateway distribution:

```bash
wget https://github.com/wso2/api-platform/releases/download/gateway/v1.1.0/wso2apip-api-gateway-1.1.0.zip
```

Then extract the content:

```bash
unzip wso2apip-api-gateway-1.1.0.zip
```

Go inside the root directory of the Gateway distribution folder:

```bash
cd wso2apip-api-gateway-1.1.0/
```

### Step 2: Start the Gateway

Start the complete gateway stack using Docker Compose:

```bash
docker compose up -d
```

### Step 3: Verify the Gateway

Verify that the Gateway Controller is healthy:

```bash
curl http://localhost:9094/api/admin/v0.9/health
```

A successful response confirms the gateway is running and ready to accept API configurations.

## Deploy an API

### Step 1: Deploy an API configuration

Use the gateway's management API to deploy a sample Reading List REST API:

```bash
curl -X POST http://localhost:9090/api/management/v0.9/rest-apis \
  -u admin:admin \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1alpha1
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
```


### Step 2: Invoke the API

Send a request to the deployed API through the gateway:

**Over HTTP:**

```bash
curl -i http://localhost:8080/reading-list/v1.0/books
```

**Over HTTPS (with self-signed certificate):**

```bash
curl -ik https://localhost:8443/reading-list/v1.0/books
```

A successful response returns a list of books from the upstream service, confirming that the gateway is routing traffic correctly.


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

## Stopping the Gateway

When stopping the gateway, you have two options:

### Keep data and configurations

This option stops the runtime while keeping data: APIs and configurations are persisted:

```bash
docker compose down
```

This stops the containers but preserves the `controller-data` volume. When you restart with `docker compose up`, all your API configurations will be restored.

### Delete data for a fresh start
This option performs a complete shutdown with data cleanup (fresh start):

```bash
docker compose down -v
```

This stops containers and removes the `controller-data` volume. Next startup will be a clean slate with no persisted APIs or configuration.