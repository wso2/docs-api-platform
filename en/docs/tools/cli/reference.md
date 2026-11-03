---
title: "API Platform CLI reference"
description: "Command reference for the ap CLI: gateway management, API and MCP operations, and custom gateway image builds."
canonical_url: https://wso2.com/api-platform/docs/tools/cli/reference/
md_url: https://wso2.com/api-platform/docs/tools/cli/reference.md
tags:
  - tools
  - cli
  - reference
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-03
content_type: "reference"
---

# WSO2 API Platform CLI (AP)

`ap` is a command-line tool for managing and interacting with the WSO2 API Platform.

## Supported Short Flags

| Flag             | Short Flag |
|------------------|------------|
| `--display-name` | `-n`       |
| `--server`       | `-s`       |
| `--output`       | `-o`       |
| `--file`         | `-f`       |
| `--version`      | `-v`       |

## Gateway Sub Commands

> **Note:** Each command supports the `--help` flag for detailed usage information.

## Prerequisites for Gateway Controller Commands

- You must first add and/or select a gateway in the CLI using the appropriate gateway-related commands.
- Credentials for a gateway can come from either the gateway configuration (when you add the gateway) or from environment variables. **Environment variables take precedence** over configuration and will override credentials stored in the config when present.
- Depending on the gateway's authentication type:
  - **none**: No authentication required
  - **basic**: Provide credentials via config or export `WSO2AP_GW_USERNAME=<username>` and `WSO2AP_GW_PASSWORD=<password>` (env vars override config)
  - **bearer**: Provide a token via config or export `WSO2AP_GW_TOKEN=<token>` (env var overrides config)

---

### 1. Add a Gateway

#### CLI Command

```shell
ap gateway add --display-name <name> --server <server> [--auth <none|basic|bearer>]
```

#### Sample Commands

```shell
# Add a gateway with no authentication (default)
ap gateway add --display-name dev --server http://localhost:9090

# Add a gateway with basic authentication
ap gateway add --display-name dev --server http://localhost:9090 --auth basic

# Add a gateway with bearer token authentication
ap gateway add --display-name prod --server https://api.example.com --auth bearer
```

#### Authentication Setup

For **basic** authentication, export these environment variables (replace the placeholders with your values):
```shell
export WSO2AP_GW_USERNAME=<username>
export WSO2AP_GW_PASSWORD=<password>
```

For **bearer** authentication, export this environment variable (replace `<token>` with your token):
```shell
export WSO2AP_GW_TOKEN=<token>
```

**Note:** Environment variables override credentials stored in the gateway configuration.

---

### 2. List Gateways

#### CLI Command

```shell
ap gateway list
```

#### Sample Command

```shell
ap gateway list
```

---

### 3. Remove a Gateway

#### CLI Command

```shell
ap gateway remove --display-name <name>
```

#### Sample Command

```shell
ap gateway remove --display-name dev
```

---

### 4. Change the Gateway

#### CLI Command

```shell
ap gateway use --display-name <name>
```

#### Sample Command

```shell
ap gateway use --display-name dev
```

---

### 5. Check the current Gateway

#### CLI Command

```shell
ap gateway current
```

#### Sample Command

```shell
ap gateway current
```

---

### 6. Returns the health status of the Gateway

#### CLI Command

```shell
ap gateway health
```

#### Sample Command

```shell
ap gateway health
```

---

### 7. Apply a Resource

#### CLI Command

```shell
ap gateway apply --file <path>
```

#### Sample Command

```shell
ap gateway apply --file petstore-api.yaml
```

---

### 8. List all APIs

#### CLI Command

```shell
ap gateway api list
```

#### Sample Command

```shell
ap gateway api list
```

---

### 9. Get a specific API by name and version or id

#### CLI Command

```shell
ap gateway api get --display-name <name> --version <version> --format <json|yaml>
ap gateway api get --id <id> --format <json|yaml>
```

#### Sample Command

```shell
ap gateway api get --display-name "PetStore API" --version v1.0 --format yaml
ap gateway api get --id sample-1 --format yaml
```

---

### 10. Delete an API 

#### CLI Command

```shell
ap gateway api delete --id <id> 
```

#### Sample Command

```shell
ap gateway api delete --id <id>
```

---

### 11. Build a gateway

#### CLI Command

```shell
ap gateway image build \
  [--name <gateway-name>] \
  [--path <gateway-project-dir>] \
  [--repository <image-repository>] \
  [--push] \
  [--no-cache] \
  [--platform <platform>] \
  [--output-dir <output-dir>]
```

#### Sample Command

```shell
ap gateway image build
```

#### Flags

The command reads the gateway version, the base images, and the policies from `build.yaml`. The following flags control the rest of the build.

| Flag | Default | Description |
|------|---------|-------------|
| `--name` | Name of the directory that contains `build.yaml` | Gateway name, used in the image names. |
| `--path`, `-p` | Current directory | Directory that contains `build.yaml`. |
| `--repository` | `ghcr.io/wso2/api-platform` | Repository for the built images. Set it to a repository you can push to when you use `--push` or `--platform`. |
| `--push` | `false` | Pushes the images to the repository after the build. |
| `--no-cache` | `false` | Builds the images without the Docker build cache. |
| `--platform` | None | Builds the images for this platform with `docker buildx`, and always pushes them. See [Target architecture](#target-architecture). |
| `--output-dir` | None | Copies the gateway builder output, including the compiled Policy Engine binary, to this directory. |

The command builds two images. Their names combine the `--repository` and `--name` values with `gateway.version` from `build.yaml`:

- `<repository>/<name>-gateway-runtime:<version>`
- `<repository>/<name>-gateway-controller:<version>`

#### Target architecture { #target-architecture }

The command builds the images in two stages:

1. It runs the gateway builder image as a container. The gateway builder compiles the Policy Engine binary with the policies in `build.yaml`, for the architecture that the container runs on.
2. It builds the gateway runtime and gateway controller images from the gateway builder output.

The `--platform` flag applies only to the second stage. Docker runs the gateway builder for the build machine's architecture, unless the `DOCKER_DEFAULT_PLATFORM` environment variable sets another platform. The Policy Engine binary is the only architecture-specific part of the build output. If its architecture doesn't match the image platform, the gateway runtime fails to start with an `Exec format error`.

The gateway builder, gateway runtime, and gateway controller images support the `linux/amd64` and `linux/arm64` platforms.

##### Build for the build machine's architecture

Run the command without `--platform` and without `DOCKER_DEFAULT_PLATFORM`. The images match the build machine's architecture, and they're available in the local Docker image store. If you add `--push`, the command pushes the images after the build.

On an AMD64 (x86-64) build agent in a CI/CD pipeline, this builds `linux/amd64` images. To check the agent's architecture, run `uname -m` on it. The command prints `x86_64` on AMD64 and `aarch64` on ARM64.

##### Build for another architecture

To build for an architecture other than the build machine's, set `DOCKER_DEFAULT_PLATFORM` to the target platform. For example, to build `linux/amd64` images on an Apple silicon Mac, run the following command:

```shell
DOCKER_DEFAULT_PLATFORM=linux/amd64 ap gateway image build \
  --repository <image-repository> \
  --push
```

Docker then runs the gateway builder and builds the images for the target platform, using emulation. The build takes longer than a build for the build machine's architecture. Docker Desktop includes emulation. On Linux, install QEMU as described in [Docker multi-platform builds](https://docs.docker.com/build/building/multi-platform/).

If a CI/CD pipeline can run on build agents of different architectures, set `DOCKER_DEFAULT_PLATFORM` on the build step. On an agent that already matches the target platform, the variable has no effect.

##### Build with the `--platform` flag

The `--platform` flag doesn't change the architecture of the Policy Engine binary. If the platform differs from the build machine's architecture, also set `DOCKER_DEFAULT_PLATFORM` to the same value. When you set `--platform`:

- The command requires `docker buildx`.
- The command always pushes the images to the repository, even without `--push`. The images aren't available in the local Docker image store.
- Log in to the registry with `docker login` before you run the command, and set `--repository` to a repository you can push to.
- Specify one platform per run. The gateway builder compiles one Policy Engine binary, so a list such as `linux/amd64,linux/arm64` produces at least one image that fails to start. To build for both platforms, run the command once per platform, with a different `--name` each time.

##### Check the Policy Engine binary's architecture

To check which architecture the gateway builder compiled the Policy Engine binary for, follow these steps:

1. Add `--output-dir <output-dir>` to the build command.
2. After the build, run the following command:

    ```shell
    file <output-dir>/gateway-runtime/policy-engine
    ```

For `linux/amd64`, the output includes `x86-64`. For `linux/arm64`, the output includes `ARM aarch64`.

#### Additional Note for Users

For the `build.yaml` format and the policy types, see [Customizing the gateway by adding and removing policies](customizing-gateway-policies.md).

### 12. List all MCPs

#### CLI Command

```shell
ap gateway mcp list
```

#### Sample Command

```shell
ap gateway mcp list
```

---

### 13. Retrieves a specific MCP 

#### CLI Command

```shell
ap gateway mcp get --display-name <name> --version <version> --format <json|yaml>
ap gateway mcp get --id <id> --format <json|yaml>
```

#### Sample Command

```shell
ap gateway mcp get --display-name my-mcp --version 1.0.0 --format json
ap gateway mcp get --id sample-id --format json
```

---

### 14. Permanently deletes a MCP

#### CLI Command

```shell
ap gateway mcp delete --id <id> 
```

#### Sample Command

```shell
ap gateway mcp delete --id sample-id
```

---

### 15. Generate MCP 

#### CLI Command

```shell
ap gateway mcp generate --server <server> --output <path>
```

#### Sample Command

```shell
ap gateway mcp generate --server http://localhost:3001/mcp --output target
```
