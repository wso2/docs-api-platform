---
title: "Drop mediator"
description: "Reference for the Drop mediator syntax used to stop processing of the current message in a sequence."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/mediators/drop-mediator/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/reference/mediators/drop-mediator.md
tags:
  - api-manager
  - reference
  - mediators
  - drop-mediator
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "reference"
---

# Drop Mediator

The **Drop Mediator** stops the processing of the current message. This mediator is useful for ensuring that the message is sent only once and
then dropped by the Micro Integrator. If you have any mediators defined after the `<drop/>` element, they will not be executed, because `<drop/>` is considered to be the end of the message flow.

When the Drop mediator is within the `         In        ` sequence, it sends an HTTP 202 Accepted response to the client when it stops the message flow. When the Drop mediator is within the `         Out        ` sequence before the Send mediator, no response is sent to the client.

!!! Info
    The Drop mediator is a [content-unaware](about-mediators.md#classification-of-mediators) mediator.

## Syntax

The drop token refers to a `<drop/>` element, which is used to stop further processing of a message:

``` java
<drop/>
```

## Configuration

As with other mediators, after adding the drop mediator to a sequence, you can click its up and down arrows to move its location in the sequence.

## Example

You can use the drop mediator for messages that do not meet the filter criteria in case the client is waiting for a response to ensure the message was received by the Micro Integrator. For example:

```
<proxy name="SimpleProxy" transports="http https" startonload="true" trace="disable" xmlns="http://ws.apache.org/ns/synapse">
    <target>
         <inSequence>
     <!-- filtering of messages with XPath and regex matches -->
       <filter source="get-property('To')" regex=".*/StockQuote.*">
          <then>
             <send>
                <endpoint>
                   <address uri="http://localhost:9000/services/SimpleStockQuoteService"/>
               </endpoint>
             </send>
          </then>
          <else>
             <drop/>
          </else>
     </filter>
...
```

In this scenario, if the message doesn't meet the filter condition, it is dropped, and the HTTP 202 Accepted response is sent to the client. If
you did not include the drop mediator, the client would not receive any response.