---
title: "Monetization"
description: "Charge consumers for API usage with subscription plans that define pricing models, billing periods, and usage limits in API Platform Cloud."
slug: /monetization
---

Monetization lets you charge consumers for using your APIs. You set the price of an API through subscription plans. Each plan defines a pricing model, a currency, a billing period, and the rate limits that apply to consumers who subscribe under it.

## Pricing Models

When you create a subscription plan, you select one of the following pricing models: Free, Flat, Unit, Volume, or Graduated. The Volume and Graduated models use price tiers instead of a single unit price.

## How It Works

1. An administrator [creates subscription plans](../administer/creating-subscription-plans.md) for the organization.
2. An API publisher [assigns subscription plans to an API](../publish-api-proxy/subscription-plans-and-billing.md) for each portal that the API is published to.
3. Consumers [subscribe to the API](../developer-portal/manage-subscriptions.md) under a plan in the Developer Portal.
