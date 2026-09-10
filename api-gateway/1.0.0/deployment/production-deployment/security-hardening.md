---
title: "Security Hardening"
description: "Configure the necessary security areas before deploying API Platform Gateway to production."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/security-hardening/
md_url: https://wso2.com/api-platform/docs/api-gateway/deployment/production-deployment/security-hardening.md
tags:
  - security
  - api-management
  - devops
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-11
content_type: "how-to"
---

# Security Hardening

This page covers the three security areas that must be configured before a production deployment: encryption keys for data at rest, TLS for data in transit, and authentication for access control.

## Encryption Keys

The controller uses AES-GCM 256-bit keys to encrypt sensitive data at rest. Providing at least one encryption key is required when `developmentMode` is set to `false`.

**Generate a 256-bit AES key:**

```bash
openssl rand -out default-aesgcm256-v1.bin 32
```

**Create the Kubernetes secret:**

```bash
kubectl create secret generic gateway-encryption-keys \
  --namespace <your-namespace> \
  --from-file=default-aesgcm256-v1.bin=./default-aesgcm256-v1.bin
```

**Clean up the local key file:**

```bash
rm ./default-aesgcm256-v1.bin
```

!!! warning
    Do not commit the key file to source control. Remove it immediately after creating the Kubernetes secret.

**Reference the secret in values:**

```yaml
gateway:
  controller:
    encryptionKeys:
      enabled: true
      secretName: gateway-encryption-keys
      mountPath: /app/data/aesgcm-keys
```

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

The `version` field must match the filename stem of the secret key (`default-aesgcm256-v1.bin` → version `aesgcm256-v1`).

**Key rotation:**

1. Generate a new key with `openssl rand`.
2. Add it to the Kubernetes secret with an incremented version name.
3. Update the `encryption.providers` list in values to include the new key entry.
4. Run `helm upgrade` to redeploy — the controller picks up the new key on startup.

!!! note
    Keep old key versions in the secret until all data encrypted with the previous key has been re-encrypted or is no longer needed.

---

## TLS Configuration

TLS must be configured before exposing the gateway externally. Choose one of the options below based on how certificates are managed in your environment.

=== "Option A: cert-manager"

    cert-manager automates TLS certificate provisioning and renewal within the cluster. Install it if you do not already manage certificates externally.

    **Install cert-manager:**

    ```bash
    helm repo add jetstack https://charts.jetstack.io --force-update
    helm repo update

    helm install cert-manager jetstack/cert-manager \
      --namespace cert-manager \
      --create-namespace \
      --set crds.enabled=true
    ```

    **Verify all cert-manager pods are running:**

    ```bash
    kubectl get pods -n cert-manager
    ```

    **Configure the chart to use cert-manager:**

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
              name: letsencrypt-prod    # Your ClusterIssuer name
              kind: ClusterIssuer
            commonName: gateway.example.com
            dnsNames:
              - gateway.example.com
            duration: 2160h             # 90 days
            renewBefore: 720h           # Renew 30 days before expiry
    ```

=== "Option B: Existing TLS Secret"

    Use this option if certificates are managed externally, for example, via a corporate PKI or HashiCorp Vault.

    **Create the TLS secret:**

    ```bash
    kubectl create secret tls gateway-tls \
      --namespace <your-namespace> \
      --cert=./gateway.crt \
      --key=./gateway.key
    ```

    **Configure the chart to reference the secret:**

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

### Upstream Custom CA Certificates

If backend services use certificates signed by a private CA, mount the CA bundle into the controller so it can verify upstream TLS connections.

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

---

## Authentication

!!! warning
    The default credentials (`admin`/`admin`) **must** be replaced before deploying to any non-development environment. The controller logs a warning at startup if default or no authentication is configured.

Choose an authentication strategy based on your organizational requirements.

=== "Option A: IDP / OAuth2 (Recommended)"

    This is the safest option. No credentials to manage in the cluster. Authentication is delegated entirely to your identity provider.

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
        Role mapping values must correspond to claims present in the JWT issued by your IDP. See the [Gateway Controller OpenAPI reference](https://raw.githubusercontent.com/wso2/api-platform/refs/tags/gateway/v1.1.0/gateway/gateway-controller/api/management-openapi.yaml) for the full list of supported roles and their permissions.

=== "Option B: Basic Auth with Bcrypt"

    If basic auth is required, never store plain-text passwords. The controller supports bcrypt hashes, which are safe to include in Helm values (the hash is not reversible). Store the plain password separately in a Kubernetes secret for rotation reference only.

    **Generate a bcrypt hash:**

    Requires `apache2-utils` (Debian/Ubuntu) or `httpd-tools` (RHEL/CentOS):

    ```bash
    htpasswd -nbB admin 'your-secure-password' | cut -d: -f2
    # Output: $2y$10$...
    ```

    On macOS without `htpasswd`:

    ```bash
    docker run --rm httpd:alpine htpasswd -nbB admin 'your-secure-password' | cut -d: -f2
    ```

    **Store the plain password in a Kubernetes secret:**

    Keep the plain password in a secret for rotation reference. It must never appear in Helm values or ConfigMaps:

    ```bash
    kubectl create secret generic gateway-admin-credentials \
      --namespace <your-namespace> \
      --from-literal=username=admin \
      --from-literal=password='your-secure-password'
    ```

    **Configure the chart with the bcrypt hash:**

    Only the hash goes into the Helm values. This is what ends up in the ConfigMap:

    ```yaml
    gateway:
      config:
        controller:
          auth:
            basic:
              enabled: true
              users:
                - username: "admin"
                  password: "$2y$10$..."   # bcrypt hash — safe to store in ConfigMap
                  password_hashed: true
                  roles: ["admin"]
    ```

    !!! note
        Basic auth users are an array of structs and cannot be overridden via environment variables. The hash must be supplied through Helm values. Rotate credentials by generating a new hash, updating the values, and running `helm upgrade`.

---

[← Production Deployment Overview](../high-availability-production-deployment.md) &nbsp;|&nbsp; [Database Configuration →](./database-configuration.md)