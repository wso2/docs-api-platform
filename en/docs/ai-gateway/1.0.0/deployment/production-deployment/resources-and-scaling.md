---
title: "Resources and Scaling"
description: "Size CPU and memory for the AI Gateway controller and runtime, set replica counts, and spread runtime replicas across nodes and zones with pod anti-affinity."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/resources-and-scaling/
md_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/resources-and-scaling.md
tags:
  - ai-gateway
  - production
  - kubernetes
  - scaling
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-09
content_type: "how-to"
---

# Resources and scaling

## Replica counts

AI Gateway 1.0.0 stores controller state in an embedded SQLite database on a `ReadWriteOnce` volume, so the controller runs as a **single replica**. Only the runtime scales horizontally.

```yaml
gateway:
  controller:
    deployment:
      replicaCount: 1
  gatewayRuntime:
    deployment:
      replicaCount: 3
```

What this means in practice:

- **Traffic keeps flowing when the controller is down.** Each runtime holds the configuration it last received over xDiscovery Service (xDS) and keeps serving large language model (LLM) and Model Context Protocol (MCP) requests. A controller restart interrupts artifact deployment, not traffic.
- **Artifact deployment has a single point of failure.** While the controller pod is being rescheduled, no LLM provider, LLM proxy, or MCP proxy can be created, updated, or removed.
- **Protect the volume.** The controller's PersistentVolumeClaim holds every artifact you have deployed. Back it up, and set `helm.sh/resource-policy: keep` on the claim so an uninstall doesn't delete it.

```yaml
gateway:
  controller:
    persistence:
      enabled: true
      size: 1Gi
      annotations:
        helm.sh/resource-policy: keep
```

The chart default of `100Mi` suits a small artifact set. Size it for the number of providers, proxies, and secrets you expect.

!!! note "Controller high availability needs AI Gateway 1.1.0 or later"
    Running more than one controller replica requires an external database, which AI Gateway 1.1.0 adds with PostgreSQL support and 1.2.0 extends to SQL Server. If controller high availability is a requirement, deploy [AI Gateway 1.2.0](../../../1.2.0/setup-and-deployment/production-deployment/index.md) instead.

## Resource limits

Set requests and limits on both components in production. Without them, a traffic spike on the gateway can starve other workloads on the node.

**Gateway Controller:**

The controller handles artifact deployment and configuration distribution, not request traffic, so its load doesn't scale with the number of LLM calls.

```yaml
gateway:
  controller:
    deployment:
      resources:
        requests:
          cpu: 500m
          memory: 1Gi
        limits:
          cpu: 1000m
          memory: 2Gi
```

**Gateway Runtime:**

The runtime carries every request. It runs Envoy and the policy engine in one container. Each guardrail, personally identifiable information (PII) masking rule, and rate-limit policy adds per-request work in that container.

```yaml
gateway:
  gatewayRuntime:
    deployment:
      resources:
        requests:
          cpu: 2000m
          memory: 2Gi
        limits:
          cpu: 4000m
          memory: 2Gi
```

Two things drive runtime CPU on an AI Gateway more than raw request rate:

- **Guardrails.** PII masking, JSON schema validation, and URL guardrails inspect the full request and response bodies, and each one adds work on every call.
- **Payload size.** LLM request and response bodies are far larger than typical representational state transfer (REST) payloads, and body-inspecting policies buffer them in the runtime's memory.

Benchmark with your own proxies and policy set before settling on final numbers. A proxy with several guardrails needs noticeably more CPU per request than one with authentication alone.

## Pod anti-affinity

Anti-affinity rules control how runtime replicas spread across the cluster. Two topology keys matter in production:

| `topologyKey` | Spread scope | What it protects against |
|---|---|---|
| `kubernetes.io/hostname` | Across nodes | Single-node failure |
| `topology.kubernetes.io/zone` | Across availability zones | Full availability zone outage |

Combine both for maximum resilience. Spread across zones at the higher weight, then across nodes within a zone:

```yaml
gateway:
  gatewayRuntime:
    deployment:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app.kubernetes.io/component: gateway-runtime
                topologyKey: topology.kubernetes.io/zone
            - weight: 50
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app.kubernetes.io/component: gateway-runtime
                topologyKey: kubernetes.io/hostname
```

If your cluster spans a single availability zone, use `kubernetes.io/hostname` on its own.

!!! note
    `preferredDuringSchedulingIgnoredDuringExecution` is a soft rule. The scheduler honors it when it can and still places the pod when it can't. Use `requiredDuringSchedulingIgnoredDuringExecution` for a hard guarantee, and accept that pods stay `Pending` when the constraint can't be met.

Pin the controller to the same node pool with `nodeSelector` and `tolerations` so it lands beside the runtimes rather than on a system node.

---

[← Security hardening](./security-hardening.md) &nbsp;|&nbsp; [Tune the gateway for AI traffic →](./ai-workload-tuning.md)
