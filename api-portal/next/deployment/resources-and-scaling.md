---
title: "Resources & Scaling"
description: "Size and scale a replicated API Portal & MCP Hub deployment on Kubernetes or virtual machines: instance count, resources, spreading across failure domains, and health checks."
canonical_url: https://wso2.com/api-platform/docs/api-portal/deployment/resources-and-scaling/
md_url: https://wso2.com/api-platform/docs/api-portal/deployment/resources-and-scaling.md
tags:
  - cloud
  - api-portal
  - deployment
  - kubernetes
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Resources & Scaling

The portal is a Node.js application that renders pages and serves the Management API. It holds no state of its own, so scaling it out is a matter of instance count — once the database is a shared one.

Two is the practical minimum for availability: one instance means every restart, upgrade, and host failure is an outage. Anything above one requires the external database from [Database Configuration](database-configuration.md).

## Instance count

=== "Kubernetes"

    ```yaml
    api-portal-ui:
      deployment:
        replicaCount: 2
    ```

=== "Virtual machine"

    Run the portal on two or more VMs, each with its own copy of the distribution, all pointed at the same external database and fronted by a load balancer.

    Drop `platform-api` from the `COMPOSE_PROFILES` line in `.env` on each VM so only the portal runs — an external or already-existing Platform API, if you use one at all, is not part of this stack:

    ```
    COMPOSE_PROFILES=api-portal
    ```

    No sticky sessions are needed on the load balancer: sessions live in the shared database, so any VM can serve any request. Plain round-robin is correct.

## Resources

Memory is the resource to watch. Uploads and archive extraction are bounded by the ceilings in [Security Hardening](security-hardening.md#upload-ceilings) — up to 50 MiB of extracted content per archive by default — so an instance handling a theme upload transiently needs more than its steady-state footprint. Size the ceiling above that peak, not against the idle figure.

=== "Kubernetes"

    Set requests on every production pod. Without a CPU request the scheduler can't place pods sensibly and the HPA can't compute utilization at all:

    ```yaml
    api-portal-ui:
      deployment:
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            memory: 1Gi
    ```

    Prefer leaving `limits.cpu` unset. A CPU limit throttles rather than kills, and throttling a single-threaded event loop turns a brief burst into queued latency across every request that pod is serving.

=== "Virtual machine"

    Give each VM at least 2 vCPU and 2 GiB of RAM, then bound the container itself in `docker-compose.yaml` so a runaway upload can't take the host with it:

    ```yaml
    services:
      api-portal:
        mem_limit: 1g
    ```

    Leave CPU unconstrained for the same reason Kubernetes deployments should skip `limits.cpu` — throttling a single-threaded event loop converts a burst into queued latency.

## Spread across failure domains

Instances that share a failure domain buy nothing when that domain fails.

=== "Kubernetes"

    ```yaml
    api-portal-ui:
      deployment:
        topologySpreadConstraints:
          - maxSkew: 1
            topologyKey: kubernetes.io/hostname
            whenUnsatisfiable: DoNotSchedule
            labelSelector:
              matchLabels:
                app.kubernetes.io/name: api-portal-ui
    ```

    `DoNotSchedule` is deliberate: it leaves a pod Pending rather than co-locating it, which surfaces an under-provisioned cluster as a visible unscheduled pod instead of a silently fragile deployment. Use `ScheduleAnyway` only if you would rather have a degraded placement than a Pending pod.

    For spreading across availability zones, add `topology.kubernetes.io/zone` as a second constraint.

=== "Virtual machine"

    Place the VMs in different availability zones, or at minimum on different hypervisor hosts. Two VMs in one zone survive a process crash but not a zone outage.

    Set a restart policy so a crashed container comes back without manual intervention — the shipped compose file already uses `restart: unless-stopped`. Confirm it survived any edits you made.

## Autoscaling and disruption

=== "Kubernetes"

    ```yaml
    api-portal-ui:
      hpa:
        enabled: true
        minReplicas: 2
        maxReplicas: 3
        targetCPUUtilizationPercentage: 80
        targetMemoryUtilizationPercentage: ""   # set a number to also scale on memory
      podDisruptionBudget:
        enabled: true
        minAvailable: 1
    ```

    The chart is fail-fast: it refuses to render an autoscaler for a deployment whose database cannot be shared, rather than scaling one into corruption.

    Two prerequisites, both easy to miss:

    - **`deployment.resources.requests.cpu` must be set.** Utilization is a ratio against the request; with no request there is nothing to divide by, and the HPA reports unknown metrics indefinitely.
    - **metrics-server must be running** in the cluster.

    For the PodDisruptionBudget, set exactly one of `minAvailable` or `maxUnavailable`, and enable it only at two or more replicas. With a single pod, `minAvailable: 1` blocks node drains entirely — the cluster can never evict the only pod, so maintenance stalls.

=== "Virtual machine"

    There is no autoscaler. Capacity is the number of VMs you run, so size for peak rather than average and add VMs when sustained load approaches it.

    For planned maintenance, take one VM out of the load balancer pool, upgrade it, return it, then move to the next. That is the manual equivalent of a rolling update, and it is why two instances is the floor — with one, there is nothing to drain to.

Scaling up in either case adds database connections (`instances × max_open_conns`), so bound the ceiling against what the database can absorb. See [Database Configuration](database-configuration.md#connection-pool-tuning).

## Health checks

The portal answers `/health` at both the container root and under the `/api-portal` prefix, precisely so a health check can use it. It deliberately bypasses the session middleware, so a check every few seconds doesn't write a session row each time.

=== "Kubernetes"

    Point both probes at `/health`:

    ```yaml
    api-portal-ui:
      deployment:
        livenessProbe:
          httpGet: { path: /health, port: http, scheme: HTTPS }
          initialDelaySeconds: 15
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet: { path: /health, port: http, scheme: HTTPS }
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 3
    ```

    If you set `tls.certificateProvider: none`, change both probes' `scheme` from `HTTPS` to `HTTP` — otherwise every probe fails and pods never become ready.

=== "Virtual machine"

    Point the load balancer's health check at `https://<vm>:9543/health` and configure it to remove an instance that fails. Without that, the load balancer keeps sending traffic to a portal that has stopped serving.

    The compose file has no health check for the portal service. Adding one gives Docker the same signal locally:

    ```yaml
    services:
      api-portal:
        healthcheck:
          test: ["CMD", "curl", "-fk", "https://localhost:9543/health"]
          interval: 30s
          timeout: 5s
          retries: 3
    ```

## Related

- [Database Configuration](database-configuration.md): the connection budget your instance count spends
- [Deploy & Verify](deploy-and-verify.md): confirming instances came up healthy
- [Security Hardening](security-hardening.md): the upload ceilings that inform memory sizing