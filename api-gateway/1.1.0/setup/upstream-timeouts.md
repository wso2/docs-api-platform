---
title: "Configure Upstream Timeouts"
description: "Configure the upstream TCP connection timeout in API Platform Gateway to protect against slow or unreachable backend services."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/setup/upstream-timeouts/
md_url: https://wso2.com/api-platform/docs/api-gateway/setup/upstream-timeouts.md
tags:
  - api-gateway
  - configuration
  - networking
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-17
content_type: "how-to"
---

# Gateway Upstream Timeouts

This guide explains how to configure **upstream connect timeouts** for the API Platform Gateway router so that requests to slow or unreachable backends fail within a predictable time instead of hanging indefinitely.

## Overview

When the router forwards a request to a backend service, it must first establish a TCP connection to the upstream host. The **connect timeout** controls how long the router waits for this connection to be established.

- If the backend accepts connections within the configured time, the request proceeds as normal.
- If the connection cannot be established before the timeout elapses, the router fails the request with an upstream timeout error.

This timeout acts as a **global default** for upstream connections and is a key part of the gateway’s resiliency story: it helps protect clients from slow or unreachable backends and frees up resources more quickly when backends are unhealthy.

## How the upstream connect timeout works

At a high level:

1. A client sends a request to the gateway.
2. The router selects the appropriate upstream cluster for the request.
3. The router attempts to establish a TCP connection to one of the upstream endpoints.
4. If the connection is not established within `connect_timeout_ms`, the attempt is aborted and the request fails with an upstream timeout.

This is specifically about **connection establishment time**. It is separate from any overall request/route timeouts that may control how long the router waits for responses after a connection is established.

## Configuring the global connect timeout

The global upstream connect timeout is configured in the gateway controller configuration under the `router.upstream.timeouts` block.

You can use `gateway/configs/config-template.toml` as a reference when creating your own `config.toml`.

### Example configuration (TOML)

The following example shows how to set the upstream connect timeout to 6 seconds (6000 ms):

```toml
[router]
gateway_host = "*"
listener_port = 8080
https_enabled = true
https_port = 8443

[router.upstream.timeouts]
connect_timeout_ms = 6000
```

In this example:

- `connect_timeout_ms = 6000` means the router will wait up to 6 seconds for a TCP connection to the upstream before failing the request.
- If you do not override this value, the default from the controller configuration is used (typically 5000 ms).

### Changing the value in different deployments

#### Standalone / local configuration

For local or non-Kubernetes deployments, you configure the timeout directly in `gateway/configs/config.toml` using the same structure as shown above:

```toml
[router.upstream.timeouts]
connect_timeout_ms = 5000
```

#### Kubernetes with Helm

When deploying the gateway via the Helm chart, the same setting is controlled through Helm values under the `gateway.config.router.upstream.timeouts` section.

Example Helm `values.yaml` snippet:

```yaml
gateway:
  config:
    router:
      upstream:
        timeouts:
          connect_timeout_ms: 5000
```

The chart then renders this value into the generated `config.toml` used by the gateway controller.

## Practical guidance

When tuning `connect_timeout_ms`, consider the characteristics of your backends and network:

- **Decrease the timeout** when:
  - Backends are expected to be highly available and respond quickly to connection attempts.
  - You want to fail fast when targets are unhealthy or misconfigured.
  - You want to reduce the time resources are tied up on connection attempts to non-responsive hosts.

- **Increase the timeout** when:
  - Backends sit behind slower networks or load balancers that may take longer to accept connections.
  - Backends may experience occasional cold starts or scaling events that briefly delay connection establishment.

Be cautious about setting the timeout too low—it may cause **false-positive timeouts** during short periods of backend slowness or network jitter.

## Example scenario

Consider an API whose upstream backend may take a few seconds to accept new connections during peak load. You want the gateway to:

- Allow a bit more time than the default for connections to succeed.
- Still fail requests in a bounded time when the backend is unreachable.

You can configure:

```toml
[router.upstream.timeouts]
connect_timeout_ms = 6000
```

With this configuration:

- The router gives each upstream connection attempt up to 6 seconds to succeed.
- If the backend is down or unresponsive, requests will fail after approximately 6 seconds instead of hanging indefinitely.