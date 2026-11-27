---
title: "Architecture"
pagination_label: "Self-Hosted Gateway Architecture"
description: "Learn how the Self-Hosted Gateway connects to the API Control Plane through the Gateway Controller and Gateway Runtime components."
---

A self-hosted gateway runs in a private data plane that you manage, and connects to the [API Control Plane](../../api-control-plane/overview.md) in the cloud. This architecture allows organizations to manage APIs centrally while keeping API traffic, runtime execution, and backend connectivity within their own environment.

## API Control Plane

The API Control Plane is hosted in the cloud and provides centralized API management capabilities. It is used to configure, publish, and manage APIs and policies.

The self-hosted gateway opens an outbound WebSocket connection to the API Control Plane over **port 443**. This connection is used to receive API and policy configuration updates from the control plane. Since the connection is initiated from the private data plane, you do not need to expose internal gateway management services to the public internet.

## Private Data Plane

The **Private Data Plane** runs within your infrastructure. It handles API traffic, applies runtime policies, and communicates with backend services. API requests from consumers are processed entirely within this private environment.

![Architecture diagram showing the API Control Plane connected via port 443 WebSocket to Gateway Controller and Gateway Runtime in the private data plane](/img/cloud/self-hosted-gateway/architecture/self-hosted-architecture.png)

The Gateway includes the following components.

### Gateway Controller

The Gateway Controller is responsible for receiving API and policy configurations from the API Control Plane and configuring the gateway runtime accordingly.

It contains the following services.

| Component | Description |
| ----- | ----- |
| Controller REST API | Exposes management APIs used by the control plane and internal gateway components. |
| Controller XDS | Provides runtime configuration to the gateway router using xDS. |
| Database | Stores gateway configuration and runtime metadata required by the controller. |

#### Gateway Controller Ports

The following table lists the controller ports. The **Container port** column is the port inside the container. The **Host port** column is the port that the default Docker Compose file publishes on the host. The **Who connects** column says who should reach the port.

| Container port | Host port | Who connects | Description |
| ----- | ----- | ----- | ----- |
| 9090 | 9090 | Operators, on a private network | Controller management REST API. Basic authentication protects it. |
| 9092 | 9094 | Operators, on a private network | Controller admin API, which includes the health endpoint. |
| 9091 | 9011 | Monitoring tools, on a private network | Controller metrics. Metrics are off by default. |
| 18000 | Not published | The router in the gateway runtime | Controller xDS. The router gets its runtime configuration here. |
| 18001 | Not published | The policy engine in the gateway runtime | Policy xDS. The policy engine gets its policy configuration here. |

### Gateway Runtime

The Gateway Runtime is responsible for handling API traffic. It includes the router and the policy engine.

The router receives incoming API requests over HTTP or HTTPS and routes them to the relevant backend services. During request and response processing, the router communicates with the policy engine to execute configured policies such as authentication, authorization, rate limiting, transformation, analytics, or custom policies.

#### Gateway Runtime Ports

The following table lists the runtime ports, with the same columns as the controller table.

| Container port | Host port | Who connects | Description |
| ----- | ----- | ----- | ----- |
| 8080 | 8080 | API consumers | HTTP ingress for API traffic. |
| 8443 | 8443 | API consumers | HTTPS ingress for API traffic. |
| 8081 | 8081 | API consumers | Listener for APIs that the controller configures through xDS. |
| 9901 | 9901 | Operators, on a private network | Envoy admin. |
| 9002 | 9002 | Operators, on a private network | Policy engine admin. |
| 9003 | 9003 | Monitoring tools, on a private network | Policy engine metrics. |

The default Docker Compose file publishes the ports for operators and monitoring tools on all host interfaces. Block them at the firewall or bind them to the loopback address. See [Production hardening](./setting-up.md#production-hardening). Only the three ports for API consumers need to be reachable from your clients.

## Configuration Flow

When an API or policy is created or updated in the API Control Plane, the configuration is sent to the Gateway Controller through the outbound WebSocket connection.

The Gateway Controller stores the configuration and converts it into runtime configuration required by the Gateway Runtime. The Controller XDS service then configures the router. Once configured, the Gateway Runtime starts serving API traffic according to the policies and routing rules defined in the control plane.

## Runtime Traffic Flow

API consumers send requests to the Gateway Runtime through the exposed HTTP or HTTPS ingress ports.

The router receives the request and identifies the matching API route. It then applies the configured policy chain using the policy engine. After successful policy execution, the request is forwarded to the backend service. Responses from the backend follow the same path back through the gateway, allowing response policies to be applied before the response is returned to the client.

## Key Benefits

This architecture provides centralized API management while keeping runtime execution close to backend services. It helps organizations maintain control over API traffic, reduce exposure of internal systems, and apply consistent policies across APIs managed through the API Control Plane.

To keep serving APIs when a controller or runtime replica is unavailable, run more than one of each. See [High Availability](./high-availability.md).
