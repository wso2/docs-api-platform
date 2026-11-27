---
title: "Policy Hub"
pagination_label: "Policy Hub"
description: "Browse the curated, versioned library of gateway policies for APIs in the Policy Hub."
slug: /policy-hub
---

The [Policy Hub](https://choreolabs.com/api-management/policy-hub/) is the official, curated collection of [gateway policies](../api-control-plane/develop-api-proxy/policy/overview.md). It gives you a growing library of production-ready, versioned policy implementations that you can apply to any API without writing custom code.

Policies are self-contained units of behavior that plug into the gateway's request and response pipeline. You compose them, like stacking authentication on top of rate limiting on top of a guardrail, as opposed to building each concern from scratch. If your requisites exceed what the hub provides, you can author and ship your own policies alongside hub ones.

The Policy Hub is powered by an [open source repository on GitHub](https://github.com/wso2/gateway-controllers). Every policy is versioned independently, the full source and documentation live in the repo, and contributions are welcome. For more information about contributing policies, see [Policy Development Guide](https://choreolabs.com/api-management/policy-hub/policy-development-guide).

## How Policies Work

A policy attaches to an API, covering all operations, or to a specific operation, and runs on the request phase, the response phase, or both. Multiple policies chain together on the same API, each one processing the message in sequence before it reaches the next. The gateway evaluates the chain at runtime. 

For more information, see [Policies](../api-control-plane/develop-api-proxy/policy/overview.md).

## Policy categories

### Security

Authenticate incoming requests and secure outbound calls to your backend, using mechanisms such as API keys and OAuth 2.0 (OAuth2).

| Policy | What it does |
| -- | -- |
| [API Key Auth](https://choreolabs.com/api-management/policy-hub/policies/api-key-auth) | Protects APIs with pre-shared API keys |
| [Basic Auth](https://choreolabs.com/api-management/policy-hub/policies/basic-auth) | Enforces HTTP Basic Authentication |
| [JWT Auth](https://choreolabs.com/api-management/policy-hub/policies/jwt-auth) | Validates JWT access tokens against one or more JWKS providers |
| [OAuth2 Generator](https://choreolabs.com/api-management/policy-hub/policies/oauth2-generator) | Generates an OAuth 2.0 or static bearer credential and injects it into a configurable request header before forwarding to the backend |
| [CORS](https://choreolabs.com/api-management/policy-hub/policies/cors) | Handles preflight requests and injects CORS response headers |
| [Subscription Validation](https://choreolabs.com/api-management/policy-hub/policies/subscription-validation) | Confirms the caller holds an active subscription for the target API |
| [Rate Limit - Basic](https://choreolabs.com/api-management/policy-hub/policies/basic-ratelimit) | Caps requests per time window |
| [Rate Limit - Advanced](https://choreolabs.com/api-management/policy-hub/policies/advanced-ratelimit) | Multi-dimensional quotas with GCRA or fixed-window algorithms, Redis backend support, and weighted limiting |

### Guardrails

Control what goes into and out of AI models. Guardrail policies block unsafe prompts in the request pipeline before they reach a model. In the response pipeline, they filter unsafe or non-compliant output before it reaches the caller.

| Policy | What it does |
| -- | -- |
| [AWS Bedrock Guardrail](https://choreolabs.com/api-management/policy-hub/policies/aws-bedrock-guardrail) | Validates content against AWS Bedrock Guardrails |
| [Azure Content Safety](https://choreolabs.com/api-management/policy-hub/policies/azure-content-safety-content-moderation) | Screens content against Azure Content Safety API |
| [Semantic Prompt Guard](https://choreolabs.com/api-management/policy-hub/policies/semantic-prompt-guard) | Blocks or allows prompts based on semantic similarity to configured allow/deny phrases |
| [PII Masking](https://choreolabs.com/api-management/policy-hub/policies/pii-masking-regex) | Masks or redacts PII from request/response bodies using configurable regex patterns |
| [JSON Schema Guardrail](https://choreolabs.com/api-management/policy-hub/policies/json-schema-guardrail) | Enforces a JSON Schema on request or response payloads |
| [Regex Guardrail](https://choreolabs.com/api-management/policy-hub/policies/regex-guardrail) | Validates content against a regular expression |
| [URL Guardrail](https://choreolabs.com/api-management/policy-hub/policies/url-guardrail) | Validates URLs found in request or response bodies |
| [Content Length Guardrail](https://choreolabs.com/api-management/policy-hub/policies/content-length-guardrail) | Enforces byte-length limits on payloads |
| [Word Count Guardrail](https://choreolabs.com/api-management/policy-hub/policies/word-count-guardrail) | Enforces word-count limits on payloads |
| [Sentence Count Guardrail](https://choreolabs.com/api-management/policy-hub/policies/sentence-count-guardrail) | Enforces sentence-count limits on payloads |

### AI and LLM

Policies designed specifically for the characteristics of AI APIs - cost, tokens, latency, and prompt structure.

| Policy | What it does |
| -- | -- |
| [LLM Cost](https://choreolabs.com/api-management/policy-hub/policies/llm-cost) | Calculates the monetary cost of each LLM call and stores it for downstream policies |
| [LLM Cost-Based Rate Limit](https://choreolabs.com/api-management/policy-hub/policies/llm-cost-based-ratelimit) | Enforces monetary budget quotas on LLM usage |
| [Token-Based Rate Limit](https://choreolabs.com/api-management/policy-hub/policies/token-based-ratelimit) | Caps usage by token count rather than request count |
| [Semantic Cache](https://choreolabs.com/api-management/policy-hub/policies/semantic-cache) | Caches LLM responses using vector similarity, returning cached results for semantically equivalent prompts |
| [Prompt Decorator](https://choreolabs.com/api-management/policy-hub/policies/prompt-decorator) | Injects system instructions or context into prompts at the gateway layer |
| [Prompt Template](https://choreolabs.com/api-management/policy-hub/policies/prompt-template) | Applies configurable templates to transform prompts before they reach the model |
| [Prompt Compressor](https://choreolabs.com/api-management/policy-hub/policies/prompt-compressor) | Compresses prompt text to reduce token usage before upstream calls |
| [Model Round Robin](https://choreolabs.com/api-management/policy-hub/policies/model-round-robin) | Distributes requests evenly across a pool of AI model endpoints |
| [Model Weighted Round Robin](https://choreolabs.com/api-management/policy-hub/policies/model-weighted-round-robin) | Distributes requests across model endpoints according to configured weights |
| [Respond](https://choreolabs.com/api-management/policy-hub/policies/respond) | Returns an immediate response without forwarding to the upstream backend |

### Transformation

Modify requests and responses in flight.

| Policy | What it does |
| -- | -- |
| [Request Rewrite](https://choreolabs.com/api-management/policy-hub/policies/request-rewrite) | Rewrites path, query parameters, and HTTP method before forwarding upstream |
| [Host Rewrite](https://choreolabs.com/api-management/policy-hub/policies/host-rewrite) | Overrides the `Host`/`:authority` header sent to the upstream |
| [Dynamic Endpoint](https://choreolabs.com/api-management/policy-hub/policies/dynamic-endpoint) | Routes a request to a named upstream at runtime |
| [Set Headers](https://choreolabs.com/api-management/policy-hub/policies/set-headers) | Adds or overwrites headers on requests or responses |
| [Remove Headers](https://choreolabs.com/api-management/policy-hub/policies/remove-headers) | Strips specified headers from requests or responses |
| [JSON/XML Mediator](https://choreolabs.com/api-management/policy-hub/policies/json-xml-mediator) | Converts payloads between JSON and XML formats |
| [Interceptor Service](https://choreolabs.com/api-management/policy-hub/policies/interceptor-service) | Calls a user-defined HTTP service during the request and/or response phase |

### Logging, Analytics, and Monitoring

| Policy | What it does |
| -- | -- |
| [Log Message](https://choreolabs.com/api-management/policy-hub/policies/log-message) | Logs request/response payload and headers |
| [Analytics Header Filter](https://choreolabs.com/api-management/policy-hub/policies/analytics-header-filter) | Controls which headers appear in analytics data using allow or deny mode |

## Common Use Cases

**AI guardrails:** Stack prompt-injection detection, [PII Masking](https://choreolabs.com/api-management/policy-hub/policies/pii-masking-regex), and a [Semantic Prompt Guard](https://choreolabs.com/api-management/policy-hub/policies/semantic-prompt-guard) on an LLM API to enforce safety and compliance requirements.

**LLM cost governance:** Combine the [LLM Cost](https://choreolabs.com/api-management/policy-hub/policies/llm-cost) policy with [LLM Cost-Based Rate Limit](https://choreolabs.com/api-management/policy-hub/policies/llm-cost-based-ratelimit) to define cost constraints that the gateway enforces transparently.

**Semantic caching:** Place the [Semantic Cache](https://choreolabs.com/api-management/policy-hub/policies/semantic-cache) policy on a high-traffic LLM API to serve cached responses for semantically equivalent questions, cutting both latency and cost.

**Multi-model routing:** Use [Model Weighted Round Robin](https://choreolabs.com/api-management/policy-hub/policies/model-weighted-round-robin) to distribute traffic across model endpoints by weight. 

## Independent Versioning

Every policy in the hub is versioned on its own track. When a new version ships, prior versions remain available, so existing deployments do not break.
