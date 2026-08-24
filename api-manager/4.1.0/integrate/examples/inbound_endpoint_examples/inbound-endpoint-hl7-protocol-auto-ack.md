---
title: "Using the HL7 inbound endpoint (with auto ack)"
description: "Configure an HL7 inbound endpoint with automatic acknowledgement using the MLLP protocol over event-driven I/O."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/examples/inbound_endpoint_examples/inbound-endpoint-hl7-protocol-auto-ack/
md_url: https://wso2.com/api-platform/docs/api-manager/4.1.0/integrate/examples/inbound_endpoint_examples/inbound-endpoint-hl7-protocol-auto-ack.md
tags:
  - api-manager
  - integrate
  - examples
  - inbound_endpoint_examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-07-30
content_type: "how-to"
---

# Using the HL7 Inbound Endpoint (with Auto Ack)
The HL7 inbound endpoint implementation is fully asynchronous and is based on the Minimal Lower Layer Protocol(MLLP) implemented on top of event driven I/O.

## Synapse configuration

Following are the integration artifacts that we can used to implement this scenario. See the instructions on how to [build and run](#build-and-run) this example.

```xml tab='Inbound Endpoint'
<?xml version="1.0" encoding="UTF-8"?>
<inboundEndpoint name="Sample1" onError="fault" protocol="hl7" sequence="main" suspend="false" xmlns="http://ws.apache.org/ns/synapse">
    <parameters>
        <parameter name="inbound.hl7.Port">20000</parameter>
        <parameter name="inbound.hl7.AutoAck">true</parameter>
        <parameter name="inbound.hl7.TimeOut">3000</parameter>
        <parameter name="inbound.hl7.CharSet">UTF-8</parameter>
        <parameter name="inbound.hl7.ValidateMessage">false</parameter>
        <parameter name="inbound.hl7.BuildInvalidMessages">true</parameter>
        <parameter name="inbound.hl7.PassThroughInvalidMessages">true</parameter>
    </parameters>
</inboundEndpoint>
```

```xml tab='Main Sequence'
<?xml version="1.0" encoding="UTF-8"?>
<sequence name="main" trace="disable" xmlns="http://ws.apache.org/ns/synapse">
    <in>
        <log level="full"/>
        <drop/>
    </in>
    <out>
        <send/>
    </out>
</sequence>
```

```xml tab='Fault Sequence'
<?xml version="1.0" encoding="UTF-8"?>
<sequence name="fault" trace="disable" xmlns="http://ws.apache.org/ns/synapse">
    <drop/>
</sequence>
```

## Build and run

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio.md).
2. [Create an integration project](../../develop/create-integration-project.md) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. [Create two sequences](../../develop/creating-artifacts/creating-reusable-sequences.md) (Main and Fault) and an [inbound endpoint](../../develop/creating-artifacts/creating-an-inbound-endpoint.md) with the configurations given above.
4. [Deploy the artifacts](../../develop/deploy-artifacts.md) in your Micro Integrator.

To execute the sample, use the **HAPI HL7 TestPanel**:

-   Connect to the port defined in the inbound endpoint (i.e., 20000,
    which is the value of `           inbound.hl7.Port)          ` using
    the HAPI HL7 TestPanel.
-   Generate and send an HL7 message using the messages dialog frame.

You will see that the Micro Integrator receives the HL7 message and logs a
serialization of this message in a SOAP envelope. You will also see that
the HAPI HL7 TestPanel receives an acknowledgement.