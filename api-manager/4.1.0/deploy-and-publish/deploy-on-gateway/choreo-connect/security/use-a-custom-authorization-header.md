---
title: "Use a custom authorization header"
description: "Configure a custom authorization header per API or globally when the Authorization header is reserved for another purpose."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/use-a-custom-authorization-header/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/use-a-custom-authorization-header.md
tags:
  - authorization-header
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Use a Custom Authorization Header

By default Choreo Connect uses **Authorization** header to receive the authorization token to secure the APIs. However there can be scenarios where this header needs to be reserved for some other purposes. For example if the backend endpoint of an API requires Authorization header to be present in the request to do perform its own authentication step, you can configure it either in per API or globally at Choreo Connect in order to use a different header to receive the authorization token.

## Per API Configuration

Below extension can be used to do above configuration per API. This extension is not supported in resource level.

``` java tab="Adding OpenAPI extension inside the definition"
x-wso2-auth-header: "XAuth"
```

## Global configuration

This security configuration is to be added in to the config.toml file and it is global for all API in a specific runtime.

``` java tab="Adding configuration"
[security.adapter]
  authorizationHeader = "XAuth"
```