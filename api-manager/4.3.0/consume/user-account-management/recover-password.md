---
title: "Recover password"
description: "Recover a forgotten Developer Portal password using the Forgot Password link and an email-based reset flow."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/consume/user-account-management/recover-password/
md_url: https://wso2.com/api-platform/docs/api-manager/4.3.0/consume/user-account-management/recover-password.md
tags:
  - api-manager
  - consume
  - user-account-management
  - recover-password
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-17
content_type: "how-to"
---

# Recover Password

!!! note
    The password recovery feature does not work out-of-the-box because an email server needs to be configured to be able to send the password recovery email. For more information, see [Enable Password Recovery](../../install-and-setup/setup/security/user-account-management.md#enable-password-recovery).

1.  Click **Forgot Password** on the Sign In page and request a password change.

    <img src="../../../assets/img/administer/product-security/identity-management-for-the-api-dev-portal/forgot-password.png" alt="Forgot password link in sign in page" width="400px"/>

3.  Enter the username you are trying to recover the password of and click **Submit**.

    <img src="../../../assets/img/administer/product-security/identity-management-for-the-api-dev-portal/password-recovery-form.png" alt="Password recovery page" width="400px"/>

     You will receive an email with instructions to reset your password. 

     <img src="../../../assets/img/administer/product-security/identity-management-for-the-api-dev-portal/password-recovery-email-sent.png" alt="Password recovery email confirmation" width="450px"/>

     The password recovery email is sent to the email address that is provided during the Developer Portal user sign up process.