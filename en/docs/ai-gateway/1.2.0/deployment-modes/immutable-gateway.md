---
title: "Immutable Gateway"
description: "Run API Platform AI Gateway in immutable mode, loading LLM and MCP configurations from files at startup for GitOps workflows."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/deployment-modes/immutable-gateway/
md_url: https://wso2.com/api-platform/docs/ai-gateway/deployment-modes/immutable-gateway.md
tags:
  - ai-gateway
  - deployment
  - gitops
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-16
content_type: "how-to"
---

# Immutable Gateway

This guide explains how to run the API Platform Gateway in **immutable mode**, where API configurations are loaded from files at startup instead of being managed through the REST API.

Immutable Gateway is the latest evolution of the WSO2 Micro Gateway experience.  
If you are coming from WSO2 Micro Gateway `3.2.x`, treat this as the successor track with enhanced API Platform integration, cloud-native deployment patterns, and improved artifact management workflows.

- Previous generation (reference): [WSO2 Micro Gateway 3.2.x docs](https://mg.docs.wso2.com/en/latest/)
- Current generation: Immutable Gateway V4.0.0 (this documentation set)

## Overview

In immutable mode, the gateway controller reads API artifacts from a local directory at startup and applies them automatically. The management REST API remains available for read operations but rejects any mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`) with `405 Method Not Allowed`.

This is the recommended approach for:

- **GitOps workflows** — store artifacts in a Git repository and bake them into a custom gateway image via CI/CD.
- **Immutable infrastructure** — ship a self-contained gateway image that requires no runtime configuration.
- **Kubernetes deployments** — mount a ConfigMap or Secret as a volume at the artifacts path.

## Configuration

Enable immutable mode in `config.toml`:

```toml
[immutable_gateway]
enabled = true
```

By default, the gateway controller loads artifacts from `/etc/api-platform-gateway/immutable_gateway/artifacts`. You only need to set `artifacts_dir` if you want to use a different path.

> **Note:** Full configuration reference with all options:
>
> ```toml
> [immutable_gateway]
> enabled = true
> artifacts_dir = "/etc/api-platform-gateway/immutable_gateway/artifacts"
> ```

!!! note "Toggling immutable mode from the environment"
    Environment variables do not override `config.toml` keys directly — a value reaches a key only through an `env` interpolation token in the config file, and the shipped config carries no token for the `[immutable_gateway]` section. To drive this section from an environment variable, add the tokens to your `config.toml` first:

    {% raw %}
    ```toml
    [immutable_gateway]
    enabled = '{{ env "APIP_GW_IMMUTABLE_GATEWAY_ENABLED" "false" }}'
    artifacts_dir = '{{ env "APIP_GW_IMMUTABLE_GATEWAY_ARTIFACTS_DIR" "/etc/api-platform-gateway/immutable_gateway/artifacts" }}'
    ```
    {% endraw %}

    then set `APIP_GW_IMMUTABLE_GATEWAY_ENABLED=true`. See [Gateway Configuration and Environment Interpolation](./../setup/configuration.md).

## Artifact format

Artifacts use the same Kubernetes-style resource format supported by the gateway. Each file must include `apiVersion`, `kind`, `metadata`, and `spec`.

### Injecting environment variables

Artifact files support Go template expressions for injecting dynamic values. Templates are rendered on the raw artifact string before YAML parsing, so expressions work in any string field — `upstream`, `auth`, policy `params`, etc.

{% raw %}
| Function | Redacted in config dumps | Use for |
|---|---|---|
| `{{ env "KEY" }}` | No | Non-sensitive env vars (URLs, policy param values) |
| `{{ env "KEY" | redact }}` | Yes | Sensitive env vars (tokens, API keys) |
{% endraw %}

Use `| redact` for sensitive values to hide them from config dumps. A `| default "value"` pipe is available for fallback values. See [Gateway Artifact Templating](../../../api-gateway/1.1.0/setup/artifact-templating.md) for the full function reference.

### Sample: Reading List API

Save the following as `artifacts/reading-list-v1.yaml`:

{% raw %}
```yaml
apiVersion: gateway.api-platform.wso2.com/v1alpha1
kind: RestApi
metadata:
  name: reading-list-api-v1
spec:
  displayName: Reading List API
  version: v1.0
  context: /reading-list/$version
  upstream:
    main:
      # read from env, falls back to the public sample backend if not set
      url: '{{ env "BACKEND_URL" | default "https://apis.bijira.dev/samples/reading-list-api-service/v1.0" }}'
  operations:
    - method: GET
      path: /books
    - method: POST
      path: /books
    - method: GET
      path: /books/{id}
    - method: PUT
      path: /books/{id}
    - method: DELETE
      path: /books/{id}
```
{% endraw %}

### Directory structure

The controller walks all subdirectories, so you can organize artifacts however you like:

```
artifacts/
├── rest-apis/
│   ├── petstore-v1.yaml
│   └── orders-v2.yaml
├── llm-providers/
│   └── openai.yaml
├── llm-proxies/
│   └── chat-proxy.yaml
└── mcp-proxies/
    └── tools-proxy.yaml
```

## Deployment

### Baking artifacts into a custom image

The recommended GitOps approach is to build a custom gateway-controller image with artifacts copied in at build time:

```dockerfile
FROM ghcr.io/wso2/api-platform/gateway-controller:1.0.0

COPY ./artifacts /etc/api-platform-gateway/immutable_gateway/artifacts

# Bake in a config.toml that sets [immutable_gateway] enabled = true.
COPY ./config.toml /etc/gateway-controller/config.toml
```

### Kubernetes — mounting a ConfigMap volume

You can also mount artifacts as a volume from a ConfigMap or Secret without building a custom image:

```yaml
volumes:
  - name: gateway-artifacts
    configMap:
      name: gateway-artifacts
volumeMounts:
  - name: gateway-artifacts
    mountPath: /etc/api-platform-gateway/immutable_gateway/artifacts
    readOnly: true
```

The mounted `config.toml` must set `[immutable_gateway] enabled = true` — either directly, or by mounting a tokenized `config.toml` (with an `env` token for that section) and setting `APIP_GW_IMMUTABLE_GATEWAY_ENABLED=true` in the container's environment variables (see [Configuration](#configuration)).

## Invoking the API

Once the gateway is running with the sample artifact, invoke the Reading List API:

```bash
curl -i http://localhost:8080/reading-list/v1.0/books
```
