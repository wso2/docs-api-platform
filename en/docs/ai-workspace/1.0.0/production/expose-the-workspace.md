---
title: "Expose AI Workspace"
description: "Publish AI Workspace on a public hostname with an ingress resource or a reverse proxy, expose the control plane for gateways, and keep redirect URLs and CORS consistent."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/expose-the-workspace/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/expose-the-workspace.md
tags:
  - ai-workspace
  - production
  - ingress
  - networking
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Expose AI Workspace

Two addresses leave your network in a production deployment: the workspace URL that people open in a browser, and the control plane address that AI gateways connect to. They serve different audiences, so expose them differently.

| Address | Audience | Typical exposure |
|---------|----------|------------------|
| Workspace URL, such as `https://workspace.example.com/ai-workspace` | People, through a browser | Public, or reachable from your corporate network |
| Control plane address, such as `platform-api.example.com:9243` | AI gateways | Restricted to the networks your gateways run in |

Nothing else needs an address. In the default deployment, the browser doesn't call the Platform API. The backend for frontend (BFF) proxies every call server-to-server, so the Platform API needs no public route for the interface to work. A browser application other than AI Workspace can call the Platform API directly, which needs cross-origin resource sharing (CORS). See [Leave CORS off unless you need it](#step-4-leave-cors-off-unless-you-need-it).

## The path prefix is fixed

AI Workspace serves everything under `/ai-workspace`:

| Path | Serves |
|------|--------|
| `/ai-workspace/` | The single-page application and its client-side routes |
| `/ai-workspace/api/*` | The BFF's own API, including session, login, logout, and the OIDC callback |
| `/ai-workspace/proxy/*` | The reverse proxy hop to the Platform API |
| `/healthz` | The health endpoint, at the origin root |
| `/` | A redirect to `/ai-workspace/` |

The application bundle sets the prefix at image build time, so it isn't configurable. That simplifies your routing: one rule routes the whole application with no path rewriting, and several portals can share a hostname without their routes overlapping.

!!! warning "Don't rewrite the path"
    A rule that strips `/ai-workspace` before forwarding breaks every asset request, because the bundle references its assets by absolute path. Forward the prefix as-is.

## Step 1: Publish the workspace URL

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#expose-step-1-publish-the-workspace-url), [Deploy on Kubernetes](deploy-on-kubernetes.md#expose-step-1-publish-the-workspace-url), and [Deploy on OpenShift](openshift.md#routes).

## Step 2: Expose the control plane for gateways

A gateway connects to the Platform API directly over HTTPS and WebSocket. It doesn't go through AI Workspace, so it needs its own reachable address.

Match the exposure to where your gateways run:

- **Gateways in the same cluster or on the same host:** no external route. Gateways use the in-cluster Service address or the Compose network name.
- **Gateways elsewhere in your network:** an internal load balancer, or a private DNS name resolving to the host.
- **Gateways outside your network:** a public address restricted by source range, with the registration token as the credential.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#expose-step-2-expose-the-control-plane-for-gateways), [Deploy on Kubernetes](deploy-on-kubernetes.md#expose-step-2-expose-the-control-plane-for-gateways), and [Deploy on OpenShift](openshift.md#routes).

!!! note "Two keys that aren't interchangeable"
    `controlplane_host` is display-only. AI Workspace never connects to it. Instead, it substitutes the value into the setup commands it shows an administrator. A wrong value leaves the workspace working and breaks the gateway, which then can't register. The BFF's own hop uses `[ai_workspace.control_plane] url` instead. See [Two keys that aren't interchangeable](../setting-up/ports.md#two-keys-that-arent-interchangeable).

## Step 3: Match the redirect URLs to the public hostname

In OIDC mode, both redirect URLs carry the public hostname and the path prefix. They must match what you registered on the identity provider application, character for character.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#step-6-write-the-configuration), [Deploy on Kubernetes](deploy-on-kubernetes.md#step-6-write-the-configuration), and [Deploy on OpenShift](openshift.md#production-step-6).

The callback is a BFF route, not a page in the application. Register `/ai-workspace/api/auth/callback` on the identity provider. Registering the sign-in page instead makes the code exchange fail. See [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md).

## Step 4: Leave CORS off unless you need it

The Platform API's `allowed_origins` list is empty by default, which disables cross-origin access. Because the BFF proxies browser traffic same-origin, that default is correct for a standard deployment.

Set it only when a browser application other than AI Workspace calls the Platform API directly. List the exact origins.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#step-6-write-the-configuration), [Deploy on Kubernetes](deploy-on-kubernetes.md#step-6-write-the-configuration), and [Deploy on OpenShift](openshift.md#production-step-6).

A wildcard is rejected at startup, so the service can't run with credentialed cross-origin access open to every origin.

## Verify

Confirm each address resolves and answers:

```bash
# The workspace, from a client network.
curl -sSI https://workspace.example.com/ai-workspace/ | head -1

# The health endpoint, which sits at the origin root.
curl -sS https://workspace.example.com/healthz

# The control plane, from a host on the same network as your gateways.
curl -sSI https://platform-api.example.com:9243/health | head -1
```

Then open the workspace in a browser and sign in. If the page loads but assets return `404`, something in the path is rewriting the prefix.

## Related

- [Change the ports AI Workspace uses](../setting-up/ports.md): moving the services off `9643` and `9243`
- [Secure traffic with TLS](tls.md): certificates for the listeners behind these routes
- [Run in high availability](high-availability.md): session affinity once you run more than one replica
- [Connect AI gateways in production](connect-gateways.md): what a gateway does with the control plane address
