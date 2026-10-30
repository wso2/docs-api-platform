---
title: "Start with a schema"
description: "Create a GraphQL API in API Platform Cloud by importing a schema from a URL or a file."
---
A GraphQL API proxy operates based on the GraphQL query language specification. GraphQL provides a flexible and efficient approach to API development by allowing clients to request exactly the data they need, nothing more and nothing less.

Unlike traditional REST APIs that require multiple endpoints for different resources, GraphQL uses a single endpoint and a type system to define the API's capabilities. This enables clients to compose complex queries that fetch related data in a single request, reducing over-fetching and under-fetching of data. GraphQL is ideal for applications that need flexible data fetching and efficient data aggregation.

This walks you through creating a GraphQL API using a sample GraphQL schema, deploying it to a gateway, testing it, and publishing it to a developer portal.

## Prerequisites

1. Go to API Platform Cloud Console and sign in with Google or GitHub.
2. Open your organization, then select the **Default project** or create a new project.

## Create the API

1. On the project home page, click **Create API**.
2. select **GraphQL API**., keep **Start with a schema**. It is selected by default.
5. Provide the schema in one of these ways:

   - **URL.** Select **URL**, enter the **Schema URL**, or click **Try with Sample Schema**. The sample URL is:

     ```text
     https://raw.githubusercontent.com/graphql/swapi-graphql/master/schema.graphql
     ```

     Wait until validation finishes.

   - **Upload.** Select **Upload**, then drag and drop a file or click to select one. Accepted file types are `.graphql`, `.gql`, and `.json`.

6. Click **Continue**.
7. On **Configure and create**, review **Basic information** and **Endpoint**. For the sample schema URL, the console fills in:

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | `Raw` |
   | **Identifier** | `raw` |
   | **Version** | `1.0` |
   | **Context** | `/raw/v1.0/graphql` |
   | **Description** | Empty |
   | **Query and Mutation URL** | Enter the backend URL that serves queries and mutations. |

8. Click **Create**.

The sample schema was not created. **Query and Mutation URL** was still empty, so this API was not deployed or tested.

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
