---
title: "Deploy and Verify"
description: "Install the API Platform AI Gateway Helm chart, confirm the controller and runtime are healthy, route a live LLM request, and run upgrades and rollbacks."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/deploy-and-verify/
md_url: https://wso2.com/api-platform/docs/ai-gateway/deployment/production-deployment/deploy-and-verify.md
tags:
  - ai-gateway
  - production
  - helm
  - kubernetes
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-09
content_type: "how-to"
---

# Deploy and verify

## Check the configuration before installing

Render the chart without installing it. This catches the fail-closed encryption check and any malformed values before anything reaches the cluster:

```bash
helm template ai-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version 1.2.0 \
  --namespace ai-gateway \
  --values ./values.yaml > /dev/null
```

A failure mentioning encryption keys means `gateway.controller.encryptionKeys` isn't set. Go back to [Security hardening](./security-hardening.md#encryption-keys).

## Deploy the chart

=== "OCI registry (recommended)"

    ```bash
    helm install ai-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
      --version 1.2.0 \
      --namespace ai-gateway \
      --create-namespace \
      --values ./values.yaml \
      --wait \
      --timeout 5m
    ```

=== "Local chart (testing only)"

    ```bash
    helm install ai-gateway ./kubernetes/helm/gateway-helm-chart \
      --namespace ai-gateway \
      --create-namespace \
      --values ./values.yaml \
      --wait \
      --timeout 5m
    ```

Chart version `1.2.0` pairs with AI Gateway 1.2.0. Keep the chart major version aligned with the image tags you pinned in the [overview](./overview.md#pin-the-image-versions).

## Verify the deployment

Check that every pod is running and every expected replica is ready:

```bash
kubectl get pods -n ai-gateway
kubectl get svc -n ai-gateway
```

Check the controller's health endpoint. The admin server listens on port 9092:

```bash
kubectl exec -n ai-gateway deploy/ai-gateway-controller -- \
  wget -qO- http://localhost:9092/api/admin/v1/health
```

Confirm the runtime is ready to accept traffic. The router serves its readiness route on the HTTPS listener:

```bash
kubectl exec -n ai-gateway deploy/ai-gateway-gateway-runtime -- \
  wget -qO- --no-check-certificate https://localhost:8443/_gateway-health/ready
```

!!! note
    Resource names are prefixed with the Helm release name. These commands assume a release named `ai-gateway`. Run `kubectl get deploy -n ai-gateway` to confirm the names in your install.

## Verify with real AI traffic

A healthy pod isn't proof that LLM traffic works. Deploy one provider and one proxy, then call them.

Port-forward the management API and deploy an LLM provider. Replace `<openai-apikey>` with your key:

```bash
kubectl port-forward -n ai-gateway svc/ai-gateway-controller 9090:9090 &

curl -X POST http://localhost:9090/api/management/v1/llm-providers \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProvider
metadata:
  name: openai-provider
spec:
  displayName: OpenAI Provider
  version: v1.0
  template: openai
  context: /openai/latest
  upstream:
    url: https://api.openai.com/v1
    auth:
      type: api-key
      header: Authorization
      value: <openai-apikey>
  accessControl:
    mode: deny_all
    exceptions:
      - path: /chat/completions
        methods: [POST]
EOF
```

Deploy a proxy that consumes it:

```bash
curl -X POST http://localhost:9090/api/management/v1/llm-proxies \
  -H "Content-Type: application/yaml" \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
  --data-binary @- <<'EOF'
apiVersion: gateway.api-platform.wso2.com/v1
kind: LlmProxy
metadata:
  name: openai-assistant
spec:
  displayName: OpenAI Assistant
  version: v1.0
  context: /assistant
  provider:
    id: openai-provider
  policies: []
EOF
```

Route a request through the runtime, using the external address your ingress serves:

```bash
curl -X POST "https://ai-gateway.example.com/assistant/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hi"}]
  }'
```

Then confirm streaming works end to end, since streaming is what exposes timeout misconfiguration between the ingress, the gateway, and the provider:

```bash
curl -N -X POST "https://ai-gateway.example.com/assistant/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "stream": true,
    "messages": [{"role": "user", "content": "Write a short paragraph about APIs."}]
  }'
```

Chunks should arrive progressively. If the response arrives in one piece at the end, a buffered policy is in the chain — see [Real-time AI streaming](../../streaming-responses.md). If it cuts off partway, revisit the timeouts in [Tune the gateway for AI traffic](./ai-workload-tuning.md#raise-the-timeouts-for-long-completions).

### Verify high availability

With more than one controller replica, confirm that an artifact deployed through one replica reaches runtimes attached to the others. Deploy a proxy, then check that every runtime pod serves it:

```bash
kubectl get pods -n ai-gateway -l app.kubernetes.io/component=gateway-runtime -o name
```

Call the proxy repeatedly through the Service and confirm consistent responses across replicas. Allow for the EventHub `poll_interval` set in [Database configuration](./database-configuration.md#tune-the-eventhub) before a newly deployed artifact appears everywhere.

## Upgrade

Review what changed between chart versions:

```bash
helm show values oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version <new-version>
```

Diff your release against the new chart. This needs the `helm-diff` plugin:

```bash
helm diff upgrade ai-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version <new-version> \
  --namespace ai-gateway \
  --values ./values.yaml
```

Upgrade:

```bash
helm upgrade ai-gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway \
  --version <new-version> \
  --namespace ai-gateway \
  --values ./values.yaml \
  --wait \
  --timeout 5m
```

Roll back if the upgrade misbehaves:

```bash
helm rollback ai-gateway --namespace ai-gateway
```

!!! note
    Controller pods restart during an upgrade. Because each runtime receives its configuration over xDS from a controller, keep at least two controller replicas and two runtime replicas so traffic continues to be served throughout. Combine this with the drain settings in [Resources and scaling](./resources-and-scaling.md#drain-in-flight-requests) to avoid cutting off streaming responses.

---

[← Tune the gateway for AI traffic](./ai-workload-tuning.md) &nbsp;|&nbsp; [Connect to AI Workspace →](./control-plane-connection.md)
