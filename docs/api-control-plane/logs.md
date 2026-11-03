---
title: "Logs"
description: "View organization-level gateway runtime logs in the API Control Plane."
---

API Control Plane runtime logs provide organization-level visibility into application and gateway logs. By centralizing log information, they help you investigate issues and troubleshoot problems more efficiently.

Any organization member can view runtime logs from the **Logs** page. You can filter logs by type, environment, and log level to narrow down the results and find relevant entries.

## Open runtime logs

1. Sign in to the [API Platform Console](https://console.bijira.dev) and open your organization.
2. In the left navigation menu, click **Observability**, then click **Logs**.

By default, the page displays runtime logs from the past three days. You can adjust the time range and apply filters to find logs that match your requirements.

## Search runtime logs

Use the search box to find log entries containing specific text. The search is case-sensitive and matches partial strings in log messages across application, gateway, and system logs.

## Filter runtime logs

You can filter runtime logs using the following criteria:

| Filter | Options |
|:-------|:--------|
| **Type** | Gateway access, Gateway activity |
| **Environment** | Development and other available environments |
| **Level** | Debug, Error, Info, Warn |
