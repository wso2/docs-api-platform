---
title: "Quick Start Guide - API Proxy"
description: "Expose a service as an API proxy with WSO2 API Platform and publish it to the Developer Portal for application developers to consume."
canonical_url: https://wso2.com/api-platform/docs/cloud/introduction/quick-start-guide/
md_url: https://wso2.com/api-platform/docs/cloud/introduction/quick-start-guide.md
tags:
  - cloud
  - api-proxy
  - quickstart
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-30
content_type: "quickstart"
---

# Quick Start Guide - API Proxy

WSO2 API Platform simplifies securely exposing existing services as managed APIs. It also allows you to manage all aspects of an API's lifecycle, security, throttling, and governance, so you can focus on service development.

In this tutorial, you will use API Platform to expose a service as an API proxy and publish it to the API Platform Developer Portal for application developers to consume.

!!! info "Watch the video walkthrough"
    [Check out this quick start on YouTube](https://youtu.be/kElzVeJPlRs?rel=0) or watch below.

<iframe 
  width="100%" 
  src="https://www.youtube.com/embed/kElzVeJPlRs?rel=0" 
  title="YouTube video player" 
  style="border: 0; display: block; aspect-ratio: 16 / 9;" 
  loading="lazy" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" 
  allowfullscreen>
</iframe>

## Prerequisites

1. If you're signing in to the API Platform Console for the first time, create an organization:
    1. Go to [API Platform Console](https://console.bijira.dev/) and sign in using your Google, GitHub, or Microsoft account.
    2. Enter a unique organization name.
    3. Read and accept the privacy policy and terms of use.
    4. Click **Create**.

    This creates the organization and opens the organization home page.

## Step 1: Create a Project

1. Go to [API Platform Console](https://console.bijira.dev/) and sign in. This opens the organization home page.
2. On the organization home page, click **+ Create Project**.
3. Enter the following details:

    !!! info
        The **Name** field must be unique and cannot be changed after creation.

    | **Field**        | **Value**         |
    | ---------------- | ----------------- |
    | **Display Name** | Sample Project    |
    | **Identifier**   | sample-project    |
    | **Description**  | My sample project |

4. Click **Create**. This creates the project and takes you to the project home page.

## Step 2: Create an API Proxy

1. On the project home page, click **Import API Contract** under **My APIs (Ingress)**.
2. Click **URL for API Contract**, enter the following URL, and then click **Next**:
   ```http
   https://raw.githubusercontent.com/wso2/docs-bijira/refs/heads/main/en/docs/assets/files/sample-api.yaml
   ```
3. **Create API Proxy from Contract** page will be opened. Click **Create** to complete the API proxy creation process.
    ![Create API Proxy from Contract form with HTTP type, name Sample API, identifier, version, base path, description, target URL, and External and Internal access mode options](../../assets/img/introduction/create-api-proxy-from-contract.png)

## Step 3: Test the API Proxy

You can test the API proxy in the development environment before promoting it to production. API Platform provides the following options to test your API proxy:

- OpenAPI Console
- cURL
- API Chat

In this guide, you will use the OpenAPI Console.

1. In the left navigation menu, click **Test** and then click **Console**.

    !!! tip
        Since the API proxy is secured when deployed, you will need a key to invoke it. API Platform automatically generates a key when you navigate to the **OpenAPI Console** pane.

2. In the **OpenAPI Console** pane, select **Development** from the environment drop-down list.
3. Expand the `GET /uuid` method and click **Try it Out** to test it.
4. Click **Execute**. You will see a response similar to the following:

    ![OpenAPI Console showing GET /uuid expanded with HTTP 200 server response, curl command, request URL, and UUID JSON response body](../../assets/img/introduction/test-response.png)

    This indicates that your API proxy is working as expected.

## Step 4: Promote the API Proxy to Production

Once you verify that the API proxy is working as expected in the development environment, you can promote it to production.

1. In the left navigation menu, click **Deploy**.
2. In the **Development** card, click **Promote**.
3. In the **Configuration Types** pane, select the option **Use Development endpoint configuration** and click **Next**.

    !!! tip
        If you want to specify a different endpoint for your production environment, you can make the change in the **Configuration Types** pane.

    The **Production** card indicates the **Deployment Status** as **Active** when the API proxy is successfully deployed to production.

    If you want to verify that the API proxy is working as expected in production, you can test the API in the production environment.

Now that your API is deployed in both development and production environments and can be invoked, the next step is to publish it so that consumers can discover and subscribe to it.

## Step 5: Publish the API Proxy

1. In the left navigation menu, click **Develop** and then click **Lifecycle**. This opens the **Lifecycle** page, where you can see the different lifecycle stages of the API. The current lifecycle stage is **Created**.
2. Click **Publish**.
3. In the **Publish API** dialog, click **Confirm** to proceed with publishing the API with the specified display name. If you want to change the display name, make the necessary changes and then click **Confirm**. This changes the API lifecycle state to **Published**.

You can observe that the API lifecycle stage has changed to **Published**. Now the API is available for consumption. API consumers can consume the API via the API Platform Developer Portal.

## Step 6: Invoke the API

<!-- TODO: Need to improve the documentation after devportal is refined with snaps and steps -->
To generate credentials for the published API and invoke it via the Developer Portal, follow these steps.

1. In the **Lifecycle Management** pane, click **Go to DevPortal**. This takes you to the Sample API published to the API Platform Developer Portal.
    ![Lifecycle page showing API in Published state with lifecycle flow diagram including Created, Pre-released, Published, Deprecated, Blocked, and Retired stages, and Go to Devportal button highlighted](../../assets/img/introduction/go-to-developer-portal.png)
2. Subscribe to the API and Generate credentials.
    1. In the Developer Portal left navigation menu, click **Applications**.
    2. Click **Create**.
    3. Add a sample application name and click **Create**. This will create a new application. Click on the application name and it will navigate you to the application's home page.
    4. Click **Subscribe to more APIs** under **Subscribed APIs** section. This will navigate you to the API proxy listing page.
    5. From the respective API card, choose the Application and click **Subscribe**. Now your application is subscribed to the published API with your selected subscription plan.
    6. Open the created application by selecting **Applications** from the left menu, and click on the application name.
    7. In the Application detail banner, click **Manage Keys**. This opens the **Manage Keys** page.
    8. On the **Manage Keys** page, select either the **Production** or **Sandbox** tab based on your requirement.

        !!!info
            Sandbox keys can only be used in the sandbox environment.

    9. Click **Generate** and wait for the keys to be generated. If you want to configure Advanced Configurations, click on the **Modify** button once the keys are generated and configure the values. API Platform generates new tokens and populates the **Consumer Key** and **Consumer Secret** fields.
    10. Close the dialog.
    11. Click **Generate** to generate an access token that you can use to invoke APIs. Copy the generated access token.

3. Invoke the API:
    1. Go to the APIs listing page using the left navigation menu.
    2. Click on the API to open your API.
    3. Click **Documentation** to open the swagger definition of the API.
    4. Select the API resource that you want to invoke.
    5. Paste your copied access token with following format: `Bearer <ACCESS_TOKEN>`
    6. Click **Send API Request**.

Now you have successfully created, deployed, tested, and published an API proxy using API Platform.