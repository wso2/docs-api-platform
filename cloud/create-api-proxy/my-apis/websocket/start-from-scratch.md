---
title: "Create WebSocket API Proxy from Scratch"
description: "Create a WebSocket API proxy from scratch by manually specifying API proxy details in WSO2 API Platform, then configure, deploy, and test it."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/my-apis/websocket/start-from-scratch/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/my-apis/websocket/start-from-scratch.md
tags:
  - cloud
  - api-proxy
  - websocket
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Create API Proxy from Scratch

A WebSocket API proxy operates based on the WebSocket protocol specification (RFC 6455). This protocol is designed to overcome the limitations of the traditional HTTP request-response model by establishing a single, persistent TCP connection between the client and the server.

The WebSocket connection begins with an initial handshake that leverages the HTTP Upgrade mechanism. Once established, this connection supports full-duplex communication, enabling continuous, low-latency, and simultaneous two-way data exchange. This feature makes it ideal for real-time applications such as live data feeds, gaming, and chat services.

## Prerequisites

- If you're signing in to the API Platform Console for the first time, create an organization:
    1. Go to [API Platform Console](https://console.bijira.dev/) and sign in using your preferred method.
    2. Enter a unique organization name. For example, `Stark Industries`.
    3. Read and accept the privacy policy and terms of use.
    4. Click **Create**.

  This creates the organization and opens the **Project Home** page of the default project created for you.

## Create an API Proxy

  In this guide, you will create a WebSocket API proxy from the Scratch.

1. Go to [API Platform Console](https://console.bijira.dev/) and sign in. This opens the project home page.
2. If you already have one or more components in your project, click + Create. Otherwise, proceed to the next step.
3. Select **Start from Scratch**.
4. Specify the following values as API proxy details:

    | **Field**       | **Value**                                  |
    |-----------------|--------------------------------------------|
    | **Name**     | `Chat App API`                          |
    | **Identifier**     | `chat-app-api`                    |
    | **Version**     | `1.0`                                      |
    | **Base Path**     | `/default/chat-app-api/v1.0`       |
    | **Description**      | `Sample proxy for chat app api` |
    | **Target**      | `https://samples.choreoapps.dev/company/chat-app` |
    | **API Type**      | `WebSocket` |
    | **Access Mode**      | `External` |

5. Click **Create** to create the API Proxy. Wait for the setup to complete.

## Configure and Deploy the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Select **Configure and Deploy** option from the **Deploy** dropdown and click **Configure and Deploy** button.
3. Select **External** as API Access Mode.
4. Click **Deploy**.

## Test the API Proxy

1. Navigate to the **Test --> Console** page of the API Proxy.
2. Use the OpenAPI Console to test the API Proxy.

## Promote the API Proxy to Production and Publish the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Click **Promote**. This promotes the API proxy from the Development environment to the Production environment.
3. In the left navigation menu, click **Lifecycle** under **Develop**. This takes you to the **Lifecycle** page.
4. Click **Publish**.
5. In the **Publish API** dialog, click **Confirm** to proceed with publishing the API. If you want to change the display name, make the necessary changes and then click **Confirm**. This sets the API lifecycle state to **Published**.