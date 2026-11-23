---
title: "Health checks for the Gateway Controller and Gateway Runtime"
description: "Gateway Controller and Gateway Runtime health endpoints, what they check, and how to use them in Kubernetes probes, Docker Compose, and load balancers."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/setup/health-checks/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/setup/health-checks.md
tags:
  - api-gateway
  - health-check
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-20
content_type: "how-to"
---

# Health checks for the Gateway Controller and Gateway Runtime

This guide is for platform operators who wire the API Platform Gateway into Kubernetes probes, Docker Compose health checks, load balancers, or external monitors. The Gateway Controller and the Gateway Runtime each expose a liveness endpoint and a readiness endpoint:

- **Liveness** answers whether the process is alive. A failing liveness probe restarts it.
- **Readiness** answers whether the component can handle its work. A failing readiness probe takes it out of rotation without restarting it.

The two components treat dependencies differently:

- The Gateway Controller runs the same checks, including its database, on both endpoints. A short database outage takes it out of rotation through the readiness probe. An outage that outlasts the liveness probe's window, about 2 minutes with the Helm chart defaults, also restarts it.
- The Gateway Runtime's liveness endpoint checks no dependencies, so a controller outage never restarts a runtime.

## Endpoints

| Component | Liveness | Readiness | Port |
|-----------|----------|-----------|------|
| Gateway Controller, management API | `/api/management/v1/health` | `/api/management/v1/ready` | `9090`, or `9093` when the management API uses TLS |
| Gateway Controller, admin server (deprecated) | `/api/admin/v1/health` | `/api/admin/v1/ready` | `9092` |
| Gateway Runtime (Router) | `/_gateway-health/healthy` | `/_gateway-health/ready` | Every traffic listener, by default `8080` (HTTP) and `8443` (HTTPS) |

All of them:

- answer without credentials;
- accept only `GET` and `HEAD`, and answer any other method with `405` and `Allow: GET, HEAD`;
- send `Cache-Control: no-store`;
- reuse an evaluated result for 3 seconds (`cache_ttl`), so frequent probes don't add load.

!!! note
    The management API answers on port `9090` both from the host with Docker Compose and inside the cluster. The Docker Compose setup publishes the admin port `9092` on host port `9094`, so from the host the deprecated admin endpoints are at `http://localhost:9094/api/admin/v1/health`. Inside the container and in Kubernetes, the admin port is `9092`.

## Response format

A component answers `200` when every check is up and `503` when any check is down. The body names each check:

```json
{
  "status": "healthy",
  "timestamp": "2026-11-20T09:15:00Z",
  "checks": {
    "database": { "status": "up" },
    "startup": { "status": "up" }
  }
}
```

A check that is down carries a generic reason and the time it started failing:

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

The reason never includes host names, user names, or connection strings. The full cause is written to the component's log.

A check that is up but under strain carries a `warning`, for example `"database connection pool exhausted"`. A warning never makes the check down, because a full connection pool is load, not an outage.

A client outside the allowed clients gets `403` with `{"status": "forbidden"}` and no check details. See [Restrict who can call the health endpoints](#restrict-who-can-call-the-health-endpoints).

## Gateway Controller

The controller serves its health endpoints on the management API (`9090`, or `9093` with TLS). Use them for probes, load balancers, and monitors, so they reach the controller through the port you already expose for the management API. When `[controller.server.tls]` is enabled, the TLS listener replaces the plain HTTP one, so the health endpoints move to `https://<host>:9093` with it.

!!! note "Deprecated: admin server health endpoints"
    The admin server's health endpoints, `/api/admin/v1/health` and `/api/admin/v1/ready` on port `9092`, return the same answer as the management API endpoints and remain available. They're deprecated: use `/api/management/v1/health` and `/api/management/v1/ready` for probes and monitoring.

The management API and admin server endpoints use one evaluation and one cached result, so they always give the same answer. The management API answers its health endpoints before authentication, authorization, access logging, and metrics, so probes need no credentials and don't fill the access log. Other management API paths require credentials when authentication is enabled.

### What the controller checks

Liveness and readiness run the same checks:

| Check | Down when |
|-------|-----------|
| `database` | The controller has lost its connection to the database. The check judges the database by the outcomes of the controller's own database operations, so it adds no queries while traffic flows. When there are too few operations to decide, it pings the database itself, at most once every 10 seconds. |
| `startup` | The controller hasn't finished starting (reason `starting`), or has begun shutting down (reason `stopping`). |

### During startup

At startup, the controller waits up to 5 minutes (`startup_wait`) for its database, and exits if the database is unreachable after that. A rejected login, a PostgreSQL database that doesn't exist, or an untrusted server certificate ends startup at once instead of waiting.

While the controller starts:

- the admin server answers `503` with the `startup` check down and reason `starting`;
- the management API listener doesn't open until startup finishes, so its health endpoints refuse the connection.

Both tell a probe that the controller hasn't started.

## Gateway Runtime

The Router serves the gateway's health routes on every traffic listener, so a load balancer can check the same port it sends traffic to. The path prefix `/_gateway-health` is reserved; no API can use it.

The Router doesn't answer these routes by itself. It passes them to the Policy Engine, so they fail when either process is down or frozen.

### What the runtime checks

| Endpoint | Healthy status | Checks |
|----------|----------------|--------|
| `/_gateway-health/healthy` | `healthy` | None. It answers `200` whenever the Router and the Policy Engine both answer. |
| `/_gateway-health/ready` | `ready` | `policy_engine`, `xds_connection`, and `python_executor` |

| Readiness check | Down when |
|-----------------|-----------|
| `policy_engine` | The Policy Engine hasn't loaded its policy configuration (reason `policy configuration not loaded`). |
| `xds_connection` | The runtime hasn't received its first configuration from the controller (reason `no configuration received yet`), or its connection to the controller has been down for longer than the grace period, 5 minutes by default (reason `disconnected from the controller for ...`). |
| `python_executor` | The Python executor isn't reachable or isn't ready. Registered only when the Python executor is configured. |

Liveness checks no dependencies on purpose. Once a runtime has its configuration, it keeps serving traffic with that configuration when the controller is unavailable. A controller outage longer than the grace period takes the runtime out of rotation, but never restarts it.

The traffic listeners themselves come with the controller's first configuration. A runtime that never receives one has no listener to answer on, so the startup probe gives up and Kubernetes restarts it.

### Policy Engine admin endpoint

The Policy Engine serves `GET /health` on its admin server (`9002`). It reports whether the policy configuration is loaded, which the runtime readiness route already covers, so you don't need to add it to a probe.

## Configuration

Every key is optional. The values shown are the defaults.

### Gateway Controller

```toml
[controller.health]
allowed_clients = "*"   # APIP_GW_CONTROLLER_HEALTH_ALLOWED_CLIENTS
cache_ttl = "3s"        # APIP_GW_CONTROLLER_HEALTH_CACHE_TTL

[controller.health.database]
check_timeout = "2s"    # deadline for the check's own ping
startup_wait = "5m"     # how long startup waits for the database before exiting
failure_window = "30s"  # how far back operation outcomes count (at most 1h)
failure_ratio = 0.5     # share of failed operations that reports the database down
min_attempts = 5        # operations needed in the window before the ratio decides
idle_period = "10s"     # with too few operations to decide, the check pings once per period
pool_saturation = 0.9   # share of the connection pool in use, with callers waiting, that counts as saturated
pool_wait_limit = "5s"  # how long the pool may stay saturated before the warning appears
```

The comments name each key's environment variable. A database key's variable follows the same pattern, for example `APIP_GW_CONTROLLER_HEALTH_DATABASE_STARTUP_WAIT`. A variable takes effect only when the key's value is an `{% raw %}{{ env }}{% endraw %}` token, as in the shipped configuration template. A key set to a literal value, as in the example above, ignores the variable. For example:

```toml
[controller.health.database]
startup_wait = '{% raw %}{{ env "APIP_GW_CONTROLLER_HEALTH_DATABASE_STARTUP_WAIT" "5m" }}{% endraw %}'
```

### Gateway Runtime

```toml
[router.health]
allowed_clients = "*"   # APIP_GW_ROUTER_HEALTH_ALLOWED_CLIENTS

[policy_engine.health]
cache_ttl = "3s"

[policy_engine.health.xds_connection]
grace = "5m"            # how long the controller connection may be down before readiness fails

[policy_engine.health.python_executor]
check_timeout = "2s"    # deadline for the Python executor check
```

### Restrict who can call the health endpoints

By default, the health endpoints answer every client. To restrict them, list IP addresses or CIDR ranges. Any other client then gets `403`.

- `[controller.health] allowed_clients` applies to the controller's endpoints on both the admin server and the management API.
- `[router.health] allowed_clients` applies to the runtime routes. The controller builds these routes, so set it on the controller.

Only the connection's peer address counts. A call through a published Docker port arrives from the Docker network, and a call through a proxy arrives from the proxy, so keep those addresses in the list.

In Docker Compose, set both lists in the `gateway-controller` service's `environment`. The controller reads the router list too, because it builds the runtime's routes:

```yaml
services:
  gateway-controller:
    environment:
      - APIP_GW_CONTROLLER_HEALTH_ALLOWED_CLIENTS=127.0.0.1,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,fc00::/7
      - APIP_GW_ROUTER_HEALTH_ALLOWED_CLIENTS=127.0.0.1,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,fc00::/7
```

Then recreate the containers with `docker compose up -d` so the lists take effect.

In Kubernetes, keep the pod and node ranges in both lists. Otherwise the kubelet's probes get `403` and the pods never become ready.

## Configuring health checks

=== "Kubernetes (Helm)"

    The gateway Helm chart configures liveness, readiness, and startup probes for both containers. You don't need to change them.

    | Container | Probe | Path | Timing |
    |-----------|-------|------|--------|
    | Gateway Controller | Liveness | `/api/management/v1/health` | Every 10 s, restarts after 12 failures (about 2 minutes) |
    | Gateway Controller | Readiness | `/api/management/v1/ready` | Every 5 s, out of the Service after 3 failures (about 15 s) |
    | Gateway Controller | Startup | `/api/management/v1/health` | Every 5 s, up to 72 attempts (6 minutes) |
    | Gateway Runtime | Liveness | `/_gateway-health/healthy` | Every 10 s, restarts after 12 failures (about 2 minutes) |
    | Gateway Runtime | Readiness | `/_gateway-health/ready` | Every 5 s, out of the Service after 3 failures (about 15 s) |
    | Gateway Runtime | Startup | `/_gateway-health/healthy` | Up to 5 minutes |

    The long liveness window means a short database outage takes the controller out of the Service but never restarts it.

    The controller probes leave out the port and scheme. The chart fills them in from `gateway.config.controller.server.tls.enabled`: the `rest` port over HTTP, or the `rest-tls` port over HTTPS. The runtime probes follow the Router's listener configuration in the same way.

    To customise a probe, override it in your values. A probe that names its own port is rendered as given. For example, to probe the controller's admin server, whose health endpoints are deprecated:

    ```yaml
    gateway:
      controller:
        deployment:
          livenessProbe:
            httpGet:
              path: /api/admin/v1/health
              port: admin
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 12
    ```

    To remove a probe, set it to `null`, for example `--set gateway.controller.deployment.livenessProbe=null`. An empty map (`{}`) doesn't remove it, because Helm merges it with the default probe.

    Gateways deployed by the gateway operator use the same probes.

=== "Docker Compose"

    Add a `healthcheck` to each service. The health check runs inside the container, so use the container ports.

    1. The controller image includes `wget`. Check the management API readiness endpoint. It refuses connections until the controller has started, which `start_period` allows for:

        ```yaml
        services:
          gateway-controller:
            healthcheck:
              test: ["CMD", "wget", "-q", "-O", "/dev/null", "http://localhost:9090/api/management/v1/ready"]
              interval: 10s
              timeout: 5s
              retries: 3
              start_period: 5m
        ```

        If `[controller.server.tls]` is enabled, check `https://localhost:9093/api/management/v1/ready` instead, and add `--no-check-certificate` before the URL. Skipping certificate verification is acceptable here because the call stays inside the container, and the certificate names your public host name rather than `localhost`.

    2. The runtime image includes `curl`. Check the runtime readiness route, which covers both the Router and the Policy Engine:

        ```yaml
        services:
          gateway-runtime:
            healthcheck:
              test: ["CMD", "curl", "-fsS", "-o", "/dev/null", "http://localhost:8080/_gateway-health/ready"]
              interval: 10s
              timeout: 5s
              retries: 3
              start_period: 5m
        ```

    `start_period` covers the controller's wait for its database and the runtime's wait for its first configuration.

=== "Load balancers and monitors"

    - **Gateway Runtime:** point the load balancer's health check at `/_gateway-health/ready` on the same listener it sends traffic to. It takes a runtime out of rotation when the Policy Engine isn't ready or the runtime has lost its controller for longer than the grace period.
    - **Gateway Controller:** point the health check at `/api/management/v1/ready` on the management API port you already expose. It answers once the controller has started and its database is reachable.

    Treat `503` and a refused connection as unhealthy. If you restrict `allowed_clients`, include the load balancer's or monitor's address.

## Verify

```bash
# Gateway Controller, from the host with Docker Compose
curl -i http://localhost:9090/api/management/v1/ready

# Gateway Runtime
curl -i http://localhost:8080/_gateway-health/ready
curl -ik https://localhost:8443/_gateway-health/healthy
```

In Kubernetes, check the controller from inside its pod:

```bash
kubectl exec -n <namespace> deploy/<release>-gateway-controller -- \
  wget -qO- http://localhost:9090/api/management/v1/ready
```

If `[controller.server.tls]` is enabled, the controller checks move to HTTPS on port `9093`. From the host, verify the certificate against your CA, for example `curl -i --cacert <ca-file> https://<host>:9093/api/management/v1/ready`. Inside the pod, use `wget -qO- --no-check-certificate https://localhost:9093/api/management/v1/ready`, because the certificate names your public host name rather than `localhost`.

---

[← Artifact Templating](./artifact-templating.md) &nbsp;|&nbsp; [Ports and TLS Configuration →](./ports-and-tls-configuration.md)
