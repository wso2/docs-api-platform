---
title: "API content"
description: "Add Markdown documents and an optional content package on the Assets step when you create or edit an API."
---

API content is the **Assets** step of [Manage APIs](./manage-apis.md). It is not a separate item in **Settings**.

On **Assets** you can upload Markdown (`.md`) files. The page lists what is already on the API and what is waiting to upload. You can change the documents later by editing the API.

## Import a content package

**Import content from ZIP** replaces the current documents, landing page, and thumbnail with the contents of one `.zip` file, up to 10 MB. The page shows this layout:

| Path in the ZIP | What it is |
|---|---|
| `web/api-content.md` or `web/api-content.hbs` | Landing page |
| `web/api-icon.png` or `web/api-icon.jpg` | Thumbnail |
| Other files under `web/` | Images used by the landing page |
| `docs/<file>.md` | A document in the category Other |
| `docs/<Category>/<file>.md` | A document in that category |

Confirm the import only when you want that replacement. **Choose another file** picks a different ZIP. **Back to uploading documents** returns to the Markdown upload.
