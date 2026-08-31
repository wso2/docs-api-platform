---
title: "AI Gateway Controller Management API"
description: "Overview of the AI Gateway Controller REST API for managing LLM providers, LLM proxies, MCP proxies, certificates, and secrets."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/reference/management-api/
md_url: https://wso2.com/api-platform/docs/ai-gateway/reference/management-api.md
tags:
  - ai-gateway
  - management-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-11
content_type: "overview"
---

# Gateway Controller Management API v1.0.0

REST API for managing API configurations in the WSO2 API Platform Gateway.

Base URLs:
* <a href="http://localhost:9090/api/management/v1">http://localhost:9090/api/management/v1</a>
* <a href="http://gateway-controller:9090/api/management/v1">http://gateway-controller:9090/api/management/v1</a>

## Table of Contents

### [Authentication](../../setup-and-deployment/secure-the-management-api.md)

- [Overview](../../setup-and-deployment/secure-the-management-api.md#overview)
- [How It Works](../../setup-and-deployment/secure-the-management-api.md#how-it-works)
- [Configuration](../../setup-and-deployment/secure-the-management-api.md#configuration)
- [Role Mapping Semantics](../../setup-and-deployment/secure-the-management-api.md#role-mapping-semantics)
- [Troubleshooting (What you’ll observe)](../../setup-and-deployment/secure-the-management-api.md#troubleshooting-what-youll-observe)
- [Testing](../../setup-and-deployment/secure-the-management-api.md#testing)

### [MCP Proxy Management](mcp-proxy-management.md)

- [Create a new MCPProxy](mcp-proxy-management.md#create-a-new-mcpproxy)
- [List all MCPProxies](mcp-proxy-management.md#list-all-mcpproxies)
- [Get MCPProxy by id](mcp-proxy-management.md#get-mcpproxy-by-id)
- [Update an existing MCPProxy](mcp-proxy-management.md#update-an-existing-mcpproxy)
- [Delete a MCPProxy](mcp-proxy-management.md#delete-a-mcpproxy)

### [Certificate Management](certificate-management.md)

- [List all custom certificates](certificate-management.md#list-all-custom-certificates)
- [Upload a new certificate](certificate-management.md#upload-a-new-certificate)
- [Delete a certificate](certificate-management.md#delete-a-certificate)
- [Manually reload certificates](certificate-management.md#manually-reload-certificates)

### [LLM Provider Template Management](llm-provider-template-management.md)

- [Create a new LLM provider template](llm-provider-template-management.md#create-a-new-llm-provider-template)
- [List all LLM provider templates](llm-provider-template-management.md#list-all-llm-provider-templates)
- [Get LLM provider template by id](llm-provider-template-management.md#get-llm-provider-template-by-id)
- [Update an existing LLM provider template](llm-provider-template-management.md#update-an-existing-llm-provider-template)
- [Delete an LLM provider template](llm-provider-template-management.md#delete-an-llm-provider-template)

### [LLM Provider Management](llm-provider-management.md)

- [Create a new LLM provider](llm-provider-management.md#create-a-new-llm-provider)
- [List all LLM providers](llm-provider-management.md#list-all-llm-providers)
- [Get LLM provider by identifier](llm-provider-management.md#get-llm-provider-by-identifier)
- [Update an existing LLM provider](llm-provider-management.md#update-an-existing-llm-provider)
- [Delete an LLM provider](llm-provider-management.md#delete-an-llm-provider)
- [Create a new API key for an LLM provider](llm-provider-management.md#create-a-new-api-key-for-an-llm-provider)
- [Get the list of API keys for an LLM provider](llm-provider-management.md#get-the-list-of-api-keys-for-an-llm-provider)
- [Regenerate API key for an LLM provider](llm-provider-management.md#regenerate-api-key-for-an-llm-provider)
- [Update an API key for an LLM provider](llm-provider-management.md#update-an-api-key-for-an-llm-provider)
- [Revoke an API key for an LLM provider](llm-provider-management.md#revoke-an-api-key-for-an-llm-provider)

### [LLM Proxy Management](llm-proxy-management.md)

- [Create a new LLM proxy](llm-proxy-management.md#create-a-new-llm-proxy)
- [List all LLM proxies](llm-proxy-management.md#list-all-llm-proxies)
- [Get LLM proxy by unique identifier](llm-proxy-management.md#get-llm-proxy-by-unique-identifier)
- [Update an existing LLM proxy](llm-proxy-management.md#update-an-existing-llm-proxy)
- [Delete an LLM proxy](llm-proxy-management.md#delete-an-llm-proxy)
- [Create a new API key for an LLM proxy](llm-proxy-management.md#create-a-new-api-key-for-an-llm-proxy)
- [Get the list of API keys for an LLM proxy](llm-proxy-management.md#get-the-list-of-api-keys-for-an-llm-proxy)
- [Regenerate API key for an LLM proxy](llm-proxy-management.md#regenerate-api-key-for-an-llm-proxy)
- [Update an API key for an LLM proxy](llm-proxy-management.md#update-an-api-key-for-an-llm-proxy)
- [Revoke an API key for an LLM proxy](llm-proxy-management.md#revoke-an-api-key-for-an-llm-proxy)

### [Secrets Management](secrets-management.md)

- [List all secrets](secrets-management.md#list-all-secrets)
- [Create a new secret](secrets-management.md#create-a-new-secret)
- [Retrieve a secret](secrets-management.md#retrieve-a-secret)
- [Update a secret](secrets-management.md#update-a-secret)
- [Delete a secret](secrets-management.md#delete-a-secret)

### [Schemas](schemas.md)
