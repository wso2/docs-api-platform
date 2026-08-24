---
title: "Disabling security for APIs"
description: "Disable API authentication in Choreo Connect via the Publisher Portal or by updating the OpenAPI definition."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authentication/disabling-security/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authentication/disabling-security.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Disabling Security for APIs

An API can be invoked without authentication by disabling security. Pick one of the following methods to disable security depending on the Choreo Connect **mode** you have chosen.


|**Mode**         | **Method**    |
|--------------|-----------|
|[Choreo Connect with WSO2 API Manager as a Control Plane](../../concepts/apim-as-control-plane.md)   | [Via WSO2 API Manager Publisher Portal](#via-wso2-api-manager-publisher-portal)  |
|[Choreo Connect as a Standalone Gateway](../../concepts/as-a-standalone-gateway.md)  |[By Updating the OpenAPI Definition](#by-updating-the-openapi-definition) |

## Via WSO2 API Manager Publisher Portal

Follow the steps given in [Disabling Security for APIs](../../../../../design/api-security/api-authentication/disable-security.md).

## By updating the OpenAPI definition

APIs can be exposed without requiring any authentication (i.e. disable transport security and application security) using the OpenAPI extension `x-wso2-disable-security` . This extension is supported at API, resource, and operation levels. The following is an example of how you can disable security for an API.

``` yml tab="API Level"
openapi: 3.0.0
info:
  version: 1.0.0
  title: Petstore
x-wso2-disable-security: true
  paths:
    "/pet/findByStatus":
      get:
```

``` yml tab="Resource Level"
paths:
 "/pet/findByStatus":
    x-wso2-disable-security: true
    get:
      tags:
      - pet
      summary: Finds Pets by status
      description: Multiple status values can be provided with comma separated strings
      operationId: findPetsByStatus
```

``` yml tab="Operation Level"
paths:
 "/pet/findByStatus":
    get:
      x-wso2-disable-security: true
      tags:
      - pet
      summary: Finds Pets by status
      description: Multiple status values can be provided with comma separated strings
      operationId: findPetsByStatus
```