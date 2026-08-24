---
title: "Troubleshooting WebSocket APIs"
description: "Enable DEBUG logs for the WebSocket inbound and transport handlers in log4j2.properties to trace WebSocket API failures."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/reference/troubleshooting/troubleshooting-websocket-api/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/reference/troubleshooting/troubleshooting-websocket-api.md
tags:
  - api-manager
  - reference
  - troubleshooting
  - troubleshooting-websocket-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-20
content_type: "troubleshooting"
---

### Troubleshooting WebSocket APIs

If you require more detailed logs in the WebSocket API flow in order to troubleshoot and debug an error in your scenario, you can enable debug logs as indicated below.

Add the following entries in the `<API-M_HOME>/repository/conf/log4j2.properties` file.

```
logger.InboundWebsocketSourceHandler.name = org.wso2.carbon.inbound.endpoint.protocol.websocket.InboundWebsocketSourceHandler
logger.InboundWebsocketSourceHandler.level = DEBUG

logger.InboundWebsocketResponseSender.name = org.wso2.carbon.inbound.endpoint.protocol.websocket.InboundWebsocketResponseSender
logger.InboundWebsocketResponseSender.level = DEBUG

logger.WebSocketClientHandler.name = org.wso2.carbon.websocket.transport.WebSocketClientHandler
logger.WebSocketClientHandler.level = DEBUG

logger.WebsocketTransportSender.name = org.wso2.carbon.websocket.transport.WebsocketTransportSender
logger.WebsocketTransportSender.level = DEBUG
```

Then, add the loggers in a comma-separated list as shown here:

```
loggers = InboundWebsocketSourceHandler, InboundWebsocketResponseSender, WebSocketClientHandler, WebsocketTransportSender
```