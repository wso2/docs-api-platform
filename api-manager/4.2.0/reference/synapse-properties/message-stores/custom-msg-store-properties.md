---
title: "Custom message store"
description: "Reference for the properties used to configure a custom message store using your own message store implementation class."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/reference/synapse-properties/message-stores/custom-msg-store-properties/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/reference/synapse-properties/message-stores/custom-msg-store-properties.md
tags:
  - api-manager
  - reference
  - synapse-properties
  - message-stores
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "reference"
---

# Custom Message Store
## Introduction
Users can create a message store with their own message store implementation. Custom message stores are configured by giving the fully qualified class name of the message store implementation as the class value. Any configuration parameter that is needed by the message store implementation class can be passed.

## Properties

The following properties can be configured when [creating a Custom Message Store](../../../integrate/develop/creating-artifacts/creating-a-message-store).

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