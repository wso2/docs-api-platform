---
title: "Subscription Plans"
description: "Assign existing subscription plans to an API proxy in API Management to control access levels and pricing tiers for consumers."
---

API subscription plans allow API publishers to control and manage access to APIs. These plans define the rules, limitations, and pricing for how clients can interact with APIs, ensuring efficient resource utilization and robust security.

Users with the administrator role can create, update, and delete subscription plans at the organization level. For instructions on creating subscription plans, see [Manage Subscription Plans](../administer/creating-subscription-plans.md).

Once created, API publishers can assign subscription plans to APIs, providing different levels of access and pricing based on user needs.

You assign subscription plans to an API separately for each portal that you publish it to. To assign subscription plans to an API, follow the steps given below:

1. Sign in to the [API Management Console](https://console.bijira.dev/).

2. In the header, select the project from the **Projects** list and the API from the **APIs** list.

3. In the left navigation menu, click **Publish**.

4. On the portal that you want to publish the API to, click **Go to Publish**.

5. Click the **Subscription Plans** tab. The tab lists the subscription plans of your organization, with the rate limit of each plan.

6. Select the subscription plans that consumers can use to subscribe to the API.

7. Click **Publish** to make the plans available to consumers in the portal, or click **Save Draft** to keep your selection and publish it later.

When an API has subscription plans assigned to it, API consumers can select the plan that best fits their requirements during the subscription process. You can enable more than one subscription plan for the same API to offer tiered access.

For the other tabs of the publish page, see [Customize the Portal Listing](./customize-portal-listing.md).
