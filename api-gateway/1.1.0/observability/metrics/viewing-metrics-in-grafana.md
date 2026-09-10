---
title: "View Metrics in Grafana"
description: "Access pre-built Grafana dashboards to view and explore API Platform Gateway component metrics."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/viewing-metrics-in-grafana/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/viewing-metrics-in-grafana.md
tags:
  - api-gateway
  - observability
  - metrics
  - grafana
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Viewing Metrics in Grafana

Once you've started the gateway with the metrics profile, follow these steps to view component metrics:

## Step 1: Access Grafana

Open your browser and navigate to: <http://localhost:3000>

## Step 2: Log in to Grafana

1. Username: `admin`
2. Password: `admin`

**Note**: You'll be prompted to change the password on first login.

## Step 3: Navigate to Dashboards

1. Click on the **hamburger menu (☰)** in the top-left corner
2. Navigate to **Dashboards** → **Browse**
3. You'll see several pre-built dashboards:
   - **Infrastructure Overview**: High-level view of all components
   - **Gateway Controller**: Detailed gateway-controller metrics
   - **Policy Engine**: Detailed policy-engine metrics

## Step 4: View Infrastructure Overview

The Infrastructure Overview dashboard provides a comprehensive view:

### Gateway Controller Section
- **API Operations**: Total operations and operation rate
- **Deployment Latency**: End-to-end deployment time
- **xDS Clients**: Number of connected Envoy routers
- **Database Operations**: Database operation metrics
- **HTTP Requests**: REST API request metrics

### Policy Engine Section
- **Request Processing**: Total requests and request rate
- **Policy Executions**: Policy execution metrics
- **Active Streams**: Current ext_proc streams
- **Errors**: Error rate and types

### System Resources
- **Memory Usage**: Heap, system memory across components
- **Goroutines**: Go runtime goroutines count
- **Uptime**: Component availability

## Step 5: View Gateway Controller Dashboard

The Gateway Controller dashboard provides detailed metrics:

### API Management
- **API Operations Total**: Counter for all API operations with labels for:
  - `operation`: create, update, delete, get
  - `status`: success, failure
  - `api_type`: REST, GraphQL, etc.
- **APIs Total**: Gauge showing deployed APIs by type and status
- **Deployment Latency Seconds**: Histogram of deployment times

### xDS Metrics
- **xDS Clients Connected**: Gauge of connected Envoy instances
- **Snapshot Generation Duration**: Time to generate configuration snapshots
- **XDS Stream Requests**: Counter for xDS requests by type
- **Snapshot Size**: Size of generated configuration snapshots

### Database Metrics
- **Database Operations Total**: Counter for database operations
- **Database Operation Duration**: Histogram of operation times
- **Database Size Bytes**: Current database size

### HTTP API Metrics
- **HTTP Requests Total**: Counter for REST API requests
- **HTTP Request Duration**: Histogram of API response times
- **Concurrent Requests**: Current concurrent API requests

## Step 6: View Policy Engine Dashboard

The Policy Engine dashboard provides detailed metrics:

### Request Processing
- **Requests Total**: Counter for all processed requests with labels:
  - `phase`: request, response
  - `route`: route name
  - `api_name`: API identifier
  - `api_version`: API version
- **Request Duration Seconds**: Histogram of request processing times
- **Request Errors Total**: Counter for errors by type

### Policy Execution
- **Policy Executions Total**: Counter for policy executions with labels:
  - `policy_name`: Name of executed policy
  - `policy_version`: Policy version
  - `api`: API identifier
  - `route`: Route name
  - `status`: success, failure, skip
- **Policy Duration Seconds**: Histogram of policy execution times
- **Policies Per Chain**: Gauge of current policy chain lengths

### Streaming
- **Active Streams**: Current ext_proc streams (gauge)
- **XDS Updates Total**: Counter for configuration updates
- **Body Bytes Processed**: Counter for body processing

### System Resources
- **Memory Usage**: Memory consumption metrics
- **Goroutines**: Current goroutines count
- **GRPC Connections**: Active gRPC connections

## Step 7: Create Custom Dashboards

You can create custom dashboards in Grafana:

1. Click **+** → **Dashboard**
2. Click **+ Add visualization**
3. Select Prometheus as the data source
4. Write PromQL queries to fetch metrics
5. Configure visualization (graphs, tables, gauges, etc.)
6. Save the dashboard

## Step 8: Set Up Alerts

Create alerts to be notified of issues:

1. Navigate to **Alerting** → **Alert rules**
2. Click **+ New alert rule**
3. Define the alert condition using PromQL
4. Set severity (Critical, Warning, Info)
5. Configure notifications (email, Slack, PagerDuty, etc.)
6. Save the alert rule

Example alert for high error rate:
```promql
(
  rate(gateway_controller_api_operations_total{status="failure"}[5m])
  /
  rate(gateway_controller_api_operations_total[5m])
) > 0.1
```

This alert triggers when the error rate exceeds 10% over 5 minutes.
