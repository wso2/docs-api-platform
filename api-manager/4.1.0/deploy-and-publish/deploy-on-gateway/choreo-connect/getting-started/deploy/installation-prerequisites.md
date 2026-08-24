---
title: "Installation prerequisites"
description: "Review the CPU, memory, and software prerequisites for deploying Choreo Connect on Docker or Kubernetes."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/getting-started/deploy/installation-prerequisites/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/getting-started/deploy/installation-prerequisites.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Installation Prerequisites

- Choreo Connect can be deployed in [Docker Compose](https://docs.docker.com/compose/) for trying out purposes. You need to install [Docker](https://docs.docker.com/get-docker/) in your machine.
  Allocate the following resources for Docker.

    - Minimum CPU : 4vCPU
    - Minimum Memory : 4GB


- In order to deploy Choreo Connect in Kubernetes, ensure that the appropriate prerequisites are fulfilled.

    - Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
    - Set up a [Kubernetes](https://Kubernetes.io/docs/setup/) cluster v1.20 or above.

### Minimum CPU and memory requirements for Choreo Connect components

| **Component** | **CPUs (vCPU)** | **Memory (MB)** |
|-----------|------------|------------|
| Adapter   | 0.5        | 500        |
| Enforcer  | 1          | 1000       |
| Router    | 1          | 500        |