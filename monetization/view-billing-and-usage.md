---
title: "View billing and usage"
description: "Monitor API usage, review invoices, and manage paid subscriptions from the Billing and Usage view in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/monetization/view-billing-and-usage/
md_url: https://wso2.com/api-platform/docs/monetization/view-billing-and-usage.md
tags:
  - cloud
  - monetization
  - devportal
  - billing
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "how-to"
---

# View Billing and Usage

The Developer Portal provides a consolidated **Billing & Usage** view where API consumers can monitor usage, review invoices, and manage their paid subscriptions across all subscribed APIs.

---

## Access the Billing Page

1. Go to the [API Platform Developer Portal](https://devportal.bijira.dev/) and sign in to your organization.
2. Click your profile icon in the top right corner.
3. Click **Billing** from the profile menu.

    ![Developer Portal header with profile dropdown menu open showing Billing and Log Out options](../../assets/img/api-monetization/devportal-view-billing-details.png){ width="900" }

---

## Usage Summary

The **Usage Summary** tab displays an **API Usage Overview** for a selected period (e.g., Current Month). This includes:

- **Total Billed API Calls** across all your paid subscriptions.
- **Active Subscriptions** count.
- **Estimated Cost** for the current billing period.
- A breakdown table showing usage per API, application, plan, request count, billing type, and cost.

    ![Billing and Usage page with Usage Summary tab showing 19 billed API calls, 1 active subscription, USD 0.38 estimated cost, and Books API usage row](../../assets/img/api-monetization/devportal-view-billing-usage.png){ width="900" }

Use this view to track your consumption patterns and anticipate upcoming charges before the billing period closes.

---

## Invoices

The **Invoices** tab shows your **Invoice History**, listing all invoices generated for your paid subscriptions. For each invoice you can view the invoice number, date, amount, and payment status, and download the invoice receipt for your records. Use the **Period** filter to view invoices for a specific timeframe, or click **Download All** to export all invoices at once.

![Billing and Usage Invoices tab showing Invoice History with invoice N9RGLYDP-0020 dated April 5 2026 for USD 0.38 with paid status and Download and View actions](../../assets/img/api-monetization/devportal-view-billing-invoices.png){ width="900" }

Invoices are generated and issued by Stripe based on your subscription's billing cycle.

---

## Billed Subscriptions

The **Billed Subscriptions** tab shows all paid subscriptions associated with your account. For each subscription you can see the API, application, plan, billing cycle, amount, next billing date, and status. Use the **Filter by Status** dropdown to narrow the list, and click **Manage** to update or cancel a subscription.

![Billing and Usage Billed Subscriptions tab showing Books API with sampleunitbasedplan, monthly billing, USD 0.38, next billing May 5 2026, active status, and Manage button](../../assets/img/api-monetization/devportal-view-billing-billed-subscriptions.png){ width="900" }