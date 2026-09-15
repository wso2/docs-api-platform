---
title: "Add or Update Policies in a Gateway"
description: "Add a Policy Hub or local policy to an API Platform Gateway, or update a policy to a different version, by editing build.yaml and rebuilding the image."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/policies/add-or-update-policies/
md_url: https://wso2.com/api-platform/docs/api-gateway/policies/add-or-update-policies.md
tags:
  - api-gateway
  - policies
  - cli
  - policy-hub
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-15
content_type: "how-to"
---

# Add or Update Policies in a Gateway

A gateway compiles its policies into the gateway image when the image is built. To add a policy, update a policy to a different version, or remove one, edit the `policies` list in the gateway's `build.yaml` file and rebuild the image with the API Platform CLI (`ap`). This works the same way for managed policies from the [Policy Hub](../../../policy-hub/overview.md) and for your own local policies.

!!! note
    Policies are part of the gateway image. A policy change takes effect after you rebuild the image and restart the gateway.

For the concepts behind policies and the list of available policies, see the [API Platform Policies overview](overview.md). To write your own policy, see [Writing a Custom Policy](custom-policies/writing-a-custom-policy.md).

## Prerequisites

- The API Platform CLI (`ap`), version 0.9.1 or later. Download the binary for your platform from the [`ap` CLI v0.9.1 release page](https://github.com/wso2/api-platform/releases/tag/ap%2Fv0.9.1), then add it to your `PATH`. For step-by-step installation instructions, see [Building the Gateway with Custom Policies](custom-policies/building-gateway-with-custom-policies.md). Confirm the version:

    ```bash
    ap version
    ```

    The output is similar to `ap version v0.9.1 (built at 2026-08-01T00:00:00Z)`.

- Docker, running on your machine. The CLI uses Docker to build the gateway image.
- A gateway project directory that contains a `build.yaml` file.

## How policies are declared in build.yaml

The `build.yaml` file lists every policy compiled into the gateway image. Each entry under `policies` has a `name` and exactly one source field that tells the build where to get the policy:

| Field | Policy type | Value |
|---|---|---|
| `gomodule` | Managed policy from the Policy Hub | Go module reference in the form `github.com/wso2/gateway-controllers/policies/<name>@<version>` |
| `filePath` | Local policy | Path to the policy directory, relative to `build.yaml` |

A `build.yaml` with one Policy Hub policy and one local policy looks like this:

```yaml
version: v1
gateway:
  version: 1.2.0
policies:
  - name: set-headers
    gomodule: github.com/wso2/gateway-controllers/policies/set-headers@v1
  - name: my-policy
    filePath: ./policies/my-policy
```

The `name` of a local policy must match the `name` in that policy's `policy-definition.yaml`. For the full `build.yaml` reference, including base-image overrides, see [Building the Gateway with Custom Policies](custom-policies/building-gateway-with-custom-policies.md).

### Policy versions

For a managed policy, the version qualifier in its `gomodule` reference controls which release the build includes. You can pin a policy to a major, minor, or exact version:

| Qualifier | Selects | Example |
|---|---|---|
| `@v1` | The most recent release in the `v1` major line | `github.com/wso2/gateway-controllers/policies/set-headers@v1` |
| `@v1.1` | The most recent patch release in the `v1.1` minor line | `github.com/wso2/gateway-controllers/policies/set-headers@v1.1` |
| `@v1.1.0` | Exactly version `v1.1.0` | `github.com/wso2/gateway-controllers/policies/set-headers@v1.1.0` |

!!! note
    A partial qualifier always resolves to the highest matching release. `@v1` selects the highest available `v1` release, `@v1.1` selects the highest available patch release in the `v1.1` line, and `@v1.1.0` pins exactly that version.

For a local policy, the version comes from the `version` field in its `policy-definition.yaml`.

Each build resolves every reference to a concrete version and records it in `build-manifest.yaml`.

## Add a policy

### Add a managed policy from the Policy Hub

1. Find the module reference of the policy you want to add. Each policy in the [Available Policies](overview.md#available-policies) list links to its documentation, which gives the module path.
2. Open the gateway's `build.yaml` file.
3. Add an entry under `policies` with the policy `name` and its `gomodule` reference. For example, to add the CORS policy:

    ```yaml
    policies:
      - name: cors
        gomodule: github.com/wso2/gateway-controllers/policies/cors@v1
    ```

    The `@v1` qualifier selects the most recent `v1` release. To pin a specific version, see [Policy versions](#policy-versions).

4. [Rebuild the gateway image](#rebuild-the-gateway-image).

### Add a local policy

1. Place the policy directory where the build can reach it by a path relative to `build.yaml`. The directory holds the policy implementation and a `policy-definition.yaml`. To write one, see [Writing a Custom Policy](custom-policies/writing-a-custom-policy.md).
2. Add an entry under `policies` with the policy `name` and a `filePath` that points to the directory:

    ```yaml
    policies:
      - name: my-policy
        filePath: ./policies/my-policy
    ```

    The `name` must match the `name` in the policy's `policy-definition.yaml`.

3. [Rebuild the gateway image](#rebuild-the-gateway-image).

## Update a policy

### Update a managed policy

To update a managed policy, change its version qualifier and rebuild. For example, to pin the `set-headers` policy to an exact version:

```yaml
policies:
  - name: set-headers
    gomodule: github.com/wso2/gateway-controllers/policies/set-headers@v1.1.0
```

For the major, minor, and exact qualifier forms, see [Policy versions](#policy-versions). When you reference a major or minor line, each rebuild picks up the most recent matching release; to hold a policy at a fixed version, reference the exact version. After the build, check the `build-manifest.yaml` file next to `build.yaml` to confirm the version included.

### Update a local policy

1. Update the policy's implementation, and set the new version in the `version` field of its `policy-definition.yaml`.
2. [Rebuild the gateway image](#rebuild-the-gateway-image).

## Remove a policy

To remove a policy, delete its entry from the `policies` list in `build.yaml`, then [rebuild the gateway image](#rebuild-the-gateway-image).

## Rebuild the gateway image

Run the following command from the directory that contains `build.yaml`:

```bash
ap gateway image build
```

The command:

- Builds a `gateway-runtime` image and a `gateway-controller` image that include the policies listed in `build.yaml`, and prints both image names.
- Names each image `<repository>/<name>-gateway-runtime:<version>`, where `<name>` defaults to the name of the directory that contains `build.yaml`.
- Writes a `build-manifest.yaml` file next to `build.yaml` that records the resolved policy versions.

To set a different image name, pass the `--name` flag:

```bash
ap gateway image build --name my-gateway
```

For the full list of build options and base-image configuration, see [Building the Gateway with Custom Policies](custom-policies/building-gateway-with-custom-policies.md).

## Apply the change

1. If this is the first time you build the gateway image, update the `image` field of the `gateway-controller` and `gateway-runtime` services in your `docker-compose.yaml` to the names from the build output. For example, for a gateway built with `--name my-gateway`, change the base images:

    ```yaml
    services:
      gateway-controller:
        image: ghcr.io/wso2/api-platform/gateway-controller:1.2.0
      gateway-runtime:
        image: ghcr.io/wso2/api-platform/gateway-runtime:1.2.0
    ```

    to the built images:

    ```yaml
    services:
      gateway-controller:
        image: ghcr.io/wso2/api-platform/my-gateway-gateway-controller:1.2.0
      gateway-runtime:
        image: ghcr.io/wso2/api-platform/my-gateway-gateway-runtime:1.2.0
    ```

    On later updates that keep the same name and version, the image names do not change, so you can leave `docker-compose.yaml` as it is. For the full steps, see [Building the Gateway with Custom Policies](custom-policies/building-gateway-with-custom-policies.md).
2. Recreate the gateway containers so they use the rebuilt images:

    ```bash
    docker compose up -d --force-recreate
    ```

To attach an added or updated policy to an API, add it to the API definition. For an example, see [Building the Gateway with Custom Policies](custom-policies/building-gateway-with-custom-policies.md).

## What's next

- [API Platform Policies overview](overview.md): Concepts and the list of available policies.
- [Policy execution order](policy-execution-order.md): How chained policies run on a request and response.
- [Writing a Custom Policy](custom-policies/writing-a-custom-policy.md): Build your own policy in Go.
- [Building the Gateway with Custom Policies](custom-policies/building-gateway-with-custom-policies.md): The full gateway image build workflow.
