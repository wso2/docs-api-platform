---
title: "Monetize an AI API with the AI Workspace and Moesif"
description: "Charge for an Anthropic Claude LLM API exposed through the WSO2 AI Workspace: attribute usage per consumer with GenAI Applications, publish token usage to Moesif, and connect Stripe to bill consumers for the tokens they consume."
canonical_url: https://wso2.com/api-platform/docs/guides/monetization/ai-api-monetization/
md_url: https://wso2.com/api-platform/docs/guides/monetization/ai-api-monetization.md
tags:
  - guides
  - monetization
  - ai-workspace
  - moesif
  - anthropic
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-08
content_type: "tutorial"
---

# Monetize an AI API with the AI Workspace and Moesif

## Overview

This guide shows you how to monetize an LLM API — an Anthropic Claude service exposed through the WSO2 AI Workspace — and charge consumers for the tokens they consume. The AI Gateway captures each LLM call as an analytics event, including per-call token usage and the consuming application, and publishes it to Moesif. In Moesif you define usage-based billing meters and connect a billing provider such as Stripe to invoice consumers automatically. No billing code required.

By the end, you'll have a Claude LLM provider deployed through the AI Workspace, per-consumer usage attributed with GenAI Applications, token usage flowing to Moesif, and a billing meter connected to Stripe.

!!! note "AI APIs are monetized through Moesif, not Stripe subscription plans"
    The Stripe **subscription plan** flow under **Admin > Settings** (used in [Monetize a REST API with Stripe](api-monetization.md)) applies to REST API proxies on the cloud gateway — it is **not** available for AI APIs. LLM traffic through the AI Workspace is billed on **token and cost usage** published to Moesif, which connects to a billing provider such as Stripe. This is the same metered-billing model used for [MCP tool monetization](mcp-tool-monetization.md), and it fits AI APIs because the real cost driver is tokens consumed, not requests made.

---

## Key concepts

Before you start, here are the terms this guide uses:

**AI Workspace** is the WSO2 API Platform control plane for AI. You manage LLM providers, App LLM proxies, GenAI applications, guardrails, rate limits, and AI consumption insights from it.

**AI Gateway** is the runtime that routes requests between consumer applications and LLM providers, enforces policies, and publishes analytics events.

**LLM Provider** connects the AI Workspace to an AI service such as Anthropic. Consumers call the provider's Invoke URL with a gateway API key; the gateway injects the backend Anthropic key.

**GenAI Application** represents a real consumer application and groups the API keys it uses, so usage — including tokens and cost — is attributed per application rather than per raw key. This is what lets you bill the right consumer.

**Moesif** is the analytics and monetization platform WSO2 API Platform integrates with. The AI Workspace Insights page is already Moesif-powered. Moesif receives token-usage events, applies usage-based billing meters, and connects to a billing provider.

**Billing provider** is the payment platform (such as Stripe, Recurly, or Chargebee) that Moesif connects to for invoicing and payment collection.

---

## Prerequisites

- A WSO2 API Platform account. Sign up for free at [console.bijira.dev](https://console.bijira.dev).
- An Anthropic API key for the backend Claude service. Create one in the [Anthropic Console](https://console.anthropic.com/).
- A Moesif account and a Collector **Application ID**. Sign up at [moesif.com](https://www.moesif.com/).
- A billing provider account (this guide uses Stripe) with access to the [Stripe Dashboard](https://dashboard.stripe.com/) for connecting it to Moesif.
- Python 3 and `pip` for generating traffic with the Anthropic SDK.

---

## Architecture

```text
AI API consumers (apps / agents)

    |  HTTPS + gateway API key (X-API-Key)
    v

+-----------------------------------+
|          WSO2 AI Gateway           |
|  auth · token/cost limits · audit  |
+-----------------------------------+

    |  HTTPS (backend key)            |  analytics events (tokens, app)
    v                                 v

Anthropic Claude API           +---------------------------+
                               |          Moesif           |
                               |  usage meters · billing   |
                               +-------------+-------------+
                                             |
                                             v
                               +---------------------------+
                               |    Billing provider       |
                               |    (Stripe) invoicing     |
                               +---------------------------+
```

A consumer application calls the Claude provider through the gateway with its API key. The gateway validates the key, injects the backend Anthropic key, forwards the call to Claude, and asynchronously publishes a usage event — including token counts and the owning GenAI Application — to Moesif. Moesif meters token usage per consumer and connects to Stripe for invoicing. The gateway never touches payment details, and consumers never see your Anthropic key.

---

## Step 1: Deploy a Claude LLM provider in the AI Workspace

Set up an AI Gateway and an Anthropic Claude LLM provider so the gateway fronts Claude and injects your backend key.

Follow [Get started with AI Workspace](../../cloud/ai-workspace/getting-started.md) to:

1. Create and connect an **AI Gateway** so its status is **Active**.
2. Add an **Anthropic** LLM provider with your Anthropic **API Key**, then **Deploy to Gateway**.

Return here once the provider is deployed and its Invoke URL is available.

!!! note
    Monetization is applied to the LLM provider (or an App LLM proxy), not the backend. Because the gateway authenticates every consumer and records token usage per call, you can bill each consumer accurately without exposing your Anthropic key.

---

## Step 2: Attribute usage per consumer with GenAI Applications

To bill each consumer, the gateway must know *which* consumer made each call. A GenAI Application groups the API keys an application uses, so Moesif can attribute tokens and cost to that application.

1. In the AI Workspace, generate an **API key** for the deployed Claude provider (**Security** tab of the provider).
2. Open **GenAI Applications** from the left navigation menu and click **+ Create Application**. Name it after the consumer — for example, `Support Copilot`.
3. Open the application, go to **API Keys**, click **Attach API Keys**, and select the key you generated.
4. Save the mapping.

**Expected result:** Calls made with the mapped key are attributed to the `Support Copilot` GenAI Application in analytics events.

!!! tip
    Create one GenAI Application per paying consumer or workload, and map every key that consumer uses. Complete mappings keep the billing attribution accurate. See [GenAI Applications](../../cloud/ai-workspace/genai-applications.md) for details.

---

## Step 3: Protect your margin with a cost or token limit

Unlike a REST API, an LLM charges you per token, so a single expensive prompt can cost far more than a cheap one. Bound each consumer so a runaway workload can't exceed what they pay for.

1. In the AI Workspace, open the Claude provider (or an App LLM proxy) and go to the rate-limit configuration.
2. Attach one of:
    - **Token-Based Rate Limit** — cap prompt and completion tokens per time window. See [Token-Based Rate Limit](../../cloud/ai-workspace/policies/rate-limit/token-based-rate-limit.md).
    - **LLM Cost-Based Rate Limit** — cap spend in USD per time window (pair it with the [LLM Cost](../../cloud/ai-workspace/policies/rate-limit/llm-cost.md) policy). See [LLM Cost-Based Rate Limit](../../cloud/ai-workspace/policies/rate-limit/llm-cost-based-rate-limit.md).
3. Set a per-consumer limit — for example, `100000` tokens per **Month** — then deploy the provider to apply it.

**Expected result:** The gateway blocks calls with `HTTP 429` once a consumer exceeds the configured token or cost limit, protecting you from unbounded LLM spend.

---

## Step 4: Publish AI usage to Moesif

The AI Workspace Insights page is already Moesif-powered, but monetization needs the events in *your* Moesif organization where you control billing meters. Connect your Moesif Collector Application ID at the organization level.

Follow [Integrate API Platform with Moesif](../../cloud/monitoring-and-insights/integrate-bijira-with-moesif.md) to:

1. Copy your Moesif **Collector Application Id**.
2. In the API Platform Console, go to **Admin > Settings** at the organization level, open **Moesif Dashboard**, select your environment, paste the Application Id, and click **Add**.

**Expected result:** The gateway publishes every LLM call — with token usage and the owning GenAI Application — to your Moesif organization.

!!! note
    After configuring the Moesif key, wait about five minutes before generating traffic so the integration is fully active.

---

## Step 5: Generate LLM traffic

Call the Claude provider with the mapped API key so Moesif receives token-usage events attributed to your GenAI Application.

```python
import anthropic

INVOKE_URL = "https://<gateway-host>/<context>"   # from the provider's Invoke URL
API_KEY = "<your-gateway-api-key>"                 # the key mapped to Support Copilot

client = anthropic.Anthropic(api_key=API_KEY, base_url=INVOKE_URL)

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=256,
    messages=[{"role": "user", "content": "In one sentence, what is API monetization?"}],
)

print(response.content[0].text)
```

Replace `<gateway-host>/<context>` with the provider's Invoke URL and `<your-gateway-api-key>` with the mapped key. The Anthropic SDK sends the key as the `x-api-key` header automatically.

**Expected result:** A successful Claude response. Within a few seconds, the call appears in your Moesif **Live Event Log** with token counts and the `Support Copilot` application. For other SDKs and languages, see [Invoke providers and proxies via SDKs](../../cloud/ai-workspace/using-sdks.md).

---

## Step 6: Create a usage-based billing meter in Moesif

In Moesif, define a billing meter that turns token usage into a billable quantity. This is where you decide what to charge for and how much.

1. In the Moesif dashboard, go to **Billing Meters** and create a new meter.
2. Set the meter to aggregate token usage — for example, sum the total-tokens field on each event — and filter the events to your Claude traffic (by provider, endpoint, or company/user mapped from the GenAI Application).
3. Choose a pricing model (for example, a per-1K-token unit price, or tiered/volume pricing) and a billing period.
4. Save the meter.

**Expected result:** The meter aggregates incoming token-usage events into a billable quantity per consumer.

!!! note
    Because the gateway publishes token counts and the consumer identity with each event, you can meter per token, per model, or per consumer. Set your price above your Anthropic per-token cost so each billed token stays profitable. See the [Moesif metered billing documentation](https://www.moesif.com/docs/metered-billing/) for meter configuration.

---

## Step 7: Connect Stripe as the billing provider

Connect Moesif to Stripe so metered token usage is converted into invoices and payments automatically.

1. In the Moesif dashboard, open **Settings > Extensions** (or **Billing Provider**) and select **Stripe**.
2. Authorize Moesif to access your Stripe account, or enter your Stripe API key.
3. Map your Moesif billing meter to a Stripe product and price.
4. Save the integration.

**Expected result:** Moesif reports metered token usage to Stripe, which issues invoices and collects payment from subscribed consumers. WSO2 API Platform never stores payment details.

!!! note
    Moesif also integrates with Recurly, Chargebee, and Zuora. The same metered token usage drives billing regardless of the provider you choose.

---

## Verify

1. Confirm token usage is captured. Make a call with the mapped key, then open the Moesif **Live Event Log**.

    **Expected result:** The call appears with token counts and the `Support Copilot` GenAI Application.

2. Confirm the cost/token limit is enforced. Make repeated calls until the limit from Step 3 is exceeded.

    **Expected result:** The gateway returns `HTTP 429` Too Many Requests, and no further LLM cost is incurred for that consumer in the period.

3. Confirm usage drives billing. Make several calls, then open the billing meter in Moesif.

    **Expected result:** The meter quantity increases by the tokens consumed, and the projected charge reflects your configured price.

---

## Troubleshooting

| Symptom | Resolution |
|---|---|
| Calls return `HTTP 401` from the gateway | Confirm you are sending the gateway API key in the location set on the provider's **Security** tab (default `X-API-Key`). |
| Calls return `HTTP 401` from the backend | Confirm the backend Anthropic API key on the provider is valid in the Anthropic Console. |
| Usage not attributed to a GenAI Application | Confirm the API key used for the call is attached to the application in **GenAI Applications > API Keys**. |
| No events appear in Moesif | Confirm the Moesif Collector Application Id is configured under **Admin > Settings > Moesif Dashboard**, and that you waited a few minutes after adding it. |
| Events appear in Moesif but the meter stays at zero | Confirm the billing meter's filter matches your Claude traffic and that it aggregates the token-usage field. |
| `HTTP 429` sooner than expected | Confirm the token or cost limit matches your intended per-consumer budget. Large prompts and completions consume tokens quickly. |
| Stripe invoices not generated | Confirm the Stripe integration is authorized in Moesif and the billing meter is mapped to a Stripe product and price. |

---

## What you learned

- Deployed an Anthropic Claude LLM provider through the AI Workspace so the gateway authenticates consumers and injects the backend key.
- Attributed usage per consumer with GenAI Applications — the basis for per-consumer billing.
- Bounded per-consumer LLM spend with a token-based or cost-based rate limit — the metering dimension that matters most for AI APIs.
- Published token-usage events to Moesif and created a usage-based billing meter that counts tokens per consumer.
- Connected Stripe as the billing provider so metered token usage is invoiced and collected automatically, without billing code.

---

## Next steps

- [Insights](../../cloud/ai-workspace/insights.md) — analyze token usage, cost, and per-application activity to tune your meters and limits.
- [LLM Cost-Based Rate Limit](../../cloud/ai-workspace/policies/rate-limit/llm-cost-based-rate-limit.md) — enforce USD spending budgets per consumer.
- [Monetize MCP Tools with the Self-Hosted Gateway](mcp-tool-monetization.md) — bill AI agents per MCP tool call with Moesif and Stripe.
- [Monetize a REST API with Stripe](api-monetization.md) — compare the subscription-plan monetization flow for standard REST APIs.
