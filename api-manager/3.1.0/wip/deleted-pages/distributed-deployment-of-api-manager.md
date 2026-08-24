---
title: "Distributed deployment of API Manager"
description: "Understand and deploy WSO2 API Manager's Publisher, Developer Portal, Gateway, Key Manager, and Traffic Manager components in a distributed setup."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/wip/deleted-pages/distributed-deployment-of-api-manager/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/wip/deleted-pages/distributed-deployment-of-api-manager.md
tags:
  - api-manager
  - wip
  - deleted-pages
  - distributed-deployment-of-api-manager
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "concept"
---

# Distributed Deployment of API Manager

[WSO2 API Manager](https://wso2.com/api-manager/) (WSO2 API-M) is a complete API management solution, used for creating and publishing APIs, creating and managing a developer community, and routing API traffic scalably. The WSO2 API-M includes the following five components: Publisher, Developer Portal, Gateway, Key Manager, and Traffic Manager.

Typically, when you get started with WSO2 API Manager in a development environment, you deploy WSO2 API Manager as a single instance with all its components on a single server. For details, see [All-in-One Deployment Overview](../../install-and-setup/setup/single-node/all-in-one-deployment-overview.md).

However, in a production deployment, these components are deployed in a distributed manner. Therefore, you can create a distributed deployment of WSO2 API-M's five main components. This page describes how to set up and deploy WSO2 API-M as a distributed deployment.

!!! note
    Note that your configurations may vary depending on the WSO2 API Manager deployment pattern that you choose. If you are using multi-tenancy, all nodes should use the same user store, as all servers are servicing the same set of tenants, and it has to share the same Governance Registry space across all nodes.


-   [Understanding the Distributed Deployment of WSO2 API-M](../../install-and-setup/setup/distributed-deployment/understanding-the-distributed-deployment-of-wso2-api-m.md#understanding-the-distributed-deployment)
-   [Deploying WSO2 API-M in a Distributed Setup](../../install-and-setup/setup/distributed-deployment/deploying-wso2-api-m-in-a-distributed-setup.md)
