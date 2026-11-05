---
title: "Deploy on Kubernetes"
description: "Deploy the API Portal & MCP Hub in production on Kubernetes with the api-portal Helm chart: secrets, TLS, identity provider, database, and scaling."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/deployment/deploy-on-kubernetes/
md_url: https://wso2.com/api-platform/docs/api-portal/next/deployment/deploy-on-kubernetes.md
tags:
  - cloud
  - api-portal
  - deployment
  - kubernetes
  - helm
  - devops
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-24
content_type: "how-to"
---

# Deploy on Kubernetes

This guide deploys the API Portal & MCP Hub in production on Kubernetes with the `api-portal` Helm chart. It covers every step from the prerequisites to upgrades, with the Helm values for each one. To deploy on Red Hat OpenShift, see [Deploy on OpenShift](openshift.md).

For what each step requires and why, independent of where you run the portal, see the [Overview](overview.md) and the Production Readiness pages: [Security Hardening](security-hardening.md), [Database Configuration](database-configuration.md), [Resources & Scaling](resources-and-scaling.md), and [Control Plane Connection](control-plane-connection.md).

## Prerequisites { #prerequisites }

| Tool | Requirement |
|------|-------------|
| `kubectl` | Configured against your target cluster |
| `helm` | Version 3+ |
| `openssl` | Available in your local shell, to generate keys |
| cert-manager | Installed in the cluster, if the chart issues the portal's certificate (the default). Not needed if you bring your own certificate, as described in [Step 2](#configure-tls). |
| Database | An external, highly available PostgreSQL or SQL Server the cluster can reach |

```bash
kubectl cluster-info
kubectl get nodes
helm version
```

The `api-portal` chart is the product package; values for the portal itself nest under the `api-portal-ui` key. It also carries the Platform API as an optional dependency, on by default for the local-auth quickstart. A deployment that authenticates against an identity provider doesn't need it. With it off, the chart refuses to render unless `api-portal-ui.config.platformApi.baseUrl` names an external Platform API, so point it at the Platform API that fronts your gateways, the one you register as the webhook subscriber in [Control Plane Connection](control-plane-connection.md). The portal calls that URL only for local authentication:

```yaml
platform-api:
  enabled: false
api-portal-ui:
  config:
    platformApi:
      baseUrl: https://<PLATFORM_API_HOST>:<PORT>
```

The examples in this guide add to a values file named `values-production.yaml`.

## Step 1: Provision the secrets { #provision-the-secrets }

The chart never creates or embeds secret values, and it refuses to render without them, so this comes first. Provision them with the bundled `generate-secrets.sh`:

```bash
./generate-secrets.sh api-portal my-release   # <namespace> [release-name]
```

If you'll use PostgreSQL or SQL Server ([Step 5](#configure-the-database)), run it this way instead. The script writes the database password into the portal's Secret only when it creates that Secret, so the password has to be in `APIP_AP_DATABASE_PASSWORD` on this first run. `read -rsp` keeps it off the screen and out of your shell history:

```bash
read -rsp 'Database password: ' APIP_AP_DATABASE_PASSWORD && echo
export APIP_AP_DATABASE_PASSWORD
./generate-secrets.sh api-portal my-release
unset APIP_AP_DATABASE_PASSWORD
```

It writes `values-secrets.yaml`, naming each Secret it created along with the `has*` flags for whichever optional keys it provisioned. Keep that file alongside your own values and pass both at install time. It points the release at the Secret it wrote:

```yaml
api-portal-ui:
  secrets:
    existingSecret: my-release-api-portal-ui-secrets
```

Rendering **fails** if `existingSecret` is unset, so there is no path to starting a release without them.

The optional keys are wired only when the matching flag is true — `secrets.hasIdpClientSecret`, `secrets.hasPublicKey` — and `generate-secrets.sh` sets these in the values file it writes. Referencing one Secret from the release guarantees that every replica uses the same encryption key and session secret. See [Security Hardening → Secrets](security-hardening.md#secrets).

## Step 2: Configure TLS { #configure-tls }

```yaml
api-portal-ui:
  tls:
    certificateProvider: cert-manager   # cert-manager | secret | none
    mountPath: /app/certs
```

| Provider | Use when |
|---|---|
| `cert-manager` | cert-manager runs in the cluster. Set `tls.certManager.issuerRef`, `commonName`, and `dnsNames` to your real hostname — the shipped defaults point at `devportal.localhost` and are development values. |
| `secret` | You hold a certificate already. Set `tls.secret.name` and, if your keys differ, `certKey` / `keyKey`. |
| `none` | A TLS-terminating proxy or ingress fronts the portal. The listener then serves plain HTTP. |

`selfSigned` is deliberately **not** supported — the image has no in-container certificate generation, so the chart rejects it at render time rather than starting a pod that can't serve HTTPS. See [Security Hardening → TLS configuration](security-hardening.md#tls-configuration).

## Step 3: Configure authentication { #configure-authentication }

```yaml
api-portal-ui:
  config:
    auth:
      idp:
        issuer: https://idp.example.com/oauth2/token
        authorizationUrl: https://idp.example.com/oauth2/authorize
        tokenUrl: https://idp.example.com/oauth2/token
        userInfoUrl: https://idp.example.com/oauth2/userinfo
        jwksUrl: https://idp.example.com/oauth2/jwks
        clientId: <portal-client-id>
        callbackUrl: https://portal.example.com/api-portal/<org-handle>/callback
        logoutUrl: https://idp.example.com/oidc/logout
        logoutRedirectUri: https://portal.example.com/api-portal/<org-handle>
        scope: "openid profile email"
```

The chart renders `auth.mode=idp` once `idp.clientId` is set; the client secret comes from the Secret.

`logoutUrl` is the identity provider's logout endpoint, and `logoutRedirectUri` is where the identity provider returns the user after logout. Both `callbackUrl` and `logoutRedirectUri` must sit under the portal's `/api-portal` mount and match what you registered in the identity provider. See [Security Hardening → Authentication](security-hardening.md#authentication).

## Step 4: Configure authorization { #configure-authorization }

Keep authorization on, in the default `role` mode:

```yaml
api-portal-ui:
  config:
    auth:
      authorization:
        enabled: true
        mode: role
```

See [Security Hardening → Authorization](security-hardening.md#authorization) for what each mode does.

## Step 5: Configure the database { #configure-the-database }

Create the database and apply the schema first, as described in [Database Configuration](database-configuration.md).

```yaml
api-portal-ui:
  config:
    database:
      driver: postgres           # sqlite | postgres | mssql
      host: postgres.example.com
      port: 5432
      database: api_portal       # the database name, rendered into config as `name`
      user: api_portal
      sslmode: verify-full       # disable | verify-full
      sslRootCert: /etc/api-portal/db-ca/ca.pem
  deployment:
    # Mounts the database CA that sslRootCert names
    extraVolumes:
      - name: db-ca
        configMap:
          name: postgres-ca
    extraVolumeMounts:
      - name: db-ca
        mountPath: /etc/api-portal/db-ca
        readOnly: true
```

Two key names catch people out: the database name goes in `database`, not `name`, and `sslmode` is all lowercase.

`sslRootCert` names the CA that signed your database server's certificate. The chart doesn't mount that file, so the values above mount it from a ConfigMap. Create the ConfigMap before you deploy:

```bash
kubectl -n api-portal create configmap postgres-ca --from-file=ca.pem=<path-to-database-ca.pem>
```

Without the file, the portal stops at startup with an `ENOENT: no such file or directory` error that names the missing file.

Switching `driver` off `sqlite` is also what unlocks scaling — the chart refuses to render an autoscaler on a database that can't be shared.

The password never appears in a values file. It comes from the release's Secret, under the key `APIP_AP_DATABASE_PASSWORD`, which is also the name of the environment variable the container receives. If you exported it before running `generate-secrets.sh` in [Step 1](#provision-the-secrets), it's already there.

If you ran Step 1 without it, delete the portal's Secret and run Step 1 again with the password exported. Nothing uses the Secret until you deploy in [Step 10](#deploy), so regenerating it loses nothing:

```bash
kubectl -n api-portal delete secret my-release-api-portal-ui-secrets
read -rsp 'Database password: ' APIP_AP_DATABASE_PASSWORD && echo
export APIP_AP_DATABASE_PASSWORD
./generate-secrets.sh api-portal my-release
unset APIP_AP_DATABASE_PASSWORD
```

If the portal pods stop in `CreateContainerConfigError` with a message about `APIP_AP_DATABASE_PASSWORD`, the key is missing from the Secret.

Size the connection pool against your replica count, as described in [Database Configuration → Connection pool tuning](database-configuration.md#connection-pool-tuning):

```yaml
api-portal-ui:
  config:
    database:
      maxOpenConns: 25
      minOpenConns: 2
      poolIdleTimeoutMs: 10000
      poolConnectionTimeoutMs: 30000
      poolRequestTimeoutMs: 30000
```

## Step 6: Tighten the try-it proxy and upload ceilings { #try-it-and-uploads }

Tighten the try-it proxy's development-oriented defaults:

```yaml
api-portal-ui:
  config:
    tryout:
      allowHttpEndpoints: false     # default true — production should allow only https://
      allowPrivateEndpoints: false  # default; leave false unless the gateway is genuinely private
      tlsSkipVerify: false          # development only
      timeoutMs: 15000
      maxRequestBytes: 1048576
      maxResponseBytes: 5242880
```

The upload ceilings ship with these defaults. Raise them only deliberately:

```yaml
api-portal-ui:
  config:
    uploads:
      maxBytes: 10485760       # 10 MiB per upload, or per entry inside an archive
      maxTotalBytes: 52428800  # 50 MiB total extracted size per archive
      maxZipEntries: 500
      maxDepth: 10
```

See [Security Hardening → Try-it proxy](security-hardening.md#try-it-proxy) and [Upload ceilings](security-hardening.md#upload-ceilings) for what each setting guards.

## Step 7: Configure replicas and resources { #instance-count }

### Replica count

```yaml
api-portal-ui:
  deployment:
    replicaCount: 2
```

### Resources

Set requests on every production pod. Without a CPU request the scheduler can't place pods sensibly and the HPA can't compute utilization at all:

```yaml
api-portal-ui:
  deployment:
    resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        memory: 1Gi
```

Prefer leaving `limits.cpu` unset. A CPU limit throttles rather than kills, and throttling a single-threaded event loop turns a brief burst into queued latency across every request that pod is serving. See [Resources & Scaling → Resources](resources-and-scaling.md#resources).

### Spread across failure domains

```yaml
api-portal-ui:
  deployment:
    topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: kubernetes.io/hostname
        whenUnsatisfiable: DoNotSchedule
        labelSelector:
          matchLabels:
            app.kubernetes.io/name: api-portal-ui
```

`DoNotSchedule` is deliberate: it leaves a pod Pending rather than co-locating it, which surfaces an under-provisioned cluster as a visible unscheduled pod instead of a silently fragile deployment. Use `ScheduleAnyway` only if you would rather have a degraded placement than a Pending pod.

For spreading across availability zones, add `topology.kubernetes.io/zone` as a second constraint.

### Autoscaling and disruption

```yaml
api-portal-ui:
  hpa:
    enabled: true
    minReplicas: 2
    maxReplicas: 3
    targetCPUUtilizationPercentage: 80
    targetMemoryUtilizationPercentage: ""   # set a number to also scale on memory
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
```

The chart is fail-fast: it refuses to render an autoscaler for a deployment whose database cannot be shared, rather than scaling one into corruption.

Two prerequisites, both easy to miss:

- **`deployment.resources.requests.cpu` must be set.** Utilization is a ratio against the request; with no request there is nothing to divide by, and the HPA reports unknown metrics indefinitely.
- **metrics-server must be running** in the cluster.

For the PodDisruptionBudget, set exactly one of `minAvailable` or `maxUnavailable`, and enable it only at two or more replicas. With a single pod, `minAvailable: 1` blocks node drains entirely — the cluster can never evict the only pod, so maintenance stalls.

## Step 8: Front the portal { #front-the-portal }

The chart deploys a `Service`, not an Ingress. Bring your own ingress controller or load balancer, and route `/api-portal/*` through without stripping the prefix, as described in [Overview → Fronting the portal](overview.md#fronting-the-portal).

Set the public base URL:

```yaml
api-portal-ui:
  config:
    server:
      baseUrl: https://portal.example.com
```

Sessions live in the shared database, so no sticky-session configuration is required.

## Step 9: Configure health probes { #health-checks }

Point both probes at `/health`:

```yaml
api-portal-ui:
  deployment:
    livenessProbe:
      httpGet: { path: /health, port: http, scheme: HTTPS }
      initialDelaySeconds: 15
      periodSeconds: 10
      failureThreshold: 3
    readinessProbe:
      httpGet: { path: /health, port: http, scheme: HTTPS }
      initialDelaySeconds: 10
      periodSeconds: 5
      failureThreshold: 3
```

If you set `tls.certificateProvider: none`, change both probes' `scheme` from `HTTPS` to `HTTP` — otherwise every probe fails and pods never become ready.

## Step 10: Deploy { #deploy }

The `api-portal` chart pulls its components as OCI dependencies, so fetch them before installing:

```bash
helm dependency update ./api-portal-helm-chart
```

Then install with your production values last, so they win:

```bash
helm install my-release ./api-portal-helm-chart \
  --namespace api-portal --create-namespace \
  -f values-secrets.yaml \
  -f values-production.yaml
```

Render before you install if you want to see what a values change actually produces — this is also where the chart's fail-fast guards fire, before anything is created:

```bash
helm template my-release ./api-portal-helm-chart \
  -f values-secrets.yaml -f values-production.yaml > /dev/null
```

A missing `secrets.existingSecret` or `tls.certificateProvider: selfSigned` fails here with an explicit message.

## Step 11: Verify { #verify }

Confirm every instance is serving, not just that the deploy command succeeded.

```bash
kubectl -n api-portal get pods -l app.kubernetes.io/name=api-portal-ui
kubectl -n api-portal get hpa,pdb
```

Check the pods landed on different nodes — a topology-spread constraint that couldn't be satisfied leaves a pod Pending:

```bash
kubectl -n api-portal get pods -o wide -l app.kubernetes.io/name=api-portal-ui
```

Confirm the portal is serving, from inside the cluster:

```bash
kubectl -n api-portal exec deploy/my-release-api-portal -- \
  wget -qO- --no-check-certificate https://localhost:9543/health
```

Finally, verify that sessions are shared and that only one instance dispatches each event, as described in [Verify & Upgrade](deploy-and-verify.md#verify).

## Step 12: Register the webhook subscriber { #register-the-subscriber }

Register the subscriber that propagates credentials to your gateways, as described in [Control Plane Connection](control-plane-connection.md#register-the-subscriber).

## Upgrade { #upgrade }

```bash
helm dependency update ./api-portal-helm-chart
helm diff upgrade my-release ./api-portal-helm-chart \
  -f values-secrets.yaml -f values-production.yaml    # requires the helm-diff plugin
helm upgrade my-release ./api-portal-helm-chart \
  -f values-secrets.yaml -f values-production.yaml
```

**Always pass the secrets values file.** Omitting it on an upgrade fails the render rather than silently dropping the Secret reference — intended behavior, but it does mean an upgrade command is no shorter than an install command.

Roll back a bad release with `helm rollback my-release`.

Before you upgrade, read the two cautions in [Verify & Upgrade → Upgrade](deploy-and-verify.md#upgrade).

## Local authentication (development only) { #local-authentication }

Production deployments delegate login to an identity provider. For a development or demo deployment that uses the built-in login form, point the portal at the Platform API bundled with the chart. Turn it back on, which replaces the `platform-api.enabled: false` from [Prerequisites](#prerequisites):

```yaml
platform-api:
  enabled: true
api-portal-ui:
  config:
    platformApi:
      baseUrl: ""        # "" derives the in-cluster URL
      insecure: false
    auth:
      publicKeyPath: /etc/devportal/keys/jwt_public.pem
  secrets:
    hasPublicKey: true
```

`baseUrl` must use the in-cluster Service name and **container** port, because the portal connects over the cluster network rather than through a published port or ingress. Pointing it at an externally published address makes every login fail while the Platform API itself looks healthy.

`generate-secrets.sh` copies the public key out of the Platform API's own Secret, so the two stay on the same keypair. Set `hasPublicKey: false` when you have no local-auth path at all. See [Control Plane Connection → Local authentication](control-plane-connection.md#local-authentication-development-only).

### Trust the Platform API certificate { #trust-the-platform-api-certificate }

The portal calls the Platform API inside the cluster at `https://my-release-platform-api:9243` and verifies its certificate. The chart's default certificate is self-signed and issued for `platform-api.localhost`, so with `insecure: false` every login fails. Public certificate authorities (CAs) don't issue certificates for an in-cluster Service name, so issue this one from a private CA and make the portal trust that CA:

1. Create the private CA with cert-manager. A self-signed issuer signs the CA certificate, and the `internal-ca` issuer then signs certificates with it. To use a private CA you already run, skip this step and reference its issuer in step 3.

    ```yaml
    # internal-ca.yaml
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: selfsigned-root
    spec:
      selfSigned: {}
    ---
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
      name: internal-ca
    spec:
      isCA: true
      commonName: internal-ca
      secretName: internal-ca
      privateKey:
        algorithm: ECDSA
        size: 256
      issuerRef:
        name: selfsigned-root
        kind: Issuer
    ---
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: internal-ca
    spec:
      ca:
        secretName: internal-ca
    ```

    ```bash
    kubectl -n api-portal apply -f internal-ca.yaml
    kubectl -n api-portal wait --for=condition=Ready certificate/internal-ca
    ```

2. Copy the CA certificate, without its private key, into a ConfigMap that the portal mounts:

    ```bash
    kubectl -n api-portal get secret internal-ca -o jsonpath='{.data.ca\.crt}' | base64 --decode > ca.pem
    kubectl -n api-portal create configmap internal-ca --from-file=ca.pem
    ```

3. Issue the Platform API's certificate from that CA for the Service name, and point the portal at the CA. The portal runs on Node.js, which adds the certificates in `NODE_EXTRA_CA_CERTS` to the ones it trusts:

    ```yaml
    platform-api:
      tls:
        certManager:
          createIssuer: false
          issuerRef:
            name: internal-ca
            kind: Issuer
          commonName: my-release-platform-api
          dnsNames:
            - my-release-platform-api
    api-portal-ui:
      config:
        platformApi:
          insecure: false
      deployment:
        extraEnv:
          - name: NODE_EXTRA_CA_CERTS
            value: /etc/api-portal/platform-api-ca/ca.pem
        extraVolumes:
          - name: platform-api-ca
            configMap:
              name: internal-ca
        extraVolumeMounts:
          - name: platform-api-ca
            mountPath: /etc/api-portal/platform-api-ca
            readOnly: true
    ```

    `extraVolumes` and `extraVolumeMounts` are lists, and Helm replaces a list instead of merging it. If you also mount the database CA, as described in [Step 5](#configure-the-database), put both volumes in one `extraVolumes` list and both mounts in one `extraVolumeMounts` list.

4. Apply the values with the `helm upgrade` command in [Upgrade](#upgrade), then restart the Platform API. It reads its certificate only at startup, so it keeps serving the previous one until it restarts:

    ```bash
    kubectl -n api-portal rollout restart deployment/my-release-platform-api
    ```

## Related

- [Deploy on OpenShift](openshift.md): the same chart on Red Hat OpenShift
- [Overview](overview.md): architecture, topology, and the production checklist
- [Security Hardening](security-hardening.md): what the secrets, TLS, and authentication settings protect
- [Database Configuration](database-configuration.md): creating the database, applying the schema, and sizing the pool
- [Resources & Scaling](resources-and-scaling.md): why two replicas is the floor
- [Control Plane Connection](control-plane-connection.md): the post-install webhook registration
