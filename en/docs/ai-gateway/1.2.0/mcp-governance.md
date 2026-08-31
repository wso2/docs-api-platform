---
title: "MCP governance"
description: "Control what an AI agent can reach through an MCP proxy: authenticate callers, authorize per tool, restrict and rename the tool list, and rate limit calls."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/mcp-governance/
md_url: https://wso2.com/api-platform/docs/ai-gateway/mcp-governance.md
tags:
  - ai-gateway
  - mcp
  - access-control
  - authorization
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# MCP governance

An MCP server hands an agent a list of tools and lets it call them. Exposed as it comes, every caller sees every tool, tool names leak whatever the backend happens to call them, and one agent's traffic is indistinguishable from another's. Governing an MCP proxy decides who connects, which tools they see, what those tools are called, and how often they can be invoked.

## Where MCP policies attach

These policies attach to an `Mcp` resource, so they cover the MCP traffic that proxy carries.

Authentication and authorization run before a call reaches the server: the first establishes who is calling, the second checks that this caller may use the specific tool, resource, or prompt named in the request. Access control and rewriting shape the list the caller sees in the first place, so a tool that is filtered out is never offered rather than refused on use. Rate limiting counts calls per tool, resource, prompt, or JSON-RPC method, which is a finer unit than a request count.

## MCP policies

These policies are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../policy-hub/overview.md).

| Policy | What it does |
|--------|--------------|
| [MCP Authentication](https://wso2.com/api-platform/policy-hub/policies/mcp-auth) | Secures MCP server traffic per the MCP specification authorization profile |
| [MCP Authorization](https://wso2.com/api-platform/policy-hub/policies/mcp-authz) | Validates access to MCP tools, resources, and prompts using JWT claims or OAuth scopes |
| [MCP Access Control](https://wso2.com/api-platform/policy-hub/policies/mcp-acl-list) | Controls which tools, resources, and prompts a caller can reach using allow/deny lists |
| [MCP Rewrite](https://wso2.com/api-platform/policy-hub/policies/mcp-rewrite) | Defines user-facing tool names and maps them to backend capability names |
| [MCP Rate Limit](https://wso2.com/api-platform/policy-hub/policies/mcp-ratelimit) | Applies rate limits to MCP traffic per tool, resource, prompt, or JSON-RPC method |
| [Semantic Tool Filtering](https://wso2.com/api-platform/policy-hub/policies/semantic-tool-filtering) | Filters MCP tools to only those semantically relevant to the user query |

## Related topics

- [MCP proxy](gateway-artifacts/mcp-proxy.md) — what an MCP proxy routes, and how to deploy the proxy these policies attach to.
- [Token based rate limiting](token-based-rate-limiting.md) — how MCP rate limiting compares with the request and token limits on LLM traffic.
- [Build an AI agent that uses aggregated MCP tools from multiple APIs](../../guides/ai-and-mcp/build-ai-agent-with-multiple-mcp-servers.md) — connects an agent to three independently governed MCP servers through the gateway.
- [Convert a REST API into an MCP tool for Claude Desktop](../../guides/ai-and-mcp/convert-rest-api-to-mcp-server.md) — exposes a REST API as a governed MCP server and enforces OAuth2 at the gateway.
