---
title: "Observability"
pagination_label: "Observability"
description: "View cloud runtime logs, alerts, and organization audit logs, API Control Plane logs, and logs and traces from the API Gateway."
slug: /observability
---

Observability is how you see what your applications, API proxies, and gateways are doing. From the WSO2 Cloud Console you can read application runtime logs, alerts, and organization audit logs. From the API Control Plane you can read gateway logs. On a Self-Hosted Gateway you can also collect component logs and traces with your own tools.

## WSO2 Cloud Console

Open **Observability** to see the runtime logs and alerts for the applications in that Organization.

| What you can view | Description |
|:------------------|:------------|
| **Runtime logs** | Logs that your applications wrote. Logs are kept for 3 days. Filter them by time range and log level. |
| **Alerts** | Alert history, alert rules for your components, and the channels that receive notifications. A channel can be a webhook or an email address. |
| **Audit logs** | Organization-level record of actions in the organization. Open **Audit logs** from the organization menu. |

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
