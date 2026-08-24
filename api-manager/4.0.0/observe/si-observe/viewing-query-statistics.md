---
title: "Viewing sink statistics"
description: "View the Grafana dashboard that shows memory usage and latency statistics for Siddhi queries."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/observe/si-observe/viewing-query-statistics/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/observe/si-observe/viewing-query-statistics.md
tags:
  - api-manager
  - observe
  - si-observe
  - viewing-query-statistics
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Viewing Sink Statistics

![Query statistics dashboard](../../assets/img/streaming/streaming-integrator-grafana-dashboard/query_statistics_dashboard.jpg)

## Query Statistics Summary Table

![Query Statistics Summary Table](../../assets/img/streaming/query-statistics.png/query-statistics-summary.png)

This lists all the queries from all the Siddhi applications in your Streaming Integrator server. The table displays the following for each query:

- The Siddhi application in which the query is included

- The name of the query

- The amount of memory used by the query

- Latency of events in the query
   
## Memory

![Memory Usage per Query](../../assets/img/streaming/query-statistics.png/memory-usage-per-query.png)

This shows the memory usage of each query in your Streaming Integrator server.

## Latency

![Query Latency](../../assets/img/streaming/query-statistics.png/query-latency.png)

This shows the latency of each query in your Streaming Integrator server.