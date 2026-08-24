---
title: "Default ports of WSO2 API-M analytics"
description: "The specific ports used by WSO2 API-M Analytics, listed for firewall configuration and for avoiding conflicts with other products."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/learn/analytics/default-ports-of-wso2-api-m-analytics/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/learn/analytics/default-ports-of-wso2-api-m-analytics.md
tags:
  - api-manager
  - learn
  - analytics
  - default-ports-of-wso2-api-m-analytics
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-22
content_type: "reference"
---

# Default Ports of WSO2 API-M Analytics

Given below are the specific ports used by WSO2 API-M Analytics.

-   7712 - Thrift SSL port for secure transport, where the client(gateway) is authenticated to use WSO2 API-M Analytics.
-   7612 - Thrift TCP port where WSO2 API-M Analytics receives events from clients(gateways).
-   7444 - The default port for the Siddhi Store REST API.
-   9444 - MSF4J HTTPS Port used to upload analytics data from the microgateway.
-   9643 - Default port for the analytics dashboard portal. 