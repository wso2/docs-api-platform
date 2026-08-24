---
title: "Deploying artifacts"
description: "Deploy composite application artifacts to embedded, remote, Docker, or Kubernetes Micro Integrator environments."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/develop/deploy-artifacts/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/develop/deploy-artifacts.md
tags:
  - api-manager
  - integrate
  - develop
  - deploy-artifacts
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Deploying Artifacts

Once you have your integration artifacts developed and [packaged in a composite application](packaging-artifacts.md), you can deploy the composite application in your Micro Integrator server or your container environment.

## Deploy artifacts in the embedded Micro Integrator

The light-weight Micro Integrator is already included in your WSO2 Integration Studio package, which allows you to deploy and run the artifacts instantly.

See the instructions in [using the embedded Micro Integrator](using-embedded-micro-integrator.md) of WSO2 Integration Studio. 

## Deploy artifacts in a remote Micro Integrator instance

Download and set up a Micro Integrator server in your VM and deploy the composite application with your integration artifacts. 

See the instructions in [using a remote Micro Integrator](using-remote-micro-integrator.md).

## Deploy artifacts in Docker

Use the <b>Docker Exporter</b> module in WSO2 Integration Studio to build a Docker image of your Micro Integrator solution and push it to your Docker registry. You can then use this Docker image from your Docker registry to start Docker containers.

See the instructions on using the [Docker Exporter](create-docker-project.md).

## Deploy artifacts in Kubernetes

Use the <b>Kubernetes Exporter</b> module in WSO2 Integration Studio to deploy a Docker image of your Micro Integrator Solution in a Kubernetes environment. 

See the instructions on using the [Kubernetes Exporter](create-kubernetes-project.md).

## Enable priority-based composite application deployment

When multiple composite applications are deployed, they are processed in alphabetical order by default. However, if some composite applications depend on others, deployment may fail due to incorrect ordering. To enable priority-based deployment, add the following configuration to `<MI_HOME>/conf/deployment.toml`:

```toml
[server]
enable_priority_deployment = true
```

With this configuration, composite applications are divided into two categories:

- **High-priority**: composite applications containing a connector, registry resource, or class mediator.
- **Low-priority**: all other composite applications.

High-priority composite applications are deployed first (in alphabetical order), followed by low-priority ones (also in alphabetical order).

If high-priority composite applications depend on each other, deployment may still fail due to incorrect ordering. To mitigate this, configure a retry count using `priority_deployment_retry_count`. This value represents the number of additional deployment attempts made for high-priority composite applications after the initial attempt. The default is `1`.

```toml
[server]
enable_priority_deployment = true
priority_deployment_retry_count = 2
```