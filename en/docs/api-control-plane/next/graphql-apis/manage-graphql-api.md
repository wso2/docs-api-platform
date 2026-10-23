---
title: "Manage a GraphQL API"
description: "View the schema of a GraphQL API, and edit its details and backend endpoint in the API Control Plane console."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/manage-graphql-api/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/manage-graphql-api.md
tags:
  - api-control-plane
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "how-to"
---

# Manage a GraphQL API

The overview page of a GraphQL API shows its schema, backend endpoint, deployments, and API keys. From this page, you can view the schema and edit the API.

To open the overview page, select the GraphQL API from the APIs page of your project. To show only GraphQL APIs, filter the list by the GraphQL type.

## View the schema

The **Schema** card on the overview page shows the schema in the schema explorer.

- To browse types and fields, use **Explorer**. To find a type or field, use **Search types and fields**.
- To view the raw schema, select **SDL**.
- To save the schema as a file, select **Download SDL**.

The console doesn't let you edit the SDL after you create the API.

## Edit the API details

1. On the overview page, select **Edit API details**.
2. Update any of the following fields: **Name**, **Version**, **Context**, **Endpoint URL**, and **Description**.
3. Select **Save changes**.

If the control plane fetched the schema by introspection, saving the API runs introspection against the backend again. Otherwise, the control plane keeps the stored schema.

## Change the backend endpoint

1. On the overview page, in the **Endpoint** panel, select **Edit endpoint**.
2. In **Endpoint URL**, enter the new backend URL.
3. Select **Save**.

To apply a changed endpoint on a gateway, redeploy the API. For more information, see [Deploy a GraphQL API](deploy-graphql-api.md).

## Gateway-managed GraphQL APIs

If a GraphQL API was created directly on a gateway and synchronized to the control plane, the overview page labels it **Gateway-managed**. You can view a gateway-managed API in the console, but you can't edit or deploy it from the control plane.
