---
title: "Manage labels in the Developer Portal"
description: "Create, edit, and delete labels used to group APIs so that views can control which APIs are visible to consumers."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/manage-labels/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/manage-labels.md
tags:
  - cloud
  - devportal
  - labels
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Manage Labels

A **label** is a tag assigned to APIs so that [views](manage-views.md) can control which APIs they make visible. An API tagged `internal` only appears in views that include the `internal` label.

## Adding a Label

1. Navigate to **Settings** and select the **Labels** tab under **ORGANIZATION**.
2. Click **+ Add label**.
3. Fill in the fields:

| Field | Description |
|---|---|
| **Display name** | Human-friendly label name shown in the portal UI |
| **Name** | Lowercase identifier used internally and matched against view label lists |

4. Click **Add label**.

## Editing a Label

Click a label's display name (or the pencil icon) in the **Labels** table, update the display name or name, and save.

## Deleting a Label

Click the trash icon next to a label and confirm. Deleting a label removes it from every API it's currently assigned to — this can't be undone.

## Applying Labels

Assign labels to an API from the **Labels & Visibility** section of the [Manage APIs](manage-apis.md) wizard, then attach the same labels to a view under [Manage Views](manage-views.md) to control where the API appears.
