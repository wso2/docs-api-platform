---
title: "Import GraphQL API Contract"
description: "Create a GraphQL API proxy by importing a schema definition URL in WSO2 API Platform, then configure, deploy, test, and publish it."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/my-apis/graphql/import-api-contract/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/my-apis/graphql/import-api-contract.md
tags:
  - cloud
  - api-proxy
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Import API Contract

A GraphQL API proxy operates based on the GraphQL query language specification. GraphQL provides a flexible and efficient approach to API development by allowing clients to request exactly the data they need, nothing more and nothing less.

Unlike traditional REST APIs that require multiple endpoints for different resources, GraphQL uses a single endpoint and a type system to define the API's capabilities. This enables clients to compose complex queries that fetch related data in a single request, reducing over-fetching and under-fetching of data. GraphQL is ideal for applications that need flexible data fetching and efficient data aggregation.

In this guide, you will:

- Create a GraphQL API proxy.
- Configure and Deploy the API proxy.
- Test the API proxy to verify its functionality.

## Prerequisites

- If you're signing in to the API Platform Console for the first time, create an organization:
    1. Go to [API Platform Console](https://console.bijira.dev/) and sign in using your preferred method.
    2. Enter a unique organization name. For example, `Stark Industries`.
    3. Read and accept the privacy policy and terms of use.
    4. Click **Create**.

  This creates the organization and opens the **Project Home** page of the default project created for you.

## Create an API Proxy

In this guide, you will use a sample URL to import a GraphQL schema definition and create a GraphQL API proxy.

1. Go to [API Platform Console](https://console.bijira.dev/) and sign in. This opens the project home page.
2. If you already have one or more components in your project, click + Create. Otherwise, proceed to the next step.
3. Select **Import API Contract**.
4. Select the API Type as **GraphQL**.
5. Select **URL** option and click **Try with Sample URL** to use the sample GraphQL schema URL.

6. Click **Next** and edit pre-defined values as needed. You can keep the default values for this sample.
7. Click **Create** to create the API Proxy. Wait for the setup to complete.

## Configure and Deploy the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Select **Configure and Deploy** option from the **Deploy** dropdown and click it.
3. Select **External** as API Access Mode.
4. Click **Deploy**.

## Test the API Proxy

1. Navigate to the **Test --> Console** page of the API Proxy.
2. Use the GraphQL Console to test the API Proxy.

## Promote the API Proxy to Production and Publish the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Click **Promote**. This promotes the API proxy from the Development environment to the Production environment.
3. In the left navigation menu, click **Lifecycle** under **Develop**. This takes you to the **Lifecycle** page.
4. Click **Publish**.
5. In the **Publish API** dialog, click **Confirm** to proceed with publishing the API. If you want to change the display name, make the necessary changes and then click **Confirm**. This sets the API lifecycle state to **Published**.

## API Proxy Behavior

This GraphQL API Proxy enables clients to query data using GraphQL queries and mutations. Clients can request exactly the fields they need, reducing bandwidth and improving performance. The API supports complex queries that fetch related data in a single request, making it efficient for applications with varying data requirements.

