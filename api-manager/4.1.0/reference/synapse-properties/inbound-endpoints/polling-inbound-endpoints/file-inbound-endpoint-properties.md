---
title: "File inbound endpoint"
description: "Lists the VFS-based parameters and configuration options for setting up a file inbound endpoint."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/synapse-properties/inbound-endpoints/polling-inbound-endpoints/file-inbound-endpoint-properties/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/synapse-properties/inbound-endpoints/polling-inbound-endpoints/file-inbound-endpoint-properties.md
tags:
  - api-manager
  - reference
  - synapse-properties
  - inbound-endpoints
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# File Inbound Endpoint
## Introduction

The file inbound protocol is an alternative to the VFS transport. It uses the <b>VFS</b> transport to process files in a specified source directory. After processing the files, it moves them to a specified location or deletes them. Note that if files remain in the source directory after processing, they will be processed again. Therefore, if you need to maintain these files or keep track of the files that are processed, specify the option to move them instead of deleting them after processing.

## Parameters

See the list of [VFS parameters](../../transport-parameters/vfs-transport-parameters.md) that can be used with both inbound endpoints and proxy services.

## Processing Sub Directories

VFS Inbound endpoints are capable of handling files inside sub directories of the specified URL. Please note the
 following configurations that required to achieve the requirement.
 
 -   Configure the input file URL to read sub files within sub directories. Please note `/*` at the end, which is
  mandatory to achieve the requirement.
 
     ```bash 
     <parameter name="transport.vfs.FileURI">///home/user/test/in/*</parameter> 
     ```
     
 -   Configure the output directory with the same pattern if you wish to preserve the directory structure.
 
     ```bash 
     <parameter name="transport.vfs.MoveAfterProcess">///home/user/test/out/*</parameter>
     <parameter name="transport.vfs.MoveAfterFailure">///home/user/test/fail/*</parameter>
     ```
     
  -   Use the following transport property within the sequence whenever you need to access the relative path of the
   files within sub directories.
  
      ```bash 
      <property expression="$trp:RELATIVE_PATH" name="relative_path"/> 
      ```