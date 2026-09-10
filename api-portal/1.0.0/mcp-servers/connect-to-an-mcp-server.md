---
title: "Connect to an MCP server"
description: "Subscribe to an MCP server, obtain a bearer token, and paste the portal's configuration snippet into your MCP client."
canonical_url: https://wso2.com/api-platform/docs/api-portal/mcp-servers/connect-to-an-mcp-server/
md_url: https://wso2.com/api-platform/docs/api-portal/mcp-servers/connect-to-an-mcp-server.md
tags:
  - cloud
  - api-portal
  - mcp
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Connect to an MCP server

Connecting an MCP client to a server published in the hub takes three things: the server's URL, a credential, and a config block your client understands. The server page gives you all three.

## Subscribe

If the server has subscription plans, subscribe before you connect:

1. Open the server from **MCP Servers** in the sidebar.
2. Click **Subscribe** in the header, or go to the **Subscription plans** panel in the sidebar.
3. Click **Subscribe** on the plan you want.

The subscription is created immediately and a dialog shows your **subscription token**. Copy it before closing—send it as the `Subscription-Key` header when calling the server.

Subscriptions to MCP servers work exactly as they do for APIs: one per server, switchable between plans without changing the token, suspendable, and manageable from **Subscriptions** in the sidebar. See [Manage Subscriptions](../consume-an-api/manage-subscriptions.md).

Servers with no plans need no subscription. Connect with whatever authentication the server itself expects.

## Get a bearer token

The configuration snippet expects an OAuth2 access token in an `Authorization: Bearer` header. Get one the same way you would for an OAuth2-secured API:

1. [Create an application](../consume-an-api/manage-applications.md) in the portal.
2. Link a client ID from your key manager to it under **Manage Keys**.
3. Generate an access token from the **Generate Token** tab, or with the ready-made command on the **cURL** tab.

[Consume an API Secured with OAuth2](../consume-an-api/oauth2.md) walks through the whole sequence.

!!! note
    The portal's **API Keys** pages don't cover MCP servers—the button never appears on a server page, and there's no MCP equivalent of the API Keys screen. MCP server keys exist only through the [Management API](../rest-api/mcp-server-keys.md). For everything driven from the UI, use an OAuth2 bearer token.

## Configure your client

The sidebar on every server page holds an **MCP Server Configuration** block, pre-filled with the server's name and URL:

```json
{
  "servers": {
    "travel-assistant-mcp": {
      "url": "https://your-mcp-host.example.com",
      "type": "http",
      "headers": {
        "Authorization": "Bearer ${token}"
      }
    }
  }
}
```

1. Click the copy button on the block.
2. Paste it into your MCP client's configuration.
3. Replace `${token}` with the access token you generated, or wire it to wherever your client reads secrets from.
4. If the server has subscription plans, add your subscription token as a second header:

    ```json
    "headers": {
      "Authorization": "Bearer ${token}",
      "Subscription-Key": "${subscriptionToken}"
    }
    ```

The `type` is `http`, so the client speaks streamable HTTP to the URL rather than launching a local process.

!!! important
    The snippet uses the server's URL exactly as the publisher registered it. The MCP Playground doesn't—it appends `/mcp` to that URL unless it already ends that way. If the snippet's URL doesn't connect, try it with `/mcp` on the end, and check the URL the playground reports.

## Check the connection

Before wiring the server into an agent, confirm the credentials work: open the server's **Documentation** page and use the **MCP Playground**. It connects with a bearer token you supply and invokes the server's tools. A successful call there confirms the token and the server, for that one request—it doesn't prove your client is configured correctly, so check your client's URL, transport, headers, and how it interpolates the token separately.

## Related

- [Browse MCP Servers](browse-mcp-servers.md): find a server and read its tools
- [Manage Subscriptions](../consume-an-api/manage-subscriptions.md): plans, tokens, switching, and unsubscribing
- [Consume an API Secured with OAuth2](../consume-an-api/oauth2.md): the full token-generation sequence
- [Manage Applications](../consume-an-api/manage-applications.md): where client IDs live