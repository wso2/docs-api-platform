---
title: "Deploy and Verify"
description: "Install the API Platform AI Gateway Helm chart, confirm the controller and runtime are healthy, route a live LLM request, and run upgrades and rollbacks."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/deploy-and-verify/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/deploy-and-verify.md
tags:
  - ai-gateway
  - production
  - helm
  - kubernetes
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
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

=== "Open Container Initiative (OCI) registry (recommended)"

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

Chart version `1.2.0` pairs with AI Gateway 1.2.0. Keep the chart major version aligned with the image tags you pinned in the [overview](./index.md#pin-the-image-versions).

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

A healthy pod isn't proof that large language model (LLM) traffic works. Deploy one provider and one proxy, then call them.

Port-forward the management API, then write the controller admin credentials to a `netrc` file. A password passed to `curl -u` is visible in the host's process list, and a `netrc` file only you can read keeps it out:

```bash
kubectl port-forward -n ai-gateway svc/ai-gateway-controller 9090:9090 &

install -m 600 /dev/null controller.netrc
read -rp "Controller admin username: " ADMIN_USERNAME
read -rsp "Controller admin password: " ADMIN_PASSWORD && echo
printf 'machine localhost login %s password %s\n' "$ADMIN_USERNAME" "$ADMIN_PASSWORD" > controller.netrc
unset ADMIN_PASSWORD
```

Deploy an LLM provider. Read the provider key with `read -rs`, which keeps it off the screen and out of your shell history. The here-document then expands the key into the request body. The `--fail` option makes `curl` exit with an error status if the controller rejects the request:

```bash
read -rsp "OpenAI API key: " OPENAI_API_KEY && echo

curl --fail --show-error -X POST http://localhost:9090/api/management/v1/llm-providers \
  -H "Content-Type: application/yaml" \
  --netrc-file controller.netrc \
  --data-binary @- <<EOF
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
      value: ${OPENAI_API_KEY}
  accessControl:
    mode: deny_all
    exceptions:
      - path: /chat/completions
        methods: [POST]
EOF

unset OPENAI_API_KEY
```

!!! note
    These requests authenticate with basic auth. If you configured an identity provider in [Security hardening](./security-hardening.md#authentication), basic auth is disabled. Use a token your identity provider issued instead.

    Write the token to a `curl` configuration file only you can read. A configuration file keeps the token out of the host's process list:

    ```bash
    install -m 600 /dev/null controller.curlrc
    read -rsp "Access token: " ACCESS_TOKEN && echo
    printf 'header = "Authorization: Bearer %s"\n' "$ACCESS_TOKEN" > controller.curlrc
    unset ACCESS_TOKEN
    ```

    In each request, replace `--netrc-file controller.netrc` with `--config controller.curlrc`. Run `shred -u controller.curlrc` once both artifacts are deployed. Either way, the controller receives the token in the `Authorization` header.

Deploy a proxy that consumes it:

```bash
curl --fail --show-error -X POST http://localhost:9090/api/management/v1/llm-proxies \
  -H "Content-Type: application/yaml" \
  --netrc-file controller.netrc \
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

Remove the credentials file once both artifacts are deployed:

```bash
shred -u controller.netrc
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

Chunks should arrive progressively. If the whole response arrives at once, one layer in the path is holding it until the response completes. Check these in order:

- The ingress controller or reverse proxy in front of the gateway. Response buffering there hides the stream from the client.
- A gateway policy that needs the complete body before it can run. See [Real-time AI streaming](../../streaming-responses.md).
- The provider or the model. Not every model streams every request.

If the response cuts off partway, revisit the timeouts in [Tune the gateway for AI traffic](./ai-workload-tuning.md#raise-the-timeouts-for-long-completions).

### Verify high availability

With more than one controller replica, confirm that an artifact deployed through one replica reaches runtimes attached to the others. Deploy a proxy, then call each runtime pod directly, because a Service request that succeeds proves only that one pod holds the artifact. Save the following as a script and run it, so an empty pod list or a single failing replica returns a non-zero exit status:

```bash
#!/usr/bin/env bash
set -euo pipefail

pods=$(kubectl get pods -n ai-gateway -l app.kubernetes.io/component=gateway-runtime -o name)
if [ -z "$pods" ]; then
  echo "No gateway-runtime pods found." >&2
  exit 1
fi

failed=0
for pod in $pods; do
  echo "$pod"
  kubectl exec -n ai-gateway "$pod" -- \
    wget -qO- --no-check-certificate --timeout=30 --tries=1 \
      --header 'Content-Type: application/json' \
      --post-data '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hi"}]}' \
      https://localhost:8443/assistant/chat/completions || failed=1
done

exit "$failed"
```

Every pod should answer. A pod that returns a routing error hasn't received the artifact yet. Allow for the EventHub `poll_interval` set in [Database configuration](./database-configuration.md#tune-the-eventhub) before a newly deployed artifact appears everywhere.

This check covers artifact routing only. It reaches each pod over `localhost`, a name the runtime certificate isn't issued for, so it skips certificate validation. Validate the certificate separately through the hostname it was issued for:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://ai-gateway.example.com/_gateway-health/ready
```

Then call the proxy repeatedly through the Service to confirm that load balancing spreads requests across those replicas.

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
    Controller pods restart during an upgrade. Each runtime receives its configuration over xDiscovery Service (xDS) from a controller. Keep at least two controller replicas and two runtime replicas, so traffic continues to be served throughout. Combine this with the drain settings in [Resources and scaling](./resources-and-scaling.md#drain-in-flight-requests) to avoid cutting off streaming responses.

---

[← Tune the gateway for AI traffic](./ai-workload-tuning.md) &nbsp;|&nbsp; [Connect to AI Workspace →](./control-plane-connection.md)
