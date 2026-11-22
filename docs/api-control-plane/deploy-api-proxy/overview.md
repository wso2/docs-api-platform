---
title: "Deploy an API"
pagination_label: "Deploy an API"
description: "Deploy an API proxy to a Choreo managed or self-hosted gateway, check deployments and builds, stop a deployment, and deploy again."
---

Deploying an API proxy places a build of the API on one or more gateways. After the deployment succeeds, requests can reach the backend through each gateway's invoke URL.

The **Deploy** page of an API has two parts:

- **Build Area**, which creates builds of the API and lists the recent ones.
- A card for each environment in the project's pipeline, such as **development**. Each card shows the build running in that environment, and the gateways in it with their deployment status.

## Prerequisites

- An API proxy. See [Create an API](../create-api-proxy/overview.md).
- A gateway in the environment you deploy to. Your organization has a Choreo Managed Gateway named **Default**, in the development environment, and the deploy dialog box selects it for a first deployment. To deploy to another gateway, create a [self-hosted gateway](../administer/managing-gateways.md#create-a-self-hosted-gateway) or a [managed gateway](../administer/managing-gateways.md#create-a-managed-gateway) first.

## Deploy the API

1. Open the API, and in the left navigation menu, click **Deploy**. You can also click **Deploy to Gateway** on the API overview page.
2. In **Build Area**, click **Deploy**. To create a build from the current API and deploy it in one step, click the arrow next to **Deploy**, and select **Build and Deploy**.
3. In the dialog box, which is named for the environment, such as **Deploy to development**, configure the deployment:

    1. Under **Gateways**, select one or more gateways. For a first deployment, the console selects the gateway marked **Default**.
    2. Confirm the **Endpoint URL** of the backend.
    3. Under **Build**, confirm the build to deploy.
    4. Click **Deploy**.

    ![Deploy page with the Build Area, the Deploy button, and the gateways in the development environment](/img/cloud/deploy-api-proxy/deploy.png)

After the deployment succeeds, the gateway's status changes to **Active**. The API overview page lists the gateway under **Deployed gateways**, and shows the **Invoke URL**.

## Check Deployments and Builds

Each environment card lists its gateways with their deployment status.

| Status | Meaning |
| --- | --- |
| **Not deployed** | The API has never been deployed to this gateway. |
| **Deploying** | The gateway is receiving the build. |
| **Active** | The API is deployed and serving requests. |
| **Stopping** | The deployment is being stopped. |
| **Suspended** | The deployment was stopped. |
| **Failed** | The deployment failed. Deploy the API again. |

To see when the API was deployed and its **Endpoint URL**, click a gateway to expand it.

### Manage Builds

**Build Area** lists the builds of the API, newest first. Each build shows its ID, such as `2026-11-16-7`, and when it was created.

To delete a build, follow these steps:

1. In **Build Area**, click the delete icon next to the build.
2. In the **Delete this build?** dialog box, click **Delete**.

You can't delete a build that a gateway is running. The delete icon for that build is unavailable.

## Stop a Deployment

Stopping a deployment undeploys the API from one gateway. The gateway itself keeps running.

1. On the **Deploy** page, click the gateway to expand it.
2. Click **Stop deployment**.

The status changes to **Stopping**, and then to **Suspended**. The gateway no longer accepts requests for the API.

## Deploy Again

There's no separate redeploy action. To put an API back on a gateway after you stop it or after a deployment fails, or to deploy a change such as an updated definition or policy, deploy it again:

- To deploy a new build with your latest changes, click the arrow next to **Deploy** in **Build Area**, and select **Build and Deploy**.
- To deploy an existing build, click **Deploy**, and select the build under **Build** in the dialog box.

## Promote to the Next Environment

If the project's pipeline has more than one environment, each environment card has a **Promote to** button, such as **Promote to production**. Promoting deploys the build that's running in this environment to gateways in the next one. For more on pipelines, see [Manage Pipelines](../administer/managing-pipelines.md).

## Next Steps

- [Test the API](../test-api-proxy/api-console.md) - Invoke the deployed API from the API Console, the GraphQL Console, or cURL
