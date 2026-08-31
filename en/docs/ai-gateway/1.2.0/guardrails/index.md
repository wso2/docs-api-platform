---
title: "Guardrails"
description: "AI Gateway guardrails: LLM-aware policies for content filtering, safety, and compliance, with per-policy reference in the WSO2 API Platform Policy Hub."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/guardrails/
md_url: https://wso2.com/api-platform/docs/ai-gateway/guardrails.md
tags:
  - ai-gateway
  - guardrails
  - llm-proxy
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Guardrails

Guardrails are policies that run in the LLM Proxy's request and response pipeline to validate, filter, or transform content before it reaches an LLM or is returned to the client.

AI Guardrails allow you to enforce safety, content, and compliance policies on AI traffic flowing through the AI Gateway. They can be applied at the LLM Provider level (organization-wide), at the LLM Proxy level (per-application), or on MCP Proxies.

Guardrails use the same underlying policy engine as [API Gateway policies](../../../api-gateway/1.2.0/policies/overview.md). Each guardrail declares which execution phases it participates in, and the engine calls the appropriate hook for each phase.

## What guardrails do

- **Content filtering**: Block or flag requests and responses that violate configured topic, word, or content policies.
- **PII detection and masking**: Detect and mask or redact personally identifiable information in prompts and responses.
- **Schema validation**: Enforce structure on requests or responses using JSON Schema.
- **Pattern matching**: Detect prohibited content using regular expressions.
- **Length and count limits**: Enforce word count, sentence count, and byte length constraints on prompts and responses.
- **External validation**: Delegate content validation to managed services such as AWS Bedrock Guardrails or Azure Content Safety.

## In this section

This section contains the following pages:

| Page | What it covers |
|------|----------------|
| [Guardrails catalogue](guardrails-catalogue.md) | Every guardrail policy the AI Gateway ships, what each one checks, and how to extend the gateway with a guardrail of your own. |
| [Guardrail execution order](execution-order.md) | How guardrails execute in the dual-hop model: the LLM Proxy chain runs before the LLM Provider chain on request, and in reverse on response. |

Guardrail policies are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../../policy-hub/overview.md).

## Prompt management

Guardrails judge a prompt. A separate set of policies reshapes one — injecting standing instructions, applying templates, or compressing text before it goes upstream. See [Prompt management](../prompt-management.md).
