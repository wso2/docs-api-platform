---
title: "MCP proxies overview"
description: "Connect the AI Gateway to upstream MCP servers and apply security, policy, and observability controls through an MCP proxy."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/mcp-proxies/overview/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/mcp-proxies/overview.md
tags:
  - cloud
  - ai-workspace
  - mcp-proxies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "overview"
---

# MCP proxies overview

## What is Model Context Protocol?

Model Context Protocol (MCP) is a JSON-RPC-based protocol that standardizes how applications interact with large language models (LLMs). It shares contextual information—such as local files, databases, or APIs—with LLMs, and it lets applications expose tools and capabilities for AI-driven workflows and integrations.

MCP follows a host-client-server architecture and supports two transport mechanisms: stdio and streamable HTTP. Use stdio for local communication between a client and a server on the same machine. In most other cases, deploy the server in a remote environment with authorization controls, so LLM applications access the data securely.

For more information, refer to the official [specification](https://modelcontextprotocol.io/introduction).

## What is an MCP proxy?

An MCP proxy connects the gateway to an upstream MCP server. MCP clients call the dedicated endpoint the gateway provides, and the gateway forwards their requests to your upstream MCP server. On that proxy you apply policies that control the MCP traffic passing through the gateway.

## What does an MCP proxy offer?

MCP defines an RPC-based communication model between agents and tools, but it leaves the demands of an enterprise environment to you. An MCP proxy covers them with built-in security, governance, and observability for MCP communication:

- **Security**: authenticates and authorizes callers.
- **Policies**: enforces the policies that control MCP traffic.
- **Observability**: shows which tools and servers are called, and which calls fail.

## Next steps

- [Configure an MCP proxy](configure-proxy.md): create and deploy your first proxy
- [Apply policies to an MCP proxy](apply-policies.md): apply policies after deployment