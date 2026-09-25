---
title: "Azure Content Safety guardrail in AI Workspace"
description: "Filter hate speech, sexual content, self-harm, and violence in LLM traffic using Azure Content Safety, configured in AI Workspace."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/guardrails/azure-content-safety/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/policies/guardrails/azure-content-safety.md
tags:
  - cloud
  - ai-workspace
  - guardrails
  - azure
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Azure Content Safety Content Moderation

The Azure Content Safety guardrail integrates with the Azure Content Safety API to filter harmful content in requests and LLM-generated responses. It checks for four categories — hate speech, sexual content, self-harm, and violence — each with a configurable severity threshold.

!!! info "Prerequisites"
    This guardrail requires an active Azure subscription with the Azure Content Safety service enabled.

    1. In the [Azure Portal](https://portal.azure.com), search for **Content Safety** and create a new resource.
    2. After the resource is created, open it and go to **Keys and Endpoint**.
    3. Copy the **Endpoint URL** and one of the **API Keys**.
    4. Add them to your gateway's `config.toml` file:

    ```toml
    azurecontentsafety_endpoint = "https://your-resource.cognitiveservices.azure.com"
    azurecontentsafety_key = "your-api-key"
    ```

## Configuration Parameters

### Advanced Settings

Content moderation settings are configured independently for the **request** and **response** phases. Both sections have the same parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| **JSON Path** | — | JSONPath to extract the content to evaluate. If empty, the entire payload is evaluated as plain text. |
| **Passthrough On Error** | `false` | When `true`, requests continue if the Azure API call fails. When `false`, an error is returned on API failure. |
| **Show Assessment** | `false` | When `true`, the intervention response includes detailed category scores. |
| **Hate Severity Threshold** | `4` | Severity threshold for hate speech (0–7). Use `-1` to disable. Content at or above the threshold is blocked. |
| **Sexual Severity Threshold** | `5` | Severity threshold for sexual content (0–7). Use `-1` to disable. |
| **Self Harm Severity Threshold** | `3` | Severity threshold for self-harm content (0–7). Use `-1` to disable. |
| **Violence Severity Threshold** | `4` | Severity threshold for violence (0–7). Use `-1` to disable. |

### Severity Scale

| Score | Meaning |
|-------|---------|
| 0–1 | Safe or negligible |
| 2–3 | Low severity |
| 4–5 | Medium severity |
| 6–7 | High severity |

## Add This Policy

1. Navigate to **AI Workspace** > **LLM Providers** or **App LLM Proxies**.
2. Click on the provider or proxy name.
3. Go to the **Guardrails** tab.
4. Click **+ Add Guardrail** and select **Azure Content Safety Content Moderation** from the sidebar.
5. Expand **Advanced Settings** to configure severity thresholds and error handling separately for request and response phases.
6. Click **Add** (for providers) or **Submit** (for proxies).
7. Deploy the provider or proxy to apply the changes.

## Behavior

- When content meets or exceeds a configured severity threshold, the gateway returns `422 Unprocessable Entity` with a guardrail intervention response.
- Request and response phases are evaluated independently using their respective settings.
- If **Show Assessment** is enabled, the response includes the category scores that triggered the block.

## Related

- [Guardrails Overview](overview.md)
- [PII Masking Regex](regex-pii-masking.md) — Lightweight PII masking without external services
- [Policy Hub](https://wso2.com/api-platform/policy-hub/) — Full policy specification and latest version