---
title: "Configure an AI Workspace CI/CD workflow"
description: "Use the ap CLI to validate and apply AI Workspace artifacts such as LLM providers, App LLM proxies, and MCP proxies from project files."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/ci-cd/configure-ci-cd-workflow/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/ci-cd/configure-ci-cd-workflow.md
tags:
  - cloud
  - ai-workspace
  - ci-cd
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-08
content_type: "how-to"
---

# Configure an AI Workspace CI/CD Workflow

This guide shows how to validate and apply AI Workspace artifacts from project files using the `ap` CLI. Use this workflow when you want **LLM providers**, **App LLM proxies**, or **MCP proxies** to be reviewed, versioned, and promoted through a Git-based release process.

## Prerequisites

!!! info "Before You Begin"
    - Install the `ap` CLI and make it available on your `PATH`.
    - Configure access to the target AI Workspace.
    - Configure access to the target gateway.
    - Start the target AI Gateway with deployment synchronization disabled.
    - For App LLM proxy and MCP proxy artifacts, get the API Platform project ID that the artifact belongs to.
    - Keep secrets out of project files. Use platform-managed secrets or environment variables supported by the CLI.

## Configure the AI Workspace Connection

Add the AI Workspace connection once, then set it as the active workspace for later commands.

=== "Template"
    ```shell
    ap ai-workspace add \
      --display-name <workspace-name> \
      --server <ai-workspace-url> \
      --auth <basic|oauth|api-key>

    ap ai-workspace use --display-name <workspace-name>
    ```

=== "Example"
    ```shell
    ap ai-workspace add \
      --display-name dev-aiws \
      --server https://ai-workspace.example.com \
      --auth oauth

    ap ai-workspace use --display-name dev-aiws
    ```

The AI Workspace CLI supports `basic`, `oauth`, and `api-key` authentication. Environment variables override credentials stored in the CLI configuration.

| Auth type | Environment variables |
|-----------|-----------------------|
| `basic` | `WSO2AP_AIWORKSPACE_USERNAME`, `WSO2AP_AIWORKSPACE_PASSWORD` |
| `oauth` | `WSO2AP_AIWORKSPACE_TOKEN` |
| `api-key` | `WSO2AP_AIWORKSPACE_API_KEY` |

Configure and select the gateway connection.

=== "Template"
    ```shell
    ap gateway add \
      --display-name <gateway-name> \
      --server <gateway-url>

    ap gateway use --display-name <gateway-name>
    ```

=== "Example"
    ```shell
    ap gateway add \
      --display-name dev-gw \
      --server https://gateway.example.com

    ap gateway use --display-name dev-gw
    ```

## Start the Gateway for Declarative CI/CD

When using this CI/CD flow, start the AI Gateway with control-plane deployment synchronization disabled.

```toml
[controller.controlplane]
deployment_sync_enabled = false
```

In **declarative CI/CD**, AI Workspace artifacts and gateway runtime artifacts are **applied independently** from the project files. Each operation runs **synchronously** and does not rely on output from another service or on **asynchronous gateway-to-control-plane synchronization**. Disabling deployment synchronization prevents the gateway from trying to synchronize deployed artifacts back to AI Workspace while CI/CD owns the artifact lifecycle.

## Create or Update the Project

Create a project if you do not already have one.

=== "Template"
    ```shell
    ap project init \
      --display-name <artifact-name> \
      --type <artifact-type> \
      --version <version> \
      --context <context-path>

    cd <artifact-name>
    ```

=== "Example"
    ```shell
    ap project init \
      --display-name wso2-claude-proxy \
      --type LLM-Proxy \
      --version v1.0 \
      --context /customer-support

    cd wso2-claude-proxy
    ```

The project contains the files used by the AI Workspace build and apply commands.

```text
wso2-claude-proxy/
|-- metadata.yaml
|-- runtime.yaml
|-- definition.yaml
|-- docs/
|-- tests/
`-- .api-platform/
    `-- config.yaml
```

## Author the AI Workspace Artifact

Update `metadata.yaml`, `runtime.yaml`, and `definition.yaml` for the AI Workspace artifact you want to publish.

The artifact kind in `metadata.yaml` must match the artifact kind in `runtime.yaml` after the `Metadata` suffix is removed.

| Artifact | `metadata.yaml` kind | `runtime.yaml` kind |
|----------|----------------------|---------------------|
| LLM provider | `LlmProviderMetadata` | `LlmProvider` |
| App LLM proxy | `LlmProxyMetadata` | `LlmProxy` |
| MCP proxy | `McpMetadata` | `Mcp` |

For example, an App LLM proxy can define its metadata and intended gateways in `metadata.yaml`.

```yaml
kind: LlmProxyMetadata
metadata:
  name: wso2-claude-proxy
spec:
  displayName: Customer Support Proxy
  version: v1.0
  associatedGateways:
    - id: gw-dev
      configurations:
        host: dev-gateway.example.com
```

The corresponding `runtime.yaml` uses the same artifact name and the matching runtime kind.

```yaml
kind: LlmProxy
metadata:
  name: wso2-claude-proxy
spec:
  context: /wso2-claude-proxy
  description: Proxy endpoint for the customer support assistant.
  provider:
    id: openai-provider
```

Add the OpenAPI or MCP capability definition to `definition.yaml`. The AI Workspace build requires this file for all supported artifact types.

## Validate the Artifact

Run `ap ai-workspace build` to validate the project files. If you run the command from the project root, you can omit `-f`.

=== "Template"
    ```shell
    # From the project root
    ap ai-workspace build

    # From another directory
    ap ai-workspace build -f <project-directory>
    ```

=== "Example"
    ```shell
    # From the project root
    ap ai-workspace build

    # From another directory
    ap ai-workspace build -f /path/to/wso2-claude-proxy
    ```

The build command validates that:

- `metadata.yaml`, `runtime.yaml`, and `definition.yaml` are available
- the metadata and runtime kinds match
- the metadata names match
- all configured paths remain inside the project directory

## Deploy the Runtime Artifact to a Gateway

Apply `runtime.yaml` to the selected gateway so the runtime changes described in the project files are propagated to the gateway in a declarative manner.

=== "Template"
    ```shell
    ap gateway apply -f <project-directory>/runtime.yaml
    ```

=== "Example"
    ```shell
    ap gateway apply -f /path/to/wso2-claude-proxy/runtime.yaml
    ```

This deploys or updates the runtime artifact on the active gateway. The AI Workspace apply step is separate and can be run before or after the gateway apply step in the same pipeline, depending on how you structure promotion for the environment.

## Apply the Artifact to AI Workspace

Run `ap ai-workspace apply` from the project root, or pass the project directory with `-f`.

For LLM providers:

=== "Template"
    ```shell
    # From the project root
    ap ai-workspace apply

    # From another directory
    ap ai-workspace apply -f <project-directory>
    ```

=== "Example"
    ```shell
    # From the project root
    ap ai-workspace apply

    # From another directory
    ap ai-workspace apply -f /path/to/openai-provider
    ```

For App LLM proxies and MCP proxies, include the project ID.

=== "Template"
    ```shell
    # From the project root
    ap ai-workspace apply --project-id <project-id>

    # From another directory
    ap ai-workspace apply \
      -f <project-directory> \
      --project-id <project-id>
    ```

=== "Example"
    ```shell
    # From the project root
    ap ai-workspace apply --project-id customer-support-project

    # From another directory
    ap ai-workspace apply \
      -f /path/to/wso2-claude-proxy \
      --project-id customer-support-project
    ```

The apply command validates the project, builds the request payload in memory, and creates or updates the artifact in AI Workspace.

| Runtime kind | AI Workspace endpoint |
|--------------|-----------------------|
| `LlmProvider` | `/llm-providers` |
| `LlmProxy` | `/llm-proxies` |
| `Mcp` | `/mcp-proxies` |

Create and update use the same command. If an artifact with the same `metadata.name` already exists, `apply` updates it. Otherwise, it creates a new artifact.

## Use Environment-Specific Values

Use `ENV_CLI_` placeholders for values that differ between environments, such as upstream URLs, hosts, model names, or project IDs.

```yaml
spec:
  upstream:
    url: ${ENV_CLI_UPSTREAM_URL}
```

Provide the values with an env file during apply.

=== "Template"
    ```shell
    ap ai-workspace apply \
      --env-file <env-file-path> \
      --project-id <project-id>
    ```

=== "Example"
    ```shell
    ap ai-workspace apply \
      --env-file ./values.env \
      --project-id customer-support-project
    ```

The CLI resolves placeholders from the file passed with `--env-file`, the project's `.env` file, or the process environment. Apply fails if a referenced placeholder has no value.

!!! warning "Do not store secrets in project files"
    `ENV_CLI_` placeholders are intended for environment-specific configuration values that are sent to AI Workspace. Do not use them for API keys, tokens, or other secrets. Use platform-managed secrets for sensitive values.

## Example Pipeline

The following example validates an App LLM proxy or MCP proxy project, applies the runtime artifact to the selected gateway, and applies the AI Workspace artifact to the selected workspace.

=== "Template"
    ```shell
    ap gateway use --display-name "<gateway-name>"
    ap ai-workspace use --display-name "<ai-workspace-name>"

    ap ai-workspace build -f <project-directory>

    ap gateway apply -f <project-directory>/runtime.yaml

    ap ai-workspace apply \
      -f <project-directory> \
      --project-id <project-id> \
      --env-file <env-file-path>
    ```

=== "Example"
    ```shell
    ap gateway use --display-name "dev-gw"
    ap ai-workspace use --display-name "dev-aiws"

    ap ai-workspace build -f /path/to/wso2-claude-proxy

    ap gateway apply -f /path/to/wso2-claude-proxy/runtime.yaml

    ap ai-workspace apply \
      -f /path/to/wso2-claude-proxy \
      --project-id customer-support-project \
      --env-file /path/to/wso2-claude-proxy/values.env
    ```

For an LLM provider project, omit `--project-id`.

=== "Template"
    ```shell
    ap ai-workspace apply \
      -f <project-directory> \
      --env-file <env-file-path>
    ```

=== "Example"
    ```shell
    ap ai-workspace apply \
      -f /path/to/openai-provider \
      --env-file /path/to/openai-provider/values.env
    ```

## Verify the Applied Artifact

Use the AI Workspace get or list commands to verify the result.

=== "Template"
    ```shell
    # List LLM providers
    ap ai-workspace llm-provider list

    # List App LLM proxies in a project
    ap ai-workspace app-llm-proxy list --project-id <project-id>

    # List MCP proxies in a project
    ap ai-workspace mcp-proxy list --project-id <project-id>
    ```

=== "Example"
    ```shell
    # List LLM providers
    ap ai-workspace llm-provider list

    # List App LLM proxies in a project
    ap ai-workspace app-llm-proxy list --project-id customer-support-project

    # List MCP proxies in a project
    ap ai-workspace mcp-proxy list --project-id customer-support-project
    ```

## AI Workspace CLI Commands

The following table summarizes the AI Workspace commands available in the `ap` CLI.

| Command | Description |
|---------|-------------|
| `ap ai-workspace add` | Add an AI Workspace connection to the CLI configuration. |
| `ap ai-workspace list` | List configured AI Workspace connections. |
| `ap ai-workspace remove` | Remove an AI Workspace connection from the CLI configuration. |
| `ap ai-workspace use` | Set the active AI Workspace connection. |
| `ap ai-workspace current` | Show the active AI Workspace connection. |
| `ap ai-workspace build` | Validate the AI Workspace artifact files in a project. |
| `ap ai-workspace apply` | Create or update an AI Workspace artifact from project files. |
| `ap ai-workspace llm-provider list` | List LLM providers in the active organization. |
| `ap ai-workspace llm-provider get` | Get a single LLM provider by ID, or list providers when no ID is provided. |
| `ap ai-workspace llm-provider delete` | Delete an LLM provider by ID. |
| `ap ai-workspace app-llm-proxy list` | List App LLM proxies in a project. |
| `ap ai-workspace app-llm-proxy get` | Get a single App LLM proxy by ID, or list proxies when no ID is provided. |
| `ap ai-workspace app-llm-proxy delete` | Delete an App LLM proxy by ID. |
| `ap ai-workspace mcp-proxy list` | List MCP proxies in a project. |
| `ap ai-workspace mcp-proxy get` | Get a single MCP proxy by ID, or list proxies when no ID is provided. |
| `ap ai-workspace mcp-proxy delete` | Delete an MCP proxy by ID. |

Use `--help` with any command to view the supported flags and examples. For example:

```shell
ap ai-workspace apply --help
ap ai-workspace app-llm-proxy list --help
```

## Recommended Practices

- Store the project files in source control.
- Review changes through pull requests before applying them to shared environments.
- Use pipeline variables for target workspace names, gateway names, project IDs, and environment-specific values.
- Keep `metadata.yaml`, `runtime.yaml`, and `definition.yaml` aligned to avoid build failures.
- Avoid changing the same artifact manually in the UI and through CI/CD at the same time.
- Avoid running another synchronization path that updates the same AI Workspace artifact while CI/CD owns it.

## Next Steps

- [AI Workspace CI/CD Overview](overview.md) - Learn how the Git-based flow works
- [Configure LLM Provider](../llm-providers/configure-provider.md) - Create and deploy providers from the UI
- [Manage App LLM Proxy](../llm-proxies/manage-proxy.md) - Manage an App LLM proxy after it is created