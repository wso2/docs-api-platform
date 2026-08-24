---
title: "Overview"
description: "Overview of API authentication mechanisms in API Manager, including OAuth2 tokens, API keys, mutual SSL, basic authentication, and multiple Key Managers."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/design/api-security/api-authentication/api-authentication-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/design/api-security/api-authentication/api-authentication-overview.md
tags:
  - api-manager
  - design
  - api-security
  - api-authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Overview

API authentication is a way of protecting API access from unidentified or anonymous access. It ensures that the API is secured and accessible only by the consumers who proves their identity and whose identities are found within the API Management Platform. 

WSO2 API Manager offers the following authentication mechanisms to secure your API from unauthenticated access.

- [Securing APIs using OAuth2 Access Tokens](secure-apis-using-oauth2-tokens)

    - [JWT (Self Contained) Access Tokens](../oauth2/access-token-types/jwt-tokens)
    
- [Secure APIs Using API Keys](secure-apis-using-api-keys)

- [Secure APIs Using Mutual SSL](secure-apis-using-mutual-ssl)

- [Secure APIs Using Basic Authentication](secure-apis-using-basic-authentication)


WSO2 API Manager allows you to enable multiple Key Managers for authentication.

- The tenant admin can configure preferred Key Managers via the Admin Portal console. For more information, see
[Configuring Key Managers](../../../administer/key-managers/overview).

- The enabled Key Managers can be disabled for a given API via the Publisher by navigating to
**Develop -> API Configurations -> Runtime -> Application Level Security -> Key Manager Configuration**

    [![Disable Key Managers](../../../assets/img/learn/multiple-km-publisher.png)](../../../assets/img/learn/multiple-km-publisher.png)

- Application users are able to generate keys for an application using a preferred Key Manager as shown below.

    [![Disable Key Managers](../../../assets/img/learn/multiple-km-devportal.png)](../../../assets/img/learn/multiple-km-devportal.png)