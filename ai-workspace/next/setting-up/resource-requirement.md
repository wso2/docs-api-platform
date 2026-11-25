---
title: "Minimum resource requirements"
description: "Baseline CPU and memory requirements for AI Workspace setup and production planning."
canonical_url: https://wso2.com/api-platform/docs/ai-workspace/next/setting-up/resource-requirement/
md_url: https://wso2.com/api-platform/docs/ai-workspace/next/setting-up/resource-requirement.md
tags:
  - ai-workspace
  - setup
  - resources
author: WSO2 API Platform Documentation Team
last_updated: 2026-10-03
content_type: "reference"
---

# Minimum resource requirements

Use these values as the minimum baseline when you plan AI Workspace capacity.

## Minimum baseline for Kubernetes

The high-availability guide provides these baseline requests and limits.

| Component | CPU request | Memory request | CPU limit | Memory limit |
|---|---:|---:|---:|---:|
| Platform API | `250m` | `256Mi` | `500m` | `512Mi` |
| AI Workspace UI | `100m` | `128Mi` | `500m` | `256Mi` |

For high availability, keep two or more replicas of both components.

## Related

- [Run in high availability](../production/high-availability.md)
- [Get started with AI Workspace](../getting-started.md)