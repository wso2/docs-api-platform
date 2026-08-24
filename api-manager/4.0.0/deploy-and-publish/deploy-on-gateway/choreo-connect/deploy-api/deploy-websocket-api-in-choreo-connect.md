---
title: "Deploying a WebSocket API in Choreo connect"
description: "Deploy a WebSocket API to Choreo Connect via the WSO2 API Manager Publisher Portal or apictl for standalone mode."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/choreo-connect/deploy-api/deploy-websocket-api-in-choreo-connect/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/deploy-and-publish/deploy-on-gateway/choreo-connect/deploy-api/deploy-websocket-api-in-choreo-connect.md
tags:
  - api-manager
  - deploy-and-publish
  - deploy-on-gateway
  - choreo-connect
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Deploying a WebSocket API in Choreo Connect

You can deploy a WebSocket type API in Choreo Connect using [Choreo Connect with WSO2 API Manager as a Control Plane](#choreo-connect-with-wso2-api-manager-as-a-control-plane).

## Choreo Connect with WSO2 API Manager as a Control Plane

Follow the instructions below to use Choreo Connect with WSO2 API Manager as the Control Plane to deploy a WebSocket type Streaming API via the Publisher Portal in WSO2 API Manager:

!!! info
    **Before you begin**

    This guide assumes that you already have a Choreo Connect 1.0.0 instance that is up and running. If not, checkout the [Quick Start Guide](../getting-started/quick-start-guide-docker-with-apim.md) on how to install and run Choreo Connect. To learn more about Choreo Connect, have a look at the [Overview of Choreo Connect](../getting-started/choreo-connect-overview.md).


!!! note
    **Limitations compared to WSO2 API Manager 4.0.0**

    WSO2 API Manager allows users to provide multiple topics per Websocket API. In contrast, Choreo Connect 1.0.0 does not support topics currently. The inbound request URL follows the structure `<choreo-connect-gateway-url>/<API-Context>/<Version>`. And internally, the request will be forwarded to the API's endpoint URL with no topic appended to the end of the URL.


### Step 1 - Create a WebSocket API in API Manager

 For instructions on how to create a WebSocket API, see [Create a WebSocket API](../../../../design/create-api/create-streaming-api/create-a-websocket-streaming-api.md).

### Step 2 - Deploy the API in the Choreo Connect environment

For more information on deploying the API in Choreo Connect, see [Deploy API](../../deploy-api/deploy-an-api.md).

### Step 3 - Generate an Access Token to invoke the API

By default, the WebSocket API is protected by an OAuth2 token.

For more information on generating a JWT Access token, see [Get a Test Key to Invoke an API](../../../../consume/invoke-apis/invoke-apis-using-tools/invoke-an-api-using-the-integrated-api-console.md#get-a-test-key-to-invoke-an-api).

### Step 4 - Invoke the API using a WebSocket client

The WebSocket API exposed via Choreo Connect can be invoked by using a WebSocket client.
The JWT token should be set as the Authorization header in the initial WebSocket handshake request.

!!!note
    The same ports 9095 (HTTPS) and 9090 (HTTP) are used for WebSocket APIs.

Invoke the WebSocket API by carrying out [Step 4](../../../../tutorials/streaming-api/create-and-publish-websocket-api.md#step-4-invoke-the-websocket-api) in the Create and Publish a WebSocket API tutorial.