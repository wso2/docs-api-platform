---
title: "Overview"
description: "Authentication mechanisms that protect APIs in WSO2 API Manager: OAuth2 access tokens, API keys, mutual SSL, basic auth, and multiple Key Managers."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-security/runtime/api-authentication/api-authentication-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-security/runtime/api-authentication/api-authentication-overview.md
tags:
  - api-manager
  - api-security
  - runtime
  - api-authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "concept"
---

# Overview

API authentication is a way of protecting API access from unidentified or anonymous access. It ensures that the API is secured and accessible only by the consumers who proves their identity and whose identities are found within the API Management Platform. 

WSO2 API Manager offers the following authentication mechanisms to secure your API from unauthenticated access.

- [Securing APIs using OAuth2 Access Tokens](../../../api-security/runtime/api-authentication/secure-apis-using-oauth2-tokens.md)

    - [JWT (Self Contained) Access Tokens](../../../api-security/key-management/tokens/jwt-tokens.md)
    
- [Secure APIs Using API Keys](../../../api-security/runtime/api-authentication/secure-apis-using-api-keys.md)

- [Secure APIs Using Mutual SSL](../../../api-security/runtime/api-authentication/secure-apis-using-mutual-ssl.md)

- [Secure APIs Using Basic Authentication](../../../api-security/runtime/api-authentication/secure-apis-using-basic-authentication.md)


WSO2 API Manager allows you to enable multiple Key Managers for authentication.

- The tenant admin can configure preferred Key Managers via the Admin Portal console. For more information, see
[Configuring Key Managers](../../../api-security/key-management/third-party-key-managers/overview.md).

- The enabled Key Managers can be disabled for a given API via the Publisher by navigating to
**Develop -> API Configurations -> Runtime -> Application Level Security -> Key Manager Configuration**

    [![Disable Key Managers](../../../assets/img/learn/multiple-km-publisher.png)](../../../assets/img/learn/multiple-km-publisher.png)

- Application users are able to generate keys for an application using a preferred Key Manager as shown below.

    [![Disable Key Managers](../../../assets/img/learn/multiple-km-devportal.png)](../../../assets/img/learn/multiple-km-devportal.png)