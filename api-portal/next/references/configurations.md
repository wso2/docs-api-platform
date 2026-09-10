---
title: "API Portal configuration reference"
description: "How the API Portal & MCP Hub loads config.toml, injects environment values through interpolation tokens, and the full reference of every supported configuration key."
canonical_url: https://wso2.com/api-platform/docs/api-portal/references/configurations/
md_url: https://wso2.com/api-platform/docs/api-portal/references/configurations.md
tags:
  - cloud
  - api-portal
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-24
content_type: "reference"
---

# Configurations

The API Portal & MCP Hub reads its configuration from `configs/config.toml`, layered over built-in defaults (`src/config/configDefaults.js`). This page is the full reference of every supported key.

For how that file is loaded, how environment values and mounted files are injected through interpolation tokens, and how to keep sensitive values out of the file, see [Configuration and environment interpolation](../setting-up/configuration.md).



## Server

```toml
[api_portal.server]
base_url = '{{ env "APIP_AP_SERVER_BASE_URL" "https://localhost:9543" }}'
port = 9543

[api_portal.server.https]
enabled = false
cert_file = "./resources/security/client-truststore.pem"
key_file = "./resources/security/private-key.pem"
```

| Key | Default | Description |
|---|---|---|
| `server.base_url` | `https://localhost:9543` | Canonical public origin, used only to build absolute URLs embedded in generated agent prompts |
| `server.port` | `9543` | Single listener port |
| `server.https.enabled` | `false` | Whether the listener terminates TLS itself. Set `false` only when a trusted upstream (proxy/LB/ingress) terminates TLS |
| `server.https.cert_file` / `key_file` |—| Required only when `https.enabled = true`—no self-signed fallback |



## Logging

```toml
[api_portal.logging]
level = "info"          # debug | info | warn | error
format = "text"         # text | json
console_only = true     # true: stdout only. false: also write rotating log files to disk
```

## Database

```toml
[api_portal.database]
driver = "sqlite"             # sqlite | postgres | mssql
path = "./api-portal.db"       # SQLite only
host = "localhost"            # PostgreSQL / MSSQL only
port = 5432                   # PostgreSQL / MSSQL only (1433 for MSSQL)
name = "api_portal"            # PostgreSQL / MSSQL only
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
[api_portal.security]
encryption_key = ""     # 64-char hex — AES-256-GCM key for encrypting secrets at rest
session_secret = ""     # 64-char hex — express-session signing secret
```

`encryption_key` and `session_secret` are required—the portal fails closed at startup if either doesn't resolve to a 64-character hex string. Generate one with `openssl rand -hex 32`.

## Authentication

```toml
[api_portal.auth]
mode = "local"          # local | idp

[api_portal.auth.claim_mappings]
organization = "org_name"   # claim carrying the org ID
roles = "roles"             # claim carrying the user's roles
groups = "groups"

[api_portal.auth.local]
platform_api_url = ""
public_key_path = ""    # path to the Platform API's RS256 public key PEM
tls_skip_verify = false

# The [api_portal.auth.idp] endpoints describe your own identity provider and have
# no default. issuer, authorization_url, token_url, client_id, and callback_url are
# required when mode = "idp"; the portal refuses to start without them.
[api_portal.auth.idp]
name = "my-idp"        # friendly name, used in logs
issuer = ""
authorization_url = ""
token_url = ""
user_info_url = ""
client_id = ""
client_secret = ""
audience = ""
callback_url = ""
scope = "openid profile email"
sign_up_url = ""
logout_url = ""
logout_redirect_uri = ""
certificate = ""
jwks_url = ""
token_refresh_timeout_ms = 10000
silent_sso = true      # Enable silent SSO
org_callback = false   # Redirect to the org's own landing page after login
```

See [Authentication](../setting-up/authentication/overview.md) for the authentication modes, and [Connect an identity provider](../setting-up/authentication/connect-an-identity-provider.md) for the value each `[api_portal.auth.idp]` key has to match in the IdP.

### Authorization

Authorization is configured in its own section, independent of `auth.mode`, because both the local and IDP branches read it.

```toml
[api_portal.auth.authorization]
enabled = true
mode = "role"           # scope | role
role_to_scope_mapping = "./resources/role-to-scope-mapping.yaml"
page_role_validation = false

[api_portal.auth.authorization.portal_roles]
admin = "ap_admin"
subscriber = "ap_subscriber"
```

Five keys govern how a request's permissions are resolved:

| Key | Default | Description |
|---|---|---|
| `authorization.enabled` | `true` | Master switch for Management API (`/api-portal/api/v0.9`) authorization. With `false`, any authenticated caller satisfies every operation's scope list—a development opt-out that logs a startup warning |
| `authorization.mode` | `role` | How a request's effective scopes are derived. `role` expands the token's roles claim through the mapping table and ignores the scope claim entirely, so a caller can't widen a role's grant by asking for extra scopes. `scope` reads the token's own scope claim—use it when the issuer mints `dp:*` scopes directly. Validated even when `enabled = false`, so a typo surfaces immediately |
| `authorization.role_to_scope_mapping` | `./resources/role-to-scope-mapping.yaml` | Path to the YAML grant table. Required when `mode = "role"`. Validated at startup against the portal's OpenAPI spec whenever it's set—an undeclared `dp:*` scope fails startup rather than surfacing later as a role that logs in and is denied every request |
| `authorization.page_role_validation` | `false` | Per-page role-tier gating. Separate from `enabled`, which governs REST scopes—one switch for both would mean turning page gating off also silently disabled REST enforcement |
| `authorization.portal_roles.admin` / `.subscriber` | `ap_admin` / `ap_subscriber` | The role names, as they appear in the roles claim, that grant each page-access tier. Point them at your IDP's role names, or at names in the mapping table to drive page gating and REST authorization from the same roles |

!!! danger "Two retired keys abort startup"
    Leaving either of these in `config.toml` fails startup by design—an ignored key would silently apply the default instead of what the file says.

    | Retired key | Replacement |
    |---|---|
    | `auth.role_validation` | `auth.authorization.page_role_validation` |
    | `auth.idp.roles` | `auth.authorization.portal_roles` |

    Note that `role_validation` maps to `page_role_validation`, **not** to `authorization.enabled`. There was also a third role tier, `super_admin`; it gated pages this portal doesn't serve, so it was removed.

## Page access rules

Additions only—the portal always protects its own pages (applications, API keys, subscriptions, settings) regardless of what's listed here. Use this to require login/authorization for a custom page you've added:

```toml
# [api_portal.page_access_rules]
# authenticated = ["**/my-custom-page"]
# authorized = ["**/my-custom-page"]
```

Patterns are glob-matched (minimatch) against the request URL and merged with—never replace—the built-in list.

## Organization

```toml
[api_portal.organization]
handle = "default"                       # URL slug: /api-portal/{handle}/views/{viewName}
display_name = "Default"                 # Used only when first seeding the organization
auto_create_subscription_plans = true    # Auto-create Bronze/Silver/Gold/Unlimited/AsyncUnlimited
```

These three keys describe the organization the instance serves:

| Key | Description |
|---|---|
| `organization.handle` | The URL slug of the single organization this instance serves, and the pin every route is scoped against. Anything resolving to a different organization is rejected. In local-auth mode it must match the Platform API's organization id. In IDP mode it's also what the token's organization claim has to resolve to—see the note below |
| `organization.display_name` | Used only when seeding the organization for the first time. Never overwrites an existing name, so an admin's later edit in the settings UI survives restarts. Empty means "use the handle" |
| `organization.auto_create_subscription_plans` | Seeds Bronze, Silver, Gold, Unlimited, and AsyncUnlimited alongside the organization |

Seeding runs on startup only if the organization doesn't already exist, so it's idempotent and safe to leave enabled.

!!! note "Which token claim carries the organization"
    The two authentication modes resolve it differently, so don't assume one claim covers both.

    - **Local auth** reads a fixed `org_handle` claim and compares it to `organization.handle`.
    - **IDP mode** reads the claim named by `auth.claim_mappings.organization` (default `org_name`) and resolves it, accepting the organization's handle or its display name. The organization's IDP reference ID is seeded from `handle` and can't be changed afterward, so `handle` is the value to align the claim with—see [Make the organization claim resolve to your organization](../setting-up/authentication/connect-an-identity-provider.md#step-5-make-the-organization-claim-resolve-to-your-organization).


!!! note
    `organization.default_name` is a deprecated alias for `handle`. It still resolves, with a startup warning—use `handle` in new configuration.

## Artifacts

```toml
[api_portal.artifacts]
enabled_types = ["apis", "mcp-servers", "api-workflows"]
```

An allowlist of the artifact types this portal serves. A type left out gets no navigation entry, no landing-page section, and `404`s on its routes. Valid entries are `apis`, `mcp-servers`, and `api-workflows`; an unrecognized entry aborts startup so a typo can't silently drop a type. Omit the section to serve all three. See [Artifact types](../setting-up/artifact-types.md).

## Uploads

Limits applied to every upload and to archive extraction—theme ZIPs, API specs, documents, and landing-page content.

```toml
[api_portal.uploads]
max_bytes = 10485760       # 10 MiB — a single upload, or a single entry inside an archive
max_total_bytes = 52428800 # 50 MiB — total extracted size per archive
max_zip_entries = 500
max_depth = 10
```

These are the ceilings the Theming panel's "up to 10 MB" hint and the Manage APIs spec upload both derive from. `max_total_bytes`, `max_zip_entries`, and `max_depth` guard archive extraction against a decompression bomb, so raise them only deliberately.

!!! note
    `config-template.toml` documents this table, but the shipped `config.toml` omits it—so the built-in defaults above apply until you add the table to `config.toml` yourself.

## Try-out proxy

The try-it console calls an API's registered endpoint, which is a different origin from the portal. Rather than requiring every gateway to return CORS headers naming the portal, the panel can be pointed at a same-origin proxy that makes the call server-side.

```toml
[api_portal.tryout]
enabled = true
allow_http_endpoints = true    # false: only https:// endpoints may be called
allow_private_endpoints = false
tls_skip_verify = false        # development only
timeout_ms = 15000
max_request_bytes = 1048576    # 1 MiB
max_response_bytes = 5242880   # 5 MiB
```

The proxy's behavior and its safety limits are set by these keys:

| Key | Default | Description |
|---|---|---|
| `tryout.enabled` | `true` | Whether the proxy is available |
| `tryout.allow_http_endpoints` | `true` | Whether cleartext `http://` endpoints may be called. Intended for local development; set it to `false` in production so only `https://` endpoints are reachable |
| `tryout.allow_private_endpoints` | `false` | Deny-by-default. The registered-endpoint allowlist can't protect against an endpoint registered to point at an internal service, so this denylist is the only control for that case. Set `true` when the gateway legitimately sits on a private address—a Docker Compose service name, a cluster IP, localhost—after confirming only intended services are reachable from the portal |
| `tryout.tls_skip_verify` | `false` | Development only |
| `tryout.timeout_ms` | `15000` | Per-request timeout |
| `tryout.max_request_bytes` | `1048576` | Request body ceiling. Exceeding it returns `413` |
| `tryout.max_response_bytes` | `5242880` | Response body ceiling |

Two limits hold regardless of these settings: the proxy only calls URLs contained by one of the endpoints registered for that API, so a caller can't choose an arbitrary host; and link-local and cloud-metadata addresses such as `169.254.169.254` are refused at connection time.

## Design mode

```toml
# [api_portal.design_mode]
# enabled = false
# path_to_layout = "./src/defaultContent/"
# api_samples_path = "./samples/apis/"
# mcp_samples_path = "./samples/mcps/"
# subscription_plans_path = "./samples/subscription-plans.yaml"
# applications_path = "./samples/applications.yaml"
```

Disabled by default. See [Design Mode](../admin-settings/design-mode.md) for the full field reference and theme-development workflow.

## Webhooks

```toml
[api_portal.webhooks.delivery]
poll_interval_ms = 2000
batch_size = 50
signature_tolerance_sec = 300
```

Global delivery tuning only—subscribers themselves are per-organization, managed on the [Webhook Integration](../admin-settings/webhook-integration.md) settings tab, not in this file. Each delivery is attempted exactly once; there's no retry or backoff.

`signature_tolerance_sec` is the window the portal's own signature verifier accepts. See the [Webhook Event Catalog](webhook-event-catalog.md) for the signing algorithm.

## Related

- [Authentication](../setting-up/authentication/overview.md)
- [Artifact types](../setting-up/artifact-types.md)
- [Design Mode](../admin-settings/design-mode.md)
- [Webhook Event Catalog](webhook-event-catalog.md)
- [Get a Bearer Token via curl](get-a-bearer-token-via-curl.md)
- [Management API](../rest-api/overview.md)