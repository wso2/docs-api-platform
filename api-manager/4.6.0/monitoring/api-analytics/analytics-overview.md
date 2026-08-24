---
title: "API analytics overview"
description: "Inbound, outbound, and AI analytics data collected in WSO2 API Manager, and the platforms available for monitoring API traffic."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/monitoring/api-analytics/analytics-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/monitoring/api-analytics/analytics-overview.md
tags:
  - api-manager
  - monitoring
  - api-analytics
  - analytics-overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "concept"
---

!!! info "New in 4.6.0 — Moesif-powered WSO2 Analytics replaces Choreo Analytics for enhanced insights and observability."

# API Analytics Overview

API Manager analytics provides insights into API usage, performance, and other key metrics to help API publishers and consumers make informed decisions. The analytics dashboard provides a comprehensive view of the API traffic, user engagement, and other relevant data. This section provides an overview of the analytics features available in WSO2 API Manager and guidance on how to use them effectively.

## Architecture

<a href="../../../assets/img/analytics/analytics-architecture.png" >
  <img src="../../../assets/img/analytics/analytics-architecture.png" width="60%" alt="APIM Analytics Architecture"/>
</a>

Analytics architecture consists of the following components

- **Inbound Analytics**
- **Outbound Analytics**
    - **AI Analytics**

### Inbound Analytics

As the above diagram shows, Inbound Analytics consists of analytics data that are collected between the user and API Proxy. This includes `apiContext`, `proxyResponseCode`, `apiType` etc.

### Outbound Analytics

Outbound Analytics consists of data collected between the API Proxy and the backend service. This includes `targetResponseCode`, `backendLatency`, `destination`, etc.

#### AI Analytics

AI Analytics shows the Outbound analytics data that are specific to AI APIs. This includes `aiTokenUsage`, `vendorName`, `vendorVersion`, `model`, `promptTokens`, `completionTokens` and `totalTokens`.

WSO2 API Manager supports multiple platforms to monitor and analyze API traffic. This includes:

- [**WSO2 Moesif Analytics**](moesif-analytics/moesif-integration-guide.md) - Default analytics platform integrated with WSO2 API Manager. A Powerful platform to monitor and analyze API traffic.
- [**ELK Based Analytics**](on-prem/elk-installation-guide.md) - Native support for Elasticsearch, Logstash, and Kibana (ELK) stack to monitor and analyze API traffic.
- [**OpenSearch Based Analytics**](on-prem/opensearch-installation-guide.md) - Native support for OpenSearch to monitor and analyze API traffic.
- [**DataDog Based Analytics**](on-prem/datadog-installation-guide.md) - Integration with DataDog to monitor and analyze API traffic.