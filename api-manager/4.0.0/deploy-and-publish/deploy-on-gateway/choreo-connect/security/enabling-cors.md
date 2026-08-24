---
title: "Enabling CORS"
description: "Enable CORS at the API level using an OpenAPI vendor extension or globally through the Choreo Connect configuration file."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/enabling-cors/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/enabling-cors.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Enabling CORS

### Enable CORS configuration for API resources (API level)

If you are following the developer first approach, ([deploy the API via the CLI tool](../deploy-api/deploy-api-via-apictl.md)). You can add CrossOrigin Resource Sharing (**CORS**) configurations for each API (at API level) using the OpenAPI vendor extension **x-wso2-cors** in the API definition. The following code snippet depicts the usage of the `x-wso2-cors` extension. For more information, see the [detailed sample OpenAPI definition with CORS level configuration](https://github.com/wso2/product-microgateway/blob/main/samples/openAPI-definitions/cors_sample.yaml).

``` java
x-wso2-basePath: /petstore/v1
x-wso2-production-endpoints:
  urls:
  - https://petstore.swagger.io/v2
x-wso2-cors:
  accessControlAllowOrigins:
    - test.com
    - example.com
  accessControlAllowHeaders:
    - Authorization
    - Content-Type
  accessControlAllowMethods:
    - GET
    - PUT
    - POST
  accessControlAllowCredentials: true
```

If you are following the [Deploy API via API-M](../deploy-api/deploy-rest-api-in-choreo-connect.md) approach, you can add **CORS** configurations for each API using the [WSO2 API-M](../../../../design/advanced-topics/enabling-cors-for-apis.md#EnablingCORSPerAPI).

### Enable CORS configurations globally

Follow the instructions below to enable CORS globally. Once this is enabled, it will apply this configurations through all endpoints and APIs deployed in Choreo Connect.

1.  
    --8<-- "api-manager/4.0.0/includes/deploy/cc-configuration-file.md"
2. Locate the following configuration set and make the `enabled` attribute to `true` with the required CORS attributes there.

     ``` yml
     [router.cors]
         enabled = true
         allowOrigins = ["*"]
         allowMethods = ["GET","PUT","POST","DELETE","PATCH","OPTIONS"]
         allowHeaders = ["authorization","Access-Control-Allow-Origin","Content-Type","SOAPAction","apikey", "testKey", "Internal-Key"]
         exposeHeaders = []
         allowCredentials = false
     ```

!!! info 
    Global CORS configuration is enabled by default. Access control can be done by changing the parameters mentioned above.

!!! note 
    If CORS for a certain API is disabled from API Level Configurations, the default global Configurations will apply.