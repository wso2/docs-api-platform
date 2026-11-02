---
title: "Use API Platform STS"
description: "Authenticate API invocations in WSO2 API Platform with the built-in API Platform security token service."
---

API Platform's built-in Secure Token Service (STS) can seamlessly integrate with API Platform APIs to provide authentication and authorization. This guide will walk you through setting up API Platform STS to authenticate API invocations.

This guide walks you through the following steps:

- Create an application in API Platform and generate access token.
- Invoke the API.

## Prerequisites

To follow this guide, you need to satisfy the following prerequisites:

- If you don't already have an API Proxy in API Platform, [create API Proxy](../../../create-api-proxy/overview.md).
- Deploy and publish your API. 

:::note
It is important to note that API Platform STS token can be only be used for client authentication. If you have a requirement for end user authentication, it is necessary to use external key manager such as Asgardeo. For more information about secure API access with Asgardeo, refer Secure API Access with Asgardeo.
:::

## Step 1: Create an application and enable API Platform STS authentication

Follow the steps below to consume the API Platform API using API Platform STS.

1. Sign in to your organization in the API Portal and AI Hub at [https://devportal.bijira.dev](https://devportal.bijira.dev).
2. Click **Applications**, and then click **+Create**.
3. Enter a name for the application. 
4. Click **Create**.
5. Click on the newly created application.
6. At the top of the application page, under **OAuth2** click **Generate**. This will generate consumer keys for the application.
7. Once successfully generated, you will be shown a dialog which contains the key manager connection data.
8. Click on the **Generate Token** button to generate an access token. Please make sure to copy the access token to use in step 2.
9. Click **Subscribe to more APIs** button to explore the APIs and subscribe them through the application.

## Step 2: Invoke the API Platform API

1. Once you receive the access token, you can [test invoking the resource using the OpenAPI console](../../../test-api-proxy/api-console.md) in API Platform.
