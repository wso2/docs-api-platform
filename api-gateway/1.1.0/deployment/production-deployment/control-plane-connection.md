---
title: "Control Plane Connection"
description: "Connect API Platform Gateway to a WSO2 APIM or API Platform Cloud control plane for top-down or bottom-up API synchronization."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/control-plane-connection/
md_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/control-plane-connection.md
tags:
  - api-gateway
  - deployment
  - control-plane
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-11
content_type: "how-to"
---

# Control Plane Connection

!!! note
    This step is optional. Configure it only if the gateway needs to sync API artifacts from the [WSO2 APIM control plane](https://apim.docs.wso2.com/en/latest/api-gateway/platform-gateway/getting-started/) or [API Platform Cloud control plane](https://wso2.com/api-platform/docs/cloud/api-platform-gateway/getting-started/).

The WSO2 API Platform gateway supports two fundamentally different deployment approaches, distinguished by the direction of API flow.

=== "Top-Down (Control Plane → Gateway)"

    In this model, the platform control plane pushes APIs to the gateway via a persistent WebSocket connection. Use this approach when APIs are managed centrally and distributed to one or more gateway instances.

    **Create a secret for the registration token:**

    The registration token is generated when you register the gateway with your control plane. Refer to the setup guide for your control plane to obtain it:

    - [WSO2 APIM control plane](https://apim.docs.wso2.com/en/latest/api-gateway/platform-gateway/getting-started/)
    - [API Platform Cloud control plane](https://wso2.com/api-platform/docs/cloud/api-platform-gateway/getting-started/)

    ```bash
    kubectl create secret generic gateway-cp-token \
      --namespace <your-namespace> \
      --from-literal=token='your-registration-token'
    ```

    **Configure the chart:**

    ```yaml
     gateway:
      config:
        controller:
          gateway_name: "prod-gateway"
          server:
            gateway_id: "prod-gateway"
          controlplane:
            insecure_skip_verify: true
            reconnect_initial: 1s
            reconnect_max: 5m
            polling_interval: 15m
            sync_batch_size: 50
            gateway_name: "prod-gateway" # must match the gateway name registered in the controlplane
      controller:
        controlPlane:
          host: "apim-wso2am.example.com:9443"
          token:
            secretName: "gateway-cp-token"
            key: token
    ```

=== "Bottom-Up (Gateway → On-Prem APIM)"

    In this model, REST APIs deployed directly to the gateway are automatically synced back to an on-premises WSO2 APIM instance. A control plane WebSocket connection is also required alongside the bottom-up sync. API key events, subscription changes, and other lifecycle events are initiated from the control plane devportal and must reach the gateway over this channel.

    !!! note
        Bottom-up sync is only supported with APIM 4.7.x. Cloud control plane does not support this flow.

    **Step 1: Create a secret for the registration token**

    The registration token is generated when you register the gateway with your control plane. Refer to the [WSO2 APIM control plane setup guide](https://apim.docs.wso2.com/en/latest/api-gateway/platform-gateway/getting-started/) to obtain it.

    ```bash
    kubectl create secret generic gateway-cp-token \
      --namespace <your-namespace> \
      --from-literal=token='your-registration-token'
    ```

    **Step 2: Generate OAuth2 client credentials**

    Register a DCR client against your APIM instance to obtain the client ID and secret:

    ```bash
    curl -k -X POST https://<APIM_HOST>/client-registration/v0.17/register \
      -H "Content-Type: application/json" \
      -u admin:admin \
      -d '{
        "clientName": "gateway-controller",
        "owner": "admin",
        "grantType": "client_credentials password refresh_token",
        "saasApp": true
      }'
    ```

    The response contains `clientId` and `clientSecret`. Use these in the next step.

    **Step 3: Store the OAuth2 credentials in a Kubernetes secret**

    Never place OAuth2 credentials directly in Helm values. Create a secret and inject it via `extraEnvFrom` instead.

    Create `apim-oauth-secret.yaml`:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: apim-oauth-client-secret-secret
      namespace: ap-gateway  # adjust to match your deployment namespace
    type: Opaque
    stringData:
      APIP_GW_CONTROLLER_CONTROLPLANE_APIM__OAUTH2__CLIENT__ID: "your-client-id"
      APIP_GW_CONTROLLER_CONTROLPLANE_APIM__OAUTH2__CLIENT__SECRET: "your-client-secret"
    ```

    Apply it:

    ```bash
    kubectl apply -f apim-oauth-secret.yaml
    ```

    **Step 4: Configure the chart**

    Reference both secrets and configure the control plane connection alongside the bottom-up sync settings:

    ```yaml
    gateway:
      config:
        controller:
          gateway_name: "prod-gateway"
          server:
            gateway_id: "prod-gateway"
          controlplane:
            insecure_skip_verify: true
            reconnect_initial: 1s
            reconnect_max: 5m
            polling_interval: 15m
            sync_batch_size: 50
            gateway_name: "prod-gateway" # must match the gateway name registered in the controlplane
            # apim_oauth2_client_id and apim_oauth2_client_secret are injected via
            # the apim-oauth-client-secret-secret Kubernetes Secret (see extraEnvFrom below).
            # Expected env var names: APIP_GW_CONTROLLER__CONTROLPLANE__APIM_OAUTH2__CLIENT_ID
            #                         APIP_GW_CONTROLLER__CONTROLPLANE__APIM_OAUTH2__CLIENT_SECRET
      controller:
        controlPlane:
          host: "apim-wso2am.example.com:9443"
          token:
            secretName: "gateway-cp-token"         # created in Step 1
            key: token
        deployment:
          extraEnvFrom:
            - secretRef:
                name: apim-oauth-client-secret-secret
    ```

    !!! tip
        If your organization uses the Resource Owner Password Credentials (ROPC) flow instead of client credentials, store `APIP_GW_CONTROLLER__CONTROLPLANE__APIM_OAUTH2__USERNAME` and `APIP_GW_CONTROLLER__CONTROLPLANE__APIM_OAUTH2__PASSWORD` in the secret using the same `extraEnvFrom` pattern.

---

[← Deploy & Verify](./deploy-and-verify.md) &nbsp;|&nbsp; [Production Deployment Overview](../high-availability-production-deployment.md)