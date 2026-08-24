---
title: "Observability overview"
description: "Observability in WSO2 API Manager across three pillars: logs, distributed traces with OpenTracing or OpenTelemetry, and JMX metrics."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/monitoring/observability/observability-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/monitoring/observability/observability-overview.md
tags:
  - api-manager
  - monitoring
  - observability
  - observability-overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-20
content_type: "concept"
---

# Observability Overview

Observability can be viewed as a superset of monitoring where monitoring is enriched with capabilities to perform debugging and profiling through rich context, log analysis, correlation, and tracing. Modern day observability resides on three pillars of **logs**, **metrics**, and **tracing**. Modern businesses require observability systems to self-sufficiently emit their current state (overview), generate alerts for any abnormalities detected to proactively identify failures, and to provide information to find the root causes of a system failure.

The API Manager observability solution allows you to monitor the requests and the responses that correspond to a specific API call, monitor your application's usage, monitor production servers, enable distributed tracing and monitor API Manager via the JConsole tool.

Explore the core pillars of observability in WSO2 API Manager:

## Logs
- [Correlation Logs](monitoring-correlation-logs.md)
- [HTTP Access Logs](monitoring-http-access-logs.md)
- [Audit Logs](monitoring-audit-logs.md)
- [API Logs](monitoring-api-logs.md)
- [WebSocket Logs](monitoring-websocket-logs.md)

## Traces
- [OpenTracing](traces/monitoring-with-opentracing.md)
- [OpenTelemetry](traces/monitoring-with-opentelemetry.md)

## Metrics
- [JMX-Based Monitoring](metrics/jmx-based-monitoring.md)