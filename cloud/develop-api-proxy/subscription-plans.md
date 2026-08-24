---
title: "Assign Subscription Plans to APIs"
description: "Assign existing subscription plans to an API proxy in WSO2 API Platform to control access levels and pricing tiers for consumers."
canonical_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/subscription-plans/
md_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/subscription-plans.md
tags:
  - cloud
  - api-proxy
  - monetization
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Assign Subscription Plans to APIs

API subscription plans allow API publishers to control and manage access to APIs. These plans define the rules, limitations, and pricing for how clients can interact with APIs, ensuring efficient resource utilization and robust security.

API Platform allows users with the administrator role to create, update, and delete subscription plans at the organization level. For instructions on creating subscription plans, see [Create API Subscription Plans](../administer/settings/create-api-subscription-plans.md).

Once created, API Platform allows API publishers to assign subscription plans to APIs, providing different levels of access and pricing based on user needs.

To assign subscription plans to an API, follow the steps given below:

1. Sign in to the [API Platform Console](https://console.bijira.dev/).
2. Select the project and the API which you want to assign subscription plans.
3. In the left navigation menu, click **Manage** and then click **Monetize**. This displays the subscription plans available for the API.
4. Enable the toggle corresponding to the subscription plans you want to assign to the API.

    ![Subscription Plans page showing plan name, description, pricing model, quota, and enabled toggle columns](../../assets/img/develop-api-proxy/subscription-plans.png)

5. Click **Save**.

When an API has subscription plans assigned to it, API consumers can select the plan that best fits their requirements during the subscription process. You can enable a combination of free and paid subscription plans for the same API to offer tiered access.

For details on setting up paid plans and monetizing APIs, see [API Monetization](../api-monetization/overview.md).