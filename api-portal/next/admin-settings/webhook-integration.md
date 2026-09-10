---
title: "Configure webhooks in the API Portal & MCP Hub"
description: "Register endpoints to receive signed, real-time notifications when applications, API keys, or subscriptions change."
canonical_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/webhook-integration/
md_url: https://wso2.com/api-platform/docs/api-portal/admin-settings/webhook-integration.md
tags:
  - cloud
  - api-portal
  - webhooks
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-31
content_type: "how-to"
---

# Webhooks

The API Portal & MCP Hub doesn't talk to a gateway directly. Instead it publishes a signed HTTP POST to every endpoint you register whenever an application, API key, or subscription changes. Each delivery is signed when the subscriber has a secret; without one it arrives unsigned. Whatever is behind that endpoint decides what to do next. Most deployments register the Platform API control plane, which persists the change and propagates it to the gateways the API is deployed to, but a gateway or a handler of your own can subscribe just as well.

Enforcement is not immediate, and delivery alone doesn't guarantee it. It happens only once the subscriber accepts the event and acts on it. A timeout or a `non-2xx` response is terminal—there's no retry—so the change stays unenforced, and any queueing on the subscriber's side adds delay.

This page covers registering a subscriber. For the payload of every event, the delivery envelope, and how to verify and decrypt one, see the [Webhook Event Catalog](../references/webhook-event-catalog.md).

## Add a webhook

1. Go to **Settings** and select **Webhooks** under **INTEGRATIONS**.
2. Click **+ Add webhook**.
3. Fill in the fields:

    - **Display name**—required. The name shown in the Webhooks table.
    - **Target URL**—required. The endpoint that receives the POSTs.
    - **Secret**—required by this form. Used both to sign each delivery and to derive the key that encrypts credential fields. Never shown again after saving; leave it blank when editing to keep the existing value.
    - **Timeout (ms)**—how long to wait for a response before giving up. Defaults to 5000.
    - **Events**—**All events**, or **Select events** to pick an explicit allowlist. The picker groups them as Subscriptions, API keys, and Applications.
    - **Enabled**—turn a subscriber off without deleting it.

4. Click **Add webhook**.

!!! warning "Always set a secret"
    The secret does double duty: it signs each delivery and derives the key that encrypts credential fields. This form requires one, but the [Management API](../rest-api/webhook-subscribers.md) does not—only `displayName` and `targetUrl` are mandatory there, so a subscriber created programmatically can end up without a secret.

    Such a subscriber still receives events, with two consequences. Deliveries arrive unsigned, so you can't verify they came from the portal. And the four events that carry a credential arrive **without it**—the field is dropped rather than sent in plaintext. Set a secret before relying on `apikey.generated`, `apikey.regenerated`, `subscription.created`, or `subscription.token_regenerated`.

## Edit or delete a webhook

Click a webhook's display name, or the pencil icon, to edit it. Click the trash icon to delete it—that can't be undone.

## What gets delivered

The portal publishes twelve event types across three groups:

| Group | Events |
|---|---|
| Subscriptions | `created`, `updated`, `plan_changed`, `token_regenerated`, `deleted` |
| API keys | `generated`, `regenerated`, `revoked`, `application_updated` |
| Applications | `created`, `updated`, `deleted` |

Four of them carry a credential, encrypted with a key derived from your secret: `apikey.generated`, `apikey.regenerated`, `subscription.created`, and `subscription.token_regenerated`.

Each delivery carries an `X-Api-Portal-Signature` header and, where relevant, an `encrypted_fields` list naming the fields in `data` that hold an encrypted envelope. The [Webhook Event Catalog](../references/webhook-event-catalog.md) has the full payload for each event, the signature algorithm, and the decryption steps.

## Delivery behavior

Two things to design your endpoint around:

- **A delivery is attempted once.** Any `non-2xx` response, connection error, or timeout is terminal—there's no automatic retry. Make the endpoint reliable, and answer within the configured timeout.
- **Acknowledge fast, work later.** Return a `2xx` and do the propagation asynchronously, rather than holding the connection open while you call a gateway.

You can read delivery history, including failures and their HTTP status, through the Management API—see [Webhook Events](../rest-api/webhook-events.md).

## Related

- [Webhook Event Catalog](../references/webhook-event-catalog.md): every event's payload, headers, signing, and encryption
- [Webhook Subscribers](../rest-api/webhook-subscribers.md): manage subscribers through the Management API
- [Webhook Events](../rest-api/webhook-events.md): read delivery history through the Management API
- [Manage API Keys](../consume-an-api/manage-api-keys.md): the lifecycle behind the `apikey.*` events