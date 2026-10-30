---
title: "MCP Servers Overview"
description: "Learn how WSO2 API Platform turns existing APIs into MCP servers with a centralized control plane, tool generation, and OAuth2 security."
canonical_url: https://wso2.com/api-platform/docs/cloud/mcp-servers/get-started-with-mcp/
md_url: https://wso2.com/api-platform/docs/cloud/mcp-servers/get-started-with-mcp.md
tags:
  - cloud
  - mcp
  - overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "overview"
---

# Overview

## What is Model Context Protocol?

MCP is a JSON-RPC–based protocol designed to standardize how applications interact with large language models (LLMs). It enables sharing of contextual information—such as local files, databases, or APIs—with LLMs, while also allowing applications to expose tools and capabilities for AI-driven workflows and integrations.

MCP follows a host–client–server architecture and supports two primary transport mechanisms: stdio and streamable HTTP. While stdio is commonly used for local communication between clients and servers on the same machine, streamable HTTP is increasingly preferred for remote connections, especially as MCP adoption grows across networked environments. 

For more information, refer to the official [specification](https://modelcontextprotocol.io/introduction).

## Remote MCP Servers with API Platform

API Platform now includes support for MCP servers. It provides a complete solution for transforming existing APIs into intelligent, AI-ready tools. With a centralized control plane, API Platform simplifies the entire lifecycle of MCP server management—from creation to discovery—delivering a seamless experience for both API developers and AI agent builders. Additionally, API Platform allows you to customize the developer portal to deliver a tailored, MCP-only experience for your consumers.

![Bijira architecture diagram showing Developer and MCP Client or AI Agents interacting with Bijira Console containing Manage Tools, Manage Lifecycle, Add Policies, and MCP Hub Theming, Bijira Developer Portal with Discover MCP Server and Manage Application, and Bijira Gateway routing to MCP Servers and API Proxies which connect to a backend Service](../../assets/img/introduction/mcp/mcp-architecture.png)

In summary, API Platform provides the following capabilities related to MCP.

1. Create MCP Servers from existing API proxies or HTTP backends.
2. Automatically generate the MCP tool schemas.
3. Secure the MCP Servers with OAuth2 security.
4. Customize the Developer portal into an MCP Hub.

## MCP Use Cases with API Platform

- [Design and Publish MCP Servers for your APIs](design-mcp-servers.md)
- [Proxy Remote MCP Servers](proxy-remote-servers.md)
- [Customize the Developer Portal to an MCP Hub](devportal-mcp-hub.md)

