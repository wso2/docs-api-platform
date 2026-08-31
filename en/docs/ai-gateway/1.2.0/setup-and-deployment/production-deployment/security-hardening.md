---
title: "Security Hardening"
description: "Harden API Platform AI Gateway before production: AES-256 at-rest encryption keys, TLS for the listener and upstreams, and management API authentication."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/security-hardening/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/security-hardening.md
tags:
  - ai-gateway
  - production
  - security
  - encryption
  - tls
  - secrets
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Security hardening

Configure three areas before the AI Gateway carries production traffic:

- Encryption keys for data at rest.
- Transport Layer Security (TLS) for data in transit.
- Authentication on the management API.

All three matter more on an AI Gateway than on a plain API gateway. Its artifacts hold the credentials for every large language model (LLM) provider and guardrail service you route to.

## Encryption keys

The controller encrypts sensitive data at rest with 256-bit keys under Advanced Encryption Standard in Galois/Counter Mode (AES-GCM). On an AI Gateway this covers the LLM provider upstream API keys and the guardrail service credentials, such as Azure Content Safety and AWS Bedrock Guardrails keys. It also covers any values you store through the secrets management API.

At-rest encryption is mandatory. The 1.2.0 chart is fail-closed: it refuses to render unless `gateway.controller.encryptionKeys.enabled` is `true` with a `secretName`, and the controller doesn't start without its key. Provision the key before you install.

Generate a 256-bit AES key:

```bash
openssl rand -out default-aesgcm256-v1.bin 32
```

Create the Kubernetes Secret in the namespace you install into:

```bash
kubectl create secret generic gateway-encryption-keys \
  --namespace <your-namespace> \
  --from-file=default-aesgcm256-v1.bin=./default-aesgcm256-v1.bin
```

Remove the local key file:

```bash
rm ./default-aesgcm256-v1.bin
```

!!! warning
    Never commit the key file to source control. Delete it as soon as the Kubernetes Secret exists. Losing the key makes every stored LLM provider credential unrecoverable.

Reference the Secret in `values.yaml`:

```yaml
gateway:
  controller:
    encryptionKeys:
      enabled: true
      secretName: gateway-encryption-keys
      mountPath: /app/data/aesgcm-keys
```

Then point the encryption provider at the mounted file:

```yaml
gateway:
  config:
    controller:
      encryption:
        providers:
          - type: aesgcm
            keys:
              - version: aesgcm256-v1
                file: /app/data/aesgcm-keys/default-aesgcm256-v1.bin
```

The `version` field must match the key identifier in the filename. The identifier is the part after the `default-` prefix and before the `.bin` extension, so `default-aesgcm256-v1.bin` gives version `aesgcm256-v1`. The `file` path must sit under the `mountPath` you set above.

### Rotate an encryption key

To rotate a key, follow these steps:

1. Generate a replacement key with `openssl rand`.
2. Add it to the Kubernetes Secret under a filename with an incremented version, such as `default-aesgcm256-v2.bin`.
3. Add the matching entry to the `encryption.providers` list in `values.yaml`.
4. Run `helm upgrade`. The controller picks up the new key on startup.

!!! note
    Keep the older key versions in the Secret until everything encrypted under them has been re-encrypted. Removing a key version that data still depends on makes that data unreadable.

## TLS configuration

Configure TLS before you expose the gateway. Pick the option that matches how your organization issues certificates.

=== "Option A: cert-manager"

    cert-manager provisions and renews certificates inside the cluster. Install it if you don't already manage certificates externally.

    ```bash
    helm repo add jetstack https://charts.jetstack.io --force-update
    helm repo update

    helm install cert-manager jetstack/cert-manager \
      --namespace cert-manager \
      --create-namespace \
      --set crds.enabled=true
    ```

    Confirm every cert-manager pod is running:

    ```bash
    kubectl get pods -n cert-manager
    ```

    Point the chart at your issuer:

    ```yaml
    gateway:
      controller:
        tls:
          enabled: true
          certificateProvider: cert-manager
          certManager:
            create: true
            createIssuer: false          # Use your own ClusterIssuer
            issuerRef:
              name: letsencrypt-prod     # Your ClusterIssuer name
              kind: ClusterIssuer
            commonName: ai-gateway.example.com
            dnsNames:
              - ai-gateway.example.com
            duration: 2160h              # 90 days
            renewBefore: 720h            # Renew 30 days before expiry
    ```

    !!! note
        Leave `createIssuer` at `false` in production. The self-signed issuer the chart can create is meant for local testing, and clients reject its certificates unless you distribute the certificate authority (CA) yourself.

=== "Option B: existing TLS Secret"

    Use this option when certificates come from a corporate public key infrastructure (PKI), HashiCorp Vault, or another external system.

    ```bash
    kubectl create secret tls gateway-tls \
      --namespace <your-namespace> \
      --cert=./ai-gateway.crt \
      --key=./ai-gateway.key
    ```

    Reference the Secret:

    ```yaml
    gateway:
      controller:
        tls:
          enabled: true
          certificateProvider: secret
          secret:
            name: gateway-tls
            certKey: tls.crt
            keyKey: tls.key
    ```

### Restrict the listener TLS versions

The chart accepts TLS 1.2 and 1.3 on the HTTPS listener by default. Raise the floor to TLS 1.3 if your clients support it:

```yaml
gateway:
  config:
    router:
      downstream_tls:
        minimum_protocol_version: TLS1_3
        maximum_protocol_version: TLS1_3
```

### Trust private CAs on upstream connections

Commercial LLM providers present publicly trusted certificates, so the default trust store covers them. Self-hosted models, internal MCP servers, and corporate egress proxies that terminate TLS often don't. Mount the CA bundle so the gateway can verify those upstreams:

```bash
kubectl create configmap gateway-upstream-certs \
  --namespace <your-namespace> \
  --from-file=private-ca.crt=./my-ca.crt
```

```yaml
gateway:
  controller:
    upstreamCerts:
      enabled: true
      configMapName: gateway-upstream-certs
```

!!! warning
    Leave `gateway.config.router.upstream.tls.disable_ssl_verification` at `false` and `verify_host_name` at `true`. Turning off upstream verification exposes every prompt and completion travelling to your LLM providers to interception.

## Authentication

!!! warning
    Replace the default `admin`/`admin` credentials before deploying anywhere other than a local machine. The management API these credentials protect can read and rewrite every LLM provider, proxy, and policy on the gateway.

Choose the strategy that matches how your organization handles access.

=== "Option A: identity provider (recommended)"

    Delegating to your identity provider leaves no credentials in the cluster to manage or rotate.

    ```yaml
    gateway:
      config:
        controller:
          auth:
            basic:
              enabled: false
            idp:
              enabled: true
              jwks_url: "https://idp.example.com/.well-known/jwks.json"
              issuer: "https://idp.example.com"
              roles_claim: "scope"
              role_mapping:
                admin: ["gateway:admin"]
                developer: ["gateway:developer"]
                consumer: ["gateway:consumer"]
    ```

    !!! note
        The values in `role_mapping` must match claims the identity provider actually issues in its JSON Web Tokens (JWTs). For the roles the controller recognizes and the operations each one permits, see the [gateway controller management API definition](https://raw.githubusercontent.com/wso2/api-platform/refs/tags/ai-gateway/v1.2.0/gateway/gateway-controller/api/management-openapi.yaml).

=== "Option B: basic auth with bcrypt"

    Where basic auth is required, store a bcrypt hash rather than a plain-text password. The hash isn't reversible, so it's safe to keep in Helm values and the resulting ConfigMap.

    Generate the hash. This needs `apache2-utils` on Debian or Ubuntu, or `httpd-tools` on RHEL and CentOS:

    ```bash
    htpasswd -nBC 10 admin | cut -d: -f2
    # Prompts for the password, then prints: $2y$10$...
    ```

    On macOS without `htpasswd`, run it in a container:

    ```bash
    docker run --rm -it httpd:alpine htpasswd -nBC 10 admin | cut -d: -f2
    ```

    Omitting `-b` makes `htpasswd` prompt for the password, so the password stays out of your shell history and out of the process list.

    Store the password itself in your organization's secret manager, alongside the rest of your break-glass credentials. Don't keep a second copy in a Kubernetes Secret: nothing on the gateway reads it, and it gives anyone who can read Secrets in the namespace the plain-text password.

    Put only the hash in the chart values:

    ```yaml
    gateway:
      config:
        controller:
          auth:
            basic:
              enabled: true
              users:
                - username: "admin"
                  password: "$2y$10$..."   # bcrypt hash
                  password_hashed: true
                  roles: ["admin"]
    ```

    !!! note
        Basic auth users are an array of structs, so environment variables can't override them. The hash has to come through Helm values. Rotate a credential by generating a new hash, updating the values, and running `helm upgrade`.

## Restrict the debug endpoints

The controller and the policy engine both run an admin server that dumps configuration. Keep Go profiling off and narrow the address ranges that can reach them:

```yaml
gateway:
  config:
    controller:
      admin_server:
        enabled: true
        port: 9092
        allowed_ips: ["10.0.0.0/8"]
        pprof:
          enabled: false
    policy_engine:
      admin:
        enabled: true
        port: 9002
        allowed_ips: ["127.0.0.1"]
        pprof:
          enabled: false
```

The chart ships `allowed_ips: ["*"]` for both servers, which is appropriate for a local container and too wide for a cluster. Narrow it to your pod or node CIDR, and leave the admin ports off the Services as described in [Ingress configuration](./index.md#ingress-configuration).

---

[← Production deployment overview](./index.md) &nbsp;|&nbsp; [Database configuration →](./database-configuration.md)
