# Insights

The AI Workspace provides a built-in **Insights** page that gives you real-time visibility into traffic, usage patterns, and performance across your LLM Providers and Proxies. Insights are powered by [Moesif](https://www.moesif.com/), an AI-native API analytics platform, and are available directly within the AI Workspace — no separate Moesif setup is required.

## Accessing Insights

1. Navigate to **AI Workspace** in your API Platform dashboard.
2. Click **Insights** in the left navigation sidebar.

The Insights page loads an embedded analytics dashboard scoped to your AI Workspace activity.

## What You Can See

### Overview Summary

The overview panel at the top shows key metrics at a glance:

| Metric | Description |
|--------|-------------|
| **Total Requests** | The total number of requests processed through your LLM Providers and Proxies. |
| **Avg Latency** | The average end-to-end response latency across all requests. |
| **Success Rate** | The percentage of requests that completed successfully (non-error responses). |

### Request Trend

A time-series chart showing the volume of requests over time. Use this to identify traffic spikes, usage patterns, and the impact of configuration changes on request volume.

### Traffic Split

A breakdown of traffic distribution across your App LLM Proxies or providers. Use this to understand which app proxies or providers are handling the most load and whether traffic is distributed as expected.

### Full Analytics Dashboard

The full Moesif-powered dashboard embedded in the Insights page provides deeper analytics, including:

- **Request logs** — Inspect individual API calls, their payloads, status codes, and latencies.
- **Filtering and segmentation** — Slice data by proxy, provider, endpoint, consumer, or time range.
- **Application activity** — Analyze usage for mapped [GenAI Applications](genai-applications.md).
- **Token usage trends** — Track prompt, completion, and total token consumption over time.
- **Error analysis** — Identify error patterns and guardrail interventions.
- **Consumer activity** — Monitor which applications or consumers are generating the most traffic.

## Using Insights for Cost and Rate Limit Management

The Insights dashboard is particularly useful for tuning your [token-based rate limits](policies/rate-limit/token-based-rate-limit.md):

1. Use **token usage trends** to understand actual consumption patterns before setting rate limits.
2. Check **per-consumer traffic** to determine appropriate per-consumer limits.
3. Monitor **error rates** to detect rate limit violations (`429 Too Many Requests` responses) and adjust limits accordingly.

## Using Insights for Guardrail Monitoring

When guardrails are active, you can use Insights to:

- Track how often guardrails are intervening (guardrail intervention responses appear as `422` errors).
- Identify which endpoints or consumers are triggering the most interventions.
- Validate that newly configured guardrails are behaving as expected.

See [Guardrails Overview](policies/guardrails/overview.md) for more on configuring guardrails.

## Related

- [Token-Based Rate Limiting](policies/rate-limit/token-based-rate-limit.md) — Set token limits and use Insights to monitor usage
- [Guardrails Overview](policies/guardrails/overview.md) — Monitor guardrail interventions through Insights
- [Integrate API Platform with Moesif](../monitoring-and-insights/integrate-bijira-with-moesif.md) — Advanced Moesif integration options for the broader API Platform platform