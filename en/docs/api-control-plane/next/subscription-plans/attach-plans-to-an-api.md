---
title: "Attach subscription plans to an API"
description: "Choose the subscription plans an API offers on the Usage Plans page, attach the policies that enforce them, and choose which plans each API Portal lists."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/subscription-plans/attach-plans-to-an-api/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/subscription-plans/attach-plans-to-an-api.md
tags:
  - api-control-plane
  - subscription-plans
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-16
content_type: "how-to"
---

# Attach subscription plans to an API

An API offers subscription plans in two places:

| Where | What you do |
|---|---|
| API > **Develop** > **Usage Plans** | Choose the plans the API offers, and attach the policies that enforce them. |
| API > **Publish** > **Configure & Publish** > **Subscription Plans** | Choose which of those plans each API Portal lists. |

Usage Plans is available for REST and GraphQL APIs.

## Before you begin

- Create the plans in **Manage** > **Subscription Plans**. See [Create and manage subscription plans](create-subscription-plans.md).
- You need permission to update the API. Without it, or when the API is managed by a gateway, Usage Plans is read-only.

## The Usage Plans page

Open the API, and then select **Develop** > **Usage Plans**. The page lists the organization's active plans in a table:

| Column | What it shows |
|---|---|
| (checkbox) | Selected when the API offers the plan. |
| **Plan** | The plan name. A plan made inactive after it was attached is marked **Inactive**, so that you can detach it. |
| **Description** | The plan's description on one line; hover over it to read all of it. |
| **Conditions** | One chip per limit, for example **Requests** `100 / min`. Hover over **+N** for the rest. A plan with no conditions shows **Unlimited**. |
| **Pricing** | Free, or the plan's price. |

Above the table, a summary shows how many plans are attached, for example **2 of 5 plans attached**. Plans deleted since they were attached are not shown.

If no active plans exist, the page shows **No subscription plans**, with a pointer to **Manage** > **Subscription Plans**.

## Attach plans

1. Select the checkbox of each plan the API should offer. To select every plan, select the checkbox in the table header (**Attach all plans**).

2. If the plans need policies the API doesn't have yet, the **Attach required policies?** dialog lists each one with its Policy Hub name, identifier and version, for example **Subscription Validation**, `subscription-validation`, `v1`:

    - Select **Attach policies** to add them to the API's global policies. `subscription-validation` is placed first, because the other subscription policies read what it records.
    - Select **Skip** to attach the plans without them. You can add the policies later on **Develop** > **Policies**.

    After you attach them, the page confirms: **Policies attached. Save and deploy the API to apply them.**

3. In the bar that appears at the bottom of the page, which shows the number of unsaved changes (for example **1 unsaved change**), select **Save changes**. To undo your changes instead, select **Discard**.

    The plans and policies are saved together, and the page shows **Usage plans saved. Deploy the API to apply them on the gateway.**

4. Redeploy the API to its gateways, so that they get the new plans and policies. For a GraphQL API, see [Deploy a GraphQL API](../graphql-apis/deploy-graphql-api.md).

!!! note
    Nothing is deployed automatically. Until you redeploy the API, the gateway keeps its previous plans and policies.

### Which policies a plan needs

| Plan condition | Policy offered |
|---|---|
| Any plan, including one with no conditions (unlimited) | `subscription-validation`, which checks that the caller has an active subscription |
| Request count | `subscription-validation`. Version 1 enforces only one window of the condition: its first one-unit window, such as *per 1 minute*. If no window is one unit long, it uses the first window counted per one unit, so *1,000 per 2 hours* is enforced as *1,000 per hour*. To enforce every window, use `subscription-validation` v2 with `subscription-request-ratelimit`; see [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md#migrate-from-subscription-validation-v1). |
| Custom condition that names its policy | That policy, at the version given in the plan |
| Tool-call count, token count | None. A REST or GraphQL API never sees MCP tool calls or LLM token counts, so these conditions don't apply to it. |

A policy that several plans need is attached once. Two major versions of the same policy, such as `region-guard` v1 and v2, are both attached.

For the policies that enforce every window and every kind of condition, see [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md).

### When subscription-validation is on the API's resources

If `subscription-validation` is attached to the API's resources (operations) rather than to the whole API:

- When **every** resource has it, configured the same way, it moves to the API level with the same version and parameters, rather than being added a second time. The **Attach required policies?** dialog marks it **Moved from the API's resources to the API**.
- When only **some** resources have it, or they configure it differently, nothing is attached. The **Attach the policies on the Policies page** dialog explains why. Select **OK**: the plans stay selected, and you attach the policies on **Develop** > **Policies**, to the resources that have `subscription-validation`.

### Policies that are still missing

While an attached plan needs a policy that the API doesn't have, the page shows the warning **You have not yet attached the following required policies:** with the list. A condition doesn't limit requests until its policy is attached and the API is redeployed.

## Detach plans

1. Clear the checkbox of each plan the API should no longer offer. To clear every plan, clear the checkbox in the table header (**Detach all plans**).
2. If no remaining plan needs some of the API's subscription policies, the **Remove unused policies?** dialog lists them:
    - Select **Remove policies** to remove them from the API's global policies when you save.
    - Select **Keep** to leave them on the API.
3. Select **Save changes**, and then redeploy the API.

## Choose the plans each API Portal lists

1. Open the API, and then select **Publish**. The page lists the API Portals you can publish to.
2. On the portal's card, select **Configure & Publish**. For an API not yet on that portal, the card has a split button: select the arrow, choose **Configure & Publish**, and then select the button. The publish page for that portal opens.
3. Select the **Subscription Plans** tab. It lists only the plans attached on **Usage Plans**, each with its name and description, and a summary such as **0 of 2 plans selected**.

    If no plans are attached, the tab shows **No usage plans attached**, with **Attach plans in Develop › Usage Plans**.

4. Select the plans that this API Portal should offer, or **Select all**.
5. Select **Save Draft** to keep the selection, or **Publish** (**Republish** for an API already on the portal) to make it live.

A plan that the portal still lists but that is no longer attached to the API stays in the tab, selected, so that you can clear it. It stays listed after you clear it until you save the draft, so that you can undo the change.

## Next steps

- [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md)
- [Upgrade plans created before conditions](upgrade-existing-plans.md)
