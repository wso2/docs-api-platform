---
title: "Configure subscription plans in the API Portal & MCP Hub"
description: "Define the plans subscribers can choose, with request, tool-call, token and custom conditions, and attach them to your published APIs."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/admin-settings/subscription-plans/
md_url: https://wso2.com/api-platform/docs/api-portal/next/admin-settings/subscription-plans.md
tags:
  - cloud
  - api-portal
  - subscription-plans
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-16
content_type: "how-to"
---

# Subscription plans

A **subscription plan** is a named usage tier, such as *Bronze*, *Gold* or *Platinum*, that developers choose when they subscribe to an API or MCP server. A plan's **conditions** say how much a subscriber can use: how many requests, MCP tool calls or LLM tokens in each time window. You attach one or more plans to each API you publish.

Plans created in the API Control Plane appear here when an API that offers them is published to the portal. Plans created here are sent to the control plane.

## View plans

Navigate to **Settings** and select the **Subscription Plans** tab under **ORGANIZATION**. Each row shows the plan's name, a one-line description, its conditions and its pricing.

- Conditions show one chip per limit, for example **Requests** `100 / min` or **Tokens** `50,000 / day`. Up to two chips are shown; hover over **+N** to see the rest.
- A plan with no conditions shows **Unlimited**.
- A description that doesn't fit is cut with "…"; hover over it to read all of it.

## Add a plan

1. In **Settings** > **Subscription Plans**, click **+ Add plan**. The **Add subscription plan** page opens.
2. Under **Details**, fill in:

    | Field | Description |
    |---|---|
    | **Name** | Required. The name shown to developers on the plan card, for example `Gold`. |
    | **Description** | Optional. What subscribers get on this plan. Developers see it on the plan card. |
    | **External reference ID** | Optional universally unique identifier (UUID) linking this plan to an external billing or quota system. It has no effect inside the portal. |

3. Under **Conditions**, choose a condition type. To add more, click **+ Add condition**.

    | Condition | Description |
    |---|---|
    | **Request count** | Limits how many requests a subscriber makes. |
    | **Tool-call count** | Limits how many MCP tools a subscriber calls. |
    | **Token count** | Limits how many LLM tokens a subscriber uses. |
    | **Custom** | Your own condition, read by a policy you write. |

    A plan can have one condition of each built-in type; one that is already in the plan is marked **Added**. Leave **Conditions** empty for an unlimited plan.

4. Click a condition to open it, and set its limits:

    - Enter the count and its window, for example `100` per `1` **Minute**. Windows are in minutes, hours, days or months. A month is counted as 30 days.
    - Click **+ Add limit** for another window, for example `5000` per `1` **Day**. A condition has one to ten limits, and no two can cover the same length of time.
    - Turn **Block requests when quota is reached** on to reject requests over the limit with `429`. Turn it off to let them through and count them as overage, which can then be charged.
    - For a token count, choose **Tokens counted**: total, prompt or completion tokens.

5. For a custom condition, enter:

    - **Condition name**: lowercase letters, digits and hyphens, for example `region-limit`.
    - The key-value pairs the policy reads, for example `zone` = `eu`.
    - Optional: **Custom policy (optional)**, the name and version of the policy that enforces the condition, for example `region-guard` `v1`. It must be attached to the API to take effect.

6. Under **Pricing**, keep the plan free, or turn on **Paid plan** to charge for it. See [Pricing](#pricing).
7. Click **Add plan**.

!!! note
    A condition takes effect on an API only where the policy that enforces it is attached to the API on the gateway. See [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md).

### Identifiers

A plan carries three separate identifiers:

- **Plan handle**: the id used in Management API paths and in the `subscriptionPlans` references on an API. Supply it as `id` when creating a plan through the [Management API](../rest-api/subscription-plans.md). Plans created in this form get a generated UUID as their handle.
- **Database UUID**: the portal's own internal key. It is never exposed in the API.
- **External reference ID**: the optional link to a billing or quota system, set in the form.

### Pricing

A paid plan is priced at a **Flat rate** or **Usage based**, in the currency you choose, and charged every month or year. A usage-based price names a meter and a pricing model: **Per unit**, **Volume tiers** or **Graduated tiers**. To charge for usage, add a meter first.

Pricing can't be changed once the plan is created. To create a paid plan, set up billing first.

## Edit or delete a plan

Click a plan's name or the pencil icon to edit it, and then click **Save changes**. Saving with conditions replaces all of the plan's conditions.

Click the trash icon to delete a plan. A plan that an API offers, or that has subscriptions, is in use and can't be deleted. Deleting can't be undone.

## Attach plans to an API

Subscription plans aren't available on every API automatically. When creating or editing an API in [Manage APIs](manage-apis.md), select which plans apply under **Applicable Subscription Plans**. If no plans are attached, the API is accessible without a subscription plan.

APIs published from the API Control Plane bring the plans their publisher chose. See [Attach subscription plans to an API](../../../api-control-plane/next/subscription-plans/attach-plans-to-an-api.md).

## Plans created before conditions

Plans saved by earlier releases keep working after the upgrade:

| Earlier limit | Shown as |
|---|---|
| Request limits | A **Request count** condition, with each limit as a window, shortest first |
| A total token limit | A **Token count** condition counting total tokens |
| Event or bandwidth limits | Not shown. They stay stored as they are. |

Editing only a plan's name or description leaves it stored as it was. Saving its conditions or limits moves it to conditions, and keeps its event and bandwidth limits stored.

!!! warning "PostgreSQL and SQL Server"
    Before you start the new portal, re-run `schema.postgres.sql` or `schema.sqlserver.sql` on its database. The scripts are safe to run again. Until then, plans keep their request and total token limits, and other conditions are refused with `503`. For more information, see [Upgrade plans created before conditions](../../../api-control-plane/next/subscription-plans/upgrade-existing-plans.md).
