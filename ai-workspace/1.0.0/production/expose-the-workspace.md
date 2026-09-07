---
title: "Expose AI Workspace"
description: "Publish AI Workspace on a public hostname with an ingress resource or a reverse proxy, expose the control plane for gateways, and keep redirect URLs and CORS consistent."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/expose-the-workspace/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/expose-the-workspace.md
tags:
  - ai-workspace
  - production
  - ingress
  - networking
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Expose AI Workspace

Two addresses leave your network in a production deployment: the workspace URL that people open in a browser, and the control plane address that AI gateways connect to. They serve different audiences, so expose them differently.

| Address | Audience | Typical exposure |
|---------|----------|------------------|
| Workspace URL, such as `https://workspace.example.com/ai-workspace` | People, through a browser | Public, or reachable from your corporate network |
| Control plane address, such as `platform-api.example.com:9243` | AI gateways | Restricted to the networks your gateways run in |

Nothing else needs an address. In the default deployment, the browser doesn't call the Platform API. The backend for frontend (BFF) proxies every call server-to-server, so the Platform API needs no public route for the interface to work. A browser application other than AI Workspace can call the Platform API directly, which needs cross-origin resource sharing (CORS). See [Leave CORS off unless you need it](#step-4-leave-cors-off-unless-you-need-it).

## The path prefix is fixed

AI Workspace serves everything under `/ai-workspace`:

| Path | Serves |
|------|--------|
| `/ai-workspace/` | The single-page application and its client-side routes |
| `/ai-workspace/api/*` | The BFF's own API, including session, login, logout, and the OIDC callback |
| `/ai-workspace/proxy/*` | The reverse proxy hop to the Platform API |
| `/healthz` | The health endpoint, at the origin root |
| `/` | A redirect to `/ai-workspace/` |

The application bundle sets the prefix at image build time, so it isn't configurable. That simplifies your routing: one rule routes the whole application with no path rewriting, and several portals can share a hostname without their routes overlapping.

!!! warning "Don't rewrite the path"
    A rule that strips `/ai-workspace` before forwarding breaks every asset request, because the bundle references its assets by absolute path. Forward the prefix as-is.

## Step 1: Publish the workspace URL

=== "Virtual machine"
    Put a reverse proxy in front of the stack and forward the prefix untouched. This nginx server block terminates TLS and proxies to the AI Workspace HTTPS listener:

    ```nginx
    server {
        listen 443 ssl;
        http2 on;
        server_name workspace.example.com;

        ssl_certificate     /etc/nginx/tls/cert.pem;
        ssl_certificate_key /etc/nginx/tls/key.pem;

        location / {
            proxy_pass https://127.0.0.1:9643;

            # Verify the upstream certificate. Drop these four lines when the
            # workspace listener serves plain HTTP instead.
            proxy_ssl_verify       on;
            proxy_ssl_trusted_certificate /etc/nginx/tls/ca.pem;
            proxy_ssl_server_name  on;
            proxy_ssl_name         workspace.example.com;

            proxy_set_header Host              $host;
            proxy_set_header X-Real-IP         $remote_addr;
            proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;

            # Server-sent events and long-running LLM calls need a generous
            # read timeout and no response buffering.
            proxy_http_version 1.1;
            proxy_buffering    off;
            proxy_read_timeout 300s;
        }
    }
    ```

    Bind the workspace listener to the loopback interface or a private network so nothing reaches port `9643` except the proxy. Publish only the proxy's port on the host firewall.

    Then set the public address, so the startup banner prints an address an operator can open:

    ```toml
    # configs/config.toml
    [ai_workspace]
    domain = "workspace.example.com"
    ```

    Set `domain` to the host, or `host:port`, that browsers use, which is the proxy's address rather than the workspace listener's. Omit the port when the proxy serves on 443. Without it, the banner falls back to the listen address, and a listener bound to a wildcard interface prints `localhost`, which nobody outside the host can open.

    The value affects the startup banner only. Redirect URLs, cookies, and CORS are configured separately, so changing `domain` doesn't repoint any of them.

=== "Kubernetes"
    The charts ship no Ingress resource, so you write one. That keeps the ingress class, annotations, and hostnames under your control.

    First switch the UI Service to `ClusterIP`, because the ingress controller becomes the entry point:

    ```yaml
    ai-workspace-ui:
      service:
        type: ClusterIP
        port: 9643
      config:
        server:
          domain: workspace.example.com
    ```

    `config.server.domain` is the host, or `host:port`, that browsers use to reach the workspace. Behind an ingress that's the ingress hostname on 443, not the Service port, so the two differ and the workspace can't infer one from the other. Set it to the ingress hostname and omit the port. Left empty, it defaults to `localhost` on the container port, and the startup banner prints an address that resolves only inside the pod.

    The value affects the startup banner only. Redirect URLs, cookies, and CORS are configured separately, so changing `config.server.domain` doesn't repoint any of them.

    Then apply an Ingress. This example uses the NGINX ingress controller, terminates TLS at the ingress with a cert-manager certificate, and forwards to the workspace's HTTPS listener:

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: ai-workspace
      namespace: <namespace>
      annotations:
        cert-manager.io/cluster-issuer: letsencrypt-production
        # The backend listener serves HTTPS. Omit this when you enable the
        # plain-HTTP listener instead.
        nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
        # Long-running LLM calls stream through this hop.
        nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
        nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    spec:
      ingressClassName: nginx
      tls:
        - hosts:
            - workspace.example.com
          secretName: ai-workspace-ingress-tls
      rules:
        - host: workspace.example.com
          http:
            paths:
              - path: /ai-workspace
                pathType: Prefix
                backend:
                  service:
                    name: <release-name>-ai-workspace-ui
                    port:
                      number: 9643
              - path: /
                pathType: Prefix
                backend:
                  service:
                    name: <release-name>-ai-workspace-ui
                    port:
                      number: 9643
    ```

    Both paths point at the same backend. The `/` rule carries the root redirect and the `/healthz` endpoint. The verification step at the end of this page calls `/healthz` on the public hostname.

    Confirm the Service name before you apply, because it carries the release name:

    ```bash
    kubectl -n <namespace> get svc
    ```

    Running more than one workspace replica needs session affinity on this Ingress. See [Run in high availability](high-availability.md).

## Step 2: Expose the control plane for gateways

A gateway connects to the Platform API directly over HTTPS and WebSocket. It doesn't go through AI Workspace, so it needs its own reachable address.

Match the exposure to where your gateways run:

- **Gateways in the same cluster or on the same host:** no external route. Gateways use the in-cluster Service address or the Compose network name.
- **Gateways elsewhere in your network:** an internal load balancer, or a private DNS name resolving to the host.
- **Gateways outside your network:** a public address restricted by source range, with the registration token as the credential.

=== "Virtual machine"
    Publish the Platform API port on an interface your gateways reach, and restrict it at the firewall to their source ranges. Then set the address the workspace shows in its gateway setup instructions:

    ```toml
    # configs/config.toml
    [ai_workspace.gateway]
    controlplane_host = "platform-api.example.com:9243"
    ```

    Put a proxy in front of it only if that proxy passes WebSocket upgrades and doesn't close idle connections. A gateway holds a long-lived connection for configuration updates.

=== "Kubernetes"
    Expose the Platform API Service through its own Ingress or load balancer, on a hostname distinct from the workspace:

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: platform-api
      namespace: <namespace>
      annotations:
        cert-manager.io/cluster-issuer: letsencrypt-production
        nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
        # Gateways hold a long-lived WebSocket connection.
        nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
        nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
        # Restrict to the networks your gateways run in.
        nginx.ingress.kubernetes.io/whitelist-source-range: "203.0.113.0/24"
    spec:
      ingressClassName: nginx
      tls:
        - hosts:
            - platform-api.example.com
          secretName: platform-api-ingress-tls
      rules:
        - host: platform-api.example.com
          http:
            paths:
              - path: /
                pathType: Prefix
                backend:
                  service:
                    name: <release-name>-platform-api
                    port:
                      number: 9243
    ```

    Then tell the workspace which address to show in its gateway setup instructions:

    ```yaml
    ai-workspace-ui:
      config:
        gateway:
          controlplaneHost: platform-api.example.com:443
    ```

    Use `443` when the ingress serves the hostname on the standard port, and `platform-api.example.com:9243` when you expose the Service port directly.

!!! note "Two keys that aren't interchangeable"
    `controlplane_host` is display-only. AI Workspace never connects to it. Instead, it substitutes the value into the setup commands it shows an administrator. A wrong value leaves the workspace working and breaks the gateway, which then can't register. The BFF's own hop uses `[ai_workspace.control_plane] url` instead. See [Two keys that aren't interchangeable](../setting-up/ports.md#two-keys-that-arent-interchangeable).

## Step 3: Match the redirect URLs to the public hostname

In OIDC mode, both redirect URLs carry the public hostname and the path prefix. They must match what you registered on the identity provider application, character for character.

=== "Virtual machine"
    ```toml
    # configs/config.toml
    [ai_workspace.auth.oidc]
    redirect_url             = "https://workspace.example.com/ai-workspace/api/auth/callback"
    post_logout_redirect_url = "https://workspace.example.com/ai-workspace/login"
    ```

=== "Kubernetes"
    ```yaml
    ai-workspace-ui:
      config:
        auth:
          oidc:
            redirectUrl: https://workspace.example.com/ai-workspace/api/auth/callback
            postLogoutRedirectUrl: https://workspace.example.com/ai-workspace/login
    ```

The callback is a BFF route, not a page in the application. Register `/ai-workspace/api/auth/callback` on the identity provider. Registering the sign-in page instead makes the code exchange fail. See [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md).

## Step 4: Leave CORS off unless you need it

The Platform API's `allowed_origins` list is empty by default, which disables cross-origin access. Because the BFF proxies browser traffic same-origin, that default is correct for a standard deployment.

Set it only when a browser application other than AI Workspace calls the Platform API directly. List the exact origins:

=== "Virtual machine"
    ```toml
    # configs/config.toml
    [platform_api.server.cors]
    allowed_origins = "https://workspace.example.com,https://portal.example.com"
    ```

=== "Kubernetes"
    ```yaml
    platform-api:
      config:
        server:
          cors:
            allowedOrigins:
              - https://workspace.example.com
              - https://portal.example.com
    ```

A wildcard is rejected at startup, so the service can't run with credentialed cross-origin access open to every origin.

## Verify

Confirm each address resolves and answers:

```bash
# The workspace, from a client network.
curl -sSI https://workspace.example.com/ai-workspace/ | head -1

# The health endpoint, which sits at the origin root.
curl -sS https://workspace.example.com/healthz

# The control plane, from a host on the same network as your gateways.
curl -sSI https://platform-api.example.com:9243/health | head -1
```

Then open the workspace in a browser and sign in. If the page loads but assets return `404`, something in the path is rewriting the prefix.

## Related

- [Change the ports AI Workspace uses](../setting-up/ports.md): moving the services off `9643` and `9243`
- [Secure traffic with TLS](tls.md): certificates for the listeners behind these routes
- [Run in high availability](high-availability.md): session affinity once you run more than one replica
- [Connect AI gateways in production](connect-gateways.md): what a gateway does with the control plane address