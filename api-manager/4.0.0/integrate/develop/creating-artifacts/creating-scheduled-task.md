---
title: "Scheduling ESB tasks"
description: "Provides steps to create and configure a scheduled task artifact in WSO2 Integration Studio."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/develop/creating-artifacts/creating-scheduled-task/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/develop/creating-artifacts/creating-scheduled-task.md
tags:
  - api-manager
  - integrate
  - develop
  - creating-artifacts
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Scheduling ESB Tasks

Follow the instructions given below to create a **Scheduled Task** in WSO2 Integration Studio.

## Instructions

### Creating the Scheduled Task artifact

1.  Right-click the [ESB Config project](../create-integration-project.md#sub-projects) and click **New** → **Scheduled Task**.  

    <img src="../../../../assets/img/integrate/create_artifacts/scheduled_task/select-scheduled-task.png">

2.  Select **Create a New Scheduled Task Artifact** and click **Next**.

    <img src="../../../../assets/img/integrate/create_artifacts/scheduled_task/new-task-wizard-1.png" width="500">

3.  Specify values for the [required parameter](../../../reference/synapse-properties/scheduled-task-properties.md) for the scheduled task.

    <img src="../../../../assets/img/integrate/create_artifacts/scheduled_task/new-task-wizard-2.png" width="500">

4.   Specify the location to save the artifact:

  	 -   To save the scheduled task in an existing ESB Config project in your workspace, click **Browse** and select that project.
  	 -   To save the scheduled task in a new ESB Config project, click **Create new Project** and create the new project.

5.  Click **Finish**. 

    The scheduled task is created in the `src/main/synapse-config/tasks` folder under the ESB Config project you specified.

6.  To use the scheduled task, [update the properties](#updating-properties).

### Updating properties

Update the task properties to specify the incoming message that should trigger the task and the destination to which the message should be injected.

1.  Open the new artifact from the project explorer.

    <img src="../../../../assets/img/integrate/create_artifacts/scheduled_task/scheduled-task-form-view.png" width="700">

2.  In the **Form** view, you can optionally modify already specified property values.
3.  Click **Task Implementation Properties** to open the **Task Properties** dialog box.

    <img src="../../../../assets/img/integrate/create_artifacts/scheduled_task/scheduled-task-properties.png" width="700">

4.  Update the properties.

## Examples

-   [Task Scheduling using a Simple Trigger](../../examples/scheduled-tasks/task-scheduling-simple-trigger.md)
-   [Injecting Messages to a RESTful Endpoint](../../examples/scheduled-tasks/injecting-messages-to-rest-endpoint.md)

## Tutorials

-   See the tutorial on [periodically executing an integration process](../../../tutorials/integration-tutorials/using-scheduled-tasks.md) using a scheduled task