---
title: "Database Configuration"
description: "Point AI Gateway controller replicas at a shared PostgreSQL or SQL Server database, inject the password from a Secret, and tune the connection pool."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/database-configuration/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/database-configuration.md
tags:
  - ai-gateway
  - production
  - postgresql
  - sqlserver
  - high-availability
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Database configuration

An external database is what makes controller high availability possible. It replaces the default SQLite backend, which supports a single replica. The external database becomes the shared source of truth that every Gateway Controller replica reads and writes. AI Gateway 1.2.0 supports **PostgreSQL** and **SQL Server**.

## Before you begin

Create the database, the gateway account, and the schema first. That procedure, including where the schema scripts live and how to restrict runtime privileges, is covered in [Setting up the database](../database-setup.md). The Helm chart has no bootstrap job, so run the schema scripts from a CI job, a bastion host, or a temporary pod with network access to the database.

Come back here once the schema exists. This page covers only the chart configuration.

!!! important
    Use the schema scripts that ship with AI Gateway 1.2.0. A script from another release can leave the schema out of step with what the controller expects.

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

=== "PostgreSQL"

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

=== "SQL Server"

    SQL Server uses the unified `database` block. Its `options` field controls TLS behavior in place of the `sslmode` field PostgreSQL uses.

    ```yaml
    gateway:
      config:
        controller:
          storage:
            type: sqlserver
            database:
              driver: sqlserver
              host: "gateway-sqlserver.database.windows.net"
              port: 1433
              database: "gateway_controller"
              user: "gateway"
              connect_timeout: 5s
              max_open_conns: 25
              max_idle_conns: 5
              conn_max_lifetime: 30m
              conn_max_idle_time: 5m
              application_name: gateway-controller
              options:
                encrypt: "true"                    # disable, false, true, strict
                trust_server_certificate: "false"

      controller:
        sqlserver:
          passwordSecretRef:
            name: gateway-db-password
            key: password
        # The SQLite PVC is not used with an external database
        persistence:
          enabled: false
    ```

    Set `encrypt` to `true` and `trust_server_certificate` to `false` in production. The chart default of `encrypt: disable` sends database traffic unencrypted.

    !!! note
        The chart also carries a legacy `storage.sqlserver` block for backward compatibility. Configure deployments through `storage.database` as shown above.

## Supply a data source name instead

When the connection string comes from a secrets manager, supply a full data source name (DSN) rather than the individual fields. Write the DSN to a protected file so the password inside it stays out of your shell history and the process list.

=== "PostgreSQL"

    ```bash
    umask 077
    read -rsp "PostgreSQL DSN: " DB_DSN && echo
    printf '%s' "$DB_DSN" > db_dsn
    unset DB_DSN

    kubectl create secret generic gateway-db-dsn \
      --namespace <your-namespace> \
      --from-file=dsn=db_dsn

    shred -u db_dsn
    ```

    Enter the DSN in the form `postgres://gateway:<your-db-password>@postgres.example.internal:5432/gateway_controller?sslmode=require`.

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

=== "SQL Server"

    ```bash
    umask 077
    read -rsp "SQL Server DSN: " DB_DSN && echo
    printf '%s' "$DB_DSN" > db_dsn
    unset DB_DSN

    kubectl create secret generic gateway-db-dsn \
      --namespace <your-namespace> \
      --from-file=dsn=db_dsn

    shred -u db_dsn
    ```

    Enter the DSN in the form `sqlserver://gateway:<your-db-password>@sqlserver.example.internal:1433?database=gateway_controller&encrypt=true`.

    ```yaml
    gateway:
      config:
        controller:
          storage:
            type: sqlserver
            database:
              driver: sqlserver
              dsn: "sqlserver://gateway:@sqlserver.example.internal:1433?database=gateway_controller&encrypt=true"
      controller:
        sqlserver:
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

## Tune the EventHub

EventHub is the poll-based layer that propagates one controller replica's writes to the others. It matters only when you run more than one replica against PostgreSQL or SQL Server.

```yaml
gateway:
  config:
    controller:
      event_hub:
        poll_interval: 3s
        cleanup_interval: 10m
        retention_period: 1h
        database:
          max_open_conns: 5
          max_idle_conns: 2
          conn_max_lifetime: 30m
          conn_max_idle_time: 5m
```

`poll_interval` sets the upper bound on how long a newly deployed LLM proxy or MCP proxy takes to reach a runtime attached to a different controller replica. Shortening it propagates artifacts faster and increases the query load on the database. The EventHub pool is separate from the main storage pool, so count both when you size the database.

---

[← Security hardening](./security-hardening.md) &nbsp;|&nbsp; [Resources and scaling →](./resources-and-scaling.md)
