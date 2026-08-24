---
title: "Deploy API-M with the key manager separated"
description: "Deploy WSO2 API Manager in a distributed setup where the key manager node runs separately from the control plane."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/install-and-setup/setup/distributed-deployment/deploying-wso2-api-m-in-a-distributed-setup-with-km-separated/
md_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/install-and-setup/setup/distributed-deployment/deploying-wso2-api-m-in-a-distributed-setup-with-km-separated.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - distributed-deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-17
content_type: "how-to"
---

# Configuring a Distributed API-M Deployment with Key Manager Separated from the Control Plane

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
            Key Manager Node (Optional)
        </td>
        <td>
            If required you can configure a separate API-M node to run the Key Manager component. That is, the Control Plane nodes run the Traffic Manager, Publisher, and Developer Portal, while the Key Manager runs on a separate node.
        </td>
    </tr>
</table>

<a href="../../../../assets/img/setup-and-install/deployment-km.png"><img src="../../../../assets/img/setup-and-install/deployment-km.png" width="100%"></a>

{!includes/deploy/steps-to-deploy-apim-in-a-distributed-setup-with-km-separation.md!}

For more information on starting API-M profiles, see [API-M Profiles](../../../install-and-setup/setup/distributed-deployment/product-profiles.md).