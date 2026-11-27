---
title: "Subscription Plans"
description: "List, create, upsert, get, and delete subscription plans via the API Portal REST API."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/rest-api/subscription-plans/
md_url: https://wso2.com/api-platform/docs/api-portal/next/rest-api/subscription-plans.md
tags:
  - cloud
  - api-portal
  - rest-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-16
content_type: "reference"
---

# Subscription Plans

A plan's limits are its **conditions**: request count, tool-call count, token count and custom conditions, each built-in one with 1 to 10 time windows. Send them in `conditions`:

```json
{
  "id": "gold",
  "displayName": "Gold",
  "description": "For production workloads",
  "conditions": [
    {"type": "request-count", "params": {"limits": [{"count": 100, "timeUnit": "MINUTE"}, {"count": 5000, "timeUnit": "DAY"}], "onExceed": "reject"}},
    {"type": "token-count", "params": {"limits": [{"count": 1000000, "timeUnit": "MONTH"}], "tokenType": "total"}},
    {"id": "region-limit", "type": "custom", "params": {"zone": "eu"}}
  ]
}
```

- Built-in conditions get their fixed `id` (`requests`, `tool-calls`, `tokens`); `timeAmount` defaults to `1`, `onExceed` to `reject` and `tokenType` to `total`.
- On update, `conditions` replaces all of the plan's conditions, `[]` removes them, and leaving it out keeps them.
- `limits` is deprecated but still works: sent alone, its `REQUEST_COUNT` limits replace only the request-count condition. Responses still carry `limits`, built from the request-count condition.
- An invalid condition is refused with `400` and the reason, for example `conditions[0].params.limits[0]: count must be at least 1`. See [SubscriptionPlanCondition](schemas.md#schemasubscriptionplancondition) for the rules.

## List subscription plans

<a id="opIdlistSubscriptionPlans"></a>

`GET /subscription-plans`

> Code samples

```shell

curl -X GET https://localhost:9543/api-portal/api/v0.9/subscription-plans \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Accept: application/json'

```

Lists subscription plans for an organization. When `name` is supplied, only the matching plan (if any) is returned. Plan names are unique within an organization.

### Authentication

<aside class="warning">
This operation requires a <strong>Bearer JWT</strong> access token in the <code>Authorization</code> header.

Required scopes (the token must carry at least one of): `dp:subscription_plan:read`, `dp:subscription_plan:manage`

</aside>

<h3 id="list-subscription-plans-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|name|query|string|false|Filter by exact plan name. Returns an array of zero or one items.|

> Example responses
>
> 200 Response

```json
{
  "list": [
    {
      "id": "string",
      "displayName": "string",
      "description": "string",
      "limits": [
        {
          "limitType": "REQUEST_COUNT",
          "limitCount": 10000,
          "timeUnit": "MONTH",
          "timeAmount": 1
        }
      ],
      "refId": "string",
      "orgId": "string",
      "createdBy": "alice@example.com",
      "createdAt": "2026-05-07T08:30:00Z",
      "updatedAt": "2026-05-07T08:30:00Z"
    }
  ],
  "count": 1,
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}
```

> Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.

```json
{
  "status": "error",
  "code": "MISSING_REQUIRED_PARAMETER",
  "message": "Missing required parameter."
}
```

```json
{
  "message": "Missing or invalid fields in the request payload"
}
```

> 500 Response

```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```

<h3 id="list-subscription-plans-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of subscription plan DTOs. Empty array when no plans match.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error.|[ErrorResponse](schemas.md#schemaerrorresponse)|

<h3 id="list-subscription-plans-responseschema">Response schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» list|[[SubscriptionPlanResponse](schemas.md#schemasubscriptionplanresponse)]|false|none|none|
|»» id|string|false|none|The plan's handle (unique per org). Not the internal database uuid.|
|»» displayName|string|false|none|none|
|»» description|string|false|none|none|
|»» conditions|[[SubscriptionPlanCondition](schemas.md#schemasubscriptionplancondition)]|false|none|The plan's conditions. Empty when the plan is unlimited.|
|»» limits|[object]|false|none|The windows of the plan's request-count condition as REQUEST_COUNT limits, kept for older clients.|
|»»» limitType|string|false|none|none|
|»»» limitCount|any|false|none|Returned as a string when the stored count exceeds the safe integer range, otherwise a number. Unlimited plans have no limit entries — the `limits` array is empty.|

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|integer|false|none|none|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»»» *anonymous*|string|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» timeUnit|string¦null|false|none|none|
|»»» timeAmount|integer|false|none|none|
|»» refId|string¦null|false|none|Platform API subscription plan UUID associated with this plan.|
|»» orgId|string|false|none|none|
|»» createdBy|string|false|none|Identity of the user who created this subscription plan, or `deleted_user` if that user's IDP reference no longer exists. Present on single-resource GET responses and list items.|
|»» updatedBy|string|false|none|Identity of the user who last updated this subscription plan, or `deleted_user` if that user's IDP reference no longer exists. Present on single-resource GET responses only, omitted on list items.|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|
|» count|integer|false|none|Number of items returned in this page.|
|» pagination|[Pagination](schemas.md#schemapagination)|false|none|Standard pagination metadata returned with collection responses.|
|»» total|integer|true|none|Total number of records matching the query.|
|»» limit|integer|true|none|Maximum number of records returned in this response.|
|»» offset|integer|true|none|Number of records skipped before this page.|

#### Enumerated Values

|Property|Value|
|---|---|
|limitType|REQUEST_COUNT|
|limitType|EVENT_COUNT|
|limitType|BANDWIDTH|
|limitType|TOTAL_TOKEN_COUNT|
|timeUnit|MINUTE|
|timeUnit|HOUR|
|timeUnit|DAY|
|timeUnit|MONTH|
|timeUnit|null|

#### Enumerated Values

|Property|Value|
|---|---|
|status|error|

## Create subscription plans

<a id="opIdaddSubscriptionPlans"></a>

`POST /subscription-plans`

> Code samples

```shell

curl -X POST https://localhost:9543/api-portal/api/v0.9/subscription-plans \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d @payload.json

```

Creates one subscription plan when the request body is an object, or multiple subscription plans when the body is an array. Bulk creation returns a message instead of creating plans when `generateDefaultSubPlans` is enabled.

> Payload

```json
{
  "id": "Gold",
  "refId": "string",
  "displayName": "string",
  "description": "string",
  "limits": [
    {
      "limitType": "REQUEST_COUNT",
      "limitCount": 10000,
      "timeUnit": "MINUTE",
      "timeAmount": 1
    }
  ]
}
```

```yaml
id: Gold
refId: string
displayName: string
description: string
limits:
  - limitType: REQUEST_COUNT
    limitCount: 10000
    timeUnit: MINUTE
    timeAmount: 1

```

### Authentication

<aside class="warning">
This operation requires a <strong>Bearer JWT</strong> access token in the <code>Authorization</code> header.

Required scopes (the token must carry at least one of): `dp:subscription_plan:create`, `dp:subscription_plan:manage`

</aside>

<h3 id="create-subscription-plans-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|any|true|Subscription plan payload. Send a single object for single create/upsert, or a non-empty array for bulk create/upsert; each object carries its rules in `conditions` (the deprecated `limits` sets only the request-count condition). Alternatively, upload a YAML file in the `subscriptionPlan` multipart field; use `kind: SubscriptionPlan` for a single plan or `kind: SubscriptionPlanList` with an `items` array for bulk operations. YAML uploads may also use the `type: requestcount` shorthand, which is converted into a per-minute request-count condition; `type: eventcount` has no condition and is not read.|

> Example responses
>
> 200 Response

```json
{
  "message": "string"
}
```

> Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.

```json
{
  "status": "error",
  "code": "MISSING_REQUIRED_PARAMETER",
  "message": "Missing required parameter."
}
```

```json
{
  "message": "Missing or invalid fields in the request payload"
}
```

> 409 Response

```json
{
  "status": "error",
  "code": "CONFLICT",
  "message": "Conflict"
}
```

> 500 Response

```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```

<h3 id="create-subscription-plans-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|JSON message response.|[MessageResponse](schemas.md#schemamessageresponse)|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Subscription plan create/update response for single or bulk operations.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|The request conflicts with an existing resource.|[ErrorResponse](schemas.md#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error.|[ErrorResponse](schemas.md#schemaerrorresponse)|

<h3 id="create-subscription-plans-responseschema">Response schema</h3>

#### Enumerated Values

|Property|Value|
|---|---|
|limitType|REQUEST_COUNT|
|limitType|EVENT_COUNT|
|limitType|BANDWIDTH|
|limitType|TOTAL_TOKEN_COUNT|
|timeUnit|MINUTE|
|timeUnit|HOUR|
|timeUnit|DAY|
|timeUnit|MONTH|
|timeUnit|null|

#### Enumerated Values

|Property|Value|
|---|---|
|status|error|

## Upsert subscription plans

<a id="opIdputSubscriptionPlans"></a>

`PUT /subscription-plans`

> Code samples

```shell

curl -X PUT https://localhost:9543/api-portal/api/v0.9/subscription-plans \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d @payload.json

```

Upserts one subscription plan when the request body is an object, or multiple plans when the body is an array. A single plan update returns `200` when an existing plan is updated and `201` when a new plan is created. Bulk updates return a message when `generateDefaultSubPlans` is enabled.

> Payload

```json
{
  "id": "Gold",
  "refId": "string",
  "displayName": "string",
  "description": "string",
  "limits": [
    {
      "limitType": "REQUEST_COUNT",
      "limitCount": 10000,
      "timeUnit": "MINUTE",
      "timeAmount": 1
    }
  ]
}
```

```yaml
id: Gold
refId: string
displayName: string
description: string
limits:
  - limitType: REQUEST_COUNT
    limitCount: 10000
    timeUnit: MINUTE
    timeAmount: 1

```

### Authentication

<aside class="warning">
This operation requires a <strong>Bearer JWT</strong> access token in the <code>Authorization</code> header.

Required scopes (the token must carry at least one of): `dp:subscription_plan:update`, `dp:subscription_plan:manage`

</aside>

<h3 id="upsert-subscription-plans-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|any|true|Subscription plan payload. Send a single object for single create/upsert, or a non-empty array for bulk create/upsert; each object carries its rules in `conditions` (the deprecated `limits` sets only the request-count condition). Alternatively, upload a YAML file in the `subscriptionPlan` multipart field; use `kind: SubscriptionPlan` for a single plan or `kind: SubscriptionPlanList` with an `items` array for bulk operations. YAML uploads may also use the `type: requestcount` shorthand, which is converted into a per-minute request-count condition; `type: eventcount` has no condition and is not read.|

> Example responses
>
> 200 Response

```json
{
  "id": "string",
  "displayName": "string",
  "description": "string",
  "limits": [
    {
      "limitType": "REQUEST_COUNT",
      "limitCount": 10000,
      "timeUnit": "MINUTE",
      "timeAmount": 1
    }
  ],
  "refId": "string",
  "orgId": "string",
  "createdBy": "alice@example.com",
  "updatedBy": "alice@example.com",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

> Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.

```json
{
  "status": "error",
  "code": "MISSING_REQUIRED_PARAMETER",
  "message": "Missing required parameter."
}
```

```json
{
  "message": "Missing or invalid fields in the request payload"
}
```

> 404 Response

```json
{
  "status": "error",
  "code": "ORG_NOT_FOUND",
  "message": "Organization not found."
}
```

> 409 Response

```json
{
  "status": "error",
  "code": "CONFLICT",
  "message": "Conflict"
}
```

> 500 Response

```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```

<h3 id="upsert-subscription-plans-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription plan update response. Bulk updates may return a list, and some configurations return a message.|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Subscription plan create/update response for single or bulk operations.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Resource not found.|[ErrorResponse](schemas.md#schemaerrorresponse)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|The request conflicts with an existing resource.|[ErrorResponse](schemas.md#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error.|[ErrorResponse](schemas.md#schemaerrorresponse)|

<h3 id="upsert-subscription-plans-responseschema">Response schema</h3>

#### Enumerated Values

|Property|Value|
|---|---|
|limitType|REQUEST_COUNT|
|limitType|EVENT_COUNT|
|limitType|BANDWIDTH|
|limitType|TOTAL_TOKEN_COUNT|
|timeUnit|MINUTE|
|timeUnit|HOUR|
|timeUnit|DAY|
|timeUnit|MONTH|
|timeUnit|null|

#### Enumerated Values

|Property|Value|
|---|---|
|limitType|REQUEST_COUNT|
|limitType|EVENT_COUNT|
|limitType|BANDWIDTH|
|limitType|TOTAL_TOKEN_COUNT|
|timeUnit|MINUTE|
|timeUnit|HOUR|
|timeUnit|DAY|
|timeUnit|MONTH|
|timeUnit|null|

#### Enumerated Values

|Property|Value|
|---|---|
|status|error|

## Get a subscription plan

<a id="opIdgetSubscriptionPlan"></a>

`GET /subscription-plans/{planId}`

> Code samples

```shell

curl -X GET https://localhost:9543/api-portal/api/v0.9/subscription-plans/{planId} \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Accept: application/json'

```

Retrieves a single subscription plan by `planId`.

### Authentication

<aside class="warning">
This operation requires a <strong>Bearer JWT</strong> access token in the <code>Authorization</code> header.

Required scopes (the token must carry at least one of): `dp:subscription_plan:read`, `dp:subscription_plan:manage`

</aside>

<h3 id="get-a-subscription-plan-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|planId|path|string|true|The subscription plan's handle (unique per org).|

> Example responses
>
> 200 Response

```json
{
  "id": "string",
  "displayName": "string",
  "description": "string",
  "limits": [
    {
      "limitType": "REQUEST_COUNT",
      "limitCount": 10000,
      "timeUnit": "MINUTE",
      "timeAmount": 1
    }
  ],
  "refId": "string",
  "orgId": "string",
  "createdBy": "alice@example.com",
  "updatedBy": "alice@example.com",
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}
```

> Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.

```json
{
  "status": "error",
  "code": "MISSING_REQUIRED_PARAMETER",
  "message": "Missing required parameter."
}
```

```json
{
  "message": "Missing or invalid fields in the request payload"
}
```

> 404 Response

```json
{
  "status": "error",
  "code": "ORG_NOT_FOUND",
  "message": "Organization not found."
}
```

> 500 Response

```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```

<h3 id="get-a-subscription-plan-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription plan DTO.|[SubscriptionPlanResponse](schemas.md#schemasubscriptionplanresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Resource not found.|[ErrorResponse](schemas.md#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error.|[ErrorResponse](schemas.md#schemaerrorresponse)|

<h3 id="get-a-subscription-plan-responseschema">Response schema</h3>

#### Enumerated Values

|Property|Value|
|---|---|
|status|error|

## Delete a subscription plan

<a id="opIddeleteSubscriptionPlan"></a>

`DELETE /subscription-plans/{planId}`

> Code samples

```shell

curl -X DELETE https://localhost:9543/api-portal/api/v0.9/subscription-plans/{planId} \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Accept: application/json'

```

Deletes a subscription plan by `planId`.

### Authentication

<aside class="warning">
This operation requires a <strong>Bearer JWT</strong> access token in the <code>Authorization</code> header.

Required scopes (the token must carry at least one of): `dp:subscription_plan:delete`, `dp:subscription_plan:manage`

</aside>

<h3 id="delete-a-subscription-plan-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|planId|path|string|true|The subscription plan's handle (unique per org).|

> Example responses
>
> Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.

```json
{
  "status": "error",
  "code": "MISSING_REQUIRED_PARAMETER",
  "message": "Missing required parameter."
}
```

```json
{
  "message": "Missing or invalid fields in the request payload"
}
```

> 404 Response

```json
{
  "status": "error",
  "code": "ORG_NOT_FOUND",
  "message": "Organization not found."
}
```

> 500 Response

```json
{
  "status": "error",
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred."
}
```

<h3 id="delete-a-subscription-plan-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Subscription plan deleted successfully.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request. Validation and other bad-request errors are returned as a standard error object (field-level details, when present, are carried in its `errors` array); some legacy handlers return a message-only object.|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Resource not found.|[ErrorResponse](schemas.md#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error.|[ErrorResponse](schemas.md#schemaerrorresponse)|

<h3 id="delete-a-subscription-plan-responseschema">Response schema</h3>

#### Enumerated Values

|Property|Value|
|---|---|
|status|error|
