---
title: "Handle Rate Limiting Errors"
description: "Recognize HTTP 429 rate limiting responses from the WSO2 API Gateway and interpret the throttling error codes returned in the response body."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-developer-portal/rate-limiting/handle-rate-limiting-errors/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-developer-portal/rate-limiting/handle-rate-limiting-errors.md
tags:
  - api-manager
  - rate-limiting
  - developer-portal
  - troubleshooting
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "troubleshooting"
---

# Handle Rate Limiting Errors

When your application exceeds rate limits, the API Gateway returns HTTP 429 (Too Many Requests) responses.

## Recognizing Rate Limiting Responses

When a request is throttled, you receive an HTTP **429 Too Many Requests** status code with a response body containing details about why the request was blocked.

**Example throttled response:**

```json
{
    "code": "900800",
    "message": "Message throttled out",
    "description": "You have exceeded your quota"
}
```

## Rate Limiting Error Codes

The error code in the response indicates which specific limit was exceeded:

| Error Code | Error Message | Description |
|------------|---------------|-------------|
| `900800` | Message throttled out | The maximum number of requests that can be made to the API within a designated time period is reached and the API is throttled for the user. |
| `900801` | Hard limit exceeded | Hard throttle limit has been reached |
| `900802` | Resource level throttle out | Message is throttled out because resource level has exceeded |
| `900803` | Application level throttle out | Message is throttled out because application level is exceeded |
| `900804` | Subscription level throttled out | Message throttled out due to subscription level throttling limit reached. |
| `900805` | Message blocked | Accessing an API which is blocked on user, IP, application, or API Context. |
| `900806` | Custom policy throttled out | Message throttled out due to exceeding the limit configured through the custom throttling policy rules. |
| `900807` | Message throttled out | Messaged throttled out because of exceeding the burst control/rate limit (requests per second) in the subscription level policy. |

For complete information on all error codes, see [Error Handling](../../reference/troubleshooting/error-handling.md#api-handlers-error-codes).

## See Also

- Learn about rate limiting tiers: [Rate Limiting for App Developers](rate-limiting-for-app-developers.md)
- Reset user quotas in your application: [Reset Application Throttling Policies](resetting-application-throttling-policies.md)
- Manage your applications: [Manage Application Rate Limits](manage-application-rate-limits.md)
