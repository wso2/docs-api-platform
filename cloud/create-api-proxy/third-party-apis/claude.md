---
title: "Create API Proxy for Anthropic Claude"
description: "Create and deploy an API proxy for the Anthropic Claude provider in WSO2 API Platform, configure backend authentication, and publish it."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/claude/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/claude.md
tags:
  - cloud
  - api-proxy
  - ai-gateway
  - anthropic
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Create an API Proxy for an Anthropic Claude AI API  

Follow the steps below to create an AI API:  

---

## 1. Access the API Platform Console

1. Sign in to the [API Platform Console](https://console.bijira.dev/) and select your project.  

---

## 2. Create an Anthropic Claude AI API


1. Click **+Create**.
2. Navigate to **Create an API Proxy for Third-Party APIs (Egress)** and click **AI APIs**.  
3. Select the **Anthropic Claude Provider**. 

    ![Create AI API Proxy page with Anthropic Claude API card highlighted among available provider options](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/claude-create.png)  

4. Configure the AI API details, such as:  
    - API Name  
    - Identifier  
    - Version  
    - AI Provider  
    - Target Endpoint  

    ![Create AI API Proxy form with Anthropic Claude API name, identifier, version, base path, type, network visibility, and target fields](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/claude-details.png)  

5. Click **Create** to finalize the AI API creation.  

   Once created, the overview page of the new API appears.  

---

## 3. Configure Backend Settings

1. In the left navigation menu, click **Develop**, then select **Policy**. 

    ![Policy page showing API Proxy Contract routes and Service Contract with Anthropic Claude endpoint](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/claude-policy.png)  

2. Click endpoint **Endpoint Configurations**
    ![Policy page with Endpoint Configuration tooltip highlighted on the Anthropic Claude Service Contract endpoint](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/claude-endpoint.png)

3. Configure **Endpoint Configurations** to handle backend security authentication and authorization. 

     | **API Key Header**        | **API Key**         |
    | ---------------- | ----------------- |
    | x-api-key |  xxxxxxxxxxxxxxxxx    |
   

    ![Endpoint Configuration dialog showing Anthropic Claude endpoint URL with x-api-key header and API key input fields](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/claude-key.png)


## 4. Deploy to development and Production Environments

1. In the left navigation menu, click **Deploy**, Deploy to Development environment

    ![Deploy page showing Build Area, Development environment with Active deployment status, and Production not yet deployed](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/deploy-dev.png)

2. Once it is deploy to development you can test it from Test Console.

3. When you need to promote to production environment you have to provide endponit credentials for production setup.

    ![Deploy page with Development and Production both Active, and Configurations panel showing x-api-key header and API key fields](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/claude-prod.png)

---

## Next Steps

- **Test the AI API** to ensure it correctly forwards requests to the AI service. See [Test REST Endpoints via the OpenAPI Console](../../test-api-proxy/openapi-console.md).  

- **Publish the API for consumers** to enable integration into applications. See [Lifecycle Management](../../develop-api-proxy/lifecycle-management.md).  

By following these steps, you can efficiently integrate Open AI services into your API Platform environment and manage them with ease.  