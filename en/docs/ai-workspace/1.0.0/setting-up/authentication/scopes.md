---
title: "Scopes and custom roles in AI Workspace"
description: "Learn how scopes control access in AI Workspace, how to create a custom role, and what every Platform API scope allows."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/authentication/scopes/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/setting-up/authentication/scopes.md
tags:
  - cloud
  - ai-workspace
  - authentication
  - scopes
  - roles
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "reference"
---

# Scopes and custom roles in AI Workspace

The Platform API decides what a user can do from the scopes in their token. A scope is a permission, such as reading LLM providers or deleting a project. A role is a named set of scopes. [Authentication in AI Workspace](overview.md#add-more-users) shows how to give users the roles that ship with AI Workspace. This page is for when those roles don't fit: it explains how scopes work, how to define your own role, and what every scope allows.

## How scopes work

Every Platform API operation lists the scopes that authorize it, and a caller needs at least one of them. For example, creating an organization accepts `ap:organization:create` or `ap:organization:manage`. Holding either is enough.

### Scope names

Platform API scopes start with `ap:` and follow a fixed pattern:

| Pattern | What it grants |
|---------|----------------|
| `ap:<resource>:<action>` | One action on a resource, such as `ap:llm_proxy:read` |
| `ap:<resource>:manage` | Every action on the resource, including its sub-resources |
| `ap:<resource>:<sub-resource>:<action>` | One action on a sub-resource, such as `ap:llm_proxy:deployment:read` |
| `ap:<resource>:<sub-resource>:manage` | Every action on that sub-resource only |
| `ap:<resource>:all:manage` | An ownership override. See [Ownership override](#ownership-override) |

### The manage scope covers sub-resources

Each sub-resource operation also accepts its parent's `manage` scope. Granting `ap:llm_provider:manage` therefore already covers every `ap:llm_provider:api_key:…` and `ap:llm_provider:deployment:…` operation. Grant a sub-resource scope only to a role that doesn't hold the parent's `manage` scope. Listing both is redundant.

API Portal publishing is the exception. `ap:api_portal:manage` doesn't reach an API's drafts or its REST and GraphQL publications. Grant the `ap:api_portal:draft:…`, `ap:api_portal:rest_api:manage` or `ap:api_portal:graphql_api:manage` scopes separately when a role needs them.

### Ownership override

`ap:api_key:all:manage` is the only scope of its kind in the Platform API specification. It widens whose API keys a user can reach, not which actions they can take. Without it, a user works with the API keys they created. It never implies, and is never implied by, plain `manage`, so grant it explicitly alongside the base scope.

### No wildcards

A scope grants only the operations that list it. There's no wildcard form, so you spell out every scope a role needs. A `*` in any segment of a scope is rejected when the Platform API starts.

### Roles combine

When a user holds several roles, they receive the union of those roles' scopes. The most permissive combination wins.

## Create a custom role

A custom role is an entry in the role-to-scope mapping file. The role names the scopes it grants, and you then assign the role to users.

### Step 1: Define the role

Open the mapping file that `[platform_api.auth.authorization] role_to_scope_mapping` points to. The distributions mount it at `/etc/platform-api/role-to-scope-mapping.yaml`. Add an entry under `roles:`:

```yaml
roles:
  # ... the built-in roles stay as they are ...

  # Manages LLM proxies, but can only read LLM providers.
  - name: ap_llm_proxy_manager
    scopes:
      - ap:organization:read
      - ap:project:read
      - ap:llm_proxy:manage
      - ap:llm_provider:read
```

This role can do the following:

- `ap:llm_proxy:manage` allows every action on LLM proxies. It includes their API keys, builds and deployments, because `manage` covers sub-resources.
- `ap:llm_provider:read` lets the role read LLM providers but not change them. The built-in `ap_publisher` role handles providers the same way.
- `ap:organization:read` and `ap:project:read` are carried by the built-in roles too, so this example includes them. Compare your role with the built-in role closest to it in the mapping file.

Pick every scope from the [scope reference](#scope-reference) below. Copy each scope exactly, because an `ap:` scope that the Platform API's specification doesn't declare stops it from starting. Built-in role names start with `ap_`, and your roles can follow the same convention.

### Step 2: Assign the role to users

How you assign the role depends on the authentication mode.

**File-based authentication.** Name the role in the user's `roles` list. You can combine it with built-in roles:

```toml
[[platform_api.auth.file.users]]
username      = "llm-admin"
password_hash = "$2a$12$..."
roles         = ["ap_llm_proxy_manager"]
```

A role that the mapping file doesn't define stops the Platform API from starting. See [Add more users](overview.md#add-more-users).

**Identity provider authentication in role mode.** Have your identity provider emit the role's name in the claim that `claim_mappings.roles` names, for example by mapping a group in your IdP onto `ap_llm_proxy_manager`. In role mode, AI Workspace also needs the same mapping file mounted in its container, so the UI and the Platform API agree on what each role allows. See [Step 3](connect-an-identity-provider.md#step-3-choose-how-privileges-reach-the-token) and [Step 5](connect-an-identity-provider.md#step-5-configure-ai-workspace) of the identity provider guide.

**Identity provider authentication in scope mode.** The mapping file doesn't apply. The token itself must carry the scopes, so register the scopes you need in your identity provider and grant them to the application.

### Step 3: Restart

The mapping file is read at startup, so restart the services after you edit it. In the Docker Compose distribution, run:

```bash
docker compose up --force-recreate
```

## Scope reference

These are the `ap:` scopes that the Platform API's OpenAPI specification declares, with the descriptions it gives them. Each table covers one resource. The resource's own scopes come first, followed by those of its sub-resources.

Builds that include the event gateway plugin declare further scopes for WebSub and web broker APIs. The shipped mapping file keeps those scopes commented out.

### Agent proxy

| Scope | What it allows |
|-------|----------------|
| `ap:agent_proxy:manage` | Full access to Agent proxies |
| `ap:agent_proxy:create` | Create an Agent proxy |
| `ap:agent_proxy:read` | Read Agent proxies |
| `ap:agent_proxy:update` | Update an Agent proxy |
| `ap:agent_proxy:delete` | Delete an Agent proxy |
| `ap:agent_proxy:api_key:manage` | Full access to an Agent proxy's API keys |
| `ap:agent_proxy:api_key:create` | Create an API key for an Agent proxy |
| `ap:agent_proxy:api_key:read` | Read an Agent proxy's API key metadata |
| `ap:agent_proxy:api_key:update` | Update an API key of an Agent proxy |
| `ap:agent_proxy:api_key:delete` | Revoke an API key of an Agent proxy |
| `ap:agent_proxy:build:manage` | Full access to an Agent proxy's builds |
| `ap:agent_proxy:build:create` | Prepare a build of an Agent proxy |
| `ap:agent_proxy:build:read` | Read builds of an Agent proxy |
| `ap:agent_proxy:build:delete` | Delete a build of an Agent proxy |
| `ap:agent_proxy:deployment:manage` | Full access to Agent proxy deployments |
| `ap:agent_proxy:deployment:create` | Deploy an Agent proxy |
| `ap:agent_proxy:deployment:read` | Read Agent proxy deployments |
| `ap:agent_proxy:deployment:delete` | Delete an Agent proxy deployment |
| `ap:agent_proxy:deployment:restore` | Restore an Agent proxy deployment |
| `ap:agent_proxy:deployment:undeploy` | Undeploy an Agent proxy deployment |

### API key

| Scope | What it allows |
|-------|----------------|
| `ap:api_key:read` | Read API keys owned by the current user |
| `ap:api_key:all:manage` | Manage API keys created by any user in the organization |

### API portal

| Scope | What it allows |
|-------|----------------|
| `ap:api_portal:manage` | Full access to API Portals |
| `ap:api_portal:create` | Create an API Portal |
| `ap:api_portal:read` | Read API Portals |
| `ap:api_portal:update` | Update an API Portal |
| `ap:api_portal:delete` | Delete an API Portal |
| `ap:api_portal:draft:manage` | Read and write an API's draft for one portal |
| `ap:api_portal:draft:read` | Read an API's draft for one portal — the private workspace prepared before publishing |
| `ap:api_portal:draft:update` | Edit an API's draft for one portal |
| `ap:api_portal:graphql_api:manage` | Publish, unpublish and deprecate a GraphQL API on a portal |
| `ap:api_portal:mcp_proxy:manage` | Publish, unpublish and deprecate an MCP proxy on a portal |
| `ap:api_portal:publication:read` | Read an API's live listing on one portal |
| `ap:api_portal:rest_api:manage` | Publish, unpublish and deprecate a REST API on a portal |

### API publication

| Scope | What it allows |
|-------|----------------|
| `ap:api_publication:read` | Read an API's publication status across every portal |

### Application

| Scope | What it allows |
|-------|----------------|
| `ap:application:manage` | Full access to applications |
| `ap:application:create` | Create an application |
| `ap:application:read` | Read applications |
| `ap:application:update` | Update an application |
| `ap:application:delete` | Delete an application |
| `ap:application:api_key:manage` | Full access to application API keys |
| `ap:application:api_key:create` | Create an application API key |
| `ap:application:api_key:read` | Read application API keys |
| `ap:application:api_key:delete` | Delete an application API key |
| `ap:application:association:manage` | Full access to application associations |
| `ap:application:association:create` | Create an application association |
| `ap:application:association:read` | Read application associations |
| `ap:application:association:delete` | Delete an application association |
| `ap:application:association:api_key:read` | Read API keys for an application association |

### Docs

| Scope | What it allows |
|-------|----------------|
| `ap:docs:manage` | Create, update, and delete user-authored API documents |
| `ap:docs:read` | Read user-authored API documents |

### Gateway

| Scope | What it allows |
|-------|----------------|
| `ap:gateway:manage` | Full access to gateways |
| `ap:gateway:create` | Create a gateway |
| `ap:gateway:read` | Read gateways |
| `ap:gateway:update` | Update a gateway |
| `ap:gateway:delete` | Delete a gateway |
| `ap:gateway:manifest:read` | Read a gateway manifest |
| `ap:gateway:token:manage` | Full access to gateway tokens |
| `ap:gateway:token:create` | Create a gateway token |
| `ap:gateway:token:read` | Read gateway tokens |
| `ap:gateway:token:delete` | Delete a gateway token |

### Gateway custom policy

| Scope | What it allows |
|-------|----------------|
| `ap:gateway_custom_policy:manage` | Full access to gateway custom policies |
| `ap:gateway_custom_policy:create` | Create a gateway custom policy |
| `ap:gateway_custom_policy:read` | Read gateway custom policies |
| `ap:gateway_custom_policy:delete` | Delete a gateway custom policy |

### GraphQL API

| Scope | What it allows |
|-------|----------------|
| `ap:graphql_api:manage` | Full access to GraphQL APIs |
| `ap:graphql_api:create` | Create a GraphQL API |
| `ap:graphql_api:read` | Read GraphQL APIs |
| `ap:graphql_api:update` | Update a GraphQL API |
| `ap:graphql_api:delete` | Delete a GraphQL API |
| `ap:graphql_api:api_key:manage` | Full access to a GraphQL API's API keys |
| `ap:graphql_api:api_key:create` | Create an API key for a GraphQL API |
| `ap:graphql_api:api_key:update` | Update an API key of a GraphQL API |
| `ap:graphql_api:api_key:delete` | Delete an API key of a GraphQL API |
| `ap:graphql_api:build:manage` | Full access to a GraphQL API's builds |
| `ap:graphql_api:build:create` | Prepare a build of a GraphQL API |
| `ap:graphql_api:build:read` | Read builds of a GraphQL API |
| `ap:graphql_api:build:delete` | Delete a build of a GraphQL API |
| `ap:graphql_api:deployment:manage` | Full access to GraphQL API deployments |
| `ap:graphql_api:deployment:create` | Deploy a GraphQL API |
| `ap:graphql_api:deployment:read` | Read GraphQL API deployments |
| `ap:graphql_api:deployment:delete` | Delete a GraphQL API deployment |
| `ap:graphql_api:deployment:restore` | Restore a GraphQL API deployment |
| `ap:graphql_api:deployment:undeploy` | Undeploy a GraphQL API deployment |
| `ap:graphql_api:gateway:manage` | Full access to a GraphQL API's gateways |
| `ap:graphql_api:gateway:create` | Add gateways to a GraphQL API |
| `ap:graphql_api:gateway:read` | Read a GraphQL API's gateways |

### LLM provider

| Scope | What it allows |
|-------|----------------|
| `ap:llm_provider:manage` | Full access to LLM providers |
| `ap:llm_provider:create` | Create an LLM provider |
| `ap:llm_provider:read` | Read LLM providers |
| `ap:llm_provider:update` | Update an LLM provider |
| `ap:llm_provider:delete` | Delete an LLM provider |
| `ap:llm_provider:api_key:manage` | Full access to LLM provider API keys |
| `ap:llm_provider:api_key:create` | Create an LLM provider API key |
| `ap:llm_provider:api_key:read` | Read LLM provider API keys |
| `ap:llm_provider:api_key:delete` | Delete an LLM provider API key |
| `ap:llm_provider:build:manage` | Full access to an LLM provider's builds |
| `ap:llm_provider:build:create` | Prepare a build of an LLM provider |
| `ap:llm_provider:build:read` | Read builds of an LLM provider |
| `ap:llm_provider:build:delete` | Delete a build of an LLM provider |
| `ap:llm_provider:deployment:manage` | Full access to LLM provider deployments |
| `ap:llm_provider:deployment:create` | Deploy an LLM provider |
| `ap:llm_provider:deployment:read` | Read LLM provider deployments |
| `ap:llm_provider:deployment:delete` | Delete an LLM provider deployment |
| `ap:llm_provider:deployment:restore` | Restore an LLM provider deployment |
| `ap:llm_provider:deployment:undeploy` | Undeploy an LLM provider deployment |

### LLM proxy

| Scope | What it allows |
|-------|----------------|
| `ap:llm_proxy:manage` | Full access to LLM proxies |
| `ap:llm_proxy:create` | Create an LLM proxy |
| `ap:llm_proxy:read` | Read LLM proxies |
| `ap:llm_proxy:update` | Update an LLM proxy |
| `ap:llm_proxy:delete` | Delete an LLM proxy |
| `ap:llm_proxy:api_key:manage` | Full access to LLM proxy API keys |
| `ap:llm_proxy:api_key:create` | Create an LLM proxy API key |
| `ap:llm_proxy:api_key:read` | Read LLM proxy API keys |
| `ap:llm_proxy:api_key:delete` | Delete an LLM proxy API key |
| `ap:llm_proxy:build:manage` | Full access to an LLM proxy's builds |
| `ap:llm_proxy:build:create` | Prepare a build of an LLM proxy |
| `ap:llm_proxy:build:read` | Read builds of an LLM proxy |
| `ap:llm_proxy:build:delete` | Delete a build of an LLM proxy |
| `ap:llm_proxy:deployment:manage` | Full access to LLM proxy deployments |
| `ap:llm_proxy:deployment:create` | Deploy an LLM proxy |
| `ap:llm_proxy:deployment:read` | Read LLM proxy deployments |
| `ap:llm_proxy:deployment:delete` | Delete an LLM proxy deployment |
| `ap:llm_proxy:deployment:restore` | Restore an LLM proxy deployment |
| `ap:llm_proxy:deployment:undeploy` | Undeploy an LLM proxy deployment |

### LLM template

| Scope | What it allows |
|-------|----------------|
| `ap:llm_template:manage` | Full access to LLM provider templates |
| `ap:llm_template:create` | Create an LLM provider template |
| `ap:llm_template:read` | Read LLM provider templates |
| `ap:llm_template:update` | Update an LLM provider template |
| `ap:llm_template:delete` | Delete an LLM provider template |

### MCP proxy

| Scope | What it allows |
|-------|----------------|
| `ap:mcp_proxy:manage` | Full access to MCP proxies |
| `ap:mcp_proxy:create` | Create an MCP proxy |
| `ap:mcp_proxy:read` | Read MCP proxies |
| `ap:mcp_proxy:update` | Update an MCP proxy |
| `ap:mcp_proxy:delete` | Delete an MCP proxy |
| `ap:mcp_proxy:build:manage` | Full access to an MCP proxy's builds |
| `ap:mcp_proxy:build:create` | Prepare a build of an MCP proxy |
| `ap:mcp_proxy:build:read` | Read builds of an MCP proxy |
| `ap:mcp_proxy:build:delete` | Delete a build of an MCP proxy |
| `ap:mcp_proxy:deployment:manage` | Full access to MCP proxy deployments |
| `ap:mcp_proxy:deployment:create` | Deploy an MCP proxy |
| `ap:mcp_proxy:deployment:read` | Read MCP proxy deployments |
| `ap:mcp_proxy:deployment:delete` | Delete an MCP proxy deployment |
| `ap:mcp_proxy:deployment:restore` | Restore an MCP proxy deployment |
| `ap:mcp_proxy:deployment:undeploy` | Undeploy an MCP proxy deployment |

### Meter

| Scope | What it allows |
|-------|----------------|
| `ap:meter:manage` | Full access to meters |
| `ap:meter:create` | Create a meter |
| `ap:meter:read` | Read meters |
| `ap:meter:update` | Update a meter |
| `ap:meter:delete` | Delete a meter |

### Organization

| Scope | What it allows |
|-------|----------------|
| `ap:organization:manage` | Full access to an organization |
| `ap:organization:create` | Create an organization |
| `ap:organization:read` | Read an organization |

### Project

| Scope | What it allows |
|-------|----------------|
| `ap:project:manage` | Full access to projects |
| `ap:project:create` | Create a project |
| `ap:project:read` | Read projects |
| `ap:project:update` | Update a project |
| `ap:project:delete` | Delete a project |

### REST API

| Scope | What it allows |
|-------|----------------|
| `ap:rest_api:manage` | Full access to REST APIs |
| `ap:rest_api:create` | Create a REST API |
| `ap:rest_api:read` | Read REST APIs |
| `ap:rest_api:update` | Update a REST API |
| `ap:rest_api:delete` | Delete a REST API |
| `ap:rest_api:api_key:manage` | Full access to a REST API's API keys |
| `ap:rest_api:api_key:create` | Create an API key for a REST API |
| `ap:rest_api:api_key:update` | Update an API key of a REST API |
| `ap:rest_api:api_key:delete` | Delete an API key of a REST API |
| `ap:rest_api:build:manage` | Full access to a REST API's builds |
| `ap:rest_api:build:create` | Prepare a build of a REST API |
| `ap:rest_api:build:read` | Read builds of a REST API |
| `ap:rest_api:build:delete` | Delete a build of a REST API |
| `ap:rest_api:deployment:manage` | Full access to REST API deployments |
| `ap:rest_api:deployment:create` | Deploy a REST API |
| `ap:rest_api:deployment:read` | Read REST API deployments |
| `ap:rest_api:deployment:delete` | Delete a REST API deployment |
| `ap:rest_api:deployment:restore` | Restore a REST API deployment |
| `ap:rest_api:deployment:undeploy` | Undeploy a REST API deployment |
| `ap:rest_api:gateway:manage` | Full access to a REST API's gateways |
| `ap:rest_api:gateway:create` | Add gateways to a REST API |
| `ap:rest_api:gateway:read` | Read a REST API's gateways |

### Secret

| Scope | What it allows |
|-------|----------------|
| `ap:secret:manage` | Full access to secrets |
| `ap:secret:create` | Create a secret |
| `ap:secret:read` | Read secrets |
| `ap:secret:update` | Update a secret |
| `ap:secret:delete` | Delete a secret |

### Service account

| Scope | What it allows |
|-------|----------------|
| `ap:service_account:manage` | Full access to service accounts |
| `ap:service_account:read` | Read service accounts |

### Subscription

| Scope | What it allows |
|-------|----------------|
| `ap:subscription:manage` | Full access to subscriptions |
| `ap:subscription:create` | Create a subscription |
| `ap:subscription:read` | Read subscriptions |
| `ap:subscription:update` | Update a subscription |
| `ap:subscription:delete` | Delete a subscription |

### Subscription plan

| Scope | What it allows |
|-------|----------------|
| `ap:subscription_plan:manage` | Full access to subscription plans |
| `ap:subscription_plan:create` | Create a subscription plan |
| `ap:subscription_plan:read` | Read subscription plans |
| `ap:subscription_plan:update` | Update a subscription plan |
| `ap:subscription_plan:delete` | Delete a subscription plan |
| `ap:subscription_plan:pricing:read` | Read the pricing of a subscription plan |

### Thumbnail

| Scope | What it allows |
|-------|----------------|
| `ap:thumbnail:manage` | Create, update, and delete an API's thumbnail |
| `ap:thumbnail:read` | Read an API's thumbnail |

### Webhook secret

| Scope | What it allows |
|-------|----------------|
| `ap:webhook_secret:manage` | Full access to webhook secrets |
| `ap:webhook_secret:create` | Create a webhook secret |
| `ap:webhook_secret:read` | Read webhook secret metadata |
| `ap:webhook_secret:delete` | Delete a webhook secret or one of its versions |
| `ap:webhook_secret:rotate` | Rotate a webhook secret |

## API Portal scopes

Scopes that start with `dp:` belong to the API Portal, not the Platform API. The Platform API puts them in the token but never enforces them, and it checks only their shape, not whether they exist. A misspelled `dp:` scope therefore doesn't stop the Platform API from starting. It's silently ineffective.

A `dp:<resource>:manage` scope grants every action on that API Portal resource, and read operations accept `:manage` as well as `:read`. The shipped mapping file grants `dp:` scopes alongside the `ap:` scopes in each built-in role, so one role covers both. The full list is in the [API Portal OpenAPI specification](https://github.com/wso2/api-platform/blob/main/portals/api-portal/resources/openapi/api-portal-openapi-spec-v0.9.yaml).
