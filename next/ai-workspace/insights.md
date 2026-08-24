---
title: "Insights"
description: "Open your Moesif analytics workspace from the AI Workspace to view traffic, token usage, latency, and consumer behavior for your AI Gateways."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/insights/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/insights.md
tags:
  - cloud
  - ai-workspace
  - insights
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-09
content_type: "concept"
---

# Insights

The **Insights** page in the AI Workspace links to your [Moesif](https://www.moesif.com/) analytics workspace, where you can view traffic, token usage, latency, and consumer behavior for the requests flowing through your AI Gateways. Moesif is an AI-native API analytics platform.

The AI Workspace does not embed or proxy Moesif content. The Insights page provides a button that opens your Moesif workspace in a new tab, and all analytics are viewed in Moesif itself.

## How It Works

1. **Configure your AI Gateway** with a Moesif Application ID (see [Enabling Moesif on a Gateway](#enabling-moesif-on-a-gateway)). The gateway runtime publishes telemetry — requests, tokens, latency, and guardrail events — directly to Moesif.
2. **Open Insights** in the AI Workspace left navigation menu, then click the button to open your Moesif workspace in a new tab.
3. **View analytics** in Moesif. All data resides in Moesif, not in the AI Workspace.

## Enabling Moesif on a Gateway

Analytics are published to Moesif only when your gateway runtime is configured with a Moesif Application ID. Set the `MOESIF_KEY` environment variable on the gateway runtime.

When you set up the gateway, add the key to the `configs/keys.env` file created during configuration:

```bash
MOESIF_KEY=<your-moesif-key>
```

Once the key is set and the gateway is running, the gateway publishes events to Moesif automatically. No changes to the AI Workspace are required.

For the full gateway setup procedure, see [Setting up an AI Gateway](ai-gateways/setting-up.md).

!!! note
    If `MOESIF_KEY` is not configured, the gateway does not publish telemetry and your Moesif workspace will not show any data.

## What Moesif Tracks

With the gateway Moesif integration active, your Moesif workspace shows:

- **Request and response traffic** — Volume, latency, and error rates.
- **Token usage** — Prompt, completion, and total tokens by model and provider.
- **Estimated LLM cost** — Cost estimates based on token consumption.
- **Guardrail policy triggers** — How often guardrails intervene.
- **Per-application and per-consumer breakdowns** — Usage for mapped [GenAI Applications](genai-applications.md) and consumers.

Filtering, segmentation, and dashboarding are done entirely within Moesif.

## Using Insights for Cost and Rate Limit Management

Moesif analytics are useful for tuning your [token-based rate limits](policies/rate-limit/token-based-rate-limit.md):

1. Use token usage trends to understand actual consumption patterns before setting rate limits.
2. Check per-consumer traffic to determine appropriate per-consumer limits.
3. Monitor error rates to detect rate limit violations (`429 Too Many Requests` responses) and adjust limits accordingly.

## Using Insights for Guardrail Monitoring

When guardrails are active, you can use Moesif analytics to:

- Track how often guardrails intervene (guardrail intervention responses appear as `422` errors).
- Identify which endpoints or consumers trigger the most interventions.
- Validate that newly configured guardrails behave as expected.

See [Guardrails Overview](policies/guardrails/overview.md) for more on configuring guardrails.

## Related

- [Setting up an AI Gateway](ai-gateways/setting-up.md) — Configure `MOESIF_KEY` on the gateway runtime
- [Token-Based Rate Limiting](policies/rate-limit/token-based-rate-limit.md) — Set token limits and use analytics to monitor usage
- [Guardrails Overview](policies/guardrails/overview.md) — Monitor guardrail interventions through analytics
- [Integrate API Platform with Moesif](../../cloud/monitoring-and-insights/integrate-bijira-with-moesif.md) — Advanced Moesif integration options for the broader API Platform