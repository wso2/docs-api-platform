---
title: "Policy Hub overview"
description: "Browse the curated, versioned library of gateway policies for APIs and MCP servers in the WSO2 API Platform Policy Hub."
canonical_url: https://wso2.com/api-platform/docs/policy-hub/overview/
md_url: https://wso2.com/api-platform/docs/policy-hub/overview.md
tags:
  - policy-hub
  - policies
  - gateway
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-29
content_type: "overview"
---

# WSO2 API Platform Policy Hub

[The Policy Hub](https://wso2.com/api-platform/policy-hub) is the official, curated collection of [gateway policies](../api-gateway/next/policies/overview.md) for the WSO2 API Platform. It gives you a growing library of production-ready, versioned policy implementations that you can apply to any API or MCP server without writing custom code.

Policies are self-contained units of behavior that plug into the gateway's request and response pipeline. You compose them, like stacking authentication on top of rate limiting on top of a guardrail, as opposed to building each concern from scratch. If your requisites exceed what the hub provides, you can author and ship your own policies alongside hub ones.

The Policy Hub is powered by an [open source repository on GitHub](https://github.com/wso2/gateway-controllers). Every policy is versioned independently, the full source and documentation live in the repo, and contributions are welcome. For more information about contributing policies, see [Policy Development Guide](https://wso2.com/api-platform/policy-hub/policy-development-guide).

## How Policies Work

A policy attaches to an API, covering all operations, or to a specific operation, and runs on the request phase, the response phase, or both. Multiple policies chain together on the same API, each one processing the message in sequence before it reaches the next. The gateway evaluates the chain at runtime. 

For more information, see [API Platform Policies overview](../api-gateway/next/policies/overview.md).

## Policy categories

### Security

Authenticate incoming requests and secure outbound calls to your backend, using mechanisms such as API keys, OAuth 2.0 (OAuth2), and mutual TLS (mTLS).

| Policy | What it does |
| -- | -- |
| [API Key Auth](https://wso2.com/api-platform/policy-hub/policies/api-key-auth) | Protects APIs with pre-shared API keys |
| [Basic Auth](https://wso2.com/api-platform/policy-hub/policies/basic-auth) | Enforces HTTP Basic Authentication |
| [JWT Auth](https://wso2.com/api-platform/policy-hub/policies/jwt-auth) | Validates JWT access tokens against one or more JWKS providers |
| [Mutual TLS Auth](https://wso2.com/api-platform/policy-hub/policies/mtls-auth) | Authenticates callers by the client certificate they present over mutual TLS, against accepted client certificate authorities |
| [OAuth2 Generator](https://wso2.com/api-platform/policy-hub/policies/oauth2-generator) | Generates an OAuth 2.0 or static bearer credential and injects it into a configurable request header before forwarding to the backend |
| [OAuth2 Token Exchange](https://wso2.com/api-platform/policy-hub/policies/oauth2-token-exchange) | Exchanges the caller's credential for a backend-specific token from an external OAuth2 authorization server |
| [CORS](https://wso2.com/api-platform/policy-hub/policies/cors) | Handles preflight requests and injects CORS response headers |
| [Subscription Validation](https://wso2.com/api-platform/policy-hub/policies/subscription-validation) | Confirms the caller holds an active subscription for the target API |
| [Rate Limit - Basic](https://wso2.com/api-platform/policy-hub/policies/basic-ratelimit) | Caps requests per time window |
| [Rate Limit - Advanced](https://wso2.com/api-platform/policy-hub/policies/advanced-ratelimit) | Multi-dimensional quotas with GCRA or fixed-window algorithms, Redis backend support, and weighted limiting |

### Guardrails

Control what goes into and out of AI models. Guardrail policies block unsafe prompts in the request pipeline before they reach a model. In the response pipeline, they filter unsafe or non-compliant output before it reaches the caller.

| Policy | What it does |
| -- | -- |
| [AWS Bedrock Guardrail](https://wso2.com/api-platform/policy-hub/policies/aws-bedrock-guardrail) | Validates content against AWS Bedrock Guardrails |
| [Azure Content Safety](https://wso2.com/api-platform/policy-hub/policies/azure-content-safety-content-moderation) | Screens content against Azure Content Safety API |
| [TypeSafe Jev Content Safety](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-content-safety) | Screens request or response content using TypeSafe AI's Jev System One model |
| [Semantic Prompt Guard](https://wso2.com/api-platform/policy-hub/policies/semantic-prompt-guard) | Blocks or allows prompts based on semantic similarity to configured allow/deny phrases |
| [Semantic Tool Filtering](https://wso2.com/api-platform/policy-hub/policies/semantic-tool-filtering) | Filters MCP tools to only those semantically relevant to the user query |
| [TypeSafe Jev Tool Filtering](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-tool-filtering) | Narrows the tools sent to an LLM to those relevant to the user prompt, using TypeSafe AI's Jev System One model |
| [PII Masking](https://wso2.com/api-platform/policy-hub/policies/pii-masking-regex) | Masks or redacts PII from request/response bodies using configurable regex patterns |
| [JSON Schema Guardrail](https://wso2.com/api-platform/policy-hub/policies/json-schema-guardrail) | Enforces a JSON Schema on request or response payloads |
| [Regex Guardrail](https://wso2.com/api-platform/policy-hub/policies/regex-guardrail) | Validates content against a regular expression |
| [URL Guardrail](https://wso2.com/api-platform/policy-hub/policies/url-guardrail) | Validates URLs found in request or response bodies |
| [Content Length Guardrail](https://wso2.com/api-platform/policy-hub/policies/content-length-guardrail) | Enforces byte-length limits on payloads |
| [Word Count Guardrail](https://wso2.com/api-platform/policy-hub/policies/word-count-guardrail) | Enforces word-count limits on payloads |
| [Sentence Count Guardrail](https://wso2.com/api-platform/policy-hub/policies/sentence-count-guardrail) | Enforces sentence-count limits on payloads |

### AI and LLM

Policies designed specifically for the characteristics of AI APIs — cost, tokens, latency, and prompt structure.

| Policy | What it does |
| -- | -- |
| [LLM Cost](https://wso2.com/api-platform/policy-hub/policies/llm-cost) | Calculates the monetary cost of each LLM call and stores it for downstream policies |
| [LLM Cost-Based Rate Limit](https://wso2.com/api-platform/policy-hub/policies/llm-cost-based-ratelimit) | Enforces monetary budget quotas on LLM usage |
| [Token-Based Rate Limit](https://wso2.com/api-platform/policy-hub/policies/token-based-ratelimit) | Caps usage by token count rather than request count |
| [Semantic Cache](https://wso2.com/api-platform/policy-hub/policies/semantic-cache) | Caches LLM responses using vector similarity, returning cached results for semantically equivalent prompts |
| [Prompt Decorator](https://wso2.com/api-platform/policy-hub/policies/prompt-decorator) | Injects system instructions or context into prompts at the gateway layer |
| [Prompt Template](https://wso2.com/api-platform/policy-hub/policies/prompt-template) | Applies configurable templates to transform prompts before they reach the model |
| [Prompt Compressor](https://wso2.com/api-platform/policy-hub/policies/prompt-compressor) | Compresses prompt text to reduce token usage before upstream calls |
| [Model Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-round-robin) | Distributes requests evenly across a pool of AI model endpoints |
| [Model Weighted Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-weighted-round-robin) | Distributes requests across model endpoints according to configured weights |
| [TypeSafe Jev Model Routing](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-model-routing) | Routes AI/LLM requests to different models using TypeSafe AI's Jev System One model |
| [Respond](https://wso2.com/api-platform/policy-hub/policies/respond) | Returns an immediate response without forwarding to the upstream backend |

### MCP (Model Context Protocol)

A dedicated policy tier for securing and controlling MCP servers — the emerging standard for exposing tools, resources, and prompts to AI agents.

| Policy | What it does |
| -- | -- |
| [MCP Authentication](https://wso2.com/api-platform/policy-hub/policies/mcp-auth) | Secures MCP server traffic per the MCP specification authorization profile |
| [MCP Authorization](https://wso2.com/api-platform/policy-hub/policies/mcp-authz) | Validates access to MCP tools, resources, and prompts using JWT claims or OAuth scopes |
| [MCP Access Control](https://wso2.com/api-platform/policy-hub/policies/mcp-acl-list) | Controls which tools, resources, and prompts a caller can reach using allow/deny lists |
| [MCP Rewrite](https://wso2.com/api-platform/policy-hub/policies/mcp-rewrite) | Defines user-facing tool names and maps them to backend capability names |
| [TypeSafe Jev MCP Tool Intent Verification](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-mcp-tool-intent-verification) | Screens MCP tool calls using TypeSafe AI's Jev System One model |
| [TypeSafe Jev MCP Tool Result Screening](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-mcp-tool-result-screening) | Screens MCP tool results using TypeSafe AI's Jev System One model before the agent reads them |

### Transformation

Modify requests and responses in flight.

| Policy | What it does |
| -- | -- |
| [Request Rewrite](https://wso2.com/api-platform/policy-hub/policies/request-rewrite) | Rewrites path, query parameters, and HTTP method before forwarding upstream |
| [Host Rewrite](https://wso2.com/api-platform/policy-hub/policies/host-rewrite) | Overrides the `Host`/`:authority` header sent to the upstream |
| [Dynamic Endpoint](https://wso2.com/api-platform/policy-hub/policies/dynamic-endpoint) | Routes a request to a named upstream at runtime |
| [Set Headers](https://wso2.com/api-platform/policy-hub/policies/set-headers) | Adds or overwrites headers on requests or responses |
| [Remove Headers](https://wso2.com/api-platform/policy-hub/policies/remove-headers) | Strips specified headers from requests or responses |
| [JSON/XML Mediator](https://wso2.com/api-platform/policy-hub/policies/json-xml-mediator) | Converts payloads between JSON and XML formats |
| [Interceptor Service](https://wso2.com/api-platform/policy-hub/policies/interceptor-service) | Calls a user-defined HTTP service during the request and/or response phase |

### Logging, Analytics, and Monitoring

| Policy | What it does |
| -- | -- |
| [Log Message](https://wso2.com/api-platform/policy-hub/policies/log-message) | Logs request/response payload and headers |
| [Analytics Header Filter](https://wso2.com/api-platform/policy-hub/policies/analytics-header-filter) | Controls which headers appear in analytics data using allow or deny mode |

## Common Use Cases

__AI guardrails__: Stack prompt-injection detection, PII masking, and a semantic prompt guard on an LLM API to enforce safety and compliance requirements.

__LLM cost governance__: Combine the LLM Cost policy with LLM Cost-Based Rate Limit to define cost constraints that the gateway enforces transparently.

__MCP server security__: Apply MCP Authentication, MCP Authorization, and MCP Access Control together to fully secure an MCP server: authenticate the caller, validate their OAuth scopes, and restrict which tools they can invoke.

__Semantic caching__: Place the Semantic Cache policy on a high-traffic LLM API to serve cached responses for semantically equivalent questions, cutting both latency and cost.

__Multi-model routing__: Use Model Weighted Round Robin to distribute traffic across model endpoints by weight. 

## Independent Versioning

Every policy in the hub is versioned on its own track. When a new version ships, prior versions remain fully available; so running deployments do not break by upon an update.

## Extending the Hub

The [API Platform CLI can build a custom gateway image](../api-gateway/1.1.0/policies/custom-policies/building-gateway-with-custom-policies.md) that bundles any combination of hub policies and policies you write yourself. So you can fill your requirement gaps, if any, with local implementations, and contribute them to Policy Hub.