---
title: "Create a GraphQL API"
description: "Create a GraphQL API in the API Control Plane console by importing a schema from a URL or file, or by introspecting a backend endpoint."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/create-graphql-api/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/create-graphql-api.md
tags:
  - api-control-plane
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "how-to"
---

# Create a GraphQL API

You can create a GraphQL API in the API Control Plane console in one of two ways:

- **Start with a schema:** import an SDL file from a URL, or upload a schema file.
- **Start from scratch:** enter a backend endpoint. The console tries to fetch the schema by running an introspection query against it.

## Before you begin

- Sign in to the API Control Plane console.
- Make sure you have a project to create the API in.
- Have the URL of your GraphQL backend ready. To follow along with sample values, use `https://countries.trevorblades.com/graphql`.

## Step 1: Choose the API type

1. On the APIs page of your project, select **Create API**. If the project has no APIs, select **Create API** in the **Create your first API** panel.
2. Select **GraphQL API**.
3. Select **Continue**.

## Step 2: Define the schema

Choose one of the following options.

=== "Start with a schema"

    1. Select **Start with a schema**.
    2. Under **Import the schema from**, select one of the following:
        - **URL:** In **Schema URL**, enter the URL of the SDL file. To use a sample schema, select **Try with Sample Schema**.
        - **Upload:** Drop a `.graphql`, `.gql`, or `.json` file into the upload area. The file can be up to 5 MiB.
    3. Wait for the console to validate the schema. The types appear in the schema explorer on the right.
    4. Select **Continue**.

    If the console can't resolve the schema, it shows an error. Check that the file contains valid GraphQL SDL, or a valid introspection result for a `.json` file.

=== "Start from scratch"

    1. Select **Start from scratch**.
    2. In **Endpoint URL**, enter the URL of your GraphQL backend. To use a sample endpoint, select **Try with Sample URL**.
    3. Wait for the console to check the endpoint. If introspection succeeds, the console shows the number of types it fetched.
    4. Select **Continue**.

    If introspection is disabled on the backend, the console shows a warning. You can still continue, and the API starts with an empty schema.

## Step 3: Configure and create the API

1. Under **Basic information**, enter the following details:

    | Field | Required | Description |
    | :--- | :--- | :--- |
    | **Name** | Yes | The display name of the API. If you imported a schema, the console suggests a name. |
    | **Identifier** | Yes | A URL-friendly ID, generated from the name until you change it. The identifier must be unique, and it can't change after you create the API. |
    | **Version** | Yes | The API version, for example `1.0`. |
    | **Context** | No | The path that the gateway serves the API on. The default is `/<identifier>/v<version>/graphql`. If you clear the field, the server picks a context. |
    | **Description** | No | A description of the API. |

2. Under **Endpoint**, check the **Query and Mutation URL**. This is the backend URL that the gateway routes `POST` requests to. If you started from scratch, the console fills it in for you.
3. Select **Create**.

The console creates the API and opens its overview page.

The name and version pair must be unique in your organization. If another GraphQL API already uses the same pair, the console shows an error.

## Next steps

- [Apply policies to a GraphQL API](apply-policies.md)
- [Deploy a GraphQL API](deploy-graphql-api.md)
