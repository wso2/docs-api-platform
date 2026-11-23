---
title: "Adding Custom Policies"
pagination_label: "Add Custom Policies to a Self-Hosted Gateway"
description: "Build a Self-Hosted Gateway with your own policies, sync them to your organization, and attach them to API proxies from the API Control Plane."
---

The [Policy Hub](../../policy-hub/overview.md) covers common needs such as authentication, rate limiting, and header changes. When an API needs logic of your own, such as a signature that a legacy backend expects, you can write a custom policy and build it into your Self-Hosted Gateway. You then attach it to API proxies in the API Control Plane Console, like any other policy.

A custom policy runs only on the gateways that you build with it.

## How It Works

![Custom policy flow: the policy code and build.yaml are built into custom gateway images, the Self-Hosted Gateway runs them and reports its installed policies to the control plane, the policy is synced from the gateway's Policies tab to the organization's custom policies, attached to an API proxy, and the API is deployed back to the gateway](/img/cloud/self-hosted-gateway/custom-policies/self-hosted-custom-policies-flow.png)

1. **Write the policy**, and add it to the gateway's `build.yaml`.

2. **Build new gateway images** that include the policy, with the `ap` CLI.

3. **Run your gateway from the new images.** Each time the gateway connects to the API Control Plane, it reports the policies it has, and marks yours as custom.

4. **Sync the policy** from the gateway's **Policies** tab in the console. The policy becomes one of your organization's custom policies, which any API proxy in the organization can use.

5. **Attach the policy** to an API proxy.

6. **Deploy the API** to the gateway. The gateway runs the policy code that you built into it.

The steps below follow this flow with the **Transform Payload Case** sample policy, which converts the request body to uppercase or lowercase.

## Prerequisites

- A Self-Hosted Gateway that runs **API-Gateway v1.2** and shows **Active** in the console. If you don't have one, see [Setting Up a Self-Hosted Gateway](./setting-up.md).
- The gateway folder, `wso2apip-api-gateway-1.2.0`, which holds the `build.yaml` file used below. If you installed the gateway with Helm, download and extract it as in [Step 1: Download](./setting-up.md#step-1-download).
- Docker and the `ap` CLI on the machine where you build the images. Download the CLI for your platform from the [`ap` CLI v0.9.1 release](https://github.com/wso2/api-platform/releases/tag/ap%2Fv0.9.1), extract it, and add the `ap` binary to your `PATH`. Run `ap version` to check it.

## Step 1: Write the Policy

A custom policy is a folder with two parts:

- the policy code, written in Go with the gateway's policy SDK, or in Python;
- a `policy-definition.yaml` file, which describes the policy and its parameters.

To write your own policy, see the [Policy Development Guide](https://choreolabs.com/api-management/policy-hub/policy-development-guide). To follow this guide with the sample, download it into a `policies` folder inside the gateway folder.

```bash
cd wso2apip-api-gateway-1.2.0
mkdir -p policies/transform-payload-case && cd policies/transform-payload-case
for f in go.mod go.sum policy-definition.yaml transformpayloadcase.go; do
  curl -sLO "https://raw.githubusercontent.com/wso2/api-platform/refs/tags/gateway/v1.2.0/gateway/sample-policies/transform-payload-case/$f"
done
cd ../..
```

The gateway folder now looks like this.

```text
wso2apip-api-gateway-1.2.0/
├── build.yaml
└── policies/
    └── transform-payload-case/
        ├── go.mod
        ├── go.sum
        ├── policy-definition.yaml
        └── transformpayloadcase.go
```

The console shows the policy with the details in `policy-definition.yaml`. Without its comments, the sample's file looks like this.

```yaml title="policy-definition.yaml"
name: transform-payload-case
version: v1.0.0
displayName: Transform Payload Case
description: |
  Transforms the request body text to the specified case (uppercase or lowercase).
parameters:
  type: object
  properties:
    targetCase:
      type: string
      description: The target case transformation to apply to the request body.
      default: uppercase
      enum:
        - uppercase
        - lowercase
  required: []
systemParameters:
  type: object
  properties: {}
```

| Field | How the console uses it |
|---|---|
| `name` | Identifies the policy in your organization. Use lowercase kebab-case, at most 255 characters. |
| `version` | The policy version, in the form `vMAJOR.MINOR.PATCH`, at most 30 characters. Sync accepts only this form. See [Update a Custom Policy](#update-a-custom-policy). |
| `displayName` | The name shown in the **Available policies** pane, at most 255 characters. |
| `description` | Shown on the gateway's **Policies** tab and in the **Available policies** pane, at most 1023 characters. |
| `parameters` | A JSON Schema. The console builds the policy's configuration form from it, and the gateway validates the values against it. |

## Step 2: Build Gateway Images with the Policy

A gateway image contains a fixed set of policies: the ones listed in `build.yaml`. The `build.yaml` in the gateway folder already lists the Policy Hub policies of the standard images. Open it and add your policy at the end of the `policies` list.

```yaml title="build.yaml"
version: v1
gateway:
  version: 1.2.0
policies:
  # ...the Policy Hub policies already listed...
  - name: transform-payload-case
    filePath: ./policies/transform-payload-case
```

:::warning
Add your policy to the list; don't replace the list. The new images contain only the policies in `build.yaml`. If you remove an entry, such as `cors`, every API that uses that policy fails to deploy to this gateway.
:::

`filePath` is the policy folder, relative to `build.yaml`. To build a policy from your own Go module repository instead, use `gomodule`, for example `gomodule: github.com/acme/gateway-policies/transform-payload-case@v1`. The gateway treats `filePath` entries, and `gomodule` entries outside `github.com/wso2`, as custom policies.

From the gateway folder, build the images.

```bash
ap gateway image build --name acme-gateway --repository registry.example.com/acme
```

Replace `acme-gateway` with a name for your images, and `registry.example.com/acme` with your container registry.

| Option | Description |
|---|---|
| `--name` | The name of the images. Without it, the CLI uses the name of the current folder. |
| `--repository` | The image repository. Without it, the CLI uses `ghcr.io/wso2/api-platform`. |
| `--push` | Pushes the images to the repository after the build. You need it when the gateway runs on another host or on Kubernetes. If you run the gateway with Docker Compose on the machine where you build, leave it out: the images stay in your local Docker. |

When the build finishes, it lists the two images it built.

```text
✓ Built gateway images with 55 policies:
  • registry.example.com/acme/acme-gateway-gateway-runtime:1.2.0
  • registry.example.com/acme/acme-gateway-gateway-controller:1.2.0
```

The build also writes `build-manifest.yaml` next to `build.yaml`, with the exact version of each policy. The controller image carries a copy, which is how the gateway knows which of its policies are custom.

To build policies from private Go module repositories, see the credential options in `ap gateway image build --help`.

## Step 3: Run the Gateway from the New Images

Point the gateway at both new images. The controller holds the policy definitions that it reports to the console, and the runtime runs the policy code.

### Docker Compose

Add the new images to `docker-compose.override.yaml` in the gateway folder. Create the file if it doesn't exist. If it already exists, for example from [Production Hardening](./setting-up.md#production-hardening), add the `image` lines to the services in it.

```yaml title="docker-compose.override.yaml"
services:
  gateway-controller:
    image: registry.example.com/acme/acme-gateway-gateway-controller:1.2.0
  gateway-runtime:
    image: registry.example.com/acme/acme-gateway-gateway-runtime:1.2.0
```

Then recreate the containers.

```bash
docker compose up -d --force-recreate
```

### Kubernetes (Helm)

Build with `--push`, so that the cluster can pull the images. Then set the images in a `values.yaml` file.

```yaml title="values.yaml"
gateway:
  controller:
    image:
      repository: registry.example.com/acme/acme-gateway-gateway-controller
      tag: "1.2.0"
  gatewayRuntime:
    image:
      repository: registry.example.com/acme/acme-gateway-gateway-runtime
      tag: "1.2.0"
```

If the registry needs credentials, also list the pull secret under `imagePullSecrets`. Then upgrade the release. Use your release name and namespace. `--reuse-values` keeps the settings from your installation, such as the control-plane host and the token secret.

```bash
helm upgrade development-local-self-hosted-gateway \
  oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version 1.2.0 \
  --namespace api-gateway --reuse-values -f values.yaml
```

### Verify

Check that the controller reported its policies to the API Control Plane.

```bash
docker compose logs gateway-controller | grep "gateway manifest"
```

You should see `Successfully pushed gateway manifest to control plane`. On Kubernetes, read the controller Deployment's logs with `kubectl logs` instead. Then reload the **API Gateways** page and check that the gateway is still **Active**.

## Step 4: Sync the Policy to Your Organization

The console now lists the gateway's policies, but APIs can't use a custom policy until you sync it. A sync copies the policy's name, version, description, and parameters to your organization.

1. In the API Control Plane Console, go to **API Gateways**.

2. On the **Self-hosted API gateways** tab, click your gateway.

3. Click the **Policies** tab. It lists every policy the gateway reported when it last connected, with its **Name**, **Version**, **Description**, **Policy Type** (**Policy Hub** or **Custom**), and **Sync status**.

    ![Policies tab of a Self-Hosted Gateway filtered to Custom, showing one custom policy with the status Synced and another with a Sync button](/img/cloud/self-hosted-gateway/custom-policies/self-hosted-custom-policies-1.png)

4. Find your policy. You can type its name in **Search policies**, or click **Custom** to show only custom policies.

5. Click **Sync**.

The console confirms with **Synced transform-payload-case v1.0.0 to the organization.**, and the sync status changes to **Synced**. Any API proxy in your organization can now use the policy.

The **Sync status** column shows one of the following.

| Sync status | Meaning |
|---|---|
| **Built-in** | A Policy Hub policy. APIs can use it without a sync. |
| **Sync** | A custom policy that your organization doesn't have yet, or whose newer minor version this gateway runs. When a sync would replace the version your organization has, **Replaces vX.Y.Z** appears under the button. |
| **Synced** | Your organization has this version, or a later minor version of the same major version. When the two versions differ, **Organization version: vX.Y.Z** appears under it. |

:::note
The **Policies** tab shows what the gateway reported when it last connected. After you restart the gateway with new images, reload the page. If **Sync** is disabled, your role doesn't allow you to sync policies. Ask an administrator of your organization.
:::

## Step 5: Attach the Policy to an API

Attach the policy the same way as a Policy Hub policy. For details, see [Adding and Managing Policies](./manage-policies.md).

1. In the header, select the project from the **Projects** list and the API from the **APIs** list.

2. In the left navigation menu, click **Develop**, then click **Policies**.

3. In the **Available policies** pane, find your policy. Custom policies are listed first and marked **Custom**, with their display name and version.

    :::tip
    Custom policies have no category, so they are hidden while a category is selected. Select **All** to see them.
    :::

4. Drag the policy to **Global policies**, or to a resource.

    ![Policies page of an API with a custom policy attached under Global policies, and the Available policies pane listing the custom policy first, marked Custom](/img/cloud/self-hosted-gateway/custom-policies/self-hosted-custom-policies-2.png)

5. Configure the parameters, for example the target case, and click **Add**.

6. Click **Save**.

## Step 6: Deploy the API to the Gateway

Deploy the API to the Self-Hosted Gateway that you built with the policy. For the steps, see [Deploy the API to the Self-Hosted Gateway](./deploy-and-test-api.md#step-2-deploy-the-api-to-the-self-hosted-gateway).

A gateway that doesn't have the policy refuses the deployment, and the deployment shows **Failed**. This includes managed gateways, and Self-Hosted Gateways that run the standard images. Deploy APIs that use a custom policy only to gateways that you built with it.

## Update a Custom Policy

To release a change, increase `version` in `policy-definition.yaml`, rebuild the images, and restart the gateways that use the policy. Whether you also sync depends on which part of the version you change.

| Change | Example | Sync? |
|---|---|---|
| Patch: a fix, with the same parameters | `v1.0.0` → `v1.0.1` | No. The console keeps showing `v1.0.0` as the organization version, and the gateways run `v1.0.1`. |
| Minor: a compatible change, such as a new optional parameter | `v1.0.0` → `v1.1.0` | Yes. The sync replaces `v1.0.0` in your organization, so the console shows the new parameter. APIs that use the policy keep working. |
| Major: a breaking change | `v1.2.0` → `v2.0.0` | Yes. Your organization then has both `v1` and `v2`. Existing APIs keep using `v1` until you attach `v2` to them. |

APIs refer to a custom policy by its name and major version, such as `v1`, and each gateway runs the `v1` build that it has. Every gateway that serves an API must have the major version that the API uses.

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| The **Policies** tab shows **No gateway manifest found** | The gateway hasn't reported its policies. Check that it shows **Active**, then look for `Failed to push gateway manifest` in the controller logs. |
| The policy is missing from the **Policies** tab | The gateway still runs the standard images, or the page shows an earlier connection. Check the images with `docker compose images`, then reload the page. |
| The policy shows **Policy Hub** instead of **Custom** | The controller didn't find the policy in its `build-manifest.yaml`. The controller image wasn't replaced, or the policy comes from a `github.com/wso2` module. The controller logs `Could not read build-manifest.yaml` when the file is missing. |
| Sync fails with `must be at most ... characters` | A field in `policy-definition.yaml` is too long. Shorten it, rebuild the images, restart the gateway, and sync again. |
| The **Sync status** shows **Unknown** | The console couldn't read your organization's custom policies. Reload the page. |
| The policy isn't in the **Available policies** pane | The policy isn't synced yet, or a category is selected. Sync it, or select **All**. |
| The deployment shows **Failed** after you attach the policy | The gateway doesn't have the policy, or that major version of it. The controller logs a `not found in loaded policy definitions` error. Deploy to a gateway that you built with the policy, or rebuild this one. |

## Next Steps

- [Adding and Managing Policies](./manage-policies.md): attach, order, and configure policies on an API.
- [Deploy and Test an API](./deploy-and-test-api.md): deploy an API to your Self-Hosted Gateway and invoke it.
- [Policy Hub](../../policy-hub/overview.md): the Policy Hub policies you can attach without building them.
