---
title: "Minimum resource requirements"
description: "Baseline CPU and memory requirements for API Portal setup and production planning."
canonical_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/setting-up/resource-requirement/
md_url: https://wso2.com/api-platform/docs/api-portal/1.0.0/setting-up/resource-requirement.md
tags:
  - api-portal
  - setup
  - resources
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-03
content_type: "reference"
---

# Minimum resource requirements

Use these values as the minimum baseline when you plan API Portal capacity.

## Minimum baseline for virtual machine deployment

The production deployment guide recommends these minimum host resources:

- **CPU**: `2 vCPU`
- **Memory**: `2 GiB RAM`

## Minimum baseline for Kubernetes

The deployment guide provides this baseline request and limit for the API Portal UI.

| Component | CPU request | Memory request | Memory limit |
|---|---:|---:|---:|
| API Portal UI | `500m` | `512Mi` | `1Gi` |

## Related

- [Resources and scaling](../deployment/resources-and-scaling.md)
- [Get started with API Portal & MCP Hub](../getting-started.md)