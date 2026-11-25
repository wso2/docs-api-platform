---
title: "API Proxy Mediation Policies"
description: "Reference for WSO2 API Platform inbuilt API- and resource-level mediation policies: OAuth2, rate limiting, CORS, and payload transforms."
canonical_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/policy/policies/
md_url: https://wso2.com/api-platform/docs/cloud/develop-api-proxy/policy/policies.md
tags:
  - cloud
  - api-proxy
  - policy
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "reference"
---

# Policies

Policies are units of business logic that you can apply to modify the flow of API invocations.

You can apply a policy in API or resource level to alter the  `Request`, `Response`, or `Error` flow of an API invocation before it reaches the backend or the client. For example, you can add a policy to the response flow to transform the payload from JSON to XML and add a header to the response.

## Inbuilt Mediation Policies

API Platform supports a set of inbuilt mediation policies that can handle common API transformation and mediation tasks. These policies run within a single mediation service, making it straightforward to implement and manage complex mediation logic. The following inbuilt policies are available in API Platform at API level and resource level:

### API-level Policies

- **OAuth2**: Secures an API by enforcing OAuth 2.0 authentication. This policy ensures that only authenticated clients with valid access tokens can access the API. The security header is configurable at the API level. This policy is enabled by default for every API resource, and can be disabled for individual resources by removing from the flow as necessary.
- **Pass User Context to Backend**: Forwards user-related information to the backend service under the header `x-jwt-assertion`. This policy ensures that user identity details are included in the request sent to the backend. In addition users can set end user token audiences. It is useful for enforcing authorization, logging, or customizing responses based on the authenticated user. This policy is only applicable at the API level.
- **Rate Limiting**: Restricts the number of API requests a client can make within a defined time window. Users can configure limits based on request count and time unit (e.g. 100 requests per minute). When the limit is exceeded, further requests are rejected with a `429 Too Many Requests` response. Users are able to set rate limiting thresholds at both API level and resource level.
- **CORS (Cross-Origin Resource Sharing)**: Controls how resources on an API can be accessed from different origins. This policy allows users to configure `Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Credentials`. It ensures secure and flexible cross-origin requests, enabling APIs to be accessed from web applications running on different domains. This policy is only applicable at the API level.

### Resource-level Policies

- **JSON to XML**: Transforms a request/response with a JSON payload to a request/response with an XML payload. This is only applicable to the request flow and response flow mediation sequences. This policy assumes that the request/response payload is JSON. Attempting to use it on a request/response with a non-JSON payload will result in premature termination of the mediation flow. For the same reason, this policy cannot be attached multiple times to a resource since once it is used, the payload will be an XML value.
- **XML to JSON**: Transforms a request/response with an XML payload to a request/response with a JSON payload. This policy assumes that the request/response payload is XML. Attempting to use it on a request/response with a non-XML payload will result in premature termination of the mediation flow. For the same reason, this policy cannot be attached multiple times to a resource since once it is used, the payload will be a JSON value.
- **Remove Query Parameter**: Removes specified query parameters from a request. You can use this policy multiple times to remove different parameters. Attempting to remove a non-existent parameter has no effect. If the parameter exists, it will be removed; otherwise, the request proceeds as usual.
- **Remove Header**: Removes specified headers from a request or response. You can attach this policy multiple times to remove multiple headers. The header name must be static, but you can use placeholders to configure different values for different environments. For example, `${headerName}`.
- **Add Query Parameter**: Adds query parameters to a request. You can attach this policy multiple times to add various parameters. Adding the same parameter multiple times creates an array of values. The parameter name and value must be static, but you can use placeholders to configure different values for different environments. For example, `${fooValue}`.
- **Add Header**: Adds headers to a request or response. If the same header is added multiple times, values are appended rather than overwritten. The header name and value must be static, but you can use placeholders to configure different values for different environments. For example, `${authzHeaderValue}`.
- **Set Header**: Sets headers in a request or response, overwriting any existing values. You can attach this policy multiple times to set multiple headers. Each time the same header is set, it replaces the previous value. The header name and value must be static, but you can use placeholders to configure different values for different environments. For example, `${authzHeaderValue}`.
- **Rewrite Resource Path**: Modifies the resource path of an HTTP request by replacing the original path with a new relative path. You can apply this policy multiple times, but only the last instance will take effect. The new path must be static, but you can use placeholders to configure different values for different environments. For example, `${myResourcePath}`.
- **Log Message**: Logs the payload and headers of a request or response. Attaching this policy multiple times results in duplicate log entries. By default, headers and payloads are not logged. To log them, you can enable `Log Headers` and `Log Payload` parameters. To exclude specific headers when logging, you can use the `Excluded Headers` parameter, which takes a comma-separated list of header names. An error will occur if payload logging is enabled but the payload cannot be read.
- **Permissions (Scopes)**: Defines fine-grained access control by assigning permissions (scopes) to API resources. Each resource can have one or more scopes, and only users or applications with the required scope in their access token can invoke the resource.

These inbuilt mediation policies provide flexibility to manage API requests and responses, allowing for custom transformations and logic without requiring custom code.

For details on attaching and managing one or more policies to an API proxy component implementation via the API Platform Console, see [Attach and Manage Policies](../policy/attach-and-manage-policies.md).

<!-- TODO: Check whether we need advanced settings on mediation policies -->
<!-- For details on applying advanced settings on mediation policies, see [Apply Advanced Settings on Mediation Policies](../policy/apply-advanced-settings-on-mediation-policies.md). -->