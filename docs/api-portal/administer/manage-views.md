---
title: "Manage views"
description: "Create and edit views that control which labelled APIs and MCP servers are visible in the API Portal and AI Hub."
---

A **view** decides which labelled APIs and MCP servers people see. Each view has its own URL. [LLM Instructions](./llm-instructions.md) and [API Workflows](./manage-api-workflows.md) are also set per view.

1. Sign in to the API Portal and AI Hub as an admin.
2. Open **Settings**.
3. Under **ORGANIZATION**, select **Views**.

The list columns are **Name**, **Handle**, and **Labels**.

## Add a view

Click **Add view**.

| Field | Description |
|---|---|
| **Name** | Required. The name of the view. |
| **Handle** | Required. The lowercase identifier used in the view URL. |
| **Labels** | Click a label to include it. APIs and MCP servers with these labels appear in this view. |

Create labels first if the label list is empty. See [Manage Labels](./manage-labels.md).

## Editing a view
Click a view's name (or the pencil icon) in the Views table to reopen the same form, update its name or label selection, and click Save changes. The handle can't be changed after creation.

## Deleting a view
Click the trash icon next to a view and confirm. Deleting a view also removes its LLM Instructions and API Workflows-this can't be undone. The default view can't be deleted.
