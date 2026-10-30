---
title: "Minimum resource requirements"
description: "Baseline CPU and memory requirements for AI Gateway setup and production planning."
canonical_url: https://wso2.com/api-platform/docs/ai-gateway/next/setup-and-deployment/resource-requirement/
md_url: https://wso2.com/api-platform/docs/ai-gateway/next/setup-and-deployment/resource-requirement.md
tags:
  - ai-gateway
  - setup
  - resources
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-03
content_type: "reference"
---

# Minimum resource requirements

Use these values as the minimum baseline when you plan AI Gateway capacity.

## Minimum baseline for Kubernetes

The production deployment guide provides these baseline requests and limits.

| Component | CPU request | Memory request | CPU limit | Memory limit |
|---|---:|---:|---:|---:|
| Gateway Controller | `500m` | `1Gi` | `1000m` | `2Gi` |
| Gateway Runtime | `2000m` | `2Gi` | `4000m` | `2Gi` |


For high availability, keep two replicas of each component.

## Related

- [Resources and scaling](./production-deployment/resources-and-scaling.md)
- [AI Gateway runtime with two CPUs](./sizing-and-performance/ai-gateway-runtime-with-two-cpus.md)