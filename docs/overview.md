---
title: "What is API Platform?"
pagination_label: "What is API Platform?"
description: "Overview of WSO2 API Platform, how you can run it, its components, and where to start."
---

WSO2 API Platform helps you manage, secure, and govern your APIs and AI services. You can design and publish REST and GraphQL API proxies, apply policies to them, publish them to a portal where developers and AI agents discover and consume them, and monetize their usage.

This page explains what the platform offers, how you can run it, and where to start.

## How You Can Run API Platform

API Platform gives you a web console to create APIs, apply policies, set up portals, manage subscriptions, and monitor traffic. WSO2 runs the control plane, where you design and manage your APIs. You choose who runs the gateways, where your API traffic flows.

### WSO2 Managed Gateways

WSO2 runs both the control plane and the gateways. This is the fastest way to get started, because there is no infrastructure to manage.

- **Best for:** A fast start, proofs of concept, and teams that want to ship without managing infrastructure.
- **What is included:** The API Control Plane, the API Portal and AI Hub, and WSO2 Managed Gateways.

### Self-Hosted Gateways (Hybrid)

WSO2 runs the control plane, and you run the gateways on your own infrastructure, such as your data center. API traffic and data stay within the infrastructure that you manage, which meets most data residency requirements.

- **Best for:** Enterprises that need centralized governance with data privacy, and organizations that cannot allow API traffic to flow through third-party infrastructure.
- **What is included:** The API Control Plane and the API Portal and AI Hub, managed by WSO2, and Self-Hosted Gateways in your environment.
- **Get started:** [Set up a Self-Hosted Gateway](./api-gateway/getting-started.md)

### How Do the Options Compare?

| Feature | WSO2 Managed Gateways | Self-Hosted Gateways (Hybrid) |
|:--------|:----------------------|:------------------------------|
| **Control plane** | Managed by WSO2 | Managed by WSO2 |
| **Gateways** | Managed by WSO2 | Managed by you |
| **API traffic stays in your infrastructure** | No | Yes |
| **Setup complexity** | Minimal | Moderate |
| **Web console for managing APIs** | Yes | Yes |
| **API Portal and AI Hub** | Included | Included |

:::info
Both options use the same gateway technology, and you can use both in the same organization. Your organization does not have a default gateway, so you add a gateway before you deploy your first API proxy. See [API Gateway](./api-gateway/overview.md).
:::

## Platform Components

### Control Plane Components

| Component | What It Does | Docs |
|:----------|:-------------|:-----|
| **API Control Plane** | Create, develop, test, publish, and govern API proxies through the web console. Manage environments, pipelines, gateways, portals, and subscription plans. | [API Control Plane](./api-control-plane/overview.md) |
| **API Portal and AI Hub** | The developer-facing portal where developers discover APIs and MCP servers, subscribe to them, and get credentials. AI agents discover the same APIs through machine-readable endpoints such as `llms.txt`. | [API Portal and AI Hub](./api-portal/overview.md) |
| **Monetization** | Track API usage and charge consumers for it with subscription plans. | [Monetization](./monetization/overview.md) |

### Gateway Components

| Component | What It Does | Docs |
|:----------|:-------------|:-----|
| **API Gateway** | The runtime that receives API traffic, applies your policies, and routes requests to your backends. Runs as a WSO2 Managed Gateway or a Self-Hosted Gateway. | [API Gateway](./api-gateway/overview.md) |
| **Policy Hub** | The curated collection of versioned gateway policies, such as authentication, rate limiting, and header changes, that you attach to your APIs. | [Policy Hub](./policy-hub/overview.md) |

## Choose Your Path

| I Want To | Start Here |
|:----------|:-----------|
| Create, deploy, and invoke my first API proxy | [API Control Plane Quick Start Guide](./getting-started/api-proxy.md) |
| Keep API traffic in my own infrastructure | [Self-Hosted Gateway Quick Start Guide](./api-gateway/getting-started.md) |
| Secure an API with API keys or OAuth2 | [Security](./develop-api-proxy/security/overview.md) |
| Publish an API for developers and AI agents | [Publish an API](./publish-api-proxy/publish-an-api.md) |
| Discover, subscribe to, and consume an API as a developer | [API Portal and AI Hub Quick Start Guide](./api-portal/quickstart-guide.md) |
| Charge consumers for API usage | [Monetization](./monetization/overview.md) |

For a list of quick start guides by goal, see [Get Started](./get-started.md).

## Key Concepts

The following concepts apply across the platform:

- [**Organizations**](./key-concepts.md#organizations) - The top-level boundary for your APIs, users, and configurations.
- [**Projects**](./key-concepts.md#projects) - Logical groupings of APIs within an organization, such as for a team or business domain.
- [**Gateways**](./key-concepts.md#gateways) - The runtimes where your APIs are deployed and traffic is processed.
- [**Environments**](./key-concepts.md#environments) - Stages, such as development and production, that your APIs are promoted through.

For more, see [Key Concepts](./key-concepts.md).

## Other Ways to Run WSO2 API Platform

If you want to run the entire platform on your own infrastructure, or only need a standalone gateway without a web console, see the [WSO2 API Platform documentation](https://wso2.com/api-platform/docs/).
