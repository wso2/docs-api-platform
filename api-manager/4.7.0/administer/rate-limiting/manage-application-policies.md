---
title: "Manage Application Rate Limiting Policies"
description: "Configure application-level rate limiting policies to control the number of requests per access token generated for an application."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/administer/rate-limiting/manage-application-policies/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/administer/rate-limiting/manage-application-policies.md
tags:
  - api-manager
  - rate-limiting
  - admin-portal
  - throttling
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Manage Application Policies

Application-level rate limiting policies are applicable per access token generated for an application.

### Default Application Tiers

The default rate limiting tiers are as follows:

| **Tier** | **Limit** |
|----------|-----------|
| 10PerMin | 10 requests per minute |
| 20PerMin | 20 requests per minute |
| 50PerMin | 50 requests per minute |
| Unlimited | No limit (available by default) |

## Adding a New Application-Level Rate Limiting Tier

1.  Sign in to the Admin Portal using the URL https://localhost:9443/admin and your admin credentials (admin/admin by default).
2.  Click **Application Policies** under the **Rate Limiting Policies** section to see the set of existing rate limiting tiers.
3.  To add a new tier, click **Add Policy**.

    [![Add application policy page](../../assets/img/learn/add-new-application-policy.png)](../../assets/img/learn/add-new-application-policy.png)

4.  Fill in the required details and click **Save**.

    [![Add application policy page](../../assets/img/learn/save-new-application-policy.png){:style="width:45%"}](../../assets/img/learn/save-new-application-policy.png)

You have added a new application-level rate limiting policy.