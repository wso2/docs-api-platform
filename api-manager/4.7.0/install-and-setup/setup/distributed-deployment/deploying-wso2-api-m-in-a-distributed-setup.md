---
title: "Pattern 3: Distributed Setup"
description: "Deploy WSO2 API Manager with the API Control Plane, Classic Gateway, and Traffic Manager as separate nodes for high availability."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/install-and-setup/setup/distributed-deployment/deploying-wso2-api-m-in-a-distributed-setup/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/install-and-setup/setup/distributed-deployment/deploying-wso2-api-m-in-a-distributed-setup.md
tags:
  - api-manager
  - distributed-deployment
  - high-availability
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Pattern 3: Distributed Setup

WSO2 API-M can be deployed as an [all-in-one deployment](../single-node/all-in-one-deployment-overview.md) or as a distributed deployment. In the distributed setup, the respective component distributions, namely WSO2 API Control Plane, WSO2 Classic Gateway (Universal) and WSO2 Traffic Manager are deployed as separate nodes.

Given below are the API-M nodes you can have in a distributed deployment by default.

!!! Tip
    To enable high availability, you need a minimum of two nodes running each component distribution.

<table>
    <tr>
        <th>
            API-M Component Distribution
        </th>
        <th>
            Description
        </th>
    </tr>
    <tr>
        <td>
            WSO2 API Control Plane
        </td>
        <td>
            API-M nodes running the Control Plane component. The WSO2 API Control Plane includes the Key Manager, Publisher Portal, Developer Portal components.
        </td>
    </tr>
    <tr>
        <td>
            WSO2 Classic Gateway
        </td>
        <td>
            API-M nodes running the Gateway component.
        </td>
    </tr>
    <tr>
        <td>
            WSO2 Traffic Manager
        </td>
        <td>
            API-M nodes running the Traffic Manager component.
        </td>
    </tr>
</table>

<a href="../../../../assets/img/setup-and-install/deployment-tm.png"><img src="../../../../assets/img/setup-and-install/deployment-tm.png" width="100%"></a>

--8<-- "api-manager/4.7.0/includes/deploy/steps-to-deploy-apim-in-a-distributed-setup-with-tm-separation.md"