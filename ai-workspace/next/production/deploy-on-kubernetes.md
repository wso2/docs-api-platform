---
title: "Deploy on Kubernetes"
description: "Deploy AI Workspace in production on Kubernetes with the ai-workspace Helm chart: database, identity provider, secrets, TLS, scaling, and gateways."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/deploy-on-kubernetes/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/deploy-on-kubernetes.md
tags:
  - ai-workspace
  - production
  - deployment
  - kubernetes
  - helm
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-23
content_type: "how-to"
---

# Deploy on Kubernetes

This guide deploys AI Workspace in production on Kubernetes with the `ai-workspace` Helm chart. It takes you from an empty cluster to a production AI Workspace that people sign in to and gateways connect to, with the full Kubernetes configuration for each area. Follow the steps in order, because each one depends on the one before it.

For the architecture and the decisions to make first, see the [Production deployment overview](overview.md). For what each area requires and why, independent of where you run AI Workspace, see the Production Readiness pages: [Provision secrets and keys](secrets-and-keys.md), [Secure traffic with TLS](tls.md), [Expose AI Workspace](expose-the-workspace.md), [Run in high availability](high-availability.md), [Harden the deployment](harden.md), [Connect AI gateways in production](connect-gateways.md), and [Operate the deployment](operate.md). To deploy on Red Hat OpenShift, see [Deploy on OpenShift](openshift.md). To deploy on virtual machines instead, see [Deploy on VMs](deploy-on-vms.md).

## Before you start { #before-you-start }

You need:

- A Kubernetes cluster at 1.24 or above with Helm 3.
- Permission to create a database, a DNS record, and a TLS certificate.
- An administrator on your identity provider who can register an application.
- Somewhere to store secrets that isn't a file on your laptop.
- cert-manager installed in the cluster if you want the charts to issue and renew certificates. Skip it if you bring your own certificates in a `kubernetes.io/tls` Secret.

## About the Kubernetes deployment { #about-the-deployment }

Install the `ai-workspace` Helm chart. It's an umbrella chart with the `platform-api` and `ai-workspace-ui` component charts as dependencies.

- **Best for:** a cluster you already run, horizontal scaling, and rolling upgrades.
- **You supply configuration through:** your own values file, layered over the chart defaults with `-f`.
- **Scaling:** replica counts and a PodDisruptionBudget, backed by a shared database server. The chart renders a HorizontalPodAutoscaler for any database server driver, PostgreSQL or SQL Server, and refuses one for SQLite.
- **You operate:** the cluster, an ingress controller, cert-manager or your own certificate secrets, and backups.

The charts don't ship an Ingress resource. You write your own, which keeps the ingress class, annotations, and hostnames under your control, as shown in [Step 8](#expose).

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

You point the Platform API at the database in the values file in [Step 6](#step-6-write-the-configuration).

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

Neither service generates key material at runtime. Provision it now, or startup stops with a message naming what's missing. The chart never creates or embeds a secret value. It reads a Secret you created and referenced by name.

### Generate the values { #secrets-step-1-generate-the-values }

Produce the encryption key yourself, or take it from your secret manager. It has no rotation path, so you need a copy of it outside the cluster before anything runs:

```bash
umask 077
openssl rand -hex 32 | tr -d '\n' > encryption.key
```

!!! danger "Back up the encryption key now, not later"
    The at-rest encryption key protects every stored secret, and it has no recovery path. Copy it into your secret manager the moment you create it. A database backup restored without its encryption key gives you rows that can't be decrypted.

No JWT keypair is needed. In `idp` mode the Platform API validates tokens against your provider's JWKS endpoint and reads neither half of a local keypair.

Read the database password and the client secret from a prompt, so neither reaches your shell history or the host's process list:

```bash
read -rsp 'Database password: ' v && printf '%s' "$v" > db_password && unset v && echo
read -rsp 'OIDC client secret: ' v && printf '%s' "$v" > oidc_client_secret && unset v && echo
```

Create the two Secrets, using the key names the chart expects. The database password has to match your PostgreSQL instance, and the client secret comes from your identity provider:

```bash
kubectl -n <namespace> create secret generic <release-name>-platform-api-secrets \
  --from-file=APIP_CP_ENCRYPTION_KEY=./encryption.key \
  --from-file=APIP_CP_DATABASE_PASSWORD=./db_password

kubectl -n <namespace> create secret generic <release-name>-ai-workspace-ui-secrets \
  --from-file=APIP_AIW_AUTH_OIDC_CLIENT_SECRET=./oidc_client_secret
```

Remove the local files once the Secrets exist:

```bash
shred -u db_password oidc_client_secret
```

Remove `encryption.key` too, but only after you confirm that an independent copy is in your secret manager. The key has no recovery path, and the Kubernetes Secret is not a backup:

```bash
shred -u encryption.key
```

The chart also ships a `generate-secrets.sh` that invents the key material, creates both Secrets, and writes the same file. It reads the database password and the client secret from the `APIP_CP_DATABASE_PASSWORD` and `APIP_AIW_AUTH_OIDC_CLIENT_SECRET` environment variables, and it leaves you with an encryption key you never saw and can't restore. Keep it to a trial cluster.

### Reference the secrets from configuration { #secrets-step-2-reference-the-secrets-from-configuration }

Point each component at the Secret that holds its values. The chart injects them as environment variables. Keep the references in `values-secrets.yaml`, which holds no values and is safe to commit:

```yaml
# values-secrets.yaml
platform-api:
  secrets:
    existingSecret: <release-name>-platform-api-secrets
ai-workspace-ui:
  secrets:
    existingSecret: <release-name>-ai-workspace-ui-secrets
```

Rendering fails when `platform-api.secrets.existingSecret` is unset, so a release can't reach the cluster without its secrets in place.

The `keys` map names each key inside the Secret. The following shows the chart's defaults. Override an entry only when your Secret uses different key names:

```yaml
platform-api:
  secrets:
    existingSecret: my-platform-api-secret
    keys:
      encryptionKey: APIP_CP_ENCRYPTION_KEY
      databasePassword: APIP_CP_DATABASE_PASSWORD
      jwtPublicKey: jwt_public.pem
      jwtPrivateKey: jwt_private.pem
      adminUsername: APIP_CP_ADMIN_USERNAME
      adminPasswordHash: APIP_CP_ADMIN_PASSWORD_HASH
```

### Verify the secrets { #secrets-verify }

Confirm that the Secret holds the key names the chart expects:

```bash
kubectl -n <namespace> get secret <release-name>-platform-api-secrets \
  -o json | jq -r '.data | keys[]'
```

This prints the key names only. Don't print `.data` itself: the values are base64-encoded, not encrypted, and they land in your terminal scrollback.

After you install the chart in [Step 7](#step-7-start-the-deployment), a pod in `CreateContainerConfigError` means the referenced Secret or one of its keys is missing.

For rotation and external secret managers, see [Provision secrets and keys](secrets-and-keys.md).

## Step 5: Secure traffic with TLS { #tls }

Decide where TLS terminates, at the service listeners or at your reverse proxy or ingress, and apply that choice consistently. Both models are valid. Mixing them causes connection failures that are hard to trace.

Neither service has a self-signed fallback, so a missing certificate stops an HTTPS listener at startup.

### Supply the certificates { #tls-step-2-supply-the-certificate-for-the-workspace-listener }

Each component chart takes its certificate from one of two providers, and both are valid in production. Pick one and set `certificateProvider` per component:

- **cert-manager** issues and renews the certificate for you, which removes expiry as a failure mode. It needs cert-manager and an issuer in the cluster.
- **A Secret you manage** keeps issuance wherever it already happens, such as an external CA or a secret manager that syncs into the cluster. You handle renewal.

**With cert-manager and your own issuer.** If cert-manager isn't in the cluster, install it first, so its custom resource definitions exist before the chart renders:

```bash
helm repo add jetstack https://charts.jetstack.io --force-update
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true
```

The values file in [Step 6](#step-6-write-the-configuration) points both charts at a `ClusterIssuer` you already run, such as an ACME or private-CA issuer, with `createIssuer: false`. Leaving `createIssuer: true` makes the chart create a self-signed issuer. That's fine for a test cluster and wrong for production, because nothing outside the cluster trusts the result.

**With a Secret you manage.** Create a `kubernetes.io/tls` Secret for each service, and use these `tls` blocks in place of the cert-manager ones in that file:

```yaml
ai-workspace-ui:
  tls:
    certificateProvider: secret
    secret:
      name: ai-workspace-tls
      certKey: tls.crt
      keyKey: tls.key

platform-api:
  tls:
    certificateProvider: secret
    secret:
      name: platform-api-tls
      certKey: tls.crt
      keyKey: tls.key
```

Neither chart accepts a self-signed provider. Rendering fails rather than starting a listener with no working certificate.

**To terminate TLS at the ingress instead,** enable the plain-HTTP listener and route the ingress to it. Apply this to whichever services the ingress fronts:

```yaml
ai-workspace-ui:
  config:
    server:
      http:
        enabled: true
        port: 9080

platform-api:
  config:
    server:
      http:
        enabled: true
        port: 9080
```

**Before you continue:** confirm the certificate's subject alternative name covers the hostname users type.

### Make the BFF verify the Platform API { #tls-step-3-make-the-bff-verify-the-platform-api }

The BFF calls the Platform API inside the cluster and verifies its certificate. When that certificate comes from a private CA, mount the CA bundle and name it in the component config:

```yaml
ai-workspace-ui:
  config:
    controlPlane:
      tlsSkipVerify: false
      caFile: /etc/ai-workspace/tls/ca.pem
  deployment:
    extraVolumes:
      - name: control-plane-ca
        configMap:
          name: internal-ca
    extraVolumeMounts:
      - name: control-plane-ca
        mountPath: /etc/ai-workspace/tls/ca.pem
        subPath: ca.pem
        readOnly: true
```

Leave `config.controlPlane.url` empty to derive the in-cluster Service URL from `global.platformApi`. Set it only when the Platform API runs outside this release.

For the certificate on every hop, see [Secure traffic with TLS](tls.md).

## Step 6: Write the configuration

This is the step everything so far feeds into. Start from the shipped file, change what production needs, and keep secrets as references rather than values.

Three values in this step are worth getting right the first time, because each fails at a different moment:

- **`platform-api.config.auth.mode`** accepts `internal_token`, `file`, or `idp`. Unset or misspelled, the Platform API stops at startup and names the invalid mode. Production uses `idp`.
- **The Platform API's validator has to match the tokens it receives.** In `idp` mode, set the JWKS URL and issuer to your provider's. Left on another mode, login works and every proxied call fails with an authentication error, because the workspace and the control plane disagree about who validates the token.
- **`ai-workspace-ui.config.controlPlane.caFile`** has to cover the issuer of the Platform API's certificate, as in [Step 5](#tls-step-3-make-the-bff-verify-the-platform-api). When it doesn't, the workspace returns `502` and mentions certificate verification. Point it at the correct CA bundle. Setting `tlsSkipVerify` instead removes the check that makes the hop trustworthy.

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
        sslRootCert: /etc/platform-api/db-ca/ca.pem
        maxOpenConns: 25
        maxIdleConns: 10
        connMaxLifetime: 300
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
  deployment:
    # Mounts the database CA that sslRootCert names
    extraVolumes:
      - name: db-ca
        configMap:
          name: postgres-ca
    extraVolumeMounts:
      - name: db-ca
        mountPath: /etc/platform-api/db-ca
        readOnly: true

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
      browserDebug: false
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
      duration: 2160h
      renewBefore: 720h
```

A few notes on that file:

- `domain`, the redirect URLs, and `controlplaneHost` use the public hostnames that your Ingresses serve in [Step 8](#expose). The redirect URLs must match the ones you registered on the identity provider application in [Step 3](#step-3-register-ai-workspace-with-your-identity-provider), character for character.
- The connection keys sit under `config.database.postgres` whatever driver you set, so use that same block for SQL Server.
- `sslRootCert` names the CA that signed your database server's certificate, not the CA of the Platform API's own certificate. The chart doesn't mount that file, so `platform-api.deployment` mounts it from a ConfigMap. Create the ConfigMap before you install:

    ```bash
    kubectl -n <namespace> create configmap postgres-ca --from-file=ca.pem=<path-to-database-ca.pem>
    ```

    Without the file, the Platform API stops at startup with `unable to read CA file`.
- `persistence.enabled: false` is safe because the database holds the data and the certificates come from cert-manager or a Secret, not the volume.
- Leave `ai-workspace-ui.config.controlPlane.url` unset. The chart derives the in-cluster Service URL from `global.platformApi`, and setting it is only for an external Platform API.
- Leave CORS off unless a browser application on another origin, such as the API Portal, calls the Platform API directly. Then allow only those origins:

    ```yaml
    platform-api:
      config:
        server:
          cors:
            allowedOrigins:
              - https://workspace.example.com
              - https://portal.example.com
    ```

Commit `my_values.yaml` and `values-secrets.yaml`. Neither holds a secret value.

## Step 7: Start the deployment

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

```bash
kubectl -n <namespace> get pods
kubectl -n <namespace> logs deploy/<release-name>-platform-api | grep -i -E 'error|fail'
```

## Step 8: Expose AI Workspace { #expose }

The services are running but nothing outside can reach them. Put your reverse proxy or ingress in front, and forward the `/ai-workspace` path prefix untouched. A rewrite rule anywhere in the path produces a page that loads while every asset returns `404`, so check the proxy, the ingress, and any load balancer in front of them.

### Publish the workspace URL { #expose-step-1-publish-the-workspace-url }

The charts ship no Ingress resource, so you write one. That keeps the ingress class, annotations, and hostnames under your control.

The values file in [Step 6](#step-6-write-the-configuration) sets the UI Service to `ClusterIP`, because the ingress controller is the entry point, and sets `config.server.domain` to the workspace hostname.

`config.server.domain` is the host, or `host:port`, that browsers use to reach the workspace. Behind an ingress that's the ingress hostname on 443, not the Service port, so the two differ and the workspace can't infer one from the other. Set it to the ingress hostname and omit the port. Left empty, it defaults to `localhost` on the container port, and the startup banner prints an address that resolves only inside the pod.

The value affects the startup banner only. Redirect URLs, cookies, and CORS are configured separately, so changing `config.server.domain` doesn't repoint any of them.

Then apply an Ingress. This example uses the NGINX ingress controller, terminates TLS at the ingress with a cert-manager certificate, and forwards to the workspace's HTTPS listener:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ai-workspace
  namespace: <namespace>
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
    # The backend listener serves HTTPS. Omit this when you enable the
    # plain-HTTP listener instead.
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    # Long-running LLM calls stream through this hop.
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - workspace.example.com
      secretName: ai-workspace-ingress-tls
  rules:
    - host: workspace.example.com
      http:
        paths:
          - path: /ai-workspace
            pathType: Prefix
            backend:
              service:
                name: <release-name>-ai-workspace
                port:
                  number: 9643
          - path: /
            pathType: Prefix
            backend:
              service:
                name: <release-name>-ai-workspace
                port:
                  number: 9643
```

Both paths point at the same backend. The `/` rule carries the root redirect and the `/healthz` endpoint, which the check below calls on the public hostname.

Confirm the Service name before you apply, because it carries the release name:

```bash
kubectl -n <namespace> get svc
```

Running more than one workspace replica needs session affinity on this Ingress, as shown in [Step 10](#ha-step-3-add-replicas).

**Before you continue:**

```bash
curl -sSI https://workspace.example.com/ai-workspace/ | head -1
curl -sS  https://workspace.example.com/healthz
```

### Expose the control plane for gateways { #expose-step-2-expose-the-control-plane-for-gateways }

Expose the Platform API Service through its own Ingress or load balancer, on a hostname distinct from the workspace, restricted to the networks your gateways run in. That route has to pass WebSocket upgrades and tolerate long-lived connections:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: platform-api
  namespace: <namespace>
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    # Gateways hold a long-lived WebSocket connection.
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    # Restrict to the networks your gateways run in.
    nginx.ingress.kubernetes.io/whitelist-source-range: "203.0.113.0/24"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - platform-api.example.com
      secretName: platform-api-ingress-tls
  rules:
    - host: platform-api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: <release-name>-platform-api
                port:
                  number: 9243
```

The workspace shows this address in its gateway setup instructions, from `ai-workspace-ui.config.gateway.controlplaneHost` in the values file. Use `443` when the ingress serves the hostname on the standard port, and `platform-api.example.com:9243` when you expose the Service port directly.

For the reasoning behind each setting, see [Expose AI Workspace](expose-the-workspace.md).

## Step 9: Sign in

Open `https://<workspace-hostname>/ai-workspace` and sign in through your identity provider. This is the first end-to-end test, and it exercises the certificate, the ingress, the identity provider registration, and the BFF's connection to the Platform API at once.

Then confirm authorization works, not just authentication. Sign in as a user with a read-only role and check that management actions are unavailable. Login succeeding while every action returns `403` means the token carries no `ap:*` privileges, or the two services disagree on the authorization mode.

**Before you continue:** one administrator and one read-only user can both sign in, and each sees what their role allows.

## Step 10: Run in high availability { #ha }

A single instance of each service serves users, but it makes every restart an outage. Add redundancy now that the deployment is verified.

Raise both services to at least two instances. Signed-in users reach any replica, because the workspace carries the access token in the session cookie and forwards it without a server-side lookup. Two settings keep token renewal working across replicas: session affinity on the workspace Ingress, and non-rotating refresh tokens for this client in your identity provider, or a reuse grace window.

Apply each values change in this step and the ones after it with the same `helm upgrade --install` command as in [Step 7](#step-7-start-the-deployment).

### Add replicas { #ha-step-3-add-replicas }

Raise the replica counts:

```yaml
platform-api:
  deployment:
    replicaCount: 2      # requires a database server, not sqlite3

ai-workspace-ui:
  deployment:
    replicaCount: 2      # requires session affinity on the ingress
```

The chart's horizontal pod autoscaler (HPA) needs a database server. It refuses to render for `sqlite3`, which can't be shared, and renders for `postgres`, `sqlserver`, and the `postgresql` and `pgx` aliases.

Add session affinity to the workspace Ingress so each user keeps reaching the pod that holds their session:

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/affinity: "cookie"
    nginx.ingress.kubernetes.io/affinity-mode: "persistent"
    nginx.ingress.kubernetes.io/session-cookie-name: "aiw-affinity"
    nginx.ingress.kubernetes.io/session-cookie-max-age: "28800"
```

Match the cookie lifetime to the session cap in `config.session.absoluteTtl`, which defaults to `8h`.

### Autoscale on demand { #ha-step-4-autoscale-on-demand }

Set requests and limits, then turn on the autoscaler. These values are a starting point, so measure your own traffic and adjust:

```yaml
platform-api:
  deployment:
    resources:
      requests:
        cpu: 250m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi
  hpa:
    enabled: true          # chart refuses this with config.database.driver=sqlite3
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 70

ai-workspace-ui:
  deployment:
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 500m
        memory: 256Mi
  hpa:
    enabled: true
    minReplicas: 2
    maxReplicas: 4
    targetCPUUtilizationPercentage: 70
```

Scaling the workspace down ends the sessions held by the pod that goes away. Keep `minReplicas` at the level that serves your normal load, and prefer scaling up over scaling down aggressively.

### Survive a node failure { #ha-step-5-survive-a-node-or-host-failure }

Add a pod disruption budget (PDB) so a node drain can't take every replica at once. It's meaningful only at two or more replicas. With one replica, `minAvailable: 1` blocks every voluntary eviction and hangs the drain:

```yaml
platform-api:
  podDisruptionBudget:
    enabled: true
    minAvailable: 1

ai-workspace-ui:
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
```

Spread replicas across zones so one zone failing is less likely to take the deployment down:

```yaml
ai-workspace-ui:
  deployment:
    topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable: ScheduleAnyway
        labelSelector:
          matchLabels:
            app.kubernetes.io/name: ai-workspace-ui
```

`whenUnsatisfiable: ScheduleAnyway` is a best-effort constraint. The scheduler prefers a spread and still places the pod when it can't achieve one, so replicas can end up sharing a zone. Set `whenUnsatisfiable: DoNotSchedule` for a hard separation, and accept that pods stay `Pending` when no zone can take them.

Confirm the label selector matches the pods in your release before you rely on it:

```bash
kubectl -n <namespace> get pods --show-labels
```

### Tune the health probes { #ha-step-6-tune-the-health-probes }

```yaml
platform-api:
  deployment:
    startupProbe:
      httpGet:
        path: /health
        port: http
        scheme: HTTPS
      periodSeconds: 5
      failureThreshold: 30
```

### Verify high availability { #ha-verify }

```bash
kubectl -n <namespace> get pods -o wide
kubectl -n <namespace> get hpa
kubectl -n <namespace> get pdb
```

Sign in, then delete a workspace pod other than the one serving you. Your session should survive, and the replacement pod should reach `Ready`.

For the reasoning behind each setting, see [Run in high availability](high-availability.md).

## Step 11: Harden the deployment { #harden }

Your deployment serves users, so the remaining work is narrowing what it exposes. Each item stands on its own, and you can apply them in whatever order suits your change process.

### Remove the file-mode admin credential { #harden-step-1-delegate-login-to-an-identity-provider }

The values file in [Step 6](#step-6-write-the-configuration) switches login to your identity provider and sets `audience`, so a token minted for another application is rejected. In `idp` mode the chart renders no file-mode section, so the admin credential in the Secret goes unread. Remove `APIP_CP_ADMIN_USERNAME` and `APIP_CP_ADMIN_PASSWORD_HASH` from the Secret once the switch is confirmed.

### Keep authorization enforced and matched { #harden-step-2-keep-authorization-enforced-and-matched }

If your identity provider can't register the platform's scopes, switch both services to role-based authorization with the same role-to-scope mapping:

```yaml
platform-api:
  config:
    auth:
      authorization:
        enabled: true
        mode: role
        roleToScopeMapping: /etc/platform-api/role-to-scope-mapping.yaml
        roles:
          - name: ap_admin
            scopes:
              - ap:organization:manage
              - ap:gateway:manage
              - ap:llm_provider:manage
              - ap:llm_proxy:manage
              - ap:mcp_proxy:manage
              - ap:secret:manage

ai-workspace-ui:
  config:
    auth:
      authorization:
        enabled: true
        mode: role
        roleToScopeMapping: /etc/ai-workspace/role-to-scope-mapping.yaml
  deployment:
    # Mount the mapping that the Platform API chart renders from its roles list.
    extraVolumes:
      - name: role-to-scope-mapping
        configMap:
          name: <release-name>-platform-api-config
          items:
            - key: role-to-scope-mapping.yaml
              path: role-to-scope-mapping.yaml
    extraVolumeMounts:
      - name: role-to-scope-mapping
        mountPath: /etc/ai-workspace/role-to-scope-mapping.yaml
        subPath: role-to-scope-mapping.yaml
        readOnly: true
```

Configure both services with the same `mode` and the same role-to-scope mapping. The Platform API chart renders the `roles` list into its `<release-name>-platform-api-config` ConfigMap and mounts it at the path above. The AI Workspace chart has no `roles` setting and mounts no mapping file, so mount the same ConfigMap key into the AI Workspace pod, as shown. Without the file, AI Workspace stops at startup with `role_to_scope_mapping file … could not be read`.

A scope the Platform API doesn't declare fails startup, so a typo surfaces at install. Both services read the mapping only at startup, so restart both after you change the roles.

### Bound what a client can consume { #harden-step-3-bound-what-a-client-can-consume }

Review the connection timeouts and WebSocket limits against your traffic:

```yaml
platform-api:
  config:
    server:
      timeouts:
        readHeader: 10s
        read: 60s
        write: 120s
        idle: 120s
      websocket:
        maxConnections: 1000
        connectionTimeout: 30
        rateLimitPerMin: 1000
```

### Restrict the container { #harden-step-4-restrict-the-container }

Run the containers as the non-root user they already ship with, drop every capability, and turn off privilege escalation:

```yaml
platform-api:
  deployment:
    podSecurityContext:
      runAsNonRoot: true
      runAsUser: 10001
      fsGroup: 10001
      seccompProfile:
        type: RuntimeDefault
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
          - ALL

ai-workspace-ui:
  deployment:
    podSecurityContext:
      runAsNonRoot: true
      runAsUser: 10001
      seccompProfile:
        type: RuntimeDefault
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
          - ALL
```

Test `readOnlyRootFilesystem` on the Platform API in a staging namespace before you enable it there. That service writes under its data volume, and a read-only root filesystem needs every writable path to be a mounted volume.

Turn off service account token automounting where nothing calls the Kubernetes API:

```yaml
global:
  serviceAccount:
    automountServiceAccountToken: false
```

### Restrict what each service can reach { #harden-step-5-restrict-what-each-service-can-reach }

Apply a NetworkPolicy so only the workspace pods and your gateway sources reach the Platform API:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: platform-api-ingress
  namespace: <namespace>
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: platform-api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app.kubernetes.io/name: ai-workspace-ui
        # Gateways that arrive through an Ingress. Omit this entry when
        # gateways reach the Service directly. The pod selector narrows the
        # peer to the ingress controller pods rather than every pod in the
        # ingress-nginx namespace.
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
          podSelector:
            matchLabels:
              app.kubernetes.io/name: ingress-nginx
        # In-cluster gateways.
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: <gateway-namespace>
          podSelector:
            matchLabels:
              app.kubernetes.io/name: gateway
        # Gateways outside the cluster.
        - ipBlock:
            cidr: <gateway-source-cidr>
      ports:
        - protocol: TCP
          port: 9243
```

Include every source your gateways connect from. Omit the `ipBlock` entry when all gateways run in the cluster. Omit the gateway namespace and pod selectors when none of them run in the cluster. A policy that leaves a gateway source out disconnects that gateway from the control plane.

Confirm the pod labels in your release before you apply it, because a NetworkPolicy that selects nothing silently allows everything:

```bash
kubectl -n <namespace> get pods --show-labels
```

### Reduce what you run { #harden-step-6-reduce-what-you-run }

```yaml
platform-api:
  image:
    repository: ghcr.io/wso2/api-platform/platform-api
    tag: "<version>"
    pullPolicy: IfNotPresent

ai-workspace-ui:
  image:
    repository: ghcr.io/wso2/api-platform/ai-workspace
    tag: "<version>"
    pullPolicy: IfNotPresent
```

With a WSO2 subscription, set the pull secret once. The chart attaches it to every pod and rewrites the default image repositories to the subscription registry:

```yaml
global:
  wso2:
    subscription:
      imagePullSecret: wso2-subscription-creds
```

### Verify the hardening { #harden-verify }

```bash
kubectl -n <namespace> get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.securityContext.runAsUser}{"\n"}{end}'
kubectl -n <namespace> get networkpolicy
```

Then sign in as a user with a read-only role and confirm the management actions are unavailable.

For the reasoning behind each setting, see [Harden the deployment](harden.md).

## Step 12: Connect AI gateways { #gateways }

The control plane is ready for a data plane. Create a gateway in AI Workspace under **AI Gateways**, copy its registration token, and install the gateway runtime against the control plane address from step 1. The workspace shows that address to gateways from `ai-workspace-ui.config.gateway.controlplaneHost`, which you set in [Step 6](#step-6-write-the-configuration) and exposed in [Step 8](#expose-step-2-expose-the-control-plane-for-gateways).

The registration token is the gateway token the commands below ask for. Paste it at the `Registration token:` prompt, which keeps it in the `GW_TOKEN` shell variable only until it's written to a file.

### Install the gateway runtime { #gateways-step-3-install-the-gateway-runtime }

Create the at-rest encryption key Secret first. At-rest encryption is mandatory, nothing is generated for you, and the chart doesn't render without the key:

```bash
umask 077
openssl rand 32 > default-aesgcm256-v1.bin
kubectl -n <gateway-namespace> create secret generic gateway-encryption-keys \
  --from-file=default-aesgcm256-v1.bin=default-aesgcm256-v1.bin
shred -u default-aesgcm256-v1.bin
```

Put the registration token in its own Secret. Read it into a protected file rather than passing it with `--set` or `--from-literal`. Either of those records the token in your shell history and in the host's process list:

```bash
umask 077
read -rsp "Registration token: " GW_TOKEN && echo
printf '%s' "$GW_TOKEN" > registration_token
unset GW_TOKEN

kubectl -n <gateway-namespace> create secret generic gateway-registration-token \
  --from-file=token=registration_token

shred -u registration_token
```

Then install the chart, referencing both Secrets by name:

```bash
helm install gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version <gateway-chart-version> -n <gateway-namespace> \
  --set gateway.controller.encryptionKeys.enabled=true \
  --set gateway.controller.encryptionKeys.secretName=gateway-encryption-keys \
  --set gateway.controller.controlPlane.host="platform-api.example.com:443" \
  --set gateway.controller.controlPlane.token.secretName=gateway-registration-token \
  --set gateway.controller.controlPlane.token.key=token
```

`controlPlane.host` is used as the HTTPS and WebSocket authority, so include a non-default port in the value. Port `443` is assumed when you leave it out.

Use the chart version matching the gateway version the **Get Started** section offers.

The gateway's status moves from **Not Active** to **Active** once it connects.

### Turn on registration checks { #gateways-step-5-turn-on-registration-checks }

```yaml
platform-api:
  config:
    gateway:
      enableVersionVerification: true
      enableFunctionalityTypeVerification: true
```

For the reasoning behind each setting, see [Connect AI gateways in production](connect-gateways.md).

## Step 13: Operate the deployment { #operate }

The deployment runs, and the team that keeps it running needs the same confidence you have. Confirm each of the following before you hand it over:

- **Logs reach your aggregator** from both services. The values file in [Step 6](#step-6-write-the-configuration) sets JSON logs, which most aggregators parse. Choose `text` instead if yours needs it, and set it consistently across the two.
- **Alerts cover** health endpoints, restart loops, database errors, certificate expiry, and a gateway going inactive.
- **Database backups run on a schedule**, and a restore into a non-production environment has been tested end to end.
- **Your secret manager holds the encryption key**, stored separately from the database backup. A backup and the key it needs in one place fail together.

### WebSocket metrics { #operate-websocket-metrics }

```yaml
platform-api:
  config:
    server:
      websocket:
        metricsLogEnabled: true
        metricsLogInterval: 10
```

### Back up what you can't regenerate { #operate-step-3-back-up-what-you-cant-regenerate }

Back up the database with your standard tooling. Back up the Secrets separately, into your secret manager rather than into a cluster snapshot.

The Platform API's persistent volume claim carries a `helm.sh/resource-policy: keep` annotation, so it survives `helm uninstall` and a later install with the same release name re-adopts it. That protects you from an accidental uninstall; it isn't a backup, because it doesn't survive losing the cluster.

To remove that data deliberately:

```bash
kubectl -n <namespace> delete pvc <release-name>-platform-api-data
```

### Upgrade { #operate-step-4-upgrade }

1. Back up the database, and confirm the backup completed.
2. Resolve the component chart versions:

    ```bash
    helm dependency update ./ai-workspace
    ```

3. Preview what changes before you apply it:

    ```bash
    umask 077
    helm template <release-name> ./ai-workspace -n <namespace> \
      -f values-secrets.yaml -f my_values.yaml > ./next.yaml
    ```

    The rendered output contains your full configuration. Review it, then remove it:

    ```bash
    shred -u ./next.yaml
    ```

4. Upgrade:

    ```bash
    helm upgrade <release-name> ./ai-workspace -n <namespace> \
      -f values-secrets.yaml -f my_values.yaml --wait --timeout 10m
    ```

5. Confirm the rollout finished and the pods are ready:

    ```bash
    kubectl -n <namespace> rollout status deploy/<release-name>-platform-api
    kubectl -n <namespace> rollout status deploy/<release-name>-ai-workspace
    kubectl -n <namespace> get pods
    ```

With two or more replicas and a PodDisruptionBudget in place, the rollout replaces pods gradually and keeps serving. Workspace sessions held by a replaced pod end, so users on that pod sign in again.

### Roll back { #operate-step-5-roll-back }

```bash
helm history <release-name> -n <namespace>
helm rollback <release-name> <revision> -n <namespace> --wait
```

A rollback reverts the manifests, not the database. Restore from backup separately if the upgrade changed the schema.

### Uninstall { #operate-step-6-uninstall }

```bash
helm uninstall <release-name> -n <namespace>
```

The Platform API's persistent volume claim survives, because of its `helm.sh/resource-policy: keep` annotation. Secrets you created outside the chart, including the ones `generate-secrets.sh` made, also survive. Remove them deliberately once you're certain no data depends on them.

For the reasoning behind each practice, see [Operate the deployment](operate.md).

## Optional: add the API Portal { #optional-add-the-api-portal }

The API Portal is a separate product that shares this same Platform API control plane. It's off by default, and you can add it after AI Workspace is running without reinstalling anything. See [Optional: add the API Portal](overview.md#optional-add-the-api-portal).

The API Portal isn't a component of the `ai-workspace` chart. It ships as its own product chart, `api-portal`, installed as a separate Helm release.

That chart bundles a Platform API of its own. To have both portals share the control plane you already run, disable the bundled copy:

```bash
helm install api-portal oci://ghcr.io/wso2/api-platform/helm-charts/api-portal \
  --version <chart-version> -n <namespace> \
  --set platform-api.enabled=false \
  -f api-portal-values.yaml
```

Run that chart's own `generate-secrets.sh` first. It provisions the portal's encryption key and session secret. It also reuses the RS256 public key from the Platform API Secret, so the portal can verify the tokens the control plane signs.

## Related

- [Production deployment overview](overview.md): the architecture behind these steps, and the decisions to make first
- [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md): step 3 in full
- [Connect a database to the Platform API](../setting-up/database.md): step 2 in full
- [AI Workspace configuration and environment interpolation](../setting-up/configuration.md): how the tokens in step 6 resolve