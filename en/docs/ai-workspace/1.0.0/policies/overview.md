---
title: "AI Workspace policies overview"
description: "What AI and MCP policies you can attach to LLM providers and proxies in AI Workspace, where each one is applied, and how the rate limit policies cap requests, tokens, and spend."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/policies/overview/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/policies/overview.md
tags:
  - cloud
  - ai-workspace
  - policies
  - rate-limit
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "overview"
---

# Policies overview

AI Workspace is where you attach policies to your large language model (LLM) providers and App LLM proxies and deploy them. The AI Gateway is what enforces them at request time.

That split runs through this section. This page covers what's available to attach and where it takes effect in the workspace. For what a policy does to a request, its configuration fields, and its error behavior, follow each policy through to the [Policy Hub](https://wso2.com/api-platform/policy-hub/), the registry that holds the specification and version history for every policy listed here.

Rate limiting is the exception: it's documented in full on this page, under [Rate limiting](#rate-limiting).

## Where policies are applied

Policies are configured through the management tabs of your LLM providers and App LLM proxies:

- **LLM provider** — rate limits and guardrails configured on a provider apply to every proxy that uses it.
- **App LLM proxy** — guardrails configured on a proxy specialize the behavior for one GenAI application or agent.

When both provider-level and proxy-level policies are active, both are enforced. Provider-level policies act as a baseline, and proxy-level policies add to it.

## Policy scope: global or per resource

Within a provider or proxy, each policy is attached at one of two scopes:

| Scope | Applies to | Counter behavior |
|-------|-----------|------------------|
| **Global** | Every endpoint of the provider or proxy | One shared counter across all endpoints |
| **Per resource** | A specific endpoint (path and method) | An independent counter per endpoint |

The difference is the scope of the counter for rate limits, and the breadth of application for guardrails:

- A **global** rate limit keeps one bucket for the whole provider or proxy. With a global limit of 100 requests per hour, 60 requests to `/chat/completions` plus 40 to `/embeddings` exhausts it, and the next request to either endpoint is rejected.
- A **per-resource** rate limit keeps an independent bucket per endpoint. The same limit attached to both endpoints allows 100 on each, counted separately.
- A **global** guardrail runs on every endpoint; a **per-resource** guardrail runs only on the endpoints you attach it to.

Global policies are evaluated before per-resource policies. Because of that ordering, a global rate limit counts every request attempt, including ones a tighter per-resource limit goes on to reject — making it a hard ceiling on total traffic through the provider or proxy.

## AI policies

These policies attach to LLM providers and App LLM proxies. Each links to its full reference.

### Guardrails

Guardrails inspect and act on request and response content:

| Guardrail | What it does |
|-----------|--------------|
| [Semantic prompt guard](https://wso2.com/api-platform/policy-hub/policies/semantic-prompt-guard) | Blocks or allows prompts by semantic similarity to configured phrases. Needs an embedding provider. |
| [PII masking regex](https://wso2.com/api-platform/policy-hub/policies/pii-masking-regex) | Masks personally identifiable information (PII) using regex patterns, and restores it in the response. |
| [Azure content safety](https://wso2.com/api-platform/policy-hub/policies/azure-content-safety-content-moderation) | Filters harmful content using Azure Content Safety moderation. Needs an Azure subscription. |
| [Granite Guardian prompt injection](https://wso2.com/api-platform/policy-hub/policies/granite-guardian-prompt-injection) | Detects prompt injection and jailbreak attempts using IBM Granite Guardian, and rejects flagged requests. Needs a Granite Guardian inference endpoint. |
| [NeMo Guard content safety](https://wso2.com/api-platform/policy-hub/policies/nvidia-nemoguard-content-safety) | Classifies requests and responses across NVIDIA NeMo Guard safety categories. Needs a NeMo Guard inference endpoint. |
| [Word count](https://wso2.com/api-platform/policy-hub/policies/word-count-guardrail) | Enforces word count limits on prompts or responses. |
| [Sentence count](https://wso2.com/api-platform/policy-hub/policies/sentence-count-guardrail) | Enforces sentence count limits on prompts or responses. |
| [Content length](https://wso2.com/api-platform/policy-hub/policies/content-length-guardrail) | Enforces byte-length limits on prompts or responses. |
| [JSON schema](https://wso2.com/api-platform/policy-hub/policies/json-schema-guardrail) | Validates content against a JSON schema. |
| [Regex](https://wso2.com/api-platform/policy-hub/policies/regex-guardrail) | Blocks or allows content matching a regular expression. |
| [URL](https://wso2.com/api-platform/policy-hub/policies/url-guardrail) | Validates URLs found in content. |
| [AWS Bedrock guardrail](https://wso2.com/api-platform/policy-hub/policies/aws-bedrock-guardrail) | Applies an AWS Bedrock guardrail to requests and responses. |
| [Semantic tool filtering](https://wso2.com/api-platform/policy-hub/policies/semantic-tool-filtering) | Filters the tools exposed to a model by semantic relevance to the user query. |

### Traffic management and prompt policies

These policies shape how requests are routed and composed:

| Policy | What it does |
|--------|--------------|
| [Model round robin](https://wso2.com/api-platform/policy-hub/policies/model-round-robin) | Distributes requests across models in round-robin order. |
| [Model weighted round robin](https://wso2.com/api-platform/policy-hub/policies/model-weighted-round-robin) | Distributes requests across models by assigned weight. |
| [LLM header router](https://wso2.com/api-platform/policy-hub/policies/llm-header-router) | Selects the target provider from a request header, so one OpenAI-shaped endpoint can fan out to several providers. |
| [Prompt decorator](https://wso2.com/api-platform/policy-hub/policies/prompt-decorator) | Prepends or appends content to every request. |
| [Prompt template](https://wso2.com/api-platform/policy-hub/policies/prompt-template) | Applies reusable parameterized prompt templates. |
| [Prompt compressor](https://wso2.com/api-platform/policy-hub/policies/prompt-compressor) | Compresses selected prompt text before the upstream call, using JSONPath targeting and rule-based thresholds. |
| [Semantic caching](https://wso2.com/api-platform/policy-hub/policies/semantic-cache) | Caches responses and serves them for semantically similar requests. |
| [Respond](https://wso2.com/api-platform/policy-hub/policies/respond) | Returns a response immediately without calling the upstream, for mocking and short-circuit logic. |

### Provider transformation policies

These policies translate an OpenAI Chat Completions request into another provider's API shape, and translate the response back. Pair them with the [LLM header router](https://wso2.com/api-platform/policy-hub/policies/llm-header-router) to route one endpoint across several providers. Use one on its own to point a single OpenAI-shaped endpoint at a different provider. For an end-to-end example configured on the gateway, see [Multi-provider routing](../../../ai-gateway/1.2.0/routing/multi-provider-routing.md).

| Policy | Target provider |
|--------|-----------------|
| [OpenAI to Anthropic transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-anthropic-transformer) | Anthropic Messages API |
| [OpenAI to Azure OpenAI transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-azure-openai-transformer) | Azure OpenAI |
| [OpenAI to Bedrock transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-bedrock-transformer) | AWS Bedrock Converse |
| [OpenAI to Gemini transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-gemini-transformer) | Google Gemini `generateContent` |
| [OpenAI to Mistral transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-mistral-transformer) | Mistral |

## Rate limiting

AI services bill per token, so uncontrolled usage turns into unexpected cost. AI Workspace gives you five rate limit policies, each capping a different measure of traffic:

| Policy | Caps | Specification |
|--------|------|---------------|
| [Rate limit - basic](#rate-limit-basic) | Request count | [Policy Hub](https://wso2.com/api-platform/policy-hub/policies/basic-ratelimit) |
| [Rate limit - advanced](#rate-limit-advanced) | Request count, with multi-dimensional and weighted quotas | [Policy Hub](https://wso2.com/api-platform/policy-hub/policies/advanced-ratelimit) |
| [Token-based rate limit](#token-based-rate-limit) | Prompt, completion, or total tokens | [Policy Hub](https://wso2.com/api-platform/policy-hub/policies/token-based-ratelimit) |
| [LLM cost](#llm-cost) | Nothing on its own—calculates the cost other policies spend against | [Policy Hub](https://wso2.com/api-platform/policy-hub/policies/llm-cost) |
| [LLM cost-based rate limit](#llm-cost-based-rate-limit) | Monetary spend in US dollars (USD) | [Policy Hub](https://wso2.com/api-platform/policy-hub/policies/llm-cost-based-ratelimit) |

You attach all of them through the **Guardrails** tab of an LLM provider or App LLM proxy. LLM providers also have a built-in **Rate Limiting** tab that caps requests and tokens without attaching a policy. See [Rate limiting on a provider](../llm-providers/manage-provider.md#rate-limiting) for that tab. Use a policy when you need a per-route cap, token categories counted separately, or a spending budget.

For how attachment scope changes what a counter covers, see [Policy scope: global or per resource](#policy-scope-global-or-per-resource).

### Attach a rate limit policy

The steps are the same for every rate limit policy:

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select the policy from the sidebar.
5. Configure its limits.
6. Click **Add** for a provider, or **Submit** for a proxy.
7. Deploy the provider or proxy to apply the change.

### Rate limit - basic

Caps the number of requests within a time window, regardless of token consumption.

Configure a list of rules, each with a `count` of requests and a `duration` time window. When you configure several, the most restrictive one is enforced.

**Behavior**

- Requests are counted per route or API.
- Exceeding the limit within the window returns HTTP `429 Too Many Requests`.
- The counter resets once the duration elapses.

### Rate limit - advanced

Caps request count like the basic policy, with more control over how requests are counted and where counters are stored. Use it when a single count-per-window rule isn't enough.

**Behavior**

- Chooses between the generic cell rate algorithm (GCRA), for smooth limiting, and fixed window, for a plain counter.
- Supports several quotas at once, each with its own key extraction and cost extraction.
- Weights requests, so one request can consume more than one unit of quota.
- Stores counters in memory, in Redis, or in Redis with a local async cache. If Redis is unreachable, it fails open and lets requests through.
- Returns `X-RateLimit-*`, IETF `RateLimit-*`, and `Retry-After` response headers.

!!! warning "Redis failures disable quota enforcement"
    With a Redis-backed counter, a Redis outage stops quotas being enforced rather than blocking traffic. Requests pass through unrestricted for as long as Redis is unreachable, which can drive unbounded upstream traffic and LLM spend. Alert on Redis availability, and pair the policy with a limit that doesn't depend on Redis — an in-memory rate limit, or a [token-based](#token-based-rate-limit) or [LLM cost-based](#llm-cost-based-rate-limit) limit — if you need a ceiling that survives the outage.

For the full configuration schema, see [Rate limit - advanced](https://wso2.com/api-platform/policy-hub/policies/advanced-ratelimit) in the Policy Hub.

### Token-based rate limit

Caps token consumption rather than request count. Limits apply to prompt (input) tokens, completion (output) tokens, or total tokens — independently or in combination.

Configure at least one of the three categories; any combination is valid. Each entry takes a `count` and a `duration`. Within a category, the most restrictive limit is enforced.

**Behavior**

- Token counts are extracted from the provider's response using paths defined in the provider template.
- Exceeding any configured limit returns `429 Too Many Requests`.
- Each counter resets after its own duration elapses.
- Responses carry rate limit headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Configured token limit |
| `X-RateLimit-Remaining` | Remaining tokens in the current window |
| `X-RateLimit-Reset` | Time, in epoch seconds, when the window resets |
| `RateLimit-*` | Internet Engineering Task Force (IETF) equivalents of the above |

**Example: cap total tokens per minute**

Block requests once 100,000 total tokens are consumed in a one-minute window:

| Parameter | Value |
|-----------|-------|
| Total token limits — count | `100000` |
| Total token limits — duration | `1m` |

**Example: separate prompt and completion limits**

Limit prompt tokens to 50,000 per hour and completion tokens to 20,000 per hour, counted independently:

| Category | count | duration |
|----------|-------|----------|
| Prompt token limits | `50000` | `1h` |
| Completion token limits | `20000` | `1h` |

### LLM cost

Calculates the monetary cost of each LLM call and makes the result available to other policies — primarily [LLM cost-based rate limit](#llm-cost-based-rate-limit). It runs in the response phase, takes no configuration, and never exposes the cost to the caller.

**How it works**

1. When the LLM response arrives, including streaming (SSE) responses, the policy reads the model name from the response body.
2. It looks the model up in the built-in pricing database.
3. It calculates the cost in USD from token usage, context window tier, and service tier.
4. It stores the result in `SharedContext.Metadata["x-llm-cost"]` as a 10-decimal USD string, for example `"0.0000423100"`.

**Supported providers**

| Provider | Notes |
|----------|-------|
| **OpenAI** | All models, including o-series reasoning tokens, batch API, and flex and priority service tiers |
| **Anthropic** | Claude models, including prompt caching (read and write tokens), extended thinking, and speed and geo routing |
| **Amazon Web Services (AWS) Bedrock** | Supported Bedrock models; extracts the model identifier (ID) from the request path |
| **Google Gemini** | Google AI Studio and Vertex AI, including multi-modal (audio, image), web search grounding, and thinking models |
| **Mistral** | All Mistral models, including audio duration-based billing (Voxtral) |

**Behavior**

- Handles streaming and non-streaming responses without configuration.
- Supports context-window tiered pricing, and the standard, priority, flex, and batch service tiers.
- If the model isn't in the pricing database, the cost is set to `0` and a warning is logged. The request isn't blocked.
- The pricing database ships with the gateway image and loads at startup, so a gateway restart is needed to pick up pricing updates. Its path is a gateway-level setting in `config.toml`.

**Metadata written**

| Key | Value |
|-----|-------|
| `x-llm-cost` | Cost in USD as a 10-decimal string, for example `"0.0000423100"` |
| `x-llm-cost-status` | `"calculated"` on success, `"not_calculated"` if the cost couldn't be determined |

### LLM cost-based rate limit

Enforces monetary spending budgets. It reads the per-call cost that the [LLM cost](#llm-cost) policy calculates, and blocks requests once a budget is exhausted within its time window.

!!! important "Add LLM cost after this policy in the list"
    The LLM cost policy must be attached to the same provider or proxy, and must sit **after** this one in the policy list. The gateway evaluates response-phase policies in reverse order, so that ordering is what calculates the cost before the budget is checked. Without it, no cost data exists and budget enforcement is skipped silently.

Configure one or more budget limits, each with an `amount` in USD and a `duration` time window. When you configure several, all are enforced and the most restrictive active limit applies.

**Behavior**

- Cost is read from `x-llm-cost` in shared metadata.
- Accumulated spend is tracked per route within each window.
- Once spend reaches the budget, subsequent requests receive `429 Too Many Requests`.
- Each window resets automatically when its duration elapses.
- Responses carry both internal-unit and USD values:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Budget limit in internal scaled units |
| `X-RateLimit-Remaining` | Remaining budget in internal scaled units |
| `x-ratelimit-cost-limit-dollars` | Budget limit in USD, for example `10.000000` |
| `x-ratelimit-cost-remaining-dollars` | Remaining budget in USD, for example `7.432100` |

**Example: a $10 hourly and $100 daily budget**

These two limits apply at once. Both must be satisfied for a request to proceed, and reaching either blocks requests until that window resets:

| Budget limit | amount | duration |
|--------------|--------|----------|
| Hourly cap | `10` | `1h` |
| Daily cap | `100` | `24h` |

## MCP policies

These policies attach to Model Context Protocol (MCP) proxies. To attach them in the workspace, see [Apply policies to an MCP proxy](../mcp-proxies/apply-policies.md).

| Policy | What it does |
|--------|--------------|
| [MCP access control](https://wso2.com/api-platform/policy-hub/policies/mcp-acl-list) | Allows or denies access to specific tools and resources. |
| [MCP authentication](https://wso2.com/api-platform/policy-hub/policies/mcp-auth) | Authenticates callers of the MCP proxy. |
| [MCP authorization](https://wso2.com/api-platform/policy-hub/policies/mcp-authz) | Authorizes tool and resource calls against the caller's privileges. |
| [MCP rewrite](https://wso2.com/api-platform/policy-hub/policies/mcp-rewrite) | Rewrites tool and resource definitions before they reach the client. |
| [MCP rate limit](https://wso2.com/api-platform/policy-hub/policies/mcp-ratelimit) | Limits the rate of MCP tool and method calls. |
| [CORS](https://wso2.com/api-platform/policy-hub/policies/cors) | Handles cross-origin resource sharing (CORS) preflight requests and adds CORS response headers. |
| [Set headers](https://wso2.com/api-platform/policy-hub/policies/set-headers) | Sets or appends request and response headers. |
| [Remove headers](https://wso2.com/api-platform/policy-hub/policies/remove-headers) | Removes request or response headers by name. |
| [Log message](https://wso2.com/api-platform/policy-hub/policies/log-message) | Logs request and response headers and payloads, including each chunk of a streaming response. |

## Custom policies

Beyond the built-in policies, you can write your own AI policy and deploy it to a gateway. Once a gateway runs a custom policy, it syncs into AI Workspace and appears under **Settings > Custom Policies**, where you can search, review, and delete the policies synced from your gateways. From there, attach it to a provider or proxy the same way as a built-in policy.

To build and roll one out end to end:

1. [Write an AI policy](writing-an-ai-policy.md)—implement the policy using the gateway SDK
2. [Build the gateway with AI policies](build-gateway-with-ai-policies.md)—package the policy into a custom AI Gateway image
3. [Apply AI policies to proxies](apply-ai-policies-to-proxies.md)—sync the policy to the organization and attach it to a provider or proxy

## Policy Hub

The policies in AI Workspace are powered by the [Policy Hub](https://wso2.com/api-platform/policy-hub/), a central registry of available policies and their versions. Visit it to browse every available policy alongside its documentation and configuration schema.
