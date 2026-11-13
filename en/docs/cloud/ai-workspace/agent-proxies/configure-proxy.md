---
title: "Configure an agent proxy"
description: "Create an agent proxy for an A2A agent in AI Workspace, deploy it to an AI Gateway, and find the URL clients call."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/agent-proxies/configure-proxy/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/agent-proxies/configure-proxy.md
tags:
  - cloud
  - ai-workspace
  - agent-proxies
  - a2a
  - agents
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-19
content_type: "how-to"
---

# Configure an agent proxy

An agent proxy gives an Agent2Agent (A2A) agent an address on the AI Gateway. This guide shows you how to create a proxy for your own agent, deploy it to a gateway, and find the URL clients call.

To try the flow with a sample agent first, see the [Quick start guide](quick-start-guide.md).

## Prerequisites

!!! info "Before you begin"
    - Access to AI Workspace with the **Admin** or **Developer** role.
    - An AI Gateway on release 2026.09.24 or later, registered in AI Workspace and showing a status of **Active**. See [Set up an AI Gateway](../ai-gateways/setting-up.md).
    - An A2A agent that serves protocol version 1.0 and that the gateway can reach over the network.

## Create the agent proxy

1. Navigate to **Agents** > **Agent Proxies** in the left navigation menu.

2. If AI Workspace asks for a project, select it from the **Project** list and click **Go to Project Level**. Every agent proxy belongs to one project.

3. Click **Create Agent Proxy**.

4. In the **Agent URL** field, enter the base URL of your A2A agent, for example `https://agents.example.com/trip-planner`.

5. Click **Fetch Agent Info**.

    AI Workspace requests the agent's Agent Card from `/.well-known/agent-card.json` below the URL you entered. If your agent publishes its card somewhere else, enter the full URL of the card instead. AI Workspace uses any URL that ends in `.json` as is.

    When the fetch succeeds, the agent's name, version, description, and full Agent Card appear beside the form.

    !!! note "If AI Workspace can't reach the agent"
        If the agent is unreachable, or it requires a credential, AI Workspace shows a warning instead of the card. You can still continue and create the proxy.

        AI Workspace and the gateway reach the agent separately. A card that AI Workspace can't fetch doesn't mean the gateway can't reach the agent, and the reverse is also true.

6. Click **Next**.

7. Review the proxy details. AI Workspace fills most of them in from the Agent Card.

    | Field | Required | Description |
    |---|---|---|
    | **Name** | Yes | A display name for the proxy. AI Workspace derives the proxy's ID from the name, in lowercase with hyphens. |
    | **Version** | Yes | The proxy version, in the form `v1.0`. |
    | **Description** | No | A short description of what the agent does. |
    | **Context** | No | The base path the gateway serves the agent on. By default, AI Workspace builds it from the project and the proxy name, for example `/default/trip-planning-agent`. |
    | **Target** | Yes | The URL the gateway forwards requests to. AI Workspace fills this in from the **Agent URL**. |
    | **Transports to Expose** | Yes | The protocol bindings the gateway serves. Select `JSONRPC`, `HTTP+JSON`, or both. |

8. Check the path of each transport you selected.

    Each transport has a path that the gateway adds after the context. AI Workspace selects the bindings that the Agent Card lists, and takes each path from the address the card gives for that binding. Without a card, the defaults are `/rpc` for `JSONRPC` and `/rest` for `HTTP+JSON`.

    The gateway removes only the context before it forwards a request, so the transport path reaches the agent unchanged. Each path must therefore match the path where the agent serves that binding.

    To change a path, follow these steps:

    1. Click the edit icon next to the path.
    2. Enter a path that starts with a forward slash ( / ) and contains no spaces.
    3. Press <kbd>Enter</kbd>.

9. Click **Create**.

AI Workspace creates the proxy and opens its details page. A new proxy forwards the agent's own Agent Card, and the gateway rewrites the addresses in the card so clients send requests back through the gateway. To change this, see [Configure the Agent Card](agent-card.md).

## Deploy the proxy to a gateway

The proxy doesn't serve any traffic until you deploy it to at least one gateway.

1. On the proxy details page, click **Deploy to Gateway**.

    The **Deploy to Gateway** page lists every gateway in your organization, with a status of **Active** or **Not Active**. Use the search field to find a gateway.

2. Click **Deploy** next to the gateway.

3. Expand the gateway card and check **Deployment Status**. A status of **Active** means the gateway accepted the agent proxy.

4. Click **Back to Agent Proxy**.

!!! note "If the deployment fails"
    A gateway that doesn't support agent proxies rejects the deployment. A gateway that never responds leaves the status at **Failed** with the reason `Deployment timed out. Gateway did not respond.` In both cases, check that the gateway is active and runs release 2026.09.24 or later.

A deployment is a snapshot of the proxy. If you change the proxy afterward, the gateway keeps serving the earlier version until you deploy again.

### Stop, redeploy, or restore a deployment

Use the gateway card on the **Deploy to Gateway** page:

- **Stop**: Click **Stop** to remove the proxy from that gateway. The gateway stops serving the agent immediately, without a confirmation step.
- **Redeploy**: To deploy the proxy again after you stop it, click **Redeploy**. If a deployment failed, click **Re-deploy** instead.
- **Restore**: To go back to an earlier deployment, click the edit icon on the gateway card. In **Select Deployment to Restore**, select the deployment and click **Restore**.

The **API Deployment History** panel lists earlier deployments of the proxy.

## Find the agent proxy URL

After you deploy the proxy, its **Overview** tab shows the URL clients use.

1. On the proxy details page, open the **Overview** tab.

2. Under **Agent Proxy URL**, select a gateway from the **Gateways** list. The list shows only the gateways the proxy is deployed to.

3. Copy the **URL**.

The URL is the gateway address followed by the context. Clients add a path to it for what they want to reach:

| To reach | Path to add | Example |
|---|---|---|
| The public Agent Card | `/.well-known/agent-card.json` | `https://gateway.example.com/default/trip-planning-agent/.well-known/agent-card.json` |
| The `JSONRPC` binding | The `JSONRPC` transport path | `https://gateway.example.com/default/trip-planning-agent/rpc` |
| The `HTTP+JSON` binding | The `HTTP+JSON` transport path, then the operation path | `https://gateway.example.com/default/trip-planning-agent/rest/message:send` |

Most clients only need the Agent Card URL. The card that the gateway returns lists the binding addresses, so a client configured from the card finds them on its own.

To check that the gateway serves the agent, fetch the Agent Card through it:

```bash
curl -s "https://gateway.example.com/default/trip-planning-agent/.well-known/agent-card.json"
```

Replace the URL with your agent proxy URL. Every request that calls an A2A operation must also state the protocol version, in an `A2A-Version: 1.0` header or an `A2A-Version` query parameter. The gateway returns `400 Bad Request` for a request that doesn't. Agent Card requests don't need it.

## Next steps

- [Configure the Agent Card](agent-card.md): choose whether the gateway forwards the agent's card or serves one you write.
- [Apply policies to an agent proxy](apply-policies.md): require authentication, or add rate limits, before clients call the agent.
- [Manage an agent proxy](manage-proxy.md): issue API keys, edit, and delete the proxy.
