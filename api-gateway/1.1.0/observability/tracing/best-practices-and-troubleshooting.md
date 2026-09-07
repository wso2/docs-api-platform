---
title: "Tracing Best Practices and Troubleshooting"
description: "Best practices for distributed tracing in API Platform Gateway: sampling strategies, production recommendations, and troubleshooting guidance."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/best-practices-and-troubleshooting/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/best-practices-and-troubleshooting.md
tags:
  - api-gateway
  - observability
  - tracing
  - troubleshooting
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Best Practices and Troubleshooting

## Best Practices

### Development
- Use 100% sampling rate (`sampling_rate: 1.0`)
- Enable debug output in OTLP collector
- Use Jaeger for quick trace visualization
- Keep trace data for 1-7 days

### Production
- **Use managed services** (Datadog, New Relic, etc.) to reduce operational overhead
- **Implement appropriate sampling** (1-10% depending on traffic volume)
- **Enable TLS** for OTLP connections
- **Set resource limits** on OTLP collector
- **Monitor collector health** and performance
- **Implement trace retention policies** based on compliance and storage costs
- **Use tail-based sampling** to keep important traces (errors, slow requests)

### Security
- Enable TLS for trace transmission
- Sanitize sensitive data from trace attributes
- Implement proper access controls for trace viewing
- Regularly audit who accesses trace data
- Consider data residency requirements

### Performance
- Use appropriate sampling rates to balance visibility and overhead
- Configure batch settings to optimize network usage
- Monitor gateway component overhead from tracing
- Use asynchronous trace export (default with OTLP)
- Consider using tail-based sampling for high-volume environments

### Sampling Strategy

Choose sampling based on traffic volume:

| Traffic Volume | Sampling Rate | Use Case |
|---------------|---------------|----------|
| < 100 req/s | 100% (1.0) | Full visibility, low overhead |
| 100-1000 req/s | 10-50% (0.1-0.5) | Balanced visibility and cost |
| 1000-10000 req/s | 1-10% (0.01-0.1) | Cost-effective, statistical sampling |
| > 10000 req/s | 0.1-1% (0.001-0.01) | Minimal overhead, error sampling |

**Note:** Always use 100% sampling for errors using tail-based sampling.

## Troubleshooting

### Traces Not Appearing in Jaeger

**1. Verify tracing is enabled in configuration:**
```bash
cat gateway/configs/config.toml | grep -A5 "tracing"
```

Ensure `enabled = true`.

**2. Check OTLP Collector is running:**
```bash
docker ps | grep otel-collector
```

**3. View OTLP Collector logs:**
```bash
docker logs otel-collector
```

Look for connection errors or export failures.

**4. Check Jaeger is running:**
```bash
docker ps | grep jaeger
curl http://localhost:16686/
```

**5. Verify network connectivity:**
```bash
docker exec policy-engine ping otel-collector
docker exec otel-collector ping jaeger
```

**6. Check gateway component logs for trace export errors:**
```bash
docker logs policy-engine | grep -i trace
docker logs gateway-controller | grep -i trace
```

### Traces Are Incomplete or Missing Spans

**1. Check sampling rate** - ensure it's not too low
**2. Verify all components are configured** to export traces
**3. Check for trace context propagation issues** - ensure headers are preserved
**4. Look for timeout errors** in OTLP collector logs

### High Trace Export Overhead

**1. Reduce sampling rate:**
```toml
[tracing]
sampling_rate = 0.1  # Reduce from 1.0 to 0.1
```

**2. Increase batch size:**
```toml
[tracing]
batch_timeout = "5s"
max_export_batch_size = 2048
```

**3. Use tail-based sampling** in OTLP collector to sample only important traces

### Traces Have Incorrect Timing

- **Ensure system clocks are synchronized** across all containers (use NTP)
- **Check for clock skew** in trace timeline view
- **Verify trace context propagation** is working correctly

### Cannot Access Jaeger UI

**1. Verify Jaeger is running:**
```bash
docker ps | grep jaeger
```

**2. Check Jaeger logs:**
```bash
docker logs jaeger
```

**3. Ensure port 16686 is not blocked:**
```bash
curl http://localhost:16686/
```

## Integration with Logging

Traces and logs work together for comprehensive observability:

### Correlating Traces and Logs

1. **Trace ID in Logs**: Gateway components include trace IDs in log entries
2. **Find Trace from Log**: Copy trace ID from log entry and search in Jaeger
3. **Find Logs from Trace**: Copy trace ID from Jaeger and search in log viewer

Example log entry with trace ID:
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

### Using Both Stacks

Enable both logging and tracing profiles:

```bash
docker compose --profile logging --profile tracing up -d
```

This provides complete observability:
- **Traces**: Request flow and performance
- **Logs**: Detailed event information and debugging
