---
title: "Deploy & Verify"
description: "Install the API Portal & MCP Hub on Kubernetes or virtual machines, confirm instances came up healthy and share sessions, and follow a safe upgrade procedure."
canonical_url: https://wso2.com/api-platform/docs/api-portal/deployment/deploy-and-verify/
md_url: https://wso2.com/api-platform/docs/api-portal/deployment/deploy-and-verify.md
tags:
  - cloud
  - api-portal
  - deployment
  - kubernetes
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Deploy & Verify

Work through [Security Hardening](security-hardening.md), [Database Configuration](database-configuration.md), and [Resources & Scaling](resources-and-scaling.md) first — the schema applied, the secrets provisioned, and the configuration assembled. This page installs the result and confirms it.

## Provision the secrets

=== "Kubernetes"

    The chart refuses to render without them, so this comes first:

    ```bash
    ./generate-secrets.sh api-portal my-release   # <namespace> [release-name]
    ```

    It writes `values-secrets.yaml`, naming each Secret it created along with the `has*` flags for whichever optional keys it provisioned. Keep that file alongside your own values and pass both at install time.

=== "Virtual machine"

    Run the setup script once, on the **first** VM only:

    ```bash
    ./scripts/setup.sh
    ```

    It provisions the TLS pair under `resources/certificates/` and the portal's encryption key and session secret under `resources/keys/`, and writes `.env` and `api-platform.env`.

    Then copy the generated material to every other VM before starting them, so all instances share it:

    ```bash
    rsync -a resources/keys/ resources/certificates/ <other-vm>:<install-dir>/resources/
    ```

    Do **not** run `setup.sh` independently on each VM — it would generate a different key and session secret per host, which is the failure described in [Security Hardening](security-hardening.md#secrets).

## Deploy

=== "Kubernetes"

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

=== "Virtual machine"

    On each VM, from the distribution directory:

    ```bash
    docker compose up -d
    ```

    `COMPOSE_PROFILES` in `.env` decides what starts. For a standalone portal against an external database, that is `api-portal` alone.

    Check the configuration was read as you intended before putting the VM into the load balancer pool — the startup log reports the resolved database driver and the authorization mode:

    ```bash
    docker compose logs api-portal | head -40
    ```

## Verify

Confirm every instance is serving, not just that the deploy command succeeded.

=== "Kubernetes"

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
    kubectl -n api-portal exec deploy/my-release-api-portal-ui -- \
      curl -sk https://localhost:9543/health
    ```

=== "Virtual machine"

    On each VM:

    ```bash
    docker compose ps
    curl -sk https://localhost:9543/health
    ```

    Then confirm the load balancer sees every instance as healthy, and that its health check is pointed at `/health` rather than `/`.

Then verify the two things a single-instance smoke test cannot catch, on either substrate:

**Sessions are shared.** Log in through the load balancer or ingress, then stop the instance that served the login. The next request should land on another instance with the session intact. If you are logged out instead, the instances are not reading the same session table — check that every instance points at the same external database and resolves the same encryption key and session secret.

**Only one instance dispatches each event.** Trigger a credential change and confirm the registered subscriber receives exactly one delivery, not one per instance. See [Control Plane Connection](control-plane-connection.md#in-a-replicated-deployment).

## Upgrade

=== "Kubernetes"

    ```bash
    helm dependency update ./api-portal-helm-chart
    helm diff upgrade my-release ./api-portal-helm-chart \
      -f values-secrets.yaml -f values-production.yaml    # requires the helm-diff plugin
    helm upgrade my-release ./api-portal-helm-chart \
      -f values-secrets.yaml -f values-production.yaml
    ```

    **Always pass the secrets values file.** Omitting it on an upgrade fails the render rather than silently dropping the Secret reference — intended behavior, but it does mean an upgrade command is no shorter than an install command.

    Roll back a bad release with `helm rollback my-release`.

=== "Virtual machine"

    Upgrade one VM at a time so the others keep serving:

    1. Remove the VM from the load balancer pool.
    2. Update the image tag in `docker-compose.yaml`, then `docker compose up -d` to recreate the container.
    3. Confirm `https://localhost:9543/health` responds, and check the startup log.
    4. Return it to the pool, then move to the next VM.

    Re-running `setup.sh` is safe — it fills in only what is missing and never overwrites an existing value — so an upgrade won't rotate the encryption key out from under stored credentials.

    Roll back by putting the previous image tag back and recreating the container.

Two things hold on both substrates:

- **Old and new instances overlap during a rolling upgrade**, so peak database connections briefly exceed `instances × max_open_conns`. Leave headroom for it.
- **A rollback reverts configuration, not database schema changes.** Check the release notes before upgrading across a version that migrates the schema.

## Related

- [Security Hardening](security-hardening.md): what the secrets provisioning covers
- [Resources & Scaling](resources-and-scaling.md): the instance count and health checks installed here
- [Control Plane Connection](control-plane-connection.md): the post-install webhook registration