---
title: "Authenticate to backends"
description: "Configure how the AI Gateway authenticates to an upstream LLM or MCP backend, using the api-key, oauth2, other, and none upstream authentication types."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/authenticate-backends/
md_url: https://wso2.com/api-platform/docs/ai-gateway/authenticate-backends.md
tags:
  - ai-gateway
  - security
  - authentication
  - oauth2
  - api-key
  - upstream
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-03
content_type: "how-to"
---

# Authenticate to backends

An LLM provider or MCP server behind the gateway usually requires its own credential. This page shows you how to configure upstream authentication so the gateway attaches that credential to every request it forwards.

[Authenticate clients](authenticate-clients.md) covers the other direction: who may call the gateway. The two are independent — securing one does nothing for the other.

This page is for the platform administrator who holds the upstream credential.

## How upstream authentication attaches a policy

An LLM provider's connection to OpenAI, for example, sets its credential in `upstream.auth`:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: openai-provider
spec:
  displayName: OpenAI Provider
  version: v1.0
  template: openai
  context: /openai/latest
  upstream:
    url: https://api.openai.com/v1
    auth:
      type: api-key
      policyParams:
        request:
          headers:
            - name: Authorization
              value: 'Bearer {{ secret "openai-api-key" }}'
  accessControl:
    mode: deny_all
    exceptions:
      - path: /chat/completions
        methods: [POST]
```

`upstream.auth` doesn't implement authentication itself — it attaches a policy that does. Every type shares the same four fields:

- **`type`** — selects the policy. `api-key` and `oauth2` attach a built-in policy by default; `other` attaches any policy by name; `none` attaches nothing.
- **`policyName`** — overrides the built-in policy for `api-key`/`oauth2` (point it at your own fork, or a newer major version). Required for `other`, which has no built-in default.
- **`policyVersion`** — the major version of `policyName` to attach (for example, `v1`). Optional; defaults to the highest version the gateway image loads.
- **`policyParams`** — the parameters passed verbatim to the attached policy, shown above under `request.headers`. Required for `oauth2` and `other`. Optional for `api-key`, where it replaces the deprecated `header`/`value` shortcut.

Because a type is just a policy plus its parameters, configuring any of them comes down to pointing `policyParams` at that policy's own parameter schema.

## Supported types

The `type` field accepts four values:

| Type | Built-in policy | `policyParams` |
|------|------------------|-----------------|
| `api-key` | [Set Headers](https://wso2.com/api-platform/policy-hub/policies/set-headers) | Optional — falls back to the deprecated `header`/`value` fields if omitted. |
| `oauth2` | [OAuth2 Generator](https://wso2.com/api-platform/policy-hub/policies/oauth2-generator) | Required. No typed fields exist outside it. |
| `other` | Any policy, named by `policyName` | Required, alongside `policyName`. |
| `none` | None | Not applicable. |

## Configure a type

The examples below show an LLM provider's `upstream.auth`, which an MCP proxy also uses. An LLM proxy calling a protected provider sets the same fields under `provider.auth` or `additionalProviders[].auth` instead — see [Where upstream authentication applies](#where-upstream-authentication-applies).

=== "api-key"

    ```yaml
    upstream:
      url: https://api.openai.com/v1
      auth:
        type: api-key
        policyParams:
          request:
            headers:
              - name: Authorization
                value: 'Bearer {{ secret "openai-api-key" }}'
    ```

    `policyParams` takes the [Set Headers](https://wso2.com/api-platform/policy-hub/policies/set-headers) policy's own parameters — see that page for the full reference.

=== "oauth2"

    ```yaml
    upstream:
      url: https://api.example.com
      auth:
        type: oauth2
        policyParams:
          tokenEndpoint: https://idp.example.com/oauth2/token
          clientId: gateway-client
          clientSecret: '{{ secret "gateway-client-secret" }}'
    ```

    `policyParams` takes the [OAuth2 Generator](https://wso2.com/api-platform/policy-hub/policies/oauth2-generator) policy's own parameters — see that page for the full reference, including the password grant, a static bearer token, and caching options.

=== "other"

    `other` covers an auth scheme none of the built-in types implement — name the policy yourself:

    ```yaml
    upstream:
      url: https://api.example.com
      auth:
        type: other
        policyName: <policy-name>
        policyVersion: v1
        policyParams:
          # this policy's own parameters
    ```

    `policyParams` takes whichever policy `policyName` names for its parameters. See [Other supported policies](#other-supported-policies) for worked examples.

=== "none"

    ```yaml
    upstream:
      url: https://api.example.com
      auth:
        type: none
    ```

## Other supported policies

Other than `api-key` and `oauth2`, every backend auth policy attaches through `type: other`, named by `policyName`:

| Policy | What it does | `policyParams` |
|--------|---------------|------------------|
| [AWS Authentication](https://wso2.com/api-platform/policy-hub/policies/aws-authentication) | Signs each request with AWS Signature Version 4 (SigV4), for services such as AWS Bedrock. | `service`, `region`, `authenticationType`, and credentials specific to that mode. |

For example, AWS Bedrock's SigV4 signing:

```yaml
upstream:
  url: https://bedrock-runtime.us-east-1.amazonaws.com
  auth:
    type: other
    policyName: aws-authentication
    policyVersion: v0
    policyParams:
      service: bedrock
      region: us-east-1
      authenticationType: default-credential-chain
```

See [AWS Bedrock](gateway-artifacts/llm-provider/supported-providers/aws-bedrock.md) for a complete SigV4 setup.

## Where upstream authentication applies

Three resource kinds support it, each under its own field:

| Resource | Field |
|----------|-------|
| LLM provider | `spec.upstream.auth` |
| LLM proxy, calling a protected provider over the internal loopback route | `spec.provider.auth`, and `spec.additionalProviders[].auth` for each additional provider |
| MCP proxy | `spec.upstream.auth` |

## Related topics

- [Authenticate clients](authenticate-clients.md) — who may call the gateway, the other side of access control.
- [Create and configure an LLM provider](gateway-artifacts/llm-provider/create-and-configure-an-llm-provider.md) — where `upstream.auth` sits in a provider definition.
- [MCP governance](mcp-governance.md) — policies that authenticate and authorize MCP traffic.
