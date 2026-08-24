---
title: "Create an API using a service"
description: "Discover Micro Integrator and Streaming Integrator services in the WSO2 API Manager service catalog, and create a REST or streaming API from one."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-design-manage/design/create-api/create-an-api-using-a-service/
md_url: https://wso2.com/api-platform/docs/api-manager/4.6.0/api-design-manage/design/create-api/create-an-api-using-a-service.md
tags:
  - api-manager
  - api-design-manage
  - design
  - create-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Create an API Using a Service

The service catalog in WSO2 API Manager contains services that correspond to either the Micro Integrator or the Streaming Integrator. The Micro Integrator services correspond to the REST API backend services, and the Streaming Integrator services correspond to the Streaming API (i.e., WebSocket, WebHook/WebSub or SSE) backend services that are managed by the respective integration layer (Micro Integrator or Streaming Integrator).

Therefore, you can use the respective services to either create REST APIs or Streaming APIs to expose integration services or streaming integration services as managed APIs.

## Step 1 - Create and publish your service to the service catalog

Create and publish your integration service or streaming integration service to the **Service Catalog** of the WSO2 API-M layer via the integration layer.

More information:

- For information on creating and publishing a REST API based on an integration service, see [Exposing an Integration Service as a Managed API](../../../integrate/develop/working-with-service-catalog.md).

- For information on creating and publishing a Streaming API based on a streaming integration service, see [Exposing a Stream as a Managed API](../../../use-cases/streaming-usecase/exposing-stream-as-managed-api-in-service-catalog.md).

## Step 2 - Discover the services

Follow the instructions below to discover the integration services:

--8<-- "api-manager/4.6.0/includes/sign-in-publisher.md"

2.  Click **Services**. The available integration services appear.

      <a href="../../../../assets/img/common/service-catalog/services-catalog-list.png"><img src="../../../../assets/img/common/service-catalog/services-catalog-list.png" width="50%" alt="service catalog listings"></a>

## Step 3 - Optionally, view the details of the service

1. Click on the service that is in the service catalog to view the service details. 

     You can view the service name, version, description, usages in APIs, and other important metadata.

     <a href="../../../../assets/img/common/service-catalog/service-overview.png"><img src="../../../../assets/img/common/service-catalog/service-overview.png" width="80%" alt="service overview"></a>

2. Optionally, **download a service definition**.

     If required, click **Download** to download the service definition.

3. Optionally, **view the service definition**.

     If you want to see the service definition before creating an API, click **View Definition**.

     <a href="../../../../assets/img/common/service-catalog/view-api-definition.png"><img src="../../../../assets/img/common/service-catalog/view-api-definition.png" alt="view api definition"></a>

## Step 4 - Create an API from the service

1.  Click on the service that is in the service catalog.

2.  Click **Create API**.

     This opens the **Create API** dialog box with the API details that are generated based on the service.

    <a href="../../../../assets/img/common/service-catalog/create-api-from-service.png"><img src="../../../../assets/img/common/service-catalog/create-api-from-service.png" alt="create api dialog box"></a>

3.  Update the API name, context, and version if required, and click **Create API**. 

    The overview page of the API that you just created appears. 

    <a href="../../../../assets/img/common/service-catalog/new-api-view.png"><img src="../../../../assets/img/common/service-catalog/new-api-view.png" alt="apis list"></a>

4.  Update the portal configurations and API configurations as required.

     Now, you have successfully created an API using a service.

After you complete configuring the API, [Publish the API](../../deploy-and-publish/publish-on-dev-portal/publish-an-api.md).

## See Also

Learn more on the concepts that you need to know when creating an API:

 - [Endpoints](../endpoints/endpoint-types.md)
 -   [API Security](../../../api-security/runtime/api-authentication/secure-apis-using-oauth2-tokens.md)
 -   Rate Limiting:
     -   [Rate Limiting for REST APIs](../rate-limiting/assign-business-plans.md)
     -   [Rate Limiting for Streaming APIs](../rate-limiting/set-streaming-api-limits.md)
 -   [Life Cycle Management](../lifecycle-management/api-lifecycle.md)
 -   [API Monetization](../../../monitoring/api-monetization/monetizing-an-api.md)
 -   [API Visibility](../advanced-topics/control-api-visibility-and-subscription-availability-in-developer-portal.md)
 -   [API Documentation](../api-documentation/add-api-documentation.md)
 -   [Custom Properties](adding-custom-properties-to-apis.md)