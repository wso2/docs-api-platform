---
title: "Configure Azure AD as an external key manager"
description: "Connect Microsoft Azure Active Directory (Azure AD) to API Platform and the Developer Portal to manage API access control with scopes."
canonical_url: https://wso2.com/api-platform/docs/cloud/administer/configure-an-external-idp/configure-azure-ad-as-an-external-idp/
md_url: https://wso2.com/api-platform/docs/cloud/administer/configure-an-external-idp/configure-azure-ad-as-an-external-idp.md
tags:
  - cloud
  - administer
  - key-manager
  - azure-ad
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "how-to"
---

# Configure Azure Active Directory (Azure AD) as an External Key Manager

In organizations leveraging Microsoft Azure Active Directory (Azure AD) as a key manager, integrating it with API Platform offers powerful API access control. This control hinges on the use of API scopes. That is, it enables the restriction of access to a designated group of users. This document guide you step-by-step to configure Azure AD as your external key manager.

## Prerequisites

Before you try out this guide, be sure you have the following:

- An Azure Active Directory account:  If you don’t already have one,  setup an Azure Active Directory account at [https://azure.microsoft.com/en-gb/](https://azure.microsoft.com/en-gb/).
- Administrator rights to your API Platform organization: You need this to configure the Azure AD account in your organization.

## Step 1: Add Azure Active Directory as an external key manager in API Platform

Follow the steps below to add Azure AD as a key manager in API Platform:

1. Sign in to the API Platform Console at [https://console.bijira.dev/](https://console.bijira.dev).
2. In the left navigation menu, click **Settings**.
3. In the header, click the **Organization** list. This will open the organization level settings page.
4. On the **Key Managers** tab, click **+ Key Manager**.
5. Select  **Microsoft Entra ID (Azure AD)** as the key manager.

    ![Key Managers page listing Bijira Built-in STS with Add Key Manager button highlighted](../../../assets/img/administer/settings/external-km/add_external_km.png)

6. Click **Microsoft Entra ID (Azure AD)**.

    ![Key manager provider selection with Microsoft Entra ID (Azure AD) tile highlighted](../../../assets/img/administer/settings/external-km/add_external_km_azure_select.png)

7. In the Azure AD dialog that opens, specify a name and a description for the key manager.
8. To obtain the `Well-Known URL` of your Azure AD instance, on your Azure account, under **Azure Active Directory** go to **App registrations**, and then **Endpoints**. Copy the URI under`OpenID Connect metadata document`.

    !!! info
        - In azure, there are two versions of access tokens available. By default, the key manager applications you create use the v1 access token. Therefore, if you intend to use the v1 access token, when providing the `Well-Known URL`, omit the v2.0 path segment from the URL. [Learn more](https://learn.microsoft.com/en-us/azure/active-directory/develop/access-tokens#token-formats)
        For example, convert `https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration`-> `https://login.microsoftonline.com/<tenant-id>/.well-known/openid-configuration`
        - If you intend to work with v2.0, then the key manager application's manifest should be changed as explained in the [access token documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/access-tokens#token-formats).

9. Leave the **Apply to all environments** checkbox selected. This allows you to use the tokens generated via this key manager to invoke APIs across all environments.

    ![Azure AD key manager dialog with Name, Description, Well-Known URL, and Environments fields](../../../assets/img/administer/settings/external-km/add_external_km_azure_page_1.png)

10. Click **Next**. This displays the server endpoints that are useful to implement and configure authentication for your application.

    ![Azure AD key manager step 2 showing Issuer, Token, Authorization, JWKS, Revoke, and OIDC Logout endpoints](../../../assets/img/administer/settings/external-km/add_external_km_azure_page_2.png)

11. Click **Add**.

Now you have configured Azure AD as an external key manager in API Platform.

![Key Managers list showing Bijira Built-in STS and newly added external-azure-km entries](../../../assets/img/administer/settings/external-km/add_external_km_azure_list.png)

## Step 2: Add Azure AD as an external key manager in API Platform Developer Portal

Once the Azure AD is configured as an external key manager in API Platform, it is necessary to configure it in the API Platform Developer Portal as well. For that, follow the steps below.

1. In the left navigation menu of the API Platform Console, click **Admin** and then click **Settings**.
2. Click the **Developer Portal** tab, then click the **Key Managers** tab. This page will list all the key managers available in API Platform.
3. Select the key manager you configured at [Step 1](#step-1-add-azure-active-directory-as-an-external-key-manager-in-api-platform).
4. Click **Save**.

Now you have configured Azure AD as an external key manager in API Platform Developer Portal as well.

![Developer Portal Key Managers tab with external-azure-km selected and Save button](../../../assets/img/administer/settings/external-km/add_external_km_azure_devportal.png)