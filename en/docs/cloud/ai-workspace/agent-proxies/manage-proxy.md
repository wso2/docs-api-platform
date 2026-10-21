---
title: "Manage an agent proxy"
description: "Edit an agent proxy's details and transports, issue and delete API keys, and delete a proxy in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/agent-proxies/manage-proxy/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/agent-proxies/manage-proxy.md
tags:
  - cloud
  - ai-workspace
  - agent-proxies
  - a2a
  - api-keys
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-19
content_type: "how-to"
---

# Manage an agent proxy

After you create an agent proxy, you manage it from its details page in AI Workspace. This guide covers editing the proxy, issuing API keys to the clients that call it, and deleting it.

## Open the proxy details page

1. Navigate to **Agents** > **Agent Proxies** in the left navigation menu.

    The list shows each proxy's name, description, context, version, and when it was last updated. Use the search field to filter the list.

2. Click a proxy name to open its details page.

The top of the page shows the proxy name, its version, its context, and when it was last updated. The **Deploy to Gateway** button and a delete icon are in the top-right corner.

The page has four tabs:

| Tab | What you configure there |
|---|---|
| **Overview** | The transports the gateway exposes, the proxy URL, and API keys. |
| **Agent Card** | How the gateway serves the public and protected Agent Cards. See [Configure the Agent Card](agent-card.md). |
| **Guardrails & Policies** | The policies the gateway applies. See [Apply policies to an agent proxy](apply-policies.md). |
| **Backend Connection** | The agent's URL and the credential the gateway sends to it. |

When you change a setting on any tab, a bar at the bottom of the page shows **You have unsaved changes.** Click **Save** to keep your changes, or **Cancel** to discard them.

!!! info "Deploy after you save"
    Saving updates the proxy in AI Workspace only. The gateway keeps serving the deployed version until you [deploy the proxy again](configure-proxy.md#deploy-the-proxy-to-a-gateway).

## Edit the proxy details

1. On the proxy details page, click the edit icon next to the proxy name.

2. Change any of the following fields:

    | Field | Description |
    |---|---|
    | **Name** | The display name, up to 128 characters. Changing it doesn't change the proxy's ID. |
    | **Description** | A description of up to 1,023 characters. |
    | **Context** | The base path the gateway serves the agent on, up to 200 characters. |

3. Click **Update**.

If you change the context, deploy the proxy again. Until you do, the gateway keeps serving the agent at the old path. Clients that use the old URL need the new one.

You can't change a proxy's version. To serve a new version, create a separate proxy.

## Change the transports

1. Open the **Overview** tab.
2. Select or clear the `JSONRPC` and `HTTP+JSON` transports. At least one must stay selected.
3. To change a transport's path, click the edit icon next to it, enter the new path, and press <kbd>Enter</kbd>.
4. Click **Save**, then deploy the proxy again.

If the public Agent Card is in **Managed** mode, update its `supportedInterfaces` to match the new transports. Otherwise, the gateway rejects the deployment. See [Serve a card you write](agent-card.md#serve-a-card-you-write).

## Manage API keys

API keys let you identify the clients that call the agent, and cut off one client without affecting the others. The **API Keys** section appears on the **Overview** tab after you deploy the proxy to a gateway.

The gateway checks API keys only when the proxy has the **API Key Auth** policy. If the policy isn't attached, the **API Keys** section says so, and any client can call the agent without a key. To attach it, see [Add a policy to every operation](apply-policies.md#add-a-policy-to-every-operation).

### Generate an API key

1. On the **Overview** tab, under **API Keys**, click **Generate API Key**.
2. Enter a **Key Name**, for example `production-key`.
3. Click **Generate**.
4. Copy the key, and store it somewhere secure.
5. Click **Done**.

!!! danger "Copy the key before you close the dialog"
    AI Workspace shows the key only once. If you lose it, delete the key and generate a new one.

Each key is valid for 90 days. The **Expires At** column shows when each key stops working. AI Workspace sends new keys to every gateway the proxy is deployed to.

### Call the agent with a key

Clients send the key in the header that the **API Key Auth** policy names, which is `API-Key` unless you changed it. Every operation request also needs the `A2A-Version` header:

```bash
curl -s -X POST "<agent-proxy-url>/rest/message:send" \
  -H 'Content-Type: application/json' \
  -H 'A2A-Version: 1.0' \
  -H "API-Key: $API_KEY" \
  -d '{"message":{"messageId":"m1","role":"ROLE_USER",
       "parts":[{"text":"Plan a 2 day trip to Galle"}]}}'
```

Replace *`<agent-proxy-url>`* with the URL on the **Overview** tab, and *`/rest`* with the path of your `HTTP+JSON` transport. A request without a valid key receives `401 Unauthorized`.

The public Agent Card doesn't need a key, so clients can still discover the agent.

### Delete an API key

1. In the **API Keys** table, click the delete icon next to the key.
2. Click **Delete** to confirm.

Gateways stop accepting the key. Use a separate key for each client, so you can delete one without interrupting the others.

## Delete an agent proxy

1. On the proxy details page, click the delete icon in the top-right corner. You can also click the delete icon next to the proxy in the **Agent Proxies** list.
2. Click **Delete** to confirm.

!!! warning
    Deleting a proxy can't be undone. Clients that call the agent through the proxy stop reaching it.

## Related topics

- [Configure an agent proxy](configure-proxy.md): create a proxy and deploy it.
- [Configure the Agent Card](agent-card.md): choose how the gateway serves the agent's card.
- [Apply policies to an agent proxy](apply-policies.md): control who calls the agent and how.
