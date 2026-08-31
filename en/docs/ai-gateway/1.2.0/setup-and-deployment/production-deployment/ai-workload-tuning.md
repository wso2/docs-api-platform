---
title: "Tune the Gateway for AI Traffic"
description: "Tune API Platform AI Gateway for LLM and MCP traffic: streaming timeouts, body buffers, guardrail limits, cost pricing data, and semantic cache backing."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/ai-workload-tuning/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/production-deployment/ai-workload-tuning.md
tags:
  - ai-gateway
  - production
  - llm
  - streaming
  - guardrails
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "how-to"
---

# Tune the gateway for AI traffic

Large language model (LLM) and Model Context Protocol (MCP) traffic differs from representational state transfer (REST) traffic in ways the chart defaults don't anticipate. Requests stay open for tens of seconds, bodies run to megabytes, and guardrails inspect every one of those bodies. This page covers the settings that matter because of those differences. The gateway starts with the chart defaults for these settings, and production LLM traffic tends to outgrow the defaults listed below.

## Raise the timeouts for long completions

The chart allows 60 seconds for a complete request-to-response cycle on a route. A large completion, a reasoning model, or a long tool-use chain regularly exceeds that, and the client receives a gateway timeout partway through a response the provider was still producing.

```yaml
gateway:
  config:
    router:
      upstream:
        timeouts:
          route_timeout_ms: 300000        # 5 minutes for a full completion
          route_idle_timeout_ms: 300000   # Gap allowed between stream chunks
          connect_timeout_ms: 5000
      http_listener:
        timeouts:
          request_timeout: "0s"           # Leave disabled; the route timeout governs
          stream_idle_timeout: "10m"
          idle_timeout: "1h"
```

The two idle timeouts are what keep a streaming response alive. `route_idle_timeout_ms` bounds the gap between chunks arriving from the provider, and `stream_idle_timeout` bounds the same gap on the client side. Set both longer than the longest pause you expect between tokens, not longer than the response as a whole.

Individual proxies can override the route timeouts through their `resilience` block, which is useful when one model is much slower than the rest. For the full precedence order between the `resilience` block and these defaults, see [Timeouts](../../timeouts-and-resilience.md).

!!! note
    Raise the matching timeouts on whatever sits in front of the gateway as well. An ingress controller or load balancer with a 60-second read timeout cuts the response off regardless of what the gateway allows.

## Size the body buffers

The policy engine decompresses request and response bodies so that policies can inspect them. The default limit is 10 MiB in each direction, and the configuration below overrides it to 20 MiB. For streaming responses it applies per chunk rather than cumulatively, so a long Server-Sent Events stream isn't affected. A large buffered response, a request carrying a long conversation history, or a document-heavy prompt can cross it.

```yaml
gateway:
  config:
    policy_engine:
      request_body:
        max_decompressed_bytes: 20971520    # 20 MiB, overriding the 10 MiB default
      response_body:
        max_decompressed_bytes: 20971520    # 20 MiB, overriding the 10 MiB default
    router:
      http_listener:
        per_connection_buffer_limit_bytes: 4194304   # 4 MiB
```

Raise these only as far as your payloads need. Every concurrent request holds its buffer in the runtime's memory, so the ceiling multiplies by concurrency and lands directly on the memory limit you set in [Resources and scaling](./resources-and-scaling.md).

## Give guardrails room to run

Guardrails execute in the policy engine on the request path, the response path, or both. Two timeouts bound them, and both apply per request.

```yaml
gateway:
  config:
    router:
      policy_engine:
        timeout_ms: 60000
        message_timeout_ms: 60000
        route_cache_action: RETAIN
    policy_engine:
      python_executor:
        timeout: 30s
```

- `python_executor.timeout` bounds a single policy execution. Guardrails that call an external service spend most of that budget on the network call. [Azure Content Safety](https://wso2.com/api-platform/policy-hub/policies/azure-content-safety-content-moderation), [AWS Bedrock guardrails](https://wso2.com/api-platform/policy-hub/policies/aws-bedrock-guardrail), and a [semantic prompt guardrail](https://wso2.com/api-platform/policy-hub/policies/semantic-prompt-guard) that generates embeddings all behave this way. Raise the timeout when the guardrail service is slow or distant. Keep it below `route_timeout_ms`, so the route timeout stays the outer bound.
- `route_cache_action: RETAIN` keeps the route cache warm across requests. Leave it at `RETAIN`.

Guardrails that reach an external service add that service's latency and its failure modes to every request. Deploy the guardrail service in the same region as the gateway, and check what your chosen guardrail does when the service is unreachable before you rely on it in production.

## Supply pricing data for token cost tracking

The `llm_cost_v1` policy converts token counts into cost using a pricing file. The chart mounts a bundled `model_prices.json` at `/etc/policy-engine/llm-pricing/model_prices.json`:

```yaml
gateway:
  gatewayRuntime:
    policies:
      llmPricing:
        enabled: true
        configMapName: ""     # Empty uses the bundled pricing data
```

The bundled file is fixed at the release you deploy, so it doesn't reflect later provider price changes, and it has no entry for a self-hosted or private model. Supply your own by creating a ConfigMap with a `model_prices.json` key and naming it in `configMapName`:

```bash
kubectl create configmap llm-model-prices \
  --namespace <your-namespace> \
  --from-file=model_prices.json=./model_prices.json
```

```yaml
gateway:
  gatewayRuntime:
    policies:
      llmPricing:
        enabled: true
        configMapName: llm-model-prices
```

When you name a ConfigMap, the chart doesn't create the built-in one. Point the policy at the mounted path through the raw configuration passthrough:

```yaml
gateway:
  config_toml: |
    [policy_configurations.llm_cost_v1]
    pricing_file = "/etc/policy-engine/llm-pricing/model_prices.json"
```

Cost figures are only as accurate as this file. Treat it as data to review on a schedule rather than as something to set once.

## Provision infrastructure for semantic caching

[Semantic caching](https://wso2.com/api-platform/policy-hub/policies/semantic-cache) depends on two external services that the gateway chart doesn't deploy, so provision both before you enable the policy:

- **A vector database** — Redis or Milvus — that stores the cached responses and their embeddings. Size it for your retention window, place it in the same region as the gateway, and secure it: it holds prompt and completion content in full.
- **An embedding provider** — OpenAI, Mistral, or Azure OpenAI — called on every request that reaches the policy. Its latency is added to every cache miss, and its API key is stored as a gateway secret, encrypted with the key from [Security hardening](./security-hardening.md).

The cache is shared state. Every gateway runtime replica pointed at the same vector database serves from and writes to one cache, which is what you want across replicas of a single environment. Use separate databases or indexes for separate environments, so a staging prompt can't be served to a production caller.

## Log and trace the AI traffic

The chart ships the controller log level at `debug`. Move it to `info` in production, and keep JSON formatting so a log aggregator can parse it:

```yaml
gateway:
  config:
    controller:
      logging:
        level: info
        format: json
    policy_engine:
      logging:
        level: info
        format: json
```

!!! warning "Prompts and completions are sensitive"
    Debug-level logging can record request and response bodies, which on an AI Gateway means user prompts and model completions. Before you enable debug-level logging in production, confirm that your log retention and access controls suit that content. If you forward traffic data to an external analytics service, control what leaves the gateway with the [analytics header filter](../../analytics/analytics-header-filter.md). For where the logs go and how to read them, see [Gateway logs](../../logging-and-tracing/gateway-logs.md).

---

[← Resources and scaling](./resources-and-scaling.md) &nbsp;|&nbsp; [Deploy and verify →](./deploy-and-verify.md)
