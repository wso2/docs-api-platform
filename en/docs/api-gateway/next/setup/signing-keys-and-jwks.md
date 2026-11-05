---
title: "Gateway signing keys and the JSON Web Key Set endpoint"
description: "Configure API Platform Gateway signing keys, publish the public keys at /.well-known/jwks, rotate keys, and verify gateway-signed tokens."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/setup/signing-keys-and-jwks/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/setup/signing-keys-and-jwks.md
tags:
  - api-gateway
  - security
  - signing
  - jwks
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-23
content_type: "how-to"
---

# Gateway signing keys and the JSON Web Key Set endpoint

This guide is for platform operators who configure the API Platform Gateway, and for backend owners who verify the tokens the gateway sends them.

The gateway can sign what it sends to your backends, for example the JSON Web Token (JWT) that the [Backend JWT](https://wso2.com/api-platform/policy-hub/policies/backend-jwt) policy adds to each request. You configure the gateway's signing keys once, and every policy that signs uses them. The gateway publishes the public half of each key as a JSON Web Key Set (JWKS) at `/.well-known/jwks`, so a backend verifies a token by looking up the key named in the token's `kid` (key ID) header. It never needs a copy of the gateway's key.

## Before you begin

You need:

- A running API Platform Gateway. See the [Quick Start Guide](../quick-start-guide.md).
- Access to the gateway's `config.toml`. See [Gateway Configuration and Environment Interpolation](./configuration.md).
- A private key in Privacy-Enhanced Mail (PEM) format for each signing key. The supported key types are:

| Key type | Signing algorithm |
|----------|-------------------|
| RSA, 2048 bits or larger | `RS256` (default) or `PS256` |
| EC on the P-256 curve | `ES256` |
| EC on the P-384 curve | `ES384` |

For example, generate an EC P-256 key with OpenSSL:

```bash
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out signing-key.pem
```

You don't need a certificate. The gateway derives the public key from the private key.

## Configure a signing key

### Step 1: Make the key file available to the gateway runtime

Mount the key file into the Gateway Runtime container as a read-only file. The key file must be readable by the gateway runtime user (user ID `10001`) and must not be readable by other users. Use file mode `0400` or `0440`. The gateway does not start if a configured key file is readable or writable by other users.

=== "Docker Compose"

    1. Prepare the file on the host:

        ```bash
        mkdir -p signing
        cp signing-key.pem signing/current.pem
        sudo chown 10001:10001 signing/current.pem
        sudo chmod 0400 signing/current.pem
        ```

    2. Mount the directory into the `gateway-runtime` service:

        ```yaml
        services:
          gateway-runtime:
            volumes:
              - ./configs/config.toml:/etc/policy-engine/config.toml:ro
              - ./signing:/secrets/gateway-runtime/signing:ro
        ```

=== "Kubernetes"

    1. Store the key in a Secret in the Gateway Runtime pod's namespace. The key name in the Secret becomes the file name in the mounted directory:

        ```bash
        kubectl create secret generic gateway-signing-keys \
          --namespace <gateway-namespace> \
          --from-file=current.pem=signing-key.pem
        ```

    2. Mount the Secret into the Gateway Runtime pod with `defaultMode: 0440`. Set the pod's `securityContext.fsGroup` to `10001` so the gateway runtime user can read the mounted file:

        ```yaml
        spec:
          securityContext:
            fsGroup: 10001
          volumes:
            - name: signing-keys
              secret:
                secretName: gateway-signing-keys
                defaultMode: 0440
          containers:
            - name: gateway-runtime
              volumeMounts:
                - name: signing-keys
                  mountPath: /secrets/gateway-runtime/signing
                  readOnly: true
        ```

### Step 2: Add the key to the gateway configuration

Add a `[signing]` section to `config.toml` and list the key under `[[signing.keys]]`:

```toml
[signing]
jwks_cache_max_age = "5m"

[[signing.keys]]
path = "/secrets/gateway-runtime/signing/current.pem"
active = true
```

Restart the gateway to apply the change.

When you list keys, exactly one of them must be marked `active`. The active key signs. Every listed key is published in the JWKS, so tokens signed by a key that is no longer active still verify.

### Step 3: Verify the JWKS

Request the JWKS from the gateway's API traffic port:

```bash
curl http://localhost:8080/.well-known/jwks
```

The response lists the public key, with its key ID and algorithm:

```json
{
  "keys": [
    {
      "kty": "EC",
      "kid": "GqWj6qPTMk3medznt-SHvWjANJNmVkHUtMMUhRWhV3I",
      "use": "sig",
      "alg": "ES256",
      "crv": "P-256",
      "x": "...",
      "y": "..."
    }
  ]
}
```

## Signing configuration reference

### `[signing]`

| Setting | Default | Description |
|---------|---------|-------------|
| `jwks_endpoint_enabled` | `true` | Serves the JWKS at `/.well-known/jwks`. Set to `false` to turn the endpoint off. See [Turn off the JWKS endpoint](#turn-off-the-jwks-endpoint). |
| `jwks_cache_max_age` | `"5m"` | How long clients may cache the JWKS, sent in the `Cache-Control` header. Accepts a duration from `0s` to `24h`. |
| `public_jwks_url` | Not set | The public HTTPS URL at which clients reach your JWKS, for example `https://api.example.com/.well-known/jwks`. When a signing policy advertises where its keys are published, it uses this URL as the token's `jku` header. |

### `[[signing.keys]]`

| Setting | Required | Description |
|---------|----------|-------------|
| `path` | Yes | Path to the PEM private key file inside the Gateway Runtime container. |
| `active` | For one key | Marks the key that signs. Exactly one listed key is active. |
| `kid` | No | The key ID published in the JWKS and set in each token's `kid` header. Defaults to the key's RFC 7638 thumbprint, a value derived from the public key. |
| `algorithm` | No | For an RSA key, `RS256` (default) or `PS256`. For an EC key, the algorithm follows the curve. |

## The JWKS endpoint

The gateway serves the JWKS on every virtual host, on the same ports as API traffic (`8080` for HTTP and `8443` for HTTPS). No API deployment is needed.

| Item | Value |
|------|-------|
| Path | `/.well-known/jwks` |
| Methods | `GET` and `HEAD`. Other methods return `405`. |
| Content type | `application/jwk-set+json` |
| Caching | `Cache-Control: public, max-age=<jwks_cache_max_age in seconds>` and an `ETag`. The default `"5m"` produces `max-age=300`. A request with a matching `If-None-Match` header returns `304 Not Modified`. |
| Cross-origin access | `Access-Control-Allow-Origin: *` |
| No keys configured | `200` with `{"keys":[]}` |

Clients can poll the endpoint cheaply with a conditional request:

```bash
curl -i http://localhost:8080/.well-known/jwks \
  -H 'If-None-Match: "<etag from the previous response>"'
```

While the endpoint is on, the path `/.well-known/jwks` is reserved for it. Deploying an API whose route would be `/.well-known/jwks` is rejected with a validation error.

## Verify gateway-signed tokens in a backend

To verify a token the gateway signed:

1. Configure your JWT library with the gateway's JWKS URL, for example `https://api.example.com/.well-known/jwks`.
2. When a token arrives, read the `kid` from its header and select the key with that `kid` from the JWKS.
3. Verify the signature with that key, and accept only the algorithm that key declares in its `alg` member.
4. If no key matches the `kid`, fetch the JWKS again, because the gateway may have added a key since you last fetched it.
5. Reject the token if its `exp` claim is in the past. If you configured an issuer in the signing policy, also check the `iss` claim. Check any other claims your backend depends on.

Most JWT libraries handle the key lookup and signature check when you give them a JWKS URL. Configure the claim checks in step 5 separately, because a JWKS URL alone does not turn them on. Respect the `Cache-Control` header so your backend picks up new keys within `jwks_cache_max_age`.

## Rotate a signing key

Because every listed key is published and only the active key signs, you can replace a key without breaking any backend:

1. **Add the new key without `active`.** Mount the new key file, add it to `[[signing.keys]]`, and restart the gateway. The new key is published but does not sign yet.

    ```toml
    [[signing.keys]]
    path = "/secrets/gateway-runtime/signing/current.pem"
    active = true

    [[signing.keys]]
    path = "/secrets/gateway-runtime/signing/next.pem"
    ```

2. **Wait at least `jwks_cache_max_age`.** Backends that cached the JWKS fetch it again and learn the new key.
3. **Move `active` to the new key** and restart the gateway. New tokens are signed with the new key. Tokens signed with the old key still verify, because the old key is still published.

    ```toml
    [[signing.keys]]
    path = "/secrets/gateway-runtime/signing/current.pem"

    [[signing.keys]]
    path = "/secrets/gateway-runtime/signing/next.pem"
    active = true
    ```

4. **Remove the old key** once every token it signed has expired, plus `jwks_cache_max_age`. Restart the gateway.

## Turn off the JWKS endpoint

If one of your APIs already serves `/.well-known/jwks`, turn the gateway endpoint off so the path is free for that API:

```toml
[signing]
jwks_endpoint_enabled = false
```

For Helm deployments, set the value `gateway.config.signing.jwks_endpoint_enabled` to `false`.

With the endpoint off, the gateway still signs with its configured keys. Share the public keys with your backends in another way, for example by publishing the JWKS from your own API.

## What's next

- [Gateway Configuration and Environment Interpolation](./configuration.md)
- [Security Hardening](../deployment/production-deployment/security-hardening.md)
- [Policies overview](../policies/overview.md)
