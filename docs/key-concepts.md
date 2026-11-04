---
title: "Key Concepts"
---

Key concepts are the core building blocks that define how your resources and runtime infrastructure are organized and managed.

- [Organizations](#organizations)
- [Projects](#projects)
- [Gateways](#gateways)
- [Environments](#environments)
- [Pipelines](#pipelines)
- [Control Plane and Data Planes](#control-plane-and-data-planes)

## Organizations

An **organization** is the top-level container for everything you create, including projects, API proxies, gateways, and environments. Resources in one organization are isolated from those in another.

## Projects

A **project** is a logical grouping of API Proxies that typically work together to deliver a business capability. Projects help organize development, deployment, and management workflows. Each project is isolated from others, ensuring clear boundaries for resources, permissions, and deployments.

## Gateways

A **gateway** is the runtime that receives API traffic, applies the policies you configure, and routes requests to your backend services. You deploy API proxies to gateways, and each gateway is associated with an environment.

You can use the following kinds of gateways:

- **WSO2 Managed Gateways:** Run on fully managed cloud infrastructure. WSO2 runs, scales, and upgrades the gateway.
- **Self-Hosted Gateways:** Run on your own infrastructure, such as a virtual machine, Docker, or Kubernetes, and connect to the control plane for configuration and management. Traffic and data stay within your network. See [Self-Hosted Gateway](./api-gateway/self-hosted-gateways/quickstart-guide.md).

## Environments

An **environment** is an isolated deployment area, such as development or production, that runs on a data plane. Each environment has its own gateways, configuration, and endpoint URLs, so you can test changes without affecting the API that consumers use.

## Pipelines

A **pipeline** is the ordered sequence of environments that an API proxy moves through on its way to production, for example from development to production. You deploy an API proxy to the first environment in the pipeline, test it, and then promote the same build to the next environment.

Promoting the same build, rather than rebuilding it for each environment, ensures that what you tested is exactly what runs in production. Environment-specific values, such as backend endpoints, are configured separately for each environment.

## Control Plane and Data Planes

The architecture is built around two core components, namely the control plane and the data plane.

The **control plane** manages organizations and projects, and orchestrates the API proxy lifecycle, from creation and deployment to governance, observability, and publishing to the API Portal and AI Hub.

The **data plane** is where deployed API proxies run, based on the configuration defined in the control plane. All API traffic stays within the data plane, so user data remains securely contained.
