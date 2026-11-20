---
title: "Router Access Logs"
description: "Turn API Platform Gateway router access logs on or off, write them as text or JSON lines, and choose the fields each line includes."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/access-logs/
md_url: https://wso2.com/api-platform/docs/api-gateway/next/observability/access-logs.md
tags:
  - api-gateway
  - observability
  - logging
author: WSO2 API Platform Documentation Team
last_updated: 2026-11-18
content_type: "how-to"
---

# Router Access Logs

The router writes an access log line for every request it handles. Access logs are on by default.

* Each line records HTTP details, such as the method, path, status code, bytes sent and received, and timings.
* Lines are written to the router's standard output (stdout), with the other gateway logs. To collect them in one place, see [Centralized Logging](logging.md).

## Configuration

Router access logs are set in the `[router.access_logs]` section.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Write an access log line for every request. |
| `format` | string | `"text"` | `"text"` or `"json"`. |
| `text_format` | string | The [default text line](#default-text-line) | The layout of each line when `format` is `"text"`. It replaces the default layout. |
| `json_fields` | table | The [default JSON fields](#default-json-fields) | The fields of each line when `format` is `"json"`. They are added to the default fields. |

`text_format` and `json_fields` values use Envoy command operators, such as `%RESPONSE_CODE%`. For the full list, see [Envoy access log command operators](https://www.envoyproxy.io/docs/envoy/latest/configuration/observability/access_log/usage#command-operators).

## Turn access logs off

```toml
[router.access_logs]
enabled = false
```

## Write JSON lines

JSON lines are easier for log collectors to parse.

```toml
[router.access_logs]
format = "json"
```

Each line then has the [default JSON fields](#default-json-fields).

To add a field, set it in `[router.access_logs.json_fields]`. For example, this adds the value of the `x-tenant-id` request header:

```toml
[router.access_logs.json_fields]
tenant = "%REQ(X-TENANT-ID)%"
```

To change a default field, set a field with the same name.

### Default JSON fields

Durations are in milliseconds.

| Field | Command operator | Description |
|---|---|---|
| `component` | `rtr` | Marks the line as a router line. |
| `t` | `%START_TIME%` | When the request started. |
| `meth` | `%REQ(:METHOD)%` | HTTP method. |
| `path` | `%REQ(X-ENVOY-ORIGINAL-PATH?:PATH)%` | Request path as the client sent it. |
| `proto` | `%PROTOCOL%` | HTTP protocol version. |
| `respCd` | `%RESPONSE_CODE%` | Status code sent to the client. |
| `respFlg` | `%RESPONSE_FLAGS%` | Envoy response flags, which give more detail about the response or connection. |
| `respCdDtl` | `%RESPONSE_CODE_DETAILS%` | Why the response has its status code. |
| `connTrmDtl` | `%CONNECTION_TERMINATION_DETAILS%` | Why the connection was closed, when Envoy closed it. |
| `bytesRx` | `%BYTES_RECEIVED%` | Request body bytes received. |
| `bytesTx` | `%BYTES_SENT%` | Response body bytes sent. |
| `dur` | `%DURATION%` | Total time from the start of the request to the last byte of the response. |
| `reqDur` | `%REQUEST_DURATION%` | Time to receive the whole request from the client. |
| `reqTxDur` | `%REQUEST_TX_DURATION%` | Time until the whole request was sent to the backend. |
| `respDur` | `%RESPONSE_DURATION%` | Time until the first byte of the response arrived from the backend. |
| `respTxDur` | `%RESPONSE_TX_DURATION%` | Time to send the response to the client, from its first byte from the backend. |
| `upSvcT` | `%RESP(X-ENVOY-UPSTREAM-SERVICE-TIME)%` | Time the backend took, as reported in the `x-envoy-upstream-service-time` header. |
| `xff` | `%REQ(X-FORWARDED-FOR)%` | The `x-forwarded-for` request header. |
| `ua` | `%REQ(USER-AGENT)%` | The `user-agent` request header. |
| `reqId` | `%REQ(X-REQUEST-ID)%` | The `x-request-id` request header. |
| `host` | `%REQ(:AUTHORITY)%` | The host the client called. |
| `upHost` | `%UPSTREAM_HOST%` | Address of the backend the request was sent to. |
| `upProto` | `%UPSTREAM_PROTOCOL%` | HTTP protocol used with the backend. |
| `upPath` | `%REQ(:PATH)%` | Request path sent to the backend. |
| `sni` | `%REQUESTED_SERVER_NAME%` | Server name (SNI) the client requested. |
| `tlsVer` | `%DOWNSTREAM_TLS_VERSION%` | TLS version of the client connection. |
| `peerSubj` | `%DOWNSTREAM_PEER_SUBJECT%` | Subject of the client certificate. |
| `peerFp` | `%DOWNSTREAM_PEER_FINGERPRINT_256%` | SHA-256 fingerprint of the client certificate. |
| `upTlsFail` | `%UPSTREAM_TRANSPORT_FAILURE_REASON%` | Why the connection to the backend failed, for example a TLS error. |

## Change the text line

To change the layout of text lines, set `text_format`. It replaces the whole default line.

```toml
[router.access_logs]
format = "text"
text_format = """
[rtr] [%START_TIME%] "%REQ(:METHOD)% %REQ(X-ENVOY-ORIGINAL-PATH?:PATH)%" %RESPONSE_CODE% %DURATION%
"""
```

!!! tip
    Start `text_format` with `[rtr] ` so that router lines can be told apart from other gateway logs.

### Default text line

```text
[rtr] [%START_TIME%] "%REQ(:METHOD)% %REQ(X-ENVOY-ORIGINAL-PATH?:PATH)% %PROTOCOL%" %REQ(:PATH)% %UPSTREAM_PROTOCOL% %RESPONSE_CODE% %RESPONSE_FLAGS% %RESPONSE_CODE_DETAILS% %CONNECTION_TERMINATION_DETAILS% %BYTES_RECEIVED% %BYTES_SENT% %DURATION% %REQUEST_TX_DURATION% %RESPONSE_TX_DURATION% %REQUEST_DURATION% %RESPONSE_DURATION% "%REQ(X-FORWARDED-FOR)%" "%REQ(USER-AGENT)%" "%REQ(X-REQUEST-ID)%" "%REQ(:AUTHORITY)%" "%UPSTREAM_HOST%"
```

## Kubernetes (Helm)

Set router access logs under `gateway.config.router.access_logs`.

```yaml
gateway:
  config:
    router:
      access_logs:
        enabled: true
        format: json
        json_fields:
          tenant: "%REQ(X-TENANT-ID)%"
```

Set `json_fields` when `format` is `json`, and `text_format` when `format` is `text`.