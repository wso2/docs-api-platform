---
title: "Provision secrets and keys"
description: "Generate, store, and reference the encryption key, database password, and OIDC client secret that a production AI Workspace deployment requires."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/secrets-and-keys/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/secrets-and-keys.md
tags:
  - ai-workspace
  - production
  - security
  - secrets
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Provision secrets and keys

Both services follow one rule: setup generates, startup only checks. Nothing is created for you at runtime, and a missing secret stops the process instead of substituting a weak default. Provision every secret below before the first start.

## What you need to provision

The following table maps each secret to the service that consumes it, when it's required, and what losing it costs you:

| Secret | Used by | Required when | What losing it costs |
|--------|---------|---------------|----------------------|
| At-rest encryption key | Platform API | Always | Every stored secret, subscription token, and WebSub hash-based message authentication code (HMAC) secret becomes unreadable |
| Database password | Platform API | When the driver isn't SQLite | Nothing, once you reset it on the database server |
| OpenID Connect (OIDC) client secret | AI Workspace backend for frontend (BFF) | In OIDC authentication mode | Nothing, once you rotate it in the identity provider |


!!! danger "Back up the encryption key before you store anything"
    The encryption key protects [AI Workspace secrets](../secrets-management.md), subscription tokens, and WebSub HMAC secrets. It has no recovery path. Copy it into your organization's secret manager the moment you generate it, and keep that copy independent of the deployment it protects.

## Step 1: Generate the values

The encryption key is a single 32-byte value supplied as 64 hexadecimal characters or as base64.

=== "Virtual machine"
    Generate the values into the directories the containers mount. Set a restrictive umask so no other account on the host can read them:

    ```bash
    umask 077

    # At-rest encryption key.
    openssl rand -hex 32 > resources/keys/encryption.key

    # Database password and OIDC client secret, read from prompts so they stay
    # out of your shell history.
    mkdir -p secrets
    read -rsp 'OIDC client secret: ' v && printf '%s' "$v" > secrets/oidc_client_secret && unset v && echo
    read -rsp 'Database password: ' v && printf '%s' "$v" > secrets/postgres_password && unset v && echo
    ```

    Confirm the permissions, then restrict the directories too:

    ```bash
    chmod 600 resources/keys/* secrets/*
    chmod 700 resources/keys secrets
    ```

    The distribution's `./scripts/setup.sh` generates the same artifacts. Use it if you want the stack running before you wire in managed secrets, then replace each generated file with the managed value. Keep `api-platform.env`, `resources/keys/`, and `secrets/` out of source control.

=== "Kubernetes"
    The chart never creates or embeds a secret value. It reads a Secret you created and referenced by name.

    Produce the encryption key yourself, or take it from your secret manager. It has no rotation path, so you need a copy of it outside the cluster before anything runs:

    ```bash
    umask 077
    openssl rand -hex 32 | tr -d '\n' > encryption.key
    ```

    Read the database password and the client secret from a prompt, so neither reaches your shell history or the host's process list:

    ```bash
    read -rsp 'Database password: ' v && printf '%s' "$v" > db_password && unset v && echo
    read -rsp 'OIDC client secret: ' v && printf '%s' "$v" > oidc_client_secret && unset v && echo
    ```

    Create the two Secrets, using the key names the chart expects:

    ```bash
    kubectl -n <namespace> create secret generic <release-name>-platform-api-secrets \
      --from-file=ENCRYPTION_KEY=./encryption.key \
      --from-file=DATABASE_PASSWORD=./db_password

    kubectl -n <namespace> create secret generic <release-name>-ai-workspace-ui-secrets \
      --from-file=OIDC_CLIENT_SECRET=./oidc_client_secret
    ```

    Remove the local files once the Secrets exist:

    ```bash
    shred -u db_password oidc_client_secret
    ```

    Remove `encryption.key` too, but only after you confirm that an independent copy is in your secret manager. The key has no recovery path, and the Kubernetes Secret is not a backup:

    ```bash
    shred -u encryption.key
    ```

    Then reference the Secrets by name in `values-secrets.yaml`, which holds no values and is safe to commit:

    ```yaml
    platform-api:
      secrets:
        existingSecret: <release-name>-platform-api-secrets
    ai-workspace-ui:
      secrets:
        existingSecret: <release-name>-ai-workspace-ui-secrets
    ```

    The chart also ships a `generate-secrets.sh` that invents the key material, creates both Secrets, and writes the same file. It takes the database password and the client secret on its command line, where they land in your shell history, and it leaves you with an encryption key you never saw and can't restore. Keep it to a trial cluster.

## Step 2: Reference the secrets from configuration

Never write a secret value into `config.toml` or a values file. Reference it instead, so the value stays in the store you chose.

=== "Virtual machine"
    `config.toml` is the only source of configuration. A value reaches it through an interpolation token, resolved once at startup. Prefer the `file` token: the value never enters the process environment, so it can't leak through a process listing or a crash dump.

    

    ```toml
    # configs/config.toml
    [platform_api.security]
    encryption_key = '{{ file "/etc/platform-api/keys/encryption.key" }}'

    [platform_api.database]
    password = '{{ file "/secrets/platform-api/postgres_password" }}'

    [ai_workspace.auth.oidc]
    client_secret = '{{ file "/secrets/ai-workspace/oidc_client_secret" }}'
    ```

    

    `[platform_api.auth.jwt]` doesn't appear here, because `idp` mode doesn't use it. If you run `file` or `internal_token` mode, set `public_key_file` and `private_key_file` to mounted paths. They're the exception to the token rule: each is a path, and the service reads and parses the PEM file itself.

    Mount each file read-only at the path its token names:

    ```yaml
    services:
      platform-api:
        volumes:
          - ./resources/keys:/etc/platform-api/keys:ro
          - ./secrets/postgres_password:/secrets/platform-api/postgres_password:ro

      ai-workspace:
        volumes:
          - ./secrets/oidc_client_secret:/secrets/ai-workspace/oidc_client_secret:ro
    ```

    A `file` token reads only from an allowed directory: `/etc/platform-api` and `/secrets/platform-api` for the Platform API, `/etc/ai-workspace` and `/secrets/ai-workspace` for AI Workspace. Set `APIP_CONFIG_FILE_SOURCE_ALLOWLIST` to a comma-separated list to replace those defaults.

=== "Kubernetes"
    Point each component at the Secret that holds its values. The chart injects them as environment variables:

    ```yaml
    # values-secrets.yaml
    platform-api:
      secrets:
        existingSecret: <release-name>-platform-api-secrets
    ai-workspace-ui:
      secrets:
        existingSecret: <release-name>-ai-workspace-ui-secrets
    ```

    Rendering fails when `platform-api.secrets.existingSecret` is unset, so a release can't reach the cluster without its secrets in place.

    The `keys` map names each key inside the Secret. Override an entry only when your Secret uses different key names:

    ```yaml
    platform-api:
      secrets:
        existingSecret: my-platform-api-secret
        keys:
          encryptionKey: ENCRYPTION_KEY
          databasePassword: DATABASE_PASSWORD
          jwtPublicKey: jwt_public.pem
          jwtPrivateKey: jwt_private.pem
          adminUsername: ADMIN_USERNAME
          adminPasswordHash: ADMIN_PASSWORD_HASH
    ```

Resolution fails closed in both deployment shapes. A missing file, a file outside the allowed directories, or an unset variable with no default stops startup rather than running with an empty credential.

## Step 3: Restrict who can read them

- Give the encryption key the narrowest audience that still lets the service start. On a VM that's file mode `600` owned by the account running the container runtime. In Kubernetes it's a Role that grants `get` on that Secret to the deployment's service account and to nobody else.
- Enable encryption at rest for Secrets in your cluster's etcd, or a key management service provider. A Kubernetes Secret is base64-encoded, not encrypted, until you do.
- Keep secrets out of container images, out of `docker-compose.yaml`, out of Helm values files, and out of shell history. A value passed on a command line lands in the process list and in your history file.
- Audit reads where your platform supports it, so an unexpected access is visible.

## Rotate a secret

| Secret | How to rotate | Effect |
|--------|---------------|--------|
| OIDC client secret | Issue a new secret in the identity provider, update the stored value, restart AI Workspace | Signed-in users keep their sessions |
| Database password | Change it on the database server, update the stored value, restart the Platform API | Brief connection errors during the restart |
| At-rest encryption key | No supported rotation that preserves data | Everything encrypted under the old key becomes unreadable |

!!! warning "Rotating the encryption key destroys encrypted data"
    Replacing the at-rest encryption key makes every value encrypted under the previous key permanently unreadable, including stored AI Workspace secrets, subscription tokens, and WebSub HMAC secrets. Treat the key as a value you protect and back up, not one you rotate on a schedule. To move to a different key, plan to re-enter every stored secret afterward.

## Back up

`encryption.key` has no recovery path, and it's small enough to store in a secret manager. Back it up when you create it, verify the copy restores, and store it separately from the database backup. A database backup without its encryption key restores rows whose secret columns can't be decrypted.

## Verify

Start the stack and confirm no service reports a missing requirement.

=== "Virtual machine"
    ```bash
    docker compose up -d
    docker compose ps
    docker compose logs platform-api ai-workspace | grep -i -E 'error|fail'
    ```

    Both containers should reach a healthy state. A message naming a config key or a file path means that value didn't resolve. Check the mount path and the allowed directories.

=== "Kubernetes"
    ```bash
    kubectl -n <namespace> get pods
    kubectl -n <namespace> logs deploy/<release-name>-platform-api | grep -i -E 'error|fail'
    ```

    A pod in `CreateContainerConfigError` means the referenced Secret or one of its keys is missing. Confirm the key names:

    ```bash
    kubectl -n <namespace> get secret <release-name>-platform-api-secrets \
      -o json | jq -r '.data | keys[]'
    ```

    This prints the key names only. Don't print `.data` itself: the values are base64-encoded, not encrypted, and they land in your terminal scrollback.

## Related

- [AI Workspace configuration and environment interpolation](../setting-up/configuration.md): how the `env` and `file` tokens resolve
- [Manage secrets in AI Workspace](../secrets-management.md): the stored secrets the encryption key protects
- [Secure traffic with TLS](tls.md): the other credential every service needs