---
title: "Quick Start Guide"
pagination_label: "Self-Hosted Gateway Quick Start"
description: "Set up a Self-Hosted Gateway in your own infrastructure and connect it to the API Management Cloud control plane."
---

This guide gets a self-hosted API Gateway running on your machine with Docker Compose, connected to the API Control Plane Console, in about ten minutes. When you finish, the gateway shows as **Active** in the console and you're ready to [deploy and test an API](./deploy-and-test-api.md).

:::tip
For production installs on a VM or Kubernetes, see [Setting Up](./setting-up.md).
:::

## Prerequisites

- An organization in the API Control Plane Console, and access to it.
- `curl` and `unzip`.
- Docker with Docker Compose v2, installed and running. To check, run the following commands.

  ```bash
  docker --version
  docker compose version
  ```

- Outbound HTTPS (port 443) access from your machine to the internet.
- Free local ports **8080, 8443, 9090, 9094, 9011, 9901, 9002, 9003**. If any are already in use, see [Port already in use](./setting-up.md#port-already-in-use).

## Step 1: Add a Self-Hosted Gateway in the Console

1. Sign in to the API Control Plane Console and select your organization.

2. In the left navigation, click **Gateways**.

   If this is your first gateway, the page offers two choices. Click **Add self-hosted gateway**. If you already have gateways, click **+ Add Gateway**.

3. On the **Add Gateway** page, fill in the form.

   | Field | Value |
   |---|---|
   | **Hosting** | **Self-hosted** |
   | **Gateway Type** | **API Gateway** |
   | **Name** | A unique name, for example `Local Self-Hosted Gateway`. The gateway **handle** (shown under the field, for example `local-self-hosted-gateway`) is derived from this name and **can't be changed later**. |
   | **Description** | Optional. |
   | **Environment** | The environment this gateway serves, for example `development`. |
   | **Gateway Version** | `API-Gateway v1.2` (Latest). |
   | **URL** | The base URL your API consumers use to reach this gateway's HTTPS listener. For a local run, use `https://localhost:8443`. The console uses this URL when it shows API endpoints and test commands. |

   ![Add Gateway form filled in for a self-hosted API Gateway](/img/cloud/self-hosted-gateway/quick-start/self-hosted-quick-start-step-1.png)

4. Click **Add Gateway**.

The gateway is created with status **Inactive** and the page shows *Waiting for connection*. The **Configurations** tab lists the setup commands, with four tabs: **Quick Start**, **Virtual Machine**, **Docker**, and **Kubernetes**. Keep **Quick Start** selected.

![Newly created gateway waiting for connection, showing Quick Start setup commands](/img/cloud/self-hosted-gateway/quick-start/self-hosted-quick-start-step-2.png)

:::warning
**The registration token is shown only once.** In step 3 of the setup commands, the page displays `<your-gateway-token>` as a placeholder. When you click **Copy** on that block, the copied command contains your real token. Copy and run it before you leave this page. If you navigate away, the console replaces this step with a **Reconfigure** button that issues a new token (see [Rotate the registration token](./setting-up.md#rotate-the-registration-token)).
:::

## Step 2: Download the Gateway

Run the command from step **1 – Download the Gateway**.

```bash
curl -sLO https://github.com/wso2/api-platform/releases/download/gateway/v1.2.0/wso2apip-api-gateway-1.2.0.zip && \
unzip wso2apip-api-gateway-1.2.0.zip
```

## Step 3: Run the One-Time Setup Script

Run the command from step **2 – Set up the Gateway**.

```bash
cd wso2apip-api-gateway-1.2.0 && ./scripts/setup.sh
```

The script provisions everything the gateway needs to start.

- the listener TLS certificate for the HTTPS ingress (`resources/listener-certs/`),
- an AES-256 key for encrypting data at rest (`resources/aesgcm-keys/`),
- admin credentials for the Gateway Controller's management API,
- `api-platform.env` (the gateway's environment file) and `.env` (a unique Docker Compose project name for this copy).

Sample output.

```text
[setup] Provisioning listener TLS certificate ...
[setup] Provisioning AES-256 encryption key ...
[setup]   - AES-256 encryption key generated at resources/aesgcm-keys/default-aesgcm256-v1.bin
[setup] Provisioning the docker compose project name ...
[setup]   - COMPOSE_PROJECT_NAME=wso2apip-gateway-1-2-0-965b1a written to .env (generated)
[setup] Provisioning admin credentials ...
[setup] Writing api-platform.env ...
[setup] Setup complete.

  ==================================================================
   ADMIN CREDENTIALS

     Username:  admin
     Password:  ****************

   !!  THIS PASSWORD WILL NOT BE SHOWN AGAIN — COPY IT NOW  !!
  ==================================================================
```

:::warning
Save the admin password somewhere safe. Only its bcrypt hash is stored. You need the password only if you call the controller's local management API directly. The cloud connection doesn't use it.
:::

## Step 4: Connect the Gateway to the Control Plane

Go back to the console and click **Copy** on step **3 – Configure the Gateway**. Then paste and run the command in the same `wso2apip-api-gateway-1.2.0` folder. It appends the control-plane settings to `api-platform.env`.

```bash
cat >> api-platform.env << 'ENVFILE'
APIP_GW_CONTROLLER_CONTROLPLANE_HOST=<control-plane-host-shown-in-console>
APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=<your-gateway-token>
ENVFILE
```

Use the command copied from the console rather than typing it, so that the host and token are exact.

## Step 5: Start the Gateway

Run the command from step **4 – Start the Gateway**.

```bash
docker compose up
```

To run it in the background instead, use `docker compose up -d`.

Docker Compose starts two containers: `gateway-controller` and `gateway-runtime`. Within a few seconds, the controller log shows the connection to the control plane.

```text
gateway-controller-1  | msg="Connection state changed" from=disconnected to=connecting
gateway-controller-1  | msg="Received connection acknowledgment" gateway_id=01a1a5c8-...
gateway-controller-1  | msg="Connection state changed" from=connecting to=connected
gateway-controller-1  | msg="Successfully pushed gateway manifest to control plane" policy_count=54
```

## Step 6: Verify

1. Check that both containers are running and the controller is healthy.

   ```bash
   docker compose ps
   curl http://localhost:9094/api/admin/v1/health
   ```

   ```json
   {"status":"healthy","timestamp":"2026-11-04T09:02:01Z"}
   ```

2. In the console, reload the **Gateways** page. The status doesn't update live, so a refresh is required. Your gateway now shows **Active** under **Self-hosted gateways**.

   ![Gateways list showing the self-hosted gateway as Active](/img/cloud/self-hosted-gateway/quick-start/self-hosted-quick-start-step-3.png)

3. Open the gateway. The status panel shows **Connected: This gateway is connected to the control plane.**

## Next Steps

- [Deploy and test an API](./deploy-and-test-api.md) on your new gateway.
- Before going to production, review [Setting Up → Production hardening](./setting-up.md#production-hardening).

## Troubleshooting

| Symptom | What to check |
|---|---|
| Gateway stays **Inactive** | Refresh the page first, because status doesn't update live. Then check `docker compose logs gateway-controller` for `to=connected`. If you see authentication errors, the token is wrong or was revoked; [reconfigure](./setting-up.md#rotate-the-registration-token). |
| Controller exits with `read /etc/gateway-controller/config.toml: is a directory` | Docker can't see the folder you extracted the gateway into. Docker Desktop, Colima, and Rancher Desktop share only certain host paths (usually your home directory). Move the folder under a shared path and start again. |
| `bind: address already in use` | Another process uses one of the gateway ports. See [Port already in use](./setting-up.md#port-already-in-use). |
| `WebSocket connection failed … context deadline exceeded` | Usually transient: the controller retries automatically with backoff. If it persists, make sure outbound HTTPS to the control-plane host is allowed, including through any corporate proxy or firewall. |

For more, see [Setting Up → Troubleshooting](./setting-up.md#troubleshooting).


