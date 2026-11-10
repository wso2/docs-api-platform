---
title: "High Availability"
pagination_label: "Self-Hosted Gateway High Availability"
description: "Run multiple Gateway Controller and Gateway Runtime replicas so a Self-Hosted Gateway keeps serving APIs when one replica is unavailable."
---

A Self-Hosted Gateway can run with more than one Gateway Controller replica and more than one Gateway Runtime replica, including replicas in different network zones or environments. For the components of a single gateway, see [Architecture](./architecture.md).

API deployments are received by one of the Gateway Controller replicas. That controller stores the deployment in the shared PostgreSQL database. The other Gateway Controller replicas read the updated deployment state from the database and synchronize the configuration with the Gateway Runtime instances connected to them.

Every Gateway Controller replica then works from the same deployment state, and each runtime environment receives the latest API configuration.

## Architecture

| Component | Description |
| ----- | ----- |
| Gateway Controller | Receives API deployment requests, stores deployment state in the database, and synchronizes runtime configuration with the Gateway Runtime instances connected to it. |
| PostgreSQL database | Shared source of truth for API metadata, deployment state, and gateway configuration. |
| Gateway Runtime | Receives configuration from its connected Gateway Controller and enforces API gateway policies on traffic. |

![Highly available Self-Hosted Gateway with two Gateway Controller replicas sharing PostgreSQL and two Gateway Runtime replicas behind an ingress](/img/cloud/api-gateway/high-availability-architecture.png)

Each Gateway Controller replica can manage one or more Gateway Runtime replicas.

## Deployment Synchronization

One of the available Gateway Controller replicas handles an API deployment request.

That controller validates the deployment and stores the API metadata and deployment state in the shared PostgreSQL database. The other Gateway Controller replicas read the latest deployment state from the database. When a controller detects a new or updated API deployment, it generates the runtime configuration and synchronizes it with the Gateway Runtime instances connected to that controller.

Each Gateway Runtime applies the configuration it receives and starts serving the deployed APIs.

## High Availability

High availability removes the dependency on a single controller instance.

If Gateway Controller replica 01 receives an API deployment request, it stores the deployment state in PostgreSQL. Gateway Controller replica 02 reads the same state from the database and synchronizes it with the Gateway Runtime replicas connected to it.

If one Gateway Controller replica becomes unavailable, another replica can continue to process deployment requests and synchronize runtime configuration from the state stored in the database.

You can also run more than one Gateway Runtime replica in each environment, so API traffic continues when one runtime replica is unavailable.

## Configuration Synchronization

The PostgreSQL database is the synchronization point between Gateway Controller replicas. It keeps the latest API deployment state so every controller replica stays consistent.

Gateway Runtime replicas do not read the database. They receive runtime configuration from the Gateway Controller they are connected to. The controller generates and synchronizes that configuration.
