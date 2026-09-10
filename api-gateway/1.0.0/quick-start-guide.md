---
title: "API Platform Gateway Quick Start Guide"
description: "Run API Platform Gateway in standalone mode with Docker Compose, deploy your first REST API, and invoke it through the gateway in minutes."
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

This guide walks you through running the API Platform Gateway in standalone mode using Docker Compose. Follow these steps to get your gateway running, deploy a REST API, and invoke it in minutes.

## Overview

The API Platform Gateway in standalone mode runs entirely in your own infrastructure without requiring a connection to any external control plane. All API configurations are managed directly through the gateway's built-in management API. This guide covers the fastest way to get started.

## Prerequisites

Before you begin, ensure you have:

- **wget** or **curl** installed
- **unzip** installed
- A Compose-compatible container runtime, such as Docker Desktop, Podman Desktop or Podman, Rancher Desktop, Colima, or Docker Engine with the Compose plugin

These examples use `docker compose`. If you use another Compose-compatible runtime, use the equivalent commands.

Verify the commands for your runtime are available. For Docker:

```bash
docker --version
docker compose version
```

## Setup Gateway

### Step 1: Download the Gateway

Run this command in your terminal to download and unzip the API Platform Gateway distribution:

```bash
wget https://github.com/wso2/api-platform/releases/download/gateway/v1.0.0/wso2apip-api-gateway-1.0.0.zip
unzip wso2apip-api-gateway-1.0.0.zip
```

### Step 2: Start the Gateway

Navigate to the extracted directory and start the complete gateway stack using Docker Compose:

```bash
cd wso2apip-api-gateway-1.0.0/
docker compose up -d
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

### Step 3: Verify the Gateway

Check that the gateway controller is up and healthy:

```bash
# Check container status
docker compose ps

# Check gateway health
curl http://localhost:9094/api/admin/v0.9/health
```

A successful response confirms the gateway is running and ready to accept API configurations.

## Deploy an API

### Step 1: Deploy an API Configuration

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

## Stopping the Gateway

When you are done, you have two options for stopping the gateway:

### Keep data and configurations

```bash
docker compose down
```

This stops the containers but preserves the `controller-data` volume. When you restart with `docker compose up`, all your deployed API configurations will be restored.

### Delete data for a fresh start

```bash
docker compose down -v
```

This stops the containers and removes the `controller-data` volume. The next startup will be a clean slate with no persisted APIs or configuration.

## Next Steps

Your standalone gateway is now running! Here's what to do next:

- **Configure Policies**: Apply traffic management, security, and transformation [policies](policies/overview.md) to your APIs
- **Connect to API Platform Cloud**: Run the gateway as a [Self-Hosted Gateway](../../cloud/api-platform-gateway/getting-started.md) connected to the API Platform control plane for centralized management and analytics

## Advanced Configuration

For production environments or specific infrastructure requirements, see the detailed setup guides:

- [Gateway Artifact Templating](setup/artifact-templating.md): Customize gateway artifacts using templates
- [Configuring External Storage and Backends](setup/storage-and-backends.md): Set up external storage and backend connections
- [Gateway Upstream Timeouts](setup/upstream-timeouts.md): Configure timeout settings for upstream services

## Troubleshooting

If the gateway does not start or the health check fails:

1. **Check container status**: Run `docker compose ps` to see which containers are running
2. **View logs**: Run `docker compose logs -f` to inspect gateway logs for errors
3. **Verify ports**: Ensure ports `8080`, `8443`, `9090`, and `9094` are not already in use on your machine
4. **Restart cleanly**: Run `docker compose down -v` and then `docker compose up -d` to start fresh
