---
title: "Start from scratch"
description: "Create a GraphQL API in API Platform Cloud from a backend endpoint, then deploy and test it."
---

A GraphQL API proxy operates based on the GraphQL query language specification. GraphQL provides a flexible and efficient approach to API development by allowing clients to request exactly the data they need, nothing more and nothing less.

Unlike traditional REST APIs that require multiple endpoints for different resources, GraphQL uses a single endpoint and a type system to define the API's capabilities. This enables clients to compose complex queries that fetch related data in a single request, reducing over-fetching and under-fetching of data. GraphQL is ideal for applications that need flexible data fetching and efficient data aggregation.

This walks you through creating a GraphQL API using a sample backend, deploying it to a gateway, testing it, and publishing it to a developer portal.

## Prerequisites

1. Go to API Platform Cloud Console and sign in with Google or GitHub.
2. Open your organization, then select the **Default project** or create a new project.

## Create the API

1. On the project home page, click **Create API**.
2. Select **GraphQL API**, then choose **Start from scratch**.
3. Under **Backend endpoint**, enter your backend URL in the **Endpoint URL** field, or click **Try with Sample URL** to use the Countries sample service.

   The sample URL is:

   ```text
   https://countries.trevorblades.com/graphql
   ```

   When introspection succeeds, the page displays **Introspection enabled · SDL fetched**, indicating that the console has retrieved the GraphQL schema.

4. Click **Continue**.
5. On the **Configure and create** page, review the generated values. The sample endpoint populates the fields as follows:

   | Field | Example value |
   | --- | --- |
   | **Name** | `Countries` |
   | **Identifier** | `countries` |
   | **Version** | `1.0` |
   | **Context** | `/countries/v1.0/graphql` |
   | **Description** | Empty |
   | **Query and Mutation URL** | `https://countries.trevorblades.com/graphql` |

   Ensure that the **Identifier** is unique across your organization. Update the generated values if needed.

6. Click **Create**.

## Deploy the API

A newly created GraphQL API does not have a build yet. Deploying the API prepares a build and deploys it to the selected gateway.

1. Open the API.
2. In the left navigation menu, click **Deploy**. Alternatively, click **Deploy to Gateway** on the API overview page.
3. In the **Deploy to development** dialog, select the gateway. **Default** is selected by default. Click **Deploy**.

   Check the gateway's deployment status to confirm that the deployment succeeds before proceeding.

## Test the API

1. In the left navigation menu, click **Test**.
2. Use the GraphQL Console to execute queries against the deployed API and inspect the responses.

For more information, see the [GraphQL Console](../../test-api-proxy/graphql-console.md) guide.

## Publish the API

Publishing makes the API available to developers through a developer portal, where they can discover the API and access its documentation.

See [Publish an API](../../publish-api-proxy/publish-an-api.md).

## Next Steps

- [Secure API Access](../../develop-api-proxy/security/secure-api-access/overview.md) - Control who can invoke the API
- [Attach and Manage Policies](../../develop-api-proxy/policy/attach-and-manage-policies.md) - Add capabilities such as rate limiting or header changes to the API
- [Documents](../../develop-api-proxy/documents.md) - Add documents that help consumers use the API
