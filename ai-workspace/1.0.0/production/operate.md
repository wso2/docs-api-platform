---
title: "Operate the deployment"
description: "Run AI Workspace day to day: structured logs, health signals and alerts, tested backups, and an upgrade path with a rollback behind it."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/operate/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/operate.md
tags:
  - ai-workspace
  - production
  - operations
  - observability
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-21
content_type: "how-to"
---

# Operate the deployment

Once AI Workspace is serving traffic, three things keep it that way: logs you can search, backups that restore, and an upgrade you can undo.

## Step 1: Emit structured logs

Both services log to standard output, so whatever collects container logs on your platform already collects theirs. Switch the format to JavaScript Object Notation (JSON) so a log aggregator can index fields instead of matching text.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#operate-step-1-emit-structured-logs), [Deploy on Kubernetes](deploy-on-kubernetes.md#step-6-write-the-configuration), and [Deploy on OpenShift](openshift.md#production-step-6).

Keep the level at `info` in production. `debug` is verbose enough to affect throughput and to put request detail in your logs. Leave `browser_debug` off, because it turns on verbose console logging in every user's browser.

## Step 2: Watch the right signals

Both services answer a health endpoint that doesn't require authentication: `/healthz` on AI Workspace and `/health` on the Platform API. Everything else comes from logs and from your platform's own metrics.

Alert on these:

| Signal | Why it matters |
|--------|----------------|
| Either health endpoint failing | The service is down or can't reach a dependency |
| A restart loop on either service | A configuration or secret stopped resolving; the startup message names which |
| Database connection errors | The pool is exhausted or the database is unreachable |
| Certificate expiry inside 14 days | Renewal stopped, and an expired certificate takes the workspace offline |
| A gateway moving to inactive | The gateway lost its connection to the control plane, so it stops receiving configuration updates |
| Sustained CPU or memory at the limit | The deployment is undersized for its traffic |
| Authentication failures rising sharply | An identity provider problem, or credential stuffing |

### Gateway connection log lines

The Platform API's WebSocket manager logs each gateway transition at `info` level, so these three messages are available without changing the log level:

| Message | Attributes | What it tells you |
|---------|-----------|-------------------|
| `Gateway connected` | `gatewayID`, `connectionID` | A gateway established its control plane connection |
| `Gateway disconnected` | `gatewayID`, `connectionID` | A gateway dropped. One at a time is normal during a gateway restart; several at once points at the control plane |
| `Heartbeat timeout detected` | `gatewayID` | The gateway stopped answering pings, and the Platform API is about to close the connection. This precedes a gateway going inactive |

Alert on `Heartbeat timeout detected` rather than waiting for the console to show a gateway as inactive, since the timeout is the earlier signal.

### WebSocket metrics

The Platform API also logs connection metrics on an interval, which is the closest signal to how many gateways are connected.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#operate-websocket-metrics), [Deploy on Kubernetes](deploy-on-kubernetes.md#operate-websocket-metrics), and [Deploy on OpenShift](openshift.md#openshift-operate-websocket-metrics).

The Platform API writes this line at `debug` level, so it needs `level = "debug"` as well as `metrics_log_enabled`. At `info` the setting produces no output. Debug logging on the Platform API is verbose, so turn it on to investigate a connection problem rather than leaving it on permanently.

The line's message is `WS Metrics`, and its `payload` attribute holds a JSON object with these fields:

| Field | Meaning |
|-------|---------|
| `from`, `to` | The interval the counters cover, in Request for Comments (RFC) 3339 format |
| `totalActiveConnections` | Gateways connected at the end of the interval |
| `totalActiveOrgs` | Organizations with at least one connected gateway |
| `successfulConnections` | Connections established during the interval |
| `failedConnections` | Connection attempts that failed during the interval |
| `disconnections` | Connections lost during the interval |
| `eventsSent` | Configuration events pushed to gateways during the interval |

The counters reset each interval, so they're rates rather than running totals. `totalActiveConnections` is the one to graph: a drop with no matching deployment change means gateways are losing the control plane. A `failedConnections` count that stays above zero points at a registration token or network path problem rather than a gateway fault.

## Step 3: Back up what you can't regenerate

Two things matter, and they're only useful together. A database backup restored without its encryption key gives you rows whose secret columns can't be decrypted.

| What | How often | Where |
|------|-----------|-------|
| The database | On your organization's schedule for a system of record | Your database backup tooling |
| The at-rest encryption key | Once, when created, and after any change | Your secret manager, separate from the database backup |

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#operate-step-3-back-up-what-you-cant-regenerate), [Deploy on Kubernetes](deploy-on-kubernetes.md#operate-step-3-back-up-what-you-cant-regenerate), and [Deploy on OpenShift](openshift.md#openshift-operate-step-3-back-up-what-you-cant-regenerate).

Test a restore into a non-production environment on a schedule. Only a tested restore proves the backup works.

## Step 4: Upgrade

Read the release notes first, then back up the database, then upgrade. Both procedures below upgrade the whole stack in one step, so plan the upgrade as a change window that covers both services.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#operate-step-4-upgrade), [Deploy on Kubernetes](deploy-on-kubernetes.md#operate-step-4-upgrade), and [Deploy on OpenShift](openshift.md#openshift-operate-step-4-upgrade).

## Step 5: Roll back

Roll back the application, then decide separately about the database. The previous version can't always read a schema the upgrade changed, which is why the backup comes first.

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#operate-step-5-roll-back), [Deploy on Kubernetes](deploy-on-kubernetes.md#operate-step-5-roll-back), and [Deploy on OpenShift](openshift.md#openshift-operate-step-5-roll-back).

## Step 6: Uninstall

For the configuration on each platform, see [Deploy on VMs](deploy-on-vms.md#operate-step-6-uninstall), [Deploy on Kubernetes](deploy-on-kubernetes.md#operate-step-6-uninstall), and [Deploy on OpenShift](openshift.md#openshift-operate-step-6-uninstall).

## Housekeeping settings

Two background tasks have configurable bounds. The defaults suit most deployments; review them if your database grows unexpectedly or deployments appear stuck.

| Setting | Default | What it controls |
|---------|---------|------------------|
| `event_hub.poll_interval` | `3s` | How often each replica checks for events from the others |
| `event_hub.cleanup_interval` | `10m` | How often the Platform API purges delivered events |
| `event_hub.retention_period` | `1h` | How long the Platform API keeps delivered events |
| `deployments.timeout_duration` | `60` seconds | How long a stuck deployment waits before the Platform API marks it failed |

## Related

- [Run in high availability](high-availability.md): the replica setup that makes a rolling upgrade possible
- [Provision secrets and keys](secrets-and-keys.md): what to back up alongside the database
- [Connect a database to the Platform API](../setting-up/database.md): the database this page backs up