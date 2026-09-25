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
last_updated: 2026-08-06
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

=== "Virtual machine"
    Give each service its own certificate and key from your CA, so neither container holds a private key that can impersonate the other. Keep the `cert.pem` and `key.pem` file names the stack expects:

    ```text
    resources/certificates/
    ├── platform-api/
    │   ├── cert.pem
    │   └── key.pem
    └── ai-workspace/
        ├── cert.pem
        └── key.pem
    ```

    Mount each pair read-only into the container that uses it:

    ```yaml
    services:
      platform-api:
        volumes:
          - ./resources/certificates/platform-api:/app/data/certs:ro

      ai-workspace:
        volumes:
          - ./resources/certificates/ai-workspace:/etc/ai-workspace/tls:ro
    ```

    The paths inside each container differ, and the config keys already point at them:

    ```toml
    # configs/config.toml
    [ai_workspace.server.https]
    enabled   = true
    port      = 9643
    cert_file = "/etc/ai-workspace/tls/cert.pem"
    key_file  = "/etc/ai-workspace/tls/key.pem"

    [platform_api.server.https]
    enabled   = true
    port      = 9243
    cert_file = "/app/data/certs/cert.pem"
    key_file  = "/app/data/certs/key.pem"
    ```

    The shipped `docker-compose.yaml` mounts a single `resources/certificates/` directory into both containers instead, which serves both services from one pair. That's correct when the two answer on one hostname, but it puts one private key in two places. Split the mounts as shown before you go to production.

    To terminate TLS at a proxy instead, turn the HTTPS listener off and enable plain HTTP:

    ```toml
    [ai_workspace.server.https]
    enabled = false

    [ai_workspace.server.http]
    enabled = true
    port    = 9680
    ```

    Recreate the containers so they load the change. A plain `docker compose up` leaves running containers on the old certificate:

    ```bash
    docker compose up -d --force-recreate
    ```

    **Renew before expiry.** Neither service reloads a certificate while it runs, and neither watches the file for a change. An expired certificate takes the listener down, so treat renewal as a scheduled task rather than something you react to.

    Check what you're running against, per service:

    ```bash
    openssl x509 -enddate -noout -in resources/certificates/ai-workspace/cert.pem
    ```

    To renew, write the new pair over the old files, keeping the same paths and the `600` file mode, then recreate the containers with the command above. Automate the whole sequence on a timer well inside the certificate's lifetime. For a 90-day certificate, renew at 30 days remaining, which leaves room for a failed attempt. Alert on the expiry date from your monitoring as a backstop, so a broken renewal job surfaces before the certificate does.

=== "Kubernetes"
    Each component chart takes its certificate from one of two providers, and both are valid in production. Pick one and set `certificateProvider` per component:

    - **cert-manager** issues and renews the certificate for you, which removes expiry as a failure mode. It needs cert-manager and an issuer in the cluster.
    - **A Secret you manage** keeps issuance wherever it already happens, such as an external CA or a secret manager that syncs into the cluster. You handle renewal.

    **With cert-manager and your own issuer.** If cert-manager isn't in the cluster, install it first, so its custom resource definitions exist before the chart renders:

    ```bash
    helm repo add jetstack https://charts.jetstack.io --force-update
    helm repo update

    helm install cert-manager jetstack/cert-manager \
      --namespace cert-manager --create-namespace \
      --set crds.enabled=true
    ```

    Point the chart at a `ClusterIssuer` you already run, such as an ACME or private-CA issuer, and set `createIssuer: false` so the chart doesn't create a self-signed one:

    ```yaml
    ai-workspace-ui:
      tls:
        certificateProvider: cert-manager
        certManager:
          create: true
          createIssuer: false
          issuerRef:
            name: letsencrypt-production
            kind: ClusterIssuer
          commonName: workspace.example.com
          dnsNames:
            - workspace.example.com
          duration: 2160h
          renewBefore: 720h

    platform-api:
      tls:
        certificateProvider: cert-manager
        certManager:
          create: true
          createIssuer: false
          issuerRef:
            name: letsencrypt-production
            kind: ClusterIssuer
          commonName: platform-api.example.com
          dnsNames:
            - platform-api.example.com
    ```

    Leaving `createIssuer: true` makes the chart create a self-signed issuer. That's fine for a test cluster and wrong for production, because nothing outside the cluster trusts the result.

    **With a Secret you manage.** Create a `kubernetes.io/tls` Secret for each service and reference it. Both charts support the `secret` provider, so configure both:

    ```yaml
    ai-workspace-ui:
      tls:
        certificateProvider: secret
        secret:
          name: ai-workspace-tls
          certKey: tls.crt
          keyKey: tls.key

    platform-api:
      tls:
        certificateProvider: secret
        secret:
          name: platform-api-tls
          certKey: tls.crt
          keyKey: tls.key
    ```

    Neither chart accepts a self-signed provider. Rendering fails rather than starting a listener with no working certificate.

    To terminate TLS at the ingress instead, enable the plain-HTTP listener and route the ingress to it. Apply this to whichever services the ingress fronts:

    ```yaml
    ai-workspace-ui:
      config:
        server:
          http:
            enabled: true
            port: 9080

    platform-api:
      config:
        server:
          http:
            enabled: true
            port: 9080
    ```

## Step 3: Make the BFF verify the Platform API

The BFF opens a server-to-server connection to the Platform API on every proxied call. Verify that certificate, because this hop carries every user's access token.

=== "Virtual machine"
    Point `ca_file` at the CA bundle that signed the Platform API's certificate, and leave verification on:

    ```toml
    # configs/config.toml
    [ai_workspace.control_plane]
    url             = "https://platform-api:9243"
    tls_skip_verify = false
    ca_file         = "/etc/ai-workspace/tls/ca.pem"
    ```

    The bundle is appended to the system roots, so a certificate from a public CA needs no `ca_file` at all. Mount your bundle under `/etc/ai-workspace` or another allowed directory.

=== "Kubernetes"
    Mount your CA bundle and name it in the component config:

    ```yaml
    ai-workspace-ui:
      config:
        controlPlane:
          tlsSkipVerify: false
          caFile: /etc/ai-workspace/tls/ca.pem
      deployment:
        extraVolumes:
          - name: control-plane-ca
            configMap:
              name: internal-ca
        extraVolumeMounts:
          - name: control-plane-ca
            mountPath: /etc/ai-workspace/tls/ca.pem
            subPath: ca.pem
            readOnly: true
    ```

    Leave `config.controlPlane.url` empty to derive the in-cluster Service URL from `global.platformApi`. Set it only when the Platform API runs outside this release.

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