---
title: "Configure Audit Logging"
description: "Record who changed what through the gateway's management API, and send audit records to your log pipeline."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/audit-logging/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/audit-logging.md
tags:
  - api-gateway
  - observability
  - audit
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-12
content_type: "how-to"
---

{% raw %}
# Audit Logging

Audit logging records the changes made through the gateway's management API. Each record shows who made the change, what changed, when, and whether the change was applied. The gateway sends every record to your log pipeline.

## Enable audit logging

### Using `config.toml`

Add the following to the gateway controller's `config.toml`. In the Docker Compose distribution, this file is `configs/config.toml`.

```toml
[controller.audit]
enabled = true
outputs = ["stdout"]
```

Then recreate the gateway controller:

```sh
docker compose up -d --force-recreate gateway-controller
```

### Using Helm

Add the following to your values file and run `helm upgrade`:

```yaml
gateway:
  config:
    controller:
      audit:
        enabled: true
        outputs: ["stdout"]
```

From now on, each change made through the management API appears as a JSON line in the gateway controller's log.

## Configuration

Set these parameters under `[controller.audit]` in `config.toml`, or under `gateway.config.controller.audit` in your Helm values.

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enabled` | `false` | Records changes made through the management API. |
| `outputs` | `[]` | Where to send each record. Set at least one when `enabled` is `true`. Use any of these:<br>`"stdout"`: the gateway controller's container log<br>`"file"`: a log file. See [Send records to a file](#send-records-to-a-file).<br>`"http"`: your log receiver. See [Send records to a log receiver](#send-records-to-a-log-receiver). |
| `mask_sensitive_fields` | `false` | Shows `****` in place of the user in the outputs. |

Audit logging never blocks a change. If a record can't be sent, the change still goes ahead and the gateway controller logs an error.

## What is recorded

A record is written for each change made through the management API:

| Resource | `resourceType` | Actions |
|----------|----------------|---------|
| REST APIs | `rest_api` | `CREATE`, `UPDATE`, `DELETE` |
| GraphQL APIs | `graphql_api` | `CREATE`, `UPDATE`, `DELETE` |
| API keys | `api_key` | `CREATE`, `UPDATE`, `REVOKE` |
| Subscriptions | `subscription` | `CREATE`, `UPDATE`, `DELETE` |
| Subscription plans | `subscription_plan` | `CREATE`, `UPDATE`, `DELETE` |
| Certificates | `certificate` | `CREATE`, `UPDATE`, `DELETE` |
| MCP proxies | `mcp_proxy` | `CREATE`, `UPDATE`, `DELETE` |
| LLM providers | `llm_provider` | `CREATE`, `UPDATE`, `DELETE` |
| LLM proxies | `llm_proxy` | `CREATE`, `UPDATE`, `DELETE` |
| LLM provider templates | `llm_provider_template` | `CREATE`, `UPDATE`, `DELETE` |
| Agents | `agent` | `CREATE`, `UPDATE`, `DELETE` |

Viewing a resource isn't recorded. Changes pushed to the gateway from the control plane are recorded by the control plane, not by the gateway.

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

| Field | Description |
|-------|-------------|
| `time` | When the change was made, in UTC. |
| `logType` | Always `"audit"`. Use it to route audit lines separately from other log lines. |
| `id` | Unique ID of the record. |
| `gatewayId` | The gateway where the change was made. |
| `correlationId` | The request's correlation ID. If the client sent an `X-Correlation-ID` header, this is its value. |
| `action` | What was done. See [What is recorded](#what-is-recorded). |
| `resourceType` | The kind of resource that changed. |
| `resourceId` | The ID of the resource. |
| `resourceName` | The name of the resource. Empty for subscriptions and for deleted subscription plans. |
| `outcome` | `succeeded`, or `failed` if the gateway accepted the change but couldn't save it. |
| `performedBy` | The user who made the change. |

## Send records to a file

```toml
[controller.audit]
enabled = true
outputs = ["file"]

[controller.audit.file]
path = "/app/data/logs/audit.log"
max_size_mb = 100
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `path` | — | **Required.** Absolute path of the log file. |
| `max_size_mb` | `100` | When the file reaches this size, the gateway renames it to `<path>.1` and starts a new file. |

On Kubernetes, the path must be under `/var/log/wso2`, as described in [Kubernetes (Helm)](#kubernetes-helm).

If you run more than one gateway controller replica, give each replica its own file.

## Send records to a log receiver

The gateway sends records in batches, as newline-delimited JSON, and retries batches that fail. This format works as it is with Splunk HTTP Event Collector (HEC) on its `/services/collector/raw` endpoint and with Vector. For the Fluent Bit HTTP input, set `content_type` to `"application/json"`.

Don't write a credential into `config.toml`. Reference an environment variable with a `{{ env "NAME" "" }}` token instead. Include the empty default (`""`): the gateway runtime reads the same `config.toml` and doesn't start if a token without a default can't be resolved. For the same reason, don't use `{{ file }}` tokens here.

With Docker Compose, add the variable to `api-platform.env`, then recreate the gateway controller. If you run `setup.sh --force` later, add the variable again, because the script rewrites this file.

```sh
echo 'APIP_GW_AUDIT_HTTP_TOKEN=<token>' >> api-platform.env
docker compose up -d --force-recreate gateway-controller
```

=== "Bearer token"

    ```toml
    [controller.audit]
    enabled = true
    outputs = ["http"]

    [controller.audit.http]
    endpoint = "https://logs.example.com/ingest"

    [controller.audit.http.auth]
    type = "bearer"

    [controller.audit.http.auth.bearer]
    token = '{{ env "APIP_GW_AUDIT_HTTP_TOKEN" "" }}'
    ```

=== "Splunk HEC"

    Put the whole header value in the variable, for example `APIP_GW_AUDIT_HEC_AUTH=Splunk <token>`.

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
    value = '{{ env "APIP_GW_AUDIT_HEC_AUTH" "" }}'
    ```

| Parameter | Description |
|-----------|-------------|
| `endpoint` | **Required.** The receiver's URL. It must use `https://` unless you set `allow_insecure_transport`. |
| `auth.type` | One of these:<br>`"none"`: no authentication. This is the default.<br>`"bearer"`: set `auth.bearer.token`.<br>`"basic"`: set `auth.basic.username` and `auth.basic.password`.<br>`"header"`: set `auth.header.name` and `auth.header.value`. |
| `content_type` | The `Content-Type` header sent with each batch. The default is `"application/x-ndjson"`. |
| `tls.ca_file` | A CA certificate (PEM) to verify the receiver. Leave it out to use the system's trusted CAs. |
| `tls.cert_file`, `tls.key_file` | The client certificate and key (PEM), if the receiver requires mutual TLS. |
| `allow_insecure_transport` | Set it to `true` to allow a plain `http://` endpoint. Use it only for a collector on a trusted network. |

## Kubernetes (Helm)

Store the receiver's credential in a `Secret`:

```sh
kubectl create secret generic audit-http-token --from-literal=token=<token>
```

Then pass the `Secret` to the gateway controller as an environment variable, and reference the variable with an `{{ env }}` token:

```yaml
gateway:
  controller:
    deployment:
      extraEnv:
        - name: APIP_GW_AUDIT_HTTP_TOKEN
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
            bearer:
              token: '{{ env "APIP_GW_AUDIT_HTTP_TOKEN" "" }}'
```

The chart refuses a credential written as a literal value, because the gateway configuration is stored in a ConfigMap.

For the `file` output, the chart mounts a volume at `/var/log/wso2`. The volume is emptied when the pod is replaced. To keep the file's records, collect the file with a log shipper, or also use the `stdout` or `http` output.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No records at all. | Check that `enabled` is `true`. Changes pushed from the control plane aren't recorded by the gateway. |
| The gateway controller doesn't start after you change the audit configuration. | The startup error names the setting to fix, such as a missing `file.path`, `endpoint`, or credential. |
| The gateway runtime doesn't start: `config interpolation failed`. | Add an empty default to the credential token: `{{ env "NAME" "" }}`. |
| `helm upgrade` fails with `would be written in plaintext`. | Reference the credential with an `{{ env }}` token, as shown in [Kubernetes (Helm)](#kubernetes-helm). |
| Records don't reach the log receiver. | Look for `Failed to deliver audit records` in the gateway controller log. The message includes the reason, such as the HTTP status. |

{% endraw %}
