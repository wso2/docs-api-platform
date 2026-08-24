---
title: "Enabling WSO2 API-M analytics features"
description: "Enable WSO2 API-M Analytics features by editing the deployment.yaml file for each profile."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/analytics/enabling-wso2-api-m-analytics-features/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/analytics/enabling-wso2-api-m-analytics-features.md
tags:
  - api-manager
  - learn
  - analytics
  - enabling-wso2-api-m-analytics-features
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-27
content_type: "how-to"
---

# Enabling WSO2 API-M Analytics Features

WSO2 API Manager Analytics is powered by WSO2 Stream Processor .These features are disabled by default.

Follow the steps below to enable the WSO2 API-M Analytics features:

1.  Open the `<API-M_ANALYTICS_HOME>/conf/<PROFILE>/deployment.yaml` file.

!!! info
       `<PROFILE>` refers to `dashboard` , `editor` , `manager` and `worker` profile directories. Each of these directories contain a `deployment.yaml` file and all of them need to be edited when you enable/disable solutions.


2.  Enable API-M Analytics is enabled by setting the `APIM-analytics.enabled:` parameter to `true` as shown in the sample below.

    ``` java
    # Carbon Configuration Parameters
    wso2.carbon:
    
    # server type
    type: wso2-sp
    analytics.solutions:
    APIM-analytics.enabled: true
    ```
    You have now enabled Analytics for API Manager

