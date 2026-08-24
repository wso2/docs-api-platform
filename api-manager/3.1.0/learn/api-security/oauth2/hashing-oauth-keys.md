---
title: "Hashing OAuth2 access tokens"
description: "Enable OAuth2 token hashing to protect access tokens, refresh tokens, and consumer secrets in the database."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/api-security/oauth2/hashing-oauth-keys/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/learn/api-security/oauth2/hashing-oauth-keys.md
tags:
  - api-manager
  - learn
  - api-security
  - oauth2
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "how-to"
---

# Hashing OAuth2 Access Tokens


WSO2 API Manager allows enabling OAuth2 token hashing to protect OAuth2 keys (OAuth2 access tokens, refresh tokens, consumer secrets, and authorization codes) in the event of database security breach.  Once the token hashing is enabled, all the OAuth2 keys will be hashed and stored in the database.

Follow the instructions below to set up OAuth token hashing.

1. Stop the API Manager server if it is already running.

2. Open the `<API-M_HOME>/repository/conf/deployment.toml` file, uncomment the following configuration and set the `enable_token_hashing` value to be `true`.  

    ``` 
    [apim.oauth_config]
    enable_token_hashing = true
    ```

3.  Remove the `CONN_APP_KEY` constraint from the `IDN_OAUTH2_ACCESS_TOKEN` table by running the following command against the database. 

     By default, there can only be one active access token for any consumer key, user, and scope combination. The `CON_APP_KEY` constraint in the `IDN_OAUTH2_ACCESS_TOKEN` table enforces this restriction.
             
     However, when token hashing is enabled, a new access token is issued for every access token request resulting in multiple active access tokens or any consumer key, user, and scope combination. If you need to allow multiple active access tokens to exist, then you need to remove the `CONN_APP_KEY` constraint from the `IDN_OAUTH2_ACCESS_TOKEN` table.

     **Example:**
     
     If you are using an H2 database, you need to run the following command:
    ``` sql
    ALTER TABLE IDN_OAUTH2_ACCESS_TOKEN DROP CONSTRAINT IF EXISTS CON_APP_KEY
    ```
               
4.  [Start the server](../../../install-and-setup/install/running-the-product.md#starting-the-server). 

5.  Follow the [Generate Application Keys](../../consume-api/manage-application/generate-keys/generate-api-keys.md) guide to create a new application, generate application consumer keys, and to obtain an access token.