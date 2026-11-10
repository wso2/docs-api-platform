---
title: "Set up the Event Gateway for production"
description: "Deploy the API Platform Event Gateway in production using a virtual machine, Docker, or Kubernetes."
canonical_url: https://wso2.com/api-platform/docs/cloud/event-gateway/setting-up/
md_url: https://wso2.com/api-platform/docs/cloud/event-gateway/setting-up.md
tags:
  - cloud
  - event-gateway
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "how-to"
---

# Setting Up

This guide provides detailed instructions for deploying the API Platform Event Gateway in production environments. Choose the infrastructure option that matches your environment.

!!! tip "Quick Start"
    If you're just getting started, see the [Getting Started](getting-started.md) guide for a quick setup.

## Setup Instructions

=== "Virtual Machine"

    ### Prerequisites

    - cURL installed
    - unzip installed
    - A Docker-compatible container runtime such as:
        - Docker Desktop (Windows / macOS)
        - Rancher Desktop (Windows / macOS)
        - Colima (macOS)
        - Docker Engine + Compose plugin (Linux)

    Ensure `docker` and `docker compose` commands are available:

    ```bash
    docker --version
    docker compose version
    ```

    ### Step 1: Download the Gateway

    Run this command in your terminal to download the gateway:

    ```bash
    curl -sLO https://github.com/wso2/api-platform/releases/download/event-gateway/v0.8.0/wso2apip-event-gateway-0.8.0.zip && \
    unzip wso2apip-event-gateway-0.8.0.zip
    ```
    ### Step 2: Configure the Gateway

    Run this command to create `wso2apip-event-gateway-0.8.0/configs/keys.env` with the required environment variables:

    ```bash
    cat > wso2apip-event-gateway-0.8.0/configs/keys.env << 'ENVFILE'
    MOESIF_KEY=<your-moesif-key>
    GATEWAY_CONTROLPLANE_HOST=connect.bijira.dev
    GATEWAY_REGISTRATION_TOKEN=<your-gateway-token>
    ENVFILE
    ```

    ### Step 3: Start the Gateway

    1. Navigate to the gateway folder:

        ```bash
        cd wso2apip-event-gateway-0.8.0
        ```

    2. Run this command to start the gateway using the `configs/keys.env` file created in Step 2:

        ```bash
        docker compose --env-file configs/keys.env up
        ```

    To run in detached mode (background):

    ```bash
    docker compose --env-file configs/keys.env up -d
    ```

    ### Step 4: Verify the Gateway

    Check that the gateway is running:

    ```bash
    docker compose ps
    ```

    ### Stopping the Gateway

    To stop the gateway:

    ```bash
    docker compose down
    ```

=== "Docker"

    ### Prerequisites

    - cURL installed
    - unzip installed
    - Docker Compose installed

    ### Step 1: Download the Gateway

    Run this command in your terminal to download the gateway:

    ```bash
    curl -sLO https://github.com/wso2/api-platform/releases/download/event-gateway/v0.8.0/wso2apip-event-gateway-0.8.0.zip && \
    unzip wso2apip-event-gateway-0.8.0.zip
    ```

    ### Step 2: Configure the Gateway

    Run this command to create `wso2apip-event-gateway-0.8.0/configs/keys.env` with the required environment variables:

    ```bash
    cat > wso2apip-event-gateway-0.8.0/configs/keys.env << 'ENVFILE'
    MOESIF_KEY=<your-moesif-key>
    GATEWAY_CONTROLPLANE_HOST=connect.bijira.dev
    GATEWAY_REGISTRATION_TOKEN=<your-gateway-token>
    ENVFILE
    ```

    !!! warning "Important"
        Replace `<your-gateway-token>` with the Gateway Registration Token from the API Platform Console. This token is shown only once, so ensure you copy it before leaving the page.

    ### Step 3: Start the Gateway

    1. Navigate to the gateway folder:

        ```bash
        cd wso2apip-event-gateway-0.8.0
        ```

    2. Run this command to start the gateway using the `configs/keys.env` file created in Step 2:

        ```bash
        docker compose --env-file configs/keys.env up
        ```

    To run in detached mode (background):

    ```bash
    docker compose --env-file configs/keys.env up -d
    ```

    ### Step 4: Verify the Gateway

    Check that the gateway is running:

    ```bash
    docker compose ps
    ```

    ### Stopping the Gateway

    To stop the gateway:

    ```bash
    docker compose down
    ```

=== "Kubernetes"

    ### Prerequisites

    - cURL installed
    - Kubernetes 1.32+ cluster
    - Helm 3.18+ installed
    - Either permissions to install cert-manager in the cluster or an existing cert-manager installation
    - Kafka as a Managed Service

    ### Install cert-manager (optional)

    If cert-manager is not already installed, run these commands before installing the gateway chart:

    ```bash
    helm repo add jetstack https://charts.jetstack.io --force-update
    helm repo update

    helm install cert-manager jetstack/cert-manager \
      --namespace cert-manager \
      --create-namespace \
      --set crds.enabled=true
    ```

    ### Installing the Chart

    Run this command to install the event gateway chart with control plane configurations:

    ```bash
    helm install event-gateway oci://ghcr.io/wso2/api-platform/helm-charts/event-gateway --version 1.0.0 \
      --set gateway.controller.controlPlane.host="connect.bijira.dev" \
      --set gateway.controller.controlPlane.port=443 \
      --set gateway.controller.controlPlane.token.value="your-gateway-token" \
      --set gateway.config.analytics.publishers.moesif.application_id="your-moesif-key" \
      --set gateway.config.analytics.enabled=true
    ```

    !!! warning "Important"
        Replace `your-gateway-token` with the Gateway Registration Token from the API Platform Console. This token is shown only once, so ensure you copy it before leaving the page.

    ### Verifying the Installation

    Check that the gateway pods are running:

    ```bash
    kubectl get pods
    ```

    ### Upgrading the Gateway

    To upgrade to a new version:

    ```bash
    helm upgrade event-gateway oci://ghcr.io/wso2/api-platform/helm-charts/event-gateway --version <new-version> \
      -f values.yaml
    ```

    ### Uninstalling the Gateway

    To remove the gateway from your cluster:

    ```bash
    helm uninstall event-gateway
    ```

## What's Next?

- [Troubleshooting](troubleshooting.md): Common issues and solutions