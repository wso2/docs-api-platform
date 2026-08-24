---
title: "API analytics architecture"
description: "See the high-level architecture of API Analytics, including gateway publishing and the regional Analytics Cloud."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/api-analytics/api-analytics-architecture/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/api-analytics/api-analytics-architecture.md
tags:
  - api-manager
  - api-analytics
  - api-analytics-architecture
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "concept"
---

# API Analytics Architecture

The following diagram illustrates the basic architecture of the Analytics solution.

<a href="../../assets/img/analytics/apim-analytics-simplified.jpg"><img src="../../assets/img/analytics/apim-analytics-simplified.jpg" width="70%" alt="APIM Analytics Simplified Design"></a>

As depicted above, the Gateways will publish analytics statistics directly to the Analytics Cloud over the internet. The Analytics Cloud will have regional deployments to reduce publishing latencies and honor data privacy.