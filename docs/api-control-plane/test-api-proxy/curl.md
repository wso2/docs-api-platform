---
title: "cURL"
description: "Copy a cURL command for a deployed API from the API Platform Console."
---

Testing is an essential part of API development. API Platform simplifies this process by generating cURL commands that you can use to invoke and test your APIs.

Follow these steps to generate a cURL command and test an API operation:

1. Sign in to the API Platform Console.
2. Select the project and API you want to test.
3. In the left navigation menu, click **Test**, then select **cURL view**.
4. Select the gateway.
5. In the **cURL builder**, select the HTTP method.
6. Open **Query parameters**, **Headers**, or **Body** and add what the operation needs.
7. Copy the command under **cURL command**.
8. Run the command in a terminal to invoke the API operation.

    ![cURL view with the gateway selected, the cURL builder, query parameters, and the generated command](/img/cloud/test-api-proxy/curl.png)