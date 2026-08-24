---
title: "Viewing table statistics"
description: "View the table statistics dashboard showing operations, latency, and throughput for Siddhi tables."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/observe/si-observe/viewing-table-statistics/
md_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/observe/si-observe/viewing-table-statistics.md
tags:
  - api-manager
  - observe
  - si-observe
  - viewing-table-statistics
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-18
content_type: "reference"
---

# Viewing Table Statistics

![Table statistics dashboard](../../assets/img/streaming/streaming-integrator-grafana-dashboard/table_statistics_dashboard.jpg)

This dashboard displays the following information for your Streaming Integrator deployment:

## Table Statistics Summary Table

![Table Statistics Summary](../../assets/img/streaming/table-statistics.png/table-statistics-summary.png)

This lists all the table operations defined in all the Siddhi applications in your Streaming Integrator server. The table displays the following for each operation:

!!! info
    When multiple operations are performed on the same table, each operation appears as a separate entry.
   
   - The Siddhi application in which the table is included
   
   - The name of the table
   
   - The operation that was performed on the table
   
   - Latency of events in the table
   
   - The throughput of events to/from the table
   
## Latency

![Table Latency](../../assets/img/streaming/table-statistics.png/table-latency.png)

This shows the latency of each table operation in your Streaming Integrator server.

## Throughput

![Table Throughput](../../assets/img/streaming/table-statistics.png/table-throughput.png)

This shows the throughput of each table operation in your Streaming Integrator server.