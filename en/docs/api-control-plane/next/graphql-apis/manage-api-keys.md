---
title: "Manage API keys for a GraphQL API"
description: "Create and revoke API keys that authenticate requests to a deployed GraphQL API in the API Control Plane console."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/manage-api-keys/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/manage-api-keys.md
tags:
  - api-control-plane
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "how-to"
---

# Manage API keys for a GraphQL API

API keys authenticate requests that clients send to a GraphQL API through a gateway. The control plane stores a hash of each key and shares it with the gateways where the API is deployed.

The **API Keys** panel appears on the overview page after you deploy the API. The panel lists only the keys that you created.

## Create an API key

1. Open the overview page of the GraphQL API.
2. In the **API Keys** panel, select **Add API Key**.
3. In **Key name**, enter a name for the key. For example, `Production key`.
4. Optional: Under **Expires in**, enter an **Expiry duration** and select an **Expiry time unit**.
5. Select **Create key**.
6. Copy the key, and store it somewhere secure. The console shows the key only once.
7. Select **I have copied the key**.

## Revoke an API key

1. In the **API Keys** panel, find the key, and then select **Revoke**.
2. In the **Revoke API Key** dialog, confirm the action.

After you revoke a key, the gateways reject requests that use it.
