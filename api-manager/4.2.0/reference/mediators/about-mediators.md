---
title: "About mediators"
description: "Explains what mediators are and how they process, transform, and route messages within the Micro Integrator."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/reference/mediators/about-mediators/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/reference/mediators/about-mediators.md
tags:
  - api-manager
  - reference
  - mediators
  - about-mediators
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "concept"
---

# About Mediators

Mediators are individual processing units that perform a specific function on messages that pass through the Micro Integrator. The mediator takes the message received by the proxy service or REST API, carries out some predefined actions on it (such as transforming, enriching, filtering), and outputs the modified message. 

For example, the [Clone](clone-mediator) mediator splits a message into several clones, the [Send](../../reference/mediators/send-mediator) mediator sends the messages, and the [Aggregate](aggregate-mediator) mediator collects and merges the responses before sending them back to the client. 

Mediators also include functionality to match incompatible protocols, data formats, and interaction patterns across different resources. [XQuery](xquery-mediator) and [XSLT](xslt-mediator) mediators allow rich transformations on the messages. Content-based routing using XPath filtering is supported in different flavors, allowing users to get the most convenient configuration experience. Built-in capability to handle transactions allow message mediation to be done transactionally inside the Micro Integrator.

Mediators are always defined within a [mediation sequence](../../reference/synapse-properties/sequence-properties).

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
      These mediators always access the message content when mediating messages (e.g., <a href="../../../reference/mediators/enrich-mediator">Enrich</a> mediator).
    </td>
  </tr>
  <tr>
    <td><b>Content-Unaware</b> mediators</td>
    <td>
      These mediators never access the message content when mediating messages (e.g., <a href="../../../reference/mediators/send-mediator">Send</a> mediator).
    </td>
  </tr>
  <tr>
    <td><b>Conditionally Content-Aware</b> mediators</td>
    <td>
      These mediators could be either content-aware or content-unaware depending on their exact instance configuration. For example, a simple <a href="../../../reference/mediators/log-mediator"></a> mediator instance (i.e. configured as <log/>) is content-unaware. However a log mediator configured as <log level=”full”/> would be content-aware since it is expected to log the message payload.
    </td>
  </tr>
</table>

## List of Mediators

WSO2 Micro Integrator includes a comprehensive library of mediators that provide functionality for implementing widely used **Enterprise Integration Patterns** (EIPs). You can also easily write a custom mediator to provide additional functionality using various technologies such as Java, scripting, and Spring.

**Core Mediators**

[Call](call-mediator) | [Send](send-mediator) | [Loopback](loopback-mediator) | [Sequence](sequence-mediator) | [Respond](respond-mediator) | [Drop](drop-mediator) | [Call Template](call-template-mediator) | [Enrich](enrich-mediator) | [Property](property-mediator) | [Property Group](property-group-mediator) | [Log](log-mediator) | 

**Filter Mediators**

[Filter](filter-mediator) | [Validate](validate-mediator) | [Switch](switch-mediator) | 

**Transform Mediators**

[XSLT](xslt-mediator) | [FastXSLT](fastxslt-mediator) | [URLRewrite](urlrewrite-mediator) | [XQuery](xquery-mediator) | [Header](header-mediator) | [Fault](fault-mediator) | [PayloadFactory](payloadfactory-mediator) | [JSONTransform](json-transform-mediator) |

**Advanced Mediators**

[Cache](cache-mediator) | [ForEach](foreach-mediator) | [Clone](clone-mediator) | [Store](store-mediator) | [Iterate](iterate-mediator) | [Aggregate](aggregate-mediator) | [Callout](callout-mediator) | [Transaction](transaction-mediator) | [Throttle](throttle-mediator) | [DBReport](db-report-mediator) | [DBLookup](dblookup-mediator) | [EJB](ejb-mediator) | [Binder](builder-mediator) | [Entitlement](call-mediator) | [OAuth](call-mediator) | [Smooks](smooks-mediator) | [Data Mapper](data-mapper-mediator) | 

**Extension Mediators**

[Class](class-mediator) | [Script](script-mediator) |