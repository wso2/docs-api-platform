---
title: "Configure audit logging"
description: "Record who changed what in AI Workspace, and send audit records to your log pipeline."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/audit-logging/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/audit-logging.md
tags:
  - ai-workspace
  - production
  - observability
  - audit
  - security
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-12
content_type: "how-to"
---

{% raw %}
# Configure audit logging

Audit logging records the changes people make in AI Workspace. Each record shows who made the change, what changed, and when. The Platform API sends every record to your log pipeline.

!!! info "Availability"
    Audit logging is available from **update level 1.0.0.&lt;N&gt;** onwards.

## Turn on audit logging

### On VMs

Add the following to `configs/config.toml`:

```toml
[platform_api.audit]
enabled = true
outputs = ["stdout"]
```

Then recreate the Platform API container:

```bash
docker compose up -d --force-recreate platform-api
```

### On Kubernetes and OpenShift

Add the following to your values file:

```yaml
platform-api:
  config:
    audit:
      enabled: true
      outputs: ["stdout"]
```

Apply it with the same `helm upgrade --install` command you used to install the chart, as in [Deploy on Kubernetes](deploy-on-kubernetes.md#step-7-start-the-deployment).

From now on, each change made in AI Workspace appears as a JSON line in the Platform API log.

## Configuration

Set these parameters under `[platform_api.audit]` in `config.toml`, or under `platform-api.config.audit` in your Helm values.

| Parameter | Helm value | Default | Description |
|-----------|------------|---------|-------------|
| `enabled` | `enabled` | `false` | Records changes. |
| `outputs` | `outputs` | `[]` | Where to send each record. Set at least one when `enabled` is `true`. Use any of these:<br>`"stdout"`: the Platform API container log<br>`"file"`: a log file. See [Send records to a file](#send-records-to-a-file).<br>`"http"`: your log receiver. See [Send records to a log receiver](#send-records-to-a-log-receiver). |
| `mask_sensitive_fields` | `maskSensitiveFields` | `false` | Shows `****` in place of the user in the outputs. |

Audit logging never blocks a change. If a record can't be sent to an output, the change still goes ahead and the Platform API logs an error.

## What is recorded

A record is written each time one of these changes succeeds:

| Resource | `resourceType` | Actions |
|----------|----------------|---------|
| Organizations | `organization` | `CREATE` |
| Projects | `project` | `CREATE`, `UPDATE`, `DELETE` |
| AI gateways | `gateway` | `CREATE`, `UPDATE`, `DELETE` |
| Gateway tokens | `gateway_token` | `CREATE`, `REVOKE` |
| Custom gateway policies | `custom_policy` | `CREATE`, `DELETE` |
| LLM provider templates | `llm_provider_template` | `CREATE`, `UPDATE` |
| LLM providers | `llm_provider` | `CREATE`, `UPDATE`, `DELETE` |
| App LLM proxies | `llm_proxy` | `CREATE`, `UPDATE`, `DELETE` |
| MCP proxies | `mcp_proxy` | `CREATE`, `UPDATE`, `DELETE` |
| Deployments to a gateway | `deployment` | `DEPLOY`, `UNDEPLOY`, `RESTORE`, `DELETE` |
| Applications | `application` | `CREATE`, `UPDATE`, `DELETE` |
| API keys | `api_key` | `CREATE`, `UPDATE`, `REVOKE` |
| Secrets | `secret` | `CREATE`, `UPDATE` |

Viewing a resource isn't recorded.

## The audit record

Each output receives one JSON line per change:

```json
{
  "time": "2026-11-09T06:46:57.126787Z",
  "logType": "audit",
  "id": "18d3226b-7f3b-4a19-836c-273382b8c253",
  "action": "CREATE",
  "resourceType": "llm_provider",
  "resourceId": "01a1aa75-eb65-7c5d-9a1e-3f0c2b7d8e41",
  "organizationId": "7f4a2c9e-1b3d-4e5f-8a6b-9c0d1e2f3a4b",
  "outcome": "succeeded",
  "performedBy": "alice@example.com"
}
```

| Field | Description |
|-------|-------------|
| `time` | When the change was made, in UTC. |
| `logType` | Always `"audit"`. Use it to route audit lines separately from other log lines. |
| `id` | Unique ID of the record. |
| `action` | What was done. See [What is recorded](#what-is-recorded). |
| `resourceType` | The kind of resource that changed. |
| `resourceId` | The ID of the resource. |
| `organizationId` | The ID of the organization the resource belongs to. |
| `outcome` | Always `succeeded`: a record is written only after the change succeeds. |
| `performedBy` | The user who made the change. Shows `deleted_user` if that user has since been deleted. |

## Send records to a file

```toml
[platform_api.audit]
enabled = true
outputs = ["file"]

[platform_api.audit.file]
path = "/app/data/logs/audit.log"
max_size_mb = 100
```

| Parameter | Helm value | Default | Description |
|-----------|------------|---------|-------------|
| `path` | `file.path` | — | **Required.** Absolute path of the log file. |
| `max_size_mb` | `file.maxSizeMb` | `100` | When the file reaches this size, the Platform API renames it to `<path>.1` and starts a new file. |

On VMs, use a path under `/app/data` so the file is kept when the container restarts. On Kubernetes and OpenShift, the path must be under `/var/log/wso2`, as described in [Kubernetes and OpenShift](#kubernetes-and-openshift).

If you run more than one Platform API replica, give each replica its own file.

## Send records to a log receiver

The Platform API sends records in batches, as newline-delimited JSON, and retries batches that fail. This format works as it is with Splunk HTTP Event Collector (HEC) on its `/services/collector/raw` endpoint and with Vector. For the Fluent Bit HTTP input, set `content_type` to `"application/json"`.

Don't write a credential into `config.toml`. Store it in a file and reference it with a `{{ file }}` token, as described in [Configuration and environment interpolation](../setting-up/configuration.md). On VMs, mount the file read-only under `/secrets/platform-api`:

```yaml
services:
  platform-api:
    volumes:
      - ./secrets/audit_http_token:/secrets/platform-api/audit_http_token:ro
```

=== "Bearer token"

    ```toml
    [platform_api.audit]
    enabled = true
    outputs = ["http"]

    [platform_api.audit.http]
    endpoint = "https://logs.example.com/ingest"

    [platform_api.audit.http.auth]
    type = "bearer"

    [platform_api.audit.http.auth.bearer]
    token = '{{ file "/secrets/platform-api/audit_http_token" }}'
    ```

=== "Splunk HEC"

    ```toml
    [platform_api.audit]
    enabled = true
    outputs = ["http"]

    [platform_api.audit.http]
    endpoint = "https://splunk.example.com:8088/services/collector/raw?sourcetype=wso2:platform-api:audit"

    [platform_api.audit.http.auth]
    type = "header"

    [platform_api.audit.http.auth.header]
    name = "Authorization"
    value = 'Splunk {{ file "/secrets/platform-api/audit_hec_token" }}'
    ```

| Parameter | Helm value | Description |
|-----------|------------|-------------|
| `endpoint` | `http.endpoint` | **Required.** The receiver's URL. It must use `https://` unless you set `allow_insecure_transport`. |
| `auth.type` | `http.auth.type` | One of these:<br>`"none"`: no authentication. This is the default.<br>`"bearer"`: set `auth.bearer.token`.<br>`"basic"`: set `auth.basic.username` and `auth.basic.password`.<br>`"header"`: set `auth.header.name` and `auth.header.value`. |
| `content_type` | `http.contentType` | The `Content-Type` header sent with each batch. The default is `"application/x-ndjson"`. |
| `tls.ca_file` | `http.tls.caFile` | A CA certificate (PEM) to verify the receiver. Leave it out to use the system's trusted CAs. |
| `tls.cert_file`, `tls.key_file` | `http.tls.certFile`, `http.tls.keyFile` | The client certificate and key (PEM), if the receiver requires mutual TLS. |
| `allow_insecure_transport` | `http.allowInsecureTransport` | Set it to `true` to allow a plain `http://` endpoint. Use it only for a collector on a trusted network. |

## Kubernetes and OpenShift

Store the receiver's credential in a `Secret`:

```bash
kubectl -n <namespace> create secret generic platform-api-audit-http-token \
  --from-literal=token=<token>
```

Then pass the `Secret` to the Platform API as an environment variable, and reference the variable with an `{{ env }}` token:

```yaml
platform-api:
  deployment:
    extraEnv:
      - name: APIP_CP_AUDIT_HTTP_TOKEN
        valueFrom:
          secretKeyRef:
            name: platform-api-audit-http-token
            key: token
  config:
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
            token: '{{ env "APIP_CP_AUDIT_HTTP_TOKEN" }}'
```

The chart refuses a credential written as a literal value, because the Platform API configuration is stored in a ConfigMap.

For the `file` output, the chart mounts a volume at `/var/log/wso2`. Each pod has its own volume, and the volume is emptied when the pod is replaced. To keep the file's records, collect the file with a log shipper, or also use the `stdout` or `http` output.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No records at all. | Check that `enabled` is `true`. |
| The Platform API doesn't start after you change the audit configuration. | The startup error names the setting to fix, such as a missing `file.path` or `endpoint`, or a credential file that isn't mounted. |
| `helm upgrade` fails with `holds a literal value`. | Reference the credential with an `{{ env }}` token, as shown in [Kubernetes and OpenShift](#kubernetes-and-openshift). |
| Records don't reach the log receiver. | Look for `Failed to deliver audit records` in the Platform API log. The message includes the reason, such as the HTTP status. |
| `performedBy` shows `****`. | `mask_sensitive_fields` is `true`. |

## Related

- [Operate the deployment](operate.md): structured logs, health signals, and alerts for AI Workspace
- [Configuration and environment interpolation](../setting-up/configuration.md): how `{{ env }}` and `{{ file }}` tokens resolve
- [Provision secrets and keys](secrets-and-keys.md): how to create and store credentials

{% endraw %}
