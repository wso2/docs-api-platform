---
title: "API authentication"
description: "Learn about the application-level and transport-level API authentication options available in Choreo Connect."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authentication/api-authentication/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/deploy-and-publish/deploy-on-gateway/choreo-connect/security/api-authentication/api-authentication.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "concept"
---

# API Authentication

Choreo Connect provides the ability to secure APIs in API level and resource levels. The following section would concisely guide you through the available security options in Choreo Connect. API security can be divided into two main categories; namely, Application-level security and Transport-level security.

By default, APIs are secured with application security. However, if you want to disable security for the API or only for a specific resource, see [Disabling Security](disabling-security.md).

### Application Security
Application security can be provided in the API and resource levels. The following are the API authentication types granted by Choreo Connect.

- [OAuth 2.0 Authentication](oauth2-access-tokens.md) 

- [Publisher Internal Key Authentication](internal-key-authentication.md)

- [API Key Authentication](api-key-authentication.md)

- [Enforcer Test Key Authentication](../generate-a-test-jwt.md)

Once authenticated, end-user attributes can be passed to the backend by enabling [Backend JWT Generation](../../passing-enduser-attributes-to-the-backend-via-choreo-connect.md).
                        
<!-- TODO: Enable once the feature is completed for MGW 4.0.0
   [Opaque token authentication]({{ base_path }}/publish/security/api-authentication/secure-apis-using-oauth2.0-access-tokens/secure-apis-using-opaque-tokens/)
   [Basic authentication](../../../../../design/api-security/api-authentication/secure-apis-using-basic-authentication.md)

-->

<!-- TODO: Enable once the feature is completed for MGW 4.0.0
If you provide two or more security types for a resource or API, API invocation would be successful if one of the given authentications passed for the API request. i.e. Application security types have OR relationship with one another.

### Transport Security

Mutual SSL support is provided in the gateway level and API Level in Choreo Connect. Mutual SSL authentication is supported at the API level.

-   [Mutual SSL authentication](../../../../../design/api-security/api-authentication/secure-apis-using-mutual-ssl.md)

### Combine Application and transport Security for API Authentication

By default, Application security is mandatory for API authentication. However, if you enable transport security for API authentication (i.e. if you enabled mutual SSL authentication for the API), you can make application security to be optional so that application security is not necessarily be added to the API/resource. Follow the documentation on [make application security optional]({{ base_path }}/deploy/api-microgateway/security/api-authentication/making-application-security-optional/) for more details.

By default Application security and transport security is in AND relationship. i.e. if mutual SSL authentication is enabled, a successful API invocation requires passing the mutual SSL handshake as well as passing one of the provided application security. To override this behavior, i.e. to combine Application security and transport security authentication schemes with OR combination, make application security optional. For more details, follow the documentation on [make application security optional]({{ base_path }}/deploy/api-microgateway/security/api-authentication/making-application-security-optional/)

-->