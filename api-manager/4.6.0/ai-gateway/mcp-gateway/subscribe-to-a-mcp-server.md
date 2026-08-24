---
title: "Subscribe to a MCP server"
description: "Subscribe an application to a published MCP server in the Developer Portal to get the access tokens needed to invoke the server tools."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/ai-gateway/mcp-gateway/subscribe-to-a-mcp-server/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/ai-gateway/mcp-gateway/subscribe-to-a-mcp-server.md
tags:
  - api-manager
  - ai-gateway
  - mcp-gateway
  - subscribe-to-a-mcp-server
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Subscribe to a MCP Server

You have to **subscribe** to a published MCP Server before using its tools in your applications. The subscription process fulfills the authentication process and provides you with access tokens that you can use to invoke a MCP Server's tools. 

The examples here use the `Petstore` MCP Server, which is created and published to the Developer Portal in WSO2 API Manager.

## Subscribe to an application

If you already have an existing application, follow the instructions below to subscribe to the MCP Server using that application.

1.  Sign in to the Developer Portal (`https://<hostname>:<port>/devportal`) and click on the MCP Server (e.g., `Petstore`) to go to the MCP Server overview.

    [![MCP Server overview](../../assets/img/mcp-gateway/mcp-server-overview.png)](../../assets/img/mcp-gateway/mcp-server-overview.png)
        
2.  Click **SUBSCRIBE TO AN APPLICATION**.

    <a href="../../../assets/img/learn/from-existing-app.png" ><img src="../../../assets/img/learn/from-existing-app.png" alt="Subscribe to new app" title="Subscribe to new app" /></a>
    
3.  Select the application, the throttling policy, and click **Subscribe**.

    [![Subscribe to new application](../../assets/img/learn/subscribe-to-app.png)](../../assets/img/learn/subscribe-to-app.png)
    
    You can see the subscriptions list in the **Subscriptions** section.
     
    [![Subscribe to new app](../../assets/img/learn/subscription-list.png)](../../assets/img/learn/subscription-list.png)


If you do not have an existing application, you can create one and then subscribe to the MCP Server. For detailed steps, refer to [Subscribe to an API](../../api-developer-portal/manage-subscription/subscribe-to-an-api.md), as the process is similar.