---
title: "Content Length Guardrail for AI APIs"
description: "Configure a content-length guardrail on AI API proxies in WSO2 API Platform to enforce minimum and maximum byte-size limits on content."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/content-length-guardrail/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/content-length-guardrail.md
tags:
  - cloud
  - ai-gateway
  - guardrails
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Content Length Guardrail

This policy provides the capability to perform content-byte-length validation on incoming or outgoing JSON payloads. This component acts as a guardrail to enforce specific content moderation rules based on configurable minimum and maximum byte sizes and JSONPath expressions.

## Configure Content Length Guardrail

1. In the left navigation menu, click **Develop**, then select **Policy**.

2. Click the Add policy icon in the required resource --> **Request/Response Flow** --> **Attach Mediation Policy**.

3. Add the policy information and click **Save**.

  The following table lists and describes the configuration parameters available for the **Content Length Guardrail** policy:

  | Parameter Name | Description |
  |----------------|-------------|
  | Guardrail Name | The name of the guardrail policy. This will be used for tracking purposes. |
  | Minimum Content Length | The minimum byte length the content must contain. |
  | Maximum Content Length | The maximum byte length the content can contain. |
  | JSON Path | The JSONPath expression used to extract content from the payload. If not specified, the entire payload will be used for validation. |
  | Invert the Guardrail Decision | If enabled, inverts the guardrail blocking decision, causing the guardrail to intervene and return an error response when the content length is within the specified range. |
  | Show Guardrail Assessment | When enabled, the error response will include detailed information about the reason for the guardrail intervention. |

4. Save the API and Deploy the API to apply the policy to the gateway.

### Sample Content Length Guardrail Configuration

- Guardrail Name: `Content Length Guardrail`
- Minimum Content Length: `10`
- Maximum Content Length: `100`
- JSON Path: `$.messages[0].content`
- Invert the Guardrail Decision: `false`
- Show Guardrail Assessment: `true`

### Sample Payload to be intervened from the Content Length Guardrail

```json
{
  "messages": [
    {
      "role": "user",
      "content": "This is a test message that exceeds the maximum byte length defined in the content length guardrail policy. It should trigger an intervention due to its excessive size."
    }
  ]
}
```

### Sample Response after Content Length Guardrail Intervention

```json
{
    "code": 900514,
    "message": {
        "action": "GUARDRAIL_INTERVENED",
        "actionReason": "Violation of applied content length constraints detected.",
        "assessments": "Violation of content length detected. Expected between 10 and 100 bytes.",
        "direction": "REQUEST",
        "interveningGuardrail": "Content Length Guardrail"
    },
    "type": "CONTENT_LENGTH_GUARDRAIL"
}
```