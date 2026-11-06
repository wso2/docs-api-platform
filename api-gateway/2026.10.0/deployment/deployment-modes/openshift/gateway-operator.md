---
title: "Deploy on OpenShift with the Gateway Operator"
description: "Install the API Platform Gateway Operator on Red Hat OpenShift, and create gateways and APIs that you expose through OpenShift Routes."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/2026.10.0/deployment/deployment-modes/openshift/gateway-operator/
md_url: https://wso2.com/api-platform/docs/api-gateway/2026.10.0/deployment/deployment-modes/openshift/gateway-operator.md
tags:
  - api-gateway
  - openshift
  - kubernetes
  - operator
  - deployment
  - helm
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-24
content_type: "how-to"
---

# Deploy API Platform Gateway on OpenShift with the Gateway Operator

This guide explains how to run the Gateway Operator on Red Hat OpenShift. It's intended for platform engineers who install the operator and create gateways with it.

The Gateway Operator manages gateways and APIs through Kubernetes resources, and supports two resource models:

- **Kubernetes Gateway API resources:** `GatewayClass`, `Gateway`, and `HTTPRoute`. The operator reconciles the `Gateway` resources whose `gatewayClassName` it manages.
- **WSO2 API Platform custom resources:** `APIGateway` for gateways, and resources such as `RestApi`, `Mcp`, and `LlmProvider` for the APIs that run on them.

For either model, the operator installs the gateway Helm chart for each gateway and deploys the APIs to the matching gateways.

The operator and its gateways can be deployed on OpenShift using the same Helm charts, Docker images, and configuration model as standard Kubernetes deployments. By default, OpenShift may assign a random UID to the container process within the project's permitted range. Containers typically run with GID 0 (the root group), allowing applications to access files and directories with appropriate group permissions without requiring root privileges. When deploying the operator and its gateways, ensure that the pod and container security contexts configured through the Helm chart values are compatible with the Security Context Constraints (SCCs) enforced by your OpenShift cluster. Review the [Operator security context](#operator-security-context) section for the operator, and [Security context](openshift-standalone.md#security-context) for the gateways.

For more information about OpenShift container security and file permissions, see [Red Hat's guide to OpenShift and UIDs](https://www.redhat.com/en/blog/a-guide-to-openshift-and-uids) and [Group ownership and file permission](https://developers.redhat.com/blog/2020/10/26/adapting-docker-and-kubernetes-containers-to-run-on-red-hat-openshift-container-platform#group_ownership_and_file_permission). This guide covers the operator-specific steps, and links to [Deploy on OpenShift in standalone mode](openshift-standalone.md) for the gateway-level details. For standard Kubernetes, see [Kubernetes Operator mode](../kubernetes/gateway-operator.md).

## Before you begin

Install the operator with the following settings and resources:

- **OpenShift support on:** set `openshift.enabled: auto` or `true`.
- **Operator UID for your SCC:** under the default `restricted-v2` SCC, set `securityContext.runAsUser: null`, because `restricted-v2` rejects the default UID `10001`. Under SCCs that allow it, keep `10001`. See [Operator security context](#operator-security-context).
- **Gateway API CRDs left to OpenShift:** on OpenShift 4.19 and later, set `gatewayApi.installStandardCRDs: false`.
- **An at-rest encryption key Secret** in every project where you create a gateway.
- **cert-manager, or your own TLS Secrets:** each gateway uses them for its HTTPS listener certificate.
- **Cluster administrator permissions:** the operator chart creates CRDs and cluster-scoped role-based access control (RBAC) resources.

## Deploy the operator and a gateway

### Step 1: Install the required tools { #step-1 }

The following table lists the tools this guide uses:

| Tool | Purpose | Install guide |
| ---- | ------- | ------------- |
| `oc` | OpenShift CLI for managing cluster resources | [Install the OpenShift CLI](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html) |
| `helm` (v3) | Package manager for deploying the operator Helm chart | [Install Helm](https://helm.sh/docs/intro/install/) |
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

3. Create a dedicated project:

    ```bash
    oc new-project <PROJECT-NAME>
    ```

    Don't use the `default` project. This guide installs the operator and its first gateway in the same project, `<PROJECT-NAME>`.

### Step 3: Install cert-manager { #step-3 }

Each gateway that the operator creates uses cert-manager to issue its HTTPS listener certificate. Skip this step if cert-manager is already installed on the cluster.

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

### Step 4: Install the Gateway Operator { #step-4 }

1. Add the following settings to your operator values file, `operator-values.yaml`. To start from the chart's defaults, export them first with `helm show values oci://ghcr.io/wso2/api-platform/helm-charts/gateway-operator --version <CHART_VERSION> > operator-values.yaml`.

    ```yaml
    # Namespaces the operator watches. Leave empty to watch all namespaces.
    watchNamespaces:
      - <PROJECT-NAME>

    # Detect OpenShift and turn on OpenShift support. Use true when installing with
    # helm template, --dry-run or GitOps tools such as Argo CD (see the note below).
    openshift:
      enabled: auto

    # OpenShift 4.19+ ships the Gateway API CRDs and manages them through the Ingress Operator.
    gatewayApi:
      installStandardCRDs: false

    # Under restricted-v2, let OpenShift assign the UID from the project's range.
    # Under SCCs that allow fixed UIDs, such as anyuid or nonroot-v2, leave this out.
    securityContext:
      runAsUser: null
    ```

2. Install the operator:

    ```bash
    helm install gateway-operator oci://ghcr.io/wso2/api-platform/helm-charts/gateway-operator \
      --version <CHART_VERSION> \
      --namespace <PROJECT-NAME> \
      -f operator-values.yaml
    ```

3. Wait for the operator pod to be ready:

    ```bash
    oc get pods -n <PROJECT-NAME> -l control-plane=controller-manager -w
    ```

    The pod must show `1/1 Running` before you continue.

The `openshift.enabled` setting accepts the values in the following table:

| Value | Behavior |
|---|---|
| `false` (default) | No OpenShift changes. |
| `true` | OpenShift support on. |
| `auto` | OpenShift support on when the cluster serves the `route.openshift.io/v1` API. |

With OpenShift support on, the chart does the following:

1. Allows the operator to create and manage Routes, including Routes with a custom hostname.
2. Sets `openshift.enabled: true` in the gateway values, so that you can turn on a gateway's management API Route with `openshift.routes.managementApi.enabled`. A value that you set in `gateway.values.openshift.enabled` takes precedence.

The chart doesn't create Routes for API traffic. You create them, as described in [Step 7](#step-7).

The setting doesn't change the operator's security contexts. The chart renders them exactly as you set them.

!!! note "When to use `true` instead of `auto`"
    The `auto` value checks the cluster when Helm installs the chart. `helm template`, `helm install --dry-run`, and GitOps tools such as Argo CD render charts without querying the cluster, so `auto` resolves to `false` there. Use `true` in those cases.

!!! note "Why `runAsUser: null` under `restricted-v2`?"
    The `restricted-v2` SCC uses the `MustRunAsRange` strategy for the UID. Each project has its own UID range, in the `openshift.io/sa.scc.uid-range` annotation on the project. A pod must either leave `runAsUser` unset or request a UID inside that range, and Red Hat recommends leaving it unset for the restricted SCCs.

    Setting `runAsUser` to `null` in Helm removes the chart's default UID `10001`, so OpenShift assigns one from the range. If you run the operator under a custom SCC, set `runAsUser` to a UID that the SCC allows instead. For details, see [Important OpenShift changes to Pod Security Standards](https://connect.redhat.com/en/blog/important-openshift-changes-pod-security-standards) and [Managing security context constraints](https://docs.redhat.com/en/documentation/openshift_container_platform/4.11/html/authentication_and_authorization/managing-pod-security-policies).

### Step 5: Prepare the gateway configuration { #step-5 }

The operator installs the gateway Helm chart for every `APIGateway`. It builds each gateway's values in the following layers. When two layers set the same value, the later layer wins.

1. The gateway chart's own defaults.
2. The operator chart's `gateway.values`, which apply to every gateway that the operator creates.
3. The `APIGateway`'s `spec.infrastructure` labels and annotations.
4. The ConfigMap that the `APIGateway`'s `spec.configRef` references, which applies to that gateway only.

This guide puts the gateway settings in a ConfigMap. To apply a setting to every gateway instead, such as a custom runtime image, put it under `gateway.values` when you install the operator.

1. Create the encryption key Secret in the project where the gateway runs:

    ```bash
    openssl rand 32 > default-aesgcm256-v1.bin
    oc create secret generic gateway-encryption-keys \
      --from-file=default-aesgcm256-v1.bin=default-aesgcm256-v1.bin \
      -n <PROJECT-NAME> && \
      rm default-aesgcm256-v1.bin   # remove the plaintext key only after the Secret is created
    ```

2. Create an `openshift-gateway-values.yaml` file with a ConfigMap that holds the gateway values:

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: openshift-gateway-values
      namespace: <PROJECT-NAME>
    data:
      values.yaml: |
        gateway:
          controller:
            encryptionKeys:
              enabled: true
              secretName: gateway-encryption-keys
          gatewayRuntime:
            service:
              type: ClusterIP
    ```

    The gateway runtime image comes from the gateway chart version in the operator's `gateway.helm.chartVersion`, and runs on OpenShift as is. To use a custom gateway runtime image, set `gateway.gatewayRuntime.image` in the ConfigMap. An image that you build with the gateway builder works as is. For an image that you build another way, see the note in [Review the gateway runtime image](openshift-standalone.md#step-4).

3. Apply the ConfigMap:

    ```bash
    oc apply -f openshift-gateway-values.yaml
    ```

!!! note
    The ConfigMap accepts any value from the gateway Helm chart, so the gateway-level settings in the standalone guide apply here too. See [Gateway settings through `configRef`](#gateway-settings).

!!! warning "Keep the gateway admin password in plain text"
    The operator signs in to each gateway's management API as the first user in `gateway.config.controller.auth.basic.users` in the gateway's ConfigMap, and it reads that user's password as plain text. If you hash the password (`password_hashed: true`), as the standalone guide shows for the management API Route, the operator can't sign in, and every API deployment to that gateway fails with `status 401`. The operator doesn't retry it.

    To change the admin credentials of an operator gateway, set them in its ConfigMap with `enabled: true` and a plain-text password:

    ```yaml
    gateway:
      config:
        controller:
          auth:
            basic:
              enabled: true
              users:
                - username: admin
                  password: "<PASSWORD>"
                  password_hashed: false
                  roles: ["admin"]
    ```

    The management API Route refuses the default `admin` password, so use a strong non-default one if you turn the Route on. Restrict who can read the ConfigMap, because it holds the password.

### Step 6: Create the gateway { #step-6 }

1. Create an `openshift-gateway.yaml` file with an `APIGateway` that uses the ConfigMap:

    ```yaml
    apiVersion: gateway.api-platform.wso2.com/v1
    kind: APIGateway
    metadata:
      name: openshift-gateway
      namespace: <PROJECT-NAME>
    spec:
      apiSelector:
        scope: Namespaced
        namespaces:
          - <PROJECT-NAME>
      configRef:
        name: openshift-gateway-values
    ```

    With `scope: Namespaced`, list the namespaces explicitly. To select APIs from every namespace, use `scope: Cluster`. To select APIs by label, use `scope: LabelSelector` with `matchLabels`.

2. Apply the `APIGateway`:

    ```bash
    oc apply -f openshift-gateway.yaml
    ```

3. Wait for the gateway to be programmed:

    ```bash
    oc get apigateway openshift-gateway -n <PROJECT-NAME> \
      -o jsonpath='{range .status.conditions[*]}{.type}={.status}{"\n"}{end}'
    ```

    Both `Accepted` and `Programmed` must be `True`.

4. Confirm that the gateway's controller and runtime pods show `1/1 Running`:

    ```bash
    oc get pods -n <PROJECT-NAME>
    ```

### Step 7: Create a Route for API traffic { #step-7 }

The gateway chart doesn't create Routes for API traffic. The hostnames that a gateway serves depend on the virtual hosts configured on the gateway and in each API definition, as described in [Routing API traffic](openshift-standalone.md#routing-api-traffic). With the default configuration, the gateway's main virtual host accepts any hostname, so one Route with a generated hostname serves every API that doesn't set its own virtual hosts.

1. Find the gateway's runtime Service. The operator installs each gateway as the Helm release `<APIGATEWAY-NAME>-gw`:

    ```bash
    oc get svc -n <PROJECT-NAME> \
      -l app.kubernetes.io/instance=<APIGATEWAY-NAME>-gw,app.kubernetes.io/component=gateway-runtime
    ```

    In this guide, the Service is `openshift-gateway-gw-gateway-runtime`.

2. Create a Route to the Service:

    ```bash
    oc create route passthrough openshift-gateway \
      --service=openshift-gateway-gw-gateway-runtime \
      --port=https \
      -n <PROJECT-NAME>
    ```

    OpenShift generates the hostname `openshift-gateway-<PROJECT-NAME>.<APPS_DOMAIN>`.

To reach the sandbox environment of an API, serve APIs on their own hostnames, or use another TLS termination type, create more Routes as described in [Routing API traffic](openshift-standalone.md#routing-api-traffic). Pass this gateway's Service in `--service`.

### Step 8: Deploy and invoke an API { #step-8 }

1. Create a `sample-api.yaml` file with a `RestApi` in the gateway's selected namespace:

    ```yaml
    apiVersion: gateway.api-platform.wso2.com/v1
    kind: RestApi
    metadata:
      name: sample-api
      namespace: <PROJECT-NAME>
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
    ```

2. Apply the `RestApi`:

    ```bash
    oc apply -f sample-api.yaml
    ```

3. Wait until the API is programmed:

    ```bash
    oc get restapi sample-api -n <PROJECT-NAME> \
      -o jsonpath='{range .status.conditions[*]}{.type}={.status}{"\n"}{end}'
    ```

4. Invoke the API through the Route:

    ```bash
    GATEWAY_HOST=$(oc get route openshift-gateway -n <PROJECT-NAME> -o jsonpath='{.spec.host}')
    curl -k "https://$GATEWAY_HOST/sample/v1.0/info"
    ```

    The response is the upstream's echo of the request, with `"url": "https://httpbin.org/anything/info"`.

## Advanced configuration

### Operator security context { #operator-security-context }

The operator chart exposes the pod and container security contexts as free-form values. It renders them exactly as you provide them, the same as on standard Kubernetes, and `openshift.enabled` doesn't change them:

- `podSecurityContext`
- `securityContext`

The following table describes the properties that matter on OpenShift:

| Property | Description |
|---|---|
| `runAsNonRoot` | Rejects the pod if it would run as root. |
| `runAsUser` | The UID that the operator runs as. `restricted-v2` assigns one from the project's range and rejects any other value (see [Troubleshooting](#scc-rejected)). SCCs such as `anyuid` and `nonroot-v2` run the UID that the pod requests. |
| `runAsGroup`, `fsGroup`, `supplementalGroups` | The operator needs none of them. `restricted-v2` accepts only values within the project's ranges. |
| `seccompProfile` | Required by `restricted-v2`, `nonroot-v2`, and the `restricted` Pod Security Standard. Not allowed by `anyuid`. |
| `allowPrivilegeEscalation` | The operator never needs to escalate privileges. |
| `capabilities` | The operator needs no Linux capabilities, so all of them can be dropped. |
| `readOnlyRootFilesystem` | The operator writes only to its `/tmp` volume, so the root filesystem can be read-only. |

The values that OpenShift admits depend on the SCC that the operator runs under. For the strategies that each SCC applies to these properties, see [Managing security context constraints](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/authentication_and_authorization/managing-pod-security-policies) in the OpenShift documentation.

The following samples show values for common SCCs. The chart's defaults already set every property except the UID, which you adjust to the SCC.

=== "restricted-v2 (default)"

    Sample values. Setting `runAsUser` to `null` removes the chart's default UID `10001`, so OpenShift assigns one from the project's range.

    ```yaml
    podSecurityContext:
      runAsNonRoot: true
      seccompProfile:
        type: RuntimeDefault
    securityContext:
      runAsUser: null
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]
      readOnlyRootFilesystem: true
    ```

=== "Other SCCs (anyuid, nonroot-v2)"

    Sample values, with the chart's default UID `10001`. `anyuid` doesn't allow any seccomp profile, so set `seccompProfile` to `null` under it.

    ```yaml
    podSecurityContext:
      runAsNonRoot: true
      seccompProfile:          # null under anyuid
        type: RuntimeDefault
    securityContext:
      runAsUser: 10001
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]
      readOnlyRootFilesystem: true
    ```

The pre-delete cleanup Job removes finalizers when you uninstall the operator, and has its own security contexts. They're empty by default, which works on OpenShift. To harden them explicitly, set the following values:

```yaml
cleanupJob:
  podSecurityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  securityContext:
    allowPrivilegeEscalation: false
    capabilities:
      drop: ["ALL"]
```

!!! warning "Debug mode"
    With `debug.enabled: true`, the operator runs under the Delve debugger, which needs root and the `SYS_PTRACE` capability. The chart ignores the security context values in this mode, and the pod can't run under the `restricted-v2` SCC. Use debug mode only on development clusters where a privileged SCC is acceptable.

### Gateway API CRDs { #gateway-api-crds }

The operator supports the Kubernetes Gateway API (`Gateway` and `HTTPRoute`) in addition to its own `APIGateway` and `RestApi` resources. It uses the `GatewayClass`, `Gateway`, `HTTPRoute`, and `ReferenceGrant` CRDs, which OpenShift 4.19 and later provides.

With `gatewayApi.installStandardCRDs: true`, the chart installs each CRD from its bundled Gateway API release only when the CRD doesn't exist, or when the CRD belongs to this release. On OpenShift, the Ingress Operator protects every `*.gateway.networking.k8s.io` CRD with an admission policy. The policy rejects even the CRDs that OpenShift doesn't ship:

```
customresourcedefinitions.apiextensions.k8s.io "backendtlspolicies.gateway.networking.k8s.io" is forbidden:
ValidatingAdmissionPolicy 'openshift-ingress-operator-gatewayapi-crd-admission' ... denied request:
Gateway API Custom Resource Definitions are managed by the Ingress Operator and may not be modified
```

Always set `gatewayApi.installStandardCRDs: false` on OpenShift 4.19 and later.

### Gateway settings through `configRef` { #gateway-settings }

You configure every gateway-level setting in the ConfigMap that the `APIGateway`'s `spec.configRef` references, using the gateway Helm chart's values. The following settings from the standalone guide apply unchanged:

| Topic | Standalone guide section |
|---|---|
| Gateway security contexts | [Security context](openshift-standalone.md#security-context) |
| OpenShift Routes | [Routing API traffic](openshift-standalone.md#routing-api-traffic) and [Step 7](#step-7) |
| Controller storage and StorageClass | [Storage](openshift-standalone.md#storage) |
| Read-only root filesystem | [Read-only root filesystem](openshift-standalone.md#read-only-root-filesystem) |
| Custom gateway runtime image | [Review the gateway runtime image](openshift-standalone.md#step-4) |

To apply the same settings to every gateway without a ConfigMap per gateway, put them in the operator chart's `gateway.values` instead. The operator uses those values as the base for every gateway that it creates, and a gateway's ConfigMap overrides them (see [Step 5](#step-5)).

## Troubleshooting

This section covers issues specific to the operator. The gateways that the operator creates run the same gateway chart as a standalone deployment. For gateway-level issues, see [Troubleshooting](openshift-standalone.md#troubleshooting) in the standalone guide, which covers runtime socket errors, security context errors on the gateway pods, pending storage, a missing TLS Secret, and Routes. Apply those fixes through the gateway's ConfigMap, or through the operator's `gateway.values` for every gateway.

### Operator pod isn't created: "unable to validate against any security context constraint" { #scc-rejected }

**Symptom:** The operator Deployment shows `0/1` ready and no pod exists. The ReplicaSet events contain an error such as one of the following:

```
[... provider restricted-v2: .containers[0].runAsUser: Invalid value: 10001: must be in the ranges: [1000650000, 1000659999] ...]
[... provider anyuid: .spec.securityContext.seccompProfile.type: Forbidden: seccomp may not be set ...]
```

**Cause:** The security context requests something that the SCC doesn't allow: the chart's default UID `10001`, which is outside the project's range under `restricted-v2`, or a seccomp profile under `anyuid`.

**Fix:** Use the values for your SCC from [Operator security context](#operator-security-context), and upgrade the release:

```bash
helm upgrade gateway-operator oci://ghcr.io/wso2/api-platform/helm-charts/gateway-operator \
  --version <CHART_VERSION> \
  --namespace <PROJECT-NAME> \
  -f operator-values.yaml
```

To inspect the events, run:

```bash
oc get events -n <PROJECT-NAME> --field-selector reason=FailedCreate
```

### Operator install fails with a Gateway API CRD error

**Symptom:** `helm install` fails with one of the following errors:

```
CustomResourceDefinition "gatewayclasses.gateway.networking.k8s.io" in namespace "" exists and cannot be imported into the current release
```

```
... denied request: Gateway API Custom Resource Definitions are managed by the Ingress Operator and may not be modified
```

**Fix:** Install with `gatewayApi.installStandardCRDs: false`. See [Gateway API CRDs](#gateway-api-crds).

### Operator logs "no matches for kind" for its own resources

**Symptom:** The operator logs errors such as:

```
failed to get restmapping: no matches for kind "APIGateway" in version "gateway.api-platform.wso2.com/v1"
```

**Cause:** The cluster has CRDs from an earlier operator version. Helm installs a chart's CRDs on the first install only, and never upgrades them.

**Fix:** Apply the CRDs that ship with the chart before you upgrade the operator:

```bash
helm pull oci://ghcr.io/wso2/api-platform/helm-charts/gateway-operator --version <CHART_VERSION> --untar
oc apply --server-side -f gateway-operator/crds/
```

If OpenShift can't update a CRD because a stored version was removed, and no resources of that kind exist, delete the CRD and apply it again.

### Gateway install fails: "routes.route.openshift.io is forbidden"

**Symptom:** The `APIGateway`'s `Programmed` condition is `False` with the reason `DeploymentFailed`. Its message contains an error such as the following. The verb is `create` instead of `get` when the Route doesn't exist yet.

```
routes.route.openshift.io "<APIGATEWAY-NAME>-gw-management-api" is forbidden: User "system:serviceaccount:<PROJECT-NAME>:controller-manager" cannot get resource "routes" in API group "route.openshift.io"
```

**Cause:** The gateway values turn on the management API Route, through `openshift.enabled: true` and `openshift.routes.managementApi.enabled: true` in `gateway.values` or in a gateway's ConfigMap. However, you installed the operator without OpenShift support, so the operator isn't allowed to manage Routes.

**Fix:**

1. Set `openshift.enabled: true` or `auto` in `operator-values.yaml`, and upgrade the operator with it:

    ```bash
    helm upgrade gateway-operator oci://ghcr.io/wso2/api-platform/helm-charts/gateway-operator \
      --version <CHART_VERSION> \
      --namespace <PROJECT-NAME> \
      -f operator-values.yaml
    ```

2. If the message starts with `Max retries (10) exceeded`, the operator has stopped retrying that gateway. Change any value in the gateway's ConfigMap to make the operator try again.
3. If you deleted and recreated the `APIGateway` instead, APIs deployed to the previous gateway return `404` on the recreated one. Delete and recreate those API resources.

### `RestApi` deployment fails with "status 401" { #restapi-401 }

**Symptom:** The `RestApi`'s `Programmed` condition is `False` with the reason `DeploymentFailed` and a message such as `existence check returned status 401: {"code":"authentication_failed","message":"authentication failed"}`. The operator logs it as a non-retryable deployment error.

**Cause:** The operator can't sign in to the gateway's management API. The first user in the gateway's ConfigMap has a hashed password, or the ConfigMap doesn't set `enabled: true` for basic authentication.

**Fix:** Set the first user with `enabled: true` and a plain-text password in the gateway's ConfigMap, as described in [Step 5](#step-5). Then change the `RestApi` so that the operator deploys it again, for example by deleting and reapplying it.

### `RestApi` reports "No matching gateway available"

**Symptom:** The `RestApi`'s `Programmed` condition is `False` with the reason `GatewayNotReady` and the message `No matching gateway available`.

**Fix:**

1. Confirm that the `APIGateway` is `Programmed=True`.
2. Confirm that its `apiSelector` selects the API. With `scope: Namespaced`, list the API's namespace under `apiSelector.namespaces` explicitly. With `scope: LabelSelector`, the API must carry every label in `matchLabels`.

## Next steps

- [Deploy on OpenShift in standalone mode](openshift-standalone.md)
- [Management CRDs](../kubernetes/gateway-operator-management-crds.md)
- [Security hardening](../../production-deployment/security-hardening.md)