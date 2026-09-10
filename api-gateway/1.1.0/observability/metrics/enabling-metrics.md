---
title: "Enable Metrics"
description: "Enable and configure Prometheus metrics collection for API Platform Gateway components in config.toml."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/enabling-metrics/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/enabling-metrics.md
tags:
  - api-gateway
  - observability
  - metrics
  - prometheus
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Enabling and Disabling Metrics

## Enabling Metrics

### Configuration Required

You need to enable metrics in the gateway configuration file. By default, metrics are enabled in the production configuration but you can customize the settings.

The metrics configuration is located in `gateway/configs/config.toml`:

#### Gateway Controller Metrics Configuration

```toml
[controller.metrics]
# Enable or disable Prometheus metrics endpoint
enabled = true

# Port for metrics HTTP server
port = 9091
```

#### Policy Engine Metrics Configuration

```toml
[policy_engine.metrics]
# Enable or disable Prometheus metrics endpoint
enabled = true

# Port for metrics HTTP server
port = 9003
```

**Note**: When metrics are enabled, each component starts an HTTP server on the specified port to expose metrics in Prometheus format.

### Demonstrated Metrics Services

The metrics services included in the Docker Compose file (Prometheus and Grafana) are provided as **demonstration services** to show one possible way to collect and visualize metrics. You can use them as-is for development/testing, or replace them with your own metrics solution.

The gateway uses Docker Compose profiles to optionally enable these demonstration metrics services.

#### Setting up Grafana Image

**Important Note:** The Grafana image in the `docker-compose.yaml` file is intentionally left empty due to licensing considerations. Before you can use the demonstration dashboards, you must specify a valid Grafana image.

To add the Grafana image:

1. Open `gateway/docker-compose.yaml`.
2. Locate the `grafana` service definition.
3. Update the `image` field with a valid Grafana image tag (e.g., `grafana/grafana:11.6.0` or another compatible version).

```yaml
  grafana:
    image: grafana/grafana:11.6.0  # Add your preferred Grafana image here
    container_name: grafana
```

### Start Gateway with Demonstrated Metrics Services

To start the gateway with the demonstration metrics services enabled:

```bash
docker compose --profile metrics up -d
```

This starts:
- Core gateway services (gateway-controller, policy-engine, router) - *which expose metrics on their respective ports*
- Prometheus - *scrapes and stores metrics*
- Grafana - *visualizes metrics through dashboards*

### Start Gateway without Metrics Services

To run only the core gateway services without the demonstration metrics stack:

```bash
docker compose up -d
```

**Note:** The gateway components still expose metrics if enabled in the configuration. You can still access metrics directly at:
- Gateway Controller: <http://localhost:9091/metrics>
- Policy Engine: <http://localhost:9003/metrics>
- Router (Envoy): <http://localhost:9901/stats/prometheus>

### Stop Metrics Services

To stop all services including the metrics stack:

```bash
docker compose --profile metrics down
```

To completely remove metrics data:

```bash
docker compose --profile metrics down -v
```

This removes the `prometheus-data` volume containing all stored metrics.

## Disabling Metrics

To completely disable metrics:

1. **Update configuration** in `gateway/configs/config.toml`:

```toml
[controller.metrics]
enabled = false

[policy_engine.metrics]
enabled = false
```

2. **Restart gateway services:**

```bash
docker compose restart gateway-controller policy-engine router
```

**Note:** Disabling metrics will:
- Stop HTTP metrics servers on the configured ports
- Remove metrics from Prometheus targets
- No new metric data will be collected
