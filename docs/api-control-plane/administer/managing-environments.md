---
title: "Manage Environments"
description: "Create and delete deployment environments in the WSO2 Cloud Console. They are then available in the API Control Plane."
---

An environment is a deployment target in your organization, such as development or production. You deploy an API proxy to an environment, and a [pipeline](./managing-pipelines.md) promotes that build from one environment to the next.

You create environments in the WSO2 Cloud Console. After you create an environment, it is available in the API Control Plane.

## View environments

1. Sign in to the WSO2 Cloud Console.

2. Open your organization.

3. In the header, click the settings icon (cog wheel).

4. In the left navigation menu, under **Infrastructure**, click **Environments**.

The **Environments** page lists the deployment environments shared by every product in the organization. To find an environment by name, type in **Search environments**.

| Column | Description |
|:-------|:------------|
| **Name** | The name of the environment. The description is shown with the name. The default environment is marked **Default**. |
| **Type** | **Critical** or **Non-critical**. |
| **Status** | Whether the environment is active. |
| **Created** | When the environment was created. |
| **Actions** | Edit or delete the environment. |

## Create an environment

1. On the **Environments** page, click **Create Environment**.
2. Enter the environment details.

    | Field | Description |
    |:------|:------------|
    | **Name** | Required. Lowercase letters, numbers, and hyphens only, and it must start and end with a letter or a number. The name cannot be changed later. |
    | **Description** | Optional. A short description of the environment. |
    | **Critical environment** | Turn on for a production-grade environment. Leave this off for a non-critical environment, such as development. |

3. Click **Create**. **Create** stays unavailable until the name is valid. Click **Cancel** to leave without creating the environment.

## Edit an environment

1. In the **Actions** column, click the edit icon.
2. Update the **Description** or **Critical environment**. The name cannot be changed.
3. Click **Save**. Click **Cancel** to keep the current values.

## Delete an environment

In the **Actions** column, click the delete icon.
## Next Steps

- [Manage Pipelines](./managing-pipelines.md) - Order environments into the path an API proxy follows to production
