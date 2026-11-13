# AI Gateway Changelog

**Release date:** 2026-10-29  
**Previous version:** 2026.09.24 (2026-09-24)  

### New feature additions

- **TypeSafe Jev guardrails:** Five new policies use a TypeSafe Jev endpoint to screen request and response content, pick the model from plain-language rules, and trim the tool list sent to the LLM. For MCP traffic, they check tool calls against the agent's scope and screen tool results for injected instructions. See [New policies](#new-policies).
- **[Semantic caching](semantic-caching.md) admission check:** The `semantic-cache` policy (v1.2.1) can use an optional TypeSafe Jev check to decide which responses to cache.
- **Bedrock file attachments:** The [OpenAI to Bedrock Transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-bedrock-transformer) policy (v0.9.3) forwards PDF, Word, Excel, CSV, HTML, text and Markdown attachments to [AWS Bedrock](gateway-artifacts/llm-provider/supported-providers/aws-bedrock.md). It returns 400 for an attachment it can't forward, instead of silently dropping it.
- **Bedrock guardrail by status code:** The [AWS Bedrock Guardrail](https://wso2.com/api-platform/policy-hub/policies/aws-bedrock-guardrail) policy (v1.3.0) can be limited to chosen upstream status codes with `applicableStatusCodes`.
- **Fault policies:** Attach policies that run only when a request fails to LLM providers, LLM proxies, MCP proxies and A2A agents.
- **[A2A agents](agent-governance/index.md) from the control plane:** Agent proxies can be deployed from the control plane, and Agent keys are included in key synchronization. Agent Card interface URLs can use `http://`.
- **Mutual TLS:** The new `mtls-auth` policy authenticates clients by certificate, and a `tls` block on an upstream sets the client certificate the gateway presents to that provider or backend. Certificates can be rotated in place through the [certificate management API](reference/management-api/certificate-management.md).
- **Request IDs in responses:** Every response carries an `x-request-id` header that matches the gateway's logs and analytics.
- **OpenShift support:** The gateway images run under arbitrary user IDs, and the Helm chart can create OpenShift Routes. For more information, see [OpenShift standalone deployment](setup-and-deployment/openshift/openshift-standalone.md).

#### New policies

- **[TypeSafe Jev Content Safety](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-content-safety)**
- **[TypeSafe Jev Model Routing](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-model-routing)**
- **[TypeSafe Jev Tool Filtering](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-tool-filtering)**
- **[TypeSafe Jev MCP Tool Intent Verification](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-mcp-tool-intent-verification)**
- **[TypeSafe Jev MCP Tool Result Screening](https://wso2.com/api-platform/policy-hub/policies/typesafe-jev-mcp-tool-result-screening)**
- **[mTLS Authentication](https://wso2.com/api-platform/policy-hub/policies/mtls-auth)**
- **[OAuth2 Token Exchange](https://wso2.com/api-platform/policy-hub/policies/oauth2-token-exchange):** Exchanges the caller's credential for a token from the backend's own authorization server. If the exchange fails, the request is rejected; the caller's token is never forwarded instead.

See [Policy Hub](https://wso2.com/api-platform/policy-hub) for policy references.

### Changed

- **New defaults:** Each of these is on by default. To keep the previous behavior, set it to `false`.
    - `[router.upstream.tls] present_default_identity`: the gateway presents its default client certificate to backends that request one.
    - `[router.http_listener] return_request_id_in_response`: responses carry `x-request-id`, replacing any value a backend or policy set.
    - `[signing] jwks_endpoint_enabled`: `/.well-known/jwks` is served on every host, ahead of any API on that path.
- **Analytics and traffic logging** keep up under constrained CPU, and repeated headers keep every value.
- **Upgrading:** SQLite databases from 2026.09.24 are migrated automatically. For PostgreSQL or SQL Server, re-run the scripts in `resources/gateway-controller/db-scripts` before you start the new version. For Helm upgrades, use `--reset-then-reuse-values` (Helm 3.14 or later) or pass your values file, not `--reuse-values`.
- **Platform updates:** Envoy v1.39.6, with updated Go dependencies and OS packages.

### Fixed

- Fixed MCP proxies that use the legacy `header` authentication type: it is now normalized to `api-key` ([#3589](https://github.com/wso2/api-platform/pull/3589)).
- Fixed `analytics-header-filter` not applying to response headers: it now filters them when response-header capture is on, and headers it removes no longer reach analytics ([#3530](https://github.com/wso2/api-platform/pull/3530)).
- Fixed analytics events with multi-value headers not reaching OpenTelemetry backends ([#3608](https://github.com/wso2/api-platform/pull/3608)).
- Fixed the gateway operator not redeploying a failed gateway after a configuration change ([#3509](https://github.com/wso2/api-platform/pull/3509)).
- Fixed gateways with long names failing to deploy through the operator: the Helm release name is now bounded so derived Service names fit ([#3566](https://github.com/wso2/api-platform/pull/3566)).
