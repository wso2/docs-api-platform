---
title: "AI Workspace CI/CD overview"
description: "Manage AI Workspace artifacts such as LLM providers, App LLM proxies, and MCP proxies through a Git-based CI/CD workflow."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/ci-cd/overview/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/ci-cd/overview.md
tags:
  - cloud
  - ai-workspace
  - ci-cd
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-08
content_type: "overview"
---

# AI Workspace CI/CD Overview

AI Workspace CI/CD lets you manage AI Workspace artifacts as version-controlled project files and apply them to the AI Workspace control plane with the `ap` CLI. This gives platform teams a repeatable way to create, update, review, and promote AI artifacts without relying only on manual UI changes.

You can use this flow for:

- **LLM providers** - reusable connections to model providers such as OpenAI, Anthropic, Azure OpenAI, Gemini, and Mistral AI
- **App LLM proxies** - application-facing proxy endpoints with their own security, guardrails, policies, and provider reference
- **MCP proxies** - managed proxy endpoints for upstream MCP servers

## How the CI/CD Flow Works

In a CI/CD workflow, a project in source control is the source of truth. The project contains declarative files that describe the AI Workspace artifact and the runtime behavior expected by the gateway.

The high-level flow is:

1. Start the AI Gateway with control-plane deployment synchronization disabled.
2. Configure the gateway and AI Workspace connections in the `ap` CLI.
3. Create or update an API Platform project.
4. Commit `metadata.yaml`, `runtime.yaml`, and `definition.yaml` to source control.
5. Validate the AI Workspace artifact with `ap ai-workspace build`.
6. Apply the artifact to AI Workspace with `ap ai-workspace apply`.
7. Deploy the runtime artifact to a gateway with `ap gateway apply -f runtime.yaml` so the declarative runtime changes are propagated to the gateway.

The AI Workspace control plane and gateway runtime do not depend on each other during artifact application. Each operation in the flow is executed synchronously from the project files without relying on output from another service or on asynchronous synchronization. AI Workspace stores the artifact and its intended gateway associations, while the gateway runtime receives runtime artifacts through `ap gateway apply`.

For this declarative flow, start the AI Gateway with deployment synchronization disabled so the gateway does not try to synchronize deployed artifacts back to AI Workspace:

```toml
[controller.controlplane]
deployment_sync_enabled = false
```

## Project Files

An AI Workspace CI/CD project uses the same project file model as other API Platform CLI workflows.

| File | Purpose |
|------|---------|
| `metadata.yaml` | Defines the artifact identity and display metadata. For AI Workspace artifacts, it can also include `spec.associatedGateways`. |
| `runtime.yaml` | Defines the runtime behavior, such as context, provider reference, upstream configuration, security, and policies. Also, this is used to deploy the artifact to the gateway. |
| `definition.yaml` | Defines the OpenAPI or MCP capability definition used when building the AI Workspace payload. This file is required for all supported AI Workspace artifact types. |
| `.api-platform/config.yaml` | Stores project-level CLI configuration, including the AI Workspace file paths used during build and apply. |

## Supported Artifact Types

The CLI validates that the artifact kind in `metadata.yaml` matches the kind in `runtime.yaml`.

| Artifact | `metadata.yaml` kind | `runtime.yaml` kind |
|----------|----------------------|---------------------|
| LLM provider | `LlmProviderMetadata` | `LlmProvider` |
| App LLM proxy | `LlmProxyMetadata` | `LlmProxy` |
| MCP proxy | `McpMetadata` | `Mcp` |

## Gateway Associations

Use `spec.associatedGateways` in `metadata.yaml` to record the gateways an AI Workspace artifact is intended to run on.

```yaml
kind: LlmProxyMetadata
metadata:
  name: customer-support-proxy
spec:
  displayName: Customer Support Proxy
  version: v1.0
  associatedGateways:
    - id: gw-dev
      configurations:
        host: dev-gateway.example.com
    - id: gw-prod
      configurations:
        host: prod-gateway.example.com
```

AI Workspace persists these associations during create and update operations and returns them in artifact list and detail responses. The association records the intended gateway targets; it does not create gateway deployment records by itself.

AI Workspace validates gateway associations within the organization context of the authenticated user. A gateway from another organization cannot be associated with the artifact.

## CI/CD Benefits

- **Git-based lifecycle** - Review, version, and promote AI Workspace artifacts through pull requests.
- **Repeatable deployments** - Apply the same project files across environments using pipeline variables.
- **Reduced drift** - Keep UI-managed artifacts aligned with the project files used by CI/CD.
- **Future extensibility** - Use the same build and apply model as more API Platform artifact types are added.

## Next Steps

- [Configure an AI Workspace CI/CD Workflow](configure-ci-cd-workflow.md) - Build and apply an AI Workspace artifact with the `ap` CLI
- [Configure LLM Provider](../llm-providers/configure-provider.md) - Create a provider from the AI Workspace UI
- [Configure App LLM Proxy](../llm-proxies/configure-proxy.md) - Create an App LLM proxy from the AI Workspace UI
- [Configure MCP Proxy](../mcp-proxies/configure-proxy.md) - Create an MCP proxy from the AI Workspace UI