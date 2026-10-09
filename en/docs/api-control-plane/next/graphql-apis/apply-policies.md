---
title: "Apply policies to a GraphQL API"
description: "Attach Policy Hub policies such as authentication, rate limiting, and CORS to a GraphQL API in the API Control Plane console."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/apply-policies/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/apply-policies.md
tags:
  - api-control-plane
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "how-to"
---

# Apply policies to a GraphQL API

Policies run on the gateway for every request that a GraphQL API receives. A GraphQL API has a single endpoint, so each policy applies to the whole API rather than to individual resources.

The console lists the policies that are available from the [Policy Hub](../../../policy-hub/overview.md).

## Attach a policy

1. Open the GraphQL API, and then select **Develop** > **Policies**.
2. In **Available policies**, find the policy that you want. To filter the list, use **Search policies**.
3. Drag the policy into the policy panel, or select it.
4. In the **Configure** pane, enter the policy settings, and then select **Attach policy**.
5. Select **Save**.

To apply the saved policies on a gateway, redeploy the API. For more information, see [Deploy a GraphQL API](deploy-graphql-api.md).

!!! tip
    If browser-based clients call the API, attach the `cors` policy. The gateway then also routes `OPTIONS` preflight requests to the API.

## GraphQL-specific policies

To control access to individual query and mutation fields by scope or claim, use the `graphql-authz` policy. For more information, see [GraphQL authorization policy](graphql-authorization-policy.md).
