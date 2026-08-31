---
title: "Connect to AI Workspace"
description: "Register a production AI Gateway with AI Workspace: the registration token as a Kubernetes Secret, the control plane address, TLS trust, and sync behavior."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/control-plane-connection/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/control-plane-connection.md
tags:
  - ai-gateway
  - production
  - ai-workspace
  - control-plane
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-26
content_type: "how-to"
---

# Connect to AI Workspace

!!! note
    This step is optional. The gateway routes large language model (LLM) and Model Context Protocol (MCP) traffic without a control plane. Connect it when you want to govern several gateways from one place.

[AI Workspace](../../../../ai-workspace/1.0.0/overview.md) is the control plane for AI traffic across an organization. One console covers LLM providers, App LLM proxies, MCP proxies, policies such as guardrails and token-based rate limits, and the credentials behind them. A connected gateway keeps serving traffic on its own, and the control plane governs what runs on it.

The connection works in both directions, and you can use both at once:

- **Top-down.** Configure an artifact in AI Workspace, attach policies, and deploy it to one or more gateways.
- **Bottom-up.** Keep deploying through the management API. Artifacts created on the gateway sync up to AI Workspace automatically and appear there as copies the gateway owns. See [Manage gateway-deployed AI artifacts](../../../../ai-workspace/1.0.0/sync-gateway-created-artifacts.md).

If AI Workspace becomes unreachable, the gateway carries on serving traffic and the sync catches up once the connection is restored.

This page covers a Helm installation. For what connecting adds and which connection path suits which runtime, see [Extend your gateway with AI Workspace](../../ai-workspace/extend-your-gateway-with-ai-workspace.md) and [Connect the gateway to AI Workspace](../../ai-workspace/connect-the-gateway.md).

## Before you begin

- A running AI Workspace deployment. For the control plane side of this connection — reachable addresses, WebSocket traversal, and certificate trust — see [Connect AI gateways in production](../../../../ai-workspace/1.0.0/production/connect-gateways.md).
- A gateway registered in AI Workspace, which is what produces the registration token. Follow [Set up an AI Gateway](../../../../ai-workspace/1.0.0/ai-gateways/setting-up.md).

The gateway connects directly to the Platform API. It doesn't go through the AI Workspace user interface, and the workspace never calls the gateway.

Because the gateway opens the connection, three things have to hold on the gateway's side. Most connection problems trace back to one of them:

- The control plane address resolves and accepts connections **from the gateway's network**, not from the workspace's.
- The path between the two passes WebSocket upgrades and tolerates long-lived connections.
- The certificate presented at that address chains to a certificate authority (CA) the gateway trusts.

Confirm reachability from a pod in the gateway's namespace before configuring anything:

```bash
kubectl run -n ai-gateway conn-test --rm -it --restart=Never --image=curlimages/curl -- \
  curl -fsS -X GET https://platform-api.example.com:9243/health
```

A timeout usually indicates a firewall or routing problem. A certificate error usually indicates a trust problem, such as an untrusted issuer, a hostname that the certificate doesn't cover, or an expired certificate. Fix it at the source rather than turning verification off.

## Step 1: Store the registration token in a Secret

The registration token is a credential and is shown only once. Keep it out of Helm values, shell history, and source control by putting it in a Kubernetes Secret:

```bash
install -m 600 /dev/null token.txt
read -rsp "Gateway registration token: " CP_TOKEN && echo
printf '%s' "$CP_TOKEN" > token.txt
unset CP_TOKEN

kubectl create secret generic gateway-cp-token \
  --namespace ai-gateway \
  --from-file=token=./token.txt \
  && shred -u token.txt
```

Reading the token from a file rather than `--from-literal` keeps it out of your shell history and out of the host's process list. `install -m 600` creates `token.txt` readable only by you. `shred -u` runs only if the Secret is created, so a failed attempt leaves the file in place for a retry.

!!! note
    The token is single-use. If you need to install or reconfigure the chart again, click **Reconfigure** on the gateway in AI Workspace to issue a replacement. Doing so revokes the previous token and disconnects the gateway until the replacement is applied.

## Step 2: Configure the chart

```yaml
gateway:
  config:
    controller:
      server:
        gateway_id: "prod-ai-gateway"
      controlplane:
        insecure_skip_verify: false
        reconnect_initial: 1s
        reconnect_max: 5m
        polling_interval: 15m
        deployment_sync_enabled: true
        sync_batch_size: 50
        gateway_name: "prod-ai-gateway"   # Must match the name registered in AI Workspace

  controller:
    controlPlane:
      host: "platform-api.example.com:9243"
      token:
        secretName: "gateway-cp-token"
        key: token
```

Two fields decide whether the connection works at all:

- **`controlPlane.host`** is used directly as the HTTPS and WebSocket authority, so include the port unless the control plane is served on 443. Give it as `host:port` with no scheme.
- **`gateway_name`** must match the name of the gateway you registered in AI Workspace. A mismatch leaves the gateway running and unable to associate itself with its registration.

!!! warning
    Leave `insecure_skip_verify` at `false`. Setting it to `true` disables certificate verification on the channel that carries your artifacts and their credentials. If the control plane presents a certificate from a private CA, add that CA to the gateway's trust rather than skipping verification.

The remaining fields control sync behavior. `deployment_sync_enabled: true` pushes artifacts created on the gateway up to AI Workspace, which is what makes the bottom-up flow work. `polling_interval` sets how often the gateway reconciles its full state with the control plane, independently of the event stream.

Apply the change:

```bash
helm upgrade ai-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version 1.2.0 \
  --namespace ai-gateway \
  --values ./values.yaml \
  --wait
```

## Step 3: Verify the connection

In AI Workspace, open **AI Gateways** and find your gateway. Its status changes from **Not Active** to **Active** once the runtime connects.

From the cluster, check the controller logs for the control plane connection:

```bash
kubectl logs -n ai-gateway deploy/ai-gateway-controller | grep -i controlplane
```

Then confirm the sync in both directions:

- Deploy an LLM proxy from AI Workspace to this gateway and call it through the gateway's external address.
- Deploy a proxy through the management API, as in [Deploy and verify](./deploy-and-verify.md#verify-with-real-ai-traffic), and confirm it appears in AI Workspace.

## Connect several gateways

One AI Workspace governs many gateways. Register each one separately, give each its own registration token and its own `gateway_name`, and keep `gateway_id` unique across the estate. A development gateway, a staging gateway, and a production gateway in different clusters can all report to the same control plane while serving their own traffic.

---

[← Deploy and verify](./deploy-and-verify.md) &nbsp;|&nbsp; [Production deployment overview](./index.md)
