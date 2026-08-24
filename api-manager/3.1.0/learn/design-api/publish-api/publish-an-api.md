---
title: "Publish an API"
description: "Publish a created API from the API Publisher so it becomes visible and subscribable in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/design-api/publish-api/publish-an-api/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/design-api/publish-api/publish-an-api.md
tags:
  - api-manager
  - learn
  - design-api
  - publish-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "how-to"
---

# Publish an API

**API Publishing** is the process of making the API visible in the Developer Portal and available for subscription. An API in the lifecycle state CREATED will have the  API metadata added to the Developer Portal, but not deployed to the API Gateway. Therefore, it is not visible to subscribers in the Developer Portal. When the API is published, it gets deployed on the API Gateway, and the API lifecycle state will be changed to **PUBLISHED**. 

Follow the steps below to publish an API using WSO2 API Manager.

1.  Sign in to the API Publisher `https://<hostname>:9443/publisher` (e.g., `https://localhost:9443/publisher` ). Upon signing in, the list of APIs in the API Publisher is listed. Please refer [create an API guide](../create-api/create-a-rest-api.md) to create a new API. 

     The list of APIs in the API Publisher appears. If there are no APIs created, [create an API](../create-api/create-a-rest-api.md) before starting.

2.  Click on an API that is in the **CREATED** state.

     <img src="../../../../assets/img/learn/select-created-api.png" alt="Select API" title="Select API" width="35%" />

3.  Click **Lifecycle**.

     [![Lifecycle tab](../../../assets/img/learn/lifecycle-tab.png)](../../../assets/img/learn/lifecycle-tab.png)

     The lifecycle state transition grid appears. Before publishing an API, the following requirements have to be satisfied.publish-through-multiple-api-gateways.md

        -   Endpoint provided
        -   Business Plan(s) selected
    
    If any of the above requirements are not satisfied, it is indicated in the lifecycle page, and you need to navigate to relevant sections and provide the missing information such as endpoint URL and business plans.
  
    [![Publish API requirements](../../../assets/img/learn/publish-api-requirements.png)](../../../assets/img/learn/publish-api-requirements.png)

    
4.  If the latter mentioned requirements are satisfied, click **PUBLISH** to push the API. 
    
     If required, you can select the following options when publishing the API. 

     -   **Require re-subscription when publish the API** : If selected, it invalidates the current user subscriptions and forces the users to subscribe again. 
     -   **Deprecate old versions after publish the API** : If selected, all prior versions of the API that are published will be set to the DEPRECATED state automatically.

     [![Publish API](../../../assets/img/learn/publish-api.png)](../../../assets/img/learn/publish-api.png) 
        
     If the API is published successfully, the lifecycle state will shift to **PUBLISHED**. 

     [![Published lifecycle state](../../../assets/img/learn/api-state-change-to-publish.png)](../../../assets/img/learn/api-state-change-to-publish.png) 
     
5. Nagivate to the Developer Portal (`https://<hostname>:9443/devportal`).
     
     Note that the API that you published is visible under the **APIs** listing.