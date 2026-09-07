---
title: "AWS Bedrock Guardrail for AI APIs"
description: "Integrate AWS Bedrock Guardrails with AI API proxies in WSO2 API Platform for real-time content safety validation and PII protection."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/third-party-guardrail-integrations/aws-bedrock-guardrail/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/third-party-guardrail-integrations/aws-bedrock-guardrail.md
tags:
  - cloud
  - ai-gateway
  - guardrails
  - aws
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# AWS Bedrock Guardrail

This policy provides the capability to integrate with [AWS Bedrock Guardrails](https://aws.amazon.com/bedrock/guardrails/) to enable real-time content safety validation and PII protection for AI applications. Through the configured Bedrock Guardrail, it can detect and block harmful content (hate speech, sexual content, self-harm, violence) and mask or redact Personally Identifiable Information (PII) in both request and response payloads. This integration helps ensure AI applications meet safety standards and compliance requirements while protecting against malicious prompt injection attacks.

## Configure AWS Bedrock Guardrail

1. In the left navigation menu, click **Develop**, then select **Policy**.

2. Click the Add policy icon in the required resource --> **Request/Response Flow** --> **Attach Mediation Policy**.

3. Add the policy information and click **Save**.

    The following table lists and describes the configuration parameters available for the **AWS Bedrock Guardrail** policy:

    | Parameter Name | Description |
    |----------------|-------------|
    | Guardrail Name | The name of the guardrail policy. This will be used for tracking purposes. |
    | AWS Guardrail ID | The ID of the AWS Bedrock Guardrail resource to be used for content safety validation and PII protection. |
    | AWS Guardrail Version | The version of the AWS Bedrock Guardrail resource. |
    | AWS Guardrail Region | The AWS region where the Bedrock Guardrail resource is deployed. |
    | AWS Access Key ID | The AWS Access Key ID used for authenticating requests to the Bedrock Guardrail service. |
    | AWS Secret Access Key | The AWS Secret Access Key used for authenticating requests to the Bedrock Guardrail service. |
    | AWS Session Token | The AWS Session Token used to authenticate with the AWS Bedrock service. |
    | AWS Role ARN | The ARN of the IAM role to assume for accessing the AWS Bedrock Guardrail service. This is optional and can be used if you want to use a role instead of access keys. |
    | AWS Role Region | The AWS region where the IAM role is deployed. This is optional and can be used if you want to use a role instead of access keys. |
    | AWS Role External ID | The external ID used for the AWS role assumption. This is optional and can be used if you want to use a role instead of access keys. |
    | JSON Path | The JSONPath expression used to extract content from the payload. If not specified, the entire payload will be used for validation. |
    | Redact PII | When enabled, detected PIIs are redacted and will not be restored to its original form. This should be enabled when the policy is attached to the response flow to prevent exposing AI-generated content with sensitive data to the client. When disabled and applied to the request flow, detected PII is temporarily masked and can be restored in the corresponding response. |
    | Passthrough On Error | If enabled, the request or response is passed through without validation when the AWS Bedrock Guardrail service is unavailable. Otherwise, a guardrail validation error is triggered. |
    | Show Guardrail Assessment | When enabled, the error response will include detailed information about the reason for the guardrail intervention. |

4. Save the API and Deploy the API to apply the policy to the gateway.

!!! note "PII Unmasking with AWS Bedrock Guardrail"
    If you want to use the AWS Bedrock Guardrail for PII unmasking, you must attach the policy to both the request and response flows. This allows the policy to mask PII in the request and unmask it in the response. Moreover, the `Redact PII` option should be disabled in both flows to allow the PII to be restored in the response. If you enable `Redact PII` in the response flow, the PII will be permanently redacted and not restored.

### Sample AWS Bedrock Guardrail Configuration

- Guardrail Name: `AWS Bedrock Guardrail`
- AWS Guardrail ID: `guardrail-1234567890abcdef`
- AWS Guardrail Version: `1.0`
- AWS Guardrail Region: `us-west-2`
- AWS Access Key ID: `<your-access-key-id>`
- AWS Secret Access Key: `<your-secret-access-key>`
- AWS Session Token: `<your-session-token>`
- AWS Role ARN: `<your-role-arn>`
- AWS Role Region: `us-west-2`
- AWS Role External ID: `<your-role-external-id>`
- JSON Path: `$.messages[0].content`
- Redact PII: `false`
- Passthrough On Error: `false`
- Show Guardrail Assessment: `true`

### Sample Payload to be intervened from the AWS Bedrock Guardrail

```json
{
  "messages": [
    {
      "role": "user",
      "content": "I'm thinking of betting illegally for sports lately."
    }
  ]
}
```

### Sample Response after AWS Bedrock Guardrail Intervention

```json
{
    "code": 900514,
    "message": {
        "action": "GUARDRAIL_INTERVENED",
        "actionReason": "Violation of AWS Bedrock Guardrails detected.",
        "assessments": {
            "topicPolicy": {
                "topics": [
                    {
                        "action": "BLOCKED",
                        "name": "Illegal Sports",
                        "type": "DENY"
                    }
                ]
            }
        },
        "direction": "REQUEST",
        "interveningGuardrail": "AWS Bedrock Guardrail"
    },
    "type": "AWS_BEDROCK_GUARDRAIL"
}
```