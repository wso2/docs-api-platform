---
title: "MCP Proxy Quick Start Guide"
description: "Run API Platform AI Gateway with Docker Compose, configure an MCP proxy, and route your first MCP traffic through the gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/mcp-proxy/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/ai-gateway/mcp-proxy/quick-start-guide.md
tags:
  - ai-gateway
  - mcp
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-30
content_type: "quickstart"
---

## Quick Start

!!! info "Watch the video walkthrough"
    [Check out this quick start on YouTube](https://youtu.be/xt6RIax__dU?rel=0) or watch below.

<iframe 
  width="100%" 
  src="https://www.youtube.com/embed/xt6RIax__dU?rel=0" 
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
- Rancher Desktop (Windows / macOS)
- Colima (macOS)
- Docker Engine + Compose plugin (Linux)

Ensure `docker` and `docker compose` commands are available.

```bash
docker --version
docker compose version
```

```bash
# Download distribution.
wget https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.1.0/wso2apip-ai-gateway-1.1.0.zip

# Unzip the downloaded distribution.
unzip wso2apip-ai-gateway-1.1.0.zip


# Start the complete stack
cd wso2apip-ai-gateway-1.1.0/
docker compose -p ai-gateway up -d

# Verify gateway controller admin endpoint is running
curl http://localhost:9094/health
```

## Deploy an MCP proxy configuration

Start the sample MCP server

```bash
docker run -p 3001:3001 --name everything --network ai-gateway_gateway-network rakhitharr/mcp-everything:v3
```

Run the following command to deploy the MCP proxy.

```bash
curl -X POST http://localhost:9090/api/management/v0.9/mcp-proxies \
  -H "Content-Type: application/yaml" \
  -H "Authorization: Basic YWRtaW46YWRtaW4=" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1alpha1
kind: Mcp
metadata:
  name: everything-mcp-v1.0
spec:
  displayName: Everything
  version: v1.0
  context: /everything
  specVersion: "2025-06-18"
  upstream:
    url: http://everything:3001
  tools: []
  resources: []
  prompts: []
EOF
```
To test MCP traffic routing through the gateway, add the following URL to your MCP client and connect to the server.

```
http://localhost:8080/everything/mcp
```

## Stopping the Gateway

Stop and remove the MCP backend first.

```bash
docker stop everything
docker rm everything
```

When stopping the gateway, you have two options:

### Option 1: Stop runtime, keep data (persisted proxies and configuration)

```bash
docker compose -p ai-gateway down
```

This stops the containers but preserves the `controller-data` volume. When you restart with `docker compose -p ai-gateway up`, all your API configurations will be restored.

### Option 2: Complete shutdown with data cleanup (fresh start)

```bash
docker compose -p ai-gateway down -v
```
This stops containers and removes the `controller-data` volume. Next startup will be a clean slate with no persisted proxies or configuration.