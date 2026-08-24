---
title: "View Traces in Jaeger"
description: "Access the Jaeger UI and search for distributed traces from API Platform Gateway components."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/viewing-traces-in-jaeger/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/tracing/viewing-traces-in-jaeger.md
tags:
  - api-gateway
  - observability
  - tracing
  - jaeger
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Viewing Traces in Jaeger

Once you've started the gateway with the tracing profile, follow these steps to view distributed traces:

## Step 1: Access Jaeger UI

Open your browser and navigate to:
```
http://localhost:16686
```

## Step 2: Search for Traces

The Jaeger UI provides several ways to search for traces:

1. **Select a Service** from the dropdown:
   - `policy-engine` - View traces from the policy engine
   - `router` - View traces from the Envoy router

2. **Select an Operation** (optional):
   - Choose "all" to see all operations
   - Or select a specific operation (e.g., specific policy execution)

3. **Adjust Lookback Time Range**:
   - Default: Last 1 hour
   - Options: 5m, 15m, 1h, 6h, 12h, 1d, 2d, Custom

4. **Add Filters** (optional):
   - **Tags**: Filter by specific tag values (e.g., `http.status_code=500`)
   - **Min/Max Duration**: Filter by trace duration
   - **Limit Results**: Control number of traces returned (default: 20)

5. Click **Find Traces**

## Step 3: Analyze Trace Details

Click on any trace in the results to view detailed information:

### Trace Timeline
- **Visual timeline** showing all spans in the trace
- **Duration bars** showing relative time spent in each operation
- **Parent-child relationships** between spans
- **Color coding** by service

### Span Details
Click on any span to see:
- **Operation name**: What operation was performed
- **Duration**: How long it took
- **Tags**: Metadata about the operation (HTTP method, status code, etc.)
- **Logs**: Events logged during the span (errors, warnings, etc.)
- **Process**: Service name, version, and host information

### Common Use Cases

**Finding Slow Requests:**
1. Set Min Duration filter (e.g., 1000ms)
2. Click Find Traces
3. Examine spans to identify bottlenecks

**Debugging Errors:**
1. Filter by tag: `error=true` or `http.status_code=500`
2. Click on error traces
3. Examine span logs and tags for error details

**Understanding Request Flow:**
1. Search for a specific trace ID (from logs or headers)
2. View the complete request path through all components
3. Identify which component handled which part of the request

## Step 4: Trace Comparison

You can compare multiple traces to identify patterns:
1. Select multiple traces using checkboxes
2. Click **Compare Traces** button
3. View side-by-side comparison of trace structure and timings

## Step 5: Service Dependency Graph

View how services interact:
1. Click **Dependencies** in the top navigation
2. Select time range
3. View graph showing service-to-service communication patterns
