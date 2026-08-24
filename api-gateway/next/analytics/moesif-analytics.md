---
title: "Configure Moesif Analytics"
description: "Configure the Moesif in API Platform Gateway to capture and publish API request and response data."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/analytics/moesif-analytics/
md_url: https://wso2.com/api-platform/docs/api-gateway/analytics/moesif-analytics.md
tags:
  - api-gateway
  - analytics
  - moesif
  - observability
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Analytics

## Overview

The Analytics feature enables the API Platform to capture, process, and publish API request and response data for observability and business insights. Analytics data is collected asynchronously from the gateway without impacting request latency and is published to an external analytics platform for further analysis and visualization.

This capability allows platform administrators and business stakeholders to gain visibility into API usage patterns, traffic behavior, latency characteristics, and consumer activity across the platform.


## Features

* Asynchronous collection of API request and response data
* Policy-enriched analytics metadata capture
* Zero impact on request/response latency
* Batched and configurable publishing to external analytics platforms
* Horizontally scalable analytics processing pipeline
* Pluggable publisher model (supports multiple analytics backends)


## Prerequisites

- Active Moesif Account and an Application ID.
    For obtaining the Application ID, follow these steps:
    - Step 1: Sign up in [Moesif](https://www.moesif.com/)
    - Sept 2: Follow the onboarding wizard.
    - Sept 3: During the sign up process, you will receive a Collector Application ID for your configured application. Copy this value and keep it saved.

!!! note
    For more detailed instructions and advanced configuration options, refer to the [official Moesif Documentation](https://www.moesif.com/docs).


## Configuration

Analytics is configured entirely through the gateway `config.toml` file and is enabled at a system level.

!!! note
    Analytics is a **consumer** of a shared data-capture pipeline called the **collector**. The
    collector has no `enabled` flag of its own — it activates automatically whenever `analytics.enabled`
    (or `traffic_logging.enabled`) is `true`. See [Traffic Logging](../observability/traffic-logging.md)
    for the other consumer of this same pipeline, which writes a stdout JSON line per request instead
    of publishing to an external SaaS.

### System Parameters (`config.toml`)

#### Analytics

| Parameter | Type    | Required | Default | Description                            |
| --------- | ------- | -------- |-------- | -------------------------------------- |
| `enabled` | boolean | Yes      | false   | Enables or disables analytics globally, and activates the collector. |
| `enabled_publishers` | array of strings | No | `["moesif"]` | Publisher names to activate. Currently only `moesif` is supported. |

#### Publishers

Each entry in `enabled_publishers` must have a matching configuration table under
`[analytics.publishers.<name>]`.

##### Moesif (`[analytics.publishers.moesif]`)

| Parameter              | Type    | Required | Description                               |
| ---------------------- | ------- | -------- | ----------------------------------------- |
| `application_id`       | string  | Yes      | Moesif application identifier |
| `moesif_base_url`      | string  | No       | Moesif ingestion endpoint (default `https://api.moesif.net`) |
| `publish_interval`     | int     | Yes       | Interval (seconds) between publish cycles |
| `event_queue_size`     | int     | Yes       | Maximum events held in memory             |
| `batch_size`           | int     | Yes       | Maximum events per batch                  |
| `timer_wakeup_seconds` | int     | Yes       | Publisher timer resolution                |

#### Data capture (`[collector]`)

Analytics captures request/response headers and bodies through the shared `[collector]` section (also
used by Traffic Logging). Capture is off by default — enable only what Moesif needs:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `request_body` | boolean | `false` | Capture the full request body and attach it to published events. |
| `response_body` | boolean | `false` | Capture the full response body and attach it to published events. |
| `request_headers` | boolean | `false` | Capture all request headers and attach them to published events. |
| `response_headers` | boolean | `false` | Capture all response headers and attach them to published events. |
| `ignore_path_prefixes` | array of strings | `[]` | Path prefixes (e.g. `/health`, `/metrics`) for which no analytics event is produced at all. |

!!! note
    Masking/redaction is a per-consumer, presentation-time concern, not a collector guarantee — the
    collector hands every enabled consumer the same raw captured data. Moesif always receives unmasked
    headers, regardless of any `masked_headers` configuration used by Traffic Logging.

#### ALS transport (`[collector.server]`)

This section configures both the Envoy access log streaming settings and the ALS (Access Log Service)
server that receives those logs. It is shared with Traffic Logging — the controller reads it to
configure Envoy's gRPC access-log sink, and the policy-engine reads it to configure the receiving ALS
server.

| Parameter               | Type     | Required | Default | Description                      |
| ----------------------- | -------- | -------- |---- | -------------------------------- |
| `mode`                  | string   | No       | `"uds"` | Transport mode: `"uds"` (Unix domain socket) or `"tcp"`. |
| `buffer_flush_interval` | duration | No       | `1000000000`| Maximum time Envoy waits(in nanoseconds) before flushing buffered access log entries.|
| `buffer_size_bytes`     | int      | No       | `16384` | Maximum size of the in-memory buffer used to batch access log entries before sending them to ALS server.                  |
| `grpc_request_timeout`  | duration | No       | `20000000000` | Timeout duration Envoy waits(in nanoseconds) for a response from the ALS server before considering the log delivery attempt failed.            |
| `shutdown_timeout`      | duration | No       | `"600s"` | Maximum time allowed for the ALS server to gracefully shut down while completing in-flight log processing. |
| `als_plain_text`        | boolean | No       | `true` | Use plaintext gRPC        |
| `public_key_path`       | string | No       | - | Path to the public key used for securing ALS communication when transport-level encryption or authentication is enabled.        |
| `private_key_path`      | string | No       | - | Path to the private key used for securing ALS communication when transport-level encryption or authentication is enabled.        |
| `max_message_size`      | int     | No       | `1000000000` |Maximum size of a single gRPC message that the ALS server is allowed to receive from Envoy.      |
| `max_header_limit`      | int     | No       | `8192` | Maximum allowed size of request or response headers processed by the ALS server      |

!!! note
    The ALS gRPC port is fixed at `18090` and is not configurable — this guarantees the controller and
    policy-engine sides can never disagree on it. The hostname for the ALS connection is automatically
    derived from the policy-engine configuration. The internal log name identifier is set to
    `"envoy_access_log"` and is not configurable.

#### Deprecated keys

The following `[analytics]` keys still work, but are deprecated in favor of the shared `[collector]` /
`[collector.server]` sections above. They are migrated automatically at load time with a warning, so
existing configs keep working unchanged:

| Deprecated key | Migrated onto | Notes |
|---|---|---|
| `analytics.allow_payloads` | `collector.request_body` + `collector.response_body` | Directional flags (below) win over `allow_payloads`. |
| `analytics.send_request_body` / `send_response_body` | `collector.request_body` / `response_body` | — |
| `analytics.grpc_event_server.*` | `collector.server.*` | Whole-section migration, applied only while `[collector.server]` is unset and `analytics.enabled = true`. |
| `analytics.access_logs_service.*` | `collector.server.*` | Same migration as above; `server_port` is dropped since the ALS port is now a fixed constant. |


## Configuration Examples

#### Integrate Moesif Publisher

```toml
[collector]
request_headers = true
response_headers = true

[collector.server]
mode = "uds"

[analytics]
enabled = true
enabled_publishers = ["moesif"]

[analytics.publishers.moesif]
application_id = "<MOESIF_APPLICATION_ID>"
moesif_base_url = "https://api.moesif.net"
publish_interval = 5
event_queue_size = 10000
batch_size = 50
timer_wakeup_seconds = 3
```


## Use Cases

* **API Usage Visibility** – Understand how APIs are consumed across tenants and applications.
* **Operational Insights** – Observe traffic volume, response behavior, and latency trends.
* **Business Intelligence** – Support product and business decisions using API analytics data.
* **Platform Monitoring** – Gain observability into API behavior without impacting performance.

