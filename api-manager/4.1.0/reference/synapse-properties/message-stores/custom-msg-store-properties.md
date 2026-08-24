---
title: "Custom message store"
description: "Lists the configuration properties for creating a custom message store with a user-defined implementation class."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/synapse-properties/message-stores/custom-msg-store-properties/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/synapse-properties/message-stores/custom-msg-store-properties.md
tags:
  - api-manager
  - reference
  - synapse-properties
  - message-stores
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Custom Message Store
## Introduction
Users can create a message store with their own message store implementation. Custom message stores are configured by giving the fully qualified class name of the message store implementation as the class value. Any configuration parameter that is needed by the message store implementation class can be passed.

## Properties

The following properties can be configured when [creating a Custom Message Store](../../../integrate/develop/creating-artifacts/creating-a-message-store.md).

<table>
  <tr>
    <th>Property</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>A unique name for the message store.</td>
  </tr>
  <tr>
    <td>Provider Class</td>
    <td>
      Fully qualified name of the message store implementation class.
    </td>
  </tr>
</table>