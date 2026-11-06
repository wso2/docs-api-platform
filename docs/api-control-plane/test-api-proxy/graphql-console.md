---
title: "GraphQL Console"
description: "Test a deployed GraphQL API from the Test page in the API Control Plane."
---

The integrated GraphQL Console lets you test GraphQL API proxies after deploying them to a gateway. You can execute GraphQL queries and mutations directly from the console and inspect the responses.

Follow these steps to test a GraphQL API proxy using the GraphQL Console.

1. Sign in to the API Control Plane.
2. Select the project and open the GraphQL API proxy you want to test.
3. In the left navigation menu, click **Test** to open the GraphQL Console.
4. Select the gateway.
5. In the query editor, enter the GraphQL operation you want to execute, such as a `query` or `mutation`. Use **Variables** and **Headers** when the operation needs them.
6. Click the **Play** button to execute the operation. The response appears beside the query.

    ![GraphQL Console with the gateway selected, the query editor, and the Play button](/img/cloud/test-api-proxy/graphql-console.png)