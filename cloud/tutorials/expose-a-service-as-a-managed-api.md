---
title: "Expose a service as a managed API"
description: "Create, deploy, test, promote, and publish an API proxy in API Platform, then invoke it from the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/cloud/tutorials/expose-a-service-as-a-managed-api/
md_url: https://wso2.com/api-platform/docs/cloud/tutorials/expose-a-service-as-a-managed-api.md
tags:
  - cloud
  - tutorials
  - api-proxy
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "tutorial"
---

# Expose a Service as a Managed API

API Platform simplifies securely exposing existing services as managed APIs. It also allows you to manage all aspects of an API's lifecycle, security, throttling, and governance, so you can focus on service development.

In this tutorial, you will use API Platform to expose a service as an API proxy and publish it to the API Platform Developer Portal for application developers to consume.

## Prerequisites

- If you're signing in to the API Platform Console for the first time, create an organization:
    1. Go to [API Platform Console](https://console.bijira.dev/) and sign in using your preferred method.
    2. Enter a unique organization name. For example, `Stark Industries`.
    3. Read and accept the privacy policy and terms of use.
    4. Click **Create**.

  This creates the organization and opens the **Project Home** page of the default project created for you.

## Step 1: Create an API proxy

You can create an API proxy by following several methods. In this guide, you will create an API proxy by providing a sample URL.

1. Go to [API Platform Console](https://console.bijira.dev/) and sign in. This opens the project home page.
2. If you already have one or more API Proxies in your project, click **+ Create**. Otherwise, proceed to the next step.
3. Click the **Import API Proxy** card.
4. In the **Create API Proxy from Contract** pane, click **Try with sample URL**.
5. Click **Next**.
6. Update the populated API proxy details with the following values:

    !!! info
         The **Identifier** field must be unique and cannot be changed after creation.

         | **Field**      | **Value**                                   |
            |----------------|---------------------------------------------|
         | **Name**| `Reading List API`                          |
         | **Identifier**      | `reading-list-api-qs`                          |
         | **Base Path**    | `/apim-p/reading-list-api-qs/v1.0`                                    |
         | **Version**    | `1.0`                                       |
         | **Target**     | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0`       |
         | **Access Mode** | **External**: API is publicly accessible    |

7. Click **Create**. This creates the component and takes you to the **Overview** page of the component.

To see the resources of the API proxy, go to the left navigation menu, click **Develop**, and then click **Resources**.

## Step 2: Deploy the API proxy

By default, the API will be automatically deployed to the development environment. But you can manually deploy it to the development as well with required changes. To do So, follow these steps:

1. In the left navigation menu, click **Deploy**.
2. In the **Build Area** card, click **Deploy**.

Additionally, you can click the down arrow next to **Deploy** and select **Configure and Deploy** to make any necessary changes before deploying the API proxy.

Once the deployment is complete, the **Development** card indicates the **Deployment Status** as **Active**.

Now you are ready to test the API proxy.

## Step 3: Test the API proxy

You can test the API proxy in the development environment before promoting it to production. API Platform provides the following options to test your API proxy:

- Console
- cURL
- API Chat

In this guide, you will use the OpenAPI Console.

1. In the left navigation menu, click **Test** and then click **Console**.

    !!! tip
         Since the API proxy is secured when deployed, you will need a key to invoke it. API Platform automatically generates a key when you navigate to the **Console** pane.

2. In the **Console** pane, select **Development** from the environment drop-down list.
3. Expand the `GET /books` method and click **Try it Out** to test it.
4. Click **Execute**. You will see a response similar to the following:

   ![OpenAPI Console showing HTTP 200 response for the GET /books test request](../../assets/img/tutorials/api-proxy-response.png)

   This indicates that your API proxy is working as expected.

## Step 4: Promote the API proxy to production

Once you verify that the API proxy is working as expected in the development environment, you can promote it to production.

1. In the left navigation menu, click **Deploy**.
2. In the **Development** card, click **Promote**.
3. In the **Configure & Deploy** pane, click **Next**.

    !!! tip
         If you want to specify a different endpoint for your production environment, you can make the change in the **Configure & Deploy** pane.

         The **Production** card indicates the **Deployment Status** as **Active** when the API proxy is successfully deployed to production.

         If you want to verify that the API proxy is working as expected in production, you can test the API in the production environment.

Now that your API is deployed in both development and production environments and can be invoked, the next step is to publish it so that consumers can discover and subscribe to it.

## Step 5: Publish the API proxy

1. In the left navigation menu, click **Develop** and then click **Lifecycle**. This opens the **Lifecycle** page, where you can see the different lifecycle stages of the API. The current lifecycle stage is **Created**.
2. Click **Publish**.
3. In the **Publish API** dialog, click **Confirm** to proceed with publishing the API with the specified display name. If you want to change the display name, make the necessary changes and then click **Confirm**. This changes the API lifecycle state to **Published**.

You can observe that the API lifecycle stage has changed to **Published**. Now the API is available for consumption. API consumers can consume the API via the API Platform Developer Portal.

## Step 6: Invoke the API

To generate credentials for the published API and invoke it via the Developer Portal, follow these steps:

1. In the **Lifecycle Management** pane, click **Go to DevPortal**. This takes you to the Petstore API published to the API Platform Developer Portal.
2. Generate credentials:
    1. In the Developer Portal left navigation menu, click **Production** under **Credentials**.
    2. Click **Generate Credentials**. API Platform generates new tokens and populates the **Consumer Key** and **Consumer Secret** fields.
3. Invoke the API:
    1. In the Developer Portal left navigation menu, click **Try Out**.
    2. In the **Endpoint** list, select **Development** as the environment to try out the API.
    3. Click **Get Test Key**. This generates an access token.
    4. Expand the `GET /pet/findByStatus` operation and click **Try it out**.
    5. Select **available** as the status and click **Execute**.

Now you have successfully created, deployed, tested, and published an API proxy using API Platform.