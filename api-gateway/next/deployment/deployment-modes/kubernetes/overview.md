---
title: "API Platform Kubernetes Gateway (V2.0.0)"
description: "Overview of API Platform Kubernetes Gateway V2.0.0 deployment modes: standalone, operator-managed, and Kubernetes Gateway API workflows."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/deployment/deployment-modes/kubernetes/overview/
md_url: https://wso2.com/api-platform/docs/api-gateway/deployment/deployment-modes/kubernetes/overview.md
tags:
  - api-gateway
  - kubernetes
  - deployment
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-19
content_type: "overview"
---

# API Platform Kubernetes Gateway (V2.0.0)

API Platform Gateway is the latest evolution of the WSO2 Kubernetes gateway experience.  
If you are coming from WSO2 Kubernetes gateway `1.3.0`, treat this as the successor track with a broader API Platform integration model and improved Kubernetes-native workflows.

- Previous generation (reference): [WSO2 APK 1.3.0 docs](https://apk.docs.wso2.com/en/latest/)
- Current generation: API Platform Kubernetes Gateway V2.0.0 (this documentation set)

## What Is New in V2.0.0

- Unified API Platform gateway model for both standalone and operator-driven deployments.
- Native support for Kubernetes Operator workflows and GitOps-style resource management.
- Flexible API exposure model:
    - API Platform CRDs (`APIGateway`, `RestApi`, and related CRDs)
    - Kubernetes Gateway API (`GatewayClass`, `Gateway`, `HTTPRoute`, optional `APIPolicy`)
- Improved extensibility for policies and secret/config-based parameter references.

## Benefits of API Platform Kubernetes Gateway V2.0.0

### Unified API Platform Model

- Single gateway model covering both standalone and operator-driven deployments, removing the fragmentation from the APK 1.3.0 era.

### Kubernetes-Native Workflows

- Native Kubernetes Operator support with declarative CRDs (`APIGateway`, `RestApi`, `Gateway`, `HTTPRoute`).

### Flexible API Exposure Model

- Supports both WSO2-native CRDs and the standard Kubernetes Gateway API, avoiding vendor lock-in.

### Extensible Policy Engine

- Policies can be attached to APIs in either deployment mode.
- Supports authentication, rate limiting, header manipulation, and custom request/response mediation.
- Dual-language policy development: Go for performance-critical logic, Python for AI/ML and data transformations.

### High Availability and Production-Ready

- Controller uses an external database (PostgreSQL or SQL Server) for persistent, shared API configuration storage.
- Runtime uses Redis for distributed rate limiting across replicas.

### Built-In Observability

- Metrics (Prometheus/Grafana), distributed tracing (Jaeger), logging, and Moesif analytics integration.

### Improved Extensibility via Custom Policies and Secrets

- Custom gateway images built with the `ap` CLI.
- Secrets and config-based parameter references for improved security posture.

## Deployment Modes

Choose one of the following modes based on your operational model.

### 1) Kubernetes Standalone Mode

Use this mode when you only need the gateway runtime and manage it directly via the gateway Helm chart.

- Installs gateway components without the gateway operator.
- Best for simpler setups or environments where operator lifecycle management is not required.
- Guide: [`kubernetes-standalone.md`](./kubernetes-standalone.md)

### 2) Kubernetes Operator Mode

Use this mode when you want operator-managed lifecycle, declarative resources, and automation.

- Installs the Gateway Operator via Helm.
- Supports:
    - API Platform CRD path (`APIGateway` + `RestApi`)
    - Kubernetes Gateway API path (`Gateway` + `HTTPRoute`)
- Guide: [`gateway-operator.md`](./gateway-operator.md)

## How to Choose a Mode

- Choose **Standalone Mode** if your priority is a lightweight gateway runtime install with Helm-managed values.
- Choose **Operator Mode** if your priority is Kubernetes-native reconciliation, GitOps workflows, multi-resource lifecycle automation, and CRD-based API management.

## Policy Configuration

API Platform Kubernetes Gateway V2.0.0 supports attaching policies to APIs deployed in either mode. Policies control request/response mediation, rate limiting, authentication, and other gateway behaviors.

For a full reference on available policies and how to configure them, see [Policy Configuration Overview](https://wso2.com/api-platform/docs/api-gateway/policies/overview/).

## Next Steps

Learn more about the deployment modes:

- [Standalone mode](./kubernetes-standalone.md)
- [Kubernetes Operator mode](./gateway-operator.md)