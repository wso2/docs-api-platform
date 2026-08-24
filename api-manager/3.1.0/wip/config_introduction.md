---
title: "Configuration catalog"
description: "Reference the configuration parameters used in an all-in-one WSO2 API Manager deployment.toml file."
canonical_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/wip/config_introduction/
md_url: https://wso2.com/api-platform/docs/api-manager/3.1.0/wip/config_introduction.md
tags:
  - api-manager
  - wip
  - config_introduction
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-27
content_type: "reference"
---

# Configuration Catalog
This document describes all the configuration parameters that are used in WSO2 API Manager in a all-in-one deployment. 

## Instructions for use

> Select the configuration sections, parameters, and values that are required for your use and add them to the deployment.toml file. See the example .toml file given below.

```toml
# This is an example .toml file.

[server]
pattern="value"                         
enable_port_forward=true

[key_mgr_node]
endpoints="value"

[gateway]
gateway_environments=["dev","test"]

[[database]]
pool_options.maxActiv=5

```