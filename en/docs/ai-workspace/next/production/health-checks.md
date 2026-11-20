---
title: "Health Checks"
description: "Platform API and AI Workspace health endpoints, what they check, and how to use them in Kubernetes probes, load balancers, and monitoring."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/health-checks/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/health-checks.md
tags:
  - ai-workspace
  - platform-api
  - health-check
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-20
content_type: "how-to"
---

# Health checks

This page is for platform operators who point Kubernetes probes, load balancers, or monitors at an AI Workspace deployment. Both services answer health endpoints without authentication:

| Service | Endpoint | Port |
|---------|----------|------|
| Platform API | `/health` (liveness), `/ready` (readiness) | `9243` (HTTPS) |
| AI Workspace | `/healthz` | `9643` (HTTPS) |

The endpoints sit outside the path prefix, so a probe can reach a container directly. The rest of this page covers the Platform API endpoints, which check the database the whole deployment depends on.

## Platform API endpoints

- **Liveness** (`/health`) answers whether the process is alive. A failing liveness check is a reason to restart it.
- **Readiness** (`/ready`) answers whether the Platform API can serve requests. A failing readiness check takes the instance out of rotation without restarting it.

Both endpoints run the same checks and give the same answer, so they always agree. They:

- answer without credentials, ahead of authentication and authorization;
- accept only `GET` and `HEAD`;
- reuse an evaluated result for 3 seconds (`cache_ttl`), so frequent probes don't add load on the database.

### Response format

The Platform API answers `200` when every check is up and `503` when any check is down:

```json
{
  "status": "ok",
  "timestamp": "2026-11-20T09:15:00Z",
  "checks": {
    "database": { "status": "up" },
    "startup": { "status": "up" }
  }
}
```

A check that is down carries a generic reason and the time it started failing. The overall status is then `unhealthy`:

```json
{
  "status": "unhealthy",
  "timestamp": "2026-11-20T09:16:30Z",
  "checks": {
    "database": {
      "status": "down",
      "error": "database unreachable",
      "since": "2026-11-20T09:16:02Z"
    },
    "startup": { "status": "up" }
  }
}
```

The reason never includes host names, user names, or connection strings. The full cause is written to the Platform API log.

A client outside the allowed clients gets `403` with `{"status": "forbidden"}`. See [Restrict who can call the health endpoints](#restrict-who-can-call-the-health-endpoints).

### What the Platform API checks

| Check | Down when |
|-------|-----------|
| `database` | The Platform API has lost its connection to the database (reason `database unreachable`), or its connection pool has stayed full with callers waiting (reason `database connection pool exhausted`). |
| `startup` | The Platform API hasn't finished starting (reason `starting`). |

The `database` check judges the database by the outcomes of the Platform API's own database operations, so it adds no queries while traffic flows. When there are too few operations to decide, it pings the database itself, at most once every 10 seconds.

A full connection pool makes the `database` check fail, so readiness takes an overloaded instance out of rotation until callers stop waiting.

### During startup

At startup, the Platform API opens its listeners first and waits up to 5 minutes (`startup_wait`) for its database. While it waits, it answers `/health` and `/ready` with `503` and the `startup` check down, and answers every other request with `503`. If the database stays unreachable for the whole wait, the process exits.

A rejected login, a PostgreSQL database that doesn't exist, or an untrusted server certificate ends startup at once instead of waiting.

## Configuration

Every key is optional. The values shown are the defaults.

```toml
[platform_api.health]
allowed_clients = "*"   # APIP_CP_HEALTH_ALLOWED_CLIENTS
cache_ttl = "3s"

[platform_api.health.database]
check_timeout = "2s"    # deadline for one run of the check and its ping; keep it below the probe timeout
startup_wait = "5m"     # how long startup waits for the database before exiting
failure_window = "30s"  # how far back operation outcomes count (at most 1h)
failure_ratio = 0.5     # share of failed operations that reports the database down
min_attempts = 5        # operations needed in the window before the ratio decides
idle_period = "10s"     # with too few operations to decide, the check pings once per period
pool_saturation = 0.9   # share of the pool in use, with callers waiting, that counts as saturated
pool_wait_limit = "5s"  # how long the pool may stay saturated before the database is reported down
```

Each database key has an environment variable named after it, for example `APIP_CP_HEALTH_DATABASE_STARTUP_WAIT`. In the Helm chart, the same settings sit under `config.health`, for example `config.health.database.startupWait`.

### Restrict who can call the health endpoints

By default, the health endpoints answer every client. To restrict them, list IP addresses or CIDR ranges in `allowed_clients`. Any other client then gets `403`.

Only the connection's peer address counts, so keep the addresses your probes and load balancers call from:

- **Kubernetes and OpenShift:** keep the pod and node ranges in the list. Otherwise the kubelet's probes get `403` and the pods never become ready.
- **Load balancers:** keep the load balancer's address in the list.
- **Docker Compose:** a call from the host through a published port arrives from the Docker network.

## Configuring health checks

=== "Kubernetes and OpenShift"

    The Platform API Helm chart configures liveness, readiness, and startup probes. You don't need to change them.

    | Probe | Path | Timing |
    |-------|------|--------|
    | Liveness | `/health` | Every 10 s, restarts after 12 failures (about 2 minutes) |
    | Readiness | `/ready` | Every 5 s, out of the Service after 3 failures (about 15 s) |
    | Startup | `/ready` | Every 5 s, up to 72 attempts (6 minutes) |

    The long liveness window means a short database outage takes the pod out of the Service but never restarts it. The startup probe allows 6 minutes, which is longer than `startup_wait`, so the Platform API, not the probe, decides when a database wait gives up. If you raise `config.health.database.startupWait`, raise the startup probe's `failureThreshold` with it:

    ```yaml
    platform-api:
      config:
        health:
          database:
            startupWait: 8m
      deployment:
        startupProbe:
          httpGet:
            path: /ready
            port: http
            scheme: HTTPS
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 108
    ```

    To remove a probe, set it to `null`.

=== "Load balancers and monitors"

    - Point the load balancer's health check at `https://<host>:9243/ready` on the Platform API and at `https://<host>:9643/healthz` on AI Workspace. Configure it to remove an instance that fails.
    - Treat `503` and a refused connection as unhealthy.
    - Alert when the `database` check is down for longer than a short outage you're willing to absorb.

## Verify

```bash
curl -ik https://localhost:9243/ready
curl -ik https://localhost:9643/healthz
```

A healthy Platform API answers `200` with `"status": "ok"`.

## Related

- [Run in High Availability](high-availability.md): replicas, failure domains, and probe tuning
- [Operate the Deployment](operate.md): the signals to watch and alert on
