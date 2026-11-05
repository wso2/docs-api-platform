---
title: "Harden the deployment"
description: "Close the gaps a quickstart leaves open: delegate login to an identity provider, keep authorization enforced, bound connections, and restrict what each container can do and reach."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/harden/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/harden.md
tags:
  - ai-workspace
  - production
  - security
  - hardening
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Harden the deployment

Certificates and secrets have their own pages. This page closes the remaining gaps between a working install and one you expose to an organization: who can sign in, what a signed-in user may do, how much a client can consume, and what a compromised container can reach.

## Step 1: Delegate login to an identity provider

File-based authentication exists for the quickstart and for air-gapped setups. It gives you one local user whose password hash sits in a config file. That user has no multi-factor authentication, no central revocation, and no audit trail beyond your own logs.

Switch both services to your identity provider. They must agree, because the backend for frontend (BFF) runs the login flow and the Platform API validates the resulting token.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#harden-step-1-delegate-login-to-an-identity-provider), [Deploy on Kubernetes](deploy-on-kubernetes.md#harden-step-1-delegate-login-to-an-identity-provider), and [Deploy on OpenShift](openshift.md#openshift-harden-step-1-delegate-login-to-an-identity-provider).

Set `audience` to the client ID so a token minted for a different application in the same tenant is rejected. Leaving it empty skips that check.

Register AI Workspace as a **confidential** client, not a single-page application. The BFF exchanges the authorization code on the back channel with a client secret, and a public-client registration is refused at the token endpoint. For the full walkthrough, including claim mappings and scope registration, see [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md).

## Step 2: Keep authorization enforced and matched

Authorization is on by default and stays on. Turning it off means every validated token can call every endpoint.

Both services carry an authorization mode, and the two must be the same value:

- **`scope`**, the default, reads the token's scope claim. Use it when your provider can mint the platform's `ap:*` scopes.
- **`role`** reads the roles claim and expands each role through a shared mapping file. Use it when your provider can't register those scopes.

A mismatch produces no error at startup. The Platform API enforces the authorization decision, and the workspace only decides which actions to offer. If the two modes differ, the interface either hides actions the Platform API allows, or offers actions that return `403`.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#harden-step-2-keep-authorization-enforced-and-matched), [Deploy on Kubernetes](deploy-on-kubernetes.md#harden-step-2-keep-authorization-enforced-and-matched), and [Deploy on OpenShift](openshift.md#openshift-harden-step-2-keep-authorization-enforced-and-matched).

Grant roles by job, not by convenience. Give administrators the manage scopes and give everyone else a read-only role, so a compromised account can't redeploy a provider or read a stored secret.

## Step 3: Bound what a client can consume

The defaults protect against a slow or idle peer holding a connection open. Review them rather than removing them.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#harden-step-3-bound-what-a-client-can-consume), [Deploy on Kubernetes](deploy-on-kubernetes.md#harden-step-3-bound-what-a-client-can-consume), and [Deploy on OpenShift](openshift.md#openshift-harden-step-3-bound-what-a-client-can-consume).

Keep `write` generous. It bounds handler execution, and some handlers wait on a slow upstream such as an LLM completion. Setting `read` or `read_header` to `0` removes the protection against a client that opens a connection and sends nothing. Set either to `0` only behind a proxy that enforces its own bounds.

Size `max_connections` against your gateway count. Each connected gateway holds a long-lived WebSocket connection, and the limit is global.

## Step 4: Restrict the container

Both images already run as an unprivileged user, UID `10001`. Make that explicit, and remove the privileges neither service needs.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#harden-step-4-restrict-the-container), [Deploy on Kubernetes](deploy-on-kubernetes.md#harden-step-4-restrict-the-container), and [Deploy on OpenShift](openshift.md#openshift-harden-step-4-restrict-the-container).

## Step 5: Restrict what each service can reach

The Platform API accepts connections from exactly two sources: the AI Workspace BFF, and your AI gateways. Nothing else needs to reach it.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#harden-step-5-restrict-what-each-service-can-reach), [Deploy on Kubernetes](deploy-on-kubernetes.md#harden-step-5-restrict-what-each-service-can-reach), and [Deploy on OpenShift](openshift.md#openshift-harden-step-5-restrict-what-each-service-can-reach).

## Step 6: Reduce what you run

- **Leave unused components off.** The distribution ships an API Portal service. On a VM it starts only when its Compose profile is enabled; in the chart it isn't a dependency of this package. Leave it off unless you use it.
- **Keep the plain-HTTP listeners off** unless a proxy in front of the service terminates TLS. They're off by default.
- **Pin image tags to a version, not a moving tag.** A pinned tag makes a rollback deterministic.
- **Pull from a registry you control** where policy requires it, and attach the pull secret rather than making the images public.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#harden-step-6-reduce-what-you-run), [Deploy on Kubernetes](deploy-on-kubernetes.md#harden-step-6-reduce-what-you-run), and [Deploy on OpenShift](openshift.md#openshift-harden-step-6-reduce-what-you-run).

## Step 7: Bound the session

The browser holds no access token, only an HttpOnly session cookie, and the BFF renews tokens server-side. Two settings bound how long that can continue:

- **The refresh token lifetime**, set in your identity provider, is the effective idle bound. A user away longer than that signs in again.
- **`absolute_ttl`**, `8h` by default, caps a session regardless of activity. Even a continuously active user re-authenticates once per window.

Shorten both for a deployment handling sensitive data. Shortening the access token lifetime alone changes only how often the BFF renews in the background.

## Verify

Confirm the hardening took effect rather than assuming it did.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#harden-verify), [Deploy on Kubernetes](deploy-on-kubernetes.md#harden-verify), and [Deploy on OpenShift](openshift.md#openshift-harden-verify).

## Related

- [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md): the full OIDC setup this page switches on
- [Authentication in AI Workspace](../setting-up/authentication/overview.md): how the two authentication modes differ
- [Provision secrets and keys](secrets-and-keys.md): the credentials behind these settings
- [Deploy on VMs](deploy-on-vms.md), [Deploy on Kubernetes](deploy-on-kubernetes.md), and [Deploy on OpenShift](openshift.md): where this page fits in the full deployment sequence
