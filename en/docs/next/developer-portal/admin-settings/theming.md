---
title: "Theme the Developer Portal"
description: "Upload, download, and reset a custom theme (styles, layout, partials, and images) for a view in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/theming/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/theming.md
tags:
  - cloud
  - devportal
  - theming
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Theming

The **Theming** tab in the Developer Portal's Settings page lets you replace a view's look and feel — colors, layout, partials, and images — by uploading a ZIP archive, and roll back to the built-in default at any time.

Theming is configured **per view**: if your organization has more than one [view](manage-views.md), use the view switcher at the top of the panel to pick which one you're theming.

## Applying a Custom Theme

1. Navigate to **Settings** and select the **Theming** tab under **APPEARANCE**.
2. Pick the view you want to theme, if you have more than one.
3. Under **Upload Theme**, drag and drop (or browse to) a single ZIP archive containing any of:

    - `styles/` — CSS
    - `layout/` — the Handlebars layout template controlling page structure
    - `partials/` — Handlebars partials
    - `images/` — logo and other image assets

    Up to 10 MB.

4. Click **Apply theme**.

!!! warning "Uploading replaces the current theme entirely"
    Applying a new ZIP replaces this view's existing custom theme files completely — it isn't merged with what was there before. Use **Download theme** first if you want a backup or a starting point to edit.

The panel's **Current theme** indicator shows whether the view is using a custom uploaded theme or the built-in default.

## Downloading the Current Theme

Click **Download theme** to get a ZIP of what's currently applied to the view. If the view has no custom theme, this downloads the built-in default theme instead — so it always gives you a valid starting point to customize.

## Resetting to the Default Theme

Click **Reset to default** to discard the view's custom theme files and revert to the built-in default. This can't be undone — download a copy first if you might want it again.

## API-Level Content

Theming here controls the view-wide look and feel. To customize an individual API's landing page content (its own documentation, description, and assets), see [Manage APIs](manage-apis.md#step-3-documentation).
