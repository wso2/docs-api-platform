---
title: "Token-Based Rate Limiting for AI APIs"
description: "Configure token-based rate limiting on AI API proxies in WSO2 API Platform to control usage and cost per prompt, completion, and total tokens."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/token-ratelimit/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/third-party-apis/token-ratelimit.md
tags:
  - cloud
  - api-proxy
  - ai-gateway
  - rate-limiting
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Token-based rate limiting

AI services often incur costs on a per-token basis, making usage control critical.
API Platform’s AI Gateway introduces token-based rate limiting that can be applied at the API level.

## Configure Token Based Ratelimit Policy

1. In the left navigation menu, click **Develop**, then select **Policy**. 

    ![Policy page showing API Proxy Contract routes and Service Contract with Azure OpenAI endpoint](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/azure-policy.png)  

2. Click a Add API Level Policy --> Request flow --> Attached mediation policy

    ![Mediation Policy List panel showing Token Based Rate Limiting option](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/api-level-policy.png)  

3. Add the ratelimit information and click save.

     ![Configure Token Based Rate Limiting Policy dialog with Max Prompt Token Count, Max Completion Token Count, Max Total Token Count, and Time Limit fields](../../../assets/img/create-api-proxy/third-party-apis/ai-apis/token-ratelimit.png)  