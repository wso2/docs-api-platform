---
title: "Distributed deployment with the Traffic Manager separated"
description: "Configure a distributed API Manager deployment with the Traffic Manager on its own node, separate from the Control Plane and Gateway nodes."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/install-and-setup/setup/distributed-deployment/deploying-wso2-api-m-in-a-distributed-setup-with-tm-separated/
md_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/install-and-setup/setup/distributed-deployment/deploying-wso2-api-m-in-a-distributed-setup-with-tm-separated.md
tags:
  - api-manager
  - distributed-deployment
  - traffic-manager
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-15
content_type: "how-to"
---

# Configuring a Distributed API-M Deployment with Traffic Manager Separated from the Control Plane

The WSO2 API-M server can be deployed as an [all-in-one deployment](../../../install-and-setup/setup/single-node/all-in-one-deployment-overview.md) or as a distributed deployment. In the distributed setup, the [API-M server profiles](../../../install-and-setup/setup/distributed-deployment/product-profiles.md) are deployed as separate API-M nodes. 

Given below are the API-M nodes you can have in a distributed deployment.

!!! Tip
    To enable high availability, you need a minimum of two nodes running each profile.

<table>
    <tr>
        <th>
            API-M Node (Profile)
        </th>
        <th>
            Description
        </th>
    </tr>
    <tr>
        <td>
            Gateway Worker Node
        </td>
        <td>
            API-M nodes running the Gateway profile.
        </td>
    </tr>
    <tr>
        <td>
            Control Plane Node
        </td>
        <td>
            API-M nodes running the Control Plane profile. The Control Plane includes the Traffic Manager, Key Manager, Publisher, and Developer Portal components.
        </td>
    </tr>
    <tr>
        <td>
            Traffic Manager Node (Optional)
        </td>
        <td>
            If required you can configure a separate API-M node to run the Traffic Manager component. That is, the Control Plane nodes run the Key Manager, Publisher, and Developer Portal, while the Traffic Manager runs on a separate node.
        </td>
    </tr>
</table>

<a href="../../../../assets/img/setup-and-install/deployment-tm.png"><img src="../../../../assets/img/setup-and-install/deployment-tm.png" width="100%"></a>

--8<-- "api-manager/4.4.0/includes/deploy/steps-to-deploy-apim-in-a-distributed-setup-with-tm-separation.md"

For more information on starting API-M profiles, see [API-M Profiles](../../../install-and-setup/setup/distributed-deployment/product-profiles.md).