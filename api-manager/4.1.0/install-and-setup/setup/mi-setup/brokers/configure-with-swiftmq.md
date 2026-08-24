---
title: "Connecting to SwiftMQ"
description: "Configure WSO2 Micro Integrator's JMS transport to connect with a SwiftMQ broker using client libraries and connection parameters."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/mi-setup/brokers/configure-with-swiftmq/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/install-and-setup/setup/mi-setup/brokers/configure-with-swiftmq.md
tags:
  - api-manager
  - install-and-setup
  - setup
  - mi-setup
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Connecting to SwiftMQ

This section describes how to configure WSO2 Micro Integrator to connect with SwiftMQ.

1. Download and set up SwiftMQ.
2. Download and install WSO2 Micro Integrator
3. Copy the following client libraries from `SMQ_HOME/lib` directory to `MI_HOME/lib` directory.

    -   jms.jar
    -   jndi.jar
    -   swiftmq.jar

    !!! Info
        Always use the standard client libraries that come with a particular version of SwiftMQ in order to avoid version incompatibility issues. We recommend that you remove old client libraries, if any, from all locations including `MI_HOME/lib `and `MI_HOME/droppins` before copying the libraries relevant to a given version.

4.  If you want the Micro Integrator to receive messages from a SwiftMQ instance, or to send messages to a SwiftMQ instance, you need to update the deployment.toml file with the relevant connection parameters.

    Add the following configurations to enable the JMS sender and listener with SwiftMQ connection parameters.
    ```toml
    [transport.jms]
    sender_enable = true
    
    [[transport.jms.listener]]
    name = "myTopicConnectionFactory"
    parameter.initial_naming_factory = "com.swiftmq.jndi.InitialContextFactoryImpl"
    parameter.provider_url = "smqp://localhost:4001/timeout=10000"
    parameter.connection_factory_name = "TopicConnectionFactory"
    parameter.connection_factory_type = "topic"
    parameter.jms_spec_version = "1.0"
    
    [[transport.jms.listener]]
    name = "myQueueConnectionFactory"
    parameter.initial_naming_factory = "com.swiftmq.jndi.InitialContextFactoryImpl"
    parameter.provider_url = "smqp://localhost:4001/timeout=10000"
    parameter.connection_factory_name = "QueueConnectionFactory"
    parameter.connection_factory_type = "queue"
    parameter.jms_spec_version = "1.0"
    
    [[transport.jms.listener]]
    name = "default"
    parameter.initial_naming_factory = "com.swiftmq.jndi.InitialContextFactoryImpl"
    parameter.provider_url = "smqp://localhost:4001/timeout=10000"
    parameter.connection_factory_name = "QueueConnectionFactory"
    parameter.connection_factory_type = "queue"
    parameter.jms_spec_version = "1.0"
    ```
    !!! Info
        For details on the JMS configuration parameters used in the code segments above, see [JMS connection factory parameters](../../../../reference/config-catalog-mi.md#jms-transport-listener-non-blocking-mode).

You have now configured an instance of SwiftMQ and WSO2 Micro Integrator. Refer [JMS Consumer](../../../../integrate/examples/jms_examples/consuming-jms.md) and [JMS Producer](../../../../integrate/examples/jms_examples/producing-jms.md) section for implementation details of JMS consumer and producer.