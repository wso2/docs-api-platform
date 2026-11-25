---
title: "Manage Pipelines"
description: "Create, edit, and delete deployment pipelines in the Choreo Cloud Console. The API Control Plane promotes builds through that order."
---

A pipeline is the ordered sequence of environments that an API proxy moves through on its way to production, for example from development to production. You deploy an API proxy to the first environment in the pipeline, test it, and then promote the same build to the next environment.

You create pipelines in the Choreo Cloud Console. After you create a pipeline, the API Control Plane uses that order.

A new organization comes with a pipeline named `default`, which has one environment, development. The **Default Project** uses it.

## View pipelines

1. Sign in to the [Choreo Cloud Console](https://console.cloud.choreolabs.com/).

2. Open your organization.

3. In the header, click the settings icon (cog wheel).

4. In the left navigation menu, under **Infrastructure**, click **Deployment Pipelines**.

The **Deployment Pipelines** page lists how deployments are promoted between the environments of the organization. Each pipeline shows its name, how many projects use it, and its environments in promotion order. The `default` pipeline is marked **Default**. To find a pipeline by name, type in **Search pipelines**.

## View a pipeline's details

On the **Deployment Pipelines** page, click a pipeline. Its page shows the following details.

| Detail | Description |
|:-------|:------------|
| **Environments** | How many environments the pipeline has. |
| **Used by** | How many projects use the pipeline. |
| **Created** | When the pipeline was created. |
| **Promotion flow** | The environments of the pipeline, in promotion order. |
| **Projects** | The projects that use the pipeline. Click **Show projects** to list them, and type in **Search projects** to find one. |

To edit or delete the pipeline from this page, click **Edit** or **Delete**.

## Create a pipeline

1. On the **Deployment Pipelines** page, click **Create Pipeline**.
2. In **Name**, enter a name for the pipeline. Use lowercase letters, numbers, and hyphens only. You cannot change the name later.
3. Under **Promotion flow**, click **Add Environment**, and under **Start with**, select the first environment.
4. To add the next environment, click the add icon (**+**) after the last environment, and select the environment. Add the environments in the order that API proxies are promoted through them. When every environment is already in the pipeline, the list shows **Every environment is already in this pipeline**.
5. Click **Create**. **Create** stays unavailable until the pipeline has a name and at least one environment. Click **Cancel** to leave without creating the pipeline.

## Edit a pipeline

1. On the **Deployment Pipelines** page, click the edit icon of the pipeline. You can also click **Edit** on the pipeline's page.
2. Change the **Promotion flow**. You cannot change the name of a pipeline.
    - To add an environment, click the add icon (**+**) after the last environment, and select the environment.
    - To remove an environment, click **×** on it.
3. Click **Save Changes**. Click **Cancel** to keep the current flow.

## Delete a pipeline

On the **Deployment Pipelines** page, click the delete icon of the pipeline, or click **Delete** on the pipeline's page.

You cannot delete the `default` pipeline.

## Assign a pipeline to a project

Each project uses one deployment pipeline. You set it in the project's settings in the Choreo Cloud Console.

1. In the [API Control Plane Console](https://console.cloud.choreolabs.com/api-management/), open the project.
2. On the project's **Overview** page, click **Manage project**. The **Manage project** page of the project opens in the Choreo Cloud Console. Its details are shared by the project across every Choreo platform.
3. Under **Project details**, in **Deployment pipeline**, select the pipeline. The environments of the pipeline are shown under the list.
4. Click **Save changes**. Click **Discard changes** to keep the current pipeline.

The project is then listed under **Projects** on the pipeline's page.

## Promote APIs across environments using a pipeline

You can use a pipeline to promote an API across multiple environments in a defined sequence, such as development, testing, and production. Each environment has its own gateways and invoke URLs, allowing you to test the API in one environment before promoting it to the next.

For example, you can use the default development environment and create a production environment to test an API before making it available to production users.

Follow these steps to promote an API using this pipeline.

1. **Create the production environment.** Create a production environment and create a suitable gateway in it. The default development environment is already available.

2. **Configure the pipeline.** Create a pipeline that starts with development and continues with production.

3. **Deploy the API to development.** In the API Control Plane, deploy the API to a gateway in the development environment. This creates a build on the development gateway.

4. **Test the API in development.** Invoke the API using the development gateway's invoke URL. The backend URL for development can point to a test service, allowing you to validate the API before promoting it.

5. **Promote the API to production.** Once you are satisfied with the tested build, promote it to production. This deploys the same build you tested in development without creating a new build from the current API definition.

6. **Invoke the API in production.** Use the production gateway's invoke URL to access the API. The production backend URL can point to the live service.

The pipeline ensures that APIs follow the defined sequence across environments and that the revision deployed to production is the same revision that was tested in development.

## Next Steps

- [Manage Environments](./managing-environments.md) - Create the environments that a pipeline moves API proxies through
