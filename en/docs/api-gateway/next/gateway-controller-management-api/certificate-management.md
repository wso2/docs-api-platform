---
title: "Management API: Certificate Management"
description: "REST API reference for gateway certificates in API Platform Gateway: backend trust, mutual TLS client authorities, and gateway identities."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/gateway-controller-management-api/certificate-management/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/gateway-controller-management-api/certificate-management.md
tags:
  - api-gateway
  - management-api
  - certificates
  - tls
  - mtls
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-19
content_type: "reference"
---

# Certificate Management

Manage the certificates that the gateway uses for TLS with backends and with API callers. The gateway loads every change dynamically, without a restart.

## Certificate usages

Every certificate has a `usage` that sets what the gateway uses it for. The gateway keeps each usage in its own trust bundle and never mixes them. Certificate names share one namespace, so each name must be unique across all usages.

The following table describes each usage and the configuration that refers to it by name:

|Usage|Purpose|Referenced by|
|---|---|---|
|`upstream` (default)|A certificate authority (CA) that the gateway trusts when it verifies an HTTPS backend.|The gateway-wide trust bundle, or `tls.trustedCAs` in an upstream definition|
|`downstream`|A client CA that authenticates API callers over mutual TLS (mTLS).|`accept[].ca` in the [Mutual TLS Auth](https://wso2.com/api-platform/policy-hub/policies/mtls-auth) policy|
|`identity`|A certificate chain and its private key that the gateway presents to a backend that requires mTLS.|`tls.identity` in an upstream definition|

All examples on this page send the certificate in a JSON body. In JSON, write each line break of a PEM file as `\n`. To build the body from PEM files, use `jq`:

```shell
jq -n --arg name partner-a-root --rawfile certificate partner-a-root.pem \
  '{name: $name, usage: "downstream", certificate: $certificate}' > payload.json
```

### Trust a backend's certificate authority

Upload the CA with `usage: upstream`. Because `upstream` is the default usage, you can omit the field.

```shell
curl -X POST http://localhost:9090/api/management/v1/certificates \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "billing-backend-ca",
    "usage": "upstream",
    "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n"
  }'
```

All `upstream` certificates together form the gateway-wide trust bundle. The gateway uses it to verify any HTTPS backend whose upstream definition doesn't set `tls.trustedCAs`. To trust only specific CAs for a backend, name them in `tls.trustedCAs` of its upstream definition. The gateway then uses those CAs instead of the bundle:

```yaml
upstreamDefinitions:
  - name: billing-backend
    upstreams:
      - url: https://billing.internal.example.com:8443
    tls:
      trustedCAs: [billing-backend-ca]
```

### Authenticate API callers with mutual TLS

Upload each CA that issues your callers' client certificates with `usage: downstream`. The `role` field sets how the gateway receives the caller's certificate:

- **`client` (default):** The caller presents its certificate directly on the TLS connection to the gateway.
- **`relay`:** A load balancer terminates TLS in front of the gateway and forwards the caller's certificate in the `X-WSO2-CLIENT-CERTIFICATE` header. The relay CA authenticates the load balancer's own connection. The gateway accepts the header only on a connection whose certificate a `relay` CA validates.

The following request adds a client CA:

```shell
curl -X POST http://localhost:9090/api/management/v1/certificates \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "partner-a-root",
    "usage": "downstream",
    "role": "client",
    "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n"
  }'
```

The following request adds a relay CA. The optional `match` field accepts the header only from a connection whose certificate carries one of the listed subject alternative names (SANs):

```shell
curl -X POST http://localhost:9090/api/management/v1/certificates \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "edge-lb",
    "usage": "downstream",
    "role": "relay",
    "match": {"dnsSANs": ["lb.example.com"]},
    "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n"
  }'
```

To require a client certificate on an API, attach the Mutual TLS Auth policy and name the client CAs it accepts:

```yaml
policies:
  - name: mtls-auth
    version: v0
    params:
      accept:
        - ca: partner-a-root
```

For the policy's parameters, see [Mutual TLS Auth](https://wso2.com/api-platform/policy-hub/policies/mtls-auth). To change the relay header name, set `name` under `[router.downstream_tls.client_certificate_header]` in the gateway configuration.

If the uploaded certificate isn't a CA, the gateway trusts exactly that certificate and returns a `CLIENT_CA_IS_LEAF` warning.

### Present a client certificate to a backend

Upload the certificate chain, leaf first, with `usage: identity` and its private key in `privateKey`. The key must be an unencrypted PEM key that matches the leaf certificate: RSA, ECDSA, or Ed25519, in PKCS#8, PKCS#1, or SEC1 format. The gateway encrypts the key at rest and never returns it in a response.

```shell
curl -X POST http://localhost:9090/api/management/v1/certificates \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "gateway-billing",
    "usage": "identity",
    "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
    "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  }'
```

To present the identity to a backend, name it in `tls.identity` of the backend's upstream definition:

```yaml
upstreamDefinitions:
  - name: billing-backend
    upstreams:
      - url: https://billing.internal.example.com:8443
    tls:
      identity: gateway-billing
      trustedCAs: [billing-backend-ca]
```

An identity with `role: default` is the gateway's default identity. The gateway presents it to HTTPS backends whose upstream definition names no `tls.identity`, when `present_default_identity` under `[router.upstream.tls]` is `true` (the default). If no identity has `role: default`, the gateway presents its HTTPS listener certificate instead. Only one identity can have `role: default`.

To rotate an identity, send its certificate chain and private key to [`PUT /certificates/{id}`](#rotate-a-gateway-identitys-certificate-and-key). The name and every reference to it stay the same. Connections that the gateway opens after the rotation use the rotated identity.

### Usage rules

- A certificate's `usage` and `role` can't change after upload. To change them, delete the certificate and upload it again.
- `role` applies only to `downstream` (`client` or `relay`) and `identity` (`default`). The gateway rejects any other combination.
- `match` applies only to a `downstream` certificate with `role: relay`.
- `privateKey` is required for `identity` and rejected for every other usage.
- While a deployed API refers to a certificate, the gateway refuses to delete it and returns `409`.

## List all custom certificates

<a id="opIdlistCertificates"></a>

`GET /certificates`

> Code samples

```shell

curl -X GET 'http://localhost:9090/api/management/v1/certificates?usage=downstream' \
  -u {username}:{password} \
  -H 'Accept: application/json'

```

Retrieve the certificates loaded in the certificate store. Without a filter, the response lists every certificate. To list a single usage, set the `usage` query parameter.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`, `developer`

</aside>

<h3 id="list-all-custom-certificates-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|usage|query|string|false|Filter the list to a single usage. Omit to list all certificates regardless of usage.|

#### Enumerated Values

|Parameter|Value|
|---|---|
|usage|upstream|
|usage|downstream|
|usage|identity|

> Example responses
>
> 200 Response

```json
{
  "certificates": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "partner-a-root",
      "usage": "downstream",
      "role": "client",
      "subject": "CN=Partner A Root,O=Partner A,C=US",
      "issuer": "CN=Partner A Root,O=Partner A,C=US",
      "notAfter": "2026-11-26 06:07:26",
      "count": 1,
      "referencedByApis": 1,
      "status": "success"
    }
  ],
  "totalCount": 1,
  "totalBytes": 1302,
  "status": "success"
}
```

<h3 id="list-all-custom-certificates-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of certificates|[CertificateListResponse](schemas.md#schemacertificatelistresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid usage filter|[ErrorResponse](schemas.md#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|[ErrorResponse](schemas.md#schemaerrorresponse)|

## Upload a new certificate

<a id="opIduploadCertificate"></a>

`POST /certificates`

> Code samples

```shell

curl -X POST http://localhost:9090/api/management/v1/certificates \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d @payload.json

```

Upload a TLS certificate in PEM format. The gateway loads it dynamically, without a restart. The `usage` field sets what the gateway uses it for. For each usage, see [Certificate usages](#certificate-usages).

> Payload

```json
{
  "name": "partner-a-root",
  "usage": "downstream",
  "role": "client",
  "certificate": "-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAKL0UG+mRKtjMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV\n...\n-----END CERTIFICATE-----\n"
}
```

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`

</aside>

<h3 id="upload-a-new-certificate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CertificateUploadRequest](schemas.md#schemacertificateuploadrequest)|true|none|

> Example responses
>
> 201 Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "partner-a-root",
  "usage": "downstream",
  "role": "client",
  "subject": "CN=Partner A Root,O=Partner A,C=US",
  "issuer": "CN=Partner A Root,O=Partner A,C=US",
  "notAfter": "2026-11-26 06:07:26",
  "count": 1,
  "isLeaf": false,
  "message": "Certificate uploaded and SDS updated successfully",
  "status": "success"
}
```

<h3 id="upload-a-new-certificate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Certificate uploaded successfully|[CertificateResponse](schemas.md#schemacertificateresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid certificate, private key, or combination of `usage`, `role`, and `match`|[ErrorResponse](schemas.md#schemaerrorresponse)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|A certificate with this name already exists, in any usage, or another identity already has `role: default`|[ErrorResponse](schemas.md#schemaerrorresponse)|
|413|[Payload Too Large](https://tools.ietf.org/html/rfc7231#section-6.5.11)|Request body exceeds the maximum allowed size|[ErrorResponse](schemas.md#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|[ErrorResponse](schemas.md#schemaerrorresponse)|

## Rotate a gateway identity's certificate and key

<a id="opIdupdateCertificate"></a>

`PUT /certificates/{id}`

> Code samples

```shell

jq -n --rawfile certificate gateway-billing-chain.pem --rawfile privateKey gateway-billing.key \
  '{certificate: $certificate, privateKey: $privateKey}' > rotation-payload.json

curl -X PUT http://localhost:9090/api/management/v1/certificates/{id} \
  -u {username}:{password} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d @rotation-payload.json

```

Replace the certificate chain and private key of a `usage: identity` certificate. The gateway keeps its ID, name, and the references to it. It reads only `certificate` and `privateKey` from the body and keeps the stored `name`, `usage`, `role`, and `match`. Connections that the gateway opens after the update present the rotated identity. The gateway refuses this operation for other usages.

> Payload

```json
{
  "certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
  "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`

</aside>

<h3 id="rotate-a-gateway-identitys-certificate-and-key-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID of the certificate to replace|
|body|body|object|true|The rotated certificate chain and private key. The gateway ignores any other field and keeps the stored `name`, `usage`, `role`, and `match`.|
|» certificate|body|string|true|PEM-encoded certificate chain, leaf first|
|» privateKey|body|string|true|PEM-encoded, unencrypted private key that matches the leaf certificate|

> Example responses
>
> 200 Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "gateway-billing",
  "usage": "identity",
  "subject": "CN=gateway-billing,O=Example",
  "issuer": "CN=Example Issuing CA,O=Example",
  "notAfter": "2027-11-26 06:07:26",
  "count": 2,
  "chainLength": 2,
  "isLeaf": true,
  "keyAlgorithm": "ECDSA",
  "message": "Certificate updated and SDS updated successfully",
  "status": "success"
}
```

<h3 id="rotate-a-gateway-identitys-certificate-and-key-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Certificate rotated successfully|[CertificateResponse](schemas.md#schemacertificateresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid certificate or private key, or the certificate isn't `usage: identity`|[ErrorResponse](schemas.md#schemaerrorresponse)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Certificate not found|[ErrorResponse](schemas.md#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|[ErrorResponse](schemas.md#schemaerrorresponse)|

## Delete a certificate

<a id="opIddeleteCertificate"></a>

`DELETE /certificates/{id}`

> Code samples

```shell

curl -X DELETE http://localhost:9090/api/management/v1/certificates/{id} \
  -u {username}:{password} \
  -H 'Accept: application/json'

```

Delete a certificate from the gateway. The gateway applies the change dynamically, without a restart.

The gateway refuses to delete a certificate that a deployed API still refers to, and returns `409`. This applies to the following certificates:

- A client CA named in the `accept` list of a Mutual TLS Auth policy.
- The last client CA with `role: client` while a deployed API attaches the Mutual TLS Auth policy.
- An `upstream` certificate named in `tls.trustedCAs` of an upstream definition.
- A gateway identity named in `tls.identity` of an upstream definition.

A backend that relies on the `role: default` identity without naming it in `tls.identity` doesn't count as a reference, so you can delete the default identity. After you delete it, the gateway presents its HTTPS listener certificate to those backends.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`

</aside>

<h3 id="delete-a-certificate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID of the certificate to delete|

> Example responses
>
> 200 Response

```json
{
  "status": "success",
  "message": "Certificate deleted and SDS updated successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

<h3 id="delete-a-certificate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Certificate deleted successfully|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Certificate not found|[ErrorResponse](schemas.md#schemaerrorresponse)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|A deployed API still refers to the certificate|[ErrorResponse](schemas.md#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|[ErrorResponse](schemas.md#schemaerrorresponse)|

<h3 id="delete-a-certificate-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|false|none|none|
|message|string|false|none|none|
|id|string|false|none|none|

## Manually reload certificates

<a id="opIdreloadCertificates"></a>

`POST /certificates/reload`

> Code samples

```shell

curl -X POST http://localhost:9090/api/management/v1/certificates/reload \
  -u {username}:{password} \
  -H 'Accept: application/json'

```

Manually trigger a reload of all certificates from the filesystem into the Gateway.

### Authentication

<aside class="warning">
This operation requires <strong>Basic Auth</strong> authentication.

Required roles: `admin`

</aside>

> Example responses
>
> 200 Response

```json
{
  "status": "success",
  "message": "Certificates reloaded and SDS updated successfully",
  "totalBytes": 221599
}
```

<h3 id="manually-reload-certificates-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Certificates reloaded successfully|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|[ErrorResponse](schemas.md#schemaerrorresponse)|

<h3 id="manually-reload-certificates-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|status|string|false|none|none|
|message|string|false|none|none|
|totalBytes|integer|false|none|Total bytes of all loaded certificates|
