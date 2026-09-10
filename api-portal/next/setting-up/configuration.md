---
title: "API Portal configuration and environment interpolation"
description: "How the API Portal & MCP Hub loads its config.toml, injects environment values and mounted files through interpolation tokens, and keeps sensitive values out of the config file."
canonical_url: https://wso2.com/api-platform/docs/api-portal/setting-up/configuration/
md_url: https://wso2.com/api-platform/docs/api-portal/setting-up/configuration.md
tags:
  - cloud
  - api-portal
  - configuration
  - interpolation
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "reference"
---

# API Portal configuration and environment interpolation

The API Portal & MCP Hub reads its configuration from a TOML file (`config.toml`) layered over built-in defaults. The quickstart runs it alongside a Platform API, which reads the same file, so both are covered here — a standalone production deployment needs only the portal's own section.

This page explains how each service loads its config file. It also covers how environment values and mounted files are injected through interpolation tokens, and how to keep sensitive values out of the file. For the full reference of every supported key, see [Configurations](../references/configurations.md). For provisioning the keys, certificates, and credentials those tokens resolve to, see [Getting started](../getting-started.md).

## How configuration is loaded

Each service reads a TOML file mounted into its container, layered over that service's built-in defaults:

- **API Portal & MCP Hub** — `/app/configs/config.toml`; every key lives under the `[api_portal]` table. Defaults come from `src/config/configDefaults.js`.
- **Platform API** — `/etc/platform-api/config.toml`; every key lives under the `[platform_api]` table.

Precedence runs lowest to highest: built-in defaults, then `configs/config.toml` with its interpolation tokens resolved.

The per-service namespacing (`[api_portal]`, `[platform_api]`, `[ai_workspace]`) lets one `config.toml` hold multiple services' sections side by side without their keys colliding — each service reads only its own table. The shipped stack relies on this: the API Portal and AI Workspace containers mount the same file and each ignore the other's section.

`configs/config-template.toml` documents every supported key with its default as a plain literal. It's a reference copy, not the file the portal reads.

!!! important "Environment variables don't override config keys directly"
    There is **no prefix that auto-maps environment variables onto config keys.** An environment value reaches a setting **only** through an explicit interpolation token written into the config file, resolved when the file is loaded. A key written as a plain literal — or absent from the file — ignores the matching variable entirely.

## Interpolation tokens

Two functions are available inside `config.toml`:



| Token | Behavior |
|-------|----------|
| `{{ env "NAME" }}` | Substitutes the value of environment variable `NAME`. **Fails closed** — an unset or empty variable aborts startup rather than falling through to a default. |
| `{{ env "NAME" "default" }}` | Substitutes `NAME`'s value if set and non-empty, else the literal `default`. |
| `{{ file "PATH" }}` | Reads a secret value from a mounted file at `PATH`, trimmed — for injecting secrets from a mounted volume rather than an environment variable. Always required: a missing, unreadable, oversized, or disallowed path is a hard startup error. |

An example from the shipped API Portal `config.toml`:

```toml
[api_portal.server]
port = '{{ env "APIP_AP_SERVER_PORT" "9543" }}'

[api_portal.security]
encryption_key = '{{ file "/etc/api-portal/keys/encryption.key" }}'
```



Partial substitution works too — `'foo-{{ env "X" }}'` resolves to `foo-bar` when `X=bar`.

A templated value is coerced to its natural type after substitution, so `"true"` becomes a boolean and `"9543"` becomes a number. A plain TOML literal keeps its native type and is never passed through coercion.

!!! note "The variable name is a naming convention, not a prefix override"
    By convention each token names the key's dotted path, uppercased with dots as underscores, behind a per-service prefix. The prefixes are `APIP_AP_` for the API Portal, `APIP_CP_` for the Platform API, and `APIP_AIW_` for AI Workspace. For example, `[api_portal.server] port` becomes `APIP_AP_SERVER_PORT`. The loader doesn't interpret the prefix — the name is only the literal string you pass to the interpolation function. You can rename any variable, as long as you edit the matching token in `config.toml` to agree.

### Which variables your deployment reads

Because the variable names live in `config.toml`, the config file is the authoritative list for your deployment — not this page. To see which settings your stack injects from the environment, search the mounted `config.toml` for `{{ env` and read the name out of each token.

For every configurable option and the tokens the shipped files carry, refer to the config templates: [API Portal](https://github.com/wso2/api-platform/blob/main/portals/api-portal/configs/config-template.toml) and [Platform API](https://github.com/wso2/api-platform/blob/main/platform-api/config/config-template.toml).

## Sensitive values in `config.toml`

This section covers credentials the services need to start — the at-rest encryption key, the session secret, the OpenID Connect (OIDC) client secret, and any database password. It's a separate mechanism from the credentials the portal stores for applications and API keys, which live encrypted in its database.

Never write a sensitive value as a literal in `config.toml`, and never hardcode one in `docker-compose.yaml`. Reference each with an interpolation token — from a mounted file, or from an environment variable:



```toml
# The shipped config.toml reads both portal secrets from mounted files:
[api_portal.security]
encryption_key = '{{ file "/etc/api-portal/keys/encryption.key" }}'
session_secret = '{{ file "/etc/api-portal/keys/session-secret" }}'

# OIDC client secret (idp mode) - env var, or preferably a mounted file:
[api_portal.auth.idp]
client_secret = '{{ env "APIP_AP_AUTH_IDP_CLIENT_SECRET" }}'
# client_secret = '{{ file "/secrets/api-portal/oidc_client_secret" }}'
```



None of these carries a default, so each is a required secret. Both forms fail closed: if the variable is unset or empty, or the file is missing or outside the allowed source directories, the service refuses to start rather than run with an empty credential.

A `{{ file }}` path must live under an allowed directory — `/etc/api-portal` or `/secrets/api-portal` for the portal, `/etc/platform-api` or `/secrets/platform-api` for the Platform API. Override the list with the shared `APIP_CONFIG_FILE_SOURCE_ALLOWLIST` (comma-separated; it **replaces** the defaults rather than extending them). That variable is read straight from the process environment rather than through `{{ env }}`, since it gates interpolation itself. Files are also capped at 1 MiB, and traversal sequences and symlinks escaping the allowlist are rejected before the read.

## Where the values come from

Provisioning the keys, certificates, and credentials the tokens resolve to is part of setting the stack up, not part of how the config loader works. For those steps, see:

- [Run the setup script](../getting-started.md#step-2-run-the-setup-script) — what a fresh stack is given, and where each artifact lands under `resources/certificates/` and `resources/keys/`.
- The script is idempotent: re-running it fills in only what's missing. To rotate a secret, remove it from `api-platform.env` or delete the relevant file, then re-run.
- `api-platform.env` is the file Compose loads into every container, so it's where an environment value a token names is set.

## Related

- [Configurations](../references/configurations.md): the full reference of every supported key
- [Getting started](../getting-started.md): provision the keys, certificates, and credentials the tokens resolve to
- [Change the ports the API Portal uses](ports.md): move the stack off its default ports