---
title: "Store Custom Synapse Artifacts"
description: "Configure API Manager to keep custom runtime Synapse artifacts, such as APIs, endpoints, and sequences, in the Gateway file system."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-gateway/custom-synapse-artifacts/
md_url: https://wso2.com/api-platform/docs/api-manager/4.7.0/api-gateway/custom-synapse-artifacts.md
tags:
  - api-manager
  - api-gateway
  - mediation
  - deployment-toml
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Storing Custom Synapse Artifacts

WSO2 API Manager contains two types of artifacts; these are runtime artifacts and design-time artifacts. The API Synapse artifacts that act as the API definitions for the Gateway nodes fall into the runtime artifacts category. Without Synapse artifacts, the Classic Gateway will not be able to serve the specific API requests during the runtime.

To keep custom runtime artifacts deployed in the file system of the Gateway, add the following configuration in the `<API-M_HOME>/repository/conf/deployment.toml` file of the Gateway nodes.

```toml

[apim.sync_runtime_artifacts.gateway.skip_list]
apis = ["api1.xml","api2.xml"]
endpoints = ["endpoint1.xml"]
sequences = ["post_with_nobody.xml"]
local_entries = ["file.xml"]

```