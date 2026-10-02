---
title: "Subscribe to an API"
description: "Subscribe an application to a published API in the Developer Portal to generate credentials and invoke the API."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/manage-subscriptions/subscribe-to-an-api/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/manage-subscriptions/subscribe-to-an-api.md
tags:
  - cloud
  - devportal
  - subscriptions
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-22
content_type: "how-to"
---

To use a published API in your application, you must subscribe to it. When you subscribe to an API, your subscription covers all minor versions within the API's major version.

The subscription process ensures secure authentication of API requests using application keys. While you can generate credentials for an API without subscribing to an application, this approach limits advanced configuration options such as access token expiry time, revoke token expiry time, ID token expiry time, and enabling access to the API without a secret. Generating keys directly in the API is suitable for testing or short-term use but is not recommended for long-term production usage.

To subscribe to an API via an application, follow these steps:

1. Go to the [API Platform Developer Portal](https://devportal.bijira.dev) and sign in to your organization.

2. To navigate to applications, in the Developer Portal sidebar, click **Applications**.

3. On the **Applications** page, click on the application you want to use to subscribe to an API.

4. Under the **Subscribed API Proxies** section, click **Explore more**.

5. In the **APIs** page, click **Subscribe** to subscribe to an API. You can subscribe to one or more APIs based on your requirements.

    !!! tip
        When a new minor version of an API is published, the major version-based invocation URL automatically routes to the latest minor version within the subscribed API's major version. This ensures that existing client applications continue to function without disruption while benefiting from improvements or additions in the newer minor version.

Once you subscribe to an API, you can invoke it using the application keys.