---
title: "Prompt decorator in AI Workspace"
description: "Prepend or append system instructions or context to every LLM request, configured in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/other-policies/prompt-decorator/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/other-policies/prompt-decorator.md
tags:
  - cloud
  - ai-workspace
  - prompt-management
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Prompt Decorator

The Prompt Decorator policy prepends or appends content to prompts before they are sent to the upstream LLM. Use it to inject system instructions, safety guidelines, or contextual information into every request — without requiring changes to the client application.

## Configuration Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| **Decoration** | Yes | — | The content to inject. Either a plain text string (for single-field prompts) or a list of chat messages with `role` and `content` (for chat-format requests). |
| **JSON Path** | Yes | — | A JSONPath expression pointing to the field in the request body where the decoration is applied (e.g., `$.messages` for a chat array, `$.prompt` for a text field). |
| **Append** | No | `false` | When `true`, the decoration is appended after the existing content. When `false` (default), it is prepended before. |

### Decoration Formats

**Text decoration** — Use a plain string to inject text into a single-field prompt:

```json
"decoration": "You are a helpful assistant. Always respond in formal English.\n\n"
```

**Chat message decoration** — Use an array of role/content objects to inject messages into a chat conversation:

```json
"decoration": [
  {
    "role": "system",
    "content": "You are a helpful assistant. Only answer questions about software development."
  }
]
```

## Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **Prompt Decorator** from the sidebar.
5. Enter the **Decoration** content.
6. Set the **JSON Path** to the field in the request where content should be injected.
7. Choose whether to **Append** (after) or prepend (before) the existing content.
8. Click **Add** (for providers) or **Submit** (for proxies).
9. Deploy the provider or proxy to apply the changes.

## Example: Inject a System Prompt

The following configuration prepends a system instruction to every chat completion request:

| Parameter | Value |
|-----------|-------|
| JSON Path | `$.messages` |
| Decoration | `[{"role": "system", "content": "Always respond in plain text. Do not use markdown formatting."}]` |
| Append | `false` |

**Original request:**

```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "Explain recursion."}
  ]
}
```

**Request after decoration (sent to LLM):**

```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "Always respond in plain text. Do not use markdown formatting."},
    {"role": "user", "content": "Explain recursion."}
  ]
}
```

## Related

- [Policies Overview](../overview.md)
- [Prompt Template](prompt-template.md) — Apply reusable prompt templates with parameter substitution
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version