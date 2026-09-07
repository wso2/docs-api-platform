---
title: "Set up the database"
description: "Configure the API Portal & MCP Hub to run on SQLite, PostgreSQL, or Microsoft SQL Server: connection settings, schema, and Transport Layer Security (TLS)."
canonical_url: https://wso2.com/api-platform/docs/api-portal/setting-up/database/
md_url: https://wso2.com/api-platform/docs/api-portal/setting-up/database.md
tags:
  - cloud
  - api-portal
  - database
  - setting-up
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-03
content_type: "how-to"
---


# Set up the database

The API Portal & MCP Hub stores its organization, catalog, application, subscription, and key data in a relational database. You can run it on any of three drivers:

| Driver | `driver` value | Best for |
|---|---|---|
| SQLite | `sqlite` | Single-node deployments, evaluation, and development |
| PostgreSQL | `postgres` | Production and high-availability deployments |
| Microsoft SQL Server | `mssql` | Production deployments standardized on Microsoft SQL Server |

You select the driver and its connection settings in the `[api_portal.database]` section of `config.toml`. For the full field reference, see [Configurations](../references/configurations.md).

!!! note "Where the schema comes from"
    SQLite applies its schema automatically at startup, so no manual step is needed. PostgreSQL and Microsoft SQL Server require you to apply the schema before the portal connects—see [Apply the schema for PostgreSQL or Microsoft SQL Server](#apply-the-schema-for-postgresql-or-microsoft-sql-server).

## Choose a driver

Set `driver` in `config.toml`, along with the connection fields the driver uses:

```toml
[api_portal.database]
driver = "sqlite"             # sqlite | postgres | mssql

# SQLite only
path = "./api-portal.db"

# PostgreSQL / MSSQL only
host = "localhost"
port = 5432                   # 1433 for MSSQL
name = "api_portal"
user = "<db_user>"
password = '{{ env "APIP_AP_DATABASE_PASSWORD" }}'
```

Each field can also be supplied through an environment variable, which is useful for containerized deployments. The `config.toml` shipped with the portal reads these tokens:

| Field | Environment variable |
|---|---|
| `driver` | `APIP_AP_DATABASE_DRIVER` |
| `path` | `APIP_AP_DATABASE_PATH` |
| `host` | `APIP_AP_DATABASE_HOST` |
| `port` | `APIP_AP_DATABASE_PORT` |
| `name` | `APIP_AP_DATABASE_NAME` |
| `user` | `APIP_AP_DATABASE_USER` |
| `password` | `APIP_AP_DATABASE_PASSWORD` |

An environment variable takes effect only where `config.toml` references it with an `{{ env "..." }}` token. There's no automatic environment-variable override for arbitrary fields, so keep the tokens in place if you rely on them.

!!! warning "Keep credentials out of source control"
    Supply the database password through an environment variable or a secrets file, using an `{{ env "..." }}` or `{{ file "..." }}` token in `config.toml`. Don't write a plaintext password into `config.toml`, and don't commit credentials to version control.

## SQLite

SQLite is the default driver and needs no external database server.

1. Set the driver and the database file path:

    ```toml
    [api_portal.database]
    driver = "sqlite"
    path = "./data/api-portal.db"
    ```

2. Make sure the directory that holds the file exists and is writable by the portal process. Under Docker Compose, the `/app/data` directory is created for you by the data volume mount. When you run the portal directly with `npm start`, create the target directory yourself first.
3. Start the portal. It applies the SQLite schema in-process on the first run, so the tables are ready without any further action.

!!! note "Path is relative to the working directory"
    A relative `path` resolves against the process working directory. Under Docker Compose that's `/app`, so `./data/api-portal.db` maps to `/app/data/api-portal.db`.

## PostgreSQL

1. Provision a PostgreSQL database. Create a dedicated application account for the portal, and reserve an administrative account (such as `postgres`) for applying the schema.
2. Apply the PostgreSQL schema (see [Apply the schema for PostgreSQL or Microsoft SQL Server](#apply-the-schema-for-postgresql-or-microsoft-sql-server)).
3. Point the portal at the database with the dedicated application account:

    ```toml
    [api_portal.database]
    driver = "postgres"
    host = "localhost"
    port = 5432
    name = "api_portal"
    user = "<api_portal_db_user>"
    password = '{{ env "APIP_AP_DATABASE_PASSWORD" }}'
    ```

4. Configure the [connection pool](#connection-pool) and [TLS](#tls-for-postgresql-and-microsoft-sql-server) as needed, then start the portal.

## Microsoft SQL Server

1. Provision a Microsoft SQL Server database. Create a dedicated application login for the portal, and reserve an administrative login (such as `sa`) for applying the schema.
2. Apply the Microsoft SQL Server schema (see [Apply the schema for PostgreSQL or Microsoft SQL Server](#apply-the-schema-for-postgresql-or-microsoft-sql-server)).
3. Point the portal at the database with the dedicated application login. Microsoft SQL Server listens on port `1433` by default:

    ```toml
    [api_portal.database]
    driver = "mssql"
    host = "localhost"
    port = 1433
    name = "api_portal"
    user = "<api_portal_db_user>"
    password = '{{ env "APIP_AP_DATABASE_PASSWORD" }}'
    ```

4. Configure the [connection pool](#connection-pool) and [TLS](#tls-for-postgresql-and-microsoft-sql-server) as needed, then start the portal.

## Apply the schema for PostgreSQL or Microsoft SQL Server

Unlike SQLite, the portal doesn't create tables for PostgreSQL or Microsoft SQL Server. Apply the matching schema script against an empty database before the portal connects, as a provisioning or continuous integration (CI) step. The scripts ship with the distribution under `resources/api-portal/db-scripts/`:

| Driver | Schema script |
|---|---|
| PostgreSQL | `schema.postgres.sql` |
| Microsoft SQL Server | `schema.sqlserver.sql` |

To apply the schema, follow these steps from the distribution root:

1. Connect to the target database with an administrative account.
2. Run the schema script for your driver:

    - For PostgreSQL, use `psql`:

        ```bash
        psql -h localhost -U <admin_user> -d api_portal -f resources/api-portal/db-scripts/schema.postgres.sql
        ```

    - For Microsoft SQL Server, use `sqlcmd`:

        ```bash
        sqlcmd -S localhost,1433 -U <admin_user> -d api_portal -i resources/api-portal/db-scripts/schema.sqlserver.sql
        ```

## Connection pool

The `postgres` and `mssql` drivers use a connection pool. The defaults suit most deployments; tune them for your load:

```toml
[api_portal.database]
max_open_conns = 50
min_open_conns = 2
pool_idle_timeout_ms = 10000
pool_connection_timeout_ms = 30000
pool_request_timeout_ms = 30000         # MSSQL only — per-query execution timeout
```

!!! warning "Pool settings are validated at startup"
    The following constraints apply to the `postgres` and `mssql` drivers:

    - `max_open_conns` must be an integer of at least 1.
    - The remaining pool settings must be non-negative integers.
    - `min_open_conns` must not exceed `max_open_conns`.

    An invalid value stops startup with a `[FATAL]` message rather than reaching the connection pool.

SQLite ignores these settings.

## TLS for PostgreSQL and Microsoft SQL Server

To encrypt the database connection with Transport Layer Security (TLS), set `ssl_mode`. The default is `disable`:

```toml
[api_portal.database]
ssl_mode = "verify-full"                        # disable | verify-full
ssl_root_cert = "./resources/security/ca.pem"   # certificate authority (CA) certificate, used by verify-full
```

With `verify-full`, the portal verifies the server certificate against the certificate authority (CA) certificate at `ssl_root_cert`. Provide a CA certificate the database server's certificate chains to.

## Next steps

- Set the required [security keys](../references/configurations.md#security) before starting the portal.
- Configure [authentication](authentication/overview.md).
- Return to the [Getting Started](../getting-started.md) guide to run the portal.

