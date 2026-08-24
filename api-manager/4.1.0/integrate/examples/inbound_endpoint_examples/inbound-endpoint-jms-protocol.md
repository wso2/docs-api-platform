---
title: "Using the JMS inbound endpoint"
description: "Configure a JMS inbound endpoint to bridge one-way messages from a JMS queue to an HTTP backend."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/examples/inbound_endpoint_examples/inbound-endpoint-jms-protocol/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/examples/inbound_endpoint_examples/inbound-endpoint-jms-protocol.md
tags:
  - api-manager
  - integrate
  - examples
  - inbound_endpoint_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Using the JMS Inbound Endpoint
This sample demonstrates how one way message bridging from JMS to HTTP can be done using the inbound JMS endpoint.

## Synapse configuration

Following are the integration artifacts that we can used to implement this scenario. See the instructions on how to [build and run](#build-and-run) this example.

```xml tab='Inbound Endpoint'
 <?xml version="1.0" encoding="UTF-8"?>
 <inboundEndpoint xmlns="http://ws.apache.org/ns/synapse" name="jms_inbound" sequence="request" onError="fault" protocol="jms" suspend="false">
    <parameters>
       <parameter name="interval">1000</parameter>
       <parameter name="transport.jms.Destination">ordersQueue</parameter>
       <parameter name="transport.jms.CacheLevel">1</parameter>
       <parameter name="transport.jms.ConnectionFactoryJNDIName">QueueConnectionFactory</parameter>
       <parameter name="sequential">true</parameter>
       <parameter name="java.naming.factory.initial">org.apache.activemq.jndi.ActiveMQInitialContextFactory</parameter>
       <parameter name="java.naming.provider.url">tcp://localhost:61616</parameter>
       <parameter name="transport.jms.SessionAcknowledgement">AUTO_ACKNOWLEDGE</parameter>
       <parameter name="transport.jms.SessionTransacted">false</parameter>
       <parameter name="transport.jms.ConnectionFactoryType">queue</parameter>
    </parameters>
 </inboundEndpoint>
```

```xml tab='Sequence'
<?xml version="1.0" encoding="UTF-8"?>
<sequence name="request" trace="disable" xmlns="http://ws.apache.org/ns/synapse"/>
  <call>
     <endpoint>
        <address format="soap12" uri="http://localhost:9000/services/SimpleStockQuoteService"/>
     </endpoint>
  </call>
  <drop/>
</sequence>
```

## Build and run

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio.md).
2. [Create an integration project](../../develop/create-integration-project.md) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. Create a [mediation sequence](../../develop/creating-artifacts/creating-reusable-sequences.md) and [inbound endpoint](../../develop/creating-artifacts/creating-an-inbound-endpoint.md) with configurations given in the above example.
4. [Deploy the artifacts](../../develop/deploy-artifacts.md) in your Micro Integrator.

[Configure the ActiveMQ broker](../../../install-and-setup/setup/mi-setup/brokers/configure-with-activemq.md).

Invoke the inbound endpoint:

1. Log on to the ActiveMQ console using the `http://localhost:8161/admin` URL.
2. Browse the queue `ordersQueue` listening via the above endpoint.
3. Add a new message with the following content to the queue:

    ```xml
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing">
        <soapenv:Body>
            <m0:getQuote xmlns:m0="http://services.samples"> 
                <m0:request>
                    <m0:symbol>IBM</m0:symbol>
                </m0:request>
            </m0:getQuote>
        </soapenv:Body>
    </soapenv:Envelope>
    ```

You will see that the JMS endpoint gets the message from the queue and sends it to the stock quote service.