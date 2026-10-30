---
title: "Production deployment"
description: "Deploy the API Portal & MCP Hub in production on VMs, Kubernetes, or OpenShift, with an external database and, where you need it, replicated instances."
canonical_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/overview/
md_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/overview.md
tags:
  - cloud
  - api-portal
  - deployment
  - kubernetes
  - devops
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Production deployment

This section covers running the API Portal & MCP Hub in production — on Kubernetes or OpenShift with Helm, or on virtual machines with the Compose distribution. Most of it applies whether you run one instance or several: the hardening, the database setup, and the gateway integration are the same either way. High availability is the one dimension that adds requirements, and they are set out below.

The portal is a standalone product. A production deployment needs the portal and a database — nothing else. It authenticates users against your identity provider and reaches gateways by emitting signed webhook events to whatever endpoint you register, so it carries no runtime dependency on a control plane.

The section has two parts. The Production Readiness pages explain what each part of a production deployment requires, independent of where you run it: [Security Hardening](security-hardening.md), [Database Configuration](database-configuration.md), [Resources & Scaling](resources-and-scaling.md), [Control Plane Connection](control-plane-connection.md), and [Verify & Upgrade](deploy-and-verify.md). The deployment guides then apply them end to end, with the configuration for one platform: [Deploy on VMs](deploy-on-vms.md), [Deploy on Kubernetes](deploy-on-kubernetes.md), and [Deploy on OpenShift](openshift.md). The requirements and failure modes are the same on every platform; only the delivery changes.

The single-instance walkthrough in [Getting started](../getting-started.md) is the right shape for evaluation and development, not for production.

## Running more than one instance

Replication is what turns a production deployment into a highly available one. What it requires depends on your database.

A production deployment runs against an external database — PostgreSQL or SQL Server. Both support replication, so either works whether you run one instance or several.

!!! note "Change the shipped default"
    The distribution ships pointing at SQLite so the quickstart works with no external dependency. That is an evaluation default; move to PostgreSQL or SQL Server before you deploy. See [Database Configuration](database-configuration.md).

A single production instance is a legitimate deployment — it just has no redundancy, so every restart, upgrade, and host failure is an outage. Everything in this section except [Resources & Scaling](resources-and-scaling.md) applies to it unchanged.

## Prerequisites

Each deployment guide lists the tools and infrastructure it needs: [Deploy on VMs](deploy-on-vms.md#prerequisites), [Deploy on Kubernetes](deploy-on-kubernetes.md#prerequisites), and [Deploy on OpenShift](openshift.md#step-1). In every case, a production deployment needs an external, highly available PostgreSQL or SQL Server that every instance can reach.

## Architecture

A production deployment consists of two components:

| Component | Description |
|---|---|
| **API Portal & MCP Hub** | Serves the catalog, the admin UI, and the Management API. Stateless apart from what it writes to the database, so it replicates freely once that database is shared. |
| **Database** | The shared source of truth: catalog artifacts, applications, subscriptions, credentials, user sessions, and the webhook event queue. |

Two things sit outside the deployment and are integrations rather than components: your **identity provider**, which the portal redirects to for login, and a **webhook subscriber**, which receives the signed credential events the portal emits. Most estates point the subscriber at an existing Platform API that already fronts their gateways — but that Platform API belongs to that estate, not to this deployment, and the portal neither installs nor manages it. See [Control Plane Connection](control-plane-connection.md).

Portal replicas hold no state of their own. Every request can land on any pod, which is what makes a plain round-robin Service sufficient — no sticky sessions, no shared filesystem.

### What makes a replica interchangeable

Two things, each worth knowing because each one breaks in a recognizable way if you get the configuration wrong:

**Sessions live in the database, not in memory.** The portal writes sessions through a SQL session store shared by every dialect, so a user who logs in against one instance stays logged in when the next request lands on another.

**Webhook dispatch is claimed with row locks.** Each replica runs its own webhook dispatcher and delivery worker. They claim work with `SELECT ... FOR UPDATE SKIP LOCKED`, scoped to the organization, so two replicas never dispatch the same event. Claims that die mid-flight are recovered: a delivery stuck `IN_FLIGHT` for more than five minutes is marked `FAILED` and re-enters the queue on the next cycle.

## Topology

Run at least two instances, in different failure domains — separate worker nodes on Kubernetes, separate availability zones or hypervisor hosts on VMs. Two instances sharing a domain survive a process crash but not the loss of that domain. See [Resources & Scaling](resources-and-scaling.md#spread-across-failure-domains).

## Fronting the portal

Nothing in the deployment provisions a public entry point — bring your own ingress controller or load balancer. Two portal-specific details matter, on either substrate:

- **The portal serves under the `/api-portal` path prefix.** The origin root only redirects there. Route `/api-portal/*` through, and don't strip the prefix — the session cookie is scoped to that exact path, and a mismatch is a silent login loop rather than a visible error.
- **Set the public base URL.** It is what the portal embeds in generated AI-agent prompts. Behind a proxy it can't be inferred from the request, and a stale value produces prompts pointing at an unreachable host.

On Kubernetes and OpenShift, the chart deploys a `Service`, not an Ingress, and you set the base URL in the Helm values. On VMs, the load balancer points at port `9543` on each VM, and you set the base URL in `config.toml`. See the fronting step in [Deploy on VMs](deploy-on-vms.md#front-the-portal), [Deploy on Kubernetes](deploy-on-kubernetes.md#front-the-portal), and [Deploy on OpenShift](openshift.md#step-6).

Sessions live in the shared database, so no sticky-session configuration is required on any platform.

For the portal's own HTTPS listener, see [Security Hardening → TLS configuration](security-hardening.md#tls-configuration).

## Setup steps

1. **Read the Production Readiness pages** — what each part of a production deployment requires, independent of the platform:
    - **[Security Hardening](security-hardening.md)** — the secrets, a real TLS certificate, identity-provider authentication, authorization, and the try-it proxy.
    - **[Database Configuration](database-configuration.md)** — create the database, apply the schema, and size the connection pool against your instance count.
    - **[Resources & Scaling](resources-and-scaling.md)** — resources, spreading instances across failure domains, and health checks. Skip it if you are running a single instance.
    - **[Control Plane Connection](control-plane-connection.md)** — the webhook subscriber that gets credentials to your gateways.
    - **[Verify & Upgrade](deploy-and-verify.md)** — the checks and cautions that hold on every platform.
2. **Follow the guide for your platform** — each one works through the steps in order, with the configuration for that platform: [Deploy on VMs](deploy-on-vms.md), [Deploy on Kubernetes](deploy-on-kubernetes.md), or [Deploy on OpenShift](openshift.md). On Kubernetes and OpenShift, the chart's fail-fast guards assume the earlier steps are done.

## Production checklist

Before you take traffic:

- [ ] The database is an external, highly available PostgreSQL or SQL Server, with full TLS verification on
- [ ] The encryption key and session secret are identical on every instance
- [ ] Connection pool sized for `instances × max_open_conns`
- [ ] No `[api_portal.design_mode]` block in `config.toml` — that is a local authoring mode, not a deployment option
- [ ] Authentication mode is `idp`, with the client secret delivered out of band
- [ ] Authorization is enabled
- [ ] The public base URL matches the real origin, and the proxy preserves `/api-portal`
- [ ] The TLS certificate is a real one, not the self-signed pair from setup
- [ ] Instances spread across failure domains, with a health check on `/health`

Kubernetes and OpenShift add two: the PodDisruptionBudget is enabled, and CPU requests are set if the HPA is on.

## Related

- [Set up the database](../setting-up/database.md): schema provisioning, TLS, and connection pooling
- [Configuration and environment interpolation](../setting-up/configuration.md): how secrets reach `config.toml` without being written into it
- [Change the ports the API Portal uses](../setting-up/ports.md): moving the stack off its defaults
- [Connect an identity provider](../setting-up/authentication/connect-an-identity-provider.md): the production authentication path