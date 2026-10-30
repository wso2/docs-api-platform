---
title: "Create API Proxy from Marketplace"
description: "Create and publish an API proxy for a third-party API available in the WSO2 API Platform Marketplace."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/get-from-marketplace/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/get-from-marketplace.md
tags:
  - cloud
  - api-proxy
  - marketplace
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Creating an API Proxy from Marketplace

API Platform provides built-in support for multiple well-known third-party APIs through the API Platform Marketplace. The marketplace contains API contracts for these third-party services, allowing you to create and publish API proxies effortlessly.

## Steps to Create an API Proxy from the Marketplace

Follow these steps to create an API proxy for a third-party API available in the API Platform Marketplace:

### 1. Access the API Platform Console

1. Sign in to the [API Platform Console](https://console.bijira.dev/) and select your project.

### 2. Select a Third-Party API

1. Click **+Create**.
2. Navigate to **Create an API Proxy for Third-Party APIs (Egress)** and click **Get From Marketplace**.
3. In the **Create API Proxy from Marketplace** page, browse or search for the desired third-party API.
4. Select the API you want to integrate.

### 3. Configure API Proxy Details

1. Update the required API proxy details, such as:
    - API Name
    - Identifier
    - Version
    - Target
2. Review and confirm the configuration settings.

    ![Create API Proxy from Marketplace form showing Currency API name, identifier, version, base path, description, target, and access mode fields](../../../assets/img/create-api-proxy/third-party-apis/marketplace/third-party-api-details.png)

3. Click **Create** to finalize the API proxy creation.

   Once created, the overview page of the new API proxy appears.

### 4. Configure Backend Settings

1. In the left navigation menu, click **Develop**, then select **Policy**.
2. Depending on the third-party API requirements, configure **Endpoint Configurations** or set up an **API-level mediation policy** to handle authentication and authorization.

#### Example: Configuring the `Currency API`

To integrate the `Currency API`, follow these steps:

1. In the **Policy** page, click **Endpoint Configuration** under **Service Contract**.
2. Click **Configure**.
3. Enter the required authentication details:
    - **API Key Header**
    - **API Key**

4. Click **Save** to apply the configuration.

   ![Policy page with Configurations panel showing Currency API endpoint URL, API Key Header, and API Key input fields](../../../assets/img/create-api-proxy/third-party-apis/marketplace/third-party-api-backend-configuration.png)

### Next Steps

- Test the API proxy to ensure it correctly forwards requests to the third-party API. See [Test REST Endpoints via the OpenAPI Console](../../test-api-proxy/openapi-console.md).
- Apply additional policies if needed (e.g., rate limiting, security policies). See [Policy Overview](../../develop-api-proxy/policy/attach-and-manage-policies.md#attach-a-policy).
- Publish the API for consumers.  See [Lifecycle Management](../../develop-api-proxy/lifecycle-management.md).

By following these steps, you can seamlessly integrate third-party APIs into your API Platform environment and manage them efficiently.