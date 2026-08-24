---
title: "Message transformation"
description: "Understand how request and response interceptor microservices carry out message transformation and mediation in Choreo Connect."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/deploy-and-publish/deploy-on-gateway/choreo-connect/message-transformation/message-transformation-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/deploy-and-publish/deploy-on-gateway/choreo-connect/message-transformation/message-transformation-overview.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Message Transformation

You can use interceptors in Choreo Connect to carry out transformations and mediation on the requests and responses.
Request interceptor gets triggered before sending the request to the backend. Response interceptor gets triggered before
responding to the client. Here, an interceptor is a separate microservice that handles the request, response, or
both request and response transformations.

If you are an API developer, you can write a custom request/response interceptor microservice in any programming
language of your choice by following [the Interceptor OpenAPI Definition](https://raw.githubusercontent.com/wso2/product-microgateway/refs/heads/cc-main/resources/interceptor-service-open-api-v1.yaml).
Next, for the interceptor to be engaged with Choreo Connect, define the corresponding interceptors using the following
OpenAPI extensions in the OpenAPI definition.

| Interceptor          | Corresponding OpenAPI Extension   |
|----------------------|-----------------------------------|
| Request interceptor  | **`x-wso2-request-interceptor`**  |
| Response interceptor | **`x-wso2-response-interceptor`** |

You can define interceptors on an API level (per API) and at resource level (per resource). If a request/response
interceptor is on an API level **and** a resource level, the resource level interceptor overrides the API level
interceptor for the resource defined.

The following diagram illustrates the request flow from the client to the backend through the request interceptor service and the response flow from the backend to the client through the response interceptor service.

<img src="../../../../../assets/img/deploy/mgw/interceptors-overview.png" alt="Choreo Connect Interceptors request flow" width="650px"/>

| Numbers | Description                                                                                                                                                                                                  |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1       | Client request                                                                                                                                                                                               |
| 2,3     | Request validation flow via the Enforcer                                                                                                                                                                     |
| 4,5     | If the request is valid (i.e. authenticated, not rate-limited etc.), the Router forwards the request to the Interceptor Service and transform the request based on the response from the interceptor service |
| 6,7     | Response from the backend                                                                                                                                                                                    |
| 8,9     | Response also goes through the Interceptor Service just like during the request flow                                                                                                                         |
| 10      | Response to the client                                                                                                                                                                                       |

Adding an interceptor requires the following two steps.

1. [Implement an interceptor microservice adhering to the Interceptor OpenAPI Definition](interceptor-microservice/interceptor-microservice).
2. [Refer to the interceptor service from the client-facing API definition to engage with it in the request/response flow](defining-interceptors-in-an-open-api-definition).

!!! info
    The following are not supported during request/response **body manipulation**.

    - Large payload manipulation. Maximum supported payload size is 1MiB.
    - Content types (e.g., `multipart/form-data`) with binary payloads.

    However, you can use interceptors to modify headers and trailers with the above mentioned scenarios.


