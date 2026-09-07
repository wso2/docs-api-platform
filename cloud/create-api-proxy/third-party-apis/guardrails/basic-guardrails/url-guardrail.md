---
title: "URL Guardrail for AI APIs"
description: "Configure a URL guardrail on AI API proxies in WSO2 API Platform to validate embedded URLs via DNS lookup or connection checks."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/url-guardrail/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/guardrails/basic-guardrails/url-guardrail.md
tags:
  - cloud
  - ai-gateway
  - guardrails
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# URL Guardrail

This policy provides the capability to perform URL validity checks on incoming or outgoing JSON payloads. This component acts as a guardrail to enforce content safety by validating embedded URLs for accessibility or DNS resolution.

## Configure URL Guardrail

1. In the left navigation menu, click **Develop**, then select **Policy**.

2. Click the Add policy icon in the required resource --> **Request/Response Flow** --> **Attach Mediation Policy**.

3. Add the policy information and click **Save**.

The following table lists and describes the configuration parameters available for the **URL Guardrail** policy:

| Parameter Name | Description |
|----------------|-------------|
| Guardrail Name | The name of the guardrail policy. This will be used for tracking purposes. |
| Perform DNS Lookup | If enabled, a DNS lookup will be performed to validate the extracted URLs. If disabled, a connection attempt will be made instead. |
| Connection Timeout | The connection timeout for DNS lookups or connection attempts, in milliseconds. If not specified, a default timeout will be used. |
| JSON Path | The JSONPath expression used to extract URLs from the payload. If not specified, the entire payload will be used for validation. |
| Show Guardrail Assessment | When enabled, the error response will include detailed information about the reason for the guardrail intervention. |

4. Save the API and Deploy the API to apply the policy to the gateway.

### Sample URL Guardrail Configuration

- Guardrail Name: `URL Guardrail`
- Perform DNS Lookup: `false`
- Connection Timeout: `5000`
- JSON Path: `$.messages[0].content`
- Show Guardrail Assessment: `true`

### Sample Payload to be intervened from the URL Guardrail

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Check this link: http://example.com/suspicious-link and this one: https://foo.bar.baz"
    }
  ]
}
```

### Sample Response after URL Guardrail Intervention

```json
{
    "code": 900514,
    "message": {
        "action": "GUARDRAIL_INTERVENED",
        "actionReason": "Violation of url validity detected.",
        "assessments": {
            "invalidUrls": [
                "http://example.com/suspicious-link",
                "https://foo.bar.baz"
            ],
            "message": "One or more URLs in the payload failed validation."
        },
        "direction": "REQUEST",
        "interveningGuardrail": "URL Guardrail"
    },
    "type": "URL_GUARDRAIL"
}
```