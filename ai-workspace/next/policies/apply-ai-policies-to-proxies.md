---
title: "Apply AI policies to LLM providers, App LLM proxies, and MCP proxies"
description: "Sync a custom AI policy from your AI Gateway to your organization and apply it to LLM providers, App LLM proxies, and MCP proxies."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/policies/apply-ai-policies-to-proxies/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/policies/apply-ai-policies-to-proxies.md
tags:
  - cloud
  - ai-workspace
  - custom-policy
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Apply AI policies to proxies

After [building the AI Gateway with your custom AI policy](build-gateway-with-ai-policies.md) and starting it, the gateway automatically sends its policy manifest to the control plane on connection. You can then sync your custom AI policy to the organization and apply it to your LLM providers, App LLM proxies, and MCP proxies.

## Step 1: View the gateway policies

1. Go to your AI Workspace.
2. From the left navigation, select **AI Gateways**.
3. Select your gateway to open the gateway detail view.
4. Click the **Policies** tab.

!!! note
    Each time the gateway connects to the control plane, it sends an updated manifest with its policy details. The Policies tab always reflects the most recent manifest received.

The console fetches the manifest from the gateway and displays a table of all policies installed on it, with the following columns:

| Column | Description |
|---|---|
| **Name** | Policy name |
| **Version** | Installed version |
| **Description** | Policy description |
| **Policy Type** | `Policy Hub` for policy hub managed policies, `Custom` for your own AI policies |
| **Sync Status** | Whether the policy is synced to the organization — shows a **Sync** button when the policy is unsynced or a later version is available, or **Latest Version Available**/**N/A** if already up to date |

![AI Gateway detail page showing the Policies tab with a table of installed policies, their Policy Type, and Sync Status](../../../assets/img/custom-policies/ViewGatewayPolicies.svg)

## Step 2: Sync the custom AI policy to the organization

Sync a custom AI policy to the organization before you apply it to an LLM provider, App LLM proxy, or MCP proxy.

In the **Sync Status** column, each custom AI policy shows one of the following:

- **Sync button** — the policy is unsynced, or a later version is available. Click **Sync** to register it in the organization.
- **Latest Version Available** — the policy is already synced and up to date. No action needed.

!!! note
    Policy Hub policies, which WSO2 manages, show **N/A** in the Sync Status column and can't be synced manually.

Once synced, the custom AI policy is available organization-wide and can be applied to LLM providers, App LLM proxies, and MCP proxies.

![Policies tab after syncing, showing the Sensitive Data Mask custom policy with Policy Type Custom and Sync Status Latest Version Available](../../../assets/img/custom-policies/SyncCustomPolicy.png)

!!! note
    - Each major version of a custom AI policy is maintained as a separate policy entry with the same name.
    - A minor version update re-enables the Sync button, so you can sync the later version to the organization.
    - Patch version updates aren't supported.
    - Version downgrades aren't allowed.

## Step 3: View organization-level custom policies

After syncing, the custom AI policy appears in **Settings > Custom Policies**. To view it:

1. From the left navigation, select **Settings**.
2. Select **Custom Policies**.

This section lists all custom AI policies available in the organization with the following details:

| Column | Description |
|---|---|
| **Name** | Policy name |
| **Version** | Synced version |
| **Description** | Policy description |
| **Created At** | Date and time the policy was first synced |
| **Updated At** | Date and time the policy was last updated |

![Settings > Custom Policies page listing the synced sensitive-data-mask policy with its version, description, and timestamps](../../../assets/img/custom-policies/ShowinCustomPolicySection.png)

!!! note
    To delete a synced custom AI policy, none of the LLM providers, App LLM proxies, or MCP proxies in the organization should be using it.

## Step 4: Apply the custom AI policy

Once synced, a custom AI policy is attached the same way for LLM providers, App LLM proxies, and MCP proxies — it appears alongside the built-in guardrails and policies wherever policies are configured for that resource:

1. Navigate to **AI Workspace** and open the **LLM Providers**, **App LLM Proxies**, or **MCP Proxies** list, then click on the resource you want to configure.
2. Go to the **Guardrails & Policies** tab (MCP proxies use a **Policies** tab).
3. Click **+ Add Guardrail** / **+ Add Policy** in the section for the scope you want:
    - **Global Guardrails**/**Global Policies** — applies to every endpoint or capability of the resource.
    - A specific endpoint or capability card (expand it first) — applies only there.
4. Select your custom AI policy from the sidebar — it's listed alongside the built-in policies — and configure its parameters.
5. Click **Add**/**Submit** to attach it, then deploy or redeploy the resource to the gateway to apply the changes.

![Guardrails & Policies sidebar showing the synced custom policy listed alongside built-in policies](../../../assets/img/custom-policies/SyncedCustomPolicyinPoliciesSection.svg)

For more detail on the global and per-resource scopes, see [Policy scope: global or per resource](overview.md#policy-scope-global-or-per-resource).

## Next steps

- [LLM providers overview](../llm-providers/overview.md): configure LLM providers
- [App LLM proxies overview](../llm-proxies/overview.md): configure App LLM proxies for GenAI applications and agents
- [MCP proxies overview](../mcp-proxies/overview.md): configure MCP proxies
- [Policies overview](overview.md): explore the built-in guardrails available alongside your custom AI policies