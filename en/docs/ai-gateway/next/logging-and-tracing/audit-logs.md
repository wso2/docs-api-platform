---
title: "Audit logs"
description: "Record who created, changed, or deleted LLM providers, LLM proxies, MCP proxies, and other resources through the AI Gateway's management API."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/next/logging-and-tracing/audit-logs/
md_url: https://wso2.com/api-platform/docs/ai-gateway/next/logging-and-tracing/audit-logs.md
tags:
  - ai-gateway
  - logging
  - observability
  - audit
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-09
content_type: "concept"
---

# Audit logs

Audit logs record every change made through the AI Gateway's management API. Each record shows who made the change, what changed, when, and whether the change was applied.

Audit logs track changes to the gateway's configuration. To see what the gateway process is doing, use [Gateway logs](gateway-logs.md). To capture the traffic, use [Log requests and responses](log-requests-and-responses.md).

## What is recorded

Changes to these resources are recorded:

- LLM providers, LLM proxies, and LLM provider templates
- MCP proxies
- Agents
- REST and GraphQL APIs
- API keys, subscriptions, and subscription plans
- Certificates

Viewing a resource isn't recorded. Changes pushed to the gateway from the control plane are recorded by the control plane, not by the gateway.

## Turn on audit logging

Turn on audit logging in the gateway controller's `config.toml`. The gateway then stores each record in its database. It can also send each record to the gateway controller's log, to a log file, or to a log receiver such as Splunk.

For the steps and settings, see [Audit logging](../../../api-gateway/next/observability/audit-logging.md) in the API Platform Gateway documentation.

## Related topics

- [Gateway logs](gateway-logs.md): collect the logs the gateway writes about itself.
- [Log requests and responses](log-requests-and-responses.md): record the traffic rather than changes to the gateway.
