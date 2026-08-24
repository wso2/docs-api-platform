---
title: "Deploy Choreo Connect on Kubernetes with API Manager"
description: "Deploy an API to Choreo Connect on Kubernetes using WSO2 API Manager as the control plane with YAML artifacts."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/getting-started/deploy/cc-on-kubernetes-with-apim-as-control-plane/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/getting-started/deploy/cc-on-kubernetes-with-apim-as-control-plane.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "tutorial"
---

# Deploying Choreo Connect on Kubernetes With WSO2 API Manager as a Control Plane

Let's deploy an API on Choreo Connect, which running on Kubernetes, with WSO2 API Manager as the Control Plane.

!!! info "Before you begin"

    1.  Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
    2.  Set up a [Kubernetes](https://Kubernetes.io/docs/setup/) cluster v1.20 or above.
        - Minimum CPU : 4vCPU
        - Minimum Memory : 3GB
    3.  Deploy an ingress controller - [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/) for this sample.

--8<-- "api-manager/4.1.0/includes/deploy/k8s-setup-note.md"

## Step 1 - Setup Choreo Connect in Kubernetes

1.  Download and extract the Choreo Connect distribution .zip

    The latest Choreo Connect distribution can be downloaded from [https://wso2.com/choreo/choreo-connect/](https://wso2.com/choreo/choreo-connect/). Extract the Choreo Connect distribution .zip file. The extracted folder will be called as `CHOREO-CONNECT_HOME` hereafter.

2.  Add the Kubernetes configurations for Choreo Connect and API Manager using the kubectl tool.

    --8<-- "api-manager/4.1.0/includes/deploy/cc-tryout-in-arm64-k8s-note.md"

    ```bash
    kubectl apply -f <CHOREO-CONNECT_HOME>/k8s-artifacts/choreo-connect-with-apim/apim
    ```
    
    Apply the Kubernetes configurations for Choreo Connect after starting the API Manager instance.
    ```bash
    kubectl apply -f <CHOREO-CONNECT_HOME>/k8s-artifacts/choreo-connect-with-apim/choreo-connect
    ```
    
3.  Add the host entry to the `/etc/hosts` file. 
    
    Add the following entry to `/etc/hosts` file in order to access the Choreo Connect Router, API Manager publisher and Developer Portal.

    ```sh
    <ingress_address>    gw.wso2.com    apim.wso2.com
    ```

### Step 2 - Update the JWKS Endpoint

The JWKS endpoint of the API Manager has the external facing hostname by default, and it is not always routable via Choreo Connect Enforcer. As a result, you can alter the JWKS endpoint in the API Manager to use the API Manager's internal service name in Kubernetes.

1. Log into Admin portal - `https://apim.wso2.com/admin/`
2. Navigate to `Key Managers` section and select the `Resident Key Manager`.
3. Change the JWKS URL in the `Certificates` section to `https://wso2apim:9443/oauth2/jwks`.

## Step 3 - Deploy Sample API from API Manager

- Publisher Portal:  `https://apim.wso2.com/publisher/`
- Developer Portal:  `https://apim.wso2.com/devportal/`

Follow the instructions in [create and publish an API from API Manager](../quick-start-guide-docker-with-apim.md#step-3-create-and-publish-an-api-via-api-manager) using the above URLs to access each of the portals.
