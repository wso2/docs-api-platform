---
title: "Apply policies to an agent proxy"
description: "Attach policies to every A2A operation, to one operation, or to the public Agent Card of an agent proxy, and control the order they run in."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/agent-proxies/apply-policies/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/agent-proxies/apply-policies.md
tags:
  - ai-workspace
  - agent-proxies
  - a2a
  - policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-19
content_type: "how-to"
---

# Apply policies to an agent proxy

Policies control how the AI Gateway handles requests to an agent proxy, for example by requiring an API key or limiting how often clients call the agent. You attach them on the proxy's **Guardrails & Policies** tab.

The gateway identifies the Agent2Agent (A2A) operation behind each request before it runs any policy. So you can target one operation, such as `CancelTask`, and the same policies run whether the client uses the `JSONRPC` or the `HTTP+JSON` binding.

## Where you can attach a policy

The **Guardrails & Policies** tab has three sections. The section you add a policy to decides which requests it applies to:

| Section | Applies to |
|---|---|
| **Global Operation Policies** | Every A2A operation. |
| **Operation-wise Policies** | One operation that you choose. These policies run after the global policies. |
| **Public Agent Card Policies** | Requests for the public Agent Card only. |

Operation policies and card policies don't overlap. A global policy doesn't run when a client reads the public Agent Card, and a card policy doesn't run for any operation. To apply a policy to both, add it to both sections.

For the protected Agent Card, the `GetExtendedAgentCard` operation runs the global policies and any policies you add for that operation.

## Add a policy to every operation

Use **Global Operation Policies** for anything every request needs, such as authentication.

1. Navigate to **Agents** > **Agent Proxies**, and click the proxy name to open its details page.
2. Open the **Guardrails & Policies** tab.
3. Under **Global Operation Policies**, click **Add Policy**.
4. In the **Policies** panel, find the policy and click it.

    The list starts filtered to the **AI** category. If you don't see the policy you want, change the **Categories** selection, or clear it to show every category. You can also search by name.

5. Fill in the policy's parameters, and click **Add**.
6. Click **Save**.
7. [Deploy the proxy again](configure-proxy.md#deploy-the-proxy-to-a-gateway), so the gateway applies the change.

Policies run in the order they appear. To change the order, drag a policy to a new position, then click **Save**.

## Add a policy to one operation

Use **Operation-wise Policies** when one operation needs more than the rest, for example a rate limit on streaming messages only.

1. On the **Guardrails & Policies** tab, under **Operation-wise Policies**, select an operation from the **Add operation** list.
2. In the box for that operation, click **Add Policy**.
3. Select the policy, fill in its parameters, and click **Add**.
4. Click **Save**, and deploy the proxy again.

To remove an operation and all of its policies, click the remove icon on the operation's box.

!!! important "Listing an operation doesn't restrict the agent"
    Adding an operation here only adds policies to it. Operations you don't list still serve traffic and still run the global policies. To block an operation, attach a policy that denies it.

The gateway adds operation policies after the global policies without removing duplicates. A policy that you add in both places runs twice for that operation.

### A2A operations

You can add policies to the following A2A 1.0 operations:

| Operation | What it does |
|---|---|
| `SendMessage` | Sends a message to the agent and returns a task or a message. |
| `SendStreamingMessage` | Sends a message and streams the agent's updates back. |
| `GetTask` | Returns the current state of a task. |
| `ListTasks` | Lists tasks. |
| `CancelTask` | Cancels a running task. |
| `SubscribeToTask` | Streams updates for a task that's already running. |
| `CreateTaskPushNotificationConfig` | Registers a URL that the agent calls when a task changes. |
| `GetTaskPushNotificationConfig` | Returns one push notification configuration. |
| `ListTaskPushNotificationConfigs` | Lists a task's push notification configurations. |
| `DeleteTaskPushNotificationConfig` | Removes a push notification configuration. |
| `GetExtendedAgentCard` | Returns the protected Agent Card to an authenticated caller. |

For the gateway path of each operation on each binding, see [Expose an agent](../../../ai-gateway/next/agent-governance/expose-an-agent.md#a2a-operations-and-their-gateway-paths).

## Add a policy to the public Agent Card

Use **Public Agent Card Policies** for rules on card requests, such as cross-origin resource sharing (CORS) headers or a rate limit. Add a policy here the same way as in the other sections, then save and deploy again.

Don't add authentication policies to this section. Clients read the public card to discover the agent before they hold any credential, so the gateway serves the card without authentication. To give authenticated callers more detail, use the protected card instead. See [Configure the Agent Card](agent-card.md).

## Edit or remove a policy

- **To edit a policy**, click it, change its parameters, and click **Update**.
- **To remove a policy**, click the remove icon on the policy.

AI Workspace doesn't keep these changes until you click **Save**. The gateway keeps applying the deployed policies until you deploy the proxy again.

## Common policies for agents

The following policies are often attached to agent proxies. Each policy's parameters are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub/).

| Policy | What it does | Typical section |
|---|---|---|
| [API Key Auth](https://wso2.com/api-platform/policy-hub/policies/api-key-auth) | Accepts only requests that carry a valid API key. | **Global Operation Policies** |
| [JWT Auth](https://wso2.com/api-platform/policy-hub/policies/jwt-auth) | Validates JSON Web Token (JWT) access tokens, and can require scopes for one operation. | **Global Operation Policies**, or **Operation-wise Policies** for extra scopes |
| [Basic Auth](https://wso2.com/api-platform/policy-hub/policies/basic-auth) | Enforces HTTP Basic authentication. | **Global Operation Policies** |
| [Opaque Token Auth](https://wso2.com/api-platform/policy-hub/policies/opaque-token-auth) | Validates opaque OAuth 2.0 tokens through token introspection. | **Global Operation Policies** |

Not every policy in the Policy Hub supports agent traffic. Check a policy's entry in the [Policy Hub](https://wso2.com/api-platform/policy-hub/) before you attach it.

An authentication policy in **Global Operation Policies** also makes the protected Agent Card reachable. Without one, the gateway answers every request for the protected card with `401 Unauthorized`.

To issue API keys after you attach **API Key Auth**, see [Manage API keys](manage-proxy.md#manage-api-keys).

## Related topics

- [Configure the Agent Card](agent-card.md): how the public and protected cards differ.
- [Apply policies to an agent](../../../ai-gateway/next/agent-governance/apply-policies.md): how the gateway orders policies for each operation.
- [Policies overview](../policies/overview.md): the policies available across AI Workspace.
