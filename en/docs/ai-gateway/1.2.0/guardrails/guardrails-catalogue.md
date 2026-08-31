---
title: "Guardrails catalogue"
description: "Every guardrail policy the AI Gateway ships, what each one checks, and how to extend the gateway with a guardrail of your own."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/guardrails/guardrails-catalogue/
md_url: https://wso2.com/api-platform/docs/ai-gateway/guardrails/guardrails-catalogue.md
tags:
  - ai-gateway
  - guardrails
  - llm-proxy
  - policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# Guardrails catalogue

The gateway ships the guardrails below. Each one validates, filters, or transforms content in the request or response pipeline, and you attach it to an `LlmProvider`, an `LlmProxy`, or an `Mcp` proxy. For what guardrails do as a class, and how a chain of them executes, see [Guardrails](index.md).

## Available guardrails

Guardrail policies are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../../policy-hub/overview.md).

| Guardrail | What it checks |
|-----------|----------------|
| [Regex Guardrail](https://wso2.com/api-platform/policy-hub/policies/regex-guardrail) | Validates content against a regular expression |
| [JSON Schema Guardrail](https://wso2.com/api-platform/policy-hub/policies/json-schema-guardrail) | Enforces a JSON Schema on request or response payloads |
| [Word Count Guardrail](https://wso2.com/api-platform/policy-hub/policies/word-count-guardrail) | Enforces word-count limits on payloads |
| [Sentence Count Guardrail](https://wso2.com/api-platform/policy-hub/policies/sentence-count-guardrail) | Enforces sentence-count limits on payloads |
| [Content Length Guardrail](https://wso2.com/api-platform/policy-hub/policies/content-length-guardrail) | Enforces byte-length limits on payloads |
| [URL Guardrail](https://wso2.com/api-platform/policy-hub/policies/url-guardrail) | Validates URLs found in request or response bodies |
| [PII Masking](https://wso2.com/api-platform/policy-hub/policies/pii-masking-regex) | Masks or redacts PII from request/response bodies using configurable regex patterns |
| [Semantic Prompt Guard](https://wso2.com/api-platform/policy-hub/policies/semantic-prompt-guard) | Blocks or allows prompts based on semantic similarity to configured allow/deny phrases |
| [Azure Content Safety](https://wso2.com/api-platform/policy-hub/policies/azure-content-safety-content-moderation) | Screens content against Azure Content Safety API |
| [AWS Bedrock Guardrail](https://wso2.com/api-platform/policy-hub/policies/aws-bedrock-guardrail) | Validates content against AWS Bedrock Guardrails |
| [Granite Guardian Prompt Injection](https://wso2.com/api-platform/policy-hub/policies/granite-guardian-prompt-injection) | Detects prompt injection and jailbreak attempts in LLM API requests using IBM Granite Guardian 3.3 8B |
| [NeMo Guard Content Safety](https://wso2.com/api-platform/policy-hub/policies/nvidia-nemoguard-content-safety) | Validates request and/or response content using NVIDIA NeMo Guard (llama-3.1-nemoguard-8b-content-safety) |

## Custom guardrails

You can extend the AI Gateway with custom guardrail policies by building a custom gateway image using the `ap` CLI. See [Customizing the Gateway by Adding and Removing Policies](../../../tools/cli/customizing-gateway-policies.md).

## Related topics

- [Guardrail execution order](execution-order.md) — the order a chain of these policies runs in, and how the proxy and provider chains combine.
- [Prompt management](../prompt-management.md) — the policies that reshape a prompt rather than judging it.
- [MCP governance](../mcp-governance.md) — the policies that govern MCP traffic, including semantic tool filtering.
