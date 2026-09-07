---
title: "Gateway Metrics"
description: "Configure metrics collection for API Platform Gateway components using Prometheus and Grafana, with reference dashboards and alerting."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/overview.md
tags:
  - api-gateway
  - observability
  - devops
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-11
content_type: "how-to"
---

# Gateway Metrics

This guide explains how to implement and configure metrics collection for the API Platform Gateway components.

## Overview

The default metrics services included in the Docker Compose configuration are **demonstration services** designed to showcase how you can observe component metrics in a centralized setup. These services provide a reference implementation that you can use out-of-the-box for development, testing, or as a starting point for your production metrics strategy.

**Important**: You are free to choose any metrics or observability strategy that suits your environment and requirements. The provided setup is just one of many possible configurations.

## Metrics Architecture

The default metrics stack consists of:

- **Prometheus**: Scrapes, stores, and queries metrics from gateway components
- **Grafana**: Visualizes metrics through dashboards with alerts and notifications

### How It Works

1. Gateway components (gateway-controller, policy-engine, router) expose metrics via Prometheus HTTP endpoints
2. Prometheus scrapes these endpoints at regular intervals (default: 15s)
3. Metrics are stored in Prometheus's time-series database
4. Grafana queries Prometheus to visualize metrics through pre-built dashboards
5. Users can view real-time metrics, historical trends, and set up alerts

### What are Metrics?

Metrics are numerical measurements tracked over time:

- **Counters**: Cumulative values that only increase (e.g., total requests, total errors)
- **Gauges**: Current values that can go up or down (e.g., active connections, memory usage)
- **Histograms**: Sample observations with configurable buckets (e.g., request duration)

## In This Section

- [Enabling and Disabling Metrics](enabling-metrics.md) — Turn metrics on or off and run the demonstration metrics services
- [Viewing Metrics in Grafana](viewing-metrics-in-grafana.md) — Explore pre-built dashboards, create custom dashboards, and set up alerts
- [Prometheus Queries](prometheus-queries.md) — Useful PromQL queries for gateway controller, policy engine, and router
- [Configuration Options](configuration.md) — Scrape interval, custom endpoints, retention, and histogram buckets
- [Alternative Metrics Backends](alternative-backends.md) — Export metrics to CloudWatch, Datadog, New Relic, and other systems
- [Metric Reference](metric-reference.md) — Full list of metrics exposed by each gateway component
- [Best Practices and Troubleshooting](best-practices-and-troubleshooting.md) — Recommendations, common issues, and integration with logging and tracing

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Prometheus Querying Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboard Tutorial](https://grafana.com/docs/grafana/latest/dashboards/)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/naming/)
- [Gateway Overview](../../overview.md)
- [Gateway Logging Guide](../logging.md)
- [Gateway Tracing Guide](../tracing/overview.md)
- [Docker Compose Profiles](https://docs.docker.com/compose/profiles/)