---
title: "Production Deployment Overview"
description: "Plan a production deployment of API Platform AI Gateway 1.0.0 on Kubernetes with Helm: hardened security, replicated runtimes, and a single controller."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/overview/
md_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/overview.md
tags:
  - ai-gateway
  - production
  - deployment
  - kubernetes
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-09
content_type: "concept"
---

# Production deployment overview

This section is for platform engineers and site reliability engineers who run API Platform AI Gateway 1.0.0 for an organization. It covers a hardened Helm deployment on Kubernetes:

- Encryption and Transport Layer Security (TLS).
- Replicated gateway runtimes.
- The tuning that large language model (LLM) and Model Context Protocol (MCP) traffic needs.

For the other ways to run the gateway, see [Immutable Gateway](../deployment-modes/immutable-gateway.md) and [Kubernetes deployment modes](../deployment-modes/kubernetes/overview.md).

!!! info "Version-pinned instructions"
    Every command and configuration key on these pages is taken from the `ai-gateway/v1.0.0` release tag and Helm chart `1.0.1`. Chart fields change between releases, so follow the pages for the AI Gateway version you deploy.

!!! important "What 1.0.0 can and can't do in production"
    AI Gateway 1.0.0 runs the controller as a **single replica**, because it stores its state in an embedded SQLite database. Gateway runtimes replicate freely, so LLM and MCP traffic survives node and pod failures, but artifact deployment pauses while the controller restarts.

    Three capabilities that a highly available deployment usually depends on arrive in later releases:

    - **An external database**, which lets several controller replicas share state. Added in AI Gateway 1.1.0 with PostgreSQL, extended in 1.2.0 with SQL Server.
    - **Horizontal Pod Autoscaler and Pod Disruption Budget support in the chart.** Added in the 1.1.x chart line.
    - **[AI Workspace](../../../../ai-workspace/1.0.0/overview.md) governance**, which works with gateway version 1.2 and above.

    Deploy the release that covers what you need:

    - For an external database, or for chart support for the Horizontal Pod Autoscaler and Pod Disruption Budget, deploy [AI Gateway 1.1.0](../../../1.1.0/deployment/production-deployment/overview.md) or later.
    - For SQL Server support or AI Workspace governance, deploy [AI Gateway 1.2.0](../../../1.2.0/setup-and-deployment/production-deployment/index.md).

## What you deploy

| Part | What it does | Where it runs |
|------|--------------|---------------|
| Gateway Controller | Accepts LLM provider, LLM proxy, and MCP proxy artifacts, persists them to its SQLite volume, and distributes runtime configuration over xDiscovery Service (xDS). | Your cluster, one replica |
| Gateway Runtime | Envoy plus the policy engine in one container. Routes traffic to LLM providers and MCP servers, and enforces guardrails, rate limits, and other policies. | Your cluster, several replicas |

Each runtime holds the configuration it last received from the controller, which is why traffic continues to be served during a controller restart.

## Cluster topology

Use at least two worker nodes so that no single node failure takes out every runtime replica. The recommended minimum production topology separates system and gateway workloads into dedicated node pools:

| Node pool | Purpose | Recommended size |
|-----------|---------|------------------|
| `systempool` | Kubernetes system workloads | 1 to 2 nodes |
| `gatewaypool` | Gateway controller and runtime | Minimum 2 nodes |

### Ingress configuration

The chart creates Kubernetes `Service` objects for the Gateway Runtime and the controller REST API. It doesn't create an Ingress Controller or Ingress resources, so route external access with the ingress solution you already run.

At a minimum, expose the Gateway Runtime service on port **8443** (HTTPS) for inbound LLM and MCP traffic. Expose the controller REST API service on port **9090** as well if developers deploy artifacts directly to the gateway through the management API. Keep the controller and runtime admin ports off any external route, and reach them with `kubectl port-forward` when you need them.

## Before you begin

Install and configure these tools first:

| Tool | Requirement |
|------|-------------|
| `kubectl` | Configured against your target cluster |
| `helm` | Version 3.18 or above |
| `openssl` | Available in your local shell |

Verify your environment:

```bash
kubectl cluster-info
kubectl get nodes
helm version
```

### Start with the base values file

Download the `values.yaml` that ships with the 1.0.0 gateway chart and use it as the starting point. Every field referenced in this section lives in this file.

```bash
curl -o values.yaml https://raw.githubusercontent.com/wso2/api-platform/refs/tags/ai-gateway/v1.0.0/kubernetes/helm/gateway-helm-chart/values.yaml
```

### Pin the image versions

Set the controller and runtime image tags to 1.0.0 before changing anything else.

```yaml
gateway:
  controller:
    image:
      tag: "1.0.0"
  gatewayRuntime:
    image:
      tag: "1.0.0"
```

!!! note
    Use the same tag for both components. Mixed versions between the controller and the runtime aren't supported.

!!! note "WSO2 subscription users"
    With a WSO2 subscription, use image tags that carry the U2 update version as a fourth digit, such as `1.0.0.1`, instead of the base `1.0.0` release. The fourth digit carries patch-level updates delivered through the WSO2 private registry. Create a `docker-registry` Secret for `registry.wso2.com` in the install namespace and reference it through `imagePullSecrets` on each component.

!!! warning "Leave development mode off"
    The chart exposes `gateway.developmentMode`, which relaxes security checks including the mandatory at-rest encryption key. Keep it at its default of `false` in every deployment that carries real traffic or real credentials.

## Setup steps

Work through these pages in order:

1. [Security hardening](./security-hardening.md) — encryption keys, TLS, and authentication
2. [Resources and scaling](./resources-and-scaling.md) — replica counts, limits, and anti-affinity
3. [Tune the gateway for AI traffic](./ai-workload-tuning.md) — streaming timeouts, guardrails, and cost tracking
4. [Deploy and verify](./deploy-and-verify.md) — install the chart and route a live LLM request through it
5. [Connect to a control plane](./control-plane-connection.md) — optional central management
