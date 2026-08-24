---
title: "Securing the message forwarding processor"
description: "Apply security policies to a message forwarding processor to secure messages sent to the backend service."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/examples/message_store_processor_examples/securing-message-processor/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/examples/message_store_processor_examples/securing-message-processor.md
tags:
  - api-manager
  - integrate
  - examples
  - message_store_processor_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Securing the Message Forwarding Processor
This example demonstrates a use case where security policies are applied to the [message forwarding processor](using-message-forwarding-processor.md).

## Synapse configuration

Following are the artifact configurations that we can use to implement this scenario. See the instructions on how to [build and run](#build-and-run) this example.

```xml tab='Proxy Service'
<proxy xmlns="http://ws.apache.org/ns/synapse" name="StockQuoteProxy" transports="https http" startOnLoad="true" trace="disable">
          <description />
    <target>
       <inSequence>
          <property name="OUT_ONLY" value="true" />
          <store messageStore="MSG_STORE" />
       </inSequence>
       <outSequence>
          <send />
       </outSequence>
    </target>
 </proxy>
```

```xml tab='Local Registry Entry'
<localEntry xmlns="http://ws.apache.org/ns/synapse" key="sec_policy" src="file:/path/to/policy1.xml" />
```

```xml tab='Endpoint'
<endpoint xmlns="http://ws.apache.org/ns/synapse" name="SecureStockQuoteService">
    <address uri="http://localhost:9000/services/SecureStockQuoteService">
       <enableSec policy="sec_policy" />
    </address>
 </endpoint>
```

```xml tab='Message Store'
<messageStore xmlns="http://ws.apache.org/ns/synapse" name="MSG_STORE" />
```

```xml tab='Message Processor'
<messageProcessor xmlns="http://ws.apache.org/ns/synapse" class="org.apache.synapse.message.processor.impl.forwarder.ScheduledMessageForwardingProcessor" name="SecureForwardingProcessor" targetEndpoint="SecureStockQuoteService" messageStore="MSG_STORE">
          <parameter name="client.retry.interval">1000</parameter>
          <parameter name="interval">1000</parameter>
          <parameter name="is.active">true</parameter>
</messageProcessor>
```

## Build and run

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio.md).
2. [Create an integration project](../../develop/create-integration-project.md) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. Create the [proxy service](../../develop/creating-artifacts/creating-a-proxy-service.md), [registry resource](../../develop/creating-artifacts/creating-registry-resources.md), [local entry](../../develop/creating-artifacts/registry/creating-local-registry-entries.md), [message store](../../develop/creating-artifacts/creating-a-message-store.md), and [message processor](../../develop/creating-artifacts/creating-a-message-processor.md) with the configurations given above.
4. [Deploy the artifacts](../../develop/deploy-artifacts.md) in your Micro Integrator.

The Micro Integrator is configured to enable WS-Security as per the policy specified by
'policy_3.xml' for the outgoing messages to the secured backend. The debug logs on the Micro Integrator
shows the encrypted message flowing to the service and the encrypted
response being received by the Micro Integrator.

The security policy file `policy1.xml` can be downloaded from  [policy1.xml](https://github.com/wso2-docs/WSO2_EI/blob/master/sec-policies/policy1.xml). 
The security policy file URI needs to be updated with the path to the policy1.xml file.