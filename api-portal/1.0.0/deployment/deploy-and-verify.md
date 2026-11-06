---
title: "Verify & Upgrade"
description: "Confirm a production API Portal & MCP Hub deployment is serving, shares sessions, and dispatches each event once, and what to check when you upgrade."
canonical_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/deploy-and-verify/
md_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/deploy-and-verify.md
tags:
  - cloud
  - api-portal
  - deployment
  - kubernetes
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Verify & Upgrade

This page covers the checks and cautions that apply on every platform, after you install the portal. For the install, verification, and upgrade commands on each platform, see [Deploy on VMs](deploy-on-vms.md#deploy), [Deploy on Kubernetes](deploy-on-kubernetes.md#deploy), and [Deploy on OpenShift](openshift.md#step-6).

## Verify

Confirm every instance is serving, not just that the deploy command succeeded. The deployment guides show the per-instance checks on each platform.

Then verify the two things a single-instance smoke test cannot catch, on any platform:

**Sessions are shared.** Log in through the load balancer or ingress, then stop the instance that served the login. The next request should land on another instance with the session intact. If you are logged out instead, the instances are not reading the same session table — check that every instance points at the same external database and resolves the same encryption key and session secret.

**Only one instance dispatches each event.** Trigger a credential change and confirm the registered subscriber receives exactly one delivery, not one per instance. See [Control Plane Connection](control-plane-connection.md#in-a-replicated-deployment).

## Upgrade

Upgrade one instance at a time so the others keep serving: a rolling update on Kubernetes and OpenShift, and one VM at a time, drained from the load balancer, on VMs. The deployment guides show the commands and rollback for each platform.

Two things hold on every platform:

- **Old and new instances overlap during a rolling upgrade**, so peak database connections briefly exceed `instances × max_open_conns`. Leave headroom for it.
- **A rollback reverts configuration, not database schema changes.** Check the release notes before upgrading across a version that migrates the schema.

## Related

- [Deploy on VMs](deploy-on-vms.md), [Deploy on Kubernetes](deploy-on-kubernetes.md), and [Deploy on OpenShift](openshift.md): installing and upgrading on each platform
- [Security Hardening](security-hardening.md): what the secrets provisioning covers
- [Resources & Scaling](resources-and-scaling.md): the instance count and health checks installed here
- [Control Plane Connection](control-plane-connection.md): the post-install webhook registration