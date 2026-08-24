---
title: "Mediating HL7 messages"
description: "Build a proxy service that uses the HL7 transport to exchange HL7 messages with an HL7 server and transform them to and from XML."
canonical_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/hl7-examples/hl7_proxy_service/
md_url: https://wso2.com/api-platform/docs/api-manager/4.2.0/integrate/examples/hl7-examples/hl7_proxy_service.md
tags:
  - api-manager
  - integrate
  - examples
  - hl7-examples
author: WSO2 API Platform Documentation Team
last_updated: 2026-08-20
content_type: "how-to"
---

# Mediating HL7 Messages

You can create a proxy service that uses the HL7 transport to connect to an HL7 server. This proxy service will receive HL7-client connections and send them to the HL7 server. It can also receive XML messages over HTTP/HTTPS and transform them into HL7 before sending them to the server, and it will transform the HL7 responses back into XML.

## Synapse configuration

Given below is an example proxy that receives HL7 messages from a client and relays the message to an HL7 server. See the instructions on how to [build and run](#build-and-run) this example.

```xml
<proxy xmlns="http://ws.apache.org/ns/synapse" name="hl7testproxy" transports="https,http,hl7" statistics="disable" trace="disable" startOnLoad="true">
 <target>
    <inSequence>
       <log level="full" />
    </inSequence>
    <outSequence>
       <log level="full" />
       <send />
    </outSequence>
    <endpoint name="hl7_endpoint">
       <address uri="hl7://localhost:9988" />
    </endpoint>
 </target>
 <parameter name="transport.hl7.Port">9292</parameter>
</proxy>
```

## Build and run

Create the artifacts:

1. [Set up WSO2 Integration Studio](../../develop/installing-wso2-integration-studio).
2. [Create an integration project](../../develop/create-integration-project) with an <b>ESB Configs</b> module and an <b>Composite Exporter</b>.
3. [Create the proxy service](../../develop/creating-artifacts/creating-a-proxy-service) with the configurations given above.
4. [Configure the HL7 transport](../../../install-and-setup/setup/mi-setup/transport_configurations/configuring-transports#configuring-the-hl7-transport) in your Micro Integrator.
5. [Deploy the artifacts](../../develop/deploy-artifacts) in your Micro Integrator.

To test this scenario, you need the following:

- An HL7 client that sends messages to the port specified by the `transport.hl7.Port` parameter.
- An HL7 back-end application that receives messages from the Micro Integrator.

You can simulate the HL7 client and back-end application using a tool such as <b>HAPI</b>.