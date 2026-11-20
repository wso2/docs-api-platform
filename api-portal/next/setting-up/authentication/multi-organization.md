---
title: "Serve multiple organizations from one API Portal"
description: "Run one API Portal & MCP Hub for every organization in your identity provider, with organizations provisioned from the token on first sign-in."
canonical_url: https://wso2.com/api-platform/docs/api-portal/next/setting-up/authentication/multi-organization/
md_url: https://wso2.com/api-platform/docs/api-portal/next/setting-up/authentication/multi-organization.md
tags:
  - api-portal
  - authentication
  - multi-organization
  - oidc
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-13
content_type: "how-to"
---

# Serve multiple organizations from one API Portal

By default, an API Portal & MCP Hub instance serves exactly one organization: the one named by `[api_portal.organization] handle`. *Multi-organization mode* lets one portal serve every organization under its `organization.portal_id` instead. Each user works in the organization their identity provider (IdP) says they belong to, and the portal creates an organization it hasn't seen before the first time one of its users signs in.

Use multi-organization mode when one IdP holds many organizations and you want a single portal deployment for all of them—for example, WSO2 Identity Server or Asgardeo with business-to-business (B2B) sub-organizations, or Keycloak with Organizations. This guide is for the administrator who deploys the portal.

!!! note "Identity provider mode only"
    Multi-organization mode needs `[api_portal.auth] mode = "idp"`. Local authentication has no per-user organization claim to route by, so it stays single-organization even with the setting on, and the portal logs a warning at startup.

## Enable multi-organization mode

Add these tables to `configs/config.toml`, alongside the identity provider settings described in [Connect an identity provider to the API Portal](connect-an-identity-provider.md):

```toml
[api_portal.multi_organization]
enabled = true

[api_portal.auth]
mode = "idp"

[api_portal.auth.claim_mappings]
organization = "org_id"       # claim carrying the organization's stable ID
org_name     = "org_name"     # optional: names a provisioned organization
org_handle   = "org_handle"   # optional: its URL handle, taken as is

[api_portal.auth.idp]
# Required in this mode: the audience bearer tokens must be issued for, usually the
# client ID. Give several as a comma-separated string or an array.
audience = "<portal-client-id>"
```

`enabled` must be `true` or `false`. Any other value, such as `"yes"`, stops the portal from starting. For a worked example against WSO2 Identity Server, see [Set up WSO2 Identity Server for multiple organizations](wso2-is-as-idp.md).

## Deployment requirements

Check your deployment against these requirements before you turn the mode on:

- **The deployment owns its `portal_id`.** Several instances may share an `organization.portal_id` only as replicas of the same deployment, with identical configuration. Don't run any other portal with the same `portal_id`.
- **Other portals may share the database under their own `portal_id`.** Portals with different `portal_id` values don't see each other's organizations, and an IdP organization that signs in to two multi-organization portals is provisioned separately in each.
- **Replicas share `security.encryption_key`.** Any replica may deliver webhooks for any organization.
- **Provisioning needs verified TLS to the IdP.** See [How organizations are provisioned](#how-organizations-are-provisioned).
- **`auth.idp.audience` is required.** The portal refuses to start without it in this mode, because a token the IdP issued to any other application would otherwise be accepted for every organization.

At startup, the portal logs that it's running in multi-organization mode and lists the organizations it serves, so you can confirm it points at the database and `portal_id` you meant. It also logs an error for organizations that share an IdP reference ID. Sign-ins to those organizations are refused as ambiguous until you change one of them.

## How organizations are resolved

The two modes decide which organization a request belongs to in different ways:

| Where | Single-organization mode | Multi-organization mode |
|---|---|---|
| Page URL `/api-portal/<handle>/...` | Only `organization.handle`. Any other handle returns `404` | Any existing organization with exactly that handle. Unknown handles return `404`, and a URL never creates an organization |
| Organization claim of a session or bearer token | Must name the configured organization | Matched exactly against each organization's IdP reference ID, never against a handle or display name |
| `GET` and `PUT /organizations/{orgId}` | Only the configured organization | Only the caller's own organization |
| Webhook delivery | The configured organization's events | Every organization's events |

A user's session belongs to one organization for its whole lifetime. Signed-in pages of any other organization—applications, subscriptions, API keys, and settings—return `403`, and **Settings** isn't shown there, even to an administrator. The public pages of every existing organization stay open to anyone.

An organization claim that's a list or a map, which Keycloak Organizations can send, is accepted when it names exactly one organization and refused with `403` when it names several.

## Organization claims

The organization claim, named by `[api_portal.auth.claim_mappings] organization`, decides which organization a login or a bearer token acts in. This behavior is fixed, and there's no setting for it:

| Claim in the token | Single-organization mode | Multi-organization mode |
|---|---|---|
| The configured organization | Allowed | Allowed |
| Another existing organization | `403` | Allowed, as that organization |
| An organization that doesn't exist yet | `403` | Provisioned, then allowed |
| No organization claim | Allowed, as the configured organization | Allowed, as the configured organization |

A credential without an organization claim belongs to the configured organization and keeps its own roles or scopes. A claim that names an organization is never redirected to the configured one.

!!! important "Make sure every user's tokens carry the organization claim"
    A user whose token arrives without the claim lands in the configured organization with the roles their token carries, so an administrator of their own organization becomes an administrator of the configured one. That happens, for example, with a Keycloak client that has no organization mapper, or an Auth0 user who signs in without choosing an organization. Also check that `claim_mappings.organization` names the claim your IdP actually sends: a wrong name makes every token claimless.

## How organizations are provisioned

With multi-organization mode on, a verified token whose organization claim names no known organization creates that organization. It gets the same defaults the configured organization gets on first start: a `default` view and label, and the default subscription plans when `organization.auto_create_subscription_plans` is on.

The portal names a provisioned organization from the token:

- **IdP reference ID:** the organization claim's value, verbatim.
- **URL handle:** the `org_handle` claim, lowercased, when the token carries a usable one—letters, digits, `.`, `_`, and `-`. Otherwise, the portal derives the handle from the `org_name` claim, or else from the organization claim.
- **Display name:** the `org_name` claim, else the `org_handle` claim, else the organization claim.

If another organization already has that handle or display name, the portal adds a short suffix, such as `acme-3f2a1c`. The handle and display name are set once, at provisioning, so renaming the organization in the IdP later doesn't change them.

The portal provisions an organization only from a claim that arrived over verified TLS. Otherwise, the login or request gets `403`, and the portal logs the reason:

- **Browser logins:** `auth.idp.token_url` must use `https`. Plain `http` is allowed only to `localhost` or a loopback address.
- **Bearer tokens:** the portal needs a pinned `auth.idp.certificate`, or `auth.idp.jwks_url` over `https`, and `auth.idp.jwks_url_template` over `https` when it's set.
- **TLS verification turned off:** `NODE_TLS_REJECT_UNAUTHORIZED=0` disables provisioning. To trust a self-signed IdP certificate, add it with `NODE_EXTRA_CA_CERTS` instead.

Existing organizations keep working when provisioning is refused.

## How users sign in

Every login returns through the single `auth.idp.callback_url`. In multi-organization mode, the login flow works like this:

- **The configured organization's login page sends no organization hint** to the IdP, so the IdP runs its own login and organization selection. A user whose organization the portal hasn't seen yet signs in from here, because their organization's own pages don't exist yet.
- **Any other organization's login page** sends that organization's IdP reference ID as the `org` authorization parameter. Only an IdP that accepts `org=<id>` scopes the login by it. WSO2 Identity Server 7.x takes a handle there, not the `org_id` UUID, so with `org_id` keying its users choose their organization on the Identity Server login page instead. The organization check after login is the same either way.
- **`?org=<id>` on a login URL** overrides the hint, which makes it a direct sign-in link for one organization: `/api-portal/default/views/default/login?org=<orgId>`.
- **After login, the user lands in their own organization**: back on the page they came from if it belongs to that organization, otherwise on its default view.
- **Silent sign-in** (`auth.idp.silent_sso`, on by default) sends the same hint as a login from the page being browsed. With an IdP that honors the hint, a visitor is signed in silently only on their own organization's pages. With one that ignores it, they're signed in to their own organization wherever they browse, and their session still reaches only their own organization's signed-in pages and data. Either way, a silent sign-in leaves the visitor on the page they were reading.

The portal reads roles and groups from the access token first, then from the ID token, so release them in the access token where your IdP allows it.

## Bearer tokens for the Management API

The portal verifies bearer tokens exactly as in single-organization mode: signed by the keys at `auth.idp.jwks_url` or the pinned `auth.idp.certificate`, and issued for one of the values in `auth.idp.audience`, which multi-organization mode requires: the portal doesn't start without it. When `auth.idp.issuer` is set, the token must also be issued by it, which is recommended. The organization is then the one the token's organization claim names.

A token issued under an organization's own issuer—for example, one obtained directly from a WSO2 Identity Server or Asgardeo organization's token endpoint, `.../o/<org-id>/oauth2/token`—is accepted only when you describe those issuers, as in [Accept tokens from per-organization issuers](#accept-tokens-from-per-organization-issuers). Browser sign-ins to every organization go through the configured issuer, so they don't need it.

### Accept tokens from per-organization issuers

Some identity providers issue each organization's tokens under that organization's own issuer, and sign them with that organization's own keys. To accept bearer tokens issued that way, describe the issuer and its JWKS URL as templates in `[api_portal.auth.idp]`, with `{org}` where the organization's ID appears:

```toml
[api_portal.auth.idp]
issuer_template    = "https://<idp-host>/o/{org}/oauth2/token"
jwks_url_template  = "https://<idp-host>/o/{org}/oauth2/jwks"
template_org_claim = "org_id"
```

| Key | Description |
|---|---|
| `issuer_template` | The per-organization issuer, with one `{org}` placeholder |
| `jwks_url_template` | The per-organization JWKS URL, with one `{org}` placeholder. When empty, every organization's tokens are verified against `auth.idp.jwks_url` |
| `template_org_claim` | The token claim that must equal `{org}`. When empty, the portal uses the claim named by `claim_mappings.organization` |

All three are empty by default, which keeps a single issuer, and they take effect only in multi-organization mode.

When a bearer token's `iss` matches `issuer_template`, the portal:

1. Reads the organization ID from the `{org}` position of the issuer. It must be a plain identifier: letters, digits, `-`, and `_`.
2. Verifies the token's signature against the keys at `jwks_url_template`, with that ID filled in, and its issuer against that exact `iss`. Only the `{org}` value comes from the token; the rest of the JWKS URL comes from your configuration.
3. Checks that the claim named by `template_org_claim` equals that organization ID, and that the token carries the organization claim.
4. Treats the token as it does any other: the request acts in the organization that the organization claim names.

A token whose `iss` is `auth.idp.issuer` is verified as before.

Set `template_org_claim` when you key organizations on a different claim from the one in the issuer. WSO2 Identity Server puts the organization's `org_id` in the issuer, so keying organizations on `org_handle` or `org_name` needs `template_org_claim = "org_id"`.

Keep these in mind:

- The token's audience is still checked against `auth.idp.audience`. A token issued to an organization's own copy of the application carries that copy's client ID, so list those client IDs there too.
- Per-organization issuers need a JWKS URL. With `auth.idp.certificate` set, bearer tokens are verified against that certificate only.
- `issuer_template` and `jwks_url_template` must each contain exactly one `{org}`, and `jwks_url_template` must use `https`, like `auth.idp.jwks_url`; otherwise, the portal doesn't start.

## Webhooks

In multi-organization mode, the portal delivers every organization's events, and each organization's subscribers receive only that organization's events. There's nothing extra to configure—see [Webhooks](../../admin-settings/webhook-integration.md).

## Publish a provisioned organization's catalog

APIs published from the Platform API always land in the configured organization. A provisioned organization gets its APIs and MCP servers through the [Management API](../../rest-api/overview.md), with a token issued for one of its administrators.

## Claim names for common identity providers

Check each value against your IdP, because claim names and issuer formats vary by version and configuration. Decode a real token—for example, with `jq -R 'split(".")[1] | gsub("-"; "+") | gsub("_"; "/") | @base64d | fromjson'`—to confirm `iss` and the organization claims before relying on them.

| Identity provider | `organization` | `org_name` | `org_handle` | Notes |
|---|---|---|---|---|
| WSO2 Identity Server 7.x | `org_id` | `org_name` | `org_handle` | Shared root application, with each portal organization an Identity Server organization. See [Set up WSO2 Identity Server for multiple organizations](wso2-is-as-idp.md) |
| Asgardeo | `org_id` | `org_name` | Check your tokens | The same model as WSO2 Identity Server |
| Keycloak (Organizations) | `organization` | — | — | The claim is a list or map of organization aliases, one per user. The portal's `org` login hint isn't a Keycloak parameter, so users pick their organization in Keycloak |
| Auth0 (Organizations) | `org_id` | `org_name` | — | Auth0 prompts for the organization itself. The portal's `org` hint isn't Auth0's `organization` parameter |
| Okta | Your custom organization claim | — | — | Add the claim to your authorization server's access and ID tokens |

Keycloak's realm-per-organization model, with a different login endpoint and client for each organization, isn't supported, because the portal has one IdP login configuration.

## Turn multi-organization mode off

With `multi_organization.enabled = false`, the portal serves only `organization.handle` again. Organizations created while the mode was on stay in the database but aren't reachable: their pages return `404`, their users' tokens are refused, and their pending webhook deliveries stay pending until you turn the mode back on.

## Troubleshooting

These log lines explain why the portal refused an organization claim:

| Log line | Meaning |
|---|---|
| `Rejected org claim naming an unknown organization` | The claim matches no organization's IdP reference ID |
| `Refused to provision an organization from an org claim: …` | The channel to the IdP isn't verified TLS. The reason follows the colon |
| `Org claim matches more than one organization's idp_ref_id` | Two organizations share an IdP reference ID. Change one of them |
| `Multi-organization: organizations share an idp_ref_id …`, at startup | The same problem, found at startup. It names the organizations, and is common after pointing `auth.idp_org_id` at an ID that an already provisioned organization holds |
| `Rejected org claim naming more than one organization` | A list or map organization claim names several organizations |

## Related topics

- [Connect an identity provider to the API Portal](connect-an-identity-provider.md): the IdP configuration every deployment needs
- [Set up WSO2 Identity Server for multiple organizations](wso2-is-as-idp.md): a worked example of this mode
- [Configurations](../../references/configurations.md#multi-organization): the `[api_portal.multi_organization]` table
- [Organization settings](../../admin-settings/organization-settings.md): an organization's display name and IdP reference ID