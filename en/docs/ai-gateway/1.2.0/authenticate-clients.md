---
title: "Authenticate clients"
description: "Protect an LLM proxy or provider with the api-key-auth policy, issue consumer API keys through the management API, and manage the key lifecycle."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/authenticate-clients/
md_url: https://wso2.com/api-platform/docs/ai-gateway/authenticate-clients.md
tags:
  - ai-gateway
  - security
  - authentication
  - api-keys
  - api-key
  - jwt
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Authenticate clients

An application that calls an LLM proxy or provider through the gateway presents a credential with every request. This page shows you how to attach the `api-key-auth` policy to a proxy, issue a consumer API key, and call the gateway with it. Once the policy is attached to an operation, the gateway rejects requests to that operation that arrive without a valid key.

This page is for the **platform administrator** who configures the proxy and issues keys, and for the **AI developer** who writes the application that sends them.

## Where access control applies

The AI Gateway controls access on three surfaces.

This page covers the data plane, the traffic your applications send. Client authentication decides **who may call** the gateway.

The management API is the REST API you use to manage gateway configuration. It authenticates callers with locally configured users, with JWTs validated against an identity provider, or with both. Authorization is role-based, and the gateway enforces it per route. For the configuration, see [Secure the management API](setup-and-deployment/secure-the-management-api.md). The two are configured independently: securing one does nothing for the other.

An LLM provider carries its own `accessControl` rules. These decide which upstream endpoints the provider exposes through the gateway, rather than who may call it. For a provider configuration that sets them, see [Quick Start Guide](quick-start-guide.md).

## Who configures this

Platform administrators configure LLM providers, including the access control rules that decide which endpoints a provider exposes. They also attach the authentication policies that protect proxies and providers, and issue the API keys that applications present. AI developers send those keys from the applications they build. The management API's own authentication and role mapping live in the gateway configuration, under `controller.auth`.

## Attach the API key policy

Add `api-key-auth` to the proxy's `operationPolicies`, scoped to the paths and methods you want to protect:

```yaml
  operationPolicies:
    - name: api-key-auth
      version: v1
      paths:
        - path: /chat/completions
          methods: [POST]
          params:
            key: X-API-Key
            in: header
```

The `params.key` value sets the header name the gateway reads the key from, and `params.in` sets where to look for it. Header matching is case-insensitive. Only operations listed under `paths` require a key, so an operation you leave out stays open.

An LLM provider takes the same block under its own `spec.operationPolicies`. For a provider that protects two operations this way, see [AWS Bedrock](gateway-artifacts/llm-provider/supported-providers/aws-bedrock.md).

The policy's full parameter reference is in the [API Key Auth policy](https://wso2.com/api-platform/policy-hub/policies/api-key-auth) in Policy Hub.

!!! note "`operationPolicies` compared with `policies`"
    Some configurations attach policies under `spec.policies`. That field is deprecated and the gateway treats it identically to `operationPolicies`. Use `operationPolicies` in new configuration.

## Create a consumer key

Create a key for the application that calls the proxy. The following command stores the key in a shell variable, so the value is never printed to your terminal or shell history:

```bash
PROXY_CONSUMER_KEY=$(curl -s -X POST \
  http://localhost:9090/api/management/v1/llm-proxies/openai-multi/api-keys \
  -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{"name":"openai-multi-client"}' \
  | jq -r '.apiKey.apiKey')
```

Replace *`openai-multi`* with your proxy's name and *`openai-multi-client`* with a name for the key. The `name` field is optional; if you omit it, the gateway generates an identifier.

Verify that a key was returned:

```bash
test -n "$PROXY_CONSUMER_KEY" && test "$PROXY_CONSUMER_KEY" != "null"
```

Two things about the response matter:

- **The key value is returned only when it is created or regenerated.** Store it securely. If you lose it, you cannot read it back — regenerate the key instead.
- **The response reports `remainingApiKeyQuota`.** Keys are quota-limited, so this tells you how many more you can create.

To create a key for a provider rather than a proxy, use the same request with `llm-proxies` replaced by `llm-providers`.

## Call the gateway with the key

Send the key in the header named by the policy's `params.key`:

```bash
curl -k -X POST https://localhost:8443/openai-multi/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${PROXY_CONSUMER_KEY}" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": "Explain multi-provider routing in one sentence."
      }
    ]
  }'
```

`X-API-Key` is the value the policy sets in this example, not a fixed gateway constant. If you set `params.key` to something else, clients send that header instead. The policy's default is `API-Key`.

A request to a protected operation without a valid key returns `401`.

## Manage keys

The management API exposes five operations for the key lifecycle. All of them require Basic Auth and the `admin` or `consumer` role. Replace *`{id}`* with the proxy's name and *`{apiKeyName}`* with the key's name.

| Operation | Request | What it does |
|-----------|---------|--------------|
| Create | `POST /llm-proxies/{id}/api-keys` | Generates a new API key for the proxy and returns its value. |
| List | `GET /llm-proxies/{id}/api-keys` | Lists the proxy's keys. Key values aren't included. |
| Regenerate | `POST /llm-proxies/{id}/api-keys/{apiKeyName}/regenerate` | Issues a new value for an existing key and returns it. The previous value stops working. |
| Update | `PUT /llm-proxies/{id}/api-keys/{apiKeyName}` | Sets a custom value on a key instead of generating one, for injecting an externally issued key. |
| Revoke | `DELETE /llm-proxies/{id}/api-keys/{apiKeyName}` | Revokes a key. Once revoked, it can no longer authenticate requests. |

Providers expose the same five operations under `/llm-providers`. For the full request and response reference, see [LLM proxy management](reference/management-api/llm-proxy-management.md) and [LLM provider management](reference/management-api/llm-provider-management.md).

Regenerate a key when you rotate credentials, and revoke one as soon as you believe it's exposed. Use a separate key per application and per environment, so revoking one doesn't interrupt the others.

## Other authentication methods

The gateway accepts any Policy Hub authentication policy in the same `operationPolicies` block. Each policy's parameters and behavior are documented in the [Policy Hub](https://wso2.com/api-platform/policy-hub).

| Policy | What it does |
|--------|--------------|
| [JWT Auth](https://wso2.com/api-platform/policy-hub/policies/jwt-auth) | Validates JWT access tokens against one or more JWKS providers |
| [Basic Auth](https://wso2.com/api-platform/policy-hub/policies/basic-auth) | Enforces HTTP Basic Authentication |
| [Opaque Token Auth](https://wso2.com/api-platform/policy-hub/policies/opaque-token-auth) | Validates opaque OAuth 2.0 access tokens via RFC 7662 token introspection |
| [Subscription Validation](https://wso2.com/api-platform/policy-hub/policies/subscription-validation) | Confirms the caller holds an active subscription for the target API |

## Related topics

- [Secure the management API](setup-and-deployment/secure-the-management-api.md) — authentication and role-based authorization on the control plane.
- [Token based rate limiting](token-based-rate-limiting.md) — cap what an authenticated caller can consume on the same operations.
- [Cost control and budgets](cost-control-and-budgets.md) — put a monetary ceiling on those same operations.
- [Multi-provider routing](routing/multi-provider-routing.md) — the worked proxy example this page draws its configuration from.
