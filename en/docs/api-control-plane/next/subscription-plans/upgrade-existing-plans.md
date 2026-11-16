---
title: "Upgrade plans created before conditions"
description: "What happens to subscription plans with a single request limit when you upgrade to plan conditions: database steps, how old plans are read and saved, and compatibility with earlier gateways and API Portals."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/subscription-plans/upgrade-existing-plans/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/subscription-plans/upgrade-existing-plans.md
tags:
  - api-control-plane
  - subscription-plans
  - upgrade
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-16
content_type: "how-to"
---

# Upgrade plans created before conditions

Earlier releases gave each subscription plan a single request limit, such as *1,000 requests per hour*. This release stores a plan's limits as [conditions](overview.md#conditions). Existing plans keep working after the upgrade with **no data migration**: subscribers keep the same limits, and nothing has to be recreated.

## Upgrade the databases

The control plane (Platform API), the API Portal and the gateway each store plans in their own database. Upgrade each one before you start its new release.

| Component | SQLite | PostgreSQL and SQL Server |
|---|---|---|
| Platform API | Upgraded at startup. | Re-run `schema.postgres.sql` or `schema.sqlserver.sql`. It adds the `subscription_plan_conditions` table and the `subscription_plans.description` column. |
| API Portal | Upgraded at startup. | Re-run `schema.postgres.sql` or `schema.sqlserver.sql`. It adds the `subscription_plan_conditions` table. |
| Gateway | Upgraded at startup, to schema version 7. | Re-run `gateway-controller-db.postgres.sql` or `gateway-controller-db.sqlserver.sql`. It adds the `subscription_plans.conditions` column. |

The scripts are safe to run again on a database that already has these objects. Don't drop `subscription_plan_limits`: plans that haven't been saved since the upgrade are still read from it.

!!! warning "If you start the new release before running the script"
    Plans keep working, and request limits can still be saved. Until the script has run, the Platform API refuses any other condition with `409` and the code `SUBSCRIPTION_PLAN_CONDITIONS_UNSUPPORTED`, and refuses a plan description. The API Portal refuses with `503` any condition its earlier storage can't hold: tool-call and custom conditions, prompt or completion token counts, and limits that let requests through. Nothing is lost; run the script and save the plan again.

## How existing plans are read

A plan saved by an earlier release is read as conditions. Nothing is written to the database when it is read.

| Stored by the earlier release | Read as |
|---|---|
| A request limit, for example 1,000 per hour, that stops requests at the limit | A **Request count** condition: 1,000 per 1 hour, **Block requests when quota is reached** on |
| A request limit that lets requests through past the limit | The same condition, with **Block requests when quota is reached** off |
| No limit | No conditions: the plan is unlimited |
| API Portal: several request limits | One **Request count** condition with each limit as a window, shortest first |
| API Portal: a total token limit (`TOTAL_TOKEN_COUNT`) | A **Token count** condition that counts total tokens |
| API Portal: event or bandwidth limits (`EVENT_COUNT`, `BANDWIDTH`) | No condition. They are not shown, and they are kept in the database as they are. |
| Gateway: a plan synced with a throttle limit | A **Request count** condition with that limit |

## What happens when a plan is updated

The first time an existing plan is saved after the upgrade, it moves to the new storage. The plan's limits stay the same unless you change them.

| You change | Result |
|---|---|
| Only the name, description, status or expiry | **Platform API**: the plan keeps its limit, and is stored as conditions from now on. **API Portal**: the plan stays exactly as it was stored. |
| The limits, from a client that sends only `limits` | The request count condition is replaced with the new limits. The plan's other conditions are kept. |
| The conditions | The plan's conditions are replaced with the ones you send. |
| `limits` sent as an empty list | The request count condition is removed. The plan's other conditions are kept. |

In the API Portal, saving a plan's conditions or limits moves its request and total token limits to conditions. Its event and bandwidth limits stay in the database.

A plan that is in use still can't change its name or conditions, as before. See [Plans that are in use](overview.md#plans-that-are-in-use).

## Mixed versions during the upgrade

You can upgrade the components one at a time. Each one keeps working with the earlier release of the others.

| Combination | What happens |
|---|---|
| New Platform API, earlier gateway | The gateway still gets the plan's single throttle limit, taken from the request count condition, and `subscription-validation` v1 enforces it. Tool-call, token and custom conditions need a gateway that supports conditions. |
| New gateway, earlier Platform API | The gateway reads the throttle limit it is sent as a request count condition. |
| New API Portal, earlier Platform API | The Platform API reads the plan's request limits, as before. It keeps one request limit per plan, so a plan given several request windows in the API Portal is set back to its first window the next time that Platform API publishes to the portal. |
| New Platform API, earlier API Portal | The API Portal gets the plan's request limits, as before. |
| Gateway operator | A gateway that doesn't support conditions doesn't store them. The operator then doesn't mark the `SubscriptionPlan` as **Programmed**. See [Define a plan with conditions](../../../api-gateway/next/deployment/deployment-modes/kubernetes/gateway-operator-management-crds.md#define-a-plan-with-conditions). |

## Plans with more than one window

`subscription-validation` v1 enforces a single limit per plan: the condition's first window of one unit, such as *per 1 minute*. When there is none, it uses the first window, counted per one unit: *1,000 per 2 hours* is enforced as *1,000 per hour*.

To enforce every window of a condition, use `subscription-validation` v2 with `subscription-request-ratelimit`. See [Migrate from subscription-validation v1](../../../api-gateway/next/policies/subscription-plan-policies.md#migrate-from-subscription-validation-v1).

## Roll back

An earlier release reads only the old storage. If you roll back, plans that were saved after the upgrade lose their limits in that release, because their limits are now stored as conditions. Before you roll back, note the plans you saved after the upgrade so that you can set their limits again.
