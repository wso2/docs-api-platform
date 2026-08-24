---
title: "Viewing query statistics"
description: "View the Grafana dashboard that shows summary and throughput statistics for Siddhi sink mappers."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/observe/si-observe/viewing-sink-statistics/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/observe/si-observe/viewing-sink-statistics.md
tags:
  - api-manager
  - observe
  - si-observe
  - viewing-sink-statistics
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Viewing Query Statistics

![Sink statistics dashboard](../../assets/img/streaming/streaming-integrator-grafana-dashboard/sink_statistics_dashboard.jpg)

This dashboard displays the following information for your current WSO2 Streaming Integrator deployment:

## Sink Mapper Statistics Summary Table

![Sink Statistics Summary](../../assets/img/streaming/sink-statistics.png/sink-statistics-summary.png)

This lists all the sink mappers from all the Siddhi applications in your Streaming Integrator server. The table displays the following for each sink mapper:

- The Siddhi application in which the sink mapper is included

- The stream to which the sink mapper is connected

- The type of the sink to which the mapper is connected

- The type of the mapper

- Latency of events in the mapper

- The throughput of events to the sink to which  the mapper is connected
   
## Sink Throughput

![Sink Throughput](../../assets/img/streaming/sink-statistics.png/sink-throughput.png)

This shows the throughput of each sink mapper in your Streaming Integrator server.

## Sink Mapper Latency

![Sink Latency](../../assets/img/streaming/sink-statistics.png/sink-latency.png)

This shows the latency of each sink mapper in your Streaming Integrator server.