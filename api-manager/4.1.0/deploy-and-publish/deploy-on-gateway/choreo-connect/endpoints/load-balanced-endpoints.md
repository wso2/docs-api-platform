---
title: "Load balanced endpoints"
description: "Enable load balanced endpoints in Choreo Connect to route traffic across multiple endpoints using round robin."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/endpoints/load-balanced-endpoints/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/endpoints/load-balanced-endpoints.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "how-to"
---

# Load Balanced Endpoints

When you use Load Balanced API Endpoints, the traffic that comes to the resource is routed to the mentioned endpoint addresses based on the round-robin algorithm. You can enable load balancing capabilities when working with Choreo Connect (CC) in the following two modes.

- [Load Balanced Endpoints With WSO2 API Manager](#choreo-connect-with-wso2-api-manager-as-a-control-plane)
- [Load Balanced Endpoints With APICTL (WSO2 API Controller)](#choreo-connect-as-a-standalone-gateway)

## Choreo Connect with WSO2 API Manager as a Control Plane

Follow the instructions below to enable load balancing capabilities when using Choreo Connect with WSO2 API Manager as the Control Plane:

!!! Important
    Currently WSO2 API Manager allows to add load balanced endpoints only to the API level.

### Step 1 - Define the Load Balanced Endpoints in the Publisher

After creating an API in the APIM publisher, select the API you want to apply load balanced capability.
 
1.  Click **Develop -> API Configurations -> Endpoints**.

    1. Under the **Load balanced and Failover Configurations** and select the endpoint type as **Load Balanced**.

    2. Provide the service URLs that you want to handle load balancing.

    !!! info
        Click the + sign in the text box after adding each service URL to provide multiple service endpoints.

    [![Add load balanced endpoints in APIM](../../../../assets/img/learn/load-balance-and-fail-over.png)](../../../../assets/img/learn/load-balance-and-fail-over.png)

    [![Add load balanced endpoints addition in APIM](../../../../assets/img/learn/load-balanced-configurations.png)](../../../../assets/img/learn/load-balanced-configurations.png)
    
2.  Click **Save & Deploy**.

### Step 2 - Invoke API Endpoint Via The Choreo Connect

After obtaining a valid JWT token, you can invoke APIs as described [here](../getting-started/quick-start-guide-docker-with-apim.md#step-6-invoke-the-api-from-developer-portal). 
When invoking the API, traffic will route to the load balanced endpoints you defined above.

Example is given below:

``` java
curl -k -X GET "https://localhost:9095/pizzashack/1.0.0/menu" -H "accept: application/json" -H "Authorization: Bearer <COPIED_TOKEN>"
```

## Choreo Connect as a Standalone Gateway

Follow the instructions below to enable load balancing capabilities when using Choreo Connect as a standalone gateway:

In this approach you can define load balanced endpoints in API level as well as in resource level. The below section demonstrates how load balanced endpoints can be defined in those two levels.

### Step 1 - Define Load Balanced Endpoints In The OpenAPI Definition file

### Load Balanced Endpoints In API Level

Below section demonstrates how to define load balanced endpoints for API level in an OpenAPI definition file.

``` yaml tab="Format"
openapi: <version>
...
x-wso2-production-endpoints:
  urls:
    - <URL1>
    - <URL2>
  type: load_balance
...
```

``` yaml tab="Example"
...
x-wso2-production-endpoints:
  urls:
    - http://localhost:2380/v2
    - http://localhost:2381/v2
  type: load_balance
...
```

### Load Balanced Endpoints In Resource Level

Below section demonstrates how to define load balanced endpoints for resource level in an OpenAPI definition file.

``` yaml tab="Format"
openapi: <version>
...
paths:
  "/<path>":
    <operation>:
    x-wso2-production-endpoints:
    urls:
      - <URL1>
      - <URL2>
    type: load_balance
```

``` yaml tab="Example"
paths:
  "/pet/findByStatus":
    get:
      responses:
        '200':
          description: OK
    ...
    x-wso2-production-endpoints:
    urls:
      - http://localhost:2380/v1
      - http://localhost:2380/v1
    type: load_balance
  "/pet/{petId}":
    get:
      responses:
        '200':
          description: OK
...
```

### Step 2 - Deploy the API Project And Invoke With Load Balanced Endpoints

After defining API in the OpenAPI definition file, you can deploy it and invoke as explained [here](../getting-started/quick-start-guide-docker-with-apim.md#step-1-download-and-extract-the-choreo-connect-distribution-zip-file).