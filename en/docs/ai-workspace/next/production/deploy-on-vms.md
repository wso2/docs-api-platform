---
title: "Deploy on VMs"
description: "Deploy AI Workspace in production as a Docker Compose stack on virtual machines: database, identity provider, secrets, TLS, scaling, and gateways."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/deploy-on-vms/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/deploy-on-vms.md
tags:
  - ai-workspace
  - production
  - deployment
  - docker
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-23
content_type: "how-to"
---

# Deploy on VMs

This guide deploys AI Workspace in production as a Docker Compose stack on one or more virtual machines. It takes you from an empty host to a production AI Workspace that people sign in to and gateways connect to, with the full virtual machine configuration for each area. Follow the steps in order, because each one depends on the one before it.

For the architecture and the decisions to make first, see the [Production deployment overview](overview.md). For what each area requires and why, independent of where you run AI Workspace, see the Production Readiness pages: [Provision secrets and keys](secrets-and-keys.md), [Secure traffic with TLS](tls.md), [Expose AI Workspace](expose-the-workspace.md), [Run in high availability](high-availability.md), [Harden the deployment](harden.md), [Connect AI gateways in production](connect-gateways.md), and [Operate the deployment](operate.md). To deploy on Kubernetes instead, see [Deploy on Kubernetes](deploy-on-kubernetes.md).

## Before you start { #before-you-start }

You need:

- A Linux host with a container runtime.
- Permission to create a database, a DNS record, and a TLS certificate.
- An administrator on your identity provider who can register an application.
- Somewhere to store secrets that isn't a file on your laptop.

## About the virtual machine deployment { #about-the-deployment }

Run the Docker Compose stack from the release distribution on a Linux host with a container runtime.

- **Best for:** a fixed number of hosts, teams without a Kubernetes platform, air-gapped or tightly controlled networks.
- **You supply configuration through:** `configs/config.toml`, a single file holding both services' tables, plus the `api-platform.env` file that Compose loads.
- **Scaling:** run the stack on several hosts behind a load balancer, all pointing at one database server.
- **You operate:** the host, the container runtime, the reverse proxy, certificate renewal, and backups.
- **Splitting across hosts:** each service sits behind its own Compose profile, so you can run the Platform API on one host and AI Workspace on another.

Every service names only its own profile, which means enabling one never starts a sibling. `COMPOSE_PROFILES` in the stack's `.env` file decides what comes up on a given host, and `./scripts/setup.sh` writes `ai-workspace,platform-api` there by default.

To put the control plane on its own host, unpack the distribution on both hosts and set a different profile list on each:

```bash
# In .env on the control plane host.
COMPOSE_PROFILES=platform-api

# In .env on the workspace host.
COMPOSE_PROFILES=ai-workspace
```

Put the value in the stack's `.env` file rather than exporting it in a shell. Compose reads `.env` from the directory it runs in, so the setting survives a new terminal and applies to every `docker compose` command on that host.

A split like this changes three settings on the workspace host, because the Compose service name `platform-api` no longer resolves across hosts:

- `[ai_workspace.control_plane] url` becomes the control plane host's address rather than `https://platform-api:9243`.
- `[ai_workspace.control_plane] ca_file` has to trust the certificate that host presents.
- `[ai_workspace.gateway] controlplane_host` becomes the address your gateways reach, which is a separate decision from the address AI Workspace uses.

The encryption key and the database connection belong to the Platform API, so they stay on the control plane host alone. See [Change the ports AI Workspace uses](../setting-up/ports.md) for the difference between those two control plane addresses.

## Step 1: Collect the values you'll need

Write these down before you edit a config file. Every later step reads from this list. Two of the values are costly to change once the identity provider and your gateways point at them.

| Value | Example | Where it's used |
|-------|---------|-----------------|
| Workspace hostname | `workspace.example.com` | The URL users open, and the identity provider redirect URLs |
| Control plane address | `platform-api.example.com:443` | The address gateways connect to. It must resolve from the gateway's network |
| Database endpoint | `postgres.example.com:5432` | The Platform API connection |
| Identity provider issuer | `https://idp.example.com/oauth2/token` | Both services |
| Client ID and client secret | Not applicable | The backend for frontend (BFF) confidential client registration |
| Certificate source | Your certificate authority (CA) | Every HTTPS listener |

!!! warning "Two of these are expensive to change later"
    The workspace hostname is part of the identity provider redirect URLs, so changing it means editing the provider application too. The control plane address is part of every gateway's configuration, and changing it means reconfiguring each gateway with a fresh registration token. Settle both now.

## Step 2: Prepare the database

The Platform API defaults to a SQLite file, which caps it at one instance and puts your control plane's data on one disk. Move to a database server before you deploy anything, not after.

The examples on this page use PostgreSQL. Microsoft SQL Server is equally supported. Set its driver value and connection settings, and everything downstream is the same. Create the database and a login role for it, then provision the schema. The full procedure for either, including the connection pool settings, is in [Connect a database to the Platform API](../setting-up/database.md).

Run the database itself in high availability. A single database server leaves the entire control plane dependent on one machine, regardless of how many Platform API replicas you run.

You point the Platform API at the database in the config file in [Step 6](#step-6-write-the-configuration).

## Step 3: Register AI Workspace with your identity provider

File-based authentication is for the quickstart. Production delegates login to your provider.

Register AI Workspace as a **confidential** web application, not a single-page application. The BFF exchanges the authorization code on the back channel using a client secret, and a public-client registration is refused at the token endpoint.

On the application, configure:

- **Redirect URL:** `https://<workspace-hostname>/ai-workspace/api/auth/callback`. This is a BFF route, not a page in the interface.
- **Post-logout redirect URL:** `https://<workspace-hostname>/ai-workspace/login`
- **Grant types:** authorization code and refresh token, with Proof Key for Code Exchange (PKCE) enabled. Keep `offline_access` in the requested scopes and allow it for the application. Without it the provider returns no refresh token, and users are signed out the moment their access token expires.
- **Access token type:** JSON Web Token (JWT). The Platform API validates the token through your provider's JSON Web Key Set (JWKS) endpoint, which it can't do with an opaque token. A provider left on opaque tokens shows up after login, as proxied calls failing with an invalid token segment count in the Platform API log.
- **Claims:** the username, email, and organization claims, plus whichever claim carries privileges.

Then decide how privileges reach the token. If your provider can register the platform's `ap:*` scopes, use scope-based authorization. If it can't, use role-based authorization and a shared role-to-scope mapping file, as shown in [Step 11](#harden-step-2-keep-authorization-enforced-and-matched).

For the full walkthrough, including claim mappings and the scope registration script, see [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md).

**Before you continue:** copy the client ID and client secret into your secret manager.

## Step 4: Provision secrets and keys { #secrets }

Neither service generates key material at runtime. Provision it now, or startup stops with a message naming what's missing.

### Generate the values { #secrets-step-1-generate-the-values }

Download and unpack the distribution, then generate the values into the directories the containers mount. Set a restrictive umask so no other account on the host can read them:

```bash
umask 077

# At-rest encryption key.
openssl rand -hex 32 > resources/keys/encryption.key

# Database password and OIDC client secret, read from prompts so they stay
# out of your shell history.
mkdir -p secrets
read -rsp 'OIDC client secret: ' v && printf '%s' "$v" > secrets/oidc_client_secret && unset v && echo
read -rsp 'Database password: ' v && printf '%s' "$v" > secrets/postgres_password && unset v && echo
```

!!! danger "Back up the encryption key now, not later"
    The at-rest encryption key protects every stored secret, and it has no recovery path. Copy it into your secret manager the moment you create it. A database backup restored without its encryption key gives you rows that can't be decrypted.

No JWT keypair is needed. In `idp` mode the Platform API validates tokens against your provider's JWKS endpoint and reads neither half of a local keypair.

Confirm the permissions, then restrict the directories too:

```bash
chmod 600 resources/keys/* secrets/*
chmod 700 resources/keys secrets
```

The distribution's `./scripts/setup.sh` generates the same artifacts. Use it if you want the stack running before you wire in managed secrets, then replace each generated file with the managed value.

### Reference the secrets from configuration { #secrets-step-2-reference-the-secrets-from-configuration }

`config.toml` is the only source of configuration. A value reaches it through an interpolation token, resolved once at startup. Prefer the `file` token: the value never enters the process environment, so it can't leak through a process listing or a crash dump. The config file in [Step 6](#step-6-write-the-configuration) reads each secret this way, for example {% raw %}`encryption_key = '{{ file "/etc/platform-api/keys/encryption.key" }}'`{% endraw %}.

`[platform_api.auth.jwt]` doesn't appear in that file, because `idp` mode doesn't use it. If you run `file` or `internal_token` mode, set `public_key_file` and `private_key_file` to mounted paths. They're the exception to the token rule: each is a path, and the service reads and parses the PEM file itself.

Mount each file read-only at the path its token names:

```yaml
services:
  platform-api:
    volumes:
      - ./resources/keys:/etc/platform-api/keys:ro
      - ./secrets/postgres_password:/secrets/platform-api/postgres_password:ro

  ai-workspace:
    volumes:
      - ./secrets/oidc_client_secret:/secrets/ai-workspace/oidc_client_secret:ro
```

A `file` token reads only from an allowed directory: `/etc/platform-api` and `/secrets/platform-api` for the Platform API, `/etc/ai-workspace` and `/secrets/ai-workspace` for AI Workspace. Set `APIP_CONFIG_FILE_SOURCE_ALLOWLIST` to a comma-separated list to replace those defaults.

You confirm that every secret resolves when you start the stack in [Step 7](#step-7-start-the-deployment). For rotation and external secret managers, see [Provision secrets and keys](secrets-and-keys.md).

## Step 5: Secure traffic with TLS { #tls }

Decide where TLS terminates, at the service listeners or at your reverse proxy, and apply that choice consistently. Both models are valid. Mixing them causes connection failures that are hard to trace.

Neither service has a self-signed fallback, so a missing certificate stops an HTTPS listener at startup.

### Supply the certificates { #tls-step-2-supply-the-certificate-for-the-workspace-listener }

Give each service its own certificate and key from your CA, so neither container holds a private key that can impersonate the other. Place them in `resources/certificates/`, keeping the `cert.pem` and `key.pem` file names the stack expects:

```text
resources/certificates/
├── platform-api/
│   ├── cert.pem
│   └── key.pem
└── ai-workspace/
    ├── cert.pem
    └── key.pem
```

Mount each pair read-only into the container that uses it:

```yaml
services:
  platform-api:
    volumes:
      - ./resources/certificates/platform-api:/app/data/certs:ro

  ai-workspace:
    volumes:
      - ./resources/certificates/ai-workspace:/etc/ai-workspace/tls:ro
```

The paths inside each container differ, and the `cert_file` and `key_file` keys in the config file in [Step 6](#step-6-write-the-configuration) already point at them.

The shipped `docker-compose.yaml` mounts a single `resources/certificates/` directory into both containers instead, which serves both services from one pair. That's correct when the two answer on one hostname, but it puts one private key in two places. Split the mounts as shown before you go to production.

**To terminate TLS at a proxy instead,** turn the HTTPS listener off and enable plain HTTP:

```toml
[ai_workspace.server.https]
enabled = false

[ai_workspace.server.http]
enabled = true
port    = 9680
```

**Renew before expiry.** Neither service reloads a certificate while it runs, and neither watches the file for a change. An expired certificate takes the listener down, so treat renewal as a scheduled task rather than something you react to.

Check what you're running against, per service:

```bash
openssl x509 -enddate -noout -in resources/certificates/ai-workspace/cert.pem
```

To renew, write the new pair over the old files, keeping the same paths and the `600` file mode, then recreate the containers. A plain `docker compose up` leaves running containers on the old certificate:

```bash
docker compose up -d --force-recreate
```

Automate the whole sequence on a timer well inside the certificate's lifetime. For a 90-day certificate, renew at 30 days remaining, which leaves room for a failed attempt. Alert on the expiry date from your monitoring as a backstop, so a broken renewal job surfaces before the certificate does.

**Before you continue:** confirm the certificate's subject alternative name covers the hostname users type.

### Make the BFF verify the Platform API { #tls-step-3-make-the-bff-verify-the-platform-api }

The BFF calls the Platform API and verifies its certificate. Point `[ai_workspace.control_plane] ca_file` at the CA bundle that signed that certificate, and leave verification on. The config file in [Step 6](#step-6-write-the-configuration) does this with `ca_file = "/etc/ai-workspace/tls/ca.pem"` and `tls_skip_verify = false`.

The bundle is appended to the system roots, so a certificate from a public CA needs no `ca_file` at all. Mount your bundle under `/etc/ai-workspace` or another allowed directory.

For the certificate on every hop, see [Secure traffic with TLS](tls.md).

## Step 6: Write the configuration

This is the step everything so far feeds into. Start from the shipped file, change what production needs, and keep secrets as references rather than values.

Three values in this step are worth getting right the first time, because each fails at a different moment:

- **`[platform_api.auth] mode`** accepts `internal_token`, `file`, or `idp`. Unset or misspelled, the Platform API stops at startup and names the invalid mode. Production uses `idp`.
- **The Platform API's validator has to match the tokens it receives.** In `idp` mode, set the JWKS URL and issuer to your provider's. Left on another mode, login works and every proxied call fails with an authentication error, because the workspace and the control plane disagree about who validates the token.
- **`[ai_workspace.control_plane] ca_file`** has to cover the issuer of the Platform API's certificate, as in [Step 5](#tls-step-3-make-the-bff-verify-the-platform-api). When it doesn't, the workspace returns `502` and mentions certificate verification. Point it at the correct CA bundle. Setting `tls_skip_verify` instead removes the check that makes the hop trustworthy.

The distribution ships a single `configs/config.toml` holding both services' settings. Each service reads only its own root table: the Platform API reads `[platform_api.*]`, and AI Workspace reads `[ai_workspace.*]`. The shipped `docker-compose.yaml` mounts that one file into both containers.

Start with the Platform API's tables. This is the control plane's database, identity provider, and listener:

{% raw %}

```toml
# configs/config.toml
[platform_api.logging]
level  = "info"
format = "json"

[platform_api.security]
encryption_key = '{{ file "/etc/platform-api/keys/encryption.key" }}'

[platform_api.database]
driver            = "postgres"
host              = "postgres.example.com"
port              = 5432
name              = "platform_api"
user              = "platform_api"
password          = '{{ file "/secrets/platform-api/postgres_password" }}'
ssl_mode          = "verify-full"
ssl_root_cert     = "/etc/platform-api/tls/ca.pem"
max_open_conns    = 25
max_idle_conns    = 10
conn_max_lifetime = 300

[platform_api.auth]
mode = "idp"

[platform_api.auth.idp]
name     = "asgardeo"
jwks_url = "https://idp.example.com/oauth2/jwks"
issuer   = ["https://idp.example.com/oauth2/token"]
audience = ["<client-id>"]

[platform_api.auth.authorization]
enabled = true
mode    = "scope"

[platform_api.server.https]
enabled   = true
port      = 9243
cert_file = "/app/data/certs/cert.pem"
key_file  = "/app/data/certs/key.pem"
```

Then, in the same file, point AI Workspace at that control plane and at the same identity provider:

```toml
# configs/config.toml, continued
[ai_workspace]
domain             = "workspace.example.com"
default_org_region = "us"

[ai_workspace.logging]
level         = "info"
format        = "json"
browser_debug = "false"

[ai_workspace.server.https]
enabled   = true
port      = 9643
cert_file = "/etc/ai-workspace/tls/cert.pem"
key_file  = "/etc/ai-workspace/tls/key.pem"

[ai_workspace.control_plane]
url             = "https://platform-api:9243"
tls_skip_verify = false
ca_file         = "/etc/ai-workspace/tls/ca.pem"

[ai_workspace.gateway]
controlplane_host = "platform-api.example.com:443"

[ai_workspace.auth]
mode = "oidc"

[ai_workspace.auth.authorization]
mode = "scope"

[ai_workspace.auth.oidc]
authority                = "https://idp.example.com/oauth2/token"
client_id                = "<client-id>"
client_secret            = '{{ file "/secrets/ai-workspace/oidc_client_secret" }}'
redirect_url             = "https://workspace.example.com/ai-workspace/api/auth/callback"
post_logout_redirect_url = "https://workspace.example.com/ai-workspace/login"
```

{% endraw %}

A few notes on that file:

- `domain`, the redirect URLs, and `controlplane_host` use the public hostnames that your reverse proxy serves in [Step 8](#expose). The redirect URLs must match the ones you registered on the identity provider application in [Step 3](#step-3-register-ai-workspace-with-your-identity-provider), character for character.
- Leave CORS off unless a browser application on another origin, such as the API Portal, calls the Platform API directly. Then allow only those origins:

    ```toml
    [platform_api.server.cors]
    allowed_origins = "https://workspace.example.com,https://portal.example.com"
    ```

Mount the database CA bundle at the path `ssl_root_cert` names, and pin the image tags to a version rather than a moving tag:

```yaml
services:
  platform-api:
    image: ghcr.io/wso2/api-platform/platform-api:<version>
    volumes:
      - ./resources/tls/ca.pem:/etc/platform-api/tls/ca.pem:ro

  ai-workspace:
    image: ghcr.io/wso2/api-platform/ai-workspace:<version>
```

Keep `configs/config.toml` and `docker-compose.yaml` in version control. Keep `api-platform.env`, `resources/keys/`, and `secrets/` out of it.

## Step 7: Start the deployment

Pull the images first, so the pull isn't part of your startup window:

```bash
docker compose pull
docker compose up -d
docker compose ps
```

Which services start comes from `COMPOSE_PROFILES` in the stack's `.env` file, which `./scripts/setup.sh` sets to `ai-workspace,platform-api`. Narrow it to one name per host to split the two services across hosts, as [About the virtual machine deployment](#about-the-deployment) describes. Point the workspace host's control plane settings at the other host before you start either one.

**Before you continue:** both services must be running and healthy. They fail closed, so a startup message naming a config key or a file path tells you exactly which value didn't resolve. For a file path, confirm three things: the file is mounted at that path, the path sits inside an allowed source directory, and the service account can read it.

```bash
docker compose logs platform-api ai-workspace | grep -i -E 'error|fail'
curl -fsk https://localhost:9243/health
curl -fsk https://localhost:9643/healthz
```

These two checks use `-k`, which skips certificate verification, because the certificate names your public hostname rather than `localhost`. That's acceptable for a liveness check on the host itself. Don't carry `-k` into anything that crosses a network, and don't take it as a precedent for the service-to-service hops, which verify properly. Step 8 checks the same endpoints through the public hostname with verification on.

## Step 8: Expose AI Workspace { #expose }

The services are running but nothing outside can reach them. Put your reverse proxy or ingress in front, and forward the `/ai-workspace` path prefix untouched. A rewrite rule anywhere in the path produces a page that loads while every asset returns `404`, so check the proxy, the ingress, and any load balancer in front of them.

### Publish the workspace URL { #expose-step-1-publish-the-workspace-url }

This nginx server block terminates TLS and proxies to the AI Workspace HTTPS listener. It has a generous read timeout and no response buffering, so streaming LLM responses work:

```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name workspace.example.com;

    ssl_certificate     /etc/nginx/tls/cert.pem;
    ssl_certificate_key /etc/nginx/tls/key.pem;

    location / {
        proxy_pass https://127.0.0.1:9643;

        # Verify the upstream certificate. Drop these four lines when the
        # workspace listener serves plain HTTP instead.
        proxy_ssl_verify       on;
        proxy_ssl_trusted_certificate /etc/nginx/tls/ca.pem;
        proxy_ssl_server_name  on;
        proxy_ssl_name         workspace.example.com;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        # Server-sent events and long-running LLM calls need a generous
        # read timeout and no response buffering.
        proxy_http_version 1.1;
        proxy_buffering    off;
        proxy_read_timeout 300s;
    }
}
```

Bind the workspace listener to the loopback interface or a private network so nothing reaches port `9643` except the proxy. Publish only the proxy's port on the host firewall.

The config file in [Step 6](#step-6-write-the-configuration) sets `[ai_workspace] domain` to the workspace hostname, so the startup banner prints an address an operator can open. Set `domain` to the host, or `host:port`, that browsers use, which is the proxy's address rather than the workspace listener's. Omit the port when the proxy serves on 443. Without it, the banner falls back to the listen address, and a listener bound to a wildcard interface prints `localhost`, which nobody outside the host can open.

The value affects the startup banner only. Redirect URLs, cookies, and CORS are configured separately, so changing `domain` doesn't repoint any of them.

**Before you continue:**

```bash
curl -sSI https://workspace.example.com/ai-workspace/ | head -1
curl -sS  https://workspace.example.com/healthz
```

### Expose the control plane for gateways { #expose-step-2-expose-the-control-plane-for-gateways }

Publish the Platform API to your gateways on its own hostname, restricted to the networks your gateways run in. Either publish its port on an interface your gateways reach and restrict it at the firewall to their source ranges, or put a proxy in front of it. A proxy has to pass WebSocket upgrades and must not close idle connections, because a gateway holds a long-lived connection for configuration updates.

The workspace shows this address in its gateway setup instructions, from `[ai_workspace.gateway] controlplane_host` in the config file. Use `platform-api.example.com:443` when a proxy serves the hostname on the standard port, and `platform-api.example.com:9243` when you publish the Platform API port directly.

For the reasoning behind each setting, see [Expose AI Workspace](expose-the-workspace.md).

## Step 9: Sign in

Open `https://<workspace-hostname>/ai-workspace` and sign in through your identity provider. This is the first end-to-end test, and it exercises the certificate, the ingress, the identity provider registration, and the BFF's connection to the Platform API at once.

Then confirm authorization works, not just authentication. Sign in as a user with a read-only role and check that management actions are unavailable. Login succeeding while every action returns `403` means the token carries no `ap:*` privileges, or the two services disagree on the authorization mode.

**Before you continue:** one administrator and one read-only user can both sign in, and each sees what their role allows.

## Step 10: Run in high availability { #ha }

A single instance of each service serves users, but it makes every restart an outage. Add redundancy now that the deployment is verified.

Raise both services to at least two instances. Signed-in users reach any replica, because the workspace carries the access token in the session cookie and forwards it without a server-side lookup. Two settings keep token renewal working across replicas: session affinity on the workspace pool, and non-rotating refresh tokens for this client in your identity provider, or a reuse grace window.

### Add replicas { #ha-step-3-add-replicas }

Run the same Compose stack on two or more hosts, each with:

- Identical `config.toml` files, apart from anything genuinely host-specific.
- The same encryption key. A host with a different key can't read what the others stored.
- The same database connection.
- A certificate valid for the public hostname, or plain-HTTP listeners behind a TLS-terminating load balancer.

Put a load balancer in front of the hosts, health-checking `/healthz` on the workspace port and `/health` on the Platform API port. Remove a host from rotation before you upgrade it, then add it back once its health check passes.

Configure **session affinity** on the workspace pool. Most load balancers call this sticky sessions or source affinity; a cookie-based method is more accurate than one based on client IP address.

The Platform API pool needs no affinity. Any replica serves any request.

### Autoscale on demand { #ha-step-4-autoscale-on-demand }

Compose has no autoscaler. Size each host for its peak and add hosts as demand grows.

Bound what each service can consume, so a burst on one doesn't take the resources the others need. Add resource limits to each service in `docker-compose.yaml`:

```yaml
services:
  platform-api:
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 1G
        reservations:
          cpus: "0.25"
          memory: 256M
```

Watch CPU and memory against those limits, and treat sustained pressure as the signal to add a host.

### Survive a host failure { #ha-step-5-survive-a-node-or-host-failure }

- Spread hosts across failure domains, such as separate hypervisors, racks, or availability zones.
- Set `restart: unless-stopped` on every service, which the shipped `docker-compose.yaml` already does, so the runtime restarts a crashed container.
- Make the container runtime start on boot, so a rebooted host rejoins by itself.
- Drain one host at a time during maintenance, and wait for its health check before you touch the next.

### Tune the health probes { #ha-step-6-tune-the-health-probes }

The shipped Compose health checks call each endpoint from inside the container. Point your load balancer at the same endpoints, over the port each service listens on.

### Verify high availability { #ha-verify }

```bash
# On each host. -k skips verification because the certificate names the
# public hostname, not localhost; keep it to on-host checks like this one.
docker compose ps
curl -fsk https://localhost:9643/healthz
```

Sign in through the load balancer, then stop the stack on the host that isn't serving your session. The session should survive, and new sign-ins should land on the remaining host.

For the reasoning behind each setting, see [Run in high availability](high-availability.md).

## Step 11: Harden the deployment { #harden }

Your deployment serves users, so the remaining work is narrowing what it exposes. Each item stands on its own, and you can apply them in whatever order suits your change process.

### Remove the file-mode admin credential { #harden-step-1-delegate-login-to-an-identity-provider }

The config file in [Step 6](#step-6-write-the-configuration) switches login to your identity provider and sets `audience`, so a token minted for another application is rejected. Now that the identity provider works, remove the file-mode admin user: delete any `[[platform_api.auth.file.users]]` block from `config.toml`, and delete `APIP_CP_ADMIN_USERNAME` and `APIP_CP_ADMIN_PASSWORD_HASH` from `api-platform.env`.

### Keep authorization enforced and matched { #harden-step-2-keep-authorization-enforced-and-matched }

If your identity provider can't register the platform's scopes, switch both services to role-based authorization with the same role-to-scope mapping:

```toml
# configs/config.toml
[platform_api.auth.authorization]
enabled               = true
mode                  = "role"
role_to_scope_mapping = "/etc/platform-api/role-to-scope-mapping.yaml"

[ai_workspace.auth.authorization]
mode                  = "role"
role_to_scope_mapping = "/etc/ai-workspace/role-to-scope-mapping.yaml"
```

The two paths differ because each container mounts the mapping file at its own location. Point both at the same host file, so the two services always agree on what a role grants. The shipped `docker-compose.yaml` already mounts one file into both.

### Bound what a client can consume { #harden-step-3-bound-what-a-client-can-consume }

Review the connection timeouts and WebSocket limits against your traffic:

```toml
# configs/config.toml
[platform_api.server.timeouts]
read_header = "10s"
read        = "60s"
write       = "120s"
idle        = "120s"

[platform_api.server.websocket]
max_connections    = 1000
connection_timeout = 30
rate_limit_per_min = 1000
```

### Restrict the container { #harden-step-4-restrict-the-container }

Run the containers as the non-root user they already ship with, drop every capability, and turn off privilege escalation:

```yaml
services:
  platform-api:
    user: "10001:10001"
    read_only: false          # the service writes under /app/data
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true

  ai-workspace:
    user: "10001:10001"
    read_only: true           # the BFF holds no on-disk state
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
```

Mount every configuration file, certificate, and secret with `:ro`, as the shipped Compose file does. Keep the host account that runs the container runtime separate from the accounts your team logs in with.

### Restrict what each service can reach { #harden-step-5-restrict-what-each-service-can-reach }

- Bind the workspace listener to the interface your reverse proxy uses, and publish only the proxy's port at the host firewall.
- Allow inbound traffic to the Platform API port only from the workspace hosts and your gateway source ranges.
- Allow outbound traffic only where it's needed: the database, the identity provider's JWKS and token endpoints, and your container registry.
- Put the database on a private network with no route from the internet.

### Reduce what you run { #harden-step-6-reduce-what-you-run }

The Compose file in [Step 6](#step-6-write-the-configuration) pins both images to a version, which makes a rollback deterministic. Leave the `api-portal` profile out of `COMPOSE_PROFILES` unless you use the API Portal, and keep the plain-HTTP listeners off unless a proxy in front of a service terminates TLS.

### Verify the hardening { #harden-verify }

```bash
# The container runs as UID 10001, not root.
docker compose exec platform-api id

# The plain-HTTP listeners aren't answering.
curl -sS http://localhost:9080/health ; echo
curl -sS http://localhost:9680/healthz ; echo
```

Then sign in as a user with a read-only role and confirm the management actions are unavailable.

For the reasoning behind each setting, see [Harden the deployment](harden.md).

## Step 12: Connect AI gateways { #gateways }

The control plane is ready for a data plane. Create a gateway in AI Workspace under **AI Gateways**, copy its registration token, and install the gateway runtime against the control plane address from step 1. The workspace shows that address to gateways from `[ai_workspace.gateway] controlplane_host`, which you set in [Step 6](#step-6-write-the-configuration) and exposed in [Step 8](#expose-step-2-expose-the-control-plane-for-gateways).

The registration token is the gateway token the commands below ask for. Paste it at the `Registration token:` prompt, which keeps it in the `GW_TOKEN` shell variable only until it's written to a file.

### Install the gateway runtime { #gateways-step-3-install-the-gateway-runtime }

Download the gateway distribution and run its setup script, which provisions the at-rest encryption key, the router certificate, and the controller admin credentials. The gateway has no demo mode and stops if any of them is missing.

Put the control plane address and the token in `api-platform.env`, which Compose loads through its `env_file:` directive, rather than on the command line. Use the same address as `controlplane_host`:

```bash
umask 077
read -rsp "Registration token: " GW_TOKEN && echo
printf 'APIP_GW_CONTROLLER_CONTROLPLANE_HOST=%s\n' 'platform-api.example.com:443' >> api-platform.env
printf 'APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=%s\n' "$GW_TOKEN" >> api-platform.env
unset GW_TOKEN
chmod 600 api-platform.env
```

Then start the gateway:

```bash
docker compose up -d
```

Keep `api-platform.env` out of source control and off shared hosts. It holds the token that authorizes this gateway to the control plane.

The gateway's status moves from **Not Active** to **Active** once it connects.

### Turn on registration checks { #gateways-step-5-turn-on-registration-checks }

```toml
# configs/config.toml
[platform_api.gateway]
enable_version_verification            = true
enable_functionality_type_verification = true
```

For the reasoning behind each setting, see [Connect AI gateways in production](connect-gateways.md).

## Step 13: Operate the deployment { #operate }

The deployment runs, and the team that keeps it running needs the same confidence you have. Confirm each of the following before you hand it over:

- **Logs reach your aggregator** from both services. The config file in [Step 6](#step-6-write-the-configuration) sets JSON logs, which most aggregators parse. Choose `text` instead if yours needs it, and set it consistently across the two.
- **Alerts cover** health endpoints, restart loops, database errors, certificate expiry, and a gateway going inactive.
- **Database backups run on a schedule**, and a restore into a non-production environment has been tested end to end.
- **Your secret manager holds the encryption key**, stored separately from the database backup. A backup and the key it needs in one place fail together.

### Collect the logs { #operate-step-1-emit-structured-logs }

Point the container runtime at your collector and cap local files so a log burst can't fill the disk:

```yaml
services:
  platform-api:
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "5"
  ai-workspace:
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "5"
```

### WebSocket metrics { #operate-websocket-metrics }

```toml
[platform_api.server.websocket]
metrics_log_enabled  = true
metrics_log_interval = 10
```

### Back up what you can't regenerate { #operate-step-3-back-up-what-you-cant-regenerate }

Back up the database with your standard tooling, and treat the key files as secrets rather than as part of a host backup. This example uses PostgreSQL; use the equivalent for whichever database you run:

```bash
pg_dump --host postgres.example.com --username platform_api \
  --format=custom --file platform_api-$(date +%F).dump platform_api
```

If you still run SQLite on a single host, back up the database file with the stack stopped, or through SQLite's own backup command. Copying a file that's being written produces a backup that may not restore.

### Upgrade { #operate-step-4-upgrade }

1. Back up the database, and confirm the backup completed.
2. Pin the new image tags in `docker-compose.yaml`.
3. Pull the images before you stop anything, so the pull isn't part of your downtime:

    ```bash
    docker compose pull
    ```

4. Recreate the services:

    ```bash
    docker compose up -d
    ```

5. Confirm both services are healthy and check the logs for startup errors.

Across several hosts, upgrade one at a time. Remove a host from the load balancer, upgrade it, wait for its health check, then return it to rotation before moving to the next.

### Roll back { #operate-step-5-roll-back }

Set the image tags back to the previous version and recreate:

```bash
docker compose up -d
```

Restore the database only if the upgrade changed the schema in a way the previous version can't read. Restoring loses everything written since the backup.

### Uninstall { #operate-step-6-uninstall }

```bash
docker compose down
```

Volumes survive. `docker compose down -v` deletes them, including the database when you still run SQLite. Check what a volume holds before you remove it.

For the reasoning behind each practice, see [Operate the deployment](operate.md).

## Optional: add the API Portal { #optional-add-the-api-portal }

The API Portal is a separate product that shares this same Platform API control plane. It's off by default, and you can add it after AI Workspace is running without reinstalling anything. See [Optional: add the API Portal](overview.md#optional-add-the-api-portal).

The distribution ships the API Portal as a Compose profile named `api-portal`. Start that profile alongside the services you already run. It listens on port `9543`:

```bash
docker compose --profile platform-api --profile ai-workspace --profile api-portal up -d
```

To make that the default for every `docker compose up`, set the profile list in `.env`:

```bash
COMPOSE_PROFILES=platform-api,ai-workspace,api-portal
```

The API Portal needs two secrets of its own: an at-rest encryption key and a session secret. `./scripts/setup.sh` generates both into `resources/keys/`. Provision them as managed secrets for production, the same way you handle the [AI Workspace keys](secrets-and-keys.md).

## Related

- [Production deployment overview](overview.md): the architecture behind these steps, and the decisions to make first
- [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md): step 3 in full
- [Connect a database to the Platform API](../setting-up/database.md): step 2 in full
- [AI Workspace configuration and environment interpolation](../setting-up/configuration.md): how the tokens in step 6 resolve
