---
title: "Secure endpoint with Basic Auth"
description: "Secure an API backend endpoint with basic authentication, supplying a username and password with each request to the endpoint."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/learn/design-api/endpoints/endpoint-security/basic-auth/
md_url: https://wso2.com/api-platform/docs/api-manager/3.2.0/learn/design-api/endpoints/endpoint-security/basic-auth.md
tags:
  - api-manager
  - learn
  - design-api
  - endpoints
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "how-to"
---

# Secure Endpoint with Basic Auth

A secured endpoint is when there are access-protected resources. You have to specify the username and the password when a request is sent to a secured endpoint. The endpoint authentication mechanism can either be Basic Authentication or Digest Authentication. They differ on how the credentials are communicated and how access is granted by the backend server.

Basic Authentication is the simplest mechanism used to enforce access controls to web resources. Here, the HTTP user agent provides the username and the password when making a request. The string containing the username and the password separated by a colon is Base64 encoded and sent in the authorization header when calling the backend when authentication is required.

!!! info
    If the user name and password is admin, the following header will be sent to the backend.
    ``` java
    Authorization: Basic YWRtaW46YWRtaW4=` (where `YWRtaW46YWRtaW4=` is equivalent to Base64Encoded{admin:admin} )
    ```

When you [create an API](../../create-api/create-a-rest-api.md) using the API Publisher, you can specify the endpoints of the API backend implementation via the **Endpoints** page as Production and Sandbox endpoints respectively.

Follow the instructions below to use Basic Auth as the endpoint authentication type when using a secured endpoint:

1. Click **Endpoints** in API Publisher.

2. Click the Endpoint Security symbol of the endpoint that you want to secure with Basic Auth.

      [![endpoint security symbol](../../../../assets/img/learn/endpoint-security-symbol.png)](../../../../assets/img/learn/endpoint-security-symbol.png)

3. Select **Basic Auth** as the endpoint authentication type from the drop-down menu.

     [![basic auth dropdown](../../../../assets/img/learn/basic-auth-dropdown.png)](../../../../assets/img/learn/basic-auth-dropdown.png)

4. After entering your credentials, click **Submit** to confirm the details of the respective endpoint and then click **Save** in the Endpoints page to save all the changes made in the **Endpoints** page.

     [![basic auth submit button](../../../../assets/img/learn/basic-auth-submit-button.png)](../../../../assets/img/learn/basic-auth-submit-button.png)

     [![endpoints save button](../../../../assets/img/learn/endpoints-save-button.png)](../../../../assets/img/learn/endpoints-save-button.png)

!!! info
    The Endpoint Auth Type selected should match with the authentication mechanism supported by the secured endpoint.
    