---
title: "Stripe guides"
description: "Use WSO2 API Platform with Stripe to sell paid subscription plans for your APIs and bill consumers for their usage."
canonical_url: https://wso2.com/api-platform/docs/guides/service-providers/stripe/
md_url: https://wso2.com/api-platform/docs/guides/service-providers/stripe.md
tags:
  - guides
  - stripe
  - monetization
  - service-provider-guides
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "reference"
---

# Bill for APIs with Stripe

WSO2 API Platform works alongside Stripe Billing. Sell paid API subscription plans, and report usage to Stripe for metered billing.

## End-to-end guides

A step-by-step guide for billing with Stripe.

<div class="vendor-guide-list" markdown="1">

- [Monetize a REST API with Stripe](../monetization/api-monetization.md)

    Publish an API with a pay-as-you-go plan and let the platform sync per-request usage to Stripe.

    Guide · Stripe billing · Cloud

</div>

## Stripe billing for APIs

In WSO2 Cloud, API Platform creates the Stripe products and prices for your plans and reports usage to Stripe, so you don't write billing code.

<div class="vendor-cap" markdown="1">

### Connect your Stripe account

Add your Stripe publishable key and a secret key at the organization level.

- [Connect Stripe](../../monetization/getting-started.md) <span class="vendor-meta">Monetization</span>
- [API monetization overview](../../monetization/overview.md) <span class="vendor-meta">Monetization</span>

</div>

<div class="vendor-cap" markdown="1">

### Create paid plans

Define the paid subscription plans and pricing that consumers can choose from.

- [Manage paid subscription plans](../../monetization/manage-paid-subscription-plans.md) <span class="vendor-meta">Monetization</span>

</div>

<div class="vendor-cap" markdown="1">

### Let consumers subscribe

Consumers pick a paid plan in the Developer Portal and pay through Stripe.

- [Subscribe to a paid plan](../../monetization/subscribe-to-paid-plan.md) <span class="vendor-meta">Monetization</span>

</div>

<div class="vendor-cap" markdown="1">

### Track billing and usage

See what each subscriber used and what they were billed.

- [View billing and usage](../../monetization/view-billing-and-usage.md) <span class="vendor-meta">Monetization</span>

</div>

!!! tip "Use a restricted key"
    Create a restricted Stripe secret key with only the permissions listed in [Connect Stripe](../../monetization/getting-started.md), instead of a standard secret key with full access to your Stripe account.

## Architecture and responsibility model

WSO2 API Platform and Stripe split the work like this:

| Scenario | WSO2 role | Stripe role | Runtime traffic |
| --- | --- | --- | --- |
| API monetization | Manages plans and subscriptions, and syncs per-request usage | Holds products and prices, invoices consumers, and collects payment | API calls go through the WSO2 gateway, and usage records go to Stripe |

## Learn more

Related pages in the Stripe documentation:

- [Stripe Billing](https://docs.stripe.com/billing)
- [Usage-based billing](https://docs.stripe.com/billing/subscriptions/usage-based)
- [API keys](https://docs.stripe.com/keys)

To browse every guide by goal, see the [Guides overview](../overview.md#browse-by-use-case).
