---
title: "Test GraphQL APIs via the GraphQL Console"
description: "Test GraphQL API proxy operations in WSO2 API Platform using the built-in GraphQL Console with auto-generated test keys."
canonical_url: https://wso2.com/api-platform/docs/cloud/test-api-proxy/graphql-console/
md_url: https://wso2.com/api-platform/docs/cloud/test-api-proxy/graphql-console.md
tags:
  - cloud
  - testing
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Test GraphQL APIs via the GraphQL Console

API Platform offers an integrated GraphQL Console to test GraphQL API proxies that you create and deploy. Since API Platform secures APIs with OAuth 2.0 authentication, the GraphQL Console generates test keys to help you invoke your GraphQL operations.

Follow these steps to test a GraphQL API proxy using the GraphQL Console:

1. Go to the [API Platform Console](https://console.bijira.dev/) and log in.
2. Select the project and GraphQL API proxy that you want to test.
3. Click **Test** in the left navigation menu, then select **Console**. This will open the **GraphQL Console** pane.

    ![GraphQL Console pane with query editor and environment selector for testing GraphQL API proxy](../../assets/img/test-api-proxy/graphiql-console.png){.cInlineImage-full}
    
4. In the **Console** pane, select the desired environment from the drop-down menu.
5. In the query editor, enter the GraphQL operation you want to execute (for example, a `query` or `mutation`).
6. Click **The Play Button**. The response from the GraphQL API proxy will be displayed under the **Response** section.

