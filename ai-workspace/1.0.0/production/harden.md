---
title: "Harden the deployment"
description: "Close the gaps a quickstart leaves open: delegate login to an identity provider, keep authorization enforced, bound connections, and restrict what each container can do and reach."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/harden/
md_url: https://wso2.com/api-platform/docs/ai-workspace/1.0.0/production/harden.md
tags:
  - ai-workspace
  - production
  - security
  - hardening
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-06
content_type: "how-to"
---

# Harden the deployment

Certificates and secrets have their own pages. This page closes the remaining gaps between a working install and one you expose to an organization: who can sign in, what a signed-in user may do, how much a client can consume, and what a compromised container can reach.

## Step 1: Delegate login to an identity provider

File-based authentication exists for the quickstart and for air-gapped setups. It gives you one local user whose password hash sits in a config file. That user has no multi-factor authentication, no central revocation, and no audit trail beyond your own logs.

Switch both services to your identity provider. They must agree, because the backend for frontend (BFF) runs the login flow and the Platform API validates the resulting token.

=== "Virtual machine"
    ```toml
    # configs/config.toml
    [platform_api.auth]
    mode = "idp"

    [platform_api.auth.idp]
    name     = "asgardeo"
    jwks_url = "https://idp.example.com/oauth2/jwks"
    issuer   = ["https://idp.example.com/oauth2/token"]
    audience = ["<ai-workspace-client-id>"]

    [ai_workspace.auth]
    mode = "oidc"

    [ai_workspace.auth.oidc]
    authority = "https://idp.example.com/oauth2/token"
    client_id = "<ai-workspace-client-id>"
    ```

    Then remove the file-mode admin user. Delete the `[[platform_api.auth.file.users]]` block, and delete `APIP_CP_ADMIN_USERNAME` and `APIP_CP_ADMIN_PASSWORD_HASH` from `api-platform.env`.

=== "Kubernetes"
    ```yaml
    platform-api:
      config:
        auth:
          mode: idp
          idp:
            name: asgardeo
            jwksUrl: https://idp.example.com/oauth2/jwks
            issuer:
              - https://idp.example.com/oauth2/token
            audience:
              - <ai-workspace-client-id>

    ai-workspace-ui:
      config:
        auth:
          mode: oidc
          oidc:
            authority: https://idp.example.com/oauth2/token
            clientId: <ai-workspace-client-id>
    ```

    In `idp` mode the chart renders no file-mode section, so the admin credential in the Secret goes unread. Remove `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` from the Secret once the switch is confirmed.

Set `audience` to the client ID so a token minted for a different application in the same tenant is rejected. Leaving it empty skips that check.

Register AI Workspace as a **confidential** client, not a single-page application. The BFF exchanges the authorization code on the back channel with a client secret, and a public-client registration is refused at the token endpoint. For the full walkthrough, including claim mappings and scope registration, see [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md).

## Step 2: Keep authorization enforced and matched

Authorization is on by default and stays on. Turning it off means every validated token can call every endpoint.

Both services carry an authorization mode, and the two must be the same value:

- **`scope`**, the default, reads the token's scope claim. Use it when your provider can mint the platform's `ap:*` scopes.
- **`role`** reads the roles claim and expands each role through a shared mapping file. Use it when your provider can't register those scopes.

A mismatch produces no error at startup. The Platform API enforces the authorization decision, and the workspace only decides which actions to offer. If the two modes differ, the interface either hides actions the Platform API allows, or offers actions that return `403`.

=== "Virtual machine"
    ```toml
    # configs/config.toml
    [platform_api.auth.authorization]
    enabled               = true
    mode                  = "role"
    role_to_scope_mapping = "/etc/platform-api/role-to-scope-mapping.yaml"

    [ai_workspace.auth.authorization]
    mode                  = "role"
    role_to_scope_mapping = "/etc/ai-workspace/role-to-scope-mapping.yaml"
    ```

    The two paths differ because each container mounts the mapping file at its own location. Point both at the same host file, so the two services always agree on what a role grants. The shipped `docker-compose.yaml` already mounts one file into both.

=== "Kubernetes"
    ```yaml
    platform-api:
      config:
        auth:
          authorization:
            enabled: true
            mode: role
            roleToScopeMapping: /etc/platform-api/role-to-scope-mapping.yaml
            roles:
              - name: ap_admin
                scopes:
                  - ap:organization:manage
                  - ap:gateway:manage
                  - ap:llm_provider:manage
                  - ap:llm_proxy:manage
                  - ap:mcp_proxy:manage
                  - ap:secret:manage

    ai-workspace-ui:
      config:
        auth:
          authorization:
            enabled: true
            mode: role
            roleToScopeMapping: /etc/ai-workspace/role-to-scope-mapping.yaml
            roles:
              - name: ap_admin
                scopes:
                  - ap:organization:manage
                  - ap:gateway:manage
                  - ap:llm_provider:manage
                  - ap:llm_proxy:manage
                  - ap:mcp_proxy:manage
                  - ap:secret:manage
    ```

    Configure both services with the same `mode` and the same role-to-scope mapping. The mount paths differ because each chart mounts the file at its own location.

    The chart renders the `roles` list into a ConfigMap and mounts it at the path above. A scope the Platform API doesn't declare fails startup, so a typo surfaces at install.

Grant roles by job, not by convenience. Give administrators the manage scopes and give everyone else a read-only role, so a compromised account can't redeploy a provider or read a stored secret.

## Step 3: Bound what a client can consume

The defaults protect against a slow or idle peer holding a connection open. Review them rather than removing them.

=== "Virtual machine"
    ```toml
    # configs/config.toml
    [platform_api.server.timeouts]
    read_header = "10s"
    read        = "60s"
    write       = "120s"
    idle        = "120s"

    [platform_api.server.websocket]
    max_connections    = 1000
    connection_timeout = 30
    rate_limit_per_min = 1000
    ```

=== "Kubernetes"
    ```yaml
    platform-api:
      config:
        server:
          timeouts:
            readHeader: 10s
            read: 60s
            write: 120s
            idle: 120s
          websocket:
            maxConnections: 1000
            connectionTimeout: 30
            rateLimitPerMin: 1000
    ```

Keep `write` generous. It bounds handler execution, and some handlers wait on a slow upstream such as an LLM completion. Setting `read` or `read_header` to `0` removes the protection against a client that opens a connection and sends nothing. Set either to `0` only behind a proxy that enforces its own bounds.

Size `max_connections` against your gateway count. Each connected gateway holds a long-lived WebSocket connection, and the limit is global.

## Step 4: Restrict the container

Both images already run as an unprivileged user, UID `10001`. Make that explicit, and remove the privileges neither service needs.

=== "Virtual machine"
    ```yaml
    services:
      platform-api:
        user: "10001:10001"
        read_only: false          # the service writes under /app/data
        tmpfs:
          - /tmp
        cap_drop:
          - ALL
        security_opt:
          - no-new-privileges:true

      ai-workspace:
        user: "10001:10001"
        read_only: true           # the BFF holds no on-disk state
        tmpfs:
          - /tmp
        cap_drop:
          - ALL
        security_opt:
          - no-new-privileges:true
    ```

    Mount every configuration file, certificate, and secret with `:ro`, as the shipped Compose file does. Keep the host account that runs the container runtime separate from the accounts your team logs in with.

=== "Kubernetes"
    ```yaml
    platform-api:
      deployment:
        podSecurityContext:
          runAsNonRoot: true
          runAsUser: 10001
          fsGroup: 10001
          seccompProfile:
            type: RuntimeDefault
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
              - ALL

    ai-workspace-ui:
      deployment:
        podSecurityContext:
          runAsNonRoot: true
          runAsUser: 10001
          seccompProfile:
            type: RuntimeDefault
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
              - ALL
    ```

    Test `readOnlyRootFilesystem` on the Platform API in a staging namespace before you enable it there. That service writes under its data volume, and a read-only root filesystem needs every writable path to be a mounted volume.

    Turn off service account token automounting where nothing calls the Kubernetes API:

    ```yaml
    global:
      serviceAccount:
        automountServiceAccountToken: false
    ```

## Step 5: Restrict what each service can reach

The Platform API accepts connections from exactly two sources: the AI Workspace BFF, and your AI gateways. Nothing else needs to reach it.

=== "Virtual machine"
    - Bind the workspace listener to the interface your reverse proxy uses, and publish only the proxy's port at the host firewall.
    - Allow inbound traffic to the Platform API port only from the workspace hosts and your gateway source ranges.
    - Allow outbound traffic only where it's needed: the database, the identity provider's JWKS and token endpoints, and your container registry.
    - Put the database on a private network with no route from the internet.

=== "Kubernetes"
    Apply a NetworkPolicy so only the workspace pods and your gateway sources reach the Platform API:

    ```yaml
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: platform-api-ingress
      namespace: <namespace>
    spec:
      podSelector:
        matchLabels:
          app.kubernetes.io/name: platform-api
      policyTypes:
        - Ingress
      ingress:
        - from:
            - podSelector:
                matchLabels:
                  app.kubernetes.io/name: ai-workspace-ui
            # Gateways that arrive through an Ingress. Omit this entry when
            # gateways reach the Service directly. The pod selector narrows the
            # peer to the ingress controller pods rather than every pod in the
            # ingress-nginx namespace.
            - namespaceSelector:
                matchLabels:
                  kubernetes.io/metadata.name: ingress-nginx
              podSelector:
                matchLabels:
                  app.kubernetes.io/name: ingress-nginx
            # In-cluster gateways.
            - namespaceSelector:
                matchLabels:
                  kubernetes.io/metadata.name: <gateway-namespace>
              podSelector:
                matchLabels:
                  app.kubernetes.io/name: gateway
            # Gateways outside the cluster.
            - ipBlock:
                cidr: <gateway-source-cidr>
          ports:
            - protocol: TCP
              port: 9243
    ```

    Include every source your gateways connect from. Omit the `ipBlock` entry when all gateways run in the cluster. Omit the gateway namespace and pod selectors when none of them run in the cluster. A policy that leaves a gateway source out disconnects that gateway from the control plane.

    Confirm the pod labels in your release before you apply it, because a NetworkPolicy that selects nothing silently allows everything:

    ```bash
    kubectl -n <namespace> get pods --show-labels
    ```

## Step 6: Reduce what you run

- **Leave unused components off.** The distribution ships an API Portal service. On a VM it starts only when its Compose profile is enabled; in the chart it isn't a dependency of this package. Leave it off unless you use it.
- **Keep the plain-HTTP listeners off** unless a proxy in front of the service terminates TLS. They're off by default.
- **Pin image tags to a version, not a moving tag.** A pinned tag makes a rollback deterministic.
- **Pull from a registry you control** where policy requires it, and attach the pull secret rather than making the images public.

=== "Virtual machine"
    ```yaml
    services:
      platform-api:
        image: ghcr.io/wso2/api-platform/platform-api:<version>
      ai-workspace:
        image: ghcr.io/wso2/api-platform/ai-workspace:<version>
    ```

=== "Kubernetes"
    ```yaml
    platform-api:
      image:
        repository: ghcr.io/wso2/api-platform/platform-api
        tag: "<version>"
        pullPolicy: IfNotPresent

    ai-workspace-ui:
      image:
        repository: ghcr.io/wso2/api-platform/ai-workspace
        tag: "<version>"
        pullPolicy: IfNotPresent
    ```

    With a WSO2 subscription, set the pull secret once. The chart attaches it to every pod and rewrites the default image repositories to the subscription registry:

    ```yaml
    global:
      wso2:
        subscription:
          imagePullSecret: wso2-subscription-creds
    ```

## Step 7: Bound the session

The browser holds no access token, only an HttpOnly session cookie, and the BFF renews tokens server-side. Two settings bound how long that can continue:

- **The refresh token lifetime**, set in your identity provider, is the effective idle bound. A user away longer than that signs in again.
- **`absolute_ttl`**, `8h` by default, caps a session regardless of activity. Even a continuously active user re-authenticates once per window.

Shorten both for a deployment handling sensitive data. Shortening the access token lifetime alone changes only how often the BFF renews in the background.

## Verify

Confirm the hardening took effect rather than assuming it did.

=== "Virtual machine"
    ```bash
    # The container runs as UID 10001, not root.
    docker compose exec platform-api id

    # The plain-HTTP listeners aren't answering.
    curl -sS http://localhost:9080/health ; echo
    curl -sS http://localhost:9680/healthz ; echo
    ```

    Then sign in as a user with a read-only role and confirm the management actions are unavailable.

=== "Kubernetes"
    ```bash
    kubectl -n <namespace> get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.securityContext.runAsUser}{"\n"}{end}'
    kubectl -n <namespace> get networkpolicy
    ```

    Then sign in as a user with a read-only role and confirm the management actions are unavailable.

## Related

- [Connect an identity provider to AI Workspace](../setting-up/authentication/connect-an-identity-provider.md): the full OIDC setup this page switches on
- [Authentication in AI Workspace](../setting-up/authentication/overview.md): how the two authentication modes differ
- [Provision secrets and keys](secrets-and-keys.md): the credentials behind these settings
- [Deploy AI Workspace to production](deploy.md): where this page fits in the full deployment sequence