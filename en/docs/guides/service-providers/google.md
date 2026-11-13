---
title: "Google guides"
description: "Use WSO2 API Platform to route Google Gemini CLI through AI Gateway, govern Gemini model traffic, and send gateway telemetry to Google Cloud."
canonical_url: https://wso2.com/api-platform/docs/guides/service-providers/google/
md_url: https://wso2.com/api-platform/docs/guides/service-providers/google.md
tags:
  - guides
  - google
  - gemini
  - gemini-cli
  - service-provider-guides
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "reference"
---

# Govern Gemini models and Gemini CLI

WSO2 API Platform works alongside the Google products and services you already use. Govern Gemini model traffic, route Gemini CLI through AI Gateway, and send gateway telemetry to Google Cloud.

## End-to-end guides

A step-by-step guide for Gemini CLI.

<div class="vendor-guide-list" markdown="1">

- [Configure Google Gemini CLI with AI Gateway](../ai-and-mcp/ai-coding-assistants/gemini-cli-configuration-with-ai-gateway.md)

    Route Gemini CLI requests through a Gemini provider and an App LLM Proxy.

    Guide · Gemini CLI · Hybrid

</div>

## AI Gateway with Gemini models

Route, secure, and govern traffic to Gemini models through WSO2 AI Gateway, including traffic from Gemini CLI.

<div class="vendor-cap" markdown="1">

### Gemini as an LLM provider

Register the Gemini API with the gateway. Applications call the gateway and never see the Gemini API key.

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [Configure an LLM provider](../../cloud/ai-workspace/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>
- [Call Gemini through the gateway](../../cloud/ai-workspace/using-sdks.md#gemini) <span class="vendor-meta">AI Workspace</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [Gemini provider](../../ai-gateway/2026.09.24/gateway-artifacts/llm-provider/supported-providers/gemini.md) <span class="vendor-meta">AI Gateway</span>
- [Configure an LLM provider](../../ai-workspace/1.0.0/llm-providers/configure-provider.md#authentication) <span class="vendor-meta">AI Workspace</span>

</div>

</div>

<div class="vendor-cap" markdown="1">

### OpenAI-format requests

Keep clients on the OpenAI request format. A transformer policy converts requests and responses for Gemini.

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [OpenAI-format compatibility](../../ai-gateway/2026.09.24/gateway-artifacts/llm-provider/supported-providers/gemini.md#openai-format-compatibility) <span class="vendor-meta">AI Gateway</span>
- [OpenAI to Gemini transformer policy](https://wso2.com/api-platform/policy-hub/policies/openai-to-gemini-transformer) <span class="vendor-meta">Policy Hub</span>

</div>

</div>

<div class="vendor-links" data-deployments="hybrid" markdown="1">

Routing, token limits, cost control, and the other AI Workspace policies work the same way for every provider. See the [AI Workspace overview](../../cloud/ai-workspace/overview.md).

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

Routing, token limits, cost control, and the gateway's other policies work the same way for every provider. See the [AI Gateway documentation](../../ai-gateway/2026.09.24/overview.md).

</div>

## Google Cloud Monitoring and Cloud Trace

Send the metrics and traces of a gateway you run to Google Cloud through an OpenTelemetry Collector.

<div class="vendor-cap" markdown="1">

### Metrics and traces

Point the collector at Cloud Monitoring for metrics and at Cloud Trace for traces.

<div class="vendor-links" data-deployments="hybrid" markdown="1">

- [Send AI Gateway traces to Cloud Trace](../../cloud/ai-gateway/observability/tracing.md#cloud-native-tracing-solutions) <span class="vendor-meta">AI Gateway</span>

</div>

<div class="vendor-links" data-deployments="self-hosted" markdown="1">

- [Send API Gateway metrics to Cloud Monitoring](../../api-gateway/1.2.0/observability/metrics/alternative-backends.md#google-cloud-monitoring) <span class="vendor-meta">API Gateway</span>
- [Send API Gateway traces to Cloud Trace](../../api-gateway/1.2.0/observability/tracing/alternative-backends.md#google-cloud-trace) <span class="vendor-meta">API Gateway</span>
- [Send AI Gateway traces to Cloud Trace](../../ai-gateway/2026.09.24/logging-and-tracing/tracing.md#cloud-native-tracing-solutions) <span class="vendor-meta">AI Gateway</span>

</div>

</div>

## Architecture and responsibility model

WSO2 API Platform and Google split the work like this:

| Scenario | WSO2 role | Google role | Runtime traffic |
| --- | --- | --- | --- |
| Gemini CLI through AI Gateway | Authenticates developers and applies guardrails, rate limits, and analytics | Hosts the Gemini models and bills the API key | Goes through WSO2 AI Gateway to the Gemini API |
| Applications calling Gemini models | Proxies and governs LLM requests | Hosts the Gemini models | Goes through WSO2 AI Gateway to the Gemini API |
| Gateway telemetry in Google Cloud | Emits metrics and traces from the gateway | Stores and displays the telemetry | The collector sends telemetry to Google Cloud without affecting API traffic |

## Learn more

Related pages in the Google documentation:

- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Gemini models](https://ai.google.dev/gemini-api/docs/models)
- [OpenAI compatibility for the Gemini API](https://ai.google.dev/gemini-api/docs/openai)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)

To browse every guide by goal, see the [Guides overview](../overview.md#browse-by-use-case).
