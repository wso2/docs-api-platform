---
title: "Using the RabbitMQ inbound endpoint"
description: "Configure the RabbitMQ inbound endpoint to bridge one-way message delivery from RabbitMQ to an HTTP backend."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/examples/inbound_endpoint_examples/inbound-endpoint-rabbitmq-protocol/
md_url: https://wso2.com/api-platform/docs/api-manager/4.0.0/integrate/examples/inbound_endpoint_examples/inbound-endpoint-rabbitmq-protocol.md
tags:
  - api-manager
  - integrate
  - examples
  - inbound_endpoint_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Using the RabbitMQ Inbound Endpoint
This sample demonstrates how one way message bridging from RabbitMQ to HTTP can be done using the inbound RabbitMQ endpoint.

## Synapse configuration

Following are the integration artifacts that we can used to implement this scenario. See the instructions on how to [build and run](#build-and-run) this example.

```xml tab='Sequence'
<?xml version="1.0" encoding="UTF-8"?>
<sequence name="TestIn" trace="disable" xmlns="http://ws.apache.org/ns/synapse">
    <log level="full"/>
    <drop/>
</sequence>
```

```xml tab='Inbound Endpoint'
<?xml version="1.0" encoding="UTF-8"?>
<inboundEndpoint name="test" onError="fault" protocol="rabbitmq" sequence="TestIn" suspend="false" xmlns="http://ws.apache.org/ns/synapse">
    <parameters>
        <parameter name="sequential">true</parameter>
        <parameter name="coordination">true</parameter>
        <parameter name="rabbitmq.connection.factory">AMQPConnectionFactory</parameter>
        <parameter name="rabbitmq.server.host.name">localhost</parameter>
        <parameter name="rabbitmq.server.port">5672</parameter>
        <parameter name="rabbitmq.server.user.name">guest</parameter>
        <parameter name="rabbitmq.server.password">guest</parameter>
        <parameter name="rabbitmq.queue.name">queue</parameter>
        <parameter name="rabbitmq.exchange.name">exchange</parameter>
    </parameters>
</inboundEndpoint>
```

## Build and run

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio.md).
2. [Create an integration project](../../develop/create-integration-project.md) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. Create a [mediation sequence](../../develop/creating-artifacts/creating-reusable-sequences.md) and [inbound endpoint](../../develop/creating-artifacts/creating-an-inbound-endpoint.md) with configurations given in the above example.
4. [Deploy the artifacts](../../develop/deploy-artifacts.md) in your Micro Integrator.

[Configure the RabbitMQ broker](../../../install-and-setup/setup/mi-setup/brokers/configure-with-rabbitmq.md).

Use the following [Java client](https://mvnrepository.com/artifact/com.rabbitmq/amqp-client) to publish a request to the RabbitMQ broker.

```java
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("localhost");
factory.setUsername("guest");
factory.setPassword("guest");
factory.setPort(5672);
Channel channel = null;
Connection connection = factory.newConnection();
channel = connection.createChannel();
channel.queueDeclare("queue", false, false, false, null);
channel.exchangeDeclare("exchange", "direct", true);
channel.queueBind("queue", "exchange", "route");

// The message to be sent
String message = "<m:placeOrder xmlns:m=\"http://services.samples\">" +
                "<m:order>" +
                "<m:price>100</m:price>" +
                "<m:quantity>20</m:quantity>" +
                "<m:symbol>RMQ</m:symbol>" +
                "</m:order>" +
                "</m:placeOrder>";

// Populate the AMQP message properties
AMQP.BasicProperties.Builder builder = new AMQP.BasicProperties().builder();
builder.contentType("application/xml");

// Publish the message to exchange
channel.basicPublish("exchange", "queue", builder.build(), message.getBytes());
```

You will see the following Message content:

```bash 
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><m:placeOrder xmlns:m="http://services.samples"><m:order><m:price>100</m:price><m:quantity>20</m:quantity><m:symbol>RMQ</m:symbol></m:order></m:placeOrder></soapenv:Body></soapenv:Envelope>
```

The RabbitMQ inbound endpoint gets the messages from the RabbitMQ broker and logs the messages in the Micro Integrator.