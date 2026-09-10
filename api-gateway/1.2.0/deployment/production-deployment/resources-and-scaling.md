---
title: "Configure Resources and Scaling"
description: "Set CPU and memory resource limits, pod anti-affinity rules, Horizontal Pod Autoscaler, and Pod Disruption Budget for API Platform Gateway."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/resources-and-scaling/
md_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/resources-and-scaling.md
tags:
  - api-gateway
  - deployment
  - kubernetes
  - production
  - scaling
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Resources & Scaling

## Resource Limits

!!! note
    Always set resource limits in production to prevent runaway resource consumption from affecting other workloads on the node.

**Gateway Controller:**

```yaml
gateway:
  controller:
    deployment:
      resources:
        requests:
          cpu: 250m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 512Mi
```

**Gateway Runtime:**

The runtime hosts Envoy and the policy engine. It processes all API traffic. Allocate generously to avoid throttling under load.

```yaml
gateway:
  gatewayRuntime:
    deployment:
      resources:
        requests:
          cpu: 500m
          memory: 512Mi
        limits:
          cpu: 2000m
          memory: 2Gi
```

## Pod Anti-Affinity

Pod anti-affinity rules control how replicas are spread across your cluster. Two topology keys are most relevant for production:

| `topologyKey` | Spread scope | When to use |
|---|---|---|
| `kubernetes.io/hostname` | Across nodes | Protects against single-node failure |
| `topology.kubernetes.io/zone` | Across availability zones | Protects against full AZ outage |

For maximum resilience, combine both. Spread across zones first (higher weight), then across nodes within a zone:

```yaml
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

If your cluster spans only a single availability zone, use `kubernetes.io/hostname` alone:

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/component: controller
          topologyKey: kubernetes.io/hostname
```

!!! note
    `preferredDuringSchedulingIgnoredDuringExecution` is a soft rule. The scheduler honours it when possible but will still place pods if no suitable node exists. Use `requiredDuringSchedulingIgnoredDuringExecution` if you want a hard guarantee, keeping in mind that pods will remain `Pending` if the constraint cannot be satisfied.

Apply the same anti-affinity configuration to `gateway.gatewayRuntime` to spread runtime replicas across nodes and zones as well.

## Horizontal Pod Autoscaler & Pod Disruption Budget

### Horizontal Pod Autoscaler

HPA automatically adjusts the number of replicas based on CPU and memory utilization. Apply the following configuration to both `gateway.controller` and `gateway.gatewayRuntime`:

```yaml
hpa:
  enabled: true
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: ""
  customMetrics: []
  behavior: {}
```

!!! note
    Setting `minReplicas: 2` ensures at least two replicas are always running, which is required for high availability. Do not set this to `1` in production.

### Pod Disruption Budget

A PDB guarantees that a minimum number of replicas remain available during voluntary disruptions:

```yaml
podDisruptionBudget:
  enabled: true
  minAvailable: 50%
  maxUnavailable: ""
```

The PDB protects against:

- Node drain operations during cluster upgrades
- Cluster autoscaling scale-down events
- Voluntary pod evictions triggered by resource pressure
- Planned maintenance operations

---

[← Database Configuration](./database-configuration.md) &nbsp;|&nbsp; [Deploy & Verify →](./deploy-and-verify.md)