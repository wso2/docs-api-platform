---
title: "Resources & Scaling"
description: "Size and scale a replicated API Portal & MCP Hub deployment on any platform: instance count, resources, spreading across failure domains, and health checks."
canonical_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/resources-and-scaling/
md_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/resources-and-scaling.md
tags:
  - cloud
  - api-portal
  - deployment
  - kubernetes
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Resources & Scaling

The portal is a Node.js application that renders pages and serves the Management API. It holds no state of its own, so scaling it out is a matter of instance count — once the database is a shared one.

Two is the practical minimum for availability: one instance means every restart, upgrade, and host failure is an outage. Anything above one requires the external database from [Database Configuration](database-configuration.md).

This page explains the sizing and scaling decisions. For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#instance-count), [Deploy on Kubernetes](deploy-on-kubernetes.md#instance-count), and [Deploy on OpenShift](openshift.md#instance-count).

## Instance count

Run at least two instances, all pointed at the same external database. On Kubernetes and OpenShift, that is the Deployment's replica count. On VMs, it is the number of VMs you run, each with its own copy of the distribution and fronted by a load balancer. No sticky sessions are needed: sessions live in the shared database, so any instance can serve any request.

## Resources

Memory is the resource to watch. Uploads and archive extraction are bounded by the ceilings in [Security Hardening](security-hardening.md#upload-ceilings) — up to 50 MiB of extracted content per archive by default — so an instance handling a theme upload transiently needs more than its steady-state footprint. Size the ceiling above that peak, not against the idle figure.

Leave CPU unconstrained. A CPU limit throttles rather than kills, and throttling a single-threaded event loop turns a brief burst into queued latency across every request that instance is serving. On Kubernetes and OpenShift, set CPU requests so the scheduler and the autoscaler can work, but leave `limits.cpu` unset.

## Spread across failure domains

Instances that share a failure domain buy nothing when that domain fails. On Kubernetes and OpenShift, spread pods across nodes, and across availability zones where the cluster spans them, with topology spread constraints. On VMs, place the VMs in different availability zones, or at minimum on different hypervisor hosts.

## Autoscaling and disruption

On Kubernetes and OpenShift, the chart can run a HorizontalPodAutoscaler and a PodDisruptionBudget. It refuses to render an autoscaler for a deployment whose database cannot be shared, rather than scaling one into corruption. On VMs there is no autoscaler: capacity is the number of VMs you run, and planned maintenance means draining one VM at a time from the load balancer.

Scaling up on any platform adds database connections (`instances × max_open_conns`), so bound the ceiling against what the database can absorb. See [Database Configuration](database-configuration.md#connection-pool-tuning).

## Health checks

The portal answers `/health` at both the container root and under the `/api-portal` prefix, precisely so a health check can use it. It deliberately bypasses the session middleware, so a check every few seconds doesn't write a session row each time.

On Kubernetes and OpenShift, point the liveness and readiness probes at `/health`. On VMs, point the load balancer's health check at `/health` and configure it to remove an instance that fails. The deployment guides show both.

## Related

- [Deploy on VMs](deploy-on-vms.md), [Deploy on Kubernetes](deploy-on-kubernetes.md), and [Deploy on OpenShift](openshift.md): the scaling configuration for each platform
- [Database Configuration](database-configuration.md): the connection budget your instance count spends
- [Verify & Upgrade](deploy-and-verify.md): confirming instances came up healthy
- [Security Hardening](security-hardening.md): the upload ceilings that inform memory sizing
