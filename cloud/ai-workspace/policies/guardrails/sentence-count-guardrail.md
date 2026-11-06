---
title: "Sentence count guardrail in AI Workspace"
description: "Enforce minimum and maximum sentence count limits on LLM prompts or responses, configured in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/guardrails/sentence-count-guardrail/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/guardrails/sentence-count-guardrail.md
tags:
  - cloud
  - ai-workspace
  - guardrails
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Sentence Count Guardrail

The Sentence Count Guardrail validates the number of sentences in a request or response. Use it to enforce policies on the structural complexity of prompts or responses — for example, requiring responses to be at least a certain length, or capping how many sentences a user prompt can contain.

## Configuration

All parameters are under **Advanced Settings**. Configure a **request** section, a **response** section, or both.

### Request / Response Parameters

Each section (request and response) has the following parameters:

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| **min** | Yes | `0` | Minimum number of sentences required. |
| **max** | Yes | `0` | Maximum number of sentences allowed. Set to `0` to disable the upper limit. |
| **jsonPath** | No | — | JSONPath expression to extract a specific field for validation (e.g., `$.messages[0].content`). If not set, the entire payload is evaluated. |
| **invert** | No | `false` | When `true`, the guardrail intervenes when the sentence count **is within** the configured range instead of outside it. |
| **showAssessment** | No | `false` | When `true`, the intervention response includes details about the violation. |

## Add This Guardrail

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **Sentence Count Guardrail** from the sidebar.
5. Expand **Advanced Settings** and configure the **request** and/or **response** sections.
6. Click **Add** (for providers) or **Submit** (for proxies).
7. Deploy the provider or proxy to apply the changes.

## Example: Limit Prompt to 3 Sentences

The following configuration blocks requests where the user message contains more than 3 sentences.

**Advanced Settings — request:**

| Parameter | Value |
|-----------|-------|
| min | `1` |
| max | `3` |
| jsonPath | `$.messages[0].content` |
| invert | `false` |
| showAssessment | `true` |

**Intervention response:**

```json
{
  "type": "SENTENCE_COUNT_GUARDRAIL",
  "message": {
    "action": "GUARDRAIL_INTERVENED",
    "interveningGuardrail": "Sentence Count Guardrail",
    "direction": "REQUEST",
    "actionReason": "Violation of applied sentence count constraints detected.",
    "assessments": "Violation of sentence count detected. Expected between 1 and 3 sentences."
  }
}
```

## Related

- [Guardrails Overview](overview.md)
- [Word Count Guardrail](word-count-guardrail.md)
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version