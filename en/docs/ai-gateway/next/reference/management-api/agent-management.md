---
title: "Management API: Agent Management"
description: "REST API reference for creating, listing, updating, and deleting A2A agent configurations and their API keys in API Platform Gateway."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/next/reference/management-api/agent-management/
md_url: https://wso2.com/api-platform/docs/ai-gateway/next/reference/management-api/agent-management.md
tags:
  - ai-gateway
  - management-api
  - a2a
  - agents
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-22
content_type: "reference"
---

# Agent Management

CRUD operations and API key management for A2A Agents.

## Create a new Agent

<a id="opIdcreateAgent"></a>

`POST /agents`

> Code samples

```shell

curl -X POST http://localhost:9090/api/management/v1/agents \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d @payload.json

```

Add a new A2A Agent to the Gateway.

> Payload

```json
{
  "apiVersion": "gateway.api-platform.wso2.com/v1",
  "kind": "Agent",
  "metadata": {
    "name": "trip-planner-v1.0"
  },
  "spec": {
    "displayName": "Trip Planner",
    "version": "v1.0",
    "context": "/trip-planner",
    "upstream": {
      "url": "http://host.docker.internal:9099"
    },
    "a2a": {
      "protocolVersion": "1.0",
      "operationConfigs": {
        "transports": [
          { "protocolBinding": "JSONRPC", "pathPrefix": "/" },
          { "protocolBinding": "HTTP+JSON", "pathPrefix": "/v1" }
        ]
      }
    }
  }
}
```

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `developer`

</aside>

<h3 id="create-a-new-agent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|AgentConfigurationRequest|true|none|

<h3 id="create-a-new-agent-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|201|Created|Agent created successfully|
|400|Bad Request|Invalid configuration (validation failed)|
|409|Conflict|An Agent with the same name and version already exists|
|500|Internal Server Error|Internal server error|

The response body is the stored `AgentConfiguration`, which is the request plus a read-only `status` object.

## List all Agents

<a id="opIdlistAgents"></a>

`GET /agents`

> Code samples

```shell

curl -X GET http://localhost:9090/api/management/v1/agents \
  -u {username}:{password} \
  -H 'Accept: application/json'

```

List Agents registered in the Gateway, optionally filtered by name, version, context, or status.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `developer`

</aside>

<h3 id="list-all-agents-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|displayName|query|string|false|Filter by agent display name|
|version|query|string|false|Filter by agent version|
|context|query|string|false|Filter by agent context path|
|status|query|string|false|Filter by deployment status: `deployed` or `undeployed`|

> Example responses
>
> 200 Response

```json
{
  "status": "success",
  "count": 1,
  "agents": [
    {
      "apiVersion": "gateway.api-platform.wso2.com/v1",
      "kind": "Agent",
      "metadata": { "name": "trip-planner-v1.0" },
      "spec": { "displayName": "Trip Planner", "version": "v1.0" }
    }
  ]
}
```

<h3 id="list-all-agents-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|200|OK|List of Agents|
|500|Internal Server Error|Internal server error|

## Get Agent by id

<a id="opIdgetAgentById"></a>

`GET /agents/{id}`

> Code samples

```shell

curl -X GET http://localhost:9090/api/management/v1/agents/trip-planner-v1.0 \
  -u {username}:{password} \
  -H 'Accept: application/json'

```

Get an Agent by its ID.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `developer`

</aside>

<h3 id="get-agent-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Unique public identifier of the Agent|

<h3 id="get-agent-by-id-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|200|OK|Agent details|
|404|Not Found|Agent not found|
|500|Internal Server Error|Internal server error|

## Update an existing Agent

<a id="opIdupdateAgent"></a>

`PUT /agents/{id}`

> Code samples

```shell

curl -X PUT http://localhost:9090/api/management/v1/agents/trip-planner-v1.0 \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d @payload.json

```

Update an existing Agent in the Gateway. The request body carries the complete configuration, as the create operation does.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `developer`

</aside>

<h3 id="update-an-existing-agent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Unique public identifier of the Agent to update|
|body|body|AgentConfigurationRequest|true|none|

<h3 id="update-an-existing-agent-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|200|OK|Agent updated successfully|
|400|Bad Request|Invalid configuration (validation failed)|
|404|Not Found|Agent not found|
|500|Internal Server Error|Internal server error|

## Delete an Agent

<a id="opIddeleteAgent"></a>

`DELETE /agents/{id}`

> Code samples

```shell

curl -X DELETE http://localhost:9090/api/management/v1/agents/trip-planner-v1.0 \
  -u {username}:{password} \
  -H 'Accept: application/json'

```

Delete an Agent from the Gateway.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `developer`

</aside>

<h3 id="delete-an-agent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Unique public identifier of the Agent to delete|

<h3 id="delete-an-agent-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|200|OK|Agent deleted successfully|
|404|Not Found|Agent not found|
|500|Internal Server Error|Internal server error|

To take an Agent out of router traffic while keeping its configuration, policies, and API keys, set `spec.deploymentState` to `undeployed` instead of deleting it.

## Create a new API key for an Agent

<a id="opIdcreateAgentAPIKey"></a>

`POST /agents/{id}/api-keys`

> Code samples

```shell

curl -X POST http://localhost:9090/api/management/v1/agents/trip-planner-v1.0/api-keys \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"name":"trip-planner-client"}'

```

Generate a new API key for an Agent in the Gateway. The key is a 32-byte random value encoded in hexadecimal, prefixed with `apip_`. Use the API Key Auth policy on the Agent to validate incoming requests with this key.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `consumer`

</aside>

<h3 id="create-a-new-api-key-for-an-agent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Unique public identifier of the Agent to generate the key for|
|body|body|APIKeyCreationRequest|true|none|

<h3 id="create-a-new-api-key-for-an-agent-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|201|Created|API key created successfully|
|400|Bad Request|Invalid configuration (validation failed)|
|404|Not Found|Agent not found|
|409|Conflict|Duplicate key or conflicting update|
|500|Internal Server Error|Internal server error|

The key value appears in the response only on creation and regeneration. Store it securely; a lost key is regenerated rather than recovered.

## Get the list of API keys for an Agent

<a id="opIdlistAgentAPIKeys"></a>

`GET /agents/{id}/api-keys`

List all API keys for an Agent in the Gateway. Key values aren't included.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `consumer`

</aside>

<h3 id="get-the-list-of-api-keys-for-an-agent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Unique public identifier of the Agent to retrieve the keys for|

<h3 id="get-the-list-of-api-keys-for-an-agent-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|200|OK|List of API keys|
|404|Not Found|Agent not found|
|500|Internal Server Error|Internal server error|

## Regenerate API key for an Agent

<a id="opIdregenerateAgentAPIKey"></a>

`POST /agents/{id}/api-keys/{apiKeyName}/regenerate`

Regenerate an existing API key for an Agent in the Gateway. The previous key is revoked and replaced with a new 32-byte random value encoded in hexadecimal, prefixed with `apip_`.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `consumer`

</aside>

<h3 id="regenerate-api-key-for-an-agent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Unique public identifier of the Agent|
|apiKeyName|path|string|true|Name of the API key to regenerate|

<h3 id="regenerate-api-key-for-an-agent-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|200|OK|API key regenerated successfully|
|404|Not Found|Agent or API key not found|
|500|Internal Server Error|Internal server error|

## Update an API key for an Agent

<a id="opIdupdateAgentAPIKey"></a>

`PUT /agents/{id}/api-keys/{apiKeyName}`

Set a custom value on an existing API key instead of generating one, for injecting an externally issued key.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `consumer`

</aside>

<h3 id="update-an-api-key-for-an-agent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Unique public identifier of the Agent|
|apiKeyName|path|string|true|Name of the API key to update|

<h3 id="update-an-api-key-for-an-agent-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|200|OK|API key updated successfully|
|404|Not Found|Agent or API key not found|
|500|Internal Server Error|Internal server error|

## Revoke an API key for an Agent

<a id="opIdrevokeAgentAPIKey"></a>

`DELETE /agents/{id}/api-keys/{apiKeyName}`

Revoke an API key. Once revoked, it can no longer authenticate requests.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `consumer`

</aside>

<h3 id="revoke-an-api-key-for-an-agent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Unique public identifier of the Agent|
|apiKeyName|path|string|true|Name of the API key to revoke|

<h3 id="revoke-an-api-key-for-an-agent-responses">Responses</h3>

|Status|Meaning|Description|
|---|---|---|
|200|OK|API key revoked successfully|
|404|Not Found|Agent or API key not found|
|500|Internal Server Error|Internal server error|

## Related topics

- [Agent configuration reference](../agent-configuration.md) — every field in the `spec` these operations accept.
- [Expose an agent](../../agent-governance/expose-an-agent.md) — the configuration these operations deploy.
- [Authenticate agent clients](../../agent-governance/authenticate-clients.md) — the policy that validates the keys created here.
