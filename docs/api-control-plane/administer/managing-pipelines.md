---
title: "Manage Pipelines"
description: "Create, edit, and delete the pipelines that define how API proxies are promoted through the environments of your organization."
---

A pipeline is the ordered sequence of environments that an API proxy moves through on its way to production, for example from development to production. You deploy an API proxy to the first environment in the pipeline, test it, and then promote the same build to the next environment.

## View Pipelines

1. Sign in to the [API Management Console](https://console.bijira.dev).

2. In the left navigation menu, click **Pipelines**.

The **Continuous Deployment Pipelines** page lists the pipelines in your organization, with the environments of each pipeline. Your organization has a pipeline named **default** to start with, which you can edit. To find a pipeline by name, type in **Search pipelines**.

## Create a Pipeline

1. On the **Continuous Deployment Pipelines** page, click **Create Pipeline**.

2. In **Name**, enter a name for the pipeline. The name can contain lowercase letters, numbers, and hyphens only, and you cannot change it later.

3. Click **Add Environment**, and select an environment from the list.

4. To add more environments, repeat step 3. Add the environments in the order that API proxies are promoted through them.

5. Click **Create**.

## Edit or Delete a Pipeline

On the **Continuous Deployment Pipelines** page, find the pipeline, and do one of the following.

- To change the environments of the pipeline, click the edit icon.
- To delete the pipeline, click the delete icon.

## Next Steps

- [Manage Environments](./managing-environments.md) - Create the environments that a pipeline moves API proxies through
