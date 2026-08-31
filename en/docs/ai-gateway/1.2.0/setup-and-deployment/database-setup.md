---
title: "Setting Up the Database"
description: "Create the database and apply the Gateway Controller schema for PostgreSQL or SQL Server before starting the API Platform AI Gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/database-setup/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/database-setup.md
tags:
  - ai-gateway
  - configuration
  - postgresql
  - sqlserver
  - devops
  - troubleshooting
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Setting Up the Database

The Gateway Controller persists API configurations, subscriptions, applications, keys, and other metadata in a database. Three storage backends are supported, selected through `[controller.storage].type`:

| `type` | Description | Schema provisioning |
|--------|-------------|---------------------|
| `sqlite` (default) | Embedded, file-based database (`./data/gateway.db`). Single replica only. | Created and migrated automatically on startup |
| `postgres` | External PostgreSQL. Required for multi-replica, high-availability deployments. | Must be provisioned before the controller starts |
| `sqlserver` | External Microsoft SQL Server. Required for multi-replica, high-availability deployments. | Must be provisioned before the controller starts |

If you are using `sqlite`, there is nothing to do — the controller creates the database file itself on first start, and the rest of this page does not apply.
For **PostgreSQL** and **SQL Server**, the Gateway Controller connects to the database you point it at but does not run schema DDL against it.

## Before You Begin

- A running PostgreSQL or SQL Server instance that is reachable from every Gateway Controller replica.
- An administrative account on that instance that can create databases, logins, and tables.
- A database client on the machine you run the provisioning from — `psql` for PostgreSQL, `sqlcmd` for SQL Server.

## Get the Schema Scripts

The scripts ship inside the gateway distribution:

```text
wso2apip-ai-gateway-<version>/
└── resources/
    └── gateway-controller/
        └── db-scripts/
            ├── gateway-controller-db.postgres.sql
            └── gateway-controller-db.sqlserver.sql
```

If you are deploying from container images or Helm rather than the distribution zip, download them from the repository instead:

- [gateway-controller-db.postgres.sql](https://github.com/wso2/api-platform/blob/main/gateway/gateway-controller/pkg/storage/gateway-controller-db.postgres.sql)
- [gateway-controller-db.sqlserver.sql](https://github.com/wso2/api-platform/blob/main/gateway/gateway-controller/pkg/storage/gateway-controller-db.sqlserver.sql)

!!! important
    Always use the scripts that ship with the gateway version you are deploying. Applying a script from a different release can leave the schema out of step with what the controller expects.

## Step 1 - Create the Database and User

Create an empty database and a dedicated account for the gateway.
(The schema should be applied by an account with DDL privileges.)

=== "PostgreSQL"

    Connect as an administrator:

    ```bash
    psql "host=<db-host> port=5432 dbname=postgres user=<admin-user> sslmode=require"
    ```

    Create the database and a login for the gateway.

    ```sql
    CREATE DATABASE gateway_controller;
    CREATE USER gateway WITH PASSWORD 'your-db-password';
    ```

=== "SQL Server"

    Connect as an administrator:

    ```bash
    sqlcmd -S <db-host>,1433 -U <admin-user> -P '<admin-password>'
    ```

    Create the database, login, and user.

    ```sql
    CREATE DATABASE gateway_controller;
    GO
    CREATE LOGIN gateway WITH PASSWORD = 'your-db-password';
    GO
    USE gateway_controller;
    GO
    CREATE USER gateway FOR LOGIN gateway;
    GO
    ```

## Step 2 - Apply the Schema

Run the script for your database against the database you just created.

=== "PostgreSQL"

    ```bash
    psql "host=<db-host> port=5432 dbname=gateway_controller user=<admin-user> sslmode=require" \
      -v ON_ERROR_STOP=1 \
      -f resources/gateway-controller/db-scripts/gateway-controller-db.postgres.sql
    ```

    `ON_ERROR_STOP=1` makes `psql` abort and return a non-zero exit code on the first failing statement, instead of continuing and leaving a partially created schema.

=== "SQL Server"

    ```bash
    sqlcmd -S <db-host>,1433 -d gateway_controller \
      -U <admin-user> -P '<admin-password>' -b \
      -i resources/gateway-controller/db-scripts/gateway-controller-db.sqlserver.sql
    ```

    `-b` makes `sqlcmd` exit with an error code if any statement in the batch fails.

    !!! tip
        `sqlcmd` v18 and later negotiate an encrypted connection by default and reject certificates they cannot validate. For production, use `-N` with a properly trusted certificate so the connection is both encrypted and verified. Only add `-C` if you must connect to a server with a self-signed certificate — it disables certificate validation entirely, so treat it as a controlled, limited-use exception rather than a default troubleshooting flag.

The scripts are idempotent — every object is guarded (`CREATE TABLE IF NOT EXISTS` on PostgreSQL, `IF OBJECT_ID(...) IS NULL` on SQL Server) — so re-running them is safe and creates only what is missing.

## Step 3 - Grant Gateway Access

With the tables in place give `gateway` the privileges the controller needs at runtime: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

=== "PostgreSQL"

    ```bash
    psql "host=<db-host> port=5432 dbname=gateway_controller user=<admin-user> sslmode=require"
    ```

    ```sql
    GRANT CONNECT ON DATABASE gateway_controller TO gateway;
    GRANT USAGE ON SCHEMA public TO gateway;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gateway;
    ```

=== "SQL Server"

    ```bash
    sqlcmd -S <db-host>,1433 -d gateway_controller -U <admin-user> -P '<admin-password>'
    ```

    ```sql
    ALTER ROLE db_datareader ADD MEMBER gateway;
    ALTER ROLE db_datawriter ADD MEMBER gateway;
    GO
    ```

## Step 4 - Verify the Schema

Confirm the tables exist before starting the gateway.

=== "PostgreSQL"

    ```bash
    psql "host=<db-host> port=5432 dbname=gateway_controller user=<admin-user> sslmode=require" \
      -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    ```

=== "SQL Server"

    ```bash
    sqlcmd -S <db-host>,1433 -d gateway_controller \
      -U <admin-user> -P '<admin-password>' \
      -Q "SELECT name FROM sys.tables ORDER BY name;"
    ```

The core schema creates 15 tables:

```text
api_keys                application_api_keys    applications
artifacts               certificates            events
gateway_states          llm_providers           llm_provider_templates
llm_proxies             mcp_proxies             rest_apis
secrets                 subscription_plans      subscriptions
```

## Step 5 - Point the Gateway Controller at the Database

With the schema in place, configure the connection in `configs/config.toml`.

=== "PostgreSQL"

    ```toml
    [controller.storage]
    type = "postgres"

    [controller.storage.postgres]
    host = "<db-host>"
    port = 5432
    database = "gateway_controller"
    user = "gateway"
    password = '{% raw %}{{ env "APIP_GW_CONTROLLER_STORAGE_POSTGRES_PASSWORD" "" }}{% endraw %}'
    sslmode = "require" # disable, require, verify-ca, verify-full
    ```

=== "SQL Server"

    SQL Server uses the unified `[controller.storage.database]` block. TLS behavior is controlled by `options` rather than PostgreSQL's `sslmode`. Two forms are supported — if `dsn` is set, the discrete fields below it are ignored.

    The shipped Compose files use a single `dsn`, so no password is ever written into the file:

    ```toml
    [controller.storage]
    type = "sqlserver"

    [controller.storage.database]
    driver = "sqlserver"
    dsn = '{% raw %}{{ env "APIP_GW_CONTROLLER_STORAGE_DATABASE_DSN" "" }}{% endraw %}'

    [controller.storage.database.options]
    encrypt = "true" # disable, false, true, strict
    trust_server_certificate = "false"
    ```

    Discrete fields, the same shape as PostgreSQL's, are also supported — useful outside the reference Compose setup, e.g. under Kubernetes/Helm:

    ```toml
    [controller.storage]
    type = "sqlserver"

    [controller.storage.database]
    driver = "sqlserver"
    host = "<db-host>"
    port = 1433
    database = "gateway_controller"
    user = "gateway"
    password = '{% raw %}{{ env "APIP_GW_CONTROLLER_STORAGE_DATABASE_PASSWORD" "" }}{% endraw %}'

    [controller.storage.database.options]
    encrypt = "true" # disable, false, true, strict
    trust_server_certificate = "false"
    ```

    Unlike `dsn` and PostgreSQL's fields, these discrete SQL Server fields don't ship with an interpolation token by default — add one following the pattern below rather than writing the password literally.

The {% raw %}`{{ env "..." "" }}`{% endraw %} form is the interpolation token already used in the shipped `config.toml` — it reads the value from an environment variable at load time instead of storing it in the file. Set the actual values in `api-platform.env`:

```bash
# api-platform.env
APIP_GW_CONTROLLER_STORAGE_TYPE=postgres
APIP_GW_CONTROLLER_STORAGE_POSTGRES_HOST=<db-host>
APIP_GW_CONTROLLER_STORAGE_POSTGRES_DATABASE=gateway_controller
APIP_GW_CONTROLLER_STORAGE_POSTGRES_USER=gateway
APIP_GW_CONTROLLER_STORAGE_POSTGRES_PASSWORD=your-db-password
```

For SQL Server, the shipped Compose files supply the whole connection string through `APIP_GW_CONTROLLER_STORAGE_DATABASE_DSN`. See [Gateway Configuration and Environment Interpolation](./configuration.md) for how interpolation works. For the full list of storage configuration options for both databases, refer to the [config template](https://github.com/wso2/api-platform/blob/main/gateway/configs/config-template.toml).

Start the gateway:

```bash
docker compose up
```

On startup the controller logs that it connected to the external database and that schema auto-apply was skipped. That message is expected — it confirms the controller is relying on the schema you provisioned.

## Kubernetes Deployments

The Helm charts do not include a bootstrap job that provisions the schema, so the same steps apply: create the database and run the scripts before `helm install`. Run them from any host with network access to the database — a CI job, a bastion host, or a temporary pod in the cluster:

```bash
kubectl run psql-client --rm -it --restart=Never \
  --namespace <your-namespace> \
  --image=postgres:16 -- \
  psql "host=<db-host> port=5432 dbname=gateway_controller user=<admin-user> sslmode=require"
```

## Redis for Distributed Rate Limiting (Optional)

To enable distributed rate limiting across multiple Gateway Runtime instances, configure the rate limiting policy to use Redis as the backend:

```toml
[policy_configurations.ratelimit_v1]
algorithm = "fixed-window"
backend = "redis"

[policy_configurations.ratelimit_v1.redis]
host = "redis.example.com"
port = 6379
password = '{% raw %}{{ env "APIP_GW_RATELIMIT_REDIS_PASSWORD" "" }}{% endraw %}'
```

`config.toml` is interpolated the same way everywhere in the file, so the {% raw %}`{{ env "..." "" }}`{% endraw %} token above works here too — see [Gateway Configuration and Environment Interpolation](./configuration.md) rather than writing the password literally.

For the full list of Redis configuration options, refer to the [Advanced Rate Limiting documentation](https://wso2.com/api-platform/policy-hub/policies/advanced-ratelimit).

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| PostgreSQL: `ERROR: relation "artifacts" does not exist` | The schema was never applied, or was applied to a different database | Re-run Step 2 against the database named in `[controller.storage.postgres].database` |
| SQL Server: `Invalid object name 'dbo.artifacts'` | Same as above | Re-run Step 2 against the database named in `[controller.storage.database].database` |
| SQL Server: `Msg 1934 ... CREATE INDEX failed ... 'QUOTED_IDENTIFIER'` | The script is from a release before the `SET` options were added | Use the script shipped with your gateway version |
| `permission denied for table ...` at runtime | Step 3 was skipped, or was run before Step 2 finished creating the tables it grants access to | Run [Step 3 - Grant Gateway Access](#step-3-grant-gateway-access) |
| Controller connects but logs that schema auto-apply was skipped | Expected behavior for external databases | No action needed |

---

[← Configuration and Interpolation](./configuration.md)
