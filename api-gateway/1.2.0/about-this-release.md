# API Gateway Changelog

**Release date:** 2026-07-07  
**Previous version:** 1.1.0 (2026-04-30)  

### New feature additions

- **Traffic logging support:** Added traffic logging capabilities for gateway request and response flows.
- **Timeout functionality support:** Added timeout configuration support for gateway traffic handling.
- **MSSQL support for gateway:** Added Microsoft SQL Server support for gateway persistence.
- **Multiple virtual host support:** The `endpoints` array replaces the single `vhost` field, allowing one gateway to expose multiple virtual hosts simultaneously ([#2128](https://github.com/wso2/api-platform/issues/2128)).
- **`upstreamDefinitions` URL improvements:** Upstream definition URLs support query strings and path fragments correctly ([#2068](https://github.com/wso2/api-platform/issues/2068)).
- **Kubernetes Gateway API conformance support:** Added Kubernetes Gateway API conformance support.
- **Multi-provider routing:** Added routing support across multiple providers.

#### New policies

- **[Opaque token authentication](https://wso2.com/api-platform/policy-hub/policies/opaque-token-auth)**
- **[Backend JWT](https://wso2.com/api-platform/policy-hub/policies/backend-jwt)**
- **[AWS authentication](https://wso2.com/api-platform/policy-hub/policies/aws-authentication):** 
- **[MCP ratelimit](https://wso2.com/api-platform/policy-hub/policies/mcp-ratelimit)**
- **[Granite Guardian Prompt Injection](https://wso2.com/api-platform/policy-hub/policies/granite-guardian-prompt-injection)**
- **[OpenAI to Anthropic Transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-anthropic-transformer)**
- **[OpenAI to Azure OpenAI Transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-azure-openai-transformer)**
- **[OpenAI to Bedrock Transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-bedrock-transformer)**
- **[OpenAI to Gemini Transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-gemini-transformer)**
- **[OpenAI to Mistral Transformer](https://wso2.com/api-platform/policy-hub/policies/openai-to-mistral-transformer)**

See [Policy Hub](https://wso2.com/api-platform/policy-hub) for policy references.

### Added

- `feat(llm)`: Multi-provider routing for LLM proxies ([9288a1e20](https://github.com/wso2/api-platform/commit/9288a1e20)).
- `feat(gateway)`: Multi-provider model round-robin routing ([2878f7b90](https://github.com/wso2/api-platform/commit/2878f7b90)).
- Added AWS Bedrock multi-provider support ([6da796b0e](https://github.com/wso2/api-platform/commit/6da796b0e)).
- Added opt-in `pprof` endpoints on admin servers ([da3d42c0b](https://github.com/wso2/api-platform/commit/da3d42c0b)).
- Added global traffic logging support and field-exclusion controls ([d484dd7bb](https://github.com/wso2/api-platform/commit/d484dd7bb), [bd2f451f7](https://github.com/wso2/api-platform/commit/bd2f451f7), [58eb41727](https://github.com/wso2/api-platform/commit/58eb41727)).
- Added support for request/response body and header capture options in traffic logging ([8a3b33f4f](https://github.com/wso2/api-platform/commit/8a3b33f4f)).
- Added policy-engine context snapshots for downstream path/method and upstream status ([61a68890e](https://github.com/wso2/api-platform/commit/61a68890e)).
- Added policy metadata support for analytics/traffic logging ([6ad01d3b3](https://github.com/wso2/api-platform/commit/6ad01d3b3)).
- Added SQL Server support and related schema/distribution updates ([505abca5f](https://github.com/wso2/api-platform/commit/505abca5f), [4707e2b38](https://github.com/wso2/api-platform/commit/4707e2b38), [9eff6defd](https://github.com/wso2/api-platform/commit/9eff6defd), [c70f3ff1c](https://github.com/wso2/api-platform/commit/c70f3ff1c)).
- Added gateway health check implementation ([4fea1ce05](https://github.com/wso2/api-platform/commit/4fea1ce05)).
- Added basic auth protection for admin service (health endpoint excluded) ([ac2129858](https://github.com/wso2/api-platform/commit/ac2129858)).
- Added role-based admin validation and enforced role-claims when IDP is enabled ([d53b8844d](https://github.com/wso2/api-platform/commit/d53b8844d), [bf8342c62](https://github.com/wso2/api-platform/commit/bf8342c62)).
- Added support for multiple `-config` files in both controller and policy-engine ([c6b343a87](https://github.com/wso2/api-platform/commit/c6b343a87), [073cb77bf](https://github.com/wso2/api-platform/commit/073cb77bf)).
- Added `set-headers` append mode support (policy update from [#2103](https://github.com/wso2/api-platform/issues/2103)).
- Added HTTP connection manager (downstream) timeout config support in runtime config model.

### Changed

- Refactored policy definition sourcing to use gateway-builder output ([0f8b59aeb](https://github.com/wso2/api-platform/commit/0f8b59aeb)).
- Updated routing model: moved header-based routing and redirect logic out of API YAML into dedicated policies ([22198fd11](https://github.com/wso2/api-platform/commit/22198fd11), [eec5e2fa7](https://github.com/wso2/api-platform/commit/eec5e2fa7), [504d33bdf](https://github.com/wso2/api-platform/commit/504d33bdf), [d0f84a780](https://github.com/wso2/api-platform/commit/d0f84a780)).
- Updated operation routing model to use a new `match` object for path match type and header-based matching (from [#2103](https://github.com/wso2/api-platform/issues/2103)).
- Enabled path normalization by default ([c7979cf16](https://github.com/wso2/api-platform/commit/c7979cf16)).
- Updated policy bundles/versions, including API key and auth policy lines ([f67181bb5](https://github.com/wso2/api-platform/commit/f67181bb5), [ff1965e9b](https://github.com/wso2/api-platform/commit/ff1965e9b), [cb788c033](https://github.com/wso2/api-platform/commit/cb788c033), [855da688b](https://github.com/wso2/api-platform/commit/855da688b), [d573b07a8](https://github.com/wso2/api-platform/commit/d573b07a8), [c7553aa1a](https://github.com/wso2/api-platform/commit/c7553aa1a)).
- Refined config interpolation and overrides, including env/file interpolation and allowlist behavior ([bff0bc3ee](https://github.com/wso2/api-platform/commit/bff0bc3ee), [47e74040d](https://github.com/wso2/api-platform/commit/47e74040d), [eca558827](https://github.com/wso2/api-platform/commit/eca558827), [4a9a263a7](https://github.com/wso2/api-platform/commit/4a9a263a7)).
- Updated runtime/build baselines (Go toolchain and Envoy updates) ([f4ff5034c](https://github.com/wso2/api-platform/commit/f4ff5034c), [a38b95f5f](https://github.com/wso2/api-platform/commit/a38b95f5f), [be297cf32](https://github.com/wso2/api-platform/commit/be297cf32)).
- Included distribution docs and packaging updates for release artifacts ([41f89cde7](https://github.com/wso2/api-platform/commit/41f89cde7), [c70f3ff1c](https://github.com/wso2/api-platform/commit/c70f3ff1c)).
- Bumped gateway controller REST API base paths to `v1` and aligned artifact API versioning to `gateway.api-platform.wso2.com/v1`.
- Added `data_version` handling for gateway-controller artifacts to decouple stored data shape from wire version ([290606d8a](https://github.com/wso2/api-platform/commit/290606d8a), [70a86c6e3](https://github.com/wso2/api-platform/commit/70a86c6e3)).
- Changed custom policy `managedBy` default/normalized value from `customer` to `organization`.
- Updated analytics/collector config model: renamed gRPC collector section and split payload controls for request/response bodies and headers.
- Moved toward config-driven env/file interpolation for runtime config management via `config.toml` templates, plus [bff0bc3ee](https://github.com/wso2/api-platform/commit/bff0bc3ee) and [47e74040d](https://github.com/wso2/api-platform/commit/47e74040d).

### Config Changes

- Added new `traffic_logging` config block:

```toml
[traffic_logging]
enabled = false
masked_headers = ["authorization", "x-api-key", "x-jwt-assertion"]
max_payload_size = 0
request_headers = false
request_body = false
response_headers = false
response_body = false

[traffic_logging.properties]
```

- Collector and analytics config changes:
	- Renamed `[analytics.gprc_event_server]` to `[collector.server]`.
	- Removed `[analytics.gprc_event_server].server_port`.
	- Replaced analytics payload toggles with collector-level request/response controls:

```toml
[collector]
request_body = false
response_body = false
request_headers = false
response_headers = false
ignore_path_prefixes = []
```

- Added downstream HTTP listener timeout block:

```toml
[router.http_listener.timeouts]
request_timeout         = "0s"
request_headers_timeout = "0s"
stream_idle_timeout     = "5m"
idle_timeout            = "1h"
```

- Configuration source model update: direct `APIP_*` runtime overrides are removed in favor of `{{ env }}` / `{{ file }}` interpolation in `config.toml`, with required env vars supplied via env files.

### Fixed

- Fixed stale extracted policy artifacts in gateway runtime ([6b07c59c4](https://github.com/wso2/api-platform/commit/6b07c59c4)).
- Fixed controller behavior for overlapping/same-name LLM policy matches ([746db0ed9](https://github.com/wso2/api-platform/commit/746db0ed9), [14451b47e](https://github.com/wso2/api-platform/commit/14451b47e)).
- Fixed dynamic endpoint/base path handling in gateway and controller ([7cff05d2f](https://github.com/wso2/api-platform/commit/7cff05d2f), [30a24d2b7](https://github.com/wso2/api-platform/commit/30a24d2b7), [ad921c208](https://github.com/wso2/api-platform/commit/ad921c208)).
- Fixed `upstreamDefinitions` URL validation and error clarity (query/fragment rejection) ([227e19bc5](https://github.com/wso2/api-platform/commit/227e19bc5), [d5bc0b535](https://github.com/wso2/api-platform/commit/d5bc0b535), [d267f3346](https://github.com/wso2/api-platform/commit/d267f3346), [a43762260](https://github.com/wso2/api-platform/commit/a43762260)).
- Fixed xDS snapshot update race with synchronization improvements ([62b7f22a8](https://github.com/wso2/api-platform/commit/62b7f22a8), [b87094a43](https://github.com/wso2/api-platform/commit/b87094a43)).
- Fixed graceful runtime shutdown by draining Router ([271cc4c2b](https://github.com/wso2/api-platform/commit/271cc4c2b)).
- Fixed duplicate analytics event emission in LLM proxy flows and hardened loopback suppression ([995a97edc](https://github.com/wso2/api-platform/commit/995a97edc), [07c5fe644](https://github.com/wso2/api-platform/commit/07c5fe644), [9b4f54d23](https://github.com/wso2/api-platform/commit/9b4f54d23), [447d5a7bb](https://github.com/wso2/api-platform/commit/447d5a7bb)).
- Fixed policy-engine update behavior to retain unchanged chains and avoid false route removals ([edb2e453d](https://github.com/wso2/api-platform/commit/edb2e453d), [066695c7a](https://github.com/wso2/api-platform/commit/066695c7a)).
- Fixed LLM provider validation/sync edge cases, including duplicate-named API-level policy preservation and invalid config rejection ([6ce9cbde3](https://github.com/wso2/api-platform/commit/6ce9cbde3), [2843f9eb5](https://github.com/wso2/api-platform/commit/2843f9eb5)).
- Fixed translator/runtime handling for timeout mapping and upstream selection continuity ([34a82c1bc](https://github.com/wso2/api-platform/commit/34a82c1bc), [6e79649c7](https://github.com/wso2/api-platform/commit/6e79649c7), [0a98f265b](https://github.com/wso2/api-platform/commit/0a98f265b)).