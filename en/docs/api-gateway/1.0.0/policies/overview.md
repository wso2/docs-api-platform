---
title: "API Platform Policies Overview"
description: "Understand gateway policies in WSO2 API Platform: how Go and Python policies execute in the request and response pipeline and how to chain them."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/1.0.0/policies/overview/
md_url: https://wso2.com/api-platform/docs/api-gateway/1.0.0/policies/overview.md
tags:
  - api-gateway
  - policies
  - extensibility
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-11
content_type: "concept"
---

# API Platform Policies Overview

## What is a Policy?

A policy is a pluggable unit of behavior that runs in the gateway request or response pipeline. Policies can be applied at the API level (all operations) or at individual operation level, and can run on requests, responses, or both.

Policies handle cross-cutting concerns such as authentication, rate limiting, header manipulation, payload transformation, content moderation, and LLM-specific controls (prompt decoration, semantic caching, token limits, guardrails). Multiple policies can be chained together on the same API or operation.

Each built-in policy is versioned independently. When a new version is published, older versions remain available so existing deployments are not affected.

You can also write your own policy and then use API Platform CLI to build a custom gateway image that includes any combination of built-in policies and your own implementations. For more information, see [Custom Policies](custom-policies/writing-a-custom-policy.md).

## Policy Languages and Runtimes

The gateway supports **two languages** for authoring policies:

| Language | Runtime | Best For |
|----------|---------|----------|
| **Go** (default) | Compiled into the Policy Engine binary | Standard API policies — authentication, rate limiting, header manipulation, guardrails |
| **Python** (beta) | Executed by the Python Executor | AI/ML workloads, prompt engineering, complex data transformations, and scenarios that benefit from Python's rich ecosystem |

Go is the **primary and recommended language** for policy development. It provides maximum execution performance, strict type safety, and minimal per-request latency. Python is available as a **specialized runtime** for use cases where access to Python-native libraries (NLP toolkits, compression engines, ML inference clients, etc.) outweighs the overhead of cross-process communication.

## How Policies Execute

Understanding where each language fits requires a brief look at the Gateway Runtime architecture:

```
                        ┌──────────────────────────────────────┐
                        │          Gateway Runtime             │
  Incoming              │                                      │
  Request  ────────►    │  ┌────────┐      ┌──────────────┐    │     Upstream
                        │  │ Router │─────►│ Policy Engine│────┼────► Backend
  Response ◄────────    │  │(Envoy) │◄─────│   (Go)       │    │
                        │  └────────┘      └──────┬───────┘    │
                        │                         │ gRPC/UDS   │
                        │                  ┌──────▼───────┐    │
                        │                  │   Python     │    │
                        │                  │   Executor   │    │
                        │                  └──────────────┘    │
                        └──────────────────────────────────────┘
```

- **Go policies** are compiled directly into the **Policy Engine** binary at image build time. When the Router hands off a request to the Policy Engine via the `ext_proc` filter, Go policies execute in-process with zero serialization overhead.

- **Python policies** run in a dedicated **Python Executor** process. The Go Policy Engine delegates execution to the Python Executor over a local gRPC connection using a Unix Domain Socket. The executor manages policy lifecycle — loading, initialization, execution, and teardown in an isolated Python runtime.

!!! note
    Both Go and Python policies share the same policy evaluation pipeline. From the perspective of API configuration and deployment, a policy's language is transparent — you attach Go and Python policies to APIs in exactly the same way.

## Policy Anatomy

Regardless of language, every policy consists of two parts:

* Policy definition
* Policy implementation

### Policy Definition (`policy-definition.yaml`)

A declarative YAML file that describes the policy's identity, version, and configuration schema. This file is the same for both Go and Python policies.

```yaml
name: my-policy
version: v1.0.0
displayName: My Policy
description: |
  A short description of what this policy does.

parameters:
  type: object
  properties:
    myParam:
      type: string
      description: "An example parameter."
      default: "hello"
  required:
    - myParam

systemParameters:
  type: object
  additionalProperties: false
  properties: {}
```

| Field | Purpose |
|-------|---------|
| `name` | Unique policy identifier, used in API definitions to reference the policy |
| `version` | Semantic version (e.g., `v1.0.0`). The major version is used as the policy version qualifier |
| `parameters` | JSON Schema describing the user-configurable parameters for the policy |
| `systemParameters` | JSON Schema for operator-level configuration (set via gateway config, not per-API) |

### Policy Implementation

The implementation is where the two languages diverge.

### Go Policies

Go is the **default and recommended** language for policy development. Every built-in policy that ships with the gateway — authentication, rate limiting, CORS, guardrails, header manipulation — is written in Go.

#### Why Go?

- **Performance:** Compiled into the Policy Engine binary. No serialization, no IPC, no interpreter overhead.
- **Type safety:** Compile-time guarantees reduce runtime errors in production.
- **Ecosystem alignment:** The Policy Engine, Gateway Builder, and Gateway Controller are all Go codebases.
- **Broad applicability:** Ideal for the vast majority of API management use cases.

#### Go Policy Structure

A Go policy is a standard **Go module** containing the policy definition and the implementation:

```
my-go-policy/
├── policy-definition.yaml
├── go.mod
├── go.sum
├── policy.go
└── policy_test.go
```

| File | Purpose |
|------|---------|
| `policy-definition.yaml` | Declares name, version, and parameter schema |
| `go.mod` / `go.sum` | Go module definition and dependency lockfiles |
| `policy.go` | Policy implementation |
| `policy_test.go` | Unit tests for the policy logic |

Go policies implement interfaces from the gateway's Policy SDK. The Policy Engine loads them at build time via the `build.yaml` manifest.

#### Build Integration

Go policies are referenced in `build.yaml` using the `gomodule` field, which points to the Go module path:

```yaml
policies:
  - name: my-go-policy
    gomodule: github.com/wso2/gateway-controllers/policies/my-go-policy@v1
```

The **Gateway Builder** resolves these modules, compiles them into the Policy Engine binary, and produces a custom gateway image containing all declared policies.

### Python Policies (Beta)

Python policy support extends the gateway's capabilities into domains where Python's ecosystem is unmatched — particularly **AI/ML, natural language processing, and complex data transformations**.

#### Why Python?

- **AI/ML ecosystem:** Direct access to libraries like `transformers`, `tiktoken`, `scikit-learn`, and custom compression engines.
- **Rapid prototyping:** Faster iteration for experimental or research-oriented policies.
- **Specialized use cases:** Prompt compression, semantic analysis, content classification, and other tasks where Python libraries provide capabilities that would be impractical to reimplement in Go.

#### Python Policy Structure

Python policies follow the standard `src` layout and are packaged as installable Python packages:

```
my-python-policy/
├── policy-definition.yaml
├── pyproject.toml
├── requirements.txt
├── src/
│   └── my_python_policy_v1/
│       ├── __init__.py
│       └── policy.py
└── tests/
    └── test_policy.py
```

| File | Purpose |
|------|---------|
| `policy-definition.yaml` | Same format as Go — declares name, version, and parameter schema |
| `pyproject.toml` | Standard Python packaging configuration. Uses `hatchling` as the build backend |
| `requirements.txt` | Runtime dependencies |
| `src/<package>/policy.py` | Policy implementation |
| `tests/` | Unit tests for the policy logic |

#### Build Integration

Python policies are referenced in `build.yaml` using the `pipPackage` field instead of `gomodule`:

```yaml
policies:
  - name: my-python-policy
    pipPackage: github.com/wso2/gateway-controllers/policies/my-python-policy@v1
```

The Gateway Builder resolves the Python package, installs its dependencies, generates the policy registry, and bundles everything into the gateway image alongside the Python Executor.

## Choosing a Language for Policy

Use this decision guide when planning a new policy:

| Consideration | Choose Go | Choose Python |
|---------------|-----------|---------------|
| **Performance-critical path** | ✅ In-process, zero overhead | ❌ Cross-process gRPC call |
| **Standard API management** (auth, rate limiting, headers) | ✅ Existing patterns and SDK | Possible, but unnecessary |
| **AI/ML or NLP processing** | Requires reimplementation of libraries | ✅ Direct access to Python ecosystem |
| **Complex data transformations** | Good for structured transforms | ✅ Better for text/NLP transforms |
| **Third-party library dependency** | Go library must exist | ✅ Vast PyPI ecosystem |
| **Production stability** | ✅ Compiled, type-safe | Interpreted, requires thorough testing |
| **Team expertise** | Go-proficient team | Python-proficient team |

Start with Go unless your policy specifically requires Python libraries or Python-native capabilities. The majority of gateway policies are written in Go.

## Available Policies

The following table presents the available policies alphabetically.

<!-- POLICY_TABLE_START -->
| Policy | Categories | Description |
|--------|------------|-------------|
| [Analytics Header Filter](https://wso2.com/api-platform/policy-hub/policies/analytics-header-filter) | Logging, Analytics & Monitoring | The Analytics Header Filter policy allows you to control which request and response headers are included in analytics data using allow or deny modes. |
| [API Key Auth](https://wso2.com/api-platform/policy-hub/policies/api-key-auth) | Security, AI | Implements API Key Authentication to protect APIs with pre-shared API keys. |
| [AWS Bedrock Guardrail](https://wso2.com/api-platform/policy-hub/policies/aws-bedrock-guardrail) | Guardrails, AI | Validates request or response body content against AWS Bedrock Guardrails. |
| [Azure Content Safety Content Moderation](https://wso2.com/api-platform/policy-hub/policies/azure-content-safety-content-moderation) | Guardrails, AI | Validates request or response body content against Azure Content Safety API for content moderation. |
| [Basic Auth](https://wso2.com/api-platform/policy-hub/policies/basic-auth) | Security, AI | Implements HTTP Basic Authentication to protect APIs with username and password credentials. |
| [Content Length Guardrail](https://wso2.com/api-platform/policy-hub/policies/content-length-guardrail) | Guardrails, AI | Validates the byte length of request or response body content. |
| [CORS](https://wso2.com/api-platform/policy-hub/policies/cors) | Security, AI, MCP | Cross-Origin Resource Sharing (CORS) policy that handles preflight requests and adds appropriate CORS headers to responses. |
| [Dynamic Endpoint](https://wso2.com/api-platform/policy-hub/policies/dynamic-endpoint) | Transformation | Routes requests to a named upstream definition at request time. |
| [Host Rewrite](https://wso2.com/api-platform/policy-hub/policies/host-rewrite) | Transformation | Sets the Host/:authority header sent to the upstream. |
| [Interceptor Service](https://wso2.com/api-platform/policy-hub/policies/interceptor-service) | Transformation | Invokes a user-defined HTTP interceptor service in the request phase, the response phase, or both. |
| [JSON Schema Guardrail](https://wso2.com/api-platform/policy-hub/policies/json-schema-guardrail) | Guardrails, AI | Validates request or response body content against a JSON Schema. |
| [JSON/XML Mediator](https://wso2.com/api-platform/policy-hub/policies/json-xml-mediator) | Transformation | Mediates request and response payloads between downstream and upstream JSON/XML formats. |
| [JWT Auth](https://wso2.com/api-platform/policy-hub/policies/jwt-auth) | Security, AI | Validates JWT access tokens using one or more JWKS providers (key managers). |
| [LLM Cost](https://wso2.com/api-platform/policy-hub/policies/llm-cost) | AI | Calculates the monetary cost of LLM API calls at response time and stores the result in SharedContext for use by downstream policies. |
| [LLM Cost-Based Rate Limit](https://wso2.com/api-platform/policy-hub/policies/llm-cost-based-ratelimit) | AI | Enforces monetary budget limits on LLM API usage. |
| [Log Message](https://wso2.com/api-platform/policy-hub/policies/log-message) | Logging, Analytics & Monitoring, MCP | This policy provides the capability to log the payload and headers of a request/response. |
| [MCP Access Control](https://wso2.com/api-platform/policy-hub/policies/mcp-acl-list) | MCP, AI | MCP ACL List policy controls access to tools, resources, and prompts using mode and exceptions. |
| [MCP Authentication](https://wso2.com/api-platform/policy-hub/policies/mcp-auth) | MCP, AI, Security | Secures traffic to Model Context Protocol (MCP) servers as defined in the [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization). |
| [MCP Authorization](https://wso2.com/api-platform/policy-hub/policies/mcp-authz) | MCP, AI, Security | MCP Authorization policy validates access to MCP resources (tools, resources, prompts) and methods based on JWT claims or OAuth scopes provided by the mcp-auth policy. |
| [MCP Rewrite](https://wso2.com/api-platform/policy-hub/policies/mcp-rewrite) | MCP, AI | MCP Rewrite policy defines user-facing tools, resources, and prompts and maps them to backend capability names using optional "target" fields. |
| [Model Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-round-robin) | AI | Implements round-robin load balancing for AI models. |
| [Model Weighted Round Robin](https://wso2.com/api-platform/policy-hub/policies/model-weighted-round-robin) | AI | Implements weighted round-robin load balancing for AI models. |
| [PII Masking Regex](https://wso2.com/api-platform/policy-hub/policies/pii-masking-regex) | Guardrails, AI | Masks or redacts Personally Identifiable Information (PII) from request/response bodies using regex patterns. |
| [Prompt Compressor](https://wso2.com/api-platform/policy-hub/policies/prompt-compressor) | AI | Compresses selected prompt text in JSON request bodies before upstream LLM calls. |
| [Prompt Decorator](https://wso2.com/api-platform/policy-hub/policies/prompt-decorator) | AI | Dynamically modifies the prompt by applying custom decorations using a configured strategy. |
| [Prompt Template](https://wso2.com/api-platform/policy-hub/policies/prompt-template) | AI | Dynamically modifies the prompt by applying custom templates using a configured strategy. |
| [Rate Limit - Advanced](https://wso2.com/api-platform/policy-hub/policies/advanced-ratelimit) | Security, AI | Supports the Generic Cell Rate Algorithm (GCRA) and fixed-window algorithms, multi-dimensional quotas, weighted rate limiting, flexible key extraction, and both in-memory and Redis backends. |
| [Rate Limit - Basic](https://wso2.com/api-platform/policy-hub/policies/basic-ratelimit) | Security, AI | Limits the number of requests per time window. |
| [Regex Guardrail](https://wso2.com/api-platform/policy-hub/policies/regex-guardrail) | Guardrails, AI | Validates request or response body content against a regular expression pattern. |
| [Remove Headers](https://wso2.com/api-platform/policy-hub/policies/remove-headers) | Transformation, MCP | This policy provides the capability to remove headers from either the request or the response. |
| [Request Rewrite](https://wso2.com/api-platform/policy-hub/policies/request-rewrite) | Transformation | Rewrites the path, query parameters, HTTP method, or any combination of these before forwarding requests to upstream services. |
| [Respond](https://wso2.com/api-platform/policy-hub/policies/respond) | AI | Returns an immediate response to the client without forwarding the request to the upstream backend. |
| [Semantic Cache](https://wso2.com/api-platform/policy-hub/policies/semantic-cache) | AI | Implements semantic caching for LLM responses using vector similarity search. |
| [Semantic Prompt Guard](https://wso2.com/api-platform/policy-hub/policies/semantic-prompt-guard) | Guardrails, AI | Blocks or allows prompts based on semantic similarity to configured allow/deny phrase embeddings. |
| [Semantic Tool Filtering](https://wso2.com/api-platform/policy-hub/policies/semantic-tool-filtering) | Guardrails, AI | Dynamically filters the tools provided within an API request based on their semantic relevance to the user query. |
| [Sentence Count Guardrail](https://wso2.com/api-platform/policy-hub/policies/sentence-count-guardrail) | Guardrails, AI | Validates the sentence count of request or response body content. |
| [Set Headers](https://wso2.com/api-platform/policy-hub/policies/set-headers) | Transformation, MCP | This policy provides the capability to set arbitrary headers to either the request or the response. |
| [Subscription Validation](https://wso2.com/api-platform/policy-hub/policies/subscription-validation) | Security | Validates that incoming requests are associated with an active subscription for the target API. |
| [Token-Based Rate Limit](https://wso2.com/api-platform/policy-hub/policies/token-based-ratelimit) | AI | Enforces usage quotas on LLM APIs based on token counts. |
| [URL Guardrail](https://wso2.com/api-platform/policy-hub/policies/url-guardrail) | Guardrails, AI | Validates URLs found in request or response body content. |
| [Word Count Guardrail](https://wso2.com/api-platform/policy-hub/policies/word-count-guardrail) | Guardrails, AI | Validates the word count of request or response body content. |
<!-- POLICY_TABLE_END -->
