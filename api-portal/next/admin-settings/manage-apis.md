---
title: "Manage APIs in the API Portal & MCP Hub"
description: "Add, edit, publish, deprecate, and delete the REST, WebSocket, GraphQL, WebSub, and SOAP APIs visible in the API Portal & MCP Hub."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/manage-apis/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/manage-apis.md
tags:
  - cloud
  - api-portal
  - publish-apis
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Manage APIs

The **APIs** tab in the API Portal's Settings page is where you add, edit, publish, deprecate, and delete the APIs visible in the portal catalog.

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
| **Description** | Required—shown in the catalog and used as context for AI agents |
| **Production URL** | Required for most API types |
| **Sandbox URL** | Optional |
| **Labels** | A toggle picker of the labels defined in your organization. Selected labels control which [views](manage-views.md) show this API. Empty until you create labels under [Manage Labels](manage-labels.md) |
| **Tags** | Comma-separated free-text keywords for search and discovery. Unlike labels, they don't affect visibility |
| **Status** | **Published** or **Deprecated** |
| **Technical owner / email**, **Business owner / email** | Ownership contacts shown on the API's detail page |
| **Applicable Subscription Plans** | Search and select which [subscription plans](subscription-plans.md) developers can subscribe under. Leave empty to make the API accessible without a plan |

Click **Next**.

### Step 2: Spec

Upload the contract that defines the API. One file is required, and the format follows the API type you chose in step 1:

| API type | Contract |
|---|---|
| REST | OpenAPI, as `.json`, `.yaml`, or `.yml` |
| WebSocket, WebSub | AsyncAPI, as `.json`, `.yaml`, or `.yml` |
| GraphQL | A GraphQL schema, as `.graphql` or `.gql` |
| MCP | A flat, type-tagged list of tools, resources, and prompts, as `.yaml` or `.yml`. See [Manage MCP servers](manage-mcp-servers.md#adding-an-mcp-server) |

The file picker also accepts `.wsdl` and `.xml`, but **API type** offers no SOAP option, so you can't create a SOAP API here. Create those through the [Management API](../rest-api/apis.md) instead, posting `type: SOAP` with a WSDL definition.

Click **Next**.

### Step 3: Documentation

Optionally upload one or more Markdown files (`.md` or `.markdown`) as guides or reference docs for developers. These are what the portal serves as attached documents, both on the API's documentation page and to AI agents.

Click **Next** to create the API, or continue to Step 4 if you're editing an existing API.

### Step 4: Content (edit mode only)

Once an API exists, you can upload a ZIP holding a `web/` folder (the overview body and images), a `docs/` folder (downloadable documents), or both. Files with a matching name are replaced; others are added.

Click **Upload content**—this uploads immediately and is independent of **Save changes**.

For the file names the portal looks for, how the API icon is set, and how `docs/` subdirectories become documentation sections, see [Customize an API's Content](api-content.md).

## Editing an API

Click the **⋮** menu on an API's row and select **Edit** to reopen the wizard, prefilled with its current details, spec, documentation, and content.

## Publishing and deprecating

Use the **⋮** menu on an API's row:

- **Publish**—makes a draft or deprecated API live in the catalog
- **Deprecate**—keeps the API visible but marked as deprecated; you can publish it again at any time

## Deleting APIs

Use the **⋮** menu's **Delete** action to remove a single API, or select multiple rows with the checkboxes to reveal a bulk action bar with **Delete selected**. Deleting an API removes it from the portal along with its spec and documentation—this can't be undone.