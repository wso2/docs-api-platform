---
title: "Observability"
pagination_label: "Gateway Observability"
description: "View gateway logs, and collect logs and traces from Self-Hosted Gateways."
---

You can view gateway logs from the API Control Plane. For a Self-Hosted Gateway, you can also collect the logs and traces of its components with your own tools.

## In the API Control Plane

| Task | Description |
|:-----|:------------|
| [View gateway logs](../../api-control-plane/observability/logs.md) | Search the access and activity logs of your gateways, and filter them by environment and log level. |

## For a Self-Hosted Gateway

| Task | Description |
|:-----|:------------|
| [Collect gateway logs](./logging.md) | Send the logs of the gateway components to a central logging stack, such as OpenSearch, Elastic, or Grafana Loki. |
| [Trace requests](./tracing.md) | Follow requests across the gateway components with OpenTelemetry, and export traces to a backend such as Jaeger. |
