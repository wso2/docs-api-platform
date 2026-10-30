---
title: "Prompt template in AI Workspace"
description: "Apply reusable, parameterized prompt templates to LLM requests using template:// references, configured in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/other-policies/prompt-template/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/other-policies/prompt-template.md
tags:
  - cloud
  - ai-workspace
  - prompt-management
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Prompt Template

The Prompt Template policy applies reusable, parameterized prompt templates to requests. Instead of sending a raw prompt, clients send a template reference (`template://<name>?param=value`) and the gateway substitutes the parameters into the configured template before forwarding the request to the LLM.

## Configuration Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| **Templates** | Yes | A list of named templates. Each template has a **name** (identifier) and a **prompt** string containing placeholders in the format `[[parameter-name]]`. |

### Template Placeholder Syntax

Use `[[parameter-name]]` inside the prompt string to mark substitution points:

```
Translate the following text from [[from]] to [[to]]: [[text]]
```

When a client calls `template://translate?from=English&to=Spanish&text=Hello`, the policy replaces each placeholder with the corresponding query parameter value.

## Advanced Settings

| Parameter | Default | Description |
|-----------|---------|-------------|
| **JSON Path** | — | JSONPath expression to limit template resolution to a specific field in the request payload. If omitted, template references are resolved across the entire request payload. |
| **On Missing Template** | `error` | Behavior when a referenced template name is not found. `error` returns an immediate error response; `passthrough` leaves the original template reference unchanged. |
| **On Unresolved Placeholder** | `keep` | Behavior when a placeholder has no matching query parameter. `keep` leaves the placeholder as-is; `empty` replaces it with an empty string; `error` returns an immediate error response. |

## Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **Prompt Template** from the sidebar.
5. Add one or more templates, each with a name and prompt string using `[[param]]` placeholders.
6. Optionally expand **Advanced Settings** to configure JSON Path, On Missing Template, or On Unresolved Placeholder behavior.
7. Click **Add** (for providers) or **Submit** (for proxies).
8. Deploy the provider or proxy to apply the changes.

## Example: Translation Template

**Configured template:**

| Field | Value |
|-------|-------|
| Name | `translate` |
| Prompt | `Translate the following text from [[from]] to [[to]]: [[text]]` |

**Client request body:**

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "template://translate?from=English&to=Spanish&text=Hello, how are you?"
    }
  ]
}
```

**Request forwarded to LLM:**

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "Translate the following text from English to Spanish: Hello, how are you?"
    }
  ]
}
```

## Related

- [Policies Overview](../overview.md)
- [Prompt Decorator](prompt-decorator.md) — Inject fixed content into prompts without client-side changes
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version