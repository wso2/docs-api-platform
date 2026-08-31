---
title: "Gateway Configuration and Environment Interpolation"
description: "How the gateway loads config.toml, injects environment values through interpolation tokens, and bootstraps keys and certificates with the setup script."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/configuration/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/configuration.md
tags:
  - api-gateway
  - configuration
  - interpolation
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "reference"
---

# Gateway Configuration and Environment Interpolation

The Gateway Controller and Policy Engine read their configuration from a TOML file (`config.toml`) layered over built-in defaults. This page explains how configuration is delivered, how environment values are injected through interpolation tokens, and how the one-time setup script provisions the keys and certificates the gateway requires.

## How configuration is loaded

Configuration is read from a TOML file mounted at `/etc/gateway-controller/config.toml` (controller) and `/etc/policy-engine/config.toml` (policy engine), layered over the built-in defaults.

!!! important "Environment variables do not override config keys directly"
    There is **no `APIP_GW_*` prefix that auto-maps environment variables onto config keys.** An environment value reaches a setting **only** through an explicit interpolation token written into the config file, resolved when the file is loaded. A field with no token always takes its literal TOML value (or the built-in default).

    This replaces the previous behavior, where an `APIP_GW_`-prefixed environment variable was mapped onto the matching config key and silently overrode the file. A bare `APIP_GW_*` variable with no matching token in `config.toml` is now ignored.

## Interpolation tokens

Two functions are available inside `config.toml`:

{% raw %}

| Token | Behavior |
|-------|----------|
| `{{ env "NAME" "default" }}` | Substitutes the value of environment variable `NAME`. If the variable is unset **or set-but-empty**, the `default` is used. |
| `{{ file "PATH" }}` | Reads a secret value from a mounted file at `PATH` — for injecting secrets from a mounted volume rather than an environment variable. |

An example from the shipped `config.toml`:

```toml
[controller.controlplane]
host  = '{{ env "APIP_GW_CONTROLLER_CONTROLPLANE_HOST" "" }}'
token = '{{ env "APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN" "" }}'

[controller.storage]
type = '{{ env "APIP_GW_CONTROLLER_STORAGE_TYPE" "sqlite" }}'
```

{% endraw %}

Every token in the shipped config carries a default, so an unset variable keeps the built-in value.

!!! note "`APIP_GW_` is a naming convention, not a prefix override"
    The shipped `config.toml` names its token arguments `APIP_GW_<CONFIG_PATH>` (for example, `APIP_GW_CONTROLLER_STORAGE_TYPE` for `controller.storage.type`). This is purely a convention that makes the token argument readable — it is the literal string passed to the interpolation function, not a prefix that the loader interprets. Renaming the environment variable also requires editing the matching token in the config file.

### Common tokens

The shipped `config.toml` already carries interpolation tokens for the settings the sample deployments inject. The most common are:

| Environment variable (token argument) | Config key | Description |
|----------------------------------------|------------|-------------|
| `APIP_GW_CONTROLLER_STORAGE_TYPE` | `controller.storage.type` | `sqlite`, `postgres`, `sqlserver`, or `memory` |
| `APIP_GW_CONTROLLER_STORAGE_SQLITE_PATH` | `controller.storage.sqlite.path` | Path to the SQLite database file |
| `APIP_GW_CONTROLLER_STORAGE_POSTGRES_PASSWORD` | `controller.storage.postgres.password` | PostgreSQL password |
| `APIP_GW_CONTROLLER_STORAGE_DATABASE_DSN` | `controller.storage.database.dsn` | SQL Server DSN (when storage type is `sqlserver`) |
| `APIP_GW_CONTROLLER_CONTROLPLANE_HOST` | `controller.controlplane.host` | Control plane endpoint (`host:port`) |
| `APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN` | `controller.controlplane.token` | Control plane registration token |
| `APIP_GW_CONTROLLER_LOGGING_LEVEL` | `controller.logging.level` | `debug`, `info`, `warn`, `error` |

For the complete list of tokens and every configurable option, refer to the [config template](https://github.com/wso2/api-platform/blob/main/gateway/configs/config-template.toml).

!!! tip "Distinct from artifact templating"
    The interpolation tokens described here apply to the gateway's **own `config.toml`**. API **artifacts** (RestApi, LLMProvider, and other resource files) support a separate, richer set of template functions (`env`, `required`, `redact`, `default`) applied to the artifact body. See [Artifact Templating](./artifact-templating.md) for that mechanism.

## Delivering environment values

For Docker Compose deployments, the sample composes deliver these values to the container from an `api-platform.env` file via the Compose `env_file:` directive:

```yaml
services:
  gateway-controller:
    env_file:
      - ./api-platform.env
```

`api-platform.env` is generated by the [setup script](#one-time-setup-with-the-setup-script). Add or edit variables there — for example, to connect to a control plane:

```bash
# api-platform.env
APIP_GW_CONTROLLER_CONTROLPLANE_HOST=your-control-plane-host:9443
APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN=<registration-token>
```

For Kubernetes/Helm deployments, the chart renders `config.toml` into a ConfigMap and injects the runtime secrets (control plane token, database password) as interpolation tokens backed by Kubernetes Secrets — see [Security Hardening](./production-deployment/security-hardening.md) and [Database Configuration](./production-deployment/database-configuration.md).

## No development / demo mode

The gateway has **no development or demo mode** and **never auto-generates keys or certificates**. It fails closed with a descriptive error at startup if a required key or certificate is missing. Everything the gateway requires must be provisioned before it starts:

- **AES-256 at-rest encryption key** — used to encrypt sensitive data at rest. Required; the controller will not start without it.
- **Router HTTPS listener certificate** — the TLS certificate/key for the router's HTTPS listener.
- **Admin credentials** — the gateway-controller management API basic-auth credential. There is no hardcoded `admin:admin`; the controller fails closed if basic auth is enabled with no credential.
- **`api-platform.env`** — runtime settings read directly by the gateway-runtime entrypoint (for example, `GATEWAY_CONTROLLER_HOST`, `LOG_LEVEL`).

The setup script provisions all four.

## One-time setup with the setup script

The distribution ships `scripts/setup.sh` (and `scripts/setup.ps1`, its Windows PowerShell counterpart), which provisions everything a fresh gateway needs. Run it once before the first `docker compose up`:

=== "Linux / macOS"

    ```bash
    ./scripts/setup.sh
    docker compose up
    ```

=== "Windows (PowerShell)"

    ```powershell
    powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
    docker compose up
    ```

The setup script provisions, idempotently:

| Artifact | Location | Purpose |
|----------|----------|---------|
| Router listener certificate | `listener-certs/default-listener.{crt,key}` | Self-signed cert for the router HTTPS listener (SANs include `localhost`, `*.localhost`, `host.docker.internal`, `127.0.0.1`). |
| AES-256 encryption key | `aesgcm-keys/default-aesgcm256-v1.bin` | 32-byte at-rest encryption key, bind-mounted into the controller. |
| Admin credentials | `api-platform.env` | Gateway-controller REST/management API basic-auth credential (`APIP_GW_CONTROLLER_AUTH_BASIC_ADMIN_USERNAME` + bcrypt `..._PASSWORD_HASH`). |
| `api-platform.env` | `api-platform.env` | Runtime defaults loaded into the containers via `env_file`. |

!!! note "Admin credentials"
    The gateway-controller management API is protected by basic auth. You provide the plaintext
    `ADMIN_USERNAME` (defaults to `admin`) and `ADMIN_PASSWORD` (used if set, otherwise prompted,
    otherwise randomly generated) to the setup script; it writes
    `APIP_GW_CONTROLLER_AUTH_BASIC_ADMIN_USERNAME` and the **bcrypt** `..._PASSWORD_HASH` into
    `api-platform.env` (the tokens `config.toml` reads) and prints the plaintext password **once** — copy
    it. For non-interactive use: `ADMIN_USERNAME=admin ADMIN_PASSWORD='…' ./scripts/setup.sh` (on Windows:
    `$env:ADMIN_USERNAME='admin'; $env:ADMIN_PASSWORD='…'; powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1`). If those
    tokens are unset when the controller starts with the shipped `config.toml`, it **refuses to start**
    rather than running on an empty credential.

The script is **idempotent** — existing files are kept, not overwritten. Flags:

| Flag | Effect |
|------|--------|
| `--force` | Regenerate the certificate and encryption key (rotating them), rewrite `api-platform.env`, and re-provision the admin credentials (rotating the password). |
| `--certs-only` | Generate only the listener TLS certificate; skip the encryption key, admin credentials, and `api-platform.env`. |

!!! warning "Rotating the encryption key"
    Running the setup script with `--force` regenerates the AES-256 encryption key. Data encrypted with the previous key becomes unreadable. Only rotate the key deliberately.

!!! note "Control plane connection is not configured by the script"
    Connecting to a control plane is optional and is not configured by the setup script. To connect, add `APIP_GW_CONTROLLER_CONTROLPLANE_HOST` and `APIP_GW_CONTROLLER_CONTROLPLANE_TOKEN` to `api-platform.env` (both default to empty, which runs the gateway in standalone mode).

---

[← Artifact Templating](./artifact-templating.md) &nbsp;|&nbsp; [Setting Up the Database →](./database-setup.md)
