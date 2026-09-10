---
title: "Publish subscription-less APIs on the Self-Hosted Gateway"
description: "Publish an API on the Self-Hosted Gateway without subscription plans so consumers can invoke it without subscribing."
canonical_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/publish-apis/subscription-less-apis/
md_url: https://wso2.com/api-platform/docs/cloud/api-platform-gateway/publish-apis/subscription-less-apis.md
tags:
  - cloud
  - api-gateway
  - self-hosted
  - subscriptions
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

# Subscription-less APIs

A **subscription-less** API is a published API proxy that is **not** tied to subscription plans in the Developer Portal. API consumers do not need to select a subscription plan or subscribe through the standard subscription flow to consume the API, though you may still secure the API using other mechanisms (for example, API keys or OAuth configured on the API).

Use subscription-less publishing when you want the API to be discoverable in the Developer Portal without enforcing plan-based quotas and rules that come from Subscription plans.

## Before you begin

- The API proxy is deployed to your **Self-Hosted Gateway** and works as expected in your environments. See [Getting Started with Self-Hosted Gateway](../getting-started.md).
- You have permission to change the API lifecycle (typically **API publisher** or equivalent).

## Do not assign subscription plans

Subscription-less behavior applies when no subscription plans are active for the API:

1. Sign in to the [API Platform Console](https://console.bijira.dev/).
2. Open the project and select the API proxy.
3. In the left navigation menu, click **Manage** and then **Monetize**.
4. Ensure **Subscription Plan Status** is **disabled** (off) for all plans. For background on plans, see [Assign Subscription Plans to APIs](../../develop-api-proxy/subscription-plans.md).

    ![Subscription Plans page listing 3PerMin, Bronze, Gold, Silver, and Unlimited plans with all Enabled toggles turned off](../../../assets/img/api-platform-gateway/subscriptions/subscription-plan-disabled.png)

If any plan is enabled for the API, consumers may be guided through subscription and plan selection for that API; that pattern is described in [Subscription-based APIs](subscription-based-apis.md).

## Publish the API

1. In the left navigation menu, click **Manage** and then **Lifecycle**.

    ![Lifecycle Management page showing API in Created state with Pre-release and Publish action buttons and state transition diagram](../../../assets/img/api-platform-gateway/subscriptions/lifecycle-created.png)

2. When the API is ready for external consumers, click **Publish**.
3. In the publish dialog, confirm the display name and click **Confirm**. The lifecycle state becomes **Published**.

    ![Lifecycle Management page showing API in Published state with Pre-release, Demote to Created, and Deprecate action buttons](../../../assets/img/api-platform-gateway/subscriptions/lifecycle-published.png)

## Invoke the API

1. Navigate to Developer Portal by clicking **Developer Portal**.

    ![API Platform Console header showing AI Workspace and Developer Portal navigation buttons](../../../assets/img/api-platform-gateway/subscriptions/navigate-devportal.png)

2. Consumers can find the API in the Developer Portal by going to **APIs**.

    ![Developer Portal API card for ReadingSelfRC NoSub v1.0 REST API with no subscription plans or Subscribe button](../../../assets/img/api-platform-gateway/subscriptions/api-no-sub.png)

3. Receive the **cURL** to invoke the API by navigating to the **Documentation**.

    ![API documentation page for GET /books endpoint showing cURL sample without Subscription-Key header](../../../assets/img/api-platform-gateway/subscriptions/doc-api-sub-less.png)

4. Invoke API.

    ```bash
    curl --request GET \
    --url <api-invocation-url> \
    --header 'Accept: application/json' -k
    ```

## Related documentation

- [Publish APIs overview](overview.md)
- [Subscription-based APIs](subscription-based-apis.md)
- [Getting Started with Self-Hosted Gateway](../getting-started.md)