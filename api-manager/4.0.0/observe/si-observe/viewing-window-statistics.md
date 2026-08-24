---
title: "Viewing window statistics"
description: "View the Grafana dashboard that shows memory usage and latency statistics for Siddhi windows."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/observe/si-observe/viewing-window-statistics/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/observe/si-observe/viewing-window-statistics.md
tags:
  - api-manager
  - observe
  - si-observe
  - viewing-window-statistics
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Viewing Window Statistics

![Window statistics dashboard](../../assets/img/streaming/streaming-integrator-grafana-dashboard/window_statistics_dashboard.jpg)

This dashboard displays the following information for your Streaming Integrator deployment:

## Window Statistics Summary Table

![Window Statistics Summary Table](../../assets/img/streaming/window-statistics/window-statistics-summary.png)

This lists all the windows from all the Siddhi applications in your Streaming Integrator server. The table displays the following for each window:

- The Siddhi application in which the window is included

- The name of the window

- The amount of memory used by the window

- Latency of events in the window

- The throughput of events to the window
   
## Memory

![Window Memory](../../assets/img/streaming/window-statistics/window-memory.png)

This shows the memory usage of each window in your Streaming Integrator server.

## Latency

![Window Latency](../../assets/img/streaming/window-statistics/window-latency.png)

This shows the latency of each window in your Streaming Integrator server.

## Throughput

![Window Throughput](../../assets/img/streaming/window-statistics/window-throughput.png)

This shows the throughput of each window in your Streaming Integrator server.