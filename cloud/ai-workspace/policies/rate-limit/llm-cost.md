---
title: "LLM cost policy"
description: "Calculate the USD cost of each LLM call from token usage and pricing tier, for use with LLM cost-based rate limiting."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/rate-limit/llm-cost/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/rate-limit/llm-cost.md
tags:
  - cloud
  - ai-workspace
  - rate-limit
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# LLM Cost

The LLM Cost policy calculates the monetary cost of each LLM API call and makes the result available to other policies — primarily [LLM Cost-Based Rate Limit](llm-cost-based-rate-limit.md). It runs in the response phase, requires no user configuration, and never exposes the cost to the caller.

!!! info "Required for cost-based rate limiting"
    Add this policy to the same provider or proxy as **LLM Cost-Based Rate Limit**, and place it **after** it in the policy list. The gateway evaluates response-phase policies in reverse order, so the cost is calculated before the budget is checked.

## How It Works

1. When the LLM response arrives (including streaming/SSE responses), the policy reads the model name from the response body.
2. It looks up the model in the built-in pricing database.
3. It calculates the cost in USD based on token usage, context window tier, and service tier.
4. The result is stored in `SharedContext.Metadata["x-llm-cost"]` as a 10-decimal USD string (e.g., `"0.0000423100"`).

The cost is internal — it is never forwarded to the caller.

## Supported Providers

| Provider | Notes |
|----------|-------|
| **OpenAI** | All models including o-series reasoning tokens, batch API, and flex/priority service tiers |
| **Anthropic** | Claude models including prompt caching (read/write tokens), extended thinking, and speed/geo routing |
| **Google Gemini** | Google AI Studio and Vertex AI, including multi-modal (audio, image), web search grounding, and thinking models |
| **Mistral** | All Mistral models including audio duration-based billing (Voxtral) |

## Configuration Parameters

This policy has no user-configurable parameters. The pricing database path is a gateway-level system setting configured in `config.toml`.

## Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **LLM Cost** from the sidebar.
5. Click **Add** (for providers) or **Submit** (for proxies).
6. Deploy the provider or proxy to apply the changes.

## Behavior

- Handles both streaming (SSE) and non-streaming responses without configuration.
- Supports context-window tiered pricing (>128k, >200k, >272k token tiers where applicable).
- Supports service tiers: standard, priority, flex, and batch rates.
- If the model is not found in the pricing database, cost is set to `0`, a warning is logged, and the request is not blocked.
- The pricing database is bundled with the gateway image and loaded at startup. A gateway restart is required to pick up pricing file updates.

## Metadata Written

| Key | Value |
|-----|-------|
| `x-llm-cost` | USD cost as a 10-decimal string, e.g. `"0.0000423100"` |
| `x-llm-cost-status` | `"calculated"` on success, `"not_calculated"` if cost could not be determined |

## Related

- [LLM Cost-Based Rate Limit](llm-cost-based-rate-limit.md) — Enforce spending budgets using the calculated cost
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version