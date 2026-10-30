---
title: "Observability"
description: "Track the health of your gateways, view gateway logs, and collect logs and traces from Self-Hosted Gateways."
---

You can track how your gateways behave from the API Platform Console. For a Self-Hosted Gateway, you can also collect the logs and traces of its components with your own tools.

## In the API Platform Console

| Task | Description |
|:-----|:------------|
| [View gateway metrics](../monitoring-and-analytics/gateway-metrics.md) | Track the health and resource usage of your gateways. |
| [View gateway logs](../observability-and-insights/runtime-logs.md) | Search the access and activity logs of your gateways, and filter them by environment and log level. |
| [Get alerts](../monitoring-and-analytics/alerts.md) | Get notified when your gateways need attention. |

## For a Self-Hosted Gateway

| Task | Description |
|:-----|:------------|
| [Collect gateway logs](../hybrid-gateways/ai-gateway/observability/logging.md) | Send the logs of the gateway components to a central logging stack, such as OpenSearch, Elastic, or Grafana Loki. |
| [Trace requests](../hybrid-gateways/ai-gateway/observability/tracing.md) | Follow requests across the gateway components with OpenTelemetry, and export traces to a backend such as Jaeger. |

For all the observability features of API Platform Cloud, see [Observability](../observability/overview.md).
