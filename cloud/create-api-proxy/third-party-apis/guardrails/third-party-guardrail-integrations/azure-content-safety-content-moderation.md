---
title: "Azure Content Safety Content Moderation for AI APIs"
description: "Integrate Azure Content Safety with AI API proxies in WSO2 API Platform to filter hate speech, sexual content, self-harm, and violence."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/third-party-guardrail-integrations/azure-content-safety-content-moderation/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/third-party-guardrail-integrations/azure-content-safety-content-moderation.md
tags:
  - cloud
  - ai-gateway
  - guardrails
  - azure
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Azure Content Safety Content Moderation

This policy provides the capability to integrate [Azure Content Safety Content Moderation Service](https://learn.microsoft.com/en-us/rest/api/contentsafety/text-operations/analyze-text?view=rest-contentsafety-2024-09-01&tabs=HTTP) to filter out harmful content in request bodies and AI-generated responses. This guardrail checks for hate speech, sexual content, self-harm, and violence, and can be applied to both requests and responses.

## Configure Azure Content Safety Content Moderation

1. In the left navigation menu, click **Develop**, then select **Policy**.

2. Click the Add policy icon in the required resource --> **Request/Response Flow** --> **Attach Mediation Policy**.

3. Add the policy information and click **Save**.

    The following table lists and describes the configuration parameters available for the **Azure Content Safety Content Moderation** policy:

    | Parameter Name | Description |
    |----------------|-------------|
    | Guardrail Name | The name of the guardrail policy. This will be used for tracking purposes. |
    | Azure Content Safety Endpoint | The endpoint URL for the Azure Content Safety service. |
    | Azure Content Safety Key | The API key for authenticating with the Azure Content Safety service. |
    | Hate Severity Level | The severity level for the hate category. Options are integer values from 0 to 7, where 0 is the lowest severity and 7 is the highest. |
    | Sexual Severity Level | The severity level for the sexual category. Options are integer values from 0 to 7, where 0 is the lowest severity and 7 is the highest. |
    | Self Harm Severity Level | The severity level for the self-harm category. Options are integer values from 0 to 7, where 0 is the lowest severity and 7 is the highest. |
    | Violence Severity Level | The severity level for the violence category. Options are integer values from 0 to 7, where 0 is the lowest severity and 7 is the highest. |
    | JSON Path | The JSONPath expression used to extract content from the payload. If not specified, the entire payload will be used for validation. |
    | Passthrough On Error | If enabled, the request or response is passed through without validation when the Azure Content Safety service is unavailable. Otherwise, a guardrail validation error is triggered. |
    | Show Guardrail Assessment | When enabled, the error response will include detailed information about the reason for the guardrail intervention. |

4. Save the API and Deploy the API to apply the policy to the gateway.

### Sample Azure Content Safety Content Moderation Configuration

- Guardrail Name: `Azure Content Safety Guardrail`
- Azure Content Safety Endpoint: `https://<your-endpoint>.cognitiveservices.azure.com`
- Azure Content Safety Key: `your-azure-content-safety-key`
- Hate Severity Level: `3`
- Sexual Severity Level: `2`
- Self Harm Severity Level: `1`
- Violence Severity Level: `4`
- JSON Path: `$.messages[0].content`
- Passthrough On Error: `false`
- Show Guardrail Assessment: `true`

### Sample Payload to be intervened from the Azure Content Safety Content Moderation

```json
{
  "messages": [
    {
      "role": "user",
      "content": "I need to buy guns."
    }
  ]
}
```

### Sample Response after Azure Content Safety Content Moderation Intervention

```json
{
    "code": 900514,
    "message": {
        "action": "GUARDRAIL_INTERVENED",
        "actionReason": "Violation of Azure content safety content moderation detected.",
        "assessments": {
            "categories": [
                {
                    "category": "Hate",
                    "result": "PASS",
                    "severity": 0,
                    "threshold": 3
                },
                {
                    "category": "Sexual",
                    "result": "PASS",
                    "severity": 0,
                    "threshold": 2
                },
                {
                    "category": "SelfHarm",
                    "result": "PASS",
                    "severity": 0,
                    "threshold": 1
                },
                {
                    "category": "Violence",
                    "result": "FAIL",
                    "severity": 2,
                    "threshold": 1
                }
            ],
            "inspectedContent": "I need to buy guns."
        },
        "direction": "REQUEST",
        "interveningGuardrail": "Azure Content Safety Guardrail"
    },
    "type": "AZURE_CONTENT_SAFETY_CONTENT_MODERATION"
}
```