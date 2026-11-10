---
title: "Quick Start Guide"
pagination_label: "API Control Plane Quick Start"
description: "Create a REST API from a backend URL, deploy it to a gateway, test it, and publish it to a portal."
---

In the API Control Plane, you can expose an existing HTTP backend through a gateway by creating a REST API proxy. When you start from scratch, you provide a backend URL, and the console generates the initial API details for you. You can then review the API definition, deploy the API to a gateway, test it, and publish it to the API Portal.

This guide uses the sample Reading List API backend.

## Prerequisites

1. Sign in to the API Control Plane Console.
2. Create an organization:

    1. Enter a **Display name**.
    2. Enter a **Handle**.
    3. Click **Create**.

    If you already have an organization, open it and continue.

3. Use the **Default project**, or create a project:

    1. On the organization home page, click **New project**.
    2. Enter a **Display name**, an **Identifier**, and a **Description**.
    3. Click **Create**.

    The project home page opens. Continue from there to create the API.

## Create the REST API

1. On the project home page, click **Create API**.

    ![Project home page with the Create API button](/img/cloud/getting-started/qs-project-home.png)

2. Select **REST API**, then click **Continue**.
3. Select **Start from scratch**.
4. Under **Backend endpoint**, enter your backend URL in **Endpoint URL**. To use the sample Reading List API, click **Try with Sample URL**.

    The sample URL is:

    ```text
    https://apis.bijira.dev/samples/reading-list-api-service/v1.0/books
    ```
5. Click **Continue**.
6. On **Configure and create**, review **Basic information** and **Backend endpoint**. The console fills **Name** and derives **Identifier** and **Context** from that name.

    For this sample, set **Name** to `Reading List API`. The identifier becomes `reading-list-api`, and the context includes your project identifier, for example `/default/reading-list-api/v1.0.0`.

    | Field | Value |
    | --- | --- |
    | **Name** | `Reading List API` |
    | **Identifier** | `reading-list-api` |
    | **Version** | `1.0.0` |
    | **Context** | `/default/reading-list-api/v1.0.0` |
    | **Description** | `A starting point. Edit the operations, or ask AI to refine them.` |
    | **Endpoint** | `https://apis.bijira.dev/samples/reading-list-api-service/v1.0/books` |

    ![Configure and create, with the name, identifier, version, context, and description](/img/cloud/getting-started/qs-configure-and-create.png)

7. Click **Create**.

The REST API is added to the project. Its overview lists the generated operations, such as `GET /*`, `POST /*`, `PATCH /*`, and `DELETE /*`, and the backend endpoint.

To view or edit the API definition, open the API and in the left navigation menu click **Develop**, then **Definition**. You can view the OpenAPI definition as **YAML** or **JSON**, or click **Edit** to change the operations.

## Deploy the API

Deploying places a build of the API on a gateway so requests can reach the backend through that gateway. Create a self-hosted gateway, start it with the setup commands the console shows, and then deploy the API to that gateway.

1. In the left navigation menu, click **API Gateways**, then click **Add API Gateway**.
2. Under **Hosting**, select **Self-hosted API gateway**.
3. Enter the gateway details.

    | Field | Description |
    | --- | --- |
    | **Gateway Type** | **API Gateway**. |
    | **Name** | A name for the gateway. The handle is derived from this name and cannot be changed later. |
    | **Description** | Optional. |
    | **Environment** | The environment this gateway belongs to. |
    | **API Gateway Version** | The gateway version to run. Use the latest version. |
    | **URL** | The endpoint the gateway answers on. Add it to match your infrastructure. |

    ![Add API Gateway form for a self-hosted gateway, with the name, environment, gateway version, and URL](/img/cloud/getting-started/qs-add-self-hosted-gateway.png)

4. Click **Add API Gateway**.

    The console gives you a registration token and the setup commands to run the gateway on your infrastructure. Run those commands. The gateway stays inactive until it connects to the control plane.

    You can also use a managed gateway instead of a self-hosted gateway. For more on gateways, see [Manage Gateways](./administer/managing-gateways.md).

5. Open the API, and in the left navigation menu click **Deploy**.
6. In **Build Area**, click **Deploy**.

    ![Deploy page with the Build Area, the Deploy button, and the development environment gateway](/img/cloud/getting-started/qs-deploy.png)

7. In the deploy dialog, which is named for the environment, such as **Deploy to development**:

    1. Select the self-hosted gateway you created.
    2. Confirm the **Endpoint URL**.
    3. Confirm the **Build**.
    4. Click **Deploy**.


After the deployment succeeds, the API overview lists the gateway under **Deployed gateways**. For more on deployment, see [Deploy an API](./deploy-api-proxy/overview.md).

## Test the API

After the API is deployed, use the API Console to send a request through the gateway.

1. In the left navigation menu, click **Test**.
2. Keep **Console view** selected.
3. Under **Gateway**, select the gateway you deployed the API to. The endpoint for that gateway is shown beside the gateway.
4. Expand an operation, such as **GET /***.
5. Keep **Through proxy** selected, so the request goes through the gateway.
6. Click **Execute**. The response appears under **Server response**.

    ![API Console with the gateway selected and the generated operations](/img/cloud/getting-started/qs-test-console.png)

For more on the console, see [API Console](./test-api-proxy/api-console.md).

## Publish the API

Publishing makes the API available in the API Portal, where consumers can discover it and read its documentation.

1. Create a portal if the organization does not have one.

    1. In the left navigation menu, click **Portals**, then click **Add Portal**.
    2. Enter a **Name**. **Description** is optional.
    3. Select a **Login environment**. Portal users sign in through the authentication server of this environment.
    4. **Allow self sign-up** is turned on.
    5. Click **Add Portal**.

    ![Add Portal form with the name, description, login environment, and Allow self sign-up switch](/img/cloud/getting-started/qs-add-portal.png)

    For more on portals, see [Manage Portals](./administer/managing-portals.md).

2. Open the API, and in the left navigation menu click **Publish**.

    The page lists the portals in the organization and the publishing status of the API in each portal.

3. On the card for the portal you want, click **Publish**.

    ![Publish page with a portal card showing the Not published status, the Publish button, and View in Portal](/img/cloud/getting-started/qs-publish-api.png)

    The console publishes the API to that portal with all its documents attached and no subscription plan selected.

    :::tip
    To review the API details, specification, subscription plans, documentation, and landing page before you publish, click the arrow next to **Publish** and select **Configure & Publish**. Then click **Configure & Publish** to open the publish page.
    :::

The status of the API in that portal changes to **Published**. To open the portal listing, click **View in Portal**. For more on publishing, see [Publish an API](./publish-api-proxy/publish-an-api.md).

## Next Steps

- [Security](./develop-api-proxy/security/overview.md) - Control who can invoke the API
- [Attach and Manage Policies](./develop-api-proxy/policy/attach-and-manage-policies.md) - Add capabilities such as rate limiting or header changes to the API
- [Which Credentials You Need](../api-portal/consume-an-api/overview.md) - Generate keys in the API Portal and AI Hub and invoke the API
