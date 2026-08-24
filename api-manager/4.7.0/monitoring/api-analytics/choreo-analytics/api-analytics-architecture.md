---
title: "Choreo-Based API Analytics Architecture"
description: "The architecture of the deprecated Choreo-based API Manager analytics solution, where Gateways publish statistics directly to the Analytics Cloud."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/monitoring/api-analytics/choreo-analytics/api-analytics-architecture/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/monitoring/api-analytics/choreo-analytics/api-analytics-architecture.md
tags:
  - api-manager
  - analytics
  - architecture
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# API Analytics Architecture

!!! note
    **Support for Choreo Analytics has been deprecated:**
    Choreo Analytics has been deprecated in favor of Moesif-powered WSO2 Analytics, which offers enhanced insights and observability.

The following diagram illustrates the basic architecture of the Analytics solution.

<a href="../../../../assets/img/analytics/apim-analytics-simplified.jpg"><img src="../../../../assets/img/analytics/apim-analytics-simplified.jpg" width="70%" alt="APIM Analytics Simplified Design"></a>

As depicted above, the Gateways will publish analytics statistics directly to the Analytics Cloud over the internet. The Analytics Cloud will have regional deployments to reduce publishing latencies and honor data privacy.