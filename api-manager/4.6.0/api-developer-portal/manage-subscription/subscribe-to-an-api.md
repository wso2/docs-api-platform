---
title: "Subscribe to an API"
description: "Subscribe an application to a published API in the Developer Portal with the key generation wizard, then update the tier or unsubscribe later."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-developer-portal/manage-subscription/subscribe-to-an-api/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-developer-portal/manage-subscription/subscribe-to-an-api.md
tags:
  - api-manager
  - api-developer-portal
  - manage-subscription
  - subscribe-to-an-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Subscribe to an API

You have to **subscribe** to a published API before using it in your applications. The subscription process fulfills the authentication process and provides you with access tokens that you can use to invoke an API. 

The examples here use the `PizzaShackAPI` REST API, which is [created](../../api-design-manage/design/create-api/create-rest-api/create-a-rest-api.md) and [published](../../api-design-manage/deploy-and-publish/publish-on-dev-portal/publish-an-api.md) to Developer Portal in WSO2 API Manager.

The following are the two methods available in the Developer Portal to subscribe an API to an application. 

- Subscribe to an existing application

    You can subscribe to a current API by selecting an existing application. 

- Subscribe to an API using Key Generation Wizard

    You can use the **SUBSCRIPTION & KEY GENERATION WIZARD** option to start the subscription process from scratch. It guides you through the process of creating and configuring an application, generating application keys and access tokens, and finally navigates you to the try out page.

## Subscribe to an API using Key Generation Wizard

1.  Sign in to the WSO2 API Developer Portal (`https://<hostname>:<port>/devportal`) and click on the API (e.g., `PizzaShackAPI`) to go to the API overview.

     ![[API overview](../../assets/img/get_started/architecture/developer-portal-overview.png)](../../assets/img/get_started/architecture/developer-portal-overview.png)
 
2.  Click **SUBSCRIPTION & KEY GENERATION WIZARD** to start the key generation wizard.

    <a href="../../../assets/img/learn/key-generation-wizard.png" ><img src="../../../assets/img/learn/key-generation-wizard.png" alt="Key Gen Wizard" title="Key Gen Wizard" /></a>

3.  Enter the application details in the **Create application** process and click **Next** to continue.

    [![Create application process in the wizard](../../assets/img/learn/key-gen-wizard-create-app.png)](../../assets/img/learn/key-gen-wizard-create-app.png)

4.  Subscribe the API to the application that you created in the above step by selecting the preferred throttling policy. Thereafter, click **Next** to go to the next step.
     
     [![Subscribe to new application process](../../assets/img/learn/key-gen-wizard-subscribe.png)](../../assets/img/learn/key-gen-wizard-subscribe.png)
    
5. [Generate application keys](../manage-application/generate-keys/generate-api-keys.md) (Production or sandbox) by clicking on the **Next** button. 

     The application keys are generated in this step.

     [![Key generation](../../assets/img/learn/key-gen-wizard-generate-keys.png)](../../assets/img/learn/key-gen-wizard-generate-keys.png)
    
    !!! note
        - By default, the __Client Credentials__ grant type is used to generate the access token in Developer Portal.
        - If you want to select different grant types for this application, you can select the required grant types from the application listing page as shown in the following image:

        [![Edit grant types](../../assets/img/learn/edit-application-grant-types.png)](../../assets/img/learn/edit-application-grant-types.png)
        
    
6.  Select the access token validity period and [scopes](../../api-security/runtime/authorization/oauth2-scopes/fine-grained-access-control-with-oauth-scopes.md) to generate an access token to invoke the API, then click **Next** to continue.
    
7.  Copy the generated access token. 

8. Click **Finish** to complete the wizard or click **Test** to navigate to the [API Console](../invoke-apis/invoke-apis-using-tools/invoke-an-api-using-the-integrated-api-console.md) so that you can invoke and try out the API.

    [![Copy access token](../../assets/img/learn/key-gen-wizard-access.png)](../../assets/img/learn/key-gen-wizard-access.png)
    
## Subscribe to an existing application

If you already have an existing application, follow the instructions below to subscribe to the API using that application.

1.  Sign in to the Developer Portal (`https://<hostname>:<port>/devportal`) and click on the API (e.g., `PizzaShackAPI`) to go to the API overview.

     [![API overview](../../assets/img/get_started/architecture/developer-portal-overview.png)](../../assets/img/get_started/architecture/developer-portal-overview.png)
        
2.  Click **SUBSCRIBE TO AN APPLICATION**.

     <a href="../../../assets/img/learn/from-existing-app.png" ><img src="../../../assets/img/learn/from-existing-app.png" alt="Subscribe to new app" title="Subscribe to new app" /></a>
    
3.  Select the application, the throttling policy, and click **Subscribe**.

     [![Subscribe to new application](../../assets/img/learn/subscribe-to-app.png)](../../assets/img/learn/subscribe-to-app.png)
    
     You can see the subscriptions list in the **Subscriptions** section.
     
     [![Subscribe to new app](../../assets/img/learn/subscription-list.png)](../../assets/img/learn/subscription-list.png)

## Update the subscription tier

1.  Sign in to the WSO2 API Developer Portal (`https://<hostname>:<port>/devportal`). Click on **Applications** and select the relevant application. 

    [![applications overview_tab](../../assets/img/learn/application-overview.png)](../../assets/img/learn/application-overview.png)

2.  Click **Subscriptions** to list the subscriptions of the application.

    ![Subscriptions overview_tab](../../assets/img/learn/subscriptions-overview-tab.png)
 
3.  Click the **EDIT** icon  of the subscription whose tier needs to be changed, to open the subscription update popup.

    ![Subscriptions update_popup](../../assets/img/learn/subscription-update-popup-start.png)

4.  Select the throttling tier that needs to be updated and click **Update**. This will update the existing subscription with the newly selected throttling tier.
    
    ![Subscription_update_completed](../../assets/img/learn/subscription-update-completed.png)

Follow the steps mentioned in [Adding an API Subscription Update Workflow](advanced-topics/adding-an-api-subscription-tier-update-workflow.md) if you need to configure an approval process to update the subscription tier. 

## Unsubscribe from an API

Follow the instructions below to delete the API subscription:

1.  Sign in to the WSO2 API Developer Portal (`https://<hostname>:<port>/devportal`) and click on the API (e.g., `PizzaShackAPI`) for which you need to delete the application subscription.
    
    [![API Overview](../../assets/img/get_started/architecture/developer-portal-overview.png)](../../assets/img/get_started/architecture/developer-portal-overview.png)
    
2.  Click **Subscriptions**.

    [![API credentials](../../assets/img/learn/api-credentials.png)](../../assets/img/learn/api-credentials.png)
    
3.  Select the subscription that you need to delete and click **UNSUBSCRIBE**.

    [![](../../assets/img/learn/unsubscribe.png)](../../assets/img/learn/unsubscribe.png)
    