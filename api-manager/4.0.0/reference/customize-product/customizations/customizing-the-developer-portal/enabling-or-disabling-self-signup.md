---
title: "Enabling or disabling self signup"
description: "Enable or disable self-signup to the Developer Portal for a specific tenant in a multi-tenant setup."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/customize-product/customizations/customizing-the-developer-portal/enabling-or-disabling-self-signup/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/customize-product/customizations/customizing-the-developer-portal/enabling-or-disabling-self-signup.md
tags:
  - api-manager
  - reference
  - customize-product
  - customizations
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Enabling or Disabling Self Signup

<a name="enabling-self-signup"></a>
#### Enabling self signup

In a multi-tenanted API Manager setup, self signup to the Developer Portal works out-of-the-box for super tenant(`carbon.super`). **But in order to make it work for tenants the following steps should be carried out**.

1. Sign in to the management console ( `https://<HostName>:9443/carbon` ) as tenant admin.

2.  Go to the **Resources &gt; Browse** menu.

    ![Browse resources](../../../../assets/img/learn/browse-resources.png)

3.  Navigate to the `/_system/governance/apimgt/applicationdata/` directory.

4.  Click on `sign-up-config.xml` to load the resource in the registry browser UI and select the **Edit as text** option to edit the configurations.

    ![Edit signup config](../../../../assets/img/learn/signup-config.png)    

5.  Do the following change in the signup configuration and save.

    -   Set `<EnableSignup>` to true.
    -   Set `<AdminUserName>` and `<AdminPassword>` to the credentials of the tenant admin.

    ```xml
    <SelfSignUp>

        <EnableSignup>true</EnableSignup>

        <!-- user storage to store users -->
        <SignUpDomain>PRIMARY</SignUpDomain>

        <!-- Tenant admin information. (for clustered setup credentials for AuthManager) -->
        <AdminUserName>xxxx</AdminUserName>
        <AdminPassword>xxxx</AdminPassword>

        <!-- List of roles for the tenant user -->
        <SignUpRoles>
            <SignUpRole>
                <RoleName>subscriber</RoleName>
                <IsExternalRole>false</IsExternalRole>
            </SignUpRole>
        </SignUpRoles>
    </SelfSignUp>
    ```

#### Disabling self signup

In order to disable self signup for a particular tenant, follow the steps below.

1. Sign in to the management console ( `https://<HostName>:9443/carbon` ) as tenant admin.

2. Click **Resident** under **Identity Providers** on the **Main** tab.

    ![Identity Provider Resident](../../../../assets/img/learn/idp-resident.png)

3. Expand the **Self Registration** tab under **User Onboarding**.

    ![Account Management Policies](../../../../assets/img/learn/user-onboarding-self-onboarding.png)

4. Deselect the **User self registration** property and update the content.

    ![Deselect User Self Registration](../../../../assets/img/learn/deselect-user-self-registration.png)
    
5. When trying to register as a new user on the particular tenant domain, you will see the following message notifying that self registration is disabled.

    ![Self registration disabled](../../../../assets/img/learn/self-signup-disabled.png)

!!! Note
    To enable email verification, update the `repository/deployment/server/webapps/accountrecoveryendpoint/WEB-INF/web.xml` file by setting the `EnableEmailNotification` parameter to `true`:

    ```xml
    <context-param>
        <param-name>EnableEmailNotification</param-name>
        <param-value>true</param-value>
    </context-param>
    ```

!!! tip
    To engage your own signup process, see [Adding a User Signup Workflow](../adding-a-user-signup-workflow.md).