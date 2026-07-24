---
title: "Manage views in the Developer Portal"
description: "Create, edit, and delete views to scope which labelled APIs are visible to different audiences in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/manage-views/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/manage-views.md
tags:
  - cloud
  - devportal
  - views
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Manage Views

A **view** is a filtered, branded subset of an organization's APIs — for example, `public` for external developers and `internal` for internal teams. Each view has its own URL (`/<orgHandle>/views/<viewName>`) and shows only the APIs tagged with its assigned labels. [LLM Instructions](llm-instructions.md) and [API Workflows](managing-api-workflows.md) are also configured per view.

## Adding a View

1. Navigate to **Settings** and select the **Views** tab under **ORGANIZATION**.
2. Click **+ Add view**.
3. Fill in the fields:

| Field | Description |
|---|---|
| **Handle** | Lowercase identifier used in the view's URL. Can't be changed later |
| **Name** | Human-friendly name shown in the portal header |
| **Labels** | Click to toggle which labels this view includes. Only APIs carrying at least one of these labels appear in the view |

4. Click **Add view**.

!!! note
    If no labels exist yet, create them first under [Manage Labels](manage-labels.md) — the label picker is empty until at least one label exists.

## Editing a View

Click a view's name (or the pencil icon) in the **Views** table to reopen the same form, update its name or label selection, and click **Save changes**. The handle can't be changed after creation.

## Deleting a View

Click the trash icon next to a view and confirm. Deleting a view also removes its LLM Instructions and API Workflows — this can't be undone.

!!! note
    The `default` view can't be deleted.
