---
title: "Configure the Agent Card"
description: "Choose how the AI Gateway serves an agent proxy's public and protected Agent Cards: forward the agent's own card with gateway URLs, or serve one you write."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/agent-proxies/agent-card/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/agent-proxies/agent-card.md
tags:
  - cloud
  - ai-workspace
  - agent-proxies
  - a2a
  - agent-card
  - discovery
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-19
content_type: "how-to"
---

# Configure the Agent Card

An Agent Card is the document an Agent2Agent (A2A) client reads before it calls an agent. The card lists the agent's skills and the addresses where it accepts requests, and the client sends its requests to those addresses.

The addresses in the card decide whether clients go through the gateway. An agent's own card lists the agent's own addresses. If clients receive that card unchanged, they call the agent directly and skip every policy on the agent proxy. This page shows you how to make sure the card your clients receive points them at the gateway.

## The public card and the protected card

An agent proxy serves two Agent Cards:

- **Public card**: Anyone who can reach the gateway can read the public card, without authentication. The gateway serves it at `/.well-known/agent-card.json` below the proxy's context. Clients read it to discover the agent.
- **Protected card**: Also called the *extended Agent Card*, the protected card carries details that the agent shows only to authenticated callers. Clients request it through the `GetExtendedAgentCard` operation, on the transports the proxy exposes.

The gateway returns the protected card only when a policy on the proxy has authenticated the request. Without an authentication policy, every request for the protected card receives `401 Unauthorized`. To add one, see [Apply policies to an agent proxy](apply-policies.md).

## Choose a mode

You set a mode for each card on its own. The mode decides where the card comes from:

| Mode | Where the card comes from | When to use it |
|---|---|---|
| **Passthrough** | The gateway forwards the agent's own card. Changes the agent makes to its card reach clients automatically. | The agent already publishes a card you're happy with. Both cards use this mode by default. |
| **Managed** | AI Workspace stores a card that you write, and the gateway serves that card itself. Card requests never reach the agent. | You want to decide exactly what clients see, or the agent doesn't publish a card. |

To change the mode of a card, follow these steps:

1. Navigate to **Agents** > **Agent Proxies**, and click the proxy name to open its details page.
2. Open the **Agent Card** tab.
3. Under **Public Card** or **Protected Card**, select **Passthrough** or **Managed** for **Mode**.
4. Configure the card, as described in the following sections.
5. Click **Save**.
6. [Deploy the proxy again](configure-proxy.md#deploy-the-proxy-to-a-gateway), so the gateway serves the updated card.

## Forward the agent's own card

In **Passthrough** mode, the gateway passes card requests to the agent and returns the agent's card to the client.

For the public card, the tab shows the agent's current card as read-only **Card Content**. AI Workspace fetches it live from the agent. If AI Workspace can't reach the agent, the tab shows a message instead of the card. The gateway still forwards the card at request time, if the gateway can reach the agent.

### Keep the rewritten URLs

The **Rewrite URLs** switch is on by default. With rewriting on, the gateway replaces the addresses in the card's `supportedInterfaces` with its own addresses before it returns the card. A client configured from the rewritten card sends its requests to the gateway.

Rewriting has the following effects:

- **The gateway rewrites only the bindings the proxy exposes.** If the agent's card lists a binding that isn't one of the proxy's transports, that entry keeps the agent's own address. A client that picks that binding calls the agent directly.
- **The gateway removes the card's `signatures` block**, because the signature no longer matches the rewritten card.

Turn **Rewrite URLs** off only when you want clients to call the agent directly. The gateway then returns the agent's card exactly as the agent sent it, including its signatures.

## Serve a card you write

In **Managed** mode, you write the card in the **Card Content** editor, and the gateway serves it from its own copy.

To start a protected card from the public one, click **Start From Agent's Public Card**. AI Workspace copies the public card into the editor: the card you wrote if the public card is **Managed**, or the agent's own card if it's **Passthrough**. You then add the details for authenticated callers.

When you save, AI Workspace checks that the card has the following:

- Valid JSON, up to 1 MiB.
- The fields `name`, `description`, `version`, `supportedInterfaces`, `capabilities`, `defaultInputModes`, `defaultOutputModes`, and `skills`.

When you deploy, the gateway checks the addresses in `supportedInterfaces` against the proxy's transports, and rejects the deployment if they don't match. A card the gateway accepts meets these rules:

- Each transport on the proxy has an interface entry with its `protocolBinding`, and no entry names a binding the proxy doesn't expose.
- Each entry's `protocolVersion` is `1.0`.
- Each `url` is an absolute `http` or `https` URL, with no user name, password, query string, or fragment.
- The path of each `url` is the proxy's context followed by that transport's path.
- The card has no `signatures` block.

If the public card is **Managed** and you've changed any setting of the protected card, the public card must also set `capabilities.extendedAgentCard` to `true`. This setting tells clients that a protected card exists.

The following public card suits a proxy with the context `/default/trip-planning-agent`, a `JSONRPC` transport at `/rpc`, and an `HTTP+JSON` transport at `/rest`:

```json
{
  "name": "Trip Planning Agent",
  "description": "Plans multi-city trips end to end",
  "version": "1.0.0",
  "supportedInterfaces": [
    {
      "protocolBinding": "JSONRPC",
      "protocolVersion": "1.0",
      "url": "https://gateway.example.com/default/trip-planning-agent/rpc"
    },
    {
      "protocolBinding": "HTTP+JSON",
      "protocolVersion": "1.0",
      "url": "https://gateway.example.com/default/trip-planning-agent/rest"
    }
  ],
  "capabilities": {
    "streaming": true,
    "extendedAgentCard": true
  },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain"],
  "skills": [
    {
      "id": "plan_trip",
      "name": "Plan a trip",
      "description": "Plans an itinerary for a destination and day count",
      "tags": ["travel"]
    }
  ]
}
```

Replace `gateway.example.com` with the host clients use to reach your gateway. Unlike a rewritten card, a managed card names one fixed host. If you deploy the proxy to several gateways that clients reach on different hosts, use **Passthrough** mode with **Rewrite URLs** turned on instead.

## Check the card clients receive

Fetch the public card through the gateway, and check that each `url` under `supportedInterfaces` names the gateway:

```bash
curl -s "<agent-proxy-url>/.well-known/agent-card.json"
```

Replace *`<agent-proxy-url>`* with the URL on the proxy's **Overview** tab. See [Find the agent proxy URL](configure-proxy.md#find-the-agent-proxy-url).

## Related topics

- [Apply policies to an agent proxy](apply-policies.md): add **Public Agent Card Policies**, and the authentication policy the protected card needs.
- [Agent Card](../../../ai-gateway/next/agent-governance/agent-card.md): how the gateway serves, rewrites, and validates Agent Cards.
