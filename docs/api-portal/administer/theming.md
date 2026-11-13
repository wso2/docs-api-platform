---
title: "Theming"
description: "Customize the appearance of a view in the API Portal and AI Hub by downloading, editing, and uploading its theme."
---

**Theming** lets you customize the appearance of an individual [view](../admin-settings/manage-views.md) in the API Portal and AI Hub. You can download the theme currently applied to a view, modify its files, and upload the updated theme as a ZIP archive.

When you upload a theme, it completely replaces the existing custom theme files for that view.

## Access theming

1. Sign in to the API Portal and AI Hub as an admin.
2. Go to **Settings**.
3. Under **APPEARANCE**, select **Theming**.

Use the view selector to choose the view you want to customize. The page indicates which view you are editing.

The **Current theme** section shows whether the selected view uses the built-in default theme or a custom theme.

## Download the theme

1. Select the view you want to customize.
2. Click **Download theme**.

The downloaded ZIP archive contains a folder named after the selected view (for example, `default`). This folder contains the theme files organized into the following directories:

- `styles/` – Stylesheets.
- `layout/` – Layout templates.
- `partials/` – Reusable template components.
- `images/` – Theme images.
- `pages/` – Page templates.

If the selected view does not have a custom theme, the archive contains the built-in default theme.

## Customize the theme

1. Extract the downloaded ZIP archive.
2. Open the view folder and modify the files you want to customize.
3. Save your changes.

To customize the brand colors, update the seed values in `styles/main.css`:

- `--primary`
- `--primary-dark`
- `--primary-light`
- `--accent`
- `--accent-dark`
- `--accent-light`
- `--ink`

The remaining color palette is derived from these values.

After making your changes, compress the view folder into a ZIP archive.

**Ensure that the view folder remains the top-level directory in the ZIP archive.** For example, the archive should contain `default/styles/`, not `styles/` directly at the root. Otherwise, the theme layout will not be applied correctly.

The ZIP archive must not exceed 10 MB.

## Upload the theme

1. In **Settings > Theming**, select the view you want to update.
2. Choose your modified ZIP archive.
3. Click **Apply theme**.

   The **Apply theme** button becomes available after you select a ZIP file.

Uploading the archive replaces all existing custom theme files for the selected view.

Reload the API Portal or AI Hub to see the changes.

## Reset to the default theme

To remove the custom theme and restore the built-in default theme:

1. Select the relevant view in **Theming**.
2. Click **Reset to default**.

This removes the view's custom CSS, layout templates, partials, and images, and restores the built-in theme.