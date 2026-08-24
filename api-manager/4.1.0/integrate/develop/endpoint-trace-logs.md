---
title: "Tracing and handling errors"
description: "Enable endpoint trace logs to capture detailed message payloads for tracing and troubleshooting integration errors."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/develop/endpoint-trace-logs/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/develop/endpoint-trace-logs.md
tags:
  - api-manager
  - integrate
  - develop
  - endpoint-trace-logs
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Tracing and handling errors

Endpoints have a `trace` attribute, which turns on detailed trace information for messages being sent to the endpoint.
These are available in the `wso2carbon-trace-messages.log` file, which is configured in the `MI_HOME/repository/conf/log4j2.properties` file. Setting the trace log level to `TRACE` logs detailed trace information including message payloads. For more information on endpoint states and handling errors, see [Endpoint Error Handling](../../reference/synapse-properties/endpoint-properties.md#endpoint-error-handling-properties).