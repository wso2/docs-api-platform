---
title: "Platform API: Schemas"
description: "JSON schema definitions for Platform API request and response objects."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/platform-api/schemas/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/platform-api/schemas.md
tags:
  - ai-workspace
  - platform-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-09-30
content_type: "reference"
---

# Schemas

## APIKeyItem

<a id="schemaapikeyitem"></a>
<a id="schema_APIKeyItem"></a>
<a id="tocSapikeyitem"></a>
<a id="tocsapikeyitem"></a>

```json
{
  "id": "string",
  "displayName": "string",
  "maskedApiKey": "string",
  "status": "active",
  "createdAt": "2019-08-24T14:15:22Z",
  "createdBy": "john.doe",
  "updatedAt": "2019-08-24T14:15:22Z",
  "expiresAt": "2019-08-24T14:15:22Z",
  "issuer": "api-platform-devportal",
  "allowedTargets": "string"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|URL-safe handle (identifier) of the API key (generated from displayName when not supplied)|
|displayName|string|true|none|Human-readable display name of the API key|
|maskedApiKey|string|true|none|Masked representation of the API key for display purposes|
|status|string|true|none|Current status of the key|
|createdAt|string(date-time)|true|none|Timestamp when the key was created|
|createdBy|string|true|read-only|User identifier of the user who created this resource|
|updatedAt|string(date-time)|true|none|Timestamp when the key was last updated|
|expiresAt|string(date-time)|false|none|Optional expiration timestamp|
|issuer|string|false|none|Optional identifier of the API Portal that provisioned this key|
|allowedTargets|string|true|none|Comma-separated list of allowed gateways; 'ALL' means unrestricted|

##### Enumerated Values

|Property|Value|
|---|---|
|status|active|
|status|revoked|
|status|expired|

## UserAPIKeyItem

<a id="schemauserapikeyitem"></a>
<a id="schema_UserAPIKeyItem"></a>
<a id="tocSuserapikeyitem"></a>
<a id="tocsuserapikeyitem"></a>

```json
{
  "id": "string",
  "displayName": "string",
  "maskedApiKey": "string",
  "status": "active",
  "createdAt": "2019-08-24T14:15:22Z",
  "createdBy": "john.doe",
  "updatedAt": "2019-08-24T14:15:22Z",
  "expiresAt": "2019-08-24T14:15:22Z",
  "issuer": "api-platform-devportal",
  "allowedTargets": "string",
  "artifactId": "wso2-openai-provider",
  "artifactType": "RestApi"
}

```

#### Properties

allOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[APIKeyItem](#schemaapikeyitem)|false|none|none|

and

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|
|artifactId|string|true|none|Handle (ID) of the artifact this key belongs to|
|artifactType|string|true|none|Type of the artifact this key belongs to|

##### Enumerated Values

|Property|Value|
|---|---|
|artifactType|RestApi|
|artifactType|LlmProvider|
|artifactType|LlmProxy|
|artifactType|AgentProxy|

## UserAPIKeyListResponse

<a id="schemauserapikeylistresponse"></a>
<a id="schema_UserAPIKeyListResponse"></a>
<a id="tocSuserapikeylistresponse"></a>
<a id="tocsuserapikeylistresponse"></a>

```json
{
  "list": [
    {
      "id": "string",
      "displayName": "string",
      "maskedApiKey": "string",
      "status": "active",
      "createdAt": "2019-08-24T14:15:22Z",
      "createdBy": "john.doe",
      "updatedAt": "2019-08-24T14:15:22Z",
      "expiresAt": "2019-08-24T14:15:22Z",
      "issuer": "api-platform-devportal",
      "allowedTargets": "string",
      "artifactId": "wso2-openai-provider",
      "artifactType": "RestApi"
    }
  ],
  "count": 0,
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|list|[[UserAPIKeyItem](#schemauserapikeyitem)]|true|none|List of API keys|
|count|integer|true|none|Number of API keys in current response|
|pagination|[Pagination](#schemapagination)|true|none|none|

## LLMProviderAPIKeyListResponse

<a id="schemallmproviderapikeylistresponse"></a>
<a id="schema_LLMProviderAPIKeyListResponse"></a>
<a id="tocSllmproviderapikeylistresponse"></a>
<a id="tocsllmproviderapikeylistresponse"></a>

```json
{
  "list": [
    {
      "id": "string",
      "displayName": "string",
      "maskedApiKey": "string",
      "status": "active",
      "createdAt": "2019-08-24T14:15:22Z",
      "createdBy": "john.doe",
      "updatedAt": "2019-08-24T14:15:22Z",
      "expiresAt": "2019-08-24T14:15:22Z",
      "issuer": "api-platform-devportal",
      "allowedTargets": "string"
    }
  ],
  "count": 0,
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|list|[[APIKeyItem](#schemaapikeyitem)]|true|none|List of API keys|
|count|integer|true|none|Number of API keys in current response|
|pagination|[Pagination](#schemapagination)|true|none|none|

## LLMProxyAPIKeyListResponse

<a id="schemallmproxyapikeylistresponse"></a>
<a id="schema_LLMProxyAPIKeyListResponse"></a>
<a id="tocSllmproxyapikeylistresponse"></a>
<a id="tocsllmproxyapikeylistresponse"></a>

```json
{
  "list": [
    {
      "id": "string",
      "displayName": "string",
      "maskedApiKey": "string",
      "status": "active",
      "createdAt": "2019-08-24T14:15:22Z",
      "createdBy": "john.doe",
      "updatedAt": "2019-08-24T14:15:22Z",
      "expiresAt": "2019-08-24T14:15:22Z",
      "issuer": "api-platform-devportal",
      "allowedTargets": "string"
    }
  ],
  "count": 0,
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|list|[[APIKeyItem](#schemaapikeyitem)]|true|none|List of API keys|
|count|integer|true|none|Number of API keys in current response|
|pagination|[Pagination](#schemapagination)|true|none|none|

## Organization

<a id="schemaorganization"></a>
<a id="schema_Organization"></a>
<a id="tocSorganization"></a>
<a id="tocsorganization"></a>

```json
{
  "id": "acme",
  "displayName": "Acme Corporation",
  "region": "us",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2023-10-12T10:30:00Z",
  "updatedAt": "2023-10-12T10:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|read-only|Handle (URL-friendly slug) for the organization|
|displayName|string|true|none|Human-readable name for the organization|
|region|string|true|none|Geographic region where the organization operates|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource|
|createdAt|string(date-time)|false|read-only|Timestamp when the organization was created|
|updatedAt|string(date-time)|false|read-only|Timestamp when the organization was last updated|

## CreateProjectRequest

<a id="schemacreateprojectrequest"></a>
<a id="schema_CreateProjectRequest"></a>
<a id="tocScreateprojectrequest"></a>
<a id="tocscreateprojectrequest"></a>

```json
{
  "id": "default-project",
  "displayName": "Default Project",
  "description": "This is the default project for development"
}

```

Request body for creating a project. Organization ID is automatically extracted
from the JWT token and does not need to be provided.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Handle (URL-friendly slug) for the project. Auto-generated from displayName if not provided.|
|displayName|string|true|none|Human-readable name for the project|
|description|string|false|none|Description of the project|

## Project

<a id="schemaproject"></a>
<a id="schema_Project"></a>
<a id="tocSproject"></a>
<a id="tocsproject"></a>

```json
{
  "id": "default-project",
  "displayName": "Default Project",
  "description": "This is the default project for development",
  "organizationId": "acme",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2023-10-12T10:30:00Z",
  "updatedAt": "2023-10-12T10:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|read-only|Handle (URL-friendly slug) for the project|
|displayName|string|true|none|Human-readable name for the project|
|description|string|false|none|Description of the project|
|organizationId|string|true|read-only|Handle (URL-friendly slug) of the organization this project belongs to|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /projects/{projectId}), omitted from list responses.|
|createdAt|string(date-time)|false|read-only|Timestamp when the project was created|
|updatedAt|string(date-time)|false|read-only|Timestamp when the project was last updated|

## ApplicationType

<a id="schemaapplicationtype"></a>
<a id="schema_ApplicationType"></a>
<a id="tocSapplicationtype"></a>
<a id="tocsapplicationtype"></a>

```json
"genai"

```

Type of the application

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|Type of the application|

##### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|genai|

## CreateApplicationRequest

<a id="schemacreateapplicationrequest"></a>
<a id="schema_CreateApplicationRequest"></a>
<a id="tocScreateapplicationrequest"></a>
<a id="tocscreateapplicationrequest"></a>

```json
{
  "id": "my-app-handle",
  "displayName": "GenAI Demo App",
  "projectId": "default-project",
  "type": "genai",
  "description": "Sample GenAI application"
}

```

Request body for creating an application.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique handle/identifier for the application. Can be provided during creation or auto-generated.|
|displayName|string|true|none|Human-readable name for the application|
|projectId|string|true|none|Handle (URL-friendly slug) of the project this application belongs to.|
|type|[ApplicationType](#schemaapplicationtype)|true|none|Type of the application|
|description|string|false|none|Description of the application|

## Application

<a id="schemaapplication"></a>
<a id="schema_Application"></a>
<a id="tocSapplication"></a>
<a id="tocsapplication"></a>

```json
{
  "id": "my-app-handle",
  "displayName": "GenAI Demo App",
  "projectId": "default-project",
  "type": "genai",
  "description": "Sample GenAI application",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2025-11-15T10:30:00Z",
  "updatedAt": "2025-11-15T11:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Application handle/identifier|
|displayName|string|true|none|Human-readable name for the application|
|projectId|string|true|none|Handle (URL-friendly slug) of the project this application belongs to|
|type|[ApplicationType](#schemaapplicationtype)|true|none|Type of the application|
|description|string|false|none|Description of the application|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /applications/{appId}), omitted from list responses.|
|createdAt|string(date-time)|false|read-only|none|
|updatedAt|string(date-time)|false|read-only|none|

## ApplicationListResponse

<a id="schemaapplicationlistresponse"></a>
<a id="schema_ApplicationListResponse"></a>
<a id="tocSapplicationlistresponse"></a>
<a id="tocsapplicationlistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "my-app-handle",
      "displayName": "GenAI Demo App",
      "projectId": "default-project",
      "type": "genai",
      "description": "Sample GenAI application",
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "createdAt": "2025-11-15T10:30:00Z",
      "updatedAt": "2025-11-15T11:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of items in current response|
|list|[[Application](#schemaapplication)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## AddApplicationAPIKeysRequest

<a id="schemaaddapplicationapikeysrequest"></a>
<a id="schema_AddApplicationAPIKeysRequest"></a>
<a id="tocSaddapplicationapikeysrequest"></a>
<a id="tocsaddapplicationapikeysrequest"></a>

```json
{
  "apiKeys": [
    {
      "keyId": "client-key-1",
      "associatedEntity": {
        "id": "pizza-api"
      }
    }
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|apiKeys|[[APIKeyMappingSelector](#schemaapikeymappingselector)]|true|none|List of API key selectors to add to the application mappings|

## AddApplicationAssociationsRequest

<a id="schemaaddapplicationassociationsrequest"></a>
<a id="schema_AddApplicationAssociationsRequest"></a>
<a id="tocSaddapplicationassociationsrequest"></a>
<a id="tocsaddapplicationassociationsrequest"></a>

```json
{
  "associations": [
    {
      "id": "provider-handle",
      "kind": "LlmProvider"
    }
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|associations|[[ApplicationAssociationSelector](#schemaapplicationassociationselector)]|true|none|List of association selectors to add to the application|

## ApplicationAssociationSelector

<a id="schemaapplicationassociationselector"></a>
<a id="schema_ApplicationAssociationSelector"></a>
<a id="tocSapplicationassociationselector"></a>
<a id="tocsapplicationassociationselector"></a>

```json
{
  "id": "provider-handle",
  "kind": "LlmProvider"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|ID or handle of the association target|
|kind|string|true|none|Type of the association target|

##### Enumerated Values

|Property|Value|
|---|---|
|kind|LlmProvider|
|kind|LlmProxy|

## ApplicationAssociation

<a id="schemaapplicationassociation"></a>
<a id="schema_ApplicationAssociation"></a>
<a id="tocSapplicationassociation"></a>
<a id="tocsapplicationassociation"></a>

```json
{
  "id": "provider-handle",
  "displayName": "OpenAI Provider",
  "version": "v1.0",
  "kind": "LlmProvider",
  "createdAt": "2025-11-15T10:30:00Z",
  "updatedAt": "2025-11-15T11:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Handle/ID of the associated target|
|displayName|string|true|none|Human-readable name for the associated target|
|version|string|true|none|Version of the associated target|
|kind|string|true|none|Type of associated target|
|createdAt|string(date-time)|false|none|Timestamp when the association was created|
|updatedAt|string(date-time)|false|none|Timestamp when the association was updated|

## ApplicationAssociationListResponse

<a id="schemaapplicationassociationlistresponse"></a>
<a id="schema_ApplicationAssociationListResponse"></a>
<a id="tocSapplicationassociationlistresponse"></a>
<a id="tocsapplicationassociationlistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "provider-handle",
      "displayName": "OpenAI Provider",
      "version": "v1.0",
      "kind": "LlmProvider",
      "createdAt": "2025-11-15T10:30:00Z",
      "updatedAt": "2025-11-15T11:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of items in current response|
|list|[[ApplicationAssociation](#schemaapplicationassociation)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## APIKeyMappingSelector

<a id="schemaapikeymappingselector"></a>
<a id="schema_APIKeyMappingSelector"></a>
<a id="tocSapikeymappingselector"></a>
<a id="tocsapikeymappingselector"></a>

```json
{
  "keyId": "client-key-1",
  "associatedEntity": {
    "id": "pizza-api"
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|keyId|string|true|none|API key name|
|associatedEntity|[APIKeyMappingAssociatedEntity](#schemaapikeymappingassociatedentity)|true|none|none|

## APIKeyMappingAssociatedEntity

<a id="schemaapikeymappingassociatedentity"></a>
<a id="schema_APIKeyMappingAssociatedEntity"></a>
<a id="tocSapikeymappingassociatedentity"></a>
<a id="tocsapikeymappingassociatedentity"></a>

```json
{
  "id": "pizza-api"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|ID of the entity that owns the API key|

## AssociatedEntity

<a id="schemaassociatedentity"></a>
<a id="schema_AssociatedEntity"></a>
<a id="tocSassociatedentity"></a>
<a id="tocsassociatedentity"></a>

```json
{
  "id": "pizza-api",
  "kind": "RestApi"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|ID of the associated entity|
|kind|string|true|none|Type of the associated entity|

## MappedAPIKey

<a id="schemamappedapikey"></a>
<a id="schema_MappedAPIKey"></a>
<a id="tocSmappedapikey"></a>
<a id="tocsmappedapikey"></a>

```json
{
  "keyId": "client-key-1",
  "associatedEntity": {
    "id": "pizza-api",
    "kind": "RestApi"
  },
  "status": "ACTIVE",
  "userId": "john.doe",
  "createdAt": "2025-11-15T10:30:00Z",
  "updatedAt": "2025-11-15T11:30:00Z",
  "expiresAt": "2026-11-15T10:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|keyId|string|true|none|Name of the API key|
|associatedEntity|[AssociatedEntity](#schemaassociatedentity)|true|none|none|
|status|string|false|none|Status of the API key|
|userId|string|false|read-only|User identifier of the user who created this resource|
|createdAt|string(date-time)|false|none|Timestamp when the API key was created|
|updatedAt|string(date-time)|false|none|Timestamp when the API key was updated|
|expiresAt|string(date-time)|false|none|Expiration timestamp of the API key|

## MappedAPIKeyListResponse

<a id="schemamappedapikeylistresponse"></a>
<a id="schema_MappedAPIKeyListResponse"></a>
<a id="tocSmappedapikeylistresponse"></a>
<a id="tocsmappedapikeylistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "keyId": "client-key-1",
      "associatedEntity": {
        "id": "pizza-api",
        "kind": "RestApi"
      },
      "status": "ACTIVE",
      "userId": "john.doe",
      "createdAt": "2025-11-15T10:30:00Z",
      "updatedAt": "2025-11-15T11:30:00Z",
      "expiresAt": "2026-11-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of items in current response|
|list|[[MappedAPIKey](#schemamappedapikey)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## RESTAPI

<a id="schemarestapi"></a>
<a id="schema_RESTAPI"></a>
<a id="tocSrestapi"></a>
<a id="tocsrestapi"></a>

```json
{
  "id": "my-rest-api-handle",
  "displayName": "PizzaShackAPI",
  "description": "This is a simple API for Pizza Shack online pizza delivery store",
  "context": "/pizza",
  "version": "1.0.0",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "projectId": "default-project",
  "createdAt": "2023-10-12T10:30:00Z",
  "updatedAt": "2023-10-12T10:30:00Z",
  "readOnly": false,
  "upstream": {
    "main": {
      "url": "http://prod-backend:5000/api/v2",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key",
        "value": "my-api-key-value"
      }
    },
    "sandbox": {
      "url": "http://prod-backend:5000/api/v2",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key",
        "value": "my-api-key-value"
      }
    }
  },
  "lifeCycleStatus": "CREATED",
  "kind": "RestApi",
  "transport": [
    "http",
    "https"
  ],
  "policies": [
    {
      "executionCondition": "request.header.x-custom == 'enabled'",
      "name": "SET_HEADER",
      "params": {
        "key": "MyHeader",
        "value": "MyValue"
      },
      "version": "v1"
    }
  ],
  "operations": [
    {
      "name": "getPetById",
      "description": "Find pet by ID",
      "request": {
        "method": "GET",
        "path": "/pet/{petId}",
        "policies": [
          {
            "executionCondition": "request.header.x-custom == 'enabled'",
            "name": "SET_HEADER",
            "params": {
              "key": "MyHeader",
              "value": "MyValue"
            },
            "version": "v1"
          }
        ]
      }
    }
  ],
  "channels": [
    {
      "name": "issues",
      "description": "Channel for order events",
      "request": {
        "method": "SUB",
        "name": "issues",
        "policies": [
          {
            "executionCondition": "request.header.x-custom == 'enabled'",
            "name": "SET_HEADER",
            "params": {
              "key": "MyHeader",
              "value": "MyValue"
            },
            "version": "v1"
          }
        ]
      }
    }
  ],
  "subscriptionPlans": [
    "Gold",
    "Silver"
  ]
}

```

API object

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique handle/identifier for the API. Can be provided during creation or auto-generated. On update (PUT), if provided must match the path parameter — returns 400 if they differ.|
|displayName|string|true|none|Human-readable name for the API|
|description|string|false|none|none|
|context|string|true|none|none|
|version|string|true|none|none|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /rest-apis/{apiId}), omitted from list responses.|
|projectId|string|true|none|Handle (URL-friendly slug) of the project this API belongs to|
|createdAt|string(date-time)|false|read-only|Timestamp when the api was created|
|updatedAt|string(date-time)|false|read-only|Timestamp when the api was last updated|
|readOnly|boolean|false|read-only|True if the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane; false for control-plane created artifacts.|
|upstream|[Upstream](#schemaupstream)|true|none|Upstream backend configuration with main and sandbox endpoints|
|lifeCycleStatus|string|false|none|Current lifecycle status of the API|
|kind|string|false|none|Kind of the API based on its communication protocol or architectural style|
|transport|[string]|false|none|Supported transports for the API (http and/or https)|
|policies|[[Policy](#schemapolicy)]|false|none|List of policies to be applied on the API|
|operations|[[Operation](#schemaoperation)]|false|none|List of operations exposed by this API|
|channels|[[Channel](#schemachannel)]|false|none|List of channels exposed by this API|
|subscriptionPlans|[string]|false|none|List of subscription plan names enabled for this API (e.g. Gold, Silver).<br>When set, only these plans can be used when subscribing to the API.|

##### Enumerated Values

|Property|Value|
|---|---|
|lifeCycleStatus|STAGED|
|lifeCycleStatus|CREATED|
|lifeCycleStatus|PUBLISHED|
|lifeCycleStatus|DEPRECATED|
|lifeCycleStatus|RETIRED|
|lifeCycleStatus|BLOCKED|

## SecurityConfig

<a id="schemasecurityconfig"></a>
<a id="schema_SecurityConfig"></a>
<a id="tocSsecurityconfig"></a>
<a id="tocssecurityconfig"></a>

```json
{
  "enabled": true,
  "apiKey": {
    "enabled": true,
    "key": "X-API-Key",
    "valuePrefix": "Bearer",
    "in": "header"
  }
}

```

Security Configuration

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|false|none|Whether security is enabled|
|apiKey|[APIKeySecurity](#schemaapikeysecurity)|false|none|Configuration for API key based authentication|

## APIKeySecurity

<a id="schemaapikeysecurity"></a>
<a id="schema_APIKeySecurity"></a>
<a id="tocSapikeysecurity"></a>
<a id="tocsapikeysecurity"></a>

```json
{
  "enabled": true,
  "key": "X-API-Key",
  "valuePrefix": "Bearer",
  "in": "header"
}

```

API Key Security

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|false|none|Whether API key authentication is enabled|
|key|string|false|none|Name of the header or query parameter to be used for the API key|
|valuePrefix|string|false|none|Optional prefix to strip from the inbound API key value before validation, for example "Bearer"|
|in|string|false|none|Location of the API key (header or query)|

##### Enumerated Values

|Property|Value|
|---|---|
|in|header|
|in|query|

## Operation

<a id="schemaoperation"></a>
<a id="schema_Operation"></a>
<a id="tocSoperation"></a>
<a id="tocsoperation"></a>

```json
{
  "name": "getPetById",
  "description": "Find pet by ID",
  "request": {
    "method": "GET",
    "path": "/pet/{petId}",
    "policies": [
      {
        "executionCondition": "request.header.x-custom == 'enabled'",
        "name": "SET_HEADER",
        "params": {
          "key": "MyHeader",
          "value": "MyValue"
        },
        "version": "v1"
      }
    ]
  }
}

```

API Operation

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|Name of the operation|
|description|string|false|none|Description of the operation|
|request|[OperationRequest](#schemaoperationrequest)|true|none|Request details for an API operation|

## Channel

<a id="schemachannel"></a>
<a id="schema_Channel"></a>
<a id="tocSchannel"></a>
<a id="tocschannel"></a>

```json
{
  "name": "issues",
  "description": "Channel for order events",
  "request": {
    "method": "SUB",
    "name": "issues",
    "policies": [
      {
        "executionCondition": "request.header.x-custom == 'enabled'",
        "name": "SET_HEADER",
        "params": {
          "key": "MyHeader",
          "value": "MyValue"
        },
        "version": "v1"
      }
    ]
  }
}

```

Async API Channel

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|Name of the channel|
|description|string|false|none|Description of the channel|
|request|[ChannelRequest](#schemachannelrequest)|true|none|Request details for a channel within the Async API|

## OperationRequest

<a id="schemaoperationrequest"></a>
<a id="schema_OperationRequest"></a>
<a id="tocSoperationrequest"></a>
<a id="tocsoperationrequest"></a>

```json
{
  "method": "GET",
  "path": "/pet/{petId}",
  "policies": [
    {
      "executionCondition": "request.header.x-custom == 'enabled'",
      "name": "SET_HEADER",
      "params": {
        "key": "MyHeader",
        "value": "MyValue"
      },
      "version": "v1"
    }
  ]
}

```

Operation Request

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|method|string|true|none|HTTP method for the operation|
|path|string|true|none|Resource path for the operation|
|policies|[[Policy](#schemapolicy)]|false|none|List of policies to be applied on the operation|

##### Enumerated Values

|Property|Value|
|---|---|
|method|GET|
|method|POST|
|method|PUT|
|method|DELETE|
|method|PATCH|
|method|HEAD|
|method|OPTIONS|

## ChannelRequest

<a id="schemachannelrequest"></a>
<a id="schema_ChannelRequest"></a>
<a id="tocSchannelrequest"></a>
<a id="tocschannelrequest"></a>

```json
{
  "method": "SUB",
  "name": "issues",
  "policies": [
    {
      "executionCondition": "request.header.x-custom == 'enabled'",
      "name": "SET_HEADER",
      "params": {
        "key": "MyHeader",
        "value": "MyValue"
      },
      "version": "v1"
    }
  ]
}

```

Channel Request

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|method|string|true|none|Async method for the channel|
|name|string|true|none|Channel name for the event|
|policies|[[Policy](#schemapolicy)]|false|none|List of policies to be applied on the operation|

##### Enumerated Values

|Property|Value|
|---|---|
|method|SUB|

## Policy

<a id="schemapolicy"></a>
<a id="schema_Policy"></a>
<a id="tocSpolicy"></a>
<a id="tocspolicy"></a>

```json
{
  "executionCondition": "request.header.x-custom == 'enabled'",
  "name": "SET_HEADER",
  "params": {
    "key": "MyHeader",
    "value": "MyValue"
  },
  "version": "v1"
}

```

Policy Configuration

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|executionCondition|string|false|none|Conditional expression that determines when this policy executes|
|name|string|true|none|Name of the policy to apply|
|params|object|false|none|Key-value pairs of parameters for the policy|
|version|string|true|none|Version of the policy. Only major-only version is allowed (e.g., v0, v1). Full semantic version (e.g., v1.0.0) is not accepted and will be rejected.|

## AddGatewayToRESTAPIRequest

<a id="schemaaddgatewaytorestapirequest"></a>
<a id="schema_AddGatewayToRESTAPIRequest"></a>
<a id="tocSaddgatewaytorestapirequest"></a>
<a id="tocsaddgatewaytorestapirequest"></a>

```json
{
  "gatewayId": "prod-gateway-01"
}

```

AddGatewayToAPIRequest object with basic gateway details

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|gatewayId|string|true|none|Handle (URL-friendly slug) of the gateway to associate with the REST API|

## RESTAPIGatewayListResponse

<a id="schemarestapigatewaylistresponse"></a>
<a id="schema_RESTAPIGatewayListResponse"></a>
<a id="tocSrestapigatewaylistresponse"></a>
<a id="tocsrestapigatewaylistresponse"></a>

```json
{
  "count": 3,
  "list": [
    {
      "id": "prod-gateway-01",
      "organizationId": "acme",
      "displayName": "Production Gateway 01",
      "description": "Production gateway for handling API traffic",
      "properties": {
        "region": "us-west",
        "tier": "premium"
      },
      "endpoints": [
        "https://api.example.com:8443/api/v1",
        "wss://events.example.com:8444"
      ],
      "isCritical": true,
      "functionalityType": "regular",
      "version": "1.0",
      "isActive": true,
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "createdAt": "2025-10-14T10:30:00Z",
      "updatedAt": "2025-10-14T10:30:00Z",
      "associatedAt": "2025-10-15T10:30:00Z",
      "isDeployed": true,
      "deployment": {
        "status": "CREATED",
        "deployedAt": "2025-10-15T11:00:00Z"
      }
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of gateways in current response|
|list|[[RESTAPIGatewayResponse](#schemarestapigatewayresponse)]|true|none|List of gateways associated with the API, including deployment details when deployed|
|pagination|[Pagination](#schemapagination)|true|none|none|

## RESTAPIGatewayResponse

<a id="schemarestapigatewayresponse"></a>
<a id="schema_RESTAPIGatewayResponse"></a>
<a id="tocSrestapigatewayresponse"></a>
<a id="tocsrestapigatewayresponse"></a>

```json
{
  "id": "prod-gateway-01",
  "organizationId": "acme",
  "displayName": "Production Gateway 01",
  "description": "Production gateway for handling API traffic",
  "properties": {
    "region": "us-west",
    "tier": "premium"
  },
  "endpoints": [
    "https://api.example.com:8443/api/v1",
    "wss://events.example.com:8444"
  ],
  "isCritical": true,
  "functionalityType": "regular",
  "version": "1.0",
  "isActive": true,
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2025-10-14T10:30:00Z",
  "updatedAt": "2025-10-14T10:30:00Z",
  "associatedAt": "2025-10-15T10:30:00Z",
  "isDeployed": true,
  "deployment": {
    "status": "CREATED",
    "deployedAt": "2025-10-15T11:00:00Z"
  }
}

```

#### Properties

allOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[GatewayResponse](#schemagatewayresponse)|false|none|none|

and

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|
|associatedAt|string(date-time)|true|none|Timestamp when the gateway was associated with the API|
|isDeployed|boolean|true|none|Whether the API is currently deployed to this gateway|
|deployment|[RESTAPIDeploymentDetails](#schemarestapideploymentdetails)|false|none|Deployment details (only present when isDeployed is true)|

## RESTAPIDeploymentDetails

<a id="schemarestapideploymentdetails"></a>
<a id="schema_RESTAPIDeploymentDetails"></a>
<a id="tocSrestapideploymentdetails"></a>
<a id="tocsrestapideploymentdetails"></a>

```json
{
  "status": "CREATED",
  "deployedAt": "2025-10-15T11:00:00Z"
}

```

Details about API deployment to a specific gateway

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|true|none|Current deployment status|
|deployedAt|string(date-time)|true|none|Timestamp when the API was deployed|

##### Enumerated Values

|Property|Value|
|---|---|
|status|CREATED|
|status|APPROVED|
|status|REJECTED|

## CreateGatewayRequest

<a id="schemacreategatewayrequest"></a>
<a id="schema_CreateGatewayRequest"></a>
<a id="tocScreategatewayrequest"></a>
<a id="tocscreategatewayrequest"></a>

```json
{
  "id": "prod-gateway-01",
  "displayName": "Production Gateway 01",
  "description": "Production gateway for handling API traffic",
  "endpoints": [
    "https://api.example.com:8443/api/v1",
    "wss://events.example.com:8444"
  ],
  "isCritical": true,
  "functionalityType": "regular",
  "properties": {
    "region": "us-west",
    "tier": "premium"
  },
  "version": "1.0"
}

```

Request body for creating a gateway. Organization ID is automatically extracted
from the JWT token and does not need to be provided.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Handle (URL-friendly slug) for the gateway. Immutable after creation.|
|displayName|string|true|none|Human-readable gateway name|
|description|string|false|none|Description of the gateway|
|endpoints|[string]|true|none|Network endpoints exposed by this gateway, each as a full URL string|
|isCritical|boolean|false|none|Whether the gateway is critical for production|
|functionalityType|string|true|none|Type of gateway functionality|
|properties|object|false|none|Custom key-value properties for the gateway|
|version|string|false|none|Gateway version in `major.minor` format (e.g. `1.0`) or CalVer `YYYY.MM.DD` format (e.g. `2026.05.13`). Defaults to `1.0` if not provided.|

##### Enumerated Values

|Property|Value|
|---|---|
|functionalityType|regular|
|functionalityType|ai|
|functionalityType|event|

## CustomPolicyResponse

<a id="schemacustompolicyresponse"></a>
<a id="schema_CustomPolicyResponse"></a>
<a id="tocScustompolicyresponse"></a>
<a id="tocscustompolicyresponse"></a>

```json
{
  "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "organizationUuid": "bc554ded-7e40-44a7-b397-48480793ad03",
  "name": "rate-limit-custom",
  "version": "1.0.0",
  "description": "Custom rate limiting policy",
  "policyDefinition": {},
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

A custom policy stored in the platform's custom policy registry.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|uuid|string(uuid)|true|none|Unique identifier of the custom policy record|
|organizationUuid|string(uuid)|true|none|Organization this policy belongs to|
|name|string|true|none|Policy name|
|version|string|true|none|Policy version|
|description|string|false|none|Human-readable description of the policy|
|policyDefinition|object|true|none|The full policy schema as declared in the policy's policy-definition.yaml.<br>Contains `parameters` and `systemParameters` JSON Schema documents.|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

## GatewayPolicyDefinition

<a id="schemagatewaypolicydefinition"></a>
<a id="schema_GatewayPolicyDefinition"></a>
<a id="tocSgatewaypolicydefinition"></a>
<a id="tocsgatewaypolicydefinition"></a>

```json
{
  "name": "set-wso2-headers",
  "version": "v0.8.0",
  "description": "Sets WSO2-specific headers in the request and response.",
  "isCustomPolicy": true,
  "policyDefinition": {}
}

```

A policy installed on a gateway controller.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|Unique policy name|
|version|string|true|none|Semantic version of the policy|
|description|string|false|none|Human-readable description of the policy|
|isCustomPolicy|boolean|true|none|Whether this is a user-installed custom policy.|
|policyDefinition|object|false|none|The full policy schema as declared in the policy's policy-definition.yaml.<br>Contains `parameters` and `systemParameters` JSON Schema documents.<br>Only present for custom policies.|

## ManifestSyncResponse

<a id="schemamanifestsyncresponse"></a>
<a id="schema_ManifestSyncResponse"></a>
<a id="tocSmanifestsyncresponse"></a>
<a id="tocsmanifestsyncresponse"></a>

```json
{
  "policies": [
    {
      "name": "set-wso2-headers",
      "version": "v0.8.0",
      "description": "Sets WSO2-specific headers in the request and response.",
      "isCustomPolicy": true,
      "policyDefinition": {}
    }
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|policies|[[GatewayPolicyDefinition](#schemagatewaypolicydefinition)]|false|none|All policies installed on the gateway. Each entry includes name, version, and isCustomPolicy.<br>Custom policies additionally include policyDefinition with their parameters and systemParameters schemas.|

## GatewayResponse

<a id="schemagatewayresponse"></a>
<a id="schema_GatewayResponse"></a>
<a id="tocSgatewayresponse"></a>
<a id="tocsgatewayresponse"></a>

```json
{
  "id": "prod-gateway-01",
  "organizationId": "acme",
  "displayName": "Production Gateway 01",
  "description": "Production gateway for handling API traffic",
  "properties": {
    "region": "us-west",
    "tier": "premium"
  },
  "endpoints": [
    "https://api.example.com:8443/api/v1",
    "wss://events.example.com:8444"
  ],
  "isCritical": true,
  "functionalityType": "regular",
  "version": "1.0",
  "isActive": true,
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2025-10-14T10:30:00Z",
  "updatedAt": "2025-10-14T10:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|read-only|Handle (URL-friendly slug) for the gateway|
|organizationId|string|false|none|Handle (URL-friendly slug) of the organization this gateway belongs to|
|displayName|string|true|none|Human-readable gateway name|
|description|string|false|none|Description of the gateway|
|properties|object|false|none|Custom key-value properties for the gateway|
|endpoints|[string]|false|none|Network endpoints exposed by this gateway, each as a full URL string|
|isCritical|boolean|false|none|Whether the gateway is critical for production|
|functionalityType|string|false|none|Type of gateway functionality|
|version|string|false|none|Gateway version in `major.minor` format (e.g. `1.0`) or CalVer `YYYY.MM.DD` format (e.g. `2026.05.13`)|
|isActive|boolean|false|none|Indicates if the gateway is currently connected to the platform via WebSocket|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /gateways/{gatewayId}), omitted from list responses.|
|createdAt|string(date-time)|false|none|Timestamp when gateway was registered|
|updatedAt|string(date-time)|false|none|Timestamp when gateway was last updated|

##### Enumerated Values

|Property|Value|
|---|---|
|functionalityType|regular|
|functionalityType|ai|
|functionalityType|event|

## Pagination

<a id="schemapagination"></a>
<a id="schema_Pagination"></a>
<a id="tocSpagination"></a>
<a id="tocspagination"></a>

```json
{
  "total": 10,
  "offset": 0,
  "limit": 10
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|total|integer|true|none|Total number of items available across all pages|
|offset|integer|true|none|Zero-based index of first item in current response|
|limit|integer|true|none|Maximum number of items returned per page|

## GatewayListResponse

<a id="schemagatewaylistresponse"></a>
<a id="schema_GatewayListResponse"></a>
<a id="tocSgatewaylistresponse"></a>
<a id="tocsgatewaylistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "prod-gateway-01",
      "organizationId": "acme",
      "displayName": "Production Gateway 01",
      "description": "Production gateway for handling API traffic",
      "properties": {
        "region": "us-west",
        "tier": "premium"
      },
      "endpoints": [
        "https://api.example.com:8443/api/v1",
        "wss://events.example.com:8444"
      ],
      "isCritical": true,
      "functionalityType": "regular",
      "version": "1.0",
      "isActive": true,
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "createdAt": "2025-10-14T10:30:00Z",
      "updatedAt": "2025-10-14T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

GatewayListResponse for paginated gateway results

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of items in current response|
|list|[[GatewayResponse](#schemagatewayresponse)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## GatewayStatusResponse

<a id="schemagatewaystatusresponse"></a>
<a id="schema_GatewayStatusResponse"></a>
<a id="tocSgatewaystatusresponse"></a>
<a id="tocsgatewaystatusresponse"></a>

```json
{
  "id": "prod-gateway-01",
  "isActive": true,
  "isCritical": true
}

```

Lightweight gateway status information optimized for frequent polling

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|read-only|Handle (URL-friendly slug) for the gateway|
|isActive|boolean|false|none|Indicates if the gateway is currently connected to the platform via WebSocket|
|isCritical|boolean|false|none|Whether the gateway is critical for production|

## GatewayStatusListResponse

<a id="schemagatewaystatuslistresponse"></a>
<a id="schema_GatewayStatusListResponse"></a>
<a id="tocSgatewaystatuslistresponse"></a>
<a id="tocsgatewaystatuslistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "prod-gateway-01",
      "isActive": true,
      "isCritical": true
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

List of gateway status information for polling

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of items in current response|
|list|[[GatewayStatusResponse](#schemagatewaystatusresponse)]|true|none|[Lightweight gateway status information optimized for frequent polling]|
|pagination|[Pagination](#schemapagination)|true|none|none|

## ProjectListResponse

<a id="schemaprojectlistresponse"></a>
<a id="schema_ProjectListResponse"></a>
<a id="tocSprojectlistresponse"></a>
<a id="tocsprojectlistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "default-project",
      "displayName": "Default Project",
      "description": "This is the default project for development",
      "organizationId": "acme",
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "createdAt": "2023-10-12T10:30:00Z",
      "updatedAt": "2023-10-12T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of items in current response|
|list|[[Project](#schemaproject)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## OrganizationListResponse

<a id="schemaorganizationlistresponse"></a>
<a id="schema_OrganizationListResponse"></a>
<a id="tocSorganizationlistresponse"></a>
<a id="tocsorganizationlistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "acme",
      "displayName": "Acme Corporation",
      "region": "us",
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "createdAt": "2023-10-12T10:30:00Z",
      "updatedAt": "2023-10-12T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of items in current response|
|list|[[Organization](#schemaorganization)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## RESTAPIListResponse

<a id="schemarestapilistresponse"></a>
<a id="schema_RESTAPIListResponse"></a>
<a id="tocSrestapilistresponse"></a>
<a id="tocsrestapilistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "my-rest-api-handle",
      "displayName": "PizzaShackAPI",
      "description": "This is a simple API for Pizza Shack online pizza delivery store",
      "context": "/pizza",
      "version": "1.0.0",
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "projectId": "default-project",
      "createdAt": "2023-10-12T10:30:00Z",
      "updatedAt": "2023-10-12T10:30:00Z",
      "readOnly": false,
      "upstream": {
        "main": {
          "url": "http://prod-backend:5000/api/v2",
          "auth": {
            "type": "api-key",
            "header": "X-API-Key",
            "value": "my-api-key-value"
          }
        },
        "sandbox": {
          "url": "http://prod-backend:5000/api/v2",
          "auth": {
            "type": "api-key",
            "header": "X-API-Key",
            "value": "my-api-key-value"
          }
        }
      },
      "lifeCycleStatus": "CREATED",
      "kind": "RestApi",
      "transport": [
        "http",
        "https"
      ],
      "policies": [
        {
          "executionCondition": "request.header.x-custom == 'enabled'",
          "name": "SET_HEADER",
          "params": {
            "key": "MyHeader",
            "value": "MyValue"
          },
          "version": "v1"
        }
      ],
      "operations": [
        {
          "name": "getPetById",
          "description": "Find pet by ID",
          "request": {
            "method": "GET",
            "path": "/pet/{petId}",
            "policies": [
              {
                "executionCondition": "request.header.x-custom == 'enabled'",
                "name": "SET_HEADER",
                "params": {
                  "key": "MyHeader",
                  "value": "MyValue"
                },
                "version": "v1"
              }
            ]
          }
        }
      ],
      "channels": [
        {
          "name": "issues",
          "description": "Channel for order events",
          "request": {
            "method": "SUB",
            "name": "issues",
            "policies": [
              {
                "executionCondition": "request.header.x-custom == 'enabled'",
                "name": "SET_HEADER",
                "params": {
                  "key": "MyHeader",
                  "value": "MyValue"
                },
                "version": "v1"
              }
            ]
          }
        }
      ],
      "subscriptionPlans": [
        "Gold",
        "Silver"
      ]
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of items in current response|
|list|[[RESTAPI](#schemarestapi)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## TokenRotationResponse

<a id="schematokenrotationresponse"></a>
<a id="schema_TokenRotationResponse"></a>
<a id="tocStokenrotationresponse"></a>
<a id="tocstokenrotationresponse"></a>

```json
{
  "id": "def45678-g901-23hi-j456-789012klmnop",
  "token": "REDACTED_TOKEN",
  "createdAt": "2025-10-15T14:20:00Z",
  "message": "New token generated successfully. Old token remains active until revoked."
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|ID of the newly generated token|
|token|string|false|none|Plain-text new authentication token (only exposed once during rotation). The example value is a non-functional placeholder.|
|createdAt|string(date-time)|false|none|Timestamp when new token was created|
|message|string|false|none|Informational message about token rotation|

## TokenInfoResponse

<a id="schematokeninforesponse"></a>
<a id="schema_TokenInfoResponse"></a>
<a id="tocStokeninforesponse"></a>
<a id="tocstokeninforesponse"></a>

```json
{
  "id": "abc12345-f678-90de-f123-456789abcdef",
  "status": "active",
  "createdAt": "2025-10-14T10:30:00Z",
  "revokedAt": null
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Token UUID|
|status|string|false|none|Current token status|
|createdAt|string(date-time)|false|none|Timestamp when token was created|
|revokedAt|string(date-time)¦null|false|none|Timestamp when token was revoked (null if active)|

##### Enumerated Values

|Property|Value|
|---|---|
|status|active|
|status|revoked|

## CreateRESTAPIRequest

<a id="schemacreaterestapirequest"></a>
<a id="schema_CreateRESTAPIRequest"></a>
<a id="tocScreaterestapirequest"></a>
<a id="tocscreaterestapirequest"></a>

```json
{
  "id": "my-rest-api-handle",
  "displayName": "PizzaShackAPI",
  "description": "This is a simple API for Pizza Shack online pizza delivery store",
  "context": "/pizza",
  "version": "1.0.0",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "projectId": "default-project",
  "createdAt": "2023-10-12T10:30:00Z",
  "updatedAt": "2023-10-12T10:30:00Z",
  "readOnly": false,
  "upstream": {
    "main": {
      "url": "http://prod-backend:5000/api/v2",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key",
        "value": "my-api-key-value"
      }
    },
    "sandbox": {
      "url": "http://prod-backend:5000/api/v2",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key",
        "value": "my-api-key-value"
      }
    }
  },
  "lifeCycleStatus": "CREATED",
  "kind": "RestApi",
  "transport": [
    "http",
    "https"
  ],
  "policies": [
    {
      "executionCondition": "request.header.x-custom == 'enabled'",
      "name": "SET_HEADER",
      "params": {
        "key": "MyHeader",
        "value": "MyValue"
      },
      "version": "v1"
    }
  ],
  "operations": [
    {
      "name": "getPetById",
      "description": "Find pet by ID",
      "request": {
        "method": "GET",
        "path": "/pet/{petId}",
        "policies": [
          {
            "executionCondition": "request.header.x-custom == 'enabled'",
            "name": "SET_HEADER",
            "params": {
              "key": "MyHeader",
              "value": "MyValue"
            },
            "version": "v1"
          }
        ]
      }
    }
  ],
  "channels": [
    {
      "name": "issues",
      "description": "Channel for order events",
      "request": {
        "method": "SUB",
        "name": "issues",
        "policies": [
          {
            "executionCondition": "request.header.x-custom == 'enabled'",
            "name": "SET_HEADER",
            "params": {
              "key": "MyHeader",
              "value": "MyValue"
            },
            "version": "v1"
          }
        ]
      }
    }
  ],
  "subscriptionPlans": [
    "Gold",
    "Silver"
  ]
}

```

#### Properties

allOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[RESTAPI](#schemarestapi)|false|none|none|

and

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|

## TimeUnit

<a id="schematimeunit"></a>
<a id="schema_TimeUnit"></a>
<a id="tocStimeunit"></a>
<a id="tocstimeunit"></a>

```json
"days"

```

Time unit for API key expiration duration

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|Time unit for API key expiration duration|

##### Enumerated Values

|Property|Value|
|---|---|
|*anonymous*|seconds|
|*anonymous*|minutes|
|*anonymous*|hours|
|*anonymous*|days|
|*anonymous*|weeks|
|*anonymous*|months|

## ExpirationDuration

<a id="schemaexpirationduration"></a>
<a id="schema_ExpirationDuration"></a>
<a id="tocSexpirationduration"></a>
<a id="tocsexpirationduration"></a>

```json
{
  "duration": 30,
  "unit": "days"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|duration|integer|true|none|Duration value (must be positive)|
|unit|[TimeUnit](#schematimeunit)|true|none|Time unit for API key expiration duration|

## CreateAPIKeyRequest

<a id="schemacreateapikeyrequest"></a>
<a id="schema_CreateAPIKeyRequest"></a>
<a id="tocScreateapikeyrequest"></a>
<a id="tocscreateapikeyrequest"></a>

```json
{
  "id": "production-key-01",
  "displayName": "Production API Key",
  "apiKey": "sk_example_1234567890abcdef",
  "externalRefId": "ext-ref-12345",
  "expiresAt": "2026-12-31T23:59:59Z",
  "expiresIn": {
    "duration": 30,
    "unit": "days"
  },
  "issuer": "api-platform-devportal"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique identifier for this API key within the API (optional; if omitted,<br>generated from displayName)|
|displayName|string|true|none|Human-readable name for the API key|
|apiKey|string|true|none|The plain text API key value that will be hashed before storage|
|externalRefId|string¦null|false|none|Optional reference ID for tracing purposes (from external platforms)|
|expiresAt|string(date-time)¦null|false|none|Optional expiration time in ISO 8601 format|
|expiresIn|[ExpirationDuration](#schemaexpirationduration)|false|none|Optional expiration duration|
|issuer|string¦null|false|none|Identifier of the API Portal that provisioned this API key. Null if not provided.|

## CreateAPIKeyResponse

<a id="schemacreateapikeyresponse"></a>
<a id="schema_CreateAPIKeyResponse"></a>
<a id="tocScreateapikeyresponse"></a>
<a id="tocscreateapikeyresponse"></a>

```json
{
  "status": "success",
  "message": "API key created and broadcasted to gateways successfully",
  "keyId": "production-key-01"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|true|none|Status of the operation|
|message|string|true|none|Additional details about the operation result|
|keyId|string|false|none|The internal ID generated for tracking|

##### Enumerated Values

|Property|Value|
|---|---|
|status|success|
|status|error|

## UpdateAPIKeyRequest

<a id="schemaupdateapikeyrequest"></a>
<a id="schema_UpdateAPIKeyRequest"></a>
<a id="tocSupdateapikeyrequest"></a>
<a id="tocsupdateapikeyrequest"></a>

```json
{
  "name": "production-key-01",
  "displayName": "Production API Key (Updated)",
  "apiKey": "sk_example_new1234567890abcdef",
  "externalRefId": "ext-ref-12345",
  "expiresAt": "2027-12-31T23:59:59Z",
  "expiresIn": {
    "duration": 30,
    "unit": "days"
  },
  "issuer": "api-platform-devportal"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|Unique identifier for this API key within the API (optional; if omitted, generated from displayName)|
|displayName|string|true|none|Human-readable name for the API key|
|apiKey|string|true|none|The new plain text API key value that will be hashed before storage|
|externalRefId|string¦null|false|none|Optional reference ID for tracing purposes (from external platforms)|
|expiresAt|string(date-time)¦null|false|none|Optional expiration time in ISO 8601 format|
|expiresIn|[ExpirationDuration](#schemaexpirationduration)|false|none|Optional expiration duration|
|issuer|string|false|none|Identifies the portal that created this key|

## UpdateAPIKeyResponse

<a id="schemaupdateapikeyresponse"></a>
<a id="schema_UpdateAPIKeyResponse"></a>
<a id="tocSupdateapikeyresponse"></a>
<a id="tocsupdateapikeyresponse"></a>

```json
{
  "status": "success",
  "message": "API key updated and broadcasted to gateways successfully",
  "keyId": "production-key-01"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|true|none|Status of the operation|
|message|string|true|none|Additional details about the operation result|
|keyId|string|false|none|The internal ID of the updated key|

##### Enumerated Values

|Property|Value|
|---|---|
|status|success|
|status|error|

## SubscriptionPlanLimit

<a id="schemasubscriptionplanlimit"></a>
<a id="schema_SubscriptionPlanLimit"></a>
<a id="tocSsubscriptionplanlimit"></a>
<a id="tocssubscriptionplanlimit"></a>

```json
{
  "limitType": "REQUEST_COUNT",
  "timeUnit": "HOUR",
  "timeAmount": 1,
  "limitCount": 10000,
  "limitCountUnit": "string",
  "stopOnQuotaReach": true
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|limitType|string|false|none|Kind of quota this limit enforces. Only REQUEST_COUNT is currently enforced; other values are accepted by the schema for forward compatibility but are rejected by the API today.|
|timeUnit|string|true|none|Throttle window unit|
|timeAmount|integer|false|none|Number of timeUnit windows the limit applies over (e.g. 2 with timeUnit=HOUR means "per 2 hours")|
|limitCount|integer|true|none|Number of requests (or units, for BANDWIDTH/TOTAL_TOKEN_COUNT) allowed in the throttle window|
|limitCountUnit|string|false|none|Unit for limitCount when limitType is BANDWIDTH (e.g. MB, GB)|
|stopOnQuotaReach|boolean|false|none|Whether to block requests when this limit's quota is exhausted|

##### Enumerated Values

|Property|Value|
|---|---|
|limitType|REQUEST_COUNT|
|limitType|BANDWIDTH|
|limitType|TOTAL_TOKEN_COUNT|
|timeUnit|MINUTE|
|timeUnit|HOUR|
|timeUnit|DAY|
|timeUnit|MONTH|

## CreateSubscriptionPlanRequest

<a id="schemacreatesubscriptionplanrequest"></a>
<a id="schema_CreateSubscriptionPlanRequest"></a>
<a id="tocScreatesubscriptionplanrequest"></a>
<a id="tocscreatesubscriptionplanrequest"></a>

```json
{
  "id": "gold",
  "displayName": "Gold",
  "limits": [
    {
      "limitType": "REQUEST_COUNT",
      "timeUnit": "HOUR",
      "timeAmount": 1,
      "limitCount": 10000,
      "limitCountUnit": "string",
      "stopOnQuotaReach": true
    }
  ],
  "expiryTime": "2019-08-24T14:15:22Z",
  "status": "ACTIVE"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Handle (URL-friendly slug) for the plan. Immutable after creation.|
|displayName|string|true|none|Human-readable name for the subscription plan|
|limits|[[SubscriptionPlanLimit](#schemasubscriptionplanlimit)]|false|none|Throttling limits for the plan (e.g. requests per hour, requests per month). The table backing this API already supports multiple limits per plan, but the platform-api currently only persists and enforces the first entry in this array; any additional entries are accepted but ignored.|
|expiryTime|string(date-time)|false|none|Optional plan expiry time (RFC3339)|
|status|string|false|none|none|

##### Enumerated Values

|Property|Value|
|---|---|
|status|ACTIVE|
|status|INACTIVE|

## SubscriptionPlan

<a id="schemasubscriptionplan"></a>
<a id="schema_SubscriptionPlan"></a>
<a id="tocSsubscriptionplan"></a>
<a id="tocssubscriptionplan"></a>

```json
{
  "id": "string",
  "displayName": "string",
  "limits": [
    {
      "limitType": "REQUEST_COUNT",
      "timeUnit": "HOUR",
      "timeAmount": 1,
      "limitCount": 10000,
      "limitCountUnit": "string",
      "stopOnQuotaReach": true
    }
  ],
  "expiryTime": "2019-08-24T14:15:22Z",
  "organizationId": "acme",
  "status": "ACTIVE",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Handle (slug) for the subscription plan|
|displayName|string|true|none|Human-readable name for the subscription plan|
|limits|[[SubscriptionPlanLimit](#schemasubscriptionplanlimit)]|false|none|Throttling limits configured for the plan. Only one entry is currently supported and returned, even though the underlying storage allows multiple.|
|expiryTime|string(date-time)|false|none|none|
|organizationId|string|false|none|Handle (URL-friendly slug) of the organization this plan belongs to|
|status|string|false|none|none|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /subscription-plans/{planId}), omitted from list responses.|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

##### Enumerated Values

|Property|Value|
|---|---|
|status|ACTIVE|
|status|INACTIVE|

## SubscriptionPlanListResponse

<a id="schemasubscriptionplanlistresponse"></a>
<a id="schema_SubscriptionPlanListResponse"></a>
<a id="tocSsubscriptionplanlistresponse"></a>
<a id="tocssubscriptionplanlistresponse"></a>

```json
{
  "list": [
    {
      "id": "string",
      "displayName": "string",
      "limits": [
        {
          "limitType": "REQUEST_COUNT",
          "timeUnit": "HOUR",
          "timeAmount": 1,
          "limitCount": 10000,
          "limitCountUnit": "string",
          "stopOnQuotaReach": true
        }
      ],
      "expiryTime": "2019-08-24T14:15:22Z",
      "organizationId": "acme",
      "status": "ACTIVE",
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "count": 0,
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|list|[[SubscriptionPlan](#schemasubscriptionplan)]|true|none|List of subscription plans in current response|
|count|integer|true|none|Number of subscription plans in current response|
|pagination|[Pagination](#schemapagination)|true|none|none|

## CreateSubscriptionRequest

<a id="schemacreatesubscriptionrequest"></a>
<a id="schema_CreateSubscriptionRequest"></a>
<a id="tocScreatesubscriptionrequest"></a>
<a id="tocscreatesubscriptionrequest"></a>

```json
{
  "artifactId": "my-rest-api",
  "kind": "RestApi",
  "subscriberId": "user-123",
  "applicationId": "my-app-handle",
  "subscriptionPlanId": "gold",
  "status": "ACTIVE"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|artifactId|string|true|none|Handle (ID) of the artifact to subscribe to. Resolved against the table for the given kind.|
|kind|string|true|none|Type of the artifact identified by artifactId. Determines which artifact table artifactId is resolved against.|
|subscriberId|string|true|none|Unique subscriber identifier for the subscription (required)|
|applicationId|string|false|none|Handle (ID) of the application this subscription belongs to. Optional in token-based subscriptions.|
|subscriptionPlanId|string|false|none|Handle (slug) of the subscription plan. Links the subscription to rate limit and billing configuration.|
|status|string|false|none|Subscription status (default ACTIVE)|

##### Enumerated Values

|Property|Value|
|---|---|
|kind|RestApi|
|kind|LlmProvider|
|kind|LlmProxy|
|kind|Mcp|
|status|ACTIVE|
|status|INACTIVE|
|status|REVOKED|

## Subscription

<a id="schemasubscription"></a>
<a id="schema_Subscription"></a>
<a id="tocSsubscription"></a>
<a id="tocssubscription"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "artifactId": "my-rest-api",
  "kind": "RestApi",
  "subscriberId": "string",
  "applicationId": "my-app-handle",
  "subscriptionToken": "string",
  "subscriptionPlanId": "gold",
  "subscriptionPlanName": "string",
  "organizationId": "acme",
  "status": "ACTIVE",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Subscription ID|
|artifactId|string|false|none|Handle (ID) of the subscribed artifact|
|kind|string|false|none|Type of the subscribed artifact|
|subscriberId|string|false|none|Unique subscriber identifier for this API (required)|
|applicationId|string|false|none|Handle (ID) of the application this subscription belongs to (optional for token-based subscriptions)|
|subscriptionToken|string|false|none|Opaque subscription token for API invocation via Subscription-Key header|
|subscriptionPlanId|string|false|none|Handle (slug) of the subscription plan|
|subscriptionPlanName|string|false|none|Subscription plan display name (e.g. Bronze, Gold)|
|organizationId|string|false|none|Handle (URL-friendly slug) of the organization this subscription belongs to|
|status|string|false|none|none|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /subscriptions/{subscriptionId}), omitted from list responses.|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

##### Enumerated Values

|Property|Value|
|---|---|
|kind|RestApi|
|kind|LlmProvider|
|kind|LlmProxy|
|kind|Mcp|
|status|ACTIVE|
|status|INACTIVE|
|status|REVOKED|

## SubscriptionListResponse

<a id="schemasubscriptionlistresponse"></a>
<a id="schema_SubscriptionListResponse"></a>
<a id="tocSsubscriptionlistresponse"></a>
<a id="tocssubscriptionlistresponse"></a>

```json
{
  "list": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "artifactId": "my-rest-api",
      "kind": "RestApi",
      "subscriberId": "string",
      "applicationId": "my-app-handle",
      "subscriptionToken": "string",
      "subscriptionPlanId": "gold",
      "subscriptionPlanName": "string",
      "organizationId": "acme",
      "status": "ACTIVE",
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "count": 0,
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|list|[[Subscription](#schemasubscription)]|true|none|List of subscriptions in current response|
|count|integer|true|none|Number of subscriptions in current response|
|pagination|[Pagination](#schemapagination)|true|none|none|

## Error

<a id="schemaerror"></a>
<a id="schema_Error"></a>
<a id="tocSerror"></a>
<a id="tocserror"></a>

```json
{
  "status": "error",
  "code": "REST_API_NOT_FOUND",
  "message": "The requested REST API could not be found.",
  "errors": [
    {
      "field": "<name of the offending field>",
      "message": "must start with /"
    }
  ],
  "details": {},
  "trackingId": "4f1c6f2e-8a4b-4c93-b1de-9f2f6f0c2a11"
}

```

Standard error response

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|true|none|Always the literal "error".|
|code|string|true|none|Stable, machine-readable error code from the error catalog, in the form `<DOMAIN>_<REASON>` (e.g. `REST_API_NOT_FOUND`). Clients and agents should branch on this, not on the HTTP status.|
|message|string|true|none|Human-readable description of the error.|
|errors|[[FieldError](#schemafielderror)]|false|none|Per-field validation failures. Present when the error is a validation failure.|
|details|object|false|none|Optional structured metadata specific to this error condition (e.g. the resources referencing a secret that blocked its deletion). Shape varies by `code`; absent when not applicable.|
|trackingId|string(uuid)|false|none|Correlation ID for server-side failures. Present only on 5xx responses; quote it when reporting the error so operators can find the corresponding server log entry.|

##### Enumerated Values

|Property|Value|
|---|---|
|status|error|

## FieldError

<a id="schemafielderror"></a>
<a id="schema_FieldError"></a>
<a id="tocSfielderror"></a>
<a id="tocsfielderror"></a>

```json
{
  "field": "<name of the offending field>",
  "message": "must start with /"
}

```

Field-level validation error

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|field|string|true|none|Path of the offending field.|
|message|string|true|none|Why the field failed validation.|

## DeployRequest

<a id="schemadeployrequest"></a>
<a id="schema_DeployRequest"></a>
<a id="tocSdeployrequest"></a>
<a id="tocsdeployrequest"></a>

```json
{
  "name": "v1.0-production",
  "base": "current",
  "gatewayId": "prod-gateway-01",
  "metadata": {}
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|Name/label for this deployment (e.g., "v1.0-prod", "hotfix-2024-01-15")|
|base|string|true|none|The source for the API definition. Can be "current" (latest working copy) or a deploymentId (existing deployment)|
|gatewayId|string|true|none|Handle (URL-friendly slug) of the target gateway for this deployment|
|metadata|object|false|none|Optional metadata for the deployment. Supported keys include `endpointUrl`, `vhostMain`, and `vhostSandbox`.|

## DeploymentResponse

<a id="schemadeploymentresponse"></a>
<a id="schema_DeploymentResponse"></a>
<a id="tocSdeploymentresponse"></a>
<a id="tocsdeploymentresponse"></a>

```json
{
  "deploymentId": "a73c85a1-d857-491e-a6b2-51dce05de7a2",
  "name": "v1.0-production",
  "gatewayId": "prod-gateway-01",
  "status": "DEPLOYED",
  "baseDeploymentId": "be6d8692-b9de-400e-b6c1-14db50154e27",
  "metadata": {},
  "createdAt": "2019-08-24T14:15:22Z",
  "statusReason": "string",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deploymentId|string(uuid)|true|none|Unique identifier for the deployment|
|name|string|true|none|Name/label for this deployment|
|gatewayId|string|true|none|Handle (URL-friendly slug) of the gateway|
|status|string|true|none|Current deployment lifecycle state:<br>- DEPLOYED: Currently active on the gateway<br>- UNDEPLOYED: Suspended but can be rolled back<br>- DEPLOYING: Deployment in progress, waiting for gateway acknowledgement<br>- UNDEPLOYING: Undeployment in progress, waiting for gateway acknowledgement<br>- FAILED: Deployment or undeployment failed (see statusReason for error code)<br>- ARCHIVED: Historical deployment, can be rolled back|
|baseDeploymentId|string(uuid)¦null|false|none|UUID of the base deployment this was created from|
|metadata|object|false|none|Metadata associated with the deployment|
|createdAt|string(date-time)|true|none|Timestamp when the deployment artifact was created|
|statusReason|string¦null|false|none|Error code explaining the failure reason. Null unless status is FAILED (e.g. DEPLOYMENT_TIMEOUT, GATEWAY_PROCESSING_ERROR). Agent proxy deployments may also report AGENT_VALIDATION_FAILED, AGENT_CONFIG_RENDER_FAILED, AGENT_CONFLICT, AGENT_ARTIFACT_FETCH_FAILED and DEPLOYMENT_ID_MISMATCH.|
|updatedAt|string(date-time)¦null|false|none|Timestamp when the deployment status last changed (null for ARCHIVED deployments)|

##### Enumerated Values

|Property|Value|
|---|---|
|status|DEPLOYED|
|status|UNDEPLOYED|
|status|DEPLOYING|
|status|UNDEPLOYING|
|status|FAILED|
|status|ARCHIVED|

## DeploymentListResponse

<a id="schemadeploymentlistresponse"></a>
<a id="schema_DeploymentListResponse"></a>
<a id="tocSdeploymentlistresponse"></a>
<a id="tocsdeploymentlistresponse"></a>

```json
{
  "count": 0,
  "list": [
    {
      "deploymentId": "a73c85a1-d857-491e-a6b2-51dce05de7a2",
      "name": "v1.0-production",
      "gatewayId": "prod-gateway-01",
      "status": "DEPLOYED",
      "baseDeploymentId": "be6d8692-b9de-400e-b6c1-14db50154e27",
      "metadata": {},
      "createdAt": "2019-08-24T14:15:22Z",
      "statusReason": "string",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of deployments in current response|
|list|[[DeploymentResponse](#schemadeploymentresponse)]|true|none|List of deployments|
|pagination|[Pagination](#schemapagination)|true|none|none|

## Upstream

<a id="schemaupstream"></a>
<a id="schema_Upstream"></a>
<a id="tocSupstream"></a>
<a id="tocsupstream"></a>

```json
{
  "main": {
    "url": "http://prod-backend:5000/api/v2",
    "auth": {
      "type": "api-key",
      "header": "X-API-Key",
      "value": "my-api-key-value"
    }
  },
  "sandbox": {
    "url": "http://prod-backend:5000/api/v2",
    "auth": {
      "type": "api-key",
      "header": "X-API-Key",
      "value": "my-api-key-value"
    }
  }
}

```

Upstream backend configuration with main and sandbox endpoints

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|main|[UpstreamDefinition](#schemaupstreamdefinition)|true|none|Upstream endpoint configuration. Provide exactly one of `url` (a direct backend URL) or<br>`ref` (a reference to a predefined upstream definition) — never both.|
|sandbox|[UpstreamDefinition](#schemaupstreamdefinition)|false|none|Upstream endpoint configuration. Provide exactly one of `url` (a direct backend URL) or<br>`ref` (a reference to a predefined upstream definition) — never both.|

## UpstreamDefinition

<a id="schemaupstreamdefinition"></a>
<a id="schema_UpstreamDefinition"></a>
<a id="tocSupstreamdefinition"></a>
<a id="tocsupstreamdefinition"></a>

```json
{
  "url": "http://prod-backend:5000/api/v2",
  "auth": {
    "type": "api-key",
    "header": "X-API-Key",
    "value": "my-api-key-value"
  }
}

```

Upstream endpoint configuration. Provide exactly one of `url` (a direct backend URL) or
`ref` (a reference to a predefined upstream definition) — never both.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|url|string(uri)|false|none|Direct backend URL to route traffic to. Mutually exclusive with `ref`.|
|ref|string|false|none|Reference to a predefined upstreamDefinition. Mutually exclusive with `url`.|
|auth|[UpstreamAuth](#schemaupstreamauth)|false|none|Authentication configuration for upstream endpoints|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|

## UpstreamAuth

<a id="schemaupstreamauth"></a>
<a id="schema_UpstreamAuth"></a>
<a id="tocSupstreamauth"></a>
<a id="tocsupstreamauth"></a>

```json
{
  "type": "api-key",
  "header": "X-API-Key",
  "value": "my-api-key-value"
}

```

Authentication configuration for upstream endpoints

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|false|none|Authentication type|
|header|string|false|none|Header name for api-key authentication (e.g., 'Authorization' for bearer/basic, custom header for api-key)|
|value|string(password)|false|write-only|Authentication value (API key, Bearer token, or Base64 encoded credentials for basic auth)|

##### Enumerated Values

|Property|Value|
|---|---|
|type|basic|
|type|bearer|
|type|api-key|
|type|other|
|type|none|

## ExtractionIdentifier

<a id="schemaextractionidentifier"></a>
<a id="schema_ExtractionIdentifier"></a>
<a id="tocSextractionidentifier"></a>
<a id="tocsextractionidentifier"></a>

```json
{
  "location": "payload",
  "identifier": "$.usage.inputTokens"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|location|string|true|none|Where to find the token information|
|identifier|string|true|none|JSONPath expression or header name to identify the token value|

##### Enumerated Values

|Property|Value|
|---|---|
|location|payload|
|location|header|
|location|queryParam|
|location|pathParam|

## LLMProviderTemplateAuth

<a id="schemallmprovidertemplateauth"></a>
<a id="schema_LLMProviderTemplateAuth"></a>
<a id="tocSllmprovidertemplateauth"></a>
<a id="tocsllmprovidertemplateauth"></a>

```json
{
  "type": "bearer",
  "header": "Authorization",
  "valuePrefix": "Bearer "
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|false|none|Authentication type used by the LLM provider template|
|header|string|false|none|Header name to send the auth value|
|valuePrefix|string|false|none|Prefix to attach before the auth value|

## LLMProviderTemplateMetadata

<a id="schemallmprovidertemplatemetadata"></a>
<a id="schema_LLMProviderTemplateMetadata"></a>
<a id="tocSllmprovidertemplatemetadata"></a>
<a id="tocsllmprovidertemplatemetadata"></a>

```json
{
  "endpointUrl": "https://api.openai.com",
  "auth": {
    "type": "bearer",
    "header": "Authorization",
    "valuePrefix": "Bearer "
  },
  "logoUrl": "https://cdn.example.com/logos/openai.svg",
  "openapiSpecUrl": "https://api.openai.com/openapi.json"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|endpointUrl|string(uri)|false|none|Default endpoint URL for the template|
|auth|[LLMProviderTemplateAuth](#schemallmprovidertemplateauth)|false|none|none|
|logoUrl|string(uri)|false|none|URL of the provider logo|
|openapiSpecUrl|string(uri)|false|none|URL to the OpenAPI specification for the provider|

## LLMProviderTemplateResourceMapping

<a id="schemallmprovidertemplateresourcemapping"></a>
<a id="schema_LLMProviderTemplateResourceMapping"></a>
<a id="tocSllmprovidertemplateresourcemapping"></a>
<a id="tocsllmprovidertemplateresourcemapping"></a>

```json
{
  "resource": "/responses",
  "promptTokens": {
    "location": "payload",
    "identifier": "$.usage.inputTokens"
  },
  "completionTokens": {
    "location": "payload",
    "identifier": "$.usage.outputTokens"
  },
  "totalTokens": {
    "location": "payload",
    "identifier": "$.usage.totalTokens"
  },
  "remainingTokens": {
    "location": "header",
    "identifier": "x-ratelimit-remaining-tokens"
  },
  "requestModel": {
    "location": "payload",
    "identifier": "$.model"
  },
  "responseModel": {
    "location": "payload",
    "identifier": "$.model"
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|resource|string|true|none|Resource path pattern this mapping applies to (for example /responses or /chat/*)|
|promptTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|completionTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|totalTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|remainingTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|requestModel|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|responseModel|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|

## LLMProviderTemplateResourceMappings

<a id="schemallmprovidertemplateresourcemappings"></a>
<a id="schema_LLMProviderTemplateResourceMappings"></a>
<a id="tocSllmprovidertemplateresourcemappings"></a>
<a id="tocsllmprovidertemplateresourcemappings"></a>

```json
{
  "resources": [
    {
      "resource": "/responses",
      "promptTokens": {
        "location": "payload",
        "identifier": "$.usage.inputTokens"
      },
      "completionTokens": {
        "location": "payload",
        "identifier": "$.usage.outputTokens"
      },
      "totalTokens": {
        "location": "payload",
        "identifier": "$.usage.totalTokens"
      },
      "remainingTokens": {
        "location": "header",
        "identifier": "x-ratelimit-remaining-tokens"
      },
      "requestModel": {
        "location": "payload",
        "identifier": "$.model"
      },
      "responseModel": {
        "location": "payload",
        "identifier": "$.model"
      }
    }
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|resources|[[LLMProviderTemplateResourceMapping](#schemallmprovidertemplateresourcemapping)]|false|none|none|

## LLMProviderTemplate

<a id="schemallmprovidertemplate"></a>
<a id="schema_LLMProviderTemplate"></a>
<a id="tocSllmprovidertemplate"></a>
<a id="tocsllmprovidertemplate"></a>

```json
{
  "id": "openai",
  "groupId": "openai",
  "displayName": "OpenAI",
  "managedBy": "wso2",
  "description": "Default OpenAI template",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "readOnly": false,
  "version": "v1.0",
  "isLatest": true,
  "enabled": true,
  "openapi": "openapi: 3.0.3\ninfo:\n  title: Provider API\n  version: v1.0\npaths: {}\n",
  "metadata": {
    "endpointUrl": "https://api.openai.com",
    "auth": {
      "type": "bearer",
      "header": "Authorization",
      "valuePrefix": "Bearer "
    },
    "logoUrl": "https://cdn.example.com/logos/openai.svg",
    "openapiSpecUrl": "https://api.openai.com/openapi.json"
  },
  "promptTokens": {
    "location": "payload",
    "identifier": "$.usage.inputTokens"
  },
  "completionTokens": {
    "location": "payload",
    "identifier": "$.usage.outputTokens"
  },
  "totalTokens": {
    "location": "payload",
    "identifier": "$.usage.totalTokens"
  },
  "remainingTokens": {
    "location": "header",
    "identifier": "x-ratelimit-remaining-tokens"
  },
  "requestModel": {
    "location": "payload",
    "identifier": "$.model"
  },
  "responseModel": {
    "location": "payload",
    "identifier": "$.model"
  },
  "resourceMappings": {
    "resources": [
      {
        "resource": "/responses",
        "promptTokens": {
          "location": "payload",
          "identifier": "$.usage.inputTokens"
        },
        "completionTokens": {
          "location": "payload",
          "identifier": "$.usage.outputTokens"
        },
        "totalTokens": {
          "location": "payload",
          "identifier": "$.usage.totalTokens"
        },
        "remainingTokens": {
          "location": "header",
          "identifier": "x-ratelimit-remaining-tokens"
        },
        "requestModel": {
          "location": "payload",
          "identifier": "$.model"
        },
        "responseModel": {
          "location": "payload",
          "identifier": "$.model"
        }
      }
    ]
  },
  "createdAt": "2023-10-12T10:30:00Z",
  "updatedAt": "2023-10-12T10:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique handle for the template|
|groupId|string|false|read-only|Stable identifier shared by every version of a template family.|
|displayName|string|true|none|Human-readable LLM Template name|
|managedBy|string|false|none|Identifies who manages the template. Built-in templates use 'wso2';<br>custom templates default to 'organization' and may be set to any value.|
|description|string|false|none|Description of the LLM provider template|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource|
|readOnly|boolean|false|read-only|True if the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane; false for control-plane created artifacts.|
|version|string|true|none|Content version, matching the v<major>.<minor> pattern (e.g. v1.0, v2.0).<br>Must be unique for this template.|
|isLatest|boolean|false|read-only|Whether this is the latest version of the template.|
|enabled|boolean|false|read-only|Whether this version is offered when creating providers. If false, the<br>template version is hidden from the provider creation UI and API.|
|openapi|string|false|none|OpenAPI specification content (JSON or YAML) for the provider, when<br>uploaded/pasted. Use metadata.openapiSpecUrl instead to reference the<br>spec by URL.|
|metadata|[LLMProviderTemplateMetadata](#schemallmprovidertemplatemetadata)|false|none|none|
|promptTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|completionTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|totalTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|remainingTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|requestModel|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|responseModel|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|resourceMappings|[LLMProviderTemplateResourceMappings](#schemallmprovidertemplateresourcemappings)|false|none|none|
|createdAt|string(date-time)|false|read-only|Timestamp when the resource was created|
|updatedAt|string(date-time)|false|read-only|Timestamp when the resource was last updated|

## CreateLLMProviderTemplateVersionRequest

<a id="schemacreatellmprovidertemplateversionrequest"></a>
<a id="schema_CreateLLMProviderTemplateVersionRequest"></a>
<a id="tocScreatellmprovidertemplateversionrequest"></a>
<a id="tocscreatellmprovidertemplateversionrequest"></a>

```json
{
  "displayName": "OpenAI",
  "version": "v2.0",
  "managedBy": "organization",
  "description": "Default OpenAI template",
  "openapi": "string",
  "metadata": {
    "endpointUrl": "https://api.openai.com",
    "auth": {
      "type": "bearer",
      "header": "Authorization",
      "valuePrefix": "Bearer "
    },
    "logoUrl": "https://cdn.example.com/logos/openai.svg",
    "openapiSpecUrl": "https://api.openai.com/openapi.json"
  },
  "promptTokens": {
    "location": "payload",
    "identifier": "$.usage.inputTokens"
  },
  "completionTokens": {
    "location": "payload",
    "identifier": "$.usage.outputTokens"
  },
  "totalTokens": {
    "location": "payload",
    "identifier": "$.usage.totalTokens"
  },
  "remainingTokens": {
    "location": "header",
    "identifier": "x-ratelimit-remaining-tokens"
  },
  "requestModel": {
    "location": "payload",
    "identifier": "$.model"
  },
  "responseModel": {
    "location": "payload",
    "identifier": "$.model"
  },
  "resourceMappings": {
    "resources": [
      {
        "resource": "/responses",
        "promptTokens": {
          "location": "payload",
          "identifier": "$.usage.inputTokens"
        },
        "completionTokens": {
          "location": "payload",
          "identifier": "$.usage.outputTokens"
        },
        "totalTokens": {
          "location": "payload",
          "identifier": "$.usage.totalTokens"
        },
        "remainingTokens": {
          "location": "header",
          "identifier": "x-ratelimit-remaining-tokens"
        },
        "requestModel": {
          "location": "payload",
          "identifier": "$.model"
        },
        "responseModel": {
          "location": "payload",
          "identifier": "$.model"
        }
      }
    ]
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|displayName|string|false|none|Human-readable LLM Template name. Optional — when omitted, the new<br>version inherits the family's existing name. Supplying a different<br>value renames the template family.|
|version|string|true|none|New version identifier, e.g. v2.0. Must be unique for this template.|
|managedBy|string|false|none|Identifies who manages the template. Custom templates default to 'organization'.|
|description|string|false|none|Description of the LLM provider template|
|openapi|string|false|none|OpenAPI specification content (JSON or YAML) for the provider, when<br>uploaded/pasted. Use metadata.openapiSpecUrl instead to reference the<br>spec by URL.|
|metadata|[LLMProviderTemplateMetadata](#schemallmprovidertemplatemetadata)|false|none|none|
|promptTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|completionTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|totalTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|remainingTokens|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|requestModel|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|responseModel|[ExtractionIdentifier](#schemaextractionidentifier)|false|none|none|
|resourceMappings|[LLMProviderTemplateResourceMappings](#schemallmprovidertemplateresourcemappings)|false|none|none|

## LLMProviderTemplateListItem

<a id="schemallmprovidertemplatelistitem"></a>
<a id="schema_LLMProviderTemplateListItem"></a>
<a id="tocSllmprovidertemplatelistitem"></a>
<a id="tocsllmprovidertemplatelistitem"></a>

```json
{
  "id": "openai",
  "groupId": "openai",
  "displayName": "OpenAI",
  "managedBy": "wso2",
  "description": "Default OpenAI template",
  "createdBy": "john.doe",
  "version": "v1.0",
  "isLatest": true,
  "enabled": true,
  "logoUrl": "https://cdn.example.com/logos/openai.svg",
  "createdAt": "2025-11-25T10:30:00Z",
  "updatedAt": "2025-11-25T10:30:00Z",
  "readOnly": false
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique handle for this specific template version.|
|groupId|string|false|read-only|Stable identifier shared by every version of a template family<br>(defaults to the first version's handle). Read-only.|
|displayName|string|true|none|Human-readable name for the LLM provider template|
|managedBy|string|false|none|Who manages the template ('wso2' for built-in, otherwise custom-defined).|
|description|string|false|none|none|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|version|string|false|none|Content version, matching the v<major>.<minor> pattern (e.g. v1.0, v2.0).|
|isLatest|boolean|false|none|Whether this is the latest version of the template.|
|enabled|boolean|false|none|Whether this version is offered when creating providers.|
|logoUrl|string(uri)|false|none|URL of the provider logo|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|
|readOnly|boolean|false|none|True when the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane.|

## LLMProviderTemplateListResponse

<a id="schemallmprovidertemplatelistresponse"></a>
<a id="schema_LLMProviderTemplateListResponse"></a>
<a id="tocSllmprovidertemplatelistresponse"></a>
<a id="tocsllmprovidertemplatelistresponse"></a>

```json
{
  "count": 5,
  "list": [
    {
      "id": "openai",
      "groupId": "openai",
      "displayName": "OpenAI",
      "managedBy": "wso2",
      "description": "Default OpenAI template",
      "createdBy": "john.doe",
      "version": "v1.0",
      "isLatest": true,
      "enabled": true,
      "logoUrl": "https://cdn.example.com/logos/openai.svg",
      "createdAt": "2025-11-25T10:30:00Z",
      "updatedAt": "2025-11-25T10:30:00Z",
      "readOnly": false
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|none|
|list|[[LLMProviderTemplateListItem](#schemallmprovidertemplatelistitem)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## LLMAccessControl

<a id="schemallmaccesscontrol"></a>
<a id="schema_LLMAccessControl"></a>
<a id="tocSllmaccesscontrol"></a>
<a id="tocsllmaccesscontrol"></a>

```json
{
  "mode": "deny_all",
  "exceptions": [
    {
      "path": "/chat/completions",
      "methods": [
        "GET"
      ]
    }
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|mode|string|true|none|Access control mode|
|exceptions|[[RouteException](#schemarouteexception)]|false|none|Path exceptions to the access control mode|

##### Enumerated Values

|Property|Value|
|---|---|
|mode|allow_all|
|mode|deny_all|

## RouteException

<a id="schemarouteexception"></a>
<a id="schema_RouteException"></a>
<a id="tocSrouteexception"></a>
<a id="tocsrouteexception"></a>

```json
{
  "path": "/chat/completions",
  "methods": [
    "GET"
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|path|string|true|none|Path pattern|
|methods|[string]|true|none|HTTP methods|

## LLMPolicy

<a id="schemallmpolicy"></a>
<a id="schema_LLMPolicy"></a>
<a id="tocSllmpolicy"></a>
<a id="tocsllmpolicy"></a>

```json
{
  "name": "budgetControl",
  "version": "v1",
  "paths": [
    {
      "path": "/chat/completions",
      "methods": [
        "GET"
      ],
      "params": {}
    }
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|version|string|true|none|Version of the policy. Only major-only version is allowed (e.g., v0, v1). Full semantic version (e.g., v1.0.0) is not accepted and will be rejected.|
|paths|[[LLMPolicyPath](#schemallmpolicypath)]|true|none|none|

## LLMPolicyPath

<a id="schemallmpolicypath"></a>
<a id="schema_LLMPolicyPath"></a>
<a id="tocSllmpolicypath"></a>
<a id="tocsllmpolicypath"></a>

```json
{
  "path": "/chat/completions",
  "methods": [
    "GET"
  ],
  "params": {}
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|path|string|true|none|none|
|methods|[string]|true|none|none|
|params|object|true|none|JSON Schema describing the parameters accepted by this policy. This itself is a JSON Schema document.|

## OperationPolicy

<a id="schemaoperationpolicy"></a>
<a id="schema_OperationPolicy"></a>
<a id="tocSoperationpolicy"></a>
<a id="tocsoperationpolicy"></a>

```json
{
  "name": "token-based-ratelimit",
  "version": "v1",
  "executionCondition": "string",
  "paths": [
    {
      "path": "/chat/completions",
      "methods": [
        "GET"
      ],
      "params": {}
    }
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|version|string|true|none|Version of the policy. Only major-only version is allowed (e.g., v0, v1). Full semantic version (e.g., v1.0.0) is not accepted and will be rejected.|
|executionCondition|string|false|none|Optional per-request CEL expression controlling whether the policy runs|
|paths|[[OperationPolicyPath](#schemaoperationpolicypath)]|true|none|none|

## OperationPolicyPath

<a id="schemaoperationpolicypath"></a>
<a id="schema_OperationPolicyPath"></a>
<a id="tocSoperationpolicypath"></a>
<a id="tocsoperationpolicypath"></a>

```json
{
  "path": "/chat/completions",
  "methods": [
    "GET"
  ],
  "params": {}
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|path|string|true|none|none|
|methods|[string]|true|none|none|
|params|object|true|none|Policy parameters|

## LLMRateLimitingConfig

<a id="schemallmratelimitingconfig"></a>
<a id="schema_LLMRateLimitingConfig"></a>
<a id="tocSllmratelimitingconfig"></a>
<a id="tocsllmratelimitingconfig"></a>

```json
{
  "providerLevel": {
    "global": {
      "request": {
        "enabled": true,
        "count": 1500,
        "reset": {
          "duration": 2,
          "unit": "week"
        }
      },
      "token": {
        "enabled": true,
        "count": 1000000,
        "reset": {
          "duration": 1,
          "unit": "month"
        }
      }
    }
  },
  "consumerLevel": {
    "resourceWise": {
      "default": {
        "request": {
          "enabled": true,
          "count": 50,
          "reset": {
            "duration": 2,
            "unit": "week"
          }
        },
        "cost": {
          "enabled": true,
          "amount": 100,
          "reset": {
            "duration": 1,
            "unit": "month"
          }
        }
      },
      "resources": [
        {
          "resource": "/models",
          "limit": {
            "request": {
              "enabled": true,
              "count": 200,
              "reset": {
                "duration": 1,
                "unit": "week"
              }
            },
            "token": {
              "enabled": true,
              "count": 100000,
              "reset": {
                "duration": 1,
                "unit": "month"
              }
            }
          }
        },
        {
          "resource": "/chat/completions",
          "limit": {
            "request": {
              "enabled": true,
              "count": 25,
              "reset": {
                "duration": 1,
                "unit": "week"
              }
            },
            "cost": {
              "enabled": true,
              "amount": 10,
              "reset": {
                "duration": 1,
                "unit": "month"
              }
            }
          }
        }
      ]
    }
  }
}

```

Rate limiting configuration for an LLM provider at provider and consumer levels.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|providerLevel|[RateLimitingScopeConfig](#schemaratelimitingscopeconfig)|false|none|Rate limiting configuration for a scope (provider or consumer). Either global or resource-wise limits can be defined.|
|consumerLevel|[RateLimitingScopeConfig](#schemaratelimitingscopeconfig)|false|none|Rate limiting configuration for a scope (provider or consumer). Either global or resource-wise limits can be defined.|

## RateLimitingScopeConfig

<a id="schemaratelimitingscopeconfig"></a>
<a id="schema_RateLimitingScopeConfig"></a>
<a id="tocSratelimitingscopeconfig"></a>
<a id="tocsratelimitingscopeconfig"></a>

```json
{
  "global": {
    "request": {
      "enabled": true,
      "count": 1500,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    },
    "token": {
      "enabled": true,
      "count": 1000000,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    },
    "cost": {
      "enabled": true,
      "amount": 1000,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    }
  },
  "resourceWise": {
    "default": {
      "request": {
        "enabled": true,
        "count": 1500,
        "reset": {
          "duration": 2,
          "unit": "week"
        }
      },
      "token": {
        "enabled": true,
        "count": 1000000,
        "reset": {
          "duration": 2,
          "unit": "week"
        }
      },
      "cost": {
        "enabled": true,
        "amount": 1000,
        "reset": {
          "duration": 2,
          "unit": "week"
        }
      }
    },
    "resources": [
      {
        "resource": "/chat/completions",
        "limit": {
          "request": {
            "enabled": true,
            "count": 1500,
            "reset": {
              "duration": 2,
              "unit": "week"
            }
          },
          "token": {
            "enabled": true,
            "count": 1000000,
            "reset": {
              "duration": 2,
              "unit": "week"
            }
          },
          "cost": {
            "enabled": true,
            "amount": 1000,
            "reset": {
              "duration": 2,
              "unit": "week"
            }
          }
        }
      }
    ]
  }
}

```

Rate limiting configuration for a scope (provider or consumer). Either global or resource-wise limits can be defined.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|global|[RateLimitingLimitConfig](#schemaratelimitinglimitconfig)|false|none|Limit definition with independent request/token/cost dimensions. If all dimensions are disabled (or absent), rate limiting is off for that scope.|
|resourceWise|[ResourceWiseRateLimitingConfig](#schemaresourcewiseratelimitingconfig)|false|none|Resource-specific limits with a required default limit.|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|

## ResourceWiseRateLimitingConfig

<a id="schemaresourcewiseratelimitingconfig"></a>
<a id="schema_ResourceWiseRateLimitingConfig"></a>
<a id="tocSresourcewiseratelimitingconfig"></a>
<a id="tocsresourcewiseratelimitingconfig"></a>

```json
{
  "default": {
    "request": {
      "enabled": true,
      "count": 1500,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    },
    "token": {
      "enabled": true,
      "count": 1000000,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    },
    "cost": {
      "enabled": true,
      "amount": 1000,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    }
  },
  "resources": [
    {
      "resource": "/chat/completions",
      "limit": {
        "request": {
          "enabled": true,
          "count": 1500,
          "reset": {
            "duration": 2,
            "unit": "week"
          }
        },
        "token": {
          "enabled": true,
          "count": 1000000,
          "reset": {
            "duration": 2,
            "unit": "week"
          }
        },
        "cost": {
          "enabled": true,
          "amount": 1000,
          "reset": {
            "duration": 2,
            "unit": "week"
          }
        }
      }
    }
  ]
}

```

Resource-specific limits with a required default limit.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|default|[RateLimitingLimitConfig](#schemaratelimitinglimitconfig)|true|none|Limit definition with independent request/token/cost dimensions. If all dimensions are disabled (or absent), rate limiting is off for that scope.|
|resources|[[RateLimitingResourceLimit](#schemaratelimitingresourcelimit)]|true|none|Explicit resource limits that override the default limit.|

## RateLimitingResourceLimit

<a id="schemaratelimitingresourcelimit"></a>
<a id="schema_RateLimitingResourceLimit"></a>
<a id="tocSratelimitingresourcelimit"></a>
<a id="tocsratelimitingresourcelimit"></a>

```json
{
  "resource": "/chat/completions",
  "limit": {
    "request": {
      "enabled": true,
      "count": 1500,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    },
    "token": {
      "enabled": true,
      "count": 1000000,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    },
    "cost": {
      "enabled": true,
      "amount": 1000,
      "reset": {
        "duration": 2,
        "unit": "week"
      }
    }
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|resource|string|true|none|Explicit resource path to apply the limit to.|
|limit|[RateLimitingLimitConfig](#schemaratelimitinglimitconfig)|true|none|Limit definition with independent request/token/cost dimensions. If all dimensions are disabled (or absent), rate limiting is off for that scope.|

## RateLimitResetWindow

<a id="schemaratelimitresetwindow"></a>
<a id="schema_RateLimitResetWindow"></a>
<a id="tocSratelimitresetwindow"></a>
<a id="tocsratelimitresetwindow"></a>

```json
{
  "duration": 2,
  "unit": "week"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|duration|integer|true|none|Reset duration for the limit window.|
|unit|string|true|none|Reset time unit for the limit window.|

##### Enumerated Values

|Property|Value|
|---|---|
|unit|minute|
|unit|hour|
|unit|day|
|unit|week|
|unit|month|

## RequestRateLimitDimension

<a id="schemarequestratelimitdimension"></a>
<a id="schema_RequestRateLimitDimension"></a>
<a id="tocSrequestratelimitdimension"></a>
<a id="tocsrequestratelimitdimension"></a>

```json
{
  "enabled": true,
  "count": 1500,
  "reset": {
    "duration": 2,
    "unit": "week"
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|false|none|Enable request-count based limiting.|
|count|integer|false|none|Maximum number of requests in the reset window.|
|reset|[RateLimitResetWindow](#schemaratelimitresetwindow)|false|none|none|

## TokenRateLimitDimension

<a id="schematokenratelimitdimension"></a>
<a id="schema_TokenRateLimitDimension"></a>
<a id="tocStokenratelimitdimension"></a>
<a id="tocstokenratelimitdimension"></a>

```json
{
  "enabled": true,
  "count": 1000000,
  "reset": {
    "duration": 2,
    "unit": "week"
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|false|none|Enable token-count based limiting.|
|count|integer|false|none|Maximum number of tokens in the reset window.|
|reset|[RateLimitResetWindow](#schemaratelimitresetwindow)|false|none|none|

## CostRateLimitDimension

<a id="schemacostratelimitdimension"></a>
<a id="schema_CostRateLimitDimension"></a>
<a id="tocScostratelimitdimension"></a>
<a id="tocscostratelimitdimension"></a>

```json
{
  "enabled": true,
  "amount": 1000,
  "reset": {
    "duration": 2,
    "unit": "week"
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|false|none|Enable cost-based limiting.|
|amount|number(float)|false|none|Maximum cost in the reset window.|
|reset|[RateLimitResetWindow](#schemaratelimitresetwindow)|false|none|none|

## RateLimitingLimitConfig

<a id="schemaratelimitinglimitconfig"></a>
<a id="schema_RateLimitingLimitConfig"></a>
<a id="tocSratelimitinglimitconfig"></a>
<a id="tocsratelimitinglimitconfig"></a>

```json
{
  "request": {
    "enabled": true,
    "count": 1500,
    "reset": {
      "duration": 2,
      "unit": "week"
    }
  },
  "token": {
    "enabled": true,
    "count": 1000000,
    "reset": {
      "duration": 2,
      "unit": "week"
    }
  },
  "cost": {
    "enabled": true,
    "amount": 1000,
    "reset": {
      "duration": 2,
      "unit": "week"
    }
  }
}

```

Limit definition with independent request/token/cost dimensions. If all dimensions are disabled (or absent), rate limiting is off for that scope.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|request|[RequestRateLimitDimension](#schemarequestratelimitdimension)|false|none|none|
|token|[TokenRateLimitDimension](#schematokenratelimitdimension)|false|none|none|
|cost|[CostRateLimitDimension](#schemacostratelimitdimension)|false|none|none|

## LLMProvider

<a id="schemallmprovider"></a>
<a id="schema_LLMProvider"></a>
<a id="tocSllmprovider"></a>
<a id="tocsllmprovider"></a>

```json
{
  "id": "wso2-openai-provider",
  "displayName": "WSO2 OpenAI Provider",
  "description": "Primary OpenAI provider",
  "createdBy": "john.doe",
  "readOnly": false,
  "updatedBy": "john.doe",
  "version": "v1.0",
  "context": "/openai",
  "vhost": "api.openai.com",
  "template": "openai",
  "openapi": "openapi: 3.0.3\ninfo:\n  title: Provider API\n  version: v1.0\npaths: {}\n",
  "modelProviders": [
    {
      "id": "claude",
      "displayName": "Claude",
      "models": [
        {
          "id": "claude-3-5-sonnet",
          "displayName": "Claude 3.5 Sonnet",
          "description": "High-quality reasoning model"
        }
      ]
    }
  ],
  "upstream": {
    "main": {
      "url": "http://prod-backend:5000/api/v2",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key",
        "value": "my-api-key-value"
      }
    },
    "sandbox": {
      "url": "http://prod-backend:5000/api/v2",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key",
        "value": "my-api-key-value"
      }
    }
  },
  "accessControl": {
    "mode": "deny_all",
    "exceptions": [
      {
        "path": "/chat/completions",
        "methods": [
          "GET"
        ]
      }
    ]
  },
  "rateLimiting": {
    "providerLevel": {
      "global": {
        "request": {
          "enabled": true,
          "count": 1500,
          "reset": {
            "duration": 2,
            "unit": "week"
          }
        },
        "token": {
          "enabled": true,
          "count": 1000000,
          "reset": {
            "duration": 1,
            "unit": "month"
          }
        }
      }
    },
    "consumerLevel": {
      "resourceWise": {
        "default": {
          "request": {
            "enabled": true,
            "count": 50,
            "reset": {
              "duration": 2,
              "unit": "week"
            }
          },
          "cost": {
            "enabled": true,
            "amount": 100,
            "reset": {
              "duration": 1,
              "unit": "month"
            }
          }
        },
        "resources": [
          {
            "resource": "/models",
            "limit": {
              "request": {
                "enabled": true,
                "count": 200,
                "reset": {
                  "duration": 1,
                  "unit": "week"
                }
              },
              "token": {
                "enabled": true,
                "count": 100000,
                "reset": {
                  "duration": 1,
                  "unit": "month"
                }
              }
            }
          },
          {
            "resource": "/chat/completions",
            "limit": {
              "request": {
                "enabled": true,
                "count": 25,
                "reset": {
                  "duration": 1,
                  "unit": "week"
                }
              },
              "cost": {
                "enabled": true,
                "amount": 10,
                "reset": {
                  "duration": 1,
                  "unit": "month"
                }
              }
            }
          }
        ]
      }
    }
  },
  "globalPolicies": [
    {
      "executionCondition": "request.header.x-custom == 'enabled'",
      "name": "SET_HEADER",
      "params": {
        "key": "MyHeader",
        "value": "MyValue"
      },
      "version": "v1"
    }
  ],
  "operationPolicies": [
    {
      "name": "token-based-ratelimit",
      "version": "v1",
      "executionCondition": "string",
      "paths": [
        {
          "path": "/chat/completions",
          "methods": [
            "GET"
          ],
          "params": {}
        }
      ]
    }
  ],
  "policies": [
    {
      "name": "budgetControl",
      "version": "v1",
      "paths": [
        {
          "path": "/chat/completions",
          "methods": [
            "GET"
          ],
          "params": {}
        }
      ]
    }
  ],
  "security": {
    "enabled": true,
    "apiKey": {
      "enabled": true,
      "key": "X-API-Key",
      "valuePrefix": "Bearer",
      "in": "header"
    }
  },
  "associatedGateways": [
    {
      "id": "prod-eu",
      "configurations": {
        "host": "prod-eu.platform-gw.local"
      }
    },
    {
      "id": "prod-us",
      "configurations": {
        "host": "prod-us.platform-gw.local"
      }
    }
  ],
  "createdAt": "2023-10-12T10:30:00Z",
  "updatedAt": "2023-10-12T10:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique handle for the provider|
|displayName|string|true|none|Human-readable LLM Provider name|
|description|string|false|none|Description of the LLM provider|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|readOnly|boolean|false|read-only|True if the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane; false for control-plane created artifacts.|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /llm-providers/{id}), omitted from list responses.|
|version|string|true|none|Semantic version of the LLM Provider|
|context|string|false|none|Base path for all routes exposed by this provider. Must start with / and carry no trailing slash; the single exception is the root path "/", which is the default.|
|vhost|string|false|none|Virtual host name used for routing. Supports standard domain names, subdomains, or wildcard domains. Must follow RFC-compliant hostname rules. Wildcards are only allowed in the left-most label (e.g., *.example.com).|
|template|string|true|none|Template name to use for this LLM Provider|
|openapi|string|false|none|OpenAPI specification (JSON or YAML) for the provider endpoint|
|modelProviders|[[LLMModelProvider](#schemallmmodelprovider)]|false|none|List of model providers and their models supported by this provider. For non-aggregator templates, only a single model provider is allowed (aggregator templates: awsbedrock, azureaifoundry).|
|upstream|[Upstream](#schemaupstream)|true|none|Upstream backend configuration with main and sandbox endpoints|
|accessControl|[LLMAccessControl](#schemallmaccesscontrol)|true|none|none|
|rateLimiting|[LLMRateLimitingConfig](#schemallmratelimitingconfig)|false|none|Rate limiting configuration for an LLM provider at provider and consumer levels.|
|globalPolicies|[[Policy](#schemapolicy)]|false|none|Global (api-level) policies applied across ALL operations as one shared scope, evaluated before operation-level policies.|
|operationPolicies|[[OperationPolicy](#schemaoperationpolicy)]|false|none|Operation-level policies scoped to specific paths/methods, evaluated after global policies.|
|policies|[[LLMPolicy](#schemallmpolicy)]|false|none|DEPRECATED - use operationPolicies. Still honoured (treated identically to operationPolicies).|
|security|[SecurityConfig](#schemasecurityconfig)|false|none|Defines security mechanisms (API key, OAuth2) applicable to the API|
|associatedGateways|[[AssociatedGateway](#schemaassociatedgateway)]|false|none|Optional list of gateways this LLM provider can be deployed to, along with per-gateway configuration overrides. This field is optional; omitting it does not change existing behaviour.|
|createdAt|string(date-time)|false|read-only|Timestamp when the resource was created|
|updatedAt|string(date-time)|false|read-only|Timestamp when the resource was last updated|

## AssociatedGateway

<a id="schemaassociatedgateway"></a>
<a id="schema_AssociatedGateway"></a>
<a id="tocSassociatedgateway"></a>
<a id="tocsassociatedgateway"></a>

```json
{
  "id": "prod-eu",
  "configurations": {
    "someKey": "someValue"
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Handle of the gateway this artifact can be deployed to|
|configurations|object|false|none|Per-gateway configuration overrides for this artifact. This is a free-form object; the supported keys depend on the deployed artifact type.|

## LLMProviderListItem

<a id="schemallmproviderlistitem"></a>
<a id="schema_LLMProviderListItem"></a>
<a id="tocSllmproviderlistitem"></a>
<a id="tocsllmproviderlistitem"></a>

```json
{
  "id": "wso2-openai-provider",
  "displayName": "WSO2 OpenAI Provider",
  "description": "Primary OpenAI provider",
  "createdBy": "john.doe",
  "readOnly": false,
  "version": "v1.0",
  "template": "openai",
  "status": "deployed",
  "createdAt": "2025-11-25T10:30:00Z",
  "updatedAt": "2025-11-25T10:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|displayName|string|true|none|Human-readable name for the LLM provider|
|description|string|false|none|none|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|readOnly|boolean|false|none|True when the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane.|
|version|string|false|none|none|
|template|string|false|none|none|
|status|string|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

##### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|deployed|
|status|failed|

## LLMModelProvider

<a id="schemallmmodelprovider"></a>
<a id="schema_LLMModelProvider"></a>
<a id="tocSllmmodelprovider"></a>
<a id="tocsllmmodelprovider"></a>

```json
{
  "id": "claude",
  "displayName": "Claude",
  "models": [
    {
      "id": "claude-3-5-sonnet",
      "displayName": "Claude 3.5 Sonnet",
      "description": "High-quality reasoning model"
    }
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique model provider identifier|
|displayName|string|true|none|Human-readable model provider name|
|models|[[LLMModel](#schemallmmodel)]|false|none|Models under this model provider|

## LLMModel

<a id="schemallmmodel"></a>
<a id="schema_LLMModel"></a>
<a id="tocSllmmodel"></a>
<a id="tocsllmmodel"></a>

```json
{
  "id": "claude-3-5-sonnet",
  "displayName": "Claude 3.5 Sonnet",
  "description": "High-quality reasoning model"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique model identifier|
|displayName|string|true|none|Human-readable model name|
|description|string|false|none|Model description|

## LLMProviderListResponse

<a id="schemallmproviderlistresponse"></a>
<a id="schema_LLMProviderListResponse"></a>
<a id="tocSllmproviderlistresponse"></a>
<a id="tocsllmproviderlistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "wso2-openai-provider",
      "displayName": "WSO2 OpenAI Provider",
      "description": "Primary OpenAI provider",
      "createdBy": "john.doe",
      "readOnly": false,
      "version": "v1.0",
      "template": "openai",
      "status": "deployed",
      "createdAt": "2025-11-25T10:30:00Z",
      "updatedAt": "2025-11-25T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|none|
|list|[[LLMProviderListItem](#schemallmproviderlistitem)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## LLMProxy

<a id="schemallmproxy"></a>
<a id="schema_LLMProxy"></a>
<a id="tocSllmproxy"></a>
<a id="tocsllmproxy"></a>

```json
{
  "id": "wso2-con-assistant",
  "displayName": "WSO2 Con Assistant",
  "description": "Customer support assistant",
  "createdBy": "john.doe",
  "readOnly": false,
  "updatedBy": "john.doe",
  "version": "v1.0",
  "projectId": "default-project",
  "context": "/openai",
  "vhost": "api.openai.com",
  "provider": {
    "id": "wso2-openai-provider",
    "auth": {
      "type": "api-key",
      "header": "X-API-Key",
      "value": "my-api-key-value"
    }
  },
  "additionalProviders": [
    {
      "id": "anthropic-provider",
      "as": "anthropic-upstream",
      "transformer": {
        "type": "openai-to-anthropic",
        "version": "v1",
        "params": {}
      }
    }
  ],
  "openapi": "openapi: 3.0.3\ninfo:\n  title: Proxy API\n  version: v1.0\npaths: {}\n",
  "globalPolicies": [
    {
      "executionCondition": "request.header.x-custom == 'enabled'",
      "name": "SET_HEADER",
      "params": {
        "key": "MyHeader",
        "value": "MyValue"
      },
      "version": "v1"
    }
  ],
  "operationPolicies": [
    {
      "name": "token-based-ratelimit",
      "version": "v1",
      "executionCondition": "string",
      "paths": [
        {
          "path": "/chat/completions",
          "methods": [
            "GET"
          ],
          "params": {}
        }
      ]
    }
  ],
  "policies": [
    {
      "name": "budgetControl",
      "version": "v1",
      "paths": [
        {
          "path": "/chat/completions",
          "methods": [
            "GET"
          ],
          "params": {}
        }
      ]
    }
  ],
  "security": {
    "enabled": true,
    "apiKey": {
      "enabled": true,
      "key": "X-API-Key",
      "valuePrefix": "Bearer",
      "in": "header"
    }
  },
  "associatedGateways": [
    {
      "id": "prod-eu"
    },
    {
      "id": "prod-us"
    }
  ],
  "createdAt": "2023-10-12T10:30:00Z",
  "updatedAt": "2023-10-12T10:30:00Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique handle for the proxy|
|displayName|string|true|none|Human-readable LLM proxy name|
|description|string|false|none|Description of the LLM proxy|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|readOnly|boolean|false|read-only|True if the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane; false for control-plane created artifacts.|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /llm-proxies/{id}), omitted from list responses.|
|version|string|true|none|Semantic version of the LLM proxy|
|projectId|string|true|none|Handle (URL-friendly slug) of the project this proxy belongs to|
|context|string|false|none|Base path for all routes exposed by this proxy. Must start with / and carry no trailing slash; the single exception is the root path "/", which is the default.|
|vhost|string|false|none|Virtual host name used for routing. Supports standard domain names, subdomains, or wildcard domains. Must follow RFC-compliant hostname rules. Wildcards are only allowed in the left-most label (e.g., *.example.com).|
|provider|[LLMProxyProvider](#schemallmproxyprovider)|true|none|none|
|additionalProviders|[[LLMProxyAdditionalProvider](#schemallmproxyadditionalprovider)]|false|none|Optional list of additional LLM providers attached to this proxy as selectable upstreams. Policies route requests to any of these by setting the upstream name. The primary `provider` field above remains the default upstream and the FK target.|
|openapi|string|false|none|OpenAPI specification (JSON or YAML) for the proxy endpoint|
|globalPolicies|[[Policy](#schemapolicy)]|false|none|Global (api-level) policies applied across ALL operations as one shared scope, evaluated before operation-level policies.|
|operationPolicies|[[OperationPolicy](#schemaoperationpolicy)]|false|none|Operation-level policies scoped to specific paths/methods, evaluated after global policies.|
|policies|[[LLMPolicy](#schemallmpolicy)]|false|none|DEPRECATED - use operationPolicies. Still honoured (treated identically to operationPolicies).|
|security|[SecurityConfig](#schemasecurityconfig)|false|none|Defines security mechanisms (API key, OAuth2) applicable to the API|
|associatedGateways|[[AssociatedGateway](#schemaassociatedgateway)]|false|none|Optional list of gateways this LLM proxy can be deployed to, along with per-gateway configuration overrides. This field is optional; omitting it does not change existing behaviour.|
|createdAt|string(date-time)|false|read-only|Timestamp when the resource was created|
|updatedAt|string(date-time)|false|read-only|Timestamp when the resource was last updated|

## LLMProxyListItem

<a id="schemallmproxylistitem"></a>
<a id="schema_LLMProxyListItem"></a>
<a id="tocSllmproxylistitem"></a>
<a id="tocsllmproxylistitem"></a>

```json
{
  "id": "wso2-con-assistant",
  "displayName": "WSO2 Con Assistant",
  "description": "Customer support assistant",
  "createdBy": "john.doe",
  "context": "/wso2-con-assistant",
  "version": "v1.0",
  "projectId": "default-project",
  "provider": "wso2-openai-provider",
  "status": "deployed",
  "createdAt": "2025-11-25T10:30:00Z",
  "updatedAt": "2025-11-25T10:30:00Z",
  "readOnly": false
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|displayName|string|true|none|Human-readable name for the LLM proxy|
|description|string|false|none|none|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|context|string|false|none|Context path where the proxy is exposed|
|version|string|false|none|none|
|projectId|string|false|none|Handle (URL-friendly slug) of the project this proxy belongs to|
|provider|string|false|none|Unique id of a deployed llm provider|
|status|string|false|none|none|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|
|readOnly|boolean|false|none|True when the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane.|

##### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|deployed|
|status|failed|

## LLMProxyListResponse

<a id="schemallmproxylistresponse"></a>
<a id="schema_LLMProxyListResponse"></a>
<a id="tocSllmproxylistresponse"></a>
<a id="tocsllmproxylistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "wso2-con-assistant",
      "displayName": "WSO2 Con Assistant",
      "description": "Customer support assistant",
      "createdBy": "john.doe",
      "context": "/wso2-con-assistant",
      "version": "v1.0",
      "projectId": "default-project",
      "provider": "wso2-openai-provider",
      "status": "deployed",
      "createdAt": "2025-11-25T10:30:00Z",
      "updatedAt": "2025-11-25T10:30:00Z",
      "readOnly": false
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|none|
|list|[[LLMProxyListItem](#schemallmproxylistitem)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## LLMProxyProvider

<a id="schemallmproxyprovider"></a>
<a id="schema_LLMProxyProvider"></a>
<a id="tocSllmproxyprovider"></a>
<a id="tocsllmproxyprovider"></a>

```json
{
  "id": "wso2-openai-provider",
  "auth": {
    "type": "api-key",
    "header": "X-API-Key",
    "value": "my-api-key-value"
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Unique id of a deployed llm provider|
|auth|[UpstreamAuth](#schemaupstreamauth)|false|none|Authentication configuration for upstream endpoints|

## LLMProxyAdditionalProvider

<a id="schemallmproxyadditionalprovider"></a>
<a id="schema_LLMProxyAdditionalProvider"></a>
<a id="tocSllmproxyadditionalprovider"></a>
<a id="tocsllmproxyadditionalprovider"></a>

```json
{
  "id": "anthropic-provider",
  "as": "anthropic-upstream",
  "transformer": {
    "type": "openai-to-anthropic",
    "version": "v1",
    "params": {}
  }
}

```

Additional LLM provider attached to this proxy as a selectable upstream. Policies route to it by referring to the `as` name (defaults to `id`).

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Unique id of a deployed llm provider|
|as|string|false|none|Logical LLM Provider name used by policies to select this provider. Must be unique within the proxy. Defaults to `id` when omitted.|
|transformer|[LLMProxyTransformer](#schemallmproxytransformer)|false|none|Request/response translator applied when this provider is the selected upstream. The proxy injects the translator as a conditional policy whose execution condition matches this provider, so it runs only when the provider is selected. The provider's `as` name (defaults to `id`) is passed to the translator as its target upstream.|

## LLMProxyTransformer

<a id="schemallmproxytransformer"></a>
<a id="schema_LLMProxyTransformer"></a>
<a id="tocSllmproxytransformer"></a>
<a id="tocsllmproxytransformer"></a>

```json
{
  "type": "openai-to-anthropic",
  "version": "v1",
  "params": {}
}

```

Request/response translator applied when this provider is the selected upstream. The proxy injects the translator as a conditional policy whose execution condition matches this provider, so it runs only when the provider is selected. The provider's `as` name (defaults to `id`) is passed to the translator as its target upstream.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|Translator policy name (for example openai-to-anthropic).|
|version|string|true|none|Major-only translator policy version (for example v1). The Gateway Controller resolves it to the installed full version.|
|params|object|false|none|Translator-specific parameters (for example model, apiVersion).|

## CreateLLMProviderAPIKeyRequest

<a id="schemacreatellmproviderapikeyrequest"></a>
<a id="schema_CreateLLMProviderAPIKeyRequest"></a>
<a id="tocScreatellmproviderapikeyrequest"></a>
<a id="tocscreatellmproviderapikeyrequest"></a>

```json
{
  "id": "production-key",
  "displayName": "Production Key",
  "expiresAt": "2026-12-31T23:59:59Z",
  "issuer": "api-platform-devportal",
  "allowedTargets": "dev_gateway,test_gateway"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique identifier for the API key within the LLM provider. If not provided, generated from displayName.|
|displayName|string|true|none|Human-readable name for the API key|
|expiresAt|string(date-time)|false|none|Optional expiration time in ISO 8601 format|
|issuer|string¦null|false|none|Identifier of the API Portal that provisioned this API key. Null if not provided.|
|allowedTargets|string¦null|false|none|Comma-separated list of gateways this key is valid for.<br>Use 'ALL' to allow all targets (default).|

## CreateLLMProviderAPIKeyResponse

<a id="schemacreatellmproviderapikeyresponse"></a>
<a id="schema_CreateLLMProviderAPIKeyResponse"></a>
<a id="tocScreatellmproviderapikeyresponse"></a>
<a id="tocscreatellmproviderapikeyresponse"></a>

```json
{
  "status": "success",
  "message": "API key created and broadcasted to gateways successfully",
  "id": "production-key",
  "apiKey": "REDACTED_API_KEY"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|true|none|Status of the operation|
|message|string|true|none|Detailed message about the operation result|
|id|string|true|none|Unique identifier of the generated key|
|apiKey|string|true|none|The generated API key value — 64 hexadecimal characters, returned only in this creation response and never retrievable afterwards. The example value is a non-functional placeholder.|

## CreateLLMProxyAPIKeyRequest

<a id="schemacreatellmproxyapikeyrequest"></a>
<a id="schema_CreateLLMProxyAPIKeyRequest"></a>
<a id="tocScreatellmproxyapikeyrequest"></a>
<a id="tocscreatellmproxyapikeyrequest"></a>

```json
{
  "id": "production-key",
  "displayName": "Production Key",
  "expiresAt": "2026-12-31T23:59:59Z",
  "issuer": "api-platform-devportal",
  "allowedTargets": "dev_gateway,test_gateway"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique identifier for the API key within the LLM proxy. If not provided, generated from displayName.|
|displayName|string|true|none|Human-readable name for the API key|
|expiresAt|string(date-time)|false|none|Optional expiration time in ISO 8601 format|
|issuer|string¦null|false|none|Identifier of the API Portal that provisioned this API key. Null if not provided.|
|allowedTargets|string¦null|false|none|Comma-separated list of gateways this key is valid for.<br>Use 'ALL' to allow all targets (default).|

## CreateLLMProxyAPIKeyResponse

<a id="schemacreatellmproxyapikeyresponse"></a>
<a id="schema_CreateLLMProxyAPIKeyResponse"></a>
<a id="tocScreatellmproxyapikeyresponse"></a>
<a id="tocscreatellmproxyapikeyresponse"></a>

```json
{
  "status": "success",
  "message": "API key created and broadcasted to gateways successfully",
  "id": "production-key",
  "apiKey": "REDACTED_API_KEY"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|true|none|Status of the operation|
|message|string|true|none|Detailed message about the operation result|
|id|string|true|none|Unique identifier of the generated key|
|apiKey|string|true|none|The generated API key value — 64 hexadecimal characters, returned only in this creation response and never retrievable afterwards. The example value is a non-functional placeholder.|

## MCPProxy

<a id="schemamcpproxy"></a>
<a id="schema_MCPProxy"></a>
<a id="tocSmcpproxy"></a>
<a id="tocsmcpproxy"></a>

```json
{
  "id": "weather-mcp-proxy",
  "displayName": "Weather Server",
  "description": "An MCP server which provides weather information",
  "createdBy": "john.doe",
  "readOnly": false,
  "updatedBy": "john.doe",
  "version": "v1.0",
  "projectId": "default-project",
  "context": "/",
  "vhost": "mcp.gw.com",
  "upstream": {
    "main": {
      "url": "http://prod-backend:5000/api/v2",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key",
        "value": "my-api-key-value"
      }
    },
    "sandbox": {
      "url": "http://prod-backend:5000/api/v2",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key",
        "value": "my-api-key-value"
      }
    }
  },
  "mcpSpecVersions": [
    "2025-06-18"
  ],
  "upstreamMcpSpecVersions": [
    "2025-06-18"
  ],
  "policies": [
    {
      "executionCondition": "request.header.x-custom == 'enabled'",
      "name": "SET_HEADER",
      "params": {
        "key": "MyHeader",
        "value": "MyValue"
      },
      "version": "v1"
    }
  ],
  "kind": "Mcp",
  "capabilities": {
    "tools": [
      {}
    ],
    "resources": [
      {}
    ],
    "prompts": [
      {}
    ]
  },
  "associatedGateways": [
    {
      "id": "prod-eu"
    },
    {
      "id": "prod-us"
    }
  ],
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Unique handle for the proxy|
|displayName|string|true|none|Human-readable MCP proxy name|
|description|string|false|none|Description of the MCP proxy|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|readOnly|boolean|false|read-only|True if the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane; false for control-plane created artifacts.|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource. Only present in the detail response (GET /mcp-proxies/{id}), omitted from list responses.|
|version|string|true|none|Semantic version of the MCP proxy|
|projectId|string|false|none|Handle (URL-friendly slug) of the project this proxy belongs to|
|context|string|false|none|Base path for all routes exposed by this proxy. Must start with / and carry no trailing slash; the single exception is the root path "/", which is the default.|
|vhost|string|false|none|Virtual host name used for routing. Supports standard domain names, subdomains, or wildcard domains. Must follow RFC-compliant hostname rules. Wildcards are only allowed in the left-most label (e.g., *.example.com).|
|upstream|[Upstream](#schemaupstream)|true|none|Upstream backend configuration with main and sandbox endpoints|
|mcpSpecVersion|string|false|none|DEPRECATED - use `mcpSpecVersions`. Still honored when `mcpSpecVersions` is absent.|
|mcpSpecVersions|[string]|false|none|MCP specification versions this proxy serves.|
|upstreamMcpSpecVersions|[string]|false|none|MCP specification versions supported by the upstream server. Informational only; not used for routing.
|policies|[[Policy](#schemapolicy)]|false|none|List of policies to be applied|
|kind|string|false|none|Kind of the API based on its communication protocol or architectural style|
|capabilities|[MCPProxyCapabilities](#schemamcpproxycapabilities)|false|none|List of capabilities supported by this proxy. This will be stored as-is and can be used in the future if we need this for governance purposes|
|associatedGateways|[[AssociatedGateway](#schemaassociatedgateway)]|false|none|Optional list of gateways this MCP proxy can be deployed to, along with per-gateway configuration overrides. This field is optional; omitting it does not change existing behaviour.|
|createdAt|string(date-time)|false|read-only|Timestamp when the resource was created|
|updatedAt|string(date-time)|false|read-only|Timestamp when the resource was last updated|

##### Enumerated Values

|Property|Value|
|---|---|

## MCPProxyListItem

<a id="schemamcpproxylistitem"></a>
<a id="schema_MCPProxyListItem"></a>
<a id="tocSmcpproxylistitem"></a>
<a id="tocsmcpproxylistitem"></a>

```json
{
  "id": "weather-mcp-proxy",
  "displayName": "Weather Server",
  "description": "An MCP server which provides weather information",
  "createdBy": "john.doe",
  "context": "/weather-mcp-proxy",
  "version": "v1.0",
  "projectId": "default-project",
  "status": "deployed",
  "mcpSpecVersions": [
    "2025-11-25"
  ],
  "createdAt": "2025-11-25T10:30:00Z",
  "updatedAt": "2025-11-25T10:30:00Z",
  "readOnly": false
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|displayName|string|true|none|Human-readable name for the MCP proxy|
|description|string|false|none|none|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|context|string|false|none|Context path where the proxy is exposed|
|version|string|false|none|none|
|projectId|string|false|none|Handle (URL-friendly slug) of the project this proxy belongs to|
|status|string|false|none|none|
|mcpSpecVersion|string|false|none|DEPRECATED - use `mcpSpecVersions`.|
|mcpSpecVersions|[string]|false|none|MCP specification versions this proxy serves.|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|
|readOnly|boolean|false|none|True when the artifact originated from a data-plane gateway (origin gateway_api) and is read-only in the control plane.|

##### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|deployed|
|status|failed|

## MCPProxyListResponse

<a id="schemamcpproxylistresponse"></a>
<a id="schema_MCPProxyListResponse"></a>
<a id="tocSmcpproxylistresponse"></a>
<a id="tocsmcpproxylistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "weather-mcp-proxy",
      "displayName": "Weather Server",
      "description": "An MCP server which provides weather information",
      "createdBy": "john.doe",
      "context": "/weather-mcp-proxy",
      "version": "v1.0",
      "projectId": "default-project",
      "status": "deployed",
      "mcpSpecVersions": [
        "2025-11-25"
      ],
      "createdAt": "2025-11-25T10:30:00Z",
      "updatedAt": "2025-11-25T10:30:00Z",
      "readOnly": false
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|none|
|list|[[MCPProxyListItem](#schemamcpproxylistitem)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## MCPServerInfoFetchRequest

<a id="schemamcpserverinfofetchrequest"></a>
<a id="schema_MCPServerInfoFetchRequest"></a>
<a id="tocSmcpserverinfofetchrequest"></a>
<a id="tocsmcpserverinfofetchrequest"></a>

```json
{
  "url": "https://mcp.server.com/mcp",
  "proxyId": "my-mcp-proxy",
  "auth": {
    "type": "api-key",
    "header": "X-API-Key",
    "value": "my-api-key-value"
  }
}

```

Target MCP server to introspect, and the credentials to introspect it with. At least
one of `url`/`proxyId` must be provided

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|url|string(uri)|false|none|Endpoint URL of the MCP server to fetch information from. Required unless<br>`proxyId` is given. When sent together with `proxyId` it overrides that proxy's<br>stored upstream URL, while the proxy's stored credentials are still used — this<br>validates an unsaved endpoint edit without re-sending a write-only secret.|
|proxyId|string|false|none|MCP proxy handle (identifier) for refresh operations. The stored credentials of<br>this proxy are used for the fetch, and its stored upstream URL too unless `url`<br>overrides it. Required unless `url` is given.|
|auth|[UpstreamAuth](#schemaupstreamauth)|false|none|Authentication configuration for the fetch request. Allowed only when `proxyId`<br>is absent (initial creation flow); sending it with `proxyId` is rejected, as the<br>stored auth is used whenever a proxy is referenced.|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|

not

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|object|false|none|none|

## MCPServerInfoFetchResponse

<a id="schemamcpserverinfofetchresponse"></a>
<a id="schema_MCPServerInfoFetchResponse"></a>
<a id="tocSmcpserverinfofetchresponse"></a>
<a id="tocsmcpserverinfofetchresponse"></a>

```json
{
  "serverInfo": {},
  "tools": [
    {}
  ],
  "resources": [
    {}
  ],
  "prompts": [
    {}
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|serverInfo|object|false|none|none|
|tools|[object]|false|none|none|
|resources|[object]|false|none|none|
|prompts|[object]|false|none|none|

## MCPProxyCapabilities

<a id="schemamcpproxycapabilities"></a>
<a id="schema_MCPProxyCapabilities"></a>
<a id="tocSmcpproxycapabilities"></a>
<a id="tocsmcpproxycapabilities"></a>

```json
{
  "tools": [
    {}
  ],
  "resources": [
    {}
  ],
  "prompts": [
    {}
  ]
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|tools|[object]|false|none|List of tool capabilities supported by this proxy|
|resources|[object]|false|none|List of resource capabilities supported by this proxy|
|prompts|[object]|false|none|List of prompt capabilities supported by this proxy|

## SecretCreateRequest

<a id="schemasecretcreaterequest"></a>
<a id="schema_SecretCreateRequest"></a>
<a id="tocSsecretcreaterequest"></a>
<a id="tocssecretcreaterequest"></a>

```json
{
  "id": "wso2-openai-key",
  "displayName": "WSO2 OpenAI API Key",
  "description": "Primary API key for WSO2 OpenAI integration",
  "value": "sk-xxx",
  "type": "GENERIC"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Handle (slug) used in {% raw %}`{{ secret "id" }}`{% endraw %} placeholders. Immutable after creation.|
|displayName|string|true|none|Human-readable name for the secret|
|description|string|false|none|none|
|value|string|true|write-only|Plaintext secret value — encrypted at rest, never returned in any response|
|type|string|false|none|none|

##### Enumerated Values

|Property|Value|
|---|---|
|type|GENERIC|
|type|CERTIFICATE|

## SecretUpdateRequest

<a id="schemasecretupdaterequest"></a>
<a id="schema_SecretUpdateRequest"></a>
<a id="tocSsecretupdaterequest"></a>
<a id="tocssecretupdaterequest"></a>

```json
{
  "id": "wso2-openai-key",
  "displayName": "string",
  "description": "string",
  "value": "string"
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|Secret handle — if provided, must match the path parameter; returns 400 if they differ. The handle is immutable and cannot be changed via update.|
|displayName|string|true|none|Human-readable name for the secret|
|description|string|false|none|none|
|value|string|true|write-only|New plaintext secret value — re-encrypted at rest|

## SecretResponse

<a id="schemasecretresponse"></a>
<a id="schema_SecretResponse"></a>
<a id="tocSsecretresponse"></a>
<a id="tocssecretresponse"></a>

```json
{
  "id": "wso2-openai-key",
  "displayName": "WSO2 OpenAI API Key",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

Returned on create (201) and rotate (200). The plaintext value is never included.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|displayName|string|true|none|Human-readable name for the secret|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

## SecretSummary

<a id="schemasecretsummary"></a>
<a id="schema_SecretSummary"></a>
<a id="tocSsecretsummary"></a>
<a id="tocssecretsummary"></a>

```json
{
  "id": "wso2-openai-key",
  "displayName": "WSO2 OpenAI API Key",
  "description": "string",
  "type": "GENERIC",
  "provider": "IN_BUILT",
  "status": "ACTIVE",
  "hash": "hmac-sha256:b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576d4b3d4c57e3f428a",
  "createdBy": "john.doe",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

Secret metadata — never includes the plaintext value.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|displayName|string|true|none|Human-readable name for the secret|
|description|string|false|none|none|
|type|string|false|none|none|
|provider|string|false|none|none|
|status|string|false|none|none|
|hash|string|false|none|none|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|createdAt|string(date-time)|false|none|none|
|updatedAt|string(date-time)|false|none|none|

##### Enumerated Values

|Property|Value|
|---|---|
|type|GENERIC|
|type|CERTIFICATE|
|provider|IN_BUILT|
|status|ACTIVE|
|status|DEPRECATED|

## SecretListResponse

<a id="schemasecretlistresponse"></a>
<a id="schema_SecretListResponse"></a>
<a id="tocSsecretlistresponse"></a>
<a id="tocssecretlistresponse"></a>

```json
{
  "count": 0,
  "list": [
    {
      "id": "wso2-openai-key",
      "displayName": "WSO2 OpenAI API Key",
      "description": "string",
      "type": "GENERIC",
      "provider": "IN_BUILT",
      "status": "ACTIVE",
      "hash": "hmac-sha256:b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576d4b3d4c57e3f428a",
      "createdBy": "john.doe",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of secrets in current response|
|list|[[SecretSummary](#schemasecretsummary)]|true|none|[Secret metadata — never includes the plaintext value.]|
|pagination|[Pagination](#schemapagination)|true|none|none|

## GatewayTokenListResponse

<a id="schemagatewaytokenlistresponse"></a>
<a id="schema_GatewayTokenListResponse"></a>
<a id="tocSgatewaytokenlistresponse"></a>
<a id="tocsgatewaytokenlistresponse"></a>

```json
{
  "count": 0,
  "list": [
    {
      "id": "abc12345-f678-90de-f123-456789abcdef",
      "status": "active",
      "createdAt": "2025-10-14T10:30:00Z",
      "revokedAt": null
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of tokens in current response|
|list|[[TokenInfoResponse](#schematokeninforesponse)]|true|none|List of active tokens|
|pagination|[Pagination](#schemapagination)|true|none|none|

## CustomPolicyListResponse

<a id="schemacustompolicylistresponse"></a>
<a id="schema_CustomPolicyListResponse"></a>
<a id="tocScustompolicylistresponse"></a>
<a id="tocscustompolicylistresponse"></a>

```json
{
  "count": 0,
  "list": [
    {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "organizationUuid": "bc554ded-7e40-44a7-b397-48480793ad03",
      "name": "rate-limit-custom",
      "version": "1.0.0",
      "description": "Custom rate limiting policy",
      "policyDefinition": {},
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of custom policies in current response|
|list|[[CustomPolicyResponse](#schemacustompolicyresponse)]|true|none|List of custom policies|
|pagination|[Pagination](#schemapagination)|true|none|none|

## AgentProxy

<a id="schemaagentproxy"></a>
<a id="schema_AgentProxy"></a>
<a id="tocSagentproxy"></a>
<a id="tocsagentproxy"></a>

```json
{
  "kind": "AgentProxy",
  "id": "trip-planner",
  "displayName": "Trip Planning Agent",
  "description": "Plans multi-city trips end to end",
  "version": "v1.0",
  "projectId": "default",
  "context": "/default/trip-planner",
  "upstream": {
    "main": {
      "url": "https://agents.example.com/trip-planner",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key"
      }
    }
  },
  "protocol": "a2a",
  "a2a": {
    "protocolVersion": "1.0",
    "operationConfigs": {
      "transports": [
        {
          "protocolBinding": "JSONRPC",
          "pathPrefix": "/rpc"
        },
        {
          "protocolBinding": "HTTP+JSON",
          "pathPrefix": "/rest"
        }
      ],
      "policies": [
        {
          "name": "api-key-auth",
          "version": "v1",
          "params": {
            "key": "API-Key",
            "in": "header"
          }
        }
      ],
      "operations": [
        {
          "name": "SendStreamingMessage",
          "resilience": {
            "idleTimeout": "2m"
          }
        }
      ]
    },
    "agentCard": {
      "public": {
        "mode": "passthrough",
        "rewriteUrls": true
      },
      "protected": {
        "mode": "passthrough",
        "rewriteUrls": true
      }
    }
  },
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "readOnly": false,
  "createdAt": "2026-10-19T09:15:22Z",
  "updatedAt": "2026-10-19T09:15:22Z"
}

```

An Agent proxy, as a discriminated union over its protocol. `protocol` selects the
variant and its matching named configuration block, and is immutable after creation.
`a2a` is the only protocol registered today; a further protocol adds its own
complete variant and named configuration block rather than widening this one.

#### Properties

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[A2AAgentProxy](#schemaa2aagentproxy)|false|none|The complete Agent proxy variant for `protocol: a2a`. Shared Agent fields stay at the<br>top level; the A2A protocol version, operation configuration (including the<br>transports it is served on, under `a2a.operationConfigs.transports`) and Agent Cards<br>live inside `a2a`. Unknown properties are rejected.|

## A2AAgentProxy

<a id="schemaa2aagentproxy"></a>
<a id="schema_A2AAgentProxy"></a>
<a id="tocSa2aagentproxy"></a>
<a id="tocsa2aagentproxy"></a>

```json
{
  "kind": "AgentProxy",
  "id": "trip-planner",
  "displayName": "Trip Planning Agent",
  "description": "Plans multi-city trips end to end",
  "version": "v1.0",
  "projectId": "default",
  "context": "/default/trip-planner",
  "upstream": {
    "main": {
      "url": "https://agents.example.com/trip-planner",
      "auth": {
        "type": "api-key",
        "header": "X-API-Key"
      }
    }
  },
  "protocol": "a2a",
  "a2a": {
    "protocolVersion": "1.0",
    "operationConfigs": {
      "transports": [
        {
          "protocolBinding": "JSONRPC",
          "pathPrefix": "/rpc"
        },
        {
          "protocolBinding": "HTTP+JSON",
          "pathPrefix": "/rest"
        }
      ],
      "policies": [
        {
          "name": "api-key-auth",
          "version": "v1",
          "params": {
            "key": "API-Key",
            "in": "header"
          }
        }
      ],
      "operations": [
        {
          "name": "SendStreamingMessage",
          "resilience": {
            "idleTimeout": "2m"
          }
        }
      ]
    },
    "agentCard": {
      "public": {
        "mode": "passthrough",
        "rewriteUrls": true
      },
      "protected": {
        "mode": "passthrough",
        "rewriteUrls": true
      }
    }
  },
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "readOnly": false,
  "createdAt": "2026-10-19T09:15:22Z",
  "updatedAt": "2026-10-19T09:15:22Z"
}

```

The complete Agent proxy variant for `protocol: a2a`. Shared Agent fields stay at the
top level; the A2A protocol version, operation configuration (including the
transports it is served on, under `a2a.operationConfigs.transports`) and Agent Cards
live inside `a2a`. Unknown properties are rejected.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|kind|string|false|none|Control-plane resource kind. The gateway's own artifact kind stays `Agent` and is mapped at the deployment boundary.|
|id|string|false|none|Public handle, unique per organization. Optional on create — the server derives it<br>from `displayName` when omitted — and always present on responses. On update an<br>omitted `id` retains the path handle and is never regenerated; a conflicting one<br>is rejected. Supplying it explicitly as an empty string is not the same as<br>omitting it, and is rejected.|
|displayName|string|true|none|Human-readable Agent proxy name. Not required to be unique.|
|description|string|false|none|Free-text description of the Agent proxy.|
|version|string|true|none|User-facing resource version label. Free text, and unrelated to<br>`a2a.protocolVersion` — it is not part of the resource's identity, and uniqueness<br>is on the handle alone.|
|projectId|string|true|none|Handle (URL-friendly slug) of the project this Agent proxy belongs to.|
|context|string|false|none|Base path under which every route of this Agent proxy is served. Must start with / and carry no trailing slash; the single exception is the root path "/", which is the default.|
|vhost|string|false|none|Virtual host name used for routing. Supports standard domain names, subdomains, or wildcard domains. Must follow RFC-compliant hostname rules. Wildcards are only allowed in the left-most label (e.g., *.example.com).|
|upstream|[Upstream](#schemaupstream)|true|none|Upstream backend configuration with main and sandbox endpoints|
|resilience|[Resilience](#schemaresilience)|false|none|Agent-wide resilience defaults. Per-operation values under `a2a.operationConfigs.operations[].resilience` override these.|
|protocol|string|true|none|Communication protocol of this Agent proxy. Required, and immutable after creation.|
|a2a|[A2AProtocolConfig](#schemaa2aprotocolconfig)|true|none|A2A protocol configuration|
|associatedGateways|[[AssociatedGateway](#schemaassociatedgateway)]|false|none|Optional list of gateways this Agent proxy can be deployed to, along with per-gateway configuration overrides. On update, an omitted array empties the association set, subject to the existing deployment-integrity checks.|
|createdBy|string|false|read-only|User identifier of the user who created this resource|
|updatedBy|string|false|read-only|User identifier of the user who last updated this resource|
|readOnly|boolean|false|read-only|True if the Agent proxy originated from a data-plane gateway (origin gateway_api); only its description and gateway associations are editable in the control plane. False for control-plane created Agent proxies.|
|createdAt|string(date-time)|false|read-only|Timestamp when the resource was created|
|updatedAt|string(date-time)|false|read-only|Timestamp when the resource was last updated|

##### Enumerated Values

|Property|Value|
|---|---|
|kind|AgentProxy|
|protocol|a2a|

## A2AProtocolConfig

<a id="schemaa2aprotocolconfig"></a>
<a id="schema_A2AProtocolConfig"></a>
<a id="tocSa2aprotocolconfig"></a>
<a id="tocsa2aprotocolconfig"></a>

```json
{
  "protocolVersion": "1.0",
  "operationConfigs": {
    "transports": [
      {
        "protocolBinding": "JSONRPC",
        "pathPrefix": "/rpc"
      },
      {
        "protocolBinding": "HTTP+JSON",
        "pathPrefix": "/rest"
      }
    ],
    "policies": [
      {
        "name": "api-key-auth",
        "version": "v1",
        "params": {
          "key": "API-Key",
          "in": "header"
        }
      }
    ],
    "operations": [
      {
        "name": "SendStreamingMessage",
        "resilience": {
          "idleTimeout": "2m"
        }
      }
    ]
  },
  "agentCard": {
    "public": {
      "mode": "passthrough",
      "rewriteUrls": true
    },
    "protected": {
      "mode": "passthrough",
      "rewriteUrls": true
    }
  }
}

```

Typed A2A configuration, required when `protocol` is `a2a`. Unknown properties are
rejected; free-form Agent Card content and policy parameters keep their own extension
behaviour.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|protocolVersion|string|true|none|A2A wire protocol version. Only registered versions are accepted — an unregistered<br>value is rejected at authoring time because it could never deploy. This is not a<br>supported list filter.|
|operationConfigs|[A2AOperationConfigs](#schemaa2aoperationconfigs)|true|none|A2A operation configuration|
|agentCard|[AgentCardConfig](#schemaagentcardconfig)|false|none|A2A Agent Card configuration|

##### Enumerated Values

|Property|Value|
|---|---|
|protocolVersion|1.0|

## A2ATransport

<a id="schemaa2atransport"></a>
<a id="schema_A2ATransport"></a>
<a id="tocSa2atransport"></a>
<a id="tocsa2atransport"></a>

```json
{
  "protocolBinding": "JSONRPC",
  "pathPrefix": "/rpc"
}

```

A2A transport

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|protocolBinding|string|true|none|A2A protocol binding served on this transport.|
|pathPrefix|string|false|none|Path prefix relative to `context`. The default `/` inserts no extra segment.|

##### Enumerated Values

|Property|Value|
|---|---|
|protocolBinding|JSONRPC|
|protocolBinding|HTTP+JSON|

## A2AOperationConfigs

<a id="schemaa2aoperationconfigs"></a>
<a id="schema_A2AOperationConfigs"></a>
<a id="tocSa2aoperationconfigs"></a>
<a id="tocsa2aoperationconfigs"></a>

```json
{
  "transports": [
    {
      "protocolBinding": "JSONRPC",
      "pathPrefix": "/rpc"
    },
    {
      "protocolBinding": "HTTP+JSON",
      "pathPrefix": "/rest"
    }
  ],
  "policies": [
    {
      "name": "api-key-auth",
      "version": "v1",
      "params": {
        "key": "API-Key",
        "in": "header"
      }
    }
  ],
  "operations": [
    {
      "name": "SendStreamingMessage",
      "resilience": {
        "idleTimeout": "2m"
      }
    }
  ]
}

```

Transport exposure plus Agent-wide and per-operation A2A configuration, matching the
gateway's `spec.a2a.operationConfigs`. The block is required because it carries the
required `transports`; omitting `policies` or `operations` means no user-supplied
policies and no per-operation additions. None of this applies to public Agent Card
serving.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|transports|[[A2ATransport](#schemaa2atransport)]|true|none|Transports this Agent proxy is served on. `protocolBinding` must be unique across<br>the array; `uniqueItems` compares whole elements, so that uniqueness is enforced<br>in the service rather than by the schema.|
|policies|[[Policy](#schemapolicy)]|false|none|Policies applied to every A2A operation. This is the agent-wide policy position for A2A; there is no top-level `policies` array.|
|operations|[[A2AOperation](#schemaa2aoperation)]|false|none|Per-operation configuration. This is not an allowlist — unlisted operations still<br>receive the common `policies`. `name` must be unique across the array, which the<br>service enforces.|

## A2AOperation

<a id="schemaa2aoperation"></a>
<a id="schema_A2AOperation"></a>
<a id="tocSa2aoperation"></a>
<a id="tocsa2aoperation"></a>

```json
{
  "name": "SendMessage",
  "policies": [
    {
      "executionCondition": "request.header.x-custom == 'enabled'",
      "name": "SET_HEADER",
      "params": {
        "key": "MyHeader",
        "value": "MyValue"
      },
      "version": "v1"
    }
  ],
  "resilience": {
    "timeout": "30s",
    "idleTimeout": "5s"
  }
}

```

A2A per-operation configuration

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|One of the canonical A2A operations for the selected protocol version.|
|policies|[[Policy](#schemapolicy)]|false|none|Policies appended after the common `policies`, by plain concatenation with no de-duplication — a policy attached in both places runs twice.|
|resilience|[Resilience](#schemaresilience)|false|none|Per-operation resilience values, overriding the Agent-wide defaults.|

##### Enumerated Values

|Property|Value|
|---|---|
|name|SendMessage|
|name|SendStreamingMessage|
|name|GetTask|
|name|ListTasks|
|name|CancelTask|
|name|SubscribeToTask|
|name|CreateTaskPushNotificationConfig|
|name|GetTaskPushNotificationConfig|
|name|ListTaskPushNotificationConfigs|
|name|DeleteTaskPushNotificationConfig|
|name|GetExtendedAgentCard|

## Resilience

<a id="schemaresilience"></a>
<a id="schema_Resilience"></a>
<a id="tocSresilience"></a>
<a id="tocsresilience"></a>

```json
{
  "timeout": "30s",
  "idleTimeout": "5s"
}

```

Timeout settings applied to a request chain.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|timeout|string|false|none|Overall request timeout, as a duration such as `30s` or `1m`.|
|idleTimeout|string|false|none|Idle (no-data) timeout, as a duration such as `5s`.|

## AgentCardConfig

<a id="schemaagentcardconfig"></a>
<a id="schema_AgentCardConfig"></a>
<a id="tocSagentcardconfig"></a>
<a id="tocsagentcardconfig"></a>

```json
{
  "public": {
    "mode": "passthrough",
    "rewriteUrls": true
  },
  "protected": {
    "mode": "passthrough",
    "rewriteUrls": true
  }
}

```

A2A Agent Card serving configuration. Omitting this block, or omitting its `public`
block, means public passthrough at `/.well-known/agent-card.json` with
`rewriteUrls: true` and no card policies. Omitted blocks are preserved as omitted;
defaults never materialize an explicit stored configuration.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|public|[PublicAgentCard](#schemapublicagentcard)|false|none|Public Agent Card configuration|
|protected|[ProtectedAgentCard](#schemaprotectedagentcard)|false|none|Protected Agent Card configuration|

## PublicAgentCard

<a id="schemapublicagentcard"></a>
<a id="schema_PublicAgentCard"></a>
<a id="tocSpublicagentcard"></a>
<a id="tocspublicagentcard"></a>

```json
{
  "mode": "passthrough",
  "rewriteUrls": true
}

```

Managed and passthrough are disjoint branches. Managed requires `content` and forbids
`rewriteUrls`; passthrough forbids `content` and may omit `mode`. A card-serving
`signing` option is not accepted on either branch.

`properties` below describes the shape common to both branches and carries each
property in its loosest form; `oneOf` does all the discriminating. Keeping both is
what lets code generators emit a usable object type while the branches still enforce
the mode-specific rules. A property added to a branch must be added here too, or it
will validate correctly but be missing from generated clients.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|mode|string|false|none|none|
|path|[AgentCardPath](#schemaagentcardpath)|false|none|Agent Card discovery path|
|policies|[[Policy](#schemapolicy)]|false|none|none|
|rewriteUrls|boolean|false|none|none|
|content|[AgentCardDocument](#schemaagentcarddocument)|false|none|A2A Agent Card document|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[ManagedPublicAgentCard](#schemamanagedpublicagentcard)|false|none|The control plane stores the card and the gateway serves exactly those bytes.|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[PassthroughPublicAgentCard](#schemapassthroughpublicagentcard)|false|none|Nothing is stored; the gateway fetches the card from the upstream agent and optionally rewrites its URLs.|

##### Enumerated Values

|Property|Value|
|---|---|
|mode|managed|
|mode|passthrough|

## ManagedPublicAgentCard

<a id="schemamanagedpublicagentcard"></a>
<a id="schema_ManagedPublicAgentCard"></a>
<a id="tocSmanagedpublicagentcard"></a>
<a id="tocsmanagedpublicagentcard"></a>

```json
{
  "mode": "managed",
  "content": {
    "name": "Trip Planning Agent",
    "description": "Plans multi-city trips end to end",
    "version": "1.0.0",
    "supportedInterfaces": [
      {
        "protocolBinding": "JSONRPC",
        "protocolVersion": "1.0",
        "url": "https://agents.example.com/trip-planner/rpc"
      },
      {
        "protocolBinding": "HTTP+JSON",
        "protocolVersion": "1.0",
        "url": "https://agents.example.com/trip-planner/rest"
      }
    ],
    "capabilities": {
      "streaming": true
    },
    "defaultInputModes": [
      "text/plain"
    ],
    "defaultOutputModes": [
      "text/plain"
    ],
    "skills": [
      {
        "id": "plan_trip",
        "name": "Plan a trip",
        "description": "Plans an itinerary for a destination and day count",
        "tags": [
          "travel"
        ]
      }
    ]
  }
}

```

The control plane stores the card and the gateway serves exactly those bytes.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|mode|string|true|none|none|
|path|[AgentCardPath](#schemaagentcardpath)|false|none|Agent Card discovery path|
|policies|[[Policy](#schemapolicy)]|false|none|Policies applied to the public-card discovery route only. Auth policies here are rejected by the gateway; the card route runs no auth.|
|content|[AgentCardDocument](#schemaagentcarddocument)|true|none|A2A Agent Card document|

##### Enumerated Values

|Property|Value|
|---|---|
|mode|managed|

## PassthroughPublicAgentCard

<a id="schemapassthroughpublicagentcard"></a>
<a id="schema_PassthroughPublicAgentCard"></a>
<a id="tocSpassthroughpublicagentcard"></a>
<a id="tocspassthroughpublicagentcard"></a>

```json
{
  "mode": "passthrough",
  "rewriteUrls": true
}

```

Nothing is stored; the gateway fetches the card from the upstream agent and optionally rewrites its URLs.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|mode|string|false|none|none|
|path|[AgentCardPath](#schemaagentcardpath)|false|none|Agent Card discovery path|
|policies|[[Policy](#schemapolicy)]|false|none|Policies applied to the public-card discovery route only. Auth policies here are rejected by the gateway; the card route runs no auth.|
|rewriteUrls|boolean|false|none|Rewrite upstream-advertised URLs to the gateway's own. Passthrough only — rejected in managed mode.|

##### Enumerated Values

|Property|Value|
|---|---|
|mode|passthrough|

## ProtectedAgentCard

<a id="schemaprotectedagentcard"></a>
<a id="schema_ProtectedAgentCard"></a>
<a id="tocSprotectedagentcard"></a>
<a id="tocsprotectedagentcard"></a>

```json
{
  "mode": "passthrough",
  "rewriteUrls": true
}

```

The protected card is an A2A operation (`GetExtendedAgentCard`) rather than a
discovery route, so it carries no `path` and no `policies`. An explicit `mode` is
required whenever the block is present.

As with `PublicAgentCard`, `properties` describes the common shape in its loosest
form and `oneOf` does the discriminating.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|mode|string|false|none|none|
|rewriteUrls|boolean|false|none|none|
|content|[AgentCardDocument](#schemaagentcarddocument)|false|none|A2A Agent Card document|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[ManagedProtectedAgentCard](#schemamanagedprotectedagentcard)|false|none|Managed protected Agent Card|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[PassthroughProtectedAgentCard](#schemapassthroughprotectedagentcard)|false|none|Passthrough protected Agent Card|

##### Enumerated Values

|Property|Value|
|---|---|
|mode|managed|
|mode|passthrough|

## ManagedProtectedAgentCard

<a id="schemamanagedprotectedagentcard"></a>
<a id="schema_ManagedProtectedAgentCard"></a>
<a id="tocSmanagedprotectedagentcard"></a>
<a id="tocsmanagedprotectedagentcard"></a>

```json
{
  "mode": "managed",
  "content": {
    "name": "Trip Planning Agent",
    "description": "Plans multi-city trips end to end",
    "version": "1.0.0",
    "supportedInterfaces": [
      {
        "protocolBinding": "JSONRPC",
        "protocolVersion": "1.0",
        "url": "https://agents.example.com/trip-planner/rpc"
      },
      {
        "protocolBinding": "HTTP+JSON",
        "protocolVersion": "1.0",
        "url": "https://agents.example.com/trip-planner/rest"
      }
    ],
    "capabilities": {
      "streaming": true
    },
    "defaultInputModes": [
      "text/plain"
    ],
    "defaultOutputModes": [
      "text/plain"
    ],
    "skills": [
      {
        "id": "plan_trip",
        "name": "Plan a trip",
        "description": "Plans an itinerary for a destination and day count",
        "tags": [
          "travel"
        ]
      }
    ]
  }
}

```

Managed protected Agent Card

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|mode|string|true|none|none|
|content|[AgentCardDocument](#schemaagentcarddocument)|true|none|A2A Agent Card document|

##### Enumerated Values

|Property|Value|
|---|---|
|mode|managed|

## PassthroughProtectedAgentCard

<a id="schemapassthroughprotectedagentcard"></a>
<a id="schema_PassthroughProtectedAgentCard"></a>
<a id="tocSpassthroughprotectedagentcard"></a>
<a id="tocspassthroughprotectedagentcard"></a>

```json
{
  "mode": "passthrough",
  "rewriteUrls": true
}

```

Passthrough protected Agent Card

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|mode|string|true|none|none|
|rewriteUrls|boolean|false|none|Rewrite upstream-advertised URLs to the gateway's own. Independent of the public card's `rewriteUrls`.|

##### Enumerated Values

|Property|Value|
|---|---|
|mode|passthrough|

## AgentCardPath

<a id="schemaagentcardpath"></a>
<a id="schema_AgentCardPath"></a>
<a id="tocSagentcardpath"></a>
<a id="tocsagentcardpath"></a>

```json
"/.well-known/agent-card.json"

```

Path the public Agent Card is served on. A custom path replaces the default route
rather than aliasing it.

#### Properties

*string*

## AgentCardDocument

<a id="schemaagentcarddocument"></a>
<a id="schema_AgentCardDocument"></a>
<a id="tocSagentcarddocument"></a>
<a id="tocsagentcarddocument"></a>

```json
{
  "name": "Trip Planning Agent",
  "description": "Plans multi-city trips end to end",
  "version": "1.0.0",
  "supportedInterfaces": [
    {
      "protocolBinding": "JSONRPC",
      "protocolVersion": "1.0",
      "url": "https://agents.example.com/trip-planner/rpc"
    },
    {
      "protocolBinding": "HTTP+JSON",
      "protocolVersion": "1.0",
      "url": "https://agents.example.com/trip-planner/rest"
    }
  ],
  "capabilities": {
    "streaming": true
  },
  "defaultInputModes": [
    "text/plain"
  ],
  "defaultOutputModes": [
    "text/plain"
  ],
  "skills": [
    {
      "id": "plan_trip",
      "name": "Plan a trip",
      "description": "Plans an itinerary for a destination and day count",
      "tags": [
        "travel"
      ]
    }
  ]
}

```

A complete A2A Agent Card, carried as supplied. Managed content is stored and served
byte-for-byte and is never re-serialized or normalized, because re-serialization would
change the bytes a future signing implementation signs. Structure is the author's to
write: the gateway validates what it can contradict at deployment time, and the
encoded size limit (1 MiB) is enforced in the service, not by this schema.

Note that `securityRequirements` uses the A2A shape
`[{ "schemes": { "<name>": { "list": ["scope"] } } }]`, not the OpenAPI-style
`[{ "<name>": ["scope"] }]`.

#### Properties

*object*

## AgentProxyListItem

<a id="schemaagentproxylistitem"></a>
<a id="schema_AgentProxyListItem"></a>
<a id="tocSagentproxylistitem"></a>
<a id="tocsagentproxylistitem"></a>

```json
{
  "id": "weather-agent",
  "displayName": "Weather Agent",
  "description": "Provides forecasts and severe-weather alerts",
  "version": "v1.0",
  "projectId": "default-project",
  "protocol": "a2a",
  "context": "/weather",
  "vhost": "agents.gw.com",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "readOnly": false,
  "createdAt": "2026-01-31T10:30:00Z",
  "updatedAt": "2026-01-31T10:30:00Z"
}

```

Lightweight Agent proxy projection used in collection responses. Protocol
configuration, operation policies and Agent Card content are omitted — read the item
for those, since a managed card alone may be up to 1 MiB.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Public handle of the Agent proxy|
|displayName|string|true|none|none|
|description|string|false|none|none|
|version|string|true|none|none|
|projectId|string|true|none|Handle (URL-friendly slug) of the project this Agent proxy belongs to|
|protocol|string|true|none|none|
|context|string|false|none|none|
|vhost|string|false|none|none|
|createdBy|string|false|read-only|none|
|updatedBy|string|false|read-only|none|
|readOnly|boolean|false|read-only|True when the Agent proxy originated from a data-plane gateway (origin gateway_api); only its description and gateway associations are editable in the control plane.|
|createdAt|string(date-time)|false|read-only|none|
|updatedAt|string(date-time)|false|read-only|none|

##### Enumerated Values

|Property|Value|
|---|---|
|protocol|a2a|

## AgentProxyListResponse

<a id="schemaagentproxylistresponse"></a>
<a id="schema_AgentProxyListResponse"></a>
<a id="tocSagentproxylistresponse"></a>
<a id="tocsagentproxylistresponse"></a>

```json
{
  "count": 2,
  "list": [
    {
      "id": "weather-agent",
      "displayName": "Weather Agent",
      "description": "Provides forecasts and severe-weather alerts",
      "version": "v1.0",
      "projectId": "default-project",
      "protocol": "a2a",
      "context": "/weather",
      "vhost": "agents.gw.com",
      "createdBy": "john.doe",
      "updatedBy": "john.doe",
      "readOnly": false,
      "createdAt": "2026-01-31T10:30:00Z",
      "updatedAt": "2026-01-31T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

AgentProxyListResponse for paginated Agent proxy results

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|integer|true|none|Number of Agent proxies in current response|
|list|[[AgentProxyListItem](#schemaagentproxylistitem)]|true|none|none|
|pagination|[Pagination](#schemapagination)|true|none|none|

## AgentProxyAPIKeyListResponse

<a id="schemaagentproxyapikeylistresponse"></a>
<a id="schema_AgentProxyAPIKeyListResponse"></a>
<a id="tocSagentproxyapikeylistresponse"></a>
<a id="tocsagentproxyapikeylistresponse"></a>

```json
{
  "list": [
    {
      "id": "string",
      "displayName": "string",
      "maskedApiKey": "string",
      "status": "active",
      "createdAt": "2019-08-24T14:15:22Z",
      "createdBy": "john.doe",
      "updatedAt": "2019-08-24T14:15:22Z",
      "expiresAt": "2019-08-24T14:15:22Z",
      "issuer": "api-platform-devportal",
      "allowedTargets": "string"
    }
  ],
  "count": 0,
  "pagination": {
    "total": 10,
    "offset": 0,
    "limit": 10
  }
}

```

AgentProxyAPIKeyListResponse for paginated Agent proxy API-key results

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|list|[[APIKeyItem](#schemaapikeyitem)]|true|none|List of API keys. Key material is never included.|
|count|integer|true|none|Number of API keys in current response|
|pagination|[Pagination](#schemapagination)|true|none|none|

## FetchAgentCardRequest

<a id="schemafetchagentcardrequest"></a>
<a id="schema_FetchAgentCardRequest"></a>
<a id="tocSfetchagentcardrequest"></a>
<a id="tocsfetchagentcardrequest"></a>

```json
{
  "url": "https://agent.example.com"
}

```

Two mutually exclusive forms: a direct `url` with optional `auth`, or an
`agentProxyId` alone, which uses that Agent proxy's stored endpoint and stored
credentials. Supplying `url` or `auth` alongside `agentProxyId` is rejected, including
when their value is null — `required` is about key presence, so an explicitly null
`url` is still a supplied `url`.

`properties` describes the shape common to both forms; `oneOf` does the
discriminating. A property added to a branch must be added here too.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|url|string(uri)|false|none|Endpoint of the agent to fetch the Agent Card from.|
|auth|[UpstreamAuth](#schemaupstreamauth)|false|none|Authentication configuration for upstream endpoints|
|agentProxyId|string|false|none|Public handle of the Agent proxy whose stored endpoint and credentials should be used.|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[FetchAgentCardByURL](#schemafetchagentcardbyurl)|false|none|Fetch from a supplied endpoint, optionally with supplied credentials. Used to preview an endpoint that has not been saved yet.|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[FetchAgentCardByAgentProxy](#schemafetchagentcardbyagentproxy)|false|none|Fetch using a saved Agent proxy's stored endpoint and stored credentials. The stored credential handle is never echoed back.|

## FetchAgentCardByURL

<a id="schemafetchagentcardbyurl"></a>
<a id="schema_FetchAgentCardByURL"></a>
<a id="tocSfetchagentcardbyurl"></a>
<a id="tocsfetchagentcardbyurl"></a>

```json
{
  "url": "https://agent.example.com",
  "auth": {
    "type": "api-key",
    "header": "X-API-Key",
    "value": "my-api-key-value"
  }
}

```

Fetch from a supplied endpoint, optionally with supplied credentials. Used to preview an endpoint that has not been saved yet.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|url|string(uri)|true|none|Endpoint of the agent to fetch the Agent Card from.|
|auth|[UpstreamAuth](#schemaupstreamauth)|false|none|Credentials for this fetch only. Permitted solely with the direct-URL form; nothing is stored.|

## FetchAgentCardByAgentProxy

<a id="schemafetchagentcardbyagentproxy"></a>
<a id="schema_FetchAgentCardByAgentProxy"></a>
<a id="tocSfetchagentcardbyagentproxy"></a>
<a id="tocsfetchagentcardbyagentproxy"></a>

```json
{
  "agentProxyId": "weather-agent"
}

```

Fetch using a saved Agent proxy's stored endpoint and stored credentials. The stored credential handle is never echoed back.

#### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|agentProxyId|string|true|none|Public handle of the Agent proxy whose stored endpoint and credentials should be used.|
