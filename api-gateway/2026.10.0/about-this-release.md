# API Gateway Changelog

**Release date:** 2026-10-29  
**Previous version:** 2026.09.24 (2026-09-24)  

### New feature additions

- **Mutual TLS authentication:** The new `mtls-auth` policy authenticates callers by client certificate, against a pool of trusted client CAs that you manage. You can narrow it further by subject alternative name (SAN) or certificate thumbprint. It also accepts a certificate forwarded by a TLS-terminating load balancer, from trusted relay connections only.
- **Upstream TLS per backend:** A `tls` block on an upstream sets the client certificate the gateway presents to that backend, the CAs it trusts, and whether it verifies the hostname.
- **[Certificate management](gateway-controller-management-api/certificate-management.md) improvements:** Certificates have a usage, a role and match rules. You can rotate a certificate in place with `PUT /certificates/{id}`. Private keys are encrypted at rest and never returned, and the gateway warns about certificates that are about to expire.
- **GraphQL APIs:** GraphQL is a first-class API type, managed through `/graphql-apis` and the `ap gateway graphql-api` commands, with API keys, policies, CORS preflight and analytics.
- **Gateway signing keys and JWKS endpoint:** Configure signing keys (RS256, PS256, ES256 or ES384) under `[signing]`. The gateway publishes their public keys at `/.well-known/jwks`, and the [Backend JWT](https://wso2.com/api-platform/policy-hub/policies/backend-jwt) policy (v1.1.0) signs with them.
- **Fault policies:** Attach policies that run only when a request fails, at the API or the operation level.
- **Request IDs in responses:** Every response carries an `x-request-id` header that matches the gateway's logs and analytics.
- **Subscription monetization:** With Platform API and the API Portal, you can sell API access through paid plans, priced at a flat rate or by usage and billed through Moesif and Stripe. With [Moesif analytics](analytics/moesif-analytics.md) enabled, the gateway attributes a paid subscription's calls to its billing customer. A subscription whose payment stops is suspended at the gateway.
- **Subscription updates:** Subscriptions accept your own ID (`externalRefId`), partial updates, plan changes and token rotation, through the management API and `ap gateway subscription update`.
- **[Traffic logging](observability/traffic-logging.md):** Logs can include the operation's path template (`request.pathTemplate`).
- **Redis over TLS:** The [Advanced Rate Limit](https://wso2.com/api-platform/policy-hub/policies/advanced-ratelimit) policy (v1.3.1) can connect to Redis over TLS.
- **OpenShift support:** The gateway images run under arbitrary user IDs, and the Helm chart can create OpenShift Routes. For more information, see [OpenShift standalone deployment](deployment/deployment-modes/openshift/openshift-standalone.md).

#### New policies

- **[mTLS Authentication](https://wso2.com/api-platform/policy-hub/policies/mtls-auth)**
- **[OAuth2 Token Exchange](https://wso2.com/api-platform/policy-hub/policies/oauth2-token-exchange):** Exchanges the caller's credential for a token from the backend's own authorization server, by RFC 8693 token exchange or an RFC 7523 JWT bearer grant. If the exchange fails, the request is rejected; the caller's token is never forwarded instead.

See [Policy Hub](https://wso2.com/api-platform/policy-hub) for policy references.

### Changed

- **New defaults:** Each of these is on by default. To keep the previous behavior, set it to `false`.
    - `[router.upstream.tls] present_default_identity`: the gateway presents its default client certificate to backends that request one.
    - `[router.http_listener] return_request_id_in_response`: responses carry `x-request-id`, replacing any value a backend or policy set.
    - `[signing] jwks_endpoint_enabled`: `/.well-known/jwks` is served on every host, ahead of any API on that path.
- **Backend JWT signing:** Once gateway signing keys are configured, the `backend-jwt` policy signs with the gateway key and adds a `kid` header. Give your backends the gateway's JWKS before you configure keys.
- **Logs and metrics:** JSON access logs add `sni`, `tlsVer`, `peerSubj`, `peerFp` and `upTlsFail`, and `policy_executions_total` adds the `denied` and `short_circuited` status values. Moesif events from a subscription with a billing customer carry that customer as the company ID.
- **Analytics and traffic logging** keep up under constrained CPU, and repeated headers keep every value.
- **Upgrading:** SQLite databases from 2026.09.24 are migrated automatically. For PostgreSQL or SQL Server, re-run the scripts in `resources/gateway-controller/db-scripts` before you start the new version. For Helm upgrades, use `--reset-then-reuse-values` (Helm 3.14 or later) or pass your values file, not `--reuse-values`.
- **Platform updates:** Envoy v1.39.6, with updated Go dependencies and OS packages.

### Fixed

- Fixed `analytics-header-filter` not applying to response headers: it now filters them when response-header capture is on, and headers it removes no longer reach analytics ([#3530](https://github.com/wso2/api-platform/pull/3530)).
- Fixed analytics events with multi-value headers not reaching OpenTelemetry backends ([#3608](https://github.com/wso2/api-platform/pull/3608)).
- Fixed renaming a subscription plan to a name already in use, or deleting a plan still in use, returning 500 instead of 409 ([#3804](https://github.com/wso2/api-platform/pull/3804)).
- Fixed `ap gateway add` not saving `--admin-server`, which broke `ap gateway health` ([#3820](https://github.com/wso2/api-platform/pull/3820)).
- Fixed the gateway operator not redeploying a failed gateway after a configuration change ([#3509](https://github.com/wso2/api-platform/pull/3509)).
- Fixed gateways with long names failing to deploy through the operator: the Helm release name is now bounded so derived Service names fit ([#3566](https://github.com/wso2/api-platform/pull/3566)).