---
title: "Prometheus Queries"
description: "Useful PromQL queries for monitoring API Platform Gateway controller, router, and policy engine metrics."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/prometheus-queries/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/prometheus-queries.md
tags:
  - api-gateway
  - observability
  - metrics
  - prometheus
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "reference"
---

# Prometheus Queries

You can query Prometheus directly at <http://localhost:9092> to create custom visualizations or debug issues.

## Useful Queries

### Gateway Controller

**Total API Operations**:
```promql
rate(gateway_controller_api_operations_total[5m])
```

**API Operations by Status**:
```promql
rate(gateway_controller_api_operations_total[5m]) by (status)
```

**Deployment Latency Percentiles**:
```promql
histogram_quantile(0.95, rate(gateway_controller_deployment_latency_seconds_bucket[5m]))
```

**xDS Clients Connected**:
```promql
gateway_controller_xds_clients_connected
```

**Database Operation Rate**:
```promql
rate(gateway_controller_database_operations_total[5m])
```

**Memory Usage**:
```promql
gateway_controller_memory_bytes
```

**HTTP Request Duration**:
```promql
histogram_quantile(0.99, rate(gateway_controller_http_request_duration_seconds_bucket[5m]))
```

### Policy Engine

**Request Rate**:
```promql
rate(policy_engine_requests_total[5m])
```

**Policy Execution Rate**:
```promql
rate(policy_engine_policy_executions_total[5m])
```

**Policy Execution Success Rate**:
```promql
rate(policy_engine_policy_executions_total{status="success"}[5m]) /
rate(policy_engine_policy_executions_total[5m])
```

**Average Request Duration**:
```promql
rate(policy_engine_request_duration_seconds_sum[5m]) /
rate(policy_engine_request_duration_seconds_count[5m])
```

**Active Streams**:
```promql
policy_engine_active_streams
```

**Error Rate**:
```promql
rate(policy_engine_request_errors_total[5m])
```

### Router (Envoy)

**Request Rate**:
```promql
rate(envoy_http_internal_requests_total[5m])
```

**Request Duration**:
```promql
histogram_quantile(0.99, rate(envoy_http_request_duration_seconds_bucket[5m]))
```

**Upstream 5xx Errors**:
```promql
rate(envoy_http_upstream_rq_xx{envoy_response_flags="upstream_connect_fail"}[5m])
```
