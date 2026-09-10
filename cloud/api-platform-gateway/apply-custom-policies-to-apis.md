---
title: "Apply custom policies to APIs"
description: "Sync a custom policy from your Self-Hosted Gateway to your organization and apply it to API proxies."
canonical_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/apply-custom-policies-to-apis/
md_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/apply-custom-policies-to-apis.md
tags:
  - cloud
  - api-gateway
  - self-hosted
  - custom-policy
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Apply Custom Policies to APIs

After [building the gateway with your custom policies](build-gateway-with-custom-policies.md) and starting it, the gateway automatically sends its policy manifest to the control plane on connection. You can then sync your custom policies to the organization and apply them to your APIs.

## Step 1: View the Gateway Policies

1. Sign in to [API Platform Console](https://console.bijira.dev).
2. Go to **Organization Level** in API Platform.
3. From the left navigation, select **Admin** → **Gateways**.
4. Select your gateway to open the gateway detail view.
5. Click the **Policies** tab.

!!! note
    Each time the gateway connects to the control plane, it automatically sends an updated manifest with the latest policy details. The Policies tab always reflects the most recent manifest received.

The console fetches the manifest from the gateway and displays a table of all policies installed on it, with the following columns:

| Column | Description |
|---|---|
| **Name** | Policy name |
| **Version** | Installed version |
| **Description** | Policy description |
| **Policy Type** | `Policy Hub` for policy hub managed policies, `Custom` for your own policies |
| **Sync Status** | Whether the policy is synced to the organization — shows a **Sync** button if not yet synced or a newer version is available, or **Latest Version Available** if already up to date |

![Policy list with Custom type showing Sync button in the Sync Status column](../../assets/img/api-platform-gateway/gateway/sync-option.png)

## Step 2: Sync the Custom Policy to the Organization

Custom policies must be synced to the organization before they can be applied to APIs.

In the **Sync Status** column, each custom policy shows one of the following:

- **Sync button** — the policy has not been synced yet, or a newer version is available. Click **Sync** to register it in the organization.
- **Latest Version Available** — the policy is already synced and up to date. No action needed.

!!! note
    Policy Hub policies (managed by WSO2) show **N/A** in the Sync Status column and cannot be synced manually.

Once synced, the custom policy is available organization-wide and can be applied to APIs.

![Policy list showing Custom type with Latest Version Available status in Sync Status column](../../assets/img/api-platform-gateway/gateway/synced-policy.png)

!!! note
    - Each major version of a custom policy is maintained as a separate policy entry with the same name.
    - A minor version update re-enables the Sync button, allowing the newer version to be synced to the organization.
    - Patch version updates are not supported.
    - Version downgrades are not allowed.

## Step 3: View Organization-Level Custom Policies

After syncing, the custom policy appears in the **Custom Policies** section on the main Gateways page. To view it:

1. From the left navigation, select **Admin** → **Gateways**.
2. Select the **API Platform** tab to ensure the Hybrid Gateways view is active.
3. Scroll down to the **Custom Policies** section below the gateway list.

This section lists all custom policies available in the organization with the following details:

| Column | Description |
|---|---|
| **Name** | Policy name |
| **Version** | Synced version |
| **Description** | Policy description |
| **Created At** | Date and time the policy was first synced |
| **Updated At** | Date and time the policy was last updated |

!!! note
    To delete a synced custom policy, none of the APIs in the organization should be using it.

## Step 4: Apply the Custom Policy to an API

After syncing, the custom policy appears in the policy list when configuring an API proxy. To apply it:

1. Navigate to your API proxy.
2. Go to the **Policies** page.
3. Select your custom policy from the available policies and configure it.
4. Deploy the API.

For detailed instructions on attaching and configuring policies on an API, see [Adding and Managing Policies](manage-policies.md).

## What's Next?

- [Publish APIs Overview](publish-apis/overview.md): Learn about publishing APIs on the self-hosted gateway
- [Subscription Based APIs](publish-apis/subscription-based-apis.md): Publish APIs with subscription-based access control
- [Subscription Less APIs](publish-apis/subscription-less-apis.md): Publish APIs without subscription requirements
- [Lifecycle Management](publish-apis/lifecycle-management.md): Manage the lifecycle of your published APIs