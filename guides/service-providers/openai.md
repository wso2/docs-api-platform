---
title: "OpenAI guides"
description: "Use WSO2 API Platform to route OpenAI Codex CLI through AI Gateway and govern traffic to OpenAI models with routing, token limits, and caching."
canonical_url: https://wso2.com/api-platform/docs/guides/service-providers/openai/
md_url: https://wso2.com/api-platform/docs/guides/service-providers/openai.md
tags:
  - guides
  - openai
  - codex
  - service-provider-guides
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "reference"
---

# Govern OpenAI models and Codex CLI

WSO2 API Platform works alongside the OpenAI products you already use. Govern OpenAI model traffic, route Codex CLI through AI Gateway, and use OpenAI embeddings for semantic caching and guardrails.

## End-to-end guides

A step-by-step guide for Codex CLI.

<div class="vendor-guide-list" markdown="1">

- [Configure OpenAI Codex CLI with AI Gateway](../ai-and-mcp/ai-coding-assistants/codex-configuration-with-ai-gateway.md)

    Route Codex CLI requests through an OpenAI provider and an App LLM Proxy.

    Guide · Codex CLI · Hybrid

</div>

## AI Gateway with OpenAI models

Route, secure, and govern traffic to OpenAI models through WSO2 AI Gateway, including traffic from Codex CLI.

<div class="vendor-cap" markdown="1">

### OpenAI as an LLM provider

Register the OpenAI API with the gateway. The gateway keeps the API key, not your applications.

<div class="vendor-links" data-deployments="cloud" markdown="1">

- [Create an AI API for OpenAI](../../cloud/create-api-proxy/third-party-apis/open-ai.md) <span class="vendor-meta">Cloud console</span>

</div>

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [Configure an LLM provider](../../cloud/ai-workspace/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>
- [Call OpenAI through the gateway](../../cloud/ai-workspace/using-sdks.md#openai) <span class="vendor-meta">AI Workspace</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [OpenAI provider](../../ai-gateway/2026.09.24/gateway-artifacts/llm-provider/supported-providers/openai.md) <span class="vendor-meta">AI Gateway</span>
- [Configure an LLM provider](../../ai-workspace/1.0.0/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>

</div>

</div>

<div class="vendor-cap" markdown="1">

### Semantic caching and guardrails

Semantic caching and the semantic prompt guard compare prompts by meaning, and can use an OpenAI embedding model that you set in the policy or gateway configuration.

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [Semantic cache policy](../../cloud/ai-workspace/policies/other-policies/semantic-cache.md) <span class="vendor-meta">AI Workspace</span>
- [Semantic prompt guard policy](https://wso2.com/api-platform/policy-hub/policies/semantic-prompt-guard) <span class="vendor-meta">Policy Hub</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [Semantic caching](../../ai-gateway/2026.09.24/semantic-caching.md) <span class="vendor-meta">AI Gateway</span>
- [Embedding providers for semantic caching](../../ai-gateway/2026.09.24/setup-and-deployment/production-deployment/ai-workload-tuning.md#provision-infrastructure-for-semantic-caching) <span class="vendor-meta">AI Gateway</span>
- [Semantic Cache policy](https://wso2.com/api-platform/policy-hub/policies/semantic-cache) <span class="vendor-meta">Policy Hub</span>
- [Semantic prompt guard policy](https://wso2.com/api-platform/policy-hub/policies/semantic-prompt-guard) <span class="vendor-meta">Policy Hub</span>

</div>

</div>

<div class="vendor-links" data-deployments="cloud" markdown="1">

Token limits, semantic caching, and the other AI API policies work the same way for every provider. See [AI APIs](../../cloud/create-api-proxy/third-party-apis/ai-apis.md).

</div>

<div class="vendor-links" data-deployments="hybrid" markdown="1">

Routing, token limits, cost control, and the other AI Workspace policies work the same way for every provider. See the [AI Workspace overview](../../cloud/ai-workspace/overview.md).

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

Routing, token limits, cost control, and the gateway's other policies work the same way for every provider. See the [AI Gateway documentation](../../ai-gateway/2026.09.24/overview.md).

</div>

## Architecture and responsibility model

WSO2 API Platform and OpenAI split the work like this:

| Scenario | WSO2 role | OpenAI role | Runtime traffic |
| --- | --- | --- | --- |
| Codex CLI through AI Gateway | Authenticates developers and applies guardrails, rate limits, and analytics | Hosts the models and bills the API key | Goes through WSO2 AI Gateway to OpenAI |
| Applications calling OpenAI models | Proxies and governs LLM requests | Hosts the models | Goes through WSO2 AI Gateway to OpenAI |
| Semantic caching and guardrails | Runs the cache or guardrail policy | Returns embeddings for each prompt | The gateway calls the OpenAI embeddings API alongside each request |

## Learn more

Related pages in the OpenAI documentation:

- [Codex CLI](https://developers.openai.com/codex/cli)
- [OpenAI API reference](https://developers.openai.com/api/reference/overview)
- [OpenAI models](https://developers.openai.com/api/docs/models)

To browse every guide by goal, see the [Guides overview](../overview.md#browse-by-use-case).