---
title: "Changing the default token expiration time"
description: "Change the default expiration time for application, user, and refresh access tokens in the deployment.toml configuration file."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/consume-api/manage-application/generate-keys/obtain-access-token/changing-the-default-token-expiration-time/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/consume-api/manage-application/generate-keys/obtain-access-token/changing-the-default-token-expiration-time.md
tags:
  - api-manager
  - learn
  - consume-api
  - manage-application
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "how-to"
---

# Changing the Default Token Expiration Time

Follow the instructions below to change the default token expiry time based on your requirements.


## Changing the default expiration time of application access tokens

Access tokens have an expiration time, which is set to 60 minutes by default.

1. Open the `<API-M_HOME>/repository/conf/deployment.toml` file 
2. Add or update the `app_access_token_validity` value under the `[oauth.token_validation]` section.

    ``` toml
    [oauth.token_validation]
    app_access_token_validity = 2000
    ```

!!! note
    The changes that you do here will be applied only to the new applications that you create.

Alternatively, you can set a default expiration time through the UI when generating/regenerating the application access token.

## Changing the default expiration time of user access tokens

User access tokens have an expiration time, which is set to 60 minutes by default.

1. Open the `<API-M_HOME>/repository/conf/deployment.toml` file 
2. Add or update the `user_access_token_validity` value under the `[oauth.token_validation]` section.

    ``` toml
    [oauth.token_validation]
    user_access_token_validity = 3000
    ```

## Changing the default expiration time of refresh tokens

Refresh access tokens have an expiration time, which is set to 24 hours by default.

1. Open the `<API-M_HOME>/repository/conf/deployment.toml` file.
2. Add or update the `refresh_token_validity` value under the `[oauth.token_validation]` section.

    ``` toml
    [oauth.token_validation]
    refresh_token_validity = 86400
    ```

!!! note
    Finally, your configuration will look as follows if you have configured all the above configurations.
    ``` toml
        [oauth.token_validation]
        app_access_token_validity = 2000
        user_access_token_validity = 3000
        refresh_token_validity = 86400
    ```

In addition, see [Configuring Caching](../../../../../install-and-setup/setup/advance-configurations/configuring-caching.md) for several caching options that you can use to optimize key validation.