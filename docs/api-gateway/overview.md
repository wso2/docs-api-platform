---
title: "API Gateway"
pagination_label: "API Gateway"
description: "Run your API proxies on a Self-Hosted Gateway in your own infrastructure or on a WSO2 Managed Gateway, all managed from API Platform Cloud."
slug: /api-gateway
---

A gateway is the runtime that receives API traffic, applies your policies, and routes requests to your backends. Every request that a consumer sends to your API proxy passes through a gateway, which enforces security, rate limits, and other policies before forwarding the request.

Gateways run in the data plane, while you configure and manage them centrally from the [API Control Plane](../api-control-plane/overview.md), regardless of where they run. For more on how the two planes work together, see [Control Plane and Data Planes](../key-concepts.md#control-plane-and-data-planes).

## Gateway Options

| Gateway | Description | Traffic Via | Best For |
|:--------|:------------|:------------|:---------|
| **Self-Hosted Gateway** | Runs on your own infrastructure, such as a virtual machine, Docker, or Kubernetes, and connects to the control plane. Traffic and data stay within your network. | Your infrastructure | Enterprise and compliance requirements |
| **WSO2 Managed Gateway** | Runs on fully managed cloud infrastructure. WSO2 runs, scales, and upgrades the gateway, so you have no infrastructure to maintain. | WSO2 cloud | A fast start and proofs of concept |

:::info
Your organization does not have a default gateway. Before you deploy an API proxy, create a gateway in the API Control Plane. To set up a Self-Hosted Gateway, follow the [Self-Hosted Gateway Quick Start Guide](../hybrid-gateways/api-gateway/getting-started.md). To add a WSO2 Managed Gateway instead, see [Manage Gateways](../administer/managing-gateways.md).
:::

## What You Can Do

| Task | Description |
|:-----|:------------|
| [Set up a Self-Hosted Gateway](../hybrid-gateways/api-gateway/getting-started.md) | Add a Self-Hosted Gateway in the API Control Plane, run it on your infrastructure, and deploy an API proxy to it. |
| [Add and manage policies](../hybrid-gateways/api-gateway/manage-policies.md) | Apply policies to the APIs on a Self-Hosted Gateway. |

To view the gateways in your organization from the API Control Plane, see [Manage Gateways](../administer/managing-gateways.md).
