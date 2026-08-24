---
title: "Deploy and Verify the Gateway"
description: "Install API Platform Gateway using Helm, verify that pods and services are healthy, and perform upgrade and rollback procedures."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/deploy-and-verify/
md_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/deploy-and-verify.md
tags:
  - api-gateway
  - deployment
  - helm
  - production
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Deploy & Verify

## Deploy the Chart

=== "OCI Registry (Recommended)"

    ```bash
    helm install ap-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
      --version 1.1.3 \
      --namespace ap-gateway \
      --create-namespace \
      --values ./values.yaml \
      --wait \
      --timeout 5m
    ```

=== "Local Chart (Testing Only)"

    ```bash
    helm install ap-gateway ./kubernetes/helm/gateway-helm-chart \
      --namespace ap-gateway \
      --create-namespace \
      --values ./values.yaml \
      --wait \
      --timeout 5m
    ```

## Verify the Deployment

**Check all pods are running:**

```bash
kubectl get pods -n ap-gateway
```

**Check all services:**

```bash
kubectl get svc -n ap-gateway
```

**Controller health check:**

```bash
kubectl exec -n ap-gateway deploy/ap-gateway-controller -- \
  wget -qO- http://localhost:9094/api/admin/v0.9/health
```

## Upgrade Procedure

**Pull latest chart values to see what changed:**

```bash
helm show values oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version <new-version>
```

**Diff current release vs the new chart (requires the `helm-diff` plugin):**

```bash
helm diff upgrade ap-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version <new-version> \
  --namespace ap-gateway \
  --values ./values.yaml
```

**Upgrade:**

```bash
helm upgrade ap-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version <new-version> \
  --namespace ap-gateway \
  --values ./values.yaml \
  --wait \
  --timeout 5m
```

**Rollback if needed:**

```bash
helm rollback ap-gateway --namespace ap-gateway
```

!!! note
    The controller pod restarts on upgrade. Because the gateway runtime syncs policy configuration via xDS from the controller, keep `replicaCount` at `≥ 2` for the runtime so in-flight requests continue to be served during controller restarts.

---

[← Resources & Scaling](./resources-and-scaling.md) &nbsp;|&nbsp; [Control Plane Connection →](./control-plane-connection.md) *(optional)*