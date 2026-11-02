---
title: "API Gateway"
pagination_label: "API Gateway"
description: "Run your API proxies on a WSO2 Managed Gateway or on a Self-Hosted Gateway in your own infrastructure, all managed from API Platform Cloud."
slug: /api-gateway
---

A gateway is the runtime that receives API traffic, applies your policies, and routes requests to your backends. Every request that a consumer sends to your API proxy passes through a gateway, which enforces security, rate limits, and other policies before forwarding the request.

Gateways run in the data plane, while you configure and manage them centrally from the [API Control Plane](../api-control-plane/overview.md), regardless of where they run. For more on how the two planes work together, see [Control Plane and Data Planes](../key-concepts.md#control-plane-and-data-planes).

## Gateway Options

| Gateway | Where It Runs | Use It To |
|:--------|:--------------|:----------|
| **WSO2 Managed Gateway** | On infrastructure that WSO2 hosts and operates. | Deploy and test API proxies without setting up any infrastructure. |
| **Self-Hosted Gateway** | On your own infrastructure, such as a virtual machine, Docker, or Kubernetes. | Keep API traffic within your network or close to your backends. |

Your organization has a WSO2 Managed Gateway by default. Add a Self-Hosted Gateway when you need to control where your API traffic runs.

## Gateways and Environments

Each gateway belongs to one [environment](../key-concepts.md#environments), such as development or production. An environment can have more than one gateway, and one of them can be the default gateway for the environment.

## What You Can Do

| Task | Description |
|:-----|:------------|
| [Set up a Self-Hosted Gateway](../hybrid-gateways/api-gateway/getting-started.md) | Add a Self-Hosted Gateway in the API Control Plane, run it on your infrastructure, and deploy an API proxy to it. |
| [Add and manage policies](../hybrid-gateways/api-gateway/manage-policies.md) | Apply policies to the APIs on a Self-Hosted Gateway. |
| [Write custom policies](../hybrid-gateways/api-gateway/writing-a-custom-policy.md) | Build your own policies, [build a gateway that includes them](../hybrid-gateways/api-gateway/build-gateway-with-custom-policies.md), and [apply them to APIs](../hybrid-gateways/api-gateway/apply-custom-policies-to-apis.md). |

To view the gateways in your organization from the API Control Plane, see [Manage Gateways](../gateways.md).
