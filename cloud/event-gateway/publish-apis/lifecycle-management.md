---
title: "Manage API lifecycle on the Event Gateway"
description: "Move an API proxy through its lifecycle states on the Event Gateway: created, pre-released, published, deprecated, and retired."
canonical_url: https://wso2.com/api-platform/docs/cloud/event-gateway/publish-apis/lifecycle-management/
md_url: https://wso2.com/api-platform/docs/cloud/event-gateway/publish-apis/lifecycle-management.md
tags:
  - cloud
  - event-gateway
  - lifecycle
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "how-to"
---

# Lifecycle Management

API lifecycle management is an important aspect of API management. The API lifecycle consists of various states that an API passes through, from creation to retirement. In API Platform, there are five distinct lifecycle states: created, pre-released, published, deprecated, and retired.

By leveraging the various lifecycle states, API managers can optimize the development process and ensure that subscribers have access to the latest and most reliable APIs.

## API Lifecycle States

The following lifecycle states are applicable to APIs in API Platform:

| **API lifecycle state** | **Use case** | **Corresponding action** |
|-----------------------|------------|-----------|
| **CREATED** | The API is created but is not ready for consumption.| The API is not visible to subscribers in the Developer Portal.|
| **PRE-RELEASED** | A prototype is created for early promotion and consumer testing. You can deploy a new API or a new version of an existing API as a prototype to provide subscribers with an early implementation of the API.|The API is published to the Developer Portal as a pre-release.|
| **PUBLISHED** | The API is ready for subscribers to view and subscribe to via the Developer Portal| The API is visible in the Developer Portal and is available for subscription.|
| **DEPRECATED** | The old version of an API is moved to this state when a newer version of the API is PUBLISHED.| The API is deployed and is available to existing subscribers. New subscriptions are disabled. Existing subscribers can continue to use it as usual until the API is retired.|
| **RETIRED** | The API is no longer in use when it is in this state.| The API is unpublished and deleted from the Developer Portal.|

## Manage the Lifecycle of an API

To change the lifecycle state of an API via the API Platform Console, follow the instructions given below:

!!! tip
     You must have publishing privileges to manage the lifecycle states of a component.

1. Sign in to the [API Platform Console](https://console.bijira.dev/).
2. Select the project and the API that you want to change lifecycle.
3. In the left navigation menu, click **Manage**, and then click **Lifecycle**.
4. In the **Lifecycle Management** pane, you will see the lifecycle state transition diagram indicating the current lifecycle state of the component. The possible lifecycle states you can apply to the component are displayed just above the lifecycle state transition diagram. Click on a required lifecycle state to apply it to the component. For example, if a component is in the **Created** state, you can click either **Pre-release** or **Publish**.