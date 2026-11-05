---
title: "Provision secrets and keys"
description: "Generate, store, and reference the encryption key, database password, and OIDC client secret that a production AI Workspace deployment requires."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/secrets-and-keys/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/secrets-and-keys.md
tags:
  - ai-workspace
  - production
  - security
  - secrets
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
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

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#secrets-step-1-generate-the-values), [Deploy on Kubernetes](deploy-on-kubernetes.md#secrets-step-1-generate-the-values), and [Deploy on OpenShift](openshift.md#openshift-secrets-step-1-generate-the-values).

## Step 2: Reference the secrets from configuration

Never write a secret value into `config.toml` or a values file. Reference it instead, so the value stays in the store you chose.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#secrets-step-2-reference-the-secrets-from-configuration), [Deploy on Kubernetes](deploy-on-kubernetes.md#secrets-step-2-reference-the-secrets-from-configuration), and [Deploy on OpenShift](openshift.md#openshift-secrets-step-2-reference-the-secrets-from-configuration).

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

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#step-7-start-the-deployment), [Deploy on Kubernetes](deploy-on-kubernetes.md#secrets-verify), and [Deploy on OpenShift](openshift.md#openshift-secrets-verify).

## Related

- [AI Workspace configuration and environment interpolation](../setting-up/configuration.md): how the `env` and `file` tokens resolve
- [Manage secrets in AI Workspace](../secrets-management.md): the stored secrets the encryption key protects
- [Secure traffic with TLS](tls.md): the other credential every service needs
