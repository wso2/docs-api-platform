---
title: "Sentence Count Guardrail for AI APIs"
description: "Configure a sentence-count guardrail on AI API proxies in WSO2 API Platform to enforce minimum and maximum sentence limits on content."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/sentence-count-guardrail/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/sentence-count-guardrail.md
tags:
  - cloud
  - ai-gateway
  - guardrails
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Sentence Count Guardrail

This policy provides the capability to perform sentence count-based validation on incoming or outgoing JSON payloads. This component acts as a guardrail to enforce specific content moderation rules based on configurable minimum and maximum sentence counts and JSON path expressions.

## Configure Sentence Count Guardrail

1. In the left navigation menu, click **Develop**, then select **Policy**.

2. Click the Add policy icon in the required resource --> **Request/Response Flow** --> **Attach Mediation Policy**.

3. Add the policy information and click **Save**.

  The following table lists and describes the configuration parameters available for the **Sentence Count Guardrail** policy:

  | Parameter Name | Description |
  |----------------|-------------|
  | Guardrail Name | The name of the guardrail policy. This will be used for tracking purposes. |
  | Minimum Sentence Count | The minimum number of sentences the content must contain. |
  | Maximum Sentence Count | The maximum number of sentences the content can contain. |
  | JSON Path | The JSONPath expression used to extract content from the payload. If not specified, the entire payload will be used for validation. |
  | Invert the Guardrail Decision | If enabled, inverts the guardrail blocking decision, causing the guardrail to intervene and return an error response when the sentence count is within the specified range. |
  | Show Guardrail Assessment | When enabled, the error response will include detailed information about the reason for the guardrail intervention. |

4. Save the API and Deploy the API to apply the policy to the gateway.

### Sample Sentence Count Guardrail Configuration

- Guardrail Name: `Sentence Count Guardrail`
- Minimum Sentence Count: `1`
- Maximum Sentence Count: `3`
- JSON Path: `$.messages[0].content`
- Invert the Guardrail Decision: `false`
- Show Guardrail Assessment: `true`

### Sample Payload to be intervened from the Sentence Count Guardrail

```json
{
  "messages": [
    {
      "role": "user",
      "content": "This is a test message. This is another test sentence. It contains more than three sentences. Therefore, the sentence count guardrail should fail."
    }
  ]
}
```

### Sample Response after Sentence Count Guardrail Intervention

```json
{
    "code": 900514,
    "message": {
        "action": "GUARDRAIL_INTERVENED",
        "actionReason": "Violation of applied sentence count constraints detected.",
        "assessments": "Violation of sentence count detected. Expected between 1 and 3 sentences.",
        "direction": "REQUEST",
        "interveningGuardrail": "Sentence Count Guardrail"
    },
    "type": "SENTENCE_COUNT_GUARDRAIL"
}
```