---
title: "Token-based rate limit"
description: "Limit LLM traffic by prompt, completion, or total token consumption within a configurable time window."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/rate-limit/token-based-rate-limit/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/rate-limit/token-based-rate-limit.md
tags:
  - cloud
  - ai-workspace
  - rate-limit
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Token-Based Rate Limit

The Token-Based Rate Limit policy enforces rate limits based on token consumption rather than request count. Limits can be applied to prompt (input) tokens, completion (output) tokens, or total tokens — independently or in combination.

## Configuration Parameters

At least one of the three limit categories must be configured. Any combination is valid.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **Prompt Token Limits** | Conditional | Rate limits applied to prompt (input) tokens. |
| **Completion Token Limits** | Conditional | Rate limits applied to completion (output) tokens. |
| **Total Token Limits** | Conditional | Rate limits applied to combined prompt + completion tokens. |

Each entry within a category requires:

| Field | Required | Description |
|-------|----------|-------------|
| **count** | Yes | Maximum tokens allowed within the duration. Minimum: `1`. |
| **duration** | Yes | Time window as a Go duration string (e.g., `"1m"`, `"1h"`, `"24h"`). |

When multiple limits are configured within a category, the most restrictive limit is enforced.

## Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **Token Based Rate Limit** from the sidebar.
5. Configure limits for prompt tokens, completion tokens, total tokens, or any combination.
6. Click **Add** (for providers) or **Submit** (for proxies).
7. Deploy the provider or proxy to apply the changes.

## Behavior

- Token counts are extracted from the LLM provider's response using paths defined in the provider template. 
- When any configured limit is exceeded, the gateway returns `429 Too Many Requests`.
- Each counter resets after its configured duration elapses.
- Rate limit headers are included in responses:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Configured token limit |
| `X-RateLimit-Remaining` | Remaining tokens in the current window |
| `X-RateLimit-Reset` | Time (epoch seconds) when the window resets |
| `RateLimit-*` | IETF equivalents of the above |

## Example: Cap Total Tokens Per Minute

Block requests once 100,000 total tokens have been consumed in a 1-minute window.

| Parameter | Value |
|-----------|-------|
| Total Token Limits — count | `100000` |
| Total Token Limits — duration | `1m` |

## Example: Separate Prompt and Completion Limits

Limit prompt tokens to 50,000 per hour and completion tokens to 20,000 per hour independently.

| Category | count | duration |
|----------|-------|----------|
| Prompt Token Limits | `50000` | `1h` |
| Completion Token Limits | `20000` | `1h` |

## Related

- [LLM Cost-Based Rate Limit](llm-cost-based-rate-limit.md) — Enforce monetary spending budgets instead of token counts
- [Rate Limit - Basic](../other-policies/basic-rate-limit.md) — Simple request count-based rate limiting
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version