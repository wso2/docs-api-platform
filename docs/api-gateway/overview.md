---
title: "API Gateway"
pagination_label: "API Gateway"
description: "Run your API proxies on a self-hosted gateway in your own infrastructure or on a cloud gateway, all managed from API Management Cloud."
slug: /api-gateway
---

A gateway is the runtime that receives API traffic, applies your policies, and routes requests to your backends. Every request that a consumer sends to your API proxy passes through a gateway, which enforces security, rate limits, and other policies before forwarding the request.

Gateways run in the data plane, while you configure and manage them centrally from the [API Control Plane](../api-control-plane/overview.md), regardless of where they run. For more on how the two planes work together, see [Control Plane and Data Planes](../key-concepts.md#control-plane-and-data-planes).

## Gateway Options

| Gateway | Description | Traffic Via | Best For |
|:--------|:------------|:------------|:---------|
| **Self-hosted gateway** | Runs on your own infrastructure, such as a virtual machine, Docker, or Kubernetes, and connects to the control plane. Traffic and data stay within your network. | Your infrastructure | Enterprise and compliance requirements |
| **cloud gateway** | Runs on fully managed cloud infrastructure. Choreo Labs runs, scales, and upgrades the gateway, so you have no infrastructure to maintain. | Choreo Cloud | A fast start and proofs of concept |

:::info
A new organization comes with a cloud gateway named **Default**, in the development environment, so you can deploy API proxies to it right away. To set up a self-hosted gateway, follow the [Self-Hosted Gateway Quick Start Guide](./self-hosted-gateways/quickstart-guide.md). To add another cloud gateway, see [Manage Gateways](../api-control-plane/administer/managing-gateways.md).
:::

## What You Can Do

| Task | Description |
|:-----|:------------|
| [Set up a Self-Hosted Gateway](./self-hosted-gateways/quickstart-guide.md) | Add a self-hosted gateway in the API Control Plane, run it on your infrastructure, and connect it to the API Control Plane. |
| [Install a Self-Hosted Gateway for production](./self-hosted-gateways/setting-up.md) | Install the gateway on a VM or Docker host, or on Kubernetes with Helm, and prepare it for production. |
| [Deploy and test an API](./self-hosted-gateways/deploy-and-test-api.md) | Create a REST API proxy, deploy it to a self-hosted gateway, and test it. |
| [Add and manage policies](./self-hosted-gateways/manage-policies.md) | Apply policies to the APIs on a self-hosted gateway. |
| [Deploy APIs directly on the gateway](./self-hosted-gateways/gateway-discovered-apis.md) | Deploy APIs on a self-hosted gateway, and see them in the API Control Plane as read-only APIs. |

To view the gateways in your organization from the API Control Plane, see [Manage Gateways](../api-control-plane/administer/managing-gateways.md).
