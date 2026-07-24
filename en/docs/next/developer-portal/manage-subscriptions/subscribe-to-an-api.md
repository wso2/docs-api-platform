---
title: "Subscribe to an API"
description: "Subscribe directly to a published API in the Developer Portal under a chosen subscription plan to control your rate limits and quota."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/manage-subscriptions/subscribe-to-an-api/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/manage-subscriptions/subscribe-to-an-api.md
tags:
  - cloud
  - devportal
  - subscriptions
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Subscribe to an API

A subscription grants you access to a specific API under a chosen subscription plan, which determines your rate limits and quota. Subscriptions are made directly to an API — no application is required.

## Subscribe to an API

1. Sign in to the Developer Portal.
2. Click **APIs** from the sidebar.
3. Find the API you want to access and open it.
4. Click **Subscribe** in the API's banner (or scroll to the **Subscription plans** section).
5. Click **Subscribe** on the plan card you want (e.g. Bronze, Gold, Unlimited).

The subscription is created immediately when you click **Subscribe** on a plan — there's no separate confirmation step. Once subscribed, you can invoke the API under the terms of the chosen plan. If the API uses API key authentication, you can now [generate an API key](../manage-api-keys.md) for it.

## Subscription Plans

Subscription plans control how much of the API you can consume. Available plans and their limits are defined by the API publisher — see [Subscription Plans](../admin-settings/subscription-plans.md) for how they're configured. Contact the API owner for details on what each plan includes.

## Subscriptionless APIs

Some APIs are configured to allow direct invocation without subscribing. For these APIs:

1. Navigate to the API in the catalog.
2. Click the **Try-Out** tab.
3. Invoke the API directly using your credentials.

!!! note
    Subscriptionless access is typically for testing and exploration. For production use, subscribing is recommended — it gives you quota management and key lifecycle control.

## View Your Subscriptions

Your active subscriptions are listed under **Subscriptions** in the Developer Portal sidebar. From there you can see which APIs you're subscribed to, the active plan for each, and manage or cancel subscriptions.

## Cancel a Subscription

1. Go to **Subscriptions** in the sidebar.
2. Find the API subscription you want to cancel.
3. Click **Unsubscribe**.

## Related

- [Consume an API Secured with API Key](../consuming-services/consume-an-api-secured-with-api-key.md) — generate an API key for a subscribed API
- [Consume an API Secured with OAuth2](../consuming-services/consume-an-api-secured-with-oauth2.md) — generate OAuth2 credentials via an application
- [Subscription Plans](../admin-settings/subscription-plans.md) — admin guide for managing plans
