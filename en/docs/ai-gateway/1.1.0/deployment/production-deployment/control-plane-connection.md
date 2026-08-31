---
title: "Connect to a Control Plane"
description: "Connect an AI Gateway 1.1.0 deployment to a WSO2 APIM or API Platform Cloud control plane, and what to know about AI Workspace version requirements."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/control-plane-connection/
md_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/control-plane-connection.md
tags:
  - ai-gateway
  - production
  - control-plane
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-09
content_type: "how-to"
---

# Connect to a control plane

!!! note
    This step is optional. The gateway routes large language model (LLM) and Model Context Protocol (MCP) traffic without a control plane.

A control plane connection gives the gateway a central place to receive artifacts from and report state to. AI Gateway 1.1.0 connects over a persistent WebSocket connection. It supports a [WSO2 API Manager (APIM) control plane](https://apim.docs.wso2.com/en/latest/api-gateway/platform-gateway/getting-started/) and an [API Platform Cloud control plane](https://wso2.com/api-platform/docs/cloud/api-platform-gateway/getting-started/).

!!! important "AI Workspace needs AI Gateway 1.2.0"
    [AI Workspace](../../../../ai-workspace/1.0.0/overview.md) is the control plane for governing LLM providers, App LLM proxies, MCP proxies, and AI policies across an organization. It works with gateway version 1.2 and above. A 1.1.0 gateway can't register with it. To govern this gateway from AI Workspace, upgrade to [AI Gateway 1.2.0](../../../1.2.0/setup-and-deployment/production-deployment/control-plane-connection.md) first.

## Step 1: Store the registration token in a Secret

The registration token is produced when you register the gateway with your control plane. Follow the setup guide for the control plane you run to obtain it.

The token is a credential. Keep it out of Helm values, shell history, and source control:

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
        sync_batch_size: 50
        gateway_name: "prod-ai-gateway"   # Must match the name registered in the control plane

  controller:
    controlPlane:
      host: "apim.example.com:9443"
      token:
        secretName: "gateway-cp-token"
        key: token
```

Two fields decide whether the connection works at all:

- **`controlPlane.host`** is used directly as the HTTPS and WebSocket authority, so include the port unless the control plane is served on 443. Give it as `host:port` with no scheme.
- **`gateway_name`** must match the name you registered in the control plane. A mismatch leaves the gateway running and unable to associate itself with its registration.

!!! warning
    Leave `insecure_skip_verify` at `false`. Setting it to `true` disables certificate verification on the channel that carries your artifacts and their credentials. If the control plane presents a certificate from a private certificate authority (CA), add that CA to the gateway's trust rather than skipping verification.

The connection carries both HTTPS and WebSocket traffic, so anything between the gateway and the control plane has to pass WebSocket upgrades and tolerate long-lived connections.

## Step 3: Push gateway-created artifacts upward

Artifacts deployed directly to the gateway can be synced back to the control plane. This is off by default:

```yaml
gateway:
  config:
    controller:
      controlplane:
        deployment_push_enabled: true
```

Confirm your control plane supports this direction before enabling it. It's supported against an on-premises WSO2 APIM instance, not against the cloud control plane.

## Step 4: Verify the connection

Apply the change and check the controller logs for the control plane connection:

```bash
helm upgrade ai-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version 1.1.5 \
  --namespace ai-gateway \
  --values ./values.yaml \
  --wait

kubectl logs -n ai-gateway deploy/ai-gateway-controller | grep -i controlplane
```

Then confirm the gateway appears as connected in the control plane's own console.

---

[← Deploy and verify](./deploy-and-verify.md) &nbsp;|&nbsp; [Production deployment overview](./overview.md)
