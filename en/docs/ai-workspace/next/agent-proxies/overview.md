---
title: "Agent proxies overview"
description: "Put an AI Gateway in front of an A2A agent with an agent proxy, so you govern discovery, access, and policies from AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/agent-proxies/overview/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/agent-proxies/overview.md
tags:
  - ai-workspace
  - agent-proxies
  - a2a
  - agents
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-19
content_type: "concept"
---

# Agent proxies overview

An agent proxy puts the AI Gateway in front of an Agent2Agent (A2A) agent. Clients and other agents call the gateway instead of the agent, and the gateway applies the access controls and policies you set in AI Workspace.

This page is for AI developers who expose agents to other applications, and platform administrators who govern how those agents are reached.

## What is Agent2Agent?

Agent2Agent (A2A) is an open protocol that lets one AI agent discover and work with another. A client agent doesn't need to know how the other agent is built. It only needs what the agent publishes about itself.

An A2A exchange typically follows these steps:

1. The client reads the agent's *Agent Card*, a JSON document that names the agent, describes its skills, and lists the addresses where it accepts requests. Agents usually publish it at `/.well-known/agent-card.json`.
2. The client sends a message to one of those addresses.
3. The agent works on the request as a task and returns the results, either in one response or as a stream of updates.

A2A defines two ways to send those requests, called *protocol bindings*:

| Binding | How a request names its operation |
|---|---|
| `JSONRPC` | One endpoint for every operation. The operation name goes in the JSON-RPC `method` field. |
| `HTTP+JSON` | One route per operation. The HTTP method and path identify the operation, for example `POST /message:send`. |

For a fuller introduction to agents and the A2A protocol, see [Agent governance](../../../ai-gateway/next/agent-governance/index.md).

## What is an agent proxy?

An agent proxy is the AI Workspace artifact that connects the AI Gateway to one upstream A2A agent. It records the following:

- The agent's address, and the credential the gateway sends to reach it.
- The context path and protocol bindings the gateway serves the agent on.
- How the gateway serves the agent's Agent Card.
- The policies the gateway applies to the agent's traffic.

You create the proxy once in AI Workspace, then deploy it to one or more gateways. Each gateway then serves the agent at its own address.

The following diagram shows where the agent proxy sits:

```text
                      AI Workspace
              (stores the agent proxy)
                           │
                           │ Deploy
                           ▼
Client agent ───────► AI Gateway ───────► A2A agent
              Agent Card,      Policies
              messages,        applied
              tasks
```

## What does an agent proxy offer?

An agent that serves A2A directly offers no place to put access control, and its Agent Card points every client straight at the agent. An agent proxy adds the following:

- **One governed address**: Clients reach the agent through the gateway's host and certificate. The agent itself doesn't need to be reachable from the client network.
- **Agent Card control**: The gateway either rewrites the addresses in the agent's own card so clients come back through the gateway, or serves a card that you write. See [Configure the Agent Card](agent-card.md).
- **Policies per operation**: The gateway identifies the A2A operation behind each request, such as `SendMessage` or `CancelTask`, so you can apply a policy to every operation or to one. The same policies apply on both protocol bindings. See [Apply policies to an agent proxy](apply-policies.md).
- **API keys**: Issue keys to the clients that call the agent, and revoke them without changing the agent. See [Manage an agent proxy](manage-proxy.md#manage-api-keys).

## Next steps

- [Quick start guide](quick-start-guide.md): put a sample agent behind a gateway and call it.
- [Configure an agent proxy](configure-proxy.md): create a proxy for your own agent and deploy it.
- [Configure the Agent Card](agent-card.md): choose how the gateway serves the agent's card.
- [Apply policies to an agent proxy](apply-policies.md): control who calls the agent and how.
- [Manage an agent proxy](manage-proxy.md): edit, secure, and delete a proxy.
