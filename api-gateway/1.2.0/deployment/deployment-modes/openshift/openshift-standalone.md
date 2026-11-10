---
title: "Deploy on OpenShift in Standalone Mode"
description: "Install API Platform Gateway on Red Hat OpenShift with the gateway Helm chart, and expose its APIs through OpenShift Routes."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/1.2.0/deployment/deployment-modes/openshift/openshift-standalone/
md_url: https://wso2.com/api-platform/docs/api-gateway/1.2.0/deployment/deployment-modes/openshift/openshift-standalone.md
tags:
  - api-gateway
  - openshift
  - kubernetes
  - deployment
  - helm
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-24
content_type: "how-to"
---

# Deploy API Platform Gateway on OpenShift in standalone mode

This guide explains how to run API Platform Gateway on Red Hat OpenShift with the gateway Helm chart only, without the Gateway Operator. It's intended for platform engineers who deploy and operate the gateway.

Gateway artifacts can be deployed on OpenShift using the same Helm charts, Docker images, and configuration model as standard Kubernetes deployments. By default, OpenShift may assign a random UID to the container process within the project's permitted range. Containers typically run with GID 0 (the root group), allowing applications to access files and directories with appropriate group permissions without requiring root privileges. When deploying gateway artifacts, ensure that the pod and container security contexts configured through the Helm chart values are compatible with the Security Context Constraints (SCCs) enforced by your OpenShift cluster. Review the [Security context](#security-context) section for configuration guidance.

For more information about OpenShift container security and file permissions, see [Red Hat's guide to OpenShift and UIDs](https://www.redhat.com/en/blog/a-guide-to-openshift-and-uids) and [Group ownership and file permission](https://developers.redhat.com/blog/2020/10/26/adapting-docker-and-kubernetes-containers-to-run-on-red-hat-openshift-container-platform#group_ownership_and_file_permission). To manage gateways through custom resources instead, see [Deploy on OpenShift with the Gateway Operator](gateway-operator.md). For standard Kubernetes, see [Kubernetes standalone mode](../kubernetes/kubernetes-standalone.md).

## Before you begin

Make sure you have the following before you deploy:

- **Gateway chart 1.2.4 or later:** earlier charts have no OpenShift values or management API Route, and ignore those settings without an error.
- **Gateway images at update level 1.2.0.19 or later:** these images make their writable directories usable by the root group, which OpenShift needs. The public `1.2.0` images, which the chart uses by default, can't create the gateway runtime's sockets under the default `restricted-v2` SCC. You set the images in [Step 6](#step-6). Update levels are available with a WSO2 subscription.
- **An at-rest encryption key Secret:** the chart refuses to install without it. You create it in [Step 5](#step-5).
- **cert-manager, or your own TLS Secret:** the chart uses it for the gateway's HTTPS listener certificate.
- **A StorageClass:** the gateway controller stores its state in a PersistentVolumeClaim (PVC). Either the cluster has a default StorageClass, or you set one explicitly.

## Deploy the gateway

### Step 1: Install the required tools { #step-1 }

The following table lists the tools this guide uses:

| Tool | Purpose | Install guide |
| ---- | ------- | ------------- |
| `oc` | OpenShift CLI for managing cluster resources | [Install the OpenShift CLI](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html) |
| `helm` (v3) | Package manager for deploying the gateway Helm chart | [Install Helm](https://helm.sh/docs/intro/install/) |
| `openssl` | Generates the at-rest encryption key | Preinstalled on most systems |

Verify that the tools are installed:

```bash
oc version
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
    # Verify the connection
    oc whoami

    # Check the selected project
    oc project
    ```

3. Create a dedicated project for the gateway:

    ```bash
    oc new-project <PROJECT-NAME>
    ```

    Don't use the `default` project. A dedicated project isolates the gateway's resources and applies the project's security policies to it. Creating a project also creates the Kubernetes namespace with the same name and switches the current context to it. The rest of this guide uses `<PROJECT-NAME>` for that namespace.

### Step 3: Install cert-manager { #step-3 }

The gateway chart uses cert-manager to issue the TLS certificate for the gateway's HTTPS listener. Skip this step if cert-manager is already installed on the cluster.

1. Install cert-manager:

    ```bash
    helm upgrade --install \
      cert-manager oci://quay.io/jetstack/charts/cert-manager \
      --version v1.19.1 \
      --namespace cert-manager \
      --create-namespace \
      --set crds.enabled=true \
      --wait --timeout 10m
    ```

2. Verify that the cert-manager pods are running:

    ```bash
    oc get pods -n cert-manager
    ```

!!! note
    You can use the [cert-manager Operator for Red Hat OpenShift](https://docs.openshift.com/container-platform/latest/security/cert_manager_operator/index.html) instead of the Helm chart. To skip cert-manager entirely, provide your own TLS Secret by setting `gateway.controller.tls.certificateProvider=secret` and `gateway.controller.tls.secret.name=<SECRET_NAME>`.

### Step 4: Review the gateway runtime image { #step-4 }

The gateway runtime images from update level 1.2.0.19 run on OpenShift as is, so you don't need to build an image. The chart's default image tags point to the public `1.2.0` release, which doesn't have these permissions, so set the update-level images in [Step 6](#step-6). Images that the gateway builder creates with custom policies inherit the permissions of their base image, so build them on the update-level runtime image, as described in [Overriding the Base Images](../../../policies/custom-policies/building-gateway-with-custom-policies.md#overriding-the-base-images). Set such an image in `gateway.gatewayRuntime.image` in [Step 6](#step-6), as you would on Kubernetes.

The gateway runtime runs three processes in one container: the Router (Envoy), the Policy Engine, and the Python Executor. They talk to each other over Unix domain sockets in `/var/run/api-platform`. From update level 1.2.0.19, the image makes that directory writable by the root group, so the processes can create the sockets with whichever UID OpenShift runs them as.

!!! note "Building a gateway runtime image another way"
    If you build a gateway runtime image another way, such as from a different base image, make `/var/run/api-platform` writable by the root group. Add these lines to the `Dockerfile` after any step that creates or changes the directory, and apply the same pattern to any other directory that the image writes to outside a mounted volume:

    ```dockerfile
    USER root
    RUN chgrp -R 0 /var/run/api-platform && chmod -R g=u /var/run/api-platform
    USER 10001
    ```

    If you can't change the image, mount a writable `emptyDir` volume over the directory instead:

    ```yaml
    gateway:
      gatewayRuntime:
        deployment:
          extraVolumes:
            - name: runtime-sockets
              emptyDir:
                medium: Memory
                sizeLimit: 1Mi
          extraVolumeMounts:
            - name: runtime-sockets
              mountPath: /var/run/api-platform
    ```

### Step 5: Create the encryption key Secret { #step-5 }

The gateway controller encrypts sensitive data at rest with an AES-256 key. The chart doesn't install unless this Secret exists and the values reference it.

1. Generate the key and create the Secret:

    ```bash
    openssl rand 32 > default-aesgcm256-v1.bin
    oc create secret generic gateway-encryption-keys \
      --from-file=default-aesgcm256-v1.bin=default-aesgcm256-v1.bin \
      -n <PROJECT-NAME> && \
      rm default-aesgcm256-v1.bin   # remove the plaintext key only after the Secret is created
    ```

2. Verify that the Secret exists:

    ```bash
    oc get secret gateway-encryption-keys -n <PROJECT-NAME>
    ```

!!! note
    - Create the Secret in the same project that you install the gateway into.
    - Name the key entry exactly `default-aesgcm256-v1.bin`.
    - Keep a secure backup of the key. You can't recover data encrypted with it if you lose the key.

### Step 6: Install the gateway chart { #step-6 }

1. Update your `values.yaml` file with the following sections. To start from the chart's defaults, export them first:

    ```bash
    helm show values oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version 1.2.4 > values.yaml
    ```


    **Gateway images:** set the update-level images from [Step 4](#step-4).

    !!! note "Use update level 1.2.0.19 or later"
        With a WSO2 subscription, create the registry pull Secret as described in [WSO2 Subscription Users](../../high-availability-production-deployment.md#wso2-subscription-users), and set it in `wso2.subscription.imagePullSecret`. The chart then pulls from `registry.wso2.com/wso2-api-platform/`, but it keeps the default `1.2.0` tags, so set the update-level tags too:

        ```yaml
        wso2:
          subscription:
            imagePullSecret: wso2-subscription-creds
        gateway:
          controller:
            image:
              tag: "1.2.0.19"
          gatewayRuntime:
            image:
              tag: "1.2.0.19"
        ```

        Use the latest update level available to you. If you build your own gateway runtime image, set `gateway.gatewayRuntime.image.repository` and `tag` to it instead.

    **Encryption key:** reference the Secret from [Step 5](#step-5):

    ```yaml
    gateway:
      controller:
        encryptionKeys:
          enabled: true
          secretName: gateway-encryption-keys
    ```

    **Management API Route (optional):** the chart can create a Route for the gateway controller's management REST API. It's off by default because it's an administrative interface:

    ```yaml
    openshift:
      enabled: true
      routes:
        managementApi:
          enabled: false
          # Leave empty to let OpenShift generate <route-name>-<project>.<apps-domain>
          hostname: ""
    ```

    To turn it on, set `enabled: true` and replace the default `admin` password first. The chart refuses to create the Route while the management API still accepts the default password. For example, generate a bcrypt hash with `htpasswd -nBC 10 admin | cut -d: -f2`, which prompts for the new password, and set it:

    ```yaml
    gateway:
      config:
        controller:
          auth:
            basic:
              users:
                - username: admin
                  password: "<BCRYPT_HASH>"
                  password_hashed: true
                  roles: ["admin"]
    ```

    **Gateway runtime Service type:** the Routes that you create in [Step 7](#step-7) send traffic to the Service inside the cluster, so you don't need a `LoadBalancer` Service, which is the chart default. Keep `LoadBalancer` only if you expose the gateway runtime without Routes (see [Routing API traffic](#many-hostnames)):

    ```yaml
    gateway:
      gatewayRuntime:
        service:
          type: ClusterIP
    ```

    **Storage class:** skip this section if your cluster has a default StorageClass. Check with `oc get storageclass`.

    ```yaml
    gateway:
      controller:
        persistence:
          storageClass: "<STORAGE_CLASS>"
    ```

    **Security context (recommended):** add values that suit your SCC. See the samples in [Security context](#security-context).

2. Install the chart:

    ```bash
    helm install gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
      --version 1.2.4 \
      --namespace <PROJECT-NAME> \
      -f values.yaml
    ```

3. Wait for the pods to be ready:

    ```bash
    oc get pods -n <PROJECT-NAME> -w
    ```

    Both the `gateway-controller` and `gateway-runtime` pods must show `1/1 Running` before you continue.

### Step 7: Create a Route for API traffic { #step-7 }

The chart doesn't create Routes for API traffic. The hostnames that the gateway serves depend on the virtual hosts configured on the gateway and in each API definition, as described in [Routing API traffic](#routing-api-traffic). With the default configuration, the gateway's main virtual host accepts any hostname, so one Route with a generated hostname serves every API that doesn't set its own virtual hosts.

1. Create the Route:

    ```bash
    oc create route passthrough gateway-runtime \
      --service=gateway-gateway-runtime \
      --port=https \
      -n <PROJECT-NAME>
    ```

    With `passthrough` termination, the router forwards the encrypted connection, and the gateway terminates TLS with its own certificate. For other termination types, see [Create a Route](#create-route).

2. List the Routes:

    ```bash
    oc get route -n <PROJECT-NAME>
    ```

3. Confirm that the output has the Route that you created. If you enabled it, the output also has the management API Route with `edge` termination:

    ```
    NAME                     HOST/PORT                                           SERVICES                  PORT    TERMINATION
    gateway-runtime          gateway-runtime-<PROJECT-NAME>.<APPS_DOMAIN>        gateway-gateway-runtime   https   passthrough
    gateway-management-api   gateway-management-api-<PROJECT-NAME>.<APPS_DOMAIN> gateway-controller        rest    edge/Redirect
    ```

To reach the sandbox environment of an API, or to serve APIs on their own hostnames, create more Routes as described in [Routing API traffic](#routing-api-traffic).

### Step 8: Deploy and invoke a test API { #step-8 }

1. Get the gateway runtime Route's hostname, and forward the controller's management API port:

    ```bash
    GATEWAY_HOST=$(oc get route gateway-runtime -n <PROJECT-NAME> -o jsonpath='{.spec.host}')
    oc port-forward svc/gateway-controller 9090:9090 -n <PROJECT-NAME> &
    ```

    If you enabled the management API Route in [Step 6](#step-6), you can use it instead of the port-forward. Get its hostname, then in the next steps use `$MGMT_HOST` in place of `localhost` in the `netrc` file, and `https://$MGMT_HOST` in place of `http://localhost:9090`. If your machine doesn't trust the router's certificate, also add `-k` to the `curl` command:

    ```bash
    MGMT_HOST=$(oc get route gateway-management-api -n <PROJECT-NAME> -o jsonpath='{.spec.host}')
    ```

2. Write the management API credentials to a `netrc` file. A password passed to `curl -u` is visible in your shell history and the host's process list, and a `netrc` file only you can read keeps it out:

    ```bash
    install -m 600 /dev/null controller.netrc
    read -rp "Management API username: " ADMIN_USERNAME
    read -rsp "Management API password: " ADMIN_PASSWORD && echo
    printf 'machine %s login %s password %s\n' localhost "$ADMIN_USERNAME" "$ADMIN_PASSWORD" > controller.netrc
    unset ADMIN_PASSWORD
    ```

    Use the credentials you set to turn on the management API Route. If you use the port-forward and haven't changed them, they're the chart's defaults.

    !!! warning
        `admin` and `admin` are the chart's default management API credentials. Change them through `gateway.config.controller.auth.basic.users` for any deployment beyond evaluation.

3. Deploy a sample API through the management API, then remove the credentials file:

    ```bash
    curl --fail --show-error -X POST http://localhost:9090/api/management/v1/rest-apis \
      -H "Content-Type: application/yaml" \
      --netrc-file controller.netrc \
      --data-binary @- <<'EOF'
    apiVersion: gateway.api-platform.wso2.com/v1
    kind: RestApi
    metadata:
      name: sample-api-v1.0
    spec:
      displayName: Sample-API
      version: v1.0
      context: /sample/$version
      upstream:
        main:
          url: https://httpbin.org/anything
      operations:
        - method: GET
          path: /info
    EOF

    shred -u controller.netrc
    ```

4. Invoke the API through the gateway runtime Route:

    Generated hostnames under the cluster's apps domain resolve through the cluster's wildcard DNS record. If you created the Route with a custom `--hostname`, create a DNS record that points it at the cluster's router before you invoke the API:

    ```bash
    curl -k "https://$GATEWAY_HOST/sample/v1.0/info"
    ```

    The response is the upstream's echo of the request, with `"url": "https://httpbin.org/anything/info"`.

## Upgrade and uninstall { #upgrade-and-uninstall }

Upgrade with the same values file you installed with:

```bash
helm upgrade gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version 1.2.4 \
  --namespace <PROJECT-NAME> \
  -f values.yaml
```

Pass your values file on every upgrade. Don't upgrade from gateway chart 1.2.3 or earlier with `--reuse-values`: Helm then keeps that version's defaults, which have no `openshift` values, and the upgrade fails with `nil pointer evaluating interface {}.routes` without changing the release. To carry the previous release's values forward instead, use `--reset-then-reuse-values` (Helm 3.14 or later).

To remove the gateway, run the following command:

```bash
helm uninstall gateway --namespace <PROJECT-NAME>
```

`helm uninstall` also deletes the `gateway-controller-data` PVC, which holds the gateway controller's database. To keep it, add the following to `values.yaml` and run the upgrade command above before you uninstall:

```yaml
gateway:
  controller:
    persistence:
      annotations:
        helm.sh/resource-policy: keep
```

The encryption key Secret from [Step 5](#step-5) isn't part of the release, so it stays. Keep it as long as you keep the PVC, because the stored data is encrypted with it.

## Advanced configuration

### Security context { #security-context }

The chart exposes the pod and container security contexts of each component as free-form values, and renders them exactly as you provide them:

- `gateway.controller.deployment.podSecurityContext` and `gateway.controller.deployment.securityContext`
- `gateway.gatewayRuntime.deployment.podSecurityContext` and `gateway.gatewayRuntime.deployment.securityContext`

Both are empty by default. The following table describes the properties that matter on OpenShift:

| Property | Description |
|---|---|
| `runAsNonRoot` | Rejects the pod if it would run as root. |
| `runAsUser`, `fsGroup` | Set only under SCCs that don't assign them. `runAsUser` lets the kubelet verify `runAsNonRoot` for the named image user, and `fsGroup` makes mounted volumes writable. |
| `seccompProfile` | Required by `restricted-v2`, `nonroot-v2`, and the `restricted` Pod Security Standard. Not allowed by `anyuid`. |
| `allowPrivilegeEscalation` | The gateway never needs to escalate privileges. |
| `capabilities` | The gateway listens only on ports above 1024 and needs no Linux capabilities, so all of them can be dropped. |

The values that OpenShift admits depend on the SCC that the pods run under. For the strategies that each SCC applies to these properties, see [Managing security context constraints](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/authentication_and_authorization/managing-pod-security-policies) in the OpenShift documentation.

The following samples show values for common SCCs. The default SCC for workloads, `restricted-v2`, assigns the UID, the `fsGroup`, and the seccomp profile itself. SCCs such as `anyuid` and `nonroot-v2` assign none of them, so the values must set the IDs.

=== "restricted-v2 (default)"

    Sample values for both components. Don't set `runAsUser`, `runAsGroup`, or `fsGroup`: `restricted-v2` assigns them from the project's range and rejects a pod that requests other values (see [Troubleshooting](#scc-rejected)).

    ```yaml
    gateway:
      controller:
        deployment:
          podSecurityContext:
            runAsNonRoot: true
            seccompProfile:
              type: RuntimeDefault
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop: ["ALL"]
      gatewayRuntime:
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

    If you reuse a values file written for standard Kubernetes that sets fixed IDs, override them with `null`, for example `runAsUser: null`, `runAsGroup: null`, and `fsGroup: null`.

=== "Other SCCs (anyuid, nonroot-v2)"

    Sample values for both components, with the image's UID (`10001`) and an `fsGroup`. The gateway images name their user (`wso2`) instead of using a number, so the kubelet can verify `runAsNonRoot` only when `runAsUser` is set. The `fsGroup` makes the controller's volume writable.

    ```yaml
    gateway:
      controller:
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
      gatewayRuntime:
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

    `anyuid` doesn't allow any seccomp profile, so leave out `seccompProfile` under it. Grant the SCC to the gateway's service account, for example `oc adm policy add-scc-to-user anyuid -z <SERVICE_ACCOUNT> -n <PROJECT-NAME>`.

### Routing API traffic { #routing-api-traffic }

The OpenShift router forwards a request only when its hostname belongs to a Route. The gateway then picks the API from the request's `Host` header and path. A hostname works end to end only when both of the following are true:

- A Route with that hostname points to the gateway runtime Service, `gateway-gateway-runtime`.
- The hostname matches a virtual host that the gateway serves.

The chart doesn't create these Routes, because you choose the hostnames, and they can change with every API that you deploy. Create them with `oc`, as described in this section.

#### How the gateway chooses hostnames { #virtual-hosts }

Every API has a main and a sandbox environment, each with its own upstream: `spec.upstream.main` and `spec.upstream.sandbox`. The gateway serves them on two virtual hosts, whose defaults you set at the gateway level:

| Virtual host | Default | Setting |
|---|---|---|
| Main | `*` (any hostname) | `gateway.config.router.vhosts.main.default` |
| Sandbox | `sandbox-*` (hostnames that start with `sandbox-`) | `gateway.config.router.vhosts.sandbox.default` |

A non-empty `domains` list, `gateway.config.router.vhosts.main.domains` or `gateway.config.router.vhosts.sandbox.domains`, replaces the default pattern with the listed hostnames.

An API can override these values in its definition:

```yaml
spec:
  vhosts:
    main: orders.example.com              # one or more hostnames, separated by ";"
    sandbox: orders-sandbox.example.com   # one hostname
```

The gateway serves an API that sets its own virtual host only on that hostname. It doesn't serve APIs that use the gateway-level defaults on that hostname.

Create one Route for each hostname that clients use, whether the hostname comes from the gateway-level settings or from an API definition.

#### Create a Route { #create-route }

Set the hostname with `--hostname`. If you leave it out, OpenShift generates `<ROUTE-NAME>-<PROJECT-NAME>.<APPS_DOMAIN>`, which the default `*` main virtual host accepts.

=== "passthrough (recommended)"

    The router forwards the encrypted connection to the gateway, which terminates TLS with its own certificate. Clients see the gateway's certificate, so add custom hostnames to `gateway.controller.tls.certManager.dnsNames`:

    ```bash
    oc create route passthrough <ROUTE-NAME> \
      --service=gateway-gateway-runtime \
      --port=https \
      --hostname=<HOSTNAME> \
      -n <PROJECT-NAME>
    ```

=== "reencrypt"

    The router terminates the client's TLS connection with its own certificate and opens a second TLS connection to the gateway. The router uses the cluster's default certificate unless you pass one. The router must trust the gateway's certificate, so pass the CA that issued it. With the default cert-manager setup, extract the CA from the gateway's TLS Secret:

    ```bash
    oc get secret gateway-controller-tls -n <PROJECT-NAME> \
      -o jsonpath='{.data.ca\.crt}' | base64 -d > gateway-ca.crt

    oc create route reencrypt <ROUTE-NAME> \
      --service=gateway-gateway-runtime \
      --port=https \
      --hostname=<HOSTNAME> \
      --dest-ca-cert=gateway-ca.crt \
      -n <PROJECT-NAME>
    ```

    For a hostname outside the cluster's apps domain, also pass the certificate that the router serves: `--cert=tls.crt --key=tls.key --ca-cert=ca.crt`.

=== "edge"

    The router terminates TLS and forwards plain HTTP to the gateway's `http` port (8080):

    ```bash
    oc create route edge <ROUTE-NAME> \
      --service=gateway-gateway-runtime \
      --port=http \
      --hostname=<HOSTNAME> \
      --insecure-policy=Redirect \
      -n <PROJECT-NAME>
    ```

    For a hostname outside the cluster's apps domain, also pass `--cert`, `--key`, and `--ca-cert`.

Use `passthrough` or `reencrypt` with the `https` port, and `edge` with the `http` port. With any other combination, the router returns `503`.

For a hostname outside the cluster's apps domain, create a DNS record that points it at the cluster's router.

!!! note "Route timeouts"
    On `edge` and `reencrypt` Routes, the OpenShift router closes a connection when the gateway sends nothing for 30 seconds, by default. For long-running requests, such as streaming LLM responses, raise the timeout on those Routes. `passthrough` Routes use the router's tunnel timeout, one hour by default, so they don't need it:

    ```bash
    oc annotate route <ROUTE-NAME> haproxy.router.openshift.io/timeout=120s -n <PROJECT-NAME>
    ```

#### Sandbox traffic { #sandbox-traffic }

With the default sandbox virtual host, `sandbox-*`, give the sandbox Route a name that starts with `sandbox-`, so that the generated hostname matches:

```bash
oc create route passthrough sandbox-gateway \
  --service=gateway-gateway-runtime \
  --port=https \
  -n <PROJECT-NAME>
```

For an API that defines a sandbox upstream, such as the following:

```yaml
spec:
  upstream:
    main:
      url: https://httpbin.org/anything/main
    sandbox:
      url: https://httpbin.org/anything/sandbox
```

Invoke each environment through its Route:

```bash
MAIN_HOST=$(oc get route gateway-runtime -n <PROJECT-NAME> -o jsonpath='{.spec.host}')
SANDBOX_HOST=$(oc get route sandbox-gateway -n <PROJECT-NAME> -o jsonpath='{.spec.host}')

curl -k "https://$MAIN_HOST/<CONTEXT>/<VERSION>/<PATH>"      # main upstream
curl -k "https://$SANDBOX_HOST/<CONTEXT>/<VERSION>/<PATH>"   # sandbox upstream
```

A sandbox request to an API without a sandbox upstream returns `404`.

!!! note "Custom sandbox hostname"
    A sandbox hostname must be a sandbox virtual host. It either starts with `sandbox-`, such as `sandbox-api.example.com`, is listed in `gateway.config.router.vhosts.sandbox.domains`, or is the API's own `spec.vhosts.sandbox`. With the default main virtual host, `*`, the gateway serves any other hostname as main traffic. For example, `sandbox.api.example.com` reaches the main upstream unless you list it in `sandbox.domains`.

!!! note "Generated hostname length"
    The first label of a generated hostname, `<ROUTE-NAME>-<PROJECT-NAME>`, must be 63 characters or fewer. If the names are long, pass `--hostname` instead.

#### Many hostnames { #many-hostnames }

If your APIs use many hostnames, or hostnames that change often, use one of the following options instead of one Route per hostname:

- **A wildcard Route** serves every hostname under one domain. The cluster's ingress controller must allow wildcard Routes, which requires cluster-admin access:

    ```bash
    oc patch ingresscontroller/default -n openshift-ingress-operator --type=merge \
      -p '{"spec":{"routeAdmission":{"wildcardPolicy":"WildcardsAllowed"}}}'

    # Serves *.apis.example.com
    oc create route reencrypt apis-wildcard \
      --service=gateway-gateway-runtime \
      --port=https \
      --hostname=wildcard.apis.example.com \
      --wildcard-policy=Subdomain \
      --dest-ca-cert=gateway-ca.crt \
      -n <PROJECT-NAME>
    ```

    The Route serves one level of subdomain, such as `orders.apis.example.com`. It doesn't serve `apis.example.com` or `v2.orders.apis.example.com`. Create a wildcard DNS record, `*.apis.example.com`, that points at the router, and use a router certificate that covers the wildcard.

- **A `LoadBalancer` Service** sends traffic straight to the gateway without the router, so every hostname works without a Route. Set `gateway.gatewayRuntime.service.type: LoadBalancer`, which is the chart default, and point the DNS records at the load balancer. This option needs a load balancer for the cluster, such as the cloud provider's load balancer or MetalLB.

### Storage { #storage }

The gateway controller stores its state in SQLite on a PVC mounted at `/app/data`. The pod's `fsGroup` makes the volume writable. Depending on the SCC, OpenShift assigns the `fsGroup` or you set it in the security context values (see [Security context](#security-context)).

The following table lists the storage settings:

| Setting | Default | Description |
|---|---|---|
| `gateway.controller.persistence.enabled` | `true` | Set to `false` to use an `emptyDir` volume instead of a PVC. The data doesn't survive pod restarts, so use this for evaluation only. |
| `gateway.controller.persistence.storageClass` | `""` | An empty value uses the cluster's default StorageClass. Set it explicitly if the cluster has no default. |
| `gateway.controller.persistence.size` | `100Mi` | Size of the PVC. |
| `gateway.controller.persistence.existingClaim` | `""` | Name of a PVC that you created, to use instead of creating one. |

!!! note
    - Use a storage class whose driver supports `fsGroup`. Most block storage CSI drivers do. For storage that ignores `fsGroup`, such as NFS, make the exported directory group-writable by a group that you add through `podSecurityContext.supplementalGroups`.
    - SQLite with a `ReadWriteOnce` volume supports a single controller replica. On a multi-node cluster, set `gateway.controller.deployment.strategy.type: Recreate`. This stops an upgrade from starting the replacement pod on a different node while the previous pod still holds the volume.
    - For multiple controller replicas, use an external PostgreSQL or SQL Server database through `gateway.config.controller.storage.type`. See [Database configuration](../../production-deployment/database-configuration.md).

### Read-only root filesystem { #read-only-root-filesystem }

No default SCC requires a read-only root filesystem. You need one only if your cluster enforces it through a custom SCC, or if you turn it on for hardening. For the SCC setting, see [Managing security context constraints](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/authentication_and_authorization/managing-pod-security-policies) in the OpenShift documentation.

With `readOnlyRootFilesystem: true`, a container can't write anywhere inside its image, so every path that a component writes to at runtime must be a mounted volume. Mount a writable `emptyDir` volume at each such path through the chart's `extraVolumes` and `extraVolumeMounts` settings, under `gateway.<component>.deployment`. An `emptyDir` volume is writable by the UID that the pod runs as, whatever the SCC. For example:

```yaml
gateway:
  gatewayRuntime:
    deployment:
      securityContext:
        readOnlyRootFilesystem: true
      extraVolumes:
        - name: <VOLUME_NAME>
          emptyDir: {}
      extraVolumeMounts:
        - name: <VOLUME_NAME>
          mountPath: <WRITABLE_PATH>
```

## Troubleshooting

### Gateway runtime fails with "Permission denied" on its socket { #socket-permission-denied }

**Symptom:** The `gateway-runtime` pod is in `CrashLoopBackOff`, and its logs contain the following lines, or `ERROR: Policy Engine exited before creating socket`:

```
[pye] ... Failed to add port to server: No address added out of total 1 resolved for 'unix:/var/run/api-platform/python-executor.sock' (Error in bind for address '/var/run/api-platform/python-executor.sock': Permission denied)
[ent] ... ERROR: Python Executor exited before creating socket
```

**Cause:** The gateway runtime can't create its Unix domain sockets in `/var/run/api-platform`. This happens when the gateway runtime image is the public `1.2.0` release, which doesn't make this directory writable by the root group. It also happens when the root filesystem is read-only and no writable volume is mounted at that path.

**Fix:**

1. Check which image the gateway runtime uses. If the tag is `1.2.0`, set an update-level image as described in [Step 6](#step-6):

    ```bash
    oc get deployment gateway-gateway-runtime -n <PROJECT-NAME> \
      -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
    ```

2. Check whether the root filesystem is read-only and which volumes are mounted:

    ```bash
    oc get deployment gateway-gateway-runtime -n <PROJECT-NAME> \
      -o jsonpath='{.spec.template.spec.containers[0].securityContext.readOnlyRootFilesystem}{"\n"}{.spec.template.spec.containers[0].volumeMounts}{"\n"}'
    ```

3. Mount a writable `emptyDir` volume at `/var/run/api-platform`, as described in [Read-only root filesystem](#read-only-root-filesystem), or turn off the read-only root filesystem.

### Pods aren't created: "unable to validate against any security context constraint" { #scc-rejected }

**Symptom:** The Deployment shows `0/1` ready and no pod exists. The ReplicaSet events contain an error such as one of the following:

```
[... provider restricted-v2: .containers[0].runAsUser: Invalid value: 10001: must be in the ranges: [1000650000, 1000659999] ...]
[... provider anyuid: .spec.securityContext.seccompProfile.type: Forbidden: seccomp may not be set ...]
```

**Cause:** The security context requests something that the SCC doesn't allow: a fixed `runAsUser`, `runAsGroup`, or `fsGroup` outside the project's range under `restricted-v2`, or a seccomp profile under `anyuid`.

**Fix:** Use the values for your SCC from [Security context](#security-context). To inspect the events, run:

```bash
oc get events -n <PROJECT-NAME> --field-selector reason=FailedCreate
```

### Pods fail with "image has non-numeric user" or "unable to open database file" { #scc-ids }

**Symptom:** Under an SCC other than `restricted-v2`, a pod stays in `CreateContainerConfigError` with `container has runAsNonRoot and image has non-numeric user (wso2), cannot verify user is non-root`, or the gateway controller restarts with `unable to open database file`.

**Cause:** The SCC doesn't assign a UID or an `fsGroup`, and the values don't set them.

**Fix:** Set `runAsUser: 10001` and `fsGroup: 10001`, as shown in [Security context](#security-context).

### Gateway controller pod stays pending

**Symptom:** The `gateway-controller` pod and its PVC stay `Pending`.

**Fix:**

1. Check the PVC:

    ```bash
    oc get pvc -n <PROJECT-NAME>
    oc describe pvc gateway-controller-data -n <PROJECT-NAME>
    ```

2. If no StorageClass is set and the cluster has no default, set `gateway.controller.persistence.storageClass` as described in [Storage](#storage).

### Gateway controller stays in ContainerCreating with a missing TLS Secret

**Symptom:** The `gateway-controller` pod stays in `ContainerCreating`, and its events contain `MountVolume.SetUp failed ... secret "gateway-controller-tls" not found`.

**Cause:** cert-manager hasn't issued the gateway's certificate. It isn't installed, or the Certificate is failing.

**Fix:**

1. Check the Certificate and its events:

    ```bash
    oc get certificate -n <PROJECT-NAME>
    oc describe certificate -n <PROJECT-NAME>
    ```

2. Make sure that cert-manager is installed and running, as described in [Step 3](#step-3). To use your own certificate instead, set `gateway.controller.tls.certificateProvider=secret` and `gateway.controller.tls.secret.name=<SECRET_NAME>`.

### Route returns "Application is not available"

**Symptom:** Requests return the OpenShift router's `503 Application is not available` page.

**Fix:**

1. Confirm that a Route exists for the hostname that you call. The router returns `503` for hostnames without a Route. Create one, as described in [Create a Route](#create-route).
2. Confirm that the pods are `1/1 Running`. The router sends traffic only to ready pods.
3. Confirm that the Route points to the `gateway-gateway-runtime` Service, and that the port matches the termination type: `https` for `passthrough` and `reencrypt`, and `http` for `edge`:

    ```bash
    oc get route -n <PROJECT-NAME> -o wide
    ```

4. For `reencrypt` termination, confirm that `--dest-ca-cert` is the CA that issued the gateway's current certificate. A wrong or outdated CA results in `503`.

### Gateway runtime Service shows a pending EXTERNAL-IP

**Cause:** The chart creates a `LoadBalancer` Service for the gateway runtime by default. Many on-premises clusters don't provision load balancers.

**Fix:** Set `gateway.gatewayRuntime.service.type: ClusterIP`, and create Routes for external access, as described in [Routing API traffic](#routing-api-traffic).

## Next steps

- [Deploy on OpenShift with the Gateway Operator](gateway-operator.md)
- [Security hardening](../../production-deployment/security-hardening.md)
- [Building the gateway with custom policies](../../../policies/custom-policies/building-gateway-with-custom-policies.md)