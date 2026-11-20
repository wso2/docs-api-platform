---
title: "Custom traffic log format"
description: "Write each API Platform Gateway traffic log line in your own JSON layout with a template, choosing the fields, their names, their order and their units."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/custom-log-format/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/traffic-logging/custom-log-format.md
tags:
  - api-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "reference"
---

# Custom traffic log format

## Overview

By default, [Traffic Logging](overview.md) writes every request in a fixed JSON shape. A traffic log template writes each line in your own JSON layout instead.

With a template, you can:

* Choose which fields each line has, what they are called and in what order they appear.
* Group fields into nested objects that match your log platform's schema.
* Add fixed values, such as a service or environment name.
* Convert latencies to the time unit you need.

You set the template inline in the gateway configuration.

## Configuration

The template is set in the `[traffic_logging]` section, which must have `enabled = true`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `template` | string | `""` | The template, inline in the gateway configuration. |

When `template` is empty, the gateway writes the default line.

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

The gateway reads the template when it starts. After you change the template, restart the gateway.

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

Template lines go to the same outputs (`stdout`, `file` or `http`) as default lines.

## How template lines behave

* A template replaces the default line for every request.
* `masked_headers`, `max_payload_size` and `exclude_fields` apply to template lines. In `exclude_fields`, a name is a path in your template's output, for example `http.status`.
* The template decides which headers and bodies are logged. They have a value only when the matching `[collector]` setting (`request_headers`, `response_headers`, `request_body` or `response_body`) is on.

## Available variables

Use `$ctx:` values to read the request, the API, the caller, latencies and more. For the full list, see [Variable Reference](variable-reference.md).

For example, this template reads variables from several groups:

```toml
[collector]
request_headers = true

[traffic_logging]
enabled = true
template = '''
{
  "time": "$ctx:request.timestamp",
  "api": "$ctx:api.name",
  "method": "$ctx:request.method",
  "status": "$ctx:response.status",
  "user": "$ctx:auth.subject",
  "tenant": "$ctx:auth.property['tenant']",
  "tier": "$ctx:metadata['customer_tier']",
  "requestId": "$ctx:request.header['x-request-id']",
  "durationMs": "$ctx:convertUnit(latencies.duration, 'ms')"
}
'''
```

It writes lines such as:

```json
{"time":"2026-11-10T09:12:33.482Z","api":"Weather-API","method":"GET","status":200,"user":"alice","tenant":"acme","tier":"gold","requestId":"req-7781","durationMs":18.342}
```

* `user` and `tenant` read the authenticated caller and a claim from the caller's token.
* `tier` reads a value that a policy shared in `metadata`.
* `requestId` reads a request header, so `collector.request_headers` is on.

## Troubleshooting

If the log lines aren't what you expect, check the following.

| Symptom | What to do |
|---|---|
| The gateway does not start, and the error names `template`. | Fix the problem the error describes, such as invalid JSON. Then restart the gateway. |
| A field is always `null`, and a warning at startup names the field. | Fix the `$ctx:` expression the warning describes, for example a misspelled variable. |
| A header or body field is always `null`. | Turn on the matching `[collector]` setting. |
| A warning at startup says an `exclude_fields` entry matches no field. | Change the entry to a path in your template's output. |
| Lines still look like the default line. | Check that `traffic_logging.enabled` is `true` and that `template` is spelled correctly. |