---
title: "Build the AI Gateway with custom AI policies"
description: "Install the AP CLI, configure build.yaml, and build a custom AI Gateway image that includes your custom AI policies."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/policies/build-gateway-with-ai-policies/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/policies/build-gateway-with-ai-policies.md
tags:
  - cloud
  - ai-workspace
  - custom-policy
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "how-to"
---

# Build the gateway with AI policies

After [writing a custom AI policy](writing-an-ai-policy.md), build it into the AI Gateway image so it can run alongside the built-in guardrails and rate-limiting policies.

## Install the ap CLI

The `ap` CLI builds a custom gateway image that carries your own policies. It's the same `ap` CLI that [AI Workspace CI/CD](../ci-cd/overview.md) uses for commands such as `ap gateway apply` and `ap ai-workspace build`. If you already have it installed for that workflow, skip ahead to [Configure the build file](#configure-the-build-file). Otherwise, download the binary for your platform from the [AP CLI releases page](https://github.com/wso2/api-platform/releases/tag/ap%2Fv0.7.0) and follow the steps below to install it.

=== "macOS / Linux"

    **Step 1: Extract the binary**

    After downloading the zip file for your platform, extract it:

    ```bash
    unzip ap-darwin-amd64-v0.7.0.zip   # replace with your downloaded filename
    ```

    **Step 2: Move the binary to a bin directory**

    ```bash
    mkdir -p ~/bin
    mv ap ~/bin/
    ```

    **Step 3: Add to PATH**

    Add the following line to your `~/.zshrc` or `~/.bashrc`:

    ```bash
    export PATH="$HOME/bin:$PATH"
    ```

    **Step 4: Reload your shell**

    ```bash
    source ~/.zshrc   # or source ~/.bashrc
    ```

    **Step 5: Verify the installation**

    ```bash
    ap --version
    ```

=== "Windows"

    **Step 1: Extract the binary**

    After downloading the zip file, right-click it and select **Extract All**, or run in PowerShell:

    ```powershell
    Expand-Archive -Path ap-windows-amd64.zip -DestinationPath ap-windows-amd64
    ```

    **Step 2: Move the binary to a bin directory**

    ```powershell
    New-Item -ItemType Directory -Force -Path "$HOME\bin"
    Move-Item ap-windows-amd64\ap.exe "$HOME\bin\ap.exe"
    ```

    **Step 3: Add to PATH**

    Run the following in PowerShell to permanently add `~/bin` to your user PATH:

    ```powershell
    [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$HOME\bin", "User")
    ```

    **Step 4: Reload your shell**

    Close and reopen PowerShell for the PATH change to take effect.

    **Step 5: Verify the installation**

    ```powershell
    ap --version
    ```

## Configure the build file

The `build.yaml` file is included in the AI Gateway package you downloaded when [setting up the AI Gateway](../ai-gateways/setting-up.md). It declares the gateway version and the list of policies to include. Edit this file to add your custom AI policies before building the gateway image.

!!! tip "Sample custom policies"
    WSO2 provides sample custom policies, including AI-specific examples, in the [api-platform sample policies repository](https://github.com/wso2/api-platform/tree/main/gateway/sample-policies).

### Structure

```yaml
version: v1
gateway:
  version: 1.2.0-beta
policies:
  - name: <policy-name>
    gomodule: <go-module-path>@<version>   # for policy hub managed policies
  - name: <custom-ai-policy-name>
    filePath: <relative-path-to-policy-dir> # for custom AI policies
```

Each policy entry uses one of two source types:

| Field | Description |
|---|---|
| `gomodule` | The Go module reference for a Policy Hub managed policy, for example `github.com/wso2/gateway-controllers/policies/pii-masking@v1` |
| `filePath` | The path from `build.yaml` to a local custom AI policy directory |

### Add a custom AI policy

Your custom AI policy can reside anywhere on the filesystem. Use a relative path from the `build.yaml` file to point to it.

For example, if your directory layout is:

```text
my-ai-gateway/
├── build.yaml
└── ../my-ai-policy/   # policy lives outside the gateway directory
    ├── policy-definition.yaml
    └── myaipolicy.go
```

Add the policy to `build.yaml` using a relative `filePath`:

```yaml
policies:
  - name: my-ai-policy
    filePath: ../my-ai-policy
```

!!! note
    The path in `filePath` is always relative to the location of `build.yaml`, not the directory from which you run the `ap` command.

## Build the gateway image

Once `build.yaml` is ready, run the following command from the directory containing `build.yaml` to build the custom gateway image:

```bash
ap gateway image build
```

This packages the gateway runtime together with every listed policy, built-in and custom, into a container image you use in place of the standard AI Gateway image.

Once the build completes, the output lists the two image names produced. For example:

```text
✓ Built gateway images with 1 policies:
  • ghcr.io/wso2/api-platform/wso2apip-ai-gateway-1.2.0-beta-gateway-runtime:1.2.0-beta
  • ghcr.io/wso2/api-platform/wso2apip-ai-gateway-1.2.0-beta-gateway-controller:1.2.0-beta
```

A `build-manifest.yaml` file is also written alongside `build.yaml`, recording the resolved versions of all policies included in the build.

## Update the Docker Compose file

After building, update the `image:` fields in your `docker-compose.yaml` to use the newly built images.

Locate the `gateway-controller` and `gateway-runtime` services and replace their `image:` values with the images from the build output:

```yaml
services:
  gateway-controller:
    image: ghcr.io/wso2/api-platform/wso2apip-ai-gateway-1.2.0-beta-gateway-controller:1.2.0-beta  # (1)

  gateway-runtime:
    image: ghcr.io/wso2/api-platform/wso2apip-ai-gateway-1.2.0-beta-gateway-runtime:1.2.0-beta     # (2)
```

1. Replace with the `gateway-controller` image name from your build output.
2. Replace with the `gateway-runtime` image name from your build output.

Once updated, start the gateway as usual. `api-platform.env` continues to be loaded automatically via the Compose `env_file:` directive:

```bash
docker compose up
```

## Next steps

- [Apply AI policies to proxies](apply-ai-policies-to-proxies.md): sync your custom AI policy to the organization and apply it to LLM providers, App LLM proxies, and MCP proxies