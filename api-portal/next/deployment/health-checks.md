---
title: "Health Checks"
description: "API Portal & MCP Hub liveness and readiness endpoints, what they check, and how to use them in Kubernetes probes, load balancers, and Docker Compose."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/deployment/health-checks/
md_url: https://wso2.com/api-platform/docs/api-portal/next/deployment/health-checks.md
tags:
  - api-portal
  - health-check
  - deployment
  - kubernetes
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-20
content_type: "how-to"
---

# Health checks

This page is for platform operators who point Kubernetes probes, load balancers, or external monitors at the API Portal & MCP Hub. The portal exposes two health endpoints:

- **Liveness** (`/health`) answers whether the portal process is alive. A failing liveness probe restarts it.
- **Readiness** (`/ready`) answers whether the portal can serve requests. A failing readiness probe takes the instance out of rotation without restarting it.

Both endpoints run the same checks, including the database. A short database outage takes the instance out of rotation through the readiness probe. An outage that outlasts the liveness probe's window, about 2 minutes with the Helm chart defaults, also restarts it.

## Endpoints

The portal serves both endpoints at the container root, where a probe reaches the pod directly, and under the `/api-portal` prefix, which is all a path-routing proxy forwards:

| Endpoint | Paths | Port |
|----------|-------|------|
| Liveness | `/health`, `/api-portal/health` | `9543` (HTTPS by default) |
| Readiness | `/ready`, `/api-portal/ready` | `9543` (HTTPS by default) |

Both endpoints:

- answer without a session or credentials, and don't create a session row;
- accept only `GET` and `HEAD`, and answer any other method with `405` and `Allow: GET, HEAD`;
- send `Cache-Control: no-store`;
- reuse an evaluated result for 3 seconds (`cache_ttl`), so frequent probes don't add load on the database.

## Response format

Both endpoints run the same checks and give the same answer. The portal answers `200` when every check is up and `503` when any check is down:

```json
{
  "status": "ok",
  "timestamp": "2026-11-20T09:15:00Z",
  "checks": {
    "database": { "status": "up" }
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
    }
  }
}
```

The reason never includes host names, user names, or connection strings. The full cause is written to the portal log.

A client outside the allowed clients gets `403` with `{"status": "forbidden"}`. See [Restrict who can call the health endpoints](#restrict-who-can-call-the-health-endpoints).

## What the portal checks

| Check | Down when |
|-------|-----------|
| `database` | The portal has lost its connection to the database. |

The `database` check judges the database by the outcomes of the portal's own queries, so it adds no queries while traffic flows:

- Only connection failures count: refused, reset, unreachable, rejected authentication, the server shutting down, or a SQLite file that can't be opened. SQL errors and slow queries don't count.
- When there are too few queries to decide, the check runs its own `SELECT 1`, at most once every 10 seconds.
- When most of the connection pool stays in use with callers waiting, the check carries the warning `database connection pool exhausted` but stays up. A full pool is load, not an outage.

Design mode has no database, so the portal registers no `database` check in design mode.

## Configuration

Every key is optional. The values shown are the defaults.

```toml
[api_portal.health]
cache_ttl = "3s"            # how long an evaluated result is reused
allowed_clients = ["*"]     # IP addresses or CIDR ranges; "*" allows every client

[api_portal.health.database]
check_timeout = "2s"        # deadline for the check's own SELECT 1 (at most 1m)
failure_window = "30s"      # how far back query outcomes count (at least cache_ttl, at most 1h)
failure_ratio = 0.5         # share of failed queries that reports the database down
min_attempts = 5            # queries needed in the window before the ratio decides
idle_period = "10s"         # with too few queries to decide, the check runs its own SELECT 1 once per period
pool_saturation = 0.9       # PostgreSQL and SQL Server: share of the pool in use, with callers waiting, that counts as saturated
pool_wait_limit = "5s"      # how long the pool may stay saturated before the warning appears
```

To read `allowed_clients` from the `APIP_AP_HEALTH_ALLOWED_CLIENTS` environment variable, set the key to an `{{ env }}` token. A literal value, as in the example above, ignores the variable:

```toml
[api_portal.health]
allowed_clients = '{{ env "APIP_AP_HEALTH_ALLOWED_CLIENTS" "127.0.0.1,::1,10.0.0.0/8" }}'
```

An invalid value, or an unknown key under `[api_portal.health.database]`, stops the portal at startup.

### Restrict who can call the health endpoints

By default, the health endpoints answer every client. To restrict them, set `allowed_clients` to a list of IP addresses or CIDR ranges, or a comma-separated string. Any other client then gets `403`.

The portal checks only the connection's peer address. It never reads `X-Forwarded-For` or the trust-proxy setting. A probe that reaches the portal through a proxy or a published container port arrives from that hop's address, so keep those addresses in the list:

- **Kubernetes and OpenShift:** the kubelet's probes arrive from the node's address. Keep the node range in the list, or the probes get `403` and the pods never become ready.
- **Load balancers:** keep the load balancer's address in the list.
- **Docker Compose:** a call from the host through a published port arrives from the Docker network.

## Configuring health checks

=== "Kubernetes and OpenShift"

    The `api-portal-ui` Helm chart configures liveness, readiness, and startup probes. You don't need to change them.

    | Probe | Path | Timing |
    |-------|------|--------|
    | Liveness | `/health` | Every 10 s, restarts after 12 failures (about 2 minutes) |
    | Readiness | `/ready` | Every 5 s, out of the Service after 3 failures (about 15 s) |
    | Startup | `/ready` | Every 5 s, up to 60 attempts (5 minutes) |

    The long liveness window means a short database outage takes the pod out of the Service but never restarts it.

    The probes use `scheme: HTTPS`. If you set `tls.certificateProvider: none`, the portal serves plain HTTP and the chart renders all three probes with `scheme: HTTP`. Any other probe setting is kept as you give it.

    To change a probe, override it in your values:

    ```yaml
    api-portal-ui:
      deployment:
        readinessProbe:
          httpGet: { path: /ready, port: http, scheme: HTTPS }
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
    ```

    To remove a probe, set it to `null`.

=== "Load balancers"

    Point the load balancer's health check at `https://<host>:9543/ready`, and configure it to remove an instance that fails. A failing instance then stops receiving traffic until its database connection recovers.

    If the load balancer reaches the portal through a path-routing proxy, use `/api-portal/ready` instead.

=== "Docker Compose"

    The portal image includes `wget`. Add a `healthcheck` that calls the readiness endpoint inside the container:

    ```yaml
    services:
      api-portal:
        healthcheck:
          test: ["CMD", "wget", "-q", "-O", "/dev/null", "--no-check-certificate", "https://localhost:9543/ready"]
          interval: 10s
          timeout: 5s
          retries: 3
    ```

    `--no-check-certificate` is acceptable here because the call stays inside the container, and the certificate names your public host name rather than `localhost`.

    If you serve the portal over plain HTTP, check `http://localhost:9543/ready` instead, and leave out `--no-check-certificate`.

## Verify

On a VM or with Docker Compose, call the endpoint on the host that runs the portal:

```bash
curl -ik https://localhost:9543/ready
```

On Kubernetes or OpenShift, call it from inside the portal container:

```bash
kubectl exec -n <namespace> deploy/<release>-api-portal -- \
  wget -qO- --no-check-certificate https://localhost:9543/ready
```

The check inside the container connects from `127.0.0.1` or `::1`. If you restrict `allowed_clients`, keep both addresses in the list, or this check gets `403`.

If you set `tls.certificateProvider: none`, the portal serves plain HTTP. Use `http://localhost:9543/ready` in both commands, and leave out `-k` and `--no-check-certificate`.

A healthy portal answers `200` with `"status": "ok"`.

## Related

- [Resources & Scaling](resources-and-scaling.md): instance count, resources, and spreading instances across failure domains
- [Deploy on Kubernetes](deploy-on-kubernetes.md#health-checks), [Deploy on OpenShift](openshift.md#health-checks), and [Deploy on VMs](deploy-on-vms.md#health-checks): the health check step on each platform