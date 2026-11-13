---
title: "Subscription plans"
description: "View and add the rate and quota tiers that applications can subscribe to in the API Portal and AI Hub."
---

A subscription plan is a named usage tier that controls how much of an API a developer can consume. You attach one or more plans to each API you publish, and developers choose a plan when they subscribe.

1. Sign in to the API Portal and AI Hub as an administrator.
2. Open **Settings**.
3. Under **ORGANIZATION**, select **Subscription Plans**.


## Add a plan

Click **Add plan**.

| Field | Description |
|---|---|
| **Name** | Required. The name shown for the plan. |
| **Description** | What the plan allows. |
| **Limits** | The rate or quota. Leave this empty for an unlimited plan. Use `-1` as the count to mark a limit as unlimited. |
| **External reference ID** | Optional. A UUID that links this plan to an external billing or quota system. |
| **Paid plan** | Marks the plan as paid. Pricing cannot be changed after the plan is created. |

A paid plan also asks for the currency, how often the charge repeats, and either a flat rate or usage-based prices.

Plans are not attached to every API automatically. When you create or edit an API, choose the plans under **Subscription plans**. See [Manage APIs](./manage-apis.md).
