---
title: "Production deployment"
description: "Deploy the API Portal & MCP Hub in production on Kubernetes with Helm or on virtual machines, with an external database and, where you need it, replicated instances."
canonical_url: https://wso2.com/api-platform/docs/api-portal/deployment/overview/
md_url: https://wso2.com/api-platform/docs/api-portal/deployment/overview.md
tags:
  - cloud
  - api-portal
  - deployment
  - kubernetes
  - devops
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Production deployment

This section covers running the API Portal & MCP Hub in production — on Kubernetes with Helm, or on virtual machines with the Compose distribution. Most of it applies whether you run one instance or several: the hardening, the database setup, and the gateway integration are the same either way. High availability is the one dimension that adds requirements, and they are set out below.

The portal is a standalone product. A production deployment needs the portal and a database — nothing else. It authenticates users against your identity provider and reaches gateways by emitting signed webhook events to whatever endpoint you register, so it carries no runtime dependency on a control plane.

Every page here carries **Kubernetes** and **Virtual machine** tabs wherever the mechanics differ. The requirements and failure modes are the same on both; only the delivery changes.

The single-instance walkthrough in [Getting started](../getting-started.md) is the right shape for evaluation and development, not for production.

## Running more than one instance

Replication is what turns a production deployment into a highly available one. What it requires depends on your database.

A production deployment runs against an external database — PostgreSQL or SQL Server. Both support replication, so either works whether you run one instance or several.

!!! note "Change the shipped default"
    The distribution ships pointing at SQLite so the quickstart works with no external dependency. That is an evaluation default; move to PostgreSQL or SQL Server before you deploy. See [Database Configuration](database-configuration.md).

A single production instance is a legitimate deployment — it just has no redundancy, so every restart, upgrade, and host failure is an outage. Everything in this section except [Resources & Scaling](resources-and-scaling.md) applies to it unchanged.

## Prerequisites

=== "Kubernetes"

    | Tool | Requirement |
    |------|-------------|
    | `kubectl` | Configured against your target cluster |
    | `helm` | Version 3+ |
    | `openssl` | Available in your local shell, to generate keys |
    | Database | An external, highly available PostgreSQL or SQL Server the cluster can reach |

    ```bash
    kubectl cluster-info
    kubectl get nodes
    helm version
    ```

    The `api-portal` chart is the product package; values for the portal itself nest under the `api-portal-ui` key. It also carries the Platform API as an optional dependency, on by default for the local-auth quickstart. A deployment that authenticates against an identity provider doesn't need it:

    ```yaml
    platform-api:
      enabled: false
    ```

=== "Virtual machine"

    | Requirement | Detail |
    |---|---|
    | Two or more VMs | Each running Docker with the Compose plugin |
    | Load balancer | Fronting the VMs, health-checking `/health` |
    | `openssl` | Available on the VM you provision secrets from |
    | Database | An external, highly available PostgreSQL or SQL Server every VM can reach |

    Each VM gets its own copy of the distribution. The bundled Platform API and the SQLite default are both switched off for a production deployment — see [Resources & Scaling](resources-and-scaling.md#instance-count) and [Database Configuration](database-configuration.md).

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

=== "Kubernetes"

    The chart deploys a `Service`, not an Ingress.

    ```yaml
    api-portal-ui:
      config:
        server:
          baseUrl: https://portal.example.com
    ```

=== "Virtual machine"

    Point the load balancer at port `9543` on each VM, with its health check on `/health`.

    ```toml
    [api_portal.server]
    base_url = "https://portal.example.com"
    ```

    Set it explicitly whenever the portal sits behind a proxy — it cannot be inferred from the request. See [Change the ports the API Portal uses](../setting-up/ports.md).

Sessions live in the shared database, so no sticky-session configuration is required in either case.

For the portal's own HTTPS listener, see [Security Hardening → TLS configuration](security-hardening.md#tls-configuration).

## Setup steps

Work through these in order — each builds on the last, and the Kubernetes chart's fail-fast guards assume the earlier ones are done:

1. **[Security Hardening](security-hardening.md)** — provision the secrets, supply a real TLS certificate, switch authentication to your identity provider, and tighten the try-it proxy.
2. **[Database Configuration](database-configuration.md)** — create the database, apply the schema, and size the connection pool against your instance count.
3. **[Resources & Scaling](resources-and-scaling.md)** — set resources, spread instances across failure domains, and configure health checks. Skip to the next step if you are running a single instance.
4. **[Deploy & Verify](deploy-and-verify.md)** — install, then confirm the deployment is serving.
5. **[Control Plane Connection](control-plane-connection.md)** — register the webhook subscriber so credentials reach your gateways.

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

Kubernetes adds two: the PodDisruptionBudget is enabled, and CPU requests are set if the HPA is on.

## Related

- [Set up the database](../setting-up/database.md): schema provisioning, TLS, and connection pooling
- [Configuration and environment interpolation](../setting-up/configuration.md): how secrets reach `config.toml` without being written into it
- [Change the ports the API Portal uses](../setting-up/ports.md): moving the stack off its defaults
- [Connect an identity provider](../setting-up/authentication/connect-an-identity-provider.md): the production authentication path