# Analytics

This guide explains how to monitor and analyze API traffic for your Self-Hosted Gateway using API Platform's analytics capabilities.

## Overview

API Platform provides comprehensive analytics for your Self-Hosted Gateway, giving you visibility into API usage, performance, and errors. Analytics data is collected from your gateway and displayed in the API Platform Console.

## Viewing Analytics

To view analytics for your Self-Hosted Gateway:

1. Sign in to the [API Platform Console](https://console.bijira.dev).
2. Select your organization and project.
3. In the left navigation, go to **Insights** and select **API Insights**.
4. Select the environment associated with your Self-Hosted Gateway.

## Analytics Dashboard

The analytics dashboard provides key metrics:

### Traffic Metrics

| Metric | Description |
|--------|-------------|
| **Total Requests** | Total number of API requests processed |
| **Requests per Second** | Current request throughput |
| **Unique Consumers** | Number of unique API consumers |
| **Top APIs** | Most frequently called APIs |

### Performance Metrics

| Metric | Description |
|--------|-------------|
| **Average Latency** | Average response time in milliseconds |
| **P95 Latency** | 95th percentile response time |
| **P99 Latency** | 99th percentile response time |
| **Backend Time** | Time spent waiting for backend responses |

### Error Metrics

| Metric | Description |
|--------|-------------|
| **Error Rate** | Percentage of failed requests |
| **4xx Errors** | Client error count |
| **5xx Errors** | Server error count |
| **Error Breakdown** | Errors by type and API |

## Filtering Analytics Data

You can filter analytics data by:

- **Time Range**: Last hour, day, week, or custom range
- **API**: Specific API proxy
- **Environment**: Development, staging, or production
- **Application**: Specific consumer application
- **Status Code**: Success or error responses

## Real-Time Monitoring

For real-time monitoring of your gateway:

### Gateway Health

Check the gateway health endpoint:

```bash
curl http://localhost:9090/health
```

Expected response:

```json
{
  "status": "healthy",
  "uptime": "2d 5h 30m",
  "connections": {
    "controlPlane": "connected",
    "lastSync": "2026-02-15T10:30:00Z"
  }
}
```

### Live Traffic Logs

View live traffic logs:

```bash
# Docker deployment
docker compose logs -f gateway

# Kubernetes deployment
kubectl logs -f deployment/gateway -n bijira-gateway
```

## Integrating with Moesif

For advanced analytics, AI-powered insights, and API monetization, integrate your Self-Hosted Gateway with Moesif:

1. Sign up for a [Moesif account](https://www.moesif.com).
2. Get your Moesif Application ID.
3. Configure your gateway with the Moesif key:

```bash
# In your keys.env file
MOESIF_KEY=your-moesif-application-id
```

4. Restart the gateway to apply the configuration.

For detailed instructions, see [Integrate API Platform with Moesif](../monitoring-and-insights/integrate-bijira-with-moesif.md).

### Moesif Features

With Moesif integration, you get:

- **User Analytics**: Track API usage by individual users
- **Funnel Analysis**: Understand API adoption patterns
- **Alerting**: Get notified of anomalies and issues
- **Monetization**: Bill customers based on API usage

## Exporting Analytics Data

To export analytics data:

1. Navigate to the analytics dashboard.
2. Set your desired filters and time range.
3. Click **Export** in the top right.
4. Choose the export format:
    - **CSV**: For spreadsheet analysis
    - **JSON**: For programmatic processing

## Setting Up Alerts

Configure alerts to get notified of issues:

1. Navigate to **Monitor** > **Alerts**.
2. Click **+ Create Alert**.
3. Configure the alert:
    - **Metric**: Error rate, latency, or traffic
    - **Condition**: Threshold or anomaly detection
    - **Notification**: Email, Slack, or webhook
4. Click **Save**.

### Example Alert Configurations

**High Error Rate Alert:**
```yaml
metric: error_rate
condition: greater_than
threshold: 5%
duration: 5 minutes
notification: slack
```

**Latency Spike Alert:**
```yaml
metric: p95_latency
condition: greater_than
threshold: 2000ms
duration: 3 minutes
notification: email
```

## Gateway Metrics Endpoint

The Self-Hosted Gateway exposes a Prometheus-compatible metrics endpoint:

```bash
curl http://localhost:9091/metrics
```

### Available Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `gateway_requests_total` | Counter | Total requests processed |
| `gateway_request_duration_seconds` | Histogram | Request latency distribution |
| `gateway_errors_total` | Counter | Total errors by type |
| `gateway_active_connections` | Gauge | Current active connections |
| `gateway_policy_sync_status` | Gauge | Policy synchronization status |

### Integrating with Prometheus

To scrape metrics with Prometheus, add this to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'bijira-gateway'
    static_configs:
      - targets: ['gateway-host:9091']
    metrics_path: /metrics
    scrape_interval: 15s
```

### Visualizing with Grafana

Import the API Platform Gateway dashboard in Grafana:

1. Add Prometheus as a data source.
2. Import dashboard ID: `12345` (example).
3. Select your Prometheus data source.
4. Click **Import**.

## Troubleshooting Analytics

### No Data Appearing

If analytics data isn't appearing:

1. **Check connectivity**: Verify the gateway can reach the control plane.
2. **Review logs**: Look for analytics-related errors in gateway logs.
3. **Wait for aggregation**: Data may take a few minutes to appear.

### Incomplete Data

If data appears incomplete:

1. **Check time zone**: Ensure you're viewing the correct time range.
2. **Verify filters**: Remove filters to see all data.
3. **Check gateway uptime**: Data gaps may indicate gateway restarts.

## What's Next?

- [Managing Policies](manage-policies.md): Configure policies for your APIs
- [Troubleshooting](troubleshooting.md): Common issues and solutions
