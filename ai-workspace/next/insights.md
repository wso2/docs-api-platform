---
title: "Insights"
description: "Open your Moesif analytics workspace from the AI Workspace to view traffic, token usage, latency, and consumer behavior for your AI Gateways."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/insights/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/insights.md
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

AI Workspace doesn't embed or proxy Moesif content. The Insights page provides a button that opens your Moesif workspace in a new tab, and all analytics are viewed in Moesif itself.

## How it works

1. **Configure your AI Gateway** with a Moesif application ID (see [Enable Moesif on a gateway](#enable-moesif-on-a-gateway)). The gateway runtime publishes telemetry — requests, tokens, latency, and guardrail events — directly to Moesif.
2. **Open Insights** in the AI Workspace left navigation menu, then click the button to open your Moesif workspace in a new tab.
3. **View analytics** in Moesif. All data resides in Moesif, not in the AI Workspace.

## Enable Moesif on a gateway

Analytics are published to Moesif only when your gateway runtime is configured with a Moesif application ID. Set the `MOESIF_KEY` environment variable on the gateway runtime.

When you set up the gateway, add the key to `api-platform.env`, the environment file the gateway loads. `./scripts/setup.sh` generates that file, or `.\scripts\setup.ps1` on Windows:

```bash
MOESIF_KEY=<your-moesif-key>
```

Once the key is set and the gateway is running, the gateway publishes events to Moesif automatically. No changes to the AI Workspace are required.

For the full gateway setup procedure, see [Set up an AI Gateway](ai-gateways/setting-up.md).

!!! note
    If `MOESIF_KEY` isn't configured, the gateway doesn't publish telemetry, and your Moesif workspace shows no data.

## What Moesif tracks

With the gateway Moesif integration active, your Moesif workspace shows:

- **Request and response traffic** — Volume, latency, and error rates.
- **Token usage** — Prompt, completion, and total tokens by model and provider.
- **Estimated LLM cost** — Cost estimates based on token consumption.
- **Guardrail policy triggers** — How often guardrails intervene.
- **Per-application and per-consumer breakdowns** — Usage for mapped [GenAI applications](genai-applications.md) and consumers.

Filtering, segmentation, and dashboarding are done entirely within Moesif.

## Use Insights for cost and rate limit management

Use Moesif analytics to tune your [token-based rate limits](policies/overview.md#token-based-rate-limit):

1. Use token usage trends to understand actual consumption patterns before setting rate limits.
2. Check per-consumer traffic to determine appropriate per-consumer limits.
3. Monitor error rates to detect rate limit violations (`429 Too Many Requests` responses) and adjust limits accordingly.

## Use Insights for guardrail monitoring

When guardrails are active, you can use Moesif analytics to:

- Track how often guardrails intervene (guardrail intervention responses appear as `422` errors).
- Identify which endpoints or consumers trigger the most interventions.
- Validate that newly configured guardrails behave as expected.

See [Policies overview](policies/overview.md) for more on configuring guardrails.

## Related resources

- [Set up an AI Gateway](ai-gateways/setting-up.md)—configure `MOESIF_KEY` on the gateway runtime
- [Token-based rate limiting](policies/overview.md#token-based-rate-limit)—set token limits and use analytics to monitor usage
- [Policies overview](policies/overview.md)—monitor guardrail interventions through analytics
- [Integrate API Platform with Moesif](../../cloud/monitoring-and-insights/integrate-bijira-with-moesif.md)—advanced Moesif integration options for the broader API Platform