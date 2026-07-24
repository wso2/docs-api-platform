---
title: "Configure webhooks in the Developer Portal"
description: "Register endpoints to receive signed, real-time notifications when API keys or subscriptions change in the Developer Portal."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/webhook-integration/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/admin-settings/webhook-integration.md
tags:
  - cloud
  - devportal
  - webhooks
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-23
content_type: "how-to"
---

# Webhooks

The Developer Portal doesn't talk to a gateway directly. Instead, it publishes a signed HTTP POST to every webhook endpoint you register whenever an API key or subscription changes — a handler you run behind that endpoint decides what to do next, typically propagating the change to your API Gateway so access is enforced immediately (for example, rejecting a key the moment a developer revokes it).

## Adding a Webhook

1. Navigate to **Settings** and select the **Webhooks** tab under **INTEGRATIONS**.
2. Click **+ Add webhook**.
3. Fill in the fields:

| Field | Description |
|---|---|
| **Display name** | Name shown in the Webhooks table |
| **Handle** | Lowercase identifier used internally |
| **Target URL** | The HTTPS endpoint that receives webhook POSTs |
| **Secret** | Optional. Minimum 32 characters, used to sign each delivery with HMAC-SHA256. Never shown again after saving — leave blank on edit to keep the existing value |
| **Timeout (ms)** | Request timeout for each delivery attempt (default 5000) |
| **Public key** | Optional PEM-encoded RSA public key used to encrypt sensitive fields (an API key or subscription token) carried in certain events, so only you can decrypt them |
| **Events** | **All events**, or **Select events** to choose an explicit allowlist |
| **Enabled** | Disable a webhook without deleting it |

4. Click **Add webhook**.

!!! warning "Set a public key before production"
    If no public key is configured, sensitive fields (API key secrets, subscription tokens) are omitted from delivered events entirely rather than sent in plaintext. Configure a public key before relying on `apikey.generated`, `apikey.regenerated`, `subscription.created`, or `subscription.token_regenerated` payloads.

## Editing or Deleting a Webhook

Click a webhook's display name (or the pencil icon) to edit its fields. Click the trash icon to delete it — this can't be undone.

## Webhook Events

| Event | Fired when | Carries a sensitive field |
|---|---|---|
| `apikey.generated` | A new API key is generated for a subscription | Yes — the key secret |
| `apikey.regenerated` | An existing API key is rotated | Yes — the new key secret |
| `apikey.revoked` | An API key is revoked | No |
| `apikey.application_updated` | A key's application association changes | No |
| `subscription.created` | A developer subscribes to an API | Yes — the subscription token |
| `subscription.updated` | A subscription's status changes (ACTIVE ↔ INACTIVE) | No |
| `subscription.plan_changed` | A subscription's plan is changed in-place | No |
| `subscription.token_regenerated` | A subscription token is regenerated | Yes — the new token |
| `subscription.deleted` | A developer unsubscribes | No |
| `application.created` | A developer creates an application | No |
| `application.updated` | An application is renamed or its details change | No |
| `application.deleted` | An application is deleted | No |

Each delivery is attempted exactly once — there's no automatic retry, so make sure your endpoint is reliable and responds quickly within the configured timeout.

## Verifying Deliveries

If a secret is configured, every POST includes an `X-Devportal-Signature` header in the form `t=<unix_seconds>,v1=<hex_hmac>`, computed as `HMAC-SHA256(secret, "<t>.<raw_body>")`. Reject deliveries where `|now - t|` exceeds a few minutes, to guard against replay.

Events carrying a sensitive field include an `encrypted_fields` array naming which fields in `data` are encrypted using hybrid RSA-OAEP + AES-256-GCM envelope encryption — decrypt each with the RSA private key matching the public key you configured on the webhook.
