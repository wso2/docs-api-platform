---
title: "Export Metrics to Alternative Backends"
description: "Export API Platform Gateway metrics to alternative backends including AWS CloudWatch, Datadog, and other Prometheus-compatible systems."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/alternative-backends/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/alternative-backends.md
tags:
  - api-gateway
  - observability
  - metrics
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Alternative Metrics Backends

While the default setup uses Prometheus and Grafana, the gateway components expose standard Prometheus metrics and can integrate with any Prometheus-compatible system.

## AWS CloudWatch

Use AWS Distro for OpenTelemetry (ADOT) to export metrics to CloudWatch:

```yaml
adot-collector:
  image: public.ecr.aws/aws-observability/aws-otel-collector:latest
  command: ["--config=/etc/otel-collector-config.yaml"]
  environment:
    - AWS_REGION=us-east-1
```

Configure ADOT collector to scrape Prometheus metrics and export to CloudWatch.

## Datadog

Use Datadog Agent to scrape Prometheus metrics:

```yaml
datadog-agent:
  image: datadog/agent:latest
  environment:
    - DD_API_KEY=${DD_API_KEY}
    - DD_METRICS_SCRAPER_ENABLED=true
    - DD_SCRAPE_SERVICE_CHECKS=true
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
  networks:
    - gateway-network
```

Configure Datadog to scrape gateway endpoints:
```yaml
instances:
  - prometheus_url: http://gateway-controller:9091/metrics
    namespace: gateway
    metrics:
      - gateway_controller_*
  - prometheus_url: http://policy-engine:9003/metrics
    namespace: policy_engine
    metrics:
      - policy_engine_*
```

## New Relic

Use New Relic's Prometheus remote write integration:

```yaml
prometheus:
  image: prom/prometheus:latest
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--remote.write.url=https://metric-api.newrelic.com/prometheus/v1/write?account_id=YOUR_ACCOUNT_ID'
    - '--remote.write.headers=X-Api-Key:YOUR_API_KEY'
```

## InfluxDB

Use Prometheus remote write to send metrics to InfluxDB:

```yaml
prometheus:
  image: prom/prometheus:latest
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--remote.write.url=http://influxdb:8086/api/v1/prom/write?db=prometheus'
```

## Elasticsearch

Use Metricbeat to ship Prometheus metrics to Elasticsearch:

```yaml
metricbeat:
  image: elastic/metricbeat:latest
  volumes:
    - ./metricbeat.yml:/usr/share/metricbeat/metricbeat.yml:ro
  environment:
    - ELASTICSEARCH_HOST=elasticsearch:9200
```

Configure Metricbeat to scrape Prometheus endpoints.

## Azure Monitor

Use Azure Monitor Agent with Prometheus scraping:

```yaml
azuremonitor-agent:
  image: mcr.microsoft.com/azuremonitor/metrics-adapter:latest
  environment:
    - AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
    - AZURE_TENANT_ID=${AZURE_TENANT_ID}
    - AZURE_CLIENT_SECRET=${AZURE_CLIENT_SECRET}
```

## Google Cloud Monitoring

Use Cloud Monitoring Prometheus sidecar:

```yaml
prometheus-to-monitoring:
  image: gcr.io/cloud-prometheus/prometheus-to-monitoring:latest
  environment:
    - GOOGLE_APPLICATION_CREDENTIALS=/var/secrets/google/key.json
  volumes:
    - ./key.json:/var/secrets/google/key.json:ro
```

## Grafana Cloud

Use Prometheus remote write to Grafana Cloud:

```yaml
prometheus:
  image: prom/prometheus:latest
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--remote.write.url=https://YOUR-PROMETHEUS-URL/api/v1/write'
    - '--remote.write.headers=Authorization:Bearer YOUR-API-KEY'
```

## VictoriaMetrics

VictoriaMetrics is a Prometheus-compatible time-series database:

```yaml
victoriametrics:
  image: victoriametrics/victoria-metrics:latest
  ports:
    - "8428:8428"
  volumes:
    - victoriametrics-data:/victoria-metrics-data
```

Configure Prometheus to remote write to VictoriaMetrics:
```yaml
prometheus:
  image: prom/prometheus:latest
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--remote.write.url=http://victoriametrics:8428/api/v1/write'
```

## Thanos

Thanos provides long-term storage and global query view for Prometheus:

```yaml
thanos-store:
  image: thanosio/thanos:latest
  ports:
    - "10901:10901"
  volumes:
    - prometheus-data:/prometheus

thanos-query:
  image: thanosio/thanos:latest
  ports:
    - "10902:10902"
  command:
    - 'query'
    - '--store=thanos-store:10901'
```

Configure Prometheus to upload blocks to Thanos object storage.
