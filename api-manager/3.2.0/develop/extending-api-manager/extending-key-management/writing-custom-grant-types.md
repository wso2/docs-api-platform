---
title: "Writing custom grant types"
description: "Add custom OAuth 2.0 grant types to WSO2 API Manager beyond the four the specification defines, and extend the existing ones."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/develop/extending-api-manager/extending-key-management/writing-custom-grant-types/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/develop/extending-api-manager/extending-key-management/writing-custom-grant-types.md
tags:
  - api-manager
  - develop
  - extending-api-manager
  - extending-key-management
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-22
content_type: "how-to"
---

# Writing Custom Grant Types

OAuth 2.0 authorization servers provide support for four main grant types according to the OAuth 2.0 specification. They also allow you to add custom grant types and extend the existing ones.

To implement custom grant types for the API Manager, see [Writing a Custom OAuth 2.0 Grant Type](https://is.docs.wso2.com/en/5.10.0/learn/writing-a-custom-oauth-2.0-grant-type/) in the WSO2 Identity Server documentation.

!!! Info 
    **If you are using a GA released API-M 3.2.0 distribution or a WUM updated API-M 3.2.0 distribution on or before 23rd of October 2020,**

    Note that API Manager has already customized the Grant Type handlers for `authorization_code`, `password`, `client_credentials`, and `saml2-bearer` grant types. If you require any additional functionality for these grant types, it is advisable to extend the following grant handler implementations.

    | Grant Type                                                               | Existing Handler Class (which can be extended if required)                                              |
    |--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
    | `authorization_code`| `org.wso2.carbon.apimgt.keymgt.handlers.ExtendedAuthorizationCodeGrantHandler` |
    | `password`| `org.wso2.carbon.apimgt.keymgt.handlers.ExtendedPasswordGrantHandler`|
    | `client_credentials`| `org.wso2.carbon.apimgt.keymgt.handlers.ExtendedClientCredentialsGrantHandler` |
    | `urn:ietf:params:oauth:grant-type:saml2-bearer` | `org.wso2.carbon.apimgt.keymgt.handlers.ExtendedSAML2BearerGrantHandler`|
    | `refresh_token`| `org.wso2.carbon.identity.oauth2.token.handlers.grant.RefreshGrantHandler` |

!!! Info 
    **If you are using a WUM updated API-M 3.2.0 distribution after 23rd of October 2020 or an Update 2.0 based API-M 3.2.0 distribution,**

    If you require any additional functionality for these grant types, it is advisable to extend the following grant handler implementations.

    | Grant Type                                                               | Existing Handler Class (which can be extended if required)                                              |
    |--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
    | `authorization_code`| `org.wso2.carbon.identity.oauth2.token.handlers.grant.AuthorizationCodeGrantHandler` |
    | `password`| `org.wso2.carbon.identity.oauth2.token.handlers.grant.PasswordGrantHandler`|
    | `client_credentials`| `org.wso2.carbon.identity.oauth2.token.handlers.grant.ClientCredentialsGrantHandler` |
    | `urn:ietf:params:oauth:grant-type:saml2-bearer` | `org.wso2.carbon.identity.oauth2.token.handlers.grant.saml.SAML2BearerGrantHandler`|
    | `refresh_token`| `org.wso2.carbon.identity.oauth2.token.handlers.grant.RefreshGrantHandler` |