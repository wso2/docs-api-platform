---
title: "Export Traces to Alternative Backends"
description: "Configure API Platform Gateway to export OpenTelemetry traces to alternative backends including Moesif, Datadog, and New Relic."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/alternative-backends/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/alternative-backends.md
tags:
  - api-gateway
  - observability
  - tracing
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Alternative Tracing Backends

While the default setup uses Jaeger, the gateway components use OpenTelemetry and can export to any OTLP-compatible backend.

## Moesif

Moesif provides API analytics and monitoring with support for OpenTelemetry traces. It treats each HTTP request/response span as an API event for detailed analytics.

**No additional Docker services required** - Moesif is a cloud-based SaaS platform. You only need to configure the OTLP Collector to export traces to Moesif's API.

### Configuration

Update the OTLP Collector configuration (`gateway/observability/otel-collector/config.yaml`) to export to Moesif:

```yaml
exporters:
  # Export to Moesif
  otlphttp:
    endpoint: https://api.moesif.net/v1/traces
    headers:
      X-Moesif-Application-Id: 'your-moesif-application-id'

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch, resource]
      exporters: [otlphttp]  # Send to Moesif
```

**Important Notes:**
- The endpoint uses HTTPS (not HTTP)
- Use the `otlphttp` exporter (not `otlp` which uses gRPC)
- The `X-Moesif-Application-Id` header is required for authentication

### Obtaining Your Moesif Application ID

1. Sign up for a Moesif account at [moesif.com](https://www.moesif.com)
2. Log in to your Moesif dashboard
3. Navigate to **Settings** → **Installation** or **API Keys**
4. Locate the **Collector Application ID** field
5. Copy your unique Application ID

### Using Environment Variables

For better security, use environment variables for the Application ID:

```yaml
exporters:
  otlphttp:
    endpoint: https://api.moesif.net/v1/traces
    headers:
      X-Moesif-Application-Id: '${MOESIF_APPLICATION_ID}'
```

Update `docker-compose.yaml` to pass the environment variable:

```yaml
otel-collector:
  image: otel/opentelemetry-collector:latest
  environment:
    - MOESIF_APPLICATION_ID=${MOESIF_APPLICATION_ID}
  # ... rest of configuration
```

Set the environment variable before starting:

```bash
export MOESIF_APPLICATION_ID=your-moesif-application-id
docker compose --profile tracing up -d
```

### Accessing Moesif Dashboard

After configuring and starting the gateway:

1. Navigate to [moesif.com](https://www.moesif.com) and log in
2. Go to **Events** → **Live Event Log** to see incoming API events
3. View API analytics, user behavior, and performance metrics
4. Use **Time Series** to analyze API usage trends
5. Set up **Alerts** for error rates, latency, or custom conditions

### Moesif Features

- **API Analytics**: Request volume, response times, error rates
- **User Tracking**: Identify and track API users across requests
- **Error Analysis**: Detailed error tracking with request/response bodies
- **Behavioral Cohorts**: Group users by API usage patterns
- **Custom Dashboards**: Build visualizations for your specific KPIs
- **Alerting**: Get notified of anomalies or threshold breaches

### Sending to Both Jaeger and Moesif

You can send traces to both Jaeger (for development) and Moesif (for analytics):

```yaml
exporters:
  # Local Jaeger for development
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true

  # Moesif for analytics
  otlphttp/moesif:
    endpoint: https://api.moesif.net/v1/traces
    headers:
      X-Moesif-Application-Id: '${MOESIF_APPLICATION_ID}'

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch, resource]
      exporters: [otlp/jaeger, otlphttp/moesif]
```

## Zipkin

Replace Jaeger with Zipkin:

```yaml
zipkin:
  image: openzipkin/zipkin:latest
  ports:
    - "9411:9411"
  networks:
    - gateway-network
```

Update OTLP Collector configuration to export to Zipkin:

```yaml
exporters:
  zipkin:
    endpoint: http://zipkin:9411/api/v2/spans
```

Access Zipkin UI at `http://localhost:9411`

## Grafana Tempo

For a Prometheus-style tracing backend:

```yaml
tempo:
  image: grafana/tempo:latest
  command: ["-config.file=/etc/tempo.yaml"]
  volumes:
    - ./observability/tempo/tempo.yaml:/etc/tempo.yaml
    - tempo-data:/tmp/tempo
  ports:
    - "3200:3200"   # Tempo HTTP
    - "4317:4317"   # OTLP gRPC
  networks:
    - gateway-network

grafana:
  image: grafana/grafana:latest
  environment:
    - GF_AUTH_ANONYMOUS_ENABLED=true
    - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
  ports:
    - "3000:3000"
  volumes:
    - ./observability/grafana/datasources.yaml:/etc/grafana/provisioning/datasources/datasources.yaml
  networks:
    - gateway-network
  depends_on:
    - tempo
```

Configure gateway to send directly to Tempo:
```yaml
tracing:
  endpoint: tempo:4317
```

## Cloud-Native Tracing Solutions

### AWS X-Ray

Configure OTLP Collector to export to AWS X-Ray:

```yaml
exporters:
  awsxray:
    region: us-east-1
    no_verify_ssl: false
```

Or use the AWS Distro for OpenTelemetry (ADOT) Collector:

```yaml
otel-collector:
  image: public.ecr.aws/aws-observability/aws-otel-collector:latest
  command: ["--config=/etc/otel-collector-config.yaml"]
  environment:
    - AWS_REGION=us-east-1
```

### Google Cloud Trace

Configure OTLP Collector to export to Google Cloud:

```yaml
exporters:
  googlecloud:
    project: your-gcp-project-id
    use_insecure: false
```

### Azure Monitor

Use Azure Monitor exporter:

```yaml
exporters:
  azuremonitor:
    instrumentation_key: "your-instrumentation-key"
```

### Datadog APM

Configure OTLP Collector to export to Datadog:

```yaml
exporters:
  datadog:
    api:
      key: ${DD_API_KEY}
      site: datadoghq.com
```

Or use Datadog Agent directly:

```yaml
datadog-agent:
  image: datadog/agent:latest
  environment:
    - DD_API_KEY=${DD_API_KEY}
    - DD_APM_ENABLED=true
    - DD_APM_NON_LOCAL_TRAFFIC=true
    - DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_GRPC_ENDPOINT=0.0.0.0:4317
  ports:
    - "4317:4317"
  networks:
    - gateway-network
```

Update gateway configuration:
```yaml
tracing:
  endpoint: datadog-agent:4317
```

### New Relic

Configure OTLP Collector to export to New Relic:

```yaml
exporters:
  otlphttp:
    endpoint: https://otlp.nr-data.net:4317
    headers:
      api-key: ${NEW_RELIC_LICENSE_KEY}
```

### Honeycomb

```yaml
exporters:
  otlp:
    endpoint: api.honeycomb.io:443
    headers:
      x-honeycomb-team: ${HONEYCOMB_API_KEY}
```

### Lightstep

```yaml
exporters:
  otlp:
    endpoint: ingest.lightstep.com:443
    headers:
      lightstep-access-token: ${LIGHTSTEP_ACCESS_TOKEN}
```

## Service Mesh Integration

If using a service mesh like Istio or Linkerd:

### Istio

Istio automatically generates traces for service-to-service communication. Configure gateway components to propagate trace context:

```yaml
tracing:
  enabled: true
  endpoint: istio-telemetry.istio-system:4317
```

### Linkerd

Linkerd integrates with Jaeger via OpenTelemetry:

```yaml
tracing:
  enabled: true
  endpoint: linkerd-collector.linkerd:4317
```
