---
title: "Enabling logs for a component"
description: "Enable logs for a specific WSO2 Micro Integrator component using the monitoring dashboard or the API Controller CLI."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/observe/micro-integrator/classic-observability-logs/enabling-logs-for-a-component/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/observe/micro-integrator/classic-observability-logs/enabling-logs-for-a-component.md
tags:
  - api-manager
  - observe
  - micro-integrator
  - classic-observability-logs
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "how-to"
---

# Enabling Logs for a Component

Follow the instructions given below to enable logs for a specific component in the Micro Integrator.

## Enabling Logs

There are two ways to enable logs for a component: using the Micro Integrator [dashboard](#using-the-dashboard) or using the [CLI](#using-the-cli).

!!! Info
    Alternatively, you can directly update the [log configurations](configuring-log4j2-properties.md) in the `log4j2.properties` file (stored in the `<MI_HOME>/conf` directory).

### Using the Dashboard

1.  Sign in to the [Micro Integrator dashboard](../../mi-observe/working-with-monitoring-dashboard.md).
2.  Click <b>Log Configs</b> on the left-hand navigator to open the <b>Logging Management</b> window.
3.  Go to the <b>Add Loggers</b> tab and define the new logger.

     <a href="../../../../assets/img/integrate/monitoring-dashboard/add-logger.png"><img alt="add new loggers using dashboard" src="../../../../assets/img/integrate/monitoring-dashboard/add-logger.png" width="80%"></a>

    <table>
        <tr>
            <th>
                Logger Name
            </th>
            <td>
                Give a name for the logger.
            </td>
        </tr>
        <tr>
            <th>
                Class
            </th>
            <td>
                Specify the class implementation of the component for which the logger is defined.
            </td>
        </tr>
        <tr>
            <th>
                Log Level
            </th>
            <td>
                Specify the <a href="../configuring-log4j2-properties/#updating-the-log4j2-log-level">log level</a>.
            </td>
        </tr>
    </table>
 
### Using the CLI

1.  Download and set up the [API Controller](../../../install-and-setup/setup/api-controller/getting-started-with-wso2-api-controller.md).

2.  Use the commands for [adding a new logger](../../../install-and-setup/setup/api-controller/managing-integrations/managing-integrations-with-ctl.md#add-a-new-logger) to the Micro Integrator.

## Printing Logs

By default, when you enable logs for a component, the logs get printed to the server console and the <b>carbon log file</b>. When there are error logs, these are also printed to the <b>error log file</b>. These log files are stored in the `<MI_HOME/repository/logs/` directory.

By default, all loggers print logs to the destinations configured for the [root logger](configuring-log4j2-properties.md#root-logs). If you want to print logs to new destinations, you can define new [appenders](configuring-log4j2-properties.md#log4j2-appenders). 

For example, you will define new appenders when you want to have [per-service log files](../../../integrate/develop/monitoring-service-level-logs.md) or [per-api log files](../../../integrate/develop/monitoring-api-level-logs.md).

## What's Next?

Once you have defined the new logger:

-   Start [using the logs](monitoring-logs.md).
-   [Configure the log properties](configuring-log4j2-properties.md)