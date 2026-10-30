---
title: "Create API Proxy for OpenAI"
description: "Create and deploy an API proxy for the OpenAI provider in WSO2 API Platform, configure backend authentication, and publish it for consumers."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/open-ai/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/open-ai.md
tags:
  - cloud
  - api-proxy
  - ai-gateway
  - openai
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Create an API Proxy for an Open AI API  

Follow the steps below to create an AI API:  

---

## 1. Access the API Platform Console

1. Sign in to the [API Platform Console](https://console.bijira.dev/) and select your project.  

---

## 2. Create an Open AI API


1. Click **+Create**.
2. Navigate to **Create an API Proxy for Third-Party APIs (Egress)** and click **AI APIs**.  
3. Select the **OpenAI Provider**. 

    ![Create AI API Proxy page with OpenAI API card highlighted among available provider options](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/create-open-ai.png)  

4. Configure the AI API details, such as:  
    - API Name  
    - Identifier  
    - Version  
    - AI Provider  
    - Target Endpoint  

    ![Create AI API Proxy from Marketplace form showing OpenAI API name, identifier, version, base path, description, target, and access mode fields](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/configure-ai-api-details.png)  

5. Click **Create** to finalize the AI API creation.  

   Once created, the overview page of the new API appears.  

---

## 3. Configure Backend Settings

1. In the left navigation menu, click **Develop**, then select **Policy**. 

    ![Policy page showing API Proxy Contract routes and Service Contract with OpenAI endpoint](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/openai-policy-view.png)  

2. Click endpoint **Endpoint Configurations**
    ![Policy page with Endpoint Configuration tooltip highlighted on the OpenAI Service Contract endpoint](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/openai-endpoint-policy.png)

3. Configure **Endpoint Configurations** to handle backend security authentication and authorization. 

     | **API Key Header**        | **API Key**         |
    | ---------------- | ----------------- |
    | Authorization | Bearer xxxxxxxxxxxxxxxxx    |
   

    ![Endpoint Configuration dialog showing OpenAI endpoint URL with empty API Key Header and API Key input fields](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/openai-endpoint-config.png)


## 4. Deploy to development and Production Environments

1. In the left navigation menu, click **Deploy**, Deploy to Development environment

    ![Deploy page showing Build Area, Development environment with Active deployment status, and Production not yet deployed](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/deploy-dev.png)

2. Once it is deploy to development you can test it from Test Console.

3. When you need to promote to production environment you have to provide endponit credentials for production setup.

    ![Deploy page with Development and Production both Active, and Configurations panel showing Authorization header and Bearer token API key fields](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/deploy-prod.png)

---

## Next Steps

- **Test the AI API** to ensure it correctly forwards requests to the AI service. See [Test REST Endpoints via the OpenAPI Console](../../test-api-proxy/openapi-console.md).  

- **Publish the API for consumers** to enable integration into applications. See [Lifecycle Management](../../develop-api-proxy/lifecycle-management.md).  

By following these steps, you can efficiently integrate Open AI services into your API Platform environment and manage them with ease.  