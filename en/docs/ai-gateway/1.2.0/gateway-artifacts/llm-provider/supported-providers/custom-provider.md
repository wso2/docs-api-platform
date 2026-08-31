---
title: "Custom provider"
description: "Connect the AI Gateway to an LLM service with no shipped template: define an LlmProviderTemplate of your own, deploy it, and create a provider that uses it."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/custom-provider/
md_url: https://wso2.com/api-platform/docs/ai-gateway/gateway-artifacts/llm-provider/supported-providers/custom-provider.md
tags:
  - ai-gateway
  - llm-provider
  - custom-provider
  - llm
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-18
content_type: "how-to"
---

# Custom provider

Connect the AI Gateway to an LLM service that none of the templates the gateway ships covers. You end up with a template of your own that tells the gateway how to read that service's responses, and an LLM Provider that uses it.

If the service you're connecting does have a shipped template, use that provider's page instead. [Provider templates](../../../reference/llm-templates.md) lists the seven the gateway ships.

This page is for platform administrators, who hold the upstream credentials.

## What you need from your provider

Collect these four things before you define the template:

| Value | Where it comes from |
|-------|---------------------|
| Endpoint URL | Your provider's API documentation. |
| Auth header and scheme | Your provider's API documentation. |
| API key or credential | Your account with the provider. |
| Token and model locations | A sample response from the provider. You need to know where it reports prompt, completion and total token counts, and where it names the model. |

The last row is the one a custom provider adds. For the seven shipped templates the gateway already knows these locations; for yours, you supply them.

## Define the template

A template tells the gateway where to find usage metadata in your provider's traffic. Each value is read from one of four locations:

- **`payload`**: Extract from JSON response body using JSONPath expressions (e.g., `$.usage.prompt_tokens`)
- **`header`**: Extract from HTTP response headers using header name (e.g., `x-ratelimit-remaining-tokens`)
- **`queryParam`**: Extract from a URL query parameter
- **`pathParam`**: Extract from URL path using regular expressions (e.g., `(?<=models/)[a-zA-Z0-9.\-]+`)

An `LlmProviderTemplate` takes this structure:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: <template-id>
spec:
  displayName: <Display Name>
  groupId: <template-family-id>
  managedBy: <template-owner>
  version: <template-version>
  # Provider characteristics
  promptTokens:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  completionTokens:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  totalTokens:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  remainingTokens:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  requestModel:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
  responseModel:
    location: <payload|header|queryParam|pathParam>
    identifier: <extraction-pattern>
```

Only `metadata.name` and `spec.displayName` are required, so define the extraction values your provider reports and omit the rest. For every field, including the `resourceMappings` block that overrides extraction paths for one resource, see [Provider templates](../../../reference/llm-templates.md).

## Deploy the template

Deploy the template through the management API before you create a provider that names it:

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-provider-templates \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProviderTemplate
metadata:
  name: custom-provider
spec:
  displayName: Custom Provider
  groupId: custom-provider
  managedBy: customer
  version: v1.0
  totalTokens:
    location: payload
    identifier: $.tokens.total
EOF
```

The value of `metadata.name` becomes the template ID. This example deploys a template with the ID `custom-provider`, which reads a total token count from `$.tokens.total` in the response payload.

## Configure the provider

Deploy the provider through the management API, following the procedure in [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md). A provider built on a custom template takes this shape:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: custom-provider-instance
spec:
  displayName: Custom Provider
  version: v1.0
  template: custom-provider
  context: /providers/custom
  upstream:
    url: <provider-endpoint>
    auth:
      type: api-key
      header: <provider-auth-header>
      value: <provider-api-key>
  accessControl:
    mode: deny_all
    exceptions:
      - path: <chat-completions-path>
        methods: [POST]
```

The `template` field names the template ID you deployed. Replace the four placeholders with the values you collected:

- *`<provider-endpoint>`* — the base URL from your provider's API documentation.
- *`<provider-auth-header>`* — the header name that documentation specifies for authentication.
- *`<provider-api-key>`* — your credential, formatted as that documentation specifies.
- *`<chat-completions-path>`* — the request path you expose through the gateway.

The `context` value sets the URL prefix the provider answers on, so this provider serves its exposed paths under `/providers/custom`. The `accessControl` block denies every upstream path except those listed as exceptions.

## Manage the template

Custom templates can be updated and deleted through the same management API. The templates the gateway ships cannot be modified or deleted. For the update and delete requests, see [Provider templates](../../../reference/llm-templates.md).

## Related pages

- [Create and configure an LLM provider](../create-and-configure-an-llm-provider.md) — the full deployment procedure this page's definition plugs into.
- [Provider templates](../../../reference/llm-templates.md) — the template field reference, the extraction configuration object, and the seven templates the gateway ships.
- [LLM provider template management](../../../reference/management-api/llm-provider-template-management.md) — the management API operations for templates.
