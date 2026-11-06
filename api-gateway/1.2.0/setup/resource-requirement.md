---
title: "Minimum resource requirements"
description: "Baseline CPU and memory requirements for API Platform Gateway setup and production planning."
canonical_url: https://wso2.com/api-platform/docs/api-gateway/1.2.0/setup/resource-requirement/
md_url: https://wso2.com/api-platform/docs/api-gateway/1.2.0/setup/resource-requirement.md
tags:
  - api-gateway
  - setup
  - resources
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-03
content_type: "reference"
---

# Minimum resource requirements

Use these values as the minimum baseline when you plan API Platform Gateway capacity.

## Minimum baseline for Kubernetes

The production deployment guide provides these baseline requests and limits.

| Component | CPU request | Memory request | CPU limit | Memory limit |
|---|---:|---:|---:|---:|
| Gateway Controller | `250m` | `256Mi` | `500m` | `512Mi` |
| Gateway Runtime | `500m` | `512Mi` | `2000m` | `2Gi` |

## Minimum aggregate baseline per replica pair

For high availability, keep two replicas of each component.

## Related

- [Resources and scaling](../deployment/production-deployment/resources-and-scaling.md)
- [High-availability production deployment](../deployment/high-availability-production-deployment.md)