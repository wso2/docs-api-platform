---
title: "Test WebSocket Endpoints via the WebSocket Console"
description: "Test WebSocket API proxy endpoints in WSO2 API Platform using the built-in WebSocket Console with auto-generated test keys."
canonical_url: https://wso2.com/api-platform/docs/cloud/test-api-proxy/ws-test-console/
md_url: https://wso2.com/api-platform/docs/cloud/test-api-proxy/ws-test-console.md
tags:
  - cloud
  - testing
  - websocket
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Test WebSocket Endpoints via the WebSocket Console

API Platform offers an integrated WebSocket Console to test WebSocket endpoints for the API proxies you create and deploy. Since API Platform secures WebSocket APIs with OAuth 2.0 authentication, the WebSocket Console generates test keys to help you test your APIs.

Follow these steps to test a WebSocket endpoint using the WebSocket Console:

1. Go to the [API Platform Console](https://console.bijira.dev/) and log in.
2. Select the project and API which you want to test.
3. Click **Test** in the left navigation menu, then select **Console**. This will open the **WebSocket Console** pane.
4. In the **Console** pane, select the desired environment from the drop-down menu.

    ![WebSocket Console pane with environment selector and expandable topics for testing WebSocket endpoints](../../assets/img/test-api-proxy/websocket-console.png){.cInlineImage-full}

5. Expand the topic you want to test.
6. Provide values for any parameters, if applicable.
7. Click **Execute** or **Connect**. The output will be displayed under the **Output** section.