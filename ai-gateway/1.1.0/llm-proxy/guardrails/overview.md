---
title: "Guardrails overview"
description: "Overview of AI Gateway guardrails: LLM-aware policies for content filtering, safety, and compliance that run in the LLM Proxy request and response pipeline."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/llm-proxy/guardrails/overview/
md_url: https://wso2.com/api-platform/docs/ai-gateway/llm-proxy/guardrails/overview.md
tags:
  - ai-gateway
  - guardrails
  - llm-proxy
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-10
content_type: "concept"
---

# Guardrails overview

Guardrails are policies that run in the LLM Proxy's request and response pipeline to validate, filter, or transform content before it reaches an LLM or is returned to the client.

Guardrails use the same underlying policy engine as [API Gateway policies](../../../../../api-gateway/1.1.0/policies/overview.md). Each guardrail declares which execution phases it participates in, and the engine calls the appropriate hook for each phase.

## What guardrails do

- **Content filtering**: Block or flag requests and responses that violate configured topic, word, or content policies.
- **PII detection and masking**: Detect and mask or redact personally identifiable information in prompts and responses.
- **Schema validation**: Enforce structure on requests or responses using JSON Schema.
- **Pattern matching**: Detect prohibited content using regular expressions.
- **Length and count limits**: Enforce word count, sentence count, and byte length constraints on prompts and responses.
- **External validation**: Delegate content validation to managed services such as AWS Bedrock Guardrails or Azure Content Safety.

## Available guardrails

| Guardrail | What it does |
|-----------|-------------|
| [AWS Bedrock Guardrail](aws-bedrock-guardrail.md) | Validates content against AWS Bedrock Guardrails for content filtering, topic detection, and PII masking |
| [Azure Content Safety](azure-content-safety.md) | Validates content against Azure Content Safety API for content moderation |
| [Content Length Guardrail](content-length.md) | Enforces a maximum byte length on request or response content |
| [JSON Schema Guardrail](json-schema.md) | Validates request or response content against a JSON Schema |
| [PII Masking Regex Guardrail](pii-masking-regex.md) | Detects and masks PII using configurable regex patterns |
| [Regex Guardrail](regex.md) | Validates content against a regular expression pattern |
| [Semantic Prompt Guardrail](semantic-prompt-guard.md) | Blocks or allows prompts based on semantic similarity to configured allow or deny phrases |
| [Sentence Count Guardrail](sentence-count.md) | Enforces a sentence count limit on request or response content |
| [URL Guardrail](url.md) | Validates URLs found in request or response content |
| [Word Count Guardrail](word-count.md) | Enforces a word count limit on request or response content |

## How guardrails execute

When multiple guardrails are attached to an LLM Proxy, they run as an ordered chain across request and response phases. The AI Gateway's architecture — with a separate LLM Proxy chain and LLM Provider chain — means every request passes through two chains in sequence.

For a full explanation of phase execution, multi-guardrail ordering, and the dual-hop execution model specific to AI Gateway, see [Guardrail execution order](execution-order.md).