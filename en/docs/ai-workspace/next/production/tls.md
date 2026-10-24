---
title: "Secure traffic with TLS"
description: "Give AI Workspace and the Platform API certificates from your own CA, decide where TLS terminates, and make the backend-for-frontend verify the control plane."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/tls/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/production/tls.md
tags:
  - ai-workspace
  - production
  - security
  - tls
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Secure traffic with TLS

Neither service generates a Transport Layer Security (TLS) certificate for itself. When an HTTPS listener is on, it needs a certificate and key, and it stops at startup without them. Plan certificates before the first production start.

Three hops carry traffic in a production deployment, and each one needs its own certificate decision:

| Hop | From | To |
|-----|------|----|
| Browser to workspace | A user's browser | Your reverse proxy or ingress, then AI Workspace |
| Workspace to control plane | The AI Workspace backend for frontend (BFF) | The Platform API |
| Gateway to control plane | Each AI gateway | The Platform API |

## Step 1: Decide where TLS terminates

You have two models. Both are valid in production; pick one per deployment and apply it consistently.

| Model | How it works | Choose it when |
|-------|--------------|----------------|
| Terminate at the service | Your proxy passes TLS through, and each service presents its own certificate on its HTTPS listener | You want encryption on every hop, including inside the host or cluster network |
| Terminate at the edge | The proxy or ingress holds the public certificate and forwards to the service's plain-HTTP listener | Your platform already encrypts internal traffic, such as a service mesh, or your proxy is the only place certificates are managed |

Terminating at the edge means the plain-HTTP listener carries real user traffic. Bind it only to a network your proxy reaches, never to a public interface.

## Step 2: Supply the certificate for the workspace listener

Use a certificate whose subject alternative name covers the public hostname browsers use.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#tls-step-2-supply-the-certificate-for-the-workspace-listener), [Deploy on Kubernetes](deploy-on-kubernetes.md#tls-step-2-supply-the-certificate-for-the-workspace-listener), and [Deploy on OpenShift](openshift.md#openshift-tls-step-2-supply-the-certificate-for-the-workspace-listener).

## Step 3: Make the BFF verify the Platform API

The BFF opens a server-to-server connection to the Platform API on every proxied call. Verify that certificate, because this hop carries every user's access token.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#tls-step-3-make-the-bff-verify-the-platform-api), [Deploy on Kubernetes](deploy-on-kubernetes.md#tls-step-3-make-the-bff-verify-the-platform-api), and [Deploy on OpenShift](openshift.md#openshift-tls-step-3-make-the-bff-verify-the-platform-api).

!!! danger "Never skip verification in production"
    `tls_skip_verify` (`tlsSkipVerify` in the chart) accepts any certificate the upstream presents, which removes the protection TLS gives this hop. It exists for local development against a self-signed certificate. If you can't verify the certificate, fix the trust chain rather than turning the check off.

## Step 4: Encrypt the database connection

The Platform API stores encrypted secrets, so encrypt its database connection as well. Set `ssl_mode` to `verify-full` and supply the CA certificate. For the full procedure, including client certificates for mutual TLS, see [Connect a database to the Platform API](../setting-up/database.md).

## Step 5: Give gateways a certificate they trust

Each AI gateway connects to the Platform API over HTTPS and WebSocket. Whatever certificate the Platform API presents at that address has to chain to a CA the gateway trusts. A certificate issued only for an in-cluster Service name fails when the gateway runs elsewhere. See [Connect AI gateways in production](connect-gateways.md).

## Verify

Check the certificate each listener presents, and confirm the chain validates:

```bash
# The workspace listener, from outside.
openssl s_client -connect workspace.example.com:443 \
  -servername workspace.example.com -verify_hostname workspace.example.com \
  -verify_return_error -CAfile /etc/ssl/certs/ca-certificates.crt </dev/null \
  | openssl x509 -noout -subject -issuer -dates

# The control plane, from a host that reaches it.
openssl s_client -connect platform-api.example.com:9243 \
  -servername platform-api.example.com -verify_hostname platform-api.example.com \
  -verify_return_error -CAfile ./ca.pem </dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

`-verify_return_error` makes `s_client` exit nonzero on a validation failure instead of printing the certificate anyway. Point `-CAfile` at the system trust store for a publicly issued certificate, and at your own bundle for a private one. Because the pipe masks the exit status, run each `openssl s_client` command on its own first and check that it reports `Verify return code: 0 (ok)`.

Then sign in through a browser and confirm there's no certificate warning. A warning means the chain doesn't validate. Check the issuer against the trust store the browser uses, check that the certificate hasn't expired and isn't post-dated, and check that its subject alternative names cover the hostname users type.

Check the BFF hop by making a proxied call from the UI. A `502` in the AI Workspace logs mentioning certificate verification means `ca_file` doesn't cover the Platform API's issuer.

## Related

- [Expose AI Workspace](expose-the-workspace.md): the ingress and reverse proxy that sit in front of these listeners
- [Connect a database to the Platform API](../setting-up/database.md): TLS on the database connection
- [Provision secrets and keys](secrets-and-keys.md): the other credentials each service needs at startup
