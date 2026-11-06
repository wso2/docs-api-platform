---
title: "Security"
pagination_label: "Security"
description: "Control who can invoke your API proxies with API keys or OAuth2 access tokens."
---

API security refers to the measures and practices used to protect Application Programming Interfaces (APIs) from potential threats and vulnerabilities. APIs are essential for enabling communication and data exchange between different software applications and services, making them a critical component in modern software development. However, their openness and accessibility can also make them targets for various security risks.

Authentication and authorization are key aspects of API security.

- **Authentication:** Ensures that only authorized users or applications can access the API. This can involve using API keys, tokens, or more advanced authentication methods like OAuth 2.0.
- **Authorization:** Controls what authenticated users or applications are allowed to do within the API. Authorization mechanisms restrict access to specific resources and actions based on user roles or permissions.

## Authentication Methods

You secure an API proxy by attaching an authentication policy to it.

| Method | Policy | Consumers Send | Where Consumers Get It |
|:-------|:-------|:---------------|:-----------------------|
| [API key](./api-key-authentication.md) | **API Key Auth** | The API key, in the header that the policy sets. | From the API publisher, who creates the key in the API Control Plane. |
| [OAuth2](./oauth2-authentication.md) | **JWT Auth** | `Authorization: Bearer <access-token>` | In the API Portal and AI Hub, from ThunderID by default. |

Subscription plans are separate from security. They set usage limits for the consumers who subscribe to an API. See [Subscription Plans](../../publish-api-proxy/subscription-plans-and-billing.md).
