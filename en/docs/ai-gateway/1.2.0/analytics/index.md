---
title: "Analytics"
description: "Publish AI Gateway request and response data to an analytics backend, and control which headers leave the gateway with it."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/analytics/
md_url: https://wso2.com/api-platform/docs/ai-gateway/analytics.md
tags:
  - ai-gateway
  - analytics
  - observability
  - spend
  - cost-tracking
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "concept"
---

# Analytics

Analytics tells you how your APIs are used over time. Logging and tracing tell you what the gateway did with a single request; analytics aggregates traffic so you can see usage, cost, and trends across many of them. For the other two, see [Gateway logs](../logging-and-tracing/gateway-logs.md) and [Gateway tracing](../logging-and-tracing/tracing.md).

The gateway publishes request and response data to an external analytics backend. You choose the backend, and you control which headers travel with the data.

## In this section

This section contains the following pages:

| Page | What it covers |
|------|----------------|
| [Moesif analytics](moesif-analytics.md) | Configure Moesif in API Platform AI Gateway to capture and publish API request and response data. |
| [Analytics header filter](analytics-header-filter.md) | Control which request and response headers are sent to analytics backends using allow or deny mode in API Platform AI Gateway. |

Both pages configure a policy from the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../../policy-hub/overview.md).
