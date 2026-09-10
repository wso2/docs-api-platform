---
title: "Connect a database to the Platform API"
description: "Move the Platform API off its default SQLite file onto PostgreSQL or SQL Server: create the database, configure the connection, secure it with TLS, and tune the connection pool."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/database/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/setting-up/database.md
tags:
  - cloud
  - ai-workspace
  - configuration
  - database
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Connect a database to the Platform API

The Platform API stores every artifact you create in AI Workspace — gateways, LLM providers, proxies, applications, and subscriptions. This guide is written for the administrator who deploys AI Workspace, and it covers moving that storage from the default SQLite file onto a database server.

AI Workspace itself holds no persistent data of its own, so this is the only database in the stack.

## Supported drivers

Set the driver in `[platform_api.database]`. These values are accepted:

| `driver` value | Database |
|----------------|----------|
| `sqlite3` | SQLite, the default — a single file, no server to run |
| `postgres`, `postgresql`, `pgx` | PostgreSQL |
| `sqlserver`, `mssql` | Microsoft SQL Server |

## The default: SQLite

Out of the box the Platform API writes to a SQLite file inside the container, persisted in the `platform-api-data` Docker volume:

```toml
[platform_api.database]
driver = "sqlite3"
path   = "./data/api_platform.db"
```

The path is relative to the container's working directory, `/app`, and the volume mounts at `/app/data`. The data survives `docker compose down` and restarts. Only `docker compose down -v` deletes it.

SQLite suits a single instance you're evaluating or running for one team. Move to a database server when you need any of the following:

- More than one Platform API replica, since they can't share a SQLite file
- Backup, restore, and point-in-time recovery run by your existing database tooling
- Storage that outlives the container host

## Step 1: Create the database and user

Create the database and the user the Platform API connects as. Don't grant the user rights to create tables. A database administrator provisions the schema in the next step, and the Platform API needs only to read and write the rows.

=== "PostgreSQL"

    Run these statements on your PostgreSQL server:

    ```sql
    CREATE DATABASE platform_api;
    CREATE USER platform_api WITH PASSWORD '<your-password>';
    GRANT CONNECT ON DATABASE platform_api TO platform_api;
    ```

=== "SQL Server"

    Create the database and a server login of the same name. Run these statements against the `master` database:

    ```sql
    CREATE DATABASE platform_api;
    CREATE LOGIN platform_api WITH PASSWORD = '<your-password>';
    ```

    Step 2 maps that login to a database user.

## Step 2: Provision the schema

Run the bundled script for your database yourself, as a user that can create tables, before the first start:

=== "PostgreSQL"

    ```bash
    psql -h <your-db-host> -U <admin-user> -d platform_api \
      -f resources/platform-api/db-scripts/schema.postgres.sql
    ```

=== "SQL Server"

    ```bash
    sqlcmd -S <your-db-host> -U <admin-user> -d platform_api \
      -i resources/platform-api/db-scripts/schema.sqlserver.sql
    ```

The distribution ships one script per database at `resources/platform-api/db-scripts/`:

| Database | Script |
|----------|--------|
| PostgreSQL | `schema.postgres.sql` |
| SQL Server | `schema.sqlserver.sql` |
| SQLite | `schema.sqlite.sql` — applied for you, see [The default: SQLite](#the-default-sqlite) |

Then grant the Platform API's user read and write access to what the script created. Run the statements for your database, connected to the `platform_api` database.

=== "PostgreSQL"

    ```sql
    GRANT USAGE ON SCHEMA public TO platform_api;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO platform_api;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO platform_api;
    ```

=== "SQL Server"

    Create a database user for the login and add it to the two built-in data roles:

    ```sql
    CREATE USER platform_api FOR LOGIN platform_api;
    ALTER ROLE db_datareader ADD MEMBER platform_api;
    ALTER ROLE db_datawriter ADD MEMBER platform_api;
    ```

## Step 3: Configure the connection

Edit `[platform_api.database]` in `configs/config.toml`. These keys carry no interpolation tokens in the shipped file, so set them in the file directly:



```toml
[platform_api.database]
driver   = "postgres"
host     = "postgres.example.com"
port     = 5432
name     = "platform_api"
user     = "platform_api"
password = '{{ file "/secrets/platform-api/postgres_password" }}'
ssl_mode = "require"
```



`host`, `port`, `name`, and `user` are all required for any driver other than `sqlite3`. Leaving one unset fails config load rather than starting with an incomplete connection. The `path` key is ignored once the driver isn't `sqlite3`, so you can leave it in place.

For SQL Server, set `driver = "sqlserver"` and `port = 1433`.

!!! warning "Never write the database password as a literal"
    The `{{ file }}` token above reads it from a mounted file, which is the right choice in production. Resolution fails closed, so a missing or unreadable file aborts startup rather than connecting with an empty password. Mount the secret at that path and add the mount to the `platform-api` service in `docker-compose.yaml`. To read it from `api-platform.env` instead, swap the token for `'{{ env "APIP_CP_DATABASE_PASSWORD" }}'`.

## Step 4: Secure the connection with TLS

`ssl_mode` takes one of four values, in increasing order of strictness:

| Value | Behavior |
|-------|----------|
| `disable` | No TLS. Use only when the database is reachable over a trusted network path. |
| `require` | Encrypt, but don't verify the server's certificate. |
| `verify-ca` | Encrypt and verify the certificate against a certificate authority (CA). |
| `verify-full` | Encrypt, verify the certificate, and check that its hostname matches. |

`verify-ca` and `verify-full` need the CA certificate that signed the server's certificate:

```toml
ssl_mode      = "verify-full"
ssl_root_cert = "/etc/platform-api/certs/db-ca.pem"
```

For mutual TLS, add a client certificate and key. Set both or neither:

```toml
ssl_cert = "/etc/platform-api/certs/db-client.pem"
ssl_key  = "/etc/platform-api/certs/db-client-key.pem"
```

Mutual TLS is PostgreSQL only. The SQL Server driver has no client-certificate support, so `ssl_cert` and `ssl_key` don't apply there.

Mount each of these files into the `platform-api` container and point the keys at the mounted paths.

## Step 5: Tune the connection pool

The defaults suit a single instance. Raise them for production traffic, keeping `max_open_conns` within what your server's own connection limit allows across every client:

```toml
max_open_conns    = 25    # maximum open connections
max_idle_conns    = 10    # maximum idle connections kept in the pool
conn_max_lifetime = 300   # seconds before a connection is recycled
```

## Step 6: Restart and verify

Recreate the container so it reloads the configuration:

```bash
docker compose up --force-recreate platform-api
```

Confirm the service is healthy:

```bash
curl -fk https://localhost:9243/health
```

!!! important "Switching drivers starts from an empty database"
    Changing `driver` points the Platform API at different storage; it doesn't move anything there. The gateways, providers, proxies, and users in your SQLite file don't appear in PostgreSQL, and the distribution ships no tool to copy them across. Choose your database before you build out an environment, or plan to recreate its artifacts.

## Next steps

- [AI Workspace configuration](configuration.md): how interpolation tokens deliver values into `config.toml`, including the database password from a mounted file
- [Connect an identity provider](authentication/connect-an-identity-provider.md): move user login off the local user list as well