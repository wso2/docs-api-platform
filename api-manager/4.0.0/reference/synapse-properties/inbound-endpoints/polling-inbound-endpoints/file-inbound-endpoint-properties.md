---
title: "File inbound endpoint"
description: "Reference for the File inbound endpoint, which uses the VFS transport to process files from a specified source directory."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/synapse-properties/inbound-endpoints/polling-inbound-endpoints/file-inbound-endpoint-properties/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/reference/synapse-properties/inbound-endpoints/polling-inbound-endpoints/file-inbound-endpoint-properties.md
tags:
  - api-manager
  - reference
  - synapse-properties
  - inbound-endpoints
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# File Inbound Endpoint
## Introduction

The file inbound protocol is an alternative to the VFS transport. It uses the <b>VFS</b> transport to process files in a specified source directory. After processing the files, it moves them to a specified location or deletes them. Note that if files remain in the source directory after processing, they will be processed again. Therefore, if you need to maintain these files or keep track of the files that are processed, specify the option to move them instead of deleting them after processing.

## Parameters

See the list of [VFS parameters](../../transport-parameters/vfs-transport-parameters.md) that can be used with proxy services.