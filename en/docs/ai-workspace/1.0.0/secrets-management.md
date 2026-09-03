---
title: "Secrets management"
description: "Store and manage encrypted secrets in AI Workspace and reference them securely in artifact configurations without exposing plaintext credentials."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/secrets-management/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/secrets-management.md
tags:
  - cloud
  - ai-workspace
  - secrets
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-07
content_type: "how-to"
---

# Secrets management

AI Workspace lets you store sensitive credentials as **secrets** and reference them securely in artifact configurations. Secrets are encrypted at rest using the Advanced Encryption Standard with 256-bit keys in Galois/Counter Mode (AES-256-GCM). Plaintext values are never written to the database and are **never returned in any API response**—not even the creation response.

Use secrets to keep raw API keys, tokens, and passwords out of your artifact configurations. They apply to the following:

- Large language model (LLM) provider configurations
- Model Context Protocol (MCP) proxy configurations
- API backend settings

!!! important "Not the same as `config.toml` interpolation"
    Secrets apply to artifact configurations only, and the gateway resolves the {% raw %}`{{ secret "handle" }}`{% endraw %} placeholder at request time. The services have their own startup credentials: the database password, the OpenID Connect (OIDC) client secret, and the at-rest encryption key. Those are supplied through the separate {% raw %}`{{ env }}`{% endraw %} and {% raw %}`{{ file }}`{% endraw %} tokens in `config.toml`. See [Sensitive values in `config.toml`](setting-up/configuration.md#sensitive-values-in-configtoml). The two placeholder sets aren't interchangeable.

## How it works

1. Create a secret via the Platform API with a unique `handle` and the plaintext `value`.
2. Reference the secret in any artifact configuration using the placeholder syntax:
    {% raw %}
    ```text
    {{ secret "your-secret-handle" }}
    ```
    {% endraw %}
3. When an artifact that contains a placeholder is deployed, the gateway resolves it with the decrypted value at runtime — the plaintext never appears in the control-plane database or configuration files.
4. To rotate a credential, call `PUT /api/v0.9/secrets/{secretId}` with the new value. Because artifacts reference the secret by handle, no artifact changes or redeployment are required.

## Automatic encryption in the AI Workspace UI

When you create or update an **LLM Provider** or **MCP Proxy** through the AI Workspace UI and fill in an upstream API key or auth value, the UI automatically:

1. Creates a secret via `POST /api/v0.9/secrets` using a deterministic handle derived from the resource ID (for example, `wso2-openai-provider-api-key`).
2. Substitutes the credential with the {% raw %}`{{ secret "handle" }}`{% endraw %} placeholder before saving the resource.

The raw credential is sent to the secrets API only once and is never stored in the artifact configuration. Re-saving a resource that already contains a placeholder skips the secret creation step.

## API reference

The secrets API is available at `/api/v0.9/secrets`. All requests require a valid JSON Web Token (JWT) with the appropriate scope.

### Required scopes

| Scope              | Grants                                   |
|--------------------|------------------------------------------|
| `ap:secret:read`   | List secrets and get metadata by handle  |
| `ap:secret:create` | Create a new secret                      |
| `ap:secret:update` | Rotate or update a stored secret value |
| `ap:secret:delete` | Delete a secret                          |
| `ap:secret:manage` | All of the above                         |

### Create a secret

```http
POST /api/v0.9/secrets
Content-Type: multipart/form-data
```

Stores a new encrypted secret. The plaintext value is never returned — not even in this response.

!!! note "Why multipart/form-data?"
    `multipart/form-data` carries the `value` field as arbitrary content, so the same endpoint accepts text and binary secrets under one content type.

**Request fields**

| Field | Required | Description |
|-------|----------|-------------|
| `displayName` | Yes | Human-readable display name for the secret. |
| `value` | Yes | The sensitive value to encrypt and store. |
| `id` | No | Handle (slug) that identifies the secret within the organization. Used in {% raw %}`{{ secret "id" }}`{% endraw %} references. Generated from `displayName` when omitted, and immutable after creation. |
| `description` | No | Optional description. |
| `type` | No | Secret type, either `GENERIC` (default) for API keys and tokens, or `CERTIFICATE`. |

**Example request**

```http
POST /api/v0.9/secrets
Authorization: Bearer <JWT>
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="id"

wso2-openai-key
------FormBoundary
Content-Disposition: form-data; name="displayName"

WSO2 OpenAI API Key
------FormBoundary
Content-Disposition: form-data; name="description"

API key for WSO2 OpenAI integration
------FormBoundary
Content-Disposition: form-data; name="type"

GENERIC
------FormBoundary
Content-Disposition: form-data; name="value"

sk-xxx
------FormBoundary--
```

**Response — 201 Created**

```json
{
  "id": "wso2-openai-key",
  "displayName": "WSO2 OpenAI API Key",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2026-01-12T10:00:00Z",
  "updatedAt": "2026-01-12T10:00:00Z"
}
```

The response doesn't include the `value`. Store the plaintext in a secure location before submitting it—you can't retrieve it later.

**Error responses**

| Status | Reason |
|--------|--------|
| 400 | Missing required fields or invalid request |
| 409 | A secret with the same `id` already exists in the organization |

### List secrets

```http
GET /api/v0.9/secrets
```

Returns metadata for all secrets in the organization. Plaintext values are never included.

**Query parameters**

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `limit` | 20 | 100 | Maximum number of results to return |
| `offset` | 0 | — | Number of results to skip for pagination |
| `updatedAfter` | — | — | RFC 3339 timestamp. Returns only secrets updated after this time. |

**Response — 200 OK**

```json
{
  "count": 1,
  "list": [
    {
      "id": "wso2-openai-key",
      "displayName": "WSO2 OpenAI API Key",
      "description": "API key for WSO2 OpenAI integration",
      "type": "GENERIC",
      "provider": "IN_BUILT",
      "status": "ACTIVE",
      "hash": "hmac-sha256:b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576d4b3d4c57e3f428a",
      "createdBy": "john.doe",
      "createdAt": "2026-01-12T10:00:00Z",
      "updatedAt": "2026-01-12T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### Get secret metadata

```http
GET /api/v0.9/secrets/{secretId}
```

Returns metadata for a single secret. The plaintext value isn't included.

**Response — 200 OK**

```json
{
  "id": "wso2-openai-key",
  "displayName": "WSO2 OpenAI API Key",
  "description": "API key for WSO2 OpenAI integration",
  "type": "GENERIC",
  "provider": "IN_BUILT",
  "status": "ACTIVE",
  "hash": "hmac-sha256:b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576d4b3d4c57e3f428a",
  "createdBy": "john.doe",
  "createdAt": "2026-01-12T10:00:00Z",
  "updatedAt": "2026-01-12T10:00:00Z"
}
```

**Error responses**

| Status | Reason |
|--------|--------|
| 404 | No secret found with the given handle in this organization |

### Rotate a secret

```http
PUT /api/v0.9/secrets/{secretId}
Content-Type: multipart/form-data
```

Re-encrypts and stores a new value. Because `id` is immutable, all {% raw %}`{{ secret "id" }}`{% endraw %} placeholders across existing resources remain valid without modification. The plaintext value isn't returned in the response.

**Request fields**

| Field | Required | Description |
|-------|----------|-------------|
| `displayName` | Yes | Display name for the secret. |
| `value` | Yes | The new sensitive value to encrypt and store. |
| `description` | No | Updated description. |
| `id` | No | Secret handle. When supplied it must match the path parameter, otherwise the request fails with `400`. The handle cannot be changed by an update. |

**Example request**

```http
PUT /api/v0.9/secrets/wso2-openai-key
Authorization: Bearer <JWT>
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="value"

sk-new-value
------FormBoundary
Content-Disposition: form-data; name="displayName"

WSO2 OpenAI API Key (rotated)
------FormBoundary
Content-Disposition: form-data; name="description"

Rotated on 2026-06-26 — old key decommissioned
------FormBoundary--
```

**Response — 200 OK**

```json
{
  "id": "wso2-openai-key",
  "displayName": "WSO2 OpenAI API Key (rotated)",
  "createdBy": "john.doe",
  "updatedBy": "john.doe",
  "createdAt": "2026-01-12T10:00:00Z",
  "updatedAt": "2026-06-26T11:30:00Z"
}
```

**Notes**

- If the secret's status is `DEPRECATED` (previously soft-deleted), a successful rotation sets it back to `ACTIVE`. New resources can reference the secret again, and the gateway includes it in the next sync.
- The gateway picks up the updated value on its next sync cycle — no redeployment of referencing artifacts is required.

**Error responses**

| Status | Reason |
|--------|--------|
| 404 | No secret found with the given handle |

### Delete a secret

```http
DELETE /api/v0.9/secrets/{secretId}
```

Soft-deletes a secret by setting its status to `DEPRECATED`. Deletion is blocked with `409 Conflict` if any artifact references the secret — either in its saved configuration or in a snapshot deployed to a gateway.

**Response — 204 No Content**

**Error responses**

| Status | Reason |
|--------|--------|
| 404 | No secret found with the given handle |
| 409 | Secret is still referenced by one or more artifacts |

**409 response example**

```json
{
  "status": "error",
  "code": "SECRET_IN_USE",
  "message": "The secret is referenced by one or more active resources.",
  "details": {
    "references": [
      { "type": "llm_provider", "handle": "openai-provider", "name": "OpenAI Provider" },
      { "type": "mcp_proxy",    "handle": "my-mcp-proxy",    "name": "My MCP Proxy" }
    ]
  }
}
```

Every Platform API error uses this shape: a literal `status` of `error`, a stable machine-readable
`code`, a human-readable `message`, and — depending on the condition — `errors`, `details`, or a
`trackingId`. Branch on `code`, not on the HTTP status.

---

## Reference a secret in an artifact configuration

Use the following placeholder syntax wherever a configuration field accepts a sensitive string value:

{% raw %}
```text
{{ secret "your-secret-handle" }}
```
{% endraw %}

**Example — LLM provider upstream API key**

{% raw %}
```yaml
spec:
  upstream:
    auth:
      type: api-key
      header: Authorization
      value: 'Bearer {{ secret "wso2-openai-key" }}'
```
{% endraw %}

**Validation at save time**

When creating or updating any resource that contains {% raw %}`{{ secret "..." }}`{% endraw %} references, the Platform API validates that an active secret with the referenced handle exists in the organization. If any placeholder can't be resolved, the request is rejected with `400 Bad Request` and the list of unresolvable handles.

## Rotate a credential

To rotate a credential without touching artifact configurations:

1. Call `PUT /api/v0.9/secrets/{secretId}` with the new value.
2. The gateway picks up the updated secret on the next sync cycle.

No artifact changes or redeployment are required because resources reference the secret by handle, not by value.

## Delete a secret safely

Deleting a secret that's still in use returns HTTP 409. To remove it cleanly:

1. Inspect the `references` list in the 409 response.
2. Update each referencing artifact to remove or replace the {% raw %}`{{ secret "handle" }}`{% endraw %} reference.
3. Redeploy the updated artifacts to the gateway.
4. Retry `DELETE /api/v0.9/secrets/{secretId}`.

## Encryption key

Secrets are encrypted at rest with the Platform API's at-rest encryption key, which also protects subscription tokens. The setup script provisions this key for Docker Compose deployments. For how to generate, mount, and reference it, see [Provision the at-rest encryption key manually](./setting-up/configuration.md#provision-the-at-rest-encryption-key-manually).

!!! warning
    Use the same encryption key across restarts and across all replicas. Changing or rotating it makes previously-encrypted secrets unreadable.
