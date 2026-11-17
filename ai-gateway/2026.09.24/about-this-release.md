# AI Gateway Changelog

**Release date:** 2026-09-24  
**Previous version:** 1.2.0 (2026-07-07)  

### New feature additions

- **[Agent governance (A2A support)](agent-governance/index.md):** The AI Gateway can front autonomous agents that use the Agent-to-Agent (A2A) protocol. It publishes a governed Agent Card and applies gateway policies, such as authentication and rate limiting, to agent traffic.
- **Latest MCP specification support:** The MCP Gateway supports the latest version of the Model Context Protocol (MCP) specification. For more information, see [MCP governance](mcp-governance.md).
- **[Azure cost policy](https://wso2.com/api-platform/policy-hub/policies/azure-llm-cost):** The `Azure LLM Cost` policy calculates the cost of LLM calls made through Azure OpenAI and Azure AI Foundry, so you can track Azure costs alongside other providers. For more information, see [Cost control and budgets](cost-control-and-budgets.md).
- **[OpenTelemetry analytics publisher](analytics/opentelemetry-analytics.md):** The gateway exports analytics events as OpenTelemetry Protocol (OTLP) log records to an OpenTelemetry Collector that you operate, in addition to Moesif. Through collector configuration, you can send analytics to any OTLP-capable platform, such as Datadog, Splunk, Elastic, Dynatrace, or Grafana, without extra gateway-side integration work.

### Fixed

- Fixed the primary provider not being addressable by name: the controller now defines a named upstream for every attached provider, the primary included, and accepts an `alias` and a `transformer` on it ([#3480](https://github.com/wso2/api-platform/pull/3480)).
- Fixed transformer model resolution ignoring the request: the five `openai-to-*` transformers now take the model from the request payload, with the configured policy model as a fallback ([wso2/gateway-controllers#307](https://github.com/wso2/gateway-controllers/pull/307)).