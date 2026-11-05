---
title: "Configure Audit Logging"
description: "Record who changed what on the API Platform Gateway through its management API — in the gateway's database and, optionally, as JSON lines to stdout, a rotating file, or an HTTP log receiver."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/1.1.0/observability/audit-logging/
md_url: https://wso2.com/api-platform/docs/api-gateway/1.1.0/observability/audit-logging.md
tags:
  - api-gateway
  - observability
  - audit
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-05
content_type: "how-to"
---
# Audit Logging

!!! info "Note"
    Audit logging is available from **update level 1.1.0.&lt;N&gt;** onwards. It is **off by default**,
    so applying the update changes nothing until you turn it on.

## Overview

Audit logging keeps a record of every change made through the gateway's **management API**: who made
the change, what they did, to which resource, when, and whether it was applied.

Records are always stored in the gateway's database, in the `audit` table. You can also send each
record, as a JSON line, to one or more **outputs**:

| Output     | Where records go                                                       | Use it when                                                                                                |
| ---------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| *(none)* | The `audit` table only. **This is the default.**               | You query the gateway database directly.                                                                   |
| `stdout` | The gateway controller's container log (`kubectl logs`, Docker logs) | A log collector such as Fluent Bit, Fluentd, or the CloudWatch agent already collects container logs.      |
| `file`   | A rotating log file                                                    | You want audit records in their own file, separate from the application log, for a file-tailing collector. |
| `http`   | Your log receiver, as batched HTTP `POST` requests                   | You want records sent straight to Splunk, a log collector's HTTP input, or a SIEM.                         |

You can use any combination: `outputs = ["file", "http"]` writes every record to both.

## What is recorded

A record is written for every successful change made through the management API:

| Resource               | `resourceType`          | Actions                                                   |
| ---------------------- | ------------------------- | --------------------------------------------------------- |
| REST APIs              | `rest_api`              | `CREATE`, `UPDATE`, `DELETE`                        |
| WebSub APIs            | `websub_api`            | `CREATE`, `UPDATE`, `DELETE`                        |
| API keys               | `api_key`               | `CREATE`, `UPDATE` (update or regenerate), `REVOKE` |
| Subscriptions          | `subscription`          | `CREATE`, `UPDATE`, `DELETE`                        |
| Subscription plans     | `subscription_plan`     | `CREATE`, `UPDATE`, `DELETE`                        |
| Certificates           | `certificate`           | `CREATE` (upload), `DELETE`                           |
| MCP proxies            | `mcp_proxy`             | `CREATE`, `UPDATE`, `DELETE`                        |
| LLM providers          | `llm_provider`          | `CREATE`, `UPDATE`, `DELETE`                        |
| LLM proxies            | `llm_proxy`             | `CREATE`, `UPDATE`, `DELETE`                        |
| LLM provider templates | `llm_provider_template` | `CREATE`, `UPDATE`, `DELETE`                        |

If the gateway accepts a change but fails to save it (for example, because of a database error), the
record's `outcome` is `failed`. Otherwise it is `succeeded`.

The following are **not** recorded:

* Reads, and requests the gateway rejects (for example, invalid input or a resource that doesn't exist).
* Changes made from the control plane (Platform API) and pushed to the gateway.
* Changes on an **immutable gateway**, which doesn't accept changes through its management API.

Audit logging never fails a management API request: if a record cannot be saved or sent, the change
still goes ahead and the gateway logs an error.

## Enable audit logging

### Using `config.toml`

Add the following to the gateway controller's `config.toml` and restart the gateway controller. In the
Docker Compose distribution, the file is `configs/config.toml`, and you restart the gateway controller
with `docker compose up -d --force-recreate gateway-controller`.

```toml
[controller.audit]
enabled = true
outputs = ["stdout"]
```

Every change made through the management API now produces a record in the `audit` table and a JSON
line in the gateway controller's log.

### Using Helm

Add the following to your values file and run `helm upgrade`. The gateway controller restarts with
the new configuration.

```yaml
gateway:
  config:
    controller:
      audit:
        enabled: true
        outputs: ["stdout"]
```

To turn audit logging off again, set `enabled: false` (or `enabled = false`) and upgrade or restart.

## Configuration

### `[controller.audit]`

| Parameter    | Type             | Default   | Description                                                                                                |
| ------------ | ---------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| `enabled`  | boolean          | `false` | Record changes made through the management API. While `false`, nothing is recorded.                      |
| `mask_pii` | boolean          | `false` | Show `****` instead of the user in the output lines. The `audit` table always keeps the user.          |
| `outputs`  | array of strings | `[]`    | Where to send each record in addition to the `audit` table: any of `"stdout"`, `"file"`, `"http"`. |

The `file` and `http` outputs have their own settings, described in
[The `file` output](#the-file-output) and [The `http` output](#the-http-output).

## The audit record

Each output receives one JSON line per change:

```json
{
  "time": "2026-11-05T06:46:57.126787Z",
  "logType": "audit",
  "id": "18d3226b-7f3b-4a19-836c-273382b8c253",
  "gatewayId": "platform-gateway-id",
  "correlationId": "7841bfa3-c792-49d5-b3a4-11c01eaa5940",
  "action": "CREATE",
  "resourceType": "rest_api",
  "resourceId": "01a1aa75-eb65-7c5d-9a1e-3f0c2b7d8e41",
  "resourceName": "weather-api-v1.0",
  "outcome": "succeeded",
  "performedBy": "admin"
}
```

| Field             | Description                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `time`          | When the change was made, in UTC.                                                                                                                                |
| `logType`       | Always `"audit"`. Use it to route audit lines separately from other logs.                                                                                      |
| `id`            | Unique id of the record.                                                                                                                                         |
| `gatewayId`     | The gateway where the change was made.                                                                                                                           |
| `correlationId` | The correlation ID of the request. If the client sent an `X-Correlation-ID` header, this is its value, so you can trace a change back to the client's request. |
| `action`        | `CREATE`, `UPDATE`, `DELETE`, or `REVOKE`.                                                                                                               |
| `resourceType`  | The kind of resource changed. See [What is recorded](#what-is-recorded).                                                                                          |
| `resourceId`    | The id of the resource.                                                                                                                                          |
| `resourceName`  | The name (handle) of the resource. Empty for subscriptions, and for deleted subscription plans.                                                                  |
| `outcome`       | `succeeded` or `failed`.                                                                                                                                     |
| `performedBy`   | The user who made the change: the basic-auth username, or the subject (`sub`) of the access token.                                                             |

The same line is sent to every output you configure.

### The `audit` table

The gateway controller creates the table when it starts, on both SQLite and PostgreSQL, so there is no
database script to run. The table holds the same information as the JSON line:

| Column             | Holds                                                    |
| ------------------ | -------------------------------------------------------- |
| `uuid`           | `id`                                                   |
| `gateway_id`     | `gatewayId`                                            |
| `correlation_id` | `correlationId`                                        |
| `action`         | `action`                                               |
| `resource_uuid`  | `resourceId`                                           |
| `resource_name`  | `resourceName`                                         |
| `resource_type`  | `resourceType`                                         |
| `outcome`        | `outcome`                                              |
| `performed_by`   | The user — never masked, even with `mask_pii = true`. |
| `performed_at`   | `time`                                                 |

## The `file` output

Writes each record to a log file, rotating it when it reaches a size limit.

```toml
[controller.audit]
enabled = true
outputs = ["file"]

[controller.audit.file]
path = "/app/data/logs/audit.log"
max_size_mb = 100
```

| Parameter       | Type   | Default | Description                                                                 |
| --------------- | ------ | ------- | --------------------------------------------------------------------------- |
| `path`        | string | `""`  | **Required** when you use this output. Absolute path of the log file. |
| `max_size_mb` | int    | `100` | When the file reaches this size, it is rotated. `0` turns rotation off.   |

**Rotation.** When the file reaches `max_size_mb`, it is renamed to `<path>.1` (replacing the previous
`.1` file) and a new file is started, so at most twice `max_size_mb` is on disk. Use `max_size_mb` for
rotation; don't rotate the file with an external tool such as logrotate.

**Permissions.** The gateway creates the file readable by its own user only (`0600`), and creates any
missing directories so that only its own user can open them (`0700`). If the file already exists and
other users can read it, the gateway controller won't start; run `chmod 600 <path>` and restart.

!!! warning "One gateway per file"
    Each gateway controller must write to its own file. If you run several replicas, give each one its
    own volume. Replicas sharing a file (on a shared volume or NFS) lose records.

## The `http` output

Sends records to a log receiver in batches, as newline-delimited JSON (one record per line). Splunk
HEC's `/services/collector/raw` endpoint and Vector accept this format as-is. For Fluent Bit's HTTP
input, set `content_type = "application/json"`. To send records to Elasticsearch or OpenSearch, route
them through one of these collectors.

### Endpoint

| Parameter                    | Type    | Default                    | Description                                                                                                                               |
| ---------------------------- | ------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint`                 | string  | `""`                     | **Required** when you use this output. URL that each batch is sent to.                                                              |
| `content_type`             | string  | `"application/x-ndjson"` | `Content-Type` header sent with each batch.                                                                                             |
| `allow_insecure_transport` | boolean | `false`                  | Allow a plain `http://` endpoint. Without it, the endpoint must use `https://`. Use only for a trusted collector on the same network. |

### Batching

A batch is sent as soon as any of these limits is reached:

| Parameter            | Type     | Default     | Description                                                                                                                        |
| -------------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `batch_max_events` | int      | `100`     | Maximum records per batch.                                                                                                         |
| `batch_max_bytes`  | int      | `1048576` | Maximum size of a batch, in bytes.                                                                                                 |
| `flush_interval`   | duration | `"5s"`    | Maximum time a record waits before its batch is sent.                                                                              |
| `queue_capacity`   | int      | `10000`   | Records waiting to be sent. When the queue is full, new records are not sent to the receiver (they remain in the `audit` table). |

### Retries

| Parameter           | Type     | Default   | Description                                                                             |
| ------------------- | -------- | --------- | --------------------------------------------------------------------------------------- |
| `request_timeout` | duration | `"10s"` | Time allowed for each attempt to send a batch.                                          |
| `max_retries`     | int      | `3`     | Number of retries after a failed attempt. `0` turns retries off.                      |
| `retry_backoff`   | duration | `"1s"`  | Base delay between retries; each later retry waits about twice as long. At most `1h`. |

The gateway retries when the receiver can't be reached, returns a `5xx` error, or returns `429 Too Many Requests` (respecting its `Retry-After` header). Other errors, such as `400` or `401`, are not retried,
because sending the same batch again would fail the same way.

Batches that can't be delivered are dropped from this output but remain in the `audit` table. When the
gateway controller shuts down, it sends any queued records first (for up to 5 seconds).

### Authentication

Set `type` to choose how the gateway authenticates to the receiver:

| `type`             | Header sent                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `"none"` (default) | No authentication header.                                                                            |
| `"bearer"`         | `Authorization: Bearer <token>`                                                                    |
| `"basic"`          | `Authorization: Basic <username:password, Base64-encoded>`                                         |
| `"header"`         | `<name>: <value>` — any header your receiver needs, for example `Authorization: Splunk <token>` |

Set the type and any non-secret fields in `config.toml`, and set the secret through an environment
variable on the gateway controller, which takes precedence over `config.toml`:

| Variable                                              | Use it for                                 |
| ----------------------------------------------------- | ------------------------------------------ |
| `APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_BEARER_TOKEN`   | The token, with `type = "bearer"`        |
| `APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_BASIC_USERNAME` | The username, with `type = "basic"`      |
| `APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_BASIC_PASSWORD` | The password, with `type = "basic"`      |
| `APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_HEADER_VALUE`   | The header value, with `type = "header"` |

!!! warning
    Don't put credentials in `config.toml`. Set them through these environment variables, for example
    from a Kubernetes `Secret`. The gateway never writes the credential to its logs.

With Docker Compose, add the variable to the gateway controller's `environment:` list in
`docker-compose.yaml`, next to the entries already there, and take its value from your shell or from a
`.env` file beside `docker-compose.yaml`:

```yaml
services:
  gateway-controller:
    environment:
      - APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_BEARER_TOKEN=${AUDIT_HTTP_TOKEN:-}
```

```sh
AUDIT_HTTP_TOKEN=<token> docker compose up -d --force-recreate gateway-controller
```

On Kubernetes, set it from a `Secret`, as shown in [Kubernetes (Helm)](#kubernetes-helm).

=== "Bearer token"

    ```toml
    [controller.audit]
    enabled = true
    outputs = ["http"]

    [controller.audit.http]
    endpoint = "https://logs.example.com/ingest"

    [controller.audit.http.auth]
    type = "bearer"
    # token: set APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_BEARER_TOKEN
    ```

=== "Splunk HEC"

    ```toml
    [controller.audit]
    enabled = true
    outputs = ["http"]

    [controller.audit.http]
    endpoint = "https://splunk.example.com:8088/services/collector/raw?sourcetype=wso2:gateway:audit"

    [controller.audit.http.auth]
    type = "header"

    [controller.audit.http.auth.header]
    name = "Authorization"
    # value: set APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_HEADER_VALUE to "Splunk <HEC token>"
    ```

=== "Basic"

    ```toml
    [controller.audit]
    enabled = true
    outputs = ["http"]

    [controller.audit.http]
    endpoint = "https://vector.example.com:8080/gateway-audit"

    [controller.audit.http.auth]
    type = "basic"

    [controller.audit.http.auth.basic]
    username = "gateway"
    # password: set APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_BASIC_PASSWORD
    ```

=== "Fluent Bit (no auth)"

    ```toml
    [controller.audit]
    enabled = true
    outputs = ["http"]

    [controller.audit.http]
    endpoint = "http://fluent-bit.logging.svc:9880/gateway-audit"
    allow_insecure_transport = true
    content_type = "application/json"
    ```

### TLS and mTLS

For an `https://` endpoint, configure how the gateway verifies the receiver and, for mutual TLS, which
client certificate it presents:

| Parameter                | Type    | Default   | Description                                                                                    |
| ------------------------ | ------- | --------- | ---------------------------------------------------------------------------------------------- |
| `ca_file`              | string  | `""`    | CA certificate (PEM) used to verify the receiver. Leave empty to use the system's trusted CAs. |
| `cert_file`            | string  | `""`    | Client certificate (PEM), for mutual TLS. Set together with `key_file`.                      |
| `key_file`             | string  | `""`    | Client private key (PEM), for mutual TLS. Set together with `cert_file`.                     |
| `insecure_skip_verify` | boolean | `false` | Don't verify the receiver's certificate. For testing only; the gateway logs a warning.         |

```toml
[controller.audit.http]
endpoint = "https://collector.example.com:8443/ingest"

[controller.audit.http.auth]
type = "none"   # the client certificate authenticates the gateway

[controller.audit.http.tls]
ca_file   = "/etc/gateway-controller/audit/collector-ca.pem"
cert_file = "/etc/gateway-controller/audit/client.pem"
key_file  = "/etc/gateway-controller/audit/client.key"
```

You can use mutual TLS together with an authentication `type`; the gateway then sends both.

The gateway uses TLS 1.2 or 1.3, and the post-quantum hybrid key exchange `X25519MLKEM768` when the
receiver supports it. After the first successful delivery, the gateway controller log shows the TLS
version and key exchange in use (`Audit HTTP output connected`).

## Kubernetes (Helm)

Configure audit logging under `gateway.config.controller.audit` in your values file. Set credentials
from a `Secret` through `gateway.controller.deployment.extraEnv`.

```yaml
gateway:
  controller:
    deployment:
      extraEnv:
        - name: APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_BEARER_TOKEN
          valueFrom:
            secretKeyRef:
              name: audit-http-token
              key: token
  config:
    controller:
      audit:
        enabled: true
        outputs: ["stdout", "file", "http"]
        file:
          path: /var/log/wso2/audit/audit.log
        http:
          endpoint: https://logs.example.com/ingest
          auth:
            type: bearer
```

Create the `Secret` first:

```sh
kubectl create secret generic audit-http-token --from-literal=token=<token>
```

!!! warning "Credentials in values are refused"
    The chart stops with an error if you set `auth.bearer.token`, `auth.basic.password`, or
    `auth.header.value` in your values file, because the gateway configuration is stored in a
    ConfigMap that isn't encrypted. Use `extraEnv` as shown above.

### Storage for the `file` output

When the `file` output is on, the chart adds a volume for the audit log to the gateway controller pod,
mounted at `/var/log/wso2`. Your `file.path` must be under that directory. The volume is separate from
the gateway's database storage, so the audit log can't fill it.

| Value                                           | Default           | Description                                                                                                                                                                 |
| ----------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gateway.controller.auditLogVolume.mountPath` | `/var/log/wso2` | Where the volume is mounted. `file.path` must be under it.                                                                                                                |
| `gateway.controller.auditLogVolume.sizeLimit` | `512Mi`         | Size limit of the volume. Keep it above twice `max_size_mb`; Kubernetes evicts the pod if the limit is exceeded.                                                          |
| `gateway.controller.auditLogVolume.enabled`   | automatic         | The volume is added automatically when you use the `file` output. Set `false` only if you mount your own volume through `gateway.controller.deployment.extraVolumes`. |

!!! note
    This volume is emptied when the pod is replaced. To keep the audit log, collect the file with a
    log shipper, or also use the `stdout` or `http` output. The `audit` table keeps every record
    regardless.

## Monitoring

If records can't be saved or sent, the gateway controller logs one of the following messages (at most
once every 30 seconds for each output). The change itself is never affected.

| Message                                                   | What it means                                                                                                                                 | What to do                                                                      |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Failed to save audit record`                           | The record couldn't be saved to the `audit` table. It was still sent to the outputs.                                                        | Check the gateway's database.                                                   |
| `Failed to deliver audit records; dropping them`        | A batch couldn't be delivered after all retries, or the receiver rejected it. The message includes the reason (for example, the HTTP status). | Check the endpoint, credentials, and TLS settings, and that the receiver is up. |
| `Audit HTTP output queue is full; dropping the record`  | Records are produced faster than the receiver accepts them.                                                                                   | Increase `queue_capacity` or `batch_max_events`, or scale the receiver.     |
| `Failed to write audit record to the file; dropping it` | The log file couldn't be written (for example, the disk is full).                                                                             | Check the volume's free space and permissions.                                  |
| `Failed to rotate the audit log file; ...`              | The file couldn't be rotated, usually because the directory is read-only.                                                                     | Make the log directory writable.                                                |

## Troubleshooting

| Symptom                                                                                                         | Cause                                                                                              | Fix                                                                                                       |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| The gateway controller doesn't start: `controller.audit.outputs: unknown output`                              | A name in `outputs` is misspelled.                                                               | Use only `stdout`, `file`, and `http`.                                                              |
| The gateway controller doesn't start: `path is required when the "file" output is selected`                   | The `file` output is on, but `file.path` isn't set.                                            | Set `file.path` to an absolute path.                                                                    |
| The gateway controller doesn't start: `has permissions 0644, which allow group/other access`                  | The audit log file already exists and other users can read it.                                     | Run `chmod 600 <path>` and restart.                                                                     |
| The gateway controller doesn't start: `endpoint uses plaintext http:// but allow_insecure_transport is false` | The endpoint uses `http://`.                                                                     | Use `https://`, or set `allow_insecure_transport = true` for a trusted collector on the same network. |
| The gateway controller doesn't start: `bearer.token is required when type is "bearer"`                        | The credential isn't set.                                                                          | Set `APIP_GW_CONTROLLER_AUDIT_HTTP_AUTH_BEARER_TOKEN` (or the variable for your `type`).              |
| The gateway controller doesn't start: `failed to read CA bundle` or `failed to load client certificate`     | A TLS file is missing or invalid, or the certificate and key don't match.                          | Check the paths in `[controller.audit.http.tls]` and the files.                                         |
| `helm upgrade` fails: `would be written in plaintext into the gateway ConfigMap`                            | A credential is set in the values file.                                                            | Remove it and set it through `extraEnv`, as shown in [Kubernetes (Helm)](#kubernetes-helm).              |
| `helm upgrade` fails: `is not under gateway.controller.auditLogVolume.mountPath`                            | `file.path` is outside the audit log volume.                                                     | Move `file.path` under `/var/log/wso2` (or your `mountPath`).                                       |
| No records at all                                                                                               | `enabled` is `false`, the change was made from the control plane, or the gateway is immutable. | Check `enabled`. Changes made from the control plane are recorded by the control plane.                 |
| Records are in the `audit` table but not in the logs                                                          | `outputs` is empty.                                                                              | Add `stdout`, `file`, or `http` to `outputs`.                                                     |
| `performedBy` shows `****`                                                                                  | `mask_pii = true`.                                                                               | Expected. The `audit` table keeps the user.                                                             |
| The receiver gets the same record twice                                                                         | A batch was resent after a lost response.                                                          | Deduplicate on `id`.                                                                                    |
