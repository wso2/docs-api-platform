---
title: "Special cases for REST API requests"
description: "Learn how the Micro Integrator handles GET requests with a body and POST requests with an empty body or query parameters."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/rest_api_examples/special-cases/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/rest_api_examples/special-cases.md
tags:
  - api-manager
  - integrate
  - examples
  - rest_api_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

## GET request with a Message Body
Normally, a GET request does not contain a body, and the Micro Integrator will not consume the payload even if there is one. The payload will not go through the mediation or to the backend.

## Using POST with an Empty Body
Typically, POST request is used to send a message that has data enclosed as a payload. However, you can also use POST without a payload. WSO2 Micro Integrator considers such messages as normal messages and forwards them to the endpoint without any additional configurations.

## Using POST with Query Parameters
Sending a POST message with query parameters is an unusual scenario, but the Micro Integrator supports it with no additional configuration. The Micro Integrator forwards the message like any other POST message and includes the query parameters.