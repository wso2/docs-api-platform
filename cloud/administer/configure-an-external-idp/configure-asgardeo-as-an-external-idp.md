---
title: "Configure Asgardeo as an external key manager"
description: "Connect your Asgardeo identity provider to API Platform and the Developer Portal to manage API access control with scopes."
canonical_url: https://wso2.com/api-platform/docs/cloud/administer/configure-an-external-idp/configure-asgardeo-as-an-external-idp/
md_url: https://wso2.com/api-platform/docs/cloud/administer/configure-an-external-idp/configure-asgardeo-as-an-external-idp.md
tags:
  - cloud
  - administer
  - key-manager
  - asgardeo
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "how-to"
---

# Configure Asgardeo as an External Key Manager

Asgardeo is an identity-as-a-service (IDaaS) solution designed to create seamless login experiences for your applications. Asgardeo seamlessly integrates with API Platform, providing powerful API access control through the use of API scopes. This enables restricting API access to designated user groups. By configuring Asgardeo as an external key manager in API Platform, you can leverage your Asgardeo user stores to manage API access control effectively. This guide walks you through the steps to set up Asgardeo as your external key manager.

## Prerequisites

Before you proceed, be sure to complete the following:

- Create an Asgardeo application. You can follow the Asgardeo guide to [register a standard-based application](https://wso2.com/asgardeo/docs/guides/applications/register-standard-based-app/#register-an-application).

- Find the well-known URL:
  Go to the **info** tab of the Asgardeo application to view the endpoints and copy the **Discovery** endpoint.

- Find the Client ID:
  Go to the **Protocol** tab of the Asgardeo application and copy the **Client ID**.

## Step 1: Add Asgardeo as an external key manager in API Platform

Follow the steps below to add Asgardeo as an external key manager in API Platform:

1. Sign in to the API Platform Console at [https://console.bijira.dev/](https://console.bijira.dev).
2. In the left navigation menu, click **Admin** and then click **Settings**.
3. In the header, click the **Organization** list. This opens the organization-level settings page.
4. Click the **Key Managers** tab.
5. To add a key manager, click **+ Key Manager**.

    ![Key Managers page listing Bijira Built-in STS with Add Key Manager button highlighted](../../../assets/img/administer/settings/external-km/add_external_km.png)

6. Click **Asgardeo**.

    ![Key manager provider selection showing Asgardeo, Microsoft Entra ID, and Custom tiles](../../../assets/img/administer/settings/external-km/add_external_km_asgardeo_select.png)

7. In the Asgardeo dialog that opens, specify a name and a description for the key manager.
8. In the **Well-Known URL** field, paste the well-known URL that you copied from your Asgardeo instance by following the prerequisites.
9. Leave the **Apply to all environments** checkbox selected. This allows you to use the tokens generated via this key manager to invoke APIs across all environments.

    ![Asgardeo key manager dialog with Name, Description, Well-Known URL, and Environments fields](../../../assets/img/administer/settings/external-km/add_external_km_asgardeo_page_1.png)

<!-- !!! note
     If you want to restrict the use of tokens generated via this key manager to invoke APIs in specific environments, clear the **Apply to all environments** checkbox and select the necessary environments from the **Environments** list. -->

10. Click **Next**. This displays the server endpoints that are useful to implement and configure authentication for your application.

    ![Asgardeo key manager step 2 showing Issuer, Token, Authorization, JWKS, Revoke, and OIDC Logout endpoints](../../../assets/img/administer/settings/external-km/add_external_km_asgardeo_page_2.png)

11. Click **Add**.

Now you have configured Asgardeo as an external key manager in API Platform.

![Key Managers list showing Bijira Built-in STS and newly added external-asgardeo-km entries](../../../assets/img/administer/settings/external-km/add_external_km_asgardeo_list.png)

## Step 2: Add Asgardeo as an external key manager in API Platform Developer Portal

Once the Asgardeo is configured as an external key manager in API Platform, it is necessary to configure it in the API Platform Developer Portal as well. For that, follow the steps below.


1. In the left navigation menu of the API Platform Console, click **Admin** and then click **Settings**.
2. Click the **Developer Portal** tab, then click the **Key Managers** tab. This page will list all the key managers available in API Platform.
3. Select the key manager you configured at [Step 1](#step-1-add-asgardeo-as-an-external-key-manager-in-api-platform).
4. Click **Save**.

Now you have configured Asgardeo as an external key manager in API Platform Developer Portal as well.

![Developer Portal Key Managers tab with external-asgardeo-km selected and Save button](../../../assets/img/administer/settings/external-km/add_external_km_asgardeo_devportal.png)

## What Next?

To secure API access with the above-configured Asgardeo as key manager, follow the steps mentioned [here](../../develop-api-proxy/authentication-and-authorization/secure-api-access-with-asgardeo.md).