---
title: "PII masking regex guardrail in AI Workspace"
description: "Detect and mask personally identifiable information in LLM requests and responses using regex patterns, configured in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/guardrails/regex-pii-masking/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/guardrails/regex-pii-masking.md
tags:
  - cloud
  - ai-workspace
  - guardrails
  - pii
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# PII Masking Regex

The PII Masking Regex guardrail detects and masks Personally Identifiable Information (PII) in request and response payloads using regex patterns. It supports built-in detectors for common PII types and custom regex patterns for additional entities.

It operates in two modes:

- **Masking (default)** — Detected PII is replaced with a reversible placeholder (e.g., `[EMAIL_0000]`). The original value can be restored in the response flow.
- **Redaction** — Detected PII is permanently replaced with `*****` and cannot be restored.

## Configuration Parameters

All parameters are optional.

| Parameter | Default | Description |
|-----------|---------|-------------|
| **Email** | `false` | Enable built-in EMAIL detection. |
| **Phone** | `false` | Enable built-in PHONE detection. |
| **SSN** | `false` | Enable built-in SSN (Social Security Number) detection. |
| **Custom PII Entities** | — | Custom PII definitions. Each entry has a name and a regex pattern used to match it. |
| **JSON Path** | `$.messages` | JSONPath to extract the field to scan. If empty, the entire payload is processed as plain text. |
| **Redact PII** | `false` | When `true`, matched PII is permanently replaced with `*****`. When `false`, PII is masked with reversible placeholders. |

## Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **PII Masking Regex** from the sidebar.
5. Expand **Advanced Settings** and enable the built-in detectors and/or add custom PII entities.
6. Click **Add** (for providers) or **Submit** (for proxies).
7. Deploy the provider or proxy to apply the changes.

## Behavior

- Matched PII in the request is masked before forwarding to the upstream LLM.
- In masking mode (default), the original values are restored in the response.
- In redaction mode (`Redact PII: true`), the replacement is permanent — PII is removed from both the request and the response.

## Related

- [Guardrails Overview](overview.md)
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version