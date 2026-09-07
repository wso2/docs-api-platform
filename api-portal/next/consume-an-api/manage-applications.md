---
title: "Manage applications in the API Portal & MCP Hub"
description: "Create an application to hold OAuth2 client IDs, edit its name and description, associate API keys for analytics, and delete it."
canonical_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/manage-applications/
md_url: https://wso2.com/api-platform/docs/api-portal/consume-an-api/manage-applications.md
tags:
  - cloud
  - api-portal
  - applications
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Manage applications

An application is a logical stand-in for a physical one—a mobile app, web app, device, or CLI tool. In the API Portal & MCP Hub it does one job: it holds the OAuth2 client IDs, created in a key manager, that you use to call OAuth2-secured APIs.

Applications belong to you. Each developer sees only their own, and you can keep as many as you need—a `MyApp-Production` application and a `MyApp-Staging` application, say, linked to different OAuth applications in the key manager.

!!! note
    An application is **required** for OAuth2-secured APIs, since it's what holds the client ID. It's **optional** everywhere else. [Subscriptions](manage-subscriptions.md) are made directly to an API, and [API keys](manage-api-keys.md) are bound to an API, so neither needs one. You can associate an existing API key with an application for usage analytics, which changes nothing about the key.

## Create an application

1. Sign in to the API Portal & MCP Hub.
2. Click **Applications** in the sidebar.
3. Click **Create application**. On an empty **Applications** page the button sits in the middle of the page rather than the header.
4. Enter an **Application name**, up to 100 characters. This is the only required field.
5. Optionally add a **Description**, up to 256 characters.
6. Click **Create**.

The new application appears in the list. The portal derives a URL handle from the name—lowercased, with spaces and underscores turned into hyphens—and that handle has to be unique in your organization, so creating a second application with the same name fails.

## Open an application

Click an application's card. The detail page is one scrolling page with three sections:

| Section | What it holds |
|---|---|
| Header | The name and description, each editable in place |
| **Manage Keys** | Per-environment OAuth2 credentials, one card per key manager, with **Credentials**, **Generate Token**, and **cURL** tabs |
| **API keys** | Existing API keys associated with this application, for analytics |

## Edit the name or description

Both fields edit in place on the detail page:

1. Click the pencil icon next to the name, or next to the description. When the application has no description yet, click **+ Add description** instead.
2. Type your change.
3. Click the checkmark to save, or the cross to cancel.

## Link OAuth2 credentials

The **Manage Keys** section is where you paste a client ID from your key manager and generate access tokens against it. That's the whole reason applications exist—see [Consume an API Secured with OAuth2](oauth2.md) for the full sequence.

## Associate an API key

Associating a key with an application attributes its usage in analytics. It has no effect on whether the key works, and no effect on what the application can do.

1. On the detail page, scroll to **API keys**.
2. Click **Associate existing key**.
3. Choose an **API**, then choose one of your existing keys for that API.
4. Click **Associate**.

The key appears in the table with its name, API, and status. Click **Remove** on a row to drop the association; the key itself keeps working. See [Manage API Keys](manage-api-keys.md) for generating keys in the first place.

## Delete an application

1. Go to **Applications** in the sidebar.
2. Click the trash icon on the application's card.
3. Click **Delete** to confirm.

Deleting is irreversible, and it's narrower than the confirmation dialog suggests. What it actually does:

- **Removes the client ID mappings** the portal held for that application. Any of your APIs that relied on tokens from those credentials stop working once the tokens expire.
- **Dissociates any API keys** that were linked to it. The keys themselves survive and keep working—only the analytics association goes.
- **Leaves your subscriptions untouched.** Subscriptions are held against the API, not the application, so they're unaffected either way.
- **Doesn't contact the key manager.** The OAuth application there stays exactly as it was, and access tokens already issued stay valid until they expire. To invalidate those, use the key manager's own console or revocation endpoint.

## Related

- [Consume an API Secured with OAuth2](oauth2.md): link a client ID and generate an access token
- [Manage Subscriptions](manage-subscriptions.md): subscriptions are made directly to an API, not through an application
- [Manage API Keys](manage-api-keys.md): generate a key and optionally associate it with an application
- [Key Manager Integration](../admin-settings/key-manager-integration.md): admin guide for connecting key managers
- [Webhook Event Catalog](../references/webhook-event-catalog.md): the `application.*` events, and what deletion does to associated keys