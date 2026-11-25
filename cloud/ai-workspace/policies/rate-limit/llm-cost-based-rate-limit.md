---
title: "LLM cost-based rate limit"
description: "Enforce monetary spending budgets on LLM traffic using the cost calculated by the LLM Cost policy."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/rate-limit/llm-cost-based-rate-limit/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/rate-limit/llm-cost-based-rate-limit.md
tags:
  - cloud
  - ai-workspace
  - rate-limit
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# LLM Cost-Based Rate Limit

The LLM Cost-Based Rate Limit policy enforces monetary spending limits on LLM traffic. It reads the cost of each API call calculated by the [LLM Cost](llm-cost.md) policy and blocks requests once a configured budget is exceeded within a time window.

!!! info "Prerequisites"
    The **LLM Cost** policy must be added to the same provider or proxy **after** this policy in the policy list. The gateway evaluates response-phase policies in reverse order, so the cost is calculated before the budget is checked. Without the LLM Cost, no cost data is available and budget enforcement is skipped.

## Configuration Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| **Budget Limits** | Yes | One or more spending caps. Each limit has an `amount` (in USD) and a `duration`. |
| **Budget Limits[].amount** | Yes | Maximum spend in USD within the time window (e.g., `10` for $10.00). Minimum: `0.000001`. |
| **Budget Limits[].duration** | Yes | Time window as a Go duration string (e.g., `"1h"`, `"24h"`, `"168h"` for one week). |

When multiple budget limits are configured, all of them are enforced — the most restrictive active limit applies.

## Add This Policy

1. Add this policy first, then add the **LLM Cost** policy after it in the policy list.
2. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
3. Click on the provider or proxy name.
4. Go to the **Guardrails** tab.
5. Click **+ Add Guardrail** and select **LLM Cost-Based Rate Limit** from the sidebar.
6. Add one or more budget limits, each with an **amount** and **duration**.
7. Click **Add** (for providers) or **Submit** (for proxies).
8. Deploy the provider or proxy to apply the changes.

## Behavior

- Cost is read from `x-llm-cost` in shared metadata, set by the LLM Cost.
- Accumulated spend is tracked per route within each time window.
- When the spend reaches the configured budget, subsequent requests receive `429 Too Many Requests`.
- Each budget window resets automatically when its duration elapses.
- Response headers include both internal-unit values and human-readable dollar amounts:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Budget limit in internal scaled units |
| `X-RateLimit-Remaining` | Remaining budget in internal scaled units |
| `x-ratelimit-cost-limit-dollars` | Budget limit in USD (e.g., `10.000000`) |
| `x-ratelimit-cost-remaining-dollars` | Remaining budget in USD (e.g., `7.432100`) |

## Example: $10/hour and $100/day Budget

The following configuration enforces two simultaneous spending limits. Both must be satisfied for requests to proceed — once either limit is reached, requests are blocked until that window resets.

| Budget Limit | amount | duration |
|--------------|--------|----------|
| Hourly cap | `10` | `1h` |
| Daily cap | `100` | `24h` |

## Related

- [LLM Cost](llm-cost.md) — Required: calculates the cost stored in metadata
- [Token-Based Rate Limit](token-based-rate-limit.md) — Enforce token consumption limits instead of monetary budgets
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version