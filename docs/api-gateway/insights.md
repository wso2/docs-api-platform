---
title: "Insights"
pagination_label: "Gateway Insights"
description: "View analytics for the API traffic on your gateways in the API Management Console, and configure the analytics that a Self-Hosted Gateway publishes."
---

Insights shows how the APIs on your gateways are used. WSO2 gateways send analytics to Moesif, which powers Insights in the API Management Console. For a Self-Hosted Gateway, you can also control which request and response data the gateway captures.

## In the API Management Console

Insights is powered by Moesif Basic, which is included with your WSO2 subscription. The following dashboards show the API traffic on your gateways.

:::note
Insights is coming soon.
:::

| Dashboard | Description |
|:----------|:------------|
| **Analytics Overview** | Unique users, total requests, and total errors, the top applications and APIs, and traffic intensity, latency, and geographic distribution over time. |
| **API Analytics** | Total requests, average latency, error rate, and unique consumers, traffic by API type, such as REST, GraphQL, and gRPC, and latency, traffic, and errors over time. |

## For a Self-Hosted Gateway

A Self-Hosted Gateway publishes analytics for the API traffic that it handles. The gateway collects analytics data asynchronously, after the response reaches the client, so analytics does not add latency to API calls.

### How Analytics Is Set Up

A Self-Hosted Gateway publishes analytics to Moesif, which powers Insights. When you add a Self-Hosted Gateway, the command that creates the `keys.env` file includes your organization's Moesif key in the `MOESIF_KEY` variable. The gateway uses this key to publish analytics for your organization.

The gateway reads its analytics settings from its `config.toml` file. The following sections describe the settings that you can change.

### Control the Captured Data

By default, the gateway does not capture request or response headers or bodies. To include them in analytics, enable them in the `[collector]` section of `config.toml`.

| Parameter | Type | Default | Description |
|:----------|:-----|:--------|:------------|
| `request_headers` | boolean | `false` | Capture all request headers. |
| `response_headers` | boolean | `false` | Capture all response headers. |
| `request_body` | boolean | `false` | Capture the full request body. |
| `response_body` | boolean | `false` | Capture the full response body. |
| `ignore_path_prefixes` | array of strings | `[]` | Path prefixes, such as `/health`, for which the gateway produces no analytics event. |

For example:

```toml
[collector]
request_headers = true
response_headers = true
ignore_path_prefixes = ["/health"]
```

:::warning
Moesif receives captured headers without masking. To keep sensitive headers, such as `Authorization`, out of analytics, use the Analytics Header Filter policy.
:::

### Filter Headers with the Analytics Header Filter Policy

The **Analytics Header Filter** policy controls which request and response headers are included in analytics. Use it to keep sensitive, noisy, or irrelevant headers out of analytics. The policy only affects analytics. It does not remove or change the headers that are sent to your backend or returned to clients.

The policy has the following parameters. You can configure request and response headers independently.

| Parameter | Description |
|:----------|:------------|
| `requestHeadersToFilter` | How to filter request headers. |
| `responseHeadersToFilter` | How to filter response headers. |

Each parameter has the following properties.

| Property | Description |
|:---------|:------------|
| `operation` | `allow` to include only the listed headers, or `deny` to include all headers except the listed ones. |
| `headers` | The header names to filter. Header names are case-insensitive. If the list is empty, all headers are included. |

For example, the following configuration removes the `Authorization` header from the request headers in analytics, and the `content-type` header from the response headers:

```yaml
requestHeadersToFilter:
  operation: deny
  headers:
    - "Authorization"
responseHeadersToFilter:
  operation: deny
  headers:
    - "content-type"
```

The policy works only when analytics is enabled for the gateway, and only on the APIs that you attach it to. To attach the policy to an API, see [Attach and Manage Policies](../api-control-plane/develop-api-proxy/policy/attach-and-manage-policies.md).

### Send Analytics to an OpenTelemetry Backend

In addition to Moesif, a Self-Hosted Gateway can export analytics as OpenTelemetry Protocol (OTLP) log records to your own observability stack, such as an OpenTelemetry Collector. Each publisher receives every analytics event independently. This requires API Gateway `1.2.0.11` or later. For the configuration, see [OpenTelemetry Analytics](https://wso2.com/api-platform/docs/api-gateway/1.2.0/analytics/opentelemetry-analytics/).
