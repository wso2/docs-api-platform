---
title: "Deploy a GraphQL API to the Gateway"
description: "Deploy, secure, update, and remove GraphQL APIs directly on API Platform Gateway with the gateway controller management API or the ap CLI, without a control plane."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/deployment/deploying-apis/graphql-api-deployment/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/deployment/deploying-apis/graphql-api-deployment.md
tags:
  - api-gateway
  - deployment
  - graphql
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-30
content_type: "how-to"
---

# Deploy a GraphQL API to the Gateway

You can deploy a GraphQL API directly to API Platform Gateway, without an API Control Plane. You describe the API in a `GraphQLApi` YAML file and send it to the gateway controller, either with the management API or with the `ap` CLI. The gateway starts serving the API as soon as you deploy it.

This guide is for developers and platform teams who run a gateway on its own or who manage APIs from CI/CD. To design and deploy GraphQL APIs from the control plane instead, see [GraphQL APIs overview](../../../../api-control-plane/next/graphql-apis/overview.md).

## How the gateway serves a GraphQL API

The gateway exposes each GraphQL API on a single path, called the *context*. For example, `/countries/v1/graphql`.

- Clients send every query and mutation as an HTTP `POST` request to the context. The gateway forwards the request body to the backend unchanged.
- The context is matched exactly. The gateway returns `404` for a `GET` request, and for any path below the context.
- The gateway forwards the request to the path of the backend URL. For example, a request to `/countries/v1/graphql` with the backend `https://countries.trevorblades.com/graphql` reaches the backend at `/graphql`.
- The gateway doesn't support GraphQL subscriptions or WebSocket transport.
- If you attach a `cors` policy, the gateway also routes `OPTIONS` requests so that browsers can send preflight requests.
- The gateway doesn't store or validate the GraphQL schema. Introspection queries reach the backend like any other query.

## Before you begin

- Start the gateway and export the admin credentials, as described in the [Quick Start Guide](../../quick-start-guide.md). The examples in this guide use `$ADMIN_USERNAME` and `$ADMIN_PASSWORD`.
- To use the CLI, install `ap` and point it at the gateway with `ap gateway add` and `ap gateway use`. For more information, see the [CLI reference](../../../../tools/cli/reference.md).

## Step 1: Define the API

Create a file named `countries-graphql-api.yaml` with the following content:

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: GraphQLApi
metadata:
  name: countries-graphql-v1
spec:
  displayName: Countries
  version: v1
  context: /countries/$version/graphql
  upstream:
    main:
      url: https://countries.trevorblades.com/graphql
```

The `spec` section supports the following fields:

| Field | Required | Description |
| :--- | :--- | :--- |
| `displayName` | Yes | A name of up to 100 characters. Use letters, numbers, spaces, hyphens, underscores, and dots. |
| `version` | Yes | The API version, for example `v1` or `v1.0`. |
| `context` | Yes | The path that the gateway serves the API on. It must start with `/` and can't end with `/`. The gateway replaces `$version` with the value of `version`. |
| `upstream.main.url` | Yes | The URL of the GraphQL backend. It must use `http` or `https`. |
| `upstream.sandbox.url` | No | The URL of a sandbox backend. For more information, see [Route sandbox traffic](#route-sandbox-traffic). |
| `policies` | No | The policies that apply to every request. For more information, see [Apply policies](#apply-policies). |
| `subscriptionPlans` | No | The names of the subscription plans that are available for the API. |
| `deploymentState` | No | `deployed` (the default) or `undeployed`. For more information, see [Undeploy an API](#undeploy-an-api). |

`metadata.name` identifies the API on the gateway. You use it as the API ID in the management API and the CLI.

!!! note
    A `GraphQLApi` has no `operations`, `upstreamDefinitions`, `vhosts`, or `resilience` fields, and it doesn't carry a schema. Set the backend URL directly in `upstream.main.url`. A `ref` to an upstream definition is rejected.

## Step 2: Deploy the API

=== "CLI"

    ```bash
    ap gateway apply -f countries-graphql-api.yaml
    ```

    `ap gateway apply` creates the API, or updates it if an API with the same `metadata.name` already exists.

=== "Management API"

    ```bash
    curl -X POST http://localhost:9090/api/management/v1/graphql-apis \
      -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
      -H 'Content-Type: application/yaml' \
      --data-binary @countries-graphql-api.yaml
    ```

    A successful request returns `201 Created` with the API and a `status` block that shows `"state": "deployed"`.

The gateway rejects an invalid definition with `400 Bad Request` and lists each problem in an `errors` array. It returns `409 Conflict` if an API with the same `metadata.name`, or the same `displayName` and `version`, already exists.

## Step 3: Invoke the API

Send a query to the context:

```bash
curl -X POST http://localhost:8080/countries/v1/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"query { country(code: \"LK\") { name capital currency } }"}'
```

The response contains the fields that the query asks for:

```json
{"data":{"country":{"capital":"Colombo","currency":"LKR","name":"Sri Lanka"}}}
```

A mutation uses the same request shape. Send it to the same context with the mutation in the `query` field.

!!! tip
    The gateway applies a new or updated API within a few seconds. If you get `404` right after you deploy, wait a moment and send the request again.

## Secure the API with an API key

1. Add the `api-key-auth` policy to the `spec` section of `countries-graphql-api.yaml`:

    ```yaml
      policies:
        - name: api-key-auth
          version: v1
          params:
            key: API-Key
            in: header
    ```

2. Apply the updated definition:

    ```bash
    ap gateway apply -f countries-graphql-api.yaml
    ```

3. Create an API key. The response contains the key in `apiKey.apiKey`. Copy it, because the gateway doesn't show it again.

    === "CLI"

        ```bash
        ap gateway graphql-api api-key create --id countries-graphql-v1 --name my-key
        ```

        To make the key expire, add `--expires-in-duration` and `--expires-in-unit`, for example `--expires-in-duration 30 --expires-in-unit days`.

    === "Management API"

        ```bash
        curl -X POST http://localhost:9090/api/management/v1/graphql-apis/countries-graphql-v1/api-keys \
          -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
          -H 'Content-Type: application/json' \
          -d '{"name":"my-key"}'
        ```

4. Send the key in the header that the policy names:

    ```bash
    curl -X POST http://localhost:8080/countries/v1/graphql \
      -H 'Content-Type: application/json' \
      -H 'API-Key: <api-key>' \
      -d '{"query":"query { country(code: \"LK\") { name } }"}'
    ```

    A request without a valid key gets `401 Unauthorized`.

You can manage the key later with these commands:

| Task | CLI command |
| :--- | :--- |
| List the keys of an API | `ap gateway graphql-api api-key list --id countries-graphql-v1` |
| Replace a key with a newly generated value | `ap gateway graphql-api api-key regenerate --id countries-graphql-v1 --key-name my-key` |
| Set a key to a value that you supply | `ap gateway graphql-api api-key update --id countries-graphql-v1 --key-name my-key` |
| Revoke a key | `ap gateway graphql-api api-key revoke --id countries-graphql-v1 --key-name my-key` |

After you regenerate a key, only the new value works. After you revoke a key, requests that use it get `401`. For the equivalent management API requests, see [GraphQL API Management](../../gateway-controller-management-api/graphql-api-management.md).

## Apply policies

A GraphQL API has a single route, so each policy in `spec.policies` applies to every request that the API receives. You can't attach a policy to an individual query or mutation.

You can use the gateway's standard policies, such as `jwt-auth`, `api-key-auth`, `basic-ratelimit`, `cors`, and `set-headers`. The `mtls-auth` policy is supported on REST APIs only, and the gateway rejects it on a GraphQL API. For the list of policies, see [Policies overview](../../policies/overview.md).

- The `basic-ratelimit` policy counts each `POST` request as one request, whatever the query asks for.
- If you attach `cors` together with an authentication policy, list `cors` first. The `OPTIONS` route runs the same policies as the API, so an authentication policy listed earlier would reject the browser's preflight request.

## Route sandbox traffic

To send test traffic to a separate backend, add a sandbox upstream:

```yaml
  upstream:
    main:
      url: https://countries.trevorblades.com/graphql
    sandbox:
      url: https://sandbox.example.com/graphql
```

The gateway routes a request to the sandbox backend when its `Host` header matches the gateway's sandbox virtual host. By default, that's any host that starts with `sandbox-`, set by `router.vhosts.sandbox.default` in the gateway configuration. Other requests go to the main backend.

## Update, undeploy, or delete an API

### Update an API

Edit the definition file and apply it again with `ap gateway apply -f`, or send it with `PUT /graphql-apis/{id}`. The `metadata.name` in the file must match the API ID. The gateway applies the change to new requests within a few seconds.

### Undeploy an API

To stop serving an API without removing it, set `deploymentState: undeployed` in the `spec` section and apply the definition. The gateway keeps the definition, its policies, and its API keys. To serve the API again, set `deploymentState: deployed` and apply the definition.

### Delete an API

=== "CLI"

    ```bash
    ap gateway graphql-api delete --id countries-graphql-v1
    ```

=== "Management API"

    ```bash
    curl -X DELETE http://localhost:9090/api/management/v1/graphql-apis/countries-graphql-v1 \
      -u "$ADMIN_USERNAME:$ADMIN_PASSWORD"
    ```

Deleting an API removes its definition and its API keys.

### Find an API

| Task | CLI command | Management API |
| :--- | :--- | :--- |
| List the GraphQL APIs | `ap gateway graphql-api list` | `GET /graphql-apis` |
| Get one API | `ap gateway graphql-api get --id countries-graphql-v1` | `GET /graphql-apis/{id}` |

`GET /graphql-apis` accepts the `displayName`, `version`, `context`, and `status` (`deployed` or `undeployed`) query parameters to filter the list. With the CLI, you can also find an API with `--display-name` and `--version` instead of `--id`, and choose the output with `--format yaml` or `--format json`.

## Sync the API to the API Control Plane

If the gateway is connected to the API Control Plane, it also sends each GraphQL API that you deploy directly to the control plane. The control plane shows the API as **Gateway-managed**. You can view the API there, but you can't edit or deploy it from the control plane. For more information, see [Manage a GraphQL API](../../../../api-control-plane/next/graphql-apis/manage-graphql-api.md#gateway-managed-graphql-apis).

The gateway sends the API only when `controller.controlplane.deployment_sync_enabled` is `true`, which is the default. It doesn't send GraphQL APIs to an on-premises WSO2 API Manager. For REST APIs and API Manager, see [Bottom-Up API Deployment Guide](bottom-up-api-deployment.md).

## Related topics

- [GraphQL API Management](../../gateway-controller-management-api/graphql-api-management.md): the management API reference for GraphQL APIs and their API keys.
- [GraphQL APIs overview](../../../../api-control-plane/next/graphql-apis/overview.md): GraphQL APIs in the API Control Plane.
