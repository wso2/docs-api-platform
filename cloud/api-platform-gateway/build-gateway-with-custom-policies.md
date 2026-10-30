---
title: "Build the Self-Hosted Gateway with custom policies"
description: "Install the AP CLI, configure build.yaml, and build a custom Self-Hosted Gateway image that includes your custom policies."
canonical_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/build-gateway-with-custom-policies/
md_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/build-gateway-with-custom-policies.md
tags:
  - cloud
  - api-gateway
  - self-hosted
  - custom-policy
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Building the Gateway with Custom Policies

## Install the AP CLI Tool

The `ap` CLI tool is used to build a custom gateway image with your own policies. Download the binary for your platform from the [AP CLI releases page](https://github.com/wso2/api-platform/releases/tag/ap%2Fv0.7.0) and follow the steps below to install it.

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

## Configure the Build File

The `build.yaml` file is already included in the unzipped gateway package. It declares the gateway version and the list of policies to include. Edit this file to add your custom policies before building the gateway image.

!!! tip "Sample Custom Policies"
    WSO2 provides a set of sample custom policies to help you get started. You can find them in the [api-platform sample policies repository](https://github.com/wso2/api-platform/tree/main/gateway/sample-policies).

### Structure

```yaml
version: v1
gateway:
  version: 1.0.0
policies:
  - name: <policy-name>
    gomodule: <go-module-path>@<version>   # for policy hub managed policies
  - name: <custom-policy-name>
    filePath: <relative-path-to-policy-dir> # for custom policies
```

Each policy entry uses one of two source types:

| Field | Description |
|---|---|
| `gomodule` | Go module reference for policy hub managed policies (e.g., `github.com/wso2/gateway-controllers/policies/cors@v1`) |
| `filePath` | Relative path from `build.yaml` to a local custom policy directory |

### Adding a Custom Policy

Your custom policy can reside anywhere on the filesystem. Use a relative path from the `build.yaml` file to point to it.

For example, if your directory layout is:

```text
my-gateway/
├── build.yaml
└── ../my-custom-policy/   # policy lives outside the gateway directory
    ├── policy-definition.yaml
    └── mypolicy.go
```

Add the policy to `build.yaml` using a relative `filePath`:

```yaml
policies:
  - name: my-custom-policy
    filePath: ../my-custom-policy
```

!!! note
    The path in `filePath` is always relative to the location of `build.yaml`, not the directory from which you run the `ap` command.

## Build the Gateway Image

Once `build.yaml` is ready, run the following command from the directory containing `build.yaml` to build the custom gateway image:

```bash
ap gateway image build
```

This packages the gateway runtime together with all listed policies into a container image that can be used in place of the standard gateway image.

Once the build completes, the output lists the two image names produced. For example:

```text
✓ Built gateway images with 1 policies:
  • ghcr.io/wso2/api-platform/gateway-v1.0.0-gateway-runtime:1.0.0
  • ghcr.io/wso2/api-platform/gateway-v1.0.0-gateway-controller:1.0.0
```

A `build-manifest.yaml` file is also written alongside `build.yaml`, recording the resolved versions of all policies included in the build.

## Update the Docker Compose File

After building, update the `image:` fields in your `docker-compose.yaml` to use the newly built images.

Locate the `gateway-controller` and `gateway-runtime` services and replace their `image:` values with the images from the build output:

```yaml
services:
  gateway-controller:
    image: ghcr.io/wso2/api-platform/gateway-v1.0.0-gateway-controller:1.0.0  # (1)

  gateway-runtime:
    image: ghcr.io/wso2/api-platform/gateway-v1.0.0-gateway-runtime:1.0.0     # (2)
```

1. Replace with the `gateway-controller` image name from your build output.
2. Replace with the `gateway-runtime` image name from your build output.

Once updated, start the gateway as usual:

```bash
docker compose --env-file configs/keys.env up
```

## What's Next?

- [Apply Custom Policies to APIs](apply-custom-policies-to-apis.md): Sync your custom policy to the organization and apply it to APIs