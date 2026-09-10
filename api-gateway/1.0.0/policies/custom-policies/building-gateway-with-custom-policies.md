---
title: "Build a Gateway Image with Custom Policies"
description: "Use API Platform CLI to bundle custom policies into an API Platform Gateway Docker image for deployment."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/policies/custom-policies/building-gateway-with-custom-policies/
md_url: https://wso2.com/api-platform/docs/api-gateway/policies/custom-policies/building-gateway-with-custom-policies.md
tags:
  - api-gateway
  - policies
  - custom-policies
  - cli
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-24
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

### Overriding the Base Images

`ap gateway image build` resolves three images during a build: the **builder** image that performs the build, and the **controller** and **runtime** base images that the produced images extend. By default, all three are pulled from the public WSO2 GitHub Container Registry (GHCR) at the version declared in `gateway.version`.

You can override any of them independently by adding an `images` block under `gateway`. This is optional for standard builds that use the public images, but **required for WSO2 subscription users**, who must point these images at the WSO2 private registry (see below). It is also useful for air-gapped environments and internal registry mirrors.

| Key | Used as | Default (when not set) |
|---|---|---|
| `builder` | image run to perform the build | `ghcr.io/wso2/api-platform/gateway-builder:<version>` |
| `controller` | base image extended by the built controller | `ghcr.io/wso2/api-platform/gateway-controller:<version>` |
| `runtime` | base image extended by the built runtime | `ghcr.io/wso2/api-platform/gateway-runtime:<version>` |

```yaml
version: v1
gateway:
  version: 1.0.0
  images:   # optional — if omitted, the public GHCR images above are used
    builder: ghcr.io/wso2/api-platform/gateway-builder:1.0.0
    controller: ghcr.io/wso2/api-platform/gateway-controller:1.0.0
    runtime: ghcr.io/wso2/api-platform/gateway-runtime:1.0.0
policies:
  - name: set-headers
    gomodule: github.com/wso2/gateway-controllers/policies/set-headers@v1
```

Each key is resolved independently, so you can override only the ones you need; any key left out falls back to its default public GHCR image. The resolved images are printed at the start of the build under **Resolved images**, so you can confirm which ones were used.

!!! note "WSO2 Subscription Users"
    If you have a WSO2 subscription, use image tags that include the **U2 update version (4th digit)**, for example `1.1.0.0`, instead of the base release `1.1.0`. The 4th digit represents **patch-level (U2) updates**, which include the latest fixes and security updates delivered through the WSO2 private registry (`registry.wso2.com`).

    Because these images are not published to the public GHCR registry, set **all three** keys explicitly to the `registry.wso2.com/wso2-api-platform/` path:

    ```yaml
    version: v1
    gateway:
      version: "1.1.0.0"
      images:
        builder: registry.wso2.com/wso2-api-platform/gateway-builder:1.1.0.0
        controller: registry.wso2.com/wso2-api-platform/gateway-controller:1.1.0.0
        runtime: registry.wso2.com/wso2-api-platform/gateway-runtime:1.1.0.0
    policies:
      - name: set-headers
        gomodule: github.com/wso2/gateway-controllers/policies/set-headers@v1
    ```

    The `ap` CLI uses your local Docker installation to pull and build images, so authenticate to the private registry first:

    ```bash
    docker login registry.wso2.com   # use your WSO2 email and access token
    ```

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
docker compose up -d
```

## Deploy the API

```sh
curl -X POST http://localhost:9090/api/management/v0.9/rest-apis \
  -u admin:admin \
  -H "Content-Type: application/yaml" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1alpha1
kind: RestApi
metadata:
  name: reading-list-api-v1.0
spec:
  displayName: Reading-List-API
  version: v1.0
  context: /reading-list/$version
  upstream:
    main:
      url: https://apis.bijira.dev/samples/reading-list-api-service/v1.0
  policies:
    - name: set-headers
      version: v1
      params:
        request:
          headers:
            - name: x-wso2-apip-gateway-version
              value: v1.0.0
        response:
          headers:
            - name: x-environment
              value: development
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
EOF
```