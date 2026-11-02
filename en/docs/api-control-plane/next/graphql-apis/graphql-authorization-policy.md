---
title: "GraphQL authorization policy"
description: "Authorize GraphQL query and mutation root fields by OAuth scopes and JWT claims with the graphql-authz policy."
canonical_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/graphql-authorization-policy/
md_url: https://wso2.com/api-platform/docs/api-control-plane/next/graphql-apis/graphql-authorization-policy.md
tags:
  - api-control-plane
  - graphql
  - policies
  - authorization
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-05
content_type: "reference"
---

# GraphQL authorization policy

The GraphQL authorization policy (`graphql-authz`) controls access to individual query and mutation fields of a GraphQL API. It checks the OAuth scopes and JWT claims of each request against rules that you configure per field.

A GraphQL API has a single endpoint, so the gateway can't attach a policy to individual operations at the route level. The `graphql-authz` policy inspects the request body instead, and applies your rules to each root field that the operation selects.

## Before you begin

Attach an authentication policy, such as `jwt-auth`, before `graphql-authz` in the policy order. The authentication policy validates the token and makes its scopes and claims available to `graphql-authz`. For the list of available policies, see the [Policy Hub](../../../policy-hub/overview.md).

## How rules match fields

You configure rules in three places:

- **`queries`:** rules for root fields of the `Query` type, by field name.
- **`mutations`:** rules for root fields of the `Mutation` type, by field name.
- **`global`:** one rule that applies to every query and mutation root field.

In `queries` and `mutations`, a rule named `*` matches every field of that type.

Every rule that matches a field applies, and all of them must grant access. A `*` rule or the `global` rule doesn't replace a field's own rule. If a field has its own rule and a `*` rule, the request must satisfy both.

If no rule matches a field, the policy doesn't govern that field. The request passes through for that field, and the rest of the API's policy chain decides whether to allow it.

## Parameters

The policy takes the following parameters. You must set at least one of them.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `queries` | Array of rules | Rules for root `Query` fields. When present, it must contain at least one rule. |
| `mutations` | Array of rules | Rules for root `Mutation` fields. When present, it must contain at least one rule. |
| `global` | Object | A `scopes` or `claims` requirement that applies to every query and mutation root field, in addition to any matching rule. |

Each rule in `queries` or `mutations` takes the following fields. A rule must set at least one of `scopes` or `claims`, and the `global` rule takes the same fields except `name`.

| Field | Required | Description |
| :--- | :--- | :--- |
| `name` | Yes | The field name to authorize, such as `books` or `addBook`, or `*` to match every field of the type. |
| `scopes` | No | The scopes that the token must carry. Use `allOf` to require every listed scope, `anyOf` to require at least one, or both. |
| `claims` | No | The claims that the token must carry. Use `allOf`, `anyOf`, or both. Each entry has a `claim` name and a list of accepted `values`. |

If you set both `allOf` and `anyOf`, the request must satisfy both conditions. A claim matches when its value is one of the listed `values`.

## How the policy evaluates a request

For each `POST` request, the policy runs these steps:

1. Parse the GraphQL request body, and select the operation to run. If the document defines more than one operation, the request must set `operationName`.
2. Collect the root fields that the operation selects, including fields inside fragments. The policy ignores `__typename`.
3. Find every rule that matches each root field.
4. If no rule matches any field, forward the request without further checks.
5. If at least one field has a matching rule, require an authenticated request. If the request isn't authenticated, return `401`.
6. Check every matching rule for every governed field. If any rule fails, return `403`.
7. If every rule passes, forward the request unchanged.

A request can select more than one root field, for example `query { books authors }`. The request succeeds only if it satisfies the rules for every governed field.

## Attach the policy

To attach the policy in the console, follow these steps:

1. Open the GraphQL API, and then select **Develop** > **Policies**.
2. Attach the `jwt-auth` policy, and configure your identity provider.
3. Find `graphql-authz` in **Available policies**, and configure its rules.
4. Select **Attach policy**, and then select **Save**.
5. Redeploy the API. For more information, see [Deploy a GraphQL API](deploy-graphql-api.md).

For more information about the **Policies** page, see [Apply policies to a GraphQL API](apply-policies.md).

To attach the policy by using the Platform API, add it to the `policies` array of the API metadata. For more information, see [Manage GraphQL APIs with the Platform API](platform-api.md).

## Examples

The examples show the `graphql-authz` parameters for a bookstore API with `books` and `authors` queries, and `addBook` and `deleteBook` mutations.

### Example 1: Basic field access control

The following configuration requires `books:read` for the `books` query and `books:write` for the `addBook` mutation:

```yaml
queries:
  - name: books
    scopes:
      anyOf:
        - "books:read"
mutations:
  - name: addBook
    scopes:
      anyOf:
        - "books:write"
```

| Request | Caller | Result |
| :--- | :--- | :--- |
| `query { books { id } }` | Has `books:read` | Authorized |
| `mutation { addBook(title: "Dune") { id } }` | Has `books:read` only | `403`, because `addBook` requires `books:write` |
| `query { books { id } }` | Not authenticated | `401`, because a rule governs `books` |
| `query { authors { id } }` | Any caller | Not governed by this policy, because no rule matches `authors` |

### Example 2: Type-wide wildcard

The following configuration adds a `*` rule, so every query field also requires `api:read`:

```yaml
queries:
  - name: books
    scopes:
      anyOf:
        - "books:read"
  - name: "*"
    scopes:
      anyOf:
        - "api:read"
```

| Request | Caller | Result |
| :--- | :--- | :--- |
| `query { authors { id } }` | Has `api:read` | Authorized, because only the `*` rule matches `authors` |
| `query { books { id } }` | Has `api:read` only | `403`, because the `books` rule also applies and requires `books:read` |
| `query { books { id } }` | Has `books:read` and `api:read` | Authorized |

### Example 3: Global baseline

The following configuration requires `api:access` for every query and mutation field, in addition to the field-level rules:

```yaml
queries:
  - name: books
    scopes:
      anyOf:
        - "books:read"
mutations:
  - name: addBook
    scopes:
      anyOf:
        - "books:write"
global:
  scopes:
    anyOf:
      - "api:access"
```

Fields without their own rule, such as `authors`, now require `api:access` instead of passing through.

| Request | Caller | Result |
| :--- | :--- | :--- |
| `query { authors { id } }` | Has `api:access` | Authorized, because only the `global` rule matches `authors` |
| `query { books { id } }` | Has `api:access` only | `403`, because the `books` rule requires `books:read` |
| `query { books { id } }` | Has `books:read` only | `403`, because the `global` rule requires `api:access` |
| `query { books { id } }` | Has `books:read` and `api:access` | Authorized |

### Example 4: Claim-based rules

The following configuration restricts `deleteBook` to callers whose `role` claim is `admin`:

```yaml
mutations:
  - name: deleteBook
    claims:
      allOf:
        - claim: role
          values: ["admin"]
queries:
  - name: books
    scopes:
      anyOf:
        - "books:read"
  - name: authors
    scopes:
      anyOf:
        - "authors:read"
```

| Request | Caller | Result |
| :--- | :--- | :--- |
| `mutation { deleteBook(id: "1") }` | Claim `role=admin` | Authorized |
| `mutation { deleteBook(id: "1") }` | Claim `role=user` | `403`, because the claim value doesn't match |
| `query { books { id } authors { id } }` | Has `books:read` only | `403`, because `authors` requires `authors:read` |

### Example 5: Claims only

Rules don't need scopes. The following configuration uses only claims:

```yaml
queries:
  - name: books
    claims:
      anyOf:
        - claim: department
          values: ["sales", "marketing"]
mutations:
  - name: deleteBook
    claims:
      allOf:
        - claim: role
          values: ["admin"]
global:
  claims:
    allOf:
      - claim: tenant
        values: ["acme-corp"]
```

| Request | Caller | Result |
| :--- | :--- | :--- |
| `query { books { id } }` | Claims `department=sales` and `tenant=acme-corp` | Authorized |
| `query { books { id } }` | Claims `department=engineering` and `tenant=acme-corp` | `403`, because the `department` value isn't accepted |
| `mutation { deleteBook(id: "1") }` | Claims `role=admin` and `tenant=other-corp` | `403`, because the `global` rule requires `tenant=acme-corp` |
| `mutation { deleteBook(id: "1") }` | Claims `role=admin` and `tenant=acme-corp` | Authorized |

## Limitations

- **Subscriptions:** The policy doesn't govern `subscription` operations. The gateway doesn't route GraphQL subscriptions.
- **Fields without rules:** The policy doesn't evaluate a field that no rule matches. To require a baseline scope or claim for every field, configure `global`.
- **Adding `*` or `global` later:** These rules apply in addition to field-level rules. If you add one to an existing configuration, every field that it matches must also satisfy it.
