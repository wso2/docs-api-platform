---
title: "GraphQL APIs overview"
description: "Expose a GraphQL backend through the API Platform Gateway and manage its schema, policies, deployments, and API keys from the API Control Plane."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/overview/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/overview.md
tags:
  - api-control-plane
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "overview"
---

# GraphQL APIs overview

A GraphQL API in the API Control Plane exposes a GraphQL backend through the API Platform Gateway. You define the API once in the control plane, then deploy it to one or more gateways. This guide is for API developers and platform teams who manage GraphQL backends.

GraphQL uses a single endpoint and a typed schema. Clients send a query or mutation that names exactly the fields they need, and the backend returns only those fields.

## How the gateway exposes a GraphQL API

The gateway serves each GraphQL API on a single path, called the *context*. For example, `/countries-graphql-api/v1.0/graphql`.

- Clients send every query and mutation as an HTTP `POST` request to the context.
- The gateway doesn't route `GET` requests for GraphQL APIs.
- The gateway doesn't support GraphQL subscriptions or WebSocket transport.
- If you attach a `cors` policy, the gateway also routes `OPTIONS` requests so that browsers can send preflight requests.

## How the control plane stores the schema

The control plane stores the GraphQL schema in Schema Definition Language (SDL). You can supply the schema in one of these ways:

- Import an SDL file from a URL.
- Upload a `.graphql`, `.gql`, or `.json` file. The control plane converts a `.json` introspection result to SDL.
- Let the control plane run an introspection query against the backend endpoint.

The schema stays in the control plane. It powers the schema explorer and the test console, and the control plane doesn't send it to the gateway.

## What you can do with a GraphQL API

| Task | Where to start |
| :--- | :--- |
| Create a GraphQL API from a schema or a backend endpoint | [Create a GraphQL API](create-graphql-api.md) |
| View the schema, and edit the API details or backend endpoint | [Manage a GraphQL API](manage-graphql-api.md) |
| Attach policies such as authentication or rate limiting | [Apply policies to a GraphQL API](apply-policies.md) |
| Restrict query and mutation fields by scope or claim | [GraphQL authorization policy](graphql-authorization-policy.md) |
| Deploy the API to a gateway, and stop or restore deployments | [Deploy a GraphQL API](deploy-graphql-api.md) |
| Run queries against a deployed API from the console | [Test a GraphQL API](test-graphql-api.md) |
| Create and revoke API keys | [Manage API keys for a GraphQL API](manage-api-keys.md) |
| Automate these tasks over REST | [Manage GraphQL APIs with the Platform API](platform-api.md) |

## How GraphQL APIs differ from REST APIs

GraphQL APIs have a single endpoint, so a few REST features don't apply:

- Policies apply to the whole API. There are no per-resource policies.
- There's no **Definition** page. You view the schema on the API overview instead.
- You can't edit the SDL in the console after you create the API.
