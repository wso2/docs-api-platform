---
title: "Add and manage policies on the Self-Hosted Gateway"
description: "Attach, configure, and deploy policies on API proxies running on the API Platform Self-Hosted Gateway."
canonical_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/manage-policies/
md_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/manage-policies.md
tags:
  - cloud
  - api-gateway
  - self-hosted
  - policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Adding and Managing Policies

This guide explains how to add and manage policies for your Self-Hosted Gateway using API Platform's unified control plane.

## Overview

Policies allow you to enforce security, rate limiting, transformation, and other governance requirements on your APIs. With the Self-Hosted Gateway, you manage policies centrally through API Platform's Policy Hub, and they are automatically synchronized to your gateway.

## Adding Policies to an API

To add policies to an API deployed on your Self-Hosted Gateway:

1. Sign in to the [API Platform Console](https://console.bijira.dev).
2. Select your organization and project.
3. Navigate to the API proxy you want to configure.
4. Click **Develop** in the left navigation, then select **Policies**.

    ![API proxy contract mapping view showing API Proxy Contract and Service Contract with /books resource rows](../../assets/img/api-platform-gateway/gateway/policy-page.png)

5. Choose the policy flow for API level or Resource Level:

    ![API Policies panel showing API-Level Policies section with Add Policy button and no policies attached message](../../assets/img/api-platform-gateway/gateway/policy-flow.png)

6. Click **+ Add Policy** and select the policy type.

    ![Attach Policy dialog with Search Policies field, category filters, and policy list including Set Headers, JWT Auth, CORS, Rate Limit, and API Key Auth](../../assets/img/api-platform-gateway/gateway/policy-select.png)

7. Configure the policy parameters.

    ![Configure Policy dialog for API Key Auth showing key and in parameter fields with header value selected](../../assets/img/api-platform-gateway/gateway/policy-configure.png)

8. Click **Add** to apply the policy.
9. Then **Save** the API.
10. Deploy the API changes to the Gateway.

## Available Policy Types

Navigate to [API Platform Policy Hub](https://wso2.com/api-platform/policy-hub/) to discover available policies.

## What's Next?

- [Writing a Custom Policy](writing-a-custom-policy.md): Learn how to build a custom policy using the gateway SDK
- [Writing an AI Policy](../ai-workspace/policies/writing-an-ai-policy.md): Learn how to write policies for LLM traffic
- [Analytics](analytics.md): Monitor API traffic and performance
- [Troubleshooting](troubleshooting.md): Common issues and solutions