---
title: "Expose a Backend Implementation as a Prototype API"
description: "Create a Prototype (Pre-Released) API backed by a working backend URL, configure the endpoint in the Publisher, and invoke it from the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-design-manage/design/prototype-api/backend-url-prototype-api/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-design-manage/design/prototype-api/backend-url-prototype-api.md
tags:
  - api-manager
  - endpoints
  - tutorials
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "tutorial"
---

# Expose an Existing Backend Implementation as a Prototype API

This allows you to create a prototype API with an actual working backend URL and publish the API to the Developer Portal as a Pre-Released API.

## Step 1 - Create the interface of the API

Note the following when creating an interface for the API:

- [Create any type of interface for the Prototype API](../design-api-overview.md#create-an-api). 
- You can create either a new API or a new version of an existing API for this purpose.
- Fill the **Endpoint** field with the actual backend URL. For example, `https://petstore3.swagger.io/api/v3`

For this example, let's follow [steps 1 to 5 in the Create a REST API from an OpenAPI Definition - basic flow guide](../create-api/create-rest-api/create-a-rest-api-from-an-openapi-definition.md#create-an-api-using-the-basic-flow) to create the basic structure of the API interface using the following details.

| **Field**    | **Value**                        |
|----------|-------------------------------------|
| OpenAPI URL | https://petstore3.swagger.io/api/v3/openapi.json |
| Name     | SwaggerPetstore                     |
| Context  | v3                                 |
| Version  | 1.0.6                               |
| Endpoint | https://petstore3.swagger.io/api/v3 |

## Step 2 - Specify the backend URL

If you did not provide an endpoint in the above step, follow the steps given below.

1. Navigate to **API Configurations** and click **Endpoints** to navigate to the Endpoints page in the Publisher.

2. Enter the Endpoint details.
   
     1. Click on an Endpoint type of your choice, with the exception of Mock Implementation, and click **Add**.

        !!! note
            Skip this step if you have already defined an endpoint when creating the basic interface for the API.

     2. Configure/update the endpoints as required.

         For this example, let's -

           1. Select **HTTP/REST Endpoint**.

           2. Enter the **Production Endpoint** as `https://petstore3.swagger.io/api/v3`.

     3. Click **Save** to save the Endpoint configurations in the API.
   
    !!! note
        For more information, see [Endpoint Types](../endpoints/endpoint-types.md) and the other sections related to the **Endpoints** documentation.

--8<-- "api-manager/4.7.0/includes/design/invoke-prerelease-api.md"

## Step 6 - Invoke the API

1. Click **View in Dev Portal** to navigate to the Developer Portal.

    !!! note 
        If you have enabled security for the prototype API, follow the [Subscribe to an API](../../../api-developer-portal/manage-subscription/subscribe-to-an-api.md) guide to subscribe and obtain an access token to invoke the prototype API.

2. Click **Try Out** to navigate to the API Console and invoke the API as for a regular API.