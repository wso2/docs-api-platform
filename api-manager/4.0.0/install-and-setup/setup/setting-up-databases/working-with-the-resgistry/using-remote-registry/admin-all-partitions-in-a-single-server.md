---
title: "All partitions in a single server"
description: "Learn about the local registry strategy where all registry partitions reside in a single server instance."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/setup/setting-up-databases/working-with-the-resgistry/using-remote-registry/admin-all-partitions-in-a-single-server/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/install-and-setup/setup/setting-up-databases/working-with-the-resgistry/using-remote-registry/admin-all-partitions-in-a-single-server.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - setting-up-databases
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# All Partitions in a Single Server

#### Strategy 1: Local Registry

![](../../../../../assets/attachments/21037149/21331970.png)
Figure 1: All registry partitions in a single server instance.

The entire registry space is local to a single server instance and not shared. This is recommended for a stand-alone deployment of a single product instance, but can also be used if there are two or more instances of a product that do not require sharing data or configuration among them.

This strategy requires no additional configuration.