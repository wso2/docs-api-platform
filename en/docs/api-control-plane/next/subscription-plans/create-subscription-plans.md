---
title: "Create and manage subscription plans"
description: "Create subscription plans with request, tool-call, token and custom conditions in the API Control Plane, and edit, deactivate or delete them."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/subscription-plans/create-subscription-plans/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/subscription-plans/create-subscription-plans.md
tags:
  - api-control-plane
  - subscription-plans
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-16
content_type: "how-to"
---

# Create and manage subscription plans

Subscription plans belong to the organization, so every API in it can offer them. You manage them in **Manage** > **Subscription Plans**. For the concepts, see [Subscription plans overview](overview.md).

## Before you begin

You need permission to manage the organization's subscription plans. To create paid plans, set up billing and the meters you want to charge for first.

## View plans

Select **Manage** > **Subscription Plans**. The list shows each plan's:

| Column | What it shows |
|---|---|
| **Name** | The plan name that subscribers see. |
| **Conditions** | One chip for each limit, for example **Requests** `100 / min` or **Tokens** `50,000 / day`. Up to three chips are shown; hover over **+N** to see the rest. A plan with no conditions shows **Unlimited**. |
| **Pricing** | Free, or the plan's price. |
| **Status** | Whether the plan is active. Only active plans can be attached to APIs. |
| **Actions** | Edit or delete the plan. |

Use **Search plans** to filter the list by name.

## Create a plan

1. Select **Manage** > **Subscription Plans**, and then select **Create plan**.
2. Enter the plan details:

    | Field | Description |
    |---|---|
    | **Plan name** | Required. Unique in the organization, for example `Gold`. It can't be changed while the plan is in use. |
    | **Description** | Optional. What subscribers get on this plan, up to 1,023 characters. API Portals show it on the plan card. |

3. Under **Conditions**, select **Add condition**, and then choose a condition type:

    | Type | Description |
    |---|---|
    | **Request count** | Limits how many requests a subscriber makes. |
    | **Tool-call count** | Limits how many MCP tools a subscriber calls. |
    | **Token count** | Limits how many LLM tokens a subscriber uses. |
    | **Custom** | Your own condition, read by a policy you write. |

    A plan can have one condition of each built-in type. A type the plan already has is marked **Added** in the menu.

4. For a built-in condition, set its limits:

    1. Enter the **Count**, and then the **Window length** and **Window unit** (**Minute**, **Hour**, **Day** or **Month**). For example, `100` per `1` `Minute`.
    2. To add another window, select **Add limit**. A condition can have up to ten limits, each of a different length.
    3. Set **Block requests when quota is reached**:
        - **On**: reject requests that exceed the limit with `429`.
        - **Off**: let them through and report them as over quota, so overage can be charged.
    4. For a token count, choose **Tokens counted**: **Total tokens**, **Prompt tokens** or **Completion tokens**.

5. For a custom condition:

    1. Enter the **Condition name**, using lowercase letters, digits and hyphens, for example `region-limit`.
    2. Select **Add value** to add each key-value pair the policy reads, for example `zone` = `eu`.
    3. Optional: under **Custom policy (optional)**, enter the **Policy name** and **Policy version** of the policy that enforces the condition, for example `region-guard` `v1`. If you leave **Policy version** empty, `v1` is used.
        - With a policy named, the console offers to attach that policy whenever the plan is attached to an API, with the policy's `conditionName` parameter set to this condition's name.
        - With no policy named, the console offers nothing for this condition. You attach the policy that enforces it yourself, on the API's **Policies** page.

        For both cases, see [Enforce a custom condition](attach-plans-to-an-api.md#enforce-a-custom-condition).

6. Optional: set the pricing, and an **Expiry date** after which the plan stops accepting subscriptions.
7. Select **Add plan**.

Leave **Conditions** empty for an unlimited plan.

!!! tip "Validation"
    The console checks each field as you type and shows what to fix. Counts and window lengths must be whole numbers of at least 1.

## Edit a plan

1. In **Manage** > **Subscription Plans**, select the plan's **Edit** action.
2. Change the fields, and then select **Save changes**.

Changes reach the connected gateways at once. API Portals get the updated plan the next time an API that offers it is published to them.

When a plan is in use (an API offers it, or a subscriber is on it), the dialog shows **This plan is in use. To change its name or conditions, create a new plan.** The description, pricing, status and expiry can still be changed.

## Activate or deactivate a plan

Use the switch in the **Status** column. An inactive plan can't be attached to more APIs or chosen by new subscribers. APIs that already offer it keep it listed on **Usage Plans** as **Inactive**, so you can detach it once no API Portal selects it for that API.

## Delete a plan

1. Select the plan's **Delete** action.
2. Type the plan name to confirm, and then select **Delete**.

A plan that is in use can't be deleted: clear it on each API Portal that selects it, detach it from every API on **Usage Plans**, and move its subscribers to another plan first. Deleting a plan can't be undone.

## Next steps

- [Attach plans to an API](attach-plans-to-an-api.md)
- [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md)
