---
title: "Test a GraphQL API"
description: "Run GraphQL queries and mutations against a deployed GraphQL API from the GraphiQL test console in the API Control Plane."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/test-graphql-api/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/test-graphql-api.md
tags:
  - api-control-plane
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "how-to"
---

# Test a GraphQL API

The API Control Plane console includes a test console based on GraphiQL. Use it to run queries and mutations against a GraphQL API that's deployed on a gateway.

The test console loads the schema from the control plane, so it offers autocompletion even when introspection is disabled on the backend.

## Before you begin

Deploy the GraphQL API to at least one gateway. For more information, see [Deploy a GraphQL API](deploy-graphql-api.md).

## Run a query

1. Open the GraphQL API, and then select **Test**.
2. In **Gateway**, select the gateway to send the request to. The console shows the **Endpoint URL** for that gateway.
3. In the query editor, enter a query or mutation. For example, the following query works with the sample Countries backend:

    ```graphql
    query GetCountry($code: ID!) {
      country(code: $code) {
        name
        capital
        currency
        languages {
          code
          name
        }
      }
    }
    ```

4. In the variables editor, enter the variable values:

    ```json
    {
      "code": "LK"
    }
    ```

5. If the API has an authentication policy, add the required header in the headers editor as a JSON object. Use the header that matches the policy:

    === "API key"

        The `api-key-auth` policy reads the key from the `API-Key` header by default:

        ```json
        {
          "API-Key": "<api-key>"
        }
        ```

        If the policy sets a different header name in its `key` parameter, use that name instead. To create a key, see [Manage API keys for a GraphQL API](manage-api-keys.md).

    === "JWT"

        The `jwt-auth` policy reads a bearer token from the `Authorization` header by default:

        ```json
        {
          "Authorization": "Bearer <access-token>"
        }
        ```
6. Run the query. The response appears in the result pane.

The console sends every request as a `POST` request to the selected gateway.
