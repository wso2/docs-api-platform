---
title: "Word Count Guardrail for AI APIs"
description: "Configure a word-count guardrail on AI API proxies in WSO2 API Platform to enforce minimum and maximum word limits on payload content."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/word-count-guardrail/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/word-count-guardrail.md
tags:
  - cloud
  - ai-gateway
  - guardrails
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Word Count Guardrail

This policy provides the capability to perform word count-based validation on incoming or outgoing JSON payloads. This component acts as a guardrail to enforce specific content moderation rules based on configurable minimum and maximum word counts and JSON path expressions.

## Configure Word Count Guardrail

1. In the left navigation menu, click **Develop**, then select **Policy**.

2. Click the Add policy icon in the required resource --> **Request/Response Flow** --> **Attach Mediation Policy**.

3. Add the policy information and click **Save**.

    The following table lists and describes the configuration parameters available for the **Word Count Guardrail** policy:

    | Parameter Name | Description |
    |----------------|-------------|
    | Guardrail Name | The name of the guardrail policy. This will be used for tracking purposes. |
    | Minimum Word Count | The minimum number of words the content must contain. |
    | Maximum Word Count | The maximum number of words the content can contain. |
    | JSON Path | The JSONPath expression used to extract content from the payload. If not specified, the entire payload will be used for validation. |
    | Invert the Guardrail Decision | If enabled, inverts the guardrail blocking decision, causing the guardrail to intervene and return an error response when the word count is within the specified range. |
    | Show Guardrail Assessment | When enabled, the error response will include detailed information about the reason for the guardrail intervention. |

4. Save the API and Deploy the API to apply the policy to the gateway.

### Sample Word Count Guardrail Configuration

- Guardrail Name: `Word Count Guardrail`
- Minimum Word Count: `2`
- Maximum Word Count: `10`
- JSON Path: `$.messages[0].content`
- Invert the Guardrail Decision: `false`
- Show Guardrail Assessment: `true`

### Sample Payload to be intervened from the Word Count Guardrail

```json
{
  "messages": [
    {
      "role": "user",
      "content": "This is a test message with more that 10 words in it. So the word count guardrail should fail."
    }
  ]
}
```

### Sample Response after Word Count Guardrail Intervention

```json
{
    "code": 900514,
    "message": {
        "action": "GUARDRAIL_INTERVENED",
        "actionReason": "Violation of applied word count constraints detected.",
        "assessments": "Violation of word count detected. Expected between 2 and 10 words.",
        "direction": "REQUEST",
        "interveningGuardrail": "Word Count Guardrail"
    },
    "type": "WORD_COUNT_GUARDRAIL"
}
```