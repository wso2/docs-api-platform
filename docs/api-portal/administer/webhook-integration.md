---
title: "Webhooks"
description: "Send a notification to your endpoint when API keys or subscriptions change in the organization."
---

**Webhooks** sends a notification to your endpoint when API keys or subscriptions change in this organization.

1. Sign in to the API Portal and AI Hub as an administrator.
2. Open **Settings**.
3. Under **INTEGRATIONS**, select **Webhooks**.

The list columns are **Name**, **Target URL**, **Events**, **Secret**, and **Enabled**. The secret is masked in the list.

## Add a webhook

Click **Add webhook**.

| Field | Description |
|---|---|
| **Name** | Required. |
| **Target URL** | Required. The endpoint that receives the events. |
| **Secret** | Required for a new webhook. It signs every payload with HMAC so you can verify the sender, and it encrypts the API key or token delivered with `apikey.*` and `subscription.*` events. When a secret is already set, leave the field blank to keep it, or enter a new value to replace it. |
| **Timeout (ms)** | How long the portal waits for your endpoint. |
| **Events** | **All events**, or **Select events**. |
| **Enabled** | Whether this webhook sends notifications. |

The event groups are:

| Group | Events |
|---|---|
| **Subscriptions** | Created, Updated, Deleted, Plan changed, Token regenerated, Billing updated |
| **API keys** | Generated, Regenerated, Revoked, Application updated |
| **Applications** | Created, Updated, Deleted |
| **Subscription plans** | Created, Updated, Deleted |
| **Meters** | Created, Updated, Deleted |

Click **Add webhook** to save. Click **Cancel** to leave the form, or **Back to webhooks** to return to the list.
