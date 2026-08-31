---
title: "Reference"
description: "Reference material for the AI Gateway: the Gateway Controller management REST API, its request and response schemas, and the default listener ports."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/reference/
md_url: https://wso2.com/api-platform/docs/ai-gateway/reference.md
tags:
  - ai-gateway
  - reference
  - management-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "reference"
---

# Reference

Look up the management REST API and the ports the gateway listens on.

## Management REST API

Every call authenticates against the management API. For how that authentication is configured, see [Secure the management API](../setup-and-deployment/secure-the-management-api.md).

| Page | What it covers |
|------|----------------|
| [Overview](management-api/index.md) | Overview of the AI Gateway Controller REST API for managing LLM providers, LLM proxies, MCP proxies, certificates, and secrets. |
| [LLM provider template management](management-api/llm-provider-template-management.md) | REST API reference for creating, listing, updating, and deleting LLM provider templates in API Platform Gateway. |
| [LLM provider management](management-api/llm-provider-management.md) | REST API reference for creating, listing, updating, and deleting LLM provider configurations and API keys in API Platform Gateway. |
| [LLM proxy management](management-api/llm-proxy-management.md) | REST API reference for creating, listing, updating, and deleting LLM proxy configurations and API keys in API Platform Gateway. |
| [MCP proxy management](management-api/mcp-proxy-management.md) | REST API reference for creating, listing, updating, and deleting MCP proxy configurations in API Platform Gateway. |
| [Certificate management](management-api/certificate-management.md) | REST API reference for managing custom TLS certificates in API Platform Gateway: list, upload, delete, and reload certificates dynamically. |
| [Secrets management](management-api/secrets-management.md) | REST API reference for creating, listing, retrieving, updating, and deleting secrets in API Platform Gateway. |
| [Schemas](management-api/schemas.md) | JSON schema definitions for all API Platform Gateway Controller management API request and response objects. |

## Ports

The gateway listens on several ports, each serving a different kind of traffic.

| Page | What it covers |
|------|----------------|
| [Default ports](default-ports.md) | Default ports the AI Gateway listens on: router HTTP and HTTPS traffic, the Gateway-Controller REST API, and the admin health endpoints. |
