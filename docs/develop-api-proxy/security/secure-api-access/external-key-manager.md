---
title: "Secure API Access with an External Key Manager"
description: "Authenticate API invocations in WSO2 API Platform with an external key manager."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide will walk you through setting up API Platform to authenticate API invocations through an external key manager.

This guide walks you through the following steps:

- Create an application in API Platform and enable external key manager authentication.
- Invoke the API.

## Prerequisites

To follow this guide, you need to satisfy the following prerequisites:

- Configure Custom External Key Manager.
- If you don't already have an API Proxy in API Platform, [create API Proxy](../../../create-api-proxy/overview.md).
- Deploy and publish your API. 
- Create an OAuth2 application in your external key manager.

## Step 1: Create an application in API Platform and enable external key manager authentication

Follow the steps below to consume the API Platform API and use an external key manager for authentication:

1. Sign in to your organization in the API Portal at [https://devportal.bijira.dev](https://devportal.bijira.dev).
2. Click **Applications**, and then click **+Create**.
3. Enter a name for the application. 
4. Click **Create**.
5. Click on the newly created application.
6. At the top of the application page, under **OAuth2** click **+ Add Client ID**. 
7. Enter the **Client ID** from the OAuth2 application you created in your external key manager.
8. Click **+Add**.

    :::note
    - You can only use the Client ID in one application.
    - This will be visible only to organizations where you have configured external key managers. 
    :::

9. Once successfully added, you will be shown a dialog which contains the key manager connection data.
10. You can click on the **Instructions** to view instructions to generate an access token.
11. Click **Subscribe to more APIs** button to explore the APIs and subscribe them through the application.

## Step 2: Invoke the API Platform API

1. In the API Portal, go to your application. 
2. On the top of the page, under **OAuth2**, click **View** to see the **Token Endpoint** URL.
3. Obtain an access token by invoking the token endpoint as follows:

    <Tabs>
    <TabItem value="format" label="Format">

    ``` sh
    curl -X POST <TOKEN_ENDPOINT> \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password" \
        -d "username=<USER_NAME>" \
        -d "password=<USER_PASSWORD>" \
        -d "client_id=<OAUTH2_APP_CLIENT_ID>" \
        -d "client_secret=<OAUTH2_APP_CLIENT_SECRET>" \
        -d "scope=<REQUIRED_SCOPES>"
    ```

    </TabItem>
    </Tabs>

5. Once you receive the access token, you can [test invoking the resource using cURL](../../../test-api-proxy/curl.md) in API Platform.
