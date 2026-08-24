---
title: "Test a REST API using Postman"
description: "Download an OpenAPI definition as a Postman collection and test the REST API using Postman."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/consume/invoke-apis/invoke-apis-using-tools/try-out-using-postman/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/consume/invoke-apis/invoke-apis-using-tools/try-out-using-postman.md
tags:
  - api-manager
  - consume
  - invoke-apis
  - invoke-apis-using-tools
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Test a REST API Using Postman

You can download a Postman collection for an **OpenAPI** using WSO2 API Manager, and test the REST API using Postman.

!!! note "Try out using the Integrated API Console"
    If required, instead of using Postman you can try out your REST APIs using the [Integrated API Console](invoke-an-api-using-the-integrated-api-console.md) in WSO2 API Manager.
    
Let's download an OpenAPI as a Postman collection and try it out using Postman.

## Step 1 - Download a Postman collection for the API

Follow the instructions below to download an OpenAPI as a Postman collection:

1.  Sign in to the WSO2 Developer Portal.

     `https://<hostname>:9443/devportal`

2. Click an API (e.g., `PizzaShackAPI`) to go to the API overview.

    [![API overview](../../../assets/img/learn/postman_api_overview.png)](../../../assets/img/learn/postman_api_overview.png)

2.  Click **Try Out** to go to the Try out section.

    [![Postman try out](../../../assets/img/learn/postman_try_out.png)](../../../assets/img/learn/postman_try_out.png)

3.  [Subscribe to an API](../../manage-subscription/subscribe-to-an-api.md) if you have not done so already.

4. Select the application name and click **Postman collection**.
     
     This downloads the Postman collection.

    [![Collection download](../../../assets/img/learn/postman_download_collection.png)](../../../assets/img/learn/postman_download_collection.png)
    
## Step 2 - Try out the collection in Postman

Follow the instructions below to try out the Postman collection that contains the Open API.

1. Get the authentication code.
     
     This is required because the Postman collection is secured.

     1. Click **Subscriptions**.

     2. Click the **PROD KEYS** to generate an Access Token.

         [![Subscriptions](../../../assets/img/learn/postman_subscriptions.png)](../../../assets/img/learn/postman_subscriptions.png)

     3. Click **Generate Access Token** to generate a new token. 

         [![Generate token](../../../assets/img/learn/postman_generate_token.png)](../../../assets/img/learn/postman_generate_token.png)
    
     4. Click **Generate**.

         [![Generate dialog](../../../assets/img/learn/postman_generate_dialog.png)](../../../assets/img/learn/postman_generate_dialog.png)
    
     5. **Copy** the access token you generated.

2. Open the Postman application and click **Import** to import the Postman collection file that you downloaded.

     [![Import Postman](../../../assets/img/learn/postman_import.png)](../../../assets/img/learn/postman_import.png)

3. Select a resource from the Postman collection to test.

4. Click on the **Authorization** tab and select **Bearer Token** as the token type.

     [![Token type](../../../assets/img/learn/postman_token_type.png)](../../../assets/img/learn/postman_token_type.png)

5. Paste the copied token.

6. Click **Send** to proceed.

     [![Put token](../../../assets/img/learn/postman_put_token.png)](../../../assets/img/learn/postman_put_token.png)

     You can now see the result under the **Body** tab.

     [![Postman result](../../../assets/img/learn/postman_result.png)](../../../assets/img/learn/postman_result.png)