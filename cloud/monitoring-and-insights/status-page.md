---
title: "API Platform Status Page"
description: "Check the real-time operational health, active incidents, and scheduled maintenance for WSO2 API Platform Cloud."
canonical_url: https://wso2.com/api-platform/docs/cloud/monitoring-and-insights/status-page/
md_url: https://wso2.com/api-platform/docs/cloud/monitoring-and-insights/status-page.md
tags:
  - cloud
  - monitoring
  - status
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "concept"
---

# API Platform Status Page

The **API Platform Status Page** is the official, public source of truth for the real-time operational health of WSO2 API Platform Cloud. It provides live availability information for the platform's services across all regions, so you can quickly confirm whether an issue you are seeing is caused by an ongoing platform incident.

You can access the status page at **[https://status.bijira.dev](https://status.bijira.dev/)**.

## What the status page shows

The status page reports the current state of each platform service and region, along with historical uptime and incident information. At a glance you can see:

- **Service availability** : the current status of each component and region, reported as **Operational**, **Maintenance**, **Degraded**, or **Outage**.
- **Active incidents** : details of any ongoing incidents, including affected services and the latest updates from the operations team.
- **Scheduled maintenance** : planned maintenance windows that may temporarily affect availability.
- **Uptime history** : historical availability and a timeline of past incidents, so you can review reliability over time.

## When to use it

Check the status page when you want to:

- Verify whether degraded performance or errors you are experiencing are caused by a platform-wide incident rather than an issue with your own API proxy or configuration.
- Stay informed about upcoming scheduled maintenance that could affect your APIs.
- Review the platform's historical uptime and incident record.

!!! tip
    You can subscribe to status updates directly from the [status page](https://status.bijira.dev/) to receive notifications about incidents and scheduled maintenance as they happen.

## Related topics

- [Insights](insights.md) — monitor your own API, LLM, and MCP traffic, errors, and performance.
- [Runtime Logs](logs/runtime-logs.md) — investigate request-level issues within your APIs.