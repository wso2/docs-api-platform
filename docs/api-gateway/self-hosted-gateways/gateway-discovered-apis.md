---
title: "Gateway Discovered APIs"
sidebar_label: Gateway Discovered APIs
description: Deploy APIs directly on a self-hosted gateway and have them synced to the API Control Plane Console as read-only, gateway-managed APIs.
---

A gateway discovered API is an API that you deploy directly on a self-hosted gateway, rather than from the API Control Plane Console. The gateway syncs the API up to the control plane, so it appears in the console next to your other APIs. The gateway stays the owner of the API, so the console shows it in read-only mode.

:::tip
To create and deploy APIs from the console instead, see [Deploy and Test an API](./deploy-and-test-api.md).
:::

## Top-Down and Gateway Discovered APIs

| | Top-down API | Gateway discovered API |
|---|---|---|
| **Created in** | The API Control Plane Console | The self-hosted gateway, through its management API |
| **Deployed by** | The console, which sends the deployment to the gateway | The gateway itself |
| **Managed by** | The control plane | The gateway |
| **In the console** | Fully editable | Read-only |

Gateway discovered APIs suit teams that keep API definitions as code and deploy them with GitOps or CI/CD pipelines straight to the gateway. The APIs still show up in the console, where everyone can see them.

## How It Works

1. You create or update an API on the gateway, through the Gateway Controller's management API (`/api/management/v1/rest-apis`).

2. The gateway deploys the API and starts serving traffic for it right away. Deployment doesn't depend on the control plane.

3. When the deployment completes, the gateway pushes the API definition to the control plane over its existing outbound connection. Failed pushes are retried with backoff.

4. The control plane creates the API, or updates it if one with the same name already exists, in the project named in the API definition. The API is marked as **managed by the gateway**, and the gateway is recorded as a deployment target.

5. Each time the gateway connects or reconnects to the control plane, it pushes all of its gateway-created APIs again. Changes made while the gateway was offline are synced then.

The gateway records the sync result for each API as `pending`, `success`, or `failed`.

:::note
Syncing gateway discovered APIs is on by default (`deployment_sync_enabled = true` under `controller.controlplane` in `configs/config.toml`). It happens only while the gateway is connected to the control plane.
:::

## Deploying a Gateway Discovered API

### Step 1: Define the API

Write the API definition as YAML. Set the `gateway.api-platform.wso2.com/project-id` annotation to the **handle** of an existing project in your organization. The control plane places the API in that project.

```yaml title="reading-list-api.yaml"
apiVersion: gateway.api-platform.wso2.com/v1
kind: RestApi
metadata:
  name: reading-list-api-v1.0
  annotations:
    gateway.api-platform.wso2.com/project-id: default
spec:
  displayName: Reading List API
  version: v1.0
  context: /reading-list
  upstream:
    main:
      url: https://apis.bijira.dev/samples/reading-list-api-service/v1.0
  operations:
    - method: GET
      path: /books
    - method: POST
      path: /books
```

:::warning[Important]
The project annotation is required. If it is missing, or the project doesn't exist in your organization, the API still runs on the gateway but isn't synced to the console.
:::

### Step 2: Deploy the API on the Gateway

Send the definition to the Gateway Controller's management API. Use the admin credentials that `setup.sh` generated.

```bash
curl -X POST http://localhost:9090/api/management/v1/rest-apis \
  -u admin:'<admin-password>' \
  -H 'Content-Type: application/yaml' \
  --data-binary @reading-list-api.yaml
```

To change the API later, update it on the gateway the same way, with `PUT /api/management/v1/rest-apis/{id}`. The gateway pushes each change to the control plane after it is deployed.

### Step 3: Verify the Sync

Check the controller logs for the push to the control plane.

```bash
docker compose logs gateway-controller | grep -i "pushed deployment to control plane"
```

You should see `Successfully pushed deployment to control plane`. Then open the project in the console. The API is listed there, and its **Deploy** page shows it on your self-hosted gateway.

## What the Console Shows

The console shows a gateway discovered API so you can see and test it, but you can't change it there. Make all changes on the gateway.

| Page | What you see |
|---|---|
| **Overview** | The API's details and endpoints. The endpoint **Edit** button is disabled, because the gateway manages the API. |
| **Policies** | The policies attached to the API, in read-only mode. A banner says the API is read-only and managed by the gateway. |
| **Deploy** | The API's deployment on the self-hosted gateway, in read-only mode, with the same banner. You can't deploy, redeploy, or stop the deployment from the console. |
| **Test** | Works like any other API. Choose the self-hosted gateway and invoke the API. |

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| The API works on the gateway but doesn't appear in the console | The gateway isn't connected to the control plane, or the push failed. Check that the gateway is **Active**, then look for `DP->CP artifact push failed` in the controller logs. |
| `A project is required for artifact kind` | The API definition has no `gateway.api-platform.wso2.com/project-id` annotation. Add it and update the API on the gateway. |
| `project with handle ... does not exist` (control-plane error) | The annotation names a project that doesn't exist in the organization. Use the handle of an existing project, or create the project in the console first. |
| `artifact ... already exists with kind ...` | Another kind of artifact in the organization already uses this name. Give the API a different `metadata.name`. |
| A change made on the gateway doesn't show in the console | The console shows the latest successfully synced version. Check the controller logs for a push failure. Failed APIs are pushed again when the gateway next reconnects. |

## Next Steps

- [Architecture](./architecture.md): how the gateway and the control plane communicate.
- [Deploy and Test an API](./deploy-and-test-api.md): create and deploy APIs from the console (top-down).
- [Setting Up](./setting-up.md): install and configure a self-hosted gateway.
