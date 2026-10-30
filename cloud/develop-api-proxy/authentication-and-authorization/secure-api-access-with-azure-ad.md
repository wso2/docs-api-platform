---
title: "Secure API Access with Azure AD"
description: "Configure WSO2 API Platform to authenticate API requests through Microsoft Azure AD as an external key manager with scoped access."
canonical_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/authentication-and-authorization/secure-api-access-with-azure-ad/
md_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/authentication-and-authorization/secure-api-access-with-azure-ad.md
tags:
  - cloud
  - authentication
  - azure-ad
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Secure API Access with Microsoft Azure Active Directory (Azure AD)

API security refers to the measures and practices used to protect Application Programming Interfaces (APIs) from potential threats and vulnerabilities. Authentication and authorization are key aspects of API security. Authentication is ensuring that only authorized users or applications can access the API. This can involve using API keys, tokens, or more advanced authentication methods like OAuth 2.0. Authorization is controlling what authenticated users or applications are allowed to do within the API. Authorization mechanisms restrict access to specific resources and actions based on user roles or permissions.

Organizations using Microsoft Azure AD for identity and access management (IAM) can seamlessly integrate it with API Platform as an external key manager. This guide will walk you through setting up API Platform to authenticate API invocations through Azure AD which is configured as an external key manager.

This guide walks you through the following steps:

- Assign scopes to an API in API Platform.
- Create an API in Azure AD.
- Create an application in Azure AD and consume the Azure API.
- Enable external key manager authentication and create an application in API Platform.
- Invoke the API with scopes.

## Prerequisites

To follow this guide, you need to satisfy the following prerequisites:

-  [Configure Azure AD as an external key manager](../../administer/configure-an-external-idp/configure-azure-ad-as-an-external-idp.md).
-  An API: If you don't already have a service in API Platform, [create an API Proxy](../../create-api-proxy/overview.md).
- Deploy and publish your API.
- An Azure Active Directory account:  If you don’t already have one, set up an Azure Active Directory account at [https://azure.microsoft.com/en-gb/](https://azure.microsoft.com/en-gb/).
- Administrator rights to your API Platform organization: You need this to configure the Azure AD account in your organization.
- To create applications, the `Application Developer` role is required. [Learn more](https://learn.microsoft.com/en-us/azure/active-directory/roles/permissions-reference#application-developer)


## Step 1: Assign scopes to an API in API Platform

You can provide fine-grained access control to your API resources with Permissions (scopes) policy. Follow the steps below to assign a Permission (scope) to the resources in the API.

1. In the **Proxy Listing** pane, click on the component you want to attach scopes to.
2. In the left navigation menu, click **Develop**, then click **Policy**.
3. From the list of resources, click the Attach Policy Button for the required resource.

    ![Policy row showing document and delete action icons on the resource](../../../assets/img/authentication-and-authorization/attach_policy_btn.png){: style="width:200px"}

4. In the **Edit Policies** pane, click **Attach Policy** in the respective flow where you want to attach a policy.

    ![Edit Policies side pane showing Request Flow with OAuth2 policy and Attach Policy links for Response and Error flows](../../../assets/img/authentication-and-authorization/policy_edit_policies.png){: style="width:700px"}

5. In the Policy List pane that opens, click the **Permissions (scope)** policy. This will show the policy configurations.

    ![Configure Permissions Scopes policy panel with Permissions List input field and Add New button](../../../assets/img/authentication-and-authorization/permissions_policy.png){: style="width:700px"}

6. In the **Permissions List** field, add the permission value and click **Add New**.
7. To attach a permission to a resource, select permissions from the **Permissions (Scopes)** list.
8. Once the permissions are configured, click **Add** and **Save** the policies and then the API.
9. From the left navigation menu, click **Deploy** and deploy the API and promote to the production environment.
10. In the left navigation menu, click **Develop** and then **Lifecycle**.
11. Click **Publish** and continue to publish your API to the API Platform Developer Portal.

## Step 2: Create a web API on Azure AD

To enable external key manager authentication for APIs,  create an API on Azure AD that represents the API on API Platform. Follow the steps below:

1. Sign in to the Azure console.
2. Follow the [Azure guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application) to create a Web API that represents your API on API Platform.
3. In the left navigation menu, under **Manage**, select **Expose an API**.
4. Add the default **Application ID URI** and click **Save and Continue**.
5. Under **Scopes defined by this API**, select **Add a scope**.
6. Enter the fully qualified name as the **scope name**.
7. Define who can consent. You can alternatively [add a scope requiring admin consent](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-expose-web-apis#add-a-scope-requiring-admin-consent).
8. Enter appropriate values and click **Add Scope**.

For more information, refer to the Azure documentation:

- [Quickstart: Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Quickstart: Configure an application to expose a web API](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-expose-web-apis)

### Step 2.1: Assign users to the web API

You can restrict users to the API as follows:

1. Go to your Azure AD main menu.
2. Under **Manage**,  click on **Enterprise Applications**. Alternatively, on Microsoft Entra, under **Applications**, click **Enterprise Applications**.
3. Select your API.
4. Under **Manage**, select the **Users and groups** then select **+ Add user/group**.
5. Select the users and groups and click **Select**.

For more information, refer to the Azure documentation: [Assign the app to users and groups to restrict access](Assign the app to users and groups to restrict access)

## Step 3: Create a client application on Azure AD and invoke the Azure web API

To expose the API to application developers, create an application in Azure AD. This application provides you with a client-id and client-secret that your application needs to use to invoke the API.

### Step 3.1: Create a client application

Follow the steps below to create the application:

1. Follow the steps in [Register an application](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application) on Azure to create an application.
2. [Configure the platform settings](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#configure-platform-settings). Enter your client application's redirect URI in the process.

    !!! note
         OAuth2 Authorization Grant flow applies to Web Applications.

### Step 3.2: Consume the Azure AD web API from the Azure AD application

Once you create the application, select the API and the scopes you want the application to consume. Follow the steps below:

1. Go to **Azure Active Directory** and then click **App registrations**.
2. Select your client application (not your web API).
3. In the left navigation menu, click **API permissions**.
4. Click  **+ Add a permission**  and select **My APIs**.
5. Select the API and the required scopes and click **Add Permissions**.
6. Once you add the scope, click on the scope and copy the scope name and keep it for future reference. Use this as the scope when you invoke the authorize and token endpoint in.

For more information, refer to the Azure documentation: [Add permissions to access your web API](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-access-web-apis)


### Step 3.3: Create secrets for the Azure web application

To invoke the application, provide client secrets to the consuming application. Follow the steps below to generate the credentials:

1. In the left navigation menu, click **Certificates & Secrets**.
2. Click **+ New client secret**.
2. Provide a meaningful description and the required expiration.
3. Click **Add**.
4. Copy the created `Secret ID` and `Value` for future reference.
5. In the left navigation menu, click **Overview** and open the overview page of the API.
6. Copy the `Application (client) ID` and save it for future reference.

For more information, refer to the Azure documentation: [Add a Client Secret](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#add-a-client-secret)

## Step 4: Enable external key manager authentication
1. Select Azure Active Directory (Azure AD) as an external key manager

## Step 5: Create an application in API Platform Devportal
Follow the steps below to consume the API Platform API through external key manager for authentication:

1. Sign in to the [API Platform Developer Portal](https://devportal.bijira.dev/).
2. Click **Applications** tab and then click **+Create**.
3. Enter a name for the application.
4. Click **Create** and **Subscribe** to the API you assigned scopes.

## Step 6: Invoke the API with scopes

You can now invoke the API Platform API using the authorization code grant. API Platform will authenticate the user with Azure AD and provide access to the resource.

1. On the API Platform Developer Portal, go to your application.
2. In the overview, under **OAuth2 Credentials**, click **View**.
3. Copy the **Authorize Endpoint** URL.
4. Invoke the authorization endpoint as follows:

    === "Format"

        ``` curl
        {authorize_url}?client_id={client_id}&redirect_uri={redirect_url}&scope={scopes}&response_mode=query&response_type=code
        ```

    === "Example"

        ```
        https://login.microsoftonline.com/dd912d48-b0be-401f-b18c-8ca89e9c0b6c/oauth2/authorize?client_id=5eb1de74-e449-4973-a620-52c4dc9157a9&redirect_uri=https://localhost:9000&scope=api://580b40b7-5513-4714-a4e0-8d4e784f7dc6/urn:taylordean:books:books_addt&response_mode=query&response_type=code
        ```
7. Review the consent in the login screens that prompt and continue.
8. After you log in, you will receive an authorization code in the URL. Copy the authorization code and use it to get an access token from Azure AD by following the next steps.
9. On the API Platform Developer Portal, go to your application.
10. In the overview, under **OAuth2 Credentials**, click **View**.
11. Copy the **Token Endpoint** URL.
12. Invoke the token endpoint as follows:

    === "Format"

        ``` curl
        curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' \
        {token_endpoint} \
        -d 'client_id={client_id}' \
        -d 'scope={scopes}' \
        -d 'code={authorization_code}' \
        -d 'redirect_uri={redirect_url}' \
        -d 'client_secret={The client_secret value you copied from the Azure Application}'
        -d 'grant_type=authorization_code' \
        ```

    === "Example"

        ``` curl
        curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' \
        https://login.microsoftonline.com/dd912d48-b0be-401f-b18c-8ca89e9c0b6c/oauth2/v2.0/token \
        -d 'client_id=5eb1de74-e449-4973-a620-52c4dc9157a9' \
        -d 'scope=api://580b40b7-5513-4714-a4e0-8d4e784f7dc6/urn:taylordean:books:books_add' \
        -d 'code=0.AXAASC…zZUzKYm18yM_5-SXz1uvRbbGYF7F32hE9zIQFRQY35haD' \
        -d 'redirect_uri=https://localhost:9000' \
        -d 'grant_type=authorization_code' \
        -d 'state=111' \
        -d 'client_secret=l4Q8Q~4WKiRXYSQZly5E6Ess.fKf__U1yJR3IaMd'
        ```

14. Once you receive the access token, you can invoke the API by specifying the scope.