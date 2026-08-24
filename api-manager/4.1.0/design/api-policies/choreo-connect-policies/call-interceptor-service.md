---
title: "Call interceptor service"
description: "Reference for the Call Interceptor Service policy attributes and supported payload values in Choreo Connect."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/design/api-policies/choreo-connect-policies/call-interceptor-service/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/design/api-policies/choreo-connect-policies/call-interceptor-service.md
tags:
  - api-manager
  - design
  - api-policies
  - choreo-connect-policies
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Call Interceptor Service

You can use interceptors in Choreo Connect to carry out transformations and mediation on the requests and responses. Learn more about [Message Transformation](../../../deploy-and-publish/deploy-on-gateway/choreo-connect/message-transformation/message-transformation-overview.md) in Choreo Connect.

[![Call Interceptor API](../../../assets/img/design/api-policies/call-interceptor.png){: style="width:50%"}](../../../assets/img/design/api-policies/call-interceptor.png)

!!! note
    You can also define call interceptor configurations in the Open API specification. If both the Open API specification and the "Call Interceptor Service" API Policy is attached, the "Call Interceptor Service" API Policy overrides the call interceptor configurations defined in the Open API specification.

The policy attribute “Includes to Payload” in the Call Interceptor Service supports the following values in the request flow.

- request_headers
- request_body
- request_trailers
- invocation_context

For more information, see [Request flow interceptor](../../../deploy-and-publish/deploy-on-gateway/choreo-connect/message-transformation/defining-interceptors-in-an-open-api-definition.md#request-flow-interceptor).

The following values are available in the response flow.

- request_headers
- request_body
- request_trailers
- response_headers
- response_body
- response_trailers
- invocation_context

For more information, see [Response flow interceptor](../../../deploy-and-publish/deploy-on-gateway/choreo-connect/message-transformation/defining-interceptors-in-an-open-api-definition.md#response-flow-interceptor).