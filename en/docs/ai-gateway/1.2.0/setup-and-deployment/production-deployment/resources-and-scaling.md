---
title: "Resources and Scaling"
description: "Size CPU and memory for the AI Gateway controller and runtime, spread replicas with anti-affinity, and configure autoscaling and pod disruption budgets."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/resources-and-scaling/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/resources-and-scaling.md
tags:
  - ai-gateway
  - production
  - kubernetes
  - scaling
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Resources and scaling

## Resource limits

Set requests and limits on both components in production. Without them, a traffic spike on the gateway can starve other workloads on the node.

The allocations below match the ones used in the [AI Gateway performance tests](../sizing-and-performance/index.md), so the published throughput and latency figures describe what these settings deliver.

**Gateway Controller:**

The controller handles artifact deployment and configuration distribution, not request traffic, so its load doesn't scale with the number of large language model (LLM) calls.

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

- **Guardrails.** PII masking, JSON schema validation, and URL guardrails inspect the full request and response bodies. The performance tests show measurably lower throughput with PII masking enabled, and lower again with PII masking plus URL and JSON schema guardrails, at the same concurrency.
- **Payload size.** LLM request and response bodies are far larger than typical representational state transfer (REST) payloads, and body-inspecting policies buffer them. See [Tune the gateway for AI traffic](./ai-workload-tuning.md#size-the-body-buffers) for the buffer limits that govern this.

Benchmark with your own proxies and policy set before settling on final numbers. A proxy with several guardrails needs noticeably more CPU per request than one with authentication alone.

## Pod anti-affinity

Anti-affinity rules control how replicas spread across the cluster. Two topology keys matter in production:

| `topologyKey` | Spread scope | What it protects against |
|---|---|---|
| `kubernetes.io/hostname` | Across nodes | Single-node failure |
| `topology.kubernetes.io/zone` | Across availability zones | Full availability zone outage |

Combine both for maximum resilience. Spread across zones at the higher weight, then across nodes within a zone:

```yaml
gateway:
  controller:
    deployment:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app.kubernetes.io/component: controller
                topologyKey: topology.kubernetes.io/zone
            - weight: 50
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app.kubernetes.io/component: controller
                topologyKey: kubernetes.io/hostname
```

If your cluster spans a single availability zone, use `kubernetes.io/hostname` on its own.

Apply the equivalent block to `gateway.gatewayRuntime.deployment.affinity`, matching on `app.kubernetes.io/component: gateway-runtime`.

!!! note
    `preferredDuringSchedulingIgnoredDuringExecution` is a soft rule. The scheduler honors it when it can and still places the pod when it can't. Use `requiredDuringSchedulingIgnoredDuringExecution` for a hard guarantee, and accept that pods stay `Pending` when the constraint can't be met.

The chart also accepts `topologySpreadConstraints` on both components if you prefer even distribution over the weighted preference model.

## Horizontal Pod Autoscaler

The horizontal pod autoscaler (HPA) adjusts replica counts from CPU utilization. The configuration below scales both components on CPU alone. To scale on memory as well, add a memory metric.

Configure the HPA on both components:

```yaml
gateway:
  controller:
    hpa:
      enabled: true
      minReplicas: 2
      maxReplicas: 5
      targetCPUUtilizationPercentage: 70
  gatewayRuntime:
    hpa:
      enabled: true
      minReplicas: 2
      maxReplicas: 5
      targetCPUUtilizationPercentage: 70
```

When the HPA is enabled the chart omits the Deployment's `replicas` field, so `replicaCount` no longer applies.

!!! warning "The controller HPA needs an external database"
    Scaling the controller past one replica requires `storage.type` set to `postgres` or `sqlserver`. SQLite doesn't support concurrent replicas. See [Database configuration](./database-configuration.md).

!!! note
    Keep `minReplicas` at `2` or higher on both components. At `1`, a single pod restart is a full outage.

Autoscaling on CPU reacts more slowly to LLM traffic than to typical REST traffic, because an LLM request occupies a connection for seconds while contributing little CPU. If your load is dominated by long streaming responses, scale on a custom metric such as active connections through `customMetrics` rather than on CPU alone.

## Pod Disruption Budget

A pod disruption budget (PDB) keeps a minimum number of replicas available during voluntary disruptions:

```yaml
gateway:
  controller:
    podDisruptionBudget:
      enabled: true
      minAvailable: 50%
  gatewayRuntime:
    podDisruptionBudget:
      enabled: true
      minAvailable: 50%
```

This protects against voluntary disruptions such as node drains during cluster upgrades, autoscaler scale-down, and planned maintenance.

Set `minAvailable` or `maxUnavailable`, not both.

## Drain in-flight requests

A streaming LLM response can stay open for minutes. The Kubernetes default grace period of 30 seconds cuts those connections off mid-response during a rolling update. Give the runtime longer to drain:

```yaml
gateway:
  gatewayRuntime:
    deployment:
      terminationGracePeriodSeconds: 300
      strategy:
        type: RollingUpdate
        rollingUpdate:
          maxSurge: 1
          maxUnavailable: 0
```

`maxUnavailable: 0` stops the rollout controller from removing an old pod before its replacement is ready.

---

[← Database configuration](./database-configuration.md) &nbsp;|&nbsp; [Tune the gateway for AI traffic →](./ai-workload-tuning.md)
