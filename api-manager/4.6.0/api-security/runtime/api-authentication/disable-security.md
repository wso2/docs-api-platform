---
title: "Disabling security for APIs"
description: "Switch off security for a single API resource or for every resource of an API in the Publisher, so it can be invoked without an access token."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-security/runtime/api-authentication/disable-security/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-security/runtime/api-authentication/disable-security.md
tags:
  - api-manager
  - api-security
  - runtime
  - api-authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Disabling Security for APIs

WSO2 API Manager enables OAuth 2.0 security for APIs by default. Therefore, all APIs must be invoked with an access token. You can get an access token in the following ways.

- [Get an internal test key from Publisher](../../../api-design-manage/design/create-api/create-rest-api/test-a-rest-api.md)
- [Get an access token for a subscription from Developer Portal](../../../api-developer-portal/consume-api-overview.md)

For testing purposes, you can eliminate the need of an access token by disabling security for the entire API or a specific resource.

## Disabling security for a single API resource

1. Click **Resources** listed under **API Configurations** in the left menu to navigate to the Resources page in the Publisher.

     [![Select resource page](../../../assets/img/learn/prototype-api/create-prototype-api-resource-page.png)](../../../assets/img/learn/prototype-api/create-prototype-api-resource-page.png)

2. Expand any method and switch the security slidebar off to disable security for that specific resource.

     [![Disable security for a Prototype API resource](../../../assets/img/learn/prototype-api/create-prototype-api-resource-disable-sec.png)](../../../assets/img/learn/prototype-api/create-prototype-api-resource-disable-sec.png)

## Disabling security for all API resources

1. Click **Resources** to navigate to the Resources page in the Publisher.

2. Click on the lock icon to disable security for all the resources that correspond to a specific API.

     [![Disable security for all resources of a Prototype API](../../../assets/img/learn/prototype-api/create-prototype-api-resource-disable-all-sec.png)](../../../assets/img/learn/prototype-api/create-prototype-api-resource-disable-all-sec.png)