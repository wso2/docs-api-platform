---
title: "Manage GraphQL APIs with the Platform API"
description: "Create, deploy, and manage GraphQL APIs in the API Control Plane by using the Platform REST API."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/platform-api/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/platform-api.md
tags:
  - api-control-plane
  - graphql
  - rest-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "how-to"
---

# Manage GraphQL APIs with the Platform API

The Platform API is the REST API of the API Control Plane. Use it to automate the tasks that you do in the console, for example in a CI/CD pipeline.

All paths in this guide are relative to the base URL `https://<control-plane-host>/api/v0.9`. Every request needs an access token in the `Authorization` header.

## Before you begin

- Get an access token for the Platform API. The examples use `<access-token>` as a placeholder.
- Find the handle of the project to create the API in. The examples use `production-apis`.
- To deploy the API, find the handle of a connected gateway. The examples use `prod-gateway-01`.

## Create a GraphQL API

Submit a `POST` request to `/graphql-apis`. The request must use `multipart/form-data` with these parts:

- `metadata` (required): a JSON string that describes the API.
- `sdlFile`: the schema file. Required only when `schemaSource` is `file`.

The following example creates an API and fetches its schema by introspecting the backend:

```bash
curl -X POST https://<control-plane-host>/api/v0.9/graphql-apis \
  -H "Authorization: Bearer <access-token>" \
  -F 'metadata={
    "displayName": "Countries GraphQL API",
    "version": "v1.0",
    "projectId": "production-apis",
    "context": "/countries/graphql",
    "schemaSource": "introspection",
    "upstream": { "main": { "url": "https://countries.trevorblades.com/graphql" } }
  };type=application/json'
```

To upload a schema file instead, set `schemaSource` to `file` and add an `sdlFile` part:

```bash
curl -X POST https://<control-plane-host>/api/v0.9/graphql-apis \
  -H "Authorization: Bearer <access-token>" \
  -F 'metadata={
    "displayName": "Countries GraphQL API",
    "version": "v1.0",
    "projectId": "production-apis",
    "schemaSource": "file",
    "upstream": { "main": { "url": "https://countries.trevorblades.com/graphql" } }
  };type=application/json' \
  -F 'sdlFile=@countries-schema.graphql'
```

### Metadata fields

The `metadata` part accepts the following fields:

| Field | Required | Description |
| :--- | :--- | :--- |
| `displayName` | Yes | The API name, 1 to 128 characters. |
| `version` | Yes | The API version, 1 to 30 characters, with no spaces or slashes. The `displayName` and `version` pair must be unique in the organization. |
| `projectId` | Yes | The handle of the project. |
| `upstream` | Yes | The backend. Set `upstream.main.url` to the GraphQL endpoint. Optionally, set `upstream.sandbox` and `auth`. |
| `id` | No | The API handle, 3 to 40 characters. If you omit it, the control plane generates one from `displayName`. |
| `context` | No | The gateway path. If you omit it, the control plane uses `/<handle>/v<version>/graphql`. |
| `description` | No | A description of the API. |
| `schemaSource` | No | `introspection`, `url`, `file`, or `inline`. If you omit it, the control plane infers it from the other fields. |
| `sdlUrl` | For `url` | The URL of a static SDL file. |
| `sdl` | For `inline` | The SDL as a string. |
| `policies` | No | The API-level policies. |
| `subscriptionPlans` | No | The subscription plans for the API. |

### How the control plane resolves the schema

The control plane resolves the schema when you create the API:

- If the SDL can't be parsed, the request fails with a `400` response. The `details.sdlErrors` array lists each error with its line and column.
- If the control plane can't reach `sdlUrl` or introspect the backend, it still creates the API, with an empty schema.

To check a schema without creating an API, submit the same request to `/graphql-apis/validate-schema`. The response shows whether the schema resolved, and includes the SDL or the parse errors.

## Get an API and its schema

To get the API metadata, submit a `GET` request to `/graphql-apis/<api-handle>`:

```bash
curl https://<control-plane-host>/api/v0.9/graphql-apis/countries-graphql-api \
  -H "Authorization: Bearer <access-token>"
```

The metadata doesn't include the schema. To get the SDL, submit a `GET` request to `/graphql-apis/<api-handle>/sdl`:

```bash
curl https://<control-plane-host>/api/v0.9/graphql-apis/countries-graphql-api/sdl \
  -H "Authorization: Bearer <access-token>"
```

To list GraphQL APIs, submit a `GET` request to `/graphql-apis`. To filter the list by project, add the `projectId` query parameter.

## Update or delete an API

To update an API, submit a `PUT` request to `/graphql-apis/<api-handle>` in the same multipart format as the create request.

!!! note
    Include `schemaSource` and its matching schema material in every update. If you omit it, the request fails. If the schema can't be resolved, the control plane keeps the stored schema.

To delete an API, submit a `DELETE` request to `/graphql-apis/<api-handle>`.

## Deploy an API to a gateway

To deploy the API, submit a `POST` request to `/graphql-apis/<api-handle>/deployments`:

```bash
curl -X POST https://<control-plane-host>/api/v0.9/graphql-apis/countries-graphql-api/deployments \
  -H "Authorization: Bearer <access-token>" \
  -H 'Content-Type: application/json' \
  -d '{"name": "v1.0-production", "base": "current", "gatewayId": "prod-gateway-01"}'
```

The request body takes the following fields:

- `name`: a name for the deployment.
- `base`: `current` to deploy the current version of the API, or the ID of an earlier deployment.
- `gatewayId`: the handle of the gateway.

The response returns the deployment with the status `DEPLOYING`. To check the status, submit a `GET` request to `/graphql-apis/<api-handle>/deployments`.

To manage an existing deployment, use these endpoints:

| Task | Request |
| :--- | :--- |
| Undeploy | `POST /graphql-apis/<api-handle>/deployments/<deployment-id>/undeploy?gatewayId=<gateway-handle>` |
| Restore an archived or undeployed deployment | `POST /graphql-apis/<api-handle>/deployments/<deployment-id>/restore?gatewayId=<gateway-handle>` |
| Delete an undeployed deployment | `DELETE /graphql-apis/<api-handle>/deployments/<deployment-id>` |

## Manage API keys

To create an API key, submit a `POST` request to `/graphql-apis/<api-handle>/api-keys`. The `displayName` field is required.

```bash
curl -X POST https://<control-plane-host>/api/v0.9/graphql-apis/countries-graphql-api/api-keys \
  -H "Authorization: Bearer <access-token>" \
  -H 'Content-Type: application/json' \
  -d '{"displayName": "countries-demo-key"}'
```

To update or rotate a key, submit a `PUT` request to `/graphql-apis/<api-handle>/api-keys/<api-key-id>`. To revoke a key, submit a `DELETE` request to the same path.

If the control plane can't reach the gateways where the API is deployed, API key requests fail with a `503` response.
