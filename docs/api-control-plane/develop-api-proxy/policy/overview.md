---
title: "Overview"
pagination_label: "Policies"
description: "How policies work on API proxies in API Management, and the Policy Hub categories of policies you can attach."
---

A policy is a self-contained unit of behavior that plugs into the API's request and response pipeline. Policies let you add capabilities such as authentication, rate limiting, or header changes to an API proxy without writing custom code or changing your backend.

Rather than building each concern from scratch, you compose policies. For example, you can stack authentication on top of rate limiting to secure and protect the same API proxy.

## How Policies Work

Attach a policy at the API level to apply it to every resource in the API proxy, or at the resource level to apply it to a single resource. A policy runs on the request, the response, or both.

When you attach multiple policies, the gateway chains them together at runtime. Each policy processes the message in sequence before passing it to the next, and you can change the order at any time.

## Policy Categories

Policies come from the [Policy Hub](../../../policy-hub/overview.md), the official, curated collection of production-ready, versioned gateway policies. They are grouped into the following categories:

| Category | What it covers | Example policies |
|:---------|:---------------|:-----------------|
| **Security** | Controls who can call your APIs and how traffic to your backends is secured. | API Key Auth, Basic Auth, JWT Auth, OAuth2 Generator, CORS, Subscription Validation, Rate Limit |
| **Guardrails** | Screens what goes into and comes out of AI models. | AWS Bedrock Guardrail, Azure Content Safety, PII Masking, JSON Schema Guardrail, Regex Guardrail |
| **AI and LLM** | Handles cost, token usage, latency, and prompt structure for AI APIs. | LLM Cost, Token-Based Rate Limit, Semantic Cache, Prompt Template, Model Round Robin |
| **MCP (Model Context Protocol)** | Secures and controls MCP servers. | MCP Authentication, MCP Authorization, MCP Access Control, MCP Rewrite |
| **Transformation** | Modifies requests and responses as they pass through the gateway. | Request Rewrite, Host Rewrite, Dynamic Endpoint, Set Headers, Remove Headers, JSON/XML Mediator |
| **Logging, Analytics, and Monitoring** | Records request and response data, and controls which headers appear in analytics. | Log Message, Analytics Header Filter |

:::note
The Policy Hub is powered by an [open source repository on GitHub](https://github.com/wso2/gateway-controllers), where the full source and documentation of each policy live. Every policy is versioned independently. See the [Policy Hub](../../../policy-hub/overview.md) for the full list of policies in each category, their configuration, and their latest versions.
:::

For details on attaching and managing one or more policies to an API proxy component implementation via the API Control Plane, see [Attach and Manage Policies](./attach-and-manage-policies.md).
