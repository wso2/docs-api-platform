---
title: "Configure inbound authentication"
description: "Control the header name client applications use to send their API key when calling a deployed LLM provider or App LLM proxy."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/configure-inbound-auth/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/configure-inbound-auth.md
tags:
  - cloud
  - ai-workspace
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-07
content_type: "how-to"
---

# Configure inbound authentication

The **Security** tab on both LLM providers and App LLM proxies controls how client applications authenticate when calling the deployed gateway endpoint.

*Inbound authentication* is the check the gateway runs on every incoming client request. The credential for that check is an API key your application sends to the gateway. It isn't the upstream API key the gateway uses to call the LLM provider, which you configure in the **Connection** tab.

## How it works

When a provider or proxy is deployed, the gateway enforces inbound authentication on every incoming request. Clients must include a valid API key in the request header, under the name you configure in the Security tab.

The AI Workspace generates the API key and shows it once, at creation. Keys generated this way expire 90 days later. A key you create directly through the Platform API doesn't expire unless you supply an `expiresAt` timestamp on the request. The Security tab controls **which header name** the client must use to send it.

## Security tab fields

| Field | Description |
|-------|-------------|
| **Authentication** | The authentication type. `apiKey` is the only supported option. |
| **API Key**, or **Key name** | The name of the request header that must carry the API key. Defaults to `X-API-Key`. |
| **Key Location**, or **Sent in** | Where clients send the key. `header` is the only supported option. |

## Default behavior: the X-API-Key header

Out of the box, the gateway expects the API key in the `X-API-Key` request header:

```http
X-API-Key: <your-api-key>
```

Most AI SDKs don't send this header automatically, so add it explicitly when you initialize the client. See [Invoke via SDKs](using-sdks.md) for code examples.

## Use a custom header name

Change the key name to match what your SDK sends natively. For example, setting the key name to `Authorization` lets clients pass the key as a bearer token:

```http
Authorization: Bearer <your-api-key>
```

SDKs such as the OpenAI SDK, Mistral SDK, and Azure OpenAI SDK all send an `Authorization: Bearer` header by default, so with this configuration they work without any additional header setup.

!!! note
    The gateway validates the key value regardless of prefix — it strips a leading `Bearer ` before comparing against the stored key.

## Configure the header name

1. Open your LLM provider or App LLM proxy and go to the **Security** tab.
2. Set the **API Key** or **Key name** field to the header name your application uses.
3. Click **Save**.
4. Click **Deploy to Gateway**. Security changes take effect only after redeployment.