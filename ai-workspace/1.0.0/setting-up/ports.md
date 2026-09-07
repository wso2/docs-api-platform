---
title: "Change the ports AI Workspace uses"
description: "Move the AI Workspace and Platform API off their default ports, either by remapping the published host port or by changing the port each service listens on."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/ports/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/ports.md
tags:
  - cloud
  - ai-workspace
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Change the ports AI Workspace uses

The stack listens on these ports by default:

| Port | Service | Purpose |
|------|---------|---------|
| `9643` | AI Workspace | HTTPS — the browser entry point |
| `9243` | Platform API | HTTPS — the backend REST API |
| `9543` | API Portal | HTTPS — only when you enable the `api-portal` profile |

If another process on your machine holds one of these, or your organization reserves it, two approaches move the stack off it. They solve different problems.

## Remap the published host port

The containers keep listening on 9643 and 9243, and Docker publishes them on host ports you choose. This is the shorter change, and it's enough when the conflict is on your own machine.

1. In `docker-compose.yaml`, edit the host side — the left number — of each `ports:` mapping. This example moves the AI Workspace to `8443` and the Platform API to `8244`:

    ```yaml
    services:
      platform-api:
        ports:
          - "8244:9243"

      ai-workspace:
        ports:
          - "8443:9643"
    ```

    Leave the container side and the `healthcheck` entries alone. Both run inside the container, where the original ports still apply.

2. In `configs/config.toml`, point `controlplane_host` at the new Platform API host port, so the gateway setup commands the workspace shows carry the published port. Use an address that your gateway can reach:

    ```toml
    [ai_workspace.gateway]
    controlplane_host = "<gateway-reachable-host>:8244"
    ```

    For a gateway in another container on the same machine, `host.docker.internal:8244` works. Docker Desktop on macOS and Windows resolves that name automatically. On Linux, add an `extra_hosts` entry to the gateway's Compose service, `host.docker.internal:host-gateway`, or use an address the gateway can reach instead. From anywhere else, use the machine's hostname or IP address. Leave `[ai_workspace.control_plane] url` on `https://platform-api:9243` — see [Two keys that aren't interchangeable](#two-keys-that-arent-interchangeable).

3. Set `APIP_AIW_DOMAIN=localhost:8443` in `api-platform.env`, so the startup log banner prints an address you can open.

## Change the port each service listens on

The services bind to different ports themselves. Choose this when something inside the Docker network, such as a reverse proxy sharing it, needs the new port too.

1. In `configs/config.toml`, set the AI Workspace listener port under `[ai_workspace.server.https]`, or set `APIP_AIW_SERVER_HTTPS_PORT=8443` in `api-platform.env` — the shipped key reads that variable.

2. Add a `[platform_api.server.https]` table. The shipped file omits it, so add the whole table including the certificate paths, which the Platform API requires on its HTTPS listener:

    ```toml
    [platform_api.server.https]
    enabled   = true
    port      = 8244
    cert_file = "/app/data/certs/cert.pem"
    key_file  = "/app/data/certs/key.pem"
    ```

3. Point the AI Workspace at the new Platform API port, and give gateways a host address they can reach on the new port:

    ```toml
    [ai_workspace.control_plane]
    url = "https://platform-api:8244"

    [ai_workspace.gateway]
    controlplane_host = "<gateway-reachable-host>:8244"
    ```

    As in the previous approach, `host.docker.internal:8244` works for a gateway in another container on the same machine. Docker Desktop maps that hostname automatically on macOS and Windows. On Linux, map it yourself with `extra_hosts`.

4. In `docker-compose.yaml`, update both sides of each mapping, and the health check URLs, which run inside the container against the new listener ports:

    ```yaml
    services:
      platform-api:
        ports:
          - "8244:8244"
        healthcheck:
          test: ["CMD", "curl", "-fk", "https://localhost:8244/health"]

      ai-workspace:
        ports:
          - "8443:8443"
        healthcheck:
          test: ["CMD-SHELL", "curl -fs http://localhost:9680/healthz || curl -fk https://localhost:8443/healthz"]
    ```

5. Set `APIP_AIW_DOMAIN=localhost:8443` in `api-platform.env`.

## Two keys that aren't interchangeable

Both approaches touch `url` and `controlplane_host`, which sit either side of the Compose network boundary:

| Key | Who connects to it | Value |
|-----|--------------------|-------|
| `[ai_workspace.control_plane] url` | The AI Workspace container, over the Compose network | A full URL using the internal name and the **container** port |
| `[ai_workspace.gateway] controlplane_host` | An AI gateway deployed outside the stack | A bare `host:port` with no scheme, using the **published** port |

Nothing in AI Workspace connects to `controlplane_host`. The value is display-only: the workspace substitutes it into the gateway setup commands the **Get Started** section shows an admin, such as the `APIP_GW_CONTROLLER_CONTROLPLANE_HOST` line and the Helm `--set gateway.controller.controlPlane.host` flag. The admin then copies those commands to the machine running the gateway, which is what makes the connection.

So a wrong value leaves AI Workspace working normally and breaks the gateway instead. The printed commands look right, but the gateway they configure can't reach the control plane and never registers.

Set `controlplane_host` to an address that's reachable from the gateway's network:

- For a gateway in another container on the same machine, use `host.docker.internal`.
- For a gateway anywhere else, use the machine's hostname or IP address.
- Don't use `platform-api`. That name resolves only inside the Compose network, so a gateway outside the stack can't reach it.

## Apply the change

Recreate the containers so they pick up the new values:

```bash
docker compose up --force-recreate
```

!!! note "Ports in an OpenID Connect (OIDC) setup"
    OIDC redirect URLs carry the port. Update `redirect_url` and `post_logout_redirect_url` under `[ai_workspace.auth.oidc]` in `configs/config.toml`, and update the matching URLs registered in your identity provider. See [Connect an identity provider](authentication/connect-an-identity-provider.md).

## Related

- [AI Workspace configuration](configuration.md) — how interpolation tokens deliver values into `config.toml`
- [Get started with AI Workspace](../getting-started.md) — the quickstart these defaults come from