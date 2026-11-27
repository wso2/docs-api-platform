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

Open the API, and then select **Develop** > **Usage Plans**. Beside the **Usage Plans** heading, a summary shows how many plans are attached, for example **2 of 5 plans attached**. If the attached plans need policies that the API doesn't have yet, a warning under the heading lists them (see [Policies that are still missing](#policies-that-are-still-missing)).

The page lists the organization's active plans in a table:

| Column | What it shows |
|---|---|
| (checkbox) | Selected when the API offers the plan. The checkbox is unavailable for a plan that an API Portal selects for this API; see [Detach plans](#detach-plans). |
| **Plan** | The plan name. A long name is cut short; hover over it to read all of it. A plan made inactive after it was attached is marked **Inactive**, so that you can detach it. |
| **Description** | The plan's description on one line. A long description is cut short; hover over it to read all of it. |
| **Conditions** | One chip per limit, for example **Requests** `100 / min`. Hover over **+N** for the rest. A plan with no conditions shows **Unlimited**. |
| **Pricing** | Free, or the plan's price. |

Plans deleted since they were attached are not shown.

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
| Any plan, including one with no conditions (unlimited) | `subscription-validation`, which checks that the caller has an active subscription. If the API has none, the console attaches v1, or v2 when the plans also need a custom condition's policy: only v2 passes the plan's conditions to the policies after it. If the API already has a version, the console keeps it. |
| Request count, with `subscription-validation` v1 | `subscription-validation`. Version 1 enforces only one window of the condition: its first one-unit window, such as *per 1 minute*. If no window is one unit long, it uses the first window counted per one unit, so *1,000 per 2 hours* is enforced as *1,000 per hour*. |
| Request count, with `subscription-validation` v2 | `subscription-request-ratelimit`, which enforces every window. When the console attaches v2 for a custom condition's policy, it offers this policy in the same dialog. v2 enforces no limit itself, so this policy is mandatory for plans with request limits: until it is attached, the page lists it under **You have not yet attached the following required policies:**, and selecting such a plan offers it. To move an API from v1 to v2, change the version on **Develop** > **Policies**; see [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md#migrate-from-subscription-validation-v1). Unlimited plans need only `subscription-validation`. |
| Custom condition that names its policy | That policy, at the version given in the plan |
| Custom condition that names no policy | None. The console shows nothing for it: you attach its policy yourself. See [Enforce a custom condition](#enforce-a-custom-condition). |
| Tool-call count, token count | None. A REST or GraphQL API never sees MCP tool calls or LLM token counts, so these conditions don't apply to it. |

A policy that several plans need is attached once. Two major versions of the same policy, such as `region-guard` v1 and v2, are both attached.

### Enforce a custom condition

The gateway doesn't enforce a custom condition itself. A custom policy that you write and add to the gateway reads the condition and enforces it.

Before you start:

- Write the policy, with the `conditionName` parameter that maps it to the condition's **Condition name**. See [Write a policy for a custom condition](../../../api-gateway/next/policies/subscription-plan-policies.md#write-a-policy-for-a-custom-condition).
- Build the policy into your gateway. See [Building Gateway with Custom Policies](../../../api-gateway/next/policies/custom-policies/building-gateway-with-custom-policies.md).

Then attach it in one of these two ways, depending on whether the plan names the policy.

=== "The plan names the policy"

    You entered the **Policy name** and **Policy version** when you created the condition, for example `region-guard` `v1`.

    1. On **Develop** > **Usage Plans**, select the plan. If the API has no `subscription-validation` yet, the **Attach required policies?** dialog lists `subscription-validation v2` and `region-guard v1`, and `subscription-request-ratelimit v1` too if the plan has a request count condition.
    2. Select **Attach policies**. The console adds them to the API's global policies, `subscription-validation` first, and sets the `conditionName` parameter of `region-guard` to the condition's **Condition name**, for example `region-limit`. You don't need to set it yourself.
    3. Select **Save changes**, and then redeploy the API.

    If the API already has `subscription-validation` v1, the dialog lists only `region-guard v1`, and the console keeps v1. v1 doesn't pass the plan's conditions to the policies after it, so after you attach the policy, open **Develop** > **Policies**:

    1. Edit `subscription-validation` and change its version to **v2**.
    2. If the plan has a request count condition, add `subscription-request-ratelimit` v1 after `subscription-validation`. This is mandatory with v2, which enforces no limit itself. Until you add it, **Usage Plans** lists it as a required policy.
    3. Save the policies, and then redeploy the API.

    If several custom conditions name the same policy and version, for example `region-limit` and `region-quota` both naming `region-guard` v1, the console attaches the policy once for each condition, each with its own `conditionName`.

    Until `region-guard` is attached, the Usage Plans page lists it under **You have not yet attached the following required policies:**. When you detach the last plan that needs it, the **Remove unused policies?** dialog offers to remove it.

=== "The plan names no policy"

    The console doesn't know which policy enforces the condition, so it offers nothing and shows no warning for it.

    1. On **Develop** > **Usage Plans**, select the plan, and then select **Save changes**.
    2. Open **Develop** > **Policies**:
        1. Edit `subscription-validation` and change its version to **v2**.
        2. If the plan has a request count condition, add `subscription-request-ratelimit` v1 after `subscription-validation`. This is mandatory with v2, which enforces no limit itself. Until you add it, **Usage Plans** lists it as a required policy.
        3. Add your policy to the API, after `subscription-validation`. Add it to the whole API, so that it runs on every request that `subscription-validation` checks.
        4. Set the policy's `conditionName` parameter to the condition's **Condition name**, for example `region-limit`. The console doesn't set it for you, because the plan doesn't name the policy.
    3. Save the policies, and then redeploy the API.

!!! warning
    A custom policy needs `subscription-validation` **v2** before it in the chain. Only v2 records the subscriber's plan conditions for the policies after it. With v1, or with the policy placed before it, the policy finds no conditions.

For the policies that enforce every window and every kind of condition, see [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md).

### When subscription-validation is on the API's resources

If `subscription-validation` is attached to the API's resources (operations) rather than to the whole API:

- When **every** resource has it, configured the same way, it moves to the API level with the same version and parameters, rather than being added a second time. The **Attach required policies?** dialog marks it **Moved from the API's resources to the API**.
- When only **some** resources have it, or they configure it differently, nothing is attached. The **Attach the policies on the Policies page** dialog explains why. Select **OK**: the plans stay selected, and you attach the policies on **Develop** > **Policies**, to the resources that have `subscription-validation`.

### Policies that are still missing

While an attached plan needs a policy that the API doesn't have, the page shows the warning **You have not yet attached the following required policies:** with the list, under the page heading. For a custom condition's policy, the warning also appears when the policy is on the API but no instance of it has that condition's `conditionName`. A condition doesn't limit requests until its policy is attached and the API is redeployed.

## Detach plans

You can't detach a plan that an API Portal selects for this API, in its live listing or in a saved draft. API Portals list the plan to subscribers, and subscribers may be billed on it. On **Usage Plans**, the plan's checkbox is unavailable; hover over it to see which portals select it. To detach the plan, first clear it on the **Subscription Plans** tab of each of those portals and select **Save Draft**. If the API is live on that portal, select **Republish** too, so that neither the draft nor the live listing selects the plan. Then return to **Usage Plans**.

1. Clear the checkbox of each plan the API should no longer offer. To clear every plan, clear the checkbox in the table header (**Detach all plans**). Plans that an API Portal selects stay attached.
2. If no remaining plan needs some of the API's subscription policies, the **Remove unused policies?** dialog lists them:
    - Select **Remove policies** to remove them from the API's global policies when you save.
    - Select **Keep** to leave them on the API.
3. Select **Save changes**, and then redeploy the API.

## Choose the plans each API Portal lists

1. Open the API, and then select **Publish**. The page lists the API Portals you can publish to.
2. On the portal's card, select **Configure & Publish**. For an API not yet on that portal, the card has a split button: select the arrow, choose **Configure & Publish**, and then select the button. The publish page for that portal opens.
3. Select the **Subscription Plans** tab. It lists the plans attached on **Usage Plans**, and any plan the live listing offers, each as a card with its name, its expiry date (**Expires** *date*) under the name when the plan expires, and its description. A long name is cut short; hover over it to read all of it. A summary shows how many are selected, for example **2 of 2 plans selected**.

    If no plans are attached, the tab shows **No usage plans attached**, with **Attach plans in Develop › Usage Plans**.

    When nothing has been saved for this portal yet, no draft and no live listing, every plan attached on **Usage Plans** starts selected. Once a draft or a live listing exists, the tab shows its selection instead.

    A listing published before the API had plans attached on **Usage Plans** can offer plans that aren't attached. The draft still lists them, so you can keep them. If the draft doesn't select a plan the live listing offers, a warning names it: publishing the draft removes the plan from the API Portal, and developers can no longer subscribe to it. To keep offering such a plan, select it here, and attach it on **Usage Plans** as well.

4. Clear the plans that this API Portal shouldn't offer, or select more. **Select all** selects every attached plan.
5. Select **Save Draft** to keep the selection, or **Publish** (**Republish** for an API already on the portal) to make it live.

While this portal's draft or live listing selects a plan, the plan can't be detached from the API on **Usage Plans**.

## Next steps

- [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md)
- [Upgrade plans created before conditions](upgrade-existing-plans.md)
