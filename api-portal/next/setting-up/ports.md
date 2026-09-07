---
title: "Change the ports the API Portal uses"
description: "Move the API Portal & MCP Hub and the Platform API off their default ports, either through the APIP_AP_SERVER_PORT variable or by editing the Compose port mappings."
canonical_url: https://wso2.com/api-platform/docs/api-portal/setting-up/ports/
md_url: https://wso2.com/api-platform/docs/api-portal/setting-up/ports.md
tags:
  - cloud
  - api-portal
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Change the ports the API Portal uses

The stack listens on these ports by default:

| Port | Service | Purpose |
|------|---------|---------|
| `9543` | API Portal & MCP Hub | HTTPS — the browser entry point |
| `9243` | Platform API | HTTPS — the local-auth backend and control plane |
| `9643` | AI Workspace | HTTPS — only when you enable the `ai-workspace` profile |

If another process on your machine holds one of these, or your organization reserves it, move the stack off it. The two services work differently: the portal's port is driven by a single environment variable, while the Platform API's is fixed in `docker-compose.yaml`.

!!! note "Two stacks can't share a host"
    Unpacking the distribution twice and starting both fails — each copy binds `9543` and `9243`. Change the ports on the second copy, or stop the first.

## Change the API Portal port

`docker-compose.yaml` reads the same variable on both sides of the portal's mapping and passes it into the container, and the shipped `configs/config.toml` binds the listener from it:



```yaml
    environment:
      APIP_AP_SERVER_PORT: ${APIP_AP_SERVER_PORT:-9543}
    ports:
      - "${APIP_AP_SERVER_PORT:-9543}:${APIP_AP_SERVER_PORT:-9543}"
```

```toml
[api_portal.server]
port = '{{ env "APIP_AP_SERVER_PORT" "9543" }}'
```



So one variable moves the published port and the listener together — no Compose edit required.

1. Set the variable in `api-platform.env`, the file Compose loads into every service:

    ```bash
    APIP_AP_SERVER_PORT=8443
    ```

2. Update `base_url` in `configs/config.toml` to match:

    ```toml
    [api_portal.server]
    base_url = "https://localhost:8443"
    ```

    This is the origin the portal embeds in generated AI-agent prompts, so it has to name the port callers actually reach.

3. Recreate the containers, and open the portal on the new port:

    ```bash
    docker compose up --force-recreate
    ```

    The portal is served under the `/api-portal` path prefix, so the full URL becomes `https://localhost:8443/api-portal/default/views/default`.

## Change the Platform API port

The Platform API's mapping is fixed at `9243:9243`, so this one is a Compose edit. Decide first whether you need the *published* port moved or the *listener* moved — the portal reaches the Platform API over the Compose network, not through the published port.

### Remap the published port only

Enough when the conflict is on your own machine. The container keeps listening on 9243, and Docker publishes it elsewhere:

```yaml
services:
  platform-api:
    ports:
      - "8244:9243"
```

Leave the container side and the `healthcheck` entry alone — both run inside the container, where 9243 still applies. Leave `platform_api_url` alone too, for the same reason (see [Two settings that aren't interchangeable](#two-settings-that-arent-interchangeable)).

### Change the listener port

Choose this when something inside the Docker network needs the new port. Add a `[platform_api.server.https]` table to `configs/config.toml` — the shipped file omits it, so include the certificate paths, which the Platform API requires on its HTTPS listener:

```toml
[platform_api.server.https]
enabled   = true
port      = 8244
cert_file = "/app/data/certs/cert.pem"
key_file  = "/app/data/certs/key.pem"
```

Then update both sides of the mapping and the health check, which runs inside the container:

```yaml
services:
  platform-api:
    ports:
      - "8244:8244"
    healthcheck:
      test: ["CMD", "curl", "-fk", "https://localhost:8244/health"]
```

Finally point the portal at the new listener:

```bash
APIP_AP_AUTH_LOCAL_PLATFORM_API_URL=https://platform-api:8244
```

## Two settings that aren't interchangeable

A port change touches values on either side of the Compose network boundary:

| Setting | Who connects to it | Value |
|---------|--------------------|-------|
| `[api_portal.auth.local] platform_api_url` | The API Portal container, over the Compose network | A full URL using the internal service name and the **container** port — `https://platform-api:9243` |
| The published Platform API port | A browser, the `ap` CLI, or `curl` on your host | The **host** side of the Compose mapping |

Setting `platform_api_url` to a published host port is the common mistake: the portal container can't resolve `localhost` to your machine, so every login fails while the Platform API itself looks healthy. Conversely, remapping only the published port and then editing `platform_api_url` breaks a portal that was working.

## Ports in an OIDC setup

OIDC redirect URLs carry the port, and both must sit under the portal's `/api-portal` mount. After a port change, update these in `configs/config.toml` and register the same values in your identity provider:

```toml
[api_portal.auth.idp]
callback_url        = "https://localhost:8443/api-portal/<org-handle>/callback"
logout_redirect_uri = "https://localhost:8443/api-portal/<org-handle>"
```

See [Connect an identity provider](authentication/connect-an-identity-provider.md).

## Serving plain HTTP

If a trusted upstream terminates TLS, turn the portal's own TLS off rather than changing ports — the single listener then serves plain HTTP on the same port:

```bash
APIP_AP_SERVER_HTTPS_ENABLED=false
```

There is no self-signed fallback: with HTTPS enabled, `cert_file` and `key_file` must both resolve.

## Related

- [Configurations](../references/configurations.md) — how interpolation tokens deliver values into `config.toml`
- [Getting started](../getting-started.md) — the quickstart these defaults come from