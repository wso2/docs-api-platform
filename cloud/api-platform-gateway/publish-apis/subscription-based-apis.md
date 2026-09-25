---
title: "Publish subscription-based APIs on the Self-Hosted Gateway"
description: "Assign subscription plans, attach the Subscription Validation policy, and publish a subscription-based API on the Self-Hosted Gateway."
canonical_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/publish-apis/subscription-based-apis/
md_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/publish-apis/subscription-based-apis.md
tags:
  - cloud
  - api-gateway
  - self-hosted
  - subscriptions
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Subscription-based APIs

A **subscription-based** API is a published API proxy that has one or more **subscription plans** assigned. Subscription plans define quotas, rate limits, and related controls at the organization level. When consumers use the API Platform Developer Portal, they choose an API, subscribe to the API with a plan, and generate Subscription Token according to your plan rules.

This model fits APIs where you need tiered access, usage limits, or clear commercial separation between consumer applications.

## Before you begin

- Organization administrators have created subscription plans. See [Create API Subscription Plans](../../administer/settings/create-api-subscription-plans.md).
- The API proxy is deployed to your **Self-Hosted Gateway** and behaves correctly. See [Getting Started with Self-Hosted Gateway](../getting-started.md).

## Assign subscription plans to the API

1. Sign in to the [API Platform Console](https://console.bijira.dev/).
2. Select the project and the API proxy.
3. Go to **Manage** → **Monetize**.
4. Enable the **Subscription Plan Status** toggle for each plan you want to offer for this API by toggling **Enabled** field.

    ![Subscription Plans page listing 3PerMin, Bronze, Gold, Silver, and Unlimited plans with all Enabled toggles turned on](../../../assets/img/api-platform-gateway/subscriptions/subscription-plan-enable.png)

For detailed steps and field behavior, see [Assign Subscription Plans to APIs](../../develop-api-proxy/subscription-plans.md).

## Assign Subscription Validation Policy to the API

1. Go to **Develop** → **Policies**.

    ![Policies page showing Global Policies API Level section with available policy list including API Key Auth, Basic Auth, CORS, and JWT Auth](../../../assets/img/api-platform-gateway/subscriptions/policies-overview.png)

2. Select **Subscription Validation** policy.

    ![Configure Policy dialog showing Subscription Validation policy with description and Advanced Settings section](../../../assets/img/api-platform-gateway/subscriptions/select-sub-val-policy.png)

3. (Optional) Configure Subscription Header/Cookie value in the policy Advanced Section.

    ![Subscription Validation Configure Policy dialog with Advanced Settings expanded showing subscriptionKeyHeader and subscriptionKeyCookie input fields](../../../assets/img/api-platform-gateway/subscriptions/select-sub-val-policy-advanced.png)

4. Click **Add** to attach the policy to API level policy.

5. Click **Save** to save the API.

    ![Policies page showing Subscription Validation added to Global Policies API Level section with unsaved changes warning and Save button](../../../assets/img/api-platform-gateway/subscriptions/policy-save.png)

## Deploy the API

1. Go to **Deploy** and click **Deploy**.

    ![Deploy page showing Self Local Dev GW GA gateway with Active deployment status and Deploy button](../../../assets/img/api-platform-gateway/subscriptions/deploy-api.png)

## Publish the API

1. Go to **Manage** → **Lifecycle**.

    ![Lifecycle Management page showing API in Created state with Pre-release and Publish action buttons and state transition diagram](../../../assets/img/api-platform-gateway/subscriptions/lifecycle-created.png)

2. Click **Publish**.
3. In the publish dialog, confirm the display name and production endpoint and click **Confirm**. The lifecycle state becomes **Published**.

    ![Lifecycle Management page showing API in Published state with Pre-release, Demote to Created, and Deprecate action buttons](../../../assets/img/api-platform-gateway/subscriptions/lifecycle-published.png)

## Subscribe to the API

1. Navigate to Developer Portal by clicking **Developer Portal**.

    ![API Platform Console header showing AI Workspace and Developer Portal navigation buttons](../../../assets/img/api-platform-gateway/subscriptions/navigate-devportal.png)

2. Consumers can find the API in the Developer Portal by going to **APIs**.
3. Select the API and click **Subscribe**.

    ![Developer Portal API card for Reading List v1.0 REST API showing Plans count and Subscribe button](../../../assets/img/api-platform-gateway/subscriptions/select-api-to-subscribe.png)

4. Pick a Subscription plan and click **Subscribe**.

    ![Choose Your Subscription Plan dialog showing Bronze, Gold, Silver, Unlimited, and 3PerMin plans with pricing and rate limits](../../../assets/img/api-platform-gateway/subscriptions/select-plan-to-subscribe.png)

5. You will receive a Subscription Token.

    ![Subscription Created dialog showing generated subscription token value and Subscription-Key usage instruction](../../../assets/img/api-platform-gateway/subscriptions/recieve-sub-token.png)

## Invoke the API

1. Receive the **cURL** to invoke the API using the Subscription Token by navigating to the **Documentation**.

    ![API documentation page for GET /books endpoint showing Subscription-Key header field and cURL sample request with Subscription-Key](../../../assets/img/api-platform-gateway/subscriptions/document-api.png)

2. Invoke the API.

    #### Sample Request

    ```bash
    curl --request GET \
    --url <api-invocation-url> \
    --header 'Accept: application/json' \
    --header 'Subscription-Key: <subscription-token>' -k
    ```

    #### Sample Response

    ![Terminal output of curl command returning JSON array of book objects from the reading list API](../../../assets/img/api-platform-gateway/subscriptions/invoke-api.png)



## Related documentation

- [Publish APIs overview](overview.md)
- [Subscription-less APIs](subscription-less-apis.md)
- [Create API Subscription Plans](../../administer/settings/create-api-subscription-plans.md)
- [Assign Subscription Plans to APIs](../../develop-api-proxy/subscription-plans.md)