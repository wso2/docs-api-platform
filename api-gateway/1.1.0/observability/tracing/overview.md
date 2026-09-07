---
title: "Distributed Tracing Overview"
description: "Overview of the distributed tracing architecture for API Platform Gateway: how components export traces through the OpenTelemetry Collector to Jaeger."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/overview/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/overview.md
tags:
  - api-gateway
  - observability
  - tracing
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "concept"
---

# Gateway Tracing

This guide explains how to implement and configure distributed tracing for the API Platform Gateway components.

## Overview

The default tracing services included in the Docker Compose configuration are **demonstration services** designed to showcase how you can observe distributed traces across gateway components in a centralized setup. These services provide a reference implementation that you can use out-of-the-box for development, testing, or as a starting point for your production tracing strategy.

**Important**: You are free to choose any tracing or observability strategy that suits your environment and requirements. The provided setup is just one of many possible configurations.

## Tracing Architecture

The default tracing stack consists of:

- **OpenTelemetry (OTLP) Collector**: Receives, processes, and exports trace data from gateway components
- **Jaeger**: Stores and visualizes distributed traces with a web UI for trace exploration and analysis

### How It Works

1. Gateway components (gateway-controller, policy-engine, router) are configured to export traces via OTLP (OpenTelemetry Protocol)
2. Components send trace spans to the OpenTelemetry Collector via gRPC (port 4317) or HTTP (port 4318)
3. The OTLP Collector processes traces (batching, adding resource attributes, etc.)
4. The OTLP Collector forwards traces to Jaeger for storage and visualization
5. Users can view and analyze traces through the Jaeger UI

### What is Distributed Tracing?

Distributed tracing tracks a request as it flows through multiple components, using a few key concepts:

- **Trace**: Represents the entire journey of a request through the system
- **Span**: Represents a single operation within a trace (e.g., policy execution, upstream call)
- **Context Propagation**: Traces are correlated across components using trace IDs and span IDs in headers

## In This Section

- [Enabling and Disabling Tracing](enabling-tracing.md) — Turn tracing on or off and run the demonstration tracing services
- [Viewing Traces in Jaeger](viewing-traces-in-jaeger.md) — Search, analyze, and compare distributed traces in the Jaeger UI
- [Tracing Configuration](configuration.md) — Sampling, batching, OpenTelemetry Collector customization, and trace context propagation
- [Alternative Tracing Backends](alternative-backends.md) — Export traces to Moesif, Zipkin, Tempo, and cloud-native solutions
- [Best Practices and Troubleshooting](best-practices-and-troubleshooting.md) — Recommendations, common issues, and integration with logging

## Additional Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/)
- [OpenTelemetry Collector Documentation](https://opentelemetry.io/docs/collector/)
- [W3C Trace Context Specification](https://www.w3.org/TR/trace-context/)
- [Gateway Overview](../../overview.md)
- [Gateway Logging Guide](../logging.md)
- [Docker Compose Profiles](https://docs.docker.com/compose/profiles/)