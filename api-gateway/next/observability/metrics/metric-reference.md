---
title: "Metric Reference"
description: "Complete reference for all Prometheus metrics exposed by API Platform Gateway controller, router, and policy engine components."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/metric-reference/
md_url: https://wso2.com/api-platform/docs/api-gateway/observability/metrics/metric-reference.md
tags:
  - api-gateway
  - observability
  - metrics
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "reference"
---

# Metric Reference

## Gateway Controller Metrics

### API Management
- `gateway_controller_api_operations_total`: Counter of API operations
  - Labels: `operation`, `status`, `api_type`
- `gateway_controller_api_operation_duration_seconds`: Histogram of operation duration
  - Labels: `operation`, `api_type`
- `gateway_controller_apis_total`: Gauge of deployed APIs
  - Labels: `api_type`, `status`
- `gateway_controller_validation_errors_total`: Counter of validation errors
  - Labels: `operation`, `error_type`
- `gateway_controller_deployment_latency_seconds`: Histogram of deployment latency

### xDS Metrics
- `gateway_controller_xds_clients_connected`: Gauge of connected xDS clients
  - Labels: `server`, `node_id`
- `gateway_controller_snapshot_generation_duration_seconds`: Histogram of snapshot generation time
  - Labels: `type`
- `gateway_controller_snapshot_generation_total`: Counter of snapshot generations
  - Labels: `type`, `status`, `trigger`
- `gateway_controller_snapshot_size`: Gauge of snapshot resource size
  - Labels: `resource_type`
- `gateway_controller_xds_stream_requests_total`: Counter of xDS stream requests
  - Labels: `server`, `type_url`, `operation`
- `gateway_controller_xds_snapshot_ack_total`: Counter of snapshot ACK/NACK
  - Labels: `server`, `node_id`, `status`

### Database Metrics
- `gateway_controller_database_operations_total`: Counter of database operations
  - Labels: `operation`, `table`, `status`
- `gateway_controller_database_operation_duration_seconds`: Histogram of operation duration
  - Labels: `operation`, `table`
- `gateway_controller_database_size_bytes`: Gauge of database size
  - Labels: `database`
- `gateway_controller_config_store_size`: Gauge of config store items
  - Labels: `type`

### HTTP API Metrics
- `gateway_controller_http_requests_total`: Counter of HTTP requests
  - Labels: `method`, `endpoint`, `status_code`
- `gateway_controller_http_request_duration_seconds`: Histogram of request duration
  - Labels: `method`, `endpoint`
- `gateway_controller_http_request_size_bytes`: Histogram of request size
  - Labels: `endpoint`
- `gateway_controller_http_response_size_bytes`: Histogram of response size
  - Labels: `endpoint`
- `gateway_controller_concurrent_requests`: Gauge of concurrent requests

### System Metrics
- `gateway_controller_up`: Gauge of component liveness (1=up, 0=down)
- `gateway_controller_info`: Gauge of build information
  - Labels: `version`, `storage_type`, `build_date`
- `gateway_controller_goroutines`: Gauge of current goroutines
- `gateway_controller_memory_bytes`: Gauge of memory usage
  - Labels: `type` (heap_alloc, heap_sys, stack_inuse)

### Error Metrics
- `gateway_controller_errors_total`: Counter of errors
  - Labels: `component`, `error_type`
- `gateway_controller_panic_recoveries_total`: Counter of panic recoveries
  - Labels: `component`
- `gateway_controller_storage_errors_total`: Counter of storage errors
  - Labels: `operation`, `error_type`
- `gateway_controller_translation_errors_total`: Counter of translation errors
  - Labels: `error_type`

### Certificate Metrics
- `gateway_controller_certificates_total`: Gauge of certificates
  - Labels: `type`
- `gateway_controller_certificate_operations_total`: Counter of certificate operations
  - Labels: `operation`, `status`
- `gateway_controller_certificate_expiry_seconds`: Gauge of certificate expiry
  - Labels: `cert_id`, `cert_name`

### Policy Metrics
- `gateway_controller_policies_total`: Gauge of policies
  - Labels: `api_id`, `route`
- `gateway_controller_policy_chain_length`: Histogram of policy chain length
  - Labels: `api_id`, `route`
- `gateway_controller_policy_snapshot_updates_total`: Counter of policy updates
  - Labels: `status`
- `gateway_controller_policy_validation_errors_total`: Counter of validation errors
  - Labels: `error_type`

## Policy Engine Metrics

### Request Processing
- `policy_engine_requests_total`: Counter of processed requests
  - Labels: `phase` (request, response), `route`, `api_name`, `api_version`
- `policy_engine_request_duration_seconds`: Histogram of request duration
  - Labels: `phase`, `route`
- `policy_engine_request_errors_total`: Counter of request errors
  - Labels: `phase`, `error_type`, `route`
- `policy_engine_short_circuits_total`: Counter of short-circuited requests
  - Labels: `route`, `policy_name`

### Policy Execution
- `policy_engine_policy_executions_total`: Counter of policy executions
  - Labels: `policy_name`, `policy_version`, `api`, `route`, `status`
- `policy_engine_policy_duration_seconds`: Histogram of policy execution duration
  - Labels: `policy_name`, `policy_version`, `api`, `route`
- `policy_engine_policy_skipped_total`: Counter of skipped policies
  - Labels: `policy_name`, `api`, `route`, `reason`
- `policy_engine_policies_per_chain`: Gauge of current policies per chain
  - Labels: `route`, `api`

### Configuration
- `policy_engine_policy_chains_loaded`: Gauge of loaded policy chains
  - Labels: `mode` (file, xds)
- `policy_engine_xds_updates_total`: Counter of xDS updates
  - Labels: `status`, `type`
- `policy_engine_xds_connection_state`: Gauge of xDS connection state
  - Labels: `state`
- `policy_engine_snapshot_size`: Gauge of snapshot size
  - Labels: `resource_type`

### Streaming
- `policy_engine_active_streams`: Gauge of active ext_proc streams
- `policy_engine_body_bytes_processed`: Counter of body bytes processed
  - Labels: `phase`, `operation`
- `policy_engine_context_build_duration_seconds`: Histogram of context build duration
  - Labels: `type`
- `policy_engine_grpc_connections_active`: Gauge of active gRPC connections
  - Labels: `type`

### System Metrics
- `policy_engine_up`: Gauge of component liveness (1=up, 0=down)
- `policy_engine_goroutines`: Gauge of current goroutines
- `policy_engine_memory_bytes`: Gauge of memory usage
  - Labels: `type` (heap_alloc, heap_sys, stack)

### Error Metrics
- `policy_engine_policy_errors_total`: Counter of policy errors
  - Labels: `policy_name`, `error_type`
- `policy_engine_stream_errors_total`: Counter of stream errors
  - Labels: `error_type`
- `policy_engine_route_lookup_failures_total`: Counter of route lookup failures
- `policy_engine_panic_recoveries_total`: Counter of panic recoveries
  - Labels: `component`

## Router (Envoy) Metrics

Envoy exposes built-in Prometheus metrics. Key metrics include:

### HTTP Metrics
- `envoy_http_internal_requests_total`: Counter of HTTP requests
  - Labels: `virtual_cluster`, `virtual_host`, `response_code`
- `envoy_http_request_duration_seconds`: Histogram of request duration
- `envoy_http_downstream_cx_active`: Gauge of active connections
- `envoy_http_downstream_cx_total`: Counter of connections

### Upstream Metrics
- `envoy_http_upstream_rq_total`: Counter of upstream requests
  - Labels: `upstream_cluster`, `response_code`
- `envoy_http_upstream_rq_xx`: Counter of upstream requests by status
  - Labels: `upstream_cluster`, `envoy_response_flags`

### Cluster Metrics
- `envoy_cluster_upstream_cx_active`: Gauge of active upstream connections
- `envoy_cluster_upstream_rq_retry_total`: Counter of retry requests
- `envoy_cluster_membership_healthy`: Gauge of healthy endpoints

### Listener Metrics
- `envoy_listener_downstream_cx_active`: Gauge of active downstream connections
- `envoy_listener_downstream_cx_total`: Counter of downstream connections
