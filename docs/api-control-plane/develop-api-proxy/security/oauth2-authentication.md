---
title: "OAuth2 Authentication"
description: "Secure an API proxy with the JWT Auth policy, so that consumers invoke it with OAuth2 access tokens issued by a key manager."
---

With OAuth2 authentication, consumers send an OAuth2 access token with each request to invoke an API proxy. You secure the API proxy with the **JWT Auth** policy, and consumers get access tokens in the API Portal and AI Hub.

ThunderID is the default key manager, so consumers can get access tokens without any other setup.

## Prerequisites

- An API proxy. To create one, follow the [Quick Start Guide](../../quickstart-guide.md).

## Step 1: Attach the JWT Auth Policy

1. Sign in to the [API Control Plane Console](https://console.bijira.dev).

2. In the header, select the project from the **Projects** list and the API from the **APIs** list.

3. In the left navigation menu, click **Develop**, then click **Policies**.

4. In the **Available policies** pane, find the **JWT Auth** policy, drag it to the **Global policies** section, and click **Add**.

5. Click **Save**.

6. Deploy the API to a gateway, so that the policy takes effect.

For more on attaching policies, including to a single resource, see [Attach and Manage Policies](../policy/attach-and-manage-policies.md).

## Step 2: Publish the API

Publish the API to a portal, so that consumers can find it and get access tokens for it. See [Publish an API](../../publish-api-proxy/publish-an-api.md).

## How Consumers Invoke the API

1. The consumer signs in to the API Portal and AI Hub, and generates an OAuth2 key under **Keys** › **OAuth2 Keys**.

2. The consumer gets an access token with the key.

3. The consumer sends the access token as a bearer token when invoking the API.

    ```bash
    curl -H "Authorization: Bearer <access-token>" "<invoke-url>/<resource-path>"
    ```

For the steps that consumers follow, see [Consume an OAuth2-Secured API](../../../api-portal/consume-an-api/oauth2.md).

## Use Another Key Manager

To issue access tokens from your own identity provider, such as WSO2 Identity Server, Asgardeo, or Keycloak, an administrator registers it as a key manager in the API Portal and AI Hub. See [Configure a Custom Key Manager](../../../api-portal/administer/key-managers/custom-key-manager.md).
