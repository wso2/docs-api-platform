---
title: "Set up the Self-Hosted Gateway"
description: "Deploy the API Platform Self-Hosted Gateway in production using a virtual machine, Docker, or Kubernetes."
canonical_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/setting-up/
md_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/setting-up.md
tags:
  - cloud
  - api-gateway
  - self-hosted
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Setting Up

This guide provides detailed instructions for deploying the API Platform Self-Hosted Gateway in production environments. Choose the infrastructure option that matches your environment.

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
    curl -sLO https://github.com/wso2/api-platform/releases/download/gateway/v1.2.0/wso2apip-api-gateway-1.2.0.zip && \
    unzip wso2apip-api-gateway-1.2.0.zip
    ```

    ### Step 2: Set up the Gateway

    Navigate into the gateway folder and run the setup script. It provisions the listener TLS certificate, the AES-256 at-rest encryption key, and the `api-platform.env` file:

    ```bash
    cd wso2apip-api-gateway-1.2.0 && ./scripts/setup.sh
    ```

    ### Step 3: Configure the Gateway

    Run this command to add the control plane connection settings to `api-platform.env`:

    ```bash
    cat >> api-platform.env << 'ENVFILE'
    MOESIF_KEY=<your-moesif-key>
    APIP_GW_CONTROLLER_CONTROLPLANE_HOST=connect.bijira.dev
    APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=<your-gateway-token>
    ENVFILE
    ```

    ### Step 4: Start the Gateway

    From the gateway folder, run this command to start the gateway:

    ```bash
    docker compose up
    ```

    To run in detached mode (background):

    ```bash
    docker compose up -d
    ```

    ### Step 5: Verify the Gateway

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
    curl -sLO https://github.com/wso2/api-platform/releases/download/gateway/v1.2.0/wso2apip-api-gateway-1.2.0.zip && \
    unzip wso2apip-api-gateway-1.2.0.zip
    ```

    ### Step 2: Set up the Gateway

    Navigate into the gateway folder and run the setup script. It provisions the listener TLS certificate, the AES-256 at-rest encryption key, and the `api-platform.env` file:

    ```bash
    cd wso2apip-api-gateway-1.2.0 && ./scripts/setup.sh
    ```

    ### Step 3: Configure the Gateway

    Run this command to add the control plane connection settings to `api-platform.env`:

    ```bash
    cat >> api-platform.env << 'ENVFILE'
    MOESIF_KEY=<your-moesif-key>
    APIP_GW_CONTROLLER_CONTROLPLANE_HOST=connect.bijira.dev
    APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=<your-gateway-token>
    ENVFILE
    ```

    !!! warning "Important"
        Replace `<your-gateway-token>` with the Gateway Registration Token from the API Platform Console. This token is shown only once, so ensure you copy it before leaving the page.

    ### Step 4: Start the Gateway

    From the gateway folder, run this command to start the gateway:

    ```bash
    docker compose up
    ```

    To run in detached mode (background):

    ```bash
    docker compose up -d
    ```

    ### Step 5: Verify the Gateway

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

    Run this command to install the gateway chart with control plane configurations:

    ```bash
    helm install gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version 1.0.0 \
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
    helm upgrade gateway oci://ghcr.io/wso2/api-platform/helm-charts/gateway --version <new-version> \
      -f values.yaml
    ```

    ### Uninstalling the Gateway

    To remove the gateway from your cluster:

    ```bash
    helm uninstall gateway
    ```

## What's Next?

- [Adding and Managing Policies](manage-policies.md): Configure and enforce policies
- [Analytics](analytics.md): Monitor API traffic and performance
- [Troubleshooting](troubleshooting.md): Common issues and solutions
