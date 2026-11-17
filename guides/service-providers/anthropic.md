---
title: "Anthropic guides"
description: "Use WSO2 API Platform to govern Claude model traffic, route Claude Code through AI Gateway, and connect Claude to governed APIs and MCP servers."
canonical_url: https://wso2.com/api-platform/docs/guides/service-providers/anthropic/
md_url: https://wso2.com/api-platform/docs/guides/service-providers/anthropic.md
tags:
  - guides
  - anthropic
  - claude
  - claude-code
  - claude-desktop
  - service-provider-guides
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "reference"
---

# Govern Claude models, Claude Code, and Claude Desktop

WSO2 API Platform works alongside the Anthropic products you already use. Govern traffic to Claude models, route Claude Code through AI Gateway, and give Claude Desktop and Claude Code controlled access to APIs and MCP servers.

## End-to-end guides and tutorials

Step-by-step guides for Claude Code and Claude Desktop. Guides are part of this documentation. Tutorials are published on the WSO2 API Platform Learn Hub and written for the product version they name.

<div class="vendor-guide-list" markdown="1">

- [Configure Claude Code with AI Gateway](../ai-and-mcp/ai-coding-assistants/claude-code-configuration-with-ai-gateway.md)

    Route Claude Code requests through an Anthropic provider and an App LLM Proxy.

    Guide · Anthropic API key · Hybrid

- [Configure Claude Code with AI Gateway using a Claude subscription](../ai-and-mcp/ai-coding-assistants/claude-code-subscription-configuration-with-ai-gateway.md)

    Route Claude Team or Enterprise traffic through AI Gateway with enterprise identity.

    Guide · Claude subscription · Hybrid, Self-hosted

- [Build an AI app with Claude Code that calls governed APIs](../ai-and-mcp/build-ai-app-with-claude-code.md)

    Give Claude Code governed, rate-limited access to your backend APIs.

    Guide · Claude Code · Cloud

- [Convert a REST API into an MCP tool for Claude Desktop](../ai-and-mcp/convert-rest-api-to-mcp-server.md)

    Expose a REST API as a governed MCP server and use it in Claude Desktop.

    Guide · Claude Desktop · Cloud

- [Find and connect to an enterprise MCP server from the MCP Hub](../ai-and-mcp/find-and-connect-to-an-enterprise-mcp-server-from-the-mcp-hub.md)

    Find an approved MCP server, generate client configuration, and connect Claude Desktop or Claude Code to it.

    Guide · Claude Desktop and Claude Code · Cloud

- [Control Claude Code costs across a large engineering team](https://wso2.com/api-platform/learn/control-claude-code-ai-cost-with-ai-gateway/)

    Add token limits, cost caps, semantic caching, prompt compression, and per-developer spend visibility to a shared Claude Code setup.

    Learn Hub tutorial · Anthropic API key · Hybrid, Self-hosted

</div>

!!! note "Choose a billing model"
    With an Anthropic API key, the gateway holds the key and Anthropic charges per token. Developers never see the Anthropic key. With a Claude Team or Enterprise subscription, the gateway forwards each developer's Claude token to Anthropic and authenticates the developer against your identity provider.

## AI Gateway with Claude models

Route, secure, and govern traffic to Claude models through WSO2 AI Gateway, including traffic from Claude Code.

<div class="vendor-cap" markdown="1">

### Anthropic as an LLM provider

Connect the Anthropic API. The gateway holds the Anthropic key, so developers and applications never see it.

<div class="vendor-links" data-deployments="cloud" markdown="1">

- [Create an AI API for Anthropic Claude](../../cloud/create-api-proxy/third-party-apis/claude.md) <span class="vendor-meta">Cloud console</span>

</div>

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [Configure an LLM provider](../../cloud/ai-workspace/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>
- [Call Anthropic through the gateway](../../cloud/ai-workspace/using-sdks.md#anthropic) <span class="vendor-meta">AI Workspace</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [Anthropic provider](../../ai-gateway/2026.09.24/gateway-artifacts/llm-provider/supported-providers/anthropic.md) <span class="vendor-meta">AI Gateway</span>
- [Configure an LLM provider](../../ai-workspace/1.0.0/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>

</div>

</div>

<div class="vendor-links" data-deployments="cloud" markdown="1">

Token limits, semantic caching, and the other AI API policies work the same way for every provider. See [AI APIs](../../cloud/create-api-proxy/third-party-apis/ai-apis.md).

</div>

<div class="vendor-links" data-deployments="hybrid" markdown="1">

Routing, token limits, cost control, and the other AI Workspace policies work the same way for every provider. See the [AI Workspace overview](../../cloud/ai-workspace/overview.md).

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

Routing, token limits, cost control, and the gateway's other policies work the same way for every provider. See the [AI Gateway documentation](../../ai-gateway/2026.09.24/overview.md).

</div>

## Claude Desktop and MCP tools

Expose your APIs and MCP servers to Claude Desktop and Claude Code through governed MCP proxies. Tool calls go through the gateway. Requests to Claude models go directly to Anthropic unless you also route them through AI Gateway.

<div class="vendor-cap" markdown="1">

### MCP proxies

Put an MCP proxy in front of an MCP server, and control which tools Claude can call.

<div class="vendor-links" data-deployments="cloud" markdown="1">

- [Get started with MCP](../../cloud/mcp-servers/get-started-with-mcp.md) <span class="vendor-meta">Cloud console</span>
- [Proxy remote MCP servers](../../cloud/mcp-servers/proxy-remote-servers.md) <span class="vendor-meta">Cloud console</span>
- [Find and connect to an enterprise MCP server from the MCP Hub](../ai-and-mcp/find-and-connect-to-an-enterprise-mcp-server-from-the-mcp-hub.md) <span class="vendor-meta">End-to-end guide</span>

</div>

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [MCP proxies overview](../../cloud/ai-workspace/mcp-proxies/overview.md) <span class="vendor-meta">AI Workspace</span>
- [Configure an MCP proxy](../../cloud/ai-workspace/mcp-proxies/configure-proxy.md) <span class="vendor-meta">AI Workspace</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [MCP proxy](../../ai-gateway/2026.09.24/gateway-artifacts/mcp-proxy.md) <span class="vendor-meta">AI Gateway</span>
- [MCP governance](../../ai-gateway/2026.09.24/mcp-governance.md) <span class="vendor-meta">AI Gateway</span>
- [MCP proxies overview](../../ai-workspace/1.0.0/mcp-proxies/overview.md) <span class="vendor-meta">AI Workspace</span>

</div>

</div>

## Architecture and responsibility model

WSO2 API Platform and Anthropic split the work like this:

| Scenario | WSO2 role | Anthropic role | Runtime traffic |
| --- | --- | --- | --- |
| Claude Code through AI Gateway | Authenticates developers and applies guardrails, rate limits, and analytics | Hosts the Claude models and bills the API key or subscription | Goes through WSO2 AI Gateway to Anthropic |
| Applications calling Claude models | Proxies and governs LLM requests | Hosts the Claude models | Goes through WSO2 AI Gateway to Anthropic |
| Claude Desktop and Claude Code with governed tools | Proxies and governs your APIs and MCP servers | Provides the Claude client and model | Tool calls go through WSO2, and model requests go directly to Anthropic |

## Learn more

Related pages in the Anthropic documentation:

- [Claude Code LLM gateway configuration](https://code.claude.com/docs/en/llm-gateway)
- [Claude models overview](https://platform.claude.com/docs/en/models/overview)
- [Claude API overview](https://platform.claude.com/docs/en/api/overview)
- [Connect to remote MCP servers](https://modelcontextprotocol.io/docs/develop/connect-remote-servers)

To browse every guide by goal, see the [Guides overview](../overview.md#browse-by-use-case).