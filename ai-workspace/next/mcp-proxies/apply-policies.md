---
title: "Apply policies to an MCP proxy"
description: "Apply access control, authorization, and rewrite policies to MCP proxies using the Policy Hub."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/mcp-proxies/apply-policies/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/mcp-proxies/apply-policies.md
tags:
  - cloud
  - ai-workspace
  - mcp-proxies
  - policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Apply policies to an MCP proxy

Once you create an MCP proxy, open it from **MCP** > **MCP Proxies** and go to its **Policies** tab to apply policies.

AI Workspace provides built-in policies that govern how traffic flows through your MCP proxies. A policy applies to the whole proxy by default. Inside an MCP-specific policy you can also define rules per tool or per prompt. Those rules apply the policy at each capability level.

## Access control policies

These policies enforce security for MCP proxies.

| Policy | Description |
|-----------|-------------|
| [MCP authentication](https://wso2.com/api-platform/policy-hub/policies/mcp-auth) | Applies authentication as defined in the MCP specification. |
| [MCP authorization](https://wso2.com/api-platform/policy-hub/policies/mcp-authz) | Applies fine-grained authorization for MCP capabilities and JSON-RPC methods. |
| [MCP access control](https://wso2.com/api-platform/policy-hub/policies/mcp-acl-list) | Allows or denies access to MCP capabilities. |

## Other policies

| Policy | Description |
|-----------|-------------|
| [MCP rewrite](https://wso2.com/api-platform/policy-hub/policies/mcp-rewrite) | Rewrites the MCP capabilities returned through the proxy. When applied, the proxy returns only the modified capabilities. |

You can apply the other standard policies to MCP proxies too. Not every policy supports MCP traffic. Check the policy's entry in the [Policy Hub](https://wso2.com/api-platform/policy-hub/) for its supported proxy types and behavior before you attach it.

## Policy Hub

The policies in AI Workspace are powered by the [Policy Hub](https://wso2.com/api-platform/policy-hub/), a central registry of the available policies and their versions.

Visit the [Policy Hub](https://wso2.com/api-platform/policy-hub/) to explore all available policies, their documentation, and configuration schemas.