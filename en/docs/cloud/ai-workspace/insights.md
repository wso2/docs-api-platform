---
title: "Insights"
description: "Use the built-in Insights dashboard in AI Workspace to view traffic, token usage, latency, cost, and guardrail activity across your AI Gateways."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/insights/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/insights.md
tags:
  - cloud
  - ai-workspace
  - insights
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-23
content_type: "concept"
---

# Insights

AI Workspace includes a built-in **Insights** dashboard that gives you visibility into traffic, usage patterns, and performance across your LLM providers and proxies. [Moesif](https://www.moesif.com/), an AI-native API analytics platform, powers the dashboard, and it's embedded directly in AI Workspace. You don't need a separate Moesif account or setup.

## Open Insights

To open the dashboard, follow these steps:

1. Navigate to **AI Workspace** in your API Platform dashboard.
2. Click **Insights** in the left navigation menu.

The page loads an analytics dashboard scoped to your AI Workspace activity.

## Enable analytics on a gateway

The dashboard shows data only for gateways that publish telemetry. A gateway publishes telemetry when its runtime carries an analytics key in the `MOESIF_KEY` environment variable. The **Get Started** section on each gateway's page fills this value in for you when you copy the setup commands, so a gateway set up from those commands already publishes telemetry.

If you set up a gateway without the key, add it to `configs/keys.env` and restart the gateway:

```bash
MOESIF_KEY=<your-analytics-key>
```

For the full gateway setup procedure, see [Set up an AI Gateway](ai-gateways/setting-up.md).

!!! note
    If `MOESIF_KEY` isn't configured, the gateway publishes no telemetry, and the Insights dashboard shows no data for that gateway.

## What you can see

### Overview summary

The overview panel at the top shows key metrics at a glance:

| Metric | Description |
|--------|-------------|
| **Total Requests** | The total number of requests processed through your LLM providers and proxies |
| **Avg Latency** | The average end-to-end response latency across all requests |
| **Success Rate** | The percentage of requests that completed without an error response |

### Request trend

A time-series chart showing request volume over time. Use it to identify traffic spikes, usage patterns, and the effect of configuration changes on request volume.

### Traffic split

A breakdown of traffic distribution across your App LLM proxies and providers. Use it to understand which proxies or providers handle the most load, and whether traffic is distributed as you expect.

### Full analytics dashboard

The embedded dashboard provides deeper analytics, including:

- **Request logs**: inspect individual API calls, their payloads, status codes, and latencies.
- **Filtering and segmentation**: slice data by proxy, provider, endpoint, consumer, or time range.
- **Application activity**: analyze usage for mapped [GenAI applications](genai-applications.md).
- **Token usage trends**: track prompt, completion, and total token consumption over time.
- **Estimated LLM cost**: review cost estimates based on token consumption.
- **Error analysis**: identify error patterns and guardrail interventions.
- **Consumer activity**: monitor which applications or consumers generate the most traffic.

## Use Insights for cost and rate limit management

Use the dashboard to tune your [token-based rate limits](policies/overview.md#token-based-rate-limit):

1. Use token usage trends to understand actual consumption patterns before you set rate limits.
2. Check per-consumer traffic to determine appropriate per-consumer limits.
3. Monitor error rates to detect rate limit violations (`429 Too Many Requests` responses), and adjust the limits accordingly.

## Use Insights for guardrail monitoring

When guardrails are active, use the dashboard to:

- Track how often guardrails intervene. Guardrail intervention responses appear as `422` errors.
- Identify which endpoints or consumers trigger the most interventions.
- Confirm that newly configured guardrails behave as you expect.

See [Policies overview](policies/overview.md) for more on configuring guardrails.

## Related resources

- [Set up an AI Gateway](ai-gateways/setting-up.md): configure `MOESIF_KEY` on the gateway runtime
- [Policies overview](policies/overview.md): set token limits and monitor guardrail interventions
- [GenAI applications](genai-applications.md): group API keys so usage is attributed per application
- [Integrate API Platform with Moesif](../monitoring-and-insights/integrate-bijira-with-moesif.md): advanced Moesif options for the broader API Platform
