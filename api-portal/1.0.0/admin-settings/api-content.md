---
title: "Customize an API's content"
description: "Replace an API's generated overview page with your own Markdown or Handlebars body, set its icon, and attach downloadable documents."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/api-content/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/api-content.md
tags:
  - cloud
  - api-portal
  - theming
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Customize an API's content

By default, an API's [overview page](../discover-apis/browse-apis.md#open-an-api) is generated from its specification—Endpoints, Resources, Scopes, and the subscription plans panel. **API content** lets you replace that body with your own, per API, and attach the images and documents that go with it.

This is narrower than [theming](theming.md): a theme restyles every page in a view, while API content changes one API's overview body and leaves everything else alone.

## What you can upload

API content is a ZIP with up to two directories at its root:

```text
my-api-content/
├── web/          # the overview body, plus images
└── docs/         # downloadable documents, grouped into sections
```

At least one of the two must be present, or the upload is rejected.

## Replace the overview body

Put one of these files in `web/`:

| File | Behavior |
|---|---|
| `apiContent.md` | Markdown, rendered to HTML and used as the overview body |
| `api-content.hbs` | A Handlebars template, for markup the portal renders directly |

The portal looks for `apiContent.md` first, then `api-content.hbs`. Whichever it finds replaces the generated body entirely—the Endpoints, Resources, and Scopes sections stop appearing, so if you still want that information, include it yourself. With neither file present, the API falls back to the generated layout.

The subscription plans panel is **not** part of the body, so it keeps rendering either way.

!!! note
    `web/` is read one level deep. Subdirectories inside it are ignored, so keep every file flat.

### Accepted files in `web/`

- **Text:** `.html`, `.hbs`, `.md`, `.json`, `.yaml`, `.yml`
- **Images:** `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.ico`

Anything else is skipped silently.

## Set the API icon

Images in `web/` are registered under a tag taken from the filename without its extension. The catalog card and the overview header use the `api-icon` tag, so an image named `api-icon.png` in `web/` becomes that API's icon:

```text
web/
├── apiContent.md
└── api-icon.png     # becomes the API's icon in the catalog and header
```

Without it, the portal falls back to a generated avatar showing the first two letters of the API's name.

## Attach documents

Files under `docs/` become the documents listed on the API's [documentation page](../discover-apis/browse-apis.md#read-the-specification-and-try-it), and are served to AI agents as raw Markdown.

The **first-level directory name becomes the section heading** in the documentation navigation. Files placed directly in `docs/` land in a section called **Other**:

```text
docs/
├── getting-started.md          # appears under "Other"
├── How to/
│   ├── authenticate.md         # appears under "How to"
│   └── paginate.md
└── Reference/
    └── error-codes.md          # appears under "Reference"
```

## Upload it

API content is the fourth step of the API wizard, and it's available only once the API exists—so create the API first, then reopen it to add content.

1. Go to **Settings** and select **APIs** under **CONTENT** (or **MCP Servers**, for an MCP server).
2. Click the **⋮** menu on the API's row and select **Edit**.
3. Go to the **Content** step.
4. Drop in your ZIP and click **Upload content**.

Uploading is immediate and independent of **Save changes** on the other steps.

Files are merged rather than replaced wholesale: a file whose name matches one already stored overwrites it, and everything else is added. To remove a file, delete it through the [API Content](../rest-api/api-content.md) Management API.

!!! note "The wrapper directory is optional here"
    A single top-level folder containing `web/` and `docs/` is fine, and so is `web/` and `docs/` sitting at the ZIP root—the portal accepts both. This differs from a [theme ZIP](theming.md#package-the-theme), which requires the wrapper.

## Preview before uploading

In [design mode](design-mode.md), an API's content lives beside its manifest in the samples directory, so you can iterate on the body with a browser reload:

```text
samples/apis/my-api-v1.0/
├── api.yaml
├── definition.yaml
├── docs/
│   └── getting-started.md
└── web/
    ├── apiContent.md
    └── api-icon.png
```

## Related

- [API Overview](../discover-apis/browse-apis.md#open-an-api): the generated page your content replaces
- [API Documentation](../discover-apis/browse-apis.md#read-the-specification-and-try-it): where `docs/` files surface
- [Theming](theming.md): restyle every page in a view, rather than one API's body
- [Manage APIs](manage-apis.md): the wizard this is the last step of
- [API Content](../rest-api/api-content.md): upload, replace, and delete content through the Management API