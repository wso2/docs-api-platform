---
title: "Deploy a GraphQL API"
description: "Deploy a GraphQL API from the API Control Plane to a connected API Platform Gateway, and stop, redeploy, or restore deployments."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/deploy-graphql-api/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/deploy-graphql-api.md
tags:
  - api-control-plane
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "how-to"
---

# Deploy a GraphQL API

When you deploy a GraphQL API, the control plane sends the current API configuration to a gateway. The configuration includes the context, backend endpoint, and policies. The schema stays in the control plane.

## Before you begin

Connect at least one API Platform Gateway to the control plane. For more information, see [Control plane connection](../../../api-gateway/next/deployment/production-deployment/control-plane-connection.md).

## Deploy the API to a gateway

1. Open the GraphQL API, and then select **Deploy**. You can also select **Deploy to Gateway** on the overview page.
2. Find the gateway that you want. To filter the list, use **Search gateways**.
3. On the gateway card, select **Deploy**.

The console generates a deployment name and deploys the current version of the API. The deployment status changes from **Deploying** to **Deployed** when the gateway accepts it.

If no gateways are connected, the page shows **No gateway added yet**. Select **Add Gateway** to register one.

## Manage deployments

Each gateway card shows the status of the API on that gateway. The status is one of **Deploying**, **Deployed**, **Undeploying**, **Failed**, **Archived**, or **Not yet deployed**.

| Action | What it does |
| :--- | :--- |
| **Redeploy** | Deploys the current version of the API again. Use it after you change the API details, endpoint, or policies. |
| **Stop** | Undeploys the API from the gateway. |
| **Restore** | Opens **Select Deployment to Restore**, where you choose an earlier deployment to deploy again. |

## Invoke the deployed API

After the API is deployed, the overview page shows an **Invoke URL** panel. To copy the gateway URL of the API, select **Copy URL**.

Send queries and mutations to the invoke URL as `POST` requests with a JSON body. For example:

```bash
curl -X POST https://<gateway-host>/countries-graphql-api/v1.0/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ country(code: \"US\") { name capital } }"}'
```

If the API has an authentication policy, include the credentials that the policy expects. For more information, see [Manage API keys for a GraphQL API](manage-api-keys.md).

## Next steps

- [Test a GraphQL API](test-graphql-api.md)
