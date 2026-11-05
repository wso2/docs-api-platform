---
title: "Manage Subscription Plans"
description: "Create organization-level subscription plans that define the rate and quota tiers that applications can subscribe to."
---

A subscription plan defines how many requests an application can make in a time window. You create subscription plans at the organization level, and then enable them on the APIs that you publish. When consumers subscribe an application to an API in a portal, the portal lists the plans that are enabled for the API, so that they can choose one.

You configure the subscription plans for a specific API when you publish it to a portal. For more information, see [Customize the Portal Listing](../publish-api-proxy/customize-portal-listing.md).

:::tip
Deleting a subscription plan is only possible if there are no active subscriptions associated with it.
:::

## View Subscription Plans

1. Sign in to the [API Control Plane](https://console.bijira.dev).

2. Go to the organization level. In the header, select your organization from the **Organizations** list.

3. In the left navigation menu, click **Manage**, then click **Subscription Plans**.

The **Subscription Plans** page lists the plans in your organization, with their limits, pricing, and status. To find a plan by name, type in **Search plans**.

## Create a Subscription Plan

1. On the **Subscription Plans** page, click **Create plan**.

2. In the **Add subscription plan** dialog, enter the following details.

    | Field | Description |
    |:------|:------------|
    | **Plan name** | Required. A name for the plan, such as `Gold`. |
    | **Limits** | The limits of the plan. To add a limit, click **Add limit**, select what to limit, such as **Request count**, and enter the number allowed per time unit, such as 100 per **Minute**. To remove a limit, click the remove icon next to it. Leave **Limits** empty for an unlimited plan. |
    | **Block requests when quota is reached** | Turn on to reject the requests that exceed the limit. This is on by default. |
    | **Expiry date** | Optional. The date after which the plan stops accepting subscriptions. |

3. Click **Add plan**.

The plan appears on the **Subscription Plans** page.

## Edit or Delete a Subscription Plan

On the **Subscription Plans** page, find the plan, and do one of the following.

- To turn the plan on or off, click the toggle in the **Status** column.
- To edit the plan, click the edit icon.
- To delete the plan, click the delete icon.

## Next Steps

- [Subscription Plans](../publish-api-proxy/subscription-plans-and-billing.md) - Enable subscription plans on an API
