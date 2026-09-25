---
title: "Model round robin in AI Workspace"
description: "Distribute LLM requests across multiple models in round-robin order, with automatic suspension of failing models, configured in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/other-policies/model-round-robin/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/other-policies/model-round-robin.md
tags:
  - cloud
  - ai-workspace
  - load-balancing
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Model Round Robin

The Model Round Robin policy distributes requests across multiple AI models using round-robin selection. If a model returns a server error (`5xx`) or a rate limit response (`429`), it can be temporarily suspended so that traffic automatically shifts to the remaining healthy models.

## Configuration Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| **Models** | Yes | The list of model names to balance across (e.g., `gpt-4o`, `gpt-4-turbo`). Add at least two models. |
| **Suspend Duration** | No | Number of seconds to suspend a model after it returns a `5xx` or `429` response. While suspended, the model is skipped. Set to `0` (default) to disable suspension. |

## Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **Model Round Robin** from the sidebar.
5. Add the model names to balance across.
6. Optionally expand **Advanced Settings** and set a **Suspend Duration** to handle model failures gracefully.
7. Click **Add** (for providers) or **Submit** (for proxies).
8. Deploy the provider or proxy to apply the changes.

## Behavior

- On each request, the policy selects the next available model in round-robin order and replaces the model value in the request before forwarding upstream.
- If a model returns a `5xx` or `429` response and **Suspend Duration** is set, the model is suspended for that duration and subsequent requests skip it.
- If all models are suspended, the gateway returns `503 Service Unavailable`.

## Related

- [Policies Overview](../overview.md)
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version