---
title: "Multiple active access tokens"
description: "Configure WSO2 API Manager to allow multiple active OAuth2 access tokens for the same consumer key and user."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/design/api-security/oauth2/multiple-active-access-tokens/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/design/api-security/oauth2/multiple-active-access-tokens.md
tags:
  - api-manager
  - design
  - api-security
  - oauth2
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Multiple Active Access Tokens

WSO2 API Manager by default allows only one active access token to be in existence for the same Consumer Key, User and Scope combination at a given time. This behaviour can be modified to allow multiple access tokens as described in the following sections.

## JWT

When issuing `JWT` tokens before the expiry or revocation of the previous token, the default behaviour is to revoke the previous token and issue a new token. With the following configuration, it can be configured to issue a new token before expiry and without revoking the old token, allowing the existence of multiple active access tokens at the same time.

```toml
[oauth.jwt.renew_token_without_revoking_existing]
enable = true
```

By default only the `client_credentials` grant type is allowed to generate multiple access tokens. This can be configured by the following configuration.

```toml
[oauth.jwt.renew_token_without_revoking_existing]
enable = true
allowed_grant_types = [“client_credentials”, “password”]
```

!!! note
    If you are customizing the `allowed_grant_types` make sure to add or remove the default value `client_credentials` as per the requirement.