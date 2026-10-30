---
title: "Projects in API Platform"
description: "Understand projects in API Platform: structure, components, and how components are deployed within a project's namespace."
canonical_url: https://wso2.com/api-platform/docs/cloud/bijira-concepts/project/
md_url: https://wso2.com/api-platform/docs/cloud/bijira-concepts/project.md
tags:
  - cloud
  - concepts
  - project
author: WSO2 API Platform Documentation Team
last_updated: 2026-06-23
content_type: "concept"
---

# Projects in API Platform

Projects are a core organizational unit in API Platform, designed to group related components and resources that together represent a cloud-native application or solution. This document provides a comprehensive overview of projects in API Platform, including their structure and the deployment.

---

## What is a Project?

A **project** in API Platform is a logical grouping of API Proxies that typically work together to deliver a business capability. Projects help organize development, deployment, and management workflows for cloud-native applications. Each project is isolated from others, ensuring clear boundaries for resources, permissions, and deployments.

---

## Project Structure and Components

A project may include:

- **API Proxies**: Managed APIs that expose services securely.
- **MCP Servers**: Managed MCP servers to be consumed by AI agents.

All components within a project can be managed together, versioned, and deployed as a unit.

---

## Deployment Model

At deployment time, all components in a project are deployed into a single namespace within a Kubernetes cluster. This provides:

- **Resource isolation**: Each project runs in its own namespace, preventing interference between projects.
- **Flexible exposure**: Components can be exposed to the public internet, internally to the organization, or privately within the project only.
- **Unified management**: API Platform provides tools to manage deployments, scaling, and monitoring for all project components.

A project in API Platform is represented as a **cell** in the [Cell-based architecture](https://github.com/wso2/reference-architecture/blob/master/reference-architecture-cell-based.md), which enables modular, scalable, and secure application design.

![Cell-based project boundary showing components exposed to internet, organization, and project namespace](../../assets/img/bijira-concepts/project.png){.cInlineImage-full}