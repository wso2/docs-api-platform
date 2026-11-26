---
title: "Global Backends"
description: "Define a backend once for the whole API Platform Gateway and route API requests to it by name or by request context with the Dynamic Endpoint policy."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/backends/global-backends/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/backends/global-backends.md
tags:
  - api-gateway
  - backends
  - routing
  - dynamic-endpoint
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "how-to"
---

# Global Backends

A *Backend* is a backend service that you define once for the whole gateway, instead of inside one API. Each Backend has a name, optional labels, and one or more endpoint URLs. Any API on the gateway can route requests to a Backend with the [Dynamic Endpoint](https://wso2.com/api-platform/policy-hub/policies/dynamic-endpoint) policy.

APIs refer to Backends by name. You can add or change a Backend without editing or redeploying the APIs that route to it. To remove a Backend that a deployed API names in `targetUpstream`, first change and redeploy that API. Backends suit services that many APIs share, or that grow over time:

- One backend per tenant, chosen from a header or from a claim in the caller's token.
- Regional deployments of the same service.
- A pool of model or inference backends that several APIs use.

This guide is for platform teams and API developers who run API Platform Gateway.

## How Backends work

- **Each Backend is its own upstream.** The gateway keeps a separate connection pool for each Backend. It spreads requests across the Backend's endpoints by weight, and applies the Backend's timeout and TLS settings.
- **APIs choose a Backend with the Dynamic Endpoint policy.** The `targetUpstream` parameter names a fixed target. The `backendExpression` parameter names the Backend for each request. A `backendSelector` limits, by label, the Backends that the expression can choose.
- **The API's own upstream definitions come first.** If an API has an upstream definition with the same name as a Backend, `targetUpstream` refers to the upstream definition. Creating a Backend never changes where that API sends its requests.
- **The Backend's base path replaces the API's.** The gateway removes the API context from the request path and puts the Backend's `basePath` in front of the rest. For example, with the context `/orders/v1.0` and the base path `/v1`, a request to `/orders/v1.0/items` reaches the Backend at `/v1/items`.
- **Requests fail closed.** The gateway never sends a request to a backend other than the one the policy chose. If the chosen Backend doesn't exist, the request fails with an error. It doesn't fall back to the API's own upstream.
- **Each gateway has its own Backends.** Create a Backend on every gateway whose APIs route to it. The gateway doesn't send Backends to the API Control Plane.

## Before you begin

- Start the gateway and export the admin credentials, as described in the [Quick Start Guide](../quick-start-guide.md). The examples in this guide use `$ADMIN_USERNAME` and `$ADMIN_PASSWORD`.
- To use the CLI, install `ap` and point it at the gateway with `ap gateway add` and `ap gateway use`. For more information, see the [CLI reference](../../../tools/cli/reference.md).
- Routing to Backends needs version 1.1 or later of the Dynamic Endpoint policy. APIs keep `version: v1` in their policy configuration.

## Step 1: Define a Backend

Create a file named `tenant-b.yaml` with the following content:

```yaml
apiVersion: gateway.choreolabs.com/v1
kind: Backend
metadata:
  name: tenant-b
  labels:
    team: orders
spec:
  displayName: Orders backend for tenant B
  basePath: /v1
  endpoints:
    - url: http://orders-tenant-b:9080
      weight: 70
    - url: http://orders-tenant-b-2:9080
      weight: 30
  timeout:
    connect: 2s
```

The endpoint URLs are placeholders. Replace them with the URLs of backend services that the gateway can reach.

!!! note
    A Backend uses `apiVersion: gateway.choreolabs.com/v1`. APIs and the other gateway resources use `apiVersion: gateway.api-platform.wso2.com/v1`. The gateway rejects a Backend with any other `apiVersion`.

A Backend supports the following fields:

| Field | Required | Description |
| :--- | :--- | :--- |
| `metadata.name` | Yes | The name that APIs use to refer to the Backend. Use 3 to 40 lowercase letters and digits, with single hyphens between them. You can't rename a Backend. |
| `metadata.labels` | No | Labels that a `backendSelector` matches, for example `team: orders`. |
| `spec.displayName` | No | A human-readable name of up to 253 characters. |
| `spec.description` | No | A description of up to 1023 characters. |
| `spec.basePath` | No | The path that the gateway puts in front of each request it routes to the Backend. It must start with `/` and can't end with `/`. Omit it to forward the path below the API context unchanged. |
| `spec.endpoints` | Yes | One or more endpoints. Each `url` has a scheme, a host, and an optional port, with no path, query string, or fragment. Put a path prefix in `basePath`. All endpoints of a Backend must use the same scheme, either `http` or `https`. |
| `spec.endpoints[].weight` | No | A relative weight from 0 to 100 for spreading requests across the endpoints. An endpoint without a weight, or with a weight of `0`, counts as `1`. |
| `spec.timeout.connect` | No | The connection timeout, for example `2s` or `500ms`. |
| `spec.tls` | No | Mutual TLS settings for the connection to the Backend. For more information, see [Secure the connection with TLS](#secure-the-connection-with-tls). |

## Step 2: Create the Backend

=== "CLI"

    ```bash
    ap gateway apply -f tenant-b.yaml
    ```

    `ap gateway apply` creates the Backend, or updates it if a Backend with the same `metadata.name` exists.

=== "Management API"

    ```bash
    curl -X POST http://localhost:9090/api/management/v1/backends \
      -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" \
      -H 'Content-Type: application/yaml' \
      --data-binary @tenant-b.yaml
    ```

    A successful request returns `201 Created` with the Backend.

=== "Kubernetes"

    With the [Gateway Operator](../deployment/deployment-modes/kubernetes/gateway-operator.md), apply the same file as a custom resource:

    ```bash
    kubectl apply -f tenant-b.yaml
    ```

    The operator selects the gateway for a Backend in the same way as for a `RestApi`, through the `apiSelector` of the `APIGateway`. The Backend's labels also serve as the labels a `backendSelector` matches. A label change that makes a different gateway select the Backend doesn't move it, and the previous gateway keeps its copy. To move a Backend to another gateway, delete it, and then create it with the labels that the other gateway selects.

If the definition is invalid, the gateway returns `400 Bad Request` with an `errors` array. Each error names the field at fault, for example `spec.endpoints[0].url` or `spec.basePath`. If a Backend with the same `metadata.name` exists, the gateway returns `409 Conflict`.

If the gateway restricts the destinations that artifacts can reach, it checks each endpoint URL in the same way as an API's upstream URLs. An endpoint that the gateway doesn't permit gets `400 Bad Request` naming the field, and the gateway doesn't serve a stored Backend that it doesn't permit.

Users with the `admin` role can create, update, and delete Backends. Users with the `developer` role can read them.

## Step 3: Route an API to Backends

Attach the [Dynamic Endpoint](https://wso2.com/api-platform/policy-hub/policies/dynamic-endpoint) policy to the API, or to individual operations. Then choose how the policy picks the Backend.

### Route each request by the request context

`backendExpression` is a Common Expression Language ([CEL](https://cel.dev)) expression. The gateway evaluates it for each request, and the string that it returns names the Backend. The expression can read the following values:

- The request headers, path, query string, and method.
- Metadata that earlier policies set.
- The API and the route.
- The authenticated subject and its claims.

The following API routes each request to the Backend that its `x-tenant` header names. The API routes only to Backends with the label `team: orders`. A request without an `x-tenant` header goes to the `tenant-default` Backend, which you create in the same way as `tenant-b`. The `remove-headers` policy keeps the `x-tenant` header from reaching the backend.

```yaml
apiVersion: gateway.api-platform.wso2.com/v1
kind: RestApi
metadata:
  name: orders-api-v1.0
spec:
  displayName: Orders API
  version: v1.0
  context: /orders/$version
  upstream:
    main:
      url: http://orders-default:9080
  policies:
    - name: dynamic-endpoint
      version: v1
      params:
        backendExpression: request.Headers["x-tenant"][0]
        backendSelector:
          matchLabels:
            team: orders
        targetUpstream: tenant-default
    - name: remove-headers
      version: v1
      params:
        request:
          headers:
            - name: x-tenant
  operations:
    - method: GET
      path: /items
```

Deploy the API with `ap gateway apply -f` or `POST /rest-apis`, and then send a request:

```bash
curl http://localhost:8080/orders/v1.0/items -H "x-tenant: tenant-b"
```

The gateway sends the request to an endpoint of `tenant-b`, at `/v1/items`.

!!! warning
    The caller sets the `x-tenant` header, so any caller can reach any Backend labelled `team: orders` through this API. The `backendSelector` limits the Backends that the API can route to. It doesn't decide which caller can reach which of those Backends. When each tenant must reach only its own Backend, read the tenant from a value that the gateway has authenticated, such as a claim in the caller's token. For example, put the `jwt-auth` policy before `dynamic-endpoint` and use `backendExpression: auth.Properties["tenant_id"]`. Set `onMissingValue: reject` as well, so that a token without the claim gets `400 Bad Request` instead of the `targetUpstream` Backend. The token issuer must set the claim to the tenant that the caller is allowed to reach.

The gateway answers `400 Bad Request` in the following cases:

- The expression returns a value that isn't a valid Backend name.
- The expression returns a name that matches no Backend.
- The expression returns the name of a Backend that the `backendSelector` doesn't match.
- The expression fails on a value that the request carries, for example when it converts a header that isn't a number.

Each of these requests gets the same message, `The requested backend is not available for this API.`, so callers can't find out which Backends exist.

The expression has no value when the request lacks what it reads, for example the `x-tenant` header. In that case, the `onMissingValue` parameter decides what happens:

- `fallback`, the default, routes the request to `targetUpstream` if it's set, or to the API's own upstream otherwise.
- `reject` answers `400 Bad Request`.

For the full list of parameters and expression variables, see the [Dynamic Endpoint](https://wso2.com/api-platform/policy-hub/policies/dynamic-endpoint) policy. The policy reference also has more examples, such as routing by a JWT claim or by a query parameter.

### Route to a fixed Backend

To send every request of an API or an operation to one Backend, name the Backend in `targetUpstream`:

```yaml
policies:
  - name: dynamic-endpoint
    version: v1
    params:
      targetUpstream: tenant-b
```

If the API has an upstream definition named `tenant-b`, the request goes to that upstream definition instead. Otherwise, the request goes to the Backend. Until you create the Backend, the gateway answers `503 Service Unavailable`, so you can deploy the API first.

### Add a Backend without changing the API

To onboard another tenant, create its Backend with the same label:

```bash
ap gateway apply -f tenant-c.yaml
```

Within a few seconds, requests with `x-tenant: tenant-c` reach `tenant-c`. You don't edit or redeploy the API.

## Secure the connection with TLS

To connect to a Backend over mutual TLS, add a `tls` block to its `spec`. Every endpoint of the Backend must then use `https`.

```yaml
spec:
  basePath: /v2
  endpoints:
    - url: https://billing-eu-1.internal.example.com:8443
    - url: https://billing-eu-2.internal.example.com:8443
  tls:
    identity: gateway-billing
    trustedCAs: [billing-ca]
    verifyHostName: true
```

The `tls` block supports the following fields:

| Field | Description |
| :--- | :--- |
| `identity` | The name of a certificate that the gateway presents to the Backend. Upload it with `POST /certificates` and `usage: identity`. |
| `trustedCAs` | The names of the certificates that the gateway trusts for this Backend, instead of the gateway-wide trust bundle. Upload them with `POST /certificates` and `usage: upstream`. Omit the field to use the gateway-wide trust bundle. |
| `verifyHostName` | Whether the gateway checks the hostname of each endpoint against its certificate. The default is `true`. |

For more information about certificates, see [Certificate Management](../gateway-controller-management-api/certificate-management.md).

The gateway always uses the Backend's own `tls` settings. The upstream definitions of the API that routed the request don't apply. The gateway sends each endpoint's own hostname as the server name, except for an endpoint addressed by IP. While `verifyHostName` is `true`, the gateway also checks each endpoint's certificate against that endpoint's own hostname or IP address.

The create and update responses list non-fatal findings in `status.warnings`:

- `TLS_VERIFY_HOSTNAME_DISABLED`: `verifyHostName` is `false`.
- `TLS_IDENTITY_EXPIRED`: the certificate of `identity` has expired.
- `TLS_NO_TRUST_SOURCE`: the endpoints use `https`, the Backend has no `trustedCAs`, and the gateway-wide trust bundle is empty. Requests to the Backend fail with `503` until you set `trustedCAs` or add a trusted certificate to the gateway.

You can't delete a certificate while a Backend's `tls` block names it.

## Update or delete a Backend

### Update a Backend

Edit the definition file and apply it again with `ap gateway apply -f`, or send it with `PUT /backends/{id}`. The `metadata.name` in the file must match the Backend ID. The gateway applies the change within a few seconds. You don't redeploy the APIs that route to the Backend.

A request that the gateway has already sent to an endpoint isn't affected by an update. A request that the gateway is still matching or routing when the update takes effect can get `503 Service Unavailable`. For the causes, see [Errors](#errors). Until every API uses the updated base path, the gateway keeps the previous endpoints in service next to the updated ones. A request never combines one version's base path with another version's endpoints.

### Delete a Backend

Send a `DELETE` request with the Backend ID:

```bash
curl -X DELETE http://localhost:9090/api/management/v1/backends/tenant-b \
  -u "$ADMIN_USERNAME:$ADMIN_PASSWORD"
```

While a deployed API names the Backend in `targetUpstream`, the gateway refuses the delete with `409 Conflict`. The response lists each API and the parameter that names the Backend. Remove the reference or delete the API, and then delete the Backend. An API with its own upstream definition of the same name doesn't block the delete, because that API never uses the Backend. On Kubernetes, a deleted `Backend` resource stays in the `Terminating` state until no API names it, and then the operator removes it.

If APIs select the Backend through `backendExpression`, requests that name it get `400 Bad Request` after you delete it. The gateway never sends them to another backend.

### Find a Backend

Use the following management API operations to find Backends:

| Task | Management API |
| :--- | :--- |
| List the Backends | `GET /backends` |
| Get one Backend | `GET /backends/{id}` |

For the request and response formats, see [Backend Management](../gateway-controller-management-api/backend-management.md).

## Use Backends with an immutable gateway

An [immutable gateway](../deployment/deployment-modes/immutable-gateway.md) reads `kind: Backend` artifacts from its artifacts directory, along with its APIs. The gateway creates the Backends before the APIs, so an API that names a Backend serves requests from the start.

## Errors

The following responses come from routing to Backends or from managing them:

| Response | Cause |
| :--- | :--- |
| `400 Bad Request` with `The requested backend is not available for this API.` | The value that `backendExpression` returned can't be routed, the expression failed on a value that the request carries, or the expression had no value and `onMissingValue` is `reject`. |
| `503 Service Unavailable` with the error code `905008` | `targetUpstream` names neither an upstream definition of the API nor a Backend on the gateway, someone deleted the Backend during the request, or someone changed the Backend's endpoints, weights, base path, TLS settings or timeout between the policy matching it against `backendSelector` and the gateway routing the request. The response carries an `x-error-id` header, and the gateway logs the Backend name under that ID. |
| `503 Service Unavailable` without an error code | The gateway removed the endpoints of a Backend's previous version just as it forwarded a request that it had routed to them. This can happen only within milliseconds of a Backend update. Send the request again. |
| `500 Internal Server Error` with the error code `905005` | The `backendExpression` of the route doesn't compile. For more information, see [Limitations](#limitations). |
| `409 Conflict` on `DELETE /backends/{id}` | A deployed API names the Backend in `targetUpstream`. |

## Limitations

- When you deploy an API, the gateway checks `backendExpression` against the policy's parameter schema only. It compiles the expression when it loads the policy. An API with an expression that doesn't compile deploys successfully, and its routes answer `500` until you fix the expression. Test expressions on a non-production gateway first.
- The API Control Plane doesn't create, show, or deploy Backends.
- The `ap` CLI creates and updates Backends with `ap gateway apply`. To list, get, or delete Backends, use the management API.

## Related topics

- [Backend Management](../gateway-controller-management-api/backend-management.md): the management API reference for Backends.
- [Dynamic Endpoint](https://wso2.com/api-platform/policy-hub/policies/dynamic-endpoint): the policy that routes requests to Backends.
- [Remove Headers](https://wso2.com/api-platform/policy-hub/policies/remove-headers): the policy that keeps a routing header from reaching the backend.
- [Certificate Management](../gateway-controller-management-api/certificate-management.md): the management API reference for the certificates that a `tls` block names.
