---
title: "Enable Distributed Tracing"
description: "Enable and configure distributed tracing for API Platform Gateway in config.toml by pointing to an OTLP collector endpoint."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/enabling-tracing/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/enabling-tracing.md
tags:
  - api-gateway
  - observability
  - tracing
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Enabling and Disabling Tracing

## Enabling Tracing

### Configuration Required

You need to enable tracing in the gateway configuration file and point it to your OTLP collector endpoint.

The tracing configuration is located in `gateway/configs/config.toml`:

#### Policy Engine Tracing Configuration

```toml
[tracing]
enabled = true                          # Set to true to enable tracing
endpoint = "otel-collector:4317"        # OTLP collector gRPC endpoint
service_version = "0.2.0"               # Service version
batch_timeout = "1s"                    # Batch timeout for exporting spans
max_export_batch_size = 512             # Maximum spans per batch
sampling_rate = 1.0                     # Sample rate (1.0 = 100%, 0.5 = 50%)
```

### Demonstrated Tracing Services

The tracing services included in the Docker Compose file (Jaeger and OpenTelemetry Collector) are provided as **demonstration services** to show one possible way to collect and visualize traces. You can use them as-is for development/testing, or replace them with your own tracing solution.

The gateway uses Docker Compose profiles to optionally enable these demonstration tracing services.

### Start Gateway with Demonstrated Tracing Services

To start the gateway with the demonstration tracing services enabled:

```bash
docker compose --profile tracing up -d
```

This starts:
- Core gateway services (gateway-controller, policy-engine, router) - *which export traces to OTLP collector*
- OpenTelemetry Collector - *receives and processes traces*
- Jaeger - *stores and visualizes traces*

### Start Gateway without Tracing Services

To run only the core gateway services without the demonstration tracing stack:

```bash
docker compose up -d
```

**Note:** If tracing is enabled in the configuration but the OTLP collector is not running, components will log warnings about failed trace exports. To completely disable tracing, set `enabled = false` in the configuration.

### Stop Tracing Services

To stop all services including the tracing stack:

```bash
docker compose --profile tracing down
```

**Note:** Jaeger stores traces in memory by default. Stopping the service will lose all trace data. For persistent storage, configure Jaeger with a backend database (see Jaeger documentation).

## Disabling Tracing

To completely disable tracing:

1. **Update configuration** in `gateway/configs/config.toml`:

```toml
[tracing]
enabled = false
```

2. **Restart gateway services:**

```bash
docker compose restart gateway-controller policy-engine router
```

**Note:** The router (Envoy) tracing is controlled by the gateway-controller configuration and will be disabled when the configuration is updated.
