---
title: "Install the gateway"
description: "Install and start the AI Gateway on your machine, a virtual machine, Docker, or Kubernetes, with the full Docker Compose procedure."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/install-the-gateway/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/install-the-gateway.md
tags:
  - ai-gateway
  - installation
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Install the gateway

You can run the AI Gateway on your own machine, on a virtual machine, in Docker, or on Kubernetes. The first three share one installation procedure — download the distribution, run the setup script, and start the containers with Docker Compose — and this page carries that procedure in full. Kubernetes uses a Helm chart instead.

This page installs a gateway and starts it, and nothing else. For a walkthrough that also deploys an LLM provider and an LLM proxy and routes a request through them, see the [quick start guide](../quick-start-guide.md).

The commands below use version `1.2.0`. Substitute the API Platform AI Gateway release version you want to run in the download URL, the archive name, and the directory name. The PowerShell commands require PowerShell 7.3 or later.

## Install and start the gateway

Select the context you're installing in, then follow the steps in that tab.

=== "Local machine"

    Install on your own machine to evaluate the gateway or develop against it.

    **Prerequisites:** a Docker-compatible container runtime with the Compose plugin, such as [Docker Desktop](https://docs.docker.com/desktop/), [Podman](https://podman.io/docs/installation), [Rancher Desktop](https://rancherdesktop.io/), [Colima](https://github.com/abiosoft/colima), or [Docker Engine](https://docs.docker.com/engine/install/) with the [Compose plugin](https://docs.docker.com/compose/install/linux/).

    **Step 1: Download the distribution**

    ```bash
    # Download distribution.
    curl -fL -o wso2apip-ai-gateway-1.2.0.zip https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip

    # Unzip the downloaded distribution.
    unzip wso2apip-ai-gateway-1.2.0.zip

    cd wso2apip-ai-gateway-1.2.0/
    ```

    On Windows, download and unpack the distribution with PowerShell:

    ```powershell
    Invoke-WebRequest -Uri https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip -OutFile wso2apip-ai-gateway-1.2.0.zip

    Expand-Archive -Path wso2apip-ai-gateway-1.2.0.zip -DestinationPath .

    Set-Location wso2apip-ai-gateway-1.2.0
    ```

    **Step 2: Run the one-time setup**

    The setup script provisions the Advanced Encryption Standard (AES)-256 at-rest encryption key, the router HTTPS listener certificate, `api-platform.env`, and the gateway-controller admin credentials. It prints the admin password once — copy it.

    ```bash
    ./scripts/setup.sh
    ```

    On Windows, run the PowerShell setup script instead. It takes the same flags and provisions the same files:

    ```powershell
    pwsh -ExecutionPolicy Bypass -File .\scripts\setup.ps1
    ```

    **Step 3: Export the admin credentials**

    Management API calls authenticate with these credentials. The username defaults to `admin`; use the password the setup script just printed.

    ```bash
    export ADMIN_USERNAME=admin
    export ADMIN_PASSWORD='<the password scripts/setup.sh printed>'
    ```

    On Windows, set them as PowerShell environment variables instead:

    ```powershell
    $env:ADMIN_USERNAME='admin'
    $env:ADMIN_PASSWORD='<the password setup.ps1 printed>'
    ```

    **Step 4: Start the gateway and verify it answers**

    ```bash
    # Start the complete stack
    docker compose up

    # Verify gateway controller admin endpoint is running
    curl http://localhost:9094/api/admin/v1/health
    ```

    On Windows, the start command is the same, and the health check is `curl.exe http://localhost:9094/api/admin/v1/health`. Note the `.exe`, since `curl` is an alias for `Invoke-WebRequest` in Windows PowerShell. PowerShell 7 removes that alias, and `curl.exe` works in both versions.

    Nothing extra applies here. The gateway runs standalone, and connecting it to a control plane is optional.

=== "Virtual machine"

    Install on a VM you administer, such as an EC2 instance or a managed VM.

    **Prerequisites:** cURL, unzip, and a Docker-compatible container runtime with the Compose plugin on the host.

    **Step 1: Download the distribution**

    ```bash
    # Download distribution.
    curl -fL -o wso2apip-ai-gateway-1.2.0.zip https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip

    # Unzip the downloaded distribution.
    unzip wso2apip-ai-gateway-1.2.0.zip

    cd wso2apip-ai-gateway-1.2.0/
    ```

    On Windows, download and unpack the distribution with PowerShell:

    ```powershell
    Invoke-WebRequest -Uri https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip -OutFile wso2apip-ai-gateway-1.2.0.zip

    Expand-Archive -Path wso2apip-ai-gateway-1.2.0.zip -DestinationPath .

    Set-Location wso2apip-ai-gateway-1.2.0
    ```

    **Step 2: Run the one-time setup**

    The setup script provisions the Advanced Encryption Standard (AES)-256 at-rest encryption key, the router HTTPS listener certificate, `api-platform.env`, and the gateway-controller admin credentials. It prints the admin password once — copy it.

    ```bash
    ./scripts/setup.sh
    ```

    On Windows, run the PowerShell setup script instead. It takes the same flags and provisions the same files:

    ```powershell
    pwsh -ExecutionPolicy Bypass -File .\scripts\setup.ps1
    ```

    **Step 3: Export the admin credentials**

    Management API calls authenticate with these credentials. The username defaults to `admin`; use the password the setup script just printed.

    ```bash
    export ADMIN_USERNAME=admin
    export ADMIN_PASSWORD='<the password scripts/setup.sh printed>'
    ```

    On Windows, set them as PowerShell environment variables instead:

    ```powershell
    $env:ADMIN_USERNAME='admin'
    $env:ADMIN_PASSWORD='<the password setup.ps1 printed>'
    ```

    **Step 4: Start the gateway and verify it answers**

    ```bash
    # Start the complete stack
    docker compose up

    # Verify gateway controller admin endpoint is running
    curl http://localhost:9094/api/admin/v1/health
    ```

    On Windows, the start command is the same, and the health check is `curl.exe http://localhost:9094/api/admin/v1/health`. Note the `.exe`, since `curl` is an alias for `Invoke-WebRequest` in Windows PowerShell. PowerShell 7 removes that alias, and `curl.exe` works in both versions.

    Two things differ from a local install:

    - **Reachability.** Clients reach the gateway over the VM's network address rather than `localhost`, so open the router's listener ports on the VM and any firewall in front of it. For the ports involved, see [Default ports](../reference/default-ports.md).
    - **Control plane registration.** If the gateway reports to AI Workspace, add `APIP_GW_CONTROLLER_CONTROLPLANE_HOST` and `APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN` to `api-platform.env` before Step 4. Both default to empty, which runs the gateway standalone. See [Delivering environment values](configuration.md#delivering-environment-values) for how the file is loaded, and [Connect the gateway to AI Workspace](../ai-workspace/connect-the-gateway.md) for obtaining the token.

=== "Docker"

    Install with Docker Compose, on any host with a Docker-compatible runtime.

    **Prerequisites:** cURL and unzip. The distribution ships a Compose file, and the setup script generates the environment file it reads.

    **Step 1: Download the distribution**

    ```bash
    # Download distribution.
    curl -fL -o wso2apip-ai-gateway-1.2.0.zip https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip

    # Unzip the downloaded distribution.
    unzip wso2apip-ai-gateway-1.2.0.zip

    cd wso2apip-ai-gateway-1.2.0/
    ```

    On Windows, download and unpack the distribution with PowerShell:

    ```powershell
    Invoke-WebRequest -Uri https://github.com/wso2/api-platform/releases/download/ai-gateway/v1.2.0/wso2apip-ai-gateway-1.2.0.zip -OutFile wso2apip-ai-gateway-1.2.0.zip

    Expand-Archive -Path wso2apip-ai-gateway-1.2.0.zip -DestinationPath .

    Set-Location wso2apip-ai-gateway-1.2.0
    ```

    **Step 2: Run the one-time setup**

    The setup script provisions the Advanced Encryption Standard (AES)-256 at-rest encryption key, the router HTTPS listener certificate, `api-platform.env`, and the gateway-controller admin credentials. It prints the admin password once — copy it.

    ```bash
    ./scripts/setup.sh
    ```

    On Windows, run the PowerShell setup script instead. It takes the same flags and provisions the same files:

    ```powershell
    pwsh -ExecutionPolicy Bypass -File .\scripts\setup.ps1
    ```

    **Step 3: Export the admin credentials**

    Management API calls authenticate with these credentials. The username defaults to `admin`; use the password the setup script just printed.

    ```bash
    export ADMIN_USERNAME=admin
    export ADMIN_PASSWORD='<the password scripts/setup.sh printed>'
    ```

    On Windows, set them as PowerShell environment variables instead:

    ```powershell
    $env:ADMIN_USERNAME='admin'
    $env:ADMIN_PASSWORD='<the password setup.ps1 printed>'
    ```

    **Step 4: Start the gateway and verify it answers**

    ```bash
    # Start the complete stack
    docker compose up

    # Verify gateway controller admin endpoint is running
    curl http://localhost:9094/api/admin/v1/health
    ```

    On Windows, the start command is the same, and the health check is `curl.exe http://localhost:9094/api/admin/v1/health`. Note the `.exe`, since `curl` is an alias for `Invoke-WebRequest` in Windows PowerShell. PowerShell 7 removes that alias, and `curl.exe` works in both versions.

    Beyond a local evaluation, two things apply:

    - **Control plane registration.** Add the two `APIP_GW_CONTROLLER_CONTROLPLANE_*` variables to `api-platform.env` if the gateway reports to AI Workspace. See [Connect the gateway to AI Workspace](../ai-workspace/connect-the-gateway.md).
    - **Persistence and secrets.** The setup script generates the at-rest encryption key, the listener certificate, and the admin credentials once. Keep them with the deployment rather than regenerating them, and see [Gateway configuration and environment interpolation](configuration.md) for how the gateway reads them.

=== "Kubernetes"

    Installing on a Kubernetes cluster with Helm.

    Kubernetes does not use the setup script or Docker Compose. A Helm chart renders the gateway's configuration into a ConfigMap and injects the encryption key, control plane token, and database password from Kubernetes Secrets, which you create before installing the chart.

    There are two deployment modes — a standalone chart, and an operator that manages the gateway through custom resources. For the comparison and the procedure for each, see [Kubernetes deployment modes](kubernetes/index.md).

    For a replicated, high-availability installation, see [Production deployment overview](production-deployment/index.md).

## Resolve a port conflict

The Docker Compose installation binds ports 8080, 8443, 9090, and 9094 on the host. If the start command fails with a port binding error, identify what is already listening on those ports.

On macOS or Linux, run:

```bash
lsof -nP -iTCP:8080 -sTCP:LISTEN
lsof -nP -iTCP:8443 -sTCP:LISTEN
lsof -nP -iTCP:9090 -sTCP:LISTEN
lsof -nP -iTCP:9094 -sTCP:LISTEN
```

On Windows PowerShell, run:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 8080,8443,9090,9094 | Select-Object LocalAddress, LocalPort, OwningProcess
```

Stop the conflicting service if you don't need it. If you need to keep it running, change the host-side value of the relevant `ports:` mapping in `docker-compose.yaml`. Then use the remapped host port in the verification and test commands on this page.

## Customize the configuration

The setup script (`setup.sh`, or `setup.ps1` on Windows) writes `api-platform.env`, which is loaded into the containers via the Docker Compose `env_file` directive. To change the storage backend, connect to a control plane, or tune other settings, edit that file, or the `config.toml` interpolation tokens directly. See [Gateway configuration and environment interpolation](configuration.md).

## Next steps

- Connect an upstream LLM service: [Create and configure an LLM provider](../gateway-artifacts/llm-provider/create-and-configure-an-llm-provider.md)
- Expose that provider to applications: [Create and configure an LLM proxy](../gateway-artifacts/llm-proxy.md)
- Expose an MCP server through the gateway: [MCP proxy](../gateway-artifacts/mcp-proxy.md)
- Govern this gateway from the control plane: [Connect the gateway to AI Workspace](../ai-workspace/connect-the-gateway.md)
