---
title: "Health checks for the Gateway Controller and Gateway Runtime"
description: "Configure liveness and readiness health checks for the API Platform Gateway Controller, Router, and Policy Engine using the dedicated /_gateway-health endpoints, and wire them into Docker Compose or Kubernetes probes."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/setup/health-checks/
md_url: https://wso2.com/api-platform/docs/api-gateway/setup/health-checks.md
tags:
  - api-gateway
  - health-check
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Health checks for the Gateway Controller and Gateway Runtime

This guide is for developers and platform operators wiring liveness and readiness checks for the API Platform Gateway into Docker Compose or Kubernetes. The Gateway Controller and the Gateway Runtime each expose Hypertext Transfer Protocol (HTTP) endpoints that report whether that component is ready to handle traffic.

The gateway has three health surfaces:

- The **Gateway Controller** admin API, reachable at `/api/admin/v1/health`.
- The **Router**, reachable at `/_gateway-health/healthy` and `/_gateway-health/ready` on the same ports that serve API traffic.
- The **Policy Engine** admin API, reachable at `/health`.

The Router and the Policy Engine each expose their own health endpoint inside the Gateway Runtime container.

## Gateway Controller health endpoint

The Gateway Controller exposes a health endpoint on its admin HTTP server:

| Item | Value |
|------|-------|
| Path | `/api/admin/v1/health` |
| Legacy path | `/health` (deprecated) |
| Default port | `9094` |
| Method | `GET` |
| Healthy response | `200` with a JavaScript Object Notation (JSON) body: `{"status": "healthy", "timestamp": "..."}` |

Test it directly with:

```bash
curl http://localhost:9094/api/admin/v1/health
```

The Gateway Controller enforces an Internet Protocol (IP) allowlist on its admin API and, when configured, also requires Basic authentication. It exempts both `/api/admin/v1/health` and the legacy `/health` from both checks, so Docker and Kubernetes probes can reach them without credentials. It still requires an allowed IP and, if enabled, valid credentials for every other admin path.

## Gateway Runtime health checks

The Gateway Runtime container runs the Router and the Policy Engine, and each exposes its own health endpoint.

### Router liveness and readiness

The Router exposes two dedicated endpoints on its regular ingress listeners, so no separate admin port is involved:

| Item | Value |
|------|-------|
| Liveness path | `/_gateway-health/healthy` |
| Readiness path | `/_gateway-health/ready` |
| Ports | `8080` (HTTP ingress) and `8443` (HTTPS ingress) |
| Method | `GET` |
| Healthy response | `200` with `{"status": "healthy"}` or `{"status": "ready"}` |

```bash
curl http://localhost:8080/_gateway-health/healthy
curl -k https://localhost:8443/_gateway-health/ready
```

Both paths answer on both ports. The example above pairs liveness with the HTTP listener and readiness with the Hypertext Transfer Protocol Secure (HTTPS) listener.

The Router reserves the path prefix `/_gateway-health` for its own liveness and readiness routes, so no other route can use it.

### Policy Engine health

The Policy Engine admin server exposes its own health endpoint:

| Item | Value |
|------|-------|
| Path | `/health` |
| Default port | `9002` |
| Method | `GET` |
| Healthy response | `200` with `{"status": "healthy", "timestamp": "..."}` |

```bash
curl http://localhost:9002/health
```

The Policy Engine admin server has no Basic authentication layer, and `/health` bypasses even its IP allowlist, so probes always reach it.

## Configuring health checks

=== "Docker Compose"

    Add a `healthcheck:` block to each service, using `curl` against each component's health path.

    1. For the `gateway-controller` service, point the `healthcheck` at the admin health path:

        ```yaml
        services:
          gateway-controller:
            healthcheck:
              test: ["CMD", "curl", "-f", "http://localhost:9094/api/admin/v1/health"]
              interval: 10s
              timeout: 3s
              retries: 5
              start_period: 10s
        ```

    2. The `gateway-runtime` container isn't ready to handle traffic unless both processes report healthy. Check the Router's readiness path and the Policy Engine's health path in the same `healthcheck`:

        ```yaml
        services:
          gateway-runtime:
            healthcheck:
              test: ["CMD-SHELL", "curl -f http://localhost:8080/_gateway-health/ready && curl -f http://localhost:9002/health"]
              interval: 10s
              timeout: 3s
              retries: 5
              start_period: 10s
        ```

=== "Kubernetes"

    Configure a `readinessProbe` and a `livenessProbe` on each container.

    1. For the Gateway Controller container, use an `httpGet` probe directly against its admin health path:

        ```yaml
        spec:
          template:
            spec:
              containers:
                - name: gateway-controller
                  readinessProbe:
                    httpGet:
                      path: /api/admin/v1/health
                      port: 9094
                    initialDelaySeconds: 5
                    periodSeconds: 10
                  livenessProbe:
                    httpGet:
                      path: /api/admin/v1/health
                      port: 9094
                    initialDelaySeconds: 10
                    periodSeconds: 15
        ```

    2. For the Gateway Runtime container, point the liveness probe at `/_gateway-health/healthy` on the HTTP listener:

        ```yaml
        spec:
          template:
            spec:
              containers:
                - name: gateway-runtime
                  livenessProbe:
                    httpGet:
                      path: /_gateway-health/healthy
                      port: 8080
                    initialDelaySeconds: 10
                    periodSeconds: 15
        ```

    3. The Gateway Runtime container isn't ready to handle traffic unless both processes report healthy. Point the readiness probe at both the Router's readiness path on the HTTPS listener and the Policy Engine's health path:

        ```yaml
        spec:
          template:
            spec:
              containers:
                - name: gateway-runtime
                  readinessProbe:
                    exec:
                      command:
                        - sh
                        - -c
                        - curl -k -f https://localhost:8443/_gateway-health/ready && curl -f http://localhost:9002/health
                    initialDelaySeconds: 5
                    periodSeconds: 10
        ```

---

[← Artifact Templating](./artifact-templating.md) &nbsp;|&nbsp; [Configuring Timeouts →](../resiliency/timeouts.md)
