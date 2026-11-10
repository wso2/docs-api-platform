---
title: "Setting Up"
pagination_label: "Self-Hosted Gateway Setting Up"
description: "Set up a Self-Hosted Gateway in your own infrastructure and connect it to the API Management Cloud control plane."
---

# Setting Up a Self-Hosted Gateway

This page covers installing a self-hosted API Gateway for real use: on a VM or any Docker host with Docker Compose, or on Kubernetes with Helm. It also covers configuration, hardening, token management, upgrades, and troubleshooting.

> Just trying it out? The [Quick Start](./quickstart-guide.md) is the fastest path.

## Before you begin: add the gateway in the console

Every installation method starts the same way:

1. In the API Management Console, go to **Gateways** and click **+ Add Gateway** (or **Add self-hosted gateway** if you have none yet).
2. Select **Hosting: Self-hosted** and **Gateway Type: API Gateway**, then enter:
   - **Name:** the gateway **handle** is derived from it and can't be changed later.
   - **Environment:** the environment whose APIs this gateway serves.
   - **Gateway Version:** `API-Gateway v1.2`.
   - **URL:** the public base URL of this gateway's HTTPS listener as your consumers will call it, for example `https://api.internal.example.com` or `https://gw.example.com:8443`. The console uses it when it shows endpoints and generated test commands.
3. Click **Add Gateway**. The gateway is created as **Inactive**, and the **Configurations** tab shows setup commands under **Quick Start**, **Virtual Machine**, **Docker**, and **Kubernetes**.

> **The registration token is shown only once.** The setup commands display a `<your-gateway-token>` placeholder. Clicking **Copy** on the configure (or Helm install) command copies it **with the real token**. Store the token in your secret manager before you leave the page. If you lose it, use [Reconfigure](#rotate-the-registration-token).

## Option A: VM or Docker host (Docker Compose)

Use this on a Linux VM, a bare-metal server, or any machine with a Docker-compatible runtime. The **Virtual Machine** and **Docker** tabs in the console use the same commands.

### Prerequisites

- `curl`, `unzip`, and `openssl`.
- A Docker-compatible container runtime with the Compose v2 plugin, for example Docker Engine with the Compose plugin (Linux), Docker Desktop (Windows/macOS), Rancher Desktop (Windows/macOS), or Colima (macOS):

  ```bash
  docker --version
  docker compose version
  ```

- Outbound HTTPS (443) from the host to the control-plane host.
- On Docker Desktop, Rancher Desktop, or Colima, extract the gateway into a folder that the runtime shares with its VM. Your home directory is shared by default; system temp folders are usually not.

### Step 1: Download

```bash
curl -sLO https://github.com/wso2/api-platform/releases/download/gateway/v1.2.0/wso2apip-api-gateway-1.2.0.zip && \
unzip wso2apip-api-gateway-1.2.0.zip
```

The distribution contains:

```text
wso2apip-api-gateway-1.2.0/
├── docker-compose.yaml        # gateway-controller + gateway-runtime services
├── configs/config.toml        # gateway configuration (reads values from api-platform.env)
├── resources/
│   ├── listener-certs/        # HTTPS listener certificate and key
│   └── ...
├── observability/             # optional tracing/logging/metrics stacks
└── scripts/setup.sh           # one-time setup (setup.ps1 on Windows)
```

### Step 2: Run the setup script

```bash
cd wso2apip-api-gateway-1.2.0 && ./scripts/setup.sh
```

`setup.sh` creates the at-rest encryption key, the admin credentials for the controller's local management API (it prints the password **once**), `api-platform.env`, and `.env`, which pins a unique Docker Compose project name.

Useful options:

| Option / variable | Effect |
|---|---|
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Set the admin credentials non-interactively, for example in automation. If `ADMIN_PASSWORD` is empty, a random password is generated and printed. |
| `COMPOSE_PROJECT_NAME=<name>` | Choose the Compose project name on the **first** run. It prefixes all containers and volumes and never changes afterwards. Don't delete `.env`: a new name starts the gateway with an empty database. |
| `--force` | Regenerates the listener certificate and the encryption key, re-creates the admin password, and **rewrites `api-platform.env`**. Re-add the control-plane settings (step 3) afterwards. Rotating the encryption key makes previously encrypted data unreadable. |
| `--force --certs-only` | Regenerates only the listener certificate, and leaves the encryption key, admin password, and `api-platform.env` untouched. Without `--force`, an existing certificate is kept. |

### Step 3: Add the control-plane settings

From the console, copy the **Configure the Gateway** command (it includes your token) and run it in the gateway folder:

```bash
cat >> api-platform.env << 'ENVFILE'
APIP_GW_CONTROLLER_CONTROLPLANE_HOST=<control-plane-host-shown-in-console>
APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=<your-gateway-token>
ENVFILE
```

For production, also turn on TLS verification of the control plane. See [Production hardening](#production-hardening):

```bash
echo "APIP_GW_CONTROLLER_CONTROLPLANE_INSECURE_SKIP_VERIFY=false" >> api-platform.env
```

### Step 4: Start

```bash
docker compose up -d
```

### Step 5: Verify

```bash
docker compose ps
curl http://localhost:9094/api/admin/v1/health
docker compose logs gateway-controller | grep "Connection state changed"
```

You should see `{"status":"healthy",...}` and a `to=connected` log line. Reload the **Gateways** page in the console: the gateway shows **Active**.

### Stop, restart, and remove

| Task | Command |
|---|---|
| Follow logs | `docker compose logs -f` |
| Stop (keeps data) | `docker compose down` |
| Apply changes to `api-platform.env` | `docker compose up -d --force-recreate` |
| Remove completely, **including the gateway database volume** | `docker compose down -v` |

## Option B: Kubernetes (Helm)

### Prerequisites

- Kubernetes 1.32+ and Helm 3.18+ (as listed in the console).
- `kubectl` access to the target namespace, and `openssl`.
- **cert-manager**, which the chart uses by default to issue the HTTPS listener certificate. Alternatively, provide your own TLS secret (see below).
- Outbound HTTPS (443) from the cluster to the control-plane host.

### Step 1: Install cert-manager (if it isn't installed already)

```bash
helm upgrade --install cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --version v1.19.1 \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true --wait
kubectl get pods -n cert-manager
```

### Step 2: Create the namespace and secrets

The chart **requires** an AES-256 at-rest encryption key and refuses to render without one. Create the key as a Secret in the namespace you install into. Then store the registration token in a Secret too, rather than passing it on the command line.

```bash
kubectl create namespace api-gateway

# AES-256 at-rest encryption key (entry name must be default-aesgcm256-v1.bin)
openssl rand 32 > default-aesgcm256-v1.bin
kubectl create secret generic gateway-encryption-keys -n api-gateway \
  --from-file=default-aesgcm256-v1.bin=default-aesgcm256-v1.bin
rm default-aesgcm256-v1.bin

# Registration token copied from the console
kubectl create secret generic gateway-cp-token -n api-gateway \
  --from-literal=token='<your-gateway-token>'
```

> Back up the encryption key secret. If it is lost or rotated, data the gateway already encrypted can't be read.

### Step 3: Install the chart

The console's **Kubernetes** tab gives you the `helm install` command with your control-plane host already filled in. Add the encryption-key settings and reference the token secret:

```bash
helm install development-local-self-hosted-gateway \
  oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version 1.2.0 \
  --namespace api-gateway \
  --set gateway.controller.controlPlane.host="<control-plane-host-shown-in-console>" \
  --set gateway.controller.controlPlane.port=443 \
  --set gateway.controller.controlPlane.token.secretName=gateway-cp-token \
  --set gateway.controller.encryptionKeys.enabled=true \
  --set gateway.controller.encryptionKeys.secretName=gateway-encryption-keys
```

> The command shown in the console doesn't include the two `encryptionKeys` settings. Without them, Helm fails with `gateway.controller.encryptionKeys must be enabled: at-rest encryption is mandatory`.

To use your own listener certificate instead of cert-manager, create a TLS secret and add:

```bash
kubectl create secret tls gateway-tls -n api-gateway --cert=gateway.crt --key=gateway.key
# then add to helm install:
#   --set gateway.controller.tls.certificateProvider=secret \
#   --set gateway.controller.tls.secret.name=gateway-tls
```

For anything beyond a few flags, put the settings in a `values.yaml` file and install with `-f values.yaml`. To see every option, run `helm show values oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version 1.2.0`.

### Step 4: Verify

```bash
kubectl get pods -n api-gateway
kubectl logs -n api-gateway deploy/development-local-self-hosted-gateway-controller | grep "Connection state changed"
kubectl get svc -n api-gateway
```

The gateway runtime is exposed through a `LoadBalancer` Service on ports 8080 (HTTP) and 8443 (HTTPS). Point the gateway **URL** you set in the console at that address, or at the Ingress or DNS name in front of it.

### Upgrade and uninstall

```bash
helm upgrade development-local-self-hosted-gateway \
  oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version <new-version> \
  --namespace api-gateway -f values.yaml

helm uninstall development-local-self-hosted-gateway -n api-gateway
```

## Configuration reference

The Docker Compose distribution reads these variables from `api-platform.env`:

| Variable | Set by | Description |
|---|---|---|
| `APIP_GW_CONTROLLER_CONTROLPLANE_HOST` | Console command | Control-plane host (and path) that the gateway connects to over HTTPS/WSS on 443. |
| `APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN` | Console command | Gateway registration token. Treat it as a secret. |
| `APIP_GW_CONTROLLER_CONTROLPLANE_INSECURE_SKIP_VERIFY` | You | `false` verifies the control plane's TLS certificate. The 1.2.0 Docker Compose distribution defaults to `true`, so set `false` explicitly. The Helm chart defaults to `false`. |
| `APIP_GW_CONTROLLER_AUTH_BASIC_ADMIN_USERNAME` | `setup.sh` | Admin user for the controller's local REST API (port 9090). |
| `APIP_GW_CONTROLLER_AUTH_BASIC_ADMIN_PASSWORD_HASH` | `setup.sh` | bcrypt hash of the admin password. |
| `APIP_GW_CONTROLLER_LOGGING_LEVEL` | You (optional) | Controller log level, `info` by default. |
| `LOG_LEVEL` | `setup.sh` | Runtime log level. |

Other settings (listeners, storage, policies) live in `configs/config.toml`. `configs/config-template.toml` documents every key.

## Production hardening

1. **Verify the control plane's certificate.** Set `APIP_GW_CONTROLLER_CONTROLPLANE_INSECURE_SKIP_VERIFY=false` in `api-platform.env`. With verification off, the controller logs `TLS certificate verification disabled`.
2. **Use your own listener certificate.** The distribution ships a self-signed certificate for `localhost` in `resources/listener-certs/`, and `setup.sh` keeps it if it exists. Replace `default-listener.crt` and `default-listener.key` with a certificate issued for your gateway hostname, or at minimum run `./scripts/setup.sh --force --certs-only` to generate a self-signed certificate unique to this install.
3. **Keep management ports private.** The distribution's `docker-compose.yaml` publishes the controller API (9090), admin API (9094), metrics (9011), Envoy admin (9901), and Policy Engine admin and metrics (9002, 9003) on all host interfaces. Block them at the firewall, or bind them to loopback with a `docker-compose.override.yaml`. Compose picks this file up automatically; `!override` requires Docker Compose 2.24+:

   ```yaml
   services:
     gateway-controller:
       ports: !override
         - "127.0.0.1:9090:9090"
         - "127.0.0.1:9094:9092"
         - "127.0.0.1:9011:9091"
     gateway-runtime:
       ports: !override
         - "8080:8080"     # API traffic (remove if you only serve HTTPS)
         - "8443:8443"     # API traffic
   ```

4. **Protect secrets on disk.** `api-platform.env` holds the registration token and `resources/aesgcm-keys/` holds the encryption key. Keep both readable only by the account that runs the gateway, and keep them out of version control.
5. **Rotate the registration token** if it may have leaked (see below).

## Rotate the registration token

The token appears only when the gateway is created. Afterwards, step 3 on the gateway's **Configurations** tab shows a **Reconfigure** button:

![Reconfigure option on an existing gateway](/img/cloud/self-hosted-gateway/setting-up/self-hosted-setting-up-4.png)

1. Click **Reconfigure**. A new token and configuration command are generated, and **the previous token is revoked**, so a running gateway that still uses it loses its connection.
2. Update the gateway with the new token:
   - **Docker Compose:** replace the `APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=` line in `api-platform.env`, then run `docker compose up -d --force-recreate`.
   - **Kubernetes:** update the `gateway-cp-token` secret, then run `kubectl rollout restart deploy/<controller-deployment> -n api-gateway`. Find the Deployment name with `kubectl get deploy -n api-gateway`.
3. Reload the **Gateways** page and confirm the gateway is **Active**.

## Port already in use

If another service on the host already uses 8080, 8443, 9090, or another gateway port, remap the **host** side of the port in a `docker-compose.override.yaml`. Leave the container port unchanged:

```yaml
services:
  gateway-controller:
    ports: !override
      - "127.0.0.1:19090:9090"
      - "127.0.0.1:19094:9092"
  gateway-runtime:
    ports: !override
      - "18080:8080"
      - "18443:8443"
```

If you change the HTTPS port that consumers use, update the gateway **URL** in the console (**Gateways → your gateway → Edit**) to match.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Console shows **Inactive** after starting | The status doesn't update live, so reload the page. Then check `docker compose logs gateway-controller` for `Connection state changed … to=connected`. |
| Controller keeps reconnecting with authentication errors | The token is wrong, has a stray character, or was revoked by **Reconfigure**. Copy a fresh command from the console. |
| `WebSocket connection failed … context deadline exceeded` | The controller can't reach the control plane within the timeout. It retries with backoff (1 s up to 5 min). If it never connects, check outbound 443 to the control-plane host, DNS, and any HTTP proxy or firewall. |
| `x509: certificate signed by unknown authority` with `INSECURE_SKIP_VERIFY=false` | A TLS-inspecting proxy re-signs traffic. Add your proxy's CA to the gateway's trust store, or allow the control-plane host through without inspection. |
| `read /etc/gateway-controller/config.toml: is a directory` | The gateway folder isn't shared with the Docker VM (Docker Desktop, Colima, Rancher Desktop). Move it under your home directory or add the path to the runtime's file sharing. Then run `docker compose down -v` and `docker compose up -d`. |
| `Encryption key file is world-readable` warning | Restrict `resources/aesgcm-keys/default-aesgcm256-v1.bin` to the gateway's user. `setup.sh` does this automatically when `setfacl` is available. |
| Helm: `encryptionKeys must be enabled` | Create the encryption-key secret and pass `gateway.controller.encryptionKeys.enabled=true` and `secretName` (see [Step 2](#step-2-create-the-namespace-and-secrets)). |
