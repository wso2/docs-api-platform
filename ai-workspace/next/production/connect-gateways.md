---
title: "Connect AI gateways in production"
description: "Register production AI gateways with the control plane: reachable addresses, registration tokens kept out of shell history, certificate trust, and registration checks."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/connect-gateways/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/connect-gateways.md
tags:
  - ai-workspace
  - production
  - ai-gateway
  - networking
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Connect AI gateways in production

A gateway is the data plane. It routes traffic between your applications and large language model (LLM) providers, and it holds a long-lived connection to the Platform API for configuration updates.

The registration procedure is the same in production as anywhere else, and [Set up an AI Gateway](../ai-gateways/setting-up.md) covers it. This page covers what a production deployment adds:

- Reachability across networks.
- Handling the registration token as a credential.
- Certificate trust.
- The checks the control plane runs at registration.

## How a gateway reaches the control plane

The gateway connects to the Platform API directly. It doesn't go through AI Workspace, and AI Workspace doesn't call the gateway.

That connection direction explains most of the problems you meet here:

- The address has to resolve and connect **from the gateway's network**, not from the workspace's.
- The connection carries both HTTPS and WebSocket traffic, so anything in between has to pass WebSocket upgrades and tolerate long-lived connections.
- The certificate the Platform API presents at that address has to chain to a certificate authority (CA) the gateway trusts.

Before you register anything, confirm reachability from a host on the same network as the gateway:

```bash
curl -sSI https://platform-api.example.com:9243/health | head -1
```

A timeout usually indicates a firewall or routing problem. A certificate error usually indicates a trust problem, though a hostname mismatch or an expired certificate produces one too. For the full set of causes and their fixes, see the symptom table in [Step 4](#step-4-keep-certificate-verification-on). Fix the cause at the source rather than turning verification off.

## Step 1: Set the address the workspace shows

AI Workspace fills the setup commands in the **Get Started** section from one configuration key. The key is display-only: nothing in AI Workspace connects to it. A wrong value leaves the workspace working normally and leaves every gateway unable to register.

=== "Virtual machine"
    ```toml
    # configs/config.toml
    [ai_workspace.gateway]
    controlplane_host = "platform-api.example.com:9243"
    ```

=== "Kubernetes"
    ```yaml
    ai-workspace-ui:
      config:
        gateway:
          controlplaneHost: platform-api.example.com:443
    ```

    Use `443` when an ingress serves that hostname on the standard port, and the Service port when you expose it directly.

Write it as a bare `host:port` with no scheme and no path. See [Expose the control plane for gateways](expose-the-workspace.md#step-2-expose-the-control-plane-for-gateways) for the route itself.

## Step 2: Create the gateway and capture its token

Create the gateway in AI Workspace under **AI Gateways**, then copy its registration token.

!!! danger "The token is shown once and is single-use"
    Store it in your secret manager the moment you see it. If you lose it, or need to reinstall the gateway, click **Reconfigure** to issue a new one. Reconfiguring revokes the previous token and disconnects the running gateway, so plan it as a change with downtime for that gateway.

Treat the token as a credential in transit too. A value passed on a command line lands in your shell history and in the host's process list.

## Step 3: Install the gateway runtime

=== "Virtual machine"
    Download the gateway distribution and run its setup script, which provisions the at-rest encryption key, the router certificate, and the controller admin credentials. The gateway has no demo mode and stops if any of them is missing.

    Put the control plane address and the token in `api-platform.env`, which Compose loads through its `env_file:` directive, rather than on the command line:

    ```bash
    umask 077
    read -rsp "Registration token: " GW_TOKEN && echo
    printf 'APIP_GW_CONTROLLER_CONTROLPLANE_HOST=%s\n' 'platform-api.example.com:9243' >> api-platform.env
    printf 'APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=%s\n' "$GW_TOKEN" >> api-platform.env
    unset GW_TOKEN
    chmod 600 api-platform.env
    ```

    Then start the gateway:

    ```bash
    docker compose up -d
    ```

    Keep `api-platform.env` out of source control and off shared hosts. It holds the token that authorizes this gateway to the control plane.

=== "Kubernetes"
    Create the at-rest encryption key Secret first. At-rest encryption is mandatory, nothing is generated for you, and the chart doesn't render without the key:

    ```bash
    umask 077
    openssl rand 32 > default-aesgcm256-v1.bin
    kubectl -n <gateway-namespace> create secret generic gateway-encryption-keys \
      --from-file=default-aesgcm256-v1.bin=default-aesgcm256-v1.bin
    shred -u default-aesgcm256-v1.bin
    ```

    Put the registration token in its own Secret. Read it into a protected file rather than passing it with `--set` or `--from-literal`. Either of those records the token in your shell history and in the host's process list:

    ```bash
    umask 077
    read -rsp "Registration token: " GW_TOKEN && echo
    printf '%s' "$GW_TOKEN" > registration_token
    unset GW_TOKEN

    kubectl -n <gateway-namespace> create secret generic gateway-registration-token \
      --from-file=token=registration_token

    shred -u registration_token
    ```

    Then install the chart, referencing both Secrets by name:

    ```bash
    helm install gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
      --version <gateway-chart-version> -n <gateway-namespace> \
      --set gateway.controller.encryptionKeys.enabled=true \
      --set gateway.controller.encryptionKeys.secretName=gateway-encryption-keys \
      --set gateway.controller.controlPlane.host="platform-api.example.com:443" \
      --set gateway.controller.controlPlane.token.secretName=gateway-registration-token \
      --set gateway.controller.controlPlane.token.key=token
    ```

    `controlPlane.host` is used as the HTTPS and WebSocket authority, so include a non-default port in the value. Port `443` is assumed when you leave it out.

    Use the chart version matching the gateway version the **Get Started** section offers.

## Step 4: Keep certificate verification on

The gateway verifies the Platform API's certificate by default, and the connection carries the registration token and every configuration update. Leave the verification on.

The gateway configuration exposes an `insecure_skip_verify` flag under its control plane settings for local development against a self-signed certificate. In production, a certificate error means one of these, and each has a proper fix:

| Symptom | Cause | Fix |
|---------|-------|-----|
| Unknown authority | The Platform API uses a private CA the gateway doesn't trust | Add your CA bundle to the gateway host's trust store |
| Hostname mismatch | The certificate doesn't cover the address in `controlPlane.host` | Reissue the certificate with that hostname in its subject alternative name |
| Expired certificate | Renewal didn't run | Fix renewal; see [Secure traffic with TLS](tls.md) |

## Step 5: Turn on registration checks

The Platform API can verify what a gateway reports at registration. Both checks are off by default. Turning them on stops a gateway running an unexpected version or reporting an unexpected type from joining the control plane.

=== "Virtual machine"
    ```toml
    # configs/config.toml
    [platform_api.gateway]
    enable_version_verification            = true
    enable_functionality_type_verification = true
    ```

=== "Kubernetes"
    ```yaml
    platform-api:
      config:
        gateway:
          enableVersionVerification: true
          enableFunctionalityTypeVerification: true
    ```

Enable version verification only once your gateway versions match what the control plane expects. Turning it on while a gateway runs a different version blocks that gateway from reconnecting.

Review the deployment limit at the same time. `max_per_api_gateway` caps how many deployments one gateway holds, at `20` by default. Raise it deliberately, to match what you sized your gateways for.

## Step 6: Run gateways in high availability

A gateway is part of your request path, so it needs redundancy of its own:

- Run at least two gateway instances per environment, behind a load balancer that health-checks them.
- Place gateways close to the applications that call them, rather than close to the control plane. A gateway keeps routing traffic while the control plane is unreachable, but it stops receiving configuration updates.
- Give each environment its own gateway and its own registration token, so revoking one doesn't affect another.

## Verify

The gateway detail page in AI Workspace shows the status changing from **Not Active** to **Active** once the runtime connects.

If it stays inactive, work through this in order:

1. **Reachability.** From the gateway host, `curl -sSI https://<controlplane-host>/health`. A timeout is a network problem, not a configuration one.
2. **The address.** Confirm the value in the gateway's configuration is a bare `host:port` reachable from that host, with no scheme and no path.
3. **Certificate trust.** Look for a verification error in the gateway controller logs.
4. **The token.** A token that was already used, or revoked by a **Reconfigure**, is rejected. Issue a new one and reinstall.
5. **Registration checks.** If you enabled version verification, confirm the gateway version is one the control plane accepts.

## Related

- [Set up an AI Gateway](../ai-gateways/setting-up.md): the full registration procedure and every install method
- [Expose AI Workspace](expose-the-workspace.md): the route that makes the control plane reachable
- [Change the ports AI Workspace uses](../setting-up/ports.md#two-keys-that-arent-interchangeable): why the two control plane keys aren't interchangeable