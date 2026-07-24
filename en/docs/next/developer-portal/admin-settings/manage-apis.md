---
title: "Manage APIs in the Developer Portal"
description: "Add, edit, publish, deprecate, and delete the REST, WebSocket, GraphQL, WebSub, and SOAP APIs visible in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/manage-apis/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/manage-apis.md
tags:
  - cloud
  - devportal
  - publish-apis
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Manage APIs

The **APIs** tab in the Developer Portal's Settings page is where you add, edit, publish, deprecate, and delete the APIs visible in the portal catalog.

## Adding an API

1. Navigate to **Settings** and select the **APIs** tab under **CONTENT**.
2. Click **+ Add API**. A four-step wizard opens.

### Step 1: Details

| Field | Description |
|---|---|
| **API name** | Required |
| **Version** | Required (for example, `v1.0`) |
| **Handle (URL slug)** | Auto-generated from name and version; edit to override |
| **API type** | `REST`, `WebSocket`, `GraphQL`, `WebSub`, or `MCP` |
| **Agent visibility** | **Visible** includes the API in `llms.txt` and AI-agent discovery surfaces; **Hidden** excludes it while still showing it to human users |
| **Description** | Required — shown in the catalog and used as context for AI agents |
| **Production URL** | Required for most API types |
| **Sandbox URL** | Optional |
| **Labels** | Comma-separated labels controlling which [views](manage-views.md) show this API |
| **Status** | **Published** or **Deprecated** |
| **Technical owner / email**, **Business owner / email** | Ownership contacts shown on the API's detail page |
| **Applicable Subscription Plans** | Search and select which [subscription plans](subscription-plans.md) developers can subscribe under. Leave empty to make the API accessible without a plan |

Click **Next**.

### Step 2: Spec

Upload the contract that defines the API — required. Accepted formats: OpenAPI (`.json`/`.yaml`), AsyncAPI, GraphQL SDL (`.graphql`), or WSDL (`.wsdl`/`.xml`). Single file, up to 10 MB.

Click **Next**.

### Step 3: Documentation

Optionally upload one or more Markdown (`.md`) files as guides or reference docs for developers.

Click **Next** to create the API, or continue to Step 4 if you're editing an existing API.

### Step 4: Content (edit mode only)

Once an API exists, you can upload a ZIP to set its landing-page content: include a `web/` folder for landing-page assets (Markdown, HTML, CSS, JS, images) and/or a `docs/` folder for downloadable documents. Files with a matching name are replaced; others are added.

Click **Upload content** — this uploads immediately and is independent of **Save changes**.

## Editing an API

Click the **⋮** menu on an API's row and select **Edit** to reopen the wizard, prefilled with its current details, spec, documentation, and content.

## Publishing and Deprecating

Use the **⋮** menu on an API's row:

- **Publish** — makes a draft or deprecated API live in the catalog
- **Deprecate** — keeps the API visible but marked as deprecated; you can publish it again at any time

## Deleting APIs

Use the **⋮** menu's **Delete** action to remove a single API, or select multiple rows with the checkboxes to reveal a bulk action bar with **Delete selected**. Deleting an API removes it from the portal along with its spec and documentation — this can't be undone.
