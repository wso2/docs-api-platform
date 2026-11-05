---
title: "Manage Usage"
description: "Learn how applications track the usage of your keys, and how subscriptions apply the usage limits of a subscription plan, in the API Portal and AI Hub."
---

Applications and subscriptions in the API Portal and AI Hub let you track how your keys are used, and subscribe to APIs under subscription plans.

| Feature | What It Does | When You Need It |
|:--------|:-------------|:-----------------|
| **Application** | Groups your OAuth2 keys and API keys, so that you can track their usage and see analytics for them. | When you want usage and analytics for a set of keys. |
| **Subscription** | Subscribes you to an API under a subscription plan. The plan sets the usage limits for your calls, such as a request count per minute, or allows unlimited requests. The portal issues a subscription token, which you send in the `Subscription-Key` header. | When the API has subscription plans. |

## Next Steps

- [Manage Applications](./manage-applications.md) - Create applications, and associate keys with them
- [Manage Subscriptions](./manage-subscriptions.md) - Subscribe to an API under a subscription plan
