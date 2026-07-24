---
title: "Consume an API secured with an API key"
description: "Use a generated API key to authenticate requests to an API secured with API key authentication."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/consuming-services/consume-an-api-secured-with-api-key/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/consuming-services/consume-an-api-secured-with-api-key.md
tags:
  - cloud
  - devportal
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Consume an API Secured with API Key

API keys are bound to a specific API. You generate a key directly for an API, and that key authenticates your requests to it.

## Prerequisites

The API must have API key authentication enabled — check the API's documentation or the security section of its specification to confirm. If the API requires a subscription, [subscribe to it](../manage-subscriptions/subscribe-to-an-api.md) first.

If you haven't generated a key yet, see [Manage API Keys](../manage-api-keys.md) for the full generate/rotate/revoke lifecycle.

## Invoke the API

Include the generated API key in the `api-key` request header when calling the API:

```bash
curl -X GET "https://api.example.com/orders/v1/orders" \
  -H "api-key: <YOUR_API_KEY>"
```

Replace `<YOUR_API_KEY>` with the key you copied when generating it, and the URL with the API's actual endpoint.

!!! note
    The header name may vary depending on the API's configuration. Check the API's OpenAPI specification (the `securitySchemes` section) for the correct header name.

## Related

- [Manage API Keys](../manage-api-keys.md) — generate, rotate, revoke, and associate keys with an application
- [Subscribe to an API](../manage-subscriptions/subscribe-to-an-api.md) — subscribe if the API requires a subscription
- [Consume an API Secured with OAuth2](consume-an-api-secured-with-oauth2.md) — alternative for OAuth2-secured APIs
