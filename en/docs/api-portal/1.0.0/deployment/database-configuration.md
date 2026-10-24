---
title: "Database Configuration"
description: "Set up the database for a production API Portal & MCP Hub deployment on any platform: schema, password, TLS verification, and connection-pool sizing."
canonical_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/database-configuration/
md_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/database-configuration.md
tags:
  - cloud
  - api-portal
  - deployment
  - database
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Database Configuration

The database is what makes a replicated deployment possible: it holds the catalog, applications, subscriptions, credentials, **user sessions**, and the webhook event queue. Every portal pod reads and writes the same one, which is why no pod needs sticky sessions or a shared filesystem.

This page covers the production-specific setup. For driver choice and the schema itself, see [Set up the database](../setting-up/database.md). For the portal's database configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#configure-the-database), [Deploy on Kubernetes](deploy-on-kubernetes.md#configure-the-database), and [Deploy on OpenShift](openshift.md#configure-the-database).

Use PostgreSQL or SQL Server. The examples below show PostgreSQL; [Set up the database](../setting-up/database.md) has the equivalents for SQL Server, including the driver values and port.

## Create the database

Provision an external, highly available server the cluster can reach, and create a database and a login role for the portal:

```sql
CREATE DATABASE api_portal;
CREATE USER api_portal WITH PASSWORD '<strong-password>';
GRANT ALL PRIVILEGES ON DATABASE api_portal TO api_portal;
```

The portal owns this database outright. If another component of your estate has its own store, keep them separate — the portal never reads or writes anyone else's.

## Apply the schema

Apply the schema before first start:

```bash
psql -h postgres.example.com -U api_portal -d api_portal -f database/schema.postgres.sql
```

A reference copy ships in the distribution under `resources/api-portal/db-scripts/`, and the same file is bundled inside the image. See [Apply the schema](../setting-up/database.md#apply-the-schema-for-postgresql-or-microsoft-sql-server).

## Store the password outside the configuration

The password never appears in `config.toml` or a Helm values file. The container receives it as the environment variable `APIP_AP_DATABASE_PASSWORD`. On Kubernetes and OpenShift it comes from the release's Secret, under the key of the same name. `generate-secrets.sh` doesn't prompt for it: export `APIP_AP_DATABASE_PASSWORD` before you run the script, which writes it into the Secret only when it first creates the Secret. On VMs it comes from `api-platform.env` on each VM. See [Security Hardening → Secrets](security-hardening.md#secrets).

## TLS to the database

Use `verify-full` in production. It is the only mode that validates both the certificate chain and the hostname, so it defends against a redirected connection rather than merely encrypting one:

| Mode | What it checks | Supported by the portal |
|---|---|---|
| `disable` | Nothing — cleartext | Yes |
| `require` | Encryption only; accepts any certificate | No |
| `verify-ca` | Certificate chains to a trusted CA | No |
| `verify-full` | Chain **and** that the hostname matches the certificate | Yes |

The portal supports only `disable` and `verify-full`. With PostgreSQL, it refuses to start with any other `ssl_mode`. With SQL Server, it doesn't check the value: `verify-full` encrypts the connection and verifies the server certificate, and any other value, including a misspelled one, connects without encryption. On VMs, check the value yourself. The Helm chart rejects any other `sslmode` at install time for both databases.

`verify-full` needs the root CA setting (`sslRootCert` in the Helm values, `ssl_root_cert` in `config.toml`) pointing at the CA certificate, mounted into the container.

## Connection pool tuning

Each pod opens its own pool, so the cluster's total connection demand is:

```
replicas × maxOpenConns
```

With the default `maxOpenConns: 50` (`max_open_conns` in `config.toml`), three replicas ask for up to 150 connections. Keep the total comfortably below the server's `max_connections`, leaving headroom for administrative sessions and for a rolling upgrade — during which old and new pods briefly overlap.

| Setting (Helm value / `config.toml`) | Example | Purpose |
|---|---|---|
| `maxOpenConns` / `max_open_conns` | `25` | Upper bound on each instance's pool |
| `minOpenConns` / `min_open_conns` | `2` | Warm connections kept per instance |
| `poolIdleTimeoutMs` / `pool_idle_timeout_ms` | `10000` | |
| `poolConnectionTimeoutMs` / `pool_connection_timeout_ms` | `30000` | |
| `poolRequestTimeoutMs` / `pool_request_timeout_ms` | `30000` | |

The deployment guides show the full block on each platform.

Lowering `maxOpenConns` as you raise the replica count is usually the right trade: more pods each holding a smaller pool. `minOpenConns` keeps a floor of warm connections per pod, so the first request after an idle period doesn't pay connection setup.

## Related

- [Deploy on VMs](deploy-on-vms.md), [Deploy on Kubernetes](deploy-on-kubernetes.md), and [Deploy on OpenShift](openshift.md): the database configuration for each platform
- [Set up the database](../setting-up/database.md): driver choice, the schema, and single-instance setup
- [Resources & Scaling](resources-and-scaling.md): choosing a replica count to size the pool against
- [Security Hardening](security-hardening.md): where the password lives
