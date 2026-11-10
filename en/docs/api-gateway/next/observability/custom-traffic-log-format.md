---
title: "Custom traffic log format"
description: "Write each API Platform Gateway traffic log line in your own JSON layout with a template, choosing the fields, their names, their order and their units."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/custom-traffic-log-format/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/custom-traffic-log-format.md
tags:
  - api-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-10
content_type: "reference"
---

# Custom traffic log format

## Overview

By default, [Traffic Logging](traffic-logging.md) writes every request in a fixed JSON shape. A traffic log template writes each line in your own JSON layout instead.

With a template, you can:

* Choose which fields each line has, what they are called and in what order they appear.
* Group fields into nested objects that match your log platform's schema.
* Add fixed values, such as a service or environment name.
* Convert latencies to the time unit you need.

You can pass the template inline in the gateway configuration, or as a separate file.

## Configuration

The template is set in the `[traffic_logging]` section, which must have `enabled = true`. Set one of these settings, not both.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `template` | string | `""` | The template, inline in the gateway configuration. |
| `template_file` | string | `""` | Path of a file that holds the template. The file must be inside `/etc/gateway-runtime` in the gateway runtime container, and at most 1 MiB. |

When neither is set, the gateway writes the default line.

## Template format

A template is a JSON object that describes one log line.

* A value that starts with `$ctx:` is filled in from the request. The text after `$ctx:` is an expression that reads the [available variables](#available-variables).
* Any other value is written exactly as given. It can be a string, number, `true`, `false`, `null`, an object or an array.

For example, this template:

```json
{
  "time": "$ctx:request.timestamp",
  "service": "orders",
  "api": {"name": "$ctx:api.name", "version": "$ctx:api.version"},
  "http": {
    "method": "$ctx:request.method",
    "path": "$ctx:request.path",
    "status": "$ctx:response.status"
  },
  "client": "$ctx:client.ip",
  "app": "$ctx:application.name",
  "durationMs": "$ctx:convertUnit(latencies.duration, 'ms')"
}
```

writes lines such as:

```json
{"time":"2026-11-10T09:12:33.482Z","service":"orders","api":{"name":"Weather-API","version":"1.0.0"},"http":{"method":"GET","path":"/current","status":200},"client":"203.0.113.10","app":null,"durationMs":18.342}
```

Each line has the fields in the template's order. Numbers stay numbers. A field the request has no value for is written as `null`. In this example, `app` is `null` because no application was identified for the request.

## Passing the template

The gateway reads the template when it starts. After you change the template or the template file, restart the gateway.

=== "Inline"

    Set `template` to the template. A TOML multi-line string (`'''`) keeps it readable.

    ```toml
    [traffic_logging]
    enabled = true
    template = '''
    {
      "service": "orders",
      "http": {"method": "$ctx:request.method", "status": "$ctx:response.status"},
      "durationMs": "$ctx:convertUnit(latencies.duration, 'ms')"
    }
    '''
    ```

    **Helm:** Set `gateway.config.traffic_logging.template` as a YAML string. Use a `|` block, not a YAML map, so that the field order is kept.

    ```yaml
    gateway:
      config:
        traffic_logging:
          enabled: true
          template: |
            {
              "service": "orders",
              "http": {"method": "$ctx:request.method", "status": "$ctx:response.status"},
              "durationMs": "$ctx:convertUnit(latencies.duration, 'ms')"
            }
    ```

=== "File"

    1. Save the template as a JSON file, for example `traffic-log-template.json`.

    2. Mount the file into the gateway runtime container, inside `/etc/gateway-runtime`.

        **Docker Compose:** Add a volume to the `gateway-runtime` service.

        ```yaml
        services:
          gateway-runtime:
            volumes:
              - ./configs/config.toml:/etc/policy-engine/config.toml:ro
              - ./configs/traffic-log-template.json:/etc/gateway-runtime/traffic-log-template.json:ro
        ```

        **Kubernetes:** Create a ConfigMap from the file:

        ```bash
        kubectl create configmap traffic-log-template \
          --namespace <gateway-namespace> \
          --from-file=traffic-log-template.json
        ```

        Then mount it through the Helm chart's `extraVolumes` and `extraVolumeMounts` settings:

        ```yaml
        gateway:
          gatewayRuntime:
            deployment:
              extraVolumes:
                - name: traffic-log-template
                  configMap:
                    name: traffic-log-template
              extraVolumeMounts:
                - name: traffic-log-template
                  mountPath: /etc/gateway-runtime/traffic-log
                  readOnly: true
        ```

    3. Set `template_file` to the file's path inside the container.

        ```toml
        [traffic_logging]
        enabled = true
        template_file = "/etc/gateway-runtime/traffic-log-template.json"
        ```

        **Helm:**

        ```yaml
        gateway:
          config:
            traffic_logging:
              enabled: true
              template_file: /etc/gateway-runtime/traffic-log/traffic-log-template.json
        ```

Template lines go to the same outputs (`stdout`, `file` or `http`) as default lines.

## How template lines behave

* A template replaces the default line for every request.
* `masked_headers`, `max_payload_size` and `exclude_fields` apply to template lines. In `exclude_fields`, a name is a path in your template's output, for example `http.status`.
* The template decides which headers and bodies are logged. They have a value only when the matching `[collector]` setting (`request_headers`, `response_headers`, `request_body` or `response_body`) is on.

## Available variables

Use these variables in `$ctx:` values. A variable the request has no value for is written as `null`.

### Request and response

These variables describe the request and the response sent to the client.

| Variable | Type | Description |
|---|---|---|
| `request.timestamp` | string | When the gateway received the request, in UTC. For example, `2026-11-10T09:12:33.482Z`. |
| `request.id` | string | The request's correlation ID. |
| `request.method` | string | HTTP method. |
| `request.path` | string | Request path. |
| `request.pathTemplate` | string | The API resource path that matched the request, for example `/orders/{id}`. |
| `request.header` | map | Request headers, with lower-case names. Read one with `request.header['<name>']`. Requires `collector.request_headers`. |
| `request.body` | string | Request body, cut to `max_payload_size`. Requires `collector.request_body`. |
| `response.status` | number | HTTP status code sent to the client. |
| `response.header` | map | Response headers, with lower-case names. Read one with `response.header['<name>']`. Requires `collector.response_headers`. |
| `response.body` | string | Response body, cut to `max_payload_size`. Requires `collector.response_body`. |

Header values in `masked_headers` are written as `****`.

### API and backend

These variables describe the API that handled the request and the backend it called.

| Variable | Type | Description |
|---|---|---|
| `api.id` | string | API ID. |
| `api.name` | string | API name. |
| `api.version` | string | API version. |
| `api.context` | string | API context. |
| `api.kind` | string | API kind. |
| `project.id` | string | Project ID. |
| `target.statusCode` | number | Status code returned by the backend. |
| `target.destination` | string | Backend URL the request was sent to. |

### Client and application

These variables describe the caller.

| Variable | Type | Description |
|---|---|---|
| `client.ip` | string | Client IP address. |
| `client.userAgent` | string | Client user agent. |
| `application.id` | string | ID of the application identified for the request. |
| `application.name` | string | Application name. |
| `application.owner` | string | Application owner. |
| `application.keyType` | string | Application key type. |

### Authentication

These variables describe the authenticated caller and the token.

| Variable | Type | Description |
|---|---|---|
| `auth.authenticated` | true/false | Whether the request was authenticated. |
| `auth.authorized` | true/false | Whether the request was authorized. |
| `auth.subject` | string | Authenticated subject. |
| `auth.type` | string | Authentication type. |
| `auth.issuer` | string | Token issuer. |
| `auth.credential_id` | string | Credential ID. |
| `auth.token_id` | string | Token ID. |
| `auth.audience` | list | Token audiences. |
| `auth.scopes` | list | Granted scopes. |
| `auth.property` | map | Token claims. Read one with `auth.property['<claim>']`. |

### Errors

These variables have a value only when the request failed.

| Variable | Type | Description |
|---|---|---|
| `error.category` | string | Error category, for example `AUTH`. |
| `error.errorCode` | number | Error code. |
| `error.errorMessage` | string | Error classification, for example `AUTHENTICATION_FAILURE`. |
| `error.wso2ErrorCode` | number | WSO2 fault code. |
| `error.type` | string | Type of failure, for example `authentication` or `guardrail`. |
| `error.direction` | string | Whether the request or the response was rejected. |
| `error.summary` | string | Message sent to the client. |
| `error.policy` | string | Policy that caused the error. |
| `error.policyPhase` | string | Phase in which that policy ran. |
| `error.source` | string | What produced the response, for example `gateway` or `backend`. |
| `error.originalStatus` | number | Backend status code before a policy changed it. |
| `error.jsonRpcCode` | number | JSON-RPC error code, for MCP requests. |
| `error.guardrail.name` | string | Guardrail that intervened. |
| `error.guardrail.action` | string | Action the guardrail took. |
| `error.guardrail.reason` | string | Reason the guardrail gave. |

### Latencies

Latencies are in microseconds.

| Variable | Type | Description |
|---|---|---|
| `latencies.duration` | number | Total time to handle the request. |
| `latencies.backendLatency` | number | Time spent waiting for the backend. |
| `latencies.requestMediationLatency` | number | Time spent processing the request in the gateway. |
| `latencies.responseMediationLatency` | number | Time spent processing the response in the gateway. |

To write a latency in another unit, use `convertUnit(<latency>, '<unit>')`. The unit is one of `'ns'`, `'us'`, `'ms'` or `'s'`.

```json
{"durationMs": "$ctx:convertUnit(latencies.duration, 'ms')"}
```

### Metadata

This variable holds values that policies share for the request.

| Variable | Type | Description |
|---|---|---|
| `metadata` | map | Values that policies share for the request. Read one with `metadata['<key>']`. |

!!! note
    `metadata` values are logged as the policies set them. Reference only keys whose values are safe to log.

### Expression examples

The following expressions cover common needs.

| To write | Use |
|---|---|
| One header | `"$ctx:request.header['x-request-id']"` |
| One claim | `"$ctx:auth.property['tenant']"` |
| All claims, as an object | `"$ctx:auth.property"` |
| A default value when there is none | `"$ctx:auth.authenticated ? auth.subject : 'anonymous'"` |
| Text combined with a value | `"$ctx:'v' + api.version"` |

## Troubleshooting

If the log lines aren't what you expect, check the following.

| Symptom | What to do |
|---|---|
| The gateway does not start, and the error names `template` or `template_file`. | Fix the problem the error describes, such as invalid JSON, a file that cannot be read, or both settings set. Then restart the gateway. |
| A field is always `null`, and a warning at startup names the field. | Fix the `$ctx:` expression the warning describes, for example a misspelled variable. |
| A header or body field is always `null`. | Turn on the matching `[collector]` setting. |
| A warning at startup says an `exclude_fields` entry matches no field. | Change the entry to a path in your template's output. |
| Lines still look like the default line. | Check that `traffic_logging.enabled` is `true` and that `template` or `template_file` is spelled correctly. |
