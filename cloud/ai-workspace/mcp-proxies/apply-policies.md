---
title: "Apply policies to an MCP proxy"
description: "Apply access control, authorization, and rewrite policies to MCP proxies using the Policy Hub."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/mcp-proxies/apply-policies/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/mcp-proxies/apply-policies.md
tags:
  - cloud
  - ai-workspace
  - mcp-proxies
  - policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Apply Policies for MCP Proxy

Once you create an MCP proxy, you can apply various policies through the Policies page.

The AI Workspace provides a set of built-in policies that let you govern how traffic flows through your MCP Proxies. These policies are applied at the policy level.
However, you have the option to define rules per tools, prompts, etc. inside MCP specific policies if required. This will essentially apply the policies at each capability level.

## Access Control Policies

There are several policies that enforce security for MCP Proxies.

| Policy | Description |
|-----------|-------------|
| [MCP Authentication](https://wso2.com/api-platform/policy-hub/policies/mcp-auth) | Apply authentication as defined in the MCP Specification. |
| [MCP Authorization](https://wso2.com/api-platform/policy-hub/policies/mcp-authz) | Apply fine-grained authorization for MCP capabilities and JSON RPC methods. |
| [MCP Access Control](https://wso2.com/api-platform/policy-hub/policies/mcp-acl-list) | Allow or deny access to MCP capabilities. |

## Other Policies

| Policy | Description |
|-----------|-------------|
| [MCP Rewrite](https://wso2.com/api-platform/policy-hub/policies/mcp-rewrite) | Rewrite MCP capabilities returned through the proxy. This will only return the modified ones if used. |

You can apply other standard policies as well to MCP Proxies. Some policies might not be compatible with MCP. Hence the behavior will vary based on the policy.

## Policy Hub

All policies in the AI Workspace are powered by the [Policy Hub](https://wso2.com/api-platform/policy-hub/). The Policy Hub is a central registry of all available policies and their latest versions.

Visit the [Policy Hub](https://wso2.com/api-platform/policy-hub/) to explore all available guardrails, their documentation, and configuration schemas.