---
title: "GraphQL Query Limits Overview"
description: "Overview of the Static Query Analyzer, which enforces GraphQL Max Depth and Max Complexity limits from subscription policies."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/design/rate-limiting/graphql-api/overview-query-limits-for-graphql/
md_url: https://wso2.com/api-platform/docs/api-manager/4.4.0/design/rate-limiting/graphql-api/overview-query-limits-for-graphql.md
tags:
  - api-manager
  - graphql
  - rate-limiting
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-15
content_type: "concept"
---

# GraphQL Rate Limiting Overview 

GraphQL is an open-source data query & manipulation language for APIs. It provides a common interface between the client and the server for data fetching and manipulations.

With GraphQL queries, the client which requests data has more flexibility compared to REST where it can request any amount of data it wishes. This flexibility comes at a cost since now the GraphQL service might have to perform complex operations to serve each type of query it receives. To overcome this hardship, the query needs to be analyzed before execution. Without any protection, backends are vulnerable to DoS attacks(which can cause excessive load on the server, database or network), which are caused by the execution of malicious and complex queries that are passed either intentionally or unintentionally. 

Since clients have the possibility to request very complex queries, servers must be ready to handle them properly. 
**WSO2 API-Manager introduces Static Query Analyzer to Secure GraphQL APIs** to address such issues.

### Static Query Analyzer

The Static Query Analyzer detects complex queries based on a predefined policy and prevents them from reaching the backend. A basic outline of such a policy is shown below.

   - [Query Depth Limitation](../../../design/rate-limiting/graphql-api/query-depth-limitation.md)
    
   - [Query Complexity Limitation](../../../design/rate-limiting/graphql-api/query-complexity-limitation.md)

To implement applicable query limits for the GraphQL APIs, two optional fields, **GraphQL Max Depth** and **GraphQL Max Complexity**, were introduced to Subscription Policies.

The **GraphQL Max Depth** and **GraphQL Max Complexity** values can be set through the Subscription Policy UI in the admin portal. Once done, the corresponding subscription plan can be chosen via the business plans to engage these validations for an API.

Also, the policy for the custom complexity values would be as follows;

   [![GraphQL Complexity Policy](../../../assets/img/learn/graphql-complexity-policy.png)](../../../assets/img/learn/graphql-complexity-policy.png)


The following diagram illustrates how a given policy is enforced at runtime.

  [![Model of the GraphQL Query Analysis](../../../assets/img/learn/graphql-query-complexity-model.jpg)](../../../assets/img/learn/graphql-query-complexity-model.jpg)


The following diagram illustrates the overall request/response flow of a GraphQL API invocation.

  [![Flow of the GraphQL Query Analysis](../../../assets/img/learn/graphql-query-analysis-flow.jpg)](../../../assets/img/learn/graphql-query-analysis-flow.jpg)