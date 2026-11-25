---
title: "Logs overview"
description: "View runtime and audit logs in API Platform to monitor API proxy activity and user actions while preserving data privacy."
canonical_url: https://wso2.com/api-platform/docs/cloud/monitoring-and-insights/logs/overview/
md_url: https://wso2.com/api-platform/docs/cloud/monitoring-and-insights/logs/overview.md
tags:
  - cloud
  - monitoring
  - logs
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "overview"
---

# Logs

The unified log view in API Platform allows you to view runtime and audit logs to gain API Proxy and user insights while ensuring data privacy. API Platform provides real-time insights through live logs and allows you to view historical logs for insights into the past. 

You also have the flexibility to define a required time range to view relevant log entries, where an intuitive scrolling capability facilitates easy viewing of appropriate logs within the selected time frame. The log view also provides advanced filtering capabilities that allow you to efficiently navigate through appropriate logs to expedite troubleshooting in distributed environments.

!!! info "Note"
    All personally identifiable information (PII) gets resolved at the frontend service level, with only relevant UUIDs stored in logs.

Below are the types of logs you can access.

- **[Runtime logs](../logs/runtime-logs.md)**: These logs capture the real-time execution details of your API proxies, helping you monitor performance and identify issues as they occur.
- **[Audit logs](../logs/audit-logs.md)**: These logs provide a record of user actions and system changes, ensuring accountability and traceability for compliance and security purposes.