---
title: "Deploy on VMs"
description: "Deploy the API Portal & MCP Hub in production on virtual machines with Docker Compose: secrets, TLS, identity provider, database, and load balancing."
canonical_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/deploy-on-vms/
md_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/deployment/deploy-on-vms.md
tags:
  - cloud
  - api-portal
  - deployment
  - docker
  - devops
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-24
content_type: "how-to"
---

# Deploy on VMs

This guide deploys the API Portal & MCP Hub in production on virtual machines, with the Compose distribution on each VM and a load balancer in front of them. It covers every step from the prerequisites to upgrades, with the configuration for each one.

For what each step requires and why, independent of where you run the portal, see the [Overview](overview.md) and the Production Readiness pages: [Security Hardening](security-hardening.md), [Database Configuration](database-configuration.md), [Resources & Scaling](resources-and-scaling.md), and [Control Plane Connection](control-plane-connection.md).

## Prerequisites { #prerequisites }

| Requirement | Detail |
|---|---|
| Two or more VMs | Each running Docker with the Compose plugin |
| Load balancer | Fronting the VMs, health-checking `/health` |
| `openssl` | Available on the VM you provision secrets from |
| Database | An external, highly available PostgreSQL or SQL Server every VM can reach |

Each VM gets its own copy of the distribution. The bundled Platform API and the SQLite default are both switched off for a production deployment, as described in [Instance count](#instance-count) and [Configure the database](#configure-the-database).

## Step 1: Provision the secrets { #provision-the-secrets }

Run the setup script once, on the **first** VM only:

```bash
./scripts/setup.sh
```

It provisions the TLS pair under `resources/certificates/` and the portal's encryption key and session secret under `resources/keys/`, and writes `.env` and `api-platform.env`.

`scripts/setup.sh` writes the secrets as files under `resources/`, which the compose file mounts into the container. They are read through `{{ file }}` tokens rather than environment variables deliberately, so they never appear in `docker inspect` or a process environment dump:

| File | Purpose |
|---|---|
| `resources/keys/api-portal-encryption.key` | At-rest encryption key |
| `resources/keys/api-portal-session-secret` | Session-signing secret |
| `resources/certificates/cert.pem` + `key.pem` | TLS pair |

Then copy the generated material and the two environment files to every other VM before starting them, so all instances share them:

```bash
rsync -a resources/keys resources/certificates <other-vm>:<install-dir>/resources/
rsync -a .env api-platform.env <other-vm>:<install-dir>/
```

Do **not** run `setup.sh` independently on each VM. It would generate a different key and session secret per host, which is the failure described in [Security Hardening](security-hardening.md#secrets). On VMs, keeping the two secrets byte-identical is on you: generate once, then copy `resources/keys/` to every host. The provisioning script leaves existing material untouched when re-run, so upgrades don't rotate secrets out from under running instances.

## Step 2: Configure TLS { #configure-tls }

`setup.sh` writes a **self-signed** pair to `resources/certificates/`, which the compose file mounts at `/etc/api-portal/tls`. That is fine for evaluation and wrong for production — browsers warn, and any client verifying the chain refuses.

Replace both files with a certificate for your real hostname, keeping the same filenames, then recreate the container:

```
resources/certificates/cert.pem
resources/certificates/key.pem
```

If a reverse proxy on the VM terminates TLS instead, set `APIP_AP_SERVER_HTTPS_ENABLED=false` in `api-platform.env` and bind the portal to loopback only. See [Security Hardening → TLS configuration](security-hardening.md#tls-configuration).

## Step 3: Configure authentication { #configure-authentication }

In `configs/config.toml`:

```toml
[api_portal.auth]
mode = "idp"

[api_portal.auth.idp]
issuer             = "https://idp.example.com/oauth2/token"
authorization_url  = "https://idp.example.com/oauth2/authorize"
token_url          = "https://idp.example.com/oauth2/token"
user_info_url      = "https://idp.example.com/oauth2/userinfo"
jwks_url           = "https://idp.example.com/oauth2/jwks"
client_id          = "<portal-client-id>"
callback_url       = "https://portal.example.com/api-portal/<org-handle>/callback"
logout_url         = "https://idp.example.com/oidc/logout"
scope              = "openid profile email"
```

Keep the client secret out of this file — reference it from a mounted file instead, and put the file on every VM:



```toml
client_secret = '{{ file "/secrets/api-portal/oidc_client_secret" }}'
```



Both the callback and logout redirect URLs must sit under the portal's `/api-portal` mount and match what you registered in the identity provider. See [Security Hardening → Authentication](security-hardening.md#authentication).

## Step 4: Configure authorization { #configure-authorization }

Keep authorization on, in the default `role` mode. In `configs/config.toml`:

```toml
[api_portal.auth.authorization]
enabled = true
mode = "role"           # scope | role
```

See [Security Hardening → Authorization](security-hardening.md#authorization) for what each mode does.

## Step 5: Configure the database { #configure-the-database }

Create the database and apply the schema first, as described in [Database Configuration](database-configuration.md).

The shipped `configs/config.toml` carries only `driver` and `path`, so **setting `APIP_AP_DATABASE_HOST` on its own does nothing** — an environment value reaches a setting only where a token references it. Replace the whole `[api_portal.database]` block with the form for your driver from `configs/config-template.toml`:



```toml
[api_portal.database]
driver   = '{{ env "APIP_AP_DATABASE_DRIVER" "postgres" }}'
host     = '{{ env "APIP_AP_DATABASE_HOST" "localhost" }}'
port     = '{{ env "APIP_AP_DATABASE_PORT" "5432" }}'
name     = '{{ env "APIP_AP_DATABASE_NAME" "api_portal" }}'
user     = '{{ env "APIP_AP_DATABASE_USER" "" }}'
password = '{{ env "APIP_AP_DATABASE_PASSWORD" "" }}'
ssl_mode      = "verify-full"
ssl_root_cert = "/etc/api-portal/tls/ca.pem"
```



Then set the values in `api-platform.env` on each VM, including the database password in `APIP_AP_DATABASE_PASSWORD`. Note the TOML keys are snake_case (`ssl_mode`, `ssl_root_cert`) where the Helm values are not.

`user` has no fallback on purpose: a non-SQLite driver with no user, host, or name refuses to start rather than silently connecting as a conventional superuser name to whatever server the defaults point at.

Size the connection pool against your instance count, as described in [Database Configuration → Connection pool tuning](database-configuration.md#connection-pool-tuning). Add the pool settings to the same `[api_portal.database]` block:

```toml
max_open_conns = 25
min_open_conns = 2
pool_idle_timeout_ms = 10000
pool_connection_timeout_ms = 30000
pool_request_timeout_ms = 30000
```

## Step 6: Tighten the try-it proxy and upload ceilings { #try-it-and-uploads }

In `configs/config.toml`, tighten the try-it proxy's development-oriented defaults:

```toml
[api_portal.tryout]
allow_http_endpoints = false    # default true — production should allow only https://
allow_private_endpoints = false # default; leave false unless the gateway is genuinely private
tls_skip_verify = false         # development only
timeout_ms = 15000
max_request_bytes = 1048576
max_response_bytes = 5242880
```

The upload ceilings ship with these defaults. Raise them only deliberately:

```toml
[api_portal.uploads]
max_bytes = 10485760       # 10 MiB per upload, or per entry inside an archive
max_total_bytes = 52428800 # 50 MiB total extracted size per archive
max_zip_entries = 500
max_depth = 10
```

See [Security Hardening → Try-it proxy](security-hardening.md#try-it-proxy) and [Upload ceilings](security-hardening.md#upload-ceilings) for what each setting guards.

## Step 7: Plan instances and resources { #instance-count }

### Instance count

Run the portal on two or more VMs, each with its own copy of the distribution, all pointed at the same external database and fronted by a load balancer.

Drop `platform-api` from the `COMPOSE_PROFILES` line in `.env` on each VM so only the portal runs — an external or already-existing Platform API, if you use one at all, is not part of this stack:

```
COMPOSE_PROFILES=api-portal
```

No sticky sessions are needed on the load balancer: sessions live in the shared database, so any VM can serve any request. Plain round-robin is correct.

### Resources

Give each VM at least 2 vCPU and 2 GiB of RAM, then bound the container itself in `docker-compose.yaml` so a runaway upload can't take the host with it:

```yaml
services:
  api-portal:
    mem_limit: 1g
```

Leave CPU unconstrained — throttling a single-threaded event loop converts a burst into queued latency. See [Resources & Scaling → Resources](resources-and-scaling.md#resources).

### Spread across failure domains

Place the VMs in different availability zones, or at minimum on different hypervisor hosts. Two VMs in one zone survive a process crash but not a zone outage.

Set a restart policy so a crashed container comes back without manual intervention — the shipped compose file already uses `restart: unless-stopped`. Confirm it survived any edits you made.

### Capacity and maintenance

There is no autoscaler. Capacity is the number of VMs you run, so size for peak rather than average and add VMs when sustained load approaches it.

For planned maintenance, take one VM out of the load balancer pool, upgrade it, return it, then move to the next. That is the manual equivalent of a rolling update, and it is why two instances is the floor — with one, there is nothing to drain to.

## Step 8: Front the portal with a load balancer { #front-the-portal }

Point the load balancer at port `9543` on each VM, with its health check on `/health`. Route `/api-portal/*` through without stripping the prefix, as described in [Overview → Fronting the portal](overview.md#fronting-the-portal).

Set the public base URL in `configs/config.toml`:

```toml
[api_portal.server]
base_url = "https://portal.example.com"
```

Set it explicitly whenever the portal sits behind a proxy — it cannot be inferred from the request. See [Change the ports the API Portal uses](../setting-up/ports.md).

Sessions live in the shared database, so no sticky-session configuration is required.

## Step 9: Configure health checks { #health-checks }

Point the load balancer's health check at `https://<vm>:9543/health` and configure it to remove an instance that fails. Without that, the load balancer keeps sending traffic to a portal that has stopped serving.

The compose file has no health check for the portal service. Adding one gives Docker the same signal locally:

```yaml
services:
  api-portal:
    healthcheck:
      test: ["CMD", "wget", "-q", "-O", "/dev/null", "--no-check-certificate", "https://localhost:9543/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

!!! note "Use curl with the public 1.0.0 image"
    API Portal images from update level 1.0.0.1 onward ship `wget` but not `curl`, so this health check uses `wget`. The public `1.0.0` image ships `curl` but not `wget`. If you run that image, use this test instead:

    ```yaml
    services:
      api-portal:
        healthcheck:
          test: ["CMD", "curl", "-fsk", "-o", "/dev/null", "https://localhost:9543/health"]
          interval: 30s
          timeout: 5s
          retries: 3
    ```

## Step 10: Deploy { #deploy }

On each VM, from the distribution directory:

```bash
docker compose up -d
```

`COMPOSE_PROFILES` in `.env` decides what starts. For a standalone portal against an external database, that is `api-portal` alone.

Check the configuration was read as you intended before putting the VM into the load balancer pool — the startup log reports the resolved database driver and the authorization mode:

```bash
docker compose logs api-portal | head -40
```

## Step 11: Verify { #verify }

Confirm every instance is serving, not just that the deploy command succeeded. On each VM:

```bash
docker compose ps
curl -sk https://localhost:9543/health
```

Then confirm the load balancer sees every instance as healthy, and that its health check is pointed at `/health` rather than `/`.

Finally, verify that sessions are shared and that only one instance dispatches each event, as described in [Verify & Upgrade](deploy-and-verify.md#verify).

## Step 12: Register the webhook subscriber { #register-the-subscriber }

Register the subscriber that propagates credentials to your gateways, as described in [Control Plane Connection](control-plane-connection.md#register-the-subscriber).

## Upgrade { #upgrade }

Upgrade one VM at a time so the others keep serving:

1. Remove the VM from the load balancer pool.
2. Update the image tag in `docker-compose.yaml`, then `docker compose up -d` to recreate the container.
3. Confirm `https://localhost:9543/health` responds, and check the startup log.
4. Return it to the pool, then move to the next VM.

Re-running `setup.sh` is safe — it fills in only what is missing and never overwrites an existing value — so an upgrade won't rotate the encryption key out from under stored credentials.

Roll back by putting the previous image tag back and recreating the container.

Before you upgrade, read the two cautions in [Verify & Upgrade → Upgrade](deploy-and-verify.md#upgrade).

## Local authentication (development only) { #local-authentication }

Production deployments delegate login to an identity provider. For a development or demo deployment that uses the built-in login form, point the portal at a Platform API:

```toml
[api_portal.auth.local]
platform_api_url = "https://platform-api:9243"
public_key_path  = "/etc/api-portal/keys/jwt_public.pem"
tls_skip_verify  = false
```

When the Platform API runs in the same Compose stack, use its service name and container port — the portal reaches it over the Compose network, not through a published host port. `setup.sh` writes the keypair to `resources/keys/`, and the compose file mounts the public half into the portal.

Leave `platform_api_url` empty and local authentication is disabled outright. See [Control Plane Connection → Local authentication](control-plane-connection.md#local-authentication-development-only).

## Related

- [Overview](overview.md): architecture, topology, and the production checklist
- [Security Hardening](security-hardening.md): what the secrets, TLS, and authentication settings protect
- [Database Configuration](database-configuration.md): creating the database, applying the schema, and sizing the pool
- [Resources & Scaling](resources-and-scaling.md): why two instances is the floor
- [Control Plane Connection](control-plane-connection.md): the post-install webhook registration