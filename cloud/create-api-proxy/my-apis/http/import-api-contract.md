---
title: "Import REST API Contract"
description: "Create a REST API proxy by importing an OpenAPI contract URL in WSO2 API Platform, then configure, deploy, test, and publish it."
canonical_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/my-apis/http/import-api-contract/
md_url: https://wso2.com/api-platform/docs/cloud/create-api-proxy/my-apis/http/import-api-contract.md
tags:
  - cloud
  - api-proxy
  - openapi
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Import API Contract

An API proxy acts as an intermediary between an existing API and API Platform, intercepting all requests made to the API.It also functions as a managed API, allowing you to apply essential API management features such as security policies and rate limiting.

In this guide, you will:

- Create an API proxy.
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

In this guide, you will specify a URL to an OpenAPI definition of a sample API to create an API proxy.

1. Go to [API Platform Console](https://console.bijira.dev/) and sign in. This opens the project home page.
2. If you already have one or more components in your project, click + Create. Otherwise, proceed to the next step.
3. Select **Import API Contract**.
4. Select **URL** option and provide the following URL to import the API contract from the GitHub repository:

   ```text
   https://raw.githubusercontent.com/wso2/bijira-samples/refs/heads/main/reading-list-api/openapi.yaml   
   ```

5. Click **Next** and edit pre-defined values as needed. You can keep the default values for this sample.
6. Click **Create** to create the API Proxy. Wait for the setup to complete.

## Configure and Deploy the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Select **Configure and Deploy** option from the **Deploy** dropdown and click it.
3. Select **External** as API Access Mode.
4. Click **Deploy**.

## Test the API Proxy

1. Navigate to the **Test --> OpenAPI Console** page of the API Proxy.
2. Use the OpenAPI Console to test the API Proxy.

## Promote the API Proxy to Production and Publish the API Proxy

1. Navigate to the **Deploy** page of the API Proxy.
2. Click **Promote**. This promotes the API proxy from the Development environment to the Production environment.
3. In the left navigation menu, click **Lifecycle** under **Develop**. This takes you to the **Lifecycle** page.
4. Click **Publish**.
5. In the **Publish API** dialog, click **Confirm** to proceed with publishing the API. If you want to change the display name, make the necessary changes and then click **Confirm**. This sets the API lifecycle state to **Published**.

## API Proxy Behavior

The Reading List API Proxy provides the following functionality:

- **GET /books**: Returns a list of pre-defined books with a warning that changes are not persisted.
- **POST /books**: Adds a new book to the reading list (without including `id` in the request body). Returns the created book along with a warning that changes are not persisted.
- **PUT /books/{id}**: Updates the status of an existing book. The request body only includes the `status` to update, and the `id` is passed in the URL. Returns the updated book with a warning.
- **GET /books/{id}**: Retrieves a book by its `id`. If the `id` does not exist, a 404 error is returned.
- **DELETE /books/{id}**: Deletes a book by its `id`.