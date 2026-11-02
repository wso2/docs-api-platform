---
title: "Observability"
description: "View logs and metrics in the API Control Plane, and collect logs and traces from the API Gateway."
slug: /observability
---

Observability is how you see what your API proxies and gateways are doing. From the API Platform Console you can read logs and metrics. On a Self-Hosted Gateway you can also collect component logs and traces with your own tools.

:::note
Observability is coming soon.
:::

## API Control Plane

| Task | Description |
|:-----|:------------|
| [Logs](../api-control-plane/logs.md) | Search organization-level gateway runtime logs, and filter them by type, environment, and log level. |
| [Metrics](../api-control-plane/metrics.md) | Track the health and resource usage of your gateways. |

## API Gateway

| Task | Description |
|:-----|:------------|
| [Observability](../api-gateway/observability.md) | View gateway logs and metrics from the console, and see what a Self-Hosted Gateway can collect. |
| [Gateway Logging](../hybrid-gateways/ai-gateway/observability/logging.md) | Send Self-Hosted Gateway component logs to a central logging stack, such as OpenSearch, Elastic, or Grafana Loki. |
| [Gateway Tracing](../hybrid-gateways/ai-gateway/observability/tracing.md) | Follow requests across the gateway components with OpenTelemetry, and export traces to a backend such as Jaeger. |
