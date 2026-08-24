---
title: "Overview of API analytics"
description: "Explains how WSO2 API Manager integrates with API Manager Analytics to provide reports, statistics, and alerts on deployed APIs."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/learn/analytics/overview-of-api-analytics/
md_url: https://wso2.com/api-platform/docs/api-manager/3.0.0/learn/analytics/overview-of-api-analytics.md
tags:
  - api-manager
  - learn
  - analytics
  - overview-of-api-analytics
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Overview of API Analytics

The API Manager integrates with API Manager Analytics to provide reports, statistics and graphs on the APIs deployed in 
WSO2 API Manager. You can then configure alerts to monitor these APIs and detect unusual activity, manage locations via
geo-location statistics and carry out a detailed analysis of the logs. WSO2 API Manager has an enhanced distribution of 
Analytics to cater to API Manager specific scenarios.

APIM Analytics consists of two components: **Worker** and **Dashboard**. The worker is the server that processes the data 
streams that are sent from WSO2 API Manager and publishes the statistics to a database. The dashboard reads the statistics 
published by the worker and displays the statistics on the dashboard. The worker and dashboard are connected through 
the database.

