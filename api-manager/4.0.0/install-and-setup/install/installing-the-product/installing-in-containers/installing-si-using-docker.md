---
title: "Installing streaming integrator using Docker"
description: "Install and run WSO2 Streaming Integrator using Docker after meeting the required system requirements."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/install/installing-the-product/installing-in-containers/installing-si-using-docker/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/install/installing-the-product/installing-in-containers/installing-si-using-docker.md
tags:
  - api-manager
  - install-and-setup
  - install
  - installing-the-product
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Installing Streaming Integrator Using Docker

!!!tip "Before you begin:"
    - The system requirements are as follows:
        -   3 GHz Dual-core Xeon/Opteron (or latest)
        -   8 GB RAM
        -   10 GB free disk space

    - Install Docker by following the instructions provided in [here](https://docs.docker.com/install/).


WSO2 provides open source Docker images to run WSO2 Streaming Integrator in
Docker Hub. You can view these images [In Docker Hub - WSO2](https://hub.docker.com/u/wso2/).

## Downloading and installing WSO2 Streaming Integrator

To pull the required WSO2 Streaming Integrator distribution with updates from the Docker image, issue the following command.

```
docker pull wso2/streaming-integrator:1.0.0
```

## Running WSO2 Streaming Integrator

To run WSO2 Streaming Integrator, issue the following command.

```
docker run -it wso2/streaming-integrator/1.0.0
```

!!! tip
    To expose the required ports via docker when running the docker container, issue the following command.
    
    ```bash
        docker run -it \
        -p 9443:9443   \
        -p 9090:9090   \
        -p 7070:7070   \
        -p 7443:7443   \
        -p 9712:9712   \
        -p 7711:7711   \
        -p 7611:7611   \
        wso2/streaming-integrator
    ```

   For more details about the ports in Streaming Integrator, see [Configuring Default Ports](../../../setup/si-setup/configuring-default-ports.md).