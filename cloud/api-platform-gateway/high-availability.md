---
title: "High availability deployment for the Self-Hosted Gateway"
description: "Deploy multiple Gateway Controller and Gateway Runtime replicas with a shared PostgreSQL database for high availability."
canonical_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/high-availability/
md_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/high-availability.md
tags:
  - cloud
  - api-gateway
  - self-hosted
  - high-availability
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "concept"
---

## High Availability Deployment with Multiple Gateway Controllers and Runtimes

The self-hosted gateway can be deployed in a highly available manner by running multiple **Gateway Controller** replicas and multiple **Gateway Runtime** replicas across different network zones or environments.

In this deployment model, API deployments are received by one of the Gateway Controller replicas. The controller persists the API deployment information in the shared PostgreSQL database. Other Gateway Controller replicas then read the updated deployment state from the database and synchronize the relevant configuration with the Gateway Runtime instances connected to them.

This ensures that all Gateway Controller replicas operate with a consistent deployment state and that each runtime environment receives the latest API configuration.

![High-availability setup example](../../assets/img/api-platform-gateway/gateway/high-availability-architecture.png)

## Architecture Overview

The deployment consists of the following main components:

| Component | Description |
| ----- | ----- |
| **Gateway Controller** | Receives API deployment requests, stores deployment state in the database, and synchronizes runtime configuration with connected Gateway Runtime instances. |
| **PostgreSQL Database** | Acts as the shared source of truth for API metadata, deployment state, and gateway configuration. |
| **Gateway Runtime** | Receives configuration from its connected Gateway Controller and enforces API gateway policies at runtime. |

## Deployment Synchronization Flow

When an API deployment request is received, it is handled by one of the available Gateway Controller replicas.

The controller that receives the request validates the deployment and stores the API metadata and deployment state in the shared PostgreSQL database. This database acts as the common source of truth for all Gateway Controller replicas.

Other Gateway Controller replicas continuously read or synchronize the latest deployment state from the database. Once a controller detects a new or updated API deployment, it generates the required runtime configuration and synchronizes it with the Gateway Runtime instances connected to that controller.

Each Gateway Runtime then applies the received configuration and starts serving the deployed APIs.

Each Gateway Controller replica can manage one or more Gateway Runtime replicas.

## High Availability Behavior

High availability is achieved by removing dependency on a single controller instance.

If an API deployment request is received by **Gateway Controller Replica 01**, that replica stores the deployment state in PostgreSQL. **Gateway Controller Replica 02** can then read the same deployment state from the database and synchronize it with the Gateway Runtime replicas connected to it.

If one Gateway Controller replica becomes unavailable, another replica can continue to process deployment requests and synchronize runtime configuration based on the state stored in the database.

Similarly, multiple Gateway Runtime replicas can be deployed in each environment to ensure API traffic continues to be served even if one runtime replica becomes unavailable.

## Configuration Synchronization

The PostgreSQL database is the central synchronization point between Gateway Controller replicas. It maintains the latest API deployment state and allows all controller replicas to operate consistently.

Gateway Runtime replicas do not directly read from the database. Instead, they receive the required runtime configuration from their connected Gateway Controller. This keeps the runtime layer lightweight and allows the controller layer to manage configuration generation and synchronization.