---
title: "Deploy AI Workspace on OpenShift"
description: "Deploy AI Workspace and the Platform API on Red Hat OpenShift with the ai-workspace Helm chart, exposed through OpenShift Routes."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/openshift/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/openshift.md
tags:
  - ai-workspace
  - openshift
  - deployment
  - kubernetes
  - helm
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-24
content_type: "how-to"
---

# Deploy AI Workspace on OpenShift

This guide is for cluster operators who deploy AI Workspace on Red Hat OpenShift. You install it with the `ai-workspace` Helm chart, which deploys two components:

- The Platform API, the shared control plane.
- The AI Workspace UI, a web app served by a backend for frontend (BFF).

The charts are the same ones you use on standard Kubernetes, and the configuration model is identical. On OpenShift, Security Context Constraints (SCCs) decide which user ID (UID) and group IDs a pod runs with. Depending on the SCC, OpenShift assigns a random UID from the project's range or runs the UID that the pod requests. Both components write only to mounted volumes, so the released images run under either model without changes. The charts expose the security contexts as values, so you can match them to the SCC that your cluster applies, as described in [OpenShift security context](#security-context).

Each component creates an OpenShift **Route** for external access, so you don't need an Ingress controller.

!!! warning "Before you deploy"
    An OpenShift deployment needs the following:

    1. **The Secrets that `generate-secrets.sh` creates**: the chart refuses to install without them.
    2. **cert-manager or your own TLS Secrets**: they provide the HTTPS certificates of both components.
    3. **A StorageClass**: the Platform API stores its SQLite database in a PersistentVolumeClaim (PVC). The cluster needs a default StorageClass, or you set one explicitly.
    4. **Chart 1.0.1 or later**: earlier charts have no OpenShift values, so they create no Routes and report no error.
    5. **Images at update level 0.16.0.4 (Platform API) and 1.0.0.6 (AI Workspace) or later**: you set them in [Step 6](#step-6). Update levels are available with a WSO2 subscription.

## Step 1: Install the required tools { #step-1 }

You need the following tools on your machine:

| Tool | Purpose | Install guide |
| ---- | ------- | ------------- |
| `oc` and `kubectl` | OpenShift CLI for managing cluster resources. The OpenShift CLI download includes both. | [Install the OpenShift CLI](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html) |
| `helm` (v3) | Package manager for deploying the Helm chart | [Install Helm](https://helm.sh/docs/intro/install/) |
| `openssl` | Generates keys for `generate-secrets.sh` | Pre-installed on most systems |
| `htpasswd` | Hashes the admin password for `generate-secrets.sh` | Pre-installed on macOS. On Linux, install `httpd-tools` (RHEL, Fedora) or `apache2-utils` (Debian, Ubuntu). |

Verify that the tools are installed:

```bash
oc version
kubectl version --client
helm version
openssl version
```

## Step 2: Log in to OpenShift { #step-2 }

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

3. Create a dedicated project for the deployment:

    ```bash
    oc new-project <PROJECT-NAME>
    ```

    OpenShift creates the matching Kubernetes namespace and switches the context to it. The rest of this guide uses `<PROJECT-NAME>` for that namespace.

!!! warning
    Don't deploy into the `default` project. A dedicated project isolates the resources and applies the project's security policies.

## Step 3: Install cert-manager { #step-3 }

Both components use cert-manager to issue their HTTPS certificates. If cert-manager is already installed on the cluster, skip this step.

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

## Step 4: Download the chart { #step-4 }

Download and extract the chart. It contains the `generate-secrets.sh` script that the next step uses:

```bash
helm pull oci://ghcr.io/wso2/api-platform/helm-charts/ai-workspace \
  --version 1.0.1 --untar
```

## Step 5: Generate the secrets { #step-5 }

Run the script with `bash`, passing the project name and the release name you install with. The downloaded chart doesn't keep the script's executable permission, so running it directly fails with `Permission denied`. This guide uses `ai-workspace`:

```bash
bash ./ai-workspace/generate-secrets.sh <PROJECT-NAME> ai-workspace
```

The script does the following:

- Creates `ai-workspace-platform-api-secrets`, which holds the Platform API's encryption key, RS256 JWT key pair, and file-mode admin credential.
- Prints the **generated admin password once**. Store it right away. There's no `admin/admin` default.
- Writes `values-secrets.yaml`, which holds only the Secret names and is safe to commit.

The AI Workspace UI needs its own Secret only for OpenID Connect (OIDC) login. For that and the other optional inputs, see the [AI Workspace chart README](https://github.com/wso2/api-platform/blob/main/kubernetes/helm/ai-workspace-helm-chart/README.md#step-1-generate-the-secrets). For what each secret protects, see [Provision secrets and keys](secrets-and-keys.md).

## Step 6: Deploy AI Workspace { #step-6 }

1. Get your cluster's apps domain. OpenShift uses it to generate Route hosts:

    ```bash
    oc get ingresses.config.openshift.io cluster -o jsonpath='{.spec.domain}'
    ```

2. Add the following settings to your `my_values.yaml` file. Replace `<APPS_DOMAIN>` with the domain from the previous step:

    ```yaml
    platform-api:
      openshift:
        enabled: true

    ai-workspace-ui:
      # The Route sends traffic to the Service inside the cluster, so a LoadBalancer
      # Service (the chart default) isn't needed.
      service:
        type: ClusterIP
      config:
        server:
          # Shown in the startup log as the address to open.
          domain: ai-workspace-ai-workspace-<PROJECT-NAME>.<APPS_DOMAIN>
        gateway:
          # Shown in the UI's "add a gateway" instructions: the address gateways
          # use to reach the Platform API through its Route.
          controlplaneHost: ai-workspace-platform-api-<PROJECT-NAME>.<APPS_DOMAIN>:443
      openshift:
        enabled: true
    ```

    To use your own hostnames, set `ai-workspace-ui.openshift.routes.aiWorkspace.hostname` and `platform-api.openshift.routes.platformApi.hostname`. Use the AI Workspace hostname in `domain`, and the Platform API hostname with port `443` in `controlplaneHost`.

    **Platform API certificate**: the BFF calls the Platform API in the cluster at `https://ai-workspace-platform-api:9243` and verifies its certificate. The chart's default certificate is self-signed and issued for `platform-api.localhost`, so verification fails. Choose one of the following:

    - **Production**: issue the Platform API's certificate for the Service name from a CA that the BFF trusts. Add `ai-workspace-platform-api` to `platform-api.tls.certManager.dnsNames`. If the CA isn't publicly trusted, set `ai-workspace-ui.config.controlPlane.caFile` to it. See [Make the BFF verify the Platform API](tls.md#step-3-make-the-bff-verify-the-platform-api).
    - **Evaluation only**: skip the verification:

        ```yaml
        ai-workspace-ui:
          config:
            controlPlane:
              tlsSkipVerify: true
        ```

    **OIDC login**: if you set `ai-workspace-ui.config.auth.mode: oidc`, register the following URLs with your identity provider. Set the same values in `ai-workspace-ui.config.auth.oidc`.

    - Redirect URL: `https://<ROUTE_HOST>/ai-workspace/api/auth/callback`
    - Post-logout redirect URL: `https://<ROUTE_HOST>/ai-workspace/login`

    **Images**: use the update-level images.

    !!! note "Use Platform API 0.16.0.4 and AI Workspace 1.0.0.6 or later"
        These update levels are verified on OpenShift. With a WSO2 subscription, create the registry pull Secret in the project, as described in [WSO2 Subscription Users](../../../api-gateway/1.2.0/deployment/high-availability-production-deployment.md#wso2-subscription-users), and set it in `global.wso2.subscription.imagePullSecret`. The chart then pulls from `registry.wso2.com/wso2-api-platform/`, but it keeps the default tags, so set the update-level tags too:

        ```yaml
        global:
          wso2:
            subscription:
              imagePullSecret: wso2-subscription-creds
        platform-api:
          image:
            tag: "0.16.0.4"
        ai-workspace-ui:
          image:
            tag: "1.0.0.6"
        ```

        Use the latest update levels available to you.

    **Storage class**: if your cluster has no default StorageClass, set one. Check with `oc get storageclass`:

    ```yaml
    platform-api:
      persistence:
        storageClass: "<STORAGE_CLASS>"
    ```

    **Security context** (recommended): see [OpenShift security context](#security-context).

3. Deploy the chart:

    ```bash
    helm upgrade --install ai-workspace ./ai-workspace \
      --namespace <PROJECT-NAME> \
      -f values-secrets.yaml \
      -f my_values.yaml
    ```

4. Wait for the pods to be ready:

    ```bash
    oc get pods -n <PROJECT-NAME> -w
    ```

    Continue when the `ai-workspace-platform-api` and `ai-workspace-ai-workspace` pods both show `1/1 Running`.

## Step 7: Verify the Routes { #step-7 }

The charts create OpenShift `Route` objects. List them:

```bash
oc get route -n <PROJECT-NAME>
```

The output lists one Route for each component:

```
NAME                        HOST/PORT                                                SERVICES                    PORT   TERMINATION
ai-workspace-ai-workspace   ai-workspace-ai-workspace-<PROJECT-NAME>.<APPS_DOMAIN>   ai-workspace-ai-workspace   http   passthrough/None
ai-workspace-platform-api   ai-workspace-platform-api-<PROJECT-NAME>.<APPS_DOMAIN>   ai-workspace-platform-api   http   passthrough/None
```

The Service ports are named `http`, but they serve HTTPS. The Routes pass the TLS connections through to the components. To change the hostnames or the TLS termination, see [Route configuration](#routes).

## Step 8: Sign in to AI Workspace { #step-8 }

1. Get the AI Workspace URL and open it in a browser:

    ```bash
    echo "https://$(oc get route ai-workspace-ai-workspace -n <PROJECT-NAME> -o jsonpath='{.spec.host}')/ai-workspace/"
    ```

2. Sign in as `admin` with the password that `generate-secrets.sh` printed.

To connect AI gateways to the Platform API Route, see [Connect AI gateways](connect-gateways.md). To deploy a gateway on the same cluster, see [Deploy the gateway on OpenShift](../../../api-gateway/1.2.0/deployment/deployment-modes/openshift/openshift-standalone.md).

## Production configuration { #production-configuration }

Steps 1 to 8 install AI Workspace with the chart's defaults, which suit an evaluation. This section takes it to production on OpenShift. OpenShift uses the same charts and values as the [Kubernetes deployment guide](deploy-on-kubernetes.md), with `oc` in place of `kubectl`. Apply each values change with the same `helm upgrade --install` command as in [Step 6](#step-6).

!!! note "On OpenShift"
    Keep the `openshift` blocks from [Step 6](#step-6), which create the Routes, and add the security context values for your SCC from [OpenShift security context](#security-context).

### Step 1: Collect the values you'll need

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

### Step 2: Prepare the database

The Platform API defaults to a SQLite file, which caps it at one instance and puts your control plane's data on one disk. Move to a database server before you deploy anything, not after.

The examples on this page use PostgreSQL. Microsoft SQL Server is equally supported. Set its driver value and connection settings, and everything downstream is the same. Create the database and a login role for it, then provision the schema. The full procedure for either, including the connection pool settings, is in [Connect a database to the Platform API](../setting-up/database.md).

Run the database itself in high availability. A single database server leaves the entire control plane dependent on one machine, regardless of how many Platform API replicas you run.

You point the Platform API at the database in the values file in [Step 6](#production-step-6).

### Step 3: Register AI Workspace with your identity provider

File-based authentication is for the quickstart. Production delegates login to your provider.

Register AI Workspace as a **confidential** web application, not a single-page application. The BFF exchanges the authorization code on the back channel using a client secret, and a public-client registration is refused at the token endpoint.

On the application, configure:

- **Redirect URL:** `https://<workspace-hostname>/ai-workspace/api/auth/callback`. This is a BFF route, not a page in the interface.
- **Post-logout redirect URL:** `https://<workspace-hostname>/ai-workspace/login`
- **Grant types:** authorization code and refresh token, with Proof Key for Code Exchange (PKCE) enabled. Keep `offline_access` in the requested scopes and allow it for the application. Without it the provider returns no refresh token, and users are signed out the moment their access token expires.
- **Access token type:** JSON Web Token (JWT). The Platform API validates the token through your provider's JSON Web Key Set (JWKS) endpoint, which it can't do with an opaque token. A provider left on opaque tokens shows up after login, as proxied calls failing with an invalid token segment count in the Platform API log.
- **Claims:** the username, email, and organization claims, plus whichever claim carries privileges.

Then decide how privileges reach the token. If your provider can register the platform's `ap:*` scopes, use scope-based authorization. If it can't, use role-based authorization and a shared role-to-scope mapping file, as shown in [Step 8](#openshift-harden-step-2-keep-authorization-enforced-and-matched).

For the full walkthrough, including claim mappings and the scope registration script, see [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md).

**Before you continue:** copy the client ID and client secret into your secret manager.

### Step 4: Provision secrets and keys { #openshift-secrets }

Neither service generates key material at runtime. Provision it now, or startup stops with a message naming what's missing. The chart never creates or embeds a secret value. It reads a Secret you created and referenced by name.

#### Generate the values { #openshift-secrets-step-1-generate-the-values }

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

Create the two Secrets, using the key names the chart expects. The database password has to match your PostgreSQL instance, and the client secret comes from your identity provider.

If you installed the evaluation release in [Step 6](#step-6), `generate-secrets.sh` already created `<release-name>-platform-api-secrets` with an encryption key that you don't hold. Delete the evaluation Secrets first. Data that the evaluation release encrypted with the old key can't be read afterwards:

```bash
oc -n <PROJECT-NAME> delete secret <release-name>-platform-api-secrets \
  <release-name>-ai-workspace-ui-secrets --ignore-not-found
```

Then create the Secrets:

```bash
oc -n <PROJECT-NAME> create secret generic <release-name>-platform-api-secrets \
  --from-file=APIP_CP_ENCRYPTION_KEY=./encryption.key \
  --from-file=APIP_CP_DATABASE_PASSWORD=./db_password

oc -n <PROJECT-NAME> create secret generic <release-name>-ai-workspace-ui-secrets \
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

#### Reference the secrets from configuration { #openshift-secrets-step-2-reference-the-secrets-from-configuration }

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

#### Verify the secrets { #openshift-secrets-verify }

```bash
oc -n <PROJECT-NAME> get pods
oc -n <PROJECT-NAME> logs deploy/<release-name>-platform-api | grep -i -E 'error|fail'
```

A pod in `CreateContainerConfigError` means the referenced Secret or one of its keys is missing. Confirm the key names:

```bash
oc -n <PROJECT-NAME> get secret <release-name>-platform-api-secrets \
  -o json | jq -r '.data | keys[]'
```

This prints the key names only. Don't print `.data` itself: the values are base64-encoded, not encrypted, and they land in your terminal scrollback.

For rotation and external secret managers, see [Provision secrets and keys](secrets-and-keys.md).

### Step 5: Secure traffic with TLS { #openshift-tls }

Neither service has a self-signed fallback, so a missing certificate stops an HTTPS listener at startup. On OpenShift, the chart's Routes pass TLS through to the services or re-encrypt it, so both services keep their own HTTPS listeners and need a certificate each.

#### Supply the certificates { #openshift-tls-step-2-supply-the-certificate-for-the-workspace-listener }

Each component chart takes its certificate from one of two providers, and both are valid in production. Pick one and set `certificateProvider` per component:

- **cert-manager** issues and renews the certificate for you, which removes expiry as a failure mode. It needs cert-manager, installed as in [Step 3](#step-3), and an issuer in the cluster.
- **A Secret you manage** keeps issuance wherever it already happens, such as an external CA or a secret manager that syncs into the cluster. You handle renewal.

**With cert-manager and your own issuer.** The values file in [Step 6](#production-step-6) points both charts at a `ClusterIssuer` you already run, such as an ACME or private-CA issuer, with `createIssuer: false`. Leaving `createIssuer: true` makes the chart create a self-signed issuer. That's fine for a test cluster and wrong for production, because nothing outside the cluster trusts the result.

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

**Before you continue:** confirm each certificate's subject alternative name covers the hostname users type, which is also the Route's hostname.

#### Make the BFF verify the Platform API { #openshift-tls-step-3-make-the-bff-verify-the-platform-api }

The BFF calls the Platform API inside the cluster, at `https://ai-workspace-platform-api:9243`, and verifies its certificate, so that certificate must cover the Service name. Public CAs don't issue certificates for in-cluster names, so issue it from a private CA, as the values in Step 6 do. Put that CA's certificate in a ConfigMap:

```bash
oc -n <PROJECT-NAME> create configmap internal-ca --from-file=ca.pem=<path-to-private-ca.pem>
```

Then mount the ConfigMap and name the CA in the component config:

```yaml
ai-workspace-ui:
  config:
    controlPlane:
      tlsSkipVerify: false
      caFile: /etc/ai-workspace/ca/ca.pem
  deployment:
    extraVolumes:
      - name: control-plane-ca
        configMap:
          name: internal-ca
    extraVolumeMounts:
      - name: control-plane-ca
        mountPath: /etc/ai-workspace/ca
        readOnly: true
```

Mount the CA in its own directory. `/etc/ai-workspace/tls` already holds the workspace's own certificate, mounted read-only.

Leave `config.controlPlane.url` empty to derive the in-cluster Service URL from `global.platformApi`. Set it only when the Platform API runs outside this release.

For the certificate on every hop, see [Secure traffic with TLS](tls.md).

### Step 6: Write the configuration { #production-step-6 }

This is the step everything so far feeds into. Start from the shipped file, change what production needs, and keep secrets as references rather than values.

Three values in this step are worth getting right the first time, because each fails at a different moment:

- **`platform-api.config.auth.mode`** accepts `internal_token`, `file`, or `idp`. Unset or misspelled, the Platform API stops at startup and names the invalid mode. Production uses `idp`.
- **The Platform API's validator has to match the tokens it receives.** In `idp` mode, set the JWKS URL and issuer to your provider's. Left on another mode, login works and every proxied call fails with an authentication error, because the workspace and the control plane disagree about who validates the token.
- **`ai-workspace-ui.config.controlPlane.caFile`** has to cover the issuer of the Platform API's certificate, as in [Step 5](#openshift-tls-step-3-make-the-bff-verify-the-platform-api). When it doesn't, the workspace returns `502` and mentions certificate verification. Point it at the correct CA bundle. Setting `tlsSkipVerify` instead removes the check that makes the hop trustworthy.

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
  openshift:
    enabled: true
    routes:
      platformApi:
        hostname: platform-api.example.com
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
        name: <ISSUER_NAME>         # a CA that the BFF and your gateways trust
        kind: ClusterIssuer
      commonName: platform-api.example.com
      dnsNames:
        - platform-api.example.com
        - ai-workspace-platform-api
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
  openshift:
    enabled: true
    routes:
      aiWorkspace:
        hostname: workspace.example.com
  config:
    server:
      domain: workspace.example.com
    logging:
      level: info
      format: json
      browserDebug: false
    controlPlane:
      tlsSkipVerify: false
      caFile: /etc/ai-workspace/ca/ca.pem   # the private CA from Step 5
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
    type: ClusterIP         # the Route is the entry point
  deployment:
    # Mounts the private CA that caFile names, see Step 5
    extraVolumes:
      - name: control-plane-ca
        configMap:
          name: internal-ca
    extraVolumeMounts:
      - name: control-plane-ca
        mountPath: /etc/ai-workspace/ca
        readOnly: true
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

- The Routes publish AI Workspace and the Platform API on the hostnames you set, so you don't need an Ingress. Use the AI Workspace hostname in `domain` and the redirect URLs, and the Platform API hostname in `controlplaneHost`, and create DNS records that point them at the cluster's router.
- The Platform API's Route passes TLS through, so one certificate serves both the BFF, which calls the Service name `ai-workspace-platform-api`, and the gateways, which call `platform-api.example.com`. The values list both names. A public CA can't issue for the Service name, so use a CA that the BFF and your gateways both trust, as in [Step 5](#openshift-tls-step-3-make-the-bff-verify-the-platform-api). To give gateways a publicly trusted certificate instead, switch the Platform API's Route to `reencrypt`, as described in [Route configuration](#routes).
- The connection keys sit under `config.database.postgres` whatever driver you set, so use that same block for SQL Server.
- `sslRootCert` names the CA that signed your database server's certificate, not the CA of the Platform API's own certificate. The chart doesn't mount that file, so `platform-api.deployment` mounts it from a ConfigMap. Create the ConfigMap before you install:

    ```bash
    oc -n <PROJECT-NAME> create configmap postgres-ca --from-file=ca.pem=<path-to-database-ca.pem>
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

#### Apply the configuration { #production-apply }

Preview what will change, then apply it:

```bash
helm template ai-workspace ./ai-workspace -n <PROJECT-NAME> \
  -f values-secrets.yaml -f my_values.yaml > /tmp/preview.yaml

helm upgrade --install ai-workspace ./ai-workspace -n <PROJECT-NAME> \
  -f values-secrets.yaml -f my_values.yaml \
  --wait --timeout 10m
```

**Before you continue:** both services must be running and healthy. They fail closed, so a startup message naming a config key or a file path tells you exactly which value didn't resolve. For a file path, confirm three things: the file is mounted at that path, the path sits inside an allowed source directory, and the service account can read it.

```bash
oc -n <PROJECT-NAME> get pods
oc -n <PROJECT-NAME> logs deploy/ai-workspace-platform-api | grep -i -E 'error|fail'
```

#### Sign in { #production-sign-in }

Open `https://workspace.example.com/ai-workspace`, the AI Workspace Route's host, and sign in through your identity provider. This is the first end-to-end test, and it exercises the certificate, the Route, the identity provider registration, and the BFF's connection to the Platform API at once.

Then confirm authorization works, not just authentication. Sign in as a user with a read-only role and check that management actions are unavailable. Login succeeding while every action returns `403` means the token carries no `ap:*` privileges, or the two services disagree on the authorization mode.

**Before you continue:** one administrator and one read-only user can both sign in, and each sees what their role allows.

### Step 7: Run in high availability { #openshift-ha }

A single instance of each service serves users, but it makes every restart an outage. Add redundancy now that the deployment is verified.

Raise both services to at least two instances. The workspace keeps sessions in memory, so each signed-in user must keep reaching the same replica. Two settings keep sessions and token renewal working across replicas: session affinity on the workspace Route, and non-rotating refresh tokens for this client in your identity provider, or a reuse grace window.

#### Add replicas { #openshift-ha-step-3-add-replicas }

Raise the replica counts:

```yaml
platform-api:
  deployment:
    replicaCount: 2      # requires a database server, not sqlite3

ai-workspace-ui:
  deployment:
    replicaCount: 2      # requires session affinity on the Route
```

The chart's horizontal pod autoscaler (HPA) needs a database server. It refuses to render for `sqlite3`, which can't be shared, and renders for `postgres`, `sqlserver`, and the `postgresql` and `pgx` aliases.

Keep each user on the pod that holds their session. The default `passthrough` Route can't set a cookie, because the router never sees the HTTP traffic, so balance the Route by client address:

```yaml
ai-workspace-ui:
  openshift:
    routes:
      aiWorkspace:
        annotations:
          haproxy.router.openshift.io/balance: source
```

With a `reencrypt` Route, the router keeps users on the same pod with a session cookie by default.

#### Autoscale on demand { #openshift-ha-step-4-autoscale-on-demand }

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

#### Survive a node failure { #openshift-ha-step-5-survive-a-node-or-host-failure }

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
oc -n <PROJECT-NAME> get pods --show-labels
```

#### Tune the health probes { #openshift-ha-step-6-tune-the-health-probes }

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

#### Verify high availability { #openshift-ha-verify }

```bash
oc -n <PROJECT-NAME> get pods -o wide
oc -n <PROJECT-NAME> get hpa
oc -n <PROJECT-NAME> get pdb
```

Sign in, then delete a workspace pod other than the one serving you. Your session should survive, and the replacement pod should reach `Ready`.

For the reasoning behind each setting, see [Run in high availability](high-availability.md).

### Step 8: Harden the deployment { #openshift-harden }

Your deployment serves users, so the remaining work is narrowing what it exposes. Each item stands on its own, and you can apply them in whatever order suits your change process.

#### Remove the file-mode admin credential { #openshift-harden-step-1-delegate-login-to-an-identity-provider }

The values file in [Step 6](#production-step-6) switches login to your identity provider and sets `audience`, so a token minted for another application is rejected. In `idp` mode the chart renders no file-mode section, so the admin credential in the Secret goes unread. Remove `APIP_CP_ADMIN_USERNAME` and `APIP_CP_ADMIN_PASSWORD_HASH` from the Secret once the switch is confirmed.

#### Keep authorization enforced and matched { #openshift-harden-step-2-keep-authorization-enforced-and-matched }

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

#### Bound what a client can consume { #openshift-harden-step-3-bound-what-a-client-can-consume }

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

#### Restrict the container { #openshift-harden-step-4-restrict-the-container }

On OpenShift, the SCC assigns the user ID, so don't pin `runAsUser` or `fsGroup`: `restricted-v2` rejects a fixed UID outside the project's range. Use the values from [OpenShift security context](#security-context), which run the containers without root, drop every capability, and turn off privilege escalation.

Test `readOnlyRootFilesystem` on the Platform API in a staging project before you enable it there. That service writes under its data volume, and a read-only root filesystem needs every writable path to be a mounted volume.

Turn off service account token automounting where nothing calls the Kubernetes API:

```yaml
global:
  serviceAccount:
    automountServiceAccountToken: false
```

#### Restrict what each service can reach { #openshift-harden-step-5-restrict-what-each-service-can-reach }

Apply a NetworkPolicy so only the workspace pods and your gateway sources reach the Platform API:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: platform-api-ingress
  namespace: <PROJECT-NAME>
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
        # Gateways that arrive through the Platform API Route. This selects
        # the namespace of the OpenShift router.
        - namespaceSelector:
            matchLabels:
              policy-group.network.openshift.io/ingress: ""
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

For how network policies work on OpenShift, including the `policy-group.network.openshift.io/ingress` label that selects the router's namespace, see [Network policy](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/network_security/network-policy) in the OpenShift 4.20 documentation.

Confirm the pod labels in your release before you apply it, because a NetworkPolicy that selects nothing silently allows everything:

```bash
oc -n <PROJECT-NAME> get pods --show-labels
```

#### Reduce what you run { #openshift-harden-step-6-reduce-what-you-run }

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

#### Verify the hardening { #openshift-harden-verify }

```bash
oc -n <PROJECT-NAME> get pods -o custom-columns='POD:.metadata.name,SCC:.metadata.annotations.openshift\.io/scc,UID:.spec.containers[0].securityContext.runAsUser'
oc -n <PROJECT-NAME> get networkpolicy
```

Each pod should show the SCC you planned for, such as `restricted-v2`, and a UID from the project's range. Then sign in as a user with a read-only role and confirm the management actions are unavailable.

For the reasoning behind each setting, see [Harden the deployment](harden.md).

### Step 9: Connect AI gateways { #openshift-gateways }

The control plane is ready for a data plane. Create a gateway in AI Workspace under **AI Gateways**, copy its registration token, and install the gateway runtime against the control plane address you collected in Step 1 of [Production configuration](#production-configuration). The workspace shows that address to gateways from `ai-workspace-ui.config.gateway.controlplaneHost`, which the values file in [Step 6](#production-step-6) sets to the Platform API Route's hostname on port `443`.

The registration token is the gateway token the commands below ask for. Paste it at the `Registration token:` prompt, which keeps it in the `GW_TOKEN` shell variable only until it's written to a file.

#### Install the gateway runtime { #openshift-gateways-step-3-install-the-gateway-runtime }

Create the at-rest encryption key Secret first. At-rest encryption is mandatory, nothing is generated for you, and the chart doesn't render without the key:

```bash
umask 077
openssl rand 32 > default-aesgcm256-v1.bin
oc -n <gateway-namespace> create secret generic gateway-encryption-keys \
  --from-file=default-aesgcm256-v1.bin=default-aesgcm256-v1.bin && \
  shred -u default-aesgcm256-v1.bin   # remove the plaintext key only after the Secret is created
```

Put the registration token in its own Secret. Read it into a protected file rather than passing it with `--set` or `--from-literal`. Either of those records the token in your shell history and in the host's process list:

```bash
umask 077
read -rsp "Registration token: " GW_TOKEN && echo
printf '%s' "$GW_TOKEN" > registration_token
unset GW_TOKEN

oc -n <gateway-namespace> create secret generic gateway-registration-token \
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

Use the chart version matching the gateway version the **Get Started** section offers. On OpenShift, use gateway chart 1.2.4 or later with gateway images at update level 1.2.0.19 or later. For the gateway's own security context and Routes on OpenShift, see [Deploy the gateway on OpenShift](../../../api-gateway/1.2.0/deployment/deployment-modes/openshift/openshift-standalone.md).

The gateway's status moves from **Not Active** to **Active** once it connects.

#### Turn on registration checks { #openshift-gateways-step-5-turn-on-registration-checks }

```yaml
platform-api:
  config:
    gateway:
      enableVersionVerification: true
      enableFunctionalityTypeVerification: true
```

For the reasoning behind each setting, see [Connect AI gateways in production](connect-gateways.md).

### Step 10: Operate the deployment { #openshift-operate }

The deployment runs, and the team that keeps it running needs the same confidence you have. Confirm each of the following before you hand it over:

- **Logs reach your aggregator** from both services. The values file in [Step 6](#production-step-6) sets JSON logs, which most aggregators parse. Choose `text` instead if yours needs it, and set it consistently across the two.
- **Alerts cover** health endpoints, restart loops, database errors, certificate expiry, and a gateway going inactive.
- **Database backups run on a schedule**, and a restore into a non-production environment has been tested end to end.
- **Your secret manager holds the encryption key**, stored separately from the database backup. A backup and the key it needs in one place fail together.

#### WebSocket metrics { #openshift-operate-websocket-metrics }

```yaml
platform-api:
  config:
    server:
      websocket:
        metricsLogEnabled: true
        metricsLogInterval: 10
```

#### Back up what you can't regenerate { #openshift-operate-step-3-back-up-what-you-cant-regenerate }

Back up the database with your standard tooling. Back up the Secrets separately, into your secret manager rather than into a cluster snapshot.

The Platform API's persistent volume claim carries a `helm.sh/resource-policy: keep` annotation, so it survives `helm uninstall` and a later install with the same release name re-adopts it. That protects you from an accidental uninstall; it isn't a backup, because it doesn't survive losing the cluster.

To remove that data deliberately:

```bash
oc -n <PROJECT-NAME> delete pvc <release-name>-platform-api-data
```

#### Upgrade { #openshift-operate-step-4-upgrade }

1. Back up the database, and confirm the backup completed.
2. Resolve the component chart versions:

    ```bash
    helm dependency update ./ai-workspace
    ```

3. Preview what changes before you apply it:

    ```bash
    umask 077
    helm template <release-name> ./ai-workspace -n <PROJECT-NAME> \
      -f values-secrets.yaml -f my_values.yaml > ./next.yaml
    ```

    The rendered output contains your full configuration. Review it, then remove it:

    ```bash
    shred -u ./next.yaml
    ```

4. Upgrade:

    ```bash
    helm upgrade <release-name> ./ai-workspace -n <PROJECT-NAME> \
      -f values-secrets.yaml -f my_values.yaml --wait --timeout 10m
    ```

5. Confirm the rollout finished and the pods are ready:

    ```bash
    oc -n <PROJECT-NAME> rollout status deploy/<release-name>-platform-api
    oc -n <PROJECT-NAME> rollout status deploy/<release-name>-ai-workspace
    oc -n <PROJECT-NAME> get pods
    ```

With two or more replicas and a PodDisruptionBudget in place, the rollout replaces pods gradually and keeps serving. Workspace sessions held by a replaced pod end, so users on that pod sign in again.

#### Roll back { #openshift-operate-step-5-roll-back }

```bash
helm history <release-name> -n <PROJECT-NAME>
helm rollback <release-name> <revision> -n <PROJECT-NAME> --wait
```

A rollback reverts the manifests, not the database. Restore from backup separately if the upgrade changed the schema.

#### Uninstall { #openshift-operate-step-6-uninstall }

```bash
helm uninstall <release-name> -n <PROJECT-NAME>
```

The Platform API's persistent volume claim survives, because of its `helm.sh/resource-policy: keep` annotation. Secrets you created outside the chart, including the ones `generate-secrets.sh` made, also survive. Remove them deliberately once you're certain no data depends on them.

For the reasoning behind each practice, see [Operate the deployment](operate.md).

## Advanced configuration

### OpenShift security context { #security-context }

Each component exposes its pod and container security contexts as free-form values. The chart renders them exactly as you provide them:

- `platform-api.deployment.podSecurityContext` and `platform-api.deployment.securityContext`
- `ai-workspace-ui.deployment.podSecurityContext` and `ai-workspace-ui.deployment.securityContext`

Both are empty by default. The following table describes the properties that matter on OpenShift:

| Property | Description |
|---|---|
| `runAsNonRoot` | Rejects the pod if it would run as root. |
| `runAsUser`, `fsGroup` | Set only under SCCs that don't assign them. `runAsUser` lets the kubelet verify `runAsNonRoot` for a named image user, and `fsGroup` makes the Platform API's database volume writable. |
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
    ai-workspace-ui:
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

    Sample values for both components, with the images' UID (`10001`) and an `fsGroup`. The Platform API image names its user (`wso2`) instead of using a number, so the kubelet can verify `runAsNonRoot` only when `runAsUser` is set. The `fsGroup` makes the Platform API's database volume writable.

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
    ai-workspace-ui:
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

For the other container restrictions, see [Harden the deployment](harden.md).

### Route configuration { #routes }

Each component has its own `openshift` block: `platform-api.openshift` and `ai-workspace-ui.openshift`. Within a block, the shared `openshift.routes.tls` settings apply by default. A Route's own `tls` block overrides them key by key.

The following table describes the Route properties:

| Property | Description |
|---|---|
| `<component>.openshift.enabled` | Renders the component's Route. |
| `platform-api.openshift.routes.platformApi.enabled` | Creates the Platform API Route. Gateways outside the cluster reach the Platform API through it. Turn it off to keep the Platform API internal. |
| `ai-workspace-ui.openshift.routes.aiWorkspace.enabled` | Creates the AI Workspace Route. |
| `<component>.openshift.routes.<route>.hostname` | The Route host. If it's empty, OpenShift generates one. |
| `<component>.openshift.routes.<route>.annotations` and `labels` | Extra metadata, such as router timeouts. |
| `<component>.openshift.routes.tls.termination` | `passthrough` or `reencrypt`. The Services serve HTTPS only, so the chart rejects `edge` at install time. |
| `<component>.openshift.routes.tls.insecureEdgeTerminationPolicy` | `None` or `Redirect`. |
| `<component>.openshift.routes.tls.certificate`, `key`, and `caCertificate` | The certificate the router serves (`reencrypt` only). If it's empty, the router uses its default certificate. |
| `<component>.openshift.routes.tls.destinationCACertificate` | The CA that signed the component's certificate. Required for `reencrypt` when the chart issues the certificate through cert-manager; the chart rejects the install without it. |

For how each termination type works, see [Creating advanced routes](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/ingress_and_load_balancing/routes#creating-advanced-routes) in the OpenShift documentation.

The following samples show each termination type:

=== "Passthrough (default)"

    The router forwards the TLS connection unchanged, and clients see the component's own certificate. That certificate must cover the Route's hostname and come from a CA that clients trust. The chart's default certificate is self-signed and covers only `localhost` names, so clients reject it or show a certificate warning. The same applies to the Platform API's Route, under `platform-api`. Also keep the Platform API's Service name, `ai-workspace-platform-api`, in its DNS names, because the BFF calls it inside the cluster. For production, do one of the following:

    - Set an explicit hostname, and issue the certificate from a trusted CA with that hostname in its DNS names:

        ```yaml
        ai-workspace-ui:
          openshift:
            routes:
              aiWorkspace:
                hostname: ai-workspace.example.com
          tls:
            certManager:
              createIssuer: false
              issuerRef:
                name: <ISSUER_NAME>
                kind: ClusterIssuer
              dnsNames:
                - ai-workspace.example.com
        ```

    - Provide your own certificate for the hostname in a Secret, with `ai-workspace-ui.tls.certificateProvider: secret` and `ai-workspace-ui.tls.secret.name`.
    - Use re-encrypt termination, so that clients see the router's certificate instead.

=== "Re-encrypt"

    The router serves its own certificate, or the one you provide, and opens a separate TLS connection to the component. It verifies that connection against `destinationCACertificate`. Browsers then see the cluster's trusted router certificate while the components keep their self-signed ones.

    With the default cert-manager issuer, use the CA from the component's certificate Secret:

    ```bash
    oc get secret ai-workspace-ai-workspace-tls -n <PROJECT-NAME> \
      -o jsonpath='{.data.ca\.crt}' | base64 -d > ai-workspace-ca.crt
    ```

    ```yaml
    ai-workspace-ui:
      openshift:
        routes:
          tls:
            termination: reencrypt
            destinationCACertificate: |
              -----BEGIN CERTIFICATE-----
              ...
              -----END CERTIFICATE-----
    ```

For where TLS terminates in general, see [Secure traffic with TLS](tls.md). For the public hostnames and redirect URLs, see [Expose AI Workspace](expose-the-workspace.md).

### Storage { #storage }

The Platform API stores its SQLite database in a PVC. The chart keeps the PVC after `helm uninstall` (`helm.sh/resource-policy: keep`). The pod's `fsGroup` makes the volume writable. Depending on the SCC, OpenShift assigns the `fsGroup` or you set it in the security context values (see [OpenShift security context](#security-context)).

Set `platform-api.persistence.storageClass` to choose a StorageClass. The AI Workspace UI is stateless and needs no storage.

## Troubleshooting

### Pods aren't created: "unable to validate against any security context constraint" { #scc-rejected }

**Symptom:** A Deployment shows `0/1` ready and no pod exists. The ReplicaSet events contain an error such as one of the following:

```
[... provider restricted-v2: .containers[0].runAsUser: Invalid value: 10001: must be in the ranges: [1000650000, 1000659999] ...]
[... provider anyuid: .spec.securityContext.seccompProfile.type: Forbidden: seccomp may not be set ...]
```

**Cause:** A security context requests something that the SCC doesn't allow: a fixed UID or GID outside the project's range under `restricted-v2`, or a seccomp profile under `anyuid`.

**Fix:** Use the values for your SCC from [OpenShift security context](#security-context).

### Pods fail with "image has non-numeric user" or "unable to open database file" { #scc-ids }

**Symptom:** Under an SCC other than `restricted-v2`, the Platform API pod stays in `CreateContainerConfigError` with `container has runAsNonRoot and image has non-numeric user (wso2), cannot verify user is non-root`, or it restarts with `unable to open database file`.

**Cause:** The SCC doesn't assign a UID or an `fsGroup`, and the values don't set them.

**Fix:** Set `runAsUser: 10001` and `fsGroup: 10001`, as shown in [OpenShift security context](#security-context).

### Pods stay in ContainerCreating with a missing TLS Secret

**Symptom:** The `ai-workspace-ai-workspace` or `ai-workspace-platform-api` pod stays in `ContainerCreating`, and its events contain `MountVolume.SetUp failed ... secret "ai-workspace-ai-workspace-tls" not found` or `secret "ai-workspace-platform-api-tls" not found`.

**Cause:** cert-manager hasn't issued the component's certificate. It isn't installed, or the Certificate is failing.

**Fix:**

1. Check the Certificates and their events:

    ```bash
    oc get certificate -n <PROJECT-NAME>
    oc describe certificate -n <PROJECT-NAME>
    ```

2. Make sure that cert-manager is installed and running, as described in [Step 3](#step-3). To use your own certificate instead, set `<component>.tls.certificateProvider=secret` and `<component>.tls.secret.name=<SECRET_NAME>`.

### Sign-in fails with a certificate error

**Symptom:** Sign-in fails with `login failed`. The AI Workspace logs contain `tls: failed to verify certificate: x509: certificate is valid for platform-api.localhost, ...` or `certificate signed by unknown authority` for the Platform API.

**Cause:** The BFF can't verify the Platform API's certificate.

**Fix:** Issue the certificate for the Service name `ai-workspace-platform-api` from a CA that the BFF trusts. For evaluation only, set `ai-workspace-ui.config.controlPlane.tlsSkipVerify: true` (see [Step 6](#step-6)).

### The Service stays pending with no external IP

**Symptom:** `oc get svc -n <PROJECT-NAME>` shows the AI Workspace Service as `LoadBalancer`, with `EXTERNAL-IP` set to `<pending>`.

**Fix:** Set `ai-workspace-ui.service.type: ClusterIP`. The Route doesn't need a `LoadBalancer` Service.

## Related

- [Deploy on Kubernetes](deploy-on-kubernetes.md) and [Deploy on VMs](deploy-on-vms.md): the full production sequence on the other platforms
- [Secure traffic with TLS](tls.md): certificates for each hop
- [Harden the deployment](harden.md): container and network restrictions
- [Deploy the API Portal on OpenShift](../../../api-portal/1.0.0/deployment/openshift.md): the portal with its own Platform API