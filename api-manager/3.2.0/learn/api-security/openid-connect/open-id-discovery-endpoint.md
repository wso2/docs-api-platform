---
title: "OpenID connect discovery"
description: "The OpenID Connect discovery endpoint in WSO2 API Manager, used to find a user's OpenID provider and its OAuth 2.0 endpoints."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/learn/api-security/openid-connect/open-id-discovery-endpoint/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/learn/api-security/openid-connect/open-id-discovery-endpoint.md
tags:
  - api-manager
  - learn
  - api-security
  - openid-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-22
content_type: "reference"
---

# OpenID Connect Discovery

WSO2 API Manager supports OpenID Connect Discovery to discover an end user's OpenID provider, and also to obtain information required to interact with the OpenID provider, including its OAuth 2.0 endpoint locations, by exposing an API in the Gateway.

The OpenID Connect discovery endpoint is as follows:

`https://<gateway_hostname>:<port>/oidcdiscovery/.well-known/openid-configuration`

You can obtain openid-configuration information as a payload by invoking the openid-configuration endpoint. The format of the cURL command and a sample is given below:

**Sample Request**

``` bash tab="Format"
curl -v -k https://<gateway_hostname>:<port>/oidcdiscovery/.well-known/openid-configuration
```

``` bash tab="Example"
curl -v -k https://localhost:8243/oidcdiscovery/.well-known/openid-configuration

```

**Sample Response**

``` java
{
    "scopes_supported":[
        "address",
        "phone",
        "email",
        "profile",
        "openid"
    ],
    "check_session_iframe":"https://localhost:9443/oidc/checksession",
    "issuer":"https://localhost:9443/oauth2/token",
    "authorization_endpoint":"https://localhost:9443/oauth2/authorize",
    "claims_supported":[
        "formatted",
        "name",
        "phone_number",
        "given_name",
        "picture",
        "region",
        "street_address",
        "postal_code",
        "zoneinfo",
        "locale",
        "profile",
        "locality",
        "sub",
        "updated_at",
        "email_verified",
        "nickname",
        "middle_name",
        "email",
        "family_name",
        "website",
        "birthdate",
        "address",
        "preferred_username",
        "phone_number_verified",
        "country",
        "gender",
        "iss",
        "acr"
    ],
    "token_endpoint":"https://localhost:9443/oauth2/token",
    "response_types_supported":[
        "id_token token",
        "code",
        "id_token",
        "token"
    ],
    "end_session_endpoint":"https://localhost:9443/oidc/logout",
    "userinfo_endpoint":"https://localhost:9443/oauth2/userinfo",
    "jwks_uri":"https://localhost:9443/oauth2/jwks",
    "subject_types_supported":[
        "pairwise"
    ],
    "id_token_signing_alg_values_supported":[
        "RS256"
    ],
    "registration_endpoint":"https://localhost:9443/identity/connect/register"
}
```