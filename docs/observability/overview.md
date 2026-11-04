---
title: "Observability"
pagination_label: "Observability"
description: "View logs in the API Control Plane, and collect logs and traces from the API Gateway."
slug: /observability
---

Observability is how you see what your API proxies and gateways are doing. From the API Management Console you can read logs. On a Self-Hosted Gateway you can also collect component logs and traces with your own tools.

## API Control Plane

| Task | Description |
|:-----|:------------|
| [Logs](../api-control-plane/observability/logs.md) | Search organization-level gateway runtime logs, and filter them by type, environment, and log level. |

## API Gateway

| Task | Description |
|:-----|:------------|
| [Observability](../api-gateway/observability/overview.md) | View gateway logs from the console, and see what a Self-Hosted Gateway can collect. |
| [Gateway Logging](../api-gateway/observability/logging.md) | Send Self-Hosted Gateway component logs to a central logging stack, such as OpenSearch, Elastic, or Grafana Loki. |
| [Gateway Tracing](../api-gateway/observability/tracing.md) | Follow requests across the gateway components with OpenTelemetry, and export traces to a backend such as Jaeger. |
