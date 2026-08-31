---
title: "Setup and deployment"
description: "Install the AI Gateway, configure it, secure its management API, and deploy it at scale on Kubernetes, with sizing guidance from published benchmarks."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment/
md_url: https://wso2.com/api-platform/docs/ai-gateway/setup-and-deployment.md
tags:
  - ai-gateway
  - deployment
  - configuration
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-17
content_type: "concept"
---

# Setup and deployment

This section covers running the AI Gateway, from a first install through to a replicated production deployment. It is written for the administrators and platform engineers who operate the gateway rather than for the developers who publish proxies through it.

Most readers follow the same four stages: install the gateway, configure it, secure its management API, then deploy it at scale. Each stage below lists the pages that cover it.

## Install the gateway

Choose the environment you want to run in. For a first install on your own machine, the [quick start guide](../quick-start-guide.md) walks through Docker Compose end to end.

| Page | What it covers |
|------|----------------|
| [Install the gateway](install-the-gateway.md) | Choose where to run the AI Gateway — local machine, virtual machine, Docker, or Kubernetes — and see what each context adds to the base installation. |
| [Kubernetes deployment modes](kubernetes/index.md) | Choose between standalone and operator-managed Kubernetes deployment modes for API Platform AI Gateway. |
| [Kubernetes standalone mode](kubernetes/kubernetes-standalone.md) | Install and manage API Platform AI Gateway on Kubernetes using the standalone Helm chart without the Gateway Operator. |
| [Kubernetes operator mode](kubernetes/gateway-operator.md) | Deploy API Platform AI Gateway on Kubernetes using the Gateway Operator with platform CRDs or the Kubernetes Gateway API. |
| [Immutable gateway](immutable-gateway.md) | Run API Platform AI Gateway in immutable mode, loading LLM and MCP configurations from files at startup for GitOps workflows. |

## Configure the gateway

Set the gateway's own configuration and give it a database to persist against.

| Page | What it covers |
|------|----------------|
| [Gateway configuration and environment interpolation](configuration.md) | How the API Platform Gateway loads its `config.toml`, injects environment values through interpolation tokens, and bootstraps required keys and certificates. |
| [Set up the database](database-setup.md) | Create the database and apply the Gateway Controller schema for PostgreSQL or SQL Server before starting the API Platform AI Gateway. |

## Secure the gateway

With both Basic Auth and identity provider validation disabled, the controller accepts every request, so enable one before the gateway handles real traffic.

| Page | What it covers |
|------|----------------|
| [Secure the management API](secure-the-management-api.md) | Configure Basic Auth or JWT/IDP authentication and role-based authorization for the AI Gateway Controller REST API. |

Client credentials on proxies and providers are a separate surface, covered in [Authenticate clients](../authenticate-clients.md).

## Deploy at scale

These pages plan a high-availability deployment and size it against published benchmarks.

| Page | What it covers |
|------|----------------|
| [Production deployment overview](production-deployment/index.md) | Plan a high-availability production deployment of API Platform AI Gateway on Kubernetes with Helm, an external database, and replicated workloads. |
| [Security hardening](production-deployment/security-hardening.md) | Harden API Platform AI Gateway before production: AES-256 at-rest encryption keys, TLS for the listener and upstreams, and management API authentication. |
| [Database configuration](production-deployment/database-configuration.md) | Point AI Gateway controller replicas at a shared PostgreSQL or SQL Server database, inject the password from a Secret, and tune the connection pool. |
| [Resources and scaling](production-deployment/resources-and-scaling.md) | Size CPU and memory for the AI Gateway controller and runtime, spread replicas with anti-affinity, and configure autoscaling and pod disruption budgets. |
| [Tune the gateway for AI traffic](production-deployment/ai-workload-tuning.md) | Tune API Platform AI Gateway for LLM and MCP traffic: streaming timeouts, body buffers, guardrail limits, cost pricing data, and semantic cache backing. |
| [Deploy and verify](production-deployment/deploy-and-verify.md) | Install the API Platform AI Gateway Helm chart, confirm the controller and runtime are healthy, route a live LLM request, and run upgrades and rollbacks. |
| [Connect to AI Workspace](production-deployment/control-plane-connection.md) | Register a production AI Gateway with AI Workspace: the registration token as a Kubernetes Secret, the control plane address, TLS trust, and sync behavior. |
| [AI Gateway performance](sizing-and-performance/index.md) | Review WSO2 API Platform AI Gateway performance test methodology, deployment architecture, metrics, and benchmark results for two-CPU and four-CPU gateway runtimes. |
| [AI Gateway runtime with two CPUs](sizing-and-performance/ai-gateway-runtime-with-two-cpus.md) | View API Platform AI Gateway performance benchmark results with a two-CPU gateway runtime, including throughput, average response time, and percentiles. |
| [AI Gateway runtime with four CPUs](sizing-and-performance/ai-gateway-runtime-with-four-cpus.md) | View API Platform AI Gateway performance benchmark results with a four-CPU gateway runtime, including throughput, average response time, and percentiles. |
