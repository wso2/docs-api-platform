---
title: "WSO2 API Manager deployment patterns"
description: "Five deployment patterns for WSO2 API Manager, from a single all-in-one node to a fully distributed setup and external gateways."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/install-and-setup/setup/deployment-patterns/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/install-and-setup/setup/deployment-patterns.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - deployment-patterns
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "concept"
---

# WSO2 API Manager Deployment Patterns


## Pattern 1: Single node (all-in-one) deployment

[![Single node deployment](../../assets/img/setup-and-install/1-single-node-deployment.png)](../../assets/img/setup-and-install/1-single-node-deployment.png)

You can use this pattern when you are working with low throughput.

## Pattern 2: Deployment with a separate Gateway and separate Key Manager

[![Deployment with a separate Gateway and separate Key Manager](../../assets/img/setup-and-install/2-separate-gateway-and-key-manager.png)](../../assets/img/setup-and-install/2-separate-gateway-and-key-manager.png)

You can use this pattern when you require a high throughput scenario that requires a shorter token lifespan.

## Pattern 3: Fully distributed setup

[![Fully distributed setup](../../assets/img/setup-and-install/3-fully-distributed-setup.png)](../../assets/img/setup-and-install/3-fully-distributed-setup.png)

You can use this pattern to maintain scalability at each layer and higher flexibility at each component.

## Pattern 4: Internal and external (on-premise) API Management

[![Internal and external API-M](../../assets/img/setup-and-install/4-internal-and-external.png)](../../assets/img/setup-and-install/4-internal-and-external.png)

You can use this pattern when you require a separate internal and external API Management with separate Gateway instances.

## Pattern 5: Internal and external (public and private cloud) API Management

[![Internal and external (public and private cloud) API-M](../../assets/img/setup-and-install/internal-public-and-private-cloud.png)](../../assets/img/setup-and-install/internal-public-and-private-cloud.png)

You can use this pattern when you wish to maintain a cloud deployment as an external API Gateway layer.