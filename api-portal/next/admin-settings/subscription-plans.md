---
title: "Configure subscription plans in the API Portal & MCP Hub"
description: "Define the rate and quota tiers that applications can subscribe to, and attach them to your published APIs."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/subscription-plans/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/subscription-plans.md
tags:
  - cloud
  - api-portal
  - subscription-plans
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Subscription plans

A **subscription plan** is a named usage tier that controls how much of an API a developer can consume. You attach one or more plans to each API you publish, and developers choose a plan when they subscribe.

## Adding a plan

1. Navigate to **Settings** and select the **Subscription Plans** tab under **ORGANIZATION**.
2. Click **+ Add plan**.
3. Fill in the plan details:

| Field | Description |
|---|---|
| **Name** | Required. The name shown to developers on the plan card, for example `Gold` |
| **Description** | Optional description of the tier shown to developers |
| **Limits** | One or more usage limits (see below). Leave empty for an unlimited plan |
| **External reference ID** | Optional universally unique identifier (UUID) linking this plan to an external billing or quota system |

A plan carries three separate identifiers, and it's worth keeping them apart:

- **Plan handle**—the developer-facing id used in Management API paths and in the `subscriptionPlans` references on an API. Supply it as `id` when creating a plan through the [Management API](../rest-api/subscription-plans.md). This form sends no `id`, so plans created here get a generated UUID as their handle.
- **Database UUID**—the portal's own internal primary key. Never exposed in the API.
- **External reference ID**—the optional link to a billing or quota system, set in the field above. It has no effect inside the portal.

4. Click **+ Add limit** for each limit you want to enforce, and configure:

| Field | Description |
|---|---|
| **Type** | `REQUEST_COUNT`, `EVENT_COUNT` (for async/webhook APIs), `BANDWIDTH`, or `TOTAL_TOKEN_COUNT` |
| **Count** | Maximum allowed. Use `-1` for unlimited |
| **Per / Unit** | A time amount and unit (`MINUTE`, `HOUR`, `DAY`, `MONTH`), or "— no window —" for a limit with no time window |

5. Click **Add plan**.

## Editing or deleting a plan

Click a plan's name (or the pencil icon) to edit its fields and limits.

Click the trash icon to delete a plan. Deleting can't be undone. Any subscription held under a deleted plan has to be moved to a different plan before it can renew.

## Attaching plans to an API

Subscription plans aren't automatically available on every API. When creating or editing an API in [Manage APIs](manage-apis.md), select which plans apply under **Applicable Subscription Plans**. If no plans are attached, the API is accessible without a subscription plan.