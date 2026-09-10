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
last_updated: 2026-08-06
content_type: "how-to"
---

# Operate the deployment

Once AI Workspace is serving traffic, three things keep it that way: logs you can search, backups that restore, and an upgrade you can undo.

## Step 1: Emit structured logs

Both services log to standard output, so whatever collects container logs on your platform already collects theirs. Switch the format to JavaScript Object Notation (JSON) so a log aggregator can index fields instead of matching text.

=== "Virtual machine"
    ```toml
    # configs/config.toml
    [platform_api.logging]
    level  = "info"
    format = "json"

    [ai_workspace.logging]
    level         = "info"
    format        = "json"
    browser_debug = "false"
    ```

    Point the container runtime at your collector and cap local files so a log burst can't fill the disk:

    ```yaml
    services:
      platform-api:
        logging:
          driver: json-file
          options:
            max-size: "50m"
            max-file: "5"
      ai-workspace-ui:
        logging:
          driver: json-file
          options:
            max-size: "50m"
            max-file: "5"
    ```

=== "Kubernetes"
    ```yaml
    platform-api:
      config:
        logging:
          level: info
          format: json

    ai-workspace-ui:
      config:
        logging:
          level: info
          format: json
          browserDebug: false
    ```

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

The Platform API also logs connection metrics on an interval, which is the closest signal to how many gateways are connected:

=== "Virtual machine"
    ```toml
    [platform_api.server.websocket]
    metrics_log_enabled  = true
    metrics_log_interval = 10
    ```

=== "Kubernetes"
    ```yaml
    platform-api:
      config:
        server:
          websocket:
            metricsLogEnabled: true
            metricsLogInterval: 10
    ```

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

=== "Virtual machine"
    Back up the database with your standard tooling, and treat the key files as secrets rather than as part of a host backup. This example uses PostgreSQL; use the equivalent for whichever database you run:

    ```bash
    pg_dump --host postgres.example.com --username platform_api \
      --format=custom --file platform_api-$(date +%F).dump platform_api
    ```

    Keep `configs/config.toml` and `docker-compose.yaml` in version control. Keep `api-platform.env`, `resources/keys/`, and `secrets/` out of it.

    If you still run SQLite on a single host, back up the database file with the stack stopped, or through SQLite's own backup command. Copying a file that's being written produces a backup that may not restore.

=== "Kubernetes"
    Back up the database with your standard tooling. Back up the Secrets separately, into your secret manager rather than into a cluster snapshot.

    The Platform API's persistent volume claim carries a `helm.sh/resource-policy: keep` annotation, so it survives `helm uninstall` and a later install with the same release name re-adopts it. That protects you from an accidental uninstall; it isn't a backup, because it doesn't survive losing the cluster.

    To remove that data deliberately:

    ```bash
    kubectl -n <namespace> delete pvc <release-name>-platform-api-data
    ```

Test a restore into a non-production environment on a schedule. Only a tested restore proves the backup works.

## Step 4: Upgrade

Read the release notes first, then back up the database, then upgrade. Both procedures below upgrade the whole stack in one step, so plan the upgrade as a change window that covers both services.

=== "Virtual machine"
    1. Back up the database, and confirm the backup completed.
    2. Pin the new image tags in `docker-compose.yaml`.
    3. Pull the images before you stop anything, so the pull isn't part of your downtime:

        ```bash
        docker compose pull
        ```

    4. Recreate the services:

        ```bash
        docker compose up -d
        ```

    5. Confirm both services are healthy and check the logs for startup errors.

    Across several hosts, upgrade one at a time. Remove a host from the load balancer, upgrade it, wait for its health check, then return it to rotation before moving to the next.

=== "Kubernetes"
    1. Back up the database, and confirm the backup completed.
    2. Resolve the component chart versions:

        ```bash
        helm dependency update ./ai-workspace
        ```

    3. Preview what changes before you apply it:

        ```bash
        umask 077
        helm template <release-name> ./ai-workspace -n <namespace> \
          -f values-secrets.yaml -f my_values.yaml > ./next.yaml
        ```

        The rendered output contains Secret manifests in the clear. Review it, then remove it:

        ```bash
        shred -u ./next.yaml
        ```

    4. Upgrade:

        ```bash
        helm upgrade <release-name> ./ai-workspace -n <namespace> \
          -f values-secrets.yaml -f my_values.yaml --wait --timeout 10m
        ```

    5. Confirm the rollout finished and the pods are ready:

        ```bash
        kubectl -n <namespace> rollout status deploy/<release-name>-platform-api
        kubectl -n <namespace> rollout status deploy/<release-name>-ai-workspace-ui
        kubectl -n <namespace> get pods
        ```

    With two or more replicas and a PodDisruptionBudget in place, the rollout replaces pods gradually and keeps serving. Workspace sessions held by a replaced pod end, so users on that pod sign in again.

## Step 5: Roll back

Roll back the application, then decide separately about the database. The previous version can't always read a schema the upgrade changed, which is why the backup comes first.

=== "Virtual machine"
    Set the image tags back to the previous version and recreate:

    ```bash
    docker compose up -d
    ```

    Restore the database only if the upgrade changed the schema in a way the previous version can't read. Restoring loses everything written since the backup.

=== "Kubernetes"
    ```bash
    helm history <release-name> -n <namespace>
    helm rollback <release-name> <revision> -n <namespace> --wait
    ```

    A rollback reverts the manifests, not the database. Restore from backup separately if the upgrade changed the schema.

## Step 6: Uninstall

=== "Virtual machine"
    ```bash
    docker compose down
    ```

    Volumes survive. `docker compose down -v` deletes them, including the database when you still run SQLite. Check what a volume holds before you remove it.

=== "Kubernetes"
    ```bash
    helm uninstall <release-name> -n <namespace>
    ```

    The Platform API's persistent volume claim survives, because of its `helm.sh/resource-policy: keep` annotation. Secrets you created outside the chart, including the ones `generate-secrets.sh` made, also survive. Remove them deliberately once you're certain no data depends on them.

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