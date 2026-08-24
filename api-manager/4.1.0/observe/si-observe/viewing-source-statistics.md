---
title: "Viewing source statistics"
description: "Interpret the source statistics dashboard showing source mapper throughput and latency for Siddhi applications."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/observe/si-observe/viewing-source-statistics/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/observe/si-observe/viewing-source-statistics.md
tags:
  - api-manager
  - observe
  - si-observe
  - viewing-source-statistics
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Viewing Source Statistics

![Source statistics dashboard](../../assets/img/streaming/streaming-integrator-grafana-dashboard/source_statistics_dashboard.jpg)

This dashboard displays the following information for your Streaming Integrator deployment:

## Source Mapper Statistics Summary Table

![Source Statistics Summary](../../assets/img/streaming/source-statistics.png/source-statistics-summary.png)

This lists all the source mappers from all the Siddhi applications in your Streaming Integrator server. The table displays the following for each source mapper:

- The Siddhi application in which the source mapper is included

- The stream to which the source mapper is connected

- The type of the source to which the mapper is connected

- The type of the mapper

- Latency of events in the mapper

- The throughput of events to the source to which the mapper is connected
   
## Source Throughput

![Source Throughput](../../assets/img/streaming/source-statistics.png/source-throughput.png)

This shows the throughput of each source mapper in your Streaming Integrator server.

## Source Mapper Latency

![Source Latency](../../assets/img/streaming/source-statistics.png/source-latency.png)

This shows the latency of each source mapper in your Streaming Integrator server.