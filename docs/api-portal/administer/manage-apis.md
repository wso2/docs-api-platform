---
title: "Manage APIs"
description: "Add, edit, and remove the APIs that are visible in the API Portal and AI Hub."
---

**APIs** under **Settings** is where you add, edit, and remove the APIs that this portal shows.

1. Sign in to the API Portal and AI Hub as an administrator.
2. Open **Settings**.
3. Under **CONTENT**, select **APIs**.

## Add an API

Click **Add API**. The wizard has three steps: **Details**, **Spec**, and **Assets**.

### Details

| Field | Description |
|---|---|
| **Thumbnail** | A PNG or JPG image for the API. |
| **Name** | Required. |
| **Version** | Required. |
| **Handle (URL slug)** | Required. It is generated from the name and version. You can edit it before the API is created. It cannot be changed after that. |
| **API type** | Required. **REST**, **WebSocket**, or **GraphQL**. |
| **Agent visibility** | **Visible** or **Hidden**. |
| **Status** | **Published** or **Deprecated**. |
| **Description** | Text shown with the API. |
| **Production URL** and **Sandbox URL** | Where consumers send requests. |
| **Labels** | Click a label to toggle it. Labels control which views list this API. |
| **Tags** | Keywords for search. Press Enter or comma to add one. |
| **Technical owner**, **Technical owner email**, **Business owner**, **Business owner email** | Who consumers can contact. |
| **Subscription plans** | The plans consumers can choose when they subscribe. |

### Spec

Upload one specification file, up to 10 MB. A specification is required before you can continue. The page lists the accepted formats for the API type you selected.

### Assets

Add Markdown documents for the API, or import a content package. See [API content](./api-content.md).

Click **Next** to move through the steps. Click **Cancel** to leave without saving.

## Edit or delete an API

Open an API from the list to edit it. Select one or more rows and click **Delete selected** to remove them from the portal, including the specification and documentation.
