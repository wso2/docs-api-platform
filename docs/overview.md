---
title: "What is API Management?"
pagination_label: "What is API Management?"
description: "Overview of API Management, how you can run it, its components, and where to start."
---

API Management helps you manage, secure, and govern your APIs and AI services. You can design and publish REST and GraphQL API proxies, apply policies to them, and publish them to a portal where developers and AI agents discover and consume them.

This page explains what it offers, how you can run it, and where to start.

## How You Can Perform API Management

You get a web console to create APIs, apply policies, set up portals, manage subscriptions, and monitor traffic. Choreo Labs runs the control plane, where you design and manage your APIs. You choose who runs the gateways, where your API traffic flows.

### Cloud gateways

Choreo Labs runs both the control plane and the gateways. This is the fastest way to get started, because there is no infrastructure to manage.

- **Best for:** A fast start, proofs of concept, and teams that want to ship without managing infrastructure.
- **What is included:** The API Control Plane, the API Portal and AI Hub, and cloud gateways.

### Self-Hosted Gateways (Hybrid)

Choreo Labs runs the control plane, and you run the gateways on your own infrastructure, such as your data center. API traffic and data stay within the infrastructure that you manage, which meets most data residency requirements.

- **Best for:** Enterprises that need centralized governance with data privacy, and organizations that cannot allow API traffic to flow through third-party infrastructure.
- **What is included:** The API Control Plane and the API Portal and AI Hub, managed by Choreo Labs, and self-hosted gateways in your environment.
- **Get started:** [Set up a Self-Hosted Gateway](./api-gateway/self-hosted-gateways/quickstart-guide.md)

### How Do the Options Compare?

| Feature | Cloud gateways | Self-hosted gateways (Hybrid) |
|:--------|:----------------------|:------------------------------|
| **Control plane** | Managed by Choreo Labs | Managed by Choreo Labs |
| **Gateways** | Managed by Choreo Labs | Managed by you |
| **API traffic stays in your infrastructure** | No | Yes |
| **Setup complexity** | Minimal | Moderate |
| **Web console for managing APIs** | Yes | Yes |
| **API Portal and AI Hub** | Included | Included |

:::info
Both options use the same gateway technology, and you can use both in the same organization. A new organization comes with a cloud gateway named **Default**, in the development environment, so you can deploy your first API proxy without adding a gateway. To keep API traffic in your own infrastructure, add a self-hosted gateway. See [API Gateway](./api-gateway/overview.md).
:::

## Components

### Control Plane Components

| Component | What It Does | Docs |
|:----------|:-------------|:-----|
| **API Control Plane** | Create, develop, test, publish, and govern API proxies through the web console. Manage gateways, portals, and subscription plans. Environments and pipelines are created in the Choreo Cloud Console and then used here. | [API Control Plane](./api-control-plane/overview.md) |
| **API Portal and AI Hub** | The developer-facing portal where developers discover APIs and MCP servers, subscribe to them, and get credentials. AI agents discover the same APIs through machine-readable endpoints such as `llms.txt`. | [API Portal and AI Hub](./api-portal/overview.md) |

### Gateway Components

| Component | What It Does | Docs |
|:----------|:-------------|:-----|
| **API Gateway** | The runtime that receives API traffic, applies your policies, and routes requests to your backends. Runs as a cloud gateway or a self-hosted gateway. | [API Gateway](./api-gateway/overview.md) |
| **Policy Hub** | The curated collection of versioned gateway policies, such as authentication, rate limiting, and header changes, that you attach to your APIs. | [Policy Hub](./policy-hub/overview.md) |

## Choose Your Path

| I Want To | Start Here |
|:----------|:-----------|
| Create, deploy, and invoke my first API proxy | [API Control Plane Quick Start Guide](./api-control-plane/quickstart-guide.md) |
| Keep API traffic in my own infrastructure | [Self-Hosted Gateway Quick Start Guide](./api-gateway/self-hosted-gateways/quickstart-guide.md) |
| Secure an API with API keys or OAuth2 | [Security](./api-control-plane/develop-api-proxy/security/overview.md) |
| Publish an API for developers and AI agents | [Publish an API](./api-control-plane/publish-api-proxy/publish-an-api.md) |
| Discover, subscribe to, and consume an API as a developer | [API Portal and AI Hub Quick Start Guide](./api-portal/quickstart-guide.md) |

For a list of quick start guides by goal, see [Get Started](./get-started.md).

## Key Concepts

The following concepts apply across all components:

- [**Organizations**](./key-concepts.md#organizations) - The top-level boundary for your APIs, users, and configurations.
- [**Projects**](./key-concepts.md#projects) - Logical groupings of APIs within an organization, such as for a team or business domain.
- [**Gateways**](./key-concepts.md#gateways) - The runtimes where your APIs are deployed and traffic is processed.
- [**Environments**](./key-concepts.md#environments) - Stages, such as development and production, that your APIs are promoted through.

For more, see [Key Concepts](./key-concepts.md).

## Other Ways to Perform API Management

If you want to run all the components on your own infrastructure, or only need a standalone gateway without a web console, see the [self-hosted API Management documentation](pathname:///api-management/self-hosted/overview).
