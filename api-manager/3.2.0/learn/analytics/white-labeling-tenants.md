---
title: "White labeling for tenants"
description: "White label the API-M Analytics dashboard per tenant by adding a custom logo and favicon in the tenant folder structure."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/learn/analytics/white-labeling-tenants/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/learn/analytics/white-labeling-tenants.md
tags:
  - api-manager
  - learn
  - analytics
  - white-labeling-tenants
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# White Labeling for Tenants
This section explains how to white label analytics dashboard for tenants. You can customize logo and favicon for tenants. 
1. Add following configuration in the deployment.yaml. You can use `logoFileName` and `faviconFileName` directives of deployment.yaml to specifiy file names of logo and favicon.(Ex: logo.png, favicon.ico)
    ```yaml
    themeConfigProviderClass: org.wso2.analytics.apim.dashboards.theme.config.provider.CustomDashboardThemeConfigProvider
    logoFileName: logo.png
    faviconFileName: favicon.ico
    ```
2. Go to `<API-M_ANALYTICS_HOME>/wso2/dashboard/deployment/web-ui-apps/analytics-dashboard/public/` directory and create a directory with the name of tenant (Ex: abc.com)
    
Create following folder structure inside the tenant folder and add relavent logo and favicon file.

![](../../assets/img/learn/analytics/tenant-white-label-tree.png)

3. To verify changes Log in to the Analytics Dashboard by accessing `<Protocol>://<Host>:<Port>/analytics-dashboard` (ex: [https://localhost:9643/analytics-dashboard](https://localhost:9643/analytics-dashboard)).

![](../../assets/img/learn/analytics/analytics-white-labeled.png)