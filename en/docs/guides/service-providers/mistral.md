---
title: "Mistral guides"
description: "Use WSO2 API Platform to govern traffic to Mistral AI models and to use Mistral embeddings for semantic caching and semantic guardrails."
canonical_url: https://wso2.com/api-platform/docs/guides/service-providers/mistral/
md_url: https://wso2.com/api-platform/docs/guides/service-providers/mistral.md
tags:
  - guides
  - mistral
  - service-provider-guides
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "reference"
---

# Govern Mistral AI models

WSO2 API Platform works alongside Mistral AI. Govern traffic to Mistral models, and use Mistral embeddings for semantic caching and guardrails.

## AI Gateway with Mistral models

Route, secure, and govern traffic to Mistral AI models through WSO2 AI Gateway.

<div class="vendor-cap" markdown="1">

### Mistral as an LLM provider

Register the Mistral API with the gateway, which stores the API key on behalf of your applications.

<div class="vendor-links" data-deployments="cloud" markdown="1">

- [Create an AI API for Mistral](../../cloud/create-api-proxy/third-party-apis/mistral.md) <span class="vendor-meta">Cloud console</span>

</div>

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [Configure an LLM provider](../../cloud/ai-workspace/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>
- [AI Workspace quickstart with Mistral](../../cloud/ai-workspace/quickstart.md) <span class="vendor-meta">AI Workspace</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [MistralAI provider](../../ai-gateway/2026.09.24/gateway-artifacts/llm-provider/supported-providers/mistralai.md) <span class="vendor-meta">AI Gateway</span>
- [Configure an LLM provider](../../ai-workspace/1.0.0/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>

</div>

</div>

<div class="vendor-cap" markdown="1">

### OpenAI-format requests

Keep clients on the OpenAI request format while the gateway routes to Mistral.

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [Call Mistral AI through the gateway](../../cloud/ai-workspace/using-sdks.md#mistral-ai) <span class="vendor-meta">AI Workspace</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [OpenAI-format compatibility](../../ai-gateway/2026.09.24/gateway-artifacts/llm-provider/supported-providers/mistralai.md#openai-format-compatibility) <span class="vendor-meta">AI Gateway</span>

</div>

</div>

<div class="vendor-cap" markdown="1">

### Semantic caching and guardrails

Semantic caching and the semantic prompt guard compare prompts by meaning, and can use a Mistral embedding model that you set in the policy or gateway configuration.

<div class="vendor-links" data-deployments="cloud" markdown="1">

- [Semantic cache](../../cloud/create-api-proxy/third-party-apis/semantic-cache.md) <span class="vendor-meta">Cloud console</span>

</div>

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

WSO2 API Platform and Mistral AI split the work like this:

| Scenario | WSO2 role | Mistral role | Runtime traffic |
| --- | --- | --- | --- |
| Applications calling Mistral models | Proxies and governs LLM requests | Hosts the models | Goes through WSO2 AI Gateway to Mistral |
| Semantic caching and guardrails | Runs the cache or guardrail policy | Returns embeddings for each prompt | The gateway calls the Mistral embeddings API alongside each request |

## Learn more

Related pages in the Mistral documentation:

- [Mistral AI documentation](https://docs.mistral.ai/)
- [Mistral models](https://docs.mistral.ai/models)
- [Mistral API reference](https://docs.mistral.ai/api)

To browse every guide by goal, see the [Guides overview](../overview.md#browse-by-use-case).
