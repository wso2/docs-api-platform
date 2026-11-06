---
title: "Authenticate to the Management API"
description: "Configure Basic Auth or JWT/IDP authentication and role-based authorization for the API Platform Gateway Controller management REST API."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/gateway-controller-management-api/authentication/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/gateway-controller-management-api/authentication.md
tags:
  - api-gateway
  - authentication
  - security
  - management-api
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-20
content_type: "how-to"
---

# Authentication & Authorization in Gateway Controller

## Overview
The Gateway Controller REST API (the control-plane API used to manage gateway configuration) can be protected using either locally configured users (Basic Auth) or an external Identity Provider (JWT validation via JWKS). Authorization is role-based and enforced per API route.

## How It Works

### Authentication (Who are you?)
You can enable one (or both) of the following:

- **Basic Auth (local users)**: Define usernames/passwords and assign local roles.
- **IDP/JWT (external users)**: Validate incoming JWTs using `jwks_url`, and optionally `issuer` and `audience`.

**No Authentication (open access)**: If BOTH `basic.enabled` and `idp.enabled` are set to `false`, all requests to the gateway controller are allowed without authentication.

### Authorization (Are you allowed?)
Gateway Controller routes are protected using **local roles** (for example `admin`, `developer`, `consumer`).

When IDP/JWT authentication is enabled, the controller checks the caller's roles on every protected route:

- **`roles_claim`** names the JWT claim that carries the caller's roles. It defaults to `roles`. If you set it to an empty value while `idp.enabled` is `true`, the controller fails to start.
- **`role_mapping`** translates IDP role values to local roles. It's optional when your IDP already issues the local role names. A claim value that matches no mapping passes through unchanged.
- If a token doesn't contain the claim named in `roles_claim`, the caller has no local roles, and the controller denies access to every protected route.

The controller reads the roles claim as either a space-separated string or an array of strings.

## Configuration
In the umbrella gateway config, these settings live under `controller.auth`. (If you run the controller standalone, the same structure applies under the controller's config root.)

### Option A: Basic Auth (local users)
```yaml
controller:
  auth:
    basic:
      enabled: true
      users:
        - username: "platform-admin"
          password: "$bcrypt$..."
          password_hashed: true
          roles: ["admin"]
        - username: "ops"
          password: "ops"
          password_hashed: false
          roles: ["developer"]
```

### Option B: JWT (IDP) with role-based authorization
```yaml
controller:
  auth:
    idp:
      enabled: true
      jwks_url: "https://idp.example.com/oauth2/jwks"
      issuer: "https://idp.example.com/oauth2/token"
      # Optional: accept only tokens issued for these audiences
      audience: ["gateway-controller"]

      roles_claim: "groups"   # Defaults to "roles". For example, "groups", "scope", or "roles"
      # Optional when the IDP already issues local role names
      role_mapping:
        admin: ["gateway-admins", "platform-admins"]
        developer: ["api-developers", "ops"]
        # Optional: give any authenticated user a baseline role
        consumer: ["*"]
```

### Restrict tokens by audience
Set `audience` to the values the controller accepts in a token's `aud` claim. The controller accepts a token when its `aud` claim contains at least one configured value, and rejects every other token.

```yaml
controller:
  auth:
    idp:
      audience: ["gateway-controller", "https://gateway.example.com"]
```

If you leave `audience` empty, which is the default, the controller doesn't validate the `aud` claim and logs a warning at startup. Set `audience` in production so that the controller rejects tokens your IDP issued for other applications.

## Role Mapping Semantics
`role_mapping` is defined as:

```text
local_role -> [idp_role_value_1, idp_role_value_2, ...]
```

Notes:
- **Specific mappings take precedence** over wildcard matches.
- **Wildcard (`"*"`)** means: if a JWT role value does not match any specific mapping, it can still map to the local role that includes `"*"`.
- **One JWT role can grant multiple local roles** by listing it under multiple local roles.
- **Wildcard mapping must be unique**: Do not configure more than one local role with `"*"` (for example `admin: ["*"]` and `consumer: ["*"]`). The Gateway Controller validates configuration and rejects multiple wildcard roles in `role_mapping`.

### Example: One IDP group grants multiple local roles
```yaml
role_mapping:
  admin: ["platform-admins"]
  developer: ["platform-admins", "api-developers"]
```
In this example, a user in `platform-admins` becomes both `admin` and `developer` in the Gateway Controller.

## Troubleshooting (What you’ll observe)
- **Requests are denied after enabling JWT auth**: verify that `jwks_url`, and if set, `issuer` and `audience`, match the token you're sending. When `audience` is set, the token's `aud` claim must contain at least one configured value.
- **The controller fails to start with `auth.idp.roles_claim is empty`**: set `roles_claim` to the claim that carries the caller's roles, or remove the empty value so that the default `roles` applies.
- **Every authenticated request is forbidden**: confirm that the token contains the claim named in `roles_claim`, which defaults to `roles`. If your IDP uses another claim, such as `groups` or `scope`, set `roles_claim` to it.
- **Users authenticate but don't have expected access**: confirm that the values in the token's `roles_claim` are either local role names or match what you listed in `role_mapping`.
- **You want authentication without role checks**: IDP/JWT authentication always runs role checks. To give every authenticated user a baseline role, add a wildcard mapping such as `consumer: ["*"]`. The token still needs at least one value in its `roles_claim`.
- **You want to disable auth entirely**: set both `basic.enabled` and `idp.enabled` to `false`.

## Testing
Unit tests cover wildcard precedence, one-to-many role grants, and supported claim formats for `roles_claim`.