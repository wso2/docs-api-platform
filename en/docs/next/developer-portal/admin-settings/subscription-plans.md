---
title: "Configure subscription plans in the Developer Portal"
description: "Define the rate and quota tiers that applications can subscribe to, and attach them to your published APIs."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/subscription-plans/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/subscription-plans.md
tags:
  - cloud
  - devportal
  - subscription-plans
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Subscription Plans

A **subscription plan** is a named usage tier that controls how much of an API a developer can consume. You attach one or more plans to each API you publish, and developers choose a plan when they subscribe.

## Adding a Plan

1. Navigate to **Settings** and select the **Subscription Plans** tab under **ORGANIZATION**.
2. Click **+ Add plan**.
3. Fill in the plan details:

| Field | Description |
|---|---|
| **Display name** | Human-friendly name shown to developers (for example, "Gold") |
| **Name** | Unique plan identifier |
| **Description** | Optional description of the tier shown to developers |
| **Limits** | One or more usage limits (see below). Leave empty for an unlimited plan |
| **External reference ID** | Optional UUID linking this plan to an external billing or quota system |

4. Click **+ Add limit** for each limit you want to enforce, and configure:

| Field | Description |
|---|---|
| **Type** | `REQUEST_COUNT`, `EVENT_COUNT` (for async/webhook APIs), `BANDWIDTH`, or `TOTAL_TOKEN_COUNT` |
| **Count** | Maximum allowed. Use `-1` for unlimited |
| **Per / Unit** | A time amount and unit (`MINUTE`, `HOUR`, `DAY`, `MONTH`), or "— no window —" for a limit with no time window |

5. Click **Add plan**.

## Editing or Deleting a Plan

Click a plan's display name (or the pencil icon) to edit its fields and limits. Click the trash icon to delete a plan — this can't be undone, and any application subscribed under a deleted plan will need to be moved to a different plan before its subscription can renew.

## Attaching Plans to an API

Subscription plans aren't automatically available on every API. When creating or editing an API in [Manage APIs](manage-apis.md), select which plans apply under **Applicable Subscription Plans**. If no plans are attached, the API is accessible without a subscription plan.
