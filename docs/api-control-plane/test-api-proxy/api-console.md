---
title: "API Console"
description: "Test a deployed REST API from the Console view in the API Control Plane."
---

The integrated OpenAPI Console lets you test REST endpoints for API proxies after deploying them to a gateway.

Follow these steps to test a REST endpoint from the Console view.

1. Sign in to the API Control Plane.
2. Select the project and API proxy you want to test.
3. In the left navigation menu, click **Test**. **Console view** is selected.
4. Select the gateway.
5. Expand the operation you want to test.
6. Leave **Through proxy** selected to send the request through the gateway. Select **Direct** to call the backend endpoint directly.
7. Click **Execute**. The response appears in the console.

    ![API Console with the gateway selected, GET expanded, Through proxy selected, and the Execute button](/img/cloud/test-api-proxy/api-console.png)