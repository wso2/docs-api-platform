---
title: "Change Your Developer Portal Password"
description: "Change your own sign-in password from the Developer Portal user menu, and optionally disable the change-password feature via deployment.toml."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/consume/user-account-management/change-dev-portal-password/
md_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/consume/user-account-management/change-dev-portal-password.md
tags:
  - api-manager
  - developer-portal
  - user-account-management
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-15
content_type: "how-to"
---

# Change Password for the Developer Portal

Follow the instructions below to change your own password for the Developer Portal:

1. Sign in to the Developer Portal.

     `https://<hostname>:9443/devportal`

     Example: `https://localhost:9443/devportal`

     Use your username and password to sign in
  
2. Click on your username that appears at the top right corner and select **Change Password**.
  
     <img src="../../../assets/img/learn/change-devportal-password-user-menu-click.png" alt="Change Developer Portal password User Menu" width="250px"/>
  
3. Enter your current password, a new password, re-enter the new password, and thereafter click **SAVE** to submit the changes. 

     The new password should adhere to the custom password policies as described below.

     <img src="../../../assets/img/learn/change-devportal-password-submiting.png" alt="Developer portal password change submit" width="600"/>

!!! note

    To disable Change Password for the Developer Portal, add below configuration to `<APIM_HOME>/repository/conf/deployment.toml` file.
    Add this before all the other `[apim.**]` tags in the deployment.toml file.
    
  ```
  [apim]
  enable_change_password = false
  ```