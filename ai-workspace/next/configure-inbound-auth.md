---
title: "Configure inbound authentication"
description: "Control the header name client applications use to send their API key when calling a deployed LLM provider or App LLM proxy."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/configure-inbound-auth/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/configure-inbound-auth.md
tags:
  - cloud
  - ai-workspace
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-24
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
| **API Key**, or **Key name** | The name of the request header that must carry the API key. Defaults to the provider vendor's own header. See [Default header per provider](#default-header-per-provider). |
| **Key Location**, or **Sent in** | Where clients send the key. `header` is the only supported option. |
| **API Key Value Prefix** | An optional prefix clients send before the key, such as `Bearer`, so the header value is `Bearer <your-api-key>`. |

## Default header per provider

When you create an LLM provider from a built-in template, the **Security** tab uses the same header and prefix as the vendor's API. The vendor's SDK therefore sends your gateway API key in the correct header without extra configuration:

| Provider template | Key name | API Key Value Prefix | Client sends |
|-------------------|----------|----------------------|--------------|
| OpenAI | `Authorization` | `Bearer` | `Authorization: Bearer <your-api-key>` |
| Mistral | `Authorization` | `Bearer` | `Authorization: Bearer <your-api-key>` |
| AWS Bedrock | `Authorization` | `Bearer` | `Authorization: Bearer <your-api-key>` |
| Anthropic | `x-api-key` | — | `x-api-key: <your-api-key>` |
| Azure OpenAI | `api-key` | — | `api-key: <your-api-key>` |
| Azure AI Foundry | `api-key` | — | `api-key: <your-api-key>` |
| Gemini | `x-goog-api-key` | — | `x-goog-api-key: <your-api-key>` |

After creating the provider, you can change **Key name** and **API Key Value Prefix** in the **Security** tab.

An App LLM proxy inherits the key name and prefix of the provider it's created from.

See [Invoke via SDKs](using-sdks.md) for code examples.

## Use a custom header name

You can change the key name and prefix at any time, for example to `X-API-Key` for clients that set a custom header:

```http
X-API-Key: <your-api-key>
```

When you set an **API Key Value Prefix**, clients must send it before the key. For example, with the key name `Authorization` and the prefix `Bearer`:

```http
Authorization: Bearer <your-api-key>
```

## Configure the header name

1. Open your LLM provider or App LLM proxy and go to the **Security** tab.
2. Set **API Key** or **Key name** to the header name your application uses. Set **API Key Value Prefix** if the value includes one, such as `Bearer`.
3. Click **Save**.
4. Click **Deploy to Gateway**. Security changes take effect only after redeployment.