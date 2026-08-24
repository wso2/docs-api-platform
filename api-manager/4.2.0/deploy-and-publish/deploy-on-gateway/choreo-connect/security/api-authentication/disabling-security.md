---
title: "Disabling security for APIs"
description: "Reference the x-wso2-disable-security OpenAPI extension used to disable authentication for an API, resource, or operation."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authentication/disabling-security/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authentication/disabling-security.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# Disabling Security for APIs

An API can be invoked without authentication by disabling security. Pick one of the following methods to disable security depending on the Choreo Connect **mode** you have chosen.


|**Mode**         | **Method**    |
|--------------|-----------|
|[Choreo Connect with WSO2 API Manager as a Control Plane](../../concepts/apim-as-control-plane)   | [Via WSO2 API Manager Publisher Portal](#via-wso2-api-manager-publisher-portal)  |
|[Choreo Connect as a Standalone Gateway](../../concepts/as-a-standalone-gateway)  |[By Updating the OpenAPI Definition](#by-updating-the-openapi-definition) |

## Via WSO2 API Manager Publisher Portal

Follow the steps given in [Disabling Security for APIs](../../../../../design/api-security/api-authentication/disable-security).

## By updating the OpenAPI definition

APIs can be exposed without requiring any authentication (i.e. disable transport security and application security) using the OpenAPI extension `x-wso2-disable-security` . This extension is supported at API, resource, and operation levels. The following is an example of how you can disable security for an API.

=== "API Level"
    ``` yaml
    openapi: 3.0.0
    info:
      version: 1.0.0
      title: Petstore
    x-wso2-disable-security: true
      paths:
        "/pet/findByStatus":
          get:
    ```

=== "Resource Level"
    ``` yaml
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

=== "Operation Level"
    ``` yaml
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