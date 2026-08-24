---
title: "Authentication in AI Workspace"
description: "Understand the two ways users sign in to AI Workspace: file-based authentication for local use and an identity provider for production."
canonical_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/authentication/overview/
md_url: https://wso2.com/api-platform/docs/cloud/ai-workspace/authentication/overview.md
tags:
  - cloud
  - ai-workspace
  - authentication
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-09
content_type: "concept"
---

# Authentication in AI Workspace

AI Workspace supports two authentication modes, set with the `auth_mode` key in `config.toml`. A running instance uses one mode at a time.

| Mode | `auth_mode` value | Best for |
|------|--------------------|----------|
| File-based | `basic` | Local use and quick demos, no identity provider required |
| Identity provider | `oidc` | Production, where a dedicated identity provider manages user login |

## File-based authentication

File-based authentication stores a list of users directly in the Platform API configuration file. It requires no external identity provider, which makes it the default when you [get started with AI Workspace](../getting-started.md) using Docker Compose.

When `auth_mode = "basic"`, the AI Workspace login page renders a username and password form. The Platform API validates the credentials against a hashed user list defined in `config-platform-api.toml`:

![AI Workspace file-based login window with Username and Password fields](../../../assets/img/ai-gateway/ai-workspace/authentication/filebased-login.png)

```toml
[auth.file_based]
enabled = true

[[auth.file_based.users]]
username      = "admin"
password_hash = "$2a$10$..."   # bcrypt hash of the password
role          = "admin"
```

Generate a bcrypt hash for the password with any standard tool, for example:

```bash
htpasswd -bnBC 10 "" "your-password" | tr -d ':\n'
```

The Docker Compose bundle ships with a default `admin` / `admin` credential so you can sign in right away. Change this password before sharing the deployment with anyone else.

File-based authentication has two limitations:

- It supports a single organization only. Multiple organizations require an identity provider.
- The user list is static. Changes require restarting the Platform API container.

Because of these limitations, file-based authentication isn't suitable for production or shared environments.

## Identity provider authentication

For production, configure AI Workspace to delegate login to an identity provider (IdP) over OIDC. AI Workspace works with any OIDC-compliant IdP that meets these requirements:

| Requirement | Details |
|-------------|---------|
| OIDC discovery | The IdP exposes `/.well-known/openid-configuration` at its authority URL |
| JWT access tokens | Access tokens are JWTs, not opaque tokens |
| JWKS endpoint | The IdP exposes a JWKS endpoint so the Platform API can verify token signatures |
| Custom claims | Tokens carry organization identity as custom claims (claim names are configurable) |
| Confidential client | AI Workspace is registered as a confidential client with a client secret, not a public or single-page application client |

!!! note
    We're expanding our step-by-step setup guides to cover more identity providers. For now, [Set up Asgardeo as your identity provider](asgardeo-setup.md) walks through a complete configuration using Asgardeo. The same concepts apply to any OIDC-compliant IdP, such as Keycloak, Auth0, or Okta.

## Choosing a mode

Use file-based authentication when you're trying out AI Workspace, running a demo, or don't yet have an identity provider available. Move to an identity provider before you deploy to a shared or production environment, need multiple organizations, or want single sign-on with an existing identity system.