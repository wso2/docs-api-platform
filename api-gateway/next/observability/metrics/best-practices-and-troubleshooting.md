---
title: "Metrics Best Practices and Troubleshooting"
description: "Best practices for correlating API Platform Gateway metrics with logs and traces, and guidance for troubleshooting common metrics issues."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/best-practices-and-troubleshooting/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/best-practices-and-troubleshooting.md
tags:
  - api-gateway
  - observability
  - metrics
  - troubleshooting
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Best Practices and Troubleshooting

## Integration with Logging and Tracing

Metrics, logs, and traces work together for comprehensive observability:

### Correlating Metrics with Logs

1. **Correlation IDs**: Gateway components include request IDs in both logs and metrics
2. **Find Logs from Metrics**: Use metric labels to filter logs (e.g., API name, route)
3. **Find Metrics from Logs**: Copy request IDs from logs and query metrics with labels

Example: If you see errors in logs for a specific API, query metrics for that API:
```promql
gateway_controller_api_operations_total{api_name="Weather-API", status="failure"}
```

### Correlating Metrics with Traces

Metrics and traces share labels for correlation:
- Trace IDs are included in log entries
- You can search traces by API name or route
- Span attributes include metric labels

### Using All Three Stacks

Enable all observability profiles:
```bash
docker compose --profile logging --profile tracing --profile metrics up -d
```

This provides:
- **Metrics**: Quantitative measurements and alerting
- **Traces**: Request flow and performance debugging
- **Logs**: Detailed event information and error context

## Best Practices

### Development
- Use default scrape interval (15s) for reasonable granularity
- Keep short retention (7-15 days) to save disk space
- Enable debug logging for troubleshooting
- Use Grafana dashboards for real-time monitoring

### Production
- **Adjust scrape intervals** based on traffic:
  - Low traffic (<100 req/s): 15s interval
  - Medium traffic (100-1000 req/s): 10s interval
  - High traffic (>1000 req/s): 5s interval
- **Configure appropriate retention**:
  - Short-term (hot): 7-30 days
  - Medium-term (warm): 90 days
  - Long-term (cold): 1+ years (use Thanos or remote write)
- **Set up alerts** for critical metrics:
  - Error rate > 5%
  - 95th percentile latency > 1s
  - Memory usage > 80%
  - Active streams approaching limit
- **Use recording rules** for frequently queried metrics:
  ```yaml
  groups:
    - name: recording_rules
      interval: 30s
      rules:
        - record: gateway:api_error_rate_5m
          expr: |
            rate(gateway_controller_api_operations_total{status="failure"}[5m]) /
            rate(gateway_controller_api_operations_total[5m])
  ```
- **Monitor Prometheus itself**:
  - Scrape duration
  - Rule evaluation time
  - Storage usage
  - Query performance

### Security
- **Restrict metrics endpoints** in production
- **Enable authentication** for Grafana
- **Use TLS** for metrics endpoints (if exposed externally)
- **Sanitize sensitive data** from metrics
- **Implement access controls** for dashboards
- **Regularly audit** dashboard and alert permissions

### Performance
- **Optimize PromQL queries**:
  - Use rate() for counters over time ranges
  - Use histogram_quantile() for percentiles
  - Avoid high-cardinality labels (e.g., user IDs)
- **Use recording rules** for expensive queries
- **Limit dashboard refresh rates** (30s minimum)
- **Prune unused metrics** to reduce cardinality
- **Compress metric names** to reduce storage

### Metric Cardinality

Avoid high-cardinality labels (millions of unique values):

**Good** (low cardinality):
```promql
gateway_controller_api_operations_total{route="/weather/v1"}
```

**Bad** (high cardinality):
```promql
gateway_controller_api_operations_total{user_id="12345"}
```

### Query Optimization

**Use time ranges**:
```promql
# Bad: No time range (prometheus returns default)
gateway_controller_api_operations_total

# Good: Explicit rate over 5 minutes
rate(gateway_controller_api_operations_total[5m])
```

**Use subqueries efficiently**:
```promql
# Bad: Outer query has range, inner query has range
rate(rate(gateway_controller_http_request_duration_seconds_sum[5m])[10m:1m])

# Good: Single rate call
rate(gateway_controller_http_request_duration_seconds_sum[5m])
```

## Troubleshooting

### Metrics Not Appearing in Grafana

**1. Verify metrics are enabled in configuration:**
```bash
grep -A5 "metrics" gateway/configs/config.toml
```

Ensure `enabled = true`.

**2. Check Prometheus is running:**
```bash
docker ps | grep prometheus
curl http://localhost:9092/-/healthy
```

**3. Verify Prometheus configuration:**
```bash
docker exec prometheus cat /etc/prometheus/prometheus.yml
```

**4. Check Prometheus targets:**
- Navigate to <http://localhost:9092/targets>
- Verify all endpoints are "UP" (green)
- If endpoints are "DOWN", check:
  - Container is running
  - Port is accessible from Prometheus container
  - Metrics endpoint is responding

**5. Test metrics endpoint directly:**
```bash
curl http://localhost:9091/metrics | head -20  # Gateway Controller
curl http://localhost:9003/metrics | head -20  # Policy Engine
```

**6. Check Grafana data source:**
- Navigate to <http://localhost:3000/connections/datasources>
- Verify Prometheus data source is configured
- Test connection should succeed

**7. Verify network connectivity:**
```bash
docker exec prometheus wget -O- gateway-controller:9091/metrics
docker exec prometheus wget -O- policy-engine:9003/metrics
```

### High Cardinality Metrics

**Symptoms:**
- Prometheus memory usage constantly increasing
- Slow query performance
- Many unique label value combinations

**Diagnosis:**
```bash
# Check metric cardinality
curl http://localhost:9091/metrics | wc -l  # Count metric lines
```

**Solutions:**
- Remove high-cardinality labels (user IDs, session IDs, etc.)
- Use histogram buckets instead of labels
- Aggregate before labeling

### Missing Metrics

**1. Check if metric name changed** (after component update)
```bash
curl http://localhost:9091/metrics | grep "gateway_controller_" | head -20
```

**2. Verify metrics are being scraped**
```promql
# Prometheus query to check if metric exists
up{job="gateway-controller"}
```

**3. Check component logs for metrics errors:**
```bash
docker logs gateway-controller | grep -i metric
docker logs policy-engine | grep -i metric
```

### Grafana Dashboards Not Loading

**1. Verify Grafana is running:**
```bash
docker ps | grep grafana
curl http://localhost:3000/api/health
```

**2. Check Grafana logs:**
```bash
docker logs grafana
```

**3. Verify data source configuration:**
- Navigate to <http://localhost:3000/connections/datasources>
- Check Prometheus URL: `http://prometheus:9090`
- Test connection

**4. Clear browser cache and reload dashboard**

**5. Re-import dashboards:**
```bash
# Navigate to Dashboards → Import
# Upload JSON files from ./observability/grafana/dashboards/
```

### High Memory Usage

**1. Check Prometheus memory usage:**
```bash
docker stats prometheus
```

**2. Review retention settings:**
```bash
docker exec prometheus cat /etc/prometheus/prometheus.yml | grep retention
```

**3. Check metric cardinality:**
```promql
# Count unique metric label combinations
count by (__name__) ({__name__=~".+"})
```

**4. Reduce retention:**
```yaml
command:
  - '--storage.tsdb.retention.time=7d'
  - '--storage.tsdb.retention.size=2GB'
```

**5. Use Thanos or remote write** for long-term storage

### Slow Queries

**1. Identify slow queries:**
```promql
# Check query duration in Prometheus UI
# Navigate to http://localhost:9092/graph
# Run query and check execution time
```

**2. Optimize queries:**
- Use rate() instead of raw counters
- Use proper time ranges
- Avoid high-cardinality labels
- Use recording rules for common queries

**3. Increase Prometheus resources:**
```yaml
prometheus:
  image: prom/prometheus:latest
  deploy:
    resources:
      limits:
        memory: 4G
        cpus: '2'
```

### Metric Values Not Updating

**1. Check if metrics are counters with rate:**
```promql
# Counter without rate (shows cumulative total)
gateway_controller_api_operations_total

# Counter with rate (shows rate of change)
rate(gateway_controller_api_operations_total[5m])
```

**2. Verify scrape configuration:**
```bash
docker exec prometheus cat /etc/prometheus/prometheus.yml | grep -A5 job_name
```

**3. Check component is receiving traffic:**
```promql
rate(gateway_controller_api_operations_total[5m]) > 0
```
