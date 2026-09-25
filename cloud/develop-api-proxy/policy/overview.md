---
title: "Design and Customize API Proxies"
description: "Customize an API proxy in WSO2 API Platform's interactive UI: add or remove resources, map resources, and manage policies."
canonical_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/policy/overview/
md_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/policy/overview.md
tags:
  - cloud
  - api-proxy
  - policy
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "overview"
---

# Overview

API Platform simplifies the design, management, and mediation of API proxies with its interactive UI. It enables seamless API proxy customization within its unified UI, allowing you to add or remove resources, map resources, and apply policies at both the API and resource levels—all from the same interface.

You can intuitively map API proxies to service contracts with API Platform's interactive UI, ensuring clear and consistent request routing to backend services. With built-in mediation policies, API Platform provides flexibility to manage API requests and responses, facilitating custom transformations and logic without requiring custom code. This enhances API manageability, making it easier to configure, update, and control API traffic within the platform.

## Designing API Proxies

You can further redesign and customize your API proxy created from following the [Create API Proxy](../../create-api-proxy/overview.md) flow.

1. You can add new resources and delete existing ones as necessary
   ![API proxy resource list with add resource button on API Proxy Contract and delete icons on each resource row](../../../assets/img/develop-api-proxy/overview/add_delete_resource.png)

2. You can delete existing resource mappings, with the option to delete the resources along with the mapping if you do not intend to map it to a different backend resource
   ![API proxy resource list with a highlighted delete icon on the GET /books mapping connector](../../../assets/img/develop-api-proxy/overview/delete_mapping.png)

3. You can create a new mapping for a new resource you created
   ![API proxy resource list showing a new GET /documents resource mapped with crossing lines to backend service routes](../../../assets/img/develop-api-proxy/overview/new_mapping.png)

!!! Info
    Each change made to proxy will be automatically saved as the `Latest saved` version in History. You can restore to the initial version or to an earlier version that has been deployed by clicking the `Restore` button in the History Pane.