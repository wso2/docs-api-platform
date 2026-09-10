---
title: "Apply a theme to a view"
description: "Upload a theme ZIP to a view in the API Portal & MCP Hub, download the current theme, or reset to the built-in default."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/apply-a-theme/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/apply-a-theme.md
tags:
  - cloud
  - api-portal
  - theming
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Apply a theme

The **Theming** tab in the API Portal's Settings page is where you upload a theme to a view, download what's currently applied, and roll back to the built-in default.

This page covers the panel. To build the theme in the first place—which files you can override, how the color tokens work, and how to package the ZIP—see [Theming](theming.md).

Theming is configured **per view**: if your organization has more than one [view](manage-views.md), use the view switcher at the top of the panel to pick which one you're theming.

## Applying a custom theme

1. Navigate to **Settings** and select the **Theming** tab under **APPEARANCE**.
2. Pick the view you want to theme, if you have more than one.
3. Under **Upload Theme**, drag and drop (or browse to) a single ZIP archive, up to 10 MB.

    The archive must hold **one wrapper directory** containing the theme's folders—`my-theme/styles/`, `my-theme/layout/`, `my-theme/partials/`, `my-theme/pages/`, `my-theme/images/`—not those folders at the archive root. See [Package the theme](theming.md#package-the-theme); getting this wrong makes the layout silently not apply.

4. Click **Apply theme**.

!!! warning "Uploading replaces the current theme entirely"
    Applying a new ZIP replaces this view's existing custom theme files completely—it isn't merged with what was there before. Use **Download theme** first if you want a backup or a starting point to edit.

The panel's **Current theme** indicator shows whether the view is using a custom uploaded theme or the built-in default.

## Downloading the current theme

Click **Download theme** to get a ZIP of what's currently applied to the view. If the view has no custom theme, this downloads the built-in default theme instead—so it always gives you a valid starting point to customize.

## Resetting to the default theme

Click **Reset to default** to discard the view's custom theme files and revert to the built-in default. This can't be undone—download a copy first if you might want it again.

## API-level content

Theming here controls the view-wide look and feel. To change one API's overview body, set its icon, or attach documents, see [Customize an API's Content](api-content.md).

## Related

- [Theming](theming.md): build a theme, and the sample you can start from
- [Design Mode](design-mode.md): preview a theme before uploading it
- [Manage Views](manage-views.md): themes are scoped per view