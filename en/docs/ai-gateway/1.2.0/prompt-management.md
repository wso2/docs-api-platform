---
title: "Prompt management"
description: "Shape prompts at the AI Gateway before they reach a model: inject standing instructions, apply templates, and compress text to reduce token usage."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/prompt-management/
md_url: https://wso2.com/api-platform/docs/ai-gateway/prompt-management.md
tags:
  - ai-gateway
  - prompts
  - llm-proxy
  - system-prompt
  - templates
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "concept"
---

# Prompt management

Every application that calls a model sends its own prompt, and some things should hold for all of them: a standing instruction about tone or scope, a house format for a class of request, a ceiling on how much text goes upstream. Shaping prompts at the gateway applies those to every caller without changing application code.

These policies change a prompt. [Guardrails](guardrails/index.md) judge one — they validate it, block it, or mask what it contains. A prompt that is rewritten here is still subject to the guardrails attached alongside.

## Where prompt policies run

All three run in the request phase, before the prompt reaches the provider. Attach them on an `LlmProxy` to shape one application's prompts, or on an `LlmProvider` to shape every proxy that consumes it, which is how a standing instruction becomes organization-wide.

Order matters when you combine them. A template that builds the prompt and a decorator that prepends an instruction produce different results depending on which runs first — see [Guardrail execution order](guardrails/execution-order.md) for how the gateway sequences a chain.

## Prompt policies

These policies are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub), the versioned reference for every API Platform policy. For policy categories and how policies chain, see the [Policy Hub overview](../../policy-hub/overview.md).

| Policy | What it does |
|--------|--------------|
| [Prompt Decorator](https://wso2.com/api-platform/policy-hub/policies/prompt-decorator) | Injects system instructions or context into prompts at the gateway layer |
| [Prompt Template](https://wso2.com/api-platform/policy-hub/policies/prompt-template) | Applies configurable templates to transform prompts before they reach the model |
| [Prompt Compressor](https://wso2.com/api-platform/policy-hub/policies/prompt-compressor) | Compresses prompt text to reduce token usage before upstream calls |

## Related topics

- [Enforce a consistent AI persona with the prompt decorator policy](../../guides/ai-and-mcp/using-prompt-decorator-policy.md) — prepends a persona system message to every request on an LLM proxy, without changing client code.
- [Guardrails](guardrails/index.md) — validate, block, or mask content rather than reshaping it.
- [Cost control and budgets](cost-control-and-budgets.md) — compression reduces the tokens each call is charged for.
- [Transform requests and responses](transform-requests-and-responses.md) — change the envelope around the prompt rather than the prompt itself.
