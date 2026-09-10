---
title: "Deploy AI Workspace to production"
description: "A step-by-step production deployment of AI Workspace, from collecting hostnames and credentials through to a verified sign-in, scaled replicas, and a connected AI gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/deploy/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/deploy.md
tags:
  - ai-workspace
  - production
  - deployment
  - how-to
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Deploy AI Workspace to production

This page takes you from an empty host or cluster to a production AI Workspace that people sign in to and gateways connect to. Follow the steps in order, because each one depends on the one before it.

The other pages in this section go deeper on a single topic. This page is the main sequence: it tells you what to do next, and links to the detail when you need it.

## Before you start

You need:

- A Linux host with a container runtime, or a Kubernetes cluster at 1.24 or above with Helm 3.
- Permission to create a database, a DNS record, and a TLS certificate.
- An administrator on your identity provider who can register an application.
- Somewhere to store secrets that isn't a file on your laptop.
- On Kubernetes, cert-manager installed in the cluster if you want the charts to issue and renew certificates. Skip it if you bring your own certificates in a `kubernetes.io/tls` Secret.

## Step 1: Collect the values you'll need

Write these down before you edit a config file. Every later step reads from this list. Two of the values are costly to change once the identity provider and your gateways point at them.

| Value | Example | Where it's used |
|-------|---------|-----------------|
| Workspace hostname | `workspace.example.com` | The URL users open, and the identity provider redirect URLs |
| Control plane address | `platform-api.example.com:443` | The address gateways connect to. It must resolve from the gateway's network |
| Database endpoint | `postgres.example.com:5432` | The Platform API connection |
| Identity provider issuer | `https://idp.example.com/oauth2/token` | Both services |
| Client ID and client secret | Not applicable | The backend for frontend (BFF) confidential client registration |
| Certificate source | Your certificate authority (CA), or cert-manager with a `ClusterIssuer` | Every HTTPS listener |

!!! warning "Two of these are expensive to change later"
    The workspace hostname is part of the identity provider redirect URLs, so changing it means editing the provider application too. The control plane address is part of every gateway's configuration, and changing it means reconfiguring each gateway with a fresh registration token. Settle both now.

## Step 2: Prepare the database

The Platform API defaults to a SQLite file, which caps it at one instance and puts your control plane's data on one disk. Move to a database server before you deploy anything, not after.

The examples on this page use PostgreSQL. Microsoft SQL Server is equally supported. Set its driver value and connection settings, and everything downstream is the same. Create the database and a login role for it, then provision the schema. The full procedure for either, including the connection pool settings, is in [Connect a database to the Platform API](../setting-up/database.md).

Run the database itself in high availability. A single database server leaves the entire control plane dependent on one machine, regardless of how many Platform API replicas you run.

## Step 3: Register AI Workspace with your identity provider

File-based authentication is for the quickstart. Production delegates login to your provider.

Register AI Workspace as a **confidential** web application, not a single-page application. The BFF exchanges the authorization code on the back channel using a client secret, and a public-client registration is refused at the token endpoint.

On the application, configure:

- **Redirect URL:** `https://<workspace-hostname>/ai-workspace/api/auth/callback`. This is a BFF route, not a page in the interface.
- **Post-logout redirect URL:** `https://<workspace-hostname>/ai-workspace/login`
- **Grant types:** authorization code and refresh token, with Proof Key for Code Exchange (PKCE) enabled. Keep `offline_access` in the requested scopes and allow it for the application. Without it the provider returns no refresh token, and users are signed out the moment their access token expires.
- **Access token type:** JSON Web Token (JWT). The Platform API validates the token through your provider's JSON Web Key Set (JWKS) endpoint, which it can't do with an opaque token. A provider left on opaque tokens shows up after login, as proxied calls failing with an invalid token segment count in the Platform API log.
- **Claims:** the username, email, and organization claims, plus whichever claim carries privileges.

Then decide how privileges reach the token. If your provider can register the platform's `ap:*` scopes, use scope-based authorization. If it can't, use role-based authorization and a shared role-to-scope mapping file.

For the full walkthrough, including claim mappings and the scope registration script, see [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md).

**Before you continue:** copy the client ID and client secret into your secret manager.

## Step 4: Provision secrets and keys

Neither service generates key material at runtime. Provision it now, or startup stops with a message naming what's missing.

=== "Virtual machine"
    Download and unpack the distribution, then generate the key material into the directories the containers mount:

    ```bash
    umask 077
    openssl rand -hex 32 > resources/keys/encryption.key

    mkdir -p secrets
    read -rsp 'OIDC client secret: ' v && printf '%s' "$v" > secrets/oidc_client_secret && unset v && echo
    read -rsp 'Database password: ' v && printf '%s' "$v" > secrets/postgres_password && unset v && echo
    chmod 600 resources/keys/* secrets/*
    ```

    No JWT keypair is needed. In `idp` mode the Platform API validates tokens against your provider's JWKS endpoint and reads neither half of a local keypair.

=== "Kubernetes"
    Produce the encryption key yourself, or take it from your secret manager, so you hold a copy before anything runs:

    ```bash
    umask 077
    openssl rand -hex 32 | tr -d '\n' > encryption.key
    ```

    No JWT keypair is needed. In `idp` mode the Platform API validates tokens against your provider's JWKS endpoint and reads neither half of a local keypair.

    Read the two supplied values into files rather than typing them into a command. A value on a command line lands in your shell history and in the host's process list:

    ```bash
    read -rsp 'Database password: ' v && printf '%s' "$v" > db_password && unset v && echo
    read -rsp 'OIDC client secret: ' v && printf '%s' "$v" > oidc_client_secret && unset v && echo
    ```

    Create the two Secrets the chart reads. The database password has to match your PostgreSQL instance, and the client secret comes from your identity provider:

    ```bash
    kubectl -n <namespace> create secret generic <release-name>-platform-api-secrets \
      --from-file=ENCRYPTION_KEY=./encryption.key \
      --from-file=DATABASE_PASSWORD=./db_password

    kubectl -n <namespace> create secret generic <release-name>-ai-workspace-ui-secrets \
      --from-file=OIDC_CLIENT_SECRET=./oidc_client_secret
    ```

    Delete the local files once the Secrets exist, keeping only what your secret manager holds:

    ```bash
    shred -u db_password oidc_client_secret
    ```

    Reference them by name in `values-secrets.yaml`, which holds no values and is safe to commit:

    ```yaml
    platform-api:
      secrets:
        existingSecret: <release-name>-platform-api-secrets
    ai-workspace-ui:
      secrets:
        existingSecret: <release-name>-ai-workspace-ui-secrets
    ```

    The chart also ships a `generate-secrets.sh` that invents the key material for you and writes the same file. Use it on a trial cluster. For production, keep the encryption key under your own control, so it lives in your secret manager before the first install and survives a cluster rebuild.

    Use the key names shown above. A pod that later sits in `CreateContainerConfigError` means the Secret is missing, or one of its keys doesn't match what the chart expects. Compare the Secret's keys against the chart's `secrets.keys` map, which [Provision secrets and keys](secrets-and-keys.md) lists in full.

!!! danger "Back up the encryption key now, not later"
    The at-rest encryption key protects every stored secret, and it has no recovery path. Copy it into your secret manager the moment you create it. A database backup restored without its encryption key gives you rows that can't be decrypted.

For rotation, external secret managers, and creating the Secrets by hand, see [Provision secrets and keys](secrets-and-keys.md).

## Step 5: Get certificates in place

Decide where TLS terminates, at the service listeners or at your reverse proxy or ingress, and apply that choice consistently. Both models are valid. Mixing them causes connection failures that are hard to trace.

=== "Virtual machine"
    Place the certificates and keys from your CA in `resources/certificates/`, keeping the `cert.pem` and `key.pem` file names the stack expects. Give each service its own pair, so a compromise of one container yields a key that can't impersonate the other:

    ```text
    resources/certificates/
    ├── platform-api/
    │   ├── cert.pem
    │   └── key.pem
    └── ai-workspace/
        ├── cert.pem
        └── key.pem
    ```

    The shipped `docker-compose.yaml` mounts one `resources/certificates/` directory into both containers, so this layout means editing the two volume mounts and the `cert_file` and `key_file` paths in `config.toml`. See [Secure traffic with TLS](tls.md).

    A single pair mounted into both containers also works, and is correct when both services answer on one hostname. It shares one private key between two services, so keep it for a trial deployment.

=== "Kubernetes"
    Point each component at a cert-manager issuer you already run, or at a `kubernetes.io/tls` Secret you manage. Set `createIssuer: false` so the chart doesn't fall back to a self-signed issuer, which nothing outside the cluster trusts.

Neither service has a self-signed fallback, so a missing certificate stops an HTTPS listener at startup. For the certificate on every hop, including the BFF's connection to the Platform API, see [Secure traffic with TLS](tls.md).

**Before you continue:** confirm the certificate's subject alternative name covers the hostname users type.

## Step 6: Write the configuration

This is the step everything so far feeds into. Start from the shipped file, change what production needs, and keep secrets as references rather than values.

Three values in this step are worth getting right the first time, because each fails at a different moment:

- **`[platform_api.auth] mode`** accepts `internal_token`, `file`, or `idp`. Unset or misspelled, the Platform API stops at startup and names the invalid mode. Production uses `idp`.
- **The Platform API's validator has to match the tokens it receives.** In `idp` mode, set the JWKS URL and issuer to your provider's. Left on another mode, login works and every proxied call fails with an authentication error, because the workspace and the control plane disagree about who validates the token.
- **`[ai_workspace.control_plane] ca_file`** has to cover the issuer of the Platform API's certificate. When it doesn't, the workspace returns `502` and mentions certificate verification. Point it at the correct CA bundle. Setting `tls_skip_verify` instead removes the check that makes the hop trustworthy.

=== "Virtual machine"
    The distribution ships a single `configs/config.toml` holding both services' settings. Each service reads only its own root table: the Platform API reads `[platform_api.*]`, and AI Workspace reads `[ai_workspace.*]`. The shipped `docker-compose.yaml` mounts that one file into both containers.

    Start with the Platform API's tables. This is the control plane's database, identity provider, and listener:

    

    ```toml
    # configs/config.toml
    [platform_api.logging]
    level  = "info"
    format = "json"

    [platform_api.security]
    encryption_key = '{{ file "/etc/platform-api/keys/encryption.key" }}'

    [platform_api.database]
    driver         = "postgres"
    host           = "postgres.example.com"
    port           = 5432
    name           = "platform_api"
    user           = "platform_api"
    password       = '{{ file "/secrets/platform-api/postgres_password" }}'
    ssl_mode       = "verify-full"
    ssl_root_cert  = "/etc/platform-api/tls/ca.pem"
    max_open_conns = 25

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
    level  = "info"
    format = "json"

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

    

    Mount each secret file read-only at the path its token names, and pin the image tags to a version rather than a moving tag:

    ```yaml
    services:
      platform-api:
        image: ghcr.io/wso2/api-platform/platform-api:<version>
        volumes:
          - ./resources/keys:/etc/platform-api/keys:ro
          - ./secrets/postgres_password:/secrets/platform-api/postgres_password:ro
          - ./resources/tls/ca.pem:/etc/platform-api/tls/ca.pem:ro

      ai-workspace:
        image: ghcr.io/wso2/api-platform/ai-workspace:<version>
        volumes:
          - ./secrets/oidc_client_secret:/secrets/ai-workspace/oidc_client_secret:ro
    ```

    Keep `configs/config.toml` and `docker-compose.yaml` in version control. Keep `api-platform.env`, `resources/keys/`, and `secrets/` out of it.

=== "Kubernetes"
    Put everything in one values file of your own and layer it over the chart defaults at install time. Don't edit the chart's `values.yaml`:

    ```yaml
    # my_values.yaml
    global:
      platformApi:
        port: 9243
        tlsEnabled: true

    platform-api:
      enabled: true
      image:
        tag: "<version>"
      config:
        logging:
          level: info
          format: json
        database:
          driver: postgres
          postgres:
            host: postgres.example.com
            port: 5432
            name: platform_api
            user: platform_api
            sslMode: verify-full
            sslRootCert: /etc/platform-api/tls/ca.pem
            maxOpenConns: 25
        auth:
          mode: idp
          idp:
            name: asgardeo
            jwksUrl: https://idp.example.com/oauth2/jwks
            issuer:
              - https://idp.example.com/oauth2/token
            audience:
              - <client-id>
          authorization:
            enabled: true
            mode: scope
      tls:
        certificateProvider: cert-manager
        certManager:
          create: true
          createIssuer: false
          issuerRef:
            name: letsencrypt-production
            kind: ClusterIssuer
          commonName: platform-api.example.com
          dnsNames:
            - platform-api.example.com
      persistence:
        enabled: false          # the database server holds the data now

    ai-workspace-ui:
      enabled: true
      image:
        tag: "<version>"
      config:
        server:
          domain: workspace.example.com
        logging:
          level: info
          format: json
        controlPlane:
          tlsSkipVerify: false
        gateway:
          controlplaneHost: platform-api.example.com:443
        auth:
          mode: oidc
          authorization:
            mode: scope
          oidc:
            authority: https://idp.example.com/oauth2/token
            clientId: <client-id>
            redirectUrl: https://workspace.example.com/ai-workspace/api/auth/callback
            postLogoutRedirectUrl: https://workspace.example.com/ai-workspace/login
      service:
        type: ClusterIP         # the ingress is the entry point
      tls:
        certificateProvider: cert-manager
        certManager:
          create: true
          createIssuer: false
          issuerRef:
            name: letsencrypt-production
            kind: ClusterIssuer
          commonName: workspace.example.com
          dnsNames:
            - workspace.example.com
    ```

    Two notes on that file. The connection keys sit under `config.database.postgres` whatever driver you set, so use that same block for SQL Server. And leave `ai-workspace-ui.config.controlPlane.url` unset. The chart derives the in-cluster Service URL from `global.platformApi`, and setting it is only for an external Platform API.

    Commit `my_values.yaml` and `values-secrets.yaml`. Neither holds a secret value.

## Step 7: Start the deployment

=== "Virtual machine"
    Pull the images first, so the pull isn't part of your startup window:

    ```bash
    docker compose pull
    docker compose up -d
    docker compose ps
    ```

    Which services start comes from `COMPOSE_PROFILES` in the stack's `.env` file, which `./scripts/setup.sh` sets to `ai-workspace,platform-api`. Narrow it to one name per host to split the two services across hosts, as [Choose a deployment shape](overview.md#choose-a-deployment-shape) describes. Point the workspace host's control plane settings at the other host before you start either one.

=== "Kubernetes"
    Resolve the component charts, preview what will be created, then install:

    ```bash
    helm dependency update ./ai-workspace

    helm template <release-name> ./ai-workspace -n <namespace> \
      -f values-secrets.yaml -f my_values.yaml > /tmp/preview.yaml

    helm upgrade --install <release-name> ./ai-workspace -n <namespace> \
      --create-namespace -f values-secrets.yaml -f my_values.yaml \
      --wait --timeout 10m
    ```

**Before you continue:** both services must be running and healthy. They fail closed, so a startup message naming a config key or a file path tells you exactly which value didn't resolve. For a file path, confirm three things: the file is mounted at that path, the path sits inside an allowed source directory, and the service account can read it.

=== "Virtual machine"
    ```bash
    docker compose logs platform-api ai-workspace | grep -i -E 'error|fail'
    curl -fsk https://localhost:9243/health
    curl -fsk https://localhost:9643/healthz
    ```

    These two checks use `-k`, which skips certificate verification, because the certificate names your public hostname rather than `localhost`. That's acceptable for a liveness check on the host itself. Don't carry `-k` into anything that crosses a network, and don't take it as a precedent for the service-to-service hops, which verify properly. Step 8 checks the same endpoints through the public hostname with verification on.

=== "Kubernetes"
    ```bash
    kubectl -n <namespace> get pods
    kubectl -n <namespace> logs deploy/<release-name>-platform-api | grep -i -E 'error|fail'
    ```

## Step 8: Publish the URL

The services are running but nothing outside can reach them. Put your reverse proxy or ingress in front, and forward the `/ai-workspace` path prefix untouched. A rewrite rule anywhere in the path produces a page that loads while every asset returns `404`, so check the proxy, the ingress, and any load balancer in front of them.

=== "Virtual machine"
    Add an nginx server block for the workspace hostname that proxies to port `9643`. Give it a generous read timeout and turn response buffering off, so streaming LLM responses work. Then bind the workspace listener to a private interface, so only the proxy reaches it.

=== "Kubernetes"
    The charts ship no Ingress resource, so write your own. One rule with `path: /ai-workspace` and `pathType: Prefix` routes the whole application.

Do the same for the control plane address gateways connect to, on its own hostname, restricted to the networks your gateways run in. That route has to pass WebSocket upgrades and tolerate long-lived connections.

For the complete nginx block, the Ingress manifests, and the CORS settings, see [Expose AI Workspace](expose-the-workspace.md).

**Before you continue:**

```bash
curl -sSI https://workspace.example.com/ai-workspace/ | head -1
curl -sS  https://workspace.example.com/healthz
```

## Step 9: Sign in

Open `https://<workspace-hostname>/ai-workspace` and sign in through your identity provider. This is the first end-to-end test, and it exercises the certificate, the ingress, the identity provider registration, and the BFF's connection to the Platform API at once.

Then confirm authorization works, not just authentication. Sign in as a user with a read-only role and check that management actions are unavailable. Login succeeding while every action returns `403` means the token carries no `ap:*` privileges, or the two services disagree on the authorization mode.

**Before you continue:** one administrator and one read-only user can both sign in, and each sees what their role allows.

## Step 10: Scale out

A single instance of each service serves users, but it makes every restart an outage. Add redundancy now that the deployment is verified.

Raise both services to at least two instances. Signed-in users reach any replica, because the workspace carries the access token in the session cookie and forwards it without a server-side lookup. Two settings keep token renewal working across replicas:

- **Enable session affinity on the workspace route.**
- **Use non-rotating refresh tokens** for this client in your identity provider, or set a reuse grace window.

Then set resource requests and limits, add a PodDisruptionBudget or a one-host-at-a-time drain procedure, and spread instances across failure domains. On a VM deployment, copy identical key material to every host. A second host with a different encryption key can't read what the first one stored.

See [Run in high availability](high-availability.md).

## Step 11: Harden the deployment

Your deployment serves users, so the remaining work is narrowing what it exposes. Each item stands on its own, and you can apply them in whatever order suits your change process:

- Remove the file-mode admin credential now that the identity provider works.
- Confirm `audience` is set, so a token minted for another application is rejected.
- Review the connection timeouts and WebSocket limits against your traffic.
- Run the containers as the non-root user they already ship with, drop capabilities, and turn off privilege escalation.
- Restrict network reach so only the workspace and your gateways touch the Platform API.

See [Harden the deployment](harden.md).

## Step 12: Connect your first gateway

The control plane is ready for a data plane. Create a gateway in AI Workspace under **AI Gateways**, copy its registration token, and install the gateway runtime against the control plane address from step 1.

The gateway's status moves from **Not Active** to **Active** once it connects. See [Connect AI gateways in production](connect-gateways.md).

## Step 13: Hand over to operations

The deployment runs, and the team that keeps it running needs the same confidence you have. Confirm each of the following before you hand it over:

- **Logs reach your aggregator** from both services. Each has a `format` setting of `text` or `json`. Choose whichever your aggregator parses, and set it consistently across the two.
- **Alerts cover** health endpoints, restart loops, database errors, certificate expiry, and a gateway going inactive.
- **Database backups run on a schedule**, and a restore into a non-production environment has been tested end to end.
- **Your secret manager holds the encryption key**, stored separately from the database backup. A backup and the key it needs in one place fail together.

See [Operate the deployment](operate.md).

## Related

- [Production deployment overview](overview.md): the architecture behind these steps, and the decisions to make first
- [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md): step 3 in full
- [Connect a database to the Platform API](../setting-up/database.md): step 2 in full
- [AI Workspace configuration and environment interpolation](../setting-up/configuration.md): how the tokens in step 6 resolve