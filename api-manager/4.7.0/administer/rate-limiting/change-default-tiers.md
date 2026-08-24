---
title: "Change Default Rate Limiting Tiers"
description: "Change the default API-level, application-level, and subscription-level throttling tiers via the Admin Portal's Advanced Configurations."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/administer/rate-limiting/change-default-tiers/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/administer/rate-limiting/change-default-tiers.md
tags:
  - api-manager
  - rate-limiting
  - admin-portal
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Change Default Tiers

Users can change the default tiers by appending configurations to the Advanced Configurations in the Admin Portal.

## Steps to Change Default Tiers

1. Log in to the API Manager's Admin Portal ( `https://localhost:9443/admin` ) and go to the **Settings &gt; Advanced** menu.

   ![](../../assets/img/design/rate-limiting/change-default-tiers-menu.png)

2. Append the following configurations to the **Advanced Configurations** as required.

    ```
         "DefaultAPILevelTier":"<Tier Name>",
         "DefaultApplicationLevelTier" : "<Tier Name>",
         "DefaultSubscriptionLevelTier" : "<Tier Name> "
    ```

   ![](../../assets/img/design/rate-limiting/add-default-tier-configurations.png)