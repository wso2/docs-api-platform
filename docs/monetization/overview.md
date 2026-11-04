---
title: "Monetization"
pagination_label: "Monetization"
description: "Charge consumers for API usage with Stripe and subscription plans that define pricing models, billing periods, and usage limits."
slug: /monetization
---

API monetization lets you generate revenue from your APIs by offering paid subscription plans to consumers. Stripe is the payment provider, so you can define pricing models and manage billing for API usage from the API Management Console.

:::note
Monetization is coming soon.
:::

## What You Can Do

| Task | Description |
|:-----|:------------|
| Connect Stripe | Add your Stripe credentials at the organization level to process payments and billing. |
| Define pricing models | Create subscription plans with a pricing model that matches how you want to charge for an API. |
| Enable monetization per API | Choose which APIs offer paid plans. |
| Manage subscriptions | Consumers discover and subscribe to paid plans in the API Portal. |

## Pricing Models

When you create a subscription plan, you select one of the following pricing models: Free, Flat, Unit, Volume, or Graduated. The Volume and Graduated models use price tiers instead of a single unit price.

Each plan also defines a currency, a billing period, and the rate limits that apply to consumers who subscribe under it.

## Get Started

1. Configure Stripe. Add your Stripe credentials at the organization level to enable payment processing.
2. [Create subscription plans](../api-control-plane/administer/creating-subscription-plans.md) with the pricing model you want to offer.
3. [Assign subscription plans to an API](../api-control-plane/publish-api-proxy/subscription-plans-and-billing.md) for each portal that the API is published to.
4. Consumers [subscribe to the API](../api-portal/consume-an-api/manage-subscriptions.md) under a plan in the API Portal and AI Hub.
