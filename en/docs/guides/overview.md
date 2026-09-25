---
title: "Guides overview"
description: "Step-by-step guides for WSO2 API Platform, grouped by goal: govern LLM traffic, expose and govern MCP servers, manage and govern APIs, monetize, and more."
canonical_url: https://wso2.com/api-platform/docs/guides/overview/
md_url: https://wso2.com/api-platform/docs/guides/overview.md
tags:
  - guides
  - overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-23
content_type: "overview"
---

# Guides

Guides are end-to-end walkthroughs built around real scenarios. Each guide takes you from an empty project to a working, governed API, AI, or MCP setup on WSO2 API Platform.

Each guide gives you:

- The prerequisites and, where it helps, the architecture of what you will build
- Step-by-step instructions with the expected result after each step
- A way to verify that everything works end to end
- A runnable companion sample, where available

Use guides to see how components such as AI Gateway, AI Workspace, Developer Portal, and MCP Hub work together. For details on a single feature, see the product documentation for [Cloud](../cloud/introduction/what-is-bijira.md), [API Manager](../api-manager/overview.md), [AI Gateway](../ai-gateway/1.1.0/overview.md), or [API Portal](../api-portal/1.0.0/overview.md).

## Explore what you can build

The guides below are grouped by use case. Whether you want to secure and manage your APIs, control LLM usage and cost, monitor AI traffic, turn your APIs into MCP tools, give AI agents access to your APIs as MCP tools, or monetize your usage, browse the guides for your use case and try them out on your own from start to finish.

<div class="cards-container guides-cards" markdown="1">

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h7"/></svg>Govern LLM Traffic

---

Route, secure, and control cost for requests to LLM providers.

- [Set up a governed multi-model LLM proxy with cost controls and failover](ai-and-mcp/set-up-a-governed-multi-model-llm-proxy-with-cost-controls-and-failover.md)

    Spread traffic across models with per-team token budgets, PII masking, and caching.

- [Enforce token-based rate limiting on an LLM proxy](ai-and-mcp/enforce-token-based-rate-limiting-on-an-llm-proxy.md)

    Put a token quota on an LLM proxy to protect your provider budget.

- [Block prompt injection and unsafe requests with LLM proxy guardrails](ai-and-mcp/block-prompt-injection-and-unsafe-requests-with-llm-proxy-guardrails.md)

    Chain guardrails to reject unsafe prompts before they reach your model.

- [Enforce a consistent AI persona with the prompt decorator policy](ai-and-mcp/using-prompt-decorator-policy.md)

    Give every client the same on-brand AI persona without code changes.

- [Observe LLM traffic on the AI Gateway](ai-and-mcp/observe-llm-traffic.md)

    Track requests, latency, tokens, cost, and guardrail activity for LLM proxies.

</div>

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3v6M15 3v6M6 9h12v4a6 6 0 01-12 0zM12 19v3"/></svg>Expose and Govern MCP Servers

---

Turn APIs into MCP tools, publish them, and control access.

- [Convert a REST API into an MCP tool for Claude Desktop](ai-and-mcp/convert-rest-api-to-mcp-server.md)

    Expose a REST API as a governed MCP server and use it in Claude Desktop.

- [Expose a multi-step API workflow as an MCP tool](ai-and-mcp/expose-a-multi-step-api-workflow-as-an-mcp-tool.md)

    Combine several API calls into one Arazzo workflow and expose it as an MCP tool.

- [Build an AI agent that uses aggregated MCP tools from multiple APIs](ai-and-mcp/build-ai-agent-with-multiple-mcp-servers.md)

    Connect an AI agent to several governed MCP servers through AI Gateway.

- [Publish MCP servers to a governed catalog](ai-and-mcp/publish-mcp-servers-to-a-governed-catalog.md)

    Publish MCP servers to API Portal and MCP Hub for governed discovery.

- [Reduce MCP tool poisoning risk with the MCP Access Control policy](ai-and-mcp/block-mcp-tool-poisoning-with-the-mcp-access-control-policy.md)

    Use the MCP Access Control policy to reduce exposure to tool poisoning.

- [Observe MCP traffic on the AI Gateway](ai-and-mcp/observe-mcp-traffic.md)

    Track tool calls, agent sessions, latency, and errors for MCP proxies.

</div>

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0"/></svg>Discover APIs and MCP Servers

---

Find APIs and MCP servers in the Developer Portal and MCP Hub, and make your first call.

- [Go from zero to a working API call using the Developer Portal](developer-portal/api-discovery-and-tryout.md)

    Find an API, try it with an API key, and subscribe to a rate-limited plan.

- [Find and connect to an enterprise MCP server from the MCP Hub](ai-and-mcp/find-and-connect-to-an-enterprise-mcp-server-from-the-mcp-hub.md)

    Find an MCP server in the MCP Hub and connect Claude Desktop to it.

</div>

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 9l-3 3 3 3M16 9l3 3-3 3"/></svg>Configure AI Coding Assistants with AI Gateway

---

Route Claude Code, Gemini CLI, and Codex traffic through AI Gateway.

- [Configure Claude Code with AI Gateway](ai-and-mcp/ai-coding-assistants/claude-code-configuration-with-ai-gateway.md)

    Route Claude Code requests through AI Gateway with an App LLM Proxy.

- [Configure Claude Code with AI Gateway using a Claude subscription](ai-and-mcp/ai-coding-assistants/claude-code-subscription-configuration-with-ai-gateway.md)

    Route Claude Team or Enterprise traffic through AI Gateway with enterprise identity.

- [Configure Google Gemini CLI with AI Gateway](ai-and-mcp/ai-coding-assistants/gemini-cli-configuration-with-ai-gateway.md)

    Route Gemini CLI requests through AI Gateway with an App LLM Proxy.

- [Configure OpenAI Codex CLI with AI Gateway](ai-and-mcp/ai-coding-assistants/codex-configuration-with-ai-gateway.md)

    Route Codex CLI requests through AI Gateway with an App LLM Proxy.

</div>

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h18v10H3zM3 11h18"/></svg>Monetize APIs and MCP Tools

---

Charge for API calls and MCP tool usage with usage-based plans.

- [Monetize a REST API with Stripe](monetization/api-monetization.md)

    Charge for a REST API with a pay-as-you-go plan billed through Stripe.

- [Monetize MCP tools with the self-hosted AI Gateway](monetization/mcp-tool-monetization.md)

    Bill AI agents per MCP tool call using AI Gateway, Moesif, and Stripe.

</div>

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>Manage and Govern APIs

---

Publish your APIs as managed API proxies, and control who calls them with authentication, rate limits, and audit logs.

- [Build an AI app with Claude Code that calls governed APIs](ai-and-mcp/build-ai-app-with-claude-code.md)

    Give Claude Code governed, rate-limited access to your backend APIs.

</div>

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>Connect Third-Party Gateways

---

Connect gateways such as AWS API Gateway, discover their APIs, and govern them from one control plane.

- [Discover APIs from AWS API Gateway](gateway-federation/discover-apis-from-aws-api-gateway.md)

    Discover APIs on AWS API Gateway and govern them from one control plane.

</div>

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>Expose Real-Time APIs

---

Put an API proxy in front of WebSocket backends and push live updates to every client.

- [Build a WebSocket-based real-time notification system](websocket/build-a-websocket-notification-system.md)

    Stream real-time notifications to clients through a WebSocket API proxy.

</div>

</div>

## More resources

<div class="cards-container guides-cards" markdown="1">

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 9l-3 3 3 3M16 9l3 3-3 3"/></svg>Try the samples

---

Clone runnable sample apps for these guides from GitHub.

[View samples &rarr;](https://github.com/wso2/api-platform/tree/main/samples)

</div>

<div class="card" markdown="1">

### <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a10 10 0 100-20 10 10 0 000 20zM9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01"/></svg>Need help?

---

New to WSO2 API Platform? Start with a quick start guide, or ask the community for help.

[Get started &rarr;](../get-started.md)

</div>

</div>
