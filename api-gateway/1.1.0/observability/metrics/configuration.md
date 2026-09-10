---
title: "Metrics Configuration Options"
description: "Configure Prometheus scrape intervals and custom metrics endpoints for API Platform Gateway components."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/configuration/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/configuration.md
tags:
  - api-gateway
  - observability
  - metrics
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "reference"
---

# Configuration Options

## Adjusting Scrape Interval

To reduce metrics collection overhead or increase granularity, adjust the Prometheus scrape interval:

Edit `gateway/observability/prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s  # Change to 5s for higher granularity, 60s for lower overhead
  evaluation_interval: 15s
```

Restart Prometheus after changes:
```bash
docker compose restart prometheus
```

## Custom Metrics Endpoints

You can add additional metrics endpoints to scrape from:

```yaml
scrape_configs:
  - job_name: 'custom-service'
    static_configs:
      - targets: ['custom-service:8080']
    metrics_path: /metrics
    scrape_interval: 30s
```

## Metric Retention

Configure how long Prometheus retains metrics:

```yaml
command:
  - '--config.file=/etc/prometheus/prometheus.yml'
  - '--storage.tsdb.path=/prometheus'
  - '--web.enable-lifecycle'
  - '--storage.tsdb.retention.time=30d'  # Keep metrics for 30 days
  - '--storage.tsdb.retention.size=10GB'  # Keep up to 10GB of metrics
```

## Custom Bucket Configuration

Gateway components use optimized bucket configurations for histograms:

**Request Duration Buckets**:
- Gateway Controller: `[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]`
- Policy Engine: `[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5]`

**Policy Execution Buckets**:
- `[0.0001, 0.0005, 0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5]`

**Deployment Latency Buckets**:
- `[0.1, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0, 60.0]`
