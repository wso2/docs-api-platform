---
title: "Regex PII Masking for AI APIs"
description: "Configure a regex-based PII masking guardrail on AI API proxies in WSO2 API Platform to detect and mask sensitive data using custom patterns."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/regex-pii-masking/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/regex-pii-masking.md
tags:
  - cloud
  - ai-gateway
  - guardrails
  - pii
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Regex PII Masking

This policy provides the capability to perform regular expression-based validation on incoming or outgoing JSON payloads specifically for Personally Identifiable Information (PII) masking. This component acts as a guardrail to enforce specific security or compliance rules based on configurable regex patterns and JSON path expressions.

## Configure Regex PII Masking

1. In the left navigation menu, click **Develop**, then select **Policy**.

2. Click the Add policy icon in the required resource --> **Request/Response Flow** --> **Attach Mediation Policy**.

3. Add the policy information and click **Save**.

    The following table lists and describes the configuration parameters available for the **Regex PII Masking** policy:

    | Parameter Name | Description |
    |----------------|-------------|
    | Guardrail Name | The name of the guardrail policy. This will be used for tracking purposes. |
    | PII Entities | The PII entities to detect and mask using regular expressions. Each entry should include the entity name and its corresponding regex pattern. |
    | JSON Path | The JSONPath expression used to extract content from the payload. If not specified, the entire payload will be used for validation. |
    | Redact PII | When enabled, detected PIIs are redacted and will not be restored to its original form. This should be enabled when the policy is attached to the response flow to prevent exposing AI-generated content with sensitive data to the client. When disabled and applied to the request flow, detected PII is temporarily masked and can be restored in the corresponding response. |


4. Save the API and Deploy the API to apply the policy to the gateway.

!!! note "PII Unmasking with Regex PII Masking"
    If you want to use the Regex PII Masking for PII unmasking, you must attach the policy to both the request and response flows. This allows the policy to mask PII in the request and unmask it in the response. Moreover, the `Redact PII` option should be disabled in both flows to allow the PII to be restored in the response. If you enable `Redact PII` in the response flow, the PII will be permanently redacted and not restored.

### Sample Regex PII Masking Configuration

- Guardrail Name: `Regex Guardrail`
- PII Entities:
  ```json
  [
    {
      "piiEntity": "EMAIL",
      "piiRegex": "\\\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Z|a-z]{2,}\\\\b"
    }
  ]
  ```
- JSON Path: `$.messages[0].content`
- Redact PII: `true`

### Sample Payload to be intervened from the Regex PII Masking

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

### Sample Payload after intervention from Regex PII Masking

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Prepare an email with my contact information, email: *****, and website: https://example.com."
    }
  ]
}
```