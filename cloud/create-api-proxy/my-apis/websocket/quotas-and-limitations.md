---
title: "WebSocket API Proxy Limitations and Quotas"
description: "Reference for WebSocket API proxy limits in WSO2 API Platform: maximum connections, maximum connection duration, and idle timeout."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/my-apis/websocket/quotas-and-limitations/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/my-apis/websocket/quotas-and-limitations.md
tags:
  - cloud
  - api-proxy
  - websocket
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "reference"
---

## Limitations for WebSocket API Proxies

Explore key limitations in API Platform WebSocket API proxies, covering areas like maximum number of connections, maximum connection duration, and more. You can gain insights into the limitations to enhance your understanding and optimize your use of WebSocket API proxies effectively.

WebSocket API proxies have the following limitations.

| **Limitation** | **Description** | **Limit** |
|-----------------|-------------|-----------|
| **Max Connections** | The maximum number of concurrent connections allowed to the API. | <ul><li>Free Tier Users: 2-8 connections</li><li>Paid Users: 50-100 connections</li></ul>     |
| **Max Connection Duration** | The maximum duration of a connection allowed to the API. | 15 Minutes |
| **Connection idle timeout** | The maximum duration a connection can be idle before it is closed. | 4 Minutes |

!!! Note
    If you need to increase the limits, we recommend you to set up a Private Data Plane (PDP) for your Organization.