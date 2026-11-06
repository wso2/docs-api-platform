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
last_updated: 2026-11-06
content_type: "concept"
---

# Audit logs

When an LLM proxy starts routing to a different provider, or an API key stops working, the first question is often who changed it. Audit logs answer that: every change made through the gateway's management API is recorded with who made it, what they did, to which resource, when, and whether it was applied.

This is a different concern from [Gateway logs](gateway-logs.md), which record what the gateway process is doing, and from [Log requests and responses](log-requests-and-responses.md), which record the traffic. Audit logs record changes to the gateway's own configuration.

## What is recorded

A record is written for every successful change made through the management API to:

- LLM providers, LLM proxies, and LLM provider templates
- MCP proxies
- Agents
- REST and GraphQL APIs
- API keys, subscriptions, and subscription plans
- Certificates

Reads and requests the gateway rejects are not recorded. Changes made from the control plane and pushed to the gateway are not recorded by the gateway either; the control plane records them.

## Where records go

Audit logging is off by default. When you turn it on in the gateway controller's `config.toml`, every record is stored in the gateway's database, in the `audit` table. You can also send each record as a JSON line to the gateway controller's log (`stdout`), to a rotating file, or to an HTTP log receiver such as Splunk or a SIEM, in any combination.

Recording never fails a change: if a record can't be saved or sent, the change still goes ahead and the gateway logs an error.

For the settings, the record format, and the Helm configuration, see [Audit logging](../../../api-gateway/next/observability/audit-logging.md) in the API Platform Gateway documentation.

## Handle audit records carefully

Each record names the user who made the change. To keep user names out of the log lines your outputs receive, set `mask_sensitive_fields = true`; the `audit` table keeps the user regardless. Credentials for an HTTP receiver come from an environment variable, never from `config.toml` itself.

## Related topics

- [Gateway logs](gateway-logs.md) — collect the logs the gateway writes about itself.
- [Log requests and responses](log-requests-and-responses.md) — record the content of the traffic rather than changes to the gateway.
- [Audit logging](../../../api-gateway/next/observability/audit-logging.md) — settings, record format, and Kubernetes configuration.
