---
title: "Gateway Tracing"
description: "Trace gateway requests with the demonstration OpenTelemetry and Jaeger stack, or export traces to your own OTLP backend."
---

A trace follows one request through the gateway. Each step is a span. Components pass the trace from one to the next with the W3C `traceparent` and `tracestate` headers.

The demonstration stack is an OpenTelemetry Collector and Jaeger. Components send spans to the collector on gRPC port 4317 or HTTP port 4318. The collector forwards them to Jaeger. You can send the same spans to any OTLP backend instead.

## Enable tracing

In `gateway/configs/config.toml`:

```toml
[tracing]
enabled = true                          # Set to true to enable tracing
endpoint = "otel-collector:4317"        # OTLP collector gRPC endpoint
service_version = "0.2.0"               # Service version
batch_timeout = "1s"                    # Batch timeout for exporting spans
max_export_batch_size = 512             # Maximum spans per batch
sampling_rate = 1.0                     # Sample rate (1.0 = 100%, 0.5 = 50%)
```

Start the gateway with the tracing services:

```bash
docker compose --profile tracing up -d
```

This starts **gateway-controller**, **policy-engine**, **router**, the OpenTelemetry Collector, and Jaeger.

To run the gateway without that stack:

```bash
docker compose up -d
```

:::note
If tracing is enabled and the collector is not running, the components log export warnings. Set `enabled = false` to turn tracing off. Jaeger keeps traces in memory, so stopping it drops them unless you add a storage backend.
:::

Stop the stack:

```bash
docker compose --profile tracing down
```

## View traces in Jaeger

1. Open `http://localhost:16686`.
2. Select a service: `policy-engine` or `router`.
3. Optionally select an operation, or leave it as all.
4. Set the lookback (5m, 15m, 1h, 6h, 12h, 1d, 2d, or custom). The default is the last hour.
5. Optionally filter by tags (for example `http.status_code=500`), duration, or result limit. The default limit is 20.
6. Click **Find Traces**.

Open a trace to see the timeline, how long each span took, and the parent and child spans. Open a span for its operation name, duration, tags, logs, and process.

- Slow requests: set a minimum duration, such as 1000ms, then **Find Traces**.
- Errors: filter with `error=true` or `http.status_code=500`.
- One request: search by the trace ID from a log line or a `traceparent` header.

Select traces and click **Compare Traces** to compare them. Click **Dependencies** to see which services called which.

## Change what is exported

Sample fewer requests:

```toml
[tracing]
sampling_rate = 0.1  # Sample 10% of requests
```

`1.0` samples every request. `0.5` samples half, `0.1` samples 10%, and `0.01` samples 1%. A lower rate costs less and can miss traces.

Set the service name:

```toml
[policy_engine]
service_name = "policy-engine-prod-us-east-1"
```

Change how spans are batched:

```toml
[tracing]
batch_timeout = "5s"            # Wait up to 5s before exporting
max_export_batch_size = 1024    # Export up to 1024 spans per batch
```

A shorter timeout shows traces sooner. A longer timeout sends fewer, larger batches.

## Send traces somewhere else

Keep the gateway endpoint pointed at an OTLP collector, and change the collector exporters. The collector file is `gateway/observability/otel-collector/config.yaml`.

### Moesif

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

Use the `otlphttp` exporter and HTTPS. The `X-Moesif-Application-Id` header is required.

To get the application ID, sign in at [moesif.com](https://www.moesif.com), open **Settings** → **Installation** or **API Keys**, and copy the **Collector Application ID**.

To pass the ID as an environment variable:

```yaml
exporters:
  otlphttp:
    endpoint: https://api.moesif.net/v1/traces
    headers:
      X-Moesif-Application-Id: '${MOESIF_APPLICATION_ID}'
```

```yaml
otel-collector:
  image: otel/opentelemetry-collector:latest
  environment:
    - MOESIF_APPLICATION_ID=${MOESIF_APPLICATION_ID}
  # ... rest of configuration
```

```bash
export MOESIF_APPLICATION_ID=your-moesif-application-id
docker compose --profile tracing up -d
```

In Moesif, open **Events** → **Live Event Log**. **Time Series** shows usage over time, and **Alerts** covers error rate, latency, and custom conditions.

Send to Jaeger and Moesif together:

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

### Zipkin

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

Open Zipkin at `http://localhost:9411`.

### Grafana Tempo

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

```yaml
tracing:
  endpoint: tempo:4317
```

### AWS X-Ray

```yaml
exporters:
  awsxray:
    region: us-east-1
    no_verify_ssl: false
```

Or use the AWS Distro for OpenTelemetry collector:

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

### Datadog
Configure OTLP Collector to export to Datadog:

```yaml
exporters:
  datadog:
    api:
      key: ${DD_API_KEY}
      site: datadoghq.com
```

Or use the Datadog Agent:

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

### Istio and Linkerd

```yaml
tracing:
  enabled: true
  endpoint: istio-telemetry.istio-system:4317
```

```yaml
tracing:
  enabled: true
  endpoint: linkerd-collector.linkerd:4317
```

## Collector configuration

`gateway/observability/otel-collector/config.yaml` has receivers, processors, exporters, and a pipeline that connects them.

Receive OTLP:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
```

Process spans:

```yaml
processors:
  # Batch spans for efficiency
  batch:
    timeout: 1s
    send_batch_size: 1024

  # Add resource attributes
  resource:
    attributes:
      - key: environment
        value: production
        action: upsert
      - key: cluster
        value: us-west-2
        action: upsert

  # Memory limiter to prevent OOM
  memory_limiter:
    check_interval: 1s
    limit_mib: 512

  # Sampling processor
  probabilistic_sampler:
    sampling_percentage: 10  # Sample 10% of traces
```

Export them:

```yaml
exporters:
  # Send to Jaeger
  otlp:
    endpoint: jaeger:4317
    tls:
      insecure: true

  # Debug output to console
  debug:
    verbosity: detailed
    sampling_initial: 5
    sampling_thereafter: 200
```

```yaml
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch, resource]
      exporters: [otlp, debug]
```

Send one pipeline to several backends:

```yaml
exporters:
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true

  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: true

  datadog:
    api:
      key: ${DD_API_KEY}

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp/jaeger, otlp/tempo, datadog]
```

Keep error traces, slow traces, and a sample of the rest:

```yaml
processors:
  tail_sampling:
    policies:
      - name: error-traces
        type: status_code
        status_code:
          status_codes: [ERROR]
      - name: slow-traces
        type: latency
        latency:
          threshold_ms: 1000
      - name: probabilistic
        type: probabilistic
        probabilistic:
          sampling_percentage: 10
```

## Pass a trace through the gateway

Omit `traceparent` and the gateway starts a new trace. To continue a trace you already have:

```bash
curl http://localhost:8080/weather/v1.0/us/seattle \
  -H "traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01"
```

## Choose a sampling rate

| Traffic Volume | Sampling Rate | Use Case |
|---------------|---------------|----------|
| &lt; 100 req/s | 100% (1.0) | Full visibility, low overhead |
| 100-1000 req/s | 10-50% (0.1-0.5) | Balanced visibility and cost |
| 1000-10000 req/s | 1-10% (0.01-0.1) | Cost-effective, statistical sampling |
| > 10000 req/s | 0.1-1% (0.001-0.01) | Minimal overhead, error sampling |

Use tail sampling if you want every error trace kept while ordinary traffic is sampled. In production, use TLS on the collector connection and a memory limit on the collector.

## Troubleshooting

### No traces in Jaeger

1. Confirm tracing is on:

```bash
cat gateway/configs/config.toml | grep -A5 "tracing"
```

`enabled` must be `true`.

2. Confirm the collector and Jaeger are running:

```bash
docker ps | grep otel-collector
```

```bash
docker ps | grep jaeger
curl http://localhost:16686/
```

3. Read the collector and component logs:

```bash
docker logs otel-collector
```

```bash
docker logs policy-engine | grep -i trace
docker logs gateway-controller | grep -i trace
```

4. Check that the containers can reach each other:

```bash
docker exec policy-engine ping otel-collector
docker exec otel-collector ping jaeger
```

If spans are missing, the sampling rate may be too low, a component may not be exporting, or the `traceparent` header may have been dropped. Clock skew across containers shows up as wrong span times.

### Export uses too much CPU or network

```toml
[tracing]
sampling_rate = 0.1  # Reduce from 1.0 to 0.1
```

```toml
[tracing]
batch_timeout = "5s"
max_export_batch_size = 2048
```

### Jaeger UI does not open

```bash
docker ps | grep jaeger
```

```bash
docker logs jaeger
```

```bash
curl http://localhost:16686/
```

Port 16686 must be reachable on the host.

## Turn tracing off

In `gateway/configs/config.toml`:

```toml
[policy_engine.tracing]
enabled = false

[tracing]
enabled = false
```

```bash
docker compose restart gateway-controller policy-engine router
```

Router tracing follows the gateway-controller configuration, so it stops when that configuration is applied.

## Match a trace to a log

Log lines include `trace_id` and `span_id`. Copy the trace ID into Jaeger, or copy a Jaeger trace ID into the log search.

```json
{
  "level": "info",
  "ts": "2025-12-19T10:30:45.456Z",
  "msg": "Policy executed",
  "trace_id": "0af7651916cd43dd8448eb211c80319c",
  "span_id": "b7ad6b7169203331",
  "policy": "modify-headers"
}
```

Run both stacks together:

```bash
docker compose --profile logging --profile tracing up -d
```

See [Gateway Logging](./logging.md).

## Additional resources

- [OpenTelemetry](https://opentelemetry.io/docs/)
- [Jaeger](https://www.jaegertracing.io/docs/)
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [Docker Compose profiles](https://docs.docker.com/compose/profiles/)
