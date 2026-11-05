---
title: "Manage Pipelines"
description: "Create, edit, and delete deployment pipelines in the WSO2 Cloud Console. The API Management Console promotes builds through that order."
---

A pipeline is the ordered sequence of environments that an API proxy moves through on its way to production, for example from development to production. You deploy an API proxy to the first environment in the pipeline, test it, and then promote the same build to the next environment.

You create pipelines in the WSO2 Cloud Console. After you create a pipeline, the API Management Console uses that order.

## View pipelines

1. Sign in to the WSO2 Cloud Console.
2. Open your organization.
3. In the left navigation menu, under **Infrastructure**, click **Deployment Pipelines**.

The **Deployment Pipelines** page lists how deployments are promoted between the environments of the organization. Each pipeline shows its name, how many environments it contains, and its status. Expand a pipeline to see the environments in promotion order. The pipeline your organization starts with is marked **Default**. To find a pipeline by name, type in **Search pipelines**.

## Create a pipeline

1. On the **Deployment Pipelines** page, click **Create Pipeline**.
2. In **Name**, enter a name for the pipeline. Use lowercase letters, numbers, and hyphens only, and start and end with a letter or a number. You cannot change the name later.
3. Under **Promotion flow**, click **Add Environment** and select the environment to start with.
4. To add the next environment, click **Continue after** that environment and select it. Add the environments in the order that API proxies are promoted through them. When every environment is already in the pipeline, you cannot add another.
5. Click **Create**. Click **Cancel** to leave without creating the pipeline.

## Edit a pipeline

On the **Deployment Pipelines** page, click the edit icon. Click **Save Changes**, or **Cancel** to keep the current order.

## Promote APIs across environments using a pipeline

You can use a pipeline to promote an API across multiple environments in a defined sequence, such as development, testing, and production. Each environment has its own gateways and invoke URLs, allowing you to test the API in one environment before promoting it to the next.

For example, you can use the default development environment and create a production environment to test an API before making it available to production users.

Follow these steps to promote an API using this pipeline:

1. **Create the production environment.** Create a production environment and create a appropriate gateway to it. The default development environment is already available.

2. **Configure the pipeline.** Create a pipeline that starts with development and continues with production.

3. **Deploy the API to development.** In the API Management Console, deploy the API to a gateway in the development environment. This creates a build on the development gateway.

4. **Test the API in development.** Invoke the API using the development gateway's invoke URL. The backend URL for development can point to a test service, allowing you to validate the API before promoting it.

5. **Promote the API to production.** Once you are satisfied with the tested build, promote it to production. This deploys the same build you tested in development without creating a new build from the current API definition.

6. **Invoke the API in production.** Use the production gateway's invoke URL to access the API. The production backend URL can point to the live service.

The pipeline ensures that APIs follow the defined sequence across environments and that the revision deployed to production is the same revision that was tested in development.

## Next Steps

- [Manage Environments](./managing-environments.md) - Create the environments that a pipeline moves API proxies through
