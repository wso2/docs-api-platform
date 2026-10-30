---
title: "Test REST Endpoints via the OpenAPI Console"
description: "Test REST API proxy endpoints in WSO2 API Platform using the built-in OpenAPI Console with auto-generated test keys."
canonical_url: https://wso2.com/api-platform/docs/cloud/test-api-proxy/openapi-console/
md_url: https://wso2.com/api-platform/docs/cloud/test-api-proxy/openapi-console.md
tags:
  - cloud
  - testing
  - openapi
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-18
content_type: "how-to"
---

# Test REST Endpoints via the OpenAPI Console

API Platform offers an integrated OpenAPI Console to test REST endpoints for the API proxies you create and deploy. Since API Platform secures REST APIs with OAuth 2.0 authentication, the OpenAPI Console generates test keys to help you test your APIs.

Follow these steps to test a REST endpoint using the OpenAPI Console:

1. Go to the [API Platform Console](https://console.bijira.dev/) and log in.
2. Select the project and API which you want to test.
3. Click **Test** in the left navigation menu, then select **Console**. This will open the **OpenAPI Console** pane.
4. In the **OpenAPI Console** pane, select the desired environment from the drop-down menu.

    ![OpenAPI Console pane with environment selector and expandable REST API resources for testing](../../assets/img/test-api-proxy/openapi-console.png){.cInlineImage-full}

5. Expand the resource you want to test.
6. Click the **Try it out** button to enable testing.
7. Provide values for any parameters, if applicable.
8. Click **Execute**. The response will be displayed under the **Responses** section.

    ![OpenAPI Console showing HTTP response body and status code after executing a test request](../../assets/img/test-api-proxy/openapi-console-response.png){.cInlineImage-full}