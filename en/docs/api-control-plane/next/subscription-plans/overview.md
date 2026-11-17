---
title: "Subscription plans overview"
description: "How subscription plans and their conditions limit what each subscriber can use, from creating a plan to enforcing it on the gateway."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/subscription-plans/overview/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/subscription-plans/overview.md
tags:
  - api-control-plane
  - subscription-plans
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-16
content_type: "concept"
---

# Subscription plans overview

A **subscription plan** is a usage tier that subscribers choose when they subscribe to an API, for example *Bronze*, *Gold* or *Platinum*. A plan says how much a subscriber can use through its **conditions**: how many requests they can make, how many MCP tools they can call, or how many LLM tokens they can consume, in each time window.

Plans are defined once for the organization. Each API then attaches the plans it offers, and the gateway enforces the subscriber's plan on every request.

## How plans work

| Step | Who | Where | What happens |
|---|---|---|---|
| 1. Create plans | Organization admin | **Manage** > **Subscription Plans** | Define each plan's conditions, and optionally its pricing and expiry. See [Create and manage subscription plans](create-subscription-plans.md). |
| 2. Attach plans to an API | API developer | API > **Develop** > **Usage Plans** | Choose the plans the API offers. The console offers to attach the policies those plans need. See [Attach plans to an API](attach-plans-to-an-api.md). |
| 3. Deploy | API developer | API > **Deploy** | The gateway receives the API with its policies, and the plans and subscriptions. |
| 4. Publish | API publisher | API > **Publish** > **Subscription Plans** | Choose which of the attached plans each API Portal lists. On a portal with nothing saved yet, every attached plan starts selected. |
| 5. Subscribe | API consumer | API Portal | The consumer picks a plan and gets a subscription token, sent in the `Subscription-Key` header. |
| 6. Enforce | Gateway | Policies on the API | The subscription policies check the subscription and count usage against the plan's conditions. |

!!! note
    A condition takes effect on an API only when the policy that enforces it is attached to that API. A plan with no conditions is **unlimited**: a subscription is still required, but its usage is not limited.

## Conditions

A plan holds up to 20 conditions. There are three built-in condition types, and you can add your own custom conditions.

| Condition | What it counts | Applies to | Enforced by |
|---|---|---|---|
| **Request count** | Each request to the API | REST, GraphQL, MCP and LLM APIs | `subscription-validation` v1 (one window), or `subscription-request-ratelimit` (every window) |
| **Tool-call count** | Each MCP `tools/call` request | MCP proxies | `subscription-tool-ratelimit` |
| **Token count** | LLM tokens in each response: total, prompt or completion tokens | LLM proxies | `subscription-token-ratelimit` |
| **Custom** | Anything you define, as key-value pairs | Any API | A policy you write, which reads the condition |

A plan has at most one condition of each built-in type. For details of the enforcing policies, see [Subscription plan policies](../../../api-gateway/next/policies/subscription-plan-policies.md).

### Limits and time windows

Each built-in condition has **one to ten limits**. A limit is a count in a time window, for example *100 requests per minute* or *1,000,000 tokens per month*.

- A window is a number of **minutes**, **hours**, **days** or **months**. A month is counted as 30 days.
- Two limits of one condition can't cover the same length of time. For example, *60 minutes* and *1 hour* clash.
- When a condition has several limits, every limit applies. A subscriber who uses up any of them is limited until that window resets.

!!! example
    A *Gold* plan with a request count of **100 per minute** and **5,000 per day** lets a subscriber make bursts of up to 100 requests a minute, but no more than 5,000 in a day.

### What happens when a limit is reached

Each built-in condition has a **Block requests when quota is reached** setting:

| Setting | Gateway behaviour | Use it for |
|---|---|---|
| **On** (reject) | Requests over the limit get `429 Too Many Requests`, with `Retry-After` and rate-limit headers. | Hard quotas. This is the default. |
| **Off** (allow) | Requests over the limit go through. The gateway marks each of them as **over quota** in analytics. | Pay-as-you-go plans that charge overage separately. |

### Usage reported to analytics

When the rate-limit policies count a request, they record in the request's analytics data whether it was within the plan's quota. Billing systems can use this to charge overage on plans that allow requests past their limit.

| Analytics key | Value |
|---|---|
| `x-wso2-subscription-quota-status-<condition>` | `within` or `over` |
| `x-wso2-subscription-quota-action-<condition>` | `allowed` or `rejected`. Present only when over the quota. |
| `x-wso2-subscription-quota-limit-<condition>` | The window that was exceeded, for example `5 requests per 1 minute`. Present only when over the quota. |

`<condition>` is the condition's ID: `requests`, `tool-calls`, `tokens` or a custom condition's name. If the rate limiter itself fails, for example when its Redis store is unavailable, the request is not recorded as over quota, so subscribers are never charged for an outage.

### Custom conditions

A custom condition has a **name** (lowercase letters, digits and hyphens, for example `region-limit`) and any key-value pairs, up to 4 KB. The gateway passes them to the policies on the API, so a policy you write can read and enforce them. You can also record the **policy** that enforces the condition, by name and version. The console then offers to attach that policy when the plan is attached to an API.

## Plans that are in use

When an API offers a plan, or a subscriber is on it, the plan's **name** and **conditions** can't be changed, because subscribers and API Portals already rely on them. You can still change its description, pricing, status and expiry. To change what a plan allows, create a new plan, attach it, and move subscribers to it.

On **Usage Plans**, a plan can't be detached from an API while an API Portal selects it for that API, in a live listing or a draft. Clear it on each of those portals first. See [Detach plans](attach-plans-to-an-api.md#detach-plans).

## Plans created before conditions

Plans saved before conditions were introduced had a single request limit. They keep working without any data migration: each one is read as a request-count condition with the same limit, window and blocking behaviour. For what changes when such a plan is edited, and the database steps for an upgrade, see [Upgrade plans created before conditions](upgrade-existing-plans.md).
