---
title: "API Control Plane"
description: "Create, develop, test, and publish API proxies in API Platform Cloud, and administer the users, environments, gateways, and portals of your organization."
slug: /api-control-plane
---

The API Control Plane is where you build and manage API proxies. An API proxy sits in front of your backend service, secures it, applies policies to its traffic, and controls who can use it.

You create and configure API proxies in the control plane. You then deploy them to gateways that run in the data plane, and publish them to Developer Portals where consumers can find and use them. For more on how the two planes work together, see [Control Plane and Data Planes](../key-concepts.md#control-plane-and-data-planes).

## Build an API Proxy

An API proxy goes through the following stages.

| Stage | What You Do |
|:------|:------------|
| Create | Create a REST API proxy [from scratch](../create-api-proxy/rest-apis/start-from-scratch.md) or [with a contract](../create-api-proxy/rest-apis/start-with-a-contract.md), or a GraphQL API proxy [from scratch](../create-api-proxy/graphql-apis/start-from-scratch.md) or [with a schema](../create-api-proxy/graphql-apis/start-with-a-schema.md). |
| Develop | [Secure access to the API](../develop-api-proxy/security/secure-api-access/overview.md), [secure the connection to the backend](../develop-api-proxy/security/secure-backend-communication/oauth2.md), [attach policies](../develop-api-proxy/policy/overview.md), and [add documents](../develop-api-proxy/documents.md) for consumers. |
| Test | Invoke the deployed API proxy from the [API Console](../test-api-proxy/api-console.md), the [GraphQL Console](../test-api-proxy/graphql-console.md), or [cURL](../test-api-proxy/curl.md). |
| Publish | [Publish the API](../publish-api-proxy/publish-an-api.md) to one or more Developer Portals, [customize its portal listing](../publish-api-proxy/customize-portal-listing.md), choose its [subscription plans](../publish-api-proxy/subscription-plans-and-billing.md), and [make it AI-ready](../publish-api-proxy/make-an-api-ai-ready.md). When it is no longer needed, [deprecate or unpublish it](../publish-api-proxy/deprecate-or-unpublish.md). |

You deploy an API proxy to a gateway in the first environment of a [pipeline](../key-concepts.md#pipelines), test it there, and then promote the same build to the next environment.

## Administer Your Organization

Administrators set up the resources that API developers and consumers rely on.

| Task | What You Do |
|:-----|:------------|
| [Manage Users](../administer/managing-users.md) | Invite users to your organization, and manage their access. |
| [Configure Role-Based Access Control](../administer/role-based-access-control.md) | Control what each user can do by assigning roles. |
| [Manage Environments](../administer/managing-environments.md) | Create and delete the environments that API proxies are deployed to and promoted through. |
| [Manage Gateways](../gateways.md) | View and manage the gateways that run your API proxies. |
| [Manage Portals](../portals.md) | Create, edit, and delete the Developer Portals that you publish APIs to. |
| [Customize the Portal Theme](../developer-portal/theming-developer-portal.md) | Customize the look and feel of your Developer Portals. |
| [Manage Subscription Plans](../administer/creating-subscription-plans.md) | Create the subscription plans that define how consumers can use your APIs. |

To track the traffic, logs, and health of your API proxies, see [Monitor](../monitor/overview.md).

## Get Started

To build your first API proxy and publish it to the Developer Portal, follow the [Quick Start Guide](../getting-started/api-proxy.md).
