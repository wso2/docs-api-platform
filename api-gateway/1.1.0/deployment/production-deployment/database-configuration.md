---
title: "Database Configuration"
description: "Configure PostgreSQL as the shared database for Gateway Controller replicas in high-availability production deployments."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/database-configuration/
md_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/database-configuration.md
tags:
  - api-gateway
  - deployment
  - postgresql
  - devops
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-11
content_type: "how-to"
---

# Database Configuration

PostgreSQL is required for high-availability production deployments. It removes the single-replica constraint of the default SQLite backend and acts as the shared source of truth across all Gateway Controller replicas. See [Architecture](../high-availability-production-deployment.md#architecture) for how replicas coordinate via the shared database.

## Create the Database

Connect to your PostgreSQL instance:

```bash
psql "host=gateway-postgres.postgres.database.azure.com \
port=5432 \
dbname=postgres \
user=<admin-user> \
sslmode=require"
```

Create the application database, user, and grant privileges:

```sql
CREATE DATABASE gateway_controller;
CREATE USER gateway WITH PASSWORD 'your-db-password';
GRANT ALL PRIVILEGES ON DATABASE gateway_controller TO gateway;
```

## Store the Password in a Kubernetes Secret

```bash
kubectl create secret generic gateway-postgres-password \
  --namespace <your-namespace> \
  --from-literal=password='your-db-password'
```

## Configure the Chart

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
          max_open_conns: 10
          max_idle_conns: 5
          conn_max_lifetime: 30m
          conn_max_idle_time: 5m
          application_name: gateway-controller

  controller:
    storage:
      type: postgres
    postgres:
      passwordSecretRef:
        name: gateway-postgres-password
        key: password
    # Disable the SQLite PVC — not needed with PostgreSQL
    persistence:
      enabled: false
```

## DSN Alternative

If your PostgreSQL connection string is managed externally (for example, from a secrets manager), you can supply a full DSN instead of individual fields.

Create a secret containing the DSN:

```bash
kubectl create secret generic gateway-postgres-dsn \
  --namespace <your-namespace> \
  --from-literal=dsn='postgres://gateway:your-db-password@postgres.example.internal:5432/gateway_controller?sslmode=require'
```

Reference the secret in values:

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
        name: gateway-postgres-dsn
        key: dsn
```

!!! note
    When `dsn` is set, it takes precedence over all individual connection fields. The password environment variable is still injected from the referenced secret.

## Connection Pool Tuning

| Parameter | Default | When to Adjust |
|-----------|---------|----------------|
| `max_open_conns` | `25` | Increase for high-throughput deployments |
| `max_idle_conns` | `5` | Should be ≤ `max_open_conns` |
| `conn_max_lifetime` | `30m` | Reduce if your PostgreSQL has aggressive idle timeouts |
| `conn_max_idle_time` | `5m` | Reduce if connection churn is a concern |

---

[← Security Hardening](./security-hardening.md) &nbsp;|&nbsp; [Resources & Scaling →](./resources-and-scaling.md)