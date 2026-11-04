---
title: "Start with a schema"
description: "Create a GraphQL API in the API Control Plane by importing a schema from a URL or a file."
---
A GraphQL API proxy operates based on the GraphQL query language specification. GraphQL provides a flexible and efficient approach to API development by allowing clients to request exactly the data they need, nothing more and nothing less.

Unlike traditional REST APIs that require multiple endpoints for different resources, GraphQL uses a single endpoint and a type system to define the API's capabilities. This enables clients to compose complex queries that fetch related data in a single request, reducing over-fetching and under-fetching of data. GraphQL is ideal for applications that need flexible data fetching and efficient data aggregation.

This walks you through creating a GraphQL API using a sample GraphQL schema, deploying it to a gateway, testing it, and publishing it to a portal.

## Prerequisites

1. Go to the API Management Console and sign in with Google or GitHub.
2. Open your organization, then select the **Default project** or create a new project.

## Create the API

1. On the project home page, click **Create API**.
2. Select **GraphQL API**., keep **Start with a schema**. It is selected by default.
5. Provide the schema in one of these ways:

   - **URL:** Select **URL**, enter the **Schema URL**, or click **Try with Sample Schema**. The sample URL is:

     ```text
     https://raw.githubusercontent.com/graphql/swapi-graphql/master/schema.graphql
     ```

     Wait until validation finishes.

   - **Upload:** Select **Upload**, then drag and drop a file or click to select one. Accepted file types are `.graphql`, `.gql`, and `.json`.

6. Click **Continue**.
7. On **Configure and create**, review **Basic information** and **Endpoint**. For the sample schema URL, the console fills in:

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | `Raw` |
   | **Identifier** | `raw` |
   | **Version** | `1.0` |
   | **Context** | `/raw/v1.0/graphql` |
   | **Description** | Sample Description |
   | **Query and Mutation URL** | Enter the backend URL that serves queries and mutations. |

8. Click **Create**.

## Deploy the API

Deploying places a build of the API on a gateway so requests can reach the backend through that gateway.

1. Create a gateway. See [Manage Gateways](../../administer/managing-gateways.md).
2. Go to the **Deploy** section and deploy the API to a gateway. For more information, see [Deploy an API](../../deploy-api-proxy/overview.md).

## Test the API

After deploying the API, test its operations to verify that requests can be sent through the gateway.

1. In the left navigation menu, click **Test**.
2. Use the GraphQL Console to execute queries against the deployed API and inspect the responses.

For more information, see the [GraphQL Console](../../test-api-proxy/graphql-console.md) guide.

## Publish the API

Publishing makes the API available to developers through a portal, where they can discover the API and access its documentation.

1. Create a portal first if the organization does not have one. See [Manage Portals](../../administer/managing-portals.md).
2. Publish the API. See [Publish an API](../../publish-api-proxy/publish-an-api.md).

## Next Steps

- [Security](../../develop-api-proxy/security/overview.md) - Control who can invoke the API
- [Attach and Manage Policies](../../develop-api-proxy/policy/attach-and-manage-policies.md) - Add capabilities such as rate limiting or header changes to the API
- [Documents](../../develop-api-proxy/documents.md) - Add documents that help consumers use the API
