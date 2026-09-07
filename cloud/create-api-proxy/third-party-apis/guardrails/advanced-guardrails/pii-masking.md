---
title: "Advanced PII Masking for AI APIs"
description: "Configure PII masking on AI API proxies in WSO2 API Platform using a Guardrails AI fine-tuned model to detect and mask sensitive data."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/advanced-guardrails/pii-masking/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/advanced-guardrails/pii-masking.md
tags:
  - cloud
  - ai-gateway
  - guardrails
  - pii
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# PII Masking (using Guardrails AI)

The PII Masking policy allows you to mask Personally Identifiable Information (PII) in the request and response payloads using an fine-tuned Guardrails AI model. This policy is particularly useful for ensuring that sensitive information is not exposed in AI-generated content, thereby enhancing security and compliance with data protection regulations.

## Configure PII Masking

1. In the left navigation menu, click **Develop**, then select **Policy**.

2. Click the Add policy icon in the required resource --> **Request/Response Flow** --> **Attach Mediation Policy**.

3. Add the policy information and click **Save**.

    The following table lists and describes the configuration parameters available for the **PII Masking** policy:

    | Parameter Name | Description |
    |----------------|-------------|
    | Guardrail Name | The name of the guardrail policy. This will be used for tracking purposes. |
    | PII Entities | The list of PII entities to be masked in the content. |
    | JSON Path | The JSONPath expression used to extract content from the payload. If not specified, the entire payload will be used for validation. |
    | Redact PII | When enabled, detected PIIs are redacted and will not be restored to its original form. This should be enabled when the policy is attached to the response flow to prevent exposing AI-generated content with sensitive data to the client. When disabled and applied to the request flow, detected PII is temporarily masked and can be restored in the corresponding response. |


4. Save the API and Deploy the API to apply the policy to the gateway.

!!! note "PII Unmasking with PII Masking"
    If you want to use the PII Masking for PII unmasking, you must attach the policy to both the request and response flows. This allows the policy to mask PII in the request and unmask it in the response. Moreover, the `Redact PII` option should be disabled in both flows to allow the PII to be restored in the response. If you enable `Redact PII` in the response flow, the PII will be permanently redacted and not restored.

### Sample PII Masking Configuration

- Guardrail Name: `PII Masking`
- PII Entities: `EMAIL,URL`
- JSON Path: `$.messages[0].content`
- Redact PII: `true`

### Sample Payload to be intervened from the PII Masking

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Prepare an email with my contact information, email: john.doe@example.com, and website: https://example.com."
    }
  ]
}
```

### Sample Payload after intervention from PII Masking

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Prepare an email with my contact information, email: *****, and website: *****."
    }
  ]
}
```