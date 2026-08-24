---
title: "About mediators"
description: "Learn how mediators process messages in the Micro Integrator and how they are classified by content awareness."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/mediators/about-mediators/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/mediators/about-mediators.md
tags:
  - api-manager
  - reference
  - mediators
  - about-mediators
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-19
content_type: "concept"
---

    # About Mediators

Mediators are individual processing units that perform a specific function on messages that pass through the Micro Integrator. The mediator takes the message received by the proxy service or REST API, carries out some predefined actions on it (such as transforming, enriching, filtering), and outputs the modified message. 

For example, the [Clone](clone-mediator.md) mediator splits a message into several clones, the [Send](send-mediator.md) mediator sends the messages, and the [Aggregate](aggregate-mediator.md) mediator collects and merges the responses before sending them back to the client. 

Mediators also include functionality to match incompatible protocols, data formats, and interaction patterns across different resources. [XQuery](xquery-mediator.md) and [XSLT](xslt-mediator.md) mediators allow rich transformations on the messages. Content-based routing using XPath filtering is supported in different flavors, allowing users to get the most convenient configuration experience. Built-in capability to handle transactions allow message mediation to be done transactionally inside the Micro Integrator.

Mediators are always defined within a [mediation sequence](../synapse-properties/sequence-properties.md).

## Classification of Mediators

Mediators are classified as follows based on whether or not they access the message's content: 

<table>
  <col width="140">
  <tr>
    <th>Classification</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><b>Content-Aware</b> mediators</td>
    <td>
      These mediators always access the message content when mediating messages (e.g., <a href="../enrich-mediator/">Enrich</a> mediator).
    </td>
  </tr>
  <tr>
    <td><b>Content-Unaware</b> mediators</td>
    <td>
      These mediators never access the message content when mediating messages (e.g., <a href="../send-mediator/">Send</a> mediator).
    </td>
  </tr>
  <tr>
    <td><b>Conditionally Content-Aware</b> mediators</td>
    <td>
      These mediators could be either content-aware or content-unaware depending on their exact instance configuration. For example, a simple <a href="../log-mediator/"></a> mediator instance (i.e. configured as <log/>) is content-unaware. However a log mediator configured as <log level=”full”/> would be content-aware since it is expected to log the message payload.
    </td>
  </tr>
</table>

## List of Mediators

WSO2 Micro Integrator includes a comprehensive library of mediators that provide functionality for implementing widely used **Enterprise Integration Patterns** (EIPs). You can also easily write a custom mediator to provide additional functionality using various technologies such as Java, scripting, and Spring.

**Core Mediators**

[Call](call-mediator.md) | [Send](send-mediator.md) | [Loopback](loopback-mediator.md) | [Sequence](sequence-mediator.md) | [Respond](respond-mediator.md) | [Drop](drop-mediator.md) | [Call Template](call-template-mediator.md) | [Enrich](enrich-mediator.md) | [Property](property-mediator.md) | [Property Group](property-group-mediator.md) | [Log](log-mediator.md) | 

**Filter Mediators**

[Filter](filter-mediator.md) | [Validate](validate-mediator.md) | [Switch](switch-mediator.md) | 

**Transform Mediators**

[XSLT](xslt-mediator.md) | [FastXSLT](fastxslt-mediator.md) | [URLRewrite](urlrewrite-mediator.md) | [XQuery](xquery-mediator.md) | [Header](header-mediator.md) | [Fault](fault-mediator.md) | [PayloadFactory](payloadfactory-mediator.md) | [JSONTransform](json-transform-mediator.md) |

**Advanced Mediators**

[Cache](cache-mediator.md) | [ForEach](foreach-mediator.md) | [Clone](clone-mediator.md) | [Store](store-mediator.md) | [Iterate](iterate-mediator.md) | [Aggregate](aggregate-mediator.md) | [Callout](callout-mediator.md) | [Transaction](transaction-mediator.md) | [Throttle](throttle-mediator.md) | [DBReport](db-report-mediator.md) | [DBLookup](dblookup-mediator.md) | [EJB](ejb-mediator.md) | [Binder](builder-mediator.md) | [Entitlement](call-mediator.md) | [OAuth](call-mediator.md) | [Smooks](smooks-mediator.md) | [Data Mapper](data-mapper-mediator.md) | 

**Extension Mediators**

[Class](class-mediator.md) | [Script](script-mediator.md) |