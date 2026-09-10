---
title: "AI Workspace configuration and environment interpolation"
description: "How AI Workspace and the Platform API load config.toml, inject environment values and mounted files through interpolation tokens, and keep secrets out of it."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/configuration/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/setting-up/configuration.md
tags:
  - ai-workspace
  - configuration
  - interpolation
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-31
content_type: "reference"
---

# AI Workspace configuration and environment interpolation

The AI Workspace stack has two services: the AI Workspace Backend-for-Frontend (BFF) and the Platform API it proxies to. Each reads its configuration from a TOML file (`config.toml`) layered over built-in defaults.

This page explains how each service loads its config file. It also covers how environment values and mounted files are injected through interpolation tokens, how to keep sensitive values out of the file, and how to provision or rotate the credentials those tokens resolve to. For first-time setup, see [Get started with AI Workspace](../getting-started.md).

## How configuration is loaded

Each service reads a TOML file mounted into its container, layered over that service's built-in defaults:

- **AI Workspace (BFF)** — `/etc/ai-workspace/config.toml`; every key lives under the `[ai_workspace]` table.
- **Platform API** — `/etc/platform-api/config.toml`; every key lives under the `[platform_api]` table.

The per-service namespacing (`[ai_workspace]`, `[platform_api]`, `[api_portal]`) lets one `config.toml` hold multiple services' sections side by side without their keys colliding—each service reads only its own table.

!!! important "Environment variables don't override config keys directly"
    There is **no prefix that auto-maps environment variables onto config keys.** An environment value reaches a setting **only** through an explicit interpolation token written into the config file, resolved when the file is loaded. A key written as a plain literal — or absent from the file — ignores the matching variable entirely.

## Interpolation tokens

Two functions are available inside `config.toml`:



| Token | Behavior |
|-------|----------|
| `{{ env "NAME" "default" }}` | Substitutes the value of environment variable `NAME`. If the variable is unset **or set-but-empty**, the `default` is used. If no default is given, an unset variable fails startup. |
| `{{ file "PATH" }}` | Reads a secret value from a mounted file at `PATH` — for injecting secrets from a mounted volume rather than an environment variable. A trailing newline is trimmed. |

An example from the shipped AI Workspace `config.toml`:

```toml
[ai_workspace.control_plane]
url = '{{ env "APIP_AIW_CONTROL_PLANE_URL" "https://platform-api:9243" }}'

[ai_workspace.auth]
mode = '{{ env "APIP_AIW_AUTH_MODE" "basic" }}'
```



Most tokens in the shipped config carry a default, so an unset variable keeps the built-in value. A token written without a default names a required secret, and startup fails when that variable isn't set.

!!! note "The variable name is a naming convention, not a prefix override"
    By convention each token names the key's dotted path, uppercased with dots as underscores, behind a per-service prefix. The prefixes are `APIP_AIW_` for AI Workspace, `APIP_CP_` for the Platform API, and `APIP_AP_` for the API Portal. For example, `[ai_workspace.control_plane] url` becomes `APIP_AIW_CONTROL_PLANE_URL`. The loader doesn't interpret the prefix — the name is only the literal string you pass to the interpolation function. You can rename any variable, as long as you edit the matching token in `config.toml` to agree.

### Which variables your deployment reads

Because the variable names live in `config.toml`, the config file is the authoritative list for your deployment — not this page. To see which settings your stack injects from the environment, search the mounted `config.toml` for `{{ env` and read the name out of each token.

For every configurable option and the tokens the shipped files carry, refer to the config templates: [AI Workspace](https://github.com/wso2/api-platform/blob/main/portals/ai-workspace/configs/config-template.toml) and [Platform API](https://github.com/wso2/api-platform/blob/main/platform-api/config/config-template.toml).

## Sensitive values in `config.toml`

This section covers credentials the services need to start — database passwords, the OpenID Connect (OIDC) client secret, and the at-rest encryption key. It's a separate mechanism from the [AI Workspace secrets](../secrets-management.md) feature, which stores encrypted credentials you reference from artifacts.

Never write a sensitive value as a literal in `config.toml`, and never hardcode one in `docker-compose.yaml`. Reference each with an interpolation token—from an environment variable or, preferably, from a mounted file:



```toml
# Platform API at-rest encryption key - the shipped default reads a mounted file:
encryption_key = '{{ file "/etc/platform-api/keys/encryption.key" }}'
# or, alternatively, from an environment variable:
# encryption_key = '{{ env "APIP_CP_ENCRYPTION_KEY" }}'

# AI Workspace OIDC client secret (oidc mode) - env var, or a mounted file:
client_secret = '{{ env "APIP_AIW_AUTH_OIDC_CLIENT_SECRET" }}'
# client_secret = '{{ file "/secrets/ai-workspace/oidc_client_secret" }}'
```



Neither `encryption_key` nor `client_secret` carries a default, so each is a required secret. Both forms fail closed: if the variable is unset or empty, or the file is missing or outside the allowed source directories, the service refuses to start. A `{{ file }}` path must live under an allowed directory — `/etc/ai-workspace` or `/secrets/ai-workspace` for the BFF, `/etc/platform-api` or `/secrets/platform-api` for the Platform API. Override the list with the shared `APIP_CONFIG_FILE_SOURCE_ALLOWLIST` (comma-separated; it **replaces** the defaults rather than extending them).

!!! important "Two unrelated mechanisms"
    The `{{ env }}` and `{{ file }}` tokens on this page are resolved by the service's config loader at startup, and only inside `config.toml`. The `{{ secret "handle" }}` placeholder of [Secrets management](../secrets-management.md) is resolved by the gateway at request time, and only inside artifact configurations. Neither works in the other's place.

## Rerun the setup script

By default, rerunning `./scripts/setup.sh` is safe: it fills in only what's missing and never overwrites a value that already exists. The flags below change that:

| Flag | Effect |
|------|--------|
| `--force` | Regenerate the Transport Layer Security (TLS) certificate, the JSON Web Token (JWT) keypair, and the API Portal session secret, and rotate the admin credentials. Never touches either encryption key. |
| `--rotate-encryption-key` | Replace `resources/keys/encryption.key` and `resources/keys/api-portal-encryption.key`, even though they exist. Destructive. See the warning below. |
| `--certs-only` | Generate only the TLS certificate. Skips the keys, the admin credentials, and `api-platform.env`. |
| `--profiles=<a,b,...>` | Write a different `COMPOSE_PROFILES` value to `.env`, for example `--profiles=platform-api`. Only takes effect if `.env` doesn't already set `COMPOSE_PROFILES`, or combined with `--force`. |

To rotate a single value by hand, delete it from `api-platform.env`, or delete the file under `resources/certificates` or `resources/keys`, and rerun the script. Don't delete `resources/keys/encryption.key` or `resources/keys/api-portal-encryption.key` this way. Rerunning the script regenerates a missing encryption key without warning, which makes data encrypted under the old key unreadable. To rotate either encryption key, use `--rotate-encryption-key` and read the warning below first.

!!! warning "Rotating an encryption key destroys encrypted data"
    `--rotate-encryption-key` replaces both encryption keys, which makes everything encrypted under the old keys permanently unreadable. That covers stored [AI Workspace secrets](../secrets-management.md) and subscription tokens held by the Platform API. It also covers the API Portal's subscription secrets and webhook secrets. At an interactive terminal the script asks you to type `rotate` to confirm; in a non-interactive run, passing the flag is itself the confirmation. Rotating the JWT keypair with `--force` is milder. It only invalidates issued login tokens, so everyone signs in again.

## Provision the at-rest encryption key manually

If you don't run `setup.sh`, provision the at-rest encryption key yourself before the first start. It protects [AI Workspace secrets](../secrets-management.md) and subscription tokens, and the Platform API refuses to start if it's missing or malformed. Keep it stable across restarts and replicas.

This covers a self-managed Docker Compose setup. For a virtual machine (VM) or Kubernetes production deployment, where you provision this key alongside the database password and OIDC client secret, see [Provision secrets and keys](../production/secrets-and-keys.md) instead.

The key is a single 32-byte Advanced Encryption Standard (AES)-256 value, supplied as 64 hex characters or base64. The container mounts it at `/etc/platform-api/keys`, and reads it as user ID (UID) 10001, a different user than the one that creates it.

To provision it:

1. Generate the key and write it to `resources/keys/encryption.key`.
2. Grant read access to UID 10001. If your filesystem supports POSIX ACLs, do this without opening the file to every other account on the host:

    ```sh
    (umask 077 && openssl rand -hex 32 > resources/keys/encryption.key)
    setfacl -m u:10001:r resources/keys/encryption.key
    ```

    If ACLs aren't available on your filesystem, the fallback is to make the file world-readable instead. This grants read access more broadly than the ACL approach:

    ```sh
    chmod 644 resources/keys/encryption.key
    ```

Keep the key out of source control, alongside `api-platform.env`. A trailing newline is trimmed on load. The Platform API doesn't read the key from an environment variable directly. It reads the `encryption_key` field in `config.toml`, shown above under [Sensitive values in `config.toml`](#sensitive-values-in-configtoml).

To use the environment variable form instead, switch the token to `{{ env "APIP_CP_ENCRYPTION_KEY" }}` and set the variable in `api-platform.env`.

## Change environment values after setup

`api-platform.env` holds the values the containers read at startup. Those are the admin credentials the setup script wrote, plus anything else your `config.toml` pulls in through an `{{ env }}` token. Edit that file to change a setting, for example to switch the AI Workspace login mode or point at a different control plane. Then restart the stack.

The sample `docker-compose.yaml` loads the file with the `env_file:` directive. It sets `format: raw` so that the `$` characters in a bcrypt password hash aren't treated as Compose interpolation:

```yaml
services:
  platform-api:
    env_file:
      - path: api-platform.env
        required: true
        format: raw
```

Keep `api-platform.env` out of source control. It's git-ignored in the distribution.

## Related

- [Get started with AI Workspace](../getting-started.md): download AI Workspace, run the setup script for the first time, and deploy the stack
- [Change the ports AI Workspace uses](ports.md): move the stack off its default ports
- [Provision secrets and keys](../production/secrets-and-keys.md): the VM and Kubernetes equivalent of manually provisioning the encryption key, alongside the database password and OIDC client secret
- [Troubleshoot AI Workspace](../troubleshooting.md): fixes for common setup problems