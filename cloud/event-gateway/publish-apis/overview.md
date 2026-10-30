---
title: "Publish APIs on the Event Gateway"
description: "Compare subscription-based and subscription-less approaches for publishing APIs deployed on the Event Gateway."
canonical_url: https://wso2.com/api-platform/docs/cloud/event-gateway/publish-apis/overview/
md_url: https://wso2.com/api-platform/docs/cloud/event-gateway/publish-apis/overview.md
tags:
  - cloud
  - event-gateway
  - publish
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "overview"
---

# Publish APIs on an Event Gateway

After you create and deploy an API proxy to an **Event Gateway**, you can make consumers aware of it by moving the API through the lifecycle and publishing it. Publishing updates the API lifecycle to **Published** so it can appear in the API Platform Developer Portal and be invoked according to how access is configured.

This section describes two ways to expose published APIs:

| Approach | Summary |
|----------|---------|
| [**Subscription-less APIs**](subscription-less-apis.md) | Published APIs for which consumers are **not** required to subscribe to a subscription plan in the Developer Portal. |
| [**Subscription-based APIs**](subscription-based-apis.md) | Published APIs that have **subscription plans** assigned; consumers choose a plan and subscribe to generate Subscription Token. |

Both approaches use the same high-level flow in the console: deploy the API to your gateway, then use **Manage** → **Lifecycle** to **Publish** the API when it is ready.

!!! note
    Event Gateway support for creating and routing traffic to APIs is available for **WebSocket**, **Webhook**, and **Async** API proxies. Publishing and subscription behavior on the gateway is aligned with organization-level subscription plans configuration.

## Related documentation

- [Getting Started with Event Gateway](../getting-started.md): Create the gateway, add an API proxy, and deploy
- [Assign Subscription Plans to APIs](../../develop-api-proxy/subscription-plans.md): Enable subscription plans on an API
- [Create API Subscription Plans](../../administer/settings/create-api-subscription-plans.md): Define plans at organization level
- [Manage Lifecycle of API](lifecycle-management.md): Manage API Lifecycles

Choose [**Subscription-less APIs**](subscription-less-apis.md) or [**Subscription-based APIs**](subscription-based-apis.md) for step-by-step guidance.