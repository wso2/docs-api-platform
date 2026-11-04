---
title: "Manage Environments"
description: "Create and delete the deployment environments of your organization in the API Management Console."
---

An environment is a deployment target in your organization, such as development or production. You deploy an API proxy to an environment, and a [pipeline](./managing-pipelines.md) promotes that build from one environment to the next.

## View Environments

1. Sign in to the [API Management Console](https://console.bijira.dev).

2. In the left navigation menu, click **Environments**.

The **Environments** page lists the environments in your organization. To find an environment by name, type in **Search Environments**.

| Column | Description |
|:-------|:------------|
| **Name** | The name of the environment. |
| **Type** | **Critical Environment** or **Non-Critical Environment**. |
| **Created** | When the environment was created. |

## Create an Environment

1. On the **Environments** page, click **Create**.

2. In **Create Environment**, enter the environment details.

    | Field | Description |
    |:------|:------------|
    | **Name** | Required. Lowercase letters, numbers, and hyphens only. The name cannot be changed later. |
    | **Critical environment** | Turn on for a production-grade environment. Critical environments require greater care. Leave this off for a non-critical environment, such as development. |

3. Click **Create**. **Create** stays unavailable until you enter a name. Click **Cancel** to leave without creating the environment.

The environment is added to the list. Its **Type** is **Critical Environment** when **Critical environment** is on, and **Non-Critical Environment** when it is off.

## Delete an Environment

1. In the **Actions** column of the environment, click the delete icon.

2. In **Delete Environment**, confirm that you want to delete the named environment.

3. Click **Delete**. Click **Cancel** to keep the environment.

## Next Steps

- [Manage Pipelines](./managing-pipelines.md) - Order environments into the path an API proxy follows to production
