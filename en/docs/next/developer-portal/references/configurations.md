---
title: "Developer Portal configuration reference"
description: "How the Developer Portal loads config.toml, injects environment values through interpolation tokens, and the full reference of every supported configuration key."
canonical_url: https://wso2.com/api-platform/docs/cloud/devportal/references/configurations/
md_url: https://wso2.com/api-platform/docs/cloud/devportal/references/configurations.md
tags:
  - cloud
  - devportal
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "reference"
---

# Configurations

The Developer Portal reads its configuration from `configs/config.toml`, layered over built-in defaults (`src/config/configDefaults.js`). This page explains how that file is loaded, how environment values are injected through interpolation tokens, and gives the full reference of every supported key.

{% raw %}

## How Configuration Is Loaded

Precedence, lowest to highest:

1. Built-in defaults (`src/config/configDefaults.js`)
2. `configs/config.toml`, with any `{{ env }}` / `{{ file }}` references resolved

`configs/config-template.toml` documents every supported key with its default value as plain literals — a reference copy, not the file the portal actually reads.

!!! important "Environment variables do not override config keys directly"
    There is no automatic `APIP_DP_*` prefix that maps environment variables onto config keys. An environment value reaches a setting **only** through an explicit interpolation token written into `config.toml`, resolved when the file loads. A field with no token always takes its literal TOML value (or the built-in default).

## Interpolation Tokens

| Token | Behavior |
|---|---|
| `{{ env "NAME" }}` | Substitutes the value of environment variable `NAME`. **Fails closed** (aborts startup) if `NAME` is unset or empty — it does not fall through to a default. |
| `{{ env "NAME" "default" }}` | Substitutes `NAME`'s value if set and non-empty, else the literal `"default"`. |
| `{{ file "/path" }}` | Reads a secret value from a mounted file at `/path`, trimmed. Always required — a missing, unreadable, oversized, or disallowed path is a hard startup error. |

An example from the shipped `config.toml`:

```toml
[developer_portal.security]
encryption_key = '{{ env "APIP_DP_SECURITY_ENCRYPTION_KEY" }}'
session_secret = '{{ env "APIP_DP_SECURITY_SESSION_SECRET" }}'
```

Partial substitution works too — `'foo-{{ env "X" }}'` resolves to `"foo-bar"` if `X=bar`.

!!! note "`{{ file }}` path allowlist"
    `{{ file "/path" }}` only reads from `/etc/devportal` or `/secrets/devportal` by default. Override with the `APIP_CONFIG_FILE_SOURCE_ALLOWLIST` environment variable (comma-separated directories) — read directly from the process environment rather than through `{{ env }}`, since it gates interpolation itself.

## Server

```toml
[developer_portal.server]
base_url = '{{ env "APIP_DP_SERVER_BASE_URL" "https://localhost:3000" }}'
port = 3000

[developer_portal.server.https]
enabled = false
cert_file = "./resources/security/client-truststore.pem"
key_file = "./resources/security/private-key.pem"
```

| Key | Default | Description |
|---|---|---|
| `server.base_url` | `https://localhost:3000` | Canonical public origin, used only to build absolute URLs embedded in generated agent prompts |
| `server.port` | `3000` | Single listener port |
| `server.https.enabled` | `false` | Whether the listener terminates TLS itself. Set `false` only when a trusted upstream (proxy/LB/ingress) terminates TLS |
| `server.https.cert_file` / `key_file` | — | Required only when `https.enabled = true` — no self-signed fallback |

{% endraw %}

## Logging

```toml
[developer_portal.logging]
level = "info"          # debug | info | warn | error
format = "text"         # text | json
console_only = true     # true: stdout only. false: also write rotating log files to disk
```

## Database

```toml
[developer_portal.database]
driver = "sqlite"             # sqlite | postgres | mssql
path = "./devportal.db"       # SQLite only
host = "localhost"            # PostgreSQL / MSSQL only
port = 5432                   # PostgreSQL / MSSQL only (1433 for MSSQL)
name = "devportal"            # PostgreSQL / MSSQL only
user = "postgres"             # PostgreSQL / MSSQL only
password = ""                 # PostgreSQL / MSSQL only
ssl_mode = "disable"          # PostgreSQL / MSSQL only: disable | verify-full
ssl_root_cert = "./resources/security/ca.pem"
max_open_conns = 50
min_open_conns = 2
pool_idle_timeout_ms = 10000
pool_connection_timeout_ms = 30000
pool_request_timeout_ms = 30000         # MSSQL only — per-query execution timeout
```

!!! warning "Pool settings are validated at startup"
    For `postgres`/`mssql` drivers, `max_open_conns` must be an integer ≥ 1, the remaining pool settings must be non-negative integers, and `min_open_conns` must not exceed `max_open_conns`. An invalid value fails startup closed with a `[FATAL]` message rather than silently reaching the connection pool.

## Security

```toml
[developer_portal.security]
encryption_key = ""     # 64-char hex — AES-256-GCM key for encrypting secrets at rest
session_secret = ""     # 64-char hex — express-session signing secret

[developer_portal.security.service_api_key]
enabled = true
header_name = "x-wso2-api-key"
value = ""
```

`encryption_key` and `session_secret` are required — the portal fails closed at startup if either doesn't resolve to a 64-character hex string. Generate one with `openssl rand -hex 32`.

## Authentication

```toml
[developer_portal.auth]
mode = "local"          # local | idp
role_validation = false # Enforce per-operation role validation

[developer_portal.auth.claim_mappings]
organization = "org_name"
roles = "roles"
groups = "groups"

[developer_portal.auth.local]
platform_api_url = ""
public_key_path = ""
tls_skip_verify = false

[developer_portal.auth.idp]
name = "IS"
issuer = "https://localhost:9443/oauth2/token"
authorization_url = "https://localhost:9443/oauth2/authorize"
token_url = "https://localhost:9443/oauth2/token"
user_info_url = "https://localhost:9443/oauth2/userinfo"
client_id = ""
client_secret = ""
audience = ""
callback_url = "http://localhost:3000/default/callback"
scope = "openid profile email"
logout_url = "https://localhost:9443/oidc/logout"
logout_redirect_uri = "http://localhost:3000/default"
certificate = ""
jwks_url = "https://localhost:9443/oauth2/jwks"
token_refresh_timeout_ms = 10000

[developer_portal.auth.idp.roles]
admin = "admin"
subscriber = "Internal/subscriber"
super_admin = "superAdmin"
```

See [Integrate Third-Party Identity Providers](../setting-up/integrate-identity-providers.md) for the full field-by-field reference and Asgardeo/Keycloak walkthroughs.

## Page Access Rules

Additions only — the portal always protects its own pages (applications, API keys, subscriptions, settings) regardless of what's listed here. Use this to require login/authorization for a custom page you've added:

```toml
# [developer_portal.page_access_rules]
# authenticated = ["**/my-custom-page"]
# authorized = ["**/my-custom-page"]
```

Patterns are glob-matched (minimatch) against the request URL and merged with — never replace — the built-in list.

## Organization

```toml
[developer_portal.organization]
default_name = "default"                 # "" disables auto-seeding
auto_create_subscription_plans = true    # Auto-create Bronze/Silver/Gold/Unlimited/AsyncUnlimited
```

Bootstraps a default organization on startup — idempotent, safe to leave enabled across restarts.

## Design Mode

```toml
# [developer_portal.design_mode]
# enabled = false
# path_to_layout = "./src/defaultContent/"
# api_samples_path = "./samples/apis/"
# mcp_samples_path = "./samples/mcps/"
# subscription_plans_path = "./samples/subscription-plans.yaml"
# applications_path = "./samples/applications.yaml"
```

Disabled by default. See [Design Mode](../setting-up/design-mode.md) for the full field reference and theme-development workflow.

## Webhooks

```toml
[developer_portal.webhooks.delivery]
poll_interval_ms = 2000
batch_size = 50
signature_tolerance_sec = 300
```

Global delivery tuning only — subscribers themselves are per-organization, managed via the [Webhook Integration](../admin-settings/webhook-integration.md) settings tab, not this file. Each delivery is attempted exactly once; there's no retry/backoff.

## Related

- [Integrate Third-Party Identity Providers](../setting-up/integrate-identity-providers.md)
- [Design Mode](../setting-up/design-mode.md)
- [Get a Bearer Token via curl](get-a-bearer-token-via-curl.md)
- [Management API](../rest-api/overview.md)
