---
title: "Deploy on OpenShift"
description: "Install the API Portal and the Platform API on Red Hat OpenShift with the api-portal Helm chart, and expose them through OpenShift Routes."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/deployment/openshift/
md_url: https://wso2.com/api-platform/docs/api-portal/next/deployment/openshift.md
tags:
  - api-portal
  - openshift
  - deployment
  - kubernetes
  - helm
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-24
content_type: "how-to"
---

# Deploy the API Portal on OpenShift

This guide is for platform administrators who install the API Portal on Red Hat OpenShift. You install it with the `api-portal` Helm chart, which deploys two components: the shared Platform API control plane and the API Portal itself. Steps 1 to 8 install it, and [Production configuration](#production-configuration) then takes it to production.

API Portal artifacts can be deployed on OpenShift using the same Helm charts, Docker images, and configuration model as standard Kubernetes deployments. By default, OpenShift may assign a random UID to the container process within the project's permitted range. Containers typically run with GID 0 (the root group), allowing applications to access files and directories with appropriate group permissions without requiring root privileges. When deploying API Portal artifacts, ensure that the pod and container security contexts configured through the Helm chart values are compatible with the Security Context Constraints (SCCs) enforced by your OpenShift cluster. Review the [OpenShift security context](#section-1) section for configuration guidance.

For more information about OpenShift container security and file permissions, see [Red Hat's guide to OpenShift and UIDs](https://www.redhat.com/en/blog/a-guide-to-openshift-and-uids) and [Group ownership and file permission](https://developers.redhat.com/blog/2020/10/26/adapting-docker-and-kubernetes-containers-to-run-on-red-hat-openshift-container-platform#group_ownership_and_file_permission). To deploy a gateway, see [Deploy the gateway on OpenShift](../../../api-gateway/next/deployment/deployment-modes/openshift/openshift-standalone.md).

!!! warning "Before you deploy on OpenShift, make sure you have the following:"

    1. **The Secrets that `generate-secrets.sh` creates**: the chart refuses to install without them.
    2. **cert-manager, or your own TLS Secrets**: by default, cert-manager issues the HTTPS certificates of both components. To use your own Secrets instead, set `tls.certificateProvider: secret` and `tls.secret.name` under both `platform-api` and `api-portal-ui`.
    3. **A StorageClass**: both components store their SQLite databases in PersistentVolumeClaims (PVCs). Either the cluster has a default StorageClass, or you set one explicitly.

---

## Install the API Portal

### Step 1: Install the required tools { #step-1 }

You need the following tools on your machine:

| Tool | Purpose | Install guide |
| ---- | ------- | ------------- |
| `oc` and `kubectl` | OpenShift CLI for managing cluster resources. The OpenShift CLI download includes both. | [Install the OpenShift CLI](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html) |
| `helm` (v3) | Package manager for deploying the Helm chart | [Install Helm](https://helm.sh/docs/intro/install/) |
| `openssl` | Used by `generate-secrets.sh` to generate keys | Pre-installed on most systems |
| `htpasswd` | Used by `generate-secrets.sh` to hash the admin password | Pre-installed on macOS. On Linux, install `httpd-tools` (RHEL, Fedora) or `apache2-utils` (Debian, Ubuntu). |

To check that the tools are installed, run the following commands:

```bash
oc version
kubectl version --client
helm version
openssl version
```

### Step 2: Log in to OpenShift { #step-2 }

1. Authenticate with the OpenShift CLI:

    === "Username and password"

        ```bash
        oc login <API_SERVER_URL> -u <USERNAME>
        ```

        `oc` prompts for the password, which keeps it out of your shell history and the process list.

    === "Token"

        ```bash
        oc login <API_SERVER_URL> --token=<TOKEN>
        ```

2. Verify your connection and check the selected project:

    ```bash
    # Verify connection
    oc whoami

    # Check the selected project
    oc project
    ```

!!! warning "Use a dedicated project"
    Create a dedicated project for your deployment instead of using the `default` project. A dedicated project isolates resources and enforces the security policies.

    ```bash
    oc new-project <PROJECT-NAME>
    ```

    OpenShift creates the matching Kubernetes namespace and switches the current context to it. The rest of this guide uses `<PROJECT-NAME>` for that namespace.

### Step 3: Install cert-manager { #step-3 }

Both components use cert-manager to issue their HTTPS certificates. If cert-manager is already installed on the cluster, or you use your own TLS Secrets, skip this step.

```bash
helm upgrade --install \
  cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --version v1.19.1 \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true \
  --wait --timeout 10m
```

!!! note
    You can use the [cert-manager Operator for Red Hat OpenShift](https://docs.openshift.com/container-platform/latest/security/cert_manager_operator/index.html) instead of the Helm chart.

### Step 4: Download the chart { #step-4 }

Download and extract the chart. It contains the `generate-secrets.sh` script that the next step uses:

```bash
helm pull oci://ghcr.io/wso2/api-platform/helm-charts/api-portal \
  --version <CHART_VERSION> --untar
```

### Step 5: Generate the Secrets { #step-5 }

Run the script with `bash`, passing the project name and the release name you install with. The downloaded chart doesn't keep the script's executable permission, so running it directly fails with `Permission denied`. This guide uses the release name `api-portal`:

```bash
bash ./api-portal/generate-secrets.sh <PROJECT-NAME> api-portal
```

The script does the following:

- Creates `api-portal-platform-api-secrets`, which holds the Platform API's encryption key, RS256 JWT key pair, and file-mode admin credential.
- Creates `api-portal-api-portal-ui-secrets`, which holds the portal's keys and a copy of the Platform API's public key.
- Prints the **generated admin password once**. Store it right away. There's no `admin/admin` default.
- Writes `values-secrets.yaml`, which holds only the Secret names and is safe to commit.

For optional inputs, such as database passwords and the OpenID Connect (OIDC) client secret, see the [API Portal chart README](https://github.com/wso2/api-platform/blob/main/kubernetes/helm/api-portal-helm-chart/README.md#step-1-generate-the-secrets). For how to manage these Secrets in production, see [Security hardening](security-hardening.md).

### Step 6: Deploy the API Portal { #step-6 }

1. Get your cluster's apps domain, which OpenShift uses to generate Route hosts:

    ```bash
    oc get ingresses.config.openshift.io cluster -o jsonpath='{.spec.domain}'
    ```

2. Add the following settings to your `my_values.yaml` file. Replace `<APPS_DOMAIN>` with the domain from the previous step:

    ```yaml
    platform-api:
      openshift:
        enabled: true

    api-portal-ui:
      # The Route sends traffic to the Service inside the cluster, so a LoadBalancer
      # Service (the chart default) is not needed.
      service:
        type: ClusterIP
      config:
        server:
          # The portal's public URL: its Route host.
          baseUrl: https://api-portal-api-portal-<PROJECT-NAME>.<APPS_DOMAIN>
      openshift:
        enabled: true
    ```

    To use your own hostname, set `api-portal-ui.openshift.routes.apiPortal.hostname` and use the same host in `baseUrl`.

    **Platform API certificate**: the portal calls the Platform API inside the cluster at `https://api-portal-platform-api:9243` and verifies its certificate. The chart's default certificate is self-signed and issued for `platform-api.localhost`, so verification fails.

    - For an evaluation deployment, allow the certificate explicitly with the following values.
    - For production, leave this setting unset. Issue the Platform API's certificate for the Service name from a private certificate authority (CA) that the portal trusts, as described in [Trust the Platform API certificate](#trust-the-platform-api-certificate).

    ```yaml
    api-portal-ui:
      config:
        platformApi:
          insecure: true
    ```

    **Storage class**: skip this setting if your cluster has a default StorageClass. Check with `oc get storageclass`.

    ```yaml
    platform-api:
      persistence:
        storageClass: "<STORAGE_CLASS>"
    api-portal-ui:
      persistence:
        storageClass: "<STORAGE_CLASS>"
    ```

    **Security context** (recommended): see [OpenShift security context](#section-1).

    **Custom image** (optional): to use your own API Portal image, set `api-portal-ui.image.repository` and `api-portal-ui.image.tag`. For the permissions the image needs, see [Custom images](#section-4).

3. Deploy the chart:

    ```bash
    helm upgrade --install api-portal ./api-portal \
      --namespace <PROJECT-NAME> \
      -f values-secrets.yaml \
      -f my_values.yaml
    ```

4. Wait for the pods to be ready:

    ```bash
    oc get pods -n <PROJECT-NAME> -w
    ```

    Both the `api-portal-platform-api` and `api-portal-api-portal` pods show `1/1 Running` when they're ready.

### Step 7: Verify the Routes { #step-7 }

The charts create OpenShift `Route` objects. To list them, run the following command:

```bash
oc get route -n <PROJECT-NAME>
```

The output is similar to the following:

```
NAME                      HOST/PORT                                              SERVICES                  PORT   TERMINATION
api-portal-api-portal     api-portal-api-portal-<PROJECT-NAME>.<APPS_DOMAIN>     api-portal-api-portal     http   passthrough/None
api-portal-platform-api   api-portal-platform-api-<PROJECT-NAME>.<APPS_DOMAIN>   api-portal-platform-api   http   passthrough/None
```

The Service ports are named `http`, but they serve HTTPS. The Routes pass the TLS connections through to the components.

### Step 8: Log in to the API Portal { #step-8 }

1. Print the portal URL and open it in a browser:

    ```bash
    echo "https://$(oc get route api-portal-api-portal -n <PROJECT-NAME> -o jsonpath='{.spec.host}')/api-portal/default/views/default"
    ```

    The `default` path segment is the organization handle (`api-portal-ui.config.organization.handle`).

2. Select **Login**, and sign in as `admin` with the password that `generate-secrets.sh` printed.

---

## Production configuration { #production-configuration }

The steps above install the portal with the chart's defaults, which suit an evaluation. For production, add the following settings to your `my_values.yaml` file, then apply them with the same command as in [Step 6](#step-6):

```bash
helm upgrade --install api-portal ./api-portal \
  --namespace <PROJECT-NAME> \
  -f values-secrets.yaml \
  -f my_values.yaml
```

For what each setting protects and why, see the Production Readiness pages: [Security Hardening](security-hardening.md), [Database Configuration](database-configuration.md), [Resources & Scaling](resources-and-scaling.md), and [Control Plane Connection](control-plane-connection.md).

### Turn off the bundled Platform API

The `api-portal` chart carries the Platform API as an optional dependency, on by default for the local-auth quickstart. A deployment that authenticates against an identity provider doesn't need it. With it off, the chart refuses to render unless `api-portal-ui.config.platformApi.baseUrl` names an external Platform API, so point it at the Platform API that fronts your gateways, the one you register as the webhook subscriber in [Control Plane Connection](control-plane-connection.md). The portal calls that URL only for local authentication:

```yaml
platform-api:
  enabled: false
api-portal-ui:
  config:
    platformApi:
      baseUrl: https://<PLATFORM_API_HOST>:<PORT>
```

### Configure authentication { #configure-authentication }

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
        callbackUrl: https://<PORTAL_HOST>/api-portal/<org-handle>/callback
        logoutUrl: https://idp.example.com/oidc/logout
        logoutRedirectUri: https://<PORTAL_HOST>/api-portal/<org-handle>
        scope: "openid profile email"
```

The chart renders `auth.mode=idp` once `idp.clientId` is set; the client secret comes from the Secret. `generate-secrets.sh` provisions it and sets `secrets.hasIdpClientSecret` in the values file it writes.

`logoutUrl` is the identity provider's logout endpoint, and `logoutRedirectUri` is where the identity provider returns the user after logout. Both `callbackUrl` and `logoutRedirectUri` must sit under the portal's `/api-portal` mount and match what you registered in the identity provider. Use the portal's Route host, the same host as in `baseUrl`. See [Security Hardening → Authentication](security-hardening.md#authentication).

### Configure authorization { #configure-authorization }

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

### Configure the database { #configure-the-database }

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

`sslRootCert` names the CA that signed your database server's certificate. The chart doesn't mount that file, so the values above mount it from a ConfigMap. Create the ConfigMap before you apply this configuration:

```bash
oc -n <PROJECT-NAME> create configmap postgres-ca --from-file=ca.pem=<path-to-database-ca.pem>
```

Without the file, the portal stops at startup with an `ENOENT: no such file or directory` error that names the missing file.

Switching `driver` off `sqlite` is also what unlocks scaling — the chart refuses to render an autoscaler on a database that can't be shared.

The password never appears in a values file. It comes from the release's Secret, under the key `APIP_AP_DATABASE_PASSWORD`, which is also the name of the environment variable the container receives. `generate-secrets.sh` writes that key only when it creates the Secret, and the Secret already exists from [Step 5](#step-5), so add the key to it. If you exported `APIP_AP_DATABASE_PASSWORD` before running the script in Step 5, the key is already there and you can skip this.

Read the password into a file only you can read, so it stays out of your shell history and the process list, then add it to the Secret:

```bash
umask 077
read -rsp 'Database password: ' DB_PASSWORD && echo
printf '%s' "$DB_PASSWORD" > db_password && unset DB_PASSWORD
oc -n <PROJECT-NAME> set data secret/api-portal-api-portal-ui-secrets \
  --from-file=APIP_AP_DATABASE_PASSWORD=db_password && \
  shred -u db_password
```

`oc set data` adds the key and keeps the Secret's other keys. The portal reads it after the `helm upgrade` that switches `driver` off `sqlite`, which restarts its pods. If they stop in `CreateContainerConfigError` with a message about `APIP_AP_DATABASE_PASSWORD`, the key is missing from the Secret.

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

### Tighten the try-it proxy and upload ceilings { #try-it-and-uploads }

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

### Configure replicas and resources { #instance-count }

**Replica count:**

```yaml
api-portal-ui:
  deployment:
    replicaCount: 2
```

**Resources:** set requests on every production pod. Without a CPU request the scheduler can't place pods sensibly and the HPA can't compute utilization at all:

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

Prefer leaving `limits.cpu` unset. A CPU limit throttles rather than kills, and throttling a single-threaded event loop turns a brief burst into queued latency across every request that pod is serving. If your project has a LimitRange that sets a default CPU limit, it applies to the pod unless you set one yourself.

**Spread across failure domains:**

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

**Autoscaling and disruption:**

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
- **The cluster must serve resource metrics.** OpenShift's built-in monitoring provides them.

For the PodDisruptionBudget, set exactly one of `minAvailable` or `maxUnavailable`, and enable it only at two or more replicas. With a single pod, `minAvailable: 1` blocks node drains entirely — the cluster can never evict the only pod, so maintenance stalls.

### Configure health probes { #health-checks }

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

### Verify { #verify }

Confirm every instance is serving, not just that the deploy command succeeded.

```bash
oc get pods -n <PROJECT-NAME> -l app.kubernetes.io/name=api-portal-ui
oc get hpa,pdb -n <PROJECT-NAME>
```

Check the pods landed on different nodes — a topology-spread constraint that couldn't be satisfied leaves a pod Pending:

```bash
oc get pods -n <PROJECT-NAME> -o wide -l app.kubernetes.io/name=api-portal-ui
```

Confirm the portal is serving, from inside the cluster:

```bash
oc exec -n <PROJECT-NAME> deploy/api-portal-api-portal -- \
  wget -qO- --no-check-certificate https://localhost:9543/health
```

Finally, verify that sessions are shared and that only one instance dispatches each event, as described in [Verify & Upgrade](deploy-and-verify.md#verify).

### Register the webhook subscriber { #register-the-subscriber }

Register the subscriber that propagates credentials to your gateways, as described in [Control Plane Connection](control-plane-connection.md#register-the-subscriber).

### Upgrade { #upgrade }

```bash
helm upgrade api-portal ./api-portal \
  --namespace <PROJECT-NAME> \
  -f values-secrets.yaml \
  -f my_values.yaml
```

**Always pass the secrets values file.** Omitting it on an upgrade fails the render rather than silently dropping the Secret reference — intended behavior, but it does mean an upgrade command is no shorter than an install command.

Roll back a bad release with `helm rollback api-portal -n <PROJECT-NAME>`.

Before you upgrade, read the two cautions in [Verify & Upgrade → Upgrade](deploy-and-verify.md#upgrade).

### Local authentication (development only) { #local-authentication }

The steps above use local authentication through the bundled Platform API. Production deployments delegate login to an identity provider instead. To keep local authentication with this production configuration, turn the bundled Platform API back on, which replaces the `platform-api.enabled: false` from [Turn off the bundled Platform API](#turn-off-the-bundled-platform-api). The local-auth settings are:

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

`baseUrl` must use the in-cluster Service name and **container** port, because the portal connects over the cluster network rather than through a published port or Route. Pointing it at an externally published address makes every login fail while the Platform API itself looks healthy.

`generate-secrets.sh` copies the public key out of the Platform API's own Secret, so the two stay on the same keypair. Set `hasPublicKey: false` when you have no local-auth path at all. See [Control Plane Connection → Local authentication](control-plane-connection.md#local-authentication-development-only).

#### Trust the Platform API certificate { #trust-the-platform-api-certificate }

The portal calls the Platform API inside the cluster at `https://api-portal-platform-api:9243` and verifies its certificate. The chart's default certificate is self-signed and issued for `platform-api.localhost`, so with `insecure: false` every login fails. Public certificate authorities (CAs) don't issue certificates for an in-cluster Service name, so issue this one from a private CA and make the portal trust that CA:

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
    oc -n <PROJECT-NAME> apply -f internal-ca.yaml
    oc -n <PROJECT-NAME> wait --for=condition=Ready certificate/internal-ca
    ```

2. Copy the CA certificate, without its private key, into a ConfigMap that the portal mounts:

    ```bash
    oc -n <PROJECT-NAME> get secret internal-ca -o jsonpath='{.data.ca\.crt}' | base64 --decode > ca.pem
    oc -n <PROJECT-NAME> create configmap internal-ca --from-file=ca.pem
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
          commonName: api-portal-platform-api
          dnsNames:
            - api-portal-platform-api
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

    `extraVolumes` and `extraVolumeMounts` are lists, and Helm replaces a list instead of merging it. If you also mount the database CA, as described in [Configure the database](#configure-the-database), put both volumes in one `extraVolumes` list and both mounts in one `extraVolumeMounts` list.

4. Apply the values with the same `helm upgrade --install` command as in [Step 6](#step-6), then restart the Platform API. It reads its certificate only at startup, so it keeps serving the previous one until it restarts:

    ```bash
    oc -n <PROJECT-NAME> rollout restart deployment/api-portal-platform-api
    ```

---

## Advanced configuration

### OpenShift security context { #section-1 }

Each component exposes its pod and container security contexts as free-form values. The chart renders them exactly as you provide them:

- `platform-api.deployment.podSecurityContext` and `platform-api.deployment.securityContext`
- `api-portal-ui.deployment.podSecurityContext` and `api-portal-ui.deployment.securityContext`

Both are empty by default. The following table describes the properties that matter on OpenShift:

| Property | Description |
|---|---|
| `runAsNonRoot` | Rejects the pod if it would run as root. |
| `runAsUser`, `fsGroup` | Set only under SCCs that don't assign them. `runAsUser` lets the kubelet verify `runAsNonRoot` for a named image user, and `fsGroup` makes the database volumes writable. |
| `seccompProfile` | Required by `restricted-v2`, `nonroot-v2`, and the `restricted` Pod Security Standard. Not allowed by `anyuid`. |
| `allowPrivilegeEscalation` | Neither component needs to escalate privileges. |
| `capabilities` | Neither component needs Linux capabilities, so all of them can be dropped. |

The values that OpenShift admits depend on the SCC that the pods run under. For the strategies that each SCC applies to these properties, see [Managing security context constraints](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/authentication_and_authorization/managing-pod-security-policies) in the OpenShift documentation.

The following samples show values for common SCCs. The default SCC for workloads, `restricted-v2`, assigns the UID, the `fsGroup`, and the seccomp profile itself. SCCs such as `anyuid` and `nonroot-v2` assign none of them, so the values must set the IDs.

=== "restricted-v2 (default)"

    Sample values for both components. Leave `runAsUser`, `runAsGroup`, and `fsGroup` unset: `restricted-v2` assigns them from the project's ranges and rejects a pod that requests other values (see [Troubleshooting](#scc-rejected)).

    ```yaml
    platform-api:
      deployment:
        podSecurityContext:
          runAsNonRoot: true
          seccompProfile:
            type: RuntimeDefault
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop: ["ALL"]
    api-portal-ui:
      deployment:
        podSecurityContext:
          runAsNonRoot: true
          seccompProfile:
            type: RuntimeDefault
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop: ["ALL"]
    ```

=== "Other SCCs (anyuid, nonroot-v2)"

    Sample values for both components, with the images' UID (`10001`) and an `fsGroup`. The Platform API image names its user (`wso2`) instead of using a number, so the kubelet can verify `runAsNonRoot` only when `runAsUser` is set. The `fsGroup` makes the database volumes writable.

    ```yaml
    platform-api:
      deployment:
        podSecurityContext:
          runAsNonRoot: true
          runAsUser: 10001
          fsGroup: 10001
          seccompProfile:          # leave out under anyuid
            type: RuntimeDefault
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop: ["ALL"]
    api-portal-ui:
      deployment:
        podSecurityContext:
          runAsNonRoot: true
          runAsUser: 10001
          fsGroup: 10001
          seccompProfile:          # leave out under anyuid
            type: RuntimeDefault
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop: ["ALL"]
    ```

    `anyuid` doesn't allow any seccomp profile, so leave out `seccompProfile` under it.

### Route configuration { #section-2 }

Each component has its own `openshift` block: `platform-api.openshift` and `api-portal-ui.openshift`. Within a block, the shared `openshift.routes.tls` settings apply by default. A route's own `tls` block overrides them key by key.

The following table lists the Route settings:

| Setting | Default | Description |
|---|---|---|
| `<component>.openshift.enabled` | `false` | Renders the component's Route. |
| `platform-api.openshift.routes.platformApi.enabled` | `true` | Creates the Platform API Route. Gateways and clients outside the cluster reach the Platform API through it. Set it to `false` to keep the Platform API internal. |
| `api-portal-ui.openshift.routes.apiPortal.enabled` | `true` | Creates the portal Route. |
| `<component>.openshift.routes.<route>.hostname` | `""` | Route host. If it's empty, OpenShift generates one. |
| `<component>.openshift.routes.<route>.annotations` and `labels` | `{}` | Extra metadata, for example router timeouts. |
| `<component>.openshift.routes.tls.termination` | `passthrough` | `passthrough` or `reencrypt`. The Routes need the components to serve HTTPS, which they do by default, so the chart rejects `edge` at install time. To serve the portal over plain HTTP instead, see [Serve the portal over plain HTTP](#plain-http). |
| `<component>.openshift.routes.tls.insecureEdgeTerminationPolicy` | `None` | `None` or `Redirect`. |
| `<component>.openshift.routes.tls.certificate`, `key`, and `caCertificate` | `""` | Certificate the router serves, for `reencrypt` only. If it's empty, the router uses its default certificate. |
| `<component>.openshift.routes.tls.destinationCACertificate` | `""` | CA that signed the component's certificate, for `reencrypt` only. |

Choose a TLS termination type:

=== "Passthrough (default)"

    The router forwards the TLS connection unchanged, and clients see the component's own certificate. That certificate must cover the Route's hostname and come from a CA that clients trust. The chart's default certificate is self-signed and covers only `localhost` names, so clients reject it or show a certificate warning. The same applies to the Platform API's Route, under `platform-api`. Also keep the Platform API's Service name, `api-portal-platform-api`, in its DNS names, because the portal calls it inside the cluster. For production, do one of the following:

    - Set an explicit hostname, and issue the certificate from a trusted CA with that hostname in its DNS names:

        ```yaml
        api-portal-ui:
          openshift:
            routes:
              apiPortal:
                hostname: portal.example.com
          tls:
            certManager:
              createIssuer: false
              issuerRef:
                name: <ISSUER_NAME>
                kind: ClusterIssuer
              dnsNames:
                - portal.example.com
        ```

    - Provide your own certificate for the hostname in a Secret, with `api-portal-ui.tls.certificateProvider: secret` and `api-portal-ui.tls.secret.name`.
    - Use re-encrypt termination, so that clients see the router's certificate instead.

=== "Re-encrypt"

    The router serves its own certificate, or the one you provide, and opens a separate TLS connection to the component. It verifies that connection against `destinationCACertificate`. Browsers then see the cluster's trusted router certificate, while the components keep their self-signed ones.

    With the default cert-manager Issuer, use the CA from the component's certificate Secret:

    ```bash
    oc get secret api-portal-api-portal-tls -n <PROJECT-NAME> \
      -o jsonpath='{.data.ca\.crt}' | base64 -d > api-portal-ca.crt
    ```

    ```yaml
    api-portal-ui:
      openshift:
        routes:
          tls:
            termination: reencrypt
            destinationCACertificate: |
              -----BEGIN CERTIFICATE-----
              ...
              -----END CERTIFICATE-----
    ```

#### Serve the portal over plain HTTP { #plain-http }

With `api-portal-ui.tls.certificateProvider: none`, the portal serves plain HTTP and the router terminates TLS. Traffic between the router and the pod isn't encrypted, so use this setup only where that's acceptable. The chart's Route needs HTTPS, so turn it off and create an edge Route yourself:

1. Turn off the portal's TLS and the chart's portal Route, and change both health probes to `scheme: HTTP`:

    ```yaml
    api-portal-ui:
      tls:
        certificateProvider: none
      openshift:
        routes:
          apiPortal:
            enabled: false
      deployment:
        livenessProbe:
          httpGet: { path: /health, port: http, scheme: HTTP }
        readinessProbe:
          httpGet: { path: /health, port: http, scheme: HTTP }
    ```

    With `scheme: HTTPS`, every probe fails and the pod never becomes ready. For the other probe settings, see [Configure health probes](#health-checks).

2. Apply the values, as described in [Upgrade](#upgrade).

3. Create an edge Route to the portal's `http` port:

    ```bash
    oc create route edge api-portal-api-portal \
      --service=api-portal-api-portal \
      --port=http \
      --insecure-policy=Redirect \
      -n <PROJECT-NAME>
    ```

    The Route keeps the name of the chart's Route, so OpenShift generates the same host, `api-portal-api-portal-<PROJECT-NAME>.<APPS_DOMAIN>`, which `api-portal-ui.config.server.baseUrl` already uses (see [Step 6](#step-6)). To use your own host instead, pass `--hostname` and set `baseUrl` to match. For a host outside the cluster's apps domain, also pass `--cert`, `--key`, and `--ca-cert`.

### Storage { #section-3 }

Both components store SQLite databases in PVCs. Helm keeps the PVCs after `helm uninstall` (`helm.sh/resource-policy: keep`). The volumes are writable through the pod's `fsGroup`, which `restricted-v2` assigns and which you set under other SCCs (see [OpenShift security context](#section-1)).

- To choose a StorageClass, set `<component>.persistence.storageClass`.
- For multiple replicas, use external databases. See [Database configuration](database-configuration.md) and the [API Portal chart README](https://github.com/wso2/api-platform/blob/main/kubernetes/helm/api-portal-helm-chart/README.md).

### Custom images { #section-4 }

The released API Portal image runs on OpenShift without changes, so you don't need to build one.

!!! note "Building your own portal image"
    If you build your own image, for example from a different base image, make every directory that the portal writes to inside the image writable by the root group. With file logging on (`api-portal-ui.config.logging.consoleOnly: false`), that includes `/app/logs`. Otherwise, the portal exits with `EACCES: permission denied` (see [Troubleshooting](#log-permission-denied)). Add these lines to the `Dockerfile` after the step that creates the directories:

    ```dockerfile
    USER root
    RUN chgrp -R 0 /app/logs && chmod -R g=u /app/logs
    USER 10001
    ```

    If you can't change the image, mount a writable `emptyDir` volume over the directory instead. The log files are lost when the pod restarts, so ship them with a log collector:

    ```yaml
    api-portal-ui:
      deployment:
        extraVolumes:
          - name: logs
            emptyDir: {}
        extraVolumeMounts:
          - name: logs
            mountPath: /app/logs
    ```

### Read-only root filesystem { #read-only-root-filesystem }

If you set `readOnlyRootFilesystem: true` in `api-portal-ui.deployment.securityContext`, the image's directories are read-only regardless of their permissions. Mount writable `emptyDir` volumes over the directories the portal writes to:

- `/tmp`, where the portal unpacks the content packages that you upload for APIs. Without it, uploads fail with `Invalid zip file: ENOENT … mkdir '/tmp/api-content-upload'`.
- `/app/logs`, when file logging is on.

```yaml
api-portal-ui:
  deployment:
    extraVolumes:
      - name: tmp
        emptyDir: {}
      - name: logs
        emptyDir: {}
    extraVolumeMounts:
      - name: tmp
        mountPath: /tmp
      - name: logs
        mountPath: /app/logs
```

---

## Troubleshooting

### Uploading API content fails with "Invalid zip file: ENOENT" { #content-upload-tmp }

**Symptom:** Uploading an API's content package returns `400 Bad Request` with `Invalid zip file: ENOENT: no such file or directory, mkdir '/tmp/api-content-upload'`, although the ZIP file is valid.

**Cause:** The root filesystem is read-only (`readOnlyRootFilesystem: true`), and no writable volume is mounted at `/tmp`, where the portal unpacks uploads.

**Fix:** Mount a writable `emptyDir` volume at `/tmp`, as shown in [Read-only root filesystem](#read-only-root-filesystem), or turn off the read-only root filesystem.

### API Portal fails with "EACCES: permission denied" on its log file { #log-permission-denied }

**Symptom:** The `api-portal-api-portal` pod is in `CrashLoopBackOff`, and its logs contain `EACCES: permission denied, open '/app/logs/application-<DATE>.log'`.

**Cause:** File logging is on (`config.logging.consoleOnly: false`), and the portal can't write to `/app/logs`. The image makes this directory writable, so this happens when the root filesystem is read-only (`readOnlyRootFilesystem: true`) and no writable volume is mounted at that path.

**Fix:** Do one of the following:

- Mount a writable `emptyDir` volume at `/app/logs` through `api-portal-ui.deployment.extraVolumes` and `extraVolumeMounts`, as shown in [Custom images](#section-4).
- Turn off the read-only root filesystem.
- Set `api-portal-ui.config.logging.consoleOnly: true` to log to the console only.

!!! note
    The API Portal chart doesn't restart the pod when only its configuration changes. After you change `api-portal-ui.config.*` with `helm upgrade`, restart the pod with `oc rollout restart deployment/api-portal-api-portal -n <PROJECT-NAME>`.

### Pods aren't created: "unable to validate against any security context constraint" { #scc-rejected }

**Symptom:** A Deployment shows `0/1` ready, and no pod exists. The ReplicaSet events contain an error such as one of the following:

```
[... provider restricted-v2: .containers[0].runAsUser: Invalid value: 10001: must be in the ranges: [1000650000, 1000659999] ...]
[... provider anyuid: .spec.securityContext.seccompProfile.type: Forbidden: seccomp may not be set ...]
```

**Cause:** A security context requests something that the SCC doesn't allow: a fixed UID or GID outside the project's range under `restricted-v2`, or a seccomp profile under `anyuid`.

**Fix:** Use the values for your SCC from [OpenShift security context](#section-1).

### Pods fail with "image has non-numeric user" or "unable to open database file" { #scc-ids }

**Symptom:** Under an SCC other than `restricted-v2`, the Platform API pod stays in `CreateContainerConfigError` with `container has runAsNonRoot and image has non-numeric user (wso2), cannot verify user is non-root`, or a component restarts with `unable to open database file`.

**Cause:** The SCC doesn't assign a UID or an `fsGroup`, and the values don't set them.

**Fix:** Set `runAsUser: 10001` and `fsGroup: 10001` for each component, as shown in [OpenShift security context](#section-1).

### Pods stay in ContainerCreating with a missing TLS Secret

**Symptom:** The `api-portal-api-portal` or `api-portal-platform-api` pod stays in `ContainerCreating`, and its events contain `MountVolume.SetUp failed ... secret "api-portal-api-portal-tls" not found` or `secret "api-portal-platform-api-tls" not found`.

**Cause:** cert-manager hasn't issued the component's certificate. It isn't installed, or the Certificate is failing.

**Fix:**

1. Check the Certificates and their events:

    ```bash
    oc get certificate -n <PROJECT-NAME>
    oc describe certificate -n <PROJECT-NAME>
    ```

2. Make sure that cert-manager is installed and running, as described in [Step 3](#step-3). To use your own certificate instead, set `<component>.tls.certificateProvider=secret` and `<component>.tls.secret.name=<SECRET_NAME>`.

### Login fails with a certificate error

**Symptom:** Login returns to the login page with "Login failed, please try again". The portal logs contain `Platform API login request failed`, with `self-signed certificate` or `unable to verify the first certificate`.

**Cause:** The portal can't verify the Platform API's certificate.

**Fix:** Issue the Platform API's certificate for the Service name `api-portal-platform-api` from a private CA, and make the portal trust that CA, as described in [Trust the Platform API certificate](#trust-the-platform-api-certificate). If you just changed the certificate, restart the Platform API, which reads it only at startup. For evaluation only, set `api-portal-ui.config.platformApi.insecure: true` (see [Step 6](#step-6)).

### The Service stays pending with no external IP

**Symptom:** `oc get svc -n <PROJECT-NAME>` shows the portal Service as `LoadBalancer`, with `EXTERNAL-IP` set to `<pending>`.

**Fix:** Set `api-portal-ui.service.type: ClusterIP`. The Route doesn't need a `LoadBalancer` Service.

## Related

- [Security hardening](security-hardening.md)
- [Database configuration](database-configuration.md)
- [Deploy the AI Workspace on OpenShift](../../../ai-workspace/next/production/openshift.md)
- [Deploy the gateway with the Gateway Operator on OpenShift](../../../api-gateway/next/deployment/deployment-modes/openshift/gateway-operator.md)