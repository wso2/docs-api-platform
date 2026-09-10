---
title: "Theming the API Portal & MCP Hub"
description: "Build a custom theme for a view—override styles, layouts, partials, and pages, re-color the portal from a few seed variables, and package it for upload."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/theming/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/theming.md
tags:
  - cloud
  - api-portal
  - theming
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Theming

A theme changes how a [view](manage-views.md) looks and behaves: its colors, page shell, header and footer, and the markup of individual pages. You build one as a directory of files, package it as a ZIP, and an admin applies it to a view.

Theming is scoped **per view**, so one organization can serve a branded partner portal and a plain internal one from the same catalog.

## How a theme works

The portal renders every page from a complete default template tree at `src/defaultContent/`. A theme is a **partial copy of that tree**: include only the files you want to change, and every file you leave out is served from the default automatically.

That has two consequences worth internalizing:

- **A theme is not just colors.** Any file under `src/defaultContent` can be overridden—this includes the page shell, partials, and the markup of individual pages.
- **You never fork the whole tree.** A color-only theme is one file. Adding a custom API listing is two.

### What you can override

These are the files the example theme replaces, and what each one governs:

| Path in the theme | Controls |
|---|---|
| `styles/main.css` | The portal-wide stylesheet, including the color tokens |
| `layout/main.hbs` | The outer HTML shell—`<head>`, page `<title>`, nav frame |
| `partials/header.hbs` | The top bar |
| `partials/footer.hbs` | The footer |
| `pages/home/partials/home.hbs` | The home page body |
| `pages/apis/partials/api-listing.hbs` | How APIs are listed, including the card markup |
| `pages/api-landing/partials/api-detail-banner.hbs` | The header block on an API's overview page |
| `images/` | Logo and other image assets. Optional, and the example below ships none |

Any other `pages/**/partials/*.hbs` file from the default tree works the same way—those are just the ones the example below uses.

!!! note
    JavaScript can't be added as a theme asset, and templates are validated on upload. Portal behavior comes from the portal's own scripts; a theme covers CSS, Handlebars templates, and images.

## Colors come from a few seeds

`styles/main.css` defines its palette as a small set of **seed** variables, with everything else **derived** from them through `color-mix()`. Change the seeds and the whole portal re-colors—text ramp, borders, surfaces, gradients, the dark hero and sidebar included.

The seeds are:

```css
:root {
  /* SEEDS · brand — these cascade everywhere */
  --primary:       #1a4c6d;   /* structure, links, focus, primary buttons */
  --primary-dark:  #043556;   /* primary hover / pressed / deep panels */
  --primary-light: #2b719f;   /* lifted primary states, on-dark highlights */
  --accent:        #fe8c3a;   /* solid highlights, badges, env dots, borders */
  --accent-dark:   #ef4223;
  --accent-light:  #ff8636;

  /* SEEDS · neutral foundation */
  --ink:     #1a2433;   /* darkest text — generates the whole grey ramp */
  --surface: #ffffff;   /* page background — the ramp mixes toward this */
  --white:   #ffffff;   /* fills on colored or dark surfaces */

  /* SEEDS · semantic — deliberately independent of the brand */
  --success: #2e7d32;
  --warning: #e39a00;
  --danger:  #c62828;
  --info:    #0277bd;
}
```

Everything below them in the file is derived, for example:

```css
--text:       color-mix(in srgb, var(--ink) 80%, var(--surface));
--border:     color-mix(in srgb, var(--ink) 12%, var(--surface));
--focus-ring: color-mix(in srgb, var(--primary) 40%, transparent);
```

So a re-color means editing the seed block and nothing else.

!!! important "Copy `main.css` whole"
    Don't replace `main.css` with just a `:root` override. It carries both the variables *and* the rule definitions, plus the `@import` statements that pull in the other stylesheets (`home.css`, `header.css`, and the rest). Those imported files are served from the defaults and don't need copying—but the file that imports them does.

## Example: a teal and coral theme

Here's a complete theme that re-colors the portal and replaces the wordmark, home hero, and API listing. It's seven files:

```text
my-theme/
├── styles/main.css                                 # seeds changed, plus a few custom rules
├── layout/main.hbs                                 # page shell and <title>
├── partials/header.hbs                             # text wordmark instead of the logo image
├── partials/footer.hbs                             # custom footer links
└── pages/
    ├── home/partials/home.hbs                      # custom hero copy
    ├── apis/partials/api-listing.hbs               # hero, plus a different card type and arrangement
    └── api-landing/partials/api-detail-banner.hbs   # custom API overview header
```

Everything else—the other pages, the sidebar, the imported stylesheets—is served from the defaults untouched.

### The color change

`styles/main.css` is a copy of the default with its seed block swapped. That single edit is the whole re-color:

```css
:root {
  /* SEEDS · brand — teal and coral instead of the default navy and orange */
  --primary:       #0f766e;
  --primary-dark:  #134e4a;
  --primary-light: #2dd4bf;
  --accent:        #fb7185;
  --accent-dark:   #e11d48;
  --accent-light:  #fda4af;

  /* SEEDS · neutral foundation — --ink generates the whole grey ramp */
  --ink:     #0e2a2a;
  --surface: #ffffff;
  --white:   #ffffff;
}
```

The dark hero, the sidebar gradient, borders, and the text ramp all follow from those, because they're derived rather than hardcoded.

### Replacing the wordmark

`partials/header.hbs` swaps the logo image for text and an icon, which shows that branding doesn't require shipping a new asset:

```handlebars
<a class="navbar-brand d-flex align-items-center brand-wordmark" href="{{ baseUrl }}">
  <i class="bi bi-water brand-wordmark-icon" aria-hidden="true"></i>
  <span class="brand-wordmark-text">Green</span>
</a>
```

The classes it introduces are styled by a small block appended to `main.css`, alongside the custom listing and overview treatments.

### Starting from it

A working copy of this theme sits at [`samples/layouts/green-theme/`](https://github.com/wso2/api-platform/tree/main/portals/api-portal/samples/layouts/green-theme) in the API Platform repository, and at the same path in the portal distribution. Copy it, change the seeds, and delete any override you don't want:

```bash
cp -r samples/layouts/green-theme/ my-theme/
```

## Build and preview

[Design Mode](design-mode.md) is the fastest way to iterate: it serves the portal from a theme directory on disk with sample data, no database or identity provider needed, and picks up file edits on reload.

Point it at your theme directory:

```toml
[api_portal.design_mode]
enabled = true
path_to_layout = "./my-theme/"
```

To preview the example above before editing it, point `path_to_layout` at `./samples/layouts/green-theme/`.

## Package the theme

The ZIP must contain **one wrapper directory** holding the theme, not the theme's folders at the root. Zip the directory from its parent:

```bash
zip -r my-theme.zip my-theme/
```

That produces `my-theme/styles/main.css`, `my-theme/layout/main.hbs`, and so on.

!!! warning "A wrapper directory is required"
    The portal classifies each file by the path *below* the first segment. Zipping from inside the theme directory—so that `layout/` and `styles/` sit at the ZIP root—makes `layout/main.hbs` register as a generic template rather than the page shell, and your layout silently won't apply.

Uploads are size-limited; see `uploads.max_bytes` in [Configurations](../references/configurations.md#uploads).

## Apply it

An admin uploads the ZIP to a view under **Settings** → **Theming**. Applying a theme replaces that view's existing theme files entirely rather than merging with them. See [Apply a Theme](theming.md) for the panel, and for downloading the current theme or resetting to the default.

## Theming vs. API content

A theme applies to every page in a view. To change one API's overview body—or set its icon, or attach documents—you upload content against that API instead, which leaves the rest of the view alone. See [Customize an API's Content](api-content.md).

## Related

- [Apply a Theme](theming.md): upload, download, and reset a view's theme
- [Design Mode](design-mode.md): preview a theme offline against sample data
- [Manage Views](manage-views.md): why themes are per-view
- [Customize an API's Content](api-content.md): change one API's overview body instead of the whole view
- [Configurations](../references/configurations.md#uploads): upload size limits