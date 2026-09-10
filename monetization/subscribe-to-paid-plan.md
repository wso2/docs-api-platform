---
title: "Subscribe to a paid plan"
description: "Subscribe an application to a paid API subscription plan in the Developer Portal using Stripe checkout."
canonical_url: https://wso2.com/api-platform/docs/monetization/subscribe-to-paid-plan/
md_url: https://wso2.com/api-platform/docs/monetization/subscribe-to-paid-plan.md
tags:
  - cloud
  - monetization
  - devportal
  - subscriptions
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "how-to"
---

# Subscribe to a Paid Plan

API consumers can browse monetized APIs on the Developer Portal and subscribe to a paid subscription plan using a secure Stripe-powered checkout. Once the payment is successful, the application is subscribed to the API and can be used to invoke it.

---

## Prerequisites

Before you begin, ensure you have:

- Access to the Developer Portal for your organization
- A valid payment method

---

## Subscribe to an API with a Paid Plan

1. Go to the [API Platform Developer Portal](https://devportal.bijira.dev/) and sign in to your organization.
2. In the Developer Portal sidebar, click **APIs** to open the API listing page.
3. Locate the API you want to subscribe to and click **Subscribe** on the API card.

    ![Developer Portal APIs page showing Reading List API and Books API cards each with a Subscribe button and Plans count](../../assets/img/api-monetization/devportal-api-list.png){ width="900" }

4. In the **Choose Your Subscription Plan** dialog, review the available plans. Select the **application** you want to subscribe with from the dropdown, and click **Subscribe** on the paid plan that fits your requirements.

    ![Choose Your Subscription Plan dialog for Books API showing Bronze free plan and SampleUnitBasedPlan at USD 0.02 per request with application dropdown and Subscribe buttons](../../assets/img/api-monetization/devportal-subscribe-api-paid.png){ width="800" }

5. A secure Stripe checkout window opens. Enter your payment details and complete the payment.

    !!! note
        Payments are processed by Stripe. API Platform does not store your payment details. Billing and receipts are managed through Stripe.

6. Once the payment is successful, the application is subscribed to the API under the selected paid plan.

---

## Invoke the API

After subscribing, generate application keys and invoke the API using the credentials. For detailed instructions, see:

- [Consume an API Secured with OAuth2](../devportal/consuming-services/consume-an-api-secured-with-oauth2.md)
- [Consume an API Secured with API Key](../devportal/consuming-services/consume-an-api-secured-with-api-key.md)

---

## Next Steps

- [View Billing and Usage](view-billing-and-usage.md)