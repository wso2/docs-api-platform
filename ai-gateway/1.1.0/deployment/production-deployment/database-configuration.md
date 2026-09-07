---
title: "Database Configuration"
description: "Point AI Gateway controller replicas at a shared PostgreSQL or SQL Server database, inject the password from a Secret, and tune the connection pool."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/database-configuration/
md_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/database-configuration.md
tags:
  - ai-gateway
  - production
  - postgresql
  - high-availability
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-09
content_type: "how-to"
---

# Database configuration

An external database is what makes controller high availability possible. It replaces the default SQLite backend, which supports a single replica. The external database becomes the shared source of truth that every Gateway Controller replica reads and writes.

AI Gateway 1.1.0 supports **PostgreSQL** as its external database. AI Gateway 1.2.0 adds Microsoft SQL Server as a second option.

## Create the database and user

Connect to your PostgreSQL instance as an administrator:

```bash
psql "host=<db-host> port=5432 dbname=postgres user=<admin-user> sslmode=require"
```

Create the database and a dedicated account for the gateway. Set the password with the `\password` meta-command, which prompts for the value and keeps it out of the SQL text and your `psql` history:

```sql
CREATE DATABASE gateway_controller;
CREATE USER gateway;
\password gateway
GRANT ALL PRIVILEGES ON DATABASE gateway_controller TO gateway;
```

## Apply the schema

The Gateway Controller connects to the database you point it at, and doesn't run schema DDL against it. Apply the schema before the controller starts.

The script ships in the gateway distribution at `resources/gateway-controller/db-scripts/gateway-controller-db.postgres.sql`. If you deploy from container images rather than the distribution archive, take the script from the `ai-gateway/v1.1.0` release tag so it matches the version you run.

```bash
psql "host=<db-host> port=5432 dbname=gateway_controller user=<admin-user> sslmode=require" \
  -v ON_ERROR_STOP=1 -f gateway-controller-db.postgres.sql
```

The Helm chart has no bootstrap job for this, so run it from a CI job, a bastion host, or a temporary pod with network access to the database.

!!! important
    Use the schema script that ships with AI Gateway 1.1.0. A script from another release can leave the schema out of step with what the controller expects.

Confirm the tables exist before continuing:

```bash
psql "host=<db-host> port=5432 dbname=gateway_controller user=<admin-user> sslmode=require" -c '\dt'
```

## Store the password in a Kubernetes Secret

The database password is injected as an environment variable from a Secret. It never goes into the chart values or the generated ConfigMap.

Write the password to a protected file rather than passing it with `--from-literal`, which records it in your shell history and in the host's process list:

```bash
umask 077
read -rsp "Database password: " DB_PASSWORD && echo
printf '%s' "$DB_PASSWORD" > db_password
unset DB_PASSWORD

kubectl create secret generic gateway-db-password \
  --namespace <your-namespace> \
  --from-file=password=db_password

shred -u db_password
```

## Configure the chart

```yaml
gateway:
  config:
    controller:
      storage:
        type: postgres
        postgres:
          host: "gateway-postgres.postgres.database.azure.com"
          port: 5432
          database: "gateway_controller"
          user: "gateway"
          sslmode: require
          connect_timeout: 5s
          max_open_conns: 25
          max_idle_conns: 5
          conn_max_lifetime: 30m
          conn_max_idle_time: 5m
          application_name: gateway-controller

  controller:
    postgres:
      passwordSecretRef:
        name: gateway-db-password
        key: password
    # The SQLite PVC is not used with an external database
    persistence:
      enabled: false
```

Use `require` or stronger for `sslmode` in production. `verify-full` also checks the server hostname against the certificate, which needs the CA to be trusted by the controller.

## Supply a data source name instead

When the connection string comes from a secrets manager, supply a full data source name (DSN) rather than the individual fields. The DSN has the form `postgres://gateway:<password>@postgres.example.internal:5432/gateway_controller?sslmode=require`. Percent-encode any reserved character in the password first, so `p@ss:word` becomes `p%40ss%3Aword`.

Read the DSN in rather than passing it with `--from-literal`, which records the password in your shell history and in the host's process list:

```bash
umask 077
read -rsp "Gateway database DSN: " GATEWAY_DB_DSN && echo
printf '%s' "$GATEWAY_DB_DSN" | kubectl create secret generic gateway-db-dsn \
  --namespace <your-namespace> \
  --from-file=dsn=/dev/stdin
unset GATEWAY_DB_DSN
```

```yaml
gateway:
  config:
    controller:
      storage:
        type: postgres
        postgres:
          dsn: "postgres://gateway:@postgres.example.internal:5432/gateway_controller?sslmode=require"
  controller:
    postgres:
      passwordSecretRef:
        name: gateway-db-dsn
        key: dsn
```

!!! note
    When `dsn` is set it takes precedence over every individual connection field. The password is still injected from the referenced Secret.

## Tune the connection pool

Each controller replica opens its own pool, so the total connection count is `max_open_conns` multiplied by the replica count. Size the database to accept that total.

| Parameter | Default | When to adjust |
|-----------|---------|----------------|
| `max_open_conns` | `25` | Raise for high artifact-deployment throughput; lower when the database enforces a tight connection cap |
| `max_idle_conns` | `5` | Keep at or below `max_open_conns` |
| `conn_max_lifetime` | `30m` | Shorten when your database recycles connections aggressively |
| `conn_max_idle_time` | `5m` | Shorten when idle connections are a concern |

---

[← Security hardening](./security-hardening.md) &nbsp;|&nbsp; [Resources and scaling →](./resources-and-scaling.md)