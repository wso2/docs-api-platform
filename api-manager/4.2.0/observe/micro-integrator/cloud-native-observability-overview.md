---
title: "Micro Integrator observability overview"
description: "Learn about the cloud native observability solution for Micro Integrator deployments, covering metrics, log, and trace monitoring add-ons."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/observe/micro-integrator/cloud-native-observability-overview/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/observe/micro-integrator/cloud-native-observability-overview.md
tags:
  - api-manager
  - observe
  - micro-integrator
  - cloud-native-observability-overview
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# Micro Integrator Observability Overview

The following diagram depicts the complete **cloud native** observability solution for your Micro Integrator deployment, which includes **metrics monitoring**, **log monitoring**, and **message tracing** capabilities.

[![Cloud Native Deployment Architecture](../../assets/img/integrate/monitoring-dashboard/cloud-native-deployment-architecture.png)](../../assets/img/integrate/monitoring-dashboard/cloud-native-deployment-architecture.png)

## Minimum cloud native observability

The basic deployment offers you metrics capabilities. You can set up the basic deployment with only Prometheus and Grafana to view and explore with the available Prometheus metrics.

[![Cloud Native Deployment - Minimum](../../assets/img/integrate/monitoring-dashboard/cloud-native-observability-metrics.png)](../../assets/img/integrate/monitoring-dashboard/cloud-native-observability-metrics.png)

## Cloud native observability add ons

You can also set up different flavors of the observability solution depending on your requirement.

### Log processing add on
 
Once you set up the basic deployment, you can integrate log-processing capabilities. To use this, you need to install **Fluent-Bit** as the logging agent and **Grafana Loki** as the log aggregator.

[![Cloud Native Deployment with Logs](../../assets/img/integrate/monitoring-dashboard/cloud-native-observability-logs.png)](../../assets/img/integrate/monitoring-dashboard/cloud-native-observability-logs.png)

### Message tracing add on

Once you set up the basic deployment, you can integrate message tracing capabilities. To use this you need to install **Jaeger**.  

[![Cloud Native Deployment with Tracing](../../assets/img/integrate/monitoring-dashboard/cloud-native-observability-tracing.png)](../../assets/img/integrate/monitoring-dashboard/cloud-native-observability-tracing.png)

## Observability solutions

There are two cloud native observability solutions for the Micro Integrator; The Kubernetes based deployment and the VM based deployment.

<a href="../../../assets/img/integrate/observability/observability-mi.png"><img src="../../../assets/img/integrate/observability/observability-mi.png" title="Observability Solution" width="50%" alt="Observability Solution"/></a>

These solutions are suitable for the following combination of operations.

<table>
    <tr>
        <th><b>Observability solution</b></th>
        <th><b>Operations</b></th>
        <th><b>Description</b></th>
    </tr>
    <tr>
        <td>Kubernetes cloud native solution</td>
        <td>
            <ul>
                <li>Metrics only</li>
                <li>Metrics + Logging</li>
                <li>Metrics + Tracing</li>
                <li>Metrics + Logging + Tracing</li>
            </ul>
        </td>
        <td>
        <ul>
        <li>The default Kubernetes cloud native solution comes with metrics enabled.</li>
        <li> You can also configure logging and tracing in combination with this. 
        </li>
            <li>This solution is ideal in the following situations.
            <ul>
                <li>If you want a complete cloud native solution for observability.</li>
                <li>If you already have Prometheus, Grafana, and Jaeger as your in-house monitoring and observability tools.</li>
            </ul>
        </li>
        <li>
        For more information, see the <a href="../../../observe/micro-integrator/setting-up-cloud-native-observability-in-kubernetes">Kubernetes Deployment Getting Started Guide</a>.
        </li>
        </ul>
        </td>
    </tr>
    <tr>
        <td>VM cloud native deployment</td>
        <td>
            <ul>
                <li>Metrics only</li>
                <li>Logging (add-on)</li>
                <li>Tracing (add-on)</li>
            </ul>
        </td>
        <td>
        <ul>
            <li>
            The default VM cloud native solution comes with metrics enabled. </li>
            <li>You can additionally set up logging or tracing separately as part of this solution later. 
            </li>
            <li>
            This solution is ideal if you want a complete cloud native solution for observability, but you need to set this up on a VM. Ideally, you would already have Prometheus, Grafana, and Jaeger as your in-house monitoring and observability tools.
            </li>
            <li>
            For more information, see the <a href="../../../observe/micro-integrator/setting-up-cloud-native-observability-on-a-vm">VM Deployment Getting Started Guide</a>.
            </li>
        </ul>
        </td>
    </tr>
</table>

## Technologies

The cloud native observability solution is based on proven projects from the **Cloud Native Computing Foundation**, which makes the solution cloud native and future proof. Following are the technologies used in the current solution:

| **Feature**   | **Technology**              |
|---------------|-----------------------------|
| Metrics       | Prometheus                  |
| Visualization | Grafana                     |
| Logging       | Log4j2, Fluent-Bit, and Grafana Loki |
| Tracing       | Jaeger                      |

## What's Next?

-	Set up <a href="../../../observe/micro-integrator/setting-up-cloud-native-observability-on-a-vm">cloud-native observability on a VM</a>.
-	Set up <a href="../../../observe/micro-integrator/setting-up-cloud-native-observability-in-kubernetes/">cloud-native observability on Kubernetes</a>.