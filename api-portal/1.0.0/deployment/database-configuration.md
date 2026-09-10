---
title: "Database Configuration"
description: "Provision the database for a production API Portal & MCP Hub deployment: schema, password Secret, Helm values, TLS verification, and connection-pool sizing across replicas."
canonical_url: https://wso2.com/api-platform/docs/api-portal/deployment/database-configuration/
md_url: https://wso2.com/api-platform/docs/api-portal/deployment/database-configuration.md
tags:
  - cloud
  - api-portal
  - deployment
  - database
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Database Configuration

The database is what makes a replicated deployment possible: it holds the catalog, applications, subscriptions, credentials, **user sessions**, and the webhook event queue. Every portal pod reads and writes the same one, which is why no pod needs sticky sessions or a shared filesystem.

This page covers the production-specific setup. For driver choice and the schema itself, see [Set up the database](../setting-up/database.md).

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

## Store the password in a Secret

The password never appears in a values file. It comes from the release's Secret, under the key `APIP_AP_DATABASE_PASSWORD` — the same name as the environment variable the container receives. `generate-secrets.sh` prompts for it and writes it into the Secret it creates. See [Security Hardening → Secrets](security-hardening.md#secrets).

## Configure the chart

=== "Kubernetes"

    ```yaml
    api-portal-ui:
      config:
        database:
          type: postgres
          host: postgres.example.com
          port: 5432
          database: api_portal       # the schema name — rendered into config as `name`
          user: api_portal
          sslmode: verify-full       # disable | require | verify-ca | verify-full
          sslRootCert: /etc/api-portal/certs/ca.pem
    ```

    Two key names catch people out: the schema name is `database`, not `name`, and `sslmode` is all lowercase.

    Switching `type` off `sqlite` is also what unlocks scaling — the chart refuses to render an autoscaler on a database that can't be shared.

=== "Virtual machine"

    The shipped `configs/config.toml` carries only `driver` and `path`, so **setting `APIP_AP_DATABASE_HOST` on its own does nothing** — an environment value reaches a setting only where a token references it. Replace the whole `[api_portal.database]` block with the form for your driver from `configs/config-template.toml`:

    

    ```toml
    [api_portal.database]
    driver   = '{{ env "APIP_AP_DATABASE_DRIVER" "postgres" }}'
    host     = '{{ env "APIP_AP_DATABASE_HOST" "localhost" }}'
    port     = '{{ env "APIP_AP_DATABASE_PORT" "5432" }}'
    name     = '{{ env "APIP_AP_DATABASE_NAME" "api_portal" }}'
    user     = '{{ env "APIP_AP_DATABASE_USER" "" }}'
    password = '{{ env "APIP_AP_DATABASE_PASSWORD" "" }}'
    ssl_mode      = "verify-full"
    ssl_root_cert = "/etc/api-portal/tls/ca.pem"
    ```

    

    Then set the values in `api-platform.env` on each VM. Note the TOML keys are snake_case (`ssl_mode`, `ssl_root_cert`) where the Helm values are not.

    `user` has no fallback on purpose: a non-SQLite driver with no user, host, or name refuses to start rather than silently connecting as a conventional superuser name to whatever server the defaults point at.

## TLS to the database

Use `verify-full` in production. It is the only mode that validates both the certificate chain and the hostname, so it defends against a redirected connection rather than merely encrypting one:

| Mode | What it checks |
|---|---|
| `disable` | Nothing — cleartext |
| `require` | Encryption only; accepts any certificate |
| `verify-ca` | Certificate chains to a trusted CA |
| `verify-full` | Chain **and** that the hostname matches the certificate |

`verify-ca` and `verify-full` need `sslRootCert` pointing at the CA certificate, mounted into the pod.

## Connection pool tuning

Each pod opens its own pool, so the cluster's total connection demand is:

```
replicas × maxOpenConns
```

With the default `maxOpenConns: 50`, three replicas ask for up to 150 connections. Keep the total comfortably below the server's `max_connections`, leaving headroom for administrative sessions and for a rolling upgrade — during which old and new pods briefly overlap.

```yaml
api-portal-ui:
  config:
    database:
      maxOpenConns: 25
      minOpenConns: 2
      poolIdleTimeoutMs: 10000
      poolConnectionTimeoutMs: 30000
      poolRequestTimeoutMs: 30000
```

Lowering `maxOpenConns` as you raise the replica count is usually the right trade: more pods each holding a smaller pool. `minOpenConns` keeps a floor of warm connections per pod, so the first request after an idle period doesn't pay connection setup.

## Related

- [Set up the database](../setting-up/database.md): driver choice, the schema, and single-instance setup
- [Resources & Scaling](resources-and-scaling.md): choosing a replica count to size the pool against
- [Security Hardening](security-hardening.md): where the password lives